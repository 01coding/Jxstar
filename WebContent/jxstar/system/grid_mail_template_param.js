Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datamailparam = Jxstar.findComboData('mailparam');

	var cols = [
	{col:{header:'*序号', width:67, sortable:true, align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'mail_template_param__param_index',type:'string'}},
	{col:{header:'参数代号', width:172, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:30
		})}, field:{name:'mail_template_param__param_name',type:'string'}},
	{col:{header:'参数标题', width:141, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'mail_template_param__param_title',type:'string'}},
	{col:{header:'*类型', width:79, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datamailparam
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datamailparam[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datamailparam.length; i++) {
				if (Datamailparam[i][0] == value)
					return Datamailparam[i][1];
			}
		}}, field:{name:'mail_template_param__param_type',type:'string'}},
	{col:{header:'缺省值', width:389, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'mail_template_param__param_value',type:'string'}},
	{col:{header:'模板ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'mail_template_param__template_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'mail_template_param__param_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'mail_template_param'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}