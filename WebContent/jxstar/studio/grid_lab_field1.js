Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'序号', width:61, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'lab_field__field_index',type:'int'}},
	{col:{header:'字段名称', width:140, sortable:true}, field:{name:'lab_field__field_title',type:'string'}},
	{col:{header:'字段代号', width:105, sortable:true, hidden:true}, field:{name:'lab_field__field_code',type:'string'}},
	{col:{header:'方案id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'lab_field__case_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'lab_field__field_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'lab_field1'
	};
	
	config.param.selectModel = 'nocheck';
	config.param.hidePageTool = true;
	config.param.noRowNum = true;

	
		
	return new Jxstar.GridNode(config);
}