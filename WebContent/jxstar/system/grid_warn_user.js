Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'用户编码', width:100, sortable:true}, field:{name:'sys_user__user_code',type:'string'}},
	{col:{header:'用户姓名', width:100, sortable:true}, field:{name:'warn_user__user_name',type:'string'}},
	{col:{header:'上报ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'warn_user__warn_id',type:'string'}},
	{col:{header:'分配ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'warn_user__user_detid',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'warn_user__user_id',type:'string'}},
	{col:{header:'分配条件', width:238, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'warn_user__cond_where',type:'string'}},
	{col:{header:'部门编码', width:100, sortable:true}, field:{name:'sys_dept__dept_code',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_dept__dept_id',type:'string'}},
	{col:{header:'部门名称', width:125, sortable:true}, field:{name:'sys_dept__dept_name',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_warnuser'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}