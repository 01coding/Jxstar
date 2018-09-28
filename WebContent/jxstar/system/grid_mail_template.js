Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datayesno = Jxstar.findComboData('yesno');

	var cols = [
	{col:{header:'功能名称', width:117, sortable:true}, field:{name:'mail_template__fun_name',type:'string'}},
	{col:{header:'模板标识', width:188, sortable:true}, field:{name:'mail_template__template_tag',type:'string'}},
	{col:{header:'模板ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'mail_template__template_id',type:'string'}},
	{col:{header:'模板名称', width:198, sortable:true}, field:{name:'mail_template__template_name',type:'string'}},
	{col:{header:'默认模板', width:74, sortable:true, align:'center',
		editable:false,
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
		}}, field:{name:'mail_template__is_default',type:'string'}},
	{col:{header:'模板内容', width:353, sortable:true, hidden:true}, field:{name:'mail_template__template_cont',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'mail_template__fun_id',type:'string'}},
	{col:{header:'带附件', width:78, sortable:true, hidden:true, align:'center',
		editable:false,
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
		}}, field:{name:'mail_template__is_attach',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'mail_template'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}