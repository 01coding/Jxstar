
	config.eventcfg = {		
	
		readKey: function() {
			//设置请求的参数
			var params = 'funid=sys_var&pagetype=editgrid&eventcode=read_key';

			var endcall = function(data) {
                var msg = data.key;//序列号：jx.bus.text55 + 
                var url = Jxstar.path + '/fileAction.do?funid=sys_var&eventcode=showbar&dataType=byte&lickey='+data.key+'&user_id='+ Jxstar.session['user_id'];
                var win = new Ext.Window({
                    title: jx.base.hint,
                    layout: 'fit',
                    width: 400,
                    height: 220,
                    closeAction: 'close',
                    items: [{xtype:'box', height:170, html:'<div style="text-align:center;">'+
                             '<img src="'+url+'" width=110 height=110 /><br>扫二维码可识别序列号，或拷贝下面的序列号</div>'+
                             '<div style="text-align:center; height:30px; padding-top:10px; color: #CF2D28; font-size: 12pt;">'+msg+'</div>'}]
                });
                win.show();
            };

			//发送请求
			Request.postRequest(params, endcall);
		}, 
		
		readInfo: function() {
			//设置请求的参数
			var params = 'funid=sys_var&pagetype=editgrid&eventcode=read_info';

			var endcall = function(data) {
                Ext.Msg.show({
                   title: jx.base.hint,
                   msg: data.info,
                   width: 400
                });
			};

			//发送请求
			Request.postRequest(params, endcall);
		},
		
		//上传许可文件
		updateLic : function(){
			var queryForm = new Ext.form.FormPanel({
					layout:'form', 
					labelAlign:'right',
					labelWidth:80,
					border:false, 
					baseCls:'x-plain',
					autoHeight: true,
					bodyStyle: 'padding: 20px 10px 0 10px;',
					items: [{
						anchor: '95%',
						allowBlank: false,
						xtype: 'fileuploadfield',
						useType: 'file',
						fieldLabel: jx.event.selfile,	//选择文件
						name: 'attach_path',
						labelSeparator:'*', 
						buttonText: '',
						buttonCfg: {
							iconCls: 'upload_icon'
						}
					}]
				});
	
			//创建对话框
			var self = this;
			var win = new Ext.Window({
				title:jx.event.uptitle,	//上传附件
				layout:'fit',
				width:400,
				height:170,
				resizable: false,
				modal: true,
				closeAction:'close',
				items:[queryForm],
	
				buttons: [{
					text:jx.base.ok,	//确定
					handler:function(){
						var form = queryForm.getForm();
						if (!form.isValid()) return;
						
						var param = 'funid=sys_var&eventcode=updatelic';
						var hc = function() {win.close();};
						//上传附件
						Request.fileRequest(form, param, hc);
					}
				},{
					text:jx.base.cancel,	//取消
					handler:function(){win.close();}
				}]
			});
			win.show();
		}
	};