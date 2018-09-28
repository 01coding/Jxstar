/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 自定义首页Portlet栏目位置与大小的工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2013-03-07
 */

JxPortalExt = {};
(function(){

	Ext.apply(JxPortalExt, {
	
	//是否首页模版应用
	IS_TEMPLET: true,
	
	//默认[plet_templet]首页模版使用，也用于统计图表设计[total_chart]
	funId: 'plet_templet',
	
	/**
	 * private
	 * x, y轴坐标的步长
	 **/
	XINC: 10,
	YINC: 10,
	
	/**
	 * private
	 * 保存portal内容对象，在init方法初始化
	 **/
	contentTypes: {},
	
	/**
	 * private
	 * portel栏目上的小按钮
	 **/
	getTools: function(){
		var me = this;
		var tools = [{
				id:'refresh',
				handler: function(e, btn, panel){
					//取portlet类型代号
					var typecode = panel.initialConfig.typecode;
					//取对应的内容解析对象
					var content = me.contentTypes[typecode];
					if (content == null) {
						JxHint.alert(String.format(jx.port.noport, typecode));	//'JxPortal对象中没有定义['+ typecode +']类型的解析对象！'
						return false;
					}

					content.refresh(panel);
				}
			},{
				id:'close',
				handler: function(e, btn, panel){
					panel.ownerCt.remove(panel, true);
				}
			}];
		return tools;
	},
	
	/**
	 * public
	 * 外部演示用时直接显示指定的首页
	 **/
	showOnePortal: function(target, templetid) {
		var me = this;
		var hdcall = function(data) {
			target.runstate = '1';//标记为运行状态，控件不可移动
			target.settype = '1';
			target.templetid = data.templet_id;
			
			var portal = me.createPortal(data.items, '1');
			target.add(portal);
			target.doLayout();
			
			//处理每列显示内容
			var cnt = portal.items.length;
			for (var j = 0; j < cnt; j++) {
				var cell = portal.items.get(j);
				
				var typecode = cell.initialConfig.typecode;
				//取对应的内容解析对象
				var content = me.contentTypes[typecode];
				if (content == null) continue;
				//显示内容，showPortlet是公共方法
				content.showPortlet(cell);
			}
		};
		var params = 'funid='+ me.funId +'&pagetype=editgrid&eventcode=readone&templetid='+templetid;
		Request.dataRequest(params, hdcall);
	},

	/**
	 * public
	 * 从系统中取portal配置，构建后显示在target中
	 * config json = [{funid:'', x:10, y:10, width:100, height:100, collapsed:false},{}...]
	 **/
	createPortals: function(target) {
		var me = this;
		//重新加载portal时，关闭所有的定时任务
		Ext.TaskMgr.stopAll();
		
		var hdcall = function(datas) {
			if (Ext.isEmpty(datas)) {
				JxHint.alert(jx.util.pletnsp);//没有设置portal模板！
				return;
			}
			
			me.parsePortal(datas, target);
			
			//开始加重portel中的内容
			var pnum = target.portals.length;
			
			//处理每个portal
			for (var i = 0; i < pnum; i++) {
				var portal = target.portals[i];
				
				//处理每列
				var cnt = portal.items.length;
				for (var j = 0; j < cnt; j++) {
					var cell = portal.items.get(j);
					
					var typecode = cell.initialConfig.typecode;
					//取对应的内容解析对象
					var content = me.contentTypes[typecode];
					if (content == null) continue;
					//显示内容，showPortlet是公共方法
					content.showPortlet(cell);
				}
			}
		};
		
		var params = 'funid='+ me.funId +'&pagetype=editgrid&eventcode=readtemp';
		Request.dataRequest(params, hdcall);
	},
	
	/**
	 * private 创建portal对象
	 * portalnum -- 首页模板的数量，如果有多个模板，需要用tabpanel控件
	 * portals -- 模板信息数组，单个模板数据的参数有：
	 *			templet_id -- 模板id
	 *			templet_name -- 模板标题
	 *			items -- portels栏目内容数组，参数有：id, title, iconCls, height, typecode, objectid
	 **/
    parsePortal: function(json, target) {
		var me = this;
		//模板数量
		var cnt = parseInt(json.portalnum);
		
		if (!target.portals) target.portals = [];
		
		//如果有多个首页模板，需要创建tabpanel
		if (cnt > 1) {
			var tabitems = [cnt];
			for (var i = 0; i < cnt; i++) {
				var data = json.portals[i];
				var portal = me.createPortal(data.items, '1');
				tabitems[i] = {
					runstate:'1',//标记当前是运行状态，控件不可以拖拽
					settype:'1',
					templetid:data.templet_id,
					
					title:data.templet_name,
					autoScroll:true,
					layout:'fit',
					iconCls:'function',
					items:portal
				};
				
				target.portals[i] = portal;
			}
			//创建tabpanel
			var tab = new Ext.TabPanel({
				id:'sys_portal_tab',
				region:'center',
				closeAction:'close',
				activeTab:0,
				deferredRender:false,//避免第二tab没创建，不能显示图表
				items:tabitems
			});
			tab.on('tabchange', function(tab, tb){
				me.addMenu(tb);//第二个tab需要重绑定菜单
			});
			
			target.add(tab);
			target.doLayout();
		} else {
			var data = json.portals[0];
			target.runstate = '1';//标记当前是运行状态，控件不可以拖拽
			target.settype = '1';
			target.templetid = data.templet_id;
			
			var portal = me.createPortal(data.items, '1');
			target.portals[0] = portal;
			
			target.add(portal);
			target.doLayout();
		}
	},
	
	//runstate -- 0 设置状态、1 运行状态
	newCell: function(item, runstate) {
		var me = this;
		var ts = me.getTools();
		//栏目信息，portels栏目内容，参数有：id, title, iconCls, height, typecode, objectid
		var title = JxLang.otherText('portaltitle', 'plet__'+item.id, item.title);
		return {
			x: parseInt(item.x||me.XINC),
			y: parseInt(item.y||me.YINC),
			width: parseInt(item.width||250),
			height: parseInt(item.height||180),
			frame:false,
			border:false,
			collapsible:false,
			baseCls:'xpt-panel',
			cls:'x-portlet shadow',//设置portlet样式 shadow
			
			title: title,
			iconCls: item.iconCls,
			layout: 'fit',
			autoScroll:true,
			tools: (runstate == '1') ? [ts[0]] : [ts[1]],
			collapsed: (item.collapse == '1'),
			pletid: item.id,			//portletid，后台需要的参数
			typecode: item.typecode,	//portlet类型的编码，后台需要的参数
			objectid: item.objectid		//结果集与KPI类型的需要用objectid找具体的实例对象
		};
	},
	
	/**
	 * 创建模板明细对象
	 * runstate -- 0 设置状态、1 运行状态
	 **/
	createPortal: function(config, runstate) {
		var me = this;
		var cell = [];

		var n = 0;
		Ext.each(config, function(item){
			cell[cell.length] = me.newCell(item, runstate);
			//加偏移量方便看到新增的多个cell
			if (runstate == '0' && !item.x) {
				cell[n].x = parseInt(cell[n].x) + 20*n;
				cell[n].y = parseInt(cell[n].y) + 30*n;
				n++;
			}
		});
		
		var portal = new Ext.Panel({
			layout:'absolute', 
			autoScroll:true,
			border: false,
			cls: 'x-portal-bg',
			items:cell
		});
		
		JxUtil.delay(100, function(){
			var ct = portal.ownerCt;
			//首页设置在运行时还可配置
			if (me.IS_TEMPLET || runstate == '0') me.addMenu(ct);
			
			if (runstate != '1') {//运行状态不能拖拽
				portal.items.each(function(item){
					me.draggable(item);
				});
			}
		});
		
		return portal;
	},
	
	//添加右键菜单
	addMenu: function(target) {
		if (target.hasMenu || !target.el) return;
		
		var me = this;
		var settype = target.settype || '1';//模板类型
		var runstate = target.runstate;//运行状态不能拖拽
		
		var items = [];
		if (settype == '1') {
			if (runstate == '1') {
				if (me.IS_TEMPLET) {
					items[0] = {text:jx.cloud.text21, handler:function(){me.readTemp('custtemp', target.templetid, '1');}};//'设置模板'
				}
			} else {
				items[0] = {text:jx.cloud.text22, handler:function(){me.saveTemp(target);}};//'保存设置'
				items[1] = {text:jx.cloud.text23, handler:function(){me.defTemp(target);}};//'恢复设置'
				items[2] = {text:jx.cloud.text24, handler:function() {me.addTemp(target);}};//'添加控件'
				items[3] = {text:jx.cloud.text25, handler:function() {me.updateTemp(target);}};//'更新设置'
			}
		} else {
			items[0] = {text:jx.cloud.text22, handler:function() {me.saveTemp(target);}};
			items[1] = {text:jx.cloud.text24, handler:function() {me.addTemp(target);}};
			items[2] = {text:jx.cloud.text25, handler:function() {me.updateTemp(target);}};
		}
		
		target.el.on('contextmenu', function (e, t, o) {
			var menu = new Ext.menu.Menu({items:items});
			menu.showAt(e.getXY());	
		});
		
		//标记已经添加了右键菜单
		target.hasMenu = true;
	},
	
	/**
	 * 添加新控件，已经有的portlet不添加到页面上了
	 **/
	addTemp: function(target) {
		var me = this;
		var ct = target.items.get(0);
		//取已有portlet
		var getids = function(ct) {
			var ids = {};
			ct.items.each(function(item){
				ids[item.pletid] = '1';
			});
			return ids;
		};
		
		var hdcall = function(data) {
			if (Ext.isEmpty(data)) return;
			//添加新的对象
			var cells = [];
			var ids = getids(ct), newids = {};
			var n = 0;
			Ext.each(data, function(item){
				if (!ids[item.id]) {
					cells[cells.length] = me.newCell(item, '0');
					newids[item.id] = '1';
					//加偏移量方便看到新增的多个cell
					if ( !item.x ) {
						cells[n].x = parseInt(cells[n].x) + 20*n;
						cells[n].y = parseInt(cells[n].y) + 30*n; 
						n++;
					}
				}
			});
			
			ct.add(cells);
			ct.doLayout();
			
			//给新控件实现拖拽
			ct.items.each(function(item){
				var id = item.initialConfig.pletid;
				if (newids[id]) {
					me.draggable(item);
				}
			});
		};
		
		var params = 'funid='+ me.funId +'&pagetype=editgrid&eventcode=addtemp&templetid=' + target.templetid;
		Request.postRequest(params, hdcall);
	},
	
	/**
	 * 保存模板排版设置
	 **/
	saveTemp: function(target) {
		var me = this;
		var parent = target.items.get(0);
		var items = parent.items;
		var cnt = items.getCount();
		var config = [cnt];
		if (cnt == 0) return;
		
		//保存时要减去父对象的坐标
		var pxy = parent.getPosition(true);
		//构建每列中的内容
		for (var i = 0; i < cnt; i++) {
			var item = items.get(i);
			//栏目信息，portels栏目内容，参数有：id, title, iconCls, height, typecode, objectid
			var pos = item.getPosition(true);//添加参数true，解决在有滚动条时位置不准的问题
			
			config[i] = {
				x: pos[0]-pxy[0],
				y: pos[1]-pxy[1],
				width: item.getWidth(),
				height: item.getHeight(),
				
				title: item.title,
				iconCls: item.iconCls,
                collapse: (item.collapsed ? '1' :'0'),
				id: item.pletid,			//portletid，后台需要的参数
                typecode: item.typecode,	//portlet类型的编码，后台需要的参数
				objectid: item.objectid		//结果集与KPI类型的需要用objectid找具体的实例对象
			};
		}
		
		var json = Ext.encode(config);
		var e = encodeURIComponent;
		var settype = target.settype || '1';//模板类型
		
		var params = 'funid='+ me.funId +'&pagetype=editgrid&eventcode=savetemp';
			params += '&templetid=' + target.templetid + '&settype='+ settype +'&config=' + e(json);
		
		Request.postRequest(params);
	},
	
	/**
	 * 恢复模板排版设置
	 **/
	defTemp: function(target) {
		var me = this;
		var hdcall = function(data) {
			if (Ext.isEmpty(data)) return;
			//删除所有子段对象
			target.removeAll(true);
			
			var portal = me.createPortal(data, '0');
			
			target.add(portal);
			target.doLayout();
		};
		
		var params = 'funid='+ me.funId +'&pagetype=editgrid&eventcode=deftemp&templetid=' + target.templetid;
			
		Request.postRequest(params, hdcall);
	},
	
	/**
	 * 更新模板信息
	 **/
	updateTemp: function(target) {
		var me = this;
		var hdcall = function(data) {
			if (Ext.isEmpty(data)) return;
			//删除所有子段对象
			target.removeAll(true);
			
			//更新模板信息
			var newc = data.newconfig;
			var oldc = data.oldconfig;
			for (var i = 0; i < oldc.length; i++) {
				for (var j = 0; j < newc.length; j++) {
					if (oldc[i].id == newc[j].id) {
						delete newc[j].height;
						oldc[i] = Ext.apply(oldc[i], newc[j]);
						break;
					}
				}
			}
			var portal = me.createPortal(oldc, '0');
			
			target.add(portal);
			target.doLayout();
		};
		
		var params = 'funid='+ me.funId +'&pagetype=editgrid&eventcode=reinfo&templetid='+target.templetid+'&settype='+target.settype;
		Request.postRequest(params, hdcall);
	},
	
	/**
	 * 设置模板排版
	 * eventcode -- custtemp 自定义设置、settemp 系统功能设置、redotemp 重新设置 
	 * templetid -- 模板ID
	 * settype -- 0 系统设置、1 自定义设置
	 **/
	readTemp: function(eventcode, templetid, settype) {
		var me = this;
		//设置请求的参数
		var params = 'funid='+ me.funId +'&pagetype=editgrid&eventcode='+ eventcode +'&templetid=' + templetid;
		
		var endcall = function(data) {
			if (data.length == 0) {
				JxHint.alert(jx.util.pletndd);//没有模板明细数据！
				return;
			}
			
			var title = (settype == '0') ? jx.util.pletsdp : jx.util.pletcdp; //'设置缺省模板' : '自定义模板';
			
			var mainTab = Jxstar.sysMainTab;
			var target = mainTab.add({
				templetid:templetid,
				settype:settype,
				
				label:title,
				autoScroll:true,
				layout:'fit',
				closable:true,
				iconCls:'function',
				border:false
			});
			mainTab.activate(target);
			
			var portal = me.createPortal(data, '0');
			
			target.add(portal);
			target.doLayout();
		};
			
		Request.postRequest(params, endcall);
	},
	
	/**
	 * 给子控件增加拖动的能力
	 **/
	draggable: function(item) {
		var me = this;
		var re = new Ext.Resizable(item.el, {
			handles:'all',
			minWidth:60,
			minHeight:30,
			dynamic:true,
			draggable:true,
			transparent:true,
			widthIncrement:me.XINC,
			heightIncrement:me.YINC
		});
		re.on('resize', function(re, w, h){
			var cmp = Ext.getCmp(re.getEl().id);
			cmp.setWidth(w);
			cmp.setHeight(h);
			cmp.doLayout();
		});

		var dd = re.dd;
		dd.setXConstraint(1500, 1500, me.XINC);
		dd.setYConstraint(1500, 1500, me.YINC);
		//保证移动后的位置是步长的整数
		dd.endDrag = function(e){
			var cmp = Ext.getCmp(dd.getDragEl().id);
			var pos = cmp.getPosition(true);
			var x = pos[0], y = pos[1];
			
			if ((x % me.XINC) == 0 && (y % me.YINC) == 0) return true;
			x = Math.floor(x / me.XINC) * me.XINC;
			y = Math.floor(y / me.YINC) * me.YINC;
			cmp.setPosition(x, y);
		};
	}
	
	});//Ext.apply
})();