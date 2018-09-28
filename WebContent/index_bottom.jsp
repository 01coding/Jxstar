<script type="text/javascript">
Ext.onReady(function() {
	window.contextpath = '<%=contextpath%>';
	Jxstar.path = '<%=contextpath%>';
	Jxstar.allpath = window.location.protocol+'//'+window.location.host+'<%=contextpath%>';
	Jxstar.systemVar.indexType = '<%=indexType%>';
	Jxstar.systemVar.verType = '<%=verType%>';
	Jxstar.systemVar.useCase = '<%=useCase%>';
	Jxstar.systemVar.dbType = '<%=dbType%>';
	//把所有用于页面的系统变量附加到对象中
	Ext.apply(Jxstar.systemVar, Ext.decode("<%=allVarJs%>"));
	//设置EXT的常量
	Ext.BLANK_IMAGE_URL = Jxstar.path + '/lib/ext/resources/images/default/s.gif';
	//所有系统变量加载完后再调用工程自定义扩展
	Request.loadJS('/custom.js');
	
	var usercodeEl = Ext.get('user_code');
	var userpassEl = Ext.get('user_pass');
	var keeppassEl = Ext.get('keep_pass');
	
	//取上次登录用户
	var CURRCODE = Ext.util.Cookies.get('cur_user_code');
	if (CURRCODE != null && CURRCODE.length > 0) {
		usercodeEl.dom.value = CURRCODE;
		userpassEl.focus();
	} else {
		usercodeEl.focus();
	}
	var use64 = (Jxstar.systemVar.sys__password__encode == '1');
	//记住密码
	var keeped = Ext.util.Cookies.get('cur_keep_pass');
	if (keeped != null && keeped.length > 0) {
		keeppassEl.dom.checked = true;
		var pwd = Ext.util.Cookies.get('cur_user_pass');
		//采用Base64编码方式解密
		if (use64 && pwd) pwd = Base64.decode(pwd);
		userpassEl.dom.value = pwd;
	} else {
		keeppassEl.dom.checked = false;
	}
	
	//回车登录
	var enter = function(e){
		if (e.getKey() == e.ENTER) {f_login();}
	};
	userpassEl.on('keypress', enter);
	usercodeEl.on('keypress', enter);
	
	//登陆成功
	var f_success = function(data) {
		userpassEl.remove();
		usercodeEl.remove();
		Ext.fly('login_body').remove();
		Ext.fly('body_div').remove();
		
		Jxstar.session = data;
		Jxstar.session.maxInterval = <%=session.getMaxInactiveInterval()%>;
		Jxstar.session.sessionId = '<%=session.getId()%>';
		Request.loadJS('/public/core/JxBody.js');
	};
	
	//登陆方法
	var f_login = function() {
		var usercode = usercodeEl.dom.value;
		if (usercode == "") {
			alert(jx.index.nocode);
			return false;
		}
		//保存一个月，只保留上次的登录用户名
		Ext.util.Cookies.set('cur_user_code', usercode, (new Date()).add(Date.MONTH, 1));
		var pwd = userpassEl.dom.value;
		userpassEl.dom.value = "";
		//采用Base64编码方式加密
		if (use64) pwd = Base64.encode(pwd);
		
		//记住密码
		var keeped = keeppassEl.dom.checked;
		if (keeped) {
			Ext.util.Cookies.set('cur_keep_pass', '1', (new Date()).add(Date.MONTH, 1));
			Ext.util.Cookies.set('cur_user_pass', pwd, (new Date()).add(Date.MONTH, 1));
		} else {
			Ext.util.Cookies.set('cur_keep_pass', '', (new Date()).add(Date.MONTH, 1));
		}
		
		//设置请求的参数
		var params = 'funid=login&eventcode=login&pagetype=login';
		params += '&user_code='+usercode+'&user_pass='+pwd;

		//发送请求
		Ext.lib.Ajax.request(
			'POST', Jxstar.path + '/commonAction.do',
			{
				success: function(response) {
					var result = Ext.decode(response.responseText);
					if (result.success) {
						//如果是密码过期，弹出对话框修改
						var extd = result.extData;
						if (extd && extd.passExpire) {
							Jxstar.session = result.data;
							JxUtil.setPass(extd.userId, function(){f_success(result.data);});
							JxHint.alert(result.message);
						} else {
							f_success(result.data);
						}
					} else {
						JxHint.alert(result.message);
					}
				},
				failure: function(response) {
					response.srcdesc = 'index_bottom.jsp?'+params;
					JxUtil.errorResponse(response);
				}
			},
			params
		);
	};
	
	//登陆按钮
	Ext.fly('loginbtn').on('click', f_login);
	Ext.fly('returnbtn').on('click', function(){
		usercodeEl.dom.value = "";
		userpassEl.dom.value = "";
		usercodeEl.focus();
	});
	
	//添加frmhidden的响应事件，用于处理文件下载的错误消息
	Ext.fly('frmhidden').on('load', function(event, dom){
		var doc = null;
		try {doc = dom.contentWindow.document;} catch(e) {}
		
		if (doc) {
			var text = doc.body.innerHTML;
			if (text == null || text.length == 0) {
				text = jx.index.downerror;
			}
			JxHint.alert(text);
		} else {
			JxHint.alert(jx.index.exeok);//'执行完成！'
		}
	});
	
	//给语言选项控件添加事件
	var seLang = Ext.get('select_lang');
	if (seLang) {
		seLang.on('change', function(e, t, o){
			var type = t.options[t.selectedIndex].value;
			window.location.href = Jxstar.path + '/index.jsp?currLang=' + type;
		});
		var opts = seLang.dom.options;
		for (var i = 0; i < opts.length; i++) {
			if (opts[i].value == '<%=curLangType%>') {
				opts[i].selected = true;
			}
		}
		//标记当前语言选项
		JxLang.type = '<%=curLangType%>';
		JxLang.curLang = '<%=curLangType%>';
	}
});
</script>
<script type="text/javascript">
var down_firfox = function() {
	var params = 'funid=sys_attach&keyid=jxstar0001&pagetype=editgrid&eventcode=down&nousercheck=1';
	Request.fileDown(params);
};
//用ExtJs的事件注册时无效
var doKey = function(e){
	var ev = e || window.event;
	var obj = ev.target || ev.srcElement;
	var t = obj.type || obj.getAttribute('type');//获取事件源类型
	if(ev.keyCode == 8 && (t == null || 
	  (t != "password" && t != "text" && t != "textarea"))){
		return false;
	}
};
//禁止后退键 作用于Firefox、Opera
document.onkeypress=doKey;
//禁止后退键  作用于IE、Chrome
document.onkeydown=doKey;
</script>
<%
//移除当前线程的语言类型
if (JxText.langUsed()) JxText.removeLang();
%>

	</body>
</html>