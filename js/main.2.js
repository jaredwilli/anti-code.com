(function() {
	var game = new Game('antiGame', 'bgGame'),
		// Make some sprites and use game.addSprite()

		s1 = new Sprite(),
		s2 = new Sprite(), // draw on top of s1

		// Scrolling the background
		translateDelta = 0.025,
		translateOffsetX = 0,
		translateOffsetY = 0;


	scrollBackground: function() {
		translateOffsetX = (translateOffsetX - translateDelta) % game.canvas.width;
		translateOffsetY = (translateOffsetY - translateDelta) % game.canvas.height;

		game.ctx.translate(-translateOffsetX, -translateOffsetY);
	},

	// Paint methods



   loading = false,  // not yet, see the end of this file
   loadingToast = document.getElementById('loadingToast'),
   loadingMessage = document.getElementById('loadingMessage'),
   loadingToastTitle = document.getElementById('loadingToastTitle'),
   loadingToastBlurb = document.getElementById('loadingToastBlurb'),
   loadButton = document.getElementById('loadButton'),
   progressDiv = document.getElementById('progressDiv'),
   progressbar = new COREHTML5.Progressbar(300, 25, 'rgba(0,0,0,0.5)', 100, 130, 250),

   // Score

   scoreToast = document.getElementById('scoreToast'),
   scoreReadout = document.getElementById('score'),
   score = 0,
   lastScore = 0,
   lastScoreUpdate = undefined,

   // High Score

   HIGH_SCORES_DISPLAYED = 10,

   highScoreToast = document.getElementById('highScoreToast'),
   highScoreParagraph = document.getElementById('highScoreParagraph'),
   highScoreList = document.getElementById('highScoreList'),
   previousHighScoresTitle = document.getElementById('previousHighScoresTitle'),
   nameInput = document.getElementById('nameInput'),
   addMyScoreButton = document.getElementById('addMyScoreButton'),
   newGameButton = document.getElementById('newGameButton'),
   newGameFromHighScoresButton =
         document.getElementById('newGameFromHighScoresButton'),
   clearHighScoresCheckbox = document.getElementById('clearHighScoresCheckbox'),

   // Lives

   livesCanvas = document.getElementById('livesCanvas'),
   livesContext = livesCanvas.getContext('2d'),
   livesLeft = 3,
   life = 100,

   // Paused

   pausedToast = document.getElementById('pausedToast'),

   // Game Over

   gameOverToast = document.getElementById('gameOverToast'),
   gameOver = false,

   // Sun Constants

   SUN_TOP = 110,
   SUN_LEFT = 450,
   SUN_RADIUS = 80,

   // Key Listeners

   lastKeyListenerTime = 0,  // For throttling arrow keys, see below

   // Lose life

   loseLifeToast = document.getElementById('loseLifeToast'),
   loseLifeButton = document.getElementById('loseLifeButton'),

   // Scrolling the background

   translateDelta = 0.025,
   translateOffset = 0,

   scrollBackground = function() {
      translateOffset =
         (translateOffset + translateDelta) % game.ctx.canvas.width;
      game.ctx.translate(-translateOffset,0);
   },

   // Paint Methods

   paintSun = function(ctx) {
      ctx.save();
         ctx.strokeStyle = 'orange';
         ctx.fillStyle = 'yellow';
         ctx.lineWidth = 1;

         ctx.beginPath();
            ctx.arc(SUN_LEFT, SUN_TOP, SUN_RADIUS, 0, Math.PI * 2, true);

         ctx.fill();
         ctx.stroke();
      ctx.restore();
   },

   paintFarCloud = function(ctx, x, y) {
      ctx.save();
         scrollBackground();

         ctx.lineWidth=0.5;
         ctx.strokeStyle='rgba(100, 140, 230, 0, 0.8)';
         ctx.fillStyle='rgba(255,255,255,0.4)';

         ctx.beginPath();
            ctx.moveTo(x + 102, y + 91);
               ctx.quadraticCurveTo(x+180, y+110, x+250, y+90);
               ctx.quadraticCurveTo(x+312, y+87, x+279, y+60);
               ctx.quadraticCurveTo(x+321, y+20, x+265, y+20);
               ctx.quadraticCurveTo(x+219, y+4, x+171, y+23);
               ctx.quadraticCurveTo(x+137, y+5, x+104, y+18);
               ctx.quadraticCurveTo(x+57, y+23, x+79, y+48);
               ctx.quadraticCurveTo(x+57, y+74, x+104, y+92);
         ctx.closePath();

         ctx.stroke();
         ctx.fill();
      ctx.restore();
   },

   paintNearCloud = function(ctx, x, y) {
      ctx.save();
         scrollBackground();
         scrollBackground();

         ctx.lineWidth = 0.5;
         ctx.strokeStyle = 'rgba(100, 140, 230, 0.8)';
         ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

         ctx.beginPath();

            ctx.moveTo(x + 364, y + 37);
               ctx.quadraticCurveTo(x + 426, y + 28, x + 418, y + 72);
               ctx.quadraticCurveTo(x + 450, y + 123, x + 388, y + 114);
               ctx.quadraticCurveTo(x + 357, y + 144, x + 303, y + 115);
               ctx.quadraticCurveTo(x + 251, y + 118, x + 278, y + 83);
               ctx.quadraticCurveTo(x + 254, y + 46, x + 320, y + 46);
               ctx.quadraticCurveTo(x + 326, y + 12, x + 362, y + 37);
         ctx.closePath();

         ctx.stroke();
         ctx.fill();
      ctx.restore();
   },

   // Game over

   over = function() {
      var highScore;
      highScores = game.getHighScores();

      if (highScores.length == 0 || score > highScores[0].score) {
         showHighScores();
      }
      else {
        gameOverToast.style.display = 'inline';
      }

      gameOver = true;
      lastScore = score;
      score = 0;
   };


   // Pause and Auto-pause

   togglePaused = function() {
      game.togglePaused();
      pausedToast.style.display = game.paused ? 'inline' : 'none';
   };

   pausedToast.onclick = function(e) {
      pausedToast.style.display = 'none';
      togglePaused();
   };

   window.onblur = function windowOnBlur() {
      if (!loading && !gameOver && !game.paused) {
         togglePaused();
         pausedToast.style.display = game.paused ? 'inline' : 'none';
      }
   };

   window.onfocus = function windowOnFocus() {
      if (game.paused) {
         togglePaused();
         pausedToast.style.display = game.paused ? 'inline' : 'none';
      }
   };


   // New game

   newGameButton.onclick = function(e) {
      gameOverToast.style.display = 'none';
      loseLifeToast.style.display = 'inline';
      startNewGame();
   };

   function startNewGame() {
      highScoreParagraph.style.display = 'none';
      gameOver = false;
      livesLeft = 3;
      score = 0;
      loseLifeButton.focus();
   };

   // High Scores

   // Change game display to show high scores when
   // player bests the high score.

   showHighScores = function() {
      highScoreParagraph.style.display = 'inline';
      highScoreParagraph.innerHTML = score;
      highScoreToast.style.display = 'inline';
      updateHighScoreList();
      nameInput.focus();
   };

   // The game shows the list of high scores in
   // an ordered list. This method creates that
   // list element, and populates it with the
   // current high scores.

   updateHighScoreList = function() {
      var highScores = game.getHighScores(),
          length = highScores.length,
          listParent = highScoreList.parentNode,
          highScore, el;

      listParent.removeChild(highScoreList);
      highScoreList = document.createElement('ol');
      highScoreList.id = 'highScoreList'; // So CSS takes effect
      listParent.appendChild(highScoreList);

      if (length > 0) {
         previousHighScoresTitle.style.display = 'block';

         length = length > 10 ? 10 : length;

         for (var i = 0; i < length; ++i) {

            highScore = highScores[i];
            el = document.createElement('li');
            el.innerHTML = highScore.score +' by ' + highScore.name;
            highScoreList.appendChild(el);
         }
      }
      else {
         previousHighScoresTitle.style.display = 'none';
      }
   }

   // The browser invokes this method when the user clicks on the
   // Add My Score button.

   addMyScoreButton.onclick = function(e) {
      game.setHighScore({
         name: nameInput.value,
         score: lastScore
      });

      updateHighScoreList();
      addMyScoreButton.disabled = 'true';
      nameInput.value = '';
   };


   // The browser invokes this method when the user clicks on the
   // new game button.

   newGameFromHighScoresButton.onclick = function(e) {
      loseLifeToast.style.display = 'inline';
      highScoreToast.style.display = 'none';
      startNewGame();
   };

   // The Add My Score button is only enabled when there
   // is something in the nameInput field.

   nameInput.onkeyup = function(e) {
      if (nameInput.value.length > 0) {
         addMyScoreButton.disabled = false;
      }
      else {
         addMyScoreButton.disabled = true;
      }
   };

   // Score Display

   updateScore = function() {
      if ( !loading && game.lastScoreUpdate !== undefined) {
         if (game.gameTime - game.lastScoreUpdate > 1000) {
            scoreToast.style.display = 'inline';
            score += 10;
            scoreToast.innerHTML = score.toFixed(0);
            game.lastScoreUpdate = game.gameTime;
         }
      }
      else {
         game.lastScoreUpdate = game.gameTime;
      }
   };

   // Lives Display

   updateLivesDisplay = function() {
      var x, y, RADIUS = 10;

      livesCtx.clearRect(0, 0, livesCanvas.width, livesCanvas.height);

      for (var i = 0; i < livesLeft; ++i) {
         x = 20 + i*25;
         y = 20;

         livesCtx.beginPath();
            livesCtx.arc(x, y, RADIUS, 0, Math.PI * 2, false);
            livesCtx.fill();
         livesCtx.strokeText(parseInt(i + 1), x - RADIUS / 3, y + RADIUS / 3);
         livesCtx.stroke();
      }
   };

   // Game Paint Methods

   game.paintOverSprites = function() {
      paintNearCloud(game.context, 120, 20);
      paintNearCloud(game.context, game.ctx.canvas.width + 120, 20);
   }

   game.paintUnderSprites = function() { // Draw things other than sprites
      if (!gameOver && livesLeft === 0) {
            over();
      }
      else {
         paintSun(game.context);
         paintFarCloud(game.context, 20, 20);
         paintFarCloud(game.context, game.ctx.canvas.width + 20, 20);

         if (!gameOver) {
            updateScore();
         }
         updateLivesDisplay();
      }
   };

   // Key Listeners

   game.addKeyListener({
      key: 'p',
      listener: function() {
         game.togglePaused();
      }
   });

   game.addKeyListener({
      key: 'right',
      listener: function() {
         var now = +new Date();
         if (now - lastKeyListenerTime > 200) { // throttle
            lastKeyListenerTime = now;
         }
      }
   });

   game.addKeyListener({
      key: 'left',
      listener: function() {
         var now = +new Date();
         if (now - lastKeyListenerTime > 200) { // throttle
            lastKeyListenerTime = now;
         }
      }
   });

   // Initialization

   livesctx.strokeStyle = 'slateblue';
   livesctx.fillStyle = 'yellow';

   // End game button

   loseLifeButton.onclick = function(e) {
      livesLeft--;
      game.playSound('whoosh');

      if (livesLeft === 0) {
         loseLifeToast.style.display = 'none';
      }
   };

   clearHighScoresCheckbox.onclick = function(e) {
      if (clearHighScoresCheckbox.checked) {
         game.clearHighScores();
      }
   };

   // Load game

   loading = true;

   loadButton.onclick = function(e) {
      var interval,
          loadingPercentComplete = 0;

      e.preventDefault();

      loadButton.style.display = 'none';

      loadingMessage.style.display = 'block';
      progressDiv.style.display = 'block';

      progressDiv.appendChild(progressbar.domElement);

      game.queueImage('images/image1.png');
      game.queueImage('images/image2.png');
      game.queueImage('images/image3.png');
      game.queueImage('images/image4.png');
      game.queueImage('images/image5.png');
      game.queueImage('images/image6.png');
      game.queueImage('images/image7.png');
      game.queueImage('images/image8.png');
      game.queueImage('images/image9.png');
      game.queueImage('images/image10.png');
      game.queueImage('images/image11.png');
      game.queueImage('images/image12.png');

      interval = setInterval( function(e) {
         loadingPercentComplete = game.loadImages();

         if (loadingPercentComplete === 100) {
            clearInterval(interval);

            setTimeout( function(e) {
               loadingMessage.style.display = 'none';
               progressDiv.style.display = 'none';

               setTimeout( function(e) {
                  loadingToastBlurb.style.display = 'none';
                  loadingToastTitle.style.display = 'none';

                  setTimeout( function(e) {
                     loadingToast.style.display = 'none';
                     loseLifeToast.style.display = 'block';
                     game.playSound('pop');

                     setTimeout( function(e) {
                        loading = false;
                        score = 10;
                        scoreToast.innerText = '10'; // won't get set till later, otherwise
                        scoreToast.style.display = 'inline';
                        game.playSound('pop');
                        loseLifeButton.focus();
                     }, 1000);
                  }, 500);
               }, 500);
            }, 500);
         }
         progressbar.draw(loadingPercentComplete);
      }, 16);
   };

   // Start game

   game.start();


	game.addSprite(s1);
	game.addSprite(s2);


	// Animation callbacks

	game.paintUnderSprites = function() {
		drawBackground(); // TODO: make this
		// paint under sprites...
	};

	game.paintOverSprites = function() {
		// paint over
		if (! gameOver && livesLeft === 0) {
			over();
		}
		else {
			//paintSun(game.ctx);
			paintBigCloud(game.ctx, game.ctx.width, game.ctx.height);
			paintMedCloud(game.ctx, game.ctx.width - 20, game.ctx.height - 20);
			paintSmallCloud(game.ctx, game.ctx.width - 40, game.ctx.height - 40);

			if (! gameOver) {
				updateScore();
			}

			updateLivesDisplay();
		}
	};

	game.startAnimate = function() {
		// what to do at beginning of animation frame
	};

	game.endAnimate = function() {
		// what to do at end of animation frame
	};

	// Start game

	game.start();

