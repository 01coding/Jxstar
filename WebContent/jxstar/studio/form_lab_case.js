Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataregstatus = Jxstar.findComboData('regstatus');
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
					{xtype:'textfield', fieldLabel:'方案名称', name:'lab_case__case_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'方案编号', name:'lab_case__case_code', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'lab_case__case_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'lab_case__auditing', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataregstatus
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataregstatus[0][0]}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'lab_case'
	};

	config.param.subConfig = {anchor:'', width:800};
	JxFormSub.formAddSub(config);

	
	
	return new Jxstar.FormNode(config);
}