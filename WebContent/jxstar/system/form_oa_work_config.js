Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datataskstate = Jxstar.findComboData('taskstate');
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
					{xtype:'textfield', fieldLabel:'功能ID', name:'oa_work_config__fun_id', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'textfield', fieldLabel:'业务标题', name:'oa_work_config__work_title', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'APP工作页面', name:'oa_work_config__app_page', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'hidden', fieldLabel:'WEB工作页面', name:'oa_work_config__web_page', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'oa_work_config__state', defaultval:'1',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datataskstate
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datataskstate[0][0]},
					{xtype:'textfield', fieldLabel:'业务表名', name:'oa_work_config__table_name', anchor:'100%', maxLength:30},
					{xtype:'textfield', fieldLabel:'APP传递参数', name:'oa_work_config__app_page_param', anchor:'100%', maxLength:200},
					{xtype:'hidden', fieldLabel:'WEB传递参数', name:'oa_work_config__web_page_param', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'oa_work_config__config_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'消息内容', name:'oa_work_config__msg_cont', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:120, maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'oa_work_config'
	};

	
	
	
	return new Jxstar.FormNode(config);
}