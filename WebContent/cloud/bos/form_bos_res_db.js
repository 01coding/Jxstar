Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataregstate = Jxstar.findComboData('regstate');
	var Datadbtype = Jxstar.findComboData('dbtype');
	var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'序号', name:'bos_res_db__db_no', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'textfield', fieldLabel:'数据源名', name:'bos_res_db__sourcename', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'User Name', name:'bos_res_db__username', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'User Password', name:'bos_res_db__password', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'Schema Name', name:'bos_res_db__schemaname', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'所属应用服务器', name:'bos_res_db__server_name',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:true,
						listeners:{afterrender: function(combo) {
							JxSelect.initCombo('bos_res_db', combo, 'node_bos_res_db_form');
						}}},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'最大企业数量', name:'bos_res_db__limit_num', defaultval:'1000', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'hidden', fieldLabel:'检查空闲连接', name:'bos_res_db__valididle', defaultval:'0', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'创建人ID', name:'bos_res_db__edit_userid', defaultval:'fun_getUserId()', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'应用服务器ID', name:'bos_res_db__server_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'bos_res_db__auditing', defaultval:'0',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataregstate
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataregstate[0][0]},
					{xtype:'combo', fieldLabel:'数据库类型', name:'bos_res_db__dbmstype',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datadbtype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datadbtype[0][0]},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'最大连接数', name:'bos_res_db__maxconnum', defaultval:'100', anchor:'100%', maxLength:22},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'最大等待时间', name:'bos_res_db__maxwaittime', defaultval:'5000', anchor:'100%', maxLength:22},
					{xtype:'textfield', fieldLabel:'注册人', name:'bos_res_db__edit_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'datefield', fieldLabel:'注册时间', name:'bos_res_db__edit_date', defaultval:'fun_getToday()', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'已注册企业数', name:'bos_res_db__reg_num', defaultval:'0', readOnly:true, anchor:'100%', maxLength:22},
					{xtype:'hidden', fieldLabel:'检查连接有效性', name:'bos_res_db__validtest', defaultval:'0', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'bos_res_db__db_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'失效时间', name:'bos_res_db__invalid_date', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'Driver Class', name:'bos_res_db__driverclass', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textarea', fieldLabel:'JDBC URL', name:'bos_res_db__jdbcurl', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:90, maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'bos_res_db'
	};

	
	
	
	return new Jxstar.FormNode(config);
}