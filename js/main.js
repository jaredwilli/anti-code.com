anti = {
	common: {
		init: function() {
			// @forEach: array-like polyfill support old browser
			if (!Array.forEach) {
				Array.forEach = function(array, callback, context) {
					for (var i = 0; i < array.length; i++) {
						callback.call(context, array[i], i, array);
					}
				};
			}
			
			anti.init();
		}
	},
	
	init: function() {

		var el = {
			b: document.body,
			l: document.getElementById('layer3'),
		};
		//el.c = document.getElementsByTagName('canvas');
		el.p = el.l.getElementsByTagName('section');

		console.log(el);

		// Setup navigation
		anti.panelNavigation.init(el);

		// Set up project image sliders
		//anti.projectSlider($('.slider'));

		// Make everything fill the browser viewport
		window.addEventListener('resize', anti.utils.resizeToScreen(el), false);
		anti.utils.resizeToScreen(el);
	},

	utils: {
		resizeToScreen: function(el) {
			var winWidth = window.innerWidth
				winHeight = window.innerHeight,
				mainNav = $('#main-nav').find('a');
			
			$('body').css({ height: winHeight });
			$('#layer3').css({ width: winWidth +'px', height: winHeight +'px' });
			$('.panel').css({ width: winWidth - (3 * $('#layer3').css('left').split('px')[0]) +'px', height: winHeight - 160 +'px' });

/*
			var dim = {
				w: window.innerWidth,
				h: window.innerHeight
			};

			
			el.b.style = 'width: '+ dim.w +'px; height: '+ dim.h +'px';
			el.l.style = 'width: '+ dim.w +'px; height: '+ dim.h +'px';
			//console.log('el: ', el);
			
			// Set canvas layers width & height
			[].forEach.call(el.c, function(c) {
			    c.style = 'background: transparent; border: 1px solid red; width: '+ dim.w +'px; height: '+ dim.h +'px';
			});
		    console.log(anti);
		    //anti.canvas.init();
		    
		    
			// Set the content panels width & height of layer3
			[].forEach.call(el.p, function(p) {
			    //p.style = 'width: '+ dim.w - (Number(window.getComputedStyle(el.p[0], null)['left'].split('px')[0]) - 100) % (Number(window.getComputedStyle(el.p[2], null)['left'].split('px')[0]) + dim.w + 100) +'; height: '+ dim.h +'px';
			});
*/
			
			/*$('#layer3').css({ width: winWidth +'px', height: winHeight +'px' });
			$('.panel').css({ width: winWidth - (3 * $('#layer3').css('left').split('px')[0]) +'px', height: winHeight - 160 +'px' });
			grid();
			*/
			// get offsetDistance - http://jsfiddle.net/jaredwilli/cydhM/
		},
		extend: function(d, e, c) {
		    var b = function() {},
		        a;
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
		isArray: function(a) {
		    return (a.constructor.toString().indexOf('Array') !== -1);
		},
		createCache: function(requestFunction) {
		    var cache = {};
		    return function(key, callback) {
		        if (!cache[key]) {
		            cache[key] = $.Deferred(function(defer) {
		                requestFunction(defer, key);
		            }).promise();
		        }
		        console.log(cache[key]);
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