Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*布局路径', width:268, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'funall_layout__layout_path',type:'string'}},
	{col:{header:'布局描述', width:244, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'funall_layout__layout_memo',type:'string'}},
	{col:{header:'布局ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'funall_layout__layout_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'fun_layout'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}