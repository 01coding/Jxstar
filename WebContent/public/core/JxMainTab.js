/** 
 * 首页功能管理TabPanel控件。
 * 多余功能标签下拉显示处理方法：
 * 1、根据标签容器的宽度计算，最多可以存放多少个tab，超过后就把前面的标签隐藏，并在下拉菜单中显示；
 * 2、点击下拉菜单时，检查隐藏标签有哪些，显示在菜单中；点击后把该标签显示到最后，前面多余的标签又隐藏；
 * 
 * @author TonyTan
 * @version 1.0, 2014-04-25
 */
JxMainTab = function(config) {
	//显示功能标签的容器
	this.tabct = null;
	//每个功能标签的宽度
	this.tabwidth = 115;
	//显示所有功能的框架
	this.funct = null;
	//首页标签id
	this.homeid = '';
	
	//当前激活的标签，el对象
	this.currtab = null;
	
	this.addEvents(
		'beforeactive', 
		'afteractive',
		'beforeclose', 
		'afterclose'
	);
	
	Ext.apply(this, config);
	JxMainTab.superclass.constructor.call(this, config);
};

(function(){
Ext.extend(JxMainTab, Ext.util.Observable, {
	//public 初始化首页控件
	initHome: function() {
		var me = this;
		var id = me.homeid;
		var tab = me.getTab(id);
		me.flagTab(tab);
		me.currtab.on('click', function(){
			me.activeTab(id);
		});
		
		//添加下拉菜单事件
		var el = me.tabct.next('span');
		el.on('mousedown', function(){//click mouseover
			me.showTabMenu(el);
		});
	},
	
	//public 显示首页
	showHome: function() {
		this.activeTab(this.homeid);
	},
	
	//public 激活某个标签
	activeTab: function(id, text) {
		var me = this;
		if (me.fireEvent('beforeactive', me, id, text) == false) return;
		
		//如果标签存在，则激活为当前标签，否则创建新标签
		var tab = me.getTab(id);
		if (tab) {
			me.flagTab(tab);
		} else {
			tab = me.createTab(id, text);
			me.flagTab(tab);
		}
		
		me.fireEvent('afteractive', me, id, text);
	},
	
	//public 先判断功能中是否有修改数据，再关闭功能
	onCloseTab: function(id, me) {
		var isedit = false;
		var ct = me.funct.getComponent(id);
		if (Ext.isEmpty(ct)) {
			me.closeTab(id, me);
			return;
		}
		
		var fs = ct.findByType('form');
		if (fs && fs.length > 0) {
			for (var i = 0; i < fs.length; i++) {
				if (fs[i].formNode && fs[i].getForm().isDirty()) {
					isedit = true;
					break;
				}
			}
		}
		if (!isedit) {
			var gs = ct.findByType('grid');
			if (gs && gs.length > 0) {
				for (var i = 0; i < gs.length; i++) {
					var store = gs[i].getStore();
					if (gs[i].gridNode && store) {
						var mrow = store.getModifiedRecords();
						if (mrow && mrow.length > 0) {
							isedit = true;
							break;
						}
					}
				}
			}
		}
		if (isedit) {
			Ext.Msg.confirm(jx.base.hint, jx.cloud.text37, function(btn) {//'当前功能正在修改数据，确定放弃吗？'
				if (btn == 'yes') {me.closeTab(id, me);}
			});
		} else {
			me.closeTab(id, me);
		}
	},
	
	//public 关闭标签，显示最近一个标签
	closeTab: function(id, me) {
		var tab = me.getTab(id);
		if (!tab) return;
		if (me.fireEvent('beforeactive', me, id) == false) return;
		
		//找到下一个，没有就找上一个标签
		var el = tab.next('li');
		if (!el) el = tab.prev('li');
		
		//关闭指定的标签
		tab.remove();
		
		//同时关闭当前功能页面
		me.funct.remove(id, true);
		
		//激活下一个标签
		if (el) me.flagTab(el);
		
		//显示一个隐藏的标签到尾部
		var tabs = me.tabct.select('li{display=none}:first', true).elements;
		if (tabs.length > 0) {
			var text = tabs[0].getAttribute('title');
			var itemid = tabs[0].getAttribute('itemid');
			tabs[0].remove();
			me.createTab(itemid, text);
		}
		
		me.fireEvent('afteractive', me, id);
	},
	
	//private 创建一个功能标签
	createTab: function(id, text) {
		var me = this;
		//取功能图标
		var iconcls = 'fa-funicon', define = Jxstar.findNode(id.substring(4));//去掉id前面的'fun_'，就是功能ID
		if (define && define.iconcls) iconcls = define.iconcls;
		var html = '<li class="top-fun-text x-unselectable" title="'+ text +'" itemid="'+ id +'">' +
					  '<div unselectable="on"><span><i class="fa '+ iconcls +'"></i>'+ text +'</span>'+
					  '<span class="top-fun-img"><i class="fa eb_remco bigger-110"></i></span></div>' +
				   '</li>';
		
		var tab = me.tabct.insertHtml('beforeEnd', html, true);
		tab.setVisibilityMode(Ext.Element.DISPLAY);
		//注册点击事件
		tab.on('click', function(e, t){
			me.activeTab(id);
		});
		
		//显示新的图标
		var icon = tab.child('span[class^=top]');
		//配置删除事件
		icon.on('click', function(e, t){
			me.onCloseTab(id, me);
			e.stopEvent();
		});
		
		//如果标签长度大于区域长度，就隐藏第一个标签
		var topct = me.tabct.up('div[class=top_sysbtn]');
		if (me.tabct.getWidth() > topct.getWidth()-25) {
			me.hideTab();
		}
		
		return tab;
	},
	
	//private 取得某个标签
	getTab: function(id) {
		return this.tabct.child("li[itemid="+ id +"]");
	},
	
	//private 标记为当前标签
	flagTab: function(tab) {
		var me = this;
		//去掉上个当前标签样式
		if (me.currtab) {
			me.currtab.removeClass('top-fun-curr');
		}
		tab.addClass('top-fun-curr');
		
		//激活对应的功能页面
		var id = tab.getAttribute('itemid');
		me.funct.getLayout().setActiveItem(id);
		
		me.currtab = tab;
	},
	
	//private 获取显示的功能标签数
	getTabNum: function() {
		return this.tabct.select('li{display!=none}').getCount()-1;
	},
	
	//private 隐藏第一个功能标签
	hideTab: function() {
		this.tabct.select('li{display!=none}:nth(2)').hide();
	},
	
	//private 删除原标签，创建新标签
	showTab: function(id) {
		var me = this;
		var tab = me.getTab(id);
		var text = tab.getAttribute('title');
		
		tab.remove();
		me.activeTab(id, text);
	},
	
	//private 显示隐藏的标签在菜单中
	showTabMenu: function(el) {
		//如果存在则隐藏
		var winmenu = Ext.get('main_fun_menu');
		if (winmenu) {
			winmenu.hide(); 
			return;
		}
		
		var me = this;
		var items = [];
		items[0] = {text:jx.bus.text56, handler:function(){//'关闭所有'
			var funs = me.funct.items;
			for (var i = funs.length-1; i > 0; i--) {
				//关闭功能页面
				var fun = funs.get(i);
				me.funct.remove(fun, true);
				
				//关闭功能标签
				var tab = me.getTab(fun.id);
				if (tab) tab.remove();
			}
			me.showHome();
		}};
		items[1] = {text:jx.bus.text57, handler:function(){//'关闭其他'
			var cur = me.funct.getLayout().activeItem;
		
			var funs = me.funct.items;
			for (var i = funs.length-1; i > 0; i--) {
				var fun = funs.get(i);
				if (fun.id == cur.id) continue;
				//关闭功能页面
				me.funct.remove(fun, true);
				
				//关闭功能标签
				var tab = me.getTab(fun.id);
				if (tab) tab.remove();
			}
		}};
		
		var tabs = me.tabct.select('li{display=none}', true).elements;
		for (var i = 0; i < tabs.length; i++) {
			if (i == 0) {items[2] = '-';}
			//如果标签隐藏了，则添加到菜单中
			var tab = tabs[i];
			var id = tab.getAttribute('itemid');
			var label = tab.getAttribute('title');
			items[i+2] = {text:label, itemId:id, handler:function(b){
				var tid = b.getItemId();
				me.showTab(tid);
			}};
		}
		
		winmenu = new Ext.menu.Menu({id:'main_fun_menu', items:items});
		winmenu.showAt([el.getX(), el.getY()+20]);	
        //隐藏后自动销毁
		winmenu.on('hide', function(m){m.destroy();});
	}
});

})();