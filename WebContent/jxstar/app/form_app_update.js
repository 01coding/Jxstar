Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataupdatetype = Jxstar.findComboData('updatetype');
	var Dataostype = Jxstar.findComboData('ostype');
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
					{xtype:'textfield', fieldLabel:'APP代号', name:'app_update__appid', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'combo', fieldLabel:'更新类型', name:'app_update__update_type', defaultval:'0',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataupdatetype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataupdatetype[0][0]},
					{xtype:'textfield', fieldLabel:'Jxstar版本', name:'app_update__server_version', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'标题', name:'app_update__update_title', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'版本号', name:'app_update__update_version', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'系统类型', name:'app_update__os_type', defaultval:'0',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataostype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataostype[0][0]},
					{xtype:'hidden', fieldLabel:'主键', name:'app_update__update_id', anchor:'100%'}
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
					{xtype:'textfield', fieldLabel:'下载路径', name:'app_update__down_url', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:200},
					{xtype:'textarea', fieldLabel:'更新内容', name:'app_update__update_note', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:180, maxLength:Number.MAX_VALUE}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'app_update'
	};

	
	
	
	return new Jxstar.FormNode(config);
}