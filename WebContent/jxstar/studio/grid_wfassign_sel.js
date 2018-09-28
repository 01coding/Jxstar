Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'节点', width:221, sortable:true}, field:{name:'v_wf_assignsel__node_title',type:'string'}},
	{col:{header:'审批人', width:100, sortable:true}, field:{name:'v_wf_assignsel__check_user',type:'string'}},
	{col:{header:'节点ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assignsel__node_id',type:'string'}},
	{col:{header:'审批人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assignsel__check_userid',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assignsel__data_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assignsel__fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'wf_assignsel'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}