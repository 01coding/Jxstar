Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*域事件代码', width:121, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'funall_domain__domain_code',type:'string'}},
	{col:{header:'*域事件名称', width:132, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'funall_domain__domain_name',type:'string'}},
	{col:{header:'域id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'funall_domain__domain_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'event_domain'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}