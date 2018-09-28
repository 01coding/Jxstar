/**
 * 显示上报任务的portlet，
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
				var str = '<li style="padding-left:25px;" funid="{fun_id}" wheresql="{whereSql}">{warn_name}&nbsp;[{warn_num}]</li>';
				html = createhtml(datas, str);
			} else {
				html = '<span class="x-work-nodata">没有待办工作！</span>';
			}
			box.el.child('.plet-msg-ct').update(html);
			//box.update(html);
			
			//加载点击事件
			box.el.select('.plet-msg-ct li').on('click', function(e, t){
				var funid = t.getAttribute('funid');
				var wheresql = t.getAttribute('wheresql');
				var param = {whereSql:wheresql};//decodeURIComponent
				Jxstar.createNode(funid, param);
			});
		};
		
		var params = 'funid=sys_warn&eventcode=cntwarn';
		Request.dataRequest(params, hdcall);
	};
	
	//设置容器数据刷新方法
	box.reload = load;
	
	return box;
	
}
