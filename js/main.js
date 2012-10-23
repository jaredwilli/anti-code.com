if (typeof anti !== 'object') {
	anti = {};
}

anti = {
	common: {
		init: function() {
			console.log('This site is still being developed. Every example is loaded in the panels using ajax onclick of each nav link. Some of the projects which use JavaScript are still a little buggy but they work individually. Eventually they will be interactive and "playable" demo examples loaded into this page.');
			anti.init();
		}
	},
	/**!
	 * Stores the panels ID and CSS position coordinates for global access
	 * once generated by looping over the list of .panels
	 */
	panels: {
		activePanel: 'panel5', 
		panelsLoaded: [], 
		panelSliders: []
	},
	layers: {},

	init: function() {
		var b = document.body,
			p = $('.panel'),
			l = $('.layer');

		// load the initial panel's content
		anti.panels.panelsLoaded.push(anti.panels.activePanel);
		anti.panelContent.loadPanel(anti.panels.activePanel);
		
		// Set up an obj of each panel and their left/top position
		for (var i = 0; i < p.length; i++) {
			var panelId = $(p[i]).attr('id');

			if (i !== 4) {
				$(p[i]).html('<div class="panel-wrap"></div>');
			}
			anti.panels[panelId] = {};
			anti.panels[panelId].pos = [];
			anti.panels[panelId].pos.push(
				Number($('#'+ panelId).css('left').split('px')[0]),
				Number($('#'+ panelId).css('top').split('px')[0])
			);
		}
		console.log('panels: ', anti.panels);

        // Set up an obj of each panel and their left/top position
		for (var j = 0; j < l.length; j++) {
			var layerId = $(l[j]).attr('id');

			anti.layers[layerId] = {};
			anti.layers[layerId].pos = [];
			anti.layers[layerId].pos.push(
				Number($('#'+ layerId).css('left').split('px')[0]),
				Number($('#'+ layerId).css('top').split('px')[0]),
				Number($('#'+ layerId).css('width').split('px')[0]),
				Number($('#'+ layerId).css('height').split('px')[0])
			);
		}

		// Setup navigation
		anti.panelNavigation.setUp();

		// Make everything fill the browser viewport
		window.addEventListener('resize', anti.utils.resizeToScreen(b, l, p), false);
		anti.utils.resizeToScreen(b, l, p);
	},
	panelNavigation: {
		// Constants for nav functionality
		BASE_DURATION: 1000,
		MAX_DURATION: 4000,
		EASING_TYPE: 'easeOutQuart', // easeOutQuart',
		MENU_SET: $('#main-nav, #default-nav').find('a'),	

		// sets up handlers on nav elements and maps handlers, with target params
		setUp: function() {
			//console.log("setup");

			anti.panelNavigation.MENU_SET.on('click', function(e) {
				var panelToLoad = $(this).attr('href').split('#')[1];
				
				//console.log('panelToLoad: ', anti.panels[panelToLoad]);
				anti.panelNavigation.navigateToSection(panelToLoad);

				e.preventDefault();
			});
		},
		navigateToSection: function(panelToLoad) {
			//window.history.pushState(panelToLoad, $('#'+ panelToLoad).find('h2').text(), '#'+ panelToLoad);
			//window.location.hash = '#'+ panelToLoad;

			$('#main-nav, #default-nav').find('.active').removeClass('active');
			$('#main-nav, #default-nav').find('a[href=#' + panelToLoad + ']').addClass('active');

	    	//console.log(anti.panels, panelToLoad, anti.layers);

			// set now to the section about to be loaded into view
			anti.panels.activePanel = panelToLoad;

			// load target panel's content
			anti.panelContent.loadPanel(panelToLoad);

			anti.panelNavigation.moveAll(panelToLoad);
		},

		// method accepts string of target panel for which to apply position translation animations
		// TODO: BIG TIME - this whole method needs to be done more abstractly and better!!!
		moveAll: function(panelToLoad) {
			//console.log('moveAll called!!');

			//console.log(anti.panels, anti.layers, panelToLoad);
			var winW = window.innerWidth,
				winH = window.innerHeight;

			var layer3pos = anti.panels[panelToLoad].pos,
				layer3x = layer3pos[0] * -1 + 100,
				layer3y = layer3pos[1] * -1;

			//	Eqaution: slope = ((y1 - y2) / (x1 - x2))

			// Slope difference of layer3
			//var slope = ((an.layerPos.layer3[1] - layer3y) / (an.layerPos.layer3[0] - layer3x));

			anti.layers.layer3.pos[2] = anti.panels.panel1.pos[0] - (anti.panels.panel3.pos[0] + winW);
			anti.layers.layer3.pos[3] = anti.panels.panel1.pos[1] - (anti.panels.panel3.pos[0] + winH);
			
			/**
			 * layer - anti.layer[layer].pos = [x, y, w, h]
			 *
			 * xConst/yConst = (panelToLoad.pos[x, y] - layer3[Width/Height]) * 0.0001; // times 10,000th
			 * layer1,4,5 x  = (layer1,4,5 Width / windowWidth) * ((panel.pos[x] - layer3width) * 0.0001) * 1000 * -1
			 * layers = anti.layer [x, y] - layer[x,y]
			 */
			var xConst = (anti.panels[panelToLoad].pos[0] - anti.layers.layer3.pos[2]) * 0.0001;
			var yConst = (anti.panels[panelToLoad].pos[1] - anti.layers.layer3.pos[3]) * 0.0001;

			//console.log(anti.layers.layer3.pos[2], anti.layers.layer3.pos[3], xConst);

			var layer1x = (anti.layers.layer1.pos[2]) / winW * xConst * 1000 * -1;
			var layer4x = (anti.layers.layer4.pos[2] / winW) * xConst * 1000 * -1;
			var layer5x = (anti.layers.layer5.pos[2] / winW) * xConst * 1000 * -1;

			var bCloudx = (Number(anti.layers.bigCloud.pos[2]) / winW) * xConst * 1000 * -1,
				bCloudy = (Number(anti.layers.bigCloud.pos[3]) / winH) * yConst * 1000 * -1;
			
			var mCloudx = (Number(anti.layers.medCloud.pos[2]) / winW) * xConst * 1000 * -1,
				mCloudy = (Number(anti.layers.medCloud.pos[3]) / winH) * yConst * 1000 * -1;
			
			var sCloudx = (Number(anti.layers.smCloud.pos[2]) / winW) * xConst * 1000 * -1,
				sCloudy = (Number(anti.layers.smCloud.pos[3]) / winH) * yConst * 1000 * -1;

			var layers = {
				layer3: [layer3x, layer3y],
				layer1: [
					anti.layers.layer1.pos[0] - layer1x, 
					Number($('#layer1').css('bottom').split('px')[0])
				],
				layer4: [
					anti.layers.layer4.pos[0] - layer4x, 
					Number($('#layer4').css('bottom').split('px')[0])
				],
				layer5: [
					anti.layers.layer5.pos[0] - layer5x,
					Number($('#layer5').css('bottom').split('px')[0])
				],
				bigCloud: [
					anti.layers.bigCloud.pos[0] - bCloudx,
					anti.layers.bigCloud.pos[1] - bCloudy
				],
				medCloud: [
					anti.layers.medCloud.pos[0] - mCloudx,
					anti.layers.medCloud.pos[1] - mCloudy
				],
				smCloud: [
					anti.layers.smCloud.pos[0] - sCloudx,
					anti.layers.smCloud.pos[1] - sCloudy
				]
			};

			console.log(layers);

			anti.panelNavigation.animateEm(layers);
		},
		animateEm: function(layers) {
			//console.log('animateEm called');

			// check for travel distance to set animation duration based on how far to slide
			var xDiff = Math.abs((anti.layers.layer3.pos[2] + 100000) - (layers.layer3[0] + 100000));
            // calculate the adjusted animation duration
            var thisDuration = (xDiff / (anti.layers.layer3.pos[2] * (anti.panelNavigation.MAX_DURATION - anti.panelNavigation.BASE_DURATION))) + anti.panelNavigation.BASE_DURATION;

			//console.log(xDiff, xDiff/ (anti.layers.layer3.data[2] * (anti.panelNavigation.MAX_DURATION - anti.panelNavigation.BASE_DURATION))  + anti.panelNavigation.BASE_DURATION);
			
			// run the animations
			$('#layer3').stop().animate({
				left: layers.layer3[0] + 'px', 
				top: layers.layer3[1] + 'px'
			}, thisDuration, anti.EASING_TYPE);

			$('#layer1').stop().animate({ left: layers.layer1[0] + 'px' }, thisDuration, anti.panelNavigation.EASING_TYPE);
			$('#layer4').stop().animate({ left: layers.layer4[0] + 'px' }, thisDuration, anti.panelNavigation.EASING_TYPE);
			$('#layer5').stop().animate({ left: layers.layer5[0] + 'px' }, thisDuration, anti.panelNavigation.EASING_TYPE);

			$('#bigCloud').stop().animate({
				left: layers.bigCloud[0] + 'px', 
				top: layers.bigCloud[1] + 'px'
			}, thisDuration, anti.EASING_TYPE);

			$('#medCloud').stop().animate({
				left: layers.medCloud[0] + 'px', 
				top: layers.medCloud[1] + 'px'
			}, thisDuration, anti.EASING_TYPE);
			
			$('#smCloud').stop().animate({
				left: layers.smCloud[0] + 'px', 
				top: layers.smCloud[1] + 'px'
			}, thisDuration, anti.EASING_TYPE);

			//anti.canvas.init();
		}
	},
	panelContent: {
		loadPanel: function(panelTo) {
			if (panelTo === 'panel12') return;

			var isLoaded = anti.utils.keyExists(panelTo, anti.panels.panelsLoaded);

			$('.panel').find('.panel-wrap').fadeOut(500);

			// Cache the files loaded for each panel and enable event firing afterDOMready for each
			// If the panel is already loaded then show the hidden panel-wrap
			if (isLoaded) {
				anti.panelContent.showPanelContent(panelTo);
			} else {
				anti.panelContent.loadPanelContent(panelTo);
			}
		},
		showPanelContent: function(panelToShow) {
			$('#'+ panelToShow).find('.panel-wrap').delay(300).fadeIn(500);
		},
		loadPanelContent: function(panelToLoad) {
			return $.ajax({
				crossDomain: true,
				type: 'POST',
				dataType: 'html',
				url: 'panels/' + panelToLoad + '/index.html'
			})
			.done(function(panelContent) {
				//panelContent
				$('#'+ panelToLoad).find('.panel-wrap').hide().html(panelContent);

				anti.panels.panelsLoaded.push(panelToLoad);
			})
			.fail(function(jqXHR, status, error) {
				console.log('Status: '+ status +'"\n" Error: '+ error);
			})
			.always(function() {
				anti.panelContent.makeSlider(panelToLoad);
				anti.panelContent.showPanelContent(panelToLoad);
			});
		},
		makeSlider: function(panel) {
			if ($('#'+ panel).find('.gallery-thumbs').length < 1) {
				return;
			}

			var thumbs = $('#'+ panel).find('.gallery-thumbs li'),
				gallery = $('#'+ panel).find('.gallery'),
				galleryStr = '<ul>',
				activeSlide = '';

			thumbs.find('a').on('click', function(e) {
				e.preventDefault();
			});

			for (var i = 0; i < thumbs.length; i++) {
				var para = $(thumbs[i]).find('p').text(),
					href = $(thumbs[i]).find('a').attr('href').split('#')[1];

				if (i === 0) {
					activeSlide = 'active';
				} else {
					activeSlide = '';
				}

				galleryStr += '<li id="'+ href +'" class="'+
					activeSlide +' hidden"><img src="panels/'+
					panel +'/'+ href +'.jpg" alt="'+ 
					panel +' '+ href +'" /><p>'+ 
					para +'</p></li>';

			}
			galleryStr += '</ul>';
			gallery.append(galleryStr);

			$(thumbs[i]).on(function(e) {
				e.preventDefault();
				e.stopPropogatoin();

				var slide = $(this).attr('href');

				$('#'+ panel).find('.gallery li').hide();
				$('#'+ panel +' .gallery').find(slide).show();
			});
		}
	},
	utils: {
		resizeToScreen: function(b, l, p) {
			var dim = {
				w: window.innerWidth,
				h: window.innerHeight
			};

			$('body').css({
				height: dim.h
			});
			$('#layer3').css({
				width: dim.w - (dim.w * 0.20) + 'px',
				height: dim.h + 'px'
			});
			$('.panel').css({
				//width: dim.w - (3 * $('#layer3').css('left').split('px')[0]) + 'px',
				height: dim.h - (dim.h * 0.179) + 'px'
			});

			// get offsetDistance - http://jsfiddle.net/jaredwilli/cydhM/
		},
		extend: function(d, e, c) {
			var b = function() {}, a;
			b.prototype = e.prototype;
			d.prototype = new b();
			d.prototype.constructor = d;
			d.superclass = e.prototype;
			if (e.prototype.constructor == Object.prototype.constructor) {
				e.prototype.constructor = e;
			}
			if (c) {
				for (a in c) {
					if (c.hasOwnPropterty(a)) {
						d.prototype[a] = c[a];
					}
				}
			}
		},
		isArray: function(array) {
			return (array.constructor.toString().indexOf('Array') !== -1);
		},
		keyExists: function(key, search) {
			if (!search || (search.constructor !== Array && search.constructor !== Object)) {
				return false;
			}
			for (var i = 0; i < search.length; i++) {
				if (search[i] === key) {
					return true;
				}
			}
			return key in search;
		},
		createCache: function(requestFunction) {
		    var cache = {};
		    return function(key, callback) {
		        if (!cache[key]) {
		            cache[key] = $.Deferred(function(defer) {
		                requestFunction(defer, key);
		            }).promise();
		        }
		        return cache[key].done(callback);
		    };
		}
	}
};

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
/*
		var classes = b.clasaname.split(/\s+/), test = classes.length;
		for (var i = 0; i < test; i++) {
			UTIL.fire(classes[i]);
			UTIL.fire(classes[i], bid);
		};
*/
		UTIL.fire('common', 'finalize');
	}
};
//kick it all off here
$(document).ready(UTIL.loadEvents);