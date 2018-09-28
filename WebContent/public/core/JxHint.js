/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 消息提醒工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

JxHint = {};
(function(){
	var msgCt;
	
	Ext.apply(JxHint, {
		/**
		* 在头部显示提示信息，停顿2秒自动关闭
		* text：消息内容
		*/
		hint: function(text){
			
			if(!msgCt){
				msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
			}
			msgCt.alignTo(document, 't-t', [-20, 0]);
			var m  = Ext.DomHelper.append(msgCt, {html:'<div class="msg-hint">'+text+'</div>'}, true);
			m.slideIn('t').pause(2).ghost("t", {remove:true});
		},

		/**
		* 所有前台提示信息方法
		* text：消息内容
		*/
		alert: function(text) {
			Ext.Msg.alert(jx.base.hint, text);	//'提示'
		}
	});
})();