Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'记录时间', width:191, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'sys_log__log_date',type:'date'}},
	{col:{header:'功能名称', width:142, sortable:true}, field:{name:'sys_log__fun_name',type:'string'}},
	{col:{header:'数据ID', width:122, sortable:true}, field:{name:'sys_log__data_id',type:'string'}},
	{col:{header:'事件名称', width:100, sortable:true}, field:{name:'sys_log__event_name',type:'string'}},
	{col:{header:'用户名', width:70, sortable:true}, field:{name:'sys_log__user_name',type:'string'}},
	{col:{header:'消息', width:272, sortable:true}, field:{name:'sys_log__message',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true}, field:{name:'sys_log__fun_id',type:'string'}},
	{col:{header:'事件代码', width:100, sortable:true}, field:{name:'sys_log__event_code',type:'string'}},
	{col:{header:'页面类型', width:100, sortable:true}, field:{name:'sys_log__page_type',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_log__user_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_log__log_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sys_log'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}