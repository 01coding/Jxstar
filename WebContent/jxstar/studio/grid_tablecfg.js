Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datatablestate = Jxstar.findComboData('tablestate');
	var Datatablespace = Jxstar.findComboData('tablespace');
	var Datatabletype = Jxstar.findComboData('tabletype');

	var cols = [
	{col:{header:'状态', width:58, sortable:true, defaultval:'1', align:'center',
		editable:false,
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
	{col:{header:'*表名称', width:124, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:30, allowBlank:false
		})}, field:{name:'dm_tablecfg__table_name',type:'string'}},
	{col:{header:'*表标题', width:141, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'dm_tablecfg__table_title',type:'string'}},
	{col:{header:'*数据源', width:100, sortable:true, defaultval:'default', editable:false,
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'dm_tablecfg__ds_name',type:'string'}},
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
	{col:{header:'*表主键', width:105, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:30, allowBlank:false
		})}, field:{name:'dm_tablecfg__key_field',type:'string'}},
	{col:{header:'表类型', width:88, sortable:true, defaultval:'0', align:'center',
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
	{col:{header:'表说明', width:249, sortable:true, editable:true, hcss:'color:#2E6DA4;',
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
		funid: 'dm_tablecfg'
	};
	
	
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
		
	return new Jxstar.GridNode(config);
}