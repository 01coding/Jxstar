config.param.items[0].style = 'padding:10px 0;margin:0 auto;';

    var findItem = function(items, name) {
        var item = null;
        var findv = function(items, name) {
            if (item) return;
            for (var i = 0; i < items.length; i++) {
                if (items[i].items) {
                    findv(items[i].items, name);
                } else {
                    if (items[i].name == name) {
                        item = items[i];
                        return item;
                    }
                }
            }
        };
        findv(items, name);
        return item;
    };
	//修改图像控件属性
    var item = findItem(items, 'sys_user__user_photo');
    delete item.anchor;
	item.image_small_use = '1';
	item.image_small_size ='120';
	item.createcode = 'createPhoto';
	item.deletecode = 'deletePhoto';
    item.fieldLabel = '上传图片，仅支持JPG、PNG图片文件，且文件小于2M';
    item.width = 180;
    item.height = 210;

	config.initpage = function(formNode){
		var page = formNode.page;
		var event = formNode.event;
        var form = page.getForm();
		
		event.on('initother', function(fe){
        	form.findField('sys_user__user_code').setReadOnly(true);
        	form.findField('sys_user__user_name').setReadOnly(true);
        	form.findField('sys_dept__dept_name').setReadOnly(true);
		});
	};