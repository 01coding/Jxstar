Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'栏目代号', width:127, sortable:true}, field:{name:'v_plet_type__type_code',type:'string'}},
	{col:{header:'栏目名称', width:159, sortable:true}, field:{name:'v_plet_type__type_name',type:'string'}},
	{col:{header:'内容名称', width:197, sortable:true}, field:{name:'v_plet_type__object_name',type:'string'}},
	{col:{header:'栏目ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_plet_type__type_id',type:'string'}},
	{col:{header:'内容ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_plet_type__object_id',type:'string'}},
	{col:{header:'显示标题', width:174, sortable:true}, field:{name:'v_plet_type__portlet_title',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sel_plettype'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}