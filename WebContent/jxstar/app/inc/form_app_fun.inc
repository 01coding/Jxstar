config.initpage = function(formNode){
	var event = formNode.event;
	event.on('beforecreate', function(event) {
		var form = event.form;
		var tree = JxUtil.getLayoutTree(formNode.page);
		var pack_id = tree.selModel.selNode.id;
        var pack_code = tree.selModel.selNode.attributes.pack_code;
        form.findField('app_fun__pack_id').setValue(pack_id);
		form.findField('app_fun__pack_code').setValue(pack_code);
	});
	
 }