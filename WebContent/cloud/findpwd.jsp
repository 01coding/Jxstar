<%@ page contentType="text/html; charset=UTF-8"%>
<%
	String contextpath = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+contextpath+"/";
%>
<!DOCTYPE html>
<html lang="zh-CN">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		
		<title>智维云 - 重置密码</title>
		
		<base href="<%=basePath%>" />
        <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="<%=contextpath%>/cloud/resources/images/favicon.png">

		<!-- bootstrap & fontawesome -->
		<link rel="stylesheet" href="<%=contextpath%>/cloud/resources/css/bootstrap.css" />
		<link rel="stylesheet" href="<%=contextpath%>/cloud/resources/css/font-awesome.css" />
		
		<link rel="stylesheet" href="<%=contextpath%>/cloud/resources/css/login.css" />

		<!--[if lt IE 9]>
		<script src="<%=contextpath%>/cloud/resources/js/html5shiv.js"></script>
		<script src="<%=contextpath%>/cloud/resources/js/respond.js"></script>
		<![endif]-->
	</head>

<body>
	<div class="login-layout">
	<div class="login-container">
		<h3 class="header blue">
			重置密码
		</h3>
		
		<div id="page1" class="panel-box">
			<form class="form-signin" id="form-first">
			  <div class="field-group">
				<div class="input-group">
				  <input id="user_verify" name="user_verify" type="text" class="form-control" autofocus placeholder="请输入识别码，点击图片可更换" />
				  <span class="input-group-btn">
					<span class="regcode-icon">
					  <img id="verify_image" src="cloud/VerifyImage.jsp" />
					</span>
				  </span>
				</div>
		      </div>
			
              <div class="field-group row">
              	<div class="col-xs-8">
              	  <input id="user_code" name="user_code" type="text" class="form-control" required placeholder="请输入手机号，用于登录账号" />
              	</div>
              	<div class="col-xs-4 center">
              	  <button id="repeat_btn" type="button" class="btn btn-success" style="height: 40px;">获取验证码</button>
              	</div>
              </div>
			  
			  <div class="hr">&nbsp;</div>
              
              <div class="field-group">
                <input id="check_code" name="check_code" type="text" class="form-control" required placeholder="请输入您收到的验证码" />
              </div>
            </form>
            
  			<div class="field-group">
				<button id="btn_check" type="button" class="btn btn-lg btn-primary" style="width: 50%;">验证</button>
			</div>
		</div><!-- /.login-box -->
						
		<div id="page2" class="panel-box hidden">
			<form class="form-signin" id="form-second">
              <div class="field-group">
                <input type="password" class="form-control" id="user_pwd1" name="user_pwd1" placeholder="请输入新的密码，至少4位" />
              </div>
              <div class="field-group">
                <input type="password" class="form-control" id="user_repwd1" name="user_repwd1" placeholder="请再次输入新密码" />
              </div>
           </form>
			
			<div class="field-group">
				<button id="btn_commit" type="button" class="btn btn-lg btn-primary" style="width: 50%;">提交</button>
			</div>
		</div><!-- /.select-box -->
		
		<div class="signin-footer center">
		 	想起密码?
			<a href="<%=contextpath%>/index.jsp">
				直接登录
			</a>
			<span class="">|</span>
			没有账号，<a href="<%=contextpath%>/cloud/register.jsp">
				免费注册
			</a>
		</div>
	</div>

	<div class="footer">
		<div class="footer-inner">
			<div class="footer-content">
              <div>
				<a href="http://www.eamcloud.cn">
				  <img width=200 height=60 src="<%=contextpath%>/cloud/resources/images/logo2.png" />
				</a>
			  </div>
			</div>
		</div>
	</div>
	</div>
	<!-- basic scripts -->

	<script src="<%=contextpath%>/cloud/resources/js/jquery-2.1.4.min.js"></script>
	<script src="<%=contextpath%>/cloud/resources/js/jquery.validate.js"></script>
	
	<script src="<%=contextpath%>/cloud/resources/js/bootstrap.js"></script>
	
	<script src="<%=contextpath%>/cloud/resources/js/util/JxHint.js"></script>
	<script src="<%=contextpath%>/cloud/resources/js/util/JxMask.js"></script>
	<script src="<%=contextpath%>/cloud/resources/js/util/JxRequest.js"></script>
	<script src="<%=contextpath%>/cloud/resources/js/util/JxUtil.js"></script>

    <!-- inline scripts related to this page -->
    <script type="text/javascript">
    jQuery(function($) {
    	//清空所有数据
		$("input").each(function(index){
			$(this).val('');
		});
		
  		var user_code = $("#user_code");
  		var repeat_btn = $("#repeat_btn");
  		
		//不需要用户验证；成功不需要提示；不需要遮挡层
		var opts = {nousercheck:true, hashint:false, hasmask:false, contextpath:'<%=contextpath%>'};
		//重新获取验证码的120秒判断
		var BT = 120, c = BT;
		var timeout = function(a){
			if (c == 0) {
				repeat_btn.html("重新获取验证码");
				repeat_btn.attr("disabled", false);
				return;//结束递归
			} else {
				c--;
				$("#time_out").html(c);
			}
			setTimeout(timeout, 1000);
		};
		
		//重新获取验证码事件注册
		repeat_btn.on("click", function(){
			if (!user_code.valid()) return;
			
			var usercode = user_code.val();
			var user_verify = $('#user_verify').val();
			var params = 'funid=login_event&eventcode=sendsms&user_code='+usercode+'&user_verify='+user_verify;
			JxRequest.post(params, function(data){
				repeat_btn.html('<span id="time_out" class="red">'+BT+'</span>秒后可重新获取');
				repeat_btn.attr("disabled", true);
				$("#check_code").focus();
				c = BT;
				timeout();
				JxHint.alert('已向'+usercode+'发送了验证码，'+BT+'秒内有效！');
			}, opts);
		});
		
		//找回密码第一步
		$('#btn_check').on('click', function(){
			$("#form-first").submit(); //要先模拟提交，才能验证数据有效性
			if (!valid1.valid()) return;
			
			var user_code = $('#user_code').val();
			var check_code = $('#check_code').val();
			var params = 'funid=login_event&eventcode=findpwd&user_code='+user_code+'&check_code='+check_code;
			JxRequest.post(params, function(){
				$("#page1").addClass("hidden");
				$("#page2").removeClass("hidden");
				
				$('#user_pwd1').focus();
			}, opts);
		});
		
		//找回密码第二步
		$('#btn_commit').on('click', function(){
			$("#form-second").submit(); //要先模拟提交，才能验证数据有效性
			if (!valid2.valid()) return;
			
			var user_code = $('#user_code').val();
			var user_pwd1 = $('#user_pwd1').val();
			var user_repwd1 = $('#user_repwd1').val();
			var params = 'funid=login_event&eventcode=savepwd&user_code='+user_code+'&user_pwd='+user_pwd1+'&user_repwd='+user_repwd1;
			JxRequest.post(params, function(){
				localStorage.setItem('cur_user_code', user_code);
				JxHint.alert("密码修改成功，请重新登录！");
				window.location.href = "<%=contextpath%>/index.jsp";
			}, opts);
		});
		
		//设置字段校验
		var valid1 = $("#form-first").validate({
			rules: {
				user_code: {
					required: true,
					mobilecode: true
				},
				check_code: "required",
				user_verify: "required"
			},
			messages: {
				user_code: {
					required: "请输入登录账号",
					mobilecode: "登录账号格式为手机号码！"
				},
				check_code: "请输入您收到的验证码",
				user_verify: "请输入识别码"
			}
		});
		var valid2 = $("#form-second").validate({
			/*errorPlacement: function(error, element) {
				error.appendTo(element.parent());
			},*/
			rules: {
				user_pwd1: {
					required: true,
					minlength: 4
				},
				user_repwd1: {
					required: true,
					minlength: 4,
					equalTo: "#user_pwd1"
				}
			},
			messages: {
				user_pwd1: {
					required: "请输入密码，长度至少4位",
					minlength: "请输入密码，长度至少4位"
				},
				user_repwd1: {
					required: "请重复输入密码",
					minlength: "请重复输入密码，长度至少4位",
					equalTo: "重复输入的密码必须与第一次相同"
				}
			}
		});
		
		//更换验证码
		$('#verify_image').on('click', function(){
			$(this).attr('src', 'cloud/VerifyImage.jsp?dt=' + (new Date()).getTime());
		});
    });
    </script>
	</body>
</html>
