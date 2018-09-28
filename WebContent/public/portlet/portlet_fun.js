/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 常用功能portlet控件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */
JxPortalExt.contentTypes['portlet_fun'] = {
	/**
	 * public 刷新窗口内容
	 **/
	refresh: function(target) {
		this.showPortlet(target);
	},
	
	//设置个人的常用功能
	setFun: function() {
		//过滤条件
		var where_sql = 'plet_fun.owner_user_id = ?';
		var where_type = 'string';
		var where_value = Jxstar.session['user_id'];
		
		//显示数据
		var hdcall = function(grid) {
			JxUtil.delay(500, function(){
				//处理树形页面的情况
				if (!grid.isXType('grid')) {
					grid = grid.getComponent(1).getComponent(0);
				}

				//设置外键值
				grid.fkFunId = 'sys_user';
				grid.fkValue = where_value;
				Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
			});
		};
	
		var define = Jxstar.findNode('plet_fun');
		//显示数据
		Jxstar.showData({
			filename: define.gridpage,
			title: define.nodetitle, 
			pagetype: 'editgrid',
			nodedefine: define,
			callback: hdcall
		});
	},
	
	/**
	 * public 显示常用功能列表
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
		var self = this;
		//首次显示添加设置个人常用功能的按钮
		var gear = target.getTool('gear');
		if (!gear) {
			var gear = {
				id:'gear',
				qtip:jx.bus.text58,//'设置个人常用功能',
				handler: function(e, target, cell){
					self.setFun();
				}
			};
			target.addTool(gear);
		}
		//先清除内容
		target.removeAll(target.getComponent(0), true);
		
		var hdcall = function(funJson) {
			var cnt = funJson.colnum, w = parseFloat(1/cnt).toFixed(2);
			var cfg = {xtype:'container', layout:'column', items:[]};
			for (var i = 0; i < cnt; i++) {
				cfg.items[i] = {columnWidth:w};
			}
			var tag = new Ext.Container(cfg); target.add(tag);
			
			var j = 0;
			for(var i = 0; i < funJson.type.length; i++){
				var title = funJson.type[i].type;
				if(funJson.type.length<2) {
					title = "";
				}
				var funHtml = self.createPortlet(i,title, funJson.data[funJson.type[i].value]);
				tag.getComponent(j).add({html:funHtml, xtype:'box'});
				
				j = (j == (cnt-1)) ? 0 : (j+1);
			}
			target.doLayout();
		};
		var pletid = target.initialConfig.pletid;
		var params = 'funid=queryevent&eventcode=query_pletfun&portletid='+pletid;
		Request.dataRequest(params, hdcall);
	},
	
	/**
	 * private
	 * 创建常用功能列表
	 * funJson参数是数组对象，每个成员的格式：funid -- 功能ID，funname -- 功能名称
	 **/
	createPortlet: function(index, title, funJson) {
		var cls = (index%2 == 0) ? 'even' : 'odd';
		var th = '';//如果没有标题则不用显示
		if (title && title.length > 0) {
			th = '<div class="nav_fun_type '+cls+'"><span>'+title+'</span></div>';
		}
		
		var tableTpl = new Ext.Template(
			'<div class="nav_fun_body">',th,
			'<ul class="nav_fun_table">',
				'{rows}',
			'</ul>',
			'</div>'
		);
		var rowTpl = new Ext.Template(
			'<li class="{cls}" onclick="Jxstar.createNode(\'{funid}\', \{isfast:{isfast}\});">',
				'<div class="fun-body"><i class="fa {funicon}"></i> {funname}</div>',
			'</li>'
		);
		
		var rows = [];
		var len = funJson.length;
		for (var i = 0; i < len; i++) {
			//没有操作权限的不显示
			if (Jxstar.validNode(funJson[i].funid) == false) continue;
			
			funJson[i].cls = (i%2 == 0) ? 'even' : 'odd';
			funJson[i].isfast = (funJson[i].isfast == '1');
			rows[i] = rowTpl.apply(funJson[i]);
		}
		
		return tableTpl.apply({rows:rows.join('')});
	}
	
};

