/**
 * Loading and unloading of the panel content
 */
anti.panelLoading: {
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
};