Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*栏目代号', width:141, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'plet_type__type_code',type:'string'}},
	{col:{header:'*栏目名称', width:163, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'plet_type__type_name',type:'string'}},
	{col:{header:'*图标CSS', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'plet_type__iconcls',type:'string'}},
	{col:{header:'高度', width:70, sortable:true, hidden:true, defaultval:'220', align:'right',renderer:JxUtil.formatInt()}, field:{name:'plet_type__height',type:'int'}},
	{col:{header:'栏目ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'plet_type__type_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'plet_type'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}