Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'事件代码', width:119, sortable:true}, field:{name:'fun_event__event_code',type:'string'}},
	{col:{header:'事件名称', width:128, sortable:true}, field:{name:'fun_event__event_name',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_event__role_event_id',type:'string'}},
	{col:{header:'事件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_event__event_id',type:'string'}},
	{col:{header:'角色功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_event__role_fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sys_role_event'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}