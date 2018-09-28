/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 
 * 
 * @author TonyTan
 * @version 1.0, 2013-05-13
 */
 
Jxstar.currentPage = function(define) {
	
	
	//工具栏定义
	var tbar = new Ext.Toolbar({items:[{text:'刷新', handler:function(){refreshLog();}},
							{text:'重载', handler:function(){reloadLog();}},
							{text:'下载', handler:function(){downloadLog();}}
							 ]});
							 
	var layout = new Ext.Panel({
			tbar:tbar,
			layout:'fit',
			items:[{xtype:'box', html:'<textarea class="x-area-log" readonly></textarea>'}]
	});
	
	//重新加载日志
	function reloadLog(){
		var hdcall = function(data){
			var text = data.data;
			text = JxUtil.numToStr(text);
			var tt = layout.getComponent(0).el.child('textarea');
			tt.dom.value = text;
		};
		var param = "funid=data_log&eventcode=reloadLog";
		Request.postRequest(param, hdcall);
	}
	
	//刷新日志
	function refreshLog(){
		var hdcall = function(data){
			var text = data.data;
			var type = data.type;
			text = JxUtil.numToStr(text);
			var tt = layout.getComponent(0).el.child('textarea');
			if(type==0){
				tt.dom.value = tt.dom.value+text;
			}else{
				tt.dom.value = text;
			}
		};
		var param = "funid=data_log&eventcode=refreshLog";
		Request.postRequest(param, hdcall);
	}
	//下载日志
	function downloadLog(){
		var userId = Jxstar.session['user_id'];
		var url = Jxstar.path + '/fileAction.do?funid=data_log&eventcode=downloadLog&dataType=byte&user_id='+userId;
		Ext.fly('frmhidden').dom.src = url + '&_dc=' + (new Date()).getTime();//添加时间戳，避免浏览器缓存
	
	}
	
	/* function stopRefreshLog(){
		 clearInterval(t);
		 tbar.remove(tbar.items.get(1));
		 tbar.insert(1,{text:'继续刷新', handler:function(){re_RefreshLog();}});
		 layout.doLayout();
	}
	function re_RefreshLog(){
		 refreshLog();
		 t = setInterval(refreshLog,5000);
		 tbar.remove(tbar.items.get(1));
		 tbar.insert(1,{text:'停止刷新', handler:function(){stopRefreshLog();}});
		 layout.doLayout();
	} */
	reloadLog();

	return layout;
};


