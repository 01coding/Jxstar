/**
 * 显示常用文档的portlet，
 * 这类自定义的portlet统一由portlet_result.js调用
 */
Jxstar.currentPage = function() {
	var box = new Ext.BoxComponent({html:'<ul class="plet-msg-ct"></ul>'});
	
	//更新数量与状态
	var createhtml = function(datas, str) {
		var num = datas ? datas.length : 0;
		var html = '';
		if (num > 0) {
			var htmls = [];
			var tpl = new Ext.Template(str);
			for (var i = 0, n = num; i < n; i++) {
				htmls[i] = tpl.apply(datas[i]);
			}
			html = htmls.join('');
		}
		return html;
	};
	
	var load = function(){
		var me = this;
		var hdcall = function(datas){
			datas = datas.root;
			//更新html
			var html;
			if (datas.length > 0) {
                var str = '<li style="padding-left:25px;" dataid="{sys_attach__attach_id}">{sys_attach__attach_name}</li>';
				html = createhtml(datas, str);
			} else {
				html = '<span class="x-work-nodata">没有公共资料！</span>';
			}
			box.el.child('.plet-msg-ct').update(html);
			//box.update(html);
			
			//加载点击事件
			box.el.select('.plet-msg-ct li').on('click', function(e, t){
				var attach_id = t.getAttribute('dataid');
                
				var params = 'funid=sys_attach&keyid='+ attach_id +'&pagetype=editgrid&eventcode=down&nousercheck=1';
				Request.attachDown(params);
			});
		};
		
		var wheresql = 'table_name = ? and data_id in (select doc_id from sys_doc where is_cancel = ?)';
		var wheretype = 'string;string';
		var wherevalue = 'sys_doc;0';
		var params = 'query_funid=sys_attach&eventcode=query_data&funid=queryevent&where_sql='+wheresql+'&where_type='+wheretype+'&where_value='+wherevalue;
		Request.dataRequest(params, hdcall);
	};
	
	//设置容器数据刷新方法
	box.reload = load;
	
	return box;
	
}
