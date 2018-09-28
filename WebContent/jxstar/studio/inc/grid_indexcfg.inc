
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		//删除状态的记录不能修改
		grid.on('beforeedit', function(event) {
			var r = event.grid.store.getAt(event.row);
			var a = 'dm_indexcfg__state';
			return !(r.get(a) != 'undefined' && r.get(a) == '3');
		});
		
		//表格编辑后事件，索引名必须大写
		grid.on('afteredit', function(event) {
			if (event.field == 'dm_indexcfg__index_name') {
				var r = event.record;
				var indexName = r.get('dm_indexcfg__index_name');
				if (indexName.length > 0) {
					r.set('dm_indexcfg__index_name', indexName.toUpperCase());
				}
			}
		});
	};