Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataaudit = Jxstar.findComboData('audit');
	var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'入库信息',
			collapsible:false,
			collapsed:false,
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
					{xtype:'textfield', fieldLabel:'入库单号', name:'store_in__in_code', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'仓库', name:'store_in__house_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'仓库ID', name:'store_in__house_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'部门ID', name:'store_in__dept_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'store_in__auditing',
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
					{xtype:'trigger', fieldLabel:'仓管员', name:'store_in__edit_user', defaultval:'fun_getUserName()',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"sys_user", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"sys_user.user_name;user_id", "targetField":"store_in.edit_user;edit_userid", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"1", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"store_in.edit_user"};
							JxSelect.createSelectWin(selcfg, this, 'node_store_in_form');
						}},
					{xtype:'numberfield', renderer:JxUtil.formatMoney(2), fieldLabel:'入库金额', name:'store_in__in_money', anchor:'100%', maxLength:22},
					{xtype:'hidden', fieldLabel:'仓管员ID', name:'store_in__edit_userid', defaultval:'fun_getUserId()', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'datetimefield', fieldLabel:'入库日期', name:'store_in__in_date', defaultval:'fun_getToday()', format:'Y-m-d H:i:s', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'textfield', fieldLabel:'送货人', name:'store_in__send_user', anchor:'100%', maxLength:20},
					{xtype:'trigger', fieldLabel:'部门名称', name:'store_in__dept_name',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:100, editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"sys_dept", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"", "targetField":"", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"1", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"store_in.dept_name"};
							JxSelect.createSelectWin(selcfg, this, 'node_store_in_form');
						}},
					{xtype:'hidden', fieldLabel:'主键', name:'store_in__in_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'入库说明', name:'store_in__in_desc', anchor:'100%', height:60, maxLength:200}
				]
			}
			]
		}]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'store_in'
	};

	config.param.formWidth = '100%';
	JxFormSub.formAddFile(config);
	JxFormSub.formAddTab(config);

	
	
	return new Jxstar.FormNode(config);
}