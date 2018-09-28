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
					{xtype:'textfield', fieldLabel:'来源功能ID', name:'fun_rule_sql__src_funid', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'textfield', fieldLabel:'目标功能ID', name:'fun_rule_sql__dest_funid', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'textfield', fieldLabel:'序号', name:'fun_rule_sql__sql_no', defaultval:'1', anchor:'100%', maxLength:10},
					{xtype:'hidden', fieldLabel:'规则ID', name:'fun_rule_sql__rule_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'触发事件', name:'fun_rule_sql__event_code', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'路由ID', name:'fun_rule_sql__route_id', readOnly:true, anchor:'100%', maxLength:25},
					{xtype:'combo', fieldLabel:'状态', name:'fun_rule_sql__status', defaultval:'0',
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
					{xtype:'hidden', fieldLabel:'操作类型', name:'fun_rule_sql__do_type', defaultval:'insert', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'来源数据SQL', name:'fun_rule_sql__src_sql', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:120, maxLength:1000},
					{xtype:'textarea', fieldLabel:'目标更新SQL', name:'fun_rule_sql__dest_sql', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:120, maxLength:1000},
					{xtype:'textfield', fieldLabel:'SQL说明', name:'fun_rule_sql__rule_name', anchor:'100%', maxLength:100}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'rule_sqlm'
	};

	config.param.formWidth = '100%';

	config.initpage = function(formNode){
		var event = formNode.event;
		
		event.on('beforecreate', function(event) {
			var form = formNode.page.getForm();
			var pnid = formNode.parentNodeId;
			//取设置SQL的功能ID
			var srcfunid = '', destfunid = '';
			//“数据导入”设置目标功能ID
            var srcfield = 'fun_rule_sql__src_funid';
			var destfield = 'fun_rule_sql__dest_funid';
            var eventfield = 'fun_rule_sql__event_code';
			if (pnid == 'rule_route') {
				var pg = JxUtil.getParentGrid(form.myGrid);
				if (pg) {
					var records = pg.getSelectionModel().getSelections();
					if (records.length > 0) {
						srcfunid = records[0].get('fun_rule_route__src_funid');
                        destfunid = records[0].get('fun_rule_route__fun_id');
					}
                    form.findField(srcfield).setValue(srcfunid);
                    form.findField(destfield).setValue(destfunid);
                    form.findField(eventfield).setValue(',import,');
				}
			} else {
				srcfunid = form.myGrid.selectFunId;
                form.findField(srcfield).setValue(srcfunid);
                form.findField(destfield).setValue(srcfunid);
                var ec = form.myGrid.selectEventCode||'';
                if (ec.length > 0) ec = ','+ec+',';
                form.findField(eventfield).setValue(ec);
			}
		});
		
		event.initOther = function() {
			var form = formNode.page.getForm();
			var pnid = formNode.parentNodeId;
            //反馈SQL必须把来源ID设置为不可编辑，因为是作为过滤条件用
            var srcfield = 'fun_rule_sql__src_funid';
			if (pnid != 'rule_route') {
                form.findField(srcfield).disable();
            }
		};
	};
	
	return new Jxstar.FormNode(config);
}