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
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'trigger', fieldLabel:'物资分类', name:'store_mat__type_name',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"store_mtype", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"", "targetField":"", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"1", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"store_mat.type_name"};
							JxSelect.createSelectWin(selcfg, this, 'node_store_mat_form');
						}},
					{xtype:'textfield', fieldLabel:'物资编码', name:'store_mat__mat_code', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'物资名称', name:'store_mat__mat_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'型号', name:'store_mat__mat_size', anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'主键', name:'store_mat__mat_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'分类ID', name:'store_mat__type_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'分类编码', name:'store_mat__type_code', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'单位', name:'store_mat__mat_unit', anchor:'100%', maxLength:10},
					{xtype:'numberfield', fieldLabel:'单价(元)', name:'store_mat__mat_price', anchor:'100%', maxLength:22}
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
					{xtype:'textarea', fieldLabel:'备注', name:'store_mat__mat_desc', anchor:'100%', height:60, maxLength:100}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'store_mat'
	};

	
	
	
	return new Jxstar.FormNode(config);
}