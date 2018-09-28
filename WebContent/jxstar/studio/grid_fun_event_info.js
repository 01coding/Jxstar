Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datayesno = Jxstar.findComboData('yesno');
	var Dataeventext = Jxstar.findComboData('eventext');

	var cols = [
	{col:{header:'类名(含包名)', width:242, sortable:true}, field:{name:'module_name',type:'string'}},
	{col:{header:'方法名', width:104, sortable:true}, field:{name:'method_name',type:'string'}},
	{col:{header:'序号', width:71, sortable:true, colindex:10000, hidden:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'invoke_index',type:'float'}},
	{col:{header:'事件代码', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'event_code',type:'string'}},
	{col:{header:'事件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'event_id',type:'string'}},
	{col:{header:'功能标识', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_id',type:'string'}},
	{col:{header:'调用ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'invoke_id',type:'string'}},
	{col:{header:'系统类?', width:76, sortable:true, align:'center',
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
		}}, field:{name:'issys',type:'string'}},
	{col:{header:'SQL?', width:78, sortable:true}, field:{name:'hassql',type:'string'}},
	{col:{header:'扩展位置', width:72, sortable:true, colindex:10000, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataeventext
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataeventext[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataeventext.length; i++) {
				if (Dataeventext[i][0] == value)
					return Dataeventext[i][1];
			}
		}}, field:{name:'position',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'fun_event_info'
	};
	
	config.param.selectModel = 'nocheck';
	config.param.hidePageTool = true;

	var lickSql = function(col, grid, row, e){
		var rec = grid.getStore().getAt(row);
		var fun_id = rec.get('fun_id');
		var event_code = rec.get('event_code');
		
		var where_value = encodeURIComponent('0;'+fun_id+';%,'+event_code+',%');
		//过滤条件
		var params = 'eventcode=query_data&funid=queryevent&query_funid=rule_sqlm';
		params += '&where_sql=status = ? and src_funid = ? and event_code like ?';
		params += '&where_type=string;string;string';
		params += '&where_value='+where_value;
		
		var hdCall = function(data) {
			//data.root
			var tpl = new Ext.XTemplate(
				'<div>',
				'<tpl for="root">'+
				'<table style="border:1px solid #C7C7C7;font-size:13px;width:400px;">'+
				  '<tr>'+
					'<td bgcolor="#CCCCCC">序号：{fun_rule_sql__sql_no}</td>'+
					'<td bgcolor="#CCCCCC">触发事件：{fun_rule_sql__event_code}</td>'+
				  '</tr>'+
				  '<tr>'+
					'<td colspan="2"><b>来源SQL：</b>{fun_rule_sql__src_sql}</td>'+
				  '</tr>'+
				  '<tr>'+
					'<td colspan="2"><b>目标SQL：</b>{fun_rule_sql__dest_sql}</td>'+
				  '</tr>'+
				'</table>'+
				'</tpl>',
				'</div>'
			);
			var dataDiv = new Ext.BoxComponent({
				tpl: tpl,
				data: data,
				height: 272,
				autoScroll: true
			});
			
			//显示数据
			var menu = new Ext.menu.Menu({width:450, height:280});
			menu.add(dataDiv);
			menu.show(e.getTarget());
		};
		
		Request.dataRequest(params, hdCall);
	};

	var renderSql = function(value, metaData, record) {
		if (value == '1') {
			return '<a>查看SQL</a>';
		} else {
			return '';
		}
	};
	
	for (var i = 0; i < cols.length; i++) {
		if (cols[i].field.name == 'hassql') {
			cols[i].col.renderer = renderSql;
			cols[i].col.listeners = {click: lickSql};
			break;
		}
	}
		
	return new Jxstar.GridNode(config);
}