	//显示事件的类设置
	var showClass = function(fun_id, event_code, target) {
		var url = Jxstar.path + '/commonAction.do?eventcode=queryinfo&funid=fun_event_info&pagetype=grid';
		url += '&user_id='+Jxstar.session['user_id'];
		
		//显示数据
		var hdcall = function(grid) {
			JxUtil.delay(500, function(){
				var params = Ext.apply({start:0, limit:50}, {info_funid:fun_id, info_code:event_code});
				var store = grid.getStore();
				store.proxy.setUrl(url);
				store.load({params:params});
			});
		};
		
		Jxstar.showData({
			filename: '/jxstar/studio/grid_fun_event_info.js',
			title: '调用类列表',
			callback: hdcall,
			pagetype: 'notoolgrid',
			width: 600,
			height: 400
		});
	};
	
	//显示域的事件明细
	var showDomain = function(fun_id, domain_code, target) {
		//过滤条件
		var where_sql = 'domain_id in (select domain_id from funall_domain where domain_code = ?)';
		var where_type = 'string';
		var where_value = domain_code;
		
		//加载数据
		var hdcall = function(grid) {
			//显示数据
			JxUtil.delay(500, function(){
				//设置外键值
				grid.fkValue = where_value;
				grid.srcFunId = fun_id;

				Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
			});
		};

		//显示数据
		var define = Jxstar.findNode('event_domain_det');
		Jxstar.showData({
			filename: define.gridpage,
			title: define.nodetitle,
			callback: hdcall
		});
	};
		
	//显示数据导入SQL
	var setFunRoute = function(fun_id, event_code, target){
        //过滤条件
        var where_sql = 'fun_rule_route.fun_id = ?';
        var where_type = 'string';
        var where_value = fun_id;

        //加载数据
        var hdcall = function(layout) {
            //显示数据
            JxUtil.delay(500, function(){
                var grid = layout.getComponent(0).getComponent(0);

                //设置外键值
                grid.fkValue = where_value;
                Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
            });
        };

        //显示数据
        var define = Jxstar.findNode('rule_route');
        Jxstar.showData({
            filename: define.layout,
            title: define.nodetitle,
            pagetype: 'subgrid',
            nodedefine: define,
            callback: hdcall
        });
    };
	
	cols.insert(0, {col:
		{header:'设置', width:50, align:'center', 
			renderer: function(value, metaData, record) {
				var isdo = record.get('fun_event__is_domain');
                var event_code = record.get('fun_event__event_code');
				var html = '';
				if (isdo == '1') {
					html = '<a title="查看域"><i name="qryevent" class="fa fa-cogs"></i></a>';
				} else {
                    if (event_code == 'dataimp') {
                        html = '<a title="导入SQL定义"><i name="sqlset" class="fa fa-cubes"></i></a>';
                    } else {
                        html = '<a title="查看类"><i name="clsset" class="fa fa-cog"></i></a>';
                    }
				}
				return html;
			},
			listeners: {click: function(col, grid, row, e){
				var target = e.getTarget();
				var rec = grid.getStore().getAt(row);
				var fun_id = rec.get('fun_event__fun_id');
				var event_code = rec.get('fun_event__event_code');
				
                var name = target.getAttribute('name');
				if (name == 'clsset') {
					showClass(fun_id, event_code, target);
				}
				if (name == 'qryevent') {
					showDomain(fun_id, event_code, target);
				}
                if (name == 'sqlset') {
					setFunRoute(fun_id, event_code, target);
				}
			}}
		}
	});

	config.eventcfg = {
		f_invoke: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			//过滤条件
			var where_sql = 'fun_event_invoke.event_id = ?';
			var where_type = 'string';
			var where_value = records[0].get('fun_event__event_id');
			
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
		
		checkSet: function(){
            var selectEventCode = '';
			var records = this.grid.getSelectionModel().getSelections();
			if (records.length > 0) selectEventCode = records[0].get('fun_event__event_code');
                        
			//过滤条件
            var selectFunId = this.grid.fkValue;
			var where_sql = 'fun_check.fun_id = ?';
			var where_type = 'string';
			var where_value = selectFunId;

			//加载数据
			var hdcall = function(grid) {
				//显示数据
				JxUtil.delay(500, function(){
					//调用类表
					//var grid = layout.getComponent(0).getComponent(0);
					//设置外键值
					grid.fkValue = selectFunId;
					grid.selectEventCode = selectEventCode;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			//显示数据
			var define = Jxstar.findNode('fun_check');
			Jxstar.showData({
				nodedefine: define,
				filename: define.gridpage,
				title: define.nodetitle,
             	pagetype: 'subgrid',
				callback: hdcall
			});
		},
        
        //反馈SQL
        exesql: function(){
            var selectEventCode = '';
			var records = this.grid.getSelectionModel().getSelections();
			if (records.length > 0) selectEventCode = records[0].get('fun_event__event_code');
            
			//过滤条件
            var selectFunId = this.grid.fkValue;
			var where_sql = 'fun_rule_sql.src_funid = ? and fun_rule_sql.route_id = ?';
			var where_type = 'string;string';
			var where_value = selectFunId + ';noroute';
			
			//加载数据
			var hdcall = function(grid) {
				//显示数据
				JxUtil.delay(500, function(){
					//var grid = layout.getComponent(0).getComponent(0);
					//当前选择的功能ID
					grid.selectFunId = selectFunId;
                    grid.selectEventCode = selectEventCode;
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
		},
		
		dataImportParam: function() {
			var funId = this.grid.fkValue;
			
			var options = {
				whereSql: 'event_code not in (select event_code from fun_event where fun_id = ?)',
				whereValue: funId,
				whereType: 'string'
			};
			return options;
		}
	};