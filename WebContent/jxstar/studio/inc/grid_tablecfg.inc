	config.eventcfg = {
		commitCfg: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selected(records)) return;
			
			for (var i = 0; i < records.length; i++) {
				var state = records[i].get('dm_tablecfg__state');
				if (!(state == '1' || state == '2' || state == '3')) {
					JxHint.alert(jx.dm.nomodify);	//'选择的记录中存在未修改的记录，不能提交！'
					return true;
				}
			}
			
			var self = this;
			var hdcall = function() {
				//取选择记录的主键值
				var params = 'funid='+ self.define.nodeid;
				for (var i = 0; i < records.length; i++) {
					params += '&keyid=' + records[i].get(self.define.pkcol);
				}

				//设置请求的参数
				params += '&pagetype=editgrid&eventcode=commit';

				//执行处理的内容
				var endcall = function(data) {
					//重新加载数据
					self.grid.getStore().reload();
				};

				//发送请求
				Request.postRequest(params, endcall);
			};
			//'将根据配置信息修改数据库对象，确定提交吗？'
			Ext.Msg.confirm(jx.base.hint, jx.dm.modifydb, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
		
		cancelCfg: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selected(records)) return;
			
			for (var i = 0; i < records.length; i++) {
				var state = records[i].get('dm_tablecfg__state');
				if (!(state == '1' || state == '2' || state == '3')) {
					JxHint.alert(jx.dm.nomodify);	//'选择的记录中存在未修改的记录，不能提交！'
					return true;
				}
			}
			
			var self = this;
			var hdcall = function() {
				//取选择记录的主键值
				var params = 'funid='+ self.define.nodeid;
				for (var i = 0; i < records.length; i++) {
					params += '&keyid=' + records[i].get(self.define.pkcol);
				}

				//设置请求的参数
				params += '&pagetype=editgrid&eventcode=cancel';

				//执行处理的内容
				var endcall = function(data) {
					//重新加载数据
					self.grid.getStore().reload();
				};

				//发送请求
				Request.postRequest(params, endcall);
			};
			//'之前修改的配置信息都将恢复为原信息，确定取消吗？'
			Ext.Msg.confirm(jx.base.hint, jx.dm.cancelyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
		
		checkCfg: function(){
			var self = this;
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var state = records[0].get('dm_tablecfg__state');
			if (!(state == '1' || state == '2' || state == '3')) {
				JxHint.alert(jx.dm.nocheck);	//'选择的记录未修改，不需要验证！'
				return true;
			}
			
			var keyid = records[0].get(self.define.pkcol);
			var dsname = records[0].get('dm_tablecfg__ds_name');
			//构建请求参数
			var params = 'funid='+ self.define.nodeid;
			params += '&keyid=' + keyid + '&ds_name=' + dsname + '&state=' + state;
			params += '&pagetype=editgrid&eventcode=check';
			
			//显示SQL语句
			var checkForm = new Ext.form.FormPanel({
				border: false,
				frame: false,
				layout:'fit',
				labelAlign: 'top',
				baseCls: 'x-plain',
				items: [{xtype:'textarea', name:'dm_tablecfg__check_sql', border:false, 
						 style:'font-size:13px;border-width:0;line-height:20px;background-color:#FFFFFF !important;', readOnly:true}]
			});
			
			//创建显示验证SQL的对话框
			var checkWin = new Ext.Window({
				title:jx.dm.checksql,	//'验证SQL'
				layout:'fit',
				width:500,
				height:500,
				resizable: true,
				modal: true,
				closeAction:'close',
				items:[checkForm],

				buttons: [{
					text:jx.dm.commit,	//'提交配置'
					handler:function(){	//'将根据配置信息修改数据库对象，确定提交吗？'
						Ext.Msg.confirm(jx.base.hint, jx.dm.modifydb, function(btn) {
							if (btn == 'yes') {
								var params1 = 'funid='+ self.define.nodeid + '&keyid=' + keyid;
								params1 += '&pagetype=editgrid&eventcode=commit';
								Request.postRequest(params1, function(data) {
									self.grid.getStore().reload();
								});
							}
						});
						//checkWin.close();
					}
				},{
					text:jx.base.close,	//'关闭'
					handler:function(){checkWin.close();}
				}]
			});
		
			//显示验证SQL
			var endcall = function(data) {
				checkWin.show();
				var sql = data.sql;
				checkForm.getForm().findField('dm_tablecfg__check_sql').setValue(sql);
			};

			//发送请求
			Request.postRequest(params, endcall);
		}
	};
	
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		//表格编辑前事件 
		grid.on('beforeedit', function(event) {
			var r = event.record;
			var state = r.get('dm_tablecfg__state');
			//删除状态的记录不能修改
			if (state == '3') {
				return false;
			}
			//如果是非新建状态，则数据源、表空间不能修改
			if (state != '1') {
				if (event.field == 'dm_tablecfg__table_space' || 
					event.field == 'dm_tablecfg__key_field') {
					return false;
				}
			}
			
			return true;
		});
		//表格编辑后事件
		grid.on('afteredit', function(event) {
			if (event.field == 'dm_tablecfg__table_name') {
				var r = event.record;
				var tableid = r.get('dm_tablecfg__table_id');
				var keyfield = r.get('dm_tablecfg__key_field');
				
				if (tableid.length == 0 || (tableid.length > 0 && keyfield.length == 0)) {
					r.set('dm_tablecfg__key_field', event.value + '_id');
				}
                
                var t = r.get('dm_tablecfg__table_name').toLowerCase();
                r.set('dm_tablecfg__table_name', t);
			}
		});
		//显示当前页面时，刷新记录
		JxUtil.delay(500, function(){
			var tabMain = grid.ownerCt.ownerCt;
			tabMain.on('tabchange', function(tabPanel, activeTab){
				var pagetype = activeTab.pagetype;
				if (pagetype == 'grid') {
					var gridCfg = activeTab.getComponent(0);
					gridCfg.getStore().reload();
				}
			});
		});
	};