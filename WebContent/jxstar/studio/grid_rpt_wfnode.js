Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'过程名称', width:159, sortable:true}, field:{name:'wf_process__process_name',type:'string'}},
	{col:{header:'节点名称', width:167, sortable:true}, field:{name:'wf_node__node_title',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000}, field:{name:'wf_process__fun_id',type:'string'}},
	{col:{header:'节点ID', width:100, sortable:true, colindex:10000}, field:{name:'wf_node__node_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_node__wfnode_id',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_node__process_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'rpt_wfnode'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}