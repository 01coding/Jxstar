/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 调用服务方法工具的界面。
 * 
 * @author KevinCao
 * @version 1.0, 2013-03-25
 */

Jxstar.currentPage = function() {
	//微信消息测试
	var wxTest = function(){
		var form = toolForm.getForm();
		var openid = form.findField('wx_openid').getValue();
		var msg = form.findField('wx_msg').getValue();
		
		var msgType = form.findField('msg_type').getGroupValue();
		
		if(openid.length == 0){
			JxHint.alert('请输入测试账号！');
			return false;
		}else if(msg.length == 0){
			JxHint.alert('请输入消息内容！');
			return false;
		}
		
		var e = encodeURIComponent;
		var params = 'funid=data_big&eventcode=wxms&openid='+openid + '&msg='+e(msg)+'&msgtype='+msgType;
		
		var endcall = function(data) {
			JxHint.alert('执行成功！');
		};

		//发送请求
		Request.postRequest(params, endcall);
	};
	
	//内部接口测试
	var nbTest = function(){
		var form = toolForm.getForm();
		var x_usercode = form.findField('x_usercode').getValue();
		var x_userpass = form.findField('x_userpass').getValue();
		var x_url = form.findField('x_url').getValue();
		var x_param = form.findField('x_param').getValue();
		
		if(x_usercode.length == 0){
			JxHint.alert('请输入登录账号！');
			return false;
		}else if(x_userpass.length == 0){
			JxHint.alert('请输入登录密码！');
			return false;
		}else if(x_url.length == 0){
			JxHint.alert('请输入服务地址！');
			return false;
		}else if(x_param.length == 0){
			JxHint.alert('请输入请求参数！');
			return false;
		}
		
		var e = encodeURIComponent;
		var params = 'funid=data_big&eventcode=jxws';
		params += '&xuser_code='+ x_usercode +'&xuser_pass='+ x_userpass +'&service_url='+ e(x_url) +'&request_param='+ e(x_param);
		
		var endcall = function(data) {
			form.findField('x_result').setValue(data);
		};

		//发送请求
		request(params, endcall);
	};
	
	//外部接口测试
	var wbTest = function(type){
		var form = toolForm.getForm();
		var x_usercode = form.findField('x_usercode').getValue();
		var x_userpass = form.findField('x_userpass').getValue();
		var x_url = form.findField('x_url').getValue();
		
		var x_method = form.findField('x_method').getValue();
		var x_paramn = form.findField('x_paramn').getValue();
		var x_paramv1 = form.findField('x_paramv1').getValue();
		var x_paramv2 = form.findField('x_paramv2').getValue();
		var x_paramv3 = form.findField('x_paramv3').getValue();
		var pvs = [x_paramv1, x_paramv2, x_paramv3];
		
		if(x_usercode.length == 0){
			JxHint.alert('请输入登录账号！');
			return false;
		}else if(x_userpass.length == 0){
			JxHint.alert('请输入登录密码！');
			return false;
		}else if(x_url.length == 0){
			JxHint.alert('请输入服务地址！');
			return false;
		}else if(x_method.length == 0){
			JxHint.alert('请输入请求方法名！');
			return false;
		}else if(x_paramn.length == 0){
			JxHint.alert('请输入请求参数名称！');
			return false;
		}
		
		var e = encodeURIComponent;
		var params = 'funid=data_big&eventcode=tows';
		params += '&xuser_code='+ x_usercode +'&xuser_pass='+ x_userpass +'&service_url='+ e(x_url) +'&method_name='+ e(x_method);
		
		var pns = x_paramn.split(',');
		for (var i = 1; i <= pns.length; i++) {
			var nn = pns[i-1];
			if (nn.length == 0) continue;
			
			params += '&param_name'+i+'='+nn+'&param_value'+i+'='+pvs[i-1];
		}
		
		var endcall = function(data) {
			form.findField('x_result').setValue(data);
		};

		//发送请求
		request(params, endcall);
	};
	
	var request = function(params, hdcall){
		params += '&user_id=' + Jxstar.session['user_id'] + '&dataType=json';
		
		var myMask = new Ext.LoadMask(Ext.getBody());
		myMask.show();
				
		Ext.Ajax.request({
			method: 'POST',
			url: Jxstar.path + '/commonAction.do',
			timeout: 60*1000,
			success: function(response) {
				myMask.hide();
				var resp = response.responseText;
				if (hdcall) hdcall(resp);
			},
			failure: function(response) {
				myMask.hide();
				alert('execute faild:'+response.responseText);
			},
			params: params
		});
	};

	
	var toolForm = new Ext.form.FormPanel({
		style: 'padding:20px;',
		border:false,
		items:[{
			xtype:'container',
			layout:'column',
			items:[{
				baseCls:'xf-panel',
				layout:'form', 
				columnWidth:0.5,
				items:[{
					xtype: 'textfield',
					fieldLabel: '测试账号：',
					width: 350,
					name: 'wx_openid'
				},{
					xtype: 'textarea',
					fieldLabel: '消息内容：',
					height: 80,
					width: 350,
					name: 'wx_msg'
				}]
			},{
				baseCls:'xf-panel',
				title:'消息测试',
				layout:'form',
				columnWidth:0.5,
				items:[{
					xtype: 'radiogroup',
					items: [
						{boxLabel: '微信', name: 'msg_type', inputValue: 1, checked: true},
						{boxLabel: '邮件', name: 'msg_type', inputValue: 2},
						{boxLabel: '短信', name: 'msg_type', inputValue: 3},
						{boxLabel: '推送', name: 'msg_type', inputValue: 4}
					]
				},{
					style:'margin-bottom:3px;',
					xtype:'button',
					text:'发送消息',
					width: 100,
					handler:wxTest
				}]
			}]
		},{
			xtype:'container',
			layout:'column',
			items:[{
				baseCls:'xf-panel',
				title:'内部接口测试',
				layout:'form', 
				columnWidth:0.5,
				style:'margin-left:10px;',
				defaults:{width:350},
				items:[{
					xtype: 'textfield',
					fieldLabel: '账号(外)：',
					name: 'x_usercode'
				},{
					xtype: 'textfield',
					fieldLabel: '密码(外)：',
					name: 'x_userpass'
				},{
					xtype: 'textarea',
					fieldLabel: '服务地址(外)：',
					name: 'x_url',
					height: 80
				},{
					xtype: 'textarea',
					fieldLabel: '请求参数：',
					name: 'x_param',
					height: 80
				},{
					xtype:'button',
					text:'调用接口',
					width: 100,
					handler:nbTest
				}]
			},{
				baseCls:'xf-panel',
				title:'外部接口测试',
				layout:'form', 
				columnWidth:0.5,
				style:'margin-left:10px;',
				defaults:{width:350},
				items:[{
					xtype: 'textfield',
					fieldLabel: '方法名：',
					name: 'x_method'
				},{
					xtype: 'textfield',
					fieldLabel: '参数名1,2,3：',
					name: 'x_paramn'
				},{
					xtype: 'textarea',
					fieldLabel: '参数值1：',
					name: 'x_paramv1',
					height: 56
				},{
					xtype: 'textarea',
					fieldLabel: '参数值2：',
					name: 'x_paramv2',
					height: 56
				},{
					xtype: 'textarea',
					fieldLabel: '参数值3：',
					name: 'x_paramv3',
					height: 55
				},{
					xtype:'button',
					text:'调用接口',
					width: 100,
					handler:wbTest
				}]
			}]
		},{
			xtype: 'textarea',
			style: 'margin-top:10px;',
			labelStyle: 'margin-left:20px;',
			fieldLabel: '执行结果：',
			height: 100,
			width: 600,
			name: 'x_result'
		}]
	});
	
	JxUtil.delay(500, function(){
		var form = toolForm.getForm();
		var xcode = form.findField('x_usercode');
		xcode.el.dom.setAttribute('placeholder', 'admin');
		var xpass = form.findField('x_userpass');
		xpass.el.dom.setAttribute('placeholder', '888');
		var xurl = form.findField('x_url');
		xurl.el.dom.setAttribute('placeholder', 'http://localhost:8080/jxstar/ws/jxstarService?wsdl=JxstarService.wsdl');
		var xparam = form.findField('x_param');
		xparam.el.dom.setAttribute('placeholder', '{"eventcode":"query_data", "funid":"queryevent", "query_funid":"sys_control", "userid":"administractor", "start":0, "limit":10}');
		var xparamn = form.findField('x_paramn');
		xparamn.el.dom.setAttribute('placeholder', 'arg1,arg2,arg3');
	});
	
	var funLayout = new Ext.Panel({
		border:false,
		layout:'fit',
		items:[toolForm]
	});
	
	return funLayout;
}