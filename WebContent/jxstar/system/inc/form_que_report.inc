	config.initpage = function(formNode){
		var event = formNode.event;
		
		event.on('aftercustom', function(fe) {
			var page = fe.page;
			var tab = page.ownerCt.ownerCt;
			var tab1 = tab.getComponent(0);
			tab.activate(tab1);
			
			var grid = tab1.getComponent(0);
			grid.getStore().reload();
		});
	};
	