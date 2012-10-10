if (typeof anti === 'undefined') {
	var anti = {};
}

/**
 * Object for controlling the navigation of the panels and 
 * the parallax effects of the different layers
 */

anti.panelNavigation = {
	// Constants for nav functionality
	BASE_DURATION: 	500,
	MAX_DURATION: 	2000,
	EASING_TYPE: 	'easeOutQuart', //Quint/Bounce
	MENU_SET: 		$('#main-nav').find('a'),
	CONTENT_LAYER: 	$('#layer3'),

	LAYER_SET: {
		layer3: $('#layer3'),
		layer1: $('#layer1'),
		layer4: $('#layer4'),
		layer5: $('#layer5'),
		bigClouds: $('#big-clouds'),
		medClouds: $('#med-clouds'),
		smClouds: $('#sm-clouds')
	},
	
	// property to track the current section loaded
	ACTIVE_PANEL: $('#panel5'),
	
	POS: {
		cols: [-1700, 0, 1700],
		rows: [-1200, 0, 1200, 2700]
	},

/*
	startPoints: function(an) {
		var layerSet = an.LAYER_SET,
			_ = this.__.startPoints;

		_ = {
			_layer3: [
				Number(layerSet.layer3.css('left').split('px')[0]), 
				Number(layerSet.layer3.css('top').split('px')[0]), 
				layerSet.layer3.width() * 3,
				layerSet.layer3.height() * 3
			],
			_layer1: [
				Number(layerSet.layer1.css('left').split('px')[0]), 
				Number(layerSet.layer1.css('bottom').split('px')[0]), 
				layerSet.layer1.width(), 
				layerSet.layer1.height()
			],
			_layer4: [
				Number(layerSet.layer4.css('left').split('px')[0]), 
				Number(layerSet.layer4.css('bottom').split('px')[0]),
				layerSet.layer4.width(), 
				layerSet.layer4.height()
			],
			_layer5: [
				Number(layerSet.layer5.css('left').split('px')[0]), 
				Number(layerSet.layer5.css('bottom').split('px')[0]), 
				layerSet.layer5.width(), 
				layerSet.layer5.height()
			],
			cloudb3: [
				Number(layerSet.bigClouds.css('left').split('px')[0]), 
				Number(layerSet.bigClouds.css('top').split('px')[0]), 
				layerSet.bigClouds.width(),
				layerSet.bigClouds.height()
			],
			cloudm2: [
				Number(layerSet.medClouds.css('left').split('px')[0]), 
				Number(layerSet.medClouds.css('top').split('px')[0]),
				layerSet.medClouds.width(), 
				layerSet.medClouds.height()
			],
			clouds1: [
				Number(layerSet.smClouds.css('left').split('px')[0]), 
				Number(layerSet.smClouds.css('top').split('px')[0]), 
				layerSet.smClouds.width(), 
				layerSet.smClouds.height()
			]
		};

		this.__ = __;
	},
	
	newPoints: function(an) {
		var newPoints = an.__.newPoints = an.startPoints();

		// xDiff3 = layer3 width - panelToLoad x coord + 100
		var xDiff3 = an.__.startPoints._layer3[2] - an.PANEL_COORDS[an.__.panelToLoad][0] + 100;
		// yDiff3 = layer3 height - panelToLoad y coord
		var yDiff3 = an.__.startPoints._layer3[3] - an.PANEL_COORDS[an.__.panelToLoad][1];
		
		var quartConst = 0.025,
			halfConst = 0.05,
			quart3Const = 0.075;

		newPoints['_layer1'] = [
			_.startPoints._layer1[0] + (_.startPoints._layer1[0] - xDiff3) * quartConst * -1,
			0
		];
		newPoints['_layer4'] = [
			_.startPoints._layer4[0] - (_.startPoints._layer4[0] - yDiff3) * quart3Const * -1,
			0
		];
		newPoints._layer5 = [
			_.startPoints._layer5[0] - (_.startPoints._layer5[0] - yDiff3) * halfConst * -1,
			0
		];
		newPoints.cloudb3 = [
	    	(_.startPoints.cloudb3[0] - (_.startPoints.cloudb3[0] + (_.startPoints.cloudb3[0] - xDiff3)) * quartConst) * -1,
			(_.startPoints.cloudb3[1] - (_.startPoints.cloudb3[1] + (_.startPoints.cloudb3[1] - yDiff3)) * halfConst) * -1
	    ];
		newPoints.cloudm2 = [
			(_.startPoints.cloudm2[0] - (_.startPoints.cloudm2[0] + (_.startPoints.cloudm2[0] - xDiff3)) * quart3Const) * -1,
			(_.startPoints.cloudm2[1] - (_.startPoints.cloudm2[1] + (_.startPoints.cloudm2[1] - yDiff3)) * halfConst) * -1
		];
		newPoints.clouds1 = [
			(_.startPoints.clouds1[0] - (_.startPoints.clouds1[0] + (_.startPoints.clouds1[0] - yDiff3)) * halfConst) * -1,
			(_.startPoints.clouds1[1] - (_.startPoints.clouds1[1] + (_.startPoints.clouds1[1] - yDiff3)) * halfConst) * -1
		];

		newPoints._layer3 = [
        	an.PANEL_COORDS[_.panelToLoad][0] * -1 + 100,
        	an.PANEL_COORDS[_.panelToLoad][1] * -1
        ];
	
		an.__.newPoints = newPoints;

		console.log(newPoints, an);
	},
*/
	setUp: function() {
		console.log('navigation setup fired!');
		var an = anti.panelNavigation;
		
		//var gridObj = anti.constructors($('.layer'));

		an.MENU_SET.on('click', function(e) {
			e.preventDefault();
			var href = $(this).attr('href').split('#')[1];
			
			an.__.panelToUnload = an.ACTIVE_PANEL.attr('id');
			an.__.panelToLoad = href;
			an.ACTIVE_PANEL = $('#'+ href);
			
			//console.log('before newPoints: ', an.__.newPoints);
			//console.log('panelToLoad: ', an.__.panelToLoad);

			an.navigateToSection(an);
		});
	},
	
	navigateToSection: function(an) {
		//window.history.pushState(panelToLoad, $('#'+ panelToLoad).find('h2').text(), '#'+ panelToLoad);
		//window.location.hash = '#'+ panelToLoad;
		
		$('#main-nav').find('.active').removeClass('active');
		$('#main-nav').find('a[href=#'+ an.__.panelToLoad +']').addClass('active');

		// load target panel's content
		//anti.panelLoading.getPanelData(panelToLoad, an.currentPanel);


		//an.__.newPoints = an.newPoints(__);

		an.animateEm(an);
    },
    calcDistance: function() {
    	
		var layer3W = an.PANEL_COORDS.panel1[0] + (an.PANEL_COORDS.panel3[0] + an.__.startPoints._layer3[2]) + 200,
            contentLayerExtraX = contentLayerW - 760,
            xPosConstant = layer3coords[0] / contentLayerExtraX;
    },
    animateEm: function(layers) {
        var an = anti.panelNavigation;

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
};