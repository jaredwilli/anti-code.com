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
			},
			bigClouds: {
				el: $('#big-clouds'),
				coords: [-1800, -1210] 	// [left, top]
			},
			medClouds: {
				el: $('#med-clouds'),
				coords: [-1800, -1210] 	// [left, top]
			},
			smClouds: {
				el: $('#sm-clouds'),
				coords: [-1800, -1210] 	// [left, top]
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

		init: function() {
			// These properties need to be in the init
			var an = anti.navigation;
			an.X_ADJUST_1 = 1;
			an.Y_ADJUST_1 = 1.4;

			an.X_ADJUST_2 = 1;
			an.Y_ADJUST_2 = 1.26;
			
			an.X_ADJUST_4 = 1;
			
			X_ADJUST_5 = 1;
        	Y_ADJUST_5 = 1.15;

        	console.log(an.LAYER_SET);
		},

		// sets up handlers on nav elements and maps handlers, with target params
		setUp: function() {
			//console.log("setup");
			var an = anti.navigation;

			an.MENU_SET.on('click', function(e) {
				var panelToLoad = $(this).attr('href').split('#')[1];

				console.log('panelToLoad: ', an.TARGET_LAYER3[panelToLoad]);
				an.navigateToSection(an.TARGET_LAYER3[panelToLoad]);

				e.preventDefault();
			});
		},

		navigateToSection: function(panelToLoad) {
			var an = anti.navigation;

			//window.history.pushState(panelToLoad, $('#'+ panelToLoad).find('h2').text(), '#'+ panelToLoad);
			//window.location.hash = '#'+ panelToLoad;
			$('#main-nav').find('.active').removeClass('active');
			$('#main-nav').find('a[href='+ panelToLoad.url +']').addClass('active');

			// load target panel's content
			//anti.panelLoading.getPanelData(panelToLoad, an.currentSection);

			//set now to the section about to be loaded into view
			an.currentSection = panelToLoad;

			// sends name of target panel
			an.moveAll(panelToLoad);
	    },

	    // method accepts string of target panel for which to apply position translation animations
	    // TODO: BIG TIME - this whole method needs to be done more abstractly and better!!!
	    moveAll: function(panelToLoad) {
	        var an = anti.navigation,
                layer3coords = panelToLoad.coords;

            // first calculate the position constants by which to translate other panel positions
            var contentLayerW = an.CONTENT_LAYER.width(),
                contentLayerExtraX = contentLayerW - (window.innerWidth / 2),
                xPosConstant = (layer3coords[0] + 100) / contentLayerExtraX;

            var contentLayerH = an.CONTENT_LAYER.height(),
                contentLayerExtraY = contentLayerH - (window.innerHeight / 2),
                yPosConstant = layer3coords[1] / contentLayerExtraY;

/**
 * NEED TO DETERMINE HOW TO ADD TO THE PARALLAXED LAYERS FOR WAVES AND CLOUDS 
 * WHAT IS SETTING THEM TO BE POSITIONED AT 0, 0 AFTER THE FIRST CLICK FOR NAVIGATING
 * AND THEN SUBTRACT FROM THAT THE VALUE OF THE LAYER_SET.[layer].coords FROM IT SO IT 
 * KEEPS THE CONTEXT SET TO THE PROPER POSITIONING OF THOSE LAYERS SO THEY WILL BE MOVING 
 * TO THE RIGHT FRON THEIR DEFAULT LEFT/TOP POSITIONS, AND MOVING LEFT FROM THE NEW LEFT/TOP
 * ACCORDINGLY IF THEY HAD MOVED TO THE RIGHT AT ALL. THE POSITION CHANGES IN EACH DIRECTION
 * MUST BE RECORDED AND PERHAPS PUSHED TO AN ARRAY WHICH THEY CAN BE PULLED FROM IN ORDER TO 
 * COMPENSATE FOR WHAT ADJUSTMENTS TO CURRENT CONTXT MAY HAVE OCCURRED WHEN NEEDING TO BE 
 * REVERSED TO MOVE BACK TO THE OTHER LEFT OR MIDDLE COLUMS.
 */

            var layer1ExtraX = an.LAYER_SET.layer1.el.width() - (window.innerWidth / 2),
                layer1x = (layer1ExtraX * xPosConstant * -1 * an.X_ADJUST_1) + (an.LAYER_SET.layer1.coords[0] / 2),
                layer1y = window.innerHeight / an.LAYER_SET.layer1.el.height();

            var layer4ExtraX = an.LAYER_SET.layer4.el.width() - (window.innerWidth / 2),
                layer4x = layer4ExtraX * xPosConstant * -1 * an.X_ADJUST_1,
                layer4y = window.innerHeight / an.LAYER_SET.layer4.el.height();

            var layer5ExtraX = an.LAYER_SET.layer5.el.width() - (window.innerWidth / 2),
                layer5x = layer5ExtraX * xPosConstant * -1 * an.X_ADJUST_1,
                layer5y = window.innerHeight / an.LAYER_SET.layer5.el.height();
            
            var bigCloudsExtraX = an.LAYER_SET.bigClouds.el.width() - (window.innerWidth / 2),
                bigCloudsExtraY = an.LAYER_SET.bigClouds.el.height() - (window.innerHeight / 2),
                bigCloudsX = bigCloudsExtraX * xPosConstant * -1 * an.X_ADJUST_2,
                bigCloudsY = bigCloudsExtraY * yPosConstant * -1 * an.y_ADJUST_2;

            var medCloudsExtraX = an.LAYER_SET.medClouds.el.width() - (window.innerWidth / 2),
                medCloudsExtraY = an.LAYER_SET.medClouds.el.height() - (window.innerHeight / 2),
                medCloudsX = medCloudsExtraX * xPosConstant * -1 * an.X_ADJUST_2,
                medCloudsY = medCloudsExtraY * yPosConstant * -1 * an.y_ADJUST_2;

            var smCloudsExtraX = an.LAYER_SET.smClouds.el.width() - (window.innerWidth / 2),
            	smCloudsExtraY = an.LAYER_SET.smClouds.el.height() - (window.innerHeight / 2),
                smCloudsX = smCloudsExtraX * xPosConstant * -1 * an.X_ADJUST_2,
                smCloudsY = smCloudsExtraY * yPosConstant * -1 * an.y_ADJUST_2;

            var layer3x = layer3coords[0] * -1 + 100,
            	layer3y = layer3coords[1] * -1;

            //formula for y translation is (layerH/frontH)(frontY)([optional multiplier])

           var layers = {
	        	layer1: [layer1x, layer1y],
	            layer4: [layer4x, layer4y],
	            layer5: [layer5x, layer5y],
             	bigClouds: [bigCloudsX, bigCloudsY],
             	medClouds: [medCloudsX, medCloudsY],
             	smClouds: [smCloudsX, smCloudsY],
             	layer3: [layer3x, layer3y]
	        };

	        an.animateEm(layers);
	    },
	    animateEm: function(layers) {
            var an = anti.navigation;

            console.log(layers);
            
            // check for travel distance to set animation duration based on how far to slide
            var xDiff = Math.abs((Number(an.LAYER_SET.layer3.el.css('left').split('px')[0]) + 100000) - (layers.layer3[0] + 100000));
            
            // calculate the adjusted animation duration
            var thisDuration = Math.round(xDiff / Number(an.LAYER_SET.layer3.el.width()) * (an.MAX_DURATION - an.BASE_DURATION) + an.BASE_DURATION);

            // run the animations

            an.LAYER_SET.layer1.el.stop().animate({ left: layers.layer1[0] +'px', bottom: layers.layer1[1] +'px' }, thisDuration, an.EASING_TYPE);
            an.LAYER_SET.layer4.el.stop().animate({ left: layers.layer4[0] +'px', bottom: layers.layer4[1] +'px' }, thisDuration, an.EASING_TYPE);
            an.LAYER_SET.layer5.el.stop().animate({ left: layers.layer5[0] +'px', bottom: layers.layer5[1] +'px' }, thisDuration, an.EASING_TYPE);

            an.LAYER_SET.bigClouds.el.stop().animate({ left: layers.bigClouds[0] +'px', top: layers.bigClouds[1] +'px' }, thisDuration, an.EASING_TYPE);
            an.LAYER_SET.medClouds.el.stop().animate({ left: layers.medClouds[0] +'px', top: layers.medClouds[1] +'px' }, thisDuration, an.EASING_TYPE);
            an.LAYER_SET.smClouds.el.stop().animate({ left: layers.smClouds[0]   +'px', top: layers.smClouds[1]  +'px' }, thisDuration, an.EASING_TYPE);
            
            an.LAYER_SET.layer3.el.stop().animate({ left: layers.layer3[0] +'px', top: layers.layer3[1] +'px' }, thisDuration, an.EASING_TYPE);
        }
	},
	/* Loading and unloading of the panel content */
    panelLoading: {
    	loadPanel: function(panelToLoad, panelToUnload) {
    		var an = anti.navigation,
    			pl = anti.panelLoading;

/*    		if (!an.TARGET_LAYER3[panelToLoad].el || !an.LAYER_SET.[panelToUnload]) {
    			return;
    		}
*/
    		console.log('load/unload: ', panelToLoad, panelToUnload);
    		
			/**
    		 * Just as an example for now, I'm loading a hardcoded panel until i can come back to redo this
    		 */
    		 var panelId = panelToLoad.url,
    		 	panelContainer = $(panelId),
    		 	filePath = 'panels/'+ $(panelId).split('#')[1] +'/';

    		$.when(pl.getPanelData(filePath), pl.showPanelData())
    			.then(function(result) {
			        console.log('Fires after the getPanelData() AJAX request AND showPanelData() BOTH succeed!');
			        console.log(result);
			        // 'result' is the server’s response
			        panelContainer.append(result).fadeIn('500').parents('.panel').addClass('currentPanel');
				})
				.then(function() {
					pl.unloadPanel(panelToUnload);
				});
    	},
   		getPanelData: function(filePath) {
    		return $.get(filePath).done(function(data) {
    			console.log('Ajax request succeeded. Data:', data);
    			return data;
    		});
    	},
    	showPanelData: function() {
    		var dfd = $.Deferred();

    		dfd.done(function() {
    			console.log('Fires after animation succeeds');
    		});

    		$(an.TARGET_LAYER3[panelToLoad].el).fadeIn(500, dfd.resolve);
    		return dfd.promise();
    	},
    	unloadPanel: function(panelToUnload) {
    		console.log(panelToUnload, an.TARGET_LAYER3[panelToUnload].el);

    		if (panelToUnload.hasClass('currentPanel')) {
				panelToUnload.parents('.panel').removeClass('currentPanel').find('.info').fadeOut(200).remove();
    		}
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