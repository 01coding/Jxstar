Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstatus = Jxstar.findComboData('regstatus');
	var Datadotype = Jxstar.findComboData('dotype');

	var cols = [
	{col:{header:'序号', width:48, sortable:true}, field:{name:'fun_rule_sql__sql_no',type:'string'}},
	{col:{header:'来源功能ID', width:112, sortable:true}, field:{name:'fun_rule_sql__src_funid',type:'string'}},
	{col:{header:'目标更新SQL', width:333, sortable:true}, field:{name:'fun_rule_sql__dest_sql',type:'string'}},
	{col:{header:'目标功能ID', width:100, sortable:true, hidden:true}, field:{name:'fun_rule_sql__dest_funid',type:'string'}},
	{col:{header:'来源数据SQL', width:198, sortable:true, hidden:true}, field:{name:'fun_rule_sql__src_sql',type:'string'}},
	{col:{header:'触发事件', width:77, sortable:true}, field:{name:'fun_rule_sql__event_code',type:'string'}},
	{col:{header:'状态', width:55, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataregstatus
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataregstatus[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataregstatus.length; i++) {
				if (Dataregstatus[i][0] == value)
					return Dataregstatus[i][1];
			}
		}}, field:{name:'fun_rule_sql__status',type:'string'}},
	{col:{header:'SQL说明', width:177, sortable:true}, field:{name:'fun_rule_sql__rule_name',type:'string'}},
	{col:{header:'操作类型', width:67, sortable:true, colindex:10000, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datadotype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datadotype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadotype.length; i++) {
				if (Datadotype[i][0] == value)
					return Datadotype[i][1];
			}
		}}, field:{name:'fun_rule_sql__do_type',type:'string'}},
	{col:{header:'规则ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_rule_sql__rule_id',type:'string'}},
	{col:{header:'路由ID', width:81, sortable:true, hidden:true}, field:{name:'fun_rule_sql__route_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'rule_sqlm'
	};
	
	
	var renderTask = function(value, metaData, record) {
		var color = value == '0' ? 'green' : 'red'
		var title = value || '';
		var cbo = Jxstar.findComboData('regstatus');
		for (var i = 0; i < cbo.length; i++) {
			if (cbo[i][0] == value) {
				title = cbo[i][1]; break;
			}
		}
		
		var html = '<span style="color:'+ color +'; font-weight:bold;">'+ title +'</span>';
		return html;
	};
	
	for (var i = 0; i < cols.length; i++) {
		if (cols[i].field.name.indexOf('__status') > 0) {
			cols[i].col.renderer = renderTask;
			break;
		}
	}
		
	return new Jxstar.GridNode(config);
}