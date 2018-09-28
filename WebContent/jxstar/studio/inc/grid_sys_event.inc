	config.eventcfg = {
		f_invoke: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			//过滤条件
			var where_sql = 'fun_event_invoke.event_id = ?';
			var where_type = 'string';
			var where_value = records[0].get('fun_event__event_id');
			
			//加载数据
			var hdcall = function(layout) {
				//显示数据
				JxUtil.delay(500, function(){
					//调用类表
					var grid = layout.getComponent(0).getComponent(0);
					//设置外键值
					grid.fkValue = where_value;

					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			//显示数据
			Jxstar.showData({
				filename: '/jxstar/studio/pub/layout_invoke.js',
				title: jx.fun.invoke,	//'调用类注册' 
				callback: hdcall
			});
		}
	};