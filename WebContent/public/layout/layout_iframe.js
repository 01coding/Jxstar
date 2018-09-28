/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 通用显示iframe的布局页面，可以在功能注册信息的grid页面中填写/demo/xxx.jsp的方式注册jsp文件。
 * 
 * @author TonyTan
 * @version 1.0, 2013-05-13
 */
 
Jxstar.currentPage = function(define, pageParam) {
	var funId = define.nodeid;
	
	var ifrHtml = '<iframe frameborder="no" style="display:none;border-width:0;width:100%;height:100%;" ></iframe>';
	var layout = new Ext.Container({
		style:'overflow: hidden;',
		layout:'fit',
		border:false,
		html: ifrHtml
	});
	
	//要延时执行，避免布局对象还没创建
	JxUtil.delay(500, function(){
		var gridfile = define.gridpage;
		var href = Jxstar.path;
		if (gridfile.indexOf('http') >= 0) {
			href = gridfile
		} else {
			href = Jxstar.path + gridfile;
		}		
		href += "?user_id=" + Jxstar.session['user_id'] + "&dataid=" + funId;

		var frm = layout.getEl().child('iframe');
		frm.dom.src = href + '&_dc=' + (new Date()).getTime();//避免缓存
		frm.show();
	});
	
	return layout;
};
