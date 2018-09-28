Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataappfuntype = Jxstar.findComboData('appfuntype');
	var Dataappfunstate = Jxstar.findComboData('appfunstate');
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
					{xtype:'textfield', fieldLabel:'功能代号', name:'app_fun__fun_code', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'功能名称', name:'app_fun__fun_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'图标', name:'app_fun__fun_icon', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'trigger', fieldLabel:'上级功能代号', name:'app_fun__parent_code',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, editable:false,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"app_fun", "layoutPage":"", "sourceField":"app_fun.fun_code;app_funid;fun_name", "targetField":"app_fun.parent_code;parent_funid;parent_name", "whereSql":"app_fun.parent_funid is null", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"app_fun.parent_code"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_app_fun_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'combo', fieldLabel:'功能类型', name:'app_fun__fun_type', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataappfuntype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataappfuntype[0][0]},
					{xtype:'combo', fieldLabel:'状态', name:'app_fun__fun_state', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataappfunstate
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataappfunstate[0][0]},
					{xtype:'hidden', fieldLabel:'主键', name:'app_fun__app_funid', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'trigger', fieldLabel:'包代号', name:'app_fun__pack_code',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"app_package", "layoutPage":"", "sourceField":"app_package.pack_id;app_package.pack_code", "targetField":"app_fun.pack_id;app_fun.pack_code", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"app_fun.pack_code"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_app_fun_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'序号', name:'app_fun__fun_index', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'textfield', fieldLabel:'界面URL', name:'app_fun__page_url', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'上级功能名称', name:'app_fun__parent_name', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'标题背景', name:'app_fun__fun_color', anchor:'100%', maxLength:50},
					{xtype:'trigger', fieldLabel:'后台功能', name:'app_fun__ser_funid',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:25, editable:false,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_fun", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"fun_base.fun_id", "targetField":"app_fun.ser_funid", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"app_fun.ser_funid"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_app_fun_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'hidden', fieldLabel:'上级功能id', name:'app_fun__parent_funid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'应用包ID', name:'app_fun__pack_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'功能描述', name:'app_fun__fun_memo', anchor:'100%', height:90, maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'app_fun'
	};

	config.param.formWidth = '100%';

	config.initpage = function(formNode){
	var event = formNode.event;
	event.on('beforecreate', function(event) {
		var form = event.form;
		var tree = JxUtil.getLayoutTree(formNode.page);
		var pack_id = tree.selModel.selNode.id;
        var pack_code = tree.selModel.selNode.attributes.pack_code;
        form.findField('app_fun__pack_id').setValue(pack_id);
		form.findField('app_fun__pack_code').setValue(pack_code);
	});
	
 }
	
	return new Jxstar.FormNode(config);
}