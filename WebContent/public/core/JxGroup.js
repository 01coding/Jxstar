/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 统计方案定义工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2012-04-17
 */

JxGroup = {};
(function(){

	Ext.apply(JxGroup, {
	
	initStas:[['0', '--'+ jx.group.statc +'--'], ['1', '--'+jx.query.custom]],//统计方案
	//当前功能ID
	funId: '',
	//非数字字段
	charFields: [],
	//数字字段
	numFields: [],
	//分组字段列表对象
	charLists: null,
	//统计字段列表对象
	numLists: null,
	//当前选择的方案ID
	selStatId: '',
	//方案表格
	statGrid: null,
	//方案combo
	statCombo: null,
	
	/**
	 * public 构建统计方案在高级查询面板中
	 */
	showCaseInQuery: function(mainNode, queryGrid) {
		var self = this;
		var fbar = queryGrid.fbar;
		
		//去掉自定义选项
		self.initStas = [['0', '--'+ jx.group.statc +'--']];
		var stas = self.initStas;
		var staid = JxUtil.newId() + '_sta';
		var stacb = Jxstar.createCombo(staid, stas, 130);
		fbar.add(stacb);
		stacb.on('beforeselect', function(combo, record){
			var val = record.get('value');
			var oldv = combo.getValue();//防止重复点击
			
			if (val != oldv && val == '1') {
				self.caseWin(mainNode);
			} else if (val != oldv && val != '0') {
				self.exeStat(mainNode, val);
			}
		});
		stacb.on('select', function(combo, record){
			combo.setValue('0');
		});
		//加载统计方案
		self.loadStaCase(mainNode, stacb);
	},
	
	/**
	 * public 构建查询方案选项控件
	 */
	showCase: function(nodeg) {
		var self = this, grid = nodeg.page;
		var tbar = grid.getBottomToolbar();
		
		var stas = self.initStas;
		var staid = JxUtil.newId() + '_sta';
		var stacb = Jxstar.createCombo(staid, stas, 130);
		if (tbar) tbar.add(stacb);
		grid.doLayout();
		
		stacb.on('beforeselect', function(combo, record){
			var val = record.get('value');
			var oldv = combo.getValue();//防止重复点击
			
			if (val != oldv && val == '1') {
				self.caseWin(nodeg);
			} else if (val != oldv && val != '0') {
				self.exeStat(nodeg, val);
			}
		});
		stacb.on('select', function(combo, record){
			combo.setValue('0');
		});
		
		//加载统计方案
		self.loadStaCase(nodeg, stacb);
	},
		
	//初始化参数
	init: function(pageNode) {
		this.funId = pageNode.nodeId;
		this.charFields = [];
		this.numFields = [];
		
		//取字段信息
		var fieldNames = [], mycols = pageNode.param.cols;
		var b = 0, c = 0;
		for (var i = 0, n = mycols.length; i < n; i++) {
			var mc = mycols[i].col, mf = mycols[i].field;
			if (mc == null || mf == null) continue;
			
			var fn = mf.name, len = fn.length;
			if (mc && mf && (fn.substring(len-2) != 'id')) {
				var h = mc.header;
				if (h.charAt(0) == '*') h = h.substr(1);
				
				var data = [mf.name, h];
				var type = mf.type;
				
				if (type == 'int' || type == 'float') {
					this.numFields[b++] = data;
				} else {
					this.charFields[c++] = data;
				}
			}
		}
		this.numFields[b] = ['recordnum', jx.group.recnum];//'记录数'
	},
	
	//构建分类字段选择区
	charFieldCt: function() {
		var self  = this;
		self.charLists = new JxLists({
			leftData:self.charFields, 
			leftHeader:jx.group.scols,//'可选分组列',
			rightHeader:jx.group.secol//'已选分组列'
		});
		return self.charLists.render();
	},
	
	//构建统计字段选择区
	numFieldCt: function() {
		var self = this;
		self.numLists = new JxLists({
			leftData:self.numFields, 
			leftHeader:jx.group.stcol,//'可选统计列',
			rightHeader:jx.group.stcols//'已选统计列'
		});
		return self.numLists.render();
	},
	
	//保存统计方案
	saveCase: function() {
		var self = this;
		self.selStatId = '';//改为每次都新增一条记录
		//选择的分组字段
		var charStore = self.charLists.getSelectStore();
		if (charStore.getCount() == 0) {
			JxHint.alert(jx.group.nofield);	//没有选择字段，不能执行分组统计！
			return;
		}
		//选择的统计字段
		var numStore = self.numLists.getSelectStore();
		if (numStore.getCount() == 0) {
			JxHint.alert(jx.group.nofield);	//没有选择字段，不能执行分组统计！
			return;
		}
		
		//保存统计方案
		var hdcall = function(text, is_share) {
			var e = encodeURIComponent;
			var chars = '', chartitles = '', nums = '', numtitles = '';
			//取分组字段
			charStore.each(function(r){
				chars += r.get('value') + ',';
				chartitles += r.get('text') + ',';
			});
			chars = chars.substr(0, chars.length-1);
			chartitles = chartitles.substr(0, chartitles.length-1);
			//取统计字段
			numStore.each(function(r){
				nums += r.get('value') + ',';
				numtitles += r.get('text') + ',';
			});
			nums = nums.substr(0, nums.length-1);
			numtitles = numtitles.substr(0, numtitles.length-1);
			
			var endcall = function(data) {
				self.statGrid.selectKeyId = data.keyid;
				var store = self.statGrid.getStore();
				store.reload();
			};
			var params = 'funid=sys_stat&statfunid=' + self.funid +'&pagetype=grid&eventcode=savecase';
				params += '&keyid=' + self.selStatId + '&statname=' + e(text) + '&chars=' + e(chars) + '&is_share=' + is_share;
				params += '&chartitles=' + e(chartitles) + '&nums=' + nums + '&numtitles=' + e(numtitles);
			Request.dataRequest(params, endcall);
		};
		
		//弹出窗口输入统计方案名称
		var isAdmin = JxUtil.isAdminUser();
		var formcfg = {
			bodyStyle:'padding:20px 0 0 20px;',
			items : [
				{xtype:'textfield', fieldLabel:jx.group.casename, name:'stat_name', value:jx.group.statc,
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
	exeStat: function(nodeg, statId) {
		if (!statId) statId = this.selStatId;
		if (Ext.isEmpty(statId)) {
			JxHint.alert(jx.group.casenos);//'当前统计方案没有保存，不能执行！'
			return;
		}
		
		if (!window.JxGroupPage) {//动态同步加载该对象
			JxUtil.loadJS('/public/layout/ux/group_page.js');
		}
		var page = JxGroupPage.createPage(statId, nodeg);
		var	win = new Ext.Window({
			title:jx.group.statc,//'统计方案',
			layout:'fit',
			width: 900,
			height: 600,
			constrainHeader: true,
			resizable: true,
			modal: true,
			closeAction: 'close',
			defaults:{margins:'5 2 5 2'},
			items:[page]
		});
		win.show();
	},
	
	/**
	 * 查询统计方案，显示到combo中
	 */
	loadStaCase: function(pageNode, combo) {
		var self = this;
		var funid = pageNode.nodeId;
		self.statCombo = combo;
		
		combo.setValue('0');
		var endcall = function(data) {
			//alert(Ext.encode(data));
			//刷新统计方案
			var qrycase = data.root;
			var qrys = []; qrys = qrys.concat(self.initStas);
			Ext.each(qrycase, function(item){
				qrys[qrys.length] = [item.sys_stat__stat_id, item.sys_stat__stat_name];
			});
			combo.getStore().loadData(qrys);
		};
		
		var where_sql = "stat_type = '0' and fun_id = ? and (is_share = ? or user_id = ?)";
		var where_value = funid+';1;'+JxDefault.getUserId();
		var where_type = 'string;string;string';
		var params = 'eventcode=query_data&funid=queryevent&pagetype=grid';
			params += '&query_funid=sys_stat&where_sql='+where_sql+'&where_value='+where_value;
			params += '&where_type='+where_type;
		Request.dataRequest(params, endcall);
	},
	
	/**
	* public 统计方案自定义界面
	* pageNode -- 当前功能的表格定义对象，用于取表格字段对象
	**/
	caseWin: function(pageNode) {
		var self = this;
		self.funid = pageNode.nodeId;
		
		//初始化字段数据
		self.init(pageNode);
		var charCt = self.charFieldCt();
		var numCt = self.numFieldCt();
		var buttons = [
				//{text:jx.group.bnew, iconCls:'eb_create', handler:self.createCase.createDelegate(self)}, //'新建'
			    {text:'保存统计', iconCls:'eb_save', handler:self.saveCase.createDelegate(self), cls:'x-btn-white'},//'保存'
				'->',
				{text:jx.group.stat, iconCls:'eb_chart', handler:self.exeStat.createDelegate(self, [pageNode])}
			];//'统计'
		
		//分类字段与统计字段选择界面
		var	selpanel = new Ext.Panel({
			layout:'border',
			items:[{
				xtype:'container',
				region:'north',
				layout:'fit',
				height:300,
				items:[charCt]
			},{
				xtype:'container',
				region:'center',
				layout:'fit',
				style:'border-top:1px solid #f2f2f2;',
				items:[numCt]
			}],
			
			buttonCls: '',
			buttonAlign: 'left',
			buttons: buttons
		});
		
		var	win = new Ext.Window({
			title:jx.group.statcc,//'统计方案自定义...',
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
				where_sql:"fun_id = ? and (is_share = '1' or user_id = ?)", 
				where_value:self.funid+';'+JxDefault.getUserId(), 
				where_type:'string;string'
			};
			Jxstar.loadData(mg, options);
		};
		//构建表格对象
		Jxstar.createPage('sys_stat', 'gridpage', win.getComponent(0), {pageType:'notool',showCall:hdcall});
		
		win.on('destroy', function() {
			self.loadStaCase(pageNode, self.statCombo);
			
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
	
	//新建方案，把选择的值都移到左边
	createCase: function() {
		var self = this;
		var cls = self.charLists, nls = self.numLists;
		//清空方案ID
		self.selStatId = '';
		//左移分组字段
		var store = cls.lsRight.getStore();
		var records = store.getRange(0, store.getCount());
		cls.lsLeft.getStore().add(records);
		store.removeAll();
		//左移统计字段
		store = nls.lsRight.getStore();
		records = store.getRange(0, store.getCount());
		nls.lsLeft.getStore().add(records);
		store.removeAll();
	},
	
	//点击左边的方案时，加载右边的明细
	clickCase: function(statId) {
		var self = this;
		//先清除统计字段
		self.createCase();
		//保存当前方案ID
		self.selStatId = statId;
		//再从后台加载方案字段
		var endcall = function(data) {
			//alert(Ext.encode(data));
			var chars = data.chars;
			var nums = data.nums;
			//右移分组字段
			var cls = self.charLists, nls = self.numLists;
			for (var i = 0, n = chars.length; i < n; i++) {
				self.leftToRight(chars[i].colcode, cls.lsLeft, cls.lsRight);
			}
			//右移统计字段
			for (var i = 0, n = nums.length; i < n; i++) {
				self.leftToRight(nums[i].colcode, nls.lsLeft, nls.lsRight);
			}
		};
		var params = 'funid=sys_stat&pagetype=grid&eventcode=selcase&keyid=' + statId;
		Request.dataRequest(params, endcall);
	},
	
	//选择字段从左边移到右边
	leftToRight: function(value, left, right) {
		var ls = left.getStore(), rs = right.getStore();
		var index = ls.find('value', value);
		if (index > -1) {
			var rec = ls.getAt(index);
			rs.add(rec);
			ls.removeAt(index);
		}
	}

	});//Ext.apply

})();
