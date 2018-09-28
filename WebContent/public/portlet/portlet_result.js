/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 结果集portlet控件；
 * 支持所有表格数据加载与自定义js内容数据加载；
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */
JxPortalExt.contentTypes['portlet_result'] = {
	/**
	 * public 刷新窗口内容
	 **/
	refresh: function(target) {
		var page = target.getComponent(0);
		if (page.isXType('grid')) {
			Jxstar.reload(page);
		} else {
			//支持portlet界面加载后，执行回调方法加载数据
			if (page.reload) page.reload();
		}
	},
	
	/**
	 * public 显示结果集表格
	 **/
	showPortlet: function(target) {
		var me = this;
		if (target == null) {
			JxHint.alert(jx.plet.noparent);	//'显示PORTLET的容器对象为空！'
			return;
		}
		
		//如果图表在第二个tab显示，则target.body为null
		if (target.body) {
			me.renderPortlet(target);
		} else {
			target.on('afterrender', function(){me.renderPortlet(target);});
		}
	},
	
	/**
	 * public 显示结果集表格
	 **/
	renderPortlet: function(target) {
		//先清除内容
		target.removeAll(target.getComponent(0), true);
	
		//取结果集对应的功能ID
		var funId = target.initialConfig.objectid;
		//显示grid页面
		var param = {pageType:'notoolgrid', showCall:function(page){
			if (page.showCall) page.showCall(target);
			//如果记录数超过一页，则显示分页按钮
			if (page.isXType('grid')) {
				var st = page.getStore();
				var pbar = new Ext.PagingToolbar({
					store: st,
					displayInfo: false,
					pageSize: Jxstar.pageSize,
					hidden: true,
					listeners: {change:function(t, pd){
						var bar = target.header;
						//记录数大于一页时，显示分页按钮
						var pe = bar.child('i.x-tool-prev');
						var ne = bar.child('i.x-tool-next');
						
						var show = (pd.pages > 1);
						if (pe) {pe.up('button').setVisible(show);}
						if (ne) {ne.up('button').setVisible(show);}
						if (pe) {pe.up('button').dom.disabled = (t.cursor == 0);}
						if (ne) {ne.up('button').dom.disabled = ((t.cursor+t.pageSize) >= pd.total);}
						
						//记录条数显示在标题后
						var te = bar.child('span.xpt-panel-header-text');
						if (te) {
							var n = te.child('em');
							if (n) n.remove();
							var cls = (pd.total == 0) ? 'default' : 'primary';
							te.insertHtml('beforeEnd', '<em class="text-'+ cls +'" style="display:inline;">&nbsp;('+pd.total+')</em>');
						}
					}}
				});
				var b1 = {
					id:'x-tool-prev',
					qtip: '上一页',
					hidden: true,
					handler: function(event, toolEl, panel){
						pbar.movePrevious();
					}
				};
				var b2 = {
					id:'x-tool-next',
					qtip: '下一页',
					hidden: true,
					handler: function(event, toolEl, panel){
						pbar.moveNext();
					}
				};
				target.addTool(b1);
				target.addTool(b2);
			}
		}};
		
		var type = 'gridpage';
		var define = Jxstar.findNode(funId);
		if (define) {
			if (define[type].length == 0) {
				type = 'layout';
			}
		}
		Jxstar.createPage(funId, type, target, param);
	}
	
};
