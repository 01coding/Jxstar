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