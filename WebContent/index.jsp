<%@ include file="index_top.jsp"%>
<div id="body_div" class="body_div">
	<!--<div id="td_language" style="float:right;"><a href="index_yun.jsp">&nbsp;&nbsp;login_cloud&nbsp;&nbsp;</a></div>-->
	<div id="login_body" class="login_body">
		<div class="login_div">
		<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" <%if (seLang.equals("1")) {%> style="line-height:45px;" <%}%>>
		  <tr>
			<td><%=JsMessage.getValue("index.text1")%></td><!--账号：-->
			<td><input type="text" class="iput_text" tabindex=1 name="user_code" id="user_code" style="height:30px;"></td>
		  </tr>
		  <tr>
			<td><%=JsMessage.getValue("index.text2")%></td><!--密码：-->
			<td><input type="password" class="iput_text" tabindex=2 name="user_pass" id="user_pass" onfocus="this.select()" style="height:30px;"></td>
		  </tr>
		<%if (seLang.equals("1")) {%>
		  <tr>
			<td><%=JsMessage.getValue("index.text3")%></td><!--语言：-->
			<td><select name="select_lang" id="select_lang" size="1" tabindex=3 style="height:30px;width:150px;">
				<option value="zh" selected>中文
				<option value="en">English
				</select>
			</td>
		  </tr>
		<%}%>
		  <tr style="height:30px;">
			<td></td>
			<td>
				<input type="checkbox" CHECKED name="keep_pass" id="keep_pass">&nbsp;&nbsp;<%=JsMessage.getValue("index.text4")%><!--记住密码-->
			</td>
		  </tr>
		  <tr>
			<td height="60" colspan="2"><!--登录--><!--取消-->
			<input type="button" class="iput_bnt" id="loginbtn" value="<%=JsMessage.getValue("index.text5")%>" />
			<input type="button" class="iput_bnt" style="margin-left:20px;" id="returnbtn" value="<%=JsMessage.getValue("index.text6")%>" />
			</td>
		  </tr>
		</table>
		</div>
		<div class="cpr_div"><%=indexBottom%></div>
		<div id="ios-app-down" style="position:absolute; bottom:2px; left:10px; text-align: center; display:none;">
			<img src="cloud/resources/images/ios-app.png" style="width:80px; height:80px; border-radius:3px;" />
			<div style="color:#333;">
				<i class="ace-icon fa fa-apple bigger-150"></i>&nbsp;iPhone
			</div>
		</div>
		<div id="ios-app-down" style="position:absolute; bottom:2px; right:10px; text-align: center; display:none;">
			<img src="cloud/resources/images/android-app.png" style="width:80px; height:80px; border-radius:3px; margin:2px;" />
			<div style="color:#333;">
				<i class="ace-icon fa fa-android bigger-150"></i>&nbsp;Android
			</div>
		</div>
	</div>
</div>
<%@ include file="index_bottom.jsp"%>