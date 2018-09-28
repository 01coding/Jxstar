config.initpage = function(formNode){
	var event = formNode.event;
	
	//扩展保存前事件
	event.on('beforesave', function(event, data) {
		var form = event.form;
        
        var area_type = form.get('rpt_area__area_type');
		var type_field = form.get('rpt_area__type_field');
        var field_title = form.get('rpt_area__type_field_title');
        
		if (area_type == 'cross' && type_field.length > 0 && field_title.length > 0) {
            if (type_field == field_title) {
                JxHint.alert('分类标示字段不能与分类标题字段相同！');
                return false;
            }
		}
		
		return true;
	});
	
};