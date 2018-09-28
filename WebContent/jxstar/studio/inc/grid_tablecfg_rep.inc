	config.eventcfg = {
		
		selGrid: function() {
			var gridCfg = this.grid;
			//加载数据
			var hdcall = function(grid) {
				//显示数据
				JxUtil.delay(500, function(){
					Jxstar.loadInitData(grid);
					
					//选择窗口关闭时，重新加载配置表数据
					grid.on('destroy', function() {
						gridCfg.getStore().reload();
					});
				});
			};
		
			//显示数据窗口
			var define = Jxstar.findNode('dm_reverse');
			Jxstar.showData({
				pagetype: 'grid',
				filename: define.gridpage,
				width: 500,
				nodedefine: define,
				title: define.nodetitle,
				callback: hdcall
			});
		}, 
		
		commitCfg: function() {
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selected(records)) return;
			
			for (var i = 0; i < records.length; i++) {
				var state = records[i].get('dm_tablecfg__state');
				if (state != '0') {
					JxHint.alert(jx.dm.hasnew);	//'选择的记录中存在状态不是“生成”的记录，不能提交！'
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
			//'反向生成的配置信息将提交到正式表中，确定提交吗？'
			Ext.Msg.confirm(jx.base.hint, jx.dm.backyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
		
		compdm: function() {
			var self = this;
			
			//显示SQL语句的表单
			var checkForm = new Ext.form.FormPanel({
				border: false,
				frame: false,
				layout:'fit',
				labelAlign: 'top',
				baseCls: 'x-plain',
				items: [{xtype:'textarea', name:'dm_tablecfg__check_sql', border:false, 
						 style:'font-size:13px;border-width:0;line-height:20px;', readOnly:true}]
			});
			
			//创建显示差异SQL的对话框
			var checkWin = new Ext.Window({
				title:jx.dm.difftitle,	//'配置差异更新SQL'
				layout:'fit',
				width:500,
				height:500,
				resizable: true,
				modal: true,
				closeAction:'close',
				items:[checkForm],

				buttons: [{
					text:jx.base.commit,	//'提交'
					handler:function(){//'将执行配置差异更新SQL，确定提交吗？'
						Ext.Msg.confirm(jx.base.hint, jx.dm.exeup, function(btn) {
							if (btn == 'yes') {
								var params1 = 'funid='+ self.define.nodeid;
								params1 += '&pagetype=editgrid&eventcode=commitsql';
								Request.postRequest(params1, null);
								
								checkWin.close();
							}
						});
					}
				},{
					text:jx.base.close,	//'关闭'
					handler:function(){checkWin.close();}
				}]
			});
			
			var hdcall = function() {
				//执行处理的内容
				var endcall = function(data) {
					checkWin.show();
					var sql = data.sql;
					checkForm.getForm().findField('dm_tablecfg__check_sql').setValue(sql);
				};

				//请求参数
				var params = 'funid='+ self.define.nodeid + '&pagetype=editgrid&eventcode=compdm';
				//发送请求
				Request.postRequest(params, endcall);
			};
			//'比较与正式表中的配置信息差异需要比较长的时间，确定开始比较吗？'
			Ext.Msg.confirm(jx.base.hint, jx.dm.startcfg, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
		
		compdb: function() {
			var self = this;
			
			//显示SQL语句的表单
			var checkForm = new Ext.form.FormPanel({
				border: false,
				frame: false,
				layout:'fit',
				labelAlign: 'top',
				baseCls: 'x-plain',
				items: [{xtype:'textarea', name:'dm_tablecfg__check_sql', border:false, 
						 style:'font-size:13px;border-width:0;line-height:20px;', readOnly:true}]
			});
			
			//创建显示差异SQL的对话框
			var checkWin = new Ext.Window({
				title:jx.dm.difftitle,	//'配置差异更新SQL'
				layout:'fit',
				width:500,
				height:500,
				resizable: true,
				modal: true,
				closeAction:'close',
				items:[checkForm]
			});
			
			var hdcall = function() {
				//执行处理的内容
				var endcall = function(data) {
					checkWin.show();
					var sql = data.sql;
					checkForm.getForm().findField('dm_tablecfg__check_sql').setValue(sql);
				};

				//请求参数
				var params = 'funid='+ self.define.nodeid + '&pagetype=editgrid&eventcode=compdb';
				//发送请求
				Request.postRequest(params, endcall);
			};
			//'数据库结构与配置信息差异需要比较长的时间，确定开始比较吗？'
			Ext.Msg.confirm(jx.base.hint, jx.dm.startdb, function(btn) {
				if (btn == 'yes') hdcall();
			});
		}
	};