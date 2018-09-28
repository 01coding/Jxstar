Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*关系SQL', width:531, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:1000, allowBlank:false
		})}, field:{name:'imp_relat__relat_sql',type:'string'}},
	{col:{header:'定义ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'imp_relat__imp_id',type:'string'}},
	{col:{header:'关系ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'imp_relat__relat_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '0',
		funid: 'imp_relat'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}