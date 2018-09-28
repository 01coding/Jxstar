Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*代号', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'app_server__server_code',type:'string'}},
	{col:{header:'*系统名称', width:190, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'app_server__project_name',type:'string'}},
	{col:{header:'*数据源', width:138, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'app_server__ds_name',type:'string'}},
	{col:{header:'*系统URL', width:424, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:200, allowBlank:false
		})}, field:{name:'app_server__server_url',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_server__server_id',type:'string'}},
	{col:{header:'数据类型', width:100, sortable:true, hidden:true, defaultval:'check'}, field:{name:'app_server__data_type',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'wf_checksev'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}