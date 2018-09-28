/**
 * 显示新闻公告的portlet，
 * 这类自定义的portlet统一由portlet_result.js调用
 */
Jxstar.currentPage = function() {
	var box = new Ext.BoxComponent();
	
	var createhtml = function(msgJson) {
		var tableTpl = new Ext.Template(
			'<table class="x-work-table">',
				'{rows}',
			'</table>'
		);
		var rowTpl = new Ext.Template(
			'<tr>',
				'<td>',
            		'<p class="x-msgshow x-ellipsis" style="width:240px;" onclick="JxSender.readBoard(\'{news_id}\', this);" title="{all_title}">',
            			'<span class="new-badge {ishot}"></span>',
            			'<i class="icon fa fa-{iconcss}" title="{icontitle}"></i>{news_title}</p>',
				'</td>',
				'<td width="70" class="small">',
				'{edit_date}',
				'</td>',
			'</tr>'
		);
		
		var rows = [];
		for (var i = 0; i < msgJson.length; i++) {
			msgJson[i]['edit_date'] = JxUtil.shortDate(msgJson[i]['edit_date']);
            var title = msgJson[i]['news_title'];
			if (title.length > 15) {
				msgJson[i]['all_title'] = title;
			}
			var type = msgJson[i]['cont_type'];
			var icss = 'bullhorn green', types = '公告';
			if (type == '2') {icss = 'flag-o purple'; types = '新闻';}
			if (type == '3') {icss = 'file-pdf-o red'; types = '公文';}
			msgJson[i]['iconcss'] = icss;
			msgJson[i]['icontitle'] = types;
			msgJson[i]['ishot'] = (msgJson[i]['readed'] == '1' ? ' hide-badge' : '');
			
			rows[i] = rowTpl.apply(msgJson[i]);
		}
		
		return tableTpl.apply({rows:rows.join('')});
	};

	var load = function(){
		var hdcall = function(msgjson){
			var html;
			if (msgjson.length > 0) {
				html = createhtml(msgjson);
			} else {
				html = '<span class="x-work-nodata">没有公告！</span>';
			}
			box.update(html);
		};
		
		var params = "funid=oa_news&eventcode=qrycont&pagetype=grid&shownum=7&conttype=1,2,3";
		Request.dataRequest(params, hdcall);
	};
	
	//设置容器数据刷新方法，Jxstar.createPage 回调方法中执行
	box.reload = load;
	
	//添加查询小按钮
	box.showCall = function(target){
		var dbo = (Jxstar.systemVar.dbType == 'sqlserver') ? 'dbo.' : '';
		var gear = target.getTool('fa-search');
		if (!gear) {
			var gear = {
				id:'fa-search',
				qtip:'查看更多',//'查看更多任务请求信息',
				handler: function(e, target, cell){
					var userid = Jxstar.session['user_id'];
					Jxstar.createNode('oa_news', {pageType:'query', isNotRight:'1', whereSql:dbo+"f_isnews(news_id, ?) = '1' and state in ('1','3')", whereType:'string', whereValue:userid});
				}
			};
			target.addTool(gear);
		}
	};
	
	return box;
	
}
