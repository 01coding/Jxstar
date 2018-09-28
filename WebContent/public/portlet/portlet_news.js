/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 工作消息控件。
 * 
 * @author TonyTan
 * @version 1.0, 2016-06-01
 */
JxPortalExt.contentTypes['portlet_news'] = {
	/**
	 * public 刷新窗口内容
	 **/
	refresh: function(target) {
		this.showPortlet(target);
	},
	
	/**
	 * public 读取工作消息数量
	 **/
	showPortlet: function(target) {
		var me = this;
		//如果图表在第二个tab显示，则target.body为null
		if (target.body) {
			me.renderPortlet(target);
		} else {
			target.on('afterrender', function(){me.renderPortlet(target);});
		}
	},
	
	renderPortlet: function(target) {
		//设置不需要横向滚动条
		target.body.setStyle("overflow-x", "hidden");
		
		var me = this;
		if (target == null) {
			JxHint.alert(jx.plet.noparent);	//'显示PORTLET的容器对象为空！'
			return;
		}
		//先清除内容
		target.removeAll(target.getComponent(0), true);
		
		var json = [
			{msgtype:'check', color:'green', msgicon:'fa-external-link-square', msgtitle:jx.cloud.text27},//'待办'
			{msgtype:'warn', color:'orange', msgicon:'fa-warning', msgtitle:jx.cloud.text28},//'预警'
			{msgtype:'board', color:'red', msgicon:'fa-bullhorn', msgtitle:jx.cloud.text29},//'公告'
			{msgtype:'notify', color:'blue', msgicon:'fa-bell', msgtitle:jx.base.hint}//'提示'
		];
		
		var html = me.createPortlet(json);
			
		var ct = target.add({html:html, xtype:'box'});
		target.doLayout();
		
		//添加折叠事件
		ct.el.select('div.plet-msg-header').on('click', function(e, tt){
			//直接用t会取不同的元素
			var t = e.getTarget('.plet-msg-header', 3, true);
			//没消息的不处理
			if (t.hasClass('header-0')) return;
			
			var t2 = t.child('.nav-flag i');
			var t1 = t.next('.plet-msg-ct');
			if (t1.isDisplayed()) {
				t.removeClass('plet-msg-header-open');
				t1.setStyle('display', 'none');
				t2.replaceClass('fa-angle-down', 'fa-angle-right');
			} else {
				t.addClass('plet-msg-header-open');
				t1.setStyle('display', '');
				t2.replaceClass('fa-angle-right', 'fa-angle-down');
			}
		});
		
		//加载审批消息
		ct = Ext.get('plet-msg-check');
		me.queryCheck(ct);
		
		//加载工作提醒
		ct = Ext.get('plet-msg-warn');
		me.queryWarn(ct);
		
		//加载公告
		ct = Ext.get('plet-msg-board');
		me.queryBoard(ct, target);
		
		//加载通知
		ct = Ext.get('plet-msg-notify');
		me.queryNotify(ct);
	},
	
	/**
	 * private 创建工作消息列表
	 **/
	/*
		'<div class="plet-msg-header">',
			'<div class="msg-object {color}">',
				'<span class="msg-icon"><i class="fa {msgicon} bigger-180"></i></span>',
			'</div>',
			'<span class="pull-right nav-flag"><i class="fa fa-angle-down bigger-150"></i></span>',
			'<span class="pull-right badge badge-important badge-{msgnum}">{msgnum}</span>',
			'<div class="msg-body">',
				'{msgtitle}',
			'</div>',
		'</div>',
	 * */
	
	createPortlet: function(msgJson) {
		var tableTpl = new Ext.Template(
			'<ul class="plet-msg">',
				'{rows}',
			'</ul>'
		);
		
		var rowTpl = new Ext.Template(
			'<li id="plet-msg-{msgtype}">',
				'<div class="plet-msg-header header-0">',
					'<div class="msg-object {color}">',
						'<span class="msg-icon"><i class="fa {msgicon}"></i></span>',
					'</div>',
					'<span class="pull-right nav-flag"><i class="fa fa-angle-right bigger-150"></i></span>',
					'<span class="pull-right badge badge-grey">0</span>',
					'<div class="msg-body">',
						'{msgtitle}',
					'</div>',
				'</div>',
				'<ul class="plet-msg-ct"></ul>',
			'</li>'
		);
		
		var rows = [];
		for (var i = 0; i < msgJson.length; i++) {
			rows[i] = rowTpl.apply(msgJson[i]);
		}
		
		return tableTpl.apply({rows:rows.join('')});
	},
	
	//更新数量与状态
	updateHtml: function(ct, datas, str) {
		var num = datas ? datas.length : 0;
		var header = ct.child('.plet-msg-header'),
			badge  = ct.child('.plet-msg-header .badge');
		
		if (num > 0) {
			header.addClass('plet-msg-header-open');
			header.removeClass('header-0');
			header.child('.nav-flag i').replaceClass('fa-angle-right', 'fa-angle-down');
			badge.update(num);
		} else {
			header.addClass('header-0');
			header.removeClass('plet-msg-header-open');
			badge.update('0');
		}
		
		var html = '';
		if (num > 0) {
			var htmls = [];
			var tpl = new Ext.Template(str);
			for (var i = 0, n = num; i < n; i++) {
				htmls[i] = tpl.apply(datas[i]);
			}
			html = htmls.join('');
		}
		 ct.child('.plet-msg-ct').update(html);
	},
	
	//待办审批
	//数据格式：wf_instance__process_name, process_num, wf_instance__process_id, wf_assign__fun_id
	queryCheck: function(ct) {
		var me = this;
		var userId = JxDefault.getUserId();
		
		var hdcall = function(datas) {
			datas = datas.root;
			//更新html
			var str = '<li funid="{wf_assign__fun_id}">{wf_instance__process_name}&nbsp;[{process_num}]</li>';
			me.updateHtml(ct, datas, str);
			
			//加载点击事件
			ct.select('.plet-msg-ct li').on('click', function(e, t){
				var funId = t.getAttribute('funid');
				JxUtil.showCheckData(funId, '', userId);
			});
		};
		
		var where = encodeURIComponent('wf_assign.assign_userid = ?');
		var params = 'eventcode=query_data&funid=queryevent&query_funid=wf_assign_num'+
			'&where_sql='+where+'&where_value='+userId+'&where_type=string&has_page=0';
		Request.dataRequest(params, hdcall);
	},
	
	//工作提醒
	//数据格式：fun_id -- 功能ID, warn_id -- 上报ID, warn_name -- 上报名称, warn_num -- 上报数量， whereSql -- 功能附加where
	queryWarn: function(ct) {
		var me = this;
		var hdcall = function(datas) {
			datas = datas.root;
			//更新html
			var str = '<li funid="{fun_id}" wheresql="{whereSql}">{warn_name}&nbsp;[{warn_num}]</li>';
			me.updateHtml(ct, datas, str);
			
			//加载点击事件
			ct.select('.plet-msg-ct li').on('click', function(e, t){
				var funid = t.getAttribute('funid');
				var wheresql = t.getAttribute('wheresql');
				var param = {whereSql:wheresql};//decodeURIComponent
				Jxstar.createNode(funid, param);
			});
		};
		
		var params = 'funid=sys_warn&eventcode=cntwarn';
		Request.dataRequest(params, hdcall);
	},
	
	//公告 
	queryBoard: function(ct, target) {
		var self = this;
		//当前portlet显示的信息类型，支持多个，如：1,2
		var contType = target.initialConfig.objectid||'1,2';
		
		var hdcall = function(msgJson) {
			datas = msgJson;
			var str = '<li newsId="{news_id}" wheresql="{whereSql}">{news_title}&nbsp;</li>';
			self.updateHtml(ct, datas, str);
			// 加载点击事件
			ct.select('.plet-msg-ct li').on('click', function(e, t){
				var newsid = t.getAttribute('newsId');
				var wheresql = t.getAttribute('wheresql');
				var param = {whereSql:wheresql};//decodeURIComponent
				JxSender.readBoard(newsid);
			});
		};
		
		//premonth含义改变为显示条数，缺省显示6条

		var params = 'funid=oa_news&eventcode=qrycont&pagetype=grid&shownum=6&conttype='+contType;
		Request.dataRequest(params, hdcall);

	},
	//通知
	queryNotify: function(ct) {
		var me = this;
		
		me.updateHtml(ct, [], '');
	}
	
};
