/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 导出数据窗口控件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

JxExport = {};
(function(){

	Ext.apply(JxExport, {
		funId: '',
		charFields: [],
		charLists: null,
	    //方案表格
	    statGrid: null,
	/**
	* 显示导出数据的字段对话框
	* pageNode -- 当前功能的表格定义对象，用于取表格字段对象
	**/
	showWindow: function(pageNode) {
		var self = this;
		self.funid = pageNode.nodeId;
		self.charFields = [];
		
		var colm = pageNode.page.getColumnModel();
		//取字段信息
		var mycols = colm.config;
		for (var i = 0, c = 0, n = mycols.length; i < n; i++) {
			var col = mycols[i], fn = col.dataIndex;
			if (fn && fn.length > 0) {
				var h = col.header;
				if (h.charAt(0) == '*') h = h.substr(1);
				this.charFields[c++] = [fn, h];
			}
		}

		var charCt = self.charFieldCt();
		
		var buttons = [
			{text:'保存方案', iconCls:'eb_save', handler:self.saveCase.createDelegate(self), cls:'x-btn-white'},
			'->',
			{
				text:jx.base.ok,	//确定
				handler:function(){
					var selfields = self.charLists.getSelectData();
					if (selfields.length == 0) {
						JxHint.alert(jx.base.nofield);	//没有选择要导出数据的字段，不能导出！
						return false;
					}
		
					JxExport.executeExp(pageNode, selfields);
					win.close();
				}
			}
			
		];
		
		var	selPanel = new Ext.Panel({
			layout:'border',
			items:[{
				xtype:'container',
				region:'center',
				layout:'fit',
				style:'border-top:1px solid #f2f2f2;',
				items:[charCt]
			}],
			
			buttonCls: '',
			buttonAlign: 'left',
			buttons: buttons
		});
		
		//创建对话框
		var win = new Ext.Window({
			title:jx.base.seltitle,	//选择导出字段
			layout:'border',
			width:600,
			height:500,
			resizable: false,
			modal: true,
			closeAction:'close',
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
				items:[selPanel]
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
		Jxstar.createPage('sys_export', 'gridpage', win.getComponent(0), {pageType:'notool', showCall:hdcall});
		
		win.on('destroy', function() {
			if (self.statGrid != null) self.statGrid.destroy();
			self.funId = '';
			self.charFields = null;
			self.numFields = null;
			self.charLists = null;
			self.numLists = null;
			self.statGrid = null;
		});
		win.show();
	},
	
	//新建方案，把选择的值都移到左边
	createCase: function() {
		var self = this;
		var cls = self.charLists;
		//左移分组字段
		var store = cls.lsRight.getStore();
		var records = store.getRange(0, store.getCount());
		cls.lsLeft.getStore().add(records);
		store.removeAll();
	},
	
	//点击左边的方案时，加载右边的明细
	clickCase: function(statId) {
		var self = this;
		//先清除另存字段
		self.createCase();
		//再从后台加载方案字段
		var endcall = function(data) {
			//alert(Ext.encode(data));
			var chars = data.chars;
			var nums = data.nums;
			//右移分组字段
			var cls = self.charLists;
			for (var i = 0, n = chars.length; i < n; i++) {
				self.leftToRight(chars[i].colcode, cls.lsLeft, cls.lsRight);
			}
		};
		var params = 'funid=sys_export&pagetype=grid&eventcode=selcase&keyid=' + statId;
		Request.dataRequest(params, endcall);
	},
	
	//构建分类字段选择区
	charFieldCt: function() {
		var self  = this;
		self.charLists = new JxLists({
			leftData:self.charFields, 
			leftHeader:'可选导出字段',
			rightHeader:'已选导出字段'
		});
		return self.charLists.render();
	},
	
	//选择字段从左边移到右边
	leftToRight: function(value, left, right) {
		var ls = left.getStore(), rs = right.getStore();
		//精确匹配字段名
		var index = ls.findBy(function(rec){
			return (rec.get('value') == value);
		});
		if (index > -1) {
			var rec = ls.getAt(index);
			rs.add(rec);
			ls.removeAt(index);
		}
	},
		
	//保存方案
	saveCase: function() {
		var self = this;
		//选择的分组字段
		var charStore = self.charLists.getSelectStore();
		if (charStore.getCount() == 0) {
			JxHint.alert('没有选择字段');
			return;
		}
		
		//保存另存方案
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
			
			var endcall = function(data) {
				self.statGrid.selectKeyId = data.keyid;
				var store = self.statGrid.getStore();
				store.reload();
			};
			var params = 'funid=sys_export&statfunid=' + self.funid +'&pagetype=grid&eventcode=savecase';
				params += '&keyid=&statname=' + e(text) + '&chars=' + e(chars) + '&is_share=' + is_share;
				params += '&chartitles=' + e(chartitles) + '&nums=' + nums + '&numtitles=' + e(numtitles) + '&stat_type= 1';
			Request.dataRequest(params, endcall);
		};
		
		//弹出窗口输入另存方案名称
		var isAdmin = JxUtil.isAdminUser();
		var formcfg = {
			bodyStyle:'padding:20px 0 0 20px;',
			items : [
				{xtype:'textfield', fieldLabel:'方案名称', name:'stat_name', value:'方案1',
					allowBlank:false, labelSeparator:'*', labelStyle:'color:#0077FF;', maxLength:50},
				{xtype:'checkbox', hidden:!isAdmin, fieldLabel:jx.query.share, name:'is_share'}		//'是否共享?'
			]
		};
		var wincfg = { width : 400,  height : 200 };
		var okcall = function(form, win){
			var text = form.get('stat_name');
			if (text.length == 0) {
				JxHint.alert('必须填写方案名称');
				return false;
			}
			var is_share = form.get('is_share');
			hdcall(text, is_share);
			win.close();
		};
		JxUtil.formWindow({formcfg:formcfg, wincfg:wincfg, okcall:okcall});
	},
	
	/**
	* 向后台发出导出数据请求
	* pageNode -- 当前功能的表格定义对象，用于取表格字段对象
	* selfields -- 选择字段的数据
	**/
	executeExp: function(pageNode, selfields) {
		var st = pageNode.page.getStore();
		var dsOption = st.lastOptions.params || {};
		var funid = pageNode.nodeId;
		
		//请求参数
		var params = 'funid=sysevent&query_funid='+ funid;
		params += '&pagetype=grid&eventcode=expxls&dataType=xls';
		params += '&selfield='+selfields+'&zerotonull=0';
		if(st.sortInfo && st.remoteSort){//添加当前排序字段
			params += '&sort='+st.sortInfo.field+'&dir='+st.sortInfo.direction;
		}
		//导出xls文件
		Request.expFile(params, dsOption);
	}

	});//Ext.apply

})();
