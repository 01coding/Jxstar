Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'流转ID', width:80, sortable:true}, field:{name:'wf_line__line_id',type:'string'}},
	{col:{header:'流转标题', width:112, sortable:true}, field:{name:'wf_line__line_title',type:'string'}},
	{col:{header:'流转类型', width:100, sortable:true}, field:{name:'wf_line__line_type',type:'string'}},
	{col:{header:'来源节点ID', width:100, sortable:true}, field:{name:'wf_line__source_id',type:'string'}},
	{col:{header:'目标节点ID', width:100, sortable:true}, field:{name:'wf_line__target_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_line__wfline_id',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_line__process_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'wf_line'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}