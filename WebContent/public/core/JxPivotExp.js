/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 统计方案定义工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2018-05-10
 */

JxPivotExp = {};
(function(){

	Ext.apply(JxPivotExp, {
	
	//当前功能ID
	funId: '',
	//所有字段
	charFields: [],
	//字段列表对象
	listField: null,
	//列标签表对象
	listColumn: null,
	//行标签表对象
	listRow: null,
	//数值表对象
	listValue: null,
	//当前选择的方案ID
	selStatId: '',
	//方案表格
	statGrid: null,
	//数据renderer
	fieldRender: {},
	
	//初始化参数
	init: function(pageNode) {
		this.funId = pageNode.nodeId;
		this.charFields = [];
		
		//取字段信息
		var fieldNames = [], mycols = pageNode.param.cols;
		var c = 0;
		for (var i = 0, n = mycols.length; i < n; i++) {
			var mc = mycols[i].col, mf = mycols[i].field;
			if (mc == null || mf == null) continue;
			
			var fn = mf.name, len = fn.length;
			if (mc && mf && (fn.substring(len-2) != 'id')) {
				var h = mc.header;
				if (h.charAt(0) == '*') h = h.substr(1);
				
				var data = [mf.name, h];
				//var type = mf.type;
				
				this.charFields[c++] = data;
			}
			//主要处理combo\date值
			if (mc.renderer && mf.type != 'float') {
				this.fieldRender[mf.name] = mc.renderer;
			}
		}
	},

	/**
	* public 统计方案自定义界面
	* pageNode -- 当前功能的表格定义对象，用于取表格字段对象
	**/
	showWindow: function(pageNode) {
		var self = this;
		self.funid = pageNode.nodeId;
		
		//初始化字段数据
		self.init(pageNode);
		var listField = self.listFieldCt();
		var listPivot = self.listPivotCt();
		var buttons = [
			    {text:'保存方案', iconCls:'eb_save', handler:self.saveCase.createDelegate(self), cls:'x-btn-white'},
				'->',
				{text:jx.group.stat, iconCls:'eb_chart', handler:self.exeStat.createDelegate(self, [pageNode])}
			];//'统计'
		
		//分类字段与统计字段选择界面
		var	selpanel = new Ext.Panel({
			layout:'border',
			items:[listField,listPivot],
			buttonCls: '',
			buttonAlign: 'left',
			buttons: buttons
		});
		
		var	win = new Ext.Window({
			title:'数据透视统计',
			layout:'border',
			width: 600,
			height: 600,
			constrainHeader: true,
			resizable: false,
			modal: true,
			closeAction: 'close',
			items:[{
				xtype:'container',
				region:'west',
				layout:'fit',
				width:160,
				split:true,
				margins:'2 0 2 2'
			},{
				xtype:'container',
				region:'center',
				layout:'fit',
				margins:'2 2 2 0',
				items:[selpanel]
			}]
		});
		
		//添加主从关系
		var hdcall = function(mg) {
			self.statGrid = mg;
			mg.on('rowclick', function(g, n, e){
				var record = g.getStore().getAt(n);
				if (record == null) return false;
				
				var fkval = record.get('sys_stat__stat_id');
				self.clickCase(fkval);
			});
			mg.getStore().on('load', function(store){
				//打开页面时显示第一条
				if (mg.selectKeyId == null || mg.selectKeyId.length == 0) {
					mg.getSelectionModel().selectFirstRow();
					mg.fireEvent('rowclick', mg, 0);
				}
			});
			//删除后清除右边的内容，会调用load事件
			mg.gridNode.event.on('afterdelete', function(){
				self.createCase();
				mg.selectKeyId = '';
			});
			var options = {
				where_sql:"stat_type = '2' and fun_id = ? and (is_share = '1' or user_id = ?)", 
				where_value:self.funid+';'+JxDefault.getUserId(), 
				where_type:'string;string'
			};
			Jxstar.loadData(mg, options);
		};
		//构建表格对象
		Jxstar.createPage('sys_stat', 'gridpage', win.getComponent(0), {pageType:'notool',showCall:hdcall});
		
		win.on('destroy', function() {
			if (self.statGrid != null) self.statGrid.destroy();
			self.funId = '';
			self.charFields = null;
			self.numFields = null;
			self.charLists = null;
			self.numLists = null;
			self.selStatId = '';
			self.statGrid = null;
		});
		
		win.show();
		return win;
	},
	
	//添加拖拽事件
	addDragDrop: function(node, store) {
		var proxy = new Ext.dd.DragSource(node, {group:'target_list'});
		proxy.afterDragDrop = function(target, e, id) {
			var rec_id = this.id.split('_')[1];
			var rec = store.getById(rec_id);
			//添加数值字段
			if (id == 'target_list_value') {
				var r = new Ext.data.Record({'text':'求和 - '+rec.get('text'), 'value':rec.get('value'), 'coluse':'sum'});
				Ext.getCmp(id).getStore().add(r);
			} else {
				rec.set('coluse', (id == 'target_list_column')?'col':'row');
				Ext.getCmp(id).getStore().add(rec);
				store.remove(rec);
			}
		};
	},
	
	//构建分类字段选择区
	listFieldCt: function() {
		var self = this;
		//字段列
		var dsField = new Ext.data.ArrayStore({
			data: self.charFields || [],
			fields: ['value','text','coluse']
		});
		var listField = new Ext.ListView({
				region: 'west',
				split: true,
				width: 200,
				store: dsField,
				disableHeaders: true,
				style: 'background-color:#fff;',
				columns: [{
					header: '字段列表 -- 拖到右边',
					dataIndex: 'text'
				}],
				listeners: {afterrender: function(view){
					var store = view.getStore();
					for (var i = 0; i < store.getCount(); i++) {
						var node = view.getNode(i);
						node.id = 'rec_'+store.getAt(i).id;
						//支持拖动字段到目标List中
						self.addDragDrop(node, store);
					}
				}}
			});
		self.listField = listField;
			
		return listField;
	},
	
	//构建统计字段选择区
	listPivotCt: function() {
		var self = this;
		var removeField = function(view, index){
				var store = view.getStore();
				var rec = store.getAt(index);
				if (view.id != 'target_list_value') {
					var st = self.listField.getStore();
					st.add(rec);
					//添加拖拽事件
					var node = self.listField.getNode(rec);
					node.id = 'rec_'+rec.id;
					self.addDragDrop(node, st);
				}
				store.removeAt(index);
		};
		//列标签
		var dsColumn = new Ext.data.ArrayStore({
			data: [],
			fields: ['value','text','coluse']
		});
		var listColumn = new Ext.ListView({
				id: 'target_list_column',
				region: 'north',
				height: 180,
				store: dsColumn,
				disableHeaders: true,
				style: 'background-color:#fff;',
				columns: [{
					header: '列标签 -- 双击取消',
					dataIndex: 'text'
				}],
				listeners: {dblclick: removeField}
			});
		new Ext.dd.DDTarget(listColumn.id, 'target_list');
		//行标签
		var dsRow = new Ext.data.ArrayStore({
			data: [],
			fields: ['value','text','coluse']
		});
		var listRow = new Ext.ListView({
				id: 'target_list_row',
				region: 'center',
				store: dsRow,
				disableHeaders: true,
				style: 'background-color:#fff;',
				columns: [{
					header: '行标签 -- 双击取消',
					dataIndex: 'text'
				}],
				listeners: {dblclick: removeField}
			});
		new Ext.dd.DDTarget(listRow.id, 'target_list');
		//数值
		var dsValue = new Ext.data.ArrayStore({
			data: [],
			fields: ['value','text','coluse']
		});
		var listValue = new Ext.ListView({
				id: 'target_list_value',
				region: 'south',
				height: 150,
				store: dsValue,
				disableHeaders: true,
				style: 'background-color:#fff;',
				columns: [{
					header: '数值 -- 双击取消、右击修改公式',
					dataIndex: 'text'
				}],
				listeners: {dblclick: removeField, 
					contextmenu: function(view, index, node){
						var store = view.getStore();
						self.listValue.selectRec = store.getAt(index);
						
						var menu = self.listValue.menu;
						if (!menu) {
							var items = [];
							var frm = ComboData.pivotformula;
							for (var i = 0; i < frm.length; i++) {
								var item = {data:frm[i][0], text:frm[i][1], handler:function(obj){
									var fm = obj.initialConfig.data;//公式名称
									var tx = obj.initialConfig.text;//公式标题
									//修改公式名称
									var rec = self.listValue.selectRec;
									var text = tx + ' - ' + rec.get('text').split(' - ')[1];
									rec.set('text', text);
									rec.set('coluse', fm);
								}};
								items.push(item);
							}
							menu = new Ext.menu.Menu({items:items});
							self.listValue.menu = menu;
						}
						menu.show(node);
				}}
			});
		new Ext.dd.DDTarget(listValue.id, 'target_list');
		var pivot = new Ext.Container({
			layout:'border',
			region: 'center',
			items:[listColumn,listRow,listValue]
		});
		
		self.listRow = listRow;
		self.listValue = listValue;
		self.listColumn = listColumn;
		
		return pivot;
	},
	
	//保存统计方案
	saveCase: function() {
		var self = this;
		self.selStatId = '';//改为每次都新增一条记录
		
		//选择的分组字段
		var dsValue = self.listValue.getStore();
		if (dsValue.getCount() == 0) {
			JxHint.alert('没有选择数值字段，不能执行统计！');
			return;
		}
		var dsRow = self.listRow.getStore();
		var dsCol = self.listColumn.getStore();
		
		//保存统计方案
		var hdcall = function(text, is_share) {
			var e = encodeURIComponent;
			var chars = '', chartitles = '', charuse = '', nums = '', numtitles = '', numuse = '';
			//取分组字段
			dsRow.each(function(r){
				charuse += 'row,';
				chars += r.get('value') + ',';
				chartitles += r.get('text') + ',';
			});
			dsCol.each(function(r){
				charuse += 'col,';
				chars += r.get('value') + ',';
				chartitles += r.get('text') + ',';
			});
			if (chars.length > 0) {
				chars = chars.substr(0, chars.length-1);
				charuse = charuse.substr(0, charuse.length-1);
				chartitles = chartitles.substr(0, chartitles.length-1);
			}
			
			//取统计字段
			dsValue.each(function(r){
				nums += r.get('value') + ',';
				numuse += r.get('coluse') + ',';
				numtitles += r.get('text').split(' - ')[1] + ',';
			});
			nums = nums.substr(0, nums.length-1);
			numuse = numuse.substr(0, numuse.length-1);
			numtitles = numtitles.substr(0, numtitles.length-1);
			
			var endcall = function(data) {
				self.statGrid.selectKeyId = data.keyid;
				var store = self.statGrid.getStore();
				store.reload();
			};
			var params = 'funid=sys_stat&eventcode=savecase&statfunid=' + self.funid +'&stat_type=2';
				params += '&keyid=' + self.selStatId + '&statname=' + e(text) + '&chars=' + e(chars) + '&is_share=' + is_share;
				params += '&chartitles=' + e(chartitles) + '&nums=' + nums + '&numtitles=' + e(numtitles);
				params += '&charuse=' + charuse + '&numuse=' + numuse;
			Request.dataRequest(params, endcall);
		};
		
		//弹出窗口输入统计方案名称
		var isAdmin = JxUtil.isAdminUser();
		var formcfg = {
			bodyStyle:'padding:20px 0 0 20px;',
			items : [
				{xtype:'textfield', fieldLabel:jx.group.casename, name:'stat_name', value:'透视方案',
					allowBlank:false, labelSeparator:'*', labelStyle:'color:#0077FF;', maxLength:50},
				{xtype:'checkbox', hidden:!isAdmin, fieldLabel:jx.query.share, name:'is_share'}		//'是否共享?'
			]
		};
		var wincfg = { width : 400,  height : 200 };
		var okcall = function(form, win){
			var text = form.get('stat_name');
			if (text.length == 0) {
				JxHint.alert(jx.group.usename);//'必须填写统计方案名称'
				return false;
			}
			var is_share = form.get('is_share');
			hdcall(text, is_share);
			win.close();
		};
		JxUtil.formWindow({formcfg:formcfg, wincfg:wincfg, okcall:okcall});
	},
	
	/**
	 * 执行统计方案
	 */
	exeStat: function(nodeg) {
		var self = this;
		//选择的分组字段
		var dsValue = self.listValue.getStore();
		if (dsValue.getCount() == 0) {
			JxHint.alert('没有选择数值字段，不能执行统计！');
			return;
		}
		var dsRow = self.listRow.getStore();
		var dsCol = self.listColumn.getStore();
		
		var rows = [], cols = [], nums = [];
		dsRow.each(function(r){
			rows.push({colcode:r.get('value'), colname:r.get('text')});
		});
		dsCol.each(function(r){
			cols.push({colcode:r.get('value'), colname:r.get('text')});
		});
		dsValue.each(function(r){
			nums.push({colcode:r.get('value'), colname:r.get('text'), coluse:r.get('coluse')});
		});
		
		var data = {rows:rows, cols:cols, nums:nums};
		self.pivotexp(data, nodeg, this.fieldRender);
	},
	
	/**
	 * 打开数据透视表
	 */
	pivotexp: function(data, nodeg, renders) {
		var store = nodeg.page.getStore();
		
		var datas = [];
		for (var i = 0; i < store.getCount(); i++) {
			datas.push(store.getAt(i).data);
		}
		var fields = [];
		store.fields.each(function(item){
			var code = item.name;
			var field = {name:code, type:item.type.type};
			//把数据值转换好，方便导出excel透视表
			var rend = renders[code];
			if (rend) field.convert = rend;
			fields.push(field);
		});
		var title = nodeg.define.nodetitle;
		
		var aggregate = [];
		for (var i = 0; i < data.nums.length; i++) {
			var ux = data.nums[i].coluse;
			var item = {
				dataIndex:data.nums[i].colcode,
				header:data.nums[i].colname,
				width:120,
				aggregator:ux,
				exportStyle: [{
					width:120,
					format: (ux == 'count') ? 'General Number':'Fixed',
					alignment: {
						horizontal: 'Right'
					}
				}]
			};
			if (ux == 'count') {
				//计数显示为整数，参数：value, metaData, record, rowIndex, colIndex, store, view
				item.renderer = function(value){
					return (!value) ? '':parseInt(value);
				}
			}
			aggregate.push(item);
		}
		var leftAxis = [];
		for (var i = 0; i < data.rows.length; i++) {
			var code = data.rows[i].colcode;
			var item = {dataIndex:code, header:data.rows[i].colname};
			//var rend = renders[code];//标签显示方法
			//if (rend) item.labelRenderer = rend;
			leftAxis.push(item);
		}
		var topAxis = [];
		for (var i = 0; i < data.cols.length; i++) {
			var code = data.cols[i].colcode;
			var item = {dataIndex:code, header:data.cols[i].colname};
			topAxis.push(item);
		}
		
		var config = {aggregate: aggregate, leftAxis: leftAxis, topAxis: topAxis};
		var params = {config:config, datas:datas, fields:fields, title:title};
		
		var url = Jxstar.path + "/lib/pivot/exp.jsp";
		window.pivot_params = params;
		window.open(url);
	},
	
	//新建方案，把选择的值都移到左边
	createCase: function() {
		var self = this;
		var tt = self.listField.getStore();
		//左移列标签
		var st = self.listColumn.getStore();
		var rs = st.getRange(0, st.getCount());
		tt.add(rs);
		st.removeAll();
		
		//左移行标签
		st = self.listRow.getStore();
		rs = st.getRange(0, st.getCount());
		tt.add(rs);
		st.removeAll();
	
		//清除数值列
		self.listValue.getStore().removeAll();
		
		//给新节点添加拖拽事件
		for (var i = 0; i < tt.getCount(); i++) {
			var node = self.listField.getNode(i);
			if (!node.id || node.id.length == 0) {
				node.id = 'rec_'+tt.getAt(i).id;
				self.addDragDrop(node, tt);
			}
		}
	},
	
	//点击左边的方案时，加载右边的明细
	clickCase: function(statId) {
		var self = this;
		//先清除统计字段
		self.createCase();
		//保存当前方案ID
		self.selStatId = statId;
		
		var gettitle = function(t){
			var frm = ComboData.pivotformula;
			for (var i = 0; i < frm.length; i++) {
				if (frm[i][0] == t) return frm[i][1];  
			}
			return '';
		};
		var addrec = function(data, type){
			if (type == 'row' || type == 'col') {
				var store = self.listField.getStore();
				var index = store.find('value', data.colcode);
				if (index < 0) return;
				
				var list = (type == 'row') ? self.listRow : self.listColumn;
				var rec = store.getAt(index);
				rec.set('coluse', type);
				list.getStore().add(rec);
				store.remove(rec);
			} else {
				var r = new Ext.data.Record({'text':gettitle(data.coluse)+' - '+data.colname, 'value':data.colcode, 'coluse':data.coluse});
				self.listValue.getStore().add(r);
			}
		};
		var addrecs = function(datas, type){
			for (var i = 0; i < datas.length; i++) {
				addrec(datas[i], type);
			}
		};
							
		//再从后台加载方案字段
		var endcall = function(data) {
			//alert(Ext.encode(data));
			addrecs(data.cols, 'col');
			addrecs(data.rows, 'row');
			addrecs(data.nums, 'num');
		};
		var params = 'funid=sys_stat&pagetype=grid&eventcode=selpivot&keyid=' + statId;
		Request.dataRequest(params, endcall);
	}

	});//Ext.apply

})();
