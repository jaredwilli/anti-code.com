if (typeof anti !== 'object') {
	anti = {};
}


anti.panelContent = {
	loadPanel: function(panelTo) {
		if (panelTo === 'panel14' || panelTo === 'panel15') return;

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
		$('#'+ panelToShow).find('.panel-wrap').stop().delay(1000).fadeIn(500);
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
			if ($('.lt-ie9').length) {
				console.log('Status: '+ status +'"\n" Error: '+ error);
			}
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

		var width = Number($('.panel article .http://www.pornhub.com/view_video.php?viewkey=756124555project-content').width()),
			thumbs = $('#'+ panel).find('.gallery-thumbs li'),
			gallery = $('#'+ panel).find('.gallery'),
			galleryStr = '<ul style="'+ width * thumbs.length +'px">',
			visibleSlide = 'hidden';

		// Add current class to first thumbnail image
		//$(thumbs[0]).find('a').addClass('current');
http://www.pornhub.com/view_video.php?viewkey=756124555
		// Loop over the thumbnails to generate the slides for each
		for (var i = 0; i < thumbs.length; i++) {
			//if (i === 0) return;

			var para = $(thumbs[i]).find('p'),
				href = $(thumbs[i]).find('a').attr('href').split('#')[1],
				video = $(thumbs[i]).find('a').attr('data-vid');

			//console.log(thumbs.length, thumbs[i], href);

			if (href === 'slide-1') {
				visibleSlide = 'active';
			} else {
				visibleSlide = '';
			}

			galleryStr += '<li id="'+ href +'" class="'+ visibleSlide +'">';

			// Is the slide displaying a video or an image
			if (typeof video !== 'undefined') {
				galleryStr += '<iframe src="'+ video +'" width="655" height="561" frameborder="0" allowfullscreen></iframe>';
			} else {
				galleryStr += '<img src="panels/'+ panel +'/'+ href +'.jpg" alt="'+ panel +' '+ href +'" />';
			}

			galleryStr += '<p>'+ para.text() +'</p></li>';
			para.remove();
		}
		galleryStr += '</ul>';
		gallery.append(galleryStr);

		if ($('#default-nav li a').length > 0) {
			$('#default-nav li a').css({ opacity: 0.7 });
			$('#default-nav li a').hover(function() {
				$(this).stop().css({ opacity: 1 });
			}, function() {
				$(this).stop().css({ opacity: 0.7 });
			});
		}

		// Create click handler for thumbnails so they show larger versions correctly
		thumbs.find('a').on('click', function(e) {
			e.preventDefault();

			// use href of thumbnail clicked to find slide ID to display
			var slide = $(this).attr('href');

			// swap the active state of the current thumbnail with clicked thumbnail
			thumbs.find('a').removeClass('current').animate({ opacity: 0.7 }, 200);
			$(this).addClass('current').animate({ opacity: 1 }, 200);

			// hide all slides before showing slide for clicked thumbnail
			gallery.find('li').removeClass('active').fadeOut(200);
			gallery.find(slide).addClass('active').fadeIn(200);
		});
	}
}