Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datadatatype = Jxstar.findComboData('datatype');

	var cols = [
	{col:{header:'*序号', width:52, sortable:true, defaultval:'10', align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatInt()}, field:{name:'fun_rule_param__param_no',type:'int'}},
	{col:{header:'*参数名称', width:144, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'fun_rule_param__param_name',type:'string'}},
	{col:{header:'*参数类型', width:134, sortable:true, defaultval:'string', align:'center',
		editable:true, hcss:'color:#0077FF;',
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
			editable:false, allowBlank:false,
			value: Datadatatype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadatatype.length; i++) {
				if (Datadatatype[i][0] == value)
					return Datadatatype[i][1];
			}
		}}, field:{name:'fun_rule_param__param_type',type:'string'}},
	{col:{header:'参数ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_rule_param__param_id',type:'string'}},
	{col:{header:'规则ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_rule_param__rule_id',type:'string'}},
	{col:{header:'参数来源', width:100, sortable:true, colindex:100000, hidden:true, defaultval:'db'}, field:{name:'fun_rule_param__param_src',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'rule_param'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}