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
					{xtype:'datefield', fieldLabel:'记录时间', name:'sys_log_edit__edit_date', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'textfield', fieldLabel:'功能名称', name:'sys_log_edit__fun_name', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'事件名称', name:'sys_log_edit__event_name', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'数据ID', name:'sys_log_edit__data_id', readOnly:true, anchor:'100%', maxLength:25},
					{xtype:'hidden', fieldLabel:'主键', name:'sys_log_edit__edit_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'功能ID', name:'sys_log_edit__fun_id', readOnly:true, anchor:'100%', maxLength:25},
					{xtype:'textfield', fieldLabel:'用户名', name:'sys_log_edit__user_name', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'父功能ID', name:'sys_log_edit__pfun_id', readOnly:true, anchor:'100%', maxLength:25},
					{xtype:'textfield', fieldLabel:'父数据ID', name:'sys_log_edit__pdata_id', readOnly:true, anchor:'100%', maxLength:25},
					{xtype:'hidden', fieldLabel:'用户ID', name:'sys_log_edit__user_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'数据修改描述', name:'sys_log_edit__edit_desc', readOnly:true, anchor:'100%', height:150, maxLength:1000}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_log_edit'
	};

	
	
	
	return new Jxstar.FormNode(config);
}