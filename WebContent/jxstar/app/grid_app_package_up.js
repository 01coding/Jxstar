Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*版本号', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'app_package_up__pack_version',type:'string'}},
	{col:{header:'*下载URL', width:287, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:200, allowBlank:false
		})}, field:{name:'app_package_up__pack_url',type:'string'}},
	{col:{header:'更新说明', width:232, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:500
		})}, field:{name:'app_package_up__update_desc',type:'string'}},
	{col:{header:'上传日期', width:100, sortable:true, defaultval:'fun_getToday()', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.DateField({
			format: 'Y-m-d',
			minValue: '1900-01-01'
		}),
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'app_package_up__edit_date',type:'date'}},
	{col:{header:'操作员', width:100, sortable:true, defaultval:'fun_getUserName()', editable:false,
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'app_package_up__edit_user',type:'string'}},
	{col:{header:'操作员ID', width:100, sortable:true, colindex:10000, hidden:true, defaultval:'fun_getUserId()'}, field:{name:'app_package_up__edit_userid',type:'string'}},
	{col:{header:'更新ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_package_up__update_id',type:'string'}},
	{col:{header:'应用包ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_package_up__pack_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'app_package_up'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}