/**
 * 显示消息，
 * 这类自定义的portlet统一由portlet_result.js调用
 */
Jxstar.currentPage = function() {
	var box = new Ext.BoxComponent();
	
	var updateNum = function(){
		var numdom = document.getElementById("main_msg_icon").querySelector("span.badge");
		if (!numdom) return;
		
		var el = box.getEl();
		if (el) {
			var num = el.query('tr').length;
			numdom.innerHTML = (num==0?'':num);
		}
	};
	
	JxUtil.msgread = function(msgid, obj) {
		var hdcall = function(){
			Ext.get(obj).findParent('tr').remove();
			updateNum();
		};
		var params = "funid=oa_msg&eventcode=readmsg&isall=0&msgid="+msgid;
		Request.dataRequest(params, hdcall);
	};
	
	var createhtml = function(msgJson) {
		var tableTpl = new Ext.Template(
			'<table class="x-work-table">',
				'{rows}',
			'</table>'
		);
		var rowTpl = new Ext.Template(
			'<tr dataid="{msg_id}">',
				'<td>',//class="x-msgshow x-ellipsis" style="width:325px;" title="{msg_content}"
					'{content}',
				'</td>',
				'<td width="70" class="small">',
				'<input id="check_{msg_id}" type="checkbox" style="vertical-align: middle;margin: 0 5px 3px 0;" onclick="JxUtil.msgread(\'{msg_id}\', this);">',
				'<label style="color: #2B7DBC; font-size: 13px;" for="check_{msg_id}">已阅</label><br>',
				'{send_date}',
				'</td>',
			'</tr>'
		);
		
		var rows = [];
		for (var i = 0; i < msgJson.length; i++) {
			msgJson[i]['send_date'] = JxUtil.shortDate(msgJson[i]['send_date']);
			var msg = "<td><p style='word-break:break-all;'>"+msgJson[i]['msg_content']+"</p></td>";
			//支持查看审批单据
			var funid = msgJson[i]['fun_id'];
			var dataid = msgJson[i]['data_id'];
			if (funid.length > 0 && dataid.length > 0) {
				msg = "<td><p style='word-break:break-all;' class='x-msgshow' "+
				"onclick=\"JxUtil.showCheckHisData('"+funid+"', '"+dataid+"', '');\">"+
				msgJson[i]['msg_content']+"</p></td>";
			}
			
			msgJson[i]['content'] = msg;
			
			rows[i] = rowTpl.apply(msgJson[i]);
		}
		
		return tableTpl.apply({rows:rows.join('')});
	};

	var load = function(){
		var hdcall = function(datas){
			if (!datas || !datas.length) {
				box.update('<span class="x-work-nodata">没有新的通知消息！</span>');
			} else {
				html = createhtml(datas);
				box.update(html);
			}
			setTimeout(updateNum, 200);
		};
		
		var params = "funid=oa_msg&eventcode=qrymsg";
		Request.dataRequest(params, hdcall);
	};
	
	//加载容器中的数据
	load();
	
	//设置容器数据刷新方法
	box.reload = load;
	
	//标记全部已阅
	box.readall = function(){
		var hdcall = function(){
			load();
		};
		Ext.Msg.confirm(jx.base.hint, '确定全部标记已阅读吗？', function(btn) {
			if (btn == 'yes') {
				var params = "funid=oa_msg&eventcode=readmsg&isall=1&msgid=";
				Request.dataRequest(params, hdcall);
			}
		});
	};
	
	return box;
	
}
