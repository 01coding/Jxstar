Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datayesno = Jxstar.findComboData('yesno');

	var cols = [
	{col:{header:'关联描述', width:151, sortable:true}, field:{name:'sys_attach_relat__relat_name',type:'string'}},
	{col:{header:'当前表名', width:113, sortable:true}, field:{name:'sys_attach_relat__table_name',type:'string'}},
	{col:{header:'关联表名', width:112, sortable:true}, field:{name:'sys_attach_relat__target_table',type:'string'}},
	{col:{header:'生效？', width:62, sortable:true, align:'center',
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
			editable:false, allowBlank:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'sys_attach_relat__is_valid',type:'string'}},
	{col:{header:'定制类？', width:85, sortable:true, align:'center',
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
			editable:false, allowBlank:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'sys_attach_relat__use_class',type:'string'}},
	{col:{header:'关联SQL或类名', width:460, sortable:true}, field:{name:'sys_attach_relat__relat_sql',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_attach_relat__relat_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sys_attach_relat'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}