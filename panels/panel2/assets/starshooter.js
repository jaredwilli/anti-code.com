/* Author: Jared Williams - @jaredwilli
     ___,    ___     _,_  
    {O,0}   {-.-}   {o,O}
    |)__)   |)~(|   (~~(|
,----"-"-----"-"-----"-"-----,
)   --    --    --     --   _(
\_,------------------------.__)
*/
(function($) {
	var canvas = document.querySelector('#can'),
		con = canvas.getContext('2d');
	
	// Canvas dimensions
	var cwidth = canvas.width,
		cheight = canvas.height;
	
	// Game settings
	var play,
		platformX,
		platformY,
		platformOuterRadius,
		platformInnerRadius,
		stars, // Array that holds all the stars
		player,
		playerOriginX,
		playerOriginY,
		playerSelected,
		playerMaxAbsVelocity,
		playerVelocityDampener,
		powerX,
		powerY,
		score;
	
	// Game UI
	var ui = $('#game-ui'),
		uiIntro = $('#game-intro'),
		uiStats = $('#game-stats'),
		uiComplete = $('#game-complete'),
		uiPlay = $('#game-play'),
		uiReset = $('.game-reset'),
		uiRemain = $('#game-remain'),
		uiScore = $('.game-score');

	// Constructor that defines new stars to draw
	var Star = function(x, y, radius, mass, friction, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.mass = mass;
		this.friction = friction;
		this.color = color;
		this.vX = 0;
		this.vY = 0;
		this.player = false;
	};
	
	// Reset player
	function resetPlayer() {
		player.x = playerOriginX;
		player.y = playerOriginY;
		player.vX = 0;
		player.vY = 0;
	}
	
	// Reset and start the game
	function start() {
		// Reset game stats
		uiScore.html('0');
		uiStats.show();
		
		// Set up initial game settings
		play = false;
		platformX = cwidth / 2;
		platformY = 150;
		platformOuterRadius = 100;
		platformInnerRadius = 75;
		stars = [];
		playerOriginX = cwidth / 2;
		playerOriginY = cheight - 150;
		playerSelected = false;
		playerMaxAbsVelocity = 30;
		playerVelocityDampener = 0.3;
		powerX = -1;
		powerY = -1;
		score = 0;
		
		// Set up player star
		var pRadius = 15,
			pMass = 10,
			pFriction = 0.97,
			pColor = 'hsl(11, 94%, 50%)';
		player = new Star(playerOriginX, playerOriginY, pRadius, pMass, pFriction, pColor);
		player.player = true;
		stars.push(player);
		
		// Set up other stars
		var outerRing = 8, // Stars around outer ring
			ringCount = 3, // Number of rings
			ringSpacing = (platformInnerRadius / (ringCount - 1)); // Distance between each ring
		
		for( var r = 0; r < ringCount; r++ ) {
			var currentRing = 0, // Stars around current ring
				angle = 0, // Angle between each star
				ringRadius = 0;
			
			// Is this the innermost ring?
			if( r == ringCount - 1 ) {
				currentRing = 1;
			} else {
				currentRing = outerRing - (r * 3);
				angle = 360 / currentRing;
				ringRadius = platformInnerRadius - (ringSpacing * r);
			}
			
			for( var s = 0; s < currentRing; s++ ) {
				var x = 0,
					y = 0;
				
				// Is this the innermost ring?
				if( r == ringCount - 1 ) {
					x = platformX;
					y = platformY;
				} else {
					x = platformX + (ringRadius * Math.cos((angle * s) * (Math.PI/180)) );
					y = platformY + (ringRadius * Math.sin((angle * s) * (Math.PI/180)) );
				}
			
				var radius = 10,
					mass = 5,
					friction = 0.95,
					rgb = [];
				
				// generate an rgb color ranging from values between 154-255
				for( var p = 0; p < 3; p++ ) {
					var color = 154 + (Math.floor(Math.random()*105));
					rgb.push(color);
				}
				rgb = 'rgba(' + rgb.toString() + ',1)';
								
				stars.push(new Star(x, y, radius, mass, friction, rgb));
			}
		}
		
		uiRemain.html(stars.length - 1);
		
		// Same code as getting pixel values
		$(window).mousedown(function(e) {
			if( !playerSelected && player.x === playerOriginX && player.y === playerOriginY ) {
				var canvasOffset = $('#can').offset(),
					canvasX = Math.floor(e.pageX - canvasOffset.left),
					canvasY = Math.floor(e.pageY - canvasOffset.top);
				
				if( !play ) {
					play = true;
					animate();
				}
				
				var dX = player.x - canvasX,
					dY = player.y - canvasY,
					distance = Math.sqrt((dX * dX) + (dY * dY)),
					padding = 5;
				
				if( distance < player.radius + padding ) {
					powerX = player.x;
					powerY = player.y;
					playerSelected = true;
				}
			}
		});
		
		$(window).mousemove(function(e) {
			if( playerSelected ) {
				var canvasOffset = $('#can').offset(),
					canvasX = Math.floor(e.pageX - canvasOffset.left),
					canvasY = Math.floor(e.pageY - canvasOffset.top);
			
				var dX = canvasX - player.x,
					dY = canvasY - player.y,
					distance = Math.sqrt((dX * dX) + (dY * dY));
				
				if( distance * playerVelocityDampener < playerMaxAbsVelocity ) {
					powerX = canvasX;
					powerY = canvasY;
				} else {
					var ratio = playerMaxAbsVelocity / (distance * playerVelocityDampener);
					powerX = player.x + (dX * ratio);
					powerY = player.y + (dY * ratio);
				}
			}
		});
		
		$(window).mouseup(function(e) {
			if( playerSelected ) {
				var dX = powerX - player.x,
					dY = powerY - player.y;

				player.vX = -(dX * playerVelocityDampener);
				player.vY = -(dY * playerVelocityDampener);
				
				uiScore.html(++score);
			}
			
			playerSelected = false;
			powerX = -1;
			powerY = -1;
		});
		
		// Start the animation loop
		animate();
	}
	
	function drawText() {
		// text Anti-code.com
		con.save();
			con.font = '11px Courier';
			con.fillStyle = 'hsla(240, 8%, 85%,0.5)';
			con.fillText('To play, click and drag the red circle down', 25, 490);
			con.fillText('and aim using the line like a pool stick.', 32, 505);
		con.restore();
		con.save();
			con.font = 'bolder 30px Courier';
			con.fillStyle = 'hsla(240, 4%, 85%,0.5)';
			con.fillText('www.Anti-Code.com', 23, 580);
		con.restore();
	}
	
	// Inititialise the game environment
	function init() {
		uiStats.hide();
		uiComplete.hide();
		
		uiPlay.click(function() {
			uiIntro.hide();
			start();
			return false;
		});
		
		uiReset.click(function() {
			uiComplete.hide();
			start();
			return false;
		});

		drawText();
	}
	
	// Animation loop that does all the fun stuff
	function animate() {		
		// Clear
		con.clearRect(0, 0, cwidth, cheight);
		
		// Draw platform
		con.fillStyle = 'rgb(20, 20, 20)';
		con.beginPath();
		con.arc(platformX, platformY, platformOuterRadius, 0, Math.PI*2, true);
		con.closePath();
		con.fill();

		// Draw player power line
		if( playerSelected ) {
			con.strokeStyle = 'rgb(255, 0, 0)';
			con.lineWidth = 5;
			con.beginPath();
			con.moveTo(player.x, player.y);
			con.lineTo(powerX, powerY);
			con.closePath();
			con.stroke();
		}
				
		con.fillStyle = 'rgb(255, 255, 255)';
		
		// Loop through every star
		var deadStars = [];
		for( var i = 0; i < stars.length; i++ ) {
			var a = stars[i];
			
			for( var j = i + 1; j < stars.length; j++ ) {
				var b = stars[j];
				
				var dX = b.x - a.x,
					dY = b.y - a.y,
					distance = Math.sqrt((dX*dX) + (dY*dY));
				
				if( distance < a.radius + b.radius ) {
					var angle = Math.atan2(dY, dX),
						sine = Math.sin(angle),
						cosine = Math.cos(angle);
					
					// Rotate star A position
					var x = 0,
						y = 0;
					
					// Rotate star B position
					var xB = dX * cosine + dY * sine,
						yB = dY * cosine - dX * sine;
						
					// Rotate star a velocity
					var vX = a.vX * cosine + a.vY * sine,
						vY = a.vY * cosine - a.vX * sine;
					
					// Rotate star B velocity
					var vXb = b.vX * cosine + b.vY * sine,
						vYb = b.vY * cosine - b.vX * sine;
					
					// Conserve momentum
					var vTotal = vX - vXb;
					vX = ((a.mass - b.mass) * vX + 2 * b.mass * vXb) / (a.mass + b.mass);
					vXb = vTotal + vX;
					
					// Move stars apart - THIS 
					xB = x + (a.radius + b.radius);
					
					// Rotate star positions back
					a.x = a.x + (x * cosine - y * sine);
					a.y = a.y + (y * cosine + x * sine);
					
					b.x = a.x + (xB * cosine - yB * sine);
					b.y = a.y + (yB * cosine + xB * sine);
					
					// Rotate star velocities back
					a.vX = vX * cosine - vY * sine;
					a.vY = vY * cosine + vX * sine;
					
					b.vX = vXb * cosine - vYb * sine;
					b.vY = vYb * cosine + vXb * sine;
				}
			}
			
			// Calculate new position
			a.x += a.vX;
			a.y += a.vY;
			
			// Friction
			if( Math.abs(a.vX) > 0.1 ) {
				a.vX *= a.friction;
			} else {
				a.vX = 0;
			}
			
			if( Math.abs(a.vY) > 0.1 ) {
				a.vY *= a.friction;
			} else {
				a.vY = 0;
			}
			
			// Platform checks
			if( !a.player ) {
				var dXp = a.x - platformX,
					dYp = a.y - platformY,
					distanceP = Math.sqrt((dXp * dXp) + (dYp * dYp));
				if( distanceP > platformOuterRadius ) {
					// Kill star
					if( a.radius > 0 ) {
						a.radius -= 2;
					} else {
						deadStars.push(a);
					}
				}
			}
			
			// Check to see if need to reset the player
			// If player was moving, but is now still
			if( player.x !== playerOriginX && player.y !== playerOriginY ) {
				if( player.vX === 0 && player.vY === 0 ) {
					resetPlayer();
				} else if( player.x + player.radius < 0 ) {
					resetPlayer();
				} else if( player.x - player.radius > cwidth ) {
					resetPlayer();
				} else if( player.y + player.radius < 0 ) {
					resetPlayer();
				} else if( player.y - player.radius > cheight ) {
					resetPlayer();
				}
			}
			
			
			con.beginPath();
			if( !a.player ) {
				con.arc(a.x, a.y, Math.random()*10, 0, Math.PI*2, a.friction, true);
			} else {
				con.arc(a.x, a.y, a.mass, 0, Math.PI*2, a.friction, true);
			}
			con.closePath();
			con.fillStyle = a.color;
			con.fill();
		}
		
		if( deadStars.length > 0 ) {
			for( var di = 0; di < deadStars.length; di++ ) {
				var d = deadStars[di];
				stars.splice(stars.indexOf(d), 1);
			}
			
			var remaining = stars.length - 1; // Remove player from star count
			uiRemain.html(remaining);
			
			if( remaining === 0 ) {
				// Winner!
				play = false;
				uiStats.hide();
				uiComplete.show();

				// Reset event handlers
				$(window).unbind('mousedown mouseup mousemove');
			}
		}
		
		drawText();
		
		if( play ) {
			// Run the animation loop again in 33 milliseconds
			// Use requestAnimFrame for better performance
			requestAnimationFrame(animate, 33);
		}
	}
	
	init();

})(jQuery);