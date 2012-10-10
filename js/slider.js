/**
 * SLider initialization and control
 */
anti.projectSlider = function(slider) {
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
};