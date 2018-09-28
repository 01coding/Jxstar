Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*报销项目', width:170, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'oa_appbx_det__appbx_project',type:'string'}},
	{col:{header:'*金额(元)', width:129, sortable:true, align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'oa_appbx_det__money',type:'float'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_appbx_det__det_id',type:'string'}},
	{col:{header:'报销单id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_appbx_det__apply_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'oa_appbx_det'
	};
	
	config.param.substat = true;

	
		
	return new Jxstar.GridNode(config);
}