﻿		config.eventcfg = {
		createjs: function(){
			var params = 'funid=fun_text&pagetype=editgrid&eventcode=createjs&projectpath=' + 							Jxstar.session['project_path'];

			//生成文件后自动加载该文件
			var hdcall = function() {				jx = null;
				Request.loadJS('/public/locale/jxstar-lang-zh.js');
			};

			//发送请求
			Request.postRequest(params, hdcall);
		},				createjse: function(lang){			var params = 'funid=fun_text&pagetype=editgrid&eventcode=createjse&lang='+ lang +'&projectpath=' + 							Jxstar.session['project_path'];			//发送请求			Request.postRequest(params, null);		}
	};		config.initpage = function(gridNode){		var event = gridNode.event;		event.on('beforesave', function(event) {			var grid = event.grid;			var store = grid.getStore();			var mrow = store.getModifiedRecords();						for (var i = 0, n = mrow.length; i < n; i++) {				var record = mrow[i];				var propkey = record.get('funall_text__prop_key');				propkey = propkey.trim();				//键值【{0}】不合格，必需且只能有一个“.”，如aaa.bbb！				var hint = String.format(jx.fun.novalidkey, propkey);				var keys = propkey.split('.');				if (keys.length != 2) {					JxHint.alert(hint); return false;				} else {					if (keys[0].length == 0 || keys[1].length == 0) {						JxHint.alert(hint); return false;					}				}			}			return true;		});	};