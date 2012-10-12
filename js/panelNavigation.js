if (typeof anti === 'undefined') {
	var anti = {};
}

/**
 * Object for controlling the navigation of the panels and 
 * the parallax effects of the different layers
 */

anti.panelNavigation = {
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

	init: function() {
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
};