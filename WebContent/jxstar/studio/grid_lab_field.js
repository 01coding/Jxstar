Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'序号', width:61, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'lab_field__field_index',type:'int'}},
	{col:{header:'*字段名', width:112, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'lab_field__field_code',type:'string'}},
	{col:{header:'*字段标题', width:128, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'lab_field__field_title',type:'string'}},
	{col:{header:'方案id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'lab_field__case_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'lab_field__field_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'lab_field'
	};
	
	config.param.hidePageTool = true;

	
		
	return new Jxstar.GridNode(config);
}