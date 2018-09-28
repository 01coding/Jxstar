Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstatus = Jxstar.findComboData('regstatus');

	var cols = [
	{col:{header:'状态', width:63, sortable:true, align:'center',
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
		}}, field:{name:'fun_rule_route__status',type:'string'}},
	{col:{header:'目标功能ID', width:113, sortable:true}, field:{name:'fun_rule_route__fun_id',type:'string'}},
	{col:{header:'来源功能ID', width:120, sortable:true}, field:{name:'fun_rule_route__src_funid',type:'string'}},
	{col:{header:'来源功能Where', width:328, sortable:true}, field:{name:'fun_rule_route__where_sql',type:'string'}},
	{col:{header:'序号', width:50, sortable:true}, field:{name:'fun_rule_route__route_no',type:'string'}},
	{col:{header:'参数类型', width:149, sortable:true, hidden:true}, field:{name:'fun_rule_route__where_type',type:'string'}},
	{col:{header:'页面参数名', width:154, sortable:true, hidden:true}, field:{name:'fun_rule_route__where_value',type:'string'}},
	{col:{header:'路由ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_rule_route__route_id',type:'string'}},
	{col:{header:'导入布局', width:230, sortable:true}, field:{name:'fun_rule_route__layout_page',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'rule_route'
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