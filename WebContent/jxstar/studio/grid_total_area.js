Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataareatypetot = Jxstar.findComboData('areatypetot');
	var Datadatasrc = Jxstar.findComboData('datasrc');

	var cols = [
	{col:{header:'序号', width:62, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'rpt_area__area_index',type:'int'}},
	{col:{header:'*名称', width:113, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'rpt_area__area_name',type:'string'}},
	{col:{header:'区域类型', width:80, sortable:true, defaultval:'assort', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataareatypetot
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataareatypetot[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataareatypetot.length; i++) {
				if (Dataareatypetot[i][0] == value)
					return Dataareatypetot[i][1];
			}
		}}, field:{name:'rpt_area__area_type',type:'string'}},
	{col:{header:'主区域?', width:63, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_area__is_main',type:'string'}},
	{col:{header:'SQL|类', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__data_sql',type:'string'}},
	{col:{header:'数据源', width:74, sortable:true, hidden:true, defaultval:'default'}, field:{name:'rpt_area__ds_name',type:'string'}},
	{col:{header:'统计区域?', width:100, sortable:true, hidden:true, defaultval:'0'}, field:{name:'rpt_area__is_stat',type:'string'}},
	{col:{header:'区域ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_area__area_id',type:'string'}},
	{col:{header:'报表ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_area__report_id',type:'string'}},
	{col:{header:'输出合计列', width:79, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_area__has_sum',type:'string'}},
	{col:{header:'表格标题?', width:79, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_area__is_head',type:'string'}},
	{col:{header:'占几列', width:68, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'rpt_area__head_colnum',type:'int'}},
	{col:{header:'WHERE参数类型', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__ext_wheretype',type:'string'}},
	{col:{header:'WHERE参数值', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__ext_wherevalue',type:'string'}},
	{col:{header:'分类标示字段', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'rpt_area__type_field',type:'string'}},
	{col:{header:'分类标题字段', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'rpt_area__type_field_title',type:'string'}},
	{col:{header:'权限?', width:63, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_area__is_userdata',type:'string'}},
	{col:{header:'权限功能', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'rpt_area__fun_id',type:'string'}},
	{col:{header:'来源类型', width:100, sortable:true, hidden:true, defaultval:'sql', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datadatasrc
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datadatasrc[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadatasrc.length; i++) {
				if (Datadatasrc[i][0] == value)
					return Datadatasrc[i][1];
			}
		}}, field:{name:'rpt_area__data_type',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'total_area'
	};
	
	
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
		
	return new Jxstar.GridNode(config);
}