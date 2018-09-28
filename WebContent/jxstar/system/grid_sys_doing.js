Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'功能ID', width:100, sortable:true}, field:{name:'sys_doing__fun_id',type:'string'}},
	{col:{header:'事件代号', width:100, sortable:true}, field:{name:'sys_doing__event_code',type:'string'}},
	{col:{header:'数据ID', width:132, sortable:true}, field:{name:'sys_doing__key_id',type:'string'}},
	{col:{header:'页面类型', width:100, sortable:true}, field:{name:'sys_doing__page_type',type:'string'}},
	{col:{header:'新增人ID', width:113, sortable:true}, field:{name:'sys_doing__add_userid',type:'string'}},
	{col:{header:'新增时间', width:142, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'sys_doing__add_date',type:'date'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'sys_doing'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}