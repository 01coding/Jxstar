Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'节点名称', width:144, sortable:true}, field:{name:'wf_node__node_title',type:'string'}},
	{col:{header:'过程名称', width:145, sortable:true}, field:{name:'wf_process__process_name',type:'string'}},
	{col:{header:'过程编号', width:100, sortable:true}, field:{name:'wf_process__process_code',type:'string'}},
	{col:{header:'功能名称', width:126, sortable:true, hidden:true}, field:{name:'wf_process__fun_name',type:'string'}},
	{col:{header:'版本号', width:100, sortable:true, hidden:true}, field:{name:'wf_process__version_no',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_process__process_id',type:'string'}},
	{col:{header:'模块ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_process__module_id',type:'string'}},
	{col:{header:'节点ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_node__node_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_process__fun_id',type:'string'}},
	{col:{header:'属性ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_nodeattr__nodeattr_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'wf_user_def'
	};
	
	
	config.initpage = function(pageNode){		var grid = pageNode.page;		grid.getStore().on('load', function(s){		grid.getSelectionModel().selectFirstRow();		grid.fireEvent('rowclick', grid, 0);	});
};
		
	return new Jxstar.GridNode(config);
}