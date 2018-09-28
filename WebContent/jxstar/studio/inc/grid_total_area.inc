	
	config.eventcfg = {
		//显示明细表的数据
		showData: function(subid) {
			var self = this;
			var define = Jxstar.findNode(subid);
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			//过滤条件
			var where_sql = define.tablename + '.area_id = ?';
			var where_type = 'string';
			var where_value = records[0].get('rpt_area__area_id');
			
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
				width: 400,
				height: 450,
				modal: false,
				callback: hdcall
			});
		},
		
		showDrill: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			var area_id = records[0].get('rpt_area__area_id');
			var area_type = records[0].get('rpt_area__area_type');
			if (area_type != 'query') {
				JxHint.alert(jx.bus.text12);//'只有统计数据区域才可以定义数据钻取规则！'
				return;
			}
			
			//过滤条件
			var where_sql = 'rpt_drill.area_id = ?';
			var where_type = 'string';
			var where_value = area_id;
			
			//加载数据
			var hdcall = function(grid) {
				//显示数据
				JxUtil.delay(500, function(){
					//var grid = layout.getComponent(0).getComponent(0);
				
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};
			
			//显示数据
			var define = Jxstar.findNode('rpt_drill');
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				width: 600,
				height: 350,
				pagetype: 'subgrid',
				nodedefine: define,
				callback: hdcall
			});
		},

		showParam: function(){
			this.showData('rpt_param');
		},
		
		showField: function(){
			this.showData('total_detail');
		}
	};
	
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		var queryGrid = function(tablename, nodeid, g, rowindex) {
			var detGrid = g[nodeid];
			if (detGrid != null) {
				var record = g.getStore().getAt(rowindex);
				var areaId = record.get('rpt_area__area_id');
				
				detGrid.fkValue = areaId;
				var where_sql = tablename + '.area_id = ?';
				var where_type = 'string';
				var where_value = areaId;
				Jxstar.loadData(detGrid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
			}
		};
		
		grid.on('rowclick', function(g, rowindex, e) {
			queryGrid('rpt_detail', 'rpt_detail', g, rowindex);
			queryGrid('rpt_param', 'rpt_param', g, rowindex);
			queryGrid('rpt_detail_wf', 'rpt_detailwf', g, rowindex);
		});
		
		grid.on('beforedestroy', function(gp){
			var closeWin = function(g){
				if (!g) return;
				var win = g.findParentByType('window');
				if (win) win.close();
			};
			closeWin(gp.rpt_param);
			closeWin(gp.rpt_detail);
			closeWin(gp.rpt_detailwf);
			
			gp.rpt_param = null; delete gp.rpt_param;
			gp.rpt_detail = null; delete gp.rpt_detail;
			gp.rpt_detailwf = null; delete gp.rpt_detailwf;
		});
        
        var event = gridNode.event;
        event.on('beforesave', function(ge) {
            var records = ge.grid.getSelectionModel().getSelections();

            var store = ge.grid.getStore();
			var mrow = store.getModifiedRecords();
			if (mrow.length == 0) return true;
			
            for (var i = 0, n = mrow.length; i < n; i++) {
                var record = mrow[i];
                
                var area_type = record.get('rpt_area__area_type');
                var type_field = record.get('rpt_area__type_field');
                var field_title = record.get('rpt_area__type_field_title');

                if (area_type == 'cross' && type_field.length > 0 && field_title.length > 0) {
                    if (type_field == field_title) {
                        JxHint.alert('分类标示字段不能与分类标题字段相同！');
                        return false;
                    }
                }
            }
            return true;
        });
	};
