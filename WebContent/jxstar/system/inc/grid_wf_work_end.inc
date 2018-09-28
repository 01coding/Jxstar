	var renderTask = function(val, metaData, record) {
		var funId = record.get('wf_instancehis__fun_id');
		var dataId = record.get('wf_instancehis__data_id');
		var userId = JxDefault.getUserId();
		
		var html = "<span class=\"x-msgshow\" onclick=\"JxUtil.showCheckHisData('"+funId+"', '"+dataId+"', '"+userId+"');\">"+val+"</span>";
		return html;
	};
	
	for (var i = 0, n = cols.length; i < n; i++) {
		if (cols[i].field.name == 'wf_instancehis__instance_title') {
			cols[i].col.renderer = renderTask;
		}
	}