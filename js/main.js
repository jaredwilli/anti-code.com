anti = {
	common: {
		init: function() {
			anti.init();
		}
	},
	
	init: function() {
		var winWidth = window.innerWidth
			winHeight = window.innerHeight,
			mainNav = $('#main-nav').find('a');
		
		$('body').css({ height: winHeight });
		$('#layer3').css({ width: winWidth +'px', height: winHeight +'px' });
		$('.panel').css({ width: winWidth - (3 * $('#layer3').css('left').split('px')[0]) +'px', height: winHeight - 160 +'px' });

		
		// Setup navigation
		anti.navigation.setUp();

		// Set up project image sliders
		anti.projectSlider($('.slider'));
	},
	
	navigation: {
		// property to track the current section loaded
		currentSection: '#panel5',

		// Constants for nav functionality
		BASE_DURATION: 	1000,
		MAX_DURATION: 	2000,
		EASING_TYPE: 	'easeOutQuart',
		MENU_SET: 		$('#main-nav').find('a'),
		CONTENT_LAYER: 	$('#layer3'),

		LAYER_SET: {
			smClouds: $('#sm-clouds'),
			layer5: $('#layer5'),
			medClouds: $('#med-clouds'),
			layer4: $('#layer4'),
			layer3: $('#layer3'),
			bigClouds: $('#big-clouds'),
			layer1: $('#layer1')
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
		
		X_ADJUST_1: 1,
		Y_ADJUST_1: 1.4,
		X_ADJUST_2: 1,
		Y_ADJUST_2: 1.26,
		X_ADJUST_4: 1,

		init: function() {
			// These properties need to be in the init
			var an = anti.navigation;
			an.X_ADJUST_1 = 1;
			an.Y_ADJUST_1 = 1.4;
			an.X_ADJUST_2 = 1;
			an.Y_ADJUST_2 = 1.26;
			an.X_ADJUST_4 = 1;
		},

		// sets up handlers on nav elements and maps handlers, with target params
		setUp: function() {
			//console.log("setup");
			var an = anti.navigation;

			an.MENU_SET.on('click', function(e) {
				var targetName = $(this).attr('href');
				targetName = targetName.split('#');
				//console.log(targetName[1]);

				an.navigateToSection(targetName[1]);
				e.preventDefault();
			});
		},

		navigateToSection: function(panelToLoad) {
			var an = anti.navigation;

			//console.log('panelToLoad: ', an.TARGET_LAYER3[panelToLoad].url);

			//window.history.pushState(panelToLoad, $('#'+ panelToLoad).find('h2').text(), '#'+ panelToLoad);
			//window.location.hash = '#'+ panelToLoad;

			$('#main-nav').find('.active').removeClass('active');
			$('#main-nav').find('a[href='+ an.TARGET_LAYER3[panelToLoad].url +']').addClass('active');

			// load target panel's content
			//anti.panelNavigation.panelLoading.loadPanel(sectionToLoad);

			//set now to the section about to be loaded into view
			an.currentSection = panelToLoad;

			// sends name of target panel
			an.moveAll(panelToLoad);
	    },

	    // method accepts string of target panel for which to apply position translation animations
	    moveAll: function(panelToLoad) {
	        var an = anti.navigation;

	        var layer3Width  = an.CONTENT_LAYER.width(),
	        	layer3Height = an.CONTENT_LAYER.height(),
	        	layer3Top = parseInt(an.CONTENT_LAYER.css('top').split('px')[0], 10),
	        	layer3Left = parseInt(an.CONTENT_LAYER.css('left').split('px')[0], 10);

	        an.TARGET_LAYER3.prototype = an.TARGET_LAYER3;
	        //console.log('prototype:', an.TARGET_LAYER3.prototype);

	        var layer3 = an.TARGET_LAYER3.prototype[panelToLoad],
				layer3x = (layer3.coords[0] * -1) + 100,
				layer3y = layer3.coords[1] * -1;

	        // first calculate the position constants by which to translate other panel positions
	        var contentLayerW = 3 * an.CONTENT_LAYER.width(),
	        	contentLayerExtraX = contentLayerW - layer3Width,
	            xPosConstant = layer3.coords[0] / contentLayerExtraX;

	        console.log('layer3:', layer3, contentLayerExtraX, contentLayerW, layer3Width, xPosConstant);
			

	        var layer1w = an.LAYER_SET.layer1.width(),
	        	layer1ExtraX = layer1w - $('.panel').width(),
	        	layer1x = layer1ExtraX * xPosConstant * -1 * an.X_ADJUST_1;

	        console.log(layer3Left, layer1x);

	        var bigCloudsExtraX = an.LAYER_SET.bigClouds.width() - $('.panel').width(),
	        	bigCloudsx = bigCloudsExtraX * xPosConstant * -1 * an.X_ADJUST_2;
	        	
	        var layer4w = an.LAYER_SET.layer4.width(),
	        	layer4ExtraX = layer4w - $('.panel').width(),
	        	layer4x = layer4ExtraX * xPosConstant * -1 * an.X_ADJUST_1;

	        var layer5w = an.LAYER_SET.layer5.width(),
	        	layer5ExtraX = layer5w - $('.panel').width(),
	        	layer5x = layer5ExtraX * xPosConstant * -1 * an.X_ADJUST_1;

	        //formula for y translation is (layerH/frontH)(frontY)([optional multiplier])
	        
	        var layer1y = (parseInt(an.LAYER_SET.layer1.css('bottom').split('px')[0], 10) - .5) * -1, // (an.LAYER_SET.layer1.css('height').split('px')[0] / an.LAYER_SET.layer3.css('height').split('px')[0]) * layer3.coords[1] * an.Y_ADJUST_1 * -1,
	            bigCloudsy = (an.LAYER_SET.bigClouds.css('height').split('px')[0] / an.LAYER_SET.layer3.css('height').split('px')[0]) * layer3.coords[1] * an.Y_ADJUST_2 * -1,
	            layer4y = (parseInt(an.LAYER_SET.layer4.css('bottom').split('px')[0], 10) - .5) * -1,
	            layer5y = (parseInt(an.LAYER_SET.layer5.css('bottom').split('px')[0], 10) - .5) * -1;
	        
	        var layers = {
	        	layer1: [layer1x,  layer1y],
             	bClouds: [bigCloudsx,  bigCloudsy],
             	layer3: [layer3x,  layer3y],
	            layer4: [layer4x,  layer4y],
	            layer5: [layer5x,  layer5y]
	        };
	        an.animateEm(layers)
	    },

	    animateEm: function(layers) {
			var an = anti.navigation;

			console.log(layers);

	    	// check for travel distance to set animation duration based on how far to slide
			var xDiff = Math.abs( (Number(an.LAYER_SET.layer3.css('left').split('px')[0]) + 100000) - (layers.layer3[0] + 100000) );

	        // calculate the adjusted animation duration
	        var thisDuration = Math.round( xDiff / Number(an.LAYER_SET.layer3.css('width').split('px')[0]) * (an.MAX_DURATION - an.BASE_DURATION) + an.BASE_DURATION );

	        // run the animations
	        an.LAYER_SET.layer1.stop().animate({
	        	left: layers.layer1[0] +'px',
	        	bottom: layers.layer1[1] +'px'
	        }, thisDuration, an.EASING_TYPE);

	        an.LAYER_SET.bigClouds.stop().animate({
	        	left: layers.bClouds[0] +'px',
	        	top: layers.bClouds[1] +'px'
	        }, thisDuration, an.EASING_TYPE);

	        an.LAYER_SET.layer4.stop().animate({
	        	left: layers.layer4[0] +'px',
	        	bottom: layers.layer4[1] +'px'
	        }, thisDuration, an.EASING_TYPE);

	        an.LAYER_SET.layer5.stop().animate({
	        	left: layers.layer5[0] +'px',
	        	bottom: layers.layer5[1] +'px'
	        }, thisDuration, an.EASING_TYPE);


	    	/* CONTENT LAYER ANIMATING */
	    	an.LAYER_SET.layer3.stop().animate({
	    		left: layers.layer3[0] +'px',
	    		top: layers.layer3[1] +'px' 
	    	}, thisDuration, an.EASING_TYPE);
	    }
	},
	
	/**
	 * SLider initialization and control
	 */
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
	},
	resizeBroser: function() {

	}
}

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