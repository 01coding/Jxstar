	config.eventcfg = {
		createjs: function(){
			//取选择记录的主键值
			var params = 'funid='+ this.define.nodeid;
			
			//设置请求的参数
			params += '&pagetype=editgrid&eventcode=createjs&projectpath=' + Jxstar.session['project_path'];

			//生成文件后自动加载该文件
			var hdcall = function() {				ComboData = null;
				Request.loadJS('/public/locale/combo-lang-zh.js');
			};

			//发送请求
			Request.postRequest(params, hdcall);
		},				createjse: function(lang){			var params = 'funid=sys_control&pagetype=editgrid&eventcode=createjse&lang='+ lang +'&projectpath=' + 							Jxstar.session['project_path'];			//发送请求			Request.postRequest(params, null);		}
	};