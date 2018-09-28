	var renderTask = function(val, metaData, record) {
		var funId = record.get('v_wf_assign__fun_id');
		var dataId = record.get('v_wf_assign__data_id');
		var userId = JxDefault.getUserId();
		
		var html = "<span class=\"x-msgshow\" onclick=\"JxUtil.showCheckData('"+funId+"', '"+dataId+"', '"+userId+"');\">"+val+"</span>";
		return html;
	};
	
	for (var i = 0, n = cols.length; i < n; i++) {
		if (cols[i].field.name == 'v_wf_assign__instance_title') {
			cols[i].col.renderer = renderTask;
		}
	}