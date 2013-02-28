/**
 * requestNextAnimationFrame
 */

if (!window.requestNextAnimationFrame) {
	window.requestNextAnimationFrame = (function() {
		return	window.webkitRequestAnimationFrame	||
				window.mozRequestAnimationFrame		||
				window.oRequestAnimationFrame		||
				window.msRequestAnimationFrame		||
		function(callback, element) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();
}


/**
 * Point Constructor
 */

var Point = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

/**
 * Polygon Constructor
 * @param params
 *
 * params is an object that can contain the properties:
 *  centerX, centerY, radius, sides, startAngle, strokeStyle, fillStyle, filled
 */

var Polygon = function(params) {
	this.x = params.centerX;
	this.y = params.centerY;
	this.radius = params.radius;
	this.sides = params.sides;
	this.startAngle = params.startAngle;
	this.strokeStyle = params.strokeStyle;
	this.fillStyle = params.fillStyle;
	this.filled = params.filled;
};

Polygon.prototype = {
	getPoints: function() {
		var points = [],
			angle = this.startAngle || 0;

		for (var i = 0; i < this.sides; ++i) {
			points.push(new Point(
				this.x + this.radius * Math.sin(angle),
				this.y - this.radius * Math.cos(angle),
				0
			));

			angle += 2 * Math.PI / this.sides;
		}

		return points;
	},

	createPath: function(ctx) {
	var points = this.getPoints();

	ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);

		for (var i = 1; i < this.sides; ++i) {
			ctx.lineTo(points[i].x, points[i].y);
		}

		ctx.closePath();
	},

	stroke: function(ctx) {
		ctx.save();
			this.createPath(ctx);

			ctx.strokeStyle = this.strokeStyle;
			ctx.stroke();
		ctx.restore();
	},

	fill: function(ctx) {
		ctx.save();
			this.createPath(ctx);

			ctx.fillStyle = this.fillStyle;
			ctx.fill();
		ctx.restore();
	},

	move: function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
};


/**
 * Painters paint sprites with a paint(sprite, ctx) method
 */

var ImagePainter = function(imageUrl) {
	this.image = new Image;
	this.image.src = imageUrl;
};

ImagePainter.prototype = {
	image: undefined,

	paint: function(sprite, ctx) {
		if (this.image !== undefined) {
			if (!this.image.complete) {
				this.image.onload = function(e) {
					sprite.width = this.width;
					sprite.height = this.height;

					ctx.drawImage(this, // this is image
					sprite.left, sprite.top, sprite.width, sprite.height);
				};
			} else {
				ctx.drawImage(this.image, sprite.left, sprite.top, sprite.width, sprite.height);
			}
		}
	}
};

/**
 * Spritesheet Painter
 */

SpriteSheetPainter = function(cells) {
	this.cells = cells;
};

SpriteSheetPainter.prototype = {
	cells: [],
	cellIndex: 0,

	advance: function() {
		if (this.cellIndex === this.cells.length - 1) {
			this.cellIndex = 0;
		} else {
			this.cellIndex++;
		}
	},

	paint: function(sprite, ctx) {
		var cell = this.cells[this.cellIndex];

		ctx.drawImage(spritesheet, cell.left, cell.top, cell.width, cell.height, sprite.left, sprite.top, cell.width, cell.height);
	}
};


/**
 * Sprite Animators
 *
 * start(sprite, durationInMillis, restoreSprite)
 */

var SpriteAnimator = function(painters, elapsedCallback) {
	this.painters = painters;

	if (elapsedCallback) {
		this.elapsedCallback = elapsedCallback;
	}
};

SpriteAnimator.prototype = {
	painters: [],
	duration: 1000,
	startTime: 0,
	index: 0,
	elapsedCallback: undefined,

	end: function(sprite, originalPainter) {
		sprite.animating = false;

		if (this.elapsedCallback) {
			this.elapsedCallback(sprite);
		} else {
			sprite.painter = originalPainter;
		}
	},

	start: function(sprite, duration) {
		var endTime = +new Date() + duration,
			period = duration / (this.painters.length),
			interval = undefined,
			animator = this,
			// for setInterval() function
			originalPainter = sprite.painter;

		this.index = 0;
		sprite.animating = true;
		sprite.painter = this.painters[this.index];

		interval = setInterval(function() {
			if (+new Date() < endTime) {
				sprite.painter = animator.painters[++animator.index];
			} else {
				animator.end(sprite, originalPainter);
				clearInterval(interval);
			}
		}, period);
	},
};

/**
 * Sprites Constructor
 * @param name
 * @param painter
 * @param behaviors [array]
 *
 * Sprites can be updated, and painted.
 *
 * A sprite's painter paints the sprite: paint(sprite, ctx)
 * A sprite's behavior executes: execute(sprite, ctx, time)
 */

var Sprite = function(name, painter, behaviors) {
	if (name !== undefined) {
		this.name = name;
	}
	if (painter !== undefined) {
		this.painter = painter;
	}
	if (behaviors !== undefined) {
		this.behaviors = behaviors;
	}

	return this;
};

Sprite.prototype = {
	left: 0,
	top: 0,
	width: 10,
	height: 10,
	velocityX: 0,
	velocityY: 0,
	visible: true,
	animating: false,
	painter: undefined,
	// object with paint(sprite, ctx)
	behaviors: [],

	// objects with execute(sprite, ctx, time)
	paint: function(ctx) {
		if (this.painter !== undefined && this.visible) {
			this.painter.paint(this, ctx);
		}
	},

	update: function(ctx, time) {
		for (var i = this.behaviors.length; i > 0; --i) {
			this.behaviors[i - 1].execute(this, ctx, time);
		}
	}
};


/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Game Engine - implements a game loop to draw sprites		*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Includes support for:
 *
 * Time-based motion	- game.pixelsPerFrame()
 * Pause				- game.togglePaused()
 * High scores			- game.[get][clear]HighScores(), game.setHighScore()
 * Sound				- game.canPlaySound(), game.playSound()
 * Accessing frame rate - game.fps
 * Accessing game time	- game.gameTime
 * Key processing		- game.addKeyListener()
 *
 * The game engine's animate() method invokes the following in the order listed:
 *
 * - game.startAnimate()
 * - game.paintUnderSprites()
 * - game.paintOverSprites()
 * - game.endAnimate()
 *
 * By default these methods are to be overridden
 * The game engine implements them to do nothing
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

var getTimeNow = function() {
	return +new Date();
};

var Game = function(gameName, canvas) {
	var canvas = document.getElementById(canvas),
		self = this; // used by key event handlers

	// General

	this.ctx = canvas.getContext('2d');
	this.gameName = gameName;
	this.sprites = [];
	this.keyListeners = [];

	// High scores

	this.SCORES_SUFFIX = '_highscores';

	// Image loading

	this.imageLoadingProgressCallback = null;
	this.images = {};
	this.imageUrls = [];
	this.imagesLoaded = 0;
	this.imagesFailedToLoad = 0;
	this.imagesIndex = 0;

	// Time

	this.startTime = 0;
	this.lastTime = 0;
	this.gameTime = 0;
	this.fps = 0;
	this.START_FPS = 60;

	this.paused = false;
	this.startPauseAt = 0;
	this.PAUSE_TIMEOUT = 100;

	// Sound

	this.soundOn = true;
	this.soundChannels = [];
	this.audio = new Audio();
	this.NUM_CHANNELS = 10;

	for (var i = 0; i < this.NUM_CHANNELS; ++i) {
		var audio = new Audio();
		this.soundChannels.push(audio);
	}

	// Events

	window.onkeypress = function(e) {
		self.keyPressed(e);
	};

	window.onkeydown = function(e) {
		self.keyPressed(e);
	};

	return this;
};

// Game methods

Game.prototype = {
	// Return associated image of a given URL

	getImage: function(imageUrl) {
		return this.images[imageUrl];
	},

	// Callback for when an image load is successful

	imageLoadedCallback: function(e) {
		this.imagesLoaded++;
	},

	// Callback for when an image load is unsuccessful

	imageLoadErrorCallback: function(e) {
		this.imagesFailedToLoad++;
	},

	// Loads image

	loadImage: function(imageUrl) {
		var image = new Image(),
			self = this;

		image.src = imageUrl;

		image.addEventListener('load', function(e) {
			self.imageLoadedCallback(e);
		});

		image.addEventListener('error', function(e) {
			self.imageLoadErrorCallback(e);
		});

		this.images[imageUrl] = image;
	},

	// Repeatedly called to load images in queuedImage() and returns percent
	// of processed images until it reaches 100 and they are loaded

	loadImages: function() {
		// if any images are left to load

		if (this.imagesIndex < this.imageUrls.length) {
			this.loadImage(this.imageUrls[this.imagesIndex]);
			this.imagesIndex++;
		}

		// return percent complete

		return (this.imagesLoaded + this.imagesFailedToLoad) / this.imageUrls.length * 100;
	},

	// Queue images for loading by loadImages()

	queueImage: function(imageUrl) {
		this.imageUrls.push(imageUrl);
	},

	/**
	 * * * * * * * * * * * * * * * * * * * * * * * * * * *
	  * Game loop										*
	 * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 *
	 * Starts animation by calling window.requestNextAnimationFrame()
	 * a polyfill method that is passed a reference to the function
	 * browsers call when it's time to draw the next animation frame
	 *
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 */

	start: function() {
		var self = this;
		this.startTime = getTimeNow();

		// start animation

		window.requestNextAnimationFrame(function(time) {
			// the this variable is the window object
			self.animate.call(self, time);
		});
	},

	// Animate when its time for next frame

	animate: function(time) {
		var self = this;

		if (this.paused) {
			// in 100ms call again to check if paused still
			setTimeout(function() {
				self.animate.call(self, time);
			}, this.PAUSE_TIMEOUT);
		}
		// not paused
		else {
			this.tick(time); // update fps
			this.clearScreen();

			this.startAnimate(time);
			this.paintUnderSprites();

			this.updateSprites(time);
			this.paintOverSprites(time);

			this.paintOverSprites();
			this.endAnimate();

			// call again when ready for next next frame

			window.requestNextAnimationFrame(function(time) {
				self.animate.call(self, time);
			});
		}
	},

	// Update frame rate, time, and lastTime frame was drawn

	tick: function(time) {
		this.updateFrameRate(time);
		this.gameTime = (getTimeNow()) - this.startTime;
		this.lastTime = time;
	},

	// Update frame rate based on time spent to draw last frame only

	updateFrameRate: function(time) {
		if (this.lastTime === 0) {
			this.fps = this.START_FPS;
		} else {
			this.fps = 1000 / (time - this.lastTime);
		}
	},

	// Clear entire canvas

	clearScreen: function() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	},

	// Update all sprites using the sprite update() to invoke their behaviors

	updateSprites: function(time) {
		for (var i = 0; i < this.sprites.length; ++i) {
			var sprite = this.sprites[i];
			sprite.update(this.ctx, time);
		}
	},

	// Paint visible sprites

	paintSprites: function(time) {
		for (var i = 0; i < this.sprites.length; ++i) {
			var sprite = this.sprites[i];

			if (sprite.visible) {
				sprite.paint(this.ctx);
			}
		}
	},

	// Toggle paused

	togglePaused: function() {
		var now = getTimeNow();

		this.paused = !this.paused;

		if (this.paused) {
			this.startPauseAt = now;
		}
		// note paused
		else  {
			// adjust start time to continue from time when paused

			this.startTime = this.startTime + now - this.startPauseAt;
			this.lastTime = now;
		}
	},

	// Time-Based motion

	pixelsPerFrame: function(time, velocity) {
		/**
		 * Returns the amount of pixels to move objects for current frame given
		 * the current time and velocity of object measured in pixels/second
		 *
		 * Note: (pixels/second) * (second/frame) = pixels/second
		 */

		return velocity / game.fps;
	},

	// High scores

	getHighScores: function() {
		var key = game.gameName + game.SCORES_SUFFIX,
			highScoresString = localStorage[key];

		if (highScoresString === undefined) {
			localStorage[key] = JSON.stringify([]);
		}
		return JSON.parse(localStorage[key]);
	},

	setHighScore: function(highScore) {
		var key = game.gameName + game.SCORES_SUFFIX,
			highScoresString = localStorage[key];

		highScores.unshift(highScore);
		localStorage[key] = JSON.stringify(highScores);
	},

	clearHighScores: function() {
		localStorage[game.gameName + game.SCORES_SUFFIX] = JSON.stringify([]);
	},

	// Key listeners

	addKeyListener: function(keyAndListener) {
		game.keyListeners.push(keyAndListener);
	},

	// Return the associated listener of a given key

	findKeyListener: function(key) {
		var listener;

		game.keyListeners.forEach(function(keyAndListener) {
			var currentKey = keyAndListener.key;

			if (currentKey === key) {
				listener = keyAndListener.listener;
			}
		});
	},

	// Callback for keyDown and keyPress events

	keyPressed: function(e) {
		var listener, key;

		switch (e.keyCode) {
			// Keys
			case 32: key = 'space';		break;
			case 27: key = 'esc';		break;
			case 13: key = 'enter';		break;
			case 8:  key = 'backspace';	break;
			case 9:  key = 'tab';		break;
			case 46: key = 'delete';	break;
			case 83: key = 's';			break;
			case 80: key = 'p';			break;
			case 79: key = 'o';			break;
			case 81: key = 'q';			break;
			case 89: key = 'y';			break;
			case 90: key = 'z';			break;
			case 88: key = 'x';			break;
			case 67: key = 'c';			break;
			case 86: key = 'v';			break;
			case 37: key = 'left';		break;
			case 38: key = 'up';		break;
			case 39: key = 'right';		break;
			case 40: key = 'down';		break;
		}

		listener = game.findKeyListener(key);

		// listener is a function now
		if (listener) {
			listener();
		}
	},

	// Sound

	// Returns true if browser can play .ogg file format

	canPlayOggVorbis: function() {
		return '' !== this.audio.canPlayType('audio/ogg; codecs="vorbis"');
	},

	// Returns true if browser can play .mp3 file format

	canPlayMp3: function() {
		return '' !== this.audio.canPlayType('audio/mpeg');
	},

	// Returns the first available sound channel

	getAvailableChannel: function() {
		var audio;

		for (var i = 0; i < this.NUM_CHANNELS; ++i) {
			audio = this.soundChannels[i];
			if (audio.played && audio.played.length > 0) {
				if (audio.ended) {
					return audio;
				}
			} else {
				if (! audio.ended) {
					return audio;
				}
			}
		}
		return undefined; // all channels in use
	},

	// Play associated sound given an identifier

	playSound: function(id) {
		var channel = this.getAvailableChannel(),
			element = document.getElementById(id);

		if (channel && element) {
			channel.src = element.src === '' ? element.currentSrc : element.src;
			channel.load();
			channel.play();
		}
	},

	// Add sprite. Updates and paints (if visible) in animate() method

	addSprite: function (sprite) {
		this.sprites.push(sprite);
	},

	// Its better to write more generalized code to deal with all sprites
	// so try to use this as little as possible

	getSprite: function(name) {
		for (var i in this.sprites) {
			if (this.sprites[i].name === name) {
				return this.sprites[i];
			}
		}
		return null;
	},

	// Override as needed. animate() calls the methods in order listed

	startAnimate:		function(time) { },
	paintUnderSprites:	function() { },
	paintOverSprites:	function() { },
	endAnimate:			function() { }
};

