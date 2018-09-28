/*!
 * Copyright 2011-2016 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.com
 */
//jxstar/system/layout/layout_app_list.js
/**
 * 应用列表布局
 * 
 * @author TonyTan
 * @version 1.0, 2018-06-29
 */
 
Jxstar.currentPage = function(define, pageParam) {
	if (!pageParam) pageParam = {};
	var funid = define.nodeid;

	Jxstar.loadAppList = function(hd){
		//请求参数
		var params = 'funid=app_fun&eventcode=qryapp';
		//发送请求
		Request.postRequest(params, hd);
	};
	//获取应用展示列表
	var updateHtml = function(ct) {
		
		var tplm = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="bar-title" pack_code="{pack_code}">',
					'<h5>{pack_name}<h5>',
				'</div>',
				'{xfuns}',
			'</tpl>'
		);
		
		var tplv = new Ext.XTemplate(
	        '<ul class="mui-table-view">',
				'<tpl for=".">',
	            '<li class="mui-table-view-cell">',
	            	'<a id="{fun_code}" href="{page_url}">',
	            		'<div class="mui-icon icon-bg">',
	            			'<i class="{fun_icon}"></i>',
	                    '</div>',
	                    '<div class="mui-media-body">{fun_name}</div>',
	            	'</a>',
	            '</li>',
	            '</tpl>',
	        '</ul>'
		);
		
		//执行处理的内容
		var endcall = function(data) {
			//data格式：{packs:[{pack_code, pack_name},...],funs:{pack1:[{fun_code, fun_name, fun_icon, page_url}], pack2:[],...}}
			var html = '';
			if (data.packs.length == 0) {
				html = '没有应用！';
			} else {
				var subs = [];
				for (var i = 0; i < data.packs.length; i++) {
					var pack = data.packs[i];
					var funs = data.funs[pack.pack_code];
					if (funs.length == 0) continue;

					subs.push({
						xfuns : tplv.apply(funs),
						pack_code : pack.pack_code, 
						pack_name : pack.pack_name
					});
				}
				html = tplm.apply(subs);
			}
			ct.getComponent(0).update(html);
		};
		
		Jxstar.loadAppList(endcall);
	};
	
	var layout = new Ext.Panel({
		id:'cloud_fun_'+funid,
		label: define.nodetitle,
		layout:'fit',
		border:false,
		items:[{xtype:'box'}]
	});
	
	updateHtml(layout);
	
	return layout;
};
