if (typeof anti !== 'object') {
	anti = {};
}

anti = {
	common: {
		init: function() {
			// @forEach: array-like polyfill support old browser
			if (!Array.forEach) {
				Array.forEach = function(array, callback, context) {
					for (var i = 0; i < array.length; i++) {
						callback.call(context, array[i], i, array);
					}
				};
			}
			
			anti.init();
		}
	},
	currentCoords: {},
	
	init: function() {
		var el = {
			b: document.body,
			l: document.getElementById('layer3'),
		};
		//el.c = document.getElementsByTagName('canvas');
		el.p = el.l.getElementsByTagName('section');

		[].forEach.call(el.p, function(panel) {
			anti.loadPanelContent(panel.id);
		});

		// Setup paperjs canvas
		//anti.paper.setUp();
		// Setup navigation
		anti.panelNavigation.setUp(el);

		// Make everything fill the browser viewport
		window.addEventListener('resize', anti.utils.resizeToScreen(el), false);
		anti.utils.resizeToScreen(el);
	},
	loadPanelContent: function(panel) {
		var jqxhr = $.ajax({
			crossDomain: true,
			type: 'post',
			dataType: 'html',
			url: 'panels/'+ panel +'/index.html'
		})
		.done(function(data, status, jqXHR) {
			console.log('success');
			$('#'+ panel).html(data);
		})
		.error( function(jqXHR, status, error) {
			console.log('Status: '+status+'"\n"Error: ' + error);
		});

		// Set up project image sliders
		anti.projectSlider($('.slider'));
	},

	utils: {
		resizeToScreen: function(el) {
			var dim = { 
				w: window.innerWidth,
				h: window.innerHeight
			};
			
			el.b.style = 'width: '+ dim.w +'px; height: '+ dim.h +'px';
			el.l.style = 'width: '+ dim.w +'px; height: '+ dim.h +'px';
			//$('.panel').css({ width: dim.w - (3 * $('#layer3').css('left').split('px')[0]) +'px', height: dim.h - 160 +'px' });

			//$('body').css({ height: winHeight });
			//$('#layer3').css({ width: winWidth +'px', height: winHeight +'px' });
			
			// get offsetDistance - http://jsfiddle.net/jaredwilli/cydhM/
		},
		extend: function(d, e, c) {
		    var b = function() {},
		        a;
		    b.prototype = e.prototype;
		    d.prototype = new b();
		    d.prototype.constructor = d;
		    d.superclass = e.prototype;
		    if (e.prototype.constructor == Object.prototype.constructor) {
		        e.prototype.constructor = e;
		    }
		    if (c) {
		        for (a in c) {
		            if (c.hasOwnPropterty(a)) {
		                d.prototype[a] = c[a];
		            }
		        }
		    }
		},
		isArray: function(a) {
		    return (a.constructor.toString().indexOf('Array') !== -1);
		},
		createCache: function(requestFunction) {
		    var cache = {};
		    return function(key, callback) {
		        if (!cache[key]) {
		            cache[key] = $.Deferred(function(defer) {
		                requestFunction(defer, key);
		            }).promise();
		        }
		        console.log(cache[key]);
		        return cache[key].done(callback);
		    };
		}
	},
	paper: {
		numClouds: 20,

		setUp: function() {
			console.log('antipaper setUp!!');
			
			var clouds = document.getElementById('big-clouds');
			paper.setUp(clouds);

			console.log('this: ', paper.install);
			console.log(paper);
			
			var ap = this,
				clouds = this.Cloud(this);

			console.log(this.project);
			
			var symbol = new this.Symbol(clouds);

			symbol.style = {
				fillColor: 'rgba(200,200,200,0.9)',
				strokeColor: 'rgba(200,200,200,0.05)'
			};
			
			console.log(ap, symbol);

			// Place the instances of the symbol:
			for (var i = 0; i < this.numClouds; i++) {
			    var placed = symbol.place(this.Point.random() * this.view.size);
		
			    placed.scale(i / count);

			    placed.data = {};
			    placed.data.vector = new this.Point({
			        angle: Math.random() * 360,
			        length : (i / count) * Math.random() / 5
			    });
			}

			console.log(project);

			this.onFrame(this);
		},
		onMouseMove: function(event) {
			vectorClone = view.center - event.point;
		},
		// The onFrame function is called up to 60 times a second
		onFrame: function(ap) {
			console.log('antipaper onFrame!!', ap);

			var vector = new ap.Point({ angle: 45, length: 0 }),
				vectorClone = vector.clone();

		    vector = vector + (vectorClone - vector) / 30;

		    // Run through the active layers children list and change
		    // the position of the placed symbols:
		    for (var i = 0; i < ap.numClouds; i++) {
		        var item = ap.project.activeLayer.children[i],
		        	size = item.bounds.size,
		        	length = vector.length / 100 * size.width / 100;

		        item.position += vector.normalize(length) + item.data.vector;
		        
		        this.keepInView(item);
		    }
		},
		keepInView: function(item) {
		    // make edges mirror like in asteroids
		    if (item.bounds.x + item.bounds.width < view.bounds.x) {
		        item.position.x = bounds.width;
		    }
		    if (item.bounds.y + item.bounds.height < view.bounds.y) {
		        item.position.y = bounds.height;
		    }
		    /* BUG BELOW */
		    if (item.bounds.x - item.bounds.width > view.bounds.width) {
		        //console.log(item.bounds);
		        item.position.x = 0;
		    }
		    if (item.bounds.y - item.bounds.height > view.bounds.height) {
		        item.position.y = 0;
		    }
		},
		// Creates a new cloud group item
		Cloud: function(ap) {
		    var rect = new ap.Rectangle(-25, 85, 500, 70);
		    var size = new ap.Size(50, 70);
		    var rndRect = new ap.Path.RoundRectangle(rect, size);
		    var circle1 = new ap.Path.Circle(new ap.Point(450, 110), 35);
		    var circle2 = new ap.Path.Circle(new ap.Point(370, 70), 65);
		    var circle3 = new ap.Path.Circle(new ap.Point(280, 25), 90);
		    var circle4 = new ap.Path.Circle(new ap.Point(205, 90), 65);
		    var circle5 = new ap.Path.Circle(new ap.Point(115, 70), 55);
		    var circle6 = new ap.Path.Circle(new ap.Point(55, 95), 40);
		    var circle7 = new ap.Path.Circle(new ap.Point(3, 115), 35);
		   
		    var group = new ap.Group([rndRect, circle1, circle2, circle3, circle4, circle5, circle6, circle7]);
			console.log([rndRect, circle1, circle2, circle3, circle4, circle5, circle6, circle7]);
		}
	},
	panelNavigation: {
		// property to track the current section loaded
		currentSection: $('#panel5'),

		// Constants for nav functionality
		BASE_DURATION: 	1000,
		MAX_DURATION: 	6000,
		EASING_TYPE: 	'easeOutQuart',
		MENU_SET: 		$('#main-nav').find('a'),
		CONTENT_LAYER: 	$('#layer3'),

		LAYER_SET: {
			layer5: {
				el: $('#layer5'),
				coords: [-2700, -200] // [left, bottom]
			},
			layer4: {
				el: $('#layer4'),
				coords: [-2500, -210] // [left, bottom]
			},
			layer3: {
				el: $('#layer3'),
				coords: [100, 0] 	// [left, top]
			},
			layer1: {
				el: $('#layer1'),
				coords: [-2300, -220] 	// [left, bottom]
			}
		},

		// TODO: Abstract this out so that the panels coords and url can be dynamically assigned based on the panelToLoad ID
		TARGET_LAYER3: {
			panel1: {
				url: '#panel1',
				coords: [-1700, -1200] // [x, y] or [left, top]
			},
			panel2: {
				url: '#panel2',
				coords: [0, -1200]
			},
			panel3: {
				url: '#panel3',
				coords: [1700, -1200]
			},
			panel4: {
				url: '#panel4',
				coords: [-1700, 0]
			},
			panel5: {
				url: '#panel5',
				coords: [0, 0]
			},
			panel6: {
				url: '#panel6',
				coords: [1700, 0]
			},
			panel7: {
				url: '#panel7',
				coords: [-1700, 1200]
			},
			panel8: {
				url: '#panel8',
				coords: [0, 1200]
			},
			panel9: {
				url: '#panel9',
				coords: [1700, 1200]
			},
			panel10: {
				url: '#panel10',
				coords: [-1700, 2700]
			},
			panel10: {
				url: '#panel10',
				coords: [-1700, 2700]
			},
			panel11: {
				url: '#panel11',
				coords: [0, 2700]
			},
			panel12: {
				url: '#panel12',
				coords: [1700, 2700]
			}
		},

		X_ADJUST_1: 0.12,
		Y_ADJUST_1: 0.14,

		X_ADJUST_2: 0.1,
		Y_ADJUST_2: 0.126,

		X_ADJUST_4: 0.1,

		X_ADJUST_5: 1,
		Y_ADJUST_5: 1.15,

		setUp: function() {
			console.log("panelNav init");
			var an = anti.panelNavigation;

			an.MENU_SET.on('click', function(e) {
				var panelToLoad = $(this).attr('href').split('#')[1];

				console.log('panelToLoad: ', an.TARGET_LAYER3[panelToLoad]);
				an.navigateToSection(an.TARGET_LAYER3[panelToLoad], an);

				e.preventDefault();
			});
		},

		navigateToSection: function(panelToLoad, an) {
			//window.history.pushState(panelToLoad, $('#'+ panelToLoad).find('h2').text(), '#'+ panelToLoad);
			//window.location.hash = '#'+ panelToLoad;
			$('#main-nav').find('.active').removeClass('active');
			$('#main-nav').find('a[href='+ panelToLoad.url +']').addClass('active');

			// load target panel's content
			//anti.panelLoading.getPanelData(panelToLoad, an.currentSection);

			//set now to the section about to be loaded into view
			an.currentSection = panelToLoad;

			// sends name of target panel
			an.moveAll(panelToLoad, an);
		},

		// method accepts string of target panel for which to apply position translation animations
		// TODO: BIG TIME - this whole method needs to be done more abstractly and better!!!
		moveAll: function(panelToLoad, an) {
		    anti.currentCoords = panelToLoad.coords;
		    layer3coords = panelToLoad.coords;
		    
		    // first calculate the position constants by which to translate other panel positions
		    var contentLayerW = an.CONTENT_LAYER.width(),
		        contentLayerExtraX = contentLayerW - (window.innerWidth / 2),
		        xPosConstant = (layer3coords[0] + 100) / contentLayerExtraX;

		    var contentLayerH = an.CONTENT_LAYER.height(),
		        contentLayerExtraY = contentLayerH - (window.innerHeight / 2),
		        yPosConstant = layer3coords[1] / contentLayerExtraY;

		    var layer1ExtraX = an.LAYER_SET.layer1.el.width() - (window.innerWidth / 2),
		        layer1x = (layer1ExtraX * xPosConstant * -1 * an.X_ADJUST_1) + (an.LAYER_SET.layer1.coords[0] / 2),
		        layer1y = window.innerHeight / an.LAYER_SET.layer1.el.height();

		    var layer4ExtraX = an.LAYER_SET.layer4.el.width() - (window.innerWidth / 2),
		        layer4x = layer4ExtraX * xPosConstant * -1 * an.X_ADJUST_1,
		        layer4y = window.innerHeight / an.LAYER_SET.layer4.el.height();

		    var layer5ExtraX = an.LAYER_SET.layer5.el.width() - (window.innerWidth / 2),
		        layer5x = layer5ExtraX * xPosConstant * -1 * an.X_ADJUST_1,
		        layer5y = window.innerHeight / an.LAYER_SET.layer5.el.height();

		    var layer3x = layer3coords[0] * -1 + 100,
		    	layer3y = layer3coords[1] * -1;

		    //formula for y translation is (layerH/frontH)(frontY)([optional multiplier])

		   var layers = {
		    	layer1: [layer1x, layer1y],
		        layer4: [layer4x, layer4y],
		        layer5: [layer5x, layer5y],
		     	layer3: [layer3x, layer3y]
		    };

		    an.animateEm(layers, an);
		},
		animateEm: function(layers, an) {
		    console.log('animateEm', layers);
		    
		    // check for travel distance to set animation duration based on how far to slide
		    var xDiff = Math.abs((Number(an.LAYER_SET.layer3.el.css('left').split('px')[0]) + 100000) - (layers.layer3[0] + 100000));
		    
		    // calculate the adjusted animation duration
		    var thisDuration = Math.round(xDiff / Number(an.LAYER_SET.layer3.el.width()) * (an.MAX_DURATION - an.BASE_DURATION) + an.BASE_DURATION);

		    // run the animations

		    an.LAYER_SET.layer1.el.stop().animate({ left: layers.layer1[0] +'px', bottom: layers.layer1[1] +'px' }, thisDuration, an.EASING_TYPE);
		    an.LAYER_SET.layer4.el.stop().animate({ left: layers.layer4[0] +'px', bottom: layers.layer4[1] +'px' }, thisDuration, an.EASING_TYPE);
		    an.LAYER_SET.layer5.el.stop().animate({ left: layers.layer5[0] +'px', bottom: layers.layer5[1] +'px' }, thisDuration, an.EASING_TYPE);

		    an.LAYER_SET.layer3.el.stop().animate({ left: layers.layer3[0] +'px', top: layers.layer3[1] +'px' }, thisDuration, an.EASING_TYPE);
		}
	},
	projectSlider: function(slider) {
		if (!slider) {
			return;
		}
		else {
			slider.anythingSlider({
				// Appearance
				theme               : 'default', 	 // Theme name
				easing              : 'easeOutQuart',   // Anything other than "linear" or "swing" requires the easing plugin or jQuery UI
				expand              : false,     // If true, the entire slider will expand to fit the parent element
				resizeContents      : false,      // If true, solitary images/objects in the slide will expand to fit the viewport

				buildNavigation     : true,      // If true, builds a list of anchor links to link to each panel
				buildArrows         : false,      // If true, builds the forwards and backwards buttons
				buildStartStop      : false,      // If true, builds the start/stop button

				// Function
				enableNavigation    : true,      // if false, navigation links will still be visible, but not clickable.
				enableKeyboard      : true,      // if false, keyboard arrow keys will not work for this slider.
				enableArrows        : false,      // if false, arrows will be visible, but not clickable.
				enableStartStop     : false,      // if false, the play/stop button will still be visible, but not clickable. Previously "enablePlay"

				// Navigation
				//hashTags            : false,      // Should links change the hashtag in the URL?
				navigationFormatter : function(i, slide) { // add thumbnails as navigation links
					var	sliderId = slide.parents('.slider').attr('id');
					return '<img src="panels/'+ sliderId +'/thumb-'+ i +'.png" />';
				},
				navigationSize      : false,     // Set this to the maximum number of visible navigation tabs; false to disable

				// Slideshow options
				autoPlay            : true,     // If true, the slideshow will start running; replaces "startStopped" option
				playRtl             : false,     // If true, the slideshow will move right-to-left

				// Times
				delay               : 5000,      // How long between slideshow transitions in AutoPlay mode (in milliseconds)
				resumeDelay         : 10000,     // Resume slideshow after user interaction, only if autoplayLocked is true (in milliseconds).
				animationTime       : 600,       // How long the slideshow transition takes (in milliseconds)
				allowRapidChange    : true,           // If true, allow rapid changing of the active pane, instead of ignoring activity during animation

				// Video
				resumeOnVideoEnd    : true,      // If true & the slideshow is active & a supported video is playing, it will pause the autoplay until the video is complete
				resumeOnVisible     : true,      // If true the video will resume playing (if previously paused, except for YouTube iframe - known issue); if false, the video remains paused.
				addWmodeToObject    : 'opaque',  // If your slider has an embedded object, the script will automatically add a wmode parameter with this setting
				isVideoPlaying      : function(base) { return false; } // return true if video is playing or false if not - used by video extension
			});
		}
	}
};

UTIL = {
  fire: function(func, funcname, args) {
    var namespace = anti;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function') {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {
    var b = document.body;
    var bid = b.id;
    //console.log(bid);
    UTIL.fire('common');
    UTIL.fire(bid);
    /*var classes = b.clasaname.split(/\s+/),
      test = classes.length;
    for (var i = 0; i < test; i++) {
      UTIL.fire(classes[i]);
      UTIL.fire(classes[i], bid);
    };*/
    UTIL.fire('common', 'finalize');
  }
};
//kick it all off here
$(document).ready(UTIL.loadEvents);