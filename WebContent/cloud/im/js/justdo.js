/**
 * Created by JKZ on 2015/6/9.
 */

(function() {
    window.IM = window.IM || {
        //Jxstar-IM的注册信息
        _appid : '8a216da85aac13ff015ab6f6b42604ed',
		_apptoken : 'b840540005635000fd10182d93526665',
		//amr转wav服务地址
		_amr2wavurl : '/cloud/amr2wav.jsp',
      
      	_login_sig : '',	//获取历史消息用，但没有成功
         
        /** 以下不要动，不需要改动 */
        _timeoutkey : null,
        _username : null,
        _user_account : null,
        _contact_type_c : 'C', // 代表联系人
        _contact_type_g : 'G', // 代表群组
        _contact_type_m : 'M', // 代表多渠道客服
        _onMsgReceiveListener : null,
        _onDeskMsgReceiveListener : null,
        _noticeReceiveListener : null,
        _onConnectStateChangeLisenter : null,
        _onCallMsgListener :null,
        _isMcm_active : false,
        _local_historyver : 0,
        _msgId : null,// 消息ID，查看图片时有用
        _pre_range : null,// pre的光标监控对象
        _pre_range_num : 0, // 计数，记录pre中当前光标位置，以childNodes为单位
        _fireMessage : 'fireMessage',
        _serverNo : 'XTOZ',
        _baiduMap:null,
        _loginType:1,//登录类型: 1账号登录，3voip账号密码登录
        _Notification:null,
        
        
        /**
         * 初始化
         * 
         * @private
         */
        init : function() {
        	//从会话中取应用ID
        	var obj = IM.getSession();
	    	if (!obj) {
	    		if (obj.im_appid && obj.im_appid.length > 0) {
	    			IM._appid = obj.im_appid;
	    		}
	    		if (obj.im_apptoken && obj.im_apptoken.length > 0) {
	    			IM._apptoken = obj.im_apptoken;
	    		}
	    	}
            // 初始化SDK
            var resp = RL_YTX.init(IM._appid);
            if (!resp) {
                alert('SDK初始化错误');
                return;
            };
            if (200 == resp.code) {// 初始化成功
                $('#navbar_login').show();
                $('#navbar_login_show').hide();

                // 重置页面高度变化
                IM.HTML_resetHei();

                window.onresize = function() {
                    IM.HTML_resetHei();
                };

                // 初始化一些页面需要绑定的事件
                IM.initEvent();
                if($.inArray(174004,resp.unsupport) > -1 || $.inArray(174009,resp.unsupport) > -1){//不支持getUserMedia方法或者url转换
                    //IM.Check_usermedie_isDisable();//拍照、录音、音视频呼叫都不支持
    
                }else if($.inArray(174007,resp.unsupport) > -1){//不支持发送附件
                    IM.SendFile_isDisable();
    
                }else if($.inArray(174008,resp.unsupport) > -1){//不支持音视频呼叫，音视频不可用
                    //IM.SendVoiceAndVideo_isDisable();
                    
                };
            }else if(174001 == resp.code){// 不支持HTML5
                var r = confirm(resp.msg);
                if (r == true || r == false) {
                    window.close();
                }
            }else if(170002 == resp.code){//缺少必须参数
                console.log("错误码：170002,错误码描述"+resp.msg);
            } else {
                console.log('未知状态码');
            };
            IM._Notification = window.Notification || window.mozNotification || window.webkitNotification
                    || window.msNotification || window.webkitNotifications;
	        if(!!IM._Notification){
	            IM._Notification.requestPermission(function (permission) {
	                if (IM._Notification.permission !== "granted") {
	                    IM._Notification.permission = "granted";
	                }
	            });
	        }
        },

        /**
         * 初始化一些页面需要绑定的事件
         */
        initEvent : function() {
            $('#im_send_content').bind('paste', function() {
                                IM.DO_pre_replace_content();
                            });
			
			// 设置光标位置
			function placeCaretAtEnd(el) {
				el.focus();
				if (typeof window.getSelection != "undefined"
					&& typeof document.createRange != "undefined") {
					var range = document.createRange();
					range.selectNodeContents(el);
					range.collapse(false);
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (typeof document.body.createTextRange != "undefined") {
					var textRange = document.body.createTextRange();
					textRange.moveToElementText(el);
					textRange.collapse(false);
					textRange.select();
				}
			}
			$('#im_send_content').keydown(function(e) {
				if (e.which == 13) {
					if (e.ctrlKey) {
						var ic = $('#im_send_content');
						var s = ic.html();
						ic.html(s+"<br/>&nbsp;");//空格光标才会移到下一行
						placeCaretAtEnd(ic.get(0));
					} else {
						IM.DO_sendMsg();
					}
					e.preventDefault();
				}
			});
        },

        /**
         * 监控键盘
         * 
         * @param event
         * @constructor
         */
        _keyCode_1 : 0,
        _keyCode_2 : 0,
        EV_keyCode : function(event) {
            IM._keyCode_1 = IM._keyCode_2;
            IM._keyCode_2 = event.keyCode;
            // 17=Ctrl 13=Enter  16=shift 50=@
            
            if (17 == IM._keyCode_1 && 13 == IM._keyCode_2) {
                if ('none' == $('#navbar_login').css('display')) {
                    //IM.DO_sendMsg();
                }
            } /*else if (17 != IM._keyCode_1 && 13 == IM._keyCode_2) {
                if ('block' == $('#navbar_login').css('display')) {
                    IM.DO_login();
                }
            }*/
        },
        
        DO_login : function() {
            console.log("DO_login");
            
            var user_account = "";
            var pwd = "";
            if(IM._loginType == 1){
            	user_account = $('#navbar_user_account').val();
            	if (IM.isNull(user_account)) {
                    alert('请填写手机号后再登录');
                    return;
                }
            }else if(IM._loginType == 3){
            	user_account = $('#voip_account').val();
            	pwd = $('#voip_pwd').val();
            	if (IM.isNull(user_account) || IM.isNull(pwd)) {
                    alert('用户名与密码不能为空!');
                    return;
                }
            }
            //校验登陆格式
            if(user_account.length > 128){
                alert("长度不能超过128");
                return;
            }
            var regx1 = /^[^g|G].*$/;//不能以g开头
            if(regx1.exec(user_account) == null){ 
                alert("不能以g或者G开头");
                return;
            }
            if(user_account.indexOf("@")>-1){
                var regx2 = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                if(regx2.exec(user_account) == null){
                    alert("用户名只能是数字或字母，如果使用邮箱，请检查邮箱格式");
                    return;
                }
            }else{
                var regx3 = /^[a-zA-Z0-9_-]+$/;
                if(regx3.exec(user_account) == null){
                    alert("用户名只能是数字或字母")
                    return;
                }
            }
            $('#navbar_user_account').attr("readonly", "readonly");

            IM._login(user_account,pwd);
        },

        /**
         * 正式处理登录逻辑，此方法可供断线监听回调登录使用 获取时间戳，获取SIG，调用SDK登录方法
         * 
         * @param user_account
         * @param pwd 密码
         * @private
         */
        _login : function(user_account,pwd) {
            var timestamp = IM._getTimeStamp();
            
			//没有服务器获取sig值时，可以使用如下代码获取sig
			//var appToken = '';//使用是赋值为应用对应的appToken
			var sig = hex_md5(IM._appid + user_account + timestamp + IM._apptoken);
			IM.EV_login(user_account, pwd, sig, timestamp);
        },

        /**
         * 事件，登录 去SDK中请求登录
         * 
         * @param user_account
         * @param sig
         * @param timestamp --
         *            时间戳要与生成SIG参数的时间戳保持一致
         * @constructor
         */
        EV_login : function(user_account,pwd, sig, timestamp) {
            console.log("EV_login");
			
			IM._login_sig = sig;//登录有效标记，临时用
			
            var loginBuilder = new RL_YTX.LoginBuilder();
            loginBuilder.setType(IM._loginType);
            loginBuilder.setUserName(user_account);
            if(1 == IM._loginType){//1是自定义账号，3是voip账号
                loginBuilder.setSig(sig);
            }else{
                loginBuilder.setPwd(pwd);
            }
            loginBuilder.setTimestamp(timestamp);
            
            RL_YTX.login(loginBuilder, function(obj) {
                console.log("EV_login succ...");
                
                //自动更新用户信息; jxstar 0-女 1-男; IM 2-女 1-男
				var se = IM.getSession();
				//if (se.ismodify == '1') {
					var uib = new RL_YTX.UploadPersonInfoBuilder(se.user_name, (se.sex=='0' ? '2' : '1'), null, null);
					RL_YTX.uploadPerfonInfo(uib, function(obj){}, function(obj) {
			            alert("login1 错误码："+obj.code+"; 错误描述："+obj.msg)
			        });
				//}
		    	 
                IM._user_account = user_account;
                IM._username = se.user_name;
                // 注册PUSH监听
                IM._onMsgReceiveListener = RL_YTX.onMsgReceiveListener(
                        function(obj) {
                            IM.EV_onMsgReceiveListener(obj);
                        });
                
                // 服务器连接状态变更时的监听
                IM._onConnectStateChangeLisenter = RL_YTX.onConnectStateChangeLisenter(function(obj) {
                            // obj.code;//变更状态 1 断开连接 2 重练中 3 重练成功 4 被踢下线 5
                            // 断线需要人工重连
                            if (1 == obj.code) {
                                console.log('onConnectStateChangeLisenter obj.code:'
                                                + obj.msg);
                            } else if (2 == obj.code) {
                                IM.HTML_showAlert('alert-warning',
                                        '网络状况不佳，正在试图重连服务器', 10 * 60 * 1000);
                            } else if (3 == obj.code) {
                                IM.HTML_showAlert('alert-success', '连接成功');
                            } else if (4 == obj.code) {
                                IM.DO_logout();
                                alert(obj.msg);
                            } else if (5 == obj.code) {
                                IM.HTML_showAlert('alert-warning',
                                        '网络状况不佳，正在试图重连服务器');
                                IM._login(IM._user_account);
                            } else {
                                console.log('onConnectStateChangeLisenter obj.code:'
                                                + obj.msg);
                            }
                        });
                
                IM._onMsgNotifyReceiveListener = RL_YTX.onMsgNotifyReceiveListener(function(obj){
	                if(obj.msgType == 21 ){//阅后即焚：接收方已删除阅后即焚消息
		                console.log("接收方已删除阅后即焚消息obj.msgId="+obj.msgId);
		                var id = obj.sender+"_"+obj.msgId;
		                $(document.getElementById(id)).remove();
	                }
                });
                $('#navbar_user_account').removeAttr("readonly");

                $('#navbar_login').hide();
                $('#navbar_login_show').show();
                IM.EV_getMyInfo();
                IM.HTML_LJ_none();

                // 登录后拉取未读过的消息--（该方式已弃用）
               /* if (IM._local_historyver <= parseInt(obj.historyver)
                        && parseInt(obj.historyver) < parseInt(obj.version)) {
                    IM._local_historyver = parseInt(obj.historyver)
                    IM.EV_syncMsg(parseInt(obj.historyver) + 1, obj.version);
                }*///逻辑修改为sdk自动获取，demo层的入口是RL_YTX.onMsgReceiveListener
            }, function(obj) {
                $('#navbar_user_account').removeAttr("readonly");

                alert("login2 错误码： " + obj.code+"; 错误描述："+obj.msg);
            });
        },

        /**
         * 事件，登出
         * 
         * @constructor
         */
        EV_logout : function() {
            console.log("EV_logout");
            IM.DO_logout();
            RL_YTX.logout(function() {
                        console.log("EV_logout succ...");
                    }, function(obj) {
                        alert("loginout 错误码： " + obj.code+"; 错误描述："+obj.msg);
                    });
        },

        /**
         * 登出
         * 
         * @constructor
         */
        DO_logout : function() {
            // 销毁PUSH监听
            IM._onMsgReceiveListener = null;
            // 注册客服消息监听
            IM._onDeskMsgReceiveListener = null;
            // 销毁注册群组通知事件监听
            IM._noticeReceiveListener = null;
            // 服务器连接状态变更时的监听
            IM._onConnectStateChangeLisenter = null;
            //呼叫监听
            IM._onCallMsgListener = null;
            //阅后即焚监听
            IM._onMsgNotifyReceiveListener = null;
            $("#fireMessage").removeClass("active");
            // 清理左侧数据
            $('#im_contact_list').empty();
            // 清理右侧数据
            $('#im_content_list').empty();

            // 隐藏图片层
            IM.HTML_pop_photo_hide();
            
            // 隐藏拍照层
            IM.HTML_pop_takePicture_hide();
            
            //隐藏音视频呼叫遮罩层
            //$("#pop_videoView").hide();
            
            //隐藏录音遮罩层，停掉录音流
            //$("#pop_recorder").hide();

            // 隐藏群组详情页面
            IM.HTML_pop_hide();

            // 隐藏提示框
            IM.HTML_closeAlert('all');

            // 联系人列表切换到沟通
            IM.DO_choose_contact_type('C');

            $('#navbar_login').show();
            $('#navbar_login_show').hide();
            IM.HTML_LJ_block('black');
        },

        /**
         * 事件，push消息的监听器，被动接收信息
         * 消息格式： "version":37,"msgType":1,"msgContent":"ss","msgSender":"jxstar-958-594","sessionId":"jxstar-958-594","msgReceiver":"jxstar","msgDateCreated":"1475655296421","senderNickName":"jxstar-958-594","mcmEvent":0,"msgId":"1475655296421|37"
         * @param obj
         * @constructor
         */
        EV_onMsgReceiveListener : function(obj) {
            console.log('Receive message :' + JSON.stringify(obj));
          
          	IM.DO_choose_contact_type('C');
          
            IM.DO_push_createMsgDiv(obj);
            if(document.getElementById("isRing").checked){
	            document.getElementById('im_ring').play();
            }
        },

        /**
         * 事件，发送消息
         * 
         * @param msgid
         * @param text
         * @param receiver
         * @param isresend
         * @constructor
         */
        EV_sendTextMsg : function(oldMsgid, text, receiver, isresend) {
            console.log('send Text message: receiver:[' + receiver
                    + ']...connent[' + text + ']...');
            
            var obj = new RL_YTX.MsgBuilder();
            obj.setText(text);
            obj.setType(1);
            obj.setReceiver(receiver);
            if($("#fireMessage").attr("class").indexOf("active")>-1){//domain
                obj.setDomain("fireMessage");
            };
            var msgId = RL_YTX.sendMsg(obj, function(obj) {
                        setTimeout(function() {
                                    $(document.getElementById(receiver + '_' + obj.msgClientNo)).find('span[imtype="resend"]').css('display', 'none');
                                    console.log('send Text message succ');
                                    if(isresend){
                                        var msg = $(document.getElementById(receiver + '_' + obj.msgClientNo));
                                        $('#im_content_list').append(msg.prop("outerHTML"));
                                        msg.remove();// 删掉原来的展示
                                    };
                                }, 300)
                    }, function(obj) {
                        setTimeout(function() {
                            var msgf = $(document.getElementById(receiver + '_' + obj.msgClientNo));
                            if(msgf.find('pre [msgtype="resendMsg"]').length == 0){
                                var resendStr = '<pre msgtype="resendMsg" style="display:none;">'+text+'</pre>'
                                msgf.append(resendStr);
                            }
                          
                            msgf.find('span[imtype="resend"]').css('display', 'block');
                            alert("sendmsg 错误码： " + obj.code+"; 错误描述："+obj.msg);
                            }, 300)
                    });
            $(document.getElementById(receiver + '_' + oldMsgid)).attr("id",receiver + "_" + msgId);
        },

        /**
         * 事件，重发消息
         * 
         * @param id
         *            右侧展示模块元素的id
         * 
         * @constructor
         */
        EV_resendMsg : function(obj) {
            var msg = $(obj.parentElement);
            // 消息类型1:文本消息 2：语音消息 3：视频消息 4：图片消息 5：位置消息 6：文件
            var msgtype = msg.attr('im_msgtype');
            var receiver = msg.attr('content_you');
            var oldMsgid = msg.attr('id').substring(msg.attr('id').indexOf("_")+1);
       
            if (1 == msgtype) {// 文本消息
                msg.find('span[imtype="resend"]').css('display', 'none');
                var text = msg.find('pre[msgtype="resendMsg"]').html();
                console.log('resend message: text[' + text + ']...receiver:['
                        + receiver + ']');
                
                if (IM._contact_type_m == contact_type) {
                    IM.EV_sendMcmMsg(oldMsgid, text, content_you,true);
                }else{
                    IM.EV_sendTextMsg(oldMsgid, text, receiver,true);
                }
               
            } else if (4 == msgtype || 6 == msgtype) {
                // 查找当前选中的contact_type值 1、IM上传 2、MCM上传
                var contact_type = msg.attr('content_type');
                var oFile = msg.find('input[imtype="msg_attach_resend"]')[0];
                if (!!oFile) {
                    oFile = oFile.files[0];
                    console.log('resend Attach message: msgtype[' + msgtype
                            + ']...receiver:[' + receiver + ']');
                    if (IM._contact_type_m == contact_type) {
                        IM.EV_sendToDeskAttachMsg(oldMsgid, oFile, msgtype,
                                receiver,true);
                    } else {
                        IM.EV_sendAttachMsg(oldMsgid, oFile, msgtype, receiver,true);
                    }
                } else {
                    oFile = msg.find("object").val();
                    console.log('resend Attach message: msgtype['+ msgtype + ']...receiver:[' + receiver+ ']');
                    if (IM._contact_type_m == contact_type) {
                        IM.EV_sendToDeskAttachMsg(oldMsgid, oFile,
                                msgtype, receiver,true);
                    } else {
                        IM.EV_sendAttachMsg(oldMsgid, oFile,
                                msgtype, receiver,true);
                    };
                };

            }else if(2 == msgtype){//语音

                var oFile = msg.find("object").val();
                if (IM._contact_type_m == contact_type) {
                    IM.EV_sendToDeskAttachMsg(oldMsgid, oFile,
                            msgtype, receiver,true);
                } else {
                    IM.EV_sendAttachMsg(oldMsgid, oFile,
                            msgtype, receiver,true);
                };
            } else {
                console.log('暂时不支持附件类型消息重发');
            }
        },

        /**
         * 发送附件
         * 
         * @param msgid
         * @param file --
         *            file对象
         * @param type --
         *            附件类型 2 语音消息 3 视频消息 4 图片消息 5 位置消息 6 文件消息
         * @param receiver --
         *            接收者
         * @constructor
         */
        EV_sendAttachMsg : function(oldMsgid, file, type, receiver,isresend) {
            console.log('send Attach message: type[' + type + ']...receiver:['+ receiver + ']'+'fileName:['+file.fileName+']');
            var obj = new RL_YTX.MsgBuilder();
            obj.setFile(file);
            obj.setType(type);
            obj.setReceiver(receiver);
            if($("#fireMessage").attr("class").indexOf("active")>-1){//domain
                obj.setDomain("fireMessage");
            };
            var oldMsg = $(document.getElementById(receiver + '_' + oldMsgid));
            oldMsg.attr('msg', 'msg');
            oldMsg.css('display', 'block');
            if(4 == type){
                oldMsg.attr('im_carousel', 'real');
                oldMsg.attr('im_msgtype', '4');
            }

            $('#im_content_list').scrollTop($('#im_content_list')[0].scrollHeight);

            var msgid = RL_YTX.sendMsg(obj, function(obj) {
                        setTimeout(function() {
                                    var id = receiver + "_" + obj.msgClientNo;
                                    var msg = $(document.getElementById(id));
                                    msg.find('span[imtype="resend"]').css(
                                            'display', 'none');
                                    msg.find('div[class="bar"]').parent().css(
                                            'display', 'none');
                                    msg.find('span[imtype="msg_attach"]').css(
                                            'display', 'block');
                                    console.log('send Attach message succ');
                                    if(isresend){
                                        $('#im_content_list').append(msg.prop("outerHTML"));
                                        msg.remove();// 删掉原来的展示
                                    }
                                }, 100)
                    }, function(obj) {// 失败
                        setTimeout(function() {
                                    var msg = $(document.getElementById(receiver + "_" + obj.msgClientNo));
                                    msg.find('span[imtype="resend"]').css(
                                            'display', '');
                                    msg.find('div[class="bar"]').parent().css(
                                            'display', 'none');
                                    msg.find('span[imtype="msg_attach"]').css(
                                            'display', '');
                                    alert("sendattachmsg 错误码： " + obj.code+"; 错误描述："+obj.msg);
                                }, 100)
                    }, function(sended, total, msgId) {// 进度条
                        setTimeout(function() {
                                    var msg = $(document.getElementById(receiver + "_" + msgId));
                                    console.log('send Attach message progress:'
                                            + (sended / total * 100 + '%'));
                                    // sended;//已发送字节数
                                    // total;//总字节数
                                    if (sended < total) {
                                        msg.find('div[class="bar"]').css(
                                                'width',
                                                (sended / total * 100 + '%'));
                                    } else {
                                        msg.find('div[class="bar"]').parent()
                                                .css('display', 'none');
                                        msg.find('span[imtype="msg_attach"]')
                                                .css('display', 'block');
                                    };
                                }, 100)
                    });
            oldMsg.attr("id", receiver + '_' + msgid);
            if(file instanceof Blob){
	            oldMsg.find("object").val(file);
            }
        },

        /**
         * 发送附件
         * 
         * @param msgid
         * @param file --
         *            file对象
         * @param type --
         *            附件类型 2 语音消息 3 视频消息 4 图片消息 5 位置消息 6 文件消息
         * @param receiver --
         *            接收者
         * @constructor
         */
        EV_sendToDeskAttachMsg : function(oldMsgid, file, type, receiver,isresend) {
            console.log('send Attach message: type[' + type + ']...receiver:['
                    + receiver + ']');
            var obj = new RL_YTX.DeskMessageBuilder();
            obj.setFile(file);
            obj.setType(type);
            obj.setOsUnityAccount(receiver);
    
            if($("#fireMessage").attr("class").indexOf("active")>-1){//domain
                obj.setDomain("fireMessage");
            };
            var oldMsg = $(document.getElementById(receiver + '_' + oldMsgid));
            oldMsg.attr('msg', 'msg');
            oldMsg.css('display', 'block');
            $('#im_content_list').scrollTop($('#im_content_list')[0].scrollHeight);
            var msgid = RL_YTX.sendToDeskMessage(obj, function(obj) {// 成功
                        setTimeout(function() {
                                    var msg = $(document.getElementById(receiver + "_" + obj.msgClientNo));
                                    msg.find('span[imtype="resend"]').css(
                                            'display', 'none');
                                    msg.find('div[class="bar"]').parent().css(
                                            'display', 'none');
                                    msg.find('span[imtype="msg_attach"]').css(
                                            'display', 'block');
                                    msg.attr('msg', 'msg');
                                    console.log('send Attach message succ');
                                    if(isresend){
                                        $('#im_content_list').append(msg.prop("outerHTML"));
                                        msg.remove();// 删掉原来的展示
                                    }
                                }, 100);
                    }, function(obj) {// 失败
                        setTimeout(function() {
                                    var msg = $(document.getElementById(receiver + "_" + obj.msgClientNo));
                                    msg.find('span[imtype="resend"]').css(
                                            'display', 'block');
                                    msg.find('div[class="bar"]').parent().css(
                                            'display', 'none');
                                    msg.find('span[imtype="msg_attach"]').css(
                                            'display', 'block');
                                    alert("sendToDeskMessage 错误码：" + obj.code+"; 错误描述："+obj.msg);
                                }, 100);
                    }, function(sended, total, msgId) {// 进度条
                        setTimeout(function() {
                                    var msg = $(document.getElementById(receiver + "_" + msgId));
                                    console.log('send Attach message progress:'
                                            + (sended / total * 100 + '%'));
                                    // sended;//已发送字节数
                                    // total;//总字节数
                                    if (sended < total) {
                                        msg.find('div[class="bar"]').css(
                                                'width',
                                                (sended / total * 100 + '%'));
                                    } else {
                                        msg.find('div[class="bar"]').parent()
                                                .css('display', 'none');
                                        msg.find('span[imtype="msg_attach"]')
                                                .css('display', 'block');
                                    }
                                }, 100);
                    });
            oldMsg.attr("id", receiver + '_' + msgid);
        },

        /**
         * 事件，主动拉取消息
         * 
         * @param sv
         * @param ev
         * @constructor
         */
        EV_syncMsg : function(sv, ev) {
            var obj = new RL_YTX.SyncMsgBuilder();
            obj.setSVersion(sv);
            obj.setEVersion(ev);

            RL_YTX.syncMsg(obj, function(obj) {
                        alert("syncMsg 错误码： " + obj.code+"; 错误描述："+obj.msg);
                    });
        },

        /**
         * 事件，获取登录者个人信息
         * 
         * @constructor
         */
        EV_getMyInfo : function() {
            RL_YTX.getMyInfo(function(obj) {
                if (!!obj && !!obj.nickName) {
                    IM._username = obj.nickName;
                };
               
                $('#navbar_login_show > div > a.user-name').html(IM._username);
            }, function(obj) {
                if (520015 != obj.code) {
                    alert("getMyInfo 错误码： " + obj.code+"; 错误描述："+obj.msg);
                }
            });
        },

        getUnicodeCharacter : function(cp) {
            if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
                return String.fromCharCode(cp);
            } else if (cp >= 0x10000 && cp <= 0x10FFFF) {

                // we substract 0x10000 from cp to get a 20-bits number
                // in the range 0..0xFFFF
                cp -= 0x10000;

                // we add 0xD800 to the number formed by the first 10 bits
                // to give the first byte
                var first = ((0xffc00 & cp) >> 10) + 0xD800

                // we add 0xDC00 to the number formed by the low 10 bits
                // to give the second byte
                var second = (0x3ff & cp) + 0xDC00;

                return String.fromCharCode(first) + String.fromCharCode(second);
            }
        },

        /**
         * 添加PUSH消息，只做页面操作 供push和拉取消息后使用
         * 
         * @param obj
         * @constructor
         */
        DO_push_createMsgDiv : function(obj) {
            //判断是否是阅后即焚消息 
            var isFireMsg = false;
            if(IM._fireMessage == obj.msgDomain){
                isFireMsg = true;
            }
            if(document.getElementById("isFire").checked){
            	isFireMsg = true;
            }
            var b_isGroupMsg = ('g' == obj.msgReceiver.substr(0, 1));
            var you_sender = (b_isGroupMsg) ? obj.msgReceiver : obj.msgSender;
            var name = obj.senderNickName||obj.msgSenderNick||obj.msgSender;
            // push消息的联系人，是否是当前展示的联系人
            var b_current_contact_you = IM.DO_createMsgDiv_Help(you_sender,
                    name, b_isGroupMsg);

            // 是否为mcm消息 0普通im消息 1 start消息 2 end消息 3发送mcm消息
            var you_msgContent = obj.msgContent;
            var content_type = null;
            //var version = obj.version;//改版
            var version = obj.msgId;
            var time = obj.msgDateCreated;
            if (0 == obj.mcmEvent) {// 0普通im消息
                // 点对点消息，或群组消息
                content_type = (b_isGroupMsg)
                        ? IM._contact_type_g
                        : IM._contact_type_c;
                var msgType = obj.msgType;
                var str = '';

                //消息类型1:文本消息 2：语音消息 3：视频消息 4：图片消息 5：位置消息 6：文件
                if (1 == msgType) {

                    str = you_msgContent;//emoji.replace_unified(you_msgContent);
                    
                    if(isFireMsg){
                        str = '<pre fireMsg="yes">' + str + '</pre>';
                    }else{
                        str = '<pre>' + str + '</pre>';
                    }

                } else if (2 == msgType) {
					var url = obj.msgFileUrl;
					var fire = (isFireMsg) ? ' fireMsg="yes" ' : '';
					str = '<audio style="display:none" controls="controls">your browser does not surpport the audio element</audio>';
					str += '<button class="btn btn-default" '+ fire +' onclick="IM.DO_audio_play(this)" data="'+ url +'" ><i class="fa fa-microphone"></i><span style="padding-left:5px">点击播放</span></button>';
					str = '<p style="margin-top:10px">' + str + '</p>';
                } else if (3 == msgType) {// 3：视频消息
             
	                var urlShow = obj.msgFileUrlThum;//小视频消息的缩略图地址
	                var urlReal = obj.msgFileUrl;
	                var windowWid = $(window).width();
	                var imgWid = 0;
	                var imgHei = 0;
	                if (windowWid < 666) {
	                        imgWid = 100;
	                        imgHei = 150;
                    } else {
                        imgWid = 150;
                        imgHei = 200;
                    };
                    var num = obj.msgFileSize;
                    var size = 0;
                    if(num < 1024){
                        size = num + "byte";
                    }else if(num/1024 >= 1 && num/Math.pow(1024,2) <1){
                        size = Number(num/1024).toFixed(2) + "KB";
                    }else if(num/Math.pow(1024,2) >= 1 && num/Math.pow(1024,3) <1){
                        size = Number(num/Math.pow(1024,2)).toFixed(2) + "MB";
                    }else if(num/Math.pow(1024,3) >= 1 && num/Math.pow(1024,4) <1){
                        size = Number(num/Math.pow(1024,3)).toFixed(2)+"G";
                    };
                    if(isFireMsg){
                        str = '<div style="display:inline"><img fireMsg="yes" onclick="IM.DO_pop_phone(\''+you_sender+'\', \'' 
                            + version + '\')" videourl="'+urlReal+'" src="'+urlShow+'" style="max-width:'
                            + imgWid + 'px;max-height:' + imgHei + 'px;display:none;cursor:pointer" />'
                            + '<span style="font-size: small;margin-left:15px;">'+size+'</span></div>';
                    }else{
                        str = '<div style="display:inline"><img onclick="IM.DO_pop_phone(\''+you_sender+'\', \'' 
                            + version + '\')" videourl="'+urlReal+'" src="'+urlShow+'" style="cursor:pointer;max-width:'
                            + imgWid + 'px;max-height:' + imgHei + 'px;" />'
                            + '<span style="font-size: small;margin-left:15px;">'+size+'</span></div>';
                    }
                    
                } else if (4 == msgType) {// 4：图片消息
                    var url = obj.msgFileUrl;
                    var windowWid = $(window).width();
                    var imgWid = 0;
                    var imgHei = 0;
                    if (windowWid < 666) {
                        imgWid = 100;
                        imgHei = 150;
                    } else {
                        imgWid = 150;
                        imgHei = 200;
                    };
                    if(isFireMsg){
                        var str = '<img fireMsg="yes" src="' + url + '" style="cursor:pointer;max-width:'
                            + imgWid + 'px; max-height:' + imgHei
                            + 'px;display:none" onclick="IM.DO_pop_phone(\'' + you_sender
                            + '\', \'' + version + '\')"/>';
                    }else{
                        var str = '<img src="' + url + '" style="cursor:pointer;max-width:'
                            + imgWid + 'px; max-height:' + imgHei
                            + 'px;" onclick="IM.DO_pop_phone(\'' + you_sender
                            + '\', \'' + version + '\')"/>';
                    }
                   
                } else if (5 == msgType) {// 位置消息
                    //str = '你接收了一条位置消息...';
                   var jsonObj = eval('(' + you_msgContent + ')');
                    var lat = jsonObj.lat; //纬度
                    var lon = jsonObj.lon; //经度
                    var title = jsonObj.title; //位置信息描述
                    var windowWid = $(window).width();
                    var imgWid = 0;
                    var imgHei = 0;
                    if (windowWid < 666) {
                        imgWid = 100;
                        imgHei = 150;
                    } else {
                        imgWid = 150;
                        imgHei = 200;
                    };
                    var str = '<img src="img/baidu.png" style="cursor:pointer;max-width:'
                    + imgWid + 'px; max-height:' + imgHei
                    + 'px;" onclick="IM.DO_show_map(\'' + lat
                    + '\', \'' + lon + '\', \'' + title + '\')"/>'; 
                    
                    
                } else if (6 == msgType) {// 文件
                    var url = obj.msgFileUrl;
                    var num = obj.msgFileSize;
                    var size = 0;
                    if(num < 1024){
                        size = num + "byte";
                    }else if(num/1024 >= 1 && num/Math.pow(1024,2) <1){
                        size = Number(num/1024).toFixed(2) + "KB";
                    }else if(num/Math.pow(1024,2) >= 1 && num/Math.pow(1024,3) <1){
                        size = Number(num/Math.pow(1024,2)).toFixed(2) + "MB";
                    }else if(num/Math.pow(1024,3) >= 1 && num/Math.pow(1024,4) <1){
                        size = Number(num/Math.pow(1024,3)).toFixed(2)+"G";
                    };
                    
                    var fileName = obj.msgFileName;
                   
                    if(isFireMsg){
                        str = '<div style="display:inline"><a fireMsg="yes" href="' + url + '" target="_blank">'
                            + '<span>'
                            + '<img style="width:32px; height:32px; margin-right:5px; margin-left:5px;" src="img/attachment_icon.png" />'
                            + '</span>' + '<span>' + fileName + '</span>' //+ '<span style="font-size: small;margin-left:15px;">'+size+'</span>'
                            + '</a>'+ '<span style="font-size: small;margin-left:15px;">'+size+'</span></div>';
                    }else{
                        str = '<div style="display:inline"><a href="' + url + '" target="_blank">'
                            + '<span>'
                            + '<img style="width:32px; height:32px; margin-right:5px; margin-left:5px;" src="img/attachment_icon.png" />'
                            + '</span>' + '<span>' + fileName + '</span>' //+ '<span style="font-size: small;margin-left:15px;">'+size+'</span>'
                            + '</a>'+ '<span style="font-size: small;margin-left:15px;">'+size+'</span></div>';
                    }
                }

                IM.HTML_pushMsg_addHTML(msgType, you_sender, version,
                        content_type, b_current_contact_you, name, str);
	            var isAlert = document.getElementById("isAlert").checked;
	           //桌面提醒通知
	            if(isAlert){
	                IM.DO_deskNotice(you_sender,name,you_msgContent,msgType,isFireMsg,false);
	            }
                
            } else {
                alert('暂没有开通其他类型的消息：' + obj.mcmEvent);
            }
        },
      
        /**
         * 展示阅后即焚消息
         */
        DO_showFireMsg : function(id,msgtype){
        	var play_time = 10;
        	if(msgtype == 2){//录音
        		var dom = document.getElementById(id).getElementsByTagName("audio")[0];
        		dom.play();
        		/*避免因为卡顿引起的异常：例如，本来需要5秒播放完成，
        		但是由于卡顿播放了7秒，这时会导致语音文件还没播放完成就销毁的情况
        		解决方式：播放长度 + 3 */
        		play_time = Math.ceil(dom.duration) + 1;
        	}
            $($(document.getElementById(id)).children()[2]).hide();
            $($(document.getElementById(id)).children()[1]).show();
            var timerStr = $($(document.getElementById(id)).children()[0]).prop("outerHTML");
            $($(document.getElementById(id)).children()[0]).remove();
            timerStr += '<span class="pull-right">倒计时<code id="fireMsgtimer'+id+'">'+play_time+'</code>秒</span>';
            $(document.getElementById(id)).prepend(timerStr);
            var timerTab = document.getElementById("fireMsgtimer"+id);
            function fireMsgTimer(){
                if(((timerTab.innerHTML * 1 - 1)+"").length>1){
                    timerTab.innerHTML = ""+timerTab.innerHTML * 1 - 1;
                }else{
                    timerTab.innerHTML = "0"+(timerTab.innerHTML * 1 - 1);
                }
                if(timerTab.innerHTML == "00") {
                    $(document.getElementById(id)).remove();
                    window.clearInterval(num);
                    return false;
                }
            };
            var num=window.setInterval(fireMsgTimer,1000);
            var msgid = id.substring(id.indexOf("_")+1);
            var deleteReadMsgBuilder = new RL_YTX.DeleteReadMsgBuilder();
            deleteReadMsgBuilder.setMsgid(msgid);
            RL_YTX.deleteReadMsg(deleteReadMsgBuilder,function(obj){
                console.log("阅后即焚消息通知主叫侧成功");
            },function(obj){
                alert("deleteReadMsg 错误码： " + obj.code+"; 错误描述："+obj.msg);
            });
        },
		
		//由于html5 audio不支持amr格式，android又是amr，所以统一采用第三方控件播放amr音频
		DO_audio_play : function(obj) {
			var url = obj.getAttribute("data");
			console.log('DO_audio_play url='+url);
			
			var geturl = function() {
				if (IM._amr2wavurl.substr(0, 4) != 'http') {
					var s = window.location.href.split('/cloud/');
					return s[0] + IM._amr2wavurl;
				} else {
					return IM._amr2wavurl;
				}
			};
			
			var e = encodeURIComponent;
			var nurl = geturl()+'?amrpath='+e(url);
			var audio = $(obj).parent().find('audio').get(0);
			
			audio.onloadstart = function(){
				$(obj).find('span').get(0).innerHTML = '准备播放...';
			};
			audio.onplaying = function(){
				$(obj).find('span').get(0).innerHTML = '正在播放...';
			};
			audio.onended = function(){
				$(obj).find('span').get(0).innerHTML = '点击播放';
			};
			audio.onerror = function(e){
				IM.HTML_showAlert('alert-error', '播放失败: '+JSON.stringify(e));
			};
			
			audio.src = nurl;
			audio.play();//pause()
		},
        
        DO_pop_phone : function(you_sender, version,obj) {
            var msgId ='';
            if(obj){
                msgId = $(obj).parent().parent()[0].id;
            }else{
	            msgId = you_sender + '_' + version;
            }
            IM._msgId = msgId;

            var msg = $(document.getElementById(msgId));

            var videoUrl = msg.find('img').attr("videourl");
            var str = '';
            var showHei = $("#lvjing").height() - 50;//客户端竖屏视频需要拖动滚动条才能露出控制按钮，所以减去50px
            if(!!videoUrl){
            	 
      	    	var type = videoUrl.substring(videoUrl.lastIndexOf(".")+1);
                
                str= '<video controls="controls" preload="auto" height="'+showHei+'px" style="position:relative;top:-20px;left:0px;">'+
                             '<source src="'+videoUrl+'" type="video/'+type+'" /></video>';
          	      
            }else{
                var url = msg.find('img').attr('src');
                str = '<img src="'+ url +'" />';
            };
            $("#carousels").empty();
            $("#carousels").append(str);
  
            IM.HTML_pop_photo_show();
        },
        
		/**
         * 群组pop层展示
         * 
         * @constructor
         */
        HTML_pop_photo_show : function() {
            IM.HTML_LJ_block('photo');

            var navbarHei = $('#navbar').height();
            var lvjingHei = $('#lvjing').height();
            var pop_photo = $('#pop_photo');

            pop_photo.find('img').css('max-height', lvjingHei - 30).css(
                    'max-width', $(window).width() - 50);
            pop_photo.css('top', navbarHei);

            var d = $(window).scrollTop();
            // a+b=c
            var a = parseInt(pop_photo.find('div[imtype="pop_photo_top"]')
                    .css('margin-top'));
            var b = parseInt(pop_photo.find('div[imtype="pop_photo_top"]')
                    .css('height'));
            var c = $(window).height();

            if (a + b >= c) {
                d = 0;
            } else if (d + b >= c) {
                d = c - b - 20;
            }
            pop_photo.find('div[imtype="pop_photo_top"]').css('margin-top', d);
            $(window).scrollTop(d);

            pop_photo.show();
        },
        
        /**
         * lat 纬度
         * lon 经度
         * title 位置信息描述
         */
        DO_show_map : function(lat,lon,title ){
        	$("#im_body").append("<div id='baiduMap' style='z-index:888899; margin-left: 10%;margin-right:10%; height: 550px; width: 80%;'></div>");
        	$("#carousels").empty();
    		var map = new BMap.Map("baiduMap"); // 创建地图实例 
        	var point = new BMap.Point(lon,lat); // 创建点坐标 
        	var marker = new BMap.Marker(point);        // 创建标注    
        	map.addOverlay(marker); 
        	map.centerAndZoom(point, 15);
        	var opts = {width : 200,
        			 height: 100, 
        			 enableMessage:true//设置允许信息窗发送短息
        			};
			var infoWindow = new BMap.InfoWindow(title,opts);  // 创建信息窗口对象 
			marker.addEventListener("click", function(){          
				map.openInfoWindow(infoWindow,point); //开启信息窗口
			});
			
    		IM._baiduMap = $("#baiduMap");
        	$("#carousels").append(IM._baiduMap);
        	$("#baiduMap").show();
            IM.HTML_pop_photo_show();
        },

        /**
         * 向上选择图片，同一个对话框内
         * 
         * @constructor
         */
        DO_pop_photo_up : function() {
            
            var msg = $(document.getElementById(IM._msgId));
            if (msg.length < 1) {
                return;
            };
            
            var index = -1;
            msg.parent().find('div[msg="msg"][im_carousel="real"]:visible').each(
            function() {
                index++;
                if (IM._msgId == $(this).attr('id')) {
                    index--;
                    return false;
                };
            });
            if (index < 0) {
                return;
            };
            var prevMsg = msg.parent().children('div[msg="msg"][im_carousel="real"]:visible').eq(index);
            if (prevMsg.length < 1) {
                return;
            };
            var str ='';
            var showHei = $("#lvjing").height() - 50;//客户端竖屏视频需要拖动滚动条才能露出控制按钮，所以减去50px
            if(prevMsg.attr("im_msgtype") == 4){
         
                var src = prevMsg.find('img').attr('src');
                str = '<img src="'+ src +'" />';
            }else{
                var videoUrl = prevMsg.find('img').attr("videourl");
                var type = videoUrl.substring(videoUrl.lastIndexOf(".")+1);
                
                str= '<video controls="controls" preload="auto" height="'+showHei+'px" style="position:relative;top:-20px;left:0px;">'+
                     '<source src="'+videoUrl+'" type="video/'+type+'" /></video>';
            };
            IM._msgId = prevMsg.attr('id');
            $("#carousels").empty();
            $("#carousels").append(str);
            if($("#carousels").find("img")){
                $("#carousels").find("img").css('max-height', (showHei - 30)+"px").css(
                    'max-width', ($(window).width() - 50)+"px");
            };
            var q=1;
            
        },

        /**
         * 向下选择图片,同一个对话框内
         * 
         * @constructor
         */
        DO_pop_photo_down : function() {

            var msg = $(document.getElementById(IM._msgId));
            if (msg.length < 1) {
                return;
            }

            var index = -1;
            msg.parent().find('div[msg="msg"][im_carousel="real"]:visible').each(
                    function() {
                        index++;
                        if (IM._msgId == $(this).attr('id')) {
                            index++;
                            return false;
                        }
                    });
            if (index < 0) {
                return;
            }
            var nextMsg = msg.parent().children('div[msg="msg"][im_carousel="real"]:visible').eq(index);
            if (nextMsg.length < 1) {
                return;
            }
            var showHei = $("#lvjing").height() - 50;//客户端竖屏视频需要拖动滚动条才能露出控制按钮，所以减去50px
            if(nextMsg.attr("im_msgtype") == 4){
                var src = nextMsg.find('img').attr('src');
                 str = '<img src="'+ src +'" />';
            }else{
                var videoUrl = nextMsg.find('img').attr("videourl");
                var type = videoUrl.substring(videoUrl.lastIndexOf(".")+1);
                
                str= '<video controls="controls" preload="auto" height="'+showHei+'px" style="position:relative;top:-20px;left:0px;">'+
                     '<source src="'+videoUrl+'" type="video/'+type+'" /></video>';
            };
            IM._msgId = nextMsg.attr('id');
            $("#carousels").empty();
            $("#carousels").append(str);
            if($("#carousels").find("img")){
                $("#carousels").find("img").css('max-height', (showHei - 30)+"px").css(
                    'max-width', ($(window).width() - 50)+"px");
            }
            
        },

        DO_checkPopShow : function(groupId) {
            if ($('#pop_group_' + groupId).length <= 0) {
                return false;
            }
            var display = $('#pop').css("display");
            if (display != 'block') {
                return false;
            }
            return true;
        },

        /**
         * 删除联系人，包括左侧和右侧
         * 
         * @param id
         * @constructor
         */
        HTML_remove_contact : function(id) {
            // 删除左侧联系人列表
            $(document.getElementById('im_contact_' + id)).remove();
            // 删除右侧相应消息
            $('#im_content_list').find('div[content_you="' + id + '"]').each(
                    function() {
                        $(this).remove();
                    });
        },

        /**
         * 添加消息列表的辅助方法 消息的联系人(you_sender)，是否是当前展示的联系人
         * 并处理左侧联系人列表的展示方式（新增条数，及提醒数字变化）
         * 
         * @param you_sender
         * @param b_isGroupMsg --
         *            true:group消息列表 false:点对点消息列表
         * @returns {boolean} -- true:是当前展示的联系人；false:不是
         * @constructor
         */
        DO_createMsgDiv_Help : function(you_sender, name, b_isGroupMsg) {
            // 处理联系人列表，如果新联系人添加一条新的到im_contact_list，如果已经存在给出数字提示
            var b_current_contact_you = false; // push消息的联系人(you_sender)，是否是当前展示的联系人
            $('#im_contact_list').find('li').each(function() {
                        if (you_sender == $(this).attr('contact_you')) {
                            if ($(this).hasClass('active')) {
                                b_current_contact_you = true;
                            }
                        }
                    });

            // 新建时判断选中的contact_type是那个然后看是否需要显示
            var current_contact_type = IM.HTML_find_contact_type();

            var isShow = false;
            if (IM._contact_type_g == current_contact_type && b_isGroupMsg) {
                isShow = true;
            }
            if (IM._contact_type_c == current_contact_type && !b_isGroupMsg) {
                isShow = true;
            }

            IM.HTML_addContactToList(you_sender, name, (b_isGroupMsg)
                            ? IM._contact_type_g
                            : IM._contact_type_c, false, isShow, false, null,
                    null, null);

            return b_current_contact_you;
        },

        /**
         * 查找当前选中的contact_type值
         * 
         * @returns {*}
         * @constructor
         */
        HTML_find_contact_type : function() {
            // 在群组列表中添加群组项
            var current_contact_type = null;
            $('#im_contact_type').find('li').each(function() {
                        if ($(this).hasClass('active')) {
                            current_contact_type = $(this).attr('contact_type');
                        }
                    });
            return current_contact_type;
        },

        /**
         * 样式，push监听到消息时添加右侧页面样式
         * 
         * @param msgtype --
         *            消息类型1:文本消息 2：语音消息 3：视频消息 4：图片消息 5：位置消息 6：文件
         * @param you_sender --
         *            对方帐号：发出消息时对方帐号，接收消息时发送者帐号
         * @param version --
         *            消息版本号，本地发出时为long时间戳
         * @param content_type --
         *            C G or M
         * @param b --
         *            是否需要展示 true显示，false隐藏
         * @param name --
         *            显示对话框中消息发送者名字
         * @param you_msgContent --
         *            消息内容
         * @constructor
         */
        HTML_pushMsg_addHTML : function(msgtype, you_sender, version,
                content_type, b, name, you_msgContent) {
            var carou = '';
            if(msgtype==4||msgtype==3){
                carou="real";
            };
            var str = '<div msg="msg" im_carousel="'+carou+'" im_msgtype="' + msgtype + '" id="'
                    + you_sender + '_' + version + '" content_type="'
                    + content_type + '" content_you="' + you_sender
                    + '" class="alert alert-left alert-info" style="display:'
                    + ((b) ? 'block' : 'none') + '">' 
                    +'<code style="max-width:70%;word-break:keep-all;text-overflow:ellipsis;overflow: hidden;">' + name
                    + ':</code>&nbsp;' + you_msgContent + '</div>';
            $('#im_content_list').append(str);
            if(you_msgContent.indexOf("fireMsg") > -1){//fireMsg="yes"
                var id = you_sender + "_" + version;
                $(document.getElementById(id)).find("code").next().hide();
                var windowWid = $(window).width();
                var imgWid = 0;
                var imgHei = 0;
                if (windowWid < 666) {
                    imgWid = 100;
                    imgHei = 150;
                } else {
                    imgWid = 150;
                    imgHei = 200;
                };
                var fireMsgStr = '<img style="cursor:pointer;max-width:'+imgWid+'px; max-height:'+imgHei+'px; margin-right:5px; margin-left:5px;" ' +
                        'src="img/fireMessageImg.png" onclick="IM.DO_showFireMsg(\''+ id +'\',\''+msgtype+'\')" />';
                $(document.getElementById(id)).append(fireMsgStr);
            }
            setTimeout(function() {
                        $('#im_content_list').scrollTop($('#im_content_list')[0].scrollHeight);
                    }, 100);

            // 右侧列表添加数字提醒
            // TODO 后期要添加提醒数字时，记得要先拿到旧值，再+1后写入新建的列表中
            var current_contact = $(document.getElementById('im_contact_' + you_sender));
            if (!current_contact.hasClass('active')) {
                var warn = current_contact.find('span[contact_style_type="warn"]');
                if ('99+' == warn.html()) {
                    return;
                }
                var warnNum = parseInt((!!warn.html()) ? warn.html() : 0) + 1;
                if (warnNum > 99) {
                    warn.html('99+');
                } else {
                    warn.html(warnNum);
                }
                warn.show();
                //$(window.opener.imicon).find('span.badge').html(warnNum);
            }
            
            IM.HTML_updateShort(msgtype, you_msgContent, current_contact, version);
        },
        
        HTML_updateShort : function(msgtype, msg, curritem, version) {
        	//消息类型1:文本消息 2：语音消息 3：视频消息 4：图片消息 5：位置消息 6：文件
            var shorts = '';
            if (msgtype == 1) {
            	//格式有三种：<pre>消息</pre> <pre fireMsg="yes">消息</pre> <pre msgtype="content">消息</pre>
            	if (msg.indexOf('<pre>') > -1) {
            		shorts = msg.substr(5, msg.length - 11);
            	} else if (msg.indexOf('msgtype') > -1) {
            		shorts = msg.substr(23, msg.length - 29);
            	} else if (msg.indexOf('fireMsg') > -1) {
            		shorts = msg.substr(19, msg.length - 25);
            	} else {
            		shorts = msg
            	}
            } else if (msgtype == 2) {
            	shorts = '[语音]';
            } else if (msgtype == 3) {
            	shorts = '[视频]';
            } else if (msgtype == 4) {
            	shorts = '[图片]';
            } else if (msgtype == 5) {
            	shorts = '[位置]';
            } else if (msgtype == 6) {
            	shorts = '[文件]';
            } else {
            	shorts = you_msgContent;
            }
            //更新最近一条消息
            curritem.find('div.msg-body > p').html(shorts);
            
            //更新最近一次的时间
            var time = ''+version;
            if (time.indexOf('|') > -1) {
            	time = time.split('|')[0];
            }
            var d = (new Date()); 
            d.setTime(time);
			var st = d.format("yyyyMMddhhmmss");
			time = IM.shortTime(st);
			curritem.find('span.time').html(time);
        },
        
        HTML_pushMsg_addPreHTML : function(msgtype, you_sender, version,
                content_type, b, name, you_msgContent) {
            var carou = '';
            if(msgtype==4||msgtype==3){
                carou="real";
            };
            var str = '<div msg="msg" im_carousel="'+carou+'" im_msgtype="' + msgtype + '" id="'
                    + you_sender + '_' + version + '" content_type="'
                    + content_type + '" content_you="' + you_sender
                    + '" class="alert alert-left alert-info" style="display:'
                    + ((b) ? 'block' : 'none') + '">' + '<code style="max-width:70%;word-break:keep-all;text-overflow:ellipsis;overflow: hidden;">' + name
                    + ':</code>&nbsp;' + you_msgContent + '</div>';
            $('#im_content_list').prepend(str);

            setTimeout(function() {
                        $('#im_content_list').scrollTop($('#im_content_list')[0].scrollHeight);
                    }, 100);

            // 右侧列表添加数字提醒
            // TODO 后期要添加提醒数字时，记得要先拿到旧值，再+1后写入新建的列表中
            var current_contact = $(document.getElementById('im_contact_' + you_sender));
            if (!current_contact.hasClass('active')) {
                var warn = current_contact.find('span[contact_style_type="warn"]');
                if ('99+' == warn.html()) {
                    return;
                }
                var warnNum = parseInt((!!warn.html()) ? warn.html() : 0) + 1;
                if (warnNum > 99) {
                    warn.html('99+');
                } else {
                    warn.html(warnNum);
                }
                warn.show();
            }
        },        

        /**
         * 样式，发送消息时添加右侧页面样式
         * 
         * @param msg --
         *            是否为临时消息 msg、temp_msg;msg
         *            右侧对话消息display为block；temp_msg用于发送本地文件；需要点击确定的时候resendMsg方法中修改属性为block
         * @param msgtype --
         *            消息类型1:文本消息 2：语音消息 3：视频消息 4：图片消息 5：位置消息 6：文件
         * @param msgid --
         *            消息版本号，本地发出时均采用时间戳long
         * @param content_type --
         *            C G or M
         * @param content_you --
         *            对方帐号：发出消息时对方帐号，接收消息时发送者帐号
         * @param im_send_content --
         *            消息内容
         * @constructor
         */
        HTML_sendMsg_addHTML : function(msg, msgtype, msgid, content_type,
                content_you, im_send_content) {
            
            //im_send_content = emoji.replace_unified(im_send_content);

            var display = ('temp_msg' == msg) ? 'none' : 'block';
            var carou = '';
            if(msgtype==4||msgtype==3){
                carou="real";
            };
            var str = '<div contactor="sender" im_carousel="'+carou+'" msg="'
                    + msg
                    + '" im_msgtype="'
                    + msgtype
                    + '" id="'
                    + content_you
                    + '_'
                    + msgid
                    + '" content_type="'
                    + content_type
                    + '" content_you="'
                    + content_you
                    + '" class="alert alert-right alert-success" style="display:'
                    + display
                    + '">'
                    + '<span imtype="resend" class="add-on" onclick="IM.EV_resendMsg(this)"' 
                    + ' style="display:none; cursor:pointer; position: relative; left: -40px; top: 0px;"><i class="icon-repeat"></i></span>'
                    + '<code class="pull-right" style="max-width:70%;word-break:keep-all;text-overflow:ellipsis;overflow: hidden;">&nbsp;:' + IM._username
                    + '</code>' + im_send_content + '</div>';

            $('#im_content_list').append(str);

            $('#im_send_content').html('');
            $('#im_content_list').scrollTop($('#im_content_list')[0].scrollHeight);
            
            //更新最近一条消息
            var current_contact = $(document.getElementById('im_contact_' + content_you));
            IM.HTML_updateShort(msgtype, im_send_content, current_contact, msgid);
			
            return content_you + '_' + msgid;
        },
        HTML_sendMsg_addPreHTML : function(msg, msgtype, msgid, content_type,content_you, im_send_content) {
            if(!!im_send_content){
                //im_send_content = emoji.replace_unified(im_send_content);
            };

            var display = ('temp_msg' == msg) ? 'none' : 'block';
            var carou = '';
            if(msgtype==4||msgtype==3){
                carou="real";
            };
            var str = '<div contactor="sender" im_carousel="'+carou+'" msg="'
                    + msg
                    + '" im_msgtype="'
                    + msgtype
                    + '" id="'
                    + content_you
                    + '_'
                    + msgid
                    + '" content_type="'
                    + content_type
                    + '" content_you="'
                    + content_you
                    + '" class="alert alert-right alert-success" style="display:'
                    + display
                    + '">'
                    + '<span imtype="resend" class="add-on" onclick="IM.EV_resendMsg(this)"'
                    + ' style="display:none; cursor:pointer; position: relative; left: -40px; top: 0px;"><i class="icon-repeat"></i></span>'
                    + '<code class="pull-right" style="max-width:70%;word-break:keep-all;text-overflow:ellipsis;overflow: hidden;">&nbsp;:' + IM._username
                    + '</code>' + im_send_content + '</div>';
		
			$('#im_content_list').prepend(str);
            var hisStr = $("#getHistoryMsgDiv").prop('outerHTML');
            $("#getHistoryMsgDiv").remove();
            $('#im_content_list').prepend(hisStr);
            $('#im_send_content').html('');
            $('#im_content_list')
                    .scrollTop($('#im_content_list')[0].scrollHeight);

            return content_you + '_' + msgid;
        },

        /**
         * 选择联系人列表，并切换消息列表
         * 
         * @param contact_type C\G\M
         * @param contact_you 联系人ID
         */
        DO_chooseContactList : function(contact_type, contact_you) {
            IM.HTML_clean_im_contact_list();
            $("#fireMessage").removeClass("active");
            var current_contact = document.getElementById("im_contact_" + contact_you);
            $(current_contact).addClass('active');
            var warn = $(current_contact).find('span[contact_style_type="warn"]');
            warn.hide();
            warn.html(0);
            /*暂时屏蔽历史消息功能
            $("#getHistoryMsgDiv").html('<a href="#" onclick="IM.DO_getHistoryMessage();" style="font-size: small;position: relative;top: -22px;">查看更多消息</a>');
            $("#getHistoryMsgDiv").show();
            */
            IM.HTML_clean_im_content_list(contact_you);
            
            //显示用户的状态，免费版不支持
            //IM.EV_getUserState(contact_you);
            
            //显示用户信息
            var name = $(current_contact).find('div.msg-body > span[contact_style_type="name"]').text();
            if (name.length == 0) {
            	$('#im_curr_user').hide();
            } else {
            	$('#im_curr_user').show();
            }
            $('#im_curr_user').find('span.user').html(name);
        },
        EV_getUserState : function(contact_you){
            var current_contact = document.getElementById("im_contact_" + contact_you);
            var getUserStateBuilder = new RL_YTX.GetUserStateBuilder();
            getUserStateBuilder.setUseracc(contact_you);
            
            var photo = $(current_contact).find('div > img.face');
                        
            RL_YTX.getUserState(getUserStateBuilder,function(obj){
                if(obj.state == 1){//1在线 2离线
                    photo.attr('title', '在线');
                    var t = $('#im_curr_user').find('span.state');
                    if (!t.hasClass('online')) t.addClass('online'); 
                    t.html('在线');
                    photo.removeClass('photo-gray');
                }else if(obj.state == 2){
                    photo.attr('title', '离线');
                    var t = $('#im_curr_user').find('span.state');
                    t.removeClass('online'); 
                    t.html('离线');
                    if (!photo.hasClass('photo-gray')) {
                    	photo.addClass('photo-gray');
                    }
                }else{
                    alert("getUserState 错误码："+obj.state+"; 错误描述：获得用户状态结果不合法")
                }
            },function(obj){
                if(174006 != obj.code){
                	alert("getUserState 错误码："+obj.code+"; 错误描述："+obj.msg)
				}
            });
        },

        /**
         * 清理右侧消息列表
         * 
         * @param contact_you --
         *            左侧联系人列表中的
         */
        HTML_clean_im_content_list : function(contact_you) {
            
            $('#im_content_list').find('div[msg="msg"]').each(function() {
                        if ($(this).attr('content_you') == contact_you) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });

            $('#im_content_list').scrollTop($('#im_content_list')[0].scrollHeight);
        },

        /**
         * 清理联系人列表样式
         */
        HTML_clean_im_contact_list : function() {
            // 清除选中状态class
            $('#im_contact_list').find('li').each(function() {
                        $(this).removeClass('active');
                    });
        },

        /**
         * 添加联系人到列表中
         */
        DO_addContactToList : function(contactVal, contactName, photourl) {
            if (!IM.DO_checkContact(contactVal)) {//校验联系人格式
                return;
            }

            var im_contact = $('#im_contact_list').find('li[contact_type="'
                    + IM._contact_type_c + '"][contact_you="' + contactVal
                    + '"]');
            if (im_contact.length <= 0) {
                IM.HTML_clean_im_contact_list();//清除原来选中的li

                IM.HTML_addContactToList(contactVal, contactName,
                                IM._contact_type_c, true, true, false, null,
                                null, null, photourl);

            }
            
            //切换到会话列表
            IM.DO_choose_contact_type('C');
        },

        /**
         * 检查联系名称规则是否合法
         * 
         * @param contactVal
         * @returns {boolean}
         * @constructor
         */
        DO_checkContact : function(contactVal) {
            if (!contactVal) {
                IM.HTML_showAlert('alert-warning', '请填写联系人');
                return false;
            }
            if (contactVal.indexOf("#") > -1 && contactVal.length > 161) {
                IM.HTML_showAlert('alert-error', '跨应用联系人长度不能超过161');
                return false;
            } else if (contactVal.length > 128) {
                IM.HTML_showAlert('alert-error', '联系人长度不能超过128');
                return false;
            }
            if ('g' == contactVal.substr(0, 1)) {
                IM.HTML_showAlert('alert-error', '联系人不能以"g"开始');
                return false;
            }

            if (contactVal.indexOf("@") > -1) {
                var regx2 = /^([a-zA-Z0-9]{32}#)?[a-zA-Z0-9_-]{1,}@(([a-zA-z0-9]-*){1,}.){1,3}[a-zA-z-]{1,}$/;
                if (regx2.exec(contactVal) == null) {
                    IM.HTML_showAlert('alert-error',
                            '检查邮箱格式、如果是跨应用再检查应用Id长度是否为32且由数字或字母组成）');
                    return false;
                }
            } else {
                var regx1 = /^([a-zA-Z0-9]{32}#)?[A-Za-z0-9_-]+$/;
                if (regx1.exec(contactVal) == null) {
                    IM.HTML_showAlert('alert-error',
                                    '联系人只能使用数字、_、-、大小写英文组成; 如果是跨应用则应用id长度为32位由数字或大小写英文组成');
                    return false;
                }
            }
            return true;
        },

        /**
         * 样式，添加左侧联系人列表项
         * 
         * @param contactVal
         * @param contact_type
         * @param b
         *            true--class:active false--class:null
         * @param bb
         *            true--display:block false--display:none
         * @param bbb
         *            true--需要改名字 false--不需要改名字
         * @param owner --
         *            当前群组创建者（只有content_type==G时才有值）
         * @param isNotice --
         *            是否提醒 1：提醒；2：不提醒(只有content_type==G时才有值)
         * @param target --
         *            1表示讨论组 2表示群组
         * @param photourl -- 取头像用
         * @constructor
         */
        HTML_addContactToList : function(contactVal, contactName, content_type,
                b, bb, bbb, owner, isNotice, target, photourl) {
			$('#im_contact_list').find('li.x-nodata').hide();
			
            var old = $(document.getElementById('im_contact_' + contactVal));
            // 已存在，置顶，并更改数字
            if (!!old && old.length > 0) {
                // 如果名字不同，修改名字
                //if (bbb) {
                    old.find('span[contact_style_type="name"]').html(contactName);
                //}
                var str = old.prop('outerHTML');
                old.remove();
                $('#im_contact_list').prepend(str);

                return;
            }

            var active = '';
            if (b)
                active = 'active';
            var dis = 'none';
            if (bb)
                dis = 'block';
            //取缺省头像URL
            if (!photourl) photourl = IM.getPhotoURL(contactVal);
			var str = 
				'<li class="msg-cell ' + active + '" onclick="IM.DO_chooseContactList(\'' + content_type
                    + '\', \'' + contactVal + '\')" id="im_contact_'
                    + contactVal + '" im_isnotice="' + isNotice
                    + '" contact_type="' + content_type + '" contact_you="'
                    + contactVal + '" style="display:'+ dis +'">'+
            		'<div class="msg-object">'+
						'<img class="face" src="'+photourl+'">'+//photo-gray
					'</div>'+
					'<span class="pull-right nav-flag">'+
						'<i class="fa fa-angle-right"></i>'+
					'</span>'+
					'<span class="pull-right nav-flag time"></span>'+//12:45
					//'<span contact_style_type="onlineState" class="pull-right nav-flag"></span>'+
					'<span contact_style_type="warn" class="pull-right badge">0</span>'+
					'<span class="pull-right del-flag" onclick="IM.DO_del_user(event)" title="删除会话"><i class="fa fa-trash-o"></i></span>'+
					'<div class="msg-body">'+
						'<span contact_style_type="name">'+ contactName +'</span>'+
						'<p class="msg-ellipsis"></p>'+//消息
					'</div>'+
            	'</li>';
            $('#im_contact_list').prepend(str);
         
            if (b)
                IM.DO_chooseContactList(content_type, contactVal);
        },

        DO_editNickName : function(obj){
            $(obj).hide();
            $(obj).next().show();
            $(obj).next().focus();
        },
        _modifyName : function(obj){
            var memberId = $(obj).parent().parent().parent().attr("contact_you");
            var nick = $(obj).prev().text();
            var belong = $("#pop").find("h3").text();
            var belongIndex = belong.indexOf("：")+1;
            belong = belong.substring(belongIndex);
            var modifyMemberCardBuilder = new RL_YTX.ModifyMemberCardBuilder();
            modifyMemberCardBuilder.setMember(memberId);
            modifyMemberCardBuilder.setBelong(belong);
            modifyMemberCardBuilder.setDisplay(nick);
            RL_YTX.modifyMemberCard(modifyMemberCardBuilder, function(obj){//member belong
                console.log("修改群组成员名片成功！");
            }, function(obj){
                console.log("修改群组成员名片失败！");
            })
        },
        DO_checkNick : function(obj){
            var nick = $(obj).val();
            if('' == nick.trim()){
                $(obj).prev().show();
                $(obj).hide();
                return;
            }else{
	            var regx = /^[\\x00-\\x7F\a-zA-Z\u4e00-\u9fa5_-]{0,6}$/;
	            if(regx.exec(nick) == null){
	                alert("含有中英文和@_-=\以外的非法字符或昵称长度超过6");
                    return;
	            }else{
                    $(obj).prev().text(nick);
                }
                $(obj).prev().show();
                $(obj).hide();
                $(obj).val("");
            };
            IM._modifyName(obj);
        },
       
        HTML_pop_takePicture_show : function() {
            IM.HTML_LJ_block('photo');

            var navbarHei = $('#navbar').height();
            var lvjingHei = $('#lvjing').height();
            var pop_photo = $('#pop_takePicture');

            pop_photo.find('img').css('max-height', lvjingHei - 30).css(
                    'max-width', $(window).width() - 50);
            pop_photo.css('top', navbarHei);

            var d = $(window).scrollTop();
            // a+b=c
            var a = parseInt(pop_photo
                    .find('div[imtype="pop_takePicture_top"]')
                    .css('margin-top'));
            var b = parseInt(pop_photo
                    .find('div[imtype="pop_takePicture_top"]').css('height'));
            var c = $(window).height();

            if (a + b >= c) {
                d = 0;
            } else if (d + b >= c) {
                d = c - b - 20;
            }
            pop_photo.find('div[imtype="pop_takePicture_top"]').css(
                    'margin-top', d);
            $(window).scrollTop(d);

            pop_photo.show();
        },

        /**
         * 图片pop层隐藏
         * 
         * @constructor
         */
        HTML_pop_photo_hide : function() {
            IM._msgId = null;
            $('#pop_photo').hide();
            if($('#pop_photo').find("video").length >0){
                if(!document.getElementById("pop_photo").querySelector('video').paused){
                    document.getElementById("pop_photo").querySelector('video').pause();
                }
            };
            IM.HTML_LJ_none();
        },
        /**
         * 拍照pop层隐藏
         * 
         * @constructor
         */
        HTML_pop_takePicture_hide : function() {
           
            $('#pop_takePicture').hide();
            $("#video").attr("src",'');
            IM.HTML_LJ_none();
        },
 
        /**
         * 样式，群组详情页面显示
         * 
         * @constructor
         */
        HTML_pop_show : function() {
            IM.HTML_LJ_block('white');

            var navbarHei = $('#navbar').height();
            var contentHei = $("#im_content_list").height();
            var pop = $('#pop');
            pop.css('top', navbarHei + 20);
            pop.css('height', contentHei);
            pop.show();
        },

        /**
         * 样式，群组详情页面隐藏
         * 
         * @constructor
         */
        HTML_pop_hide : function() {
            $('#pop').hide();
            IM.HTML_LJ_none();
        },

        /**
         * 隐藏提示框
         * 
         * @param id
         */
        HTML_closeAlert : function(id) {
            if ('all' == id) {
                IM.HTML_closeAlert('alert-error');
                IM.HTML_closeAlert('alert-info');
                IM.HTML_closeAlert('alert-warning');
                IM.HTML_closeAlert('alert-success');
            } else {
                $(document.getElementById(id)).hide();
                $(document.getElementById(id)).parent().hide();
            }
        },

        /**
         * 显示提示框
         * 
         * @param id
         * @param str
         */
        HTML_showAlert : function(id, str, time) {
            var t = 3 * 1000;
            if (!!time) {
                t = time;
            }
            clearTimeout(IM._timeoutkey);
            $('#alert-info').hide();
            $('#alert-warning').hide();
            $('#alert-error').hide();
            $('#alert-success').hide();

            $(document.getElementById(id + '_content')).html(str);
            $(document.getElementById(id)).show();
            $(document.getElementById(id)).parent().show();
            IM._timeoutkey = setTimeout(function() {
                        IM.HTML_closeAlert(id);
                    }, t);
        },

        /**
         * 样式，因高度变化而重置页面布局
         * 
         * @constructor
         */
        HTML_resetHei : function() {
            var windowHei = $(window).height();
            if (windowHei < 666) {
                windowHei = 666;
            }
            var windowWid = $(window).width();
            
            var width =  Math.round(windowWid*0.3);
     	    $("#videoView").css("width",width);
     	   var leftWidth = (windowWid-width)/2;
           $("#videoView").css("left",leftWidth);
            if(windowWid < 666){
                //移动端兼容发送菜单栏
                $("#contentEditDiv").css("top","0px");
                $("#sendMenu").css("top","0px");
            }else{
                $("#contentEditDiv").css("top","-10px");
            }
            var navbarHei = $('#navbar').height() + 20 + 60 + 30 + 20 + 1;
            var contactTypeHei = $('#im_contact_type').height() + 20 + 6;
            var addContactHei = $('#im_add_contact').height() + 10 + 10;

            var hei = windowHei - navbarHei - contactTypeHei - addContactHei - 20;
            //$("#im_contact").height(hei);
            //$("#im_content_list").height(hei + contactTypeHei - 10 - 10 - 75);
            $('#im_content_list').scrollTop($('#im_content_list')[0].scrollHeight);

            // 绘制滤镜
            if ('block' == $('#pop_photo').css('display')) {
                IM.HTML_pop_photo_show();
            } else if ('block' == $('#pop').css('display')) {
                IM.HTML_pop_show();
            } else if ('block' == $('#lvjing').find('img').css('display')) {
                IM.HTML_LJ('black');
            } else if('block' == $('#pop_takePicture').css('display')){
            }else{
                IM.HTML_LJ('black');
            }
        },

        /**
         * canvas绘制滤镜层（HTML5）
         * 
         * @param style
         *            white, black
         * @constructor
         */
        HTML_LJ : function(style) {
            var lvjing = $('#lvjing');

            var windowWid = $(window).width();
            if (windowWid < 666) {
                $('#hero-unit').css('padding-left', 20);
                $('#hero-unit').css('padding-right', 20);
            } else {
                $('#hero-unit').css('padding-left', 60);
                $('#hero-unit').css('padding-right', 60);
            }

            var navbarHei = $('#navbar').height();
            var concentHei = $(document).height()-navbarHei-2; //$('#hero-unit').height();
            var concentwid = $(document).width()-2;

            var lvjingImgHei = lvjing.find('img').height();
            if (0 == lvjingImgHei)
                lvjingImgHei = 198;

            lvjing.css('top', navbarHei);
            lvjing.css('left', 0);
            lvjing.css('width', '100%');
            lvjing.height(concentHei);

            var canvas = document.getElementById("lvjing_canvas");
            canvas.clear;
            canvas.height = (concentHei);
            canvas.width = concentwid;
            if (!canvas.getContext) {
                console.log("Canvas not supported. Please install a HTML5 compatible browser.");
                return;
            }

            var context = canvas.getContext("2d");
            context.clear;
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(concentwid, 0);
            context.lineTo(concentwid, concentHei + 15);
            context.lineTo(0, concentHei + 15);
            context.closePath();
            context.globalAlpha = 0.4;
            if ('white' == style) {
                context.fillStyle = "rgb(200,200,200)";
                lvjing.find('img').hide();
            } else if ('photo' == style) {
                context.fillStyle = "rgb(20,20,20)";
                lvjing.find('img').hide();
            } else if ('black' == style) {
                context.fillStyle = "rgb(0,0,0)";
                var qr = lvjing.find('img');
                qr.css('top', concentHei / 2 - lvjingImgHei / 2);
                qr.css('left', concentwid / 2 - lvjingImgHei / 2);
                qr.show();
            }
            context.fill();
            context.stroke();

            var cha = navbarHei + 4;
            if (navbarHei > 45)
                cha = 0;
            $('#im-main').height(navbarHei + concentHei - 25);
            //$('body').height(navbarHei + concentHei - 25);

            setTimeout(function() {
                        $('#ClCache').parent().remove();
                    }, 20);

        },

        /**
         * 样式，滤镜隐藏
         * 
         * @constructor
         */
        HTML_LJ_none : function() {
            $('#lvjing').hide();
        },

        /**
         * 样式，滤镜显示
         * 
         * @constructor
         */
        HTML_LJ_block : function(style) {
            IM.HTML_LJ(style);
            $('#lvjing').show();
        },

        /**
         * 聊天模式选择
         * 
         * @param contact_type -- 'C':代表联系人; 'G':代表群组; 'M':代表多渠道客服
         * @constructor
         * C:im_msg_list\G:im_contact_list\M:im_setting
         */
        DO_choose_contact_type : function(contact_type) {
            $('#im_contact_type').find('li').each(function() {
        		if (contact_type == $(this).attr('contact_type')) {
                    if (!$(this).hasClass('active')) $(this).addClass('active');
                    $('#'+$(this).attr('winid')).show();
                } else {
                	$(this).removeClass('active');
        			$('#'+$(this).attr('winid')).hide();
                }
            });
            if (contact_type == 'G') {
            	$('#im_user_qry').show();
            } else {
            	$('#im_user_qry').hide();
            }
        },
        
        _mouseoverStyle :function(obj){
            $(obj).css("background-color","#E9E9E4");
        },
        _mouseoutStyle :function(obj){
            $(obj).css("background-color","");
        },
        insertText : function (obj,nickName,startIndex) {
     
            var startPos = parseInt(startIndex)+1;
	        var endPos = startPos; 
	        var cursorPos = startPos;
            var tmpStr = obj.childNodes[0].data;
	        obj.childNodes[0].data = tmpStr.substring(0, startPos) + nickName + tmpStr.substring(endPos, tmpStr.length);
	        cursorPos += nickName.length;
        },
        /**
         * 样式，发送消息
         */
        DO_sendMsg : function() {

            var str = IM.DO_pre_replace_content_to_db();
            $('#im_send_content_copy').html(str);

            var im_send_content = $('#im_send_content_copy').html();

            // 清空pre中的内容
            $('#im_send_content_copy').html('');
            
            var msgid = new Date().getTime();
            var content_type = '';
            var content_you = '';
            var b = false;
            $('#im_contact_list').find('li').each(function() {
                        if ($(this).hasClass('active')) {
                            content_type = $(this).attr('contact_type');
                            content_you = $(this).attr('contact_you');
                            b = true;
                        }
                    });
            if (!b) {
                alert("请选择要对话的联系人或群组");
                return;
            };
            
            if(IM._serverNo == content_you){
            	alert("系统消息禁止回复");
            	return;
            }
            
            if (im_send_content == undefined || im_send_content == null
                    || im_send_content == '')
                return;
            im_send_content = im_send_content.replace(/&lt;/g, '<').replace(
                    /&gt;/g, '>').replace(/&quot;/g, '"')
                    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');

            console.log('msgid[' + msgid + '] content_type[' + content_type
                    + '] content_you[' + content_you + '] im_send_content['
                    + im_send_content + ']');

            var str = '<pre msgtype="content">' + im_send_content + '</pre>';
            IM.HTML_sendMsg_addHTML('msg', 1, msgid, content_type, content_you,str);

            // 发送消息至服务器
            if (IM._contact_type_c == content_type) {
                IM.EV_sendTextMsg(msgid, im_send_content, content_you,false);
            } else if (IM._contact_type_g == content_type) {
                IM.EV_sendTextMsg(msgid, im_send_content, content_you,false);
            } else {
                IM.EV_sendMcmMsg(msgid, im_send_content, content_you,false);
            };

        },

        DO_im_image_file : function() {
            var msgid = new Date().getTime();
            var content_type = '';
            var content_you = '';
            var b = false;
            $('#im_contact_list').find('li').each(function() {
                        if ($(this).hasClass('active')) {
                            content_type = $(this).attr('contact_type');
                            content_you = $(this).attr('contact_you');
                            b = true;
                        }
                    });
            if (!b) {
                alert("请选择要对话的联系人或群组");
                return;
            }
            if(IM._serverNo == content_you){
                alert("系统消息禁止回复");
                return;
            }

            var windowWid = $(window).width();
            var imgWid = 0;
            var imgHei = 0;
            if (windowWid < 666) {
                imgWid = 100;
                imgHei = 150;
            } else {
                imgWid = 150;
                imgHei = 200;
            }
            var str = '<div class="progress progress-striped active">'
                    + '<div class="bar" style="width: 20%;"></div>'
                    + '</div>'
                    + '<span imtype="msg_attach">'
                    + '<img imtype="msg_attach_src" src="#" style="max-width:'
                    + imgWid
                    + 'px; max-height:'
                    + imgHei
                    + 'px;" onclick="IM.DO_pop_phone(\''+content_you+'\', \''+''+'\',this)" />'
                    + '<input imtype="msg_attach_resend" type="file" accept="image/*" style="display:none;margin: 0 auto;" onchange="IM.DO_im_image_file_up(\''
                    + content_you + '_' + msgid + '\', \'' + msgid
                    + '\',null)">' + '</span>';

            // 添加右侧消息
            var id = IM.HTML_sendMsg_addHTML('temp_msg', 4, msgid,
                    content_type, content_you, str);

            $(document.getElementById(id)).find('input[imtype="msg_attach_resend"]').click();

        },

        /**
         * 发送图片，页面选择完图片后出发
         * 
         * @param id --
         *            dom元素消息体的id
         * @param msgid
         * @constructor
         */
        DO_im_image_file_up : function(id, oldMsgid, img_blob) {
            var msg = $(document.getElementById(id));
            var oFile = msg.find('input[imtype="msg_attach_resend"]')[0];

            if (!!oFile) {
                oFile = oFile.files[0];
                console.log(oFile.name + ':' + oFile.type);
            } else {
                oFile = img_blob;
            }
            //如果是附件则本地显示
            window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
            var url = window.URL.createObjectURL(oFile);
            msg.find('img[imtype="msg_attach_src"]').attr('src', url);

            var receiver = msg.attr('content_you');
            // 查找当前选中的contact_type值 1、IM上传 2、MCM上传
            var current_contact_type = IM.HTML_find_contact_type();
            if (IM._contact_type_m == current_contact_type) {
                IM.EV_sendToDeskAttachMsg(oldMsgid, oFile, 4, receiver);
            } else {
                IM.EV_sendAttachMsg(oldMsgid, oFile, 4, receiver);
            }
        },
        /**
         * 发送本地附件
         */
        DO_im_attachment_file : function() {
            var msgid = new Date().getTime();
            var content_type = '';
            var content_you = '';
            var b = false;
            $('#im_contact_list').find('li').each(function() {
                        if ($(this).hasClass('active')) {
                            content_type = $(this).attr('contact_type');
                            content_you = $(this).attr('contact_you');
                            b = true;
                        }
                    });
            if (!b) {
                alert("请选择要对话的联系人或群组");
                $('#im_attachment_file').val('');
                return;
            };
            if(IM._serverNo == content_you){
                alert("系统消息禁止回复");
                return;
            }

            var str = '<div class="progress progress-striped active">'
                    + '<div class="bar" style="width: 40%;"></div>'
                    + '</div>'
                    + '<span imtype="msg_attach">'
                    + '<a imtype="msg_attach_href" href="javascript:void(0);" target="_blank">'
                    + '<span>'
                    + '<img style="width:32px; height:32px; margin-right:5px; margin-left:5px;" src="img/attachment_icon.png" />'
                    + '</span>'
                    + '<span imtype="msg_attach_name"></span>'
                    + '</a>'
                    + '<span style="font-size: small;margin-left:15px;"></span>'
                    + '<input imtype="msg_attach_resend" type="file" accept="" style="display:none;margin: 0 auto;" onchange="IM.DO_im_attachment_file_up(\''
                    + content_you + '_' + msgid + '\', \'' + msgid + '\')">'
                    + '</span>';
            // 添加右侧消息
            var id = IM.HTML_sendMsg_addHTML('temp_msg', 6, msgid,
                    content_type, content_you, str);

            $(document.getElementById(id)).find('input[imtype="msg_attach_resend"]').click();

        },

        /**
         * 打开本地文件时触发本方法
         * 
         * @param id --
         *            dom元素消息体的id
         * @param msgid
         * @constructor
         */
        DO_im_attachment_file_up : function(id, oldMsgid) {
            var msg = $(document.getElementById(id));
            var oFile = msg.find('input[imtype="msg_attach_resend"]')[0].files[0];
            var msgType = 0;
            console.log(oFile.name + ':' + oFile.type);

            window.URL = window.URL || window.webkitURL || window.mozURL
                    || window.msURL;
            var url = window.URL.createObjectURL(oFile);
            var num = oFile.size;
            var size = 0;
            if(num < 1024){
                size = num + "byte";
            }else if(num/1024 >= 1 && num/Math.pow(1024,2) <1){
                size = Number(num/1024).toFixed(2) + "KB";
            }else if(num/Math.pow(1024,2) >= 1 && num/Math.pow(1024,3) <1){
                size = Number(num/Math.pow(1024,2)).toFixed(2) + "MB";
            }else if(num/Math.pow(1024,3) >= 1 && num/Math.pow(1024,4) <1){
                size = Number(num/Math.pow(1024,3)).toFixed(2)+"G";
            };
            var receiver = msg.attr('content_you');
            //判断如果该浏览器支持拍照，那么在这里做个附件图片和文件的区别化展示；
            if($("#camera_button").find("i").hasClass("fa-camera")){
                msg.find('a[imtype="msg_attach_href"]').attr('href', url);
                msg.find('span[imtype="msg_attach_name"]').html(oFile.name);
                msg.find('a[imtype="msg_attach_href"]').next().html(size);
                msgType = 6;
            }else{
	            if("image" == oFile.type.substring(0,oFile.type.indexOf("/"))){
                    var windowWid = $(window).width();
		            var imgWid = 0;
		            var imgHei = 0;
		            if (windowWid < 666) {
		                imgWid = 100;
		                imgHei = 150;
		            } else {
		                imgWid = 150;
		                imgHei = 200;
		            }
                    var str = '<img imtype="msg_attach_src" src="'+ url + '" style="max-width:'
		                    + imgWid + 'px; max-height:' + imgHei + 'px;" '
                            + ' onclick="IM.DO_pop_phone(\''+receiver+'\', \''+''+'\',this)" />';
                    msg.find('a[imtype="msg_attach_href"]').replaceWith(str);
                    
                    msgType = 4;
                }else{
                    msg.find('a[imtype="msg_attach_href"]').attr('href', url);
                    msg.find('span[imtype="msg_attach_name"]').html(oFile.name);
                    msg.find('a[imtype="msg_attach_href"]').next().html(size);
                    msgType = 6;
                }
            }
            
            // 查找当前选中的contact_type值 1、IM上传 2、MCM上传
            var current_contact_type = IM.HTML_find_contact_type();
            if (IM._contact_type_m == current_contact_type) {
                IM.EV_sendToDeskAttachMsg(oldMsgid, oFile, msgType, receiver);
            } else {
                IM.EV_sendAttachMsg(oldMsgid, oFile, msgType, receiver);
            }

        },

        DO_pre_replace_content : function() {
            console.log('pre replace content...');
            setTimeout(function() {
                        var str = IM.DO_pre_replace_content_to_db();
                        $('#im_send_content').html(str);
                    }, 20);
        },

        DO_pre_replace_content_to_db : function() {
            var str = $('#im_send_content').html();
            str = str.replace(/<(div|br|p)[/]?>/g, '\u000A');
            str = str.replace(/\u000A+/g, '\u000D');
            str = str.replace(/<[^img][^>]+>/g, '');// 去掉所有的html标记
            str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(
                    /&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g,
                    ' ');
            if ('\u000D' == str) {
                str = '';
            }
            return str;
        },

        /**
         * 获取当前时间戳 YYYYMMddHHmmss
         * 
         * @returns {*}
         */
        _getTimeStamp : function() {
            var now = new Date();
            var timestamp = now.getFullYear() + ''
                    + ((now.getMonth() + 1) >= 10 ?""+ (now.getMonth() + 1) : "0"
                            + (now.getMonth() + 1))
                    + (now.getDate() >= 10 ? now.getDate() : "0"
                            + now.getDate())
                    + (now.getHours() >= 10 ? now.getHours() : "0"
                            + now.getHours())
                    + (now.getMinutes() >= 10 ? now.getMinutes() : "0"
                            + now.getMinutes())
                    + (now.getSeconds() >= 10 ? now.getSeconds() : "0"
                            + now.getSeconds());
            return timestamp;
        },

        /**
         * 修改用户信息
         */
        DO_userMenu : function() {
            // 构建用户信息页面
            IM.DO_userpop_show();
            // 调用SDK方法获取user信息
            IM.EV_getMyMenu();

        },

        /**
         * 构建用户信息页面
         */
        DO_userpop_show : function() {
            
        },
        /**
         * 获取当前用户个人信息
         */
        EV_getMyMenu : function() {
            RL_YTX.getMyInfo(function(obj) {
                        $("#nickName").val(obj.nickName);
                        $("[name=sex]").each(function() {
                                    if ($(this).val() == obj.sex) {
                                        $(this).prop("checked", true);
                                    }
                                });
                        $("#birth").val(obj.birth);

                        if (!!obj.sign) {
                            $("#sign").text(obj.sign);
                        }

                    }, function(obj) {
                        if (520015 != obj.code) {
                            alert("getMyInfo1 错误码："+obj.code+"; 错误描述："+obj.msg)
                        }
                    });
        },

        /**
         * 整合用户信息传给服务器
         */
        EV_updateMyInfo : function() {

            var nickName = $("#nickName").val();
            if(nickName!=IM._user_account){
                if(nickName.length>6){
                    alert("昵称长度不能超过6");
                    return ;
                };
            }
           
            var sex = '';
            $("[name=sex]").each(function() {
                        if (!!$(this).prop("checked")) {
                            sex = $(this).val();
                        }
                    });
            var birth = $("#birth").val();
            var sign = $("#sign").val();
            if(sign.length>100){
                alert("签名长度不能超过100");
                return;
            }
            var uploadPersonInfoBuilder = new RL_YTX.UploadPersonInfoBuilder(
                    nickName, sex, birth, sign);

            RL_YTX.uploadPerfonInfo(uploadPersonInfoBuilder, function(obj) {
                        IM.HTML_pop_hide();
                        $('#navbar_login_show').find('span')[1].innerHTML = nickName;
                        $('#navbar_login_show').html('<span style="float: left;display: block;font-size: 20px;font-weight: 200;padding-top: 10px;padding-bottom: 10px;text-shadow: 0px 0px 0px;color:#eee" >您好:</span>'
                                + '<a onclick="IM.DO_userMenu()" style="text-decoration: none;cursor:pointer;float: left;font-size: 20px;font-weight: 200;max-width:130px;'
                                + 'padding-top: 10px;padding-right: 20px;padding-bottom: 10px;padding-left: 20px;text-shadow: 0px 0px 0px;color:#eee;word-break:keep-all;text-overflow:ellipsis;overflow: hidden;" >'
                                + nickName
                                + '</a>'
                                + '<span onclick="IM.EV_logout()" style="cursor:pointer;float: right;font-size: 20px;font-weight: 200;'
                                + 'padding-top: 10px;padding-bottom: 10px;text-shadow: 0px 0px 0px;color:#eeeeee">退出</span>');
                         IM._username = nickName;       
                    }, function(obj) {
                        alert("uploadPerfonInfo 错误码："+obj.code+"; 错误描述："+obj.msg)
                    });
        },
  
        _cancelTakePic : function() {
            IM.HTML_pop_takePicture_hide();
            var onErr = function(obj){
                console.log("错误码："+obj.code+"; 错误码描述："+obj.msg);
            };
            RL_YTX.photo.cancel();
        },
        DO_takePicture : function() {

            var b = false;
            var content_you = '';
            $('#im_contact_list').find('li').each(function() {
                        if (!!$(this).hasClass('active')) {
                            content_you = $(this).attr('contact_you');
                            b = true;
                        }
                    });
            if (!b) {
                alert("请选择要对话的联系人或群组");
                return;
            };
            if(IM._serverNo == content_you){
                alert("系统消息禁止回复");
                return;
            }
            // 拍照按钮的浏览器兼容
            var windowWid = $(window).width();
            if (windowWid < 666) {
                $('#takePhoto').find('div').css("height", "35px");
                $('#takePhoto').find('img').css("height", "30px");
                $('#takePhoto').find('img').css("width", "30px");
            } else {
                $('#takePhoto').find('div').css("height", "50px");
                $('#takePhoto').find('img').css("height", "45px");
                $('#takePhoto').find('img').css("width", "45px");
            };
            
            var objTag = {};
            var video = document.getElementById("video");
            objTag.tag = video;
            var onCanPlay = function(){
                IM.HTML_pop_takePicture_show();
            };
            var onErr = function(errObj){
                console.log("错误码："+errObj.code+"; 错误描述："+errObj.msg);
                //IM.HTML_pop_takePicture_hide();
                return;
            };
            RL_YTX.photo.apply(objTag,onCanPlay,onErr);
            
        },

        /**
         * 拍照
         */
        _snapshot : function() {
            var content_type = '';
            var content_you = '';
            $('#im_contact_list').find('li').each(function() {
                        if (!!$(this).hasClass('active')) {
                            content_type = $(this).attr('contact_type');
                            content_you = $(this).attr('contact_you');
                        }
                    });
            var resultObj = RL_YTX.photo.make();
            IM.HTML_pop_takePicture_hide();
            if("174010" == resultObj.code){//没有调用applay方法
                console.log("错误描述："+resultObj.msg);
            }else{
                var windowWid = $(window).width();
                var msgid = new Date().getTime();
                var imgWid = 0;
                var imgHei = 0;
                if (windowWid < 666) {
                    imgWid = 100;
                    imgHei = 150;
                } else {
                    imgWid = 150;
                    imgHei = 200;
                };
                
                var url = resultObj.blob.url;
                // 初始化右侧对话框消息
                var str1 = '<div class="progress progress-striped active">'
                        + '<div class="bar" style="width: 20%;"></div>'
                        + '</div>'
                        + '<span imtype="msg_attach">'
                        + '<img imtype="msg_attach_src" src="'+url+'" onclick="IM.DO_pop_phone(\''+content_you+'\', \''+''+'\',this)" style="cursor:pointer;max-width:'+ imgWid + 'px;max-height:' + imgHei + 'px;" />'
                        + '<object style="display:none"></object>'
                        + '</span>';

                var id = IM.HTML_sendMsg_addHTML('msg', 4, msgid, content_type,content_you, str1);
                IM.DO_im_image_file_up(id, msgid, resultObj.blob);
            };
        },

        DO_getHistoryMessage : function() {
            var content_list = $('#im_content_list');

            var scrollTop = content_list.scrollTop();
            if (scrollTop == 0) {
                // 获取参数
                var firstMsg = null;
                for (var i = 0; i < content_list.children().length; i++) {
                    var child = content_list.children()[i];
                    if (child.nodeName == "DIV" && child.id != "getHistoryMsgDiv") {// 判断标签是不是div
                        if (child.style.display != "none") {
                            firstMsg = child;
                            break;
                        }
                    }
                }
                IM.EV_getHistoryMessage(firstMsg);
            }
        },
        /**
         * 获取历史消息GetHistoryMsgBuilder
         * 
         * @param talker
         *            消息交互者或群组id
         * @param pageSize
         *            获取消息数目 默认为10 最大为50
         * @param version
         *            接收消息的消息版本号 分页条件
         * @param msgId
         *            发送消息的msgId 分页条件
         * @param order
         *            排序方式 1升序 2降序 默认为1
         * @param callback --
         *            function(obj){ var msg = obj[i]; //obj 为数组 msg.version;
         *            //消息版本号 msg.msgType; //消息类型 msg.msgContent; //文本消息内容
         *            msg.msgSender; //发送者 msg.msgReceiver; //接收者 msg.msgDomain;
         *            //扩展字段 msg.msgFileName; //消息文件名 msg.msgFileUrl; //消息下载地址
         *            msg.msgDateCreated; //服务器接收时间 msg.mcmEvent; //是否为mcm消息
         *            0普通im消息 1 start消息 2 end消息 53发送mcm消息 }
         * @param onError --
         *            function(obj){ obj.code; //错误码; }
         * @constructor
         */
        EV_getHistoryMessage : function(firstMsg){
            var getHistoryMsgBuilder = null;
            var pageSize = 20;
            var order = 2;
            var talker = null;
            var sig = IM._login_sig;
            alert(sig);
            if(!!firstMsg){
                talker = $(firstMsg).attr("content_you");// 接受者
                console.log("talker" + talker + "," + IM._user_account);
                var msgId = $(firstMsg).attr("id").substring(talker.length+ 1);// 当前条为发送消息则提供参数msgId
                console.log(msgId);
                
                
                var sender = $(firstMsg).attr("contactor");
                if (sender != "sender") {
                    getHistoryMsgBuilder = new RL_YTX.GetHistoryMsgBuilder(
                            talker, pageSize, 1, msgId, order, sig);
                } else {
                    getHistoryMsgBuilder = new RL_YTX.GetHistoryMsgBuilder(
                            talker, pageSize, 2, msgId, order, sig);
                }
                console.log("talker="+talker+";pageSize="+pageSize+";msgId="+msgId+";(1升序2降序)order="+order);
            }else{
                
                $('#im_contact_list').find('li').each(function() {
                    if ($(this).hasClass('active')) {
                        talker = $(this).attr('contact_you');
                    }
                });
                getHistoryMsgBuilder = new RL_YTX.GetHistoryMsgBuilder(
                            talker, pageSize, "", "", order, sig);
                console.log("talker="+talker+";pageSize="+pageSize+";msgId="+msgId+";(1升序2降序)order="+order);
            }
    
            // 调用接口
        
            RL_YTX.getHistoryMessage(getHistoryMsgBuilder,
                    function(obj) {
                        var windowWid = $(window).width();
                        var imgWid = 0;
                        var imgHei = 0;
                        if (windowWid < 666) {
                            imgWid = 100;
                            imgHei = 150;
                        } else {
                            imgWid = 150;
                            imgHei = 200;
                        };
                        
                        for (var i = 0; i < obj.length; i++) {
                            var msg = obj[i];
                            var content_you ='';
                            var version = msg.version;
                            if(msg.msgSender == IM._user_account){
                                content_you = msg.msgReceiver;
                            }else{
                                content_you = msg.msgSender;
                            };
                            var str='';
                            if(msg.msgType == 1){//1:文本消息 2：语音消息 3：视频消息 4：图片消息 5：位置消息 6：文件   msg.msgFileName; //消息文件名
                                str = '<pre msgtype="content">' + msg.msgContent + '</pre>';
                            };
                            if(msg.msgType == 3){
                                str = '<img onclick="IM.DO_pop_phone(\''+content_you+'\', \'' + version + '\')" ' +
                                       'videourl="'+msg.msgFileUrl+'" src="'+ msg.msgFileUrlThum +'" ' +
                                       'style="max-width:'+ imgWid + 'px;max-height:' + imgHei + 'px;" />';
                            };
                            if(msg.msgType == 4){
                               str = '<span imtype="msg_attach">'
                                        + '<img imtype="msg_attach_src" src="'+ msg.msgFileUrl +'" style="max-width:'+ imgWid + 'px;max-height:' + imgHei + 'px;" />'
                                        + '</span>';
                            };
                            if(msg.msgType == 6){
                               str = '<span imtype="msg_attach">'
                                    + '<a imtype="msg_attach_href" href="'+ msg.msgFileUrl +'" target="_blank">'
                                    + '<span>'
                                    + '<img style="width:32px; height:32px; margin-right:5px; margin-left:5px;" src="img/attachment_icon.png" />'
                                    + '</span>'
                                    + '<span imtype="msg_attach_name">'+ msg.msgFileName +'</span>'
                                    + '</a>'
                                    + '</span>';
                            };
                            if (!!msg && msg.msgSender == IM._user_account) {
                                // 追加自己聊天记录
                                IM.HTML_sendMsg_addPreHTML("msg",msg.msgType, null,null, msg.msgReceiver,str);
                            } else {
                                // 追加对方聊天记录
                                IM.HTML_pushMsg_addPreHTML(msg.msgType,msg.msgReceiver, msg.version,null, true, msg.msgSender,str);
                            }
                        }
                    }, function(obj) {
                        if (obj.code == "540016") {
                            $("#getHistoryMsgDiv").html('<a href="javascript:void(0);" style="font-size: small;position: relative;top: -22px;">没有更多历史消息</a>');
                        } else {
                            alert("getHistoryMessage 错误码："+obj.code+"; 错误描述："+obj.msg)
                        }
        
                    });
        },
        
       
  /**
   * 禁止发送附件
   */
  SendFile_isDisable:function(){
	  $("#file_button").append('<span style="color:#FF0000; font-size: 14px; font-weight:bold;margin-left:-15px;">X</span>');
	  $("#file_button").removeAttr("onclick");
  },
  
  /**
   * 切换按钮
   */
  Check_login : function(){
	  $("div[name = 'loginType']").each(function(){
			var display = $(this).css("display");
			if(display == 'none'){
				IM._loginType = $(this).attr("id");
				$(this).show();
			}else{
				$(this).hide();
			}
		  });
  },
  isNull:function(value){
	  if(value == '' || value == undefined
              || value == null){
		  return true;
	  }
  },
  DO_cleanChatHis : function(groupId){
      $('#im_content_list > div[content_you="'+groupId+'"]').each(function(){
          $(this).remove();
      });
  },
    /**
    * 桌面提醒功能
    * @param you_sender 消息发送者账号
    * @param nickName 消息发送者昵称
    * @param you_msgContent 接收到的内容
    * @param msgType 消息类型
    * @param isfrieMsg 是否阅后即焚消息
    * @param isCallMsg 是否音视频呼叫消息
    */
    DO_deskNotice:function(you_sender,nickName,you_msgContent,msgType,isfrieMsg,isCallMsg){
        console.log("you_msgContent="+you_msgContent+"；msgType="+msgType+"；isCallMsg="+isCallMsg);
        var title;
        var body = '';
        if(!!you_sender||!!nickName){
            if('g' == you_sender.substr(0, 1)){
                title = "群消息";
                if(!!nickName){
                    body = nickName +":";
                }else{
                    body = you_sender +":";
                }
            }else{
                if(!!nickName){
                    title = nickName;
                }else{
                    title = you_sender;
                }
            }
          
        }else{
            title = "系统通知";
            body = you_msgContent;
        }
        
        if(isfrieMsg){
            body += "[阅后即焚消息]";
        }else if(isCallMsg){
             body += you_msgContent;
        }else{
            if(1 == msgType){
                //emoji.showText = true;
                //you_msgContent = emoji.replace_unified(you_msgContent);
                //emoji.showText = false;
                body += you_msgContent;
            }else if(2 == msgType){
                body += "[语音]";
            }else if(3 == msgType){
                body += "[视频]";
            }else if(4 == msgType){
                body += "[图片]";
            }else if(5 == msgType){
                body += "[位置]";
            }else if(6 == msgType){
                body += "[附件]";
            }
        }
        if(!IM._Notification || !IM.checkWindowHidden()){
            return ;
        }
  
        var instance = new IM._Notification(
                title, {
                    body: body,
                    icon: "img/logo-blue.png"
                }
            );
            
        instance.onclick = function () {
            // Something to do
        };
        instance.onerror = function () {
            // Something to do
        };
        instance.onshow = function () {
            // Something to do
            setTimeout(function(){
                //instance.onclose();
                instance.close();
            }, 3000);
        };
        instance.onclose = function () {
            // Something to do
        };
    
    },
    /**
     * 获取hidden属性
     */
    getBrowerPrefix : function() {
        return 'hidden' in document ? null : function() {
            var r = null;
            ['webkit', 'moz', 'ms', 'o'].forEach(function(prefix) {
                if((prefix + 'Hidden') in document) {
                    return r = prefix;
                }
            });
            return r;
        }();
    },

    checkWindowHidden : function(){
        var prefix = IM.getBrowerPrefix();
        //不支持该属性
        if(!prefix){
            return document['hidden'];
        }
        return document[prefix+'Hidden'];
    },
    
    /****************************新增方法*****************************************/
	
	//向后台发送请求
	post : function(params, hdcall, options){
        options = options || {};
		var contextpath = options.contextpath || IM.getContextPath();
        var hashint = (options.hashint == null ? true : options.hashint); //是否需要提示信息
        var url = contextpath+"/commonAction.do";
        
        if (params.indexOf('&user_id=') < 0) {
            params += '&user_id=' + IM.getSession().user_id;
        }
        
		$.ajax({
            method: 'post',
            url: url,
            data: params,
            async: true,
            success: function(data) {
                var result = $.parseJSON(data);
                
                if (result.success == true || result.success == 'true') {
                	if (hashint) {
                		var msg = result.message;
	                    if (msg.length == 0) msg = '执行成功！';
	                    IM.HTML_showAlert('alert-success', msg);
                	}
                    
                    //成功执行外部的回调函数
                    if (hdcall != null) hdcall(result.data, result.extData);
                } else {
                    var msg = result.message;
                    if (msg.length == 0) msg = '执行失败！';
                    IM.HTML_showAlert('alert-warning', msg);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
            	alert(textStatus);
            	IM.HTML_showAlert('alert-warning', '请求后台执行异常：' + textStatus);
            }
        });
	},
	
	//取人员头像
	getPhotoURL : function(userId) {
		var name = 'avatar', i = '', s;
		if (userId) {
			//这样可以固定头像；默认最后字符小于4
			i = userId.charAt(userId.length-1);
			if (isNaN(i)) {
				i = userId.charCodeAt(userId.length-1)%5;
			}
		}
		var url = 'img/photo/'+name+i+'.png';
		return url;
	},
	
	//清除联系人信息
	clean_userList : function() {
	    $('#im_user_list').html('');
	},
	
	//重新加载联系人
	addUserToList : function(item) {
		var duty = item['sys_user__duty'];
		var mob_code = item['sys_user__mob_code'];
		
		var userid = item['sys_user__user_id'];
		var usercode = item['sys_user__user_code'];
		var username = item['sys_user__user_name'];
		var deptname = item['sys_dept__dept_name'];
		var imusercode = item['sys_user__im_user_code'];
		var photourl = IM.getPhotoURL(imusercode);
		var str = 
				'<li class="msg-cell" ondblclick="IM.DO_addContactToList(\''+imusercode+'\', \''+username+'\', \''+photourl+'\')"  contact_you="'+imusercode+'" contact_userid="'+userid+'">'+
                	'<div class="msg-object">'+
						'<img class="face" src="'+photourl+'">'+
					'</div>'+
					'<div class="msg-body">'+
						username+
						'<p class="msg-ellipsis">'+
							deptname+
							((duty.length > 0) ? (' | '+duty):'')+
							((mob_code.length > 0) ? (' | '+mob_code):'')
						'</p>'+
					'</div>'+
                '</li>';
		$('#im_user_list').append(str);
	},
	
	//取联系人
	DO_query_user : function(qryval) {
		IM.clean_userList();
		
		var params = 'funid=queryevent&eventcode=query_data&query_funid=sys_user&limit=50&start=0';
		//添加搜索条件
		if (qryval && qryval.length > 0) {
			var where_sql = 'sys_user.user_name like ?';
			var where_value = encodeURIComponent('%'+qryval+'%');
			var where_type = 'string';
		
			params += '&where_sql='+where_sql+'&where_value='+where_value+'&where_type='+where_type;
		}
		var hdcall = function(data){
			data = data.root;
			if (data.length == 0) {
				 $('#im_user_list').html('<li class="x-nodata">没有联系人！</li>');
				 return;
			}
			for (var i = 0, n = data.length; i < n; i++) {
				IM.addUserToList(data[i]);
			}
		};
		
		IM.post(params, hdcall, {hashint:false});
	},
	
	//查询联系人
	DO_search_user : function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();//不加这行，会使url回到#目录，重新登录
			var name = $('#user_qry').val();
			IM.DO_query_user(name);
		}
	},
	
	//删除当前会话信息
	DO_del_user : function(event) {
		var liuser = $(event.target).parents('li.msg-cell');
		var contact_you = liuser.attr('contact_you');
		//清除消息列表中的内容
		$('#im_content_list').find('div[msg="msg"]').each(function() {
            if ($(this).attr('content_you') == contact_you) {
                $(this).remove();
            }
        });
        //清除会话对象
        liuser.remove();
        
        //如果没有会话了，则显示提示文字
        var items = $('#im_contact_list').find('li.msg-cell');
        if (items.length == 0) {
        	$('#im_contact_list').find('li.x-nodata').show();
        }
	},
	
	//取当前会话信息
	getSession : function() {
		var session = localStorage.getItem('curruser_im');
    	if (!session || session.length == 0) {
            return;
    	}
    	return $.parseJSON(session);
	},
	
    //自动登录
    DO_auto_login : function() {
    	var obj = IM.getSession();
    	if (!obj) {
    		IM.HTML_showAlert('alert-warning', '用户没有登录！');
    		return;
    	}
    	$('#navbar_user_account').val(obj.im_user_code);
    	IM.DO_login();
    },
	
	//取项目名称
	getContextPath : function() {
		var contextPath = document.location.pathname; 
		var index =contextPath.substr(1).indexOf("/"); //这个地方可能有问题，要根据具体项目适当修改
		contextPath = contextPath.substr(0,index+1); 
		delete index; 
		return contextPath;
	},
	
    //把时间戳 YYYYMMddHHmmss 解析为日期或时间
	shortTime : function(ts, isbr) {
		if (!ts || ts.length < 14) return ts;
		if (ts.indexOf('-') > -1) {
			var re = /[-: ]/g;
			ts = ts.replace(re, '');
		}
		
		var cur = (new Date()).format("yyyyMMddhhmmss");
		//如果是当天的时间，则只显示HH:mm，否则显示日期
		if (cur.substr(0, 8) == ts.substr(0, 8)) {
			return '今天'+(isbr ? '<br>':' ')+ts.substr(8, 2)+':'+ts.substr(10, 2);
		} else {
			return ts.substr(4, 2)+'-'+ts.substr(6, 2)+(isbr ? '<br>':' ')+ts.substr(8, 2)+':'+ts.substr(10, 2);//不要年份：ts.substr(0, 4)+'-'+
		}
	}
};

	// 对Date的扩展，将 Date 转化为指定格式的String   
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
	// 例子：   
	// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
	// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
	Date.prototype.format = function(fmt) { //author: meizz   
	  var o = {   
	    "M+" : this.getMonth()+1,                 //月份   
	    "d+" : this.getDate(),                    //日   
	    "h+" : this.getHours(),                   //小时   
	    "m+" : this.getMinutes(),                 //分   
	    "s+" : this.getSeconds(),                 //秒   
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
	    "S"  : this.getMilliseconds()             //毫秒   
	  };   
	  if(/(y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;   
	};
})();
