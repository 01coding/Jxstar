	config.initpage = function(gridNode){
		var event = gridNode.event;
		event.on('beforecreate', function(event) {
			var page = event.grid;
			
			var attr = page.treeNodeAttr;
			if (attr) {
				var deptId = attr.id;
				var deptName = attr.text;
				var record = page.getStore().getAt(0);
				
				record.set('sys_user__dept_id', deptId);
				record.set('sys_dept__dept_name', deptName);
			}
		});
        
        var fx = Jxstar.systemVar.saas__user__isformat;
        if (fx == '1') {
            event.on('beforesave', function(event) {
                var page = event.grid;
                var store = page.getStore();
                var mrow = store.getModifiedRecords();
                for (var i = 0, n = mrow.length; i < n; i++) {
                    var record = mrow[i];
                    var v = record.get('sys_user__user_code');
                    if (!JxUtil.isphone(v) && !JxUtil.isemail(v)) {
                        JxHint.alert('账号格式必须是手机号码或者邮件地址！');
                        return false;
                    }
                    if (JxUtil.isphone(v)) {
                        var tmp = record.get('sys_user__mob_code');
                        if (tmp.length == 0) {
                            record.set('sys_user__mob_code', v);
                        }
                    } else if (JxUtil.isemail(v)) {
                        var tmp = record.get('sys_user__email');
                        if (tmp.length == 0) {
                            record.set('sys_user__email', v);
                        }
                    }
                }
                return true;
            });  
        }
        
        var grid = gridNode.page;
        grid.on('beforeedit', function(e){
            var userid = e.record.get('sys_user__user_id');
            if (e.field == 'sys_user__user_code') {
                if (userid.length > 0) return false;
            }
        });
        grid.on('afteredit', function(e){
            if (fx) {
                //账号自动给手机号码或邮件地址赋值
                if (e.field == 'sys_user__user_code') {
                    var record = e.record;
                	var v = record.get('sys_user__user_code');
           	    	if (JxUtil.isphone(v)) {
                        var tmp = record.get('sys_user__mob_code');
                        if (tmp.length == 0) {
                            record.set('sys_user__mob_code', v);
                        }
                    } else if (JxUtil.isemail(v)) {
                        var tmp = record.get('sys_user__email');
                        if (tmp.length == 0) {
                            record.set('sys_user__email', v);
                        }
                    }
            	}
            }
        });
	};
	
	config.eventcfg = {		
		clearSql: function(seluserid) {
			var params = '';
			if (seluserid.indexOf('keyid=') >= 0) {
				params = seluserid;
			} else {
				params = 'keyid=' + seluserid;
			}
			params += '&funid=sys_user&pagetype=grid&eventcode=clearsql';

			//发送请求，清除数据权限SQL缓存
			Request.postRequest(params, null);
		},

		setRole: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			var pkcol = this.define.pkcol;
			var seluserid = records[0].get(pkcol);
			
			//过滤条件
			var where_sql = 'sys_user_role.user_id = ?';
			var where_type = 'string';
			var where_value = seluserid;
			
			//加载数据
			var hdcall = function(grid) {
				//显示数据
				JxUtil.delay(500, function(){
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			var srcDefine = Jxstar.findNode('sys_user_role');
			//显示数据
			Jxstar.showData({
				filename: srcDefine.gridpage,
				title: srcDefine.nodetitle, 
				pagetype: 'subgrid',
				nodedefine: srcDefine,
				callback: hdcall
			});
		},
		
		setData: function(isMore){
			var records = this.grid.getSelectionModel().getSelections();
			if (isMore == '1') {
				if (!JxUtil.selected(records)) return;
			} else {
				if (!JxUtil.selectone(records)) return;
			}

			var pkcol = this.define.pkcol;
			//过滤条件
			var where_sql = 'sys_user_data.user_id = ?';
			var where_type = 'string';
			var where_value = records[0].get(pkcol);
			
			//取当前选择的用户ID
			var userids = '', keys = '';
			for (var i = 0; i < records.length; i++) {
				var userid = records[i].get(pkcol);
			
				userids += userid +';';
				keys += '&keyid=' + userid;
			}
			userids = userids.substr(0, userids.length-1);
			
			//加载数据
			var hdcall = function(grid) {
				//显示数据
				JxUtil.delay(500, function(){
					//设置选择的用户
					grid.selUserIds = userids;
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			var srcDefine = Jxstar.findNode('sys_user_data');
			//显示数据
			Jxstar.showData({
				filename: srcDefine.gridpage,
				title: srcDefine.nodetitle, 
				pagetype: 'subgrid',
				nodedefine: srcDefine,
				callback: hdcall
			});
			
			//清除数据权限SQL缓存
			this.clearSql(keys);
		},
		
		delData: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selected(records)) return;

			var keys = '';
			var pkcol = this.define.pkcol;
			
			//过滤条件
			var where_sql = "sys_user_data.user_id in (";
			for (var i = 0; i < records.length; i++) {
				var userid = records[i].get(pkcol);
			
				where_sql += "'"+ userid +"',";
				keys += '&keyid=' + userid;
			}
			where_sql = where_sql.substr(0, where_sql.length-1) + ")";
			
			//加载数据
			var hdcall = function(grid) {
				//显示数据
				JxUtil.delay(500, function(){
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:'', where_type:''});
				});
			};

			var define = Jxstar.findNode('sys_udata_del');
			//显示数据
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle, 
				pagetype: 'subgrid',
				nodedefine: define,
				callback: hdcall
			});
			
			//清除数据权限SQL缓存
			this.clearSql(keys);
		},
		
		setDatax: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			var pkcol = this.define.pkcol;
			var seluserid = records[0].get(pkcol);
			
			//过滤条件
			var where_sql = 'sys_user_funx.user_id = ?';
			var where_type = 'string';
			var where_value = seluserid;
			
			//加载数据
			var hdcall = function(grid) {
				//显示数据
				JxUtil.delay(500, function(){
					//处理树形页面的情况
					if (!grid.isXType('grid')) {
						grid = grid.getComponent(1).getComponent(0);
					}
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			var srcDefine = Jxstar.findNode('sys_user_funx');
			//显示数据
			Jxstar.showData({
				filename: srcDefine.layout,
				title: srcDefine.nodetitle, 
				pagetype: 'subgrid',
				nodedefine: srcDefine,
				callback: hdcall
			});
			
			//清除数据权限SQL缓存
			this.clearSql(seluserid);
		},

		setPass : function() {	
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var pkcol = this.define.pkcol;
			var userId = records[0].get(pkcol);
			JxUtil.setPass(userId);
		},
		
		defPass : function() {	
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			var pkcol = this.define.pkcol;
			var hdcall = function() {
				var params = 'keyid=' + records[0].get(pkcol);
				params += '&funid=sys_user';

				//设置请求的参数
				params += '&pagetype=editgrid&eventcode=defpass';

				//发送请求
				Request.postRequest(params, null);
			};
			//'确定执行当前操作吗？'
			Ext.Msg.confirm(jx.base.hint, jx.event.doyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		}
	};
	
