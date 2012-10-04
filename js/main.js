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
			layer5: {
				selector: $('#layer5'),
				coords: [-2700, -200] // [left, bottom]
			},
			layer4: {
				selector: $('#layer4'),
				coords: [-2500, -210] // [left, bottom]
			},
			layer3: {
				selector: $('#layer3'),
				coords: [100, 0] 	// [left, top]
			},
			layer1: {
				selector: $('#layer1'),
				coords: [-2300, -220] 	// [left, bottom]
			},
			bigClouds: {
				selector: $('#big-clouds'),
				coords: [] 	// [left, top]
			},
			smClouds: {
				selector: $('#sm-clouds'),
				coords: [] 	// [left, top]
			},
			medClouds: {
				selector: $('#med-clouds'),
				coords: [] 	// [left, top]
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
		
		X_ADJUST_1: 0.001,
		Y_ADJUST_1: 0.14,

		X_ADJUST_2: 0.1,
		Y_ADJUST_2: 0.126,
		
		X_ADJUST_4: 0.1,

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
	    // TODO: BIG TIME - this whole method needs to be done more abstractly and better!!!
	    moveAll: function(panelToLoad) {
	        var an = anti.navigation;

	        an.TARGET_LAYER3.prototype = an.TARGET_LAYER3;
	        an.LAYER_SET.prototype = an.LAYER_SET;
	        //console.log('prototype:', an.LAYER_SET.prototype);

	        var layer3 = an.TARGET_LAYER3.prototype[panelToLoad],
	        	layer3W = $(layer3.url).width(),
	        	layer3H = $(layer3.url).height(),
				layer3x = (layer3.coords[0] * -1) + 100,
				layer3y = layer3.coords[1] * -1;

	        // First calculate the position constants by which to translate other panel positions
	        var xPosConstant = (an.CONTENT_LAYER.width() - layer3W) / layer3x,
	        	yPosConstant = (an.CONTENT_LAYER.height() - layer3H) / layer3y;
	        
	        // background wave layer X position
	        var layer1 = an.LAYER_SET.prototype.layer1,
	        	layer1x = ((layer1.selector.width() - layer3W) * xPosConstant) * -1 * an.X_ADJUST_1,
	        	layer1y = ((layer1.selector.height() / layer3H) * yPosConstant) * an.Y_ADJUST_1 * -1

	        // middle wave layer X position
	        var layer4 = an.LAYER_SET.prototype.layer4,
	        	layer4x = ((layer4.selector.width() - layer3W) * xPosConstant) * -1 * an.X_ADJUST_1,
	        	layer4y = ((layer4.selector.height() / layer3H) * yPosConstant) * an.Y_ADJUST_1 * -1;
	        
	        // top wave layer X position
	        var layer5 = an.LAYER_SET.prototype.layer5,
	        	layer5x = ((layer5.selector.width() - layer3W) * xPosConstant) * -1 * an.X_ADJUST_1,
	        	layer5y = ((layer5.selector.height() / layer3H) * yPosConstant) * an.Y_ADJUST_1 * -1;
	        
	        // background clouds layer X position
	        var bigClouds = an.LAYER_SET.prototype.bigClouds,
	        	bigCloudsX = ((bigClouds.selector.width() - layer3W) * xPosConstant) * -1 * an.X_ADJUST_1,
	        	bigCloudsY = ((bigClouds.selector.height() / layer3H) * yPosConstant) * an.Y_ADJUST_2 * -1;
	        
	        // middle clouds layer X position
	        var medClouds = an.LAYER_SET.prototype.medClouds,
	        	medCloudsX = ((medClouds.selector.width() - layer3W) * xPosConstant) * -1 * an.X_ADJUST_1,
	        	medCloudsY = ((medClouds.selector.height() / layer3H) * yPosConstant) * an.Y_ADJUST_2 * -1;
	        
	        // top clouds layer X position
	        var smClouds = an.LAYER_SET.prototype.smClouds,
	        	smCloudsX = ((smClouds.selector.width() - layer3W) * xPosConstant) * -1,
	        	smCloudsY = ((smClouds.selector.height() / layer3H) * yPosConstant) * an.Y_ADJUST_2 * -1;
	        
	        //formula for y translation is (layerH/frontH)(frontY)([optional multiplier])


	        var layers = {
	        	layer1: [layer1x, layer1y],
	            layer4: [layer4x, layer4y],
	            layer5: [layer5x, layer5y],
             	bClouds: [bigCloudsX, bigCloudsY],
             	mClouds: [medCloudsX, medCloudsY],
             	sClouds: [smCloudsX, smCloudsY],
             	layer3: [layer3x,  layer3y]
	        };

	        //console.debug(layers);
	        an.animateEm(layers)
	    },

	    animateEm: function(layers) {
			var an = anti.navigation;

			an.LAYER_SET.prototype = an.LAYER_SET;
			
			var	layersProto = an.LAYER_SET.prototype;

			console.log(layers);
			console.log(layersProto);


	    	// check for travel distance to set animation duration based on how far to slide
			var xDiff = Math.abs( (Number(layersProto.layer3.selector.css('left').split('px')[0]) + 100000) - (layers.layer3[0] + 100000) );

	        // calculate the adjusted animation duration
	        var thisDuration = Math.round( xDiff / Number(layersProto.layer3.selector.css('width').split('px')[0]) * (an.MAX_DURATION - an.BASE_DURATION) + an.BASE_DURATION );

	        // run the animations

	        // background wave
	        layersProto.layer1.selector.stop().animate({
	        	left: layers.layer1[1] +'px',
	        	bottom: layers.layer1[0] +'px'
	        }, thisDuration, an.EASING_TYPE);

	        // middle wave
	        layersProto.layer4.selector.stop().animate({
	        	left: layers.layer4[1] +'px',
	        	bottom: layers.layer4[0] +'px'
	        }, thisDuration, an.EASING_TYPE);

	        // top wave
	        layersProto.layer5.selector.stop().animate({
	        	left: layers.layer5[1] +'px',
	        	bottom: layers.layer5[0] +'px'
	        }, thisDuration, an.EASING_TYPE);

	        // background clouds
	        layersProto.bigClouds.selector.stop().animate({
	        	left: layers.bClouds[0] +'px',
	        	top: layers.bClouds[1] +'px'
	        }, thisDuration, an.EASING_TYPE);

	        // middle clouds
	        layersProto.medClouds.selector.stop().animate({
	        	left: layers.mClouds[0] +'px',
	        	top: layers.mClouds[1] +'px'
	        }, thisDuration, an.EASING_TYPE);

	        // top clouds
	        layersProto.smClouds.selector.stop().animate({
	        	left: layers.sClouds[0] +'px',
	        	top: layers.sClouds[1] +'px'
	        }, thisDuration, an.EASING_TYPE);

	    	// CONTENT LAYER ANIMATING
	    	layersProto.layer3.selector.stop().animate({
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