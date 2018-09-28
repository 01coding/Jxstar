Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataserverarea = Jxstar.findComboData('serverarea');
	var Dataregstate = Jxstar.findComboData('regstate');
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
					{xtype:'combo', fieldLabel:'所在区域', name:'bos_res_server__server_area',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataserverarea
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataserverarea[0][0]},
					{xtype:'textfield', fieldLabel:'服务器代号', name:'bos_res_server__server_code', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'服务器名称', name:'bos_res_server__server_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'最大企业数量', name:'bos_res_server__limit_num', defaultval:'1000', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'hidden', fieldLabel:'失效日期', name:'bos_res_server__invalid_date', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'服务器ID', name:'bos_res_server__server_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'bos_res_server__auditing', defaultval:'0',
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
					{xtype:'datefield', fieldLabel:'注册日期', name:'bos_res_server__edit_date', defaultval:'fun_getToday()', format:'Y-m-d', anchor:'100%', readOnly:true},
					{xtype:'textfield', fieldLabel:'注册人', name:'bos_res_server__edit_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'已注册企业数', name:'bos_res_server__reg_num', defaultval:'0', readOnly:true, anchor:'100%', maxLength:22},
					{xtype:'hidden', fieldLabel:'操作员ID', name:'bos_res_server__edit_userid', defaultval:'fun_getUserId()', anchor:'100%'}
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
					{xtype:'textfield', fieldLabel:'应用URL', name:'bos_res_server__server_url', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textarea', fieldLabel:'备注', name:'bos_res_server__server_desc', anchor:'100%', height:60, maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'bos_res_server'
	};

	
	
	
	return new Jxstar.FormNode(config);
}