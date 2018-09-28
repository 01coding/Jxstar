Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataareatype = Jxstar.findComboData('areatype');
	var Datayesno = Jxstar.findComboData('yesno');

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
	{col:{header:'范围', width:79, sortable:true, hidden:true}, field:{name:'rpt_area__area_pos',type:'string'}},
	{col:{header:'区域类型', width:80, sortable:true, defaultval:'grid', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataareatype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataareatype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataareatype.length; i++) {
				if (Dataareatype[i][0] == value)
					return Dataareatype[i][1];
			}
		}}, field:{name:'rpt_area__area_type',type:'string'}},
	{col:{header:'主区域?', width:63, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_area__is_main',type:'string'}},
	{col:{header:'*每页行数', width:81, sortable:true, align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatInt()}, field:{name:'rpt_area__page_size',type:'int'}},
	{col:{header:'表名', width:124, sortable:true, hidden:true}, field:{name:'rpt_area__main_table',type:'string'}},
	{col:{header:'主键字段', width:162, sortable:true, hidden:true}, field:{name:'rpt_area__pk_col',type:'string'}},
	{col:{header:'区域SQL', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__data_sql',type:'string'}},
	{col:{header:'区域Where', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__data_where',type:'string'}},
	{col:{header:'区域Group', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__data_group',type:'string'}},
	{col:{header:'区域Order', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__data_order',type:'string'}},
	{col:{header:'数据源', width:74, sortable:true, defaultval:'default', editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:25
		})}, field:{name:'rpt_area__ds_name',type:'string'}},
	{col:{header:'统计区域?', width:100, sortable:true, hidden:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datayesno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'rpt_area__is_stat',type:'string'}},
	{col:{header:'子区域外键', width:137, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'rpt_area__sub_fkcol',type:'string'}},
	{col:{header:'区域ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_area__area_id',type:'string'}},
	{col:{header:'报表ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_area__report_id',type:'string'}},
	{col:{header:'表格标题?', width:79, sortable:true, hidden:true, defaultval:'0'}, field:{name:'rpt_area__is_head',type:'string'}},
	{col:{header:'占几列', width:60, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'rpt_area__head_colnum',type:'int'}},
	{col:{header:'扩展WhereSql', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__ext_wheresql',type:'string'}},
	{col:{header:'扩展WhereType', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__ext_wheretype',type:'string'}},
	{col:{header:'扩展WhereValue', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__ext_wherevalue',type:'string'}},
	{col:{header:'Grid不分页', width:82, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_area__not_page',type:'string'}},
	{col:{header:'分类标示字段', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__type_field',type:'string'}},
	{col:{header:'分类标题字段', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__type_field_title',type:'string'}},
	{col:{header:'是否输出合计', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__has_sum',type:'string'}},
	{col:{header:'不输出空行', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__is_notout',type:'string'}},
	{col:{header:'一条记录占几行', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'rpt_area__one_rows',type:'int'}},
	{col:{header:'删除子表空行', width:100, sortable:true, hidden:true}, field:{name:'rpt_area__not_row',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'rpt_area'
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
			
			//加载Form数据
			var hdcall = function(page) {
				//设置外键键
				page.getForm().fkName = 'rpt_drill__area_id';
				page.getForm().fkValue = area_id;
				
				//加载显示数据
				var options = {
					where_sql: 'rpt_drill.area_id = ?',
					where_type: 'string',
					where_value: area_id,
					callback: function(data) {
						//如果没有数据则执行新增
						if (data.length == 0) {
							page.formNode.event.create();
						} else {
							var r = page.formNode.event.newRecord(data[0]);
							
							page.getForm().myRecord = r;
							page.getForm().loadRecord(r);
						}
					}
				};
				Jxstar.queryData('rpt_drill', options);
			};
			
			//显示数据
			var define = Jxstar.findNode('rpt_drill');
			Jxstar.showData({
				filename: define.formpage,
				title: define.nodetitle,
				width: 600,
				height: 350,
				callback: hdcall
			});
		},

		showParam: function(){
			this.showData('rpt_param');
		},
		
		showField: function(){
			this.showData('rpt_detail');
		},
		
		showWfField: function(){
			this.showData('rpt_detailwf');
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
	};
		
	return new Jxstar.GridNode(config);
}