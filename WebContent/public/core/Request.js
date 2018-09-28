/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 请求对象：负责动态异步加载js文件；异步执行后台请求；下载文件等。
 * 同步请求可以采用JxUtil.loadJS()，或直接采用XmlRequest对象。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */
Request = {};

(function(){
	if (Ext.LoadMask) {
		Ext.LoadMask.prototype.msg = jx.req.exeing;	//'正在执行...'
	}

	Ext.apply(Request, {
		/**
		 * 创建Request对象，下面提供的方法全部是静态方法。
		 **/
		loadXML: function(data) {
			if (data == null || data.length == 0) return;
			
			var xdoc = null;
			if (typeof(DOMParser) == 'undefined'){
				xdoc = new ActiveXObject("Microsoft.XMLDOM");
				xdoc.async = 'false';
				xdoc.loadXML(data);
			}else{
				var parser = new DOMParser();
				xdoc = parser.parseFromString(data, "application/xml");
			}

			return xdoc;
		},

		/**
		 * 异步加载script文件
		 * public目录中的静态文件可以缓存，通过后台类压缩管理；
		 **/
		loadJS: function(url, hdCall, cached) {
			if (cached == null) cached = false;
			if (url == null || url.length == 0) {
				JxHint.alert('Request.loadJS'+jx.req.nopath);	//'访问的路径为空！'
				return;
			}
			//第1一个字符应该是/
			if (url.charAt(0) != '/') url = '/' + url;
			
			Ext.Ajax.request({
				method: 'GET',
				url: Jxstar.path + url,
				success: function(response) {
					//需要执行JS脚本，不然不能调用JS中的对象
					var f = eval(response.responseText);
					if (!f && response.responseText.indexOf('Jxstar.currentPage') >= 0) {
						JxUtil.delay(200, function(){
							f = eval(response.responseText);
							if (!f) {
								alert('js load error: '+response.responseText);
							} else {
								if (f && hdCall != null) hdCall(f);
								f = null;
								Jxstar.currentPage = null;
							}
						});
						return;
					}
					
					//执行外部的回调函数
					if (f && hdCall != null) hdCall(f);
					f = null;
					//清除原函数
					Jxstar.currentPage = null;
				},
				failure: function(response) {
					response.srcdesc = 'Request.loadJS?url='+url;
					JxUtil.errorResponse(response);
				},
				disableCaching: !cached
			});
		},

		/**
		 * 异步加载jsp文件
		 **/
		loadJsp: function(url) {
			if (url == null || url.length == 0) {
				JxHint.alert('Request.loadJsp'+jx.req.nopath);	//'访问的路径为空！'
				return;
			}
			Ext.getBody().load({
				method: 'GET',
				url:url, 
				scripts:true
			});
		},

		/**
		* 异步发送按钮事件请求
		**/
		postRequest: function(params, hdCall, options) {
			options = options || {};
			options.action = 'event';
			this.asynchRequest(params, hdCall, options);
		},

		/**
		* 异步发送查询事件请求
		**/
		dataRequest: function(params, hdCall, options) {
			options = options || {};
			options.action = 'query';
			this.asynchRequest(params, hdCall, options);
		},

		/**
		* 异步发送事件请求
		* params 是post参数，如果参数值中有特殊符号或中文，则需要encodeURIComponent处理一下，
				 在外部调用时处理，在此不统一处理，避免造成重复。
		* hdCall 是执行成功的回调函数
		* options 扩展选项参数有：
		* 	wait 是否显示执行进度条，值有：true|false
		* 	type 是响应的数据类型有：xml|json，默认为json
		* 	action 有event与query
		* 	query_type 查询类型，缺省为0，0为普通查询、1为高级查询
		* 	has_page 是否加分页处理，缺省为0，0为不加分页查询、1为加分页查询
		*   errorcall 失败回调方法，特殊用途，如：检查项失败后，要显示检查情况
		*   timeout 请求超时设置，单位ms，缺省60秒
		* 
		* result 的参数有：
		* 	success -- 执行是否成功
		* 	message -- 提示信息
		* 	data -- 响应的数据
		* 	extData -- 扩展的响应数据
		**/
		asynchRequest: function(params, hdCall, options) {
			SessionTimer.resetTimer();
			
			var myMask = null;
			var useWait = options.wait || false;
			var dataType = options.type || 'json';
			var action = options.action;
			var sync = options.sync || false;
			var timeout = options.timeout || 60000;
			
			//添加用户名判断
			params += '&user_id=' + Jxstar.session['user_id'];
			//添加返回数据类型
			params += '&dataType=' + dataType;
			//标志请求来自PC端
			params += '&appid=jxstar';
			
			if (action == 'query') {
				//添加查询类型参数
				params += '&query_type=' + (options.query_type||'0');
				//添加是否加分页处理参数
				params += '&has_page=' + (options.has_page||'0');
			}

			//是否命令事件，只有命令事件才提示进度条
			useWait = useWait || (action == 'event');
			if (useWait) {
				if(!myMask){
					myMask = new Ext.LoadMask(Ext.getBody());
				}
				myMask.show();
			}
			Ext.Ajax.request({
				method: 'POST',
				url: Jxstar.path + '/commonAction.do',
				timeout: timeout,
				success: function(response) {
					var result = {};
					if (dataType == 'xml') {
						//把xml响应对象解析为JSON对象
						var xdoc = response.responseXML;
						var query = Ext.DomQuery;
						result.data = query.selectValue('data', xdoc);
						result.success = query.selectValue('success', xdoc);
						result.message = query.selectValue('message', xdoc);
					} else {
						//把响应字符串解析为JSON对象
						//result = Ext.decode(response.responseText);
						try{
							result = JSON.parse(response.responseText);
						} catch(e) {
							alert("JSON格式错误：\n"+response.responseText+"\nJSON解析异常：\n"+e.message);
							return;
						}
					}
					
					//调整执行顺序，先销除myMask对象，再调用回调函数，以销除在回调函数中重新请求postReqeust时所创建的新myMask对象
					if (useWait && myMask) {myMask.hide(); myMask = null;}
					
					if (result.success == true || result.success == 'true') {
						var msg = result.message;
						if (action == 'event') {
							if (msg.length == 0) msg = jx.req.success;	//'执行成功！'
							JxHint.hint(msg);
						}

						//成功执行外部的回调函数；增加extData参数，防止覆盖返回数据
						if (hdCall != null) hdCall(result.data, result.extData);
					} else {
						//如果注册了执行失败的回调函数，则不提示失败消息
						if (options && options.errorcall) {
							options.errorcall(result);
						} else {
							var msg = result.message;
							if (msg.length == 0) msg = jx.req.faild;		//执行失败！
							if (msg.indexOf(jx.req.onlyone) >= 0) {//退出当前系统
								alert(msg);
								JxUtil.isLogout = true;	//正常退出
								window.location.href = Jxstar.logoutUrl || Jxstar.path;
							} else {
								JxHint.alert(msg);
							}
						}
					}
				},
				failure: function(response) {
					if (useWait && myMask) {myMask.hide(); myMask = null;}
					response.srcdesc = 'Request.asynchRequest=/commonAction.do?'+params;
					JxUtil.errorResponse(response);
				},
				params: params
			});
		},
		
		/**
		* 异步发送输出文件请求，响应网页更新到HTML对象中。
		* targetId -- 文件显示的控件ID
		* params -- 读取文件的参数
		* hdCall -- 回调函数，参数有：el, success, response, options
		**/
		fileUpdate: function(targetId, params, hdCall) {
			SessionTimer.resetTimer();
			
			params = params||'';
			//添加用户名判断
			if (params.indexOf('&user_id=') < 0) {
				params += '&user_id=' + Jxstar.session['user_id'];
			}
			//添加数据类型
			if (params.indexOf('&dataType=') < 0) {
				params += '&dataType=byte';
			}
		
			Ext.get(targetId).load({
				method: 'POST',
				url:Jxstar.path + '/fileAction.do',
				scripts:true, 
				nocache:true,//不缓存文件
				callback:function(el, success, response, options) {
					if (success == true) {
						if (hdCall != null) hdCall(response.responseText);
					} else {
						response.srcdesc = 'Request.fileUpdate=/fileAction.do?'+params;
						JxUtil.errorResponse(response);
					}
				},
				params:params
			});
		},
		
		/**
		* 异步发送下载文件的请求。
		* params -- 读取文件的参数
		**/
		fileDown: function(params) {
			SessionTimer.resetTimer();
			
			params = params||'';
			//添加用户名判断
			if (params.indexOf('&user_id=') < 0) {
				params += '&user_id=' + Jxstar.session['user_id'];
			}
			//添加数据类型
			if (params.indexOf('&dataType=') < 0) {
				params += '&dataType=byte';
			}
			
			//输出iframe下载文件
			var href = Jxstar.path + '/fileAction.do?' + params;
				href += '&_dc=' + (new Date()).getTime();//添加时间戳，避免浏览器缓存
			//var iframe = document.getElementById('frmhidden');
			//iframe.src = href;
			//解决在IE8中下载文件不稳定的问题
			Request.postFormURL(href);
		},
		
		/**
		* 通过post方式发送href请求
		* href -- 请求链接
		**/
		postFormURL: function(href) {
			//如果没有form则自动创建
			var fd = Ext.get('frmPostHref');
			if (!fd) {
				fd = Ext.DomHelper.append(Ext.getBody(), {
						tag:'form', 
						method:'post', 
						id:'frmPostHref', 
						name:'frmPostHref',
						target:'frmhidden',
						cls:'x-hidden'
					}, true);
			}
			//URL请求参数
			fd.dom.action = href;
			fd.dom.submit();
		},
		
		/**
		* 图文附件下载处理方法，处理集中下载机制。
		* params -- 读取文件的参数
		**/
		attachDown: function(params) {
			Request.fileDown(params);
		},
		
		/**
		* 异步发送上传文件的请求
		* form -- 表单对象BasicForm
		* params -- 读取文件的参数
		* hdCall -- 回调函数，参数有：result.data
		* field -- 字段中上传附件失败时，清空值
		**/
		fileRequest: function(form, params, hdCall, field) {
			SessionTimer.resetTimer();
			
			params = params||'';
			//添加用户名判断
			if (params.indexOf('&user_id=') < 0) {
				params += '&user_id=' + Jxstar.session['user_id'];
			}
			//设置上传附件的参数
			form.fileUpload = true;
			form.method = 'POST';
			//发送后台请求
			form.submit({
				url: Jxstar.path + '/fileAction.do',
				waitTitle: jx.req.wait,	//'请等待'
				waitMsg: jx.req.uping,	//'正在上传附件...'
				clientValidation: false, //不做客户端数据校验
				success: function(form, action) {
					var rsp = action.response;
					var result = Ext.decode(rsp.responseText);
					if (result.success) {
						var msg = result.message;
						if (msg.length == 0) {
							msg = jx.req.success;	//'执行成功'
						}
						JxHint.hint(msg);
						//成功执行外部的回调函数
						if (hdCall != null) hdCall(result.data);
					} else {
						if (field) field.setValue('');
						if (rsp) {
							rsp.srcdesc = 'Request.fileRequest=/fileAction.do?'+params;
							JxUtil.errorResponse(rsp);
						} else {
							JxHint.alert(jx.req.ajaxerror);
						}
					}
				},
				failure: function(form, action) {
					if (field) field.setValue('');
					switch (action.failureType) {
						case Ext.form.Action.CLIENT_INVALID:
							JxHint.alert(jx.req.formnd);//表单有无效数据，不能上传附件！
							break;
						case Ext.form.Action.CONNECT_FAILURE:
							JxHint.alert(jx.req.confa);//连接失败，不能上传附件！
							break;
						case Ext.form.Action.SERVER_INVALID:
							var rsp = action.response;
						    if (rsp) {
								rsp.srcdesc = 'Request.fileRequest=/fileAction.do?'+params;
								JxUtil.errorResponse(rsp);
							} else {
								JxHint.alert(jx.req.ajaxerror);
							}
				    }
				},
				params:params
			});
		},
		
		/**
		 * 通过POST的方式向后台发送请求，后台取得文件内容，返回前台下载，
		 * 替换原来采用document.getElementById('frmhidden').src = href;的方式。
		 * getParams -- GET请求的参数，URL字符串
		 * postParams -- POST请求的参数，格式为：{exp_text:'', where_sql:'', where_value:'', where_type:'', query_type:''}
		 */
		expFile: function(getParams, postParams) {
			//如果没有form则自动创建
			var fd = Ext.get('frmExpFile');
			if (!fd) {
				fd = Ext.DomHelper.append(Ext.getBody(), {
						tag:'form', 
						method:'post', 
						id:'frmExpFile', 
						name:'frmExpFile',
						target:'frmhidden',
						cls:'x-hidden',
						cn:[{tag:'input',name:'exp_text',id:'exp_text',type:'hidden'},
						    {tag:'input',name:'query_type',id:'query_type',type:'hidden'},
						    {tag:'input',name:'where_sql',id:'where_sql',type:'hidden'},
						    {tag:'input',name:'where_value',id:'where_value',type:'hidden'},
						    {tag:'input',name:'where_type',id:'where_type',type:'hidden'}]
					}, true);
			}
			//POST请求参数
			var pps = postParams||{};
			fd.child('#exp_text').set({value:pps.exp_text||''});
			fd.child('#query_type').set({value:pps.query_type||'0'});
			fd.child('#where_sql').set({value:pps.where_sql||''});
			fd.child('#where_value').set({value:pps.where_value||''});
			fd.child('#where_type').set({value:pps.where_type||''});
			
			//URL请求参数
			var href = Jxstar.path + "/fileAction.do";
			var gps = getParams||'';
			if (gps.indexOf('&user_id=') < 0) {
				gps += '&user_id=' + Jxstar.session['user_id'];
			}
			if (gps.indexOf('&dataType=') < 0) {
				gps += '&dataType=byte';
			}
			if (gps.length > 0) {
				href += '?' + encodeURI(gps);
			}
			fd.dom.action = href;
			fd.dom.submit();
		},
		
		/**
		* 表格中的数据导出到xls文件中
		* grid -- 数据表格
		* fileName -- excel文件名
		* includeHidden -- 是否包含隐藏字段
		**/
		exportCSV: function(grid, fileName, includeHidden) {
			var content = JxUtil.gridToCSV(grid, Ext.isEmpty(includeHidden) ? true : includeHidden);
			this.exportString(fileName, content);
		},
		
		/**
		 * 下载指定字符串内容，charset支持生成：UTF-8 或 GBK 编码的文件
		 **/
		exportString: function(fileName, content, charset) {
			if (charset == null) charset = 'GBK';
			var fd = Ext.get('frmDummy');
			if (!fd) {
				fd = Ext.DomHelper.append(Ext.getBody(), {
						tag:'form', 
						method:'post', 
						id:'frmDummy', 
						name:'frmDummy',
						action:Jxstar.path+'/jxstar/other/jsp/exportfile.jsp', 
						target:'_blank',
						cls:'x-hidden',
						cn:[
							{tag:'input',name:'charset',id:'charset',type:'hidden'},
							{tag:'input',name:'fileName',id:'fileName',type:'hidden'},
							{tag:'input',name:'exportContent',id:'exportContent',type:'hidden'}]
					}, true);
			}
			fd.child('#charset').set({value:charset});
			fd.child('#fileName').set({value:fileName});
			fd.child('#exportContent').set({value:content});
			fd.dom.submit();
		}

	});
})();