/**
 * Stopwatch Constructor
 */

Stopwatch = function() { };

Stopwatch.prototype = {
   startTime: 0,
   running: false,
   elapsed: undefined,

   start: function() {
      this.startTime = +new Date();
      this.elapsedTime = undefined;
      this.running = true;
   },
   stop: function() {
      this.elapsed = (+new Date()) - this.startTime;
      this.running = false;
   },
   getElapsedTime: function() {
      if (this.running) {
         return (+new Date()) - this.startTime;
      }
      else {
        return this.elapsed;
      }
   },
   isRunning: function() {
      return this.running;
   },
   reset: function() {
     this.elapsed = 0;
   }
};


/**
 * Animation Timer
 */

AnimationTimer = function(duration, timeWarp) {
   this.timeWarp = timeWarp;

   if (duration !== undefined) {
      this.duration = duration;
   } else {
      this.duration = 1000;
   }

   this.stopwatch = new Stopwatch();
};

AnimationTimer.prototype = {
   start: function() {
      this.stopwatch.start();
   },

   stop: function() {
      this.stopwatch.stop();
   },

   getRealElapsedTime: function() {
      return this.stopwatch.getElapsedTime();
   },

   getElapsedTime: function() {
      var elapsedTime = this.stopwatch.getElapsedTime(),
         percentComplete = elapsedTime / this.duration;

      if (!this.stopwatch.running) {
         return undefined;
      }
      if (this.timeWarp === undefined) {
         return elapsedTime;
      }

      return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
   },

   isRunning: function() {
      return this.stopwatch.running;
   },

   isOver: function() {
      return this.stopwatch.getElapsedTime() > this.duration;
   },

   reset: function() {
      this.stopwatch.reset();
   }
};

AnimationTimer.makeEaseOut = function(strength) {
   return function(percentComplete) {
      return 1 - Math.pow(1 - percentComplete, strength * 2);
   };
};

AnimationTimer.makeEaseIn = function(strength) {
   return function(percentComplete) {
      return Math.pow(percentComplete, strength * 2);
   };
};

AnimationTimer.makeEaseInOut = function() {
   return function(percentComplete) {
      return percentComplete - Math.sin(percentComplete * 2 * Math.PI) / (2 * Math.PI);
   };
};

AnimationTimer.makeElastic = function(passes) {
   passes = passes || 3;
   return function(percentComplete) {
      return((1 - Math.cos(percentComplete * Math.PI * passes)) * (1 - percentComplete)) + percentComplete;
   };
};

AnimationTimer.makeBounce = function(bounces) {
   var fn = AnimationTimer.makeElastic(bounces);
   return function(percentComplete) {
      percentComplete = fn(percentComplete);
      return percentComplete <= 1 ? percentComplete : 2 - percentComplete;
   };
};

AnimationTimer.makeLinear = function() {
   return function(percentComplete) {
      return percentComplete;
   };
};
