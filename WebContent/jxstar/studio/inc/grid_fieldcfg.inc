
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		//表格编辑前事件，删除状态的记录不能修改
		grid.on('beforeedit', function(event) {
			var r = event.record;
			var a = 'dm_fieldcfg__state';
			return !(r.get(a) != 'undefined' && r.get(a) == '3');
		});
		//表格编辑后事件
		grid.on('afteredit', function(event) {
            var r = event.record;
			if (event.field == 'dm_fieldcfg__data_type') {
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
            if (event.field == 'dm_fieldcfg__field_name') {
                var fn = r.get('dm_fieldcfg__field_name').toLowerCase();
                r.set('dm_fieldcfg__field_name', fn);
            }
		});
	};