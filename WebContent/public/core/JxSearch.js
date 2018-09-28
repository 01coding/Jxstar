/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 高级查询工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

JxSearch = {};
(function(){

	Ext.apply(JxSearch, {
	//当前功能ID
	funid: '',
	//查询方案表格
	gridHis: null,
	//查询条件明细表格
	gridDet: null,
	//查询条件明细表的数据存储对象
	storeDet: null,
	
	/**
	* public
	* 高级查询页面
	* queryData -- 查询数据格式，该表字段数据都提取到前台
	* 		[{query_id:'', query_name:'', is_share:'', user_id:''},{},...]
	* pageNode -- 当前功能的表格定义对象，用于取表格字段对象
	**/
	queryWindow: function(queryData, pageNode) {
		var self = this;
		self.funid = pageNode.nodeId;
		//查询方案表格
		self.gridHis = self.historyGrid(queryData);
		//查询明细表格对象
		self.gridDet = self.conditionGrid(pageNode);
		
		var queryLayout = new Ext.Container({
			layout:'border',
			//defaults:{margins:'2 2 2 2'},
			items:[{
				xtype:'container',
				region:'west',
				layout:'fit',
				split:true,
				width:155,
				items:[self.gridHis]
			},{
				xtype:'container',
				region:'center',
				layout:'fit',
				items:[self.gridDet]
			}]
		});
		
		//如果有上次查询，则不加载第一个方案
		var conds = pageNode.page.qryCondData;
		if (!conds) {
			//选择查询方案的第一条记录
			JxUtil.delay(200, function(){
				var cnt = self.gridHis.getStore().getCount();
				if (cnt > 0) {
					self.gridHis.getSelectionModel().selectRow(0);
					self.gridHis.fireEvent('rowclick', self.gridHis, 0);
				}
			});
		}
		
		//用于构建统计方案的查询条件，在对象关闭的时需要销毁
		pageNode.condGrid = self.gridDet;
		//添加统计方案
		//JxGroup.showCaseInQuery(pageNode, self.gridDet);
		
		queryLayout.on('beforedestroy', function(){
			pageNode.condGrid = null;
			delete pageNode.condGrid;
		});
		
		return queryLayout;
	},
	
	/**
	* private
	* 创建查询方案表格
	* queryData -- 查询数据格式，该表字段数据都提取到前台
	* 		[{query_id:'', query_name:'', is_share:'', user_id:''},{},...]
	**/
	historyGrid: function(queryData) {
		var self = this;
		var queryStore = new Ext.data.ArrayStore({
			fields: [
			   {name: 'query_id'},
			   {name: 'query_name'},
			   {name: 'is_share'},
			   {name: 'user_id'}
			]
		});
		//json对象转换为数组
		var data = [];
		for(var i = 0, len = queryData.root.length; i < len; i++){
			var item = [];
			item[0] = queryData.root[i].query_id;
			item[1] = queryData.root[i].query_name;
			item[2] = queryData.root[i].is_share;
			item[3] = queryData.root[i].user_id;
			data[i] = item;
		}
		queryStore.loadData(data);
		
		//删除查询方案
		var del_case = function() {
			var s = JxUtil.getSelectRows(self.gridHis);
			if (!JxUtil.selectone(s)) return false;
			
			var userid = s[0].get('user_id');
			if (userid.length > 0 && userid != JxDefault.getUserId()) {
				JxHint.alert(jx.query.deluser);//只能删除本人创建的条件！
				return false;
			}
			
			var hdcall = function() {
				var queryid = s[0].get('query_id');
				var params = 'funid=sysevent&pagetype=grid&eventcode=cond_delete';
				params += '&query_id='+queryid;
				
				Request.postRequest(params, function() {
					queryStore.remove(s[0]);
					//如果有记录，则选第一条，否则清除右边的条件
					var cnt = queryStore.getCount();
					if (cnt > 0) {
						self.gridHis.getSelectionModel().selectRow(0);
						self.gridHis.fireEvent('rowclick', self.gridHis, 0);
					} else {
						self.storeDet.removeAll();
						self.gridDet.fkValue = '';
					}
				});
			};
			//'确定删除选择的记录吗？'
			Ext.Msg.confirm(jx.base.hint, jx.event.delyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		};
		//保存查询方案
		var save_case = function() {
			var self = this;
			//请求参数
			var params = 'funid=sysevent&pagetype=grid&eventcode=cond_case';
			
			//组织查询条件明细信息
			queryStore.each(function(item) {
				params += '&query_name=' + item.get('query_name') + '&is_share=' + item.get('is_share') + '&query_id=' + item.get('query_id');
			});
			var hdCall = function() {
				queryStore.commitChanges();
			};
			
			//发送后台请求
			Request.postRequest(params, hdCall);
		};
		
		var queryTool = new Ext.Toolbar({deferHeight:true, 
			items:[
				/*{text:jx.base.del, iconCls:'eb_delete', handler: del_case},
				{text:jx.base.save, iconCls:'eb_save', handler: save_case}*/
				{text:jx.cloud.text18, handler: function(){}}//'自定义查询方案'
			]
		});
		
		var sm = new Ext.grid.RowSelectionModel();
		var queryGrid = new Ext.grid.EditorGridPanel({
			store: queryStore,
			columns: [//'查询方案'
				{header: jx.query.casex, width: 154, dataIndex: 'query_name', editable:true, 
					editor:new Ext.form.TextField({
						maxLength:50, allowBlank:false
					}),
					renderer:function(value, metaData, record, rowIndex, colIndex, store) {
						return value + '<span class="x-btn-rowin"><i class="ace-icon fa fa-edit"></i><i class="ace-icon fa eb_delete"></i></span>';
					}
				},
				{header: jx.query.pub, width: 50, dataIndex: 'is_share', editable:true, 
					editor:new Ext.form.Checkbox(), hidden:true, 
					renderer:function(value) {return value=='1' ? jx.base.yes : jx.base.no;}
				},
				{header: "query_id", hidden:true, dataIndex: 'query_id'},
				{header: "user_id", hidden:true, dataIndex: 'user_id'}
			],
			//tbar: queryTool,
			//hideHeaders: true,
			
			sm: sm,
			frame:false,
			border:false,
			enableColumnMove: false,
			enableHdMenu: false,
			stripeRows: false,
			viewConfig: {headersDisabled:true, markDirty:false}//forceFit:true
		});
		
		//点击记录，刷新查询条件明细
		queryGrid.on('rowclick', function(g, n, e){
			var record = g.getStore().getAt(n);
			if (record == null) return false;
			var queryid = record.get('query_id');
			
			//加载明细数据
			var hdCall = function(condata) {
				self.storeDet.removeAll();
				//先删除，再重新加载
				var data = [];
				for(var i = 0, len = condata.root.length; i < len; i++){
					var item = [];
					item[0] = condata.root[i].left_brack;
					item[1] = condata.root[i].colcode.replace('.', '__');//查询方案中的字段名中带.
					item[2] = condata.root[i].condtype;
					item[3] = condata.root[i].cond_value;
					item[4] = condata.root[i].right_brack;
					item[5] = condata.root[i].andor;
					item[6] = condata.root[i].coltype;
					item[7] = condata.root[i].col_no;
					data[i] = item;
				}
				self.storeDet.loadData(data);
				self.gridDet.getView().refresh();
				self.gridDet.fkValue = queryid;
			};
			
			var params = 'funid=queryevent&eventcode=cond_qrydet';
			params += '&query_id='+queryid;
			Request.dataRequest(params, hdCall);
		});
		//按钮添加事件
		queryGrid.on('rowclick', function(g, rowIndex, e){
			if (!e) return;
			var t = e.getTarget();
			var tag = t.tagName.toUpperCase();
			if (tag == 'I') {
				//删除
				if (t.className.indexOf('eb_delete') > -1) {
					del_case();
				}
				//编辑
				if (t.className.indexOf('fa-edit') > -1) {
					g.startEditing(rowIndex, 0);
				}
			}
		});
		//编辑后自动保存
		queryGrid.on('afteredit', function(e){
			save_case();
		});
				
		return queryGrid;
	},
		
	/**
	* private
	* 保存查询条件；如果有选择的查询方案，则直接保存，否则弹出窗口另存
	* isother -- 是否另存 true|false
	**/
	saveQuery: function(self, isother) {
		if (self.editor) self.editor.stopEditing();
		
		var cnt = self.storeDet.getCount();
		if (cnt == 0) {
			JxHint.alert(jx.query.condempty);	//'查询条件为空，不能保存！'
			return false;
		}
		/*
		for (var i = 0; i < self.storeDet.getCount(); i++) {
			var record = self.storeDet.getAt(i);
			var value = record.get('cond_value');
			if (Ext.isEmpty(value)) {
				JxHint.alert(String.format(jx.query.valempty, i+1));	//'第{0}行的查询值为空，不能保存！'
				return false;
			}
		}*/
		
		//如果有查询Id，则直接保存，否则弹出窗口填写方案名称
		var queryId = self.gridDet.fkValue;
		if (queryId != null && queryId.length > 0 && !isother) {
			self.saveQueryFn(queryId);
			return;
		}
		
		var isAdmin = JxUtil.isAdminUser();
		
		var queryForm = new Ext.form.FormPanel({
				layout:'form', 
				labelAlign:'right',
				labelWidth:120,
				border:false, 
				frame:false,
				items:[
					{xtype:'textfield', fieldLabel:jx.query.casename, name:'query_name', //'查询方案名称'
						allowBlank:false, labelSeparator:'*', anchor:'95%', labelStyle:'color:#0077FF;', maxLength:50},
					{xtype:'checkbox', hidden:!isAdmin, fieldLabel:jx.query.share, name:'is_share'}		//'是否共享?'
				]
			});
		
		//创建对话框
		var win = new Ext.Window({
			title:jx.query.savetitle,	//'保存查询条件'
			layout:'fit',
			width:400,
			height:220,
			resizable: false,
			modal: true,
			closeAction:'close',
			bodyStyle:'padding-top:20px;',
			items:[queryForm],

			buttons: [{
				text:jx.base.ok,	//'确定'
				handler:function(){
					var form = queryForm.getForm();
					//取条件名称
					var isshare = form.findField('is_share').getValue();
					var qryname = form.findField('query_name').getValue();
					if (qryname.length == 0) {
						JxHint.alert(jx.query.noname);	//'查询条件名称不能为空！'
						return false;
					}
					
					//组织查询条件主表信息
					var param = '&is_share=' + isshare;
					param += '&query_name=' + encodeURIComponent(qryname);
					//保存查询条件
					self.saveQueryFn('', param, win);
				}
			},{
				text:jx.base.cancel,	//'取消'
				handler:function(){win.close();}
			}]
		});
		win.show();
		JxUtil.delay(200, function(){queryForm.get(0).focus(true)});
	},
	
	//private 保存查询条件的方法
	saveQueryFn: function(queryId, caseUrl, caseWin) {
		var self = this;
		//请求参数
		var params = 'funid=sysevent&selfunid='+ self.funid;
		params += '&pagetype=grid&eventcode=cond_save&query_id='+ queryId;
		
		//组织查询条件明细信息
		self.storeDet.each(function(item) {
			params += '&' + Ext.urlEncode(item.data);
		});
		
		if (caseUrl) params += caseUrl;
		
		//刷新查询条件表数据
		var hdCall = function(data) {
			if (queryId.length == 0) {
				data.user_id = JxDefault.getUserId();
				var r = new (self.gridHis.getStore().reader.recordType)(data);
				self.gridHis.getStore().insert(0, r);
			}
			self.gridHis.getSelectionModel().selectRow(0);
			self.gridHis.fireEvent('rowclick', self.gridHis, 0);
			
			if (caseWin) caseWin.close();
		};
		
		//发送后台请求
		Request.postRequest(params, hdCall);
	},
	
	/**
	* private
	* 查询条件编辑表格
	* pageNode -- 当前功能的表格定义对象，用于取表格字段对象
	**/
	conditionGrid: function(pageNode) {
		var self = this;
		//创建存储对象
		var condStore = new Ext.data.ArrayStore({
			fields: [
			   {name: 'left_brack'},
			   {name: 'colcode'},
			   {name: 'condtype'},
			   {name: 'cond_value'},
			   {name: 'right_brack'},
			   {name: 'andor'},
			   {name: 'coltype'},
			   {name: 'col_no'}
			]
		});
		condStore.on('load', function(s){
			JxUtil.delay(100, function(){
				if (s.getCount() > 0) {
					editor.startEditing(0, true);
					selectField(fieldCombo, true);
					self.gridDet.getSelectionModel().selectRow(0);
				} else {
					createQuery();
				}
			});
		});
		self.storeDet = condStore;
		
		//加载上次查询数据
		var loadsc = function(conds) {
			self.storeDet.removeAll();
			//先删除，再重新加载
			var datas = [];
			for(var i = 0, len = conds.length; i < len; i++) {
				var item = [];
				item[0] = conds[i].left_brack;
				item[1] = conds[i].colcode.replace('.', '__');//查询方案中的字段名中带.
				item[2] = conds[i].condtype;
				item[3] = conds[i].cond_value;
				item[4] = conds[i].right_brack;
				item[5] = conds[i].andor;
				item[6] = conds[i].coltype;
				item[7] = conds[i].col_no;
				datas[i] = item;
			}
			self.storeDet.loadData(datas);
		};
		var conds = pageNode.page.qryCondData || [];
		loadsc(conds);
		
		//构建行编辑对象
		var editor = new Ext.ux.grid.RowEditor({
			name: JxUtil.newId() + '_qv',
			saveText: jx.base.ok,		//'确定'
			cancelText: jx.base.cancel,	//'取消'
			monitorValid: false,		//不判断有效性
			clicksToEdit: 1,
			ajustWidth: -50 			//宽度减少50px
		});
		self.editor = editor;
		
		//复选模式
		var sm = new Ext.grid.RowSelectionModel();
		
		//创建字段列表
		var fieldID = pageNode.id + '_hqf';
		var colm = pageNode.page.getColumnModel();
		var fieldData = [], mycols = colm.config;
		for (var i = 0, c = 0, n = mycols.length; i < n; i++){
			var col = mycols[i], fn = col.dataIndex;
			if (fn == null || fn.length == 0) continue;
			if (col.colindex >= 10000) continue;
			
			var len = fn.length;
			if (fn.substring(len-2) != 'id' || !col.hidden) {
				var h = col.header;
				if(!Ext.isNumber(h)){
					if (h.charAt(0) == '*') h = h.substr(1);
					fieldData[c++] = [fn, h];
				}
			}
		}
		var fieldCombo = Jxstar.createCombo(fieldID, fieldData, 100);
		
		//创建条件选项
		var condID = pageNode.id + '_hqc';
		var condData = ComboData.condtype;
		var condCombo = Jxstar.createCombo(condID, condData);
		
		//创建逻辑选项
		var andorID = pageNode.id + '_hqa';
		var andorData = [['and', jx.query.and], ['or', jx.query.or]];
		var andorCombo = Jxstar.createCombo(andorID, andorData);
		
		//监听字段选择的事件
		var selectField = function(combo, isInit) {
			var field, coltype = 'string';
			//更换字段查询值的输入控件
			var mycols = pageNode.param.cols;
			for (var i = 0, n = mycols.length; i < n; i++){
				var mc = mycols[i].col, mf = mycols[i].field;
				if (mf && mf.name == combo.getValue()) {
					coltype = mf.type;
					if (!mc.hasOwnProperty('editor')) {
						if (coltype == 'string') {
							field = new Ext.form.TextField({allowBlank:false});
						} else if (coltype == 'date') { 
							var format = JxUtil.getDateFormat(mc.renderer);//设置日期控件的样式，可能是月份样式
							field = new Ext.form.DateField({format:format, allowBlank:false});
						} else {
							field = new Ext.form.NumberField({allowBlank:false, maxLength:12});
						}
					} else {
						var oldcmp = mc.editor;
						//combo控件不能编辑，但可以删除选项值；combosel、combowin控件可以编辑；
						//由于db2数据库的查询值长度不能超过字段长度，才做这样的判断
						var iscombo = false;
						if (oldcmp.isXType('combo') && oldcmp.mode == 'local') {
							iscombo = true;
						}
						Ext.apply(oldcmp.initialConfig, {allowBlank:true, editable:!iscombo, cls:''});
						field = new oldcmp.constructor(oldcmp.initialConfig);
					}
					break;
				}
			}
			if (field == null) {
				field = new Ext.form.TextField({allowBlank:false});
			}
			//初始数据时才取原值
			if (isInit) {
				//取原字段的值
				var rowIndex = editor.rowIndex;
				var record = condStore.getAt(rowIndex);
			
				var oldval ='';
				if(record != null) oldval = record.get('cond_value');
				
				if (field.isXType('datefield')) {
					oldval = Ext.isDate(oldval) ? oldval.dateFormat('Y-m-d') : oldval;
					if (oldval.length > 0) oldval = oldval.split(' ')[0];
					oldval = Date.parseDate(oldval, "Y-m-d");
				}
			
				field.setValue(oldval);
			}
			
			//先删除原对象，再更新为新对象
			var vIndex = 3;//被替换的字段控件
			var oldf = editor.getComponent(vIndex); 
			var xty = oldf.getXType();
			if (!(oldf.getXType() == field.getXType() && (xty == 'textfield' || xty == 'datefield'))) {
				editor.remove(editor.getComponent(vIndex), true);
				editor.insert(vIndex, field);
				editor.verifyLayout();
			} else {
				oldf.setValue(field.getValue()); field.destroy(); field = oldf;
			}
			//聚焦全选字段值
			field.selectOnFocus = true;
			
			//更换字段查询条件的缺省值
			self.setCondDefault(condCombo, coltype, field.getXType());
			
			//保存字段数据类型；要手动写入否则不会修改记录值
			if (editor.record) {
				editor.record.set('coltype', coltype);
				editor.record.set('colcode', combo.getValue());
				editor.record.set('condtype', condCombo.getValue());
				editor.record.set('cond_value', field.getValue());
			}
		};
		//change select
		fieldCombo.on('select', function(combo){selectField(combo, false);});
		condCombo.on('select', function(combo){
			if (editor.record) {editor.record.set('condtype', combo.getValue());}
		});
		
		//创建列对象
		var cm = new Ext.grid.ColumnModel([
			//"左括号"
			{id:'left_brack', header:'（', width:30, hidden:true, dataIndex:'left_brack', 
				editor:new Ext.form.TextField()
			},//"列名*"
			{id:'colcode', header:jx.query.colcode, width:160, dataIndex:'colcode', 
				editor:fieldCombo,
				renderer:function(value){
					for (var i = 0; i < fieldData.length; i++) {
						if (fieldData[i][0] == value)
							return fieldData[i][1];
					}
				}
			},//"条件*"
			{id:'condtype', header:jx.query.cond, width:130, dataIndex:'condtype', 
				editor:condCombo,
				renderer:function(value){
					for (var i = 0; i < condData.length; i++) {
						if (condData[i][0] == value)
							return condData[i][1];
					}
				}
			},//"查询值*"
			{id:'cond_value', header:jx.query.value, width:190, dataIndex:'cond_value', 
				editor:new Ext.form.TextField(),
				renderer:function(value){
					var value = Ext.isDate(value) ? value.format('Y-m-d') : value;
					if (value.length > 0 && value.indexOf(' 00:00:00') >= 0) {//日期格式值处理
						value = value.split(' ')[0];
					}
					return value;
				}
			},//"右括号"
			{id:'right_brack', header:'）', width:30, hidden:true, dataIndex:'right_brack', 
				editor:new Ext.form.TextField()
			},//"逻辑符"
			{id:'andor', header:jx.query.andor, width:50, hidden:true, dataIndex:'andor', 
				editor:andorCombo,
				renderer:function(value){
					for (var i = 0; i < andorData.length; i++) {
						if (andorData[i][0] == value)
							return andorData[i][1];
					}
				}
			},
			{
	            xtype: 'actioncolumn',
	            width: 50,
	            items: [{
                    icon   : 'resources/images/icons/fam/clear.gif',
                    tooltip: '删除',
                    handler: function(grid, rowIndex, colIndex) {
                        condStore.removeAt(rowIndex);
                    }
                }]
	        },
			{id:'col_no', header:jx.query.colno, width:40, hidden:true, dataIndex:'col_no', 
				editor:new Ext.form.TextField()
			},//"序号"
			{id:'coltype', dataIndex:'coltype', hidden:true},
			{id:'colname', dataIndex:'colname', hidden:true}
		]);
		
		//新增查询条件
		var createQuery = function() {
			var c = new (condStore.reader.recordType)({
				left_brack: '',
				colcode: fieldData[0][0],
				condtype: '',
				cond_value: '',
				right_brack: '',
				andor: andorData[0][0],
				coltype: 'string',
				col_no: '0'
			});
			
			//editor.stopEditing();
			var pos = condStore.getCount();
			condStore.insert(pos, c);
			condGrid.getView().refresh();
			condGrid.getSelectionModel().selectRow(pos);
			editor.startEditing(pos);
			//显示字段查询值输入控件
			selectField(fieldCombo, false);
		};
		
		//删除查询条件
		var deleteQuery = function() {
			editor.stopEditing();
			var s = condGrid.getSelectionModel().getSelections();
			if (s == null || s.length == 0) {
				JxHint.alert(jx.query.delcond);	//'请选择要删除的查询条件！'
				return false;
			}
			for(var i = 0, r; r = s[i]; i++){
				condStore.remove(r);
			}
		};
		
		//执行查询事件
		var executeQuery = function() {
			editor.stopEditing();
			if (condStore.getCount() == 0) {
				JxHint.alert(jx.query.nocond);		//'查询条件为空，请添加查询条件！'
				return false;
			}
			
			//按字段名排序
			condStore.singleSort('colcode');
			
			var items = [], cnt = 0;
			for (var i = 0; i < condStore.getCount(); i++) {
				var record = condStore.getAt(i);
				var value = record.get('cond_value');
				if (Ext.isEmpty(value)) {
					//JxHint.alert(String.format(jx.query.valempty, i+1));	//第{0}行的查询值为空，不能执行！
					//return false;
					continue;
				}
				
				//把数据存起来
				items[cnt] = Ext.apply({}, record.data);
				cnt++;
			}
			
			var query = self.getQuery(condStore);
			if (query == null) return false;
			condStore.commitChanges();
			
			//高级查询能查询到已提交记录，不处理归档
			Jxstar.myQuery(pageNode.page, query, '1');
			
			//把查询条件保存到临时变量中，可以通过高级按钮旁的X清空此值
			pageNode.page.qryCondData = items;
			var tbar = pageNode.page.getTopToolbar();
			if (tbar) tbar.getComponent('qidx').setVisible(true);
			
			var win = condGrid.findParentByType('window');
			if (win) win.close();
		};
		
		//创建底部工具栏
		var buttons = [
				{text:jx.cloud.text16, handler:createQuery, iconCls:'eb_add', cls:'x-btn-white'},//'添加更多条件'
				'->',
				{text:jx.cloud.text17, cls:'x-btn-white', handler:function(){self.saveQuery(self, true);}},//'保存为常用查询'
				{text:jx.base.query, iconCls:'eb_qry', handler:executeQuery} //'查询'
			];
			
		//创建表格对象
		var condGrid = new Ext.grid.GridPanel({
			store: condStore,
			cm: cm,
			sm: sm,
			plugins: [editor],
			
			frame:false,
			border:false,
			enableHdMenu: false,
			enableColumnMove: false,
			stripeRows: false,
			columnLines: false,
			//标题不可动；不显示脏标记
			viewConfig: {headersDisabled:true, markDirty:false},//forceFit:true
			
			buttonCls: '',
			buttonAlign: 'left',
			buttons: buttons
		});
		//点击一条记录时显示字段值控件、值输入控件
		condGrid.on('rowclick', function(g, row){
			selectField(fieldCombo, true);
		});

		return condGrid;
	},
	
	/**
	* private
	* 取查询子句信息
	* store -- 查询明细对象，支持MixedCollection对象
	* return 返回数组：wheresql, value, type
	*/
	getQuery: function(store) {
		if (store == null || store.getCount() == 0) return null;
		
		var query = new Array('','','');
		
		var isstart = false;
		var lb = '', rb = '';//记录左括号长度与右括号长度，如果长度相等则说明括号匹配。
		for (var i = 0, n = store.getCount(); i < n; i++) {
			var data = null, nextd = null;
			if (store.getAt) {
				data = store.getAt(i).data;
				if (i < n-1) nextd = store.getAt(i+1).data;
			} else {
				data = store.itemAt(i);
				if (i < n-1) nextd = store.itemAt(i+1);
			}
			var cond_value = data['cond_value'];
			if (Ext.isEmpty(cond_value)) continue;
			
			var left_brack = data['left_brack'];
			var colcode = data['colcode'].replace('__', '.');
			var condtype = data['condtype'];
			var right_brack = data['right_brack'];
			var andor = data['andor']; 
			if (!andor || andor.length == 0) andor = 'and';
			var coltype = data['coltype'];
			
			//字符类型，且下一个字段同名则用or类型，再加括号
			if (nextd && coltype == "string") {
				var ncode = nextd['colcode'].replace('__', '.');
				if (ncode == colcode) {
					andor = 'or';
					if (isstart === false) {
						colcode = '(' + colcode;
						isstart = true;
					}
				} else {
					if (isstart === true) {
						andor = ') ' + andor;
						isstart = false;
					}
				}
			} else {
				if (isstart === true) {
					andor = ') ' + andor;
					isstart = false;
				}
			}
			
			lb += left_brack.trim();
			rb += right_brack.trim();
			
			//如果是空值判断
			if (cond_value == '~null~') {
				if (condtype == '<>') {
					query[0] += colcode + ' is not null ' + andor + ' ';
				} else {
					query[0] += colcode + ' is null ' + andor + ' ';
				}
				continue;
			}
			
			//如果是日期对象，则需要转换为字符串
			cond_value = Ext.isDate(cond_value) ? cond_value.dateFormat('Y-m-d') : cond_value;
			
			var values = this.getQueryValue(cond_value, condtype, coltype);
			//日期类型'=' 改为 >=? and <?查询
			if (condtype == "=" && coltype == "date") {
				query[0] += left_brack;
				query[0] += "(" + colcode + " >= ? and " + colcode + " < ? )";
				query[0] += right_brack;
				query[0] += " " + andor + " ";

				var nextDate = JxUtil.getNextDate(values[0], 1);
				query[1] += values[0]+";"+nextDate + ";";
				query[2] += coltype+";"+coltype + ";";
			} else {
				query[0] += left_brack;
				query[0] += colcode + this.getCondType(condtype) + "?";
				query[0] += right_brack;
				query[0] += " " + andor + " ";

				query[1] += values[0] + ";";
				query[2] += values[1] + ";";
			}
		}
		
		if (lb.length != rb.length) {
			JxHint.alert(jx.query.brackets);//'左边与右边的括号不匹配，不能执行查询！'
			return null;
		}
		
		if (query[0].length > 0) {
			var len = query[0].length - andor.length - 1;
			if (andor.charAt(0) == ')') len += 2;
			query[0] = "(" + query[0].substr(0, len) + ")";
		}
		if (query[1].length > 0) {
			query[1] = query[1].substr(0, query[1].length - 1);
		}
		if (query[2].length > 0) {
			query[2] = query[2].substr(0, query[2].length - 1);
		}

		return query;
	},
	
	/**
	* public
	* 取查询子句信息
	* colcode -- 字段
	* condtype -- 条件
	* value -- 查询值
	* coltype -- 字段类型
	* return 返回数组：wheresql, value, type
	*/
	getWhere: function(colcode, condtype, value, coltype) {
		var query = new Array('','','');
		if (Ext.isEmpty(value)) return query;
		
		//如果是空值判断
		if (value == '~null~') {
			if (condtype == '<>') {
				query[0] = colcode + ' is not null';
			} else {
				query[0] = colcode + ' is null';
			}
			return query;
		}
		
		//如果是日期对象，则需要转换为字符串
		value = Ext.isDate(value) ? value.dateFormat('Y-m-d') : value;
			
		var values = this.getQueryValue(value, condtype, coltype);
		
		if (condtype == "=" && coltype == "date") {
			query[0] += "(" + colcode + " >= ? and " + colcode + " < ? )";

			var nextDate = JxUtil.getNextDate(values[0], 1);
			query[1] += values[0]+";"+nextDate;
			query[2] += coltype+";"+coltype;
		} else {
			query[0] += colcode + this.getCondType(condtype) + "?";

			query[1] += values[0];
			query[2] += values[1];
		}

		return query;
	},
	
	/**
	* private
	* 返回条件语句
	* condtype -- 条件选项值
	*/
	getCondType: function (condtype) {
		var ret = "like";
		if (condtype == "") {
			return ret;
		}

		switch (condtype) {
			case '=':
				ret = " = ";
				break;
			case '>':
				ret = " > ";
				break;
			case '<':
				ret = " < ";
				break;
			case '>=':
				ret = " >= ";
				break;
			case '<=':
				ret = " <= ";
				break;
			case '<>':
				ret = " <> ";
				break;
			case 'llike':
				ret = " like ";
				break;
			case 'rlike':
				ret = " like ";
				break;
			case 'nlike':
				ret = " not like ";
				break;
			case 'like':
				ret = " like ";
				break;
		}

		return ret;
	},

	/**
	* private
	* 返回查询内容值
	* value -- 查询值
	* condtype -- 条件类型
	* coltype -- 字段类型
	* return 返回数组：查询值与数据类型 
	*/
	getQueryValue: function(value, condtype, coltype) {
		var ret = new Array();

		switch (coltype) {
			case 'string':
				if (condtype == "llike") {
					ret[0] = value + "%";
				} else if (condtype == "rlike") {
					ret[0] = "%" + value;
				} else if (condtype == "like" || condtype == "nlike") {
					ret[0] = "%" + value + "%";
				} else {
					ret[0] = value;
				}

				ret[1] = "string";
				break;
			case 'int':
				ret[0] = value;
				ret[1] = "int";
				break;
			case 'date':
				//如果不含时间，且是< <=判断，则添加时间
				if (value.indexOf(' ') < 0 && (condtype == '<=')) {
					value += ' 23:59:59';
				}
				ret[0] = value;
				ret[1] = "date";
				break;
			case 'float':
				ret[0] = value;
				ret[1] = "double";
				break;
			default :
				ret[0] = value;
				ret[1] = coltype;
				break;
		}

		return ret;
	},
	
	
	/**
	* private
	* 处理条件选项缺省值
	* condCombo -- 条件选项
	* coltype -- 字段类型
	* ctlType -- 控件类型
	*/
	setCondDefault: function(condCombo, coltype, ctlType) {
		var dv = condCombo.getValue();
		var cs = condCombo.store;
		var cr = cs.reader.recordType;
		cs.removeAll();
		var types = ComboData.condtype;
		
		if (coltype == 'string') {
			if (ctlType == 'combo') {
				cs.insert(0, new cr({value:types[0][0], text:types[0][1]}));
				
				condCombo.setValue('=');
			} else {
				cs.insert(0, new cr({value:types[0][0], text:types[0][1]}));
				cs.insert(1, new cr({value:types[1][0], text:types[1][1]}));
				cs.insert(2, new cr({value:types[6][0], text:types[6][1]}));
				cs.insert(3, new cr({value:types[7][0], text:types[7][1]}));
				cs.insert(4, new cr({value:types[8][0], text:types[8][1]}));
				
				//保留原值
				var s = types[0][0]+','+types[1][0]+','+types[6][0]+','+types[7][0]+','+types[8][0]+',';
				if (dv.length > 0 && s.indexOf(dv+',') >= 0) {
					condCombo.setValue(dv);
				} else {
					condCombo.setValue('like');
				}
			}
		} else {
			cs.insert(0, new cr({value:types[0][0], text:types[0][1]}));
			cs.insert(1, new cr({value:types[1][0], text:types[1][1]}));
			cs.insert(2, new cr({value:types[2][0], text:types[2][1]}));
			cs.insert(3, new cr({value:types[3][0], text:types[3][1]}));
			cs.insert(4, new cr({value:types[4][0], text:types[4][1]}));
			cs.insert(5, new cr({value:types[5][0], text:types[5][1]}));
			
			//保留原值
			var s = types[0][0]+','+types[1][0]+','+types[2][0]+','+types[3][0]+','+types[4][0]+','+types[5][0]+',';
			if (dv.length > 0 && s.indexOf(dv+',') >= 0) {
				condCombo.setValue(dv);
			} else {
				condCombo.setValue('=');
			}
		}
	}

	});//Ext.apply

})();
