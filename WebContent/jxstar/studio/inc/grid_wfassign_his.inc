
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