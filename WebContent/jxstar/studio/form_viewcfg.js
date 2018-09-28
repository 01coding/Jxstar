Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datatablestate = Jxstar.findComboData('tablestate');
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
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'dm_viewcfg__state', defaultval:'1',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datatablestate
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datatablestate[0][0]},
					{xtype:'hidden', fieldLabel:'视图ID', name:'dm_viewcfg__view_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'视图名称', name:'dm_viewcfg__view_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:30}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'视图说明', name:'dm_viewcfg__view_memo', anchor:'100%', maxLength:200}
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
					{xtype:'textarea', fieldLabel:'视图脚本', name:'dm_viewcfg__view_sql', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:390, maxLength:Number.MAX_VALUE}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'dm_viewcfg'
	};

	
	
	
	return new Jxstar.FormNode(config);
}