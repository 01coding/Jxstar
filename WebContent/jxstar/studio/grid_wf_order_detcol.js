Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datadatatype = Jxstar.findComboData('datatype');
	var Datadisplaycol = Jxstar.findComboData('displaycol');

	var cols = [
	{col:{header:'*序号', width:58, sortable:true, align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatInt()}, field:{name:'wf_order_detcol__field_no',type:'int'}},
	{col:{header:'*字段名', width:183, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'wf_order_detcol__field_name',type:'string'}},
	{col:{header:'*字段标题', width:97, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'wf_order_detcol__field_title',type:'string'}},
	{col:{header:'数据类型', width:100, sortable:true, defaultval:'string', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datadatatype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datadatatype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadatatype.length; i++) {
				if (Datadatatype[i][0] == value)
					return Datadatatype[i][1];
			}
		}}, field:{name:'wf_order_detcol__data_type',type:'string'}},
	{col:{header:'来源控件', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			maxLength:20, name:'wf_order_detcol__control_name', 
			editable:true, hcss:'color:#2E6DA4;',
			triggerClass:'x-form-search-trigger', 
			listeners:{afterrender: function(combo) {
				JxSelect.initCombo('wf_order_detcol', combo, 'node_wf_order_detcol_editgrid');
			}}
		})}, field:{name:'wf_order_detcol__control_name',type:'string'}},
	{col:{header:'*显示列', width:66, sortable:true, defaultval:'col1', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datadisplaycol
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datadisplaycol[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadisplaycol.length; i++) {
				if (Datadisplaycol[i][0] == value)
					return Datadisplaycol[i][1];
			}
		}}, field:{name:'wf_order_detcol__display_col',type:'string'}},
	{col:{header:'明细ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_order_detcol__detail_id',type:'string'}},
	{col:{header:'明细字段ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_order_detcol__col_detid',type:'string'}},
	{col:{header:'统计?', width:65, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'wf_order_detcol__is_statcol',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'wf_order_detcol'
	};
	
	
	config.initpage = function(gridNode){		var event = gridNode.event;		var grid = gridNode.page;					};		config.eventcfg = {		//数据导入查询扩展		dataImportParam: function() {			//获取功能ID			var fun_id = this.grid.orderDetFunId;			var options = {				whereSql:'fun_col.fun_id = ?',				whereType:'string',				whereValue:fun_id			};			return options;		}			};
		
	return new Jxstar.GridNode(config);
}