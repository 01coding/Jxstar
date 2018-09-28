Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'申请时间', width:156, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'oa_apply__app_date',type:'date'}},
	{col:{header:'申请人', width:100, sortable:true}, field:{name:'oa_apply__edit_user',type:'string'}},
	{col:{header:'摘要', width:177, sortable:true}, field:{name:'oa_apply__app_desc',type:'string'}},
	{col:{header:'申请单号', width:143, sortable:true}, field:{name:'oa_apply__app_code',type:'string'}},
	{col:{header:'申请类型', width:100, sortable:true}, field:{name:'oa_apply__app_type',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__apply_id',type:'string'}},
	{col:{header:'申请人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__edit_userid',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'oa_app'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}