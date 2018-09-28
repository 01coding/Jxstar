	var renderTask = function(value, metaData, record) {
		var color = value == '0' ? 'green' : 'red'
		var title = value || '';
		var cbo = Jxstar.findComboData('regstatus');
		for (var i = 0; i < cbo.length; i++) {
			if (cbo[i][0] == value) {
				title = cbo[i][1]; break;
			}
		}
		
		var html = '<span style="color:'+ color +'; font-weight:bold;">'+ title +'</span>';
		return html;
	};
	
	for (var i = 0; i < cols.length; i++) {
		if (cols[i].field.name.indexOf('__status') > 0) {
			cols[i].col.renderer = renderTask;
			break;
		}
	}
		
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