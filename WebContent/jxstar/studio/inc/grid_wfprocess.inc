	config.eventcfg = {
		setSheet: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			//过滤条件
			var where_sql = 'wf_sheet.process_id = ?';
			var where_type = 'string';
			var where_value = records[0].get('wf_process__process_id');
			
			//加载数据
			var hdcall = function(grid) {
				JxUtil.delay(500, function(){
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			//显示数据
			var define = Jxstar.findNode('wf_sheet');
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				pagetype: 'subgrid',
				nodedefine: define,
				callback: hdcall
			});
		},
	
		deleteWf: function(){
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var record = records[0];
			var state = record.get('wf_process__process_state');
			if (state != '1') {
				JxHint.alert(jx.wf.nodel);	//'当前过程不是“定义”状态，不能删除！'
				return true;
			}

			var hdcall = function() {
				//设置请求的参数
				var params = 'funid=wf_process&keyid=' + record.get(self.define.pkcol);
				params += '&pagetype=editgrid&eventcode=delete';
				
				//重新加载数据
				var endcall = function() {
					self.grid.getStore().reload();
				}
				//发送请求
				Request.postRequest(params, endcall);
			};
			//'确定删除当前过程定义及所有相关设计信息吗？'
			Ext.Msg.confirm(jx.base.hint, jx.wf.delyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
	
		checkwf: function(){
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			//设置请求的参数
			var params = 'funid=wf_process&keyid=' + records[0].get(self.define.pkcol);
			params += '&pagetype=editgrid&eventcode=checkwf';

			//发送请求
			Request.postRequest(params, null);
		},
		
		enablewf: function(){
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var record = records[0];
			var state = record.get('wf_process__process_state');
			if (state == '2') {
				JxHint.alert(jx.wf.dontuse);	//'当前过程已经启用，不能再启用！'
				return true;
			}

			var oldProcessId = record.get('wf_process__old_processid');
			var hdcall = function() {
				//设置请求的参数
				var params = 'funid=wf_process&keyid=' + record.get(self.define.pkcol);
				params += '&pagetype=editgrid&eventcode=enable&old_processid=' + oldProcessId;
				
				var endcall = function() {
					self.grid.getStore().reload();
				}
				//发送请求
				Request.postRequest(params, endcall);
			};
			//'确定启用当前过程定义吗？'
			Ext.Msg.confirm(jx.base.hint, jx.wf.useyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
		
		disablewf: function(){
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var record = records[0];
			var state = record.get('wf_process__process_state');
			if (state != '2') {
				JxHint.alert(jx.wf.nodis);	//'当前过程没有启用，不能禁用！'
				return true;
			}

			var hdcall = function() {
				//设置请求的参数
				var params = 'funid=wf_process&keyid=' + record.get(self.define.pkcol);
				params += '&pagetype=editgrid&eventcode=disablewf';
				
				var endcall = function() {
					record.set('wf_process__process_state', '3');
					record.commit();
				}
				//发送请求
				Request.postRequest(params, endcall);
			};
			//'禁用后过程不能再使用，确定禁用吗？'
			Ext.Msg.confirm(jx.base.hint, jx.wf.disyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
		
		newversion: function(){
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var record = records[0];
			var state = record.get('wf_process__process_state');
			if (state != '2') {
				JxHint.alert(jx.wf.dontnew);	//'当前过程没有启用，不能创建新版本！'
				return true;
			}

			var hdcall = function() {
				//设置请求的参数
				var params = 'funid=wf_process&keyid=' + record.get(self.define.pkcol);
				params += '&pagetype=editgrid&eventcode=newversion';
				//重新加载数据
				var endcall = function() {
					self.grid.getStore().reload();
				}
				//发送请求
				Request.postRequest(params, endcall);
			};
			//'确定创建新版流程定义吗？'
			Ext.Msg.confirm(jx.base.hint, jx.wf.newyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
		
		copywf: function(){
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			var hdcall = function() {
				//设置请求的参数
				var params = 'funid=wf_process&keyid=' + records[0].get(self.define.pkcol);
				params += '&pagetype=editgrid&eventcode=copywf';
				//重新加载数据
				var endcall = function() {
					self.grid.getStore().reload();
				}
				//发送请求
				Request.postRequest(params, endcall);
			};
			//'确定复制流程定义吗？'
			Ext.Msg.confirm(jx.base.hint, jx.wf.copyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
        
        expxml: function(){
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

            //设置请求的参数
            var params = 'funid=wf_process&keyid=' + records[0].get(self.define.pkcol);
            params += '&dataType=byte&eventcode=expxml&user_id=' + Jxstar.session['user_id'];
			
			//输出iframe下载文件
			var href = Jxstar.path + '/fileAction.do?' + params + '&_dc=' + (new Date()).getTime();
			
			//解决在IE8中下载文件不稳定的问题
			Request.postFormURL(href);
		},
        
		impxml: function(){
			var self = this;
			
			var params = 'funid=wf_process&eventcode=impxml';
			var hdcall = function(data) {
				self.grid.getStore().reload();
			};
			
			JxUtil.showImpWin(params, hdcall);
		}
	};
	
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		//表格编辑前事件 
		grid.on('beforeedit', function(event) {
			var r = event.record;
			var state = r.get('wf_process__process_state');
			//非定义状态记录不能修改
			if (state != '1') {
				//return false;
			}
			
			return true;
		});
	};