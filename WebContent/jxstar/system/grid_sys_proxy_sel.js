Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataaudit = Jxstar.findComboData('audit');

	var cols = [
	{col:{header:'记录状态', width:68, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataaudit
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataaudit[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataaudit.length; i++) {
				if (Dataaudit[i][0] == value)
					return Dataaudit[i][1];
			}
		}}, field:{name:'sys_proxy__auditing',type:'string'}},
	{col:{header:'被代理人账号', width:100, sortable:true}, field:{name:'sys_proxy__to_user_code',type:'string'}},
	{col:{header:'被代理人', width:72, sortable:true}, field:{name:'sys_proxy__to_user_name',type:'string'}},
	{col:{header:'代理结束日期', width:109, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'sys_proxy__end_date',type:'date'}},
	{col:{header:'代理开始日期', width:101, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'sys_proxy__start_date',type:'date'}},
	{col:{header:'代理人账号', width:87, sortable:true}, field:{name:'sys_proxy__user_code',type:'string'}},
	{col:{header:'代理人', width:69, sortable:true}, field:{name:'sys_proxy__user_name',type:'string'}},
	{col:{header:'设置人', width:57, sortable:true, hidden:true}, field:{name:'sys_proxy__set_user',type:'string'}},
	{col:{header:'设置日期', width:100, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'sys_proxy__set_date',type:'date'}},
	{col:{header:'设置说明', width:165, sortable:true, hidden:true}, field:{name:'sys_proxy__set_memo',type:'string'}},
	{col:{header:'代理人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_proxy__user_id',type:'string'}},
	{col:{header:'被代理人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_proxy__to_user_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_proxy__proxy_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sys_proxy_sel'
	};
	
	config.param.selectModel = 'nocheck';
	config.param.hidePageTool = true;

	config.eventcfg = {		
		selproxy: function() {
			var records = JxUtil.getSelectRows(this.grid);
			if (!JxUtil.selected(records)) return;
			
			var to_userid = records[0].get('sys_proxy__to_user_id');
			var proxy_userid = records[0].get('sys_proxy__user_id');
			JxMenu.loginProxy(to_userid, proxy_userid, '1');
			
			var win = this.grid.findParentByType('window');
			if (win) win.close();
		}
	};
	
config.initpage = function(gridNode){ 
	var grid = gridNode.page;
	var gevent = gridNode.event;
	
	grid.on('rowdblclick', function(g) {
		gevent.selproxy();
	});
};
		
	return new Jxstar.GridNode(config);
}