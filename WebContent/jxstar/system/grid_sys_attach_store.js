Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataaudit = Jxstar.findComboData('audit');
	var Datayesno = Jxstar.findComboData('yesno');
	var Datafstore_type = Jxstar.findComboData('fstore_type');
	var Dataname_type = Jxstar.findComboData('name_type');
	var Datafstore_path = Jxstar.findComboData('fstore_path');

	var cols = [
	{col:{header:'记录状态', width:75, sortable:true, align:'center',
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
		}}, field:{name:'sys_attach_store__auditing',type:'string'}},
	{col:{header:'序号', width:54, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'sys_attach_store__store_no',type:'int'}},
	{col:{header:'默认库?', width:83, sortable:true, align:'center',
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
		}}, field:{name:'sys_attach_store__is_default',type:'string'}},
	{col:{header:'附件库名称', width:134, sortable:true}, field:{name:'sys_attach_store__store_name',type:'string'}},
	{col:{header:'存储方式', width:80, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datafstore_type
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datafstore_type[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datafstore_type.length; i++) {
				if (Datafstore_type[i][0] == value)
					return Datafstore_type[i][1];
			}
		}}, field:{name:'sys_attach_store__store_type',type:'string'}},
	{col:{header:'本地(远端)路径', width:133, sortable:true}, field:{name:'sys_attach_store__local_path',type:'string'}},
	{col:{header:'FTP地址', width:123, sortable:true}, field:{name:'sys_attach_store__ftp_ip',type:'string'}},
	{col:{header:'FTP端口', width:62, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'sys_attach_store__ftp_port',type:'int'}},
	{col:{header:'FTP用户', width:100, sortable:true}, field:{name:'sys_attach_store__ftp_user',type:'string'}},
	{col:{header:'FTP密码', width:100, sortable:true}, field:{name:'sys_attach_store__ftp_pwd',type:'string'}},
	{col:{header:'存储命名类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataname_type
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataname_type[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataname_type.length; i++) {
				if (Dataname_type[i][0] == value)
					return Dataname_type[i][1];
			}
		}}, field:{name:'sys_attach_store__name_type',type:'string'}},
	{col:{header:'存储目录类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datafstore_path
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datafstore_path[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datafstore_path.length; i++) {
				if (Datafstore_path[i][0] == value)
					return Datafstore_path[i][1];
			}
		}}, field:{name:'sys_attach_store__path_type',type:'string'}},
	{col:{header:'创建日期', width:100, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'sys_attach_store__edit_date',type:'date'}},
	{col:{header:'创建人', width:100, sortable:true}, field:{name:'sys_attach_store__edit_user',type:'string'}},
	{col:{header:'创建人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_attach_store__edit_userid',type:'string'}},
	{col:{header:'附件库ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_attach_store__store_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sys_attach_store'
	};
	
	
	config.eventcfg = {
	//设置默认
	setDefault: function(){
		var self = this;
		var grid = this.grid;
		
		var records = JxUtil.getSelectRows(grid);
		if(!JxUtil.selected(records)) return false;
		if(!JxUtil.selectone(records)) return false;
	
		if(records[0].get('sys_attach_store__is_default') == 1){
			JxHint.alert(jx.bus.text44);//'选中记录已是默认库，不能操作！'
			return false;
		}
	
		var hdcall = function(){
			var params = 'funid='+ self.define.nodeid + '&pagetype=grid' + '&eventcode=setDefault';
			params += '&keyid='+records[0].get(self.define.pkcol);
			
			var endcall = function(data){
				grid.getStore().reload();
			}
			Request.postRequest(params, endcall);
		}
		Ext.Msg.confirm(jx.base.hint, jx.bus.text45, function(btn) {//'确定设置默认附件库？'
			if (btn == 'yes') hdcall();
		});
	}
};
		
	return new Jxstar.GridNode(config);
}