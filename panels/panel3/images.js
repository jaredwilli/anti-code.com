/**
 * The use of jQuery for doing anything at all in this is totally unnecessary
 * which is why I added the below util for cross-browser addEvent.
 *
 * I wanted to just use plain js and remove use of jQuery altogether, though it
 * made add/remove class work better cross-browser.
 */

var addEvent = (function() {
  if (document.addEventListener) {
    return function(el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function(el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.attachEvent('on' + type, function() {
          return fn.call(el, window.event);
        });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();

/*--========================*\
 oh rly?	ya rly!  
   \ ___,    ___ /   _,_  no rly?
    {O,0}   {-.-}   {o,O} /
    |)__)   |)~(|   (~~(|
-----"-"-----"-"-----"-"-----,_
=========================== --*/


var DND = {
	init: function() {
		// Would you rather have this img array dynamically generated on the fly?
		// Is that not how this would be done in a real-world app?
		var imgs = [ 
				"dsc_6001.jpg", "dsc_6081.jpg", "dsc_6013.jpg", "dsc_6268.jpg", "dsc_6397.jpg", 
				"dsc_6345.jpg", "dsc_6378.jpg", "dsc_6413.jpg", "dsc_6417.jpg"
			],
			thumbsSect = document.getElementById('thumbs'),
			dragSourceEl = null,
			imgListStr = '',
			items;

		for (var i = 0; i < imgs.length; i++) {
			imgListStr += '<img id="img-'+i+'" src="panels/panel3/images/'+ imgs[i] +'" draggable="true" />';
		}
		imgListStr += '<span class="anti"><h3>Drag and Drop the images...</h3></span>';
		// Output the image list replacing static html in the section
		thumbsSect.innerHTML = imgListStr;

		items = document.querySelectorAll('#thumbs img');
		
		/**
		 *  Add some event listeners to each list item that can be dragged/dropped
		 *  looping over each LI item and adding dnd event listeners and handlers to each
		 */
		[].forEach.call(items, function(item) {
			// Drag n Drop event handlers for each image
			addEvent(item, 'dragstart', function(e) {
				//if (e.stopPropagation) e.stopPropagation;
				dragSourceEl = this;

				$(this).addClass('dragging');
				e.dataTransfer.effectAllowed = 'move';
				e.dataTransfer.setData('text', this.src);
			});
			addEvent(item, 'dragenter', function(e) {
				e.preventDefault();
				$(this).addClass('dragOver');
			});
			addEvent(item, 'dragleave', function(e) {
				$(this).removeClass('dragOver');
			});
			addEvent(item, 'dragover', function(e) {
				e.preventDefault();
				e.dataTransfer.effectAllowed = 'move';
				return true;
			});
			/**
			 * Safari 5.7.1 on Windows 7 does not fire the 'drop' event. 
			 * idk if Mac does. this may work on a Mac
			 */
			addEvent(item, 'drop', function(e) {
				e.preventDefault();

				if (dragSourceEl !== this) {
					//console.log(e.dataTransfer/*dragSourceEl, this, e*/);
					e.dataTransfer.dropEffect = 'move';
					// Set dragged element html to the html of the element dropped on 
					dragSourceEl.src = this.src;
					this.src = e.dataTransfer.getData('text');
				}
			});
			addEvent(item, 'dragend', function(e) {
				if (e.stopPropagation) e.stopPropagation;
				$(this).parent().find('img').removeAttr('class');
			});
			/* IE9 seems to need a clearData to reset whats moving where but semi-works */
		});
	}
};
DND.init();