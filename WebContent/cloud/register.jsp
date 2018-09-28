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
	
	<title>智维云 - 注册</title>

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
			<span>
				欢迎注册
			</span>
			<h4 class="hidden red header" id="sel_bus_type">
				<label class="radio-inline">
					选择版本：
				</label>
				<label class="radio-inline">
				  <input type="radio" name="bus_type" id="bus_type1" value="1" checked> 资产管理
				</label>
				<label class="radio-inline">
				  <input type="radio" name="bus_type" id="bus_type2" value="2"> 设备管理
				</label>
			</h4>
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

              <div class="field-group" style="height: 30px;">
              	<label>
                <input id="user_agree" name="user_agree" checked type="checkbox"> 
                &nbsp;&nbsp;同意接受
                <a href="#">《智维云使用条款》</a>
              	</label>
			  </div>
            </form>
            
  			<div class="field-group">
				<button id="btn_check" type="button" class="btn btn-lg btn-primary" style="width: 50%;">验证</button>
			</div>
		</div><!-- /.login-box -->

		<div id="page2" class="panel-box hidden">
			<div class="hidden" id="div_tenant1">
				<h5 class="label-title" id="tenant_ret_h5"></h5>
				<form class="form-signin" id="form-three">
					<div class="field-group">
						<input type="text" class="form-control" id="tenant_name_ret" name="tenant_name_ret" placeholder="请输入新公司名称" />
					</div>
				</form>
			</div>
			
			<div class="hidden" id="div_tenant2">
				<form class="form-signin" id="form-second">
	              <div class="field-group">
	                <input type="text" class="form-control" id="tenant_name" name="tenant_name" placeholder="请输入公司名称" />
	              </div>
	              <div class="field-group">
	                <input type="text" class="form-control" id="user_name" name="user_name" placeholder="请输入姓名" />
	              </div>
	              <div class="field-group">
	                <input type="text" class="form-control" id="user_email" name="user_email" placeholder="请输入电子邮箱地址" />
	              </div>
	              <div class="field-group">
					<input type="text" class="form-control hidden" id="mob_code" name="mob_code" placeholder="请输入手机号码" />
				  </div>
	              <div class="hr hr10" id="user_pwd_line" ></div>
	              <div class="field-group">
	                <input type="password" class="form-control" id="user_pwd" name="user_pwd" placeholder="请输入密码，至少4位" />
	              </div>
	              <div class="field-group">
	                <input type="password" class="form-control" id="user_repwd" name="user_repwd" placeholder="请重复输入密码" />
	              </div>
	            </form>
			</div>
			
			<div class="field-group">
				<button id="btn_commit" type="button" class="btn btn-lg btn-primary" style="width: 50%;">提交</button>
			</div>
		</div><!-- /.select-box -->
		
		<div class="signin-footer center">
		  已有账号，直接
		  <a href="<%=contextpath%>/index_yun.jsp">登录</a>
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
		$("input[name!='bus_type']").each(function(index){
			$(this).val('');
		});
		
  		var user_code = $("#user_code");
  		var repeat_btn = $("#repeat_btn");
  		repeat_btn.attr("disabled", false);
  		
  		//是否新的注册用户，平台支持一个账号多账套
  		var hasten = "0";
		//不需要用户验证；成功不需要提示；不需要遮挡层
        var opts = {nousercheck:true, hashint:false, hasmask:true, contextpath:'<%=contextpath%>'};
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
			var params = 'funid=login_event&eventcode=reg_repeat&user_code='+usercode+'&user_verify='+user_verify;
			JxRequest.post(params, function(data){
				repeat_btn.html('<span id="time_out" class="red">'+BT+'</span>秒后可重新获取');
				repeat_btn.attr("disabled", true);
				$("#check_code").focus();
				c = BT;
				timeout();
				JxHint.alert('已向'+usercode+'发送了验证码，'+BT+'秒内有效！');
			}, opts);
		});
		
		//从后台取租户信息
        var qryten = function(json){
            if (json.length > 0) {
            	hasten = "1";
                $('#div_tenant1').removeClass("hidden");
                
                var names = '';
                $(json).each(function(i,obj){
                	names += obj.tenant_name+',';
                });
                if (names.length > 0) {
                	names = names.substr(0, names.length-1);
                }
                                    
                var hts = $("#tenant_ret_h5");
                hts.html('存在公司信息：<h4 class="red">'+names+'</h4>可返回直接登录，也可以输入新公司名称注册：');
            } else {
                hasten = "0";
                $("#div_tenant2").removeClass("hidden");
            }
            
            $('#mob_code').val(user_code.val());
        };
		
		//第一步
		var btn_check = $("#btn_check");
		btn_check.on("click", function(){
			$("#form-first").submit();
  			if (!valid1.valid()) return;
						
			var user_agree = $("#user_agree").get(0).checked;
			var usercode = user_code.val();
			var checkcode = $("#check_code").val();
			
			var params = 'funid=login_event&eventcode=reg_second&user_code='+usercode+'&check_code='+checkcode;
			JxRequest.post(params, function(data){
				$("#page1").addClass("hidden");
				$("#page2").removeClass("hidden");
				
				//$("h3.header").addClass("hidden");
				//$("#sel_bus_type").removeClass("hidden");
				
				qryten(data);
			}, opts);
		});
		//第二步
		var btn_commit = $("#btn_commit");
		btn_commit.on("click", function(){
			var userpwd = $("#user_pwd").val();
			var userrepwd = $("#user_repwd").val();
			var usercode = user_code.val();
			var mobcode = $("#mob_code").val();
			var useremail = $("#user_email").val();
			var username = $("#user_name").val();
			var tenantname = $("#tenant_name").val();
			var tenantname_ret = $("#tenant_name_ret").val();
			//var bus_type = $("input:checked[name='bus_type']").val();
			
			if (hasten == "0") {
				$("#form-second").submit();
	            isvalid = valid2.valid();
			} else {
				$("#form-three").submit();
				isvalid = valid3.valid();
				tenantname = tenantname_ret;
			}
			if (!isvalid) return;
			
			var isnew = (hasten == "1") ? "0" : "1";
			var e = encodeURIComponent;
            var params = 'funid=login_event&eventcode=reg_three&isnew='+isnew+'&user_code='+e(usercode)+'&tenant_name='+e(tenantname)+
                         '&user_name='+e(username)+'&mob_code='+e(mobcode)+'&user_email='+e(useremail)+'&user_pwd='+userpwd+'&user_repwd='+userrepwd+
						 '&bus_type=';
			
            JxRequest.post(params, function(data){
            	localStorage.setItem('cur_user_code', usercode);
				JxHint.hint("用户注册成功，将登录系统！");
				window.location.href = "<%=contextpath%>/index_yun.jsp";
			}, opts);
		});
		
	    var valid1 = $("#form-first").validate({
	        rules: {
				user_verify: "required",
	        	user_code: {
	                required: true,
	                mobilecode: true
	            },
	            user_agree: "required",
	            check_code: "required"
	        },
	        messages: {
				user_verify: "请输入识别码",
	        	user_code: {
	                required: "请输入手机号，用于登录账号与短信验证"
	            },
	            user_agree: "请勾选同意",
	            check_code: "请输入您收到的验证码"
	        }
	    });
	
	    var valid2 = $("#form-second").validate({
	        rules: {
	            tenant_name: "required",
	            user_name: "required",
	            user_email: {
	                required: true,
	                email: true
	            },
	            user_pwd: {
	                required: true,
	                minlength: 4
	            },
	            user_repwd: {
	                required: true,
	                minlength: 4,
	                equalTo: "#user_pwd"
	            }
	        },
	        messages: {
	            tenant_name: "请输入公司名称",
	            user_name: "请输入姓名",
	            user_email: {
	                required: "请输入电子邮箱地址",
	                email: "请输入正确的邮箱格式，如：myname@163.com"
	            },
	            user_pwd: {
	                required: "请输入密码，长度至少4位",
	                minlength: "请输入密码，长度至少4位"
	            },
	            user_repwd: {
	                required: "请重复输入密码",
	                minlength: "请重复输入密码，长度至少4位",
	                equalTo: "重复输入的密码必须与第一次相同"
	            }
	        }
	    });
	    
	    var valid3 = $("#form-three").validate({
	        rules: {
	            tenant_name_ret: "required"
	        },
	        messages: {
	            tenant_name_ret: "请输入新的公司名称"
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
