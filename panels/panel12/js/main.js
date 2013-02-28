/**
 * Slider Development Test for Beach Body Interview
 *
 * By: Jared Williams
 * http://anti-code.com
 *
 */

var Slider = {
	activeSlide: '#eye1',
	activeSection: '#eyes',
	activePage: '#group-0',
	prevSlide: '#lip12',
	nextSlide: '#eye2',

	init: function() {
		var sections = document.getElementsByTagName('section'),
			thumbs = $('.thumbs'),
			images = $('.images'),
			bullets = $('.bullets');

		// Setup the initial state of the activeSlide, section, bullet and arrows
		//$(Slider.activeSlide).animate({ opacity: 0 });
		$(Slider.activeSection).addClass('active').find('.expand').text('-');
		$('.thumbs, .bullets', Slider.activeSection).find('li:first').addClass('active').show();

		document.getElementById('prev').href = Slider.prevSlide;
		document.getElementById('next').href = Slider.nextSlide;

		Slider.moveToSlide();

		// Handle clicks on the sections of accordion
		$('h1', 'section').on('click', function(e) {
			e.preventDefault();
			if ($(this).parent().hasClass('active')) return;
			$(Slider.activeSlide).animate({ opacity: 0 }).removeClass('active');

			Slider.activeSection = '#' + $(this).parent().attr('id');
			Slider.activeSlide = $(Slider.activeSection).find('.thumbs > li:first a').attr('href');

			Slider.collapse();
			Slider.updateArrows();
			Slider.moveToSlide();
		});

		// Handle clicks on thumbnails
		$('li', thumbs).find('a').on('click', function(e) {
			e.preventDefault();
			if ($(this).parent().hasClass('active')) return;
			$(Slider.activeSlide).animate({ opacity: 0 }).removeClass('active');

			$('.thumbs, .images').find('li').removeClass('active');
			$(this).parent().addClass('active');

			Slider.activeSlide = $(this).attr('href');

			Slider.updateArrows();
			Slider.moveToSlide();
		});

		// Handle clicks on the bullet nav
		$(bullets).find('a').on('click', function(e) {
			e.preventDefault();
			if ($(this).parent().hasClass('active')) return;
			$(Slider.activeSlide).animate({ opacity: 0 }).removeClass('active');

			Slider.activePage = $(this).attr('href');
			Slider.activeSlide = $(Slider.activePage).find('a').attr('href');

			Slider.goToPage();
			Slider.updateArrows();
			Slider.moveToSlide();
		});

		// Handle clicks on the next / previous links
		$('.arrows').find('a').on('click', function(e) {
			e.preventDefault();
			$(Slider.activeSlide).animate({ opacity: 0 }).removeClass('active');

			Slider.activeSection = '#' + $('a[href='+ Slider.activeSlide +']').parents('section').attr('id');
			Slider.activeSlide = $(this).attr('href');
			//Slider.activePage

			var index = $(Slider.activeSlide, '.images').index();

			Slider.updateArrows();
			Slider.whatNow( index );
			Slider.moveToSlide();
		});
	},

	/**
	 * Collapse called when on first or last thumbnail of a section and prev or next arrow is clicked,
	 * or when the H1 of a section is clicked.
	 *
	 * And change the - to a + in the H1 tag
	 */
	collapse: function() {
		$('.thumbs, .bullets').find('li').removeClass('active');
		$('section').removeClass('active').find('.expand').text('+');
		$('.thumbs', 'section').css({ left: 0 });

		Slider.expand();
	},
	/**
	 * Expand called by collapse method only.
	 *
	 * Always highlight the first thumb of the section
	 * and change the + to a - in the H1 tag
	 * and if necessary, make first bullet of thumbnail page nav active
	 */
	expand: function() {
		// Need to get the index of the first thumbnail of the expanded section
		$('.thumbs, .bullets', Slider.activeSection).find('li:first').addClass('active').show();
		$(Slider.activeSection).addClass('active').find('.expand').text('-');
	},
	/**
	 * WhatNow is called by the next/previous arrow links to check
	 * whether or not other actions should be done
	 *
	 * Calls goToPage if activeSlide thumbnail has an ID attribute
	 * Calls collapse method if the ID of the parent section of the activeSlide changes
	 */
	whatNow: function(index) {
		Slider.activePage = '#group-0';

		if (index === 11) {
			Slider.activeSection = '#lips';
			Slider.activeSlide = '#' + $('.images li').eq(index).attr('id');
		}
		else if (index === 9 || index === 10) {
			Slider.activeSection = '#forehead';
			Slider.activeSlide = '#' + $('.images li').eq(index).attr('id');
		}
		else if (index >= 0 || index <= 8) {
			Slider.activeSection = '#eyes';

			// Handle which page to make active for bullet nav
			if (index >= 0 && index <= 2) {
				Slider.activePage = '#group-0';
				Slider.goToPage();
			} else if (index >= 3 && index <= 5) {
				Slider.activePage = '#group-1';
				Slider.goToPage();
			} else if (index >= 6 && index <= 8) {
				Slider.activePage = '#group-2';
				Slider.goToPage();
			}
		}
		Slider.activeSlide = '#' + $('.images').find('li').eq(index).attr('id');

		$('section').removeClass('active').find('.expand').text('+');
		$('.thumbs').find('li').removeClass('active');

		$(Slider.activeSection).addClass('active').find('.expand').text('-');
		$('.thumbs a[href='+ Slider.activeSlide +']').parent('li').addClass('active');
	},
	/**
	 * Update the next/previous links with the correct slide href's
	 */
	updateArrows: function() {
		// Set the next/previous href values according to the activeSlide
		Slider.prevSlide = '#' + $(Slider.activeSlide).prev().attr('id');
		Slider.nextSlide = '#' + $(Slider.activeSlide).next().attr('id');

		// Fix the next/prev links when activeSlide is first or last
		if ($(Slider.activeSlide).hasClass('first')) {
			Slider.prevSlide = '#' + $('.last', '.images').attr('id');
			Slider.collapse();
		}
		if ($(Slider.activeSlide).hasClass('last')) {
			Slider.nextSlide = '#' + $('.first', '.images').attr('id');
		}

		document.getElementById('prev').href = Slider.prevSlide;
		document.getElementById('next').href = Slider.nextSlide;
	},
	/**
	 * GoToPage called when clicking on bullet nav icons
	 * or by the whatNow method if next/previous activate a new group
	 * for showing the next group of 3 thumbnails that exist if any
	 *
	 * Sets the activeSlide to show the corresponding image
	 */
	goToPage: function() {
		$('.thumbs, .bullets').find('li').removeClass('active');
		$('a[href='+ Slider.activePage +']').parent().addClass('active');
		$(Slider.activePage).addClass('active');

		if ($('#group-0').hasClass('active')) {
			$('#group-0').parent().css({ left: 0 +'px' });
		}
		else if ($('#group-1').hasClass('active')) {
			$('#group-1').parent().css({ left: -340 +'px' });
		}
		else if ($('#group-2').hasClass('active')) {
			$('#group-2').parent().css({ left: -679 +'px' });
		}
	},
	/**
	 * MoveToSlide called by each click event handler
	 * for moving the slider of large images to the currently activeSlide
	 *
	 * Always called last
	 */
	moveToSlide: function() {
		$('li', '.images').removeClass('active');
		$(Slider.activeSlide).animate({ opacity: 1 }).addClass('active');
	}
};
Slider.init();