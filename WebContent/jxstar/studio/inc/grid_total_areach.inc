	
	config.eventcfg = {
        showChart: function() {
            Jxstar.createNode('plet_chart');
        },
		
		//显示明细表的数据
		showParam: function() {
			var self = this;
            var subid = 'rpt_param';
			var define = Jxstar.findNode(subid);
            var sm = self.grid.getSelectionModel();
			var records = sm.getSelections();
			if (records == null || records.length == 0) {
                sm.selectFirstRow();
                records = sm.getSelections();
                if (!JxUtil.selected(records)) return;
            }
			
			//过滤条件
			var where_sql = 'rpt_param.area_id in (select a.area_id from rpt_chart a, rpt_chart b where a.report_id = b.report_id and b.area_id = ?)';
			var where_type = 'string';
			var where_value = records[0].get('rpt_chart__area_id');
			
			//加载数据
			var hdcall = function(grid) {
				grid.getBottomToolbar().hide();
				
				//显示数据
				JxUtil.delay(500, function(){
					//保存子表控件
					self.grid[subid] = grid;
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type, has_page:0});
				});
			};

			//显示数据
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				pagetype: 'subeditgrid',
				nodedefine: define,
				width: 800,
				height: 300,
				modal: false,
				callback: hdcall
			});
		},
		
        //布局设置
        design: function(){
            var self = this; 
			var keyid = self.grid.fkValue;
			
			if (!window.JxTotalChart) {
				JxUtil.loadJS('/public/layout/ux/total_chart.js');
			}
			JxTotalChart.readTemp('settemp', keyid, '0');
            
        }
	};
	
