Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*参数名称', width:139, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'task_param__param_name',type:'string'}},
	{col:{header:'*参数值', width:126, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'task_param__param_value',type:'string'}},
	{col:{header:'参数描述', width:179, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'task_param__param_memo',type:'string'}},
	{col:{header:'任务ID', width:100, sortable:true, hidden:true}, field:{name:'task_param__task_id',type:'string'}},
	{col:{header:'参数ID', width:100, sortable:true, hidden:true}, field:{name:'task_param__param_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_taskparam'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}