Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataquestatus = Jxstar.findComboData('questatus');
	var Dataquetype = Jxstar.findComboData('quetype');
	var Dataquestatus1 = Jxstar.findComboData('questatus1');
	var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'问题报告',
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
					{xtype:'textfield', fieldLabel:'问题单号', name:'sys_question__que_code', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'报告人', name:'sys_question__report_user', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'报告部门ID', name:'sys_question__dept_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'处理状态', name:'sys_question__que_status', defaultval:'0',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataquestatus
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataquestatus[0][0]},
					{xtype:'textfield', fieldLabel:'报告部门', name:'sys_question__dept_name', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'报告人ID', name:'sys_question__report_userid', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'datefield', fieldLabel:'报告时间', name:'sys_question__report_date', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'hidden', fieldLabel:'处理人ID', name:'sys_question__done_userid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'sys_question__que_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'问题描述', name:'sys_question__que_desc', readOnly:true, anchor:'100%', height:90, maxLength:200}
				]
			}
			]
		}]
		},{
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'问题处理',
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
					{xtype:'textfield', fieldLabel:'处理人', name:'sys_question__done_user', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'combo', fieldLabel:'问题类型', name:'sys_question__que_type', defaultval:'1',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataquetype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataquetype[0][0]}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'datefield', fieldLabel:'受理时间', name:'sys_question__start_date', format:'Y-m-d H:i', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'combo', fieldLabel:'处理结果', name:'sys_question__done_type',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataquestatus1
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataquestatus1[0][0]}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'datefield', fieldLabel:'关闭时间', name:'sys_question__done_date', format:'Y-m-d H:i', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'原因分析及处理结果', name:'sys_question__done_desc', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:90, maxLength:200}
				]
			}
			]
		}]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'que_done'
	};

	config.param.formWidth = '100%';

	config.initpage = function(formNode){
		var event = formNode.event;
		
		//关闭问题时检查必填项
		event.on('beforecustom', function(event) {
			var form = event.form;
			if (!form.isValid()) {
				JxHint.alert(jx.event.datavalid);	//'请确保输入的数据正确完整！'
				return false;
			}
			var que_status = form.get('sys_question__que_status');
			if (que_status > '7') { 
				JxHint.alert(jx.bus.text35);//'问题已经完成或已否决，不能提交！'
				return false;
			}
			
			var done_type = form.get("sys_question__done_type");
			if (done_type == '2') {
				JxHint.alert(jx.bus.text36);//'处理必须是已经完成或已否决，才能提交！'
				return false;
			}
			
			return true;
		});
		
		event.on('aftercustom', function(fe) {
			var page = fe.page;
			var tab = page.ownerCt.ownerCt;
			var tab1 = tab.getComponent(0);
			tab.activate(tab1);
			
			var grid = tab1.getComponent(0);
			grid.getStore().reload();
		});
	};
	
	config.eventcfg = {
		//初始化页面数据
		initOther : function() {
			var myform = this.form;

			var done_type = myform.get("sys_question__done_type");
			if (done_type == null || done_type.length == 0) {
				myform.set("sys_question__done_type", '2');
			}
			var start_date = myform.get("sys_question__start_date");
			if (start_date == null || start_date.length == 0) {
				myform.set("sys_question__start_date", JxDefault.getToday());
			}
			
			var username = myform.get("sys_question__done_user");
			if (username == null || username.length == 0) {
				myform.set("sys_question__done_user", JxDefault.getUserName());
				myform.set("sys_question__done_userid", JxDefault.getUserId());
			}
			/*
			var que_status = myform.get("sys_question__que_status");
			var readOnly = (que_status != '1');
			JxUtil.readOnlyForm(myform, readOnly);
			JxUtil.disableButton(this.page.getTopToolbar(), readOnly);*/
		}
	};
	
	return new Jxstar.FormNode(config);
}