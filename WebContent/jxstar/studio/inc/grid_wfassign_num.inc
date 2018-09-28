
	//把任务数量字段值改为超链接
	var renderTask = function(val, metaData, record) {
		var funId = record.get('wf_assign__fun_id');
		var userId = JxDefault.getUserId();
		
		var chgcolor = 'onmouseover="this.style.color=\'#FF4400\';" onmouseout="this.style.color=\'#0080FF\';"';
		var html = '<a style=\'color:#0080FF;\' '+ chgcolor +' onclick="JxUtil.showCheckData(\''+ funId +'\', \'\', \''+ userId +'\');">&nbsp;'+ val +'&nbsp;</a>';
		return html;
	};
	
	//把第2列的值改为超链接
	cols[0].col.renderer = renderTask;
	cols[1].col.renderer = renderTask;
	
	//不需要复选模式
	config.param.selectModel = 'row';
	
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		
		var cnt = 0;
		var wsql = 'wf_assign.assign_userid = ?';
		var wvalue = JxDefault.getUserId();
		var wtype = 'string';
		Jxstar.loadData(grid, {where_sql:wsql, where_value:wvalue, where_type:wtype, has_page:'0'});
		
		//5分钟刷新一次
		setInterval(
			function() {
				if (cnt == 0) {cnt++; return;}
				//JxHint.hint(cnt + ';' + grid.id);
				Jxstar.loadData(grid, {where_sql:'', where_value:'', where_type:'', is_query:1});
			}, 1000*60*5
		);
		
		//替换流程名称为英文
		if (JxLang.type != 'zh') {
			var store = grid.getStore();
			store.on('load', function(st, records){
				for (var i = 0; i < records.length; i++) {
					var pid = records[i].get('wf_instance__process_id');
					var t = joLang.wftitle['wf__'+pid];
					if (t && t.length > 0) {
						records[i].set('wf_instance__process_name', t);
					}
				}
			});
		}
	};