Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataoaappqj = Jxstar.findComboData('oaappqj');
	var Dataaudit = Jxstar.findComboData('audit');
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
					{xtype:'combo', fieldLabel:'请假类型', name:'oa_apply__app_type', defaultval:'0',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataoaappqj
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataoaappqj[0][0]},
					{xtype:'datefield', fieldLabel:'开始时间', name:'oa_apply__begin_date', format:'Y-m-d H:i', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'datefield', fieldLabel:'申请时间', name:'oa_apply__app_date', defaultval:'fun_getToday()', format:'Y-m-d', anchor:'100%', readOnly:true},
					{xtype:'textfield', fieldLabel:'申请人', name:'oa_apply__edit_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'单号', name:'oa_apply__app_code', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'业务类型', name:'oa_apply__bus_type', defaultval:'qj', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'oa_apply__apply_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'numberfield', fieldLabel:'天数', name:'oa_apply__app_days', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'datefield', fieldLabel:'结束时间', name:'oa_apply__end_date', format:'Y-m-d H:i', anchor:'100%'},
					{xtype:'textfield', fieldLabel:'所属部门', name:'oa_apply__dept_name', defaultval:'fun_getDeptName()', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'记录状态', name:'oa_apply__auditing', defaultval:'0',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataaudit
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataaudit[0][0]},
					{xtype:'hidden', fieldLabel:'部门ID', name:'oa_apply__dept_id', defaultval:'fun_getDeptId()', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'申请人ID', name:'oa_apply__edit_userid', defaultval:'fun_getUserId()', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'请假事由', name:'oa_apply__app_desc', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:120, maxLength:500}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'oa_appqj'
	};

	JxFormSub.formAddSub(config);

	
	
	return new Jxstar.FormNode(config);
}