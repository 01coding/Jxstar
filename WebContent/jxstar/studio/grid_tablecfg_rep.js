Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datatablestate = Jxstar.findComboData('tablestate');
	var Datatablespace = Jxstar.findComboData('tablespace');
	var Datatabletype = Jxstar.findComboData('tabletype');

	var cols = [
	{col:{header:'状态', width:64, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatablestate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatablestate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatablestate.length; i++) {
				if (Datatablestate[i][0] == value)
					return Datatablestate[i][1];
			}
		}}, field:{name:'dm_tablecfg__state',type:'string'}},
	{col:{header:'*表名称', width:134, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:30, allowBlank:false
		})}, field:{name:'dm_tablecfg__table_name',type:'string'}},
	{col:{header:'*表标题', width:123, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'dm_tablecfg__table_title',type:'string'}},
	{col:{header:'表空间', width:100, sortable:true, defaultval:'jxstar', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatablespace
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatablespace[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatablespace.length; i++) {
				if (Datatablespace[i][0] == value)
					return Datatablespace[i][1];
			}
		}}, field:{name:'dm_tablecfg__table_space',type:'string'}},
	{col:{header:'*表主键', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:30, allowBlank:false
		})}, field:{name:'dm_tablecfg__key_field',type:'string'}},
	{col:{header:'*数据源', width:100, sortable:true, defaultval:'default', editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'dm_tablecfg__ds_name',type:'string'}},
	{col:{header:'表类型', width:69, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatabletype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatabletype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatabletype.length; i++) {
				if (Datatabletype[i][0] == value)
					return Datatabletype[i][1];
			}
		}}, field:{name:'dm_tablecfg__table_type',type:'string'}},
	{col:{header:'表说明', width:250, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'dm_tablecfg__table_memo',type:'string'}},
	{col:{header:'表ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'dm_tablecfg__table_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'dm_tablecfg_rep'
	};
	
	
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
		
	return new Jxstar.GridNode(config);
}