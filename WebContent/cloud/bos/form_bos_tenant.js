Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datatenant_type = Jxstar.findComboData('tenant_type');
	var Datatenstate = Jxstar.findComboData('tenstate');
	var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'企业信息',
			collapsible:false,
			collapsed:false,
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
					{xtype:'textfield', fieldLabel:'租户名称', name:'bos_tenant__tenant_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'datefield', fieldLabel:'注册时间', name:'bos_tenant__edit_date', defaultval:'fun_getToday()', format:'Y-m-d H:i', anchor:'100%'},
					{xtype:'datefield', fieldLabel:'到期日期', name:'bos_tenant__end_date', format:'Y-m-d', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'版本类型', name:'bos_tenant__bus_type', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'bos_tenant__bos_tenant_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'租户类型', name:'bos_tenant__tenant_type', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datatenant_type
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datatenant_type[0][0]},
					{xtype:'combo', fieldLabel:'状态', name:'bos_tenant__auditing', defaultval:'0',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datatenstate
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datatenstate[0][0]},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'用户数量', name:'bos_tenant__user_num', anchor:'100%', maxLength:22},
					{xtype:'hidden', fieldLabel:'失效时间', name:'bos_tenant__invalid_date', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'备注', name:'bos_tenant__memo', anchor:'100%', height:60, maxLength:200}
				]
			}
			]
		}]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'bos_tenant'
	};

	config.param.formWidth = '100%';
	JxFormSub.formAddTab(config);

	
	
	return new Jxstar.FormNode(config);
}