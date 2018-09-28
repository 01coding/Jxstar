Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'功能ID', width:157, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_coderule__fun_id',type:'string'}},
	{col:{header:'编码扩展', width:177, sortable:true}, field:{name:'sys_coderule__code_ext',type:'string'}},
	{col:{header:'编码流水号', width:115, sortable:true}, field:{name:'sys_coderule__code_no',type:'string'}},
	{col:{header:'编码长度,不含前缀', width:127, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'sys_coderule__code_length',type:'int'}},
	{col:{header:'编码规则说明', width:313, sortable:true}, field:{name:'sys_coderule__code_memo',type:'string'}},
	{col:{header:'编码规则ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_coderule__rule_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sys_coderule'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}