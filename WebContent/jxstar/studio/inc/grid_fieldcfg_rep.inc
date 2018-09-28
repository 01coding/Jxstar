
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		//表格编辑后事件
		grid.on('afteredit', function(event) {
			if (event.field == 'dm_fieldcfg__data_type') {
				var r = event.record;
				var datatype = r.get('dm_fieldcfg__data_type');
				if (datatype == 'char') {
					r.set('dm_fieldcfg__data_size', '1');
					r.set('dm_fieldcfg__data_scale', '');
				} else if (datatype == 'int') {
					r.set('dm_fieldcfg__data_size', '22');
					r.set('dm_fieldcfg__data_scale', '0');
					r.set('dm_fieldcfg__default_value', '0');
				} else if (datatype == 'number') {
					r.set('dm_fieldcfg__data_size', '22');
					r.set('dm_fieldcfg__data_scale', '6');
					r.set('dm_fieldcfg__default_value', '0');
				} else if (datatype == 'date') {
					r.set('dm_fieldcfg__data_size', '7');
					r.set('dm_fieldcfg__data_scale', '');
				} else {
					r.set('dm_fieldcfg__data_size', '0');
					r.set('dm_fieldcfg__data_scale', '');
				}
			}
		});
	};