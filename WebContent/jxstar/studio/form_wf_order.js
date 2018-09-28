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
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'审批功能信息',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'trigger', fieldLabel:'功能ID', name:'wf_order__fun_id',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:25, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:true,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"sel_fun", "layoutPage":"/public/layout/layout_tree.js", "sourceField":";", "targetField":";", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"1", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"all","fieldName":"wf_order.fun_id"};
							JxSelect.createSelectWin(selcfg, this, 'node_wf_order_form');
						}},
					{xtype:'textfield', fieldLabel:'审批标题', name:'wf_order__fun_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'外部系统代号', name:'wf_order__sys_code',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:10, editable:true,
						listeners:{afterrender: function(combo) {
							JxSelect.initCombo('wf_order', combo, 'node_wf_order_form');
						}}},
					{xtype:'hidden', fieldLabel:'审批单ID', name:'wf_order__order_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'wf_order__order_audit', defaultval:'0',
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
						value: Dataregstatus[0][0]},
					{xtype:'textfield', fieldLabel:'序号', name:'wf_order__order_no', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:10},
					{xtype:'textfield', fieldLabel:'外部系统名称', name:'wf_order__sys_name', anchor:'100%', maxLength:50}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'扩展脚本',
			collapsible:true,
			collapsed:true,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textarea', fieldLabel:'扩展脚本', name:'wf_order__order_inc', anchor:'100%', height:120, maxLength:1000}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wf_order'
	};

	config.param.formWidth = '100%';
	JxFormSub.formAddTab(config);

	
	
	return new Jxstar.FormNode(config);
}