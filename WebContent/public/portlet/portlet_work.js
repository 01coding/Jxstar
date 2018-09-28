/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * Portlet流程中心。
 * 
 * @author TonyTan
 * @version 1.0, 2016-06-01
 */
JxPortalExt.contentTypes['portlet_work'] = {
	/**
	 * public 刷新窗口内容
	 **/
	refresh: function(target) {
		var me = this;
		me.updateTab(0, target);
		me.updateTab(1, target);
		me.updateTab(2, target);
		me.queryWarn(target);
	},
	/**
	*  查看更多内容
	**/
	getMoreInfo:function(funid){
		Jxstar.createNode(funid, {isNotRight:'1'});
	},
	/**
	 * public 显示流程中心
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
		var me = this;
		var tabs = new Ext.TabPanel({
			id:'x_main_tab_work',
			cls:'x_tab_work', 
			border:false, 
		    activeTab: 0,
		    deferredRender: false,//后面的tab没有切换时就创建了，方便update html，绑定事件
		    defaults:{autoScroll:true},
		    items: [{
				itemId:"v_wf_assign",
		        title: jx.cloud.text31,//'待办任务'
		        html: '<span class="x-work-nodata">'+jx.cloud.text30+'</span>'//没有数据！
		    },{
				itemId:"wf_work_exe",
		        title: jx.cloud.text32,//'在办任务'
		        html: '<span class="x-work-nodata">'+jx.cloud.text30+'</span>'
		    },{
				itemId:"wf_work_end",
		        title: jx.cloud.text33,//'已办任务'
		        html: '<span class="x-work-nodata">'+jx.cloud.text30+'</span>'
		    },{
				itemId:"wf_work_warn",
		        title: jx.cloud.text34,//'工作预警'
		        html: '<span class="x-work-nodata">'+jx.cloud.text30+'</span>'
		    }]
		});
		target.add(tabs);
		target.doLayout();
		
		// 添加待办任务tab
		me.updateTab(0, target);
		// 添加在办任务tab
		me.updateTab(1, target);
		// 添加已办任务tab
		me.updateTab(2, target);
		// 添加工作预警tab
		me.queryWarn(target);
		
		//首次显示添加设置查看更多任务请求信息的按钮
		var gear = target.getTool('fa-search');
		if (!gear) {
			var gear = {
				id:'fa-search',
				qtip:jx.cloud.text35,//'查看更多'
				handler: function(e, target, cell){
					var index = tabs.items.indexOf(tabs.activeTab);
					if (index < 3) {
						me.getMoreInfo(tabs.getActiveTab().getItemId());
					} else {
						JxHint.hint(jx.cloud.text36);//'没有更多！'
					}
				}
			};
			target.addTool(gear);
		}
		
		//设置5分钟刷新一次数据
		setInterval(
			function(){ me.updateTab(0, target); me.queryWarn(target); }, 1000*60*5
		);
	},
	/**
	*	更新tab内容
	**/
	updateTab: function(index, target) {
		var me = this, html;
		//流程中心只显示消息数量
		var show = Jxstar.systemVar.wf__msg__num || '0';
		if (show == '1') {
			me.updateTabNum(index, target);
			return;
		}
		
		var tabs = target.getComponent(0);
		var tab = tabs.getItem(index);
		var funid = tab.getItemId();
		var hdcall = function(msgJson) {
			var total = msgJson.total;
			var hint = "<span class=\"badge badge-important\">"+total+"</span>";
			if (index == 1 || index == 2 || total == 0) {
				hint = "("+total+")";
			}
			tab.setTitle(me.getTitle(tab.title) + hint);
			
			if (total > 0) {
				html = me.createPortlet(funid, msgJson.root, index);
			} else {
				html = '<span class="x-work-nodata">'+jx.cloud.text30+'</span>';
			}
			tab.update(html);
		}
		
		var params = 'eventcode=query_data&funid=queryevent&pagetype=grid&query_funid='+funid+'&start=0&limit=5';
		Request.dataRequest(params, hdcall, {has_page:'1', wait:false});
	},
	
	/**
	*  创建tab内容
	**/
	createPortlet:function(funid, msgJson, index){
		var tableTpl = new Ext.Template(
			'<table class="x-work-table">',
				'{rows}',
			'</table>'
		);
		
		var userId = Jxstar.session['user_id'];
		var showfn = 'showCheckData';
		if (index > 0) showfn = 'showCheckHisData';
		
		var table = 'v_wf_assign', datef = 'v_wf_assign__assign_date';
		if (index == 1) {
			table = 'wf_instance';
			datef = 'wf_instance__start_date';
		}
		if (index == 2) {
			table = 'wf_instancehis';
			datef = 'wf_instancehis__end_date';
		}
		var rowTpl = new Ext.Template(
				'<tr funid={'+table+'__fun_id} dataid={'+table+'__data_id} keyid={'+table+'__key_id} msgtype="'+index+'">',
					'<td>',
					'<span class="x-msgshow" onclick="JxUtil.'+showfn+'(\'{'+table+'__fun_id}\', \'{'+table+'__data_id}\', \''+ userId +'\');">{'+table+'__instance_title}</span>',
					'</td>',
					'<td width="70" class="small">',
					'{'+table+'__start_user}',
					'</td>',
					'<td width="80" class="small">',
					'{'+datef+'}',
					'</td>',
					'<td width="100" class="small">',
					'{'+table+'__process_name}',
					'</td>',
				'</tr>'
		);
		
		var rows = [];
		for (var i = 0; i < msgJson.length; i++) {
			msgJson[i][datef] = JxUtil.shortTime(msgJson[i][datef]);
			rows[i] = rowTpl.apply(msgJson[i]);
		}
		
		return tableTpl.apply({rows:rows.join('')});
	},
	
	//为支持英文标题，改为分隔字符方式更新数值
	getTitle: function(title) {
		var ix = title.indexOf('(');
		if (ix < 0) ix = title.indexOf('<');
		if (ix > 0) title = title.substring(0,ix);
		return title;
	},
	
	//工作提醒
	//数据格式：fun_id -- 功能ID, warn_id -- 上报ID, warn_name -- 上报名称, warn_num -- 上报数量， whereSql -- 功能附加where
	queryWarn: function(target) {
		var me = this;
		var tab = target.getComponent(0).getItem(3);
		
		var hdcall = function(datas) {
			datas = datas.root;
			
			var html = '', num = datas ? datas.length : 0;
			var hint = (num == 0) ? "("+num+")" : "<span class=\"badge badge-important\">"+num+"</span>";
			tab.setTitle(me.getTitle(tab.title) + hint);
			
			if (num > 0) {
				var htmls = [];
				//更新html
				var rowTpl = new Ext.Template('<li funid="{fun_id}" wheresql="{whereSql}">{warn_name}&nbsp;[{warn_num}]</li>');
				for (var i = 0, n = num; i < n; i++) {
					htmls[i] = rowTpl.apply(datas[i]);
				}
				html = htmls.join('');
				html = '<ul class="plet-msg-ct">'+html+'</ul>';
			} else {
				html = '<span class="x-work-nodata">'+jx.cloud.text30+'</span>';
			}
			tab.update(html);
			
			//加载点击事件
			tab.el.select('.plet-msg-ct li').on('click', function(e, t){
				var funid = t.getAttribute('funid');
				var wheresql = t.getAttribute('wheresql');
				var param = {whereSql:wheresql};//decodeURIComponent
				Jxstar.createNode(funid, param);
			});
		};
		
		var params = 'funid=sys_warn&eventcode=cntwarn';
		Request.dataRequest(params, hdcall);
	},
	
	//显示消息数量
	updateTabNum: function(index, target) {
		var me = this;
		var tab = target.getComponent(0).getItem(index);
		
		var hdcall = function(datas) {
			var total = datas.total;
			var dat = datas.root;
			var hint = "<span class=\"badge badge-important\">"+total+"</span>";
			if (index == 1 || index == 2 || total == 0) {
				hint = "("+total+")";
			}
			tab.setTitle(me.getTitle(tab.title) + hint);
			
			var html, num = dat.length;
			if (num > 0) {
				var htmls = [];
				//更新html
				var rowTpl = new Ext.Template('<li funid="{fun_id}">{process_name}&nbsp;[{wf_cnt}]</li>');
				for (var i = 0; i < num; i++) {
					htmls[i] = rowTpl.apply(dat[i]);
				}
				html = htmls.join('');
				html = '<ul class="plet-msg-ct">'+html+'</ul>';
			} else {
				html = '<span class="x-work-nodata">'+jx.cloud.text30+'</span>';
			}
			tab.update(html);
			
			//加载点击事件--------------------------------------------
			tab.el.select('.plet-msg-ct li').on('click', function(e, t){
				var nodeId = t.getAttribute('funid');
				var define = Jxstar.findNode(nodeId);
				var pkcol = define.pkcol.replace('__', '.');
				var userId = Jxstar.session['user_id'];
				var param;
				if (index == 0) {
					param = {
						showType: 'form',
						pageType: 'check',
						whereSql: ' exists (select * from v_wf_assign where assign_userid = ? and fun_id = ? and data_id = '+ pkcol +')',
						whereValue: userId+';'+nodeId,
						whereType: 'string;string'
					};
				} else {
					var table = (index == 1) ? 'wf_instance' : 'wf_instancehis';
					param = {
						pageType: 'chkqry',
						whereSql: ' exists (select * from '+ table +' where (start_userid = ? or exists (select * from wf_assignhis '+
								  'where check_userid = ? and '+ table +'.instance_id = wf_assignhis.instance_id)) '+
								  'and fun_id = ? and data_id = '+ pkcol +')',
						whereValue: userId+';'+userId+';'+nodeId,
						whereType: 'string;string;string'
					};
				}
				
				Jxstar.createNode(nodeId, param);
			});
		};
		
		var params = 'eventcode=qrynum&funid=v_wf_assign&type='+index;
		Request.dataRequest(params, hdcall);
	}
};
