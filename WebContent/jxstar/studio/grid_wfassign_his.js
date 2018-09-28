Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'任务名称', width:231, sortable:true}, field:{name:'v_wf_assignhis__process_name',type:'string'}},
	{col:{header:'任务数量', width:100, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'process_num',type:'int'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assignhis__fun_id',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assignhis__process_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'wf_assignhis'
	};
	
	
	//把任务数量字段值改为超链接
	var renderTask = function(val, metaData, record) {
		var funId = record.get('v_wf_assignhis__fun_id');
		var userId = JxDefault.getUserId();
		
		var chgcolor = 'onmouseover="this.style.color=\'#FF4400\';" onmouseout="this.style.color=\'#0080FF\';"';
		var html = '<a style=\'color:#0080FF;\' '+ chgcolor +' onclick="JxUtil.showCheckHisData(\''+ funId +'\', \'\', \''+ userId +'\');">&nbsp;'+ val +'&nbsp;</a>';
		return html;
	};
	
	//把第2列的值改为超链接
	cols[0].col.renderer = renderTask;
	cols[1].col.renderer = renderTask;
	
	//不需要复选模式
	config.param.selectModel = 'row';
	
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		
		var wsql = 'v_wf_assignhis.check_userid = ?';
		var wvalue = JxDefault.getUserId();
		var wtype = 'string';
		Jxstar.loadData(grid, {where_sql:wsql, where_value:wvalue, where_type:wtype, has_page:'0'});
		
		//替换流程名称为英文
		if (JxLang.type != 'zh') {
			var store = grid.getStore();
			store.on('load', function(st, records){
				for (var i = 0; i < records.length; i++) {
					var pid = records[i].get('v_wf_assignhis__process_id');
					var t = joLang.wftitle['wf__'+pid];
					if (t && t.length > 0) {
						records[i].set('v_wf_assignhis__process_name', t);
					}
				}
			});
		}
	};
		
	return new Jxstar.GridNode(config);
}