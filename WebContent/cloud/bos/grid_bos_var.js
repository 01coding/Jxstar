Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*属性编码', width:171, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'bos_var__var_code',type:'string'}},
	{col:{header:'*属性名称', width:280, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'bos_var__var_name',type:'string'}},
	{col:{header:'属性值', width:258, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'bos_var__var_value',type:'string'}},
	{col:{header:'租户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_var__bos_tenant_id',type:'string'}},
	{col:{header:'属性ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_var__var_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'bos_var'
	};
	
	config.param.notNullFields = 'bos_var__var_code;bos_var__var_name;';
	
	
		
	return new Jxstar.GridNode(config);
}