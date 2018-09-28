Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datayesno = Jxstar.findComboData('yesno');
	var Dataassrule = Jxstar.findComboData('assrule');
	var Datalimitrule = Jxstar.findComboData('limitrule');
	var Dataagreenum = Jxstar.findComboData('agreenum');
	var Datanotetype = Jxstar.findComboData('notetype');
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
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textarea', fieldLabel:'任务描述', name:'wf_nodeattr__task_desc', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:60, maxLength:200}
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
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'可以否决', name:'wf_nodeattr__has_no', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datayesno
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datayesno[0][0]},
					{xtype:'textfield', fieldLabel:'任务时限', name:'wf_nodeattr__limit_value', defaultval:'00:00', anchor:'100%', maxLength:10},
					{xtype:'combo', fieldLabel:'任务分配规则', name:'wf_nodeattr__assign_rule', defaultval:'user',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataassrule
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataassrule[0][0]}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'可以完成', name:'wf_nodeattr__has_complete', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datayesno
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datayesno[0][0]},
					{xtype:'combo', fieldLabel:'超时规则', name:'wf_nodeattr__limit_rule', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datalimitrule
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datalimitrule[0][0]},
					{xtype:'combo', fieldLabel:'多人审批，同意人数', name:'wf_nodeattr__agree_num', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataagreenum
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataagreenum[0][0]}
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
					{xtype:'textarea', fieldLabel:'分配规则自定义', name:'wf_nodeattr__custom_class', anchor:'100%', height:60, maxLength:300},
					{xtype:'hidden', fieldLabel:'可编辑字段', name:'wf_nodeattr__edit_field', anchor:'49%'}
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
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'短信提醒类型', name:'wf_nodeattr__note_type', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datanotetype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datanotetype[0][0]},
					{xtype:'combo', fieldLabel:'邮件提醒类型', name:'wf_nodeattr__email_type', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datanotetype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datanotetype[0][0]},
					{xtype:'hidden', fieldLabel:'功能名称', name:'wf_nodeattr__fun_name', anchor:'57%'},
					{xtype:'hidden', fieldLabel:'过程ID', name:'wf_nodeattr__process_id', anchor:'57%'},
					{xtype:'hidden', fieldLabel:'节点ID', name:'wf_nodeattr__node_id', anchor:'57%'},
					{xtype:'hidden', fieldLabel:'是否发送邮件', name:'wf_nodeattr__send_email', defaultval:'0', anchor:'57%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'checkbox', fieldLabel:'使用部门印章', name:'wf_nodeattr__dept_sign', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'checkbox', fieldLabel:'使用个人签名', name:'wf_nodeattr__user_sign', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'hidden', fieldLabel:'功能ID', name:'wf_nodeattr__fun_id', anchor:'57%'},
					{xtype:'hidden', fieldLabel:'属性ID', name:'wf_nodeattr__nodeattr_id', anchor:'57%'},
					{xtype:'hidden', fieldLabel:'邮件模板ID', name:'wf_nodeattr__templet_id', anchor:'57%'},
					{xtype:'hidden', fieldLabel:'邮件模板', name:'wf_nodeattr__templet_name', anchor:'57%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wf_nodeattr'
	};

	
	config.initpage = function(formNode){
		var event = formNode.event;
		
		event.on('beforesave', function(event) {
			var form = event.form;
			var assign_rule = form.get('wf_nodeattr__assign_rule');
			if (assign_rule == 'class') {
				var className = form.get('wf_nodeattr__custom_class');
				if (className.length == 0) {
					JxHint.alert(jx.bus.text5);//如果任务分配规则是自定义类，则自定义类名必须填写！
					form.findField('wf_nodeattr__custom_class').focus();
					return false;
				}
			}
			
			var limit_value = form.get('wf_nodeattr__limit_value');
			if (limit_value != '00:00' && limit_value.length > 0) {
				var hhmi = /^([0-9]+):([0-9]|[0-5][0-9])$/;
		        if (hhmi.test(limit_value) == false) {
					JxHint.alert(jx.bus.text6);//任务时限格式不正确，格式为hh:mi，hh为任意数字，mi为小于59的数字！
					form.findField('wf_nodeattr__limit_value').focus();
					return false;
		        }
			}
			
			return true;
		});
	};

    config.eventcfg = {
            f_invoke: function(){
              	var record = this.form.myRecord;
                var fkvalue = record.get("wf_nodeattr__process_id")+"__"+record.get("wf_nodeattr__node_id");
                //过滤条件
                var where_sql = 'fun_event_invoke.event_id = ?';
                var where_type = 'string';
                var where_value = fkvalue;

                //加载数据
                var hdcall = function(layout) {
                    //显示数据
                    JxUtil.delay(500, function(){
                        //调用类表
                        var grid = layout.getComponent(0).getComponent(0);
                        //设置外键值
                        grid.fkValue = where_value;

                        Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
                    });
                };

                //显示数据
                Jxstar.showData({
                    filename: '/jxstar/studio/pub/layout_invoke.js',
                    title: jx.fun.invoke,	//'调用类注册'
                    callback: hdcall
                });
            },
        
            //反馈SQL
            exesql: function(){
                var record = this.form.myRecord;
                var fkvalue = record.get("wf_nodeattr__process_id")+"__"+record.get("wf_nodeattr__node_id");

                //过滤条件
                var where_sql = 'fun_rule_sql.src_funid = ? and fun_rule_sql.route_id = ?';
                var where_type = 'string;string';
                var where_value = fkvalue + ';noroute';

                //加载数据
                var hdcall = function(grid) {
                    //显示数据
                    JxUtil.delay(500, function(){
                        //当前选择的功能ID
                        grid.selectFunId = fkvalue;
                        grid.selectEventCode = 'task_3';
                        //清除外键设置，在form的initpage方法中处理来源功能ID为外键值
                        grid.fkValue = 'noroute';
                        Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
                    });
                };

                //显示数据
                var define = Jxstar.findNode('rule_sqlm');
                Jxstar.showData({
                    filename: define.gridpage,
                    title: define.nodetitle,
                    pagetype: 'subgrid',
                    nodedefine: define,
                    callback: hdcall
                });
            }
    }
	
	return new Jxstar.FormNode(config);
}