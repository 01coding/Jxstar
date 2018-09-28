<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.config.SystemVar" %>
<%
	String contextpath = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+contextpath+"/";
	String use64 = SystemVar.getValue("sys.password.encode", "0");//密码是否编码
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	
	<title>智维云 - 登录</title>
	
	<base href="<%=basePath%>" />
    <link rel="shortcut icon" href="cloud/resources/images/favicon.png">

	<!-- bootstrap & fontawesome -->
	<link rel="stylesheet" href="cloud/resources/css/bootstrap.css" />
	<link rel="stylesheet" href="cloud/resources/css/font-awesome.css" />
	
	<link rel="stylesheet" href="cloud/resources/css/login.css" />

	<!--[if lt IE 9]>
	<script src="cloud/resources/js/html5shiv.js"></script>
	<script src="cloud/resources/js/respond.js"></script>
	<![endif]-->
</head>

<body>
	<div class="login-layout">
	<div class="navbar-fixed-top align-right">
		<br />
		<a href="index.jsp">Jxstar-Cloud</a>
		&nbsp;&nbsp; &nbsp;
	</div>
	
	<div class="login-container">
		<div id="login-box" class="panel-box">
			<h3 class="header blue">
				欢迎登录
			</h3>
			
			<form class="form-signin" id="form-first">
				<div class="field-group">
				  <span class="block input-icon input-icon-right">
					<input type="text" class="form-control" id="user_code" name="user_code" placeholder="请输入手机号/账号" />
					<i class="ace-icon fa fa-user"></i>
				  </span>
				</div>
				<div class="field-group">
				  <span class="block input-icon input-icon-right">
					<input type="password" class="form-control" id="user_pwd" name="user_pwd" placeholder="请输入密码">
					<i class="ace-icon fa fa-lock"></i>
				  </span>
				</div>
				<div class="field-group">
					<div class="input-group">
					  <input id="user_verify" name="user_verify" type="text" class="form-control" placeholder="请输入识别码，点击图片可更换" />
					  <span class="input-group-btn">
						<span class="regcode-icon">
						  <img id="verify_image" src="cloud/VerifyImage.jsp" />
						</span>
					  </span>
					</div>
				</div>
				<div class="field-group" style="height: 50px;">
				  <div class="col-xs-4 checkbox">
					<label>
					  <input id="is_rem" name="is_rem" checked type="checkbox"> &nbsp;&nbsp;记住我
					</label>
				  </div>
				  <div class="col-xs-8">
					<button type="button" class="btn btn-lg btn-primary btn-block" id="btn_login">登录</button>
				  </div>
				</div>
		    </form>
		    
			<div class="signin-footer center">
				<a href="cloud/findpwd.jsp">
					忘记密码
				</a>
				<span class="">|</span>
				没有账号，<a href="cloud/register.jsp">免费注册</a>
			</div>
		</div><!-- /.login-box -->

		<div id="select-box" class="panel-box hidden">
			<div class="widget-body">
				<div class="widget-main">
					<h3 class="header blue lighter bigger">
						选择公司登录
					</h3>

					<ul class="nav nav-pills nav-stacked center" id="select-nav">
					  <!--<li class="active"><a href="javascript:void(0);"></a></li>-->
					</ul>
				</div><!-- /.widget-main -->

				<div class="signin-footer center">
					<a href="#" data-target="#login-box">
						返回登录
					</a>
				</div>
			</div><!-- /.widget-body -->
		</div><!-- /.select-box -->
	</div>
	
	<div class="footer">
		<div class="footer-inner">
			<div class="footer-content">
			  <div>
				<a href="http://www.eamcloud.cn">
				  <img width=200 height=60 src="cloud/resources/images/logo2.png" />
				</a>
			  </div>
			</div>
		</div>
		<div id="ios-app-down" style="position:absolute; bottom:2px; left:10px; text-align: center;">
			<img src="cloud/resources/images/ios-app.png" style="width:80px; height:80px; border-radius:3px;" />
			<div style="color:#fff;">
				<i class="ace-icon fa fa-apple bigger-200"></i>&nbsp;iPhone
			</div>
		</div>
		<div id="ios-app-down" style="position:absolute; bottom:2px; right:10px; text-align: center;">
			<img src="cloud/resources/images/android-app.png" style="width:80px; height:80px; border-radius:3px; margin:2px;" />
			<div style="color:#fff;">
				<i class="ace-icon fa fa-android bigger-200"></i>&nbsp;Android
			</div>
		</div>
	</div>
	</div>
	<!-- basic scripts -->
	<script src="lib/base64.min.js"></script>
	<script src="cloud/resources/js/jquery-2.1.4.min.js"></script>
	<script src="cloud/resources/js/jquery.validate.js"></script>
    
	<script src="cloud/resources/js/bootstrap.js"></script>
	
	<script src="cloud/resources/js/util/JxHint.js"></script>
	<script src="cloud/resources/js/util/JxMask.js"></script>
	<script src="cloud/resources/js/util/JxRequest.js"></script>
	<script src="cloud/resources/js/util/JxUtil.js"></script>
	<!-- inline scripts related to this page -->
	<script type="text/javascript">
	
    jQuery(function($) {
		var use64 = ('<%=use64%>' == '1');
		//IE版本添加属性，处理背景图片自适应问题
		if(document.all){
			//$('.login-layout').attr("style", "overflow-y:scroll;");
		}
		
		//登录事件注册
        $('#btn_login').on('click', function(){
			//不需要提示信息；不需要遮挡层
			var opts = {hashint:false, hasmask:false, contextpath:"<%=contextpath%>"};
			
			$("#form-first").submit(); //要先模拟提交，才能验证数据有效性
            if (!valid1.valid()) return;
			
			var is_rem = $('#is_rem').get(0).checked;
			var user_pwd = $('#user_pwd').val();
			var user_code = $('#user_code').val();
			var user_verify = $('#user_verify').val();
			//采用Base64编码方式加密
			if (use64) user_pwd = Base64.encode(user_pwd);
            var params = 'funid=login_event&eventcode=cloud_login&user_code='+user_code+'&user_pwd='+user_pwd+'&user_verify='+user_verify;
            JxRequest.post(params, function(data){
				if (data.isone) {
					data.info['is_rem'] = is_rem;
					localStorage.setItem("curruser", JxUtil.encode(data.info));
					window.location.href = '<%=contextpath%>/main.jsp';
				} else {
					//保存后切换账户用
					localStorage.setItem("select_tenants", JxUtil.encode({info:data.info, myx:user_pwd}));
					$('#select-nav').html('');
					for (var i = 0, n = data.info.length; i < n; i++) {
						var obj = data.info[i];
						$('#select-nav').append('<li><a data-tenant-id="'+ obj.tenant_id +'" data-info-index="'+ i 
							+'" href="javascript:void(0);">'+ obj.tenant_name +'</a></li>');
					}
					//选择后继续登录系统，处理会话信息
					$('#select-nav li a').on('click', function(e){
						e.preventDefault();
						var index = $(this).data('info-index');
						var ten = data.info[index];
						var e = encodeURIComponent;
						var params = 'funid=login_event&eventcode=cloud_login&user_code='+user_code+'&user_pwd='+user_pwd+'&user_verify='+user_verify+
									 '&tenant_id='+ten.tenant_id+'&tenant_name='+e(ten.tenant_name);
						JxRequest.post(params, function(data){
							ten['is_rem'] = is_rem;
							ten['user_code'] = user_code;
							localStorage.setItem("curruser", JxUtil.encode(ten));
							window.location.href = '<%=contextpath%>/main.jsp';
						}, opts);
					});
					
					$('#login-box').addClass('hidden');
					$('#select-box').removeClass('hidden');
				}
            }, opts);
        });
		
		//取上次登录的用户
		var session = localStorage.getItem('curruser');
		if (session) {
			session = JxUtil.decode(session);
			if (session.is_rem) {
				$('#user_code').val(session.user_code);
				$('#user_pwd').val('');
				$('#user_verify').val('');
				$('#user_pwd').get(0).focus();
			} else {
				$('#user_code').val('');
				$('#user_pwd').val('');
				$('#user_verify').val('');
				$('#user_code').get(0).focus();
			}
		} else {
			$('#user_code').val('');
			$('#user_pwd').val('');
			$('#user_verify').val('');
			$('#user_code').get(0).focus();
		}
		var cusercode = localStorage.getItem('cur_user_code');
		if (cusercode) {
			$('#user_code').val(cusercode);
			$('#user_pwd').get(0).focus();
			//只在注册时用一次
			localStorage.removeItem('cur_user_code');
		}
		
		//回车执行登录
		$('#user_verify').on('keyup', function(e){
			if (e.keyCode == 13) {
				$("#btn_login").trigger("click");
			}
		});
		
		//更换验证码
		$('#verify_image').on('click', function(){
			$(this).attr('src', 'cloud/VerifyImage.jsp?dt=' + (new Date()).getTime());
		});
				
		//数据有效判断
		var valid1 = $("#form-first").validate({
			rules: {
				user_pwd: "required",
				user_code: {
					required: true
					//mobilecode: true
				},
				user_verify: {
					required: true,
					maxlength: 4,
					minlength: 4
				}
			},
			messages: {
				user_pwd: "请输入登录密码",
				user_code: {
					required: "请输入登录账号",
					//mobilecode: "登录账号格式为手机号码！"
				},
				user_verify: {
					required: "请输入右边图片中的验证码",
					maxlength: "验证码长度为4位",
					minlength: "验证码长度为4位"
				}
			}
		});
    });
	</script>
</body>
</html>
