Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstate = Jxstar.findComboData('regstate');
	var Datayesno = Jxstar.findComboData('yesno');
	var Datadbtype = Jxstar.findComboData('dbtype');

	var cols = [
	{col:{header:'状态', width:83, sortable:true, align:'center',
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
		}}, field:{name:'bos_res_db__auditing',type:'string'}},
	{col:{header:'序号', width:59, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_res_db__db_no',type:'int'}},
	{col:{header:'数据源名', width:109, sortable:true}, field:{name:'bos_res_db__sourcename',type:'string'}},
	{col:{header:'Driver Class', width:241, sortable:true}, field:{name:'bos_res_db__driverclass',type:'string'}},
	{col:{header:'JDBC URL', width:271, sortable:true}, field:{name:'bos_res_db__jdbcurl',type:'string'}},
	{col:{header:'Schema Name', width:119, sortable:true, hidden:true}, field:{name:'bos_res_db__schemaname',type:'string'}},
	{col:{header:'User Name', width:105, sortable:true}, field:{name:'bos_res_db__username',type:'string'}},
	{col:{header:'User Password', width:100, sortable:true, hidden:true}, field:{name:'bos_res_db__password',type:'string'}},
	{col:{header:'最大连接数', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_res_db__maxconnum',type:'int'}},
	{col:{header:'最大等待时间', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_res_db__maxwaittime',type:'int'}},
	{col:{header:'检查连接有效性', width:100, sortable:true, hidden:true, align:'center',
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
		}}, field:{name:'bos_res_db__validtest',type:'string'}},
	{col:{header:'检查空闲连接', width:100, sortable:true, hidden:true, align:'center',
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
		}}, field:{name:'bos_res_db__valididle',type:'string'}},
	{col:{header:'数据库类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datadbtype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datadbtype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadbtype.length; i++) {
				if (Datadbtype[i][0] == value)
					return Datadbtype[i][1];
			}
		}}, field:{name:'bos_res_db__dbmstype',type:'string'}},
	{col:{header:'注册时间', width:118, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_res_db__edit_date',type:'date'}},
	{col:{header:'失效时间', width:114, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_res_db__invalid_date',type:'date'}},
	{col:{header:'注册人', width:100, sortable:true, hidden:true}, field:{name:'bos_res_db__edit_user',type:'string'}},
	{col:{header:'创建人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_res_db__edit_userid',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_res_db__db_id',type:'string'}},
	{col:{header:'所属应用服务器', width:126, sortable:true}, field:{name:'bos_res_db__server_name',type:'string'}},
	{col:{header:'最大企业数量', width:100, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_res_db__limit_num',type:'int'}},
	{col:{header:'已注册企业数', width:100, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_res_db__reg_num',type:'int'}},
	{col:{header:'应用服务器ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_res_db__server_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'bos_res_db'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}