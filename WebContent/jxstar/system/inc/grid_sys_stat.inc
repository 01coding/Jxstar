﻿
    cols[0].col.renderer = function(value, metaData, record, rowIndex, colIndex, store) {
        var user_id = record.get('sys_stat__user_id');
        if (user_id == JxDefault.getUserId() || JxUtil.isAdminUser()) {
            return value + '<span class="x-btn-rowin"><i class="ace-icon fa eb_delete"></i></span>';
        } else {
            return value;
        }
    };
    

	config.param.hidePageTool = true;
    config.initpage = function(gridNode){ 
        var event = gridNode.event;

        //只能删除自己新建的方案，但管理员可以删除所有方案
        event.on('beforedelete', function(ge, records) {
            if (JxUtil.isAdminUser()) return true;

            for (var i = 0; i < records.length; i++) {
                var user_id = records[i].get('sys_stat__user_id');
                if (user_id != JxDefault.getUserId()) {
                    JxHint.alert(jx.bus.text47);//'选择的方案中含他人建立的方案，不能删除！'
                    return false;
                }
            }

            return true;
        });

        var grid = gridNode.page;
        //按钮添加事件
        grid.on('rowclick', function(g, rowIndex, e){
            if (!e) return;
            var t = e.getTarget();
            var tag = t.tagName.toUpperCase();
            if (tag == 'I') {
                //删除
                if (t.className.indexOf('eb_delete') > -1) {
                    event.editDelete();
                }
            }
        });
    };