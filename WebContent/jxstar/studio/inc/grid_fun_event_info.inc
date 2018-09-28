	var lickSql = function(col, grid, row, e){
		var rec = grid.getStore().getAt(row);
		var fun_id = rec.get('fun_id');
		var event_code = rec.get('event_code');
		
		var where_value = encodeURIComponent('0;'+fun_id+';%,'+event_code+',%');
		//过滤条件
		var params = 'eventcode=query_data&funid=queryevent&query_funid=rule_sqlm';
		params += '&where_sql=status = ? and src_funid = ? and event_code like ?';
		params += '&where_type=string;string;string';
		params += '&where_value='+where_value;
		
		var hdCall = function(data) {
			//data.root
			var tpl = new Ext.XTemplate(
				'<div>',
				'<tpl for="root">'+
				'<table style="border:1px solid #C7C7C7;font-size:13px;width:400px;">'+
				  '<tr>'+
					'<td bgcolor="#CCCCCC">序号：{fun_rule_sql__sql_no}</td>'+
					'<td bgcolor="#CCCCCC">触发事件：{fun_rule_sql__event_code}</td>'+
				  '</tr>'+
				  '<tr>'+
					'<td colspan="2"><b>来源SQL：</b>{fun_rule_sql__src_sql}</td>'+
				  '</tr>'+
				  '<tr>'+
					'<td colspan="2"><b>目标SQL：</b>{fun_rule_sql__dest_sql}</td>'+
				  '</tr>'+
				'</table>'+
				'</tpl>',
				'</div>'
			);
			var dataDiv = new Ext.BoxComponent({
				tpl: tpl,
				data: data,
				height: 272,
				autoScroll: true
			});
			
			//显示数据
			var menu = new Ext.menu.Menu({width:450, height:280});
			menu.add(dataDiv);
			menu.show(e.getTarget());
		};
		
		Request.dataRequest(params, hdCall);
	};

	var renderSql = function(value, metaData, record) {
		if (value == '1') {
			return '<a>查看SQL</a>';
		} else {
			return '';
		}
	};
	
	for (var i = 0; i < cols.length; i++) {
		if (cols[i].field.name == 'hassql') {
			cols[i].col.renderer = renderSql;
			cols[i].col.listeners = {click: lickSql};
			break;
		}
	}