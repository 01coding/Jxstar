Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datayesno = Jxstar.findComboData('yesno');
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
					{xtype:'textfield', fieldLabel:'当前表名', name:'sys_attach_relat__table_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'关联描述', name:'sys_attach_relat__relat_name', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'生效？', name:'sys_attach_relat__is_valid', defaultval:'1',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datayesno
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datayesno[0][0]}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'关联表名', name:'sys_attach_relat__target_table', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'定制类？', name:'sys_attach_relat__use_class', defaultval:'0',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datayesno
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datayesno[0][0]},
					{xtype:'hidden', fieldLabel:'主键', name:'sys_attach_relat__relat_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'关联SQL或类名', name:'sys_attach_relat__relat_sql', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:120, maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_attach_relat'
	};

	
	
	
	return new Jxstar.FormNode(config);
}