	
	config.initpage = function(gridNode){
		var event = gridNode.event;
		event.on('beforecreate', function(event) {
			var page = event.grid;
			var attr = page.treeNodeAttr;
			if (attr) {
				var record = page.getStore().getAt(0);
				record.set('rpt_list__module_id', attr.id);
			}
		});
	};