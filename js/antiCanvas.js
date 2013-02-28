if (typeof anti !== 'object') {
	anti = {};
}





	// define our game object
	triangleActor = gamvas.Actor.extend({
	    init: function() {
	        var s = gamvas.state.getCurrentState();
	        this.setFile(s.resource.getImage('triangle.png'));
	        this.setCenter(32, 32);
	        this.rotSpeed = Math.random() * Math.PI - 0.5 * Math.PI;
	    },
	 
	    draw: function(t) {
	        this._super(t);
	        this.rotate(this.rotSpeed*t);
	    }
	});
	 
	parallaxState = gamvas.State.extend({
	    init: function() {
	        // load images
	        this.smTree = new gamvas.Image(this.resource.getImage('imgs/smalltree.png'));
	        this.bgTree = new gamvas.Image(this.resource.getImage('imgs/tree-twotrunks.png'));
	        
			this.grass = new gamvas.Image(this.resource.getImage('imgs/grass.png'));
			this.grass2 = new gamvas.Image(this.resource.getImage('imgs/grass2.png'));

	        this.smCloud = new gamvas.Image(this.resource.getImage('imgs/clouds-s.png'));
	        this.medCloud = new gamvas.Image(this.resource.getImage('imgs/clouds-m.png'));
	        this.bgCloud = new gamvas.Image(this.resource.getImage('imgs/clouds-b.png'));

	        // add random game objects
	        for (var i = 0; i < 20; i++) {
	                var act = new triangleActor('actor' + i, Math.random() * 1000, Math.random() * 480 - 240);
	                this.addActor(act);
	        }
	        this.dim = gamvas.getCanvasDimension();
	    },
	 
	    preDraw: function(t) {
	        // draw our background before camera is applied
	        this.bgTree.draw(t);
	    },
	 
	    postDraw: function(t) {
	        if (!gamvas.isSet(this.worldSize)) {
	            // our wold is set between our background and foreground image, so our wold size
	            // is the background image width + the half of the difference of foreground - background width
	            this.worldSize = this.bgTree.image.width + 0.5 * (this.smTree.image.width - this.bgTree.image.width);

	            // calculate camera limits
	            this.lowerLimit = Math.floor(this.dim.w / 2);
	            this.upperLimit = Math.floor(this.worldSize - (this.dim.w / 2));
	            this.camera.setPosition(this.lowerLimit, 0);
	        }
	        this.smTree.draw(t);
	 
	        // move camera within its limits
	        if (gamvas.key.isPressed(gamvas.key.LEFT)) {
	            this.camera.move( -150 * t, 0);
	            if (this.camera.position.x < this.lowerLimit) {
	                this.camera.position.x = this.lowerLimit;
	            }
	        }
	 
	        if (gamvas.key.isPressed(gamvas.key.RIGHT)) {
	            this.camera.move( 150 * t, 0);
	            if (this.camera.position.x > this.upperLimit) {
	                this.camera.position.x = this.upperLimit;
	            }
	        }
	 
	        // get the camera position (we limit movement to x)
	        var cx = this.camera.position.x;

	        // get a factor of your current position, so 0 would be fully left and 1 would be fully right
	        var posfact = (this.camera.position.x - this.lowerLimit) / (this.upperLimit - this.lowerLimit);

	        // calculate our foreground position by adding the difference of screen width and foreground
	        // width multiplied with the position factor
	        var smTreepos = (this.smTree.image.width - this.dim.w) * posfact;
	        // set the clip rectangle, so only screen width from the current position is drawn
	        this.smTree.setClipRect(smTreepos, 0, this.dim.w, this.smTree.image.height);
	        // move the image so it starts left of the screen
	        this.smTree.position.x = -smTreepos;

	        // do the same for the background
	        var bgTreepos = (this.bgTree.image.width - this.dim.w) * posfact;
	        this.bgTree.setClipRect(bgTreepos, 0, this.dim.w, this.bgTree.image.height);
	        this.bgTree.position.x = -bgTreepos;
	    }
	});
	 
	// prevent the browser from scrolling on keyboard input
	gamvas.config.preventKeyEvents = true;
	 
	gamvas.event.addOnLoad(function() {
	    gamvas.state.addState(new parallaxState('parallaxState'));
	    gamvas.start('bgGame');
	});