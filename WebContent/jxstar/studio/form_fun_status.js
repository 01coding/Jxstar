Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
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
			title:'基本状态值',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'控件代号', name:'fun_status__control_code',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:true,
						listeners:{afterrender: function(combo) {
							JxSelect.initCombo('fun_status', combo, 'node_fun_status_form');
						}}},
					{xtype:'trigger', fieldLabel:'未提交值', name:'fun_status__audit0',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_combo_value", "layoutPage":"", "sourceField":"funall_control.value_data", "targetField":"fun_status.audit0", "whereSql":"funall_control.control_code = ?", "whereValue":"[fun_status.control_code]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"all","fieldName":"fun_status.audit0"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_fun_status_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'trigger', fieldLabel:'已提交值', name:'fun_status__audit1',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_combo_value", "layoutPage":"", "sourceField":"funall_control.value_data", "targetField":"fun_status.audit1", "whereSql":"funall_control.control_code = ?", "whereValue":"[fun_status.control_code]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"all","fieldName":"fun_status.audit1"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_fun_status_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'hidden', fieldLabel:'功能ID', name:'fun_status__fun_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'说明', name:'fun_status__status_memo', anchor:'100%', maxLength:100},
					{xtype:'trigger', fieldLabel:'退回值', name:'fun_status__audit_b',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_combo_value", "layoutPage":"", "sourceField":"funall_control.value_data", "targetField":"fun_status.audit_b", "whereSql":"funall_control.control_code = ?", "whereValue":"[fun_status.control_code]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"all","fieldName":"fun_status.audit_b"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_fun_status_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'trigger', fieldLabel:'终止值', name:'fun_status__audit_e',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_combo_value", "layoutPage":"", "sourceField":"funall_control.value_data", "targetField":"fun_status.audit_e", "whereSql":"funall_control.control_code = ?", "whereValue":"[fun_status.control_code]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"all","fieldName":"fun_status.audit_e"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_fun_status_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'hidden', fieldLabel:'主键', name:'fun_status__status_id', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'审批状态值',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'trigger', fieldLabel:'审批中值', name:'fun_status__audit2',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_combo_value", "layoutPage":"", "sourceField":"funall_control.value_data", "targetField":"fun_status.audit2", "whereSql":"funall_control.control_code = ?", "whereValue":"[fun_status.control_code]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"all","fieldName":"fun_status.audit2"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_fun_status_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'trigger', fieldLabel:'审批通过值', name:'fun_status__audit3',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_combo_value", "layoutPage":"", "sourceField":"funall_control.value_data", "targetField":"fun_status.audit3", "whereSql":"funall_control.control_code = ?", "whereValue":"[fun_status.control_code]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"all","fieldName":"fun_status.audit3"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_fun_status_form');
							}
							this.menu.show(this.el);
						}}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'trigger', fieldLabel:'审批否决值', name:'fun_status__audit4',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_combo_value", "layoutPage":"", "sourceField":"funall_control.value_data", "targetField":"fun_status.audit4", "whereSql":"funall_control.control_code = ?", "whereValue":"[fun_status.control_code]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"all","fieldName":"fun_status.audit4"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_fun_status_form');
							}
							this.menu.show(this.el);
						}}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'fun_status'
	};

	config.param.labelWidth = 100;

	
	
	return new Jxstar.FormNode(config);
}