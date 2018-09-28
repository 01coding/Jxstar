Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*属性编码', width:166, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'sys_var__var_code',type:'string'}},
	{col:{header:'*属性名称', width:281, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'sys_var__var_name',type:'string'}},
	{col:{header:'属性值', width:247, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'sys_var__var_value',type:'string'}},
	{col:{header:'属性描述', width:274, sortable:true, hidden:true}, field:{name:'sys_var__var_memo',type:'string'}},
	{col:{header:'属性ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_var__var_id',type:'string'}},
	{col:{header:'用于页面?', width:75, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_var__use_page',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'sys_var'
	};
	
	config.param.notNullFields = 'sys_var__var_code;sys_var__var_name;';
	
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
		
	return new Jxstar.GridNode(config);
}