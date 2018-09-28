Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'编号', width:100, sortable:true}, field:{name:'sys_user__user_code',type:'string'}},
	{col:{header:'姓名', width:121, sortable:true}, field:{name:'sys_user__user_name',type:'string'}},
	{col:{header:'部门', width:138, sortable:true}, field:{name:'sys_dept__dept_name',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_post_user__post_detid',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_post_user__user_id',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user__dept_id',type:'string'}},
	{col:{header:'岗位ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_post_user__post_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sys_post_user'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}