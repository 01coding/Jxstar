Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'记录时间', width:119, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'sys_log_edit__edit_date',type:'date'}},
	{col:{header:'功能名称', width:123, sortable:true}, field:{name:'sys_log_edit__fun_name',type:'string'}},
	{col:{header:'用户名', width:100, sortable:true}, field:{name:'sys_log_edit__user_name',type:'string'}},
	{col:{header:'事件名称', width:100, sortable:true, hidden:true}, field:{name:'sys_log_edit__event_name',type:'string'}},
	{col:{header:'数据修改描述', width:318, sortable:true}, field:{name:'sys_log_edit__edit_desc',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true}, field:{name:'sys_log_edit__data_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true}, field:{name:'sys_log_edit__fun_id',type:'string'}},
	{col:{header:'父功能ID', width:100, sortable:true}, field:{name:'sys_log_edit__pfun_id',type:'string'}},
	{col:{header:'父数据ID', width:100, sortable:true}, field:{name:'sys_log_edit__pdata_id',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_log_edit__user_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_log_edit__edit_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sys_log_edit'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}