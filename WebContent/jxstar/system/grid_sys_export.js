Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*方案名称', width:156, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'sys_stat__stat_name',type:'string'}},
	{col:{header:'方案类型', width:100, sortable:true, hidden:true}, field:{name:'sys_stat__stat_type',type:'string'}},
	{col:{header:'共享?', width:100, sortable:true, hidden:true, defaultval:'0'}, field:{name:'sys_stat__is_share',type:'string'}},
	{col:{header:'创建人', width:100, sortable:true, hidden:true}, field:{name:'sys_stat__user_name',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_stat__stat_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_stat__fun_id',type:'string'}},
	{col:{header:'创建人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_stat__user_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_export'
	};
	
	config.param.notNullFields = 'sys_stat__stat_name;';
	config.param.selectModel = 'nocheck';
	config.param.noRowNum = true;

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
		
	return new Jxstar.GridNode(config);
}