/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 浏览器会话失效处理在本对象中定义。
 * 
 * 会话处理思路：
 * 1、从后台取会话有效期；
 * 2、前台设置定时器，每秒检查一次未向后台发送请求的时间是否达到有效期
 * 3、如果达到则弹出提醒对话框，并每秒修改一次剩余时间
 * 4、如果执行了Ext的任何Ajax请求都算执行了会话，会话重新生效
 * 5、如果点击提醒对话框，则向后台发送一次请求，会话重新生效
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */
SessionTimer = {};

(function(){

	Ext.apply(SessionTimer, {
		//会话失效剩余时间，单位：秒
		timeLogout: 0,
		
		//会话失效提醒对话框
		warnDialog: null,
		
		//会话最大有效时间，单位：秒，缺省30分钟
		SESSION_TIMEOUT: 30*60,
		
		/**
		* 恢复剩余时间初始值
		*/
		resetTimer: function() {
			this.timeLogout = this.SESSION_TIMEOUT;			
		},

		/**
		* 创建浏览器定时器，检查是否超过会话有效期
		*/
		startTimer: function() {
			//剩余时间
			var tu = this.timeLogout;
			this.timeLogout = tu-1;
			
			//调试
			//window.status = "Total Time: "+this.SESSION_TIMEOUT + ", Leave Time: " + this.timeLogout +" seconds";

			//提醒时间，最后一分钟提醒
			var wt = 1*60;
			
			//会话超时退出系统
			if(tu == 0) {
				this.signedOut();
			} else if(tu <= wt){
			//如果达到了提醒时间则弹出提醒对话框
				var self = this;
				var hdcall = function(){
					self.warnDialog = null;
					self.resetTimer();

					//向后台发送请求，取一个简单的请求就行了，会话继续生效
					var params = 'funid=queryevent&eventcode=cond_query';
					params += '&selfunid=login';
					Request.dataRequest(params, null);
				};
				
				//打开提醒对话框
				if (this.warnDialog == null) {
					window.focus();
					this.warnDialog = Ext.MessageBox.show({
					   title: jx.base.hint,		//'提示信息'
					   msg: tu+jx.base.exitsys,	//'秒后将退出系统！'
					   buttons: Ext.MessageBox.OK,
					   animEl: 'mb9',
					   fn: hdcall,
					   width: 200,
					   icon: Ext.MessageBox.INFO
					});
				} else {
					this.warnDialog.updateText(tu+jx.base.exitsys);	//'秒后将退出系统！'
				}
			}
			
			window.setTimeout('SessionTimer.startTimer()',1000);//每秒执行一次
		},

		/**
		* 会话超时退出系统
		*/
		signedOut: function() {		
			JxUtil.logout(true);	//退出系统
			JxUtil.isLogout = true;	//正常退出
			window.location.href = Jxstar.path;
		}
	});//Ext.apply

})();
