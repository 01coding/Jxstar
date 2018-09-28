Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datayesno = Jxstar.findComboData('yesno');

	var cols = [
	{col:{header:'*文件名称', width:206, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'sys_doc__doc_name',type:'string'}},
	{col:{header:'上传日期', width:100, sortable:true, defaultval:'fun_getToday()', align:'center',
		editable:false,
		editor:new Ext.form.DateField({
			format: 'Y-m-d',
			minValue: '1900-01-01'
		}),
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'sys_doc__edit_date',type:'date'}},
	{col:{header:'上传人', width:100, sortable:true, defaultval:'fun_getUserName()', editable:false,
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'sys_doc__edit_user',type:'string'}},
	{col:{header:'是否注销', width:100, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datayesno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'sys_doc__is_cancel',type:'string'}},
	{col:{header:'文件说明', width:191, sortable:true, hidden:true}, field:{name:'sys_doc__doc_memo',type:'string'}},
	{col:{header:'上传人ID', width:100, sortable:true, colindex:10000, hidden:true, defaultval:'fun_getUserId()'}, field:{name:'sys_doc__edit_userid',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_doc__doc_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'sys_doc'
	};
	
	config.param.notNullFields = 'sys_doc__doc_name;';
	JxAttach.addAttachCol(cols);

	
		
	return new Jxstar.GridNode(config);
}