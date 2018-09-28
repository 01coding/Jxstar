Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstatus = Jxstar.findComboData('regstatus');
	var Datap_settype = Jxstar.findComboData('p_settype');

	var cols = [
	{col:{header:'序号', width:48, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'fun_check__check_no',type:'int'}},
	{col:{header:'检查项描述', width:185, sortable:true}, field:{name:'fun_check__check_name',type:'string'}},
	{col:{header:'执行SQL', width:181, sortable:true}, field:{name:'fun_check__dest_sql',type:'string'}},
	{col:{header:'类名', width:273, sortable:true, hidden:true}, field:{name:'fun_check__class_name',type:'string'}},
	{col:{header:'方法名', width:100, sortable:true, hidden:true}, field:{name:'fun_check__method_name',type:'string'}},
	{col:{header:'功能标识', width:100, sortable:true, hidden:true}, field:{name:'fun_check__fun_id',type:'string'}},
	{col:{header:'检查项ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_check__check_id',type:'string'}},
	{col:{header:'状态', width:78, sortable:true, align:'center',
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
		}}, field:{name:'fun_check__status',type:'string'}},
	{col:{header:'事件代号', width:100, sortable:true}, field:{name:'fun_check__event_code',type:'string'}},
	{col:{header:'设置类型', width:92, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datap_settype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datap_settype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datap_settype.length; i++) {
				if (Datap_settype[i][0] == value)
					return Datap_settype[i][1];
			}
		}}, field:{name:'fun_check__set_type',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'fun_check'
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