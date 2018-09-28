Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstate = Jxstar.findComboData('regstate');
	var Dataserverarea = Jxstar.findComboData('serverarea');

	var cols = [
	{col:{header:'状态', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataregstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataregstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataregstate.length; i++) {
				if (Dataregstate[i][0] == value)
					return Dataregstate[i][1];
			}
		}}, field:{name:'bos_res_server__auditing',type:'string'}},
	{col:{header:'所在区域', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataserverarea
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataserverarea[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataserverarea.length; i++) {
				if (Dataserverarea[i][0] == value)
					return Dataserverarea[i][1];
			}
		}}, field:{name:'bos_res_server__server_area',type:'string'}},
	{col:{header:'服务器代号', width:138, sortable:true}, field:{name:'bos_res_server__server_code',type:'string'}},
	{col:{header:'服务器名称', width:176, sortable:true}, field:{name:'bos_res_server__server_name',type:'string'}},
	{col:{header:'应用URL', width:265, sortable:true}, field:{name:'bos_res_server__server_url',type:'string'}},
	{col:{header:'最大企业数量', width:100, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_res_server__limit_num',type:'int'}},
	{col:{header:'已注册企业数', width:100, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_res_server__reg_num',type:'int'}},
	{col:{header:'备注', width:100, sortable:true, hidden:true}, field:{name:'bos_res_server__server_desc',type:'string'}},
	{col:{header:'注册日期', width:100, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'bos_res_server__edit_date',type:'date'}},
	{col:{header:'注册人', width:100, sortable:true, hidden:true}, field:{name:'bos_res_server__edit_user',type:'string'}},
	{col:{header:'失效日期', width:100, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'bos_res_server__invalid_date',type:'date'}},
	{col:{header:'操作员ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_res_server__edit_userid',type:'string'}},
	{col:{header:'服务器ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_res_server__server_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'bos_res_server'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}