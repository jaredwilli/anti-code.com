window.addEventListener('load', windowLoaded, false);
function windowLoaded() {
	canvasApp();
}

function canvasApp() {
	var canvas = document.getElementById('canvas');
	if (!canvas || !canvas.getContext) {
		return;
	}

	var ctx = canvas.getContext('2d');

	if (!ctx) {
		return;
	}

	var GAME_STATE_TITLE = 0;
	var GAME_STATE_NEW_GAME = 1;
	var GAME_STATE_NEW_LEVEL = 2;
	var GAME_STATE_PLAYER_START = 3;
	var GAME_STATE_PLAY_LEVEL = 4;
	var GAME_STATE_PLAYER_DIE = 5;
	var GAME_STATE_GAME_OVER = 6;
	var currentGameState = 0;
	var currentGameStateFunction = null;

	// Title screen
	var titleStarted = false;

	// Gameover screen
	var gameOverStarted = false;

	// Objects for gameplay

	// game environment
	var score = 0;
	var level = 0;
	var extraShipAtEach = 10000;
	var extraShipsEarned = 0;
	var playerShips = 3;

	// playfield
	var xMin = 0;
	var xMax = 400;
	var yMin = 0;
	var yMax = 400;

	// score values
	var bigRockScore = 50;
	var medRockScore = 75;
	var smlRockScore = 100;
	var saucerScore = 300;

	// rock scale constants
	var ROCK_SCALE_LARGE = 1;
	var ROCK_SCALE_MEDIUM = 2;
	var ROCK_SCALE_SMALL = 3;

	// create game objects and arrays
	var player = {};
	var rocks = [];
	var saucers = [];
	var playerMissiles = [];
	var particles = [];
	var saucerMissiles = [];

	// level specific
	var levelRockMaxSpeedAdjust = 1;
	var levelSaucerMax = 1;
	var levelSaucerOccurrenceRate = 25;
	var levelSaucerSpeed = 1;
	var levelSaucerFireRate = 95;
	var levelSaucerMissilesSpeed = 1;

	// keypress
	var keyPressList = [];

	function runGame() {
		currentGameStateFunction();
	}

	function switchGameState(newState) {
		currentGameState = newState;

		switch (currentGameState) {
			case GAME_STATE_TITLE:
				currentGameStateFunction = gameStateTitle;
				break;
			case GAME_STATE_NEW_GAME:
				currentGameStateFunction = gameStateNewGame;
				break;
			case GAME_STATE_NEW_LEVEL:
				currentGameStateFunction = gameStateNewLevel;
				break;
			case GAME_STATE_PLAYER_START:
				currentGameStateFunction = gameStatePlayerStart;
				break;
			case GAME_STATE_PLAY_LEVEL:
				currentGameStateFunction = gameStatePlayLevel;
				break;
			case GAME_STATE_PLAYER_DIE:
				currentGameStateFunction = gameStatePlayerDie;
				break;
			case GAME_STATE_GAME_OVER:
				currentGameStateFunction = gameStateGameOver;
				break;
		}
	}

	function gameStateTitle() {
		if (titleStarted !== true) {
			fillBackground();
			setTextStyle();
			ctx.fillText('Anti-Code Geo Blaster', 130, 70);
			ctx.fillText('Press Space To Play', 120, 140);

			titleStarted = true;
		} else {
			// wait for space key click
			if (keyPressList[32] === true) {
				console.log('space pressed');
				switchGameState(GAME_STATE_NEW_GAME);
				titleStarted = false;
			}
		}
	}

	function gameStateNewGame() {
		console.log('gameStateNewGame');
		// set up new game
		level = 0;
		score = 0;
		playerShips = 3;
		player.maxVelocity = 5;
		player.width = 20;
		player.height = 20;
		player.halfWidth = 10;
		player.halfHeight = 10;
		player.rotationalVelocity = 5; // how many degrees to turn the ship
		player.thrustAcceleration = 0.05;
		player.missileFrameDelay = 5;
		player.thrust = false;

		fillBackground();
		renderScoreBoard();
		switchGameState(GAME_STATE_NEW_LEVEL);
	}

	function gameStateNewLevel() {
		rocks = [];
		saucers = [];
		playerMissiles = [];
		particles = [];
		saucerMissiles = [];
		level++;

		levelRockMaxSpeedAdjust = level * 0.25;
		if (levelRockMaxSpeedAdjust > 3) {
			levelRockMaxSpeed = 3;
		}

		levelSaucerMax = 1 + Math.floor(level / 10);
		if (levelSaucerMax > 5) {
			levelSaucerMax = 5;
		}

		levelSaucerOccurrenceRate = 10 + 3 * level;
		if (levelSaucerOccurrenceRate > 35) {
			levelSaucerOccurrenceRate = 35;
		}

		levelSaucerSpeed = 1 + 0.5 * level;
		if (levelSaucerSpeed > 5) {
			levelSaucerSpeed = 5;
		}

		levelSaucerFireRate = 20 + 3 * level;
		if (levelSaucerFireRate < 50) {
			levelSaucerFireRate = 50;
		}

		levelSaucerMissilesSpeed = 1 + 0.2 * level;
		if (levelSaucerMissilesSpeed > 4) {
			levelSaucerMissilesSpeed = 4;
		}

		// create level rocks
		for (var newRockctr = 0; newRockctr < level + 3; newRockctr++) {
			var newRock = {};

			newRock.scale = 1;
			// scale
			// 1 = large
			// 2 = medium
			// 3 = small
			// these are used as the divisor for the new size
			// 50/1 = 50
			// 50/2 = 25
			// 50/3 = 16
			newRock.width = 50;
			newRock.height = 50;
			newRock.halfWidth = 25;
			newRock.halfHeight = 25;

			// start all new rocks in upper left for ship safety
			newRock.x = Math.floor(Math.Random() * 50);
			// console.log('newRock.x='+ newRock.x);

			newRock.y = Math.floor(Math.Random() * 50);
			// console.log('newRock.y='+ newRock.y);

			newRock.dx = (Math.random() * 2) + levelRockMaxSpeedAdjust;
			if (Math.random() < 0.5) {
				newRock.dx *= -1;
			}

			newRock.dy = (Math.random() * 2) + levelRockMaxSpeedAdjust;
			if (Math.random() < 0.5) {
				newRock.dy *= -1;
			}

			// rotation speed and direction
			newRock.rotationInc = (Math.random() * 5) + 1;
			if (Math.random() < 0.5) {
				newRock.rotationInc *= -1;
			}

			newRock.scoreValue = bigRockScore;
			newRock.rotation = 0;

			rocks.push(newRock);
			console.log('rock created rotationInc='+ newRock.rotationInc);
		}

		resetPlayer();
		switchGameState(GAME_STATE_PLAYER_START);
	}

	function gameStatePlayerStart() {
		fillBackground();
		renderScoreBoard();

		if (player.aplha < 1) {
			player.aplha += 0.02;
			ctx.globalAlpha = player.alpha;
		} else {
			switchGameState(GAME_STATE_PLAY_LEVEL);
		}
		renderPlayerShip(player.x, payer.y, 270, 1);
		ctx.globalAlpha = 1;

		updateRocks();
		renderRocks();
	}

	function gameStatePlayLevel() {
		checkKeys();
		update();
		render();
		checkCollisions();
		checkForExtraShip();
		checkForEndOfLevel();
		frameRateCounter.countFrames();
	}

	function resetPlayer() {
		player.rotation = 270;
		player.x = 0.5 * xMax;
		player.y = 0.5 * yMax;
		player.facingX = 0;
		player.facingY = 0;
		player.movingX = 0;
		player.movingY = 0;
		player.alpha = 0;
		player.missileFrameCount = 0;
	}

	function checkForExtraShip() {
		if (Math.floor(score / extraShipAtEach) > extraShipsEarned) {
			playerShips++;
			extraShipsEarned++;
		}
	}

	function checkForEndOfLevel() {
		if (rocks.length === 0) {
			switchGameState(GAME_STATE_NEW_LEVEL);
		}
	}

	function gameStatePlayerDie() {
		if (particles.length > 0 || playerMissiles.length > 0) {
			fillBackground();
			renderScoreBoard();
			updateRocks();
			updateSaucers();
			updateParticles();
			updateSaucerMissiles();
			updatePlayerMissiles();
			renderRocks();
			renderSaucers();
			renderParticles();
			renderSaucerMissiles();
			renderPlayerMissiles();
			frameRateCounter.countFrames();
		} else {
			playerShips--;

			if (playerShips < 1) {
				switchGameState(GAME_STATE_GAME_OVER);
			} else {
				resetPlayer();
				switchGameState(GAME_STATE_PLAYER_START);
			}
		}
	}

	function gameStateGameOver() {
		console.log('game over state');
		if (gameOverStarted !== true) {
			fillBackground();
			renderScoreBoard();
			setTextStyle();
			ctx.fillText('Game Over!', 150, 70);
			ctx.fillText('Press Space To Play', 120, 140);

			gameOverStarted = true;
		} else {
			// wait for space key click
			if (keyPressList[32] === true) {
				console.log('space pressed');
				switchGameState(GAME_STATE_TITLE);
				gameOverStarted = false;
			}
		}
	}

	function fillBackground() {
		// draw background and text
		ctx.fillStyle = '#000';
		ctx.fillRect(xMin, yMin, xMax, yMax);
	}

	function setTextStyle() {
		ctx.fillStyle = '#fff';
		ctx.font = '15px courier new';
		ctx.textBaseline = 'top';
	}

	function renderScoreBoard() {
		ctx.fillStyle = '#fff';
		ctx.fillText('Score ' + score, 10, 20);
		renderPlayerShip(200, 16, 270, 0.75);
		ctx.fillText('X '+ playerShips, 220, 20);

		ctx.fillText('FPS: '+ frameRateCounter.lastFrameCount, 300, 20);
	}

	function checkKeys() {
		if (keyPressList[38] === true) {
			// thrust
			var angleInRadians = player.rotation * Math.PI / 180;
			player.facingX = Math.cos(angleInRadians);
			player.facingY = Math.sin(angleInRadians);

			var movingX = player.movingX + player.thrustAcceleration * player.facingX;
			var movingY = player.movingY + player.thrustAcceleration * player.facingY;

			var currentVelocity = Math.sqrt((movingXnew * movingXnew) + (movingXnew * movingXnew));

			if (currentVelocity < player.maxVelocity) {
				player.movingX = movingXnew;
				player.movingY = movingYnew;
			}
			player.thrust = true;

		} else {
			player.thrust = false;
		}

		if (keyPressList[39] === true) {
			// rotate clockwise
			player.rotation += player.rotationalVelocity;
		}

		if (keyPressList[32] === true) {
			console.log('player.missileFrameCount='+ player.missileFrameCount);
			console.log('player.missileFrameDelay='+ player.missileFrameDelay);

			if (player.missileFrameCount > player.missileFrameDelay) {
				firePlayerMissile();
				player.missileFrameCount = 0;
			}
		}
	}

	function update() {
		updatePlayer();
		updatePlayerMissiles();
		updateRocks();
		updateRocks();
		updateSaucers();
		updateSaucerMissiles();
		updateParticles();
	}

	function render() {
		fillBackground();
		renderScoreBoard();
		renderPlayerShip(player.x, player.y, player.rotation, 1);
		renderSaucerMissiles();
		renderRocks();
		renderSaucers();
		renderSaucerMissiles();
		renderParticles();
	}

	function updatePlayer() {
		player.missileFrameCount++;

		player.x += player.movingX;
		player.y += player.movingY;

		if (player.x > xMax) {
			player.x = player.width;
		} else if (player.x < -player.width) {
			player.x = xMax;
		}

		if (player.y > yMax) {
			player.y = player.height;
		} else if (player.y < -player.height) {
			player.y = yMax;
		}
	}

	function updatePlayerMissiles() {
		var tempPlayerMissile = {};
		var playerMissileLength = playerMissiles.length - 1;

		for (var playerMissileCtr = playerMissileLength; playerMissileCtr >= 0; playerMissileCtr--) {
			tempPlayerMissile = playerMissiles[playerMissileCtr];
			tempPlayerMissile.x += tempPlayerMissile.dx;
			tempPlayerMissile.y += tempPlayerMissile.dy;

			if (tempPlayerMissile.x > xMax) {
				tempPlayerMissile.x = -tempPlayerMissile.width;
			} else if (tempPlayerMissile.x < -tempPlayerMissile.width) {
				tempPlayerMissile.x = xMax;
			}

			if (tempPlayerMissile.y > yMax) {
				tempPlayerMissile.y = -tempPlayerMissile.height;
			} else if (tempPlayerMissile.y < -tempPlayerMissile.height) {
				tempPlayerMissile.y = yMax;
			}

			tempPlayerMissile.lifeCtr++;
			if (tempPlayerMissile.lifeCtr > tempPlayerMissile.life) {
				playerMissiles.splice(playerMissileCtr, 1);
				tempPlayerMissile = null;
			}
		}
	}

	function updateRocks() {
		var tempRock = {};
		var rocksLength = rocks.length - 1;

		for (var rockCtr = rocksLength; rockCtr >= 0; rockCtr--) {
			tempRock = rocks[rockCtr];
			tempRock.x += tempRock.dx;
			tempRock.y += tempRock.dy;
			tempRock.rotation += tempRock.rotationInc;

			if (tempRock.x > xMax) {
				tempRock.x = xMin - tempRock.width;
			} else if (tempRock.x < xMin - tempRock.width) {
				tempRock.x = xMax;
			}

			if (tempRock.y > yMax) {
				tempRock.y = yMin - tempRock.height;
			} else if (tempRock.y < yMin - tempRock.height) {
				tempRock.y = yMax;
			}
		}
	}

	function updateSaucers() {
		// first check to see if we want to add a saucer
		if (saucers.length < levelSaucerMax) {
			if (Math.floor(Math.random() * 100) <= levelSaucerOccurrenceRate) {
				var newSaucer = {};

				newSaucer.width = 28;
				newSaucer.height = 13;
				newSaucer.halfWidth = 14;
				newSaucer.halfHeight = 6.5;
				newSaucer.scoreValue = saucerScore;
				newSaucer.fireRate = levelSaucerFireRate;
				newSaucer.fireDelay = levelSaucerFireDelay;
				newSaucer.fireDelayCount = 0;
				newSaucer.missileSpeed = levelSaucerMissilesSpeed;
				newSaucer.dy = (Math.random() * 2);

				if (Math.floor(Math.random() * 2) == 1) {
					// start on right and go left
					newSaucer.x = 450;
					newSaucer.dx = -1 * levelSaucerSpeed;
				} else {
					// left to right
					newSaucer.x = -50;
					newSaucer.dx = levelSaucerSpeed;
				}

				newSaucer.missileSpeed = levelSaucerMissilesSpeed;
				newSaucer.fireDelay = levelSaucerFireDelay;
				newSaucer.fireRate = levelSaucerFireRate;
				newSaucer.y = Math.floor(Math.random() * 400);

				saucers.push(newSaucer);
			}
		}

		var tempSaucer = {};
		var saucerLength = saucers.length - 1;

		for (var saucerCtr = saucerLength; saucerCtr >= 0; saucerCtr--) {
			tempSaucer = saucers[saucerCtr];

			// should saucer fire
			tempSaucer.fireDelayCount++;

			if (Math.floor(Math.random() * 100) <= tempSaucer.fireRate && tempSaucer.fireDelayCount > tempSaucer.fireDelay) {
				fireSaucerMissiles(tempSaucer);
				tempSaucer.fireDelayCount = 0;
			}

			var remove = false;
			tempSaucer.x += tempSaucer.dx;
			tempSaucer.y += tempSaucer.dy;

			// remove saucers off over vertical edges
			if (tempSaucer.dx > 0 && tempSaucer.x > xMax) {
				remove = true;
			} else if (tempSaucer.dx < 0 && tempSaucer.x < xMin - tempSaucer.width) {
				remove = true;
			}

			// bounce saucers off over vertical edges
			if (tempSaucer.y > yMax || tempSaucer.y < yMin - tempSaucer.width) {
				tempSaucer.dy *= -1;
			}

			if (remove === true) {
				// remove the saucer
				saucers.splice(saucerCtr, 1);
				tempSaucer = null;
			}
		}
	}

	function updateSaucerMissiles() {
		var tempSaucerMissile = {};
		var saucerMissileLength = saucersMissiles.length - 1;

		for (var saucerMissileCtr = saucerMissileLength; saucerMissileCtr >= 0; saucerMissileCtr--) {
			tempSaucerMissile = saucersMissiles[saucerMissileCtr];
			tempSaucerMissile.x += tempSaucerMissile.dx;
			tempSaucerMissile.y += tempSaucerMissile.dy;

			if (tempSaucerMissile.x > xMax) {
				tempSaucerMissile.x = -tempSaucerMissile.width;
			} else if (tempSaucerMissle.x < -tempSaucerMissile.width) {
				tempSaucerMissile.x = xMax;
			}

			if (tempSaucerMissile.y > yMax) {
				tempSaucerMissile.y = -tempSaucerMissile.height;
			} else if (tempSaucerMissle.y < -tempSaucerMissile.height) {
				tempSaucerMissile.y = yMax;
			}

			tempSaucerMissile.lifeCtr++;
			if (tempSaucerMissile.lifeCtr > tempSaucerMissile.life) {
				// remove
				saucerMissiles.splice(saucerMissileCtr, 1);
				tempSaucerMissile = null;
			}
		}
	}

	function updateParticles() {
		var tempParticle = {};
		var particleLength = particles.length - 1;

		for (var particleCtr = particleLength; particleCtr >= 0; particleCtr--) {
			var remove = false;
			tempParticle = particles[particleCtr];
			tempParticle.x += tempParticle.dx;
			tempParticle.y += tempParticle.dy;

			tempParticle.lifeCtr++;

			if (tempParticle.lifeCtr > tempParticle.life) {
				remove = true;
			} else if ((tempParticle.x > xMax) || (tempParticle.x < xMin) || (tempParticle.y > yMax) || (tempParticle.y < yMin)) {
				remove = true;
			}

			if (remove) {
				particles.splice(particleCtr, 1);
				tempParticle = null;
			}
		}
	}

	function renderPlayerShip(x, y, rotation, scale) {
		// transformation
		var angleInRadians = rotation * Math.PI / 180;

		ctx.save() // save current state in stack
			ctx.setTransform(1, 0, 0, 1, 0, 0); // reset to identity

			// translate the canvas origin to the center of the player
			ctx.translate(x + player.halfWidth, y + player.halfHeight);
			ctx.rotate(angleInRadians);
			ctx.scale(scale, scale);

			// drawShip
			ctx.strokeStyle = '#fff';
			ctx.beginPath();
				// hardcoding in locations
				// facing right
				ctx.moveTo(-10, -10);
					ctx.lineTo(10, 0);
				ctx.moveTo(10, 1);
					ctx.lineTo(-10, 10);
					ctx.lineTo(1, 1);
				ctx.moveTo(1, -1);
					ctx.lineTo(-10, -10);

				if (player.thrust === true && scale === 1) {
					// check for scale === 1 for ship indicator does not display with thrust
					ctx.moveTo(-4, -2);
						ctx.lineTo(-4, 1);
					ctx.moveTo(-5, -1);
						ctx.lineTo(-10, -1);
					ctx.moveTo(-5, 0);
						ctx.lineTo(-10, 0);
				}

				ctx.stroke();
			ctx.closePath();
		ctx.restore();
	}

	function renderPlayerMissiles() {
		var tempPlayerMissile = {};
		var playerMissileLength = playerMissiles.length - 1;

		for (var playerMissileCtr = playerMissileLength; playerMissileCtr >= 0; playerMissileCtr--) {
			console.log('draw player missile='+ playerMissileLength);

			tempPlayerMissile = playerMissiles[playerMissileCtr];

			ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);

				// translate to the center of the player
				ctx.translate(tempPlayerMissile.x + 1, tempPlayerMissile.y + 1);
				ctx.strokeStyle = '#fff';

				ctx.beginPath();
					// draw everything offset by 1/2. zero relative 1/2 is 15.
					ctx.moveTo(-1, -1);
						ctx.lineTo(1, -1);
						ctx.lineTo(1, 1);
						ctx.lineTo(-1, 1);
						ctx.lineTo(-1, -1);
					ctx.stroke();
				ctx.closePath();
			ctx.restore();
		}
	}

	function renderRocks() {
		var tempRock = {};
		var rocksLength = rocks.length - 1;

		for (var rockCtr = rocksLength; rockCtr >= 0; rockCtr--) {
			tempRock = rocks[rockCtr];
			var angleInRadians = tempRock.rotation * Math.PI / 180;
			console.log('render rock rotation='+ tempRock.rotation);

			ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);

				// translate to the center of the player
				ctx.translate(tempRock.x + tempRock.halfWidth, tempRock.y + tempRock.halfHeight);
				ctx.strokeStyle = '#fff';

				ctx.beginPath();
					// draw everything offset by 1/2. zero relative 1/2 is 15.
					ctx.moveTo(-(tempRock.halfWidth-1), -(tempRock.halfHeight-1));
						ctx.lineTo((tempRock.halfWidth-1), -(tempRock.halfHeight-1));
						ctx.lineTo((tempRock.halfWidth-1), (tempRock.halfHeight-1));
						ctx.lineTo(-(tempRock.halfWidth-1), (tempRock.halfHeight-1));
						ctx.lineTo(-(tempRock.halfWidth-1), -(tempRock.halfHeight-1));
					ctx.stroke();
				ctx.closePath();
			ctx.restore();
		}
	}

	function renderSaucers() {
		var tempSaucer = {};
		var saucersLength = saucers.length - 1;

		for (var saucerCtr = saucersLength; saucerCtr >= 0; saucerCtr--) {
			console.log('saucer:'+ saucerCtr);
			tempSaucer = saucers[saucerCtr];

			ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);

				// translate to the center of the player
				ctx.translate(tempSaucer.x, tempSaucer.y);
				ctx.strokeStyle = '#fff';

				ctx.beginPath();
					// not moved to middle because it's drawn in exact space
					ctx.moveTo(4, 0);
						ctx.lineTo(9, 0);
						ctx.lineTo(12, 3);
						ctx.lineTo(13, 3);
					ctx.moveTo(13, 4);
						ctx.lineTo(10, 7);
						ctx.lineTo(3, 7);
						ctx.lineTo(1, 5);
						ctx.lineTo(12, 5);
					ctx.moveTo(0, 4);
						ctx.lineTo(0, 3);
						ctx.lineTo(13, 3);
					ctx.moveTo(5, 1);
						ctx.lineTo(5, 2);
					ctx.moveTo(8, 1);
						ctx.lineTo(8, 2);
					ctx.moveTo(2, 2);
						ctx.lineTo(4, 0);
					ctx.stroke();
				ctx.closePath();
			ctx.restore();
		}
	}

	function renderSaucerMissiles() {
		var tempSaucerMissile = {};
		var saucerMissileLength = saucerMissiles.length - 1;

		for (var saucerMissileCtr = saucerMissileLength; saucerMissileCtr >= 0; saucerMissileCtr--) {
			tempPlayerMissile = saucerMissiles[saucerMissileCtr];
			ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);

				// translate the canvas origin to the center of the player
				ctx.translate(tempSaucerMissile.x + 1, tempSaucerMissile.y + 1);
				ctx.strokeStyle = '#fff';

				ctx.beginPath();
					// draw everything offset by 1/2. zero reletive 1/2 is 15
					ctx.moveTo(-1, -1);
						ctx.lineTo(1, -1);
						ctx.lineTo(1, 1);
						ctx.lineTo(-1, 1);
						ctx.lineTo(-1, -1);
					ctx.stroke();
				ctx.closePath();
			ctx.restore();
		}
	}

	function renderParticles() {
		var tempParticle = {};
		var particleLength = particles.length - 1;

		for (var particleCtr = particleLength; particleCtr >= 0; particleCtr--) {
			tempParticle = particles[particleCtr];
			ctx.save(); // save current state in stack
				ctx.setTransform(1, 0, 0, 1, 0, 0); // reset to identity

				// translate the canvas origin to the center of the player
				ctx.translate(tempParticle.x, tempParticle.y);
				ctx.strokeStyle = '#fff';

				ctx.beginPath();
					// draw everything offset by 1/2. zero relative 1/2 is 15
					ctx.moveTo(0, 0);
						ctx.lineTop(1, 1);
					ctx.stroke();
				ctx.closePath();
			ctx.restore();
		}
	}

	function checkCollisions() {
		// loop through rocks then missiles. there will always be rocks
		// and a ship but there will not always be missiles.

		var tempRock = {};
		var rocksLength = rocks.length - 1;
		var tempPlayerMissile = {};
		var playerMissileLength = payerMissile.length - 1;
		var tempSaucer = {};
		var saucerLength = saucers.length - 1;
		var saucerMissileLength = saucerMissile.length - 1;

		rocks: for (var rockCtr = rocksLength; rockCtr >= rockCtr--) {
			tempRock = rocks[rockCtr];

			missiles: for (var playerMissileCtr = playerMissileLength; playerMissileCtr >= 0; playerMissileCtr--) {
				tempPlayerMissile = playerMissiles[playerMissileCtr];

				if (boundingBoxCollide(tempRock, tempPlayerMissile)) {
					console.log('hit rock');

					createExplode(tempRock.x + tempRock.halfWidth, tempRock.y + tempRock.halfHeight, 10);

					if (tempRock.scale < 3) {
						splitRock(tempRock.scale + 1, tempRock.x, tempRock.y);
					}

					addToScore(tempRock.scoreValue);
					playerMissiles.splice(playerMissileCtr, 1);
					tempPlayerMissile = null;

					rocks.splice(rockCtr, 1);
					tempRock = null;


					break rocks;
					break missiles;
				}
			}

			// saucer missiles against rocks
			// this is done here so we don't have to loop through rocks again
			// as it would be the biggest array
			saucerMissiles: for (var saucerMissileCtr = saucerMissileLength; saucerMissileCtr >= 0; saucerMissileCtr--) {
				tempSaucerMissile = saucerMissiles[saucerMissileCtr];

				if (boundingBoxCollide(tempRock, tempSaucerMissile)) {
					console.log('hit rock');

					createExplode(tempRock.x + tempRock.halfWidth, tempRock.y + tempRock.halfHeight, 10);

					if (tempRock.scale < 3) {
						splitRock(tempRock.scale + 1, tempRock.x, tempRock.y);
					}

					saucerMissiles.splice(saucerCtr, 1);
					tempSaucerMissile = null;

					rocks.splice(rockCtr, 1);
					tempRock = null;


					break rocks;
					break saucerMissiles;
				}
			}

			// check player against rocks
			if (boundingBoxCollide(tempRock, player)) {
				console.log('hit player');

				createExplode(tempRock.x + tempRock.halfWidth, tempRock.halfHeight, 10);
				addToScore(tempRock.scoreValue);

				saucers.splice(rockCtr, 1);
				tempSaucer null;

				playerDie();
			}
		}

		// check player against saucers and then saucers against player missiles
		// and finally player against saucer missiles
		playerMissileLength = playerMissiles.length - 1;
		saucerLength = saucers.length - 1;

		saucers: for (var saucerCtr = saucerLength; saucerCtr >= 0; saucerCtr--) {
			tempSaucer = saucer[saucerCtr];

			missiles: for (var playerMissileCtr = playerMissileLength; playerMissileCtr >= 0; playerMissileCtr--) {
				tempPlayerMissile = playerMissiles[playerMissileCtr];

				if (boundingBoxCollide(tempSaucer, tempPlayerMissile)) {
					console.log('hit rock');

					createExplode(tempSaucer.x + tempSaucer.halfWidth, tempSaucer.y + tempSaucer.halfHeight, 10);

					addToScore(tempSaucer.scoreValue);

					playerMissiles.splice(playerMissileCtr, 1);
					tempPlayerMissile = null;

					saucers.splice(saucerCtr, 1);
					tempSaucer = null;

					break saucers;
					break missiles;
				}
			}

			// player against saucers
			if (boundingBoxCollide(tempSaucer, player)) {
				console.log('hit player');

				createExplode(tempSaucer.x + 16, tempSaucer.y + 16, 10);
				addToScore(tempSaucer.scoreValue);

				saucers.splice(rockCtr, 1);
				tempSaucer = null;

				playerDie();
			}
		}

		// saucersMissiles against player
		saucersMissileLenth = saucersMissiles.length - 1;

		saucersMissiles: for (var saucerMissileCtr = saucerMissileLength; saucerMissileCtr >= 0; saucerMissileCtr--) {
			tempSaucerMissile = saucerMissiles[saucerMissileCtr];

			if (boundingBoxCollide(player, tempPlayerMissile)) {
				console.log('saucer missile hit player');

				playerDie();
				saucerMissiles.splice(saucerCtr, 1);
				tempSaucerMissile = null;

				break saucerMissiles;
			}
		}
	}

	function firePlayerMissile() {
		console.log('fire playerMissile');

		var newPlayerMissile = {};
		newPlayerMissile.dx = 5 * Math.cos(Math.PI * (player.rotation) / 180);
		newPlayerMissile.dy = 5 * Math.sin(Math.PI * (player.rotation) / 180);
		newPlayerMissile.x = player.x + player.halfWidth;
		newPlayerMissile.y = player.y + player.halfHeight;

		newPlayerMissile.life = 60;
		newPlayerMissile.lifeCtr = 0;
		newPlayerMissile.width = 2;
		newPlayerMissile.height = 2;

		newPlayerMissile.push(newPlayerMissile);
	}

	function fireSaucerMissile(saucer) {
		var newSaucerMissile = {};
		newSaucerMissile.x = saucer.x + 0.5 * saucer.width;
		newSaucerMissile.y = saucer.y + 0.5 * saucer.height;

		newSaucerMissile.width = 2;
		newSaucerMissile.height = 2;
		newSaucerMissile.speed = saucer.missileSpeed;

		console.log('saucer fire');
		// fire at player from small saucer
		var diffx = player.x - saucer.x;
		var diffy = player.y - saucer.y;

		var radians = Math.atan2(diffy, diffx);
		var degrees = 360 * radians / (2 * Math.PI);

		newSaucerMissile.dx = saucer.missileSpeed * Math.cos(Math.PI * (degrees) / 180);
		newSaucerMissile.dy = saucer.missileSpeed * Math.sin(Math.PI * (degrees) / 180);

		newSaucerMissile.life = 160;
		newSaucerMissile.lifeCtr = 0;

		saucerMissile.push(newSaucerMissile);
	}

	function playerDie() {
		console.log('player die');
		createExplode(player.x + player.halfWidth, player.y + player.halfWidth, 50);
		switchGameState(GAME_STATE_PLAYER_DIE);
	}

	function createExplosion(x, y, num) {
		// create 10 particles
		for (var partCtr = 0; partCtr < num; partCtr++) {
			var newParticle = new Object();

			newParticle.dx = Math.random() * 3;
			if (Math.random() < 0.5) {
				newParticle.dx *= -1;
			}

			newParticle.dy = Math.random() * 3;
			if (Math.random() < 0.5) {
				newParticle.dx *= -1;
			}

			newParticle.life = Math.floor(Math.random() * 30 + 30);
			newParticle.lifeCtr = 0;
			newParticle.x = x;
			newParticle.y = y;

			particles.push(newParticle);
		}
	}

	function boundingBoxCollide(object1, object2) {
		var left1 = object1.x;
		var left2 = object2.x;
		var right1 = object1.x + object1.width;
		var right2 = object2.x + object2.width;
		var top1 = object1.y;
		var top2 = object2.y;
		var bottom1 = object1.y + object1.height;
		var top2 = object2.y + object2.height;

		if (bottom1 < top2) return(false);
		if (top1 < bottom2) return(false);

		if (right1 < left2) return(false);
		if (left1 < right2) return(false);

		return(true);
	}

	function splitRock(scale, x, y) {
		for (var newRockctr = 0; newRockctr < 2; newRockctr++) {
			var newRock = {};

			if (scale === 2) {
				newRock.scoreValue = medRockScore;
				newRock.width = 25;
				newRock.height = 25;
				newRock.halfWidth = 12.5;
				newRock.halfHeight = 12.5;
			} else {
				newRock.scoreValue = smlRockScore;
				newRock.width = 16;
				newRock.height = 16;
				newRock.halfWidth = 8;
				newRock.halfHeight = 8;
			}

			newRock.scale = scale;
			newRock.x = x;
			newRock.y = y;

			newRock.dx = Math.random() * 3;
			if (Math.random() < 0.5) {
				newRock.dx *= -1;
			}

			newRock.dy = Math.random() * 3;
			if (Math.random() < 0.5) {
				newRock.dy *= -1;
			}

			newRock.rotationInc = (Math.random() * 5) +1;
			if (Math.random() < 0.5) {
				newRock.rotation *= -1;
			}

			newRock.rotation = 0;
			rocks.push(newRock);
		}
	}

	function addToScore(value) {
		score += value;
	}

	document.onkeydown = function() {
		e = e ? e : window.event;
		keyPressList[e.keyCode] = true;
	};

	document.onkeyup = function(e) {
		e = e ? e : window.event;
		keyPressList[e.keyCode] = false;
	};

	//** Frame Rate counter 	object prototype
	function frameRateCounter() {
		this.lastFrameCount = 0;
		var dateTemp = new Date();
		this.frameLast = dateTemp.getTime();
		delete dateTemp;
		this.frameCtr = 0;
	}

	frameRateCounter.prototype.countFrames = function() {
		var dateTemp = new Date();
		this.frameCtr++;

		if (dateTemp.getTime() >= this.frameLast + 1000) {
			this.lastFrameCount = this.frameCtr;
			this.frameLast = dateTemp.getTime();
			this.frameCtr = 0;
		}
	};
}