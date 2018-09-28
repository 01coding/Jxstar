Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datadatatype = Jxstar.findComboData('datatype');

	var cols = [
	{col:{header:'*序号', width:56, sortable:true, align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatInt()}, field:{name:'wf_order_field__field_no',type:'int'}},
	{col:{header:'*字段名', width:189, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'wf_order_field__field_name',type:'string'}},
	{col:{header:'*字段标题', width:146, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'wf_order_field__field_title',type:'string'}},
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
		}}, field:{name:'wf_order_field__data_type',type:'string'}},
	{col:{header:'来源控件', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			maxLength:20, name:'wf_order_field__control_name', 
			editable:true, hcss:'color:#2E6DA4;',
			triggerClass:'x-form-search-trigger', 
			listeners:{afterrender: function(combo) {
				JxSelect.initCombo('wf_order_field', combo, 'node_wf_order_field_editgrid');
			}}
		})}, field:{name:'wf_order_field__control_name',type:'string'}},
	{col:{header:'*是否概要', width:71, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'wf_order_field__is_summary',type:'string'}},
	{col:{header:'*是否显示', width:70, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'wf_order_field__is_show',type:'string'}},
	{col:{header:'审批单ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_order_field__order_id',type:'string'}},
	{col:{header:'字段ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_order_field__field_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'wf_order_field'
	};
	
	
	config.eventcfg = {
		//数据导入查询扩展
		dataImportParam: function() {
			var pform = JxUtil.getParentForm(this.grid);
			var fun_id = pform.get('wf_order__fun_id');
			//获取功能ID
			//var fun_id = this.grid.orderDetFunId;
			var options = {
				whereSql:'fun_col.fun_id = ?',
				whereType:'string',
				whereValue:fun_id
			};
			return options;
		}
		
	};
		
	return new Jxstar.GridNode(config);
}