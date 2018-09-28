Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'表名', width:114, sortable:true}, field:{name:'v_table_info__table_name',type:'string'}},
	{col:{header:'表标题', width:165, sortable:true}, field:{name:'v_table_info__table_title',type:'string'}},
	{col:{header:'表空间', width:143, sortable:true}, field:{name:'v_table_info__table_space',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'dm_reverse'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}