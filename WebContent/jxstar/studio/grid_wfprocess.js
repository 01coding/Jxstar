Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataprostate = Jxstar.findComboData('prostate');
	var Dataprotype = Jxstar.findComboData('protype');

	var cols = [
	{col:{header:'状态', width:73, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataprostate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataprostate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataprostate.length; i++) {
				if (Dataprostate[i][0] == value)
					return Dataprostate[i][1];
			}
		}}, field:{name:'wf_process__process_state',type:'string'}},
	{col:{header:'*过程编号', width:122, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'wf_process__process_code',type:'string'}},
	{col:{header:'*过程名称', width:161, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'wf_process__process_name',type:'string'}},
	{col:{header:'过程类型', width:100, sortable:true, hidden:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataprotype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataprotype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataprotype.length; i++) {
				if (Dataprotype[i][0] == value)
					return Dataprotype[i][1];
			}
		}}, field:{name:'wf_process__process_type',type:'string'}},
	{col:{header:'*实例摘要', width:297, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'wf_process__process_title',type:'string'}},
	{col:{header:'*功能名称', width:130, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TriggerField({
			maxLength:50,
			editable:false, allowBlank:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				var selcfg = {"pageType":"combogrid", "nodeId":"sel_fun", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"fun_base.fun_name;fun_id;module_id", "targetField":"wf_process.fun_name;fun_id;module_id", "whereSql":"reg_type in ('main','treemain')", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"wf_process.fun_name"};
				JxSelect.createSelectWin(selcfg, this, 'node_wf_process_editgrid');
			}
		})}, field:{name:'wf_process__fun_name',type:'string'}},
	{col:{header:'版本号', width:65, sortable:true, defaultval:'1', editable:false,
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'wf_process__version_no',type:'string'}},
	{col:{header:'变更人', width:76, sortable:true, defaultval:'fun_getUserName()', editable:false,
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'wf_process__chg_user',type:'string'}},
	{col:{header:'变更日期', width:100, sortable:true, defaultval:'fun_getToday()', align:'center',
		editable:false,
		editor:new Ext.form.DateField({
			format: 'Y-m-d',
			minValue: '1900-01-01'
		}),
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'wf_process__chg_date',type:'date'}},
	{col:{header:'异步执行?', width:69, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'wf_process__exe_delay',type:'string'}},
	{col:{header:'功能ID', width:158, sortable:true, editable:false,
		editor:new Ext.form.TextField({
			maxLength:25
		})}, field:{name:'wf_process__fun_id',type:'string'}},
	{col:{header:'变更人ID', width:100, sortable:true, colindex:10000, hidden:true, defaultval:'fun_getUserId()'}, field:{name:'wf_process__chg_userid',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_process__process_id',type:'string'}},
	{col:{header:'原版过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_process__old_processid',type:'string'}},
	{col:{header:'模块ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_process__module_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'wf_process'
	};
	
	config.param.notNullFields = 'wf_process__process_code;wf_process__process_name;wf_process__fun_name;wf_process__process_title;';
	
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
		
	return new Jxstar.GridNode(config);
}