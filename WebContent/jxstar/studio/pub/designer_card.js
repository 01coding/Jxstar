/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

JxLabelDes = {
	//当前方案id
	caseId: '',
	//档案设计器面板
	designCt: null,
	//画布容器
	canvaCt: null,
	//标记当前选择的控件
	currCtl: null,
	//当前模板ID
	currModelId: '',
	//当前模板信息
	currRec: null,
	//约定1mm = 3.779527px ; 1in = 2.54cm = 25.4mm = 72pt = 96px 
	PN: 3.779527,
	//显示的打印插件
	LODOP_SHOW: null,

	/**
	* 创建页面对象，布局：标签模板列表 + 设计器 + 字段列表 + 属性列表
	* 
	* caseId：方案ID
	* target：功能对象显示的布局
	*/
	showDesign: function(caseId, target) {
		var me = this;
		//加插件对象
		if (typeof getLodop == 'undefined') {
			JxUtil.loadJS('/report/html/LodopFuncs.js', true);
		}
		//插件未安装
		if (!getLodop()) return;
		
		if (typeof JxLabPrint == 'undefined') {
			JxUtil.loadJS('/public/layout/ux/lab_print.js', true);
		}
		this.caseId = caseId;
		
		var tbar = me.createTool();
		var designCt = new Ext.Panel({
			border:false,
			layout:'border',
			items:[{
				width:140,
				title:jx.bus.text15,//'挑选字段、模板',
				border:false,
				region:'west',
				layout:'border',
				items:[{//显示标签字段
					region:'center',
					layout:'fit',
					border:false
				},{//显示打印模板列表
					region:'south',
					height:250,
					layout:'fit',
					border:false
				}]
			},{//显示标签设计器
				region:'center',
				layout:'fit',
				border:false,
				tbar:tbar,
				html:'<object id="LODOP2" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width="100%" height="100%"> '+
					   '<param name="Caption" value="'+ jx.bus.text16 +'"> '+//内嵌显示区域
					   '<param name="Border" value="1"> '+
					   '<param name="Color" value="#E0E0E0"> '+
					   '<embed id="LODOP_EM2" TYPE="application/x-print-lodop" width="100%" height="100%" color="#E0E0E0"></embed> '+
					 '</object> '
			},{
				region:'east',
				width:40,
				border:false,
				layout: {
					type:'vbox',
					padding:'1',
					align:'stretch'
				},
				cls:'dc_tool',
				bodyStyle:'background-color:#333;',
				defaults:{margins:'5 0 5 0', height:28},
				items:[{
					xtype:'button',
					iconCls:'ctl_txt',
					tooltip:jx.bus.text17,//'文本',
					handler:function(){
						me.LODOP_SHOW.ADD_PRINT_TEXT(20,2,80,22,jx.bus.text17);//'示列文本'
					}
				},{
					xtype:'button',
					iconCls:'ctl_barcode',
					tooltip:jx.bus.text18,//'条码',
					handler:function(){
						me.LODOP_SHOW.ADD_PRINT_BARCODE(30,2,150,60,'128A','123456789012');
					}
				},{
					xtype:'button',
					iconCls:'ctl_rect',
					tooltip:jx.bus.text19,//'矩形',
					handler:function(){
						me.LODOP_SHOW.ADD_PRINT_RECT(30,2,100,60,0,1);
					}
				},{
					xtype:'button',
					iconCls:'ctl_block',
					tooltip:jx.bus.text20,//'实心框',
					handler:function(){
						me.LODOP_SHOW.ADD_PRINT_SHAPE(4,30,2,100,80,0,1,"#000000");
					}
				},{
					xtype:'button',
					iconCls:'ctl_ellipse',
					tooltip:jx.bus.text21,//'椭圆',
					handler:function(){
						me.LODOP_SHOW.ADD_PRINT_ELLIPSE(30,2,100,60,0,1);
					}
				},{
					xtype:'button',
					iconCls:'ctl_line',
					tooltip:jx.bus.text22,//'线条',
					handler:function(){
						me.LODOP_SHOW.ADD_PRINT_SHAPE(4,30,2,120,5,0,1,"#000000");
					}
				},{
					xtype:'button',
					iconCls:'ctl_image',
					tooltip:jx.bus.text23,//'图片',
					handler:function(){
						me.LODOP_SHOW.ADD_PRINT_IMAGE(30,2,62,47,"<img src='resources/images/logo.png'/>");
					}
				},{
					xtype:'button',
					iconCls:'ctl_pdf',
					tooltip:'PDF 417',
					handler:function(){
						me.LODOP_SHOW.ADD_PRINT_BARCODE(30,2,150,60,'PDF417','123456789012');
					}
				},{
					xtype:'button',
					scale:'medium',
					iconCls:'ctl_qr',
					tooltip:'QR Code',
					handler:function(){
						me.LODOP_SHOW.ADD_PRINT_BARCODE(30,2,80,80,'QRCode','123456789012');
					}
				}]
			}]
		});
		
		me.canvaCt = designCt.getComponent(1);
		
		var desgrid = designCt.getComponent(0);
		Jxstar.createPage('lab_field1', 'gridpage', desgrid.getComponent(0), {pageType:'notool'});
		Jxstar.createPage('lab_model1', 'gridpage', desgrid.getComponent(1), {pageType:'notool'});
				
		var tabid = 'jxstar_label_design';
		var tab = target.getComponent(tabid);
		if (tab) target.remove(tab, true);
			
		var cfg = {
			id:tabid,
			title:jx.bus.text24,//'标签设计器',
			layout:'fit',
			border:false,
			closable:true,
			autoScroll:true,
			iconCls:'tab_des',
			items:[designCt]
		};
		tab = target.add(cfg);
		target.activate(tab);
		
		//模板、字段加载数据
		var hd = function() {
			var gridm = desgrid.getComponent(1).getComponent(0);
			var gridf = desgrid.getComponent(0).getComponent(0);
			
			Jxstar.loadSubData(gridm, caseId);
			Jxstar.loadSubData(gridf, caseId);
					
			//点击模板记录，加载最新的设计文件
			gridm.on('rowclick', function(g, n, e){
				var rec = g.getStore().getAt(n);
				var modelId = rec.get('lab_model__model_id');
				me.currModelId = modelId;
				me.currRec = rec;
				me.readXML(modelId, rec);
			});
			
			//双击字段，添加字段标签到设计器中
			gridf.on('rowdblclick', function(g, n, e){
				var rec = g.getStore().getAt(n);
				me.addFieldLabel(rec);
			});
			
			gridm.getStore().on('load', function(){
				gridm.getSelectionModel().selectFirstRow();
				gridm.fireEvent('rowclick', gridm, 0);
			});
			
			//切换到设计器界面，重新加载设计文件
			target.on('tabchange', function(tab, activeTab){
				//先关闭预览界面
				var preid = 'jxstar_label_preview';
				if (activeTab.getId() != preid) {
					var tab = Ext.getCmp(preid);
					if (tab) target.remove(tab, true);
				}
				var codeid = 'jxstar_label_codes';
				if (activeTab.getId() != codeid) {
					var tab = Ext.getCmp(codeid);
					if (tab) target.remove(tab, true);
				}
				if (activeTab.getId() == tabid) {
					//IE中不需要刷新
					//if (Ext.isIE) return;
					var records = JxUtil.getSelectRows(gridm);
					if (records.length == 0) return;
					var index = gridm.getStore().indexOf(records[0]);
					if (index >= 0) {
						gridm.fireEvent('rowclick', gridm, index);
					}
				}
			});
			
			//获取显示的打印插件
			me.LODOP_SHOW = getLodop(document.getElementById('LODOP2'),document.getElementById('LODOP_EM2'));
		};
		//保证附加事件成功
		var callhd = function() {
			var gm = desgrid.getComponent(0).getComponent(0);
			if (gm) {
				hd();
			} else {
				JxUtil.delay(200, callhd);
			}
		};
		callhd();
		
		me.designCt = designCt;
	},
	
	//创建工具栏
	createTool: function() {
		var me = this;
		var tbar = new Ext.Toolbar({
			//height:28,
			items:[
				{iconCls:'eb_save', text:jx.bus.text25, handler:function(){//'保存设计'
					if (Ext.isEmpty(me.currModelId)) {
						JxHint.alert(jx.bus.text14);//请先创建或选择标签打印模板！
						return;
					}
					var codes = me.LODOP_SHOW.GET_VALUE('ProgramCodes', 0);
					var config = {
						lab_width:me.LODOP_SHOW.GET_VALUE('PrintInitWidth', 0), 
						lab_height:me.LODOP_SHOW.GET_VALUE('PrintInitHeight', 0)
					};
					me.saveXML(me.currModelId, codes, config);
				}},
				'-',
				{iconCls:'tab_form', text:jx.bus.text26, handler:function(){//'预览效果'
					if (Ext.isEmpty(me.currModelId)) {
						JxHint.alert(jx.bus.text14);//请先创建或选择标签打印模板！
						return;
					}
					var target = me.designCt.findParentByType('tabpanel');
					var codes = me.LODOP_SHOW.GET_VALUE('ProgramCodes', 0);
					//构建多排预览代码
					var param = {
						lab_width:	me.currRec.get('lab_model__lab_width'),
						lab_height:	me.currRec.get('lab_model__lab_height'),
						colnum:		me.currRec.get('lab_model__colnum'),
						coljx:		me.currRec.get('lab_model__coljx'),
						title:		me.currRec.get('lab_model__model_name'),
						lab_top: 	me.currRec.get('lab_model__lab_top'),
						lab_left: 	me.currRec.get('lab_model__lab_left')
					};
					codes = JxLabPrint.preCodes(codes, param);
					me.showPreView(codes, target);
				}},
				'-',
				{iconCls:'eb_script', text:jx.bus.text27, handler:function(){//'修改源码'
					var target = me.designCt.findParentByType('tabpanel');
					me.showXML(me.currModelId, target);
				}}
			]
		});
		return tbar;
	},
	
	//显示预览界面
	showPreView: function(codes, target) {
		var me = this;
		
		var tabid = 'jxstar_label_preview';
		var tab = Ext.getCmp(tabid);
		if (tab) tab.ownerCt.remove(tab, true);
		
		var cfg = {
			id:tabid,
			title:'标签预览(6条内)',
			layout:'fit',
			border:false,
			closable:true,
			autoScroll:true,
			iconCls:'tab_des',
			items:[{
				region:'center',
				layout:'fit',
				border:false,
				html:'<object id="LODOP_X" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=100% height="100%"> '+
						'<param name="Caption" value="正在加载打印内容..."> '+
						'<param name="Color" value="#E0E0E0"> '+
						'<embed id="LODOP_EMX" TYPE="application/x-print-lodop" width="100%" height="100%" color="#E0E0E0"></embed>'+
					 '</object> '

			}]
		};
		var tab = target.add(cfg);
		target.activate(tab);
		
		//获取预览对象
		var LODOP = getLodop(document.getElementById('LODOP_X'),document.getElementById('LODOP_EMX'));
		window.LODOP = LODOP;
		
		JxUtil.eval(codes);
		LODOP.SET_SHOW_MODE("HIDE_QBUTTIN_PREVIEW",true);//隐藏预览窗口的关闭按钮
		//LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW",true);//隐藏预览窗口的打印按钮
		//LODOP.SET_SHOW_MODE("HIDE_SBUTTIN_PREVIEW",true);//隐藏预览窗口的设置按钮
		LODOP.SET_SHOW_MODE("HIDE_PAPER_BOARD",true);//隐藏走纸板 
		//LODOP.SET_PREVIEW_WINDOW(1,3,0,0,0,""); //正常显示，隐藏工具条
		LODOP.SET_SHOW_MODE("PREVIEW_IN_BROWSE",true); //预览界面内嵌到页面内
		LODOP.PREVIEW();
		window.LODOP = null;
	},
	
	//打印插件显示为设计模式
	designLodop: function() {
		var LODOP = this.LODOP_SHOW;
		LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE",1);
		LODOP.SET_SHOW_MODE("SETUP_ENABLESS","11111111000000");//隐藏关闭(叉)按钮
		LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_SETUP",true);//隐藏打印维护及设计窗口的打印按钮
		LODOP.SET_SHOW_MODE("HIDE_VBUTTIN_SETUP",true);//隐藏打印维护及设计窗口的预览按钮
		LODOP.SET_SHOW_MODE("HIDE_ABUTTIN_SETUP",true);//隐藏打印维护及设计窗口的应用（暂存）按钮
		LODOP.SET_SHOW_MODE("HIDE_RBUTTIN_SETUP",true);//隐藏打印维护及设计窗口的复原按钮

		LODOP.SET_SHOW_MODE("TEXT_SHOW_BORDER",2);//无效，文本对象的边框效果：0 - 3D效果, 1 - 单线(single), 2 - 无边框(none)
		LODOP.SET_SHOW_MODE("SHOW_SCALEBAR",1);//无效，显示标尺
		LODOP.SET_SHOW_MODE("HIDE_GROUND_LOCK",false);//隐藏纸钉按钮
		LODOP.PRINT_DESIGN();
	},
	
	//读取设计信息
	readXML: function(modelId, record) {
		var me = this;
		var hdcall = function(data) {
			if (Ext.isEmpty(data)) {
				me.readInitXML(record);
				return;
			}
			
			var codes = data.setxml;
			if (Ext.isEmpty(codes)) {
				me.readInitXML(record);
			} else {
				window.LODOP = me.LODOP_SHOW;
				JxUtil.eval(codes);
				me.designLodop();
			}
		};
		
		var params = 'funid=lab_case&eventcode=readxml&modelid='+modelId;
		Request.postRequest(params, hdcall);
	},
	
	//构建初始化的设计信息
	readInitXML: function(record) {
		var title = record.get('lab_model__model_name') || jx.bus.text28;//'无标题'
		var width = record.get('lab_model__lab_width') || 80;
		var height = record.get('lab_model__lab_height') || 40;
		var top = record.get('lab_model__lab_top') || 0;
		var left = record.get('lab_model__lab_left') || 0;
		
		var me = this;
		//构建页面内容
		me.LODOP_SHOW.PRINT_INITA(top+'mm',left+'mm',width+'mm',height+'mm',title);
		me.designLodop();
	},
	
	//添加字段标签，含label、field
	addFieldLabel: function(record) {
		var label = record.get('lab_field__field_title');
		var field = record.get('lab_field__field_code');
		field = '['+field+']';
		var LODOP = this.LODOP_SHOW;
		
		LODOP.ADD_PRINT_TEXT(20,2,80,22,label);
		LODOP.ADD_PRINT_TEXTA(field, 20,84,80,22,field);
	},
	
	//保存设计文件
	//config:{width:xx, height:xx}
	saveXML: function(modelId, codes, config, hd) {
		var me = this;
		//替换图片、html中的特殊字符
		codes = codes.replace(/'/ig, '\\"');
		//取编辑区的宽、高
		var width = config.lab_width||'';
		var height = config.lab_height||'';
		if (width.length > 0) {
			//四舍五入，取整
			width = Math.round(parseFloat(width.substr(1, width.length-3)));
			height = Math.round(parseFloat(height.substr(1, height.length-3)));
			
			//存入记录对象
			me.currRec.set('lab_model__lab_width', width);
			me.currRec.set('lab_model__lab_height', height);
		}
		var e = encodeURIComponent; //编码, 处理isHexDigit异常
		var params = 'funid=lab_case&eventcode=savexml&modelid='+modelId;
			params += '&setxml='+ e(codes) +'&colxml=&pagexml=&width='+width+'&height='+height;

		//发送请求保存设计文件到数据库中
		Request.postRequest(params, hd);
	},
	
	//显示源码，可以修改
	showXML: function(modelId, target) {
		var me = this;
		var codes = me.LODOP_SHOW.GET_VALUE('ProgramCodes', 0);
		var config = {
			lab_width:me.LODOP_SHOW.GET_VALUE('PrintInitWidth', 0), 
			lab_height:me.LODOP_SHOW.GET_VALUE('PrintInitHeight', 0)
		};
		
		var tabid = 'jxstar_label_codes';
		var tab = Ext.getCmp(tabid);
		if (tab) target.remove(tab, true);
		
		var tbar = new Ext.Toolbar({
			items:[
				{iconCls:'eb_save', text:jx.bus.text29, handler:function(){//'保存'
					var field = tab.getComponent(0);
					var codes = field.getValue();
					if (codes.indexOf('\r\n') < 0) {
						//换行符 --> 回车换行符
						codes = codes.replace(/\n/ig, '\r\n');
					}
					//保存新的代码到后台
					me.saveXML(modelId, codes, config, function(){
						//关闭页面
						target.remove(tab, true);
						//切换到design页面后重新加载设计源码
					});
				}},
				{iconCls:'eb_undo', text:jx.bus.text30, handler:function(){//'恢复'
					var field = tab.getComponent(0);
					field.setValue(field.originalValue);
				}}
			]
		});
		
		var cfg = {
			id:tabid,
			title:jx.bus.text31,//'设计源码',
			tbar:tbar,
			border:false,
			closable:true,
			autoScroll:true,
			iconCls:'tab_des',
			bodyStyle:'background-color:#E0E0E0;',
			items:[{
				xtype:'textarea',
				selectOnFocus:false,
				value:codes,
				width:800,
				height:400
			}]
		};
		tab = target.add(cfg);
		target.activate(tab);
	}
};