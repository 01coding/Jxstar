Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'节点ID', width:100, sortable:true}, field:{name:'wf_node__node_id',type:'string'}},
	{col:{header:'节点名称', width:145, sortable:true}, field:{name:'wf_node__node_title',type:'string'}},
	{col:{header:'节点类型', width:100, sortable:true}, field:{name:'wf_node__node_type',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_node__wfnode_id',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_node__process_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'wf_node'
	};
	
	
	//是否审批单据界面配置效果[0|1]
	var iswfld = Jxstar.systemVar.saas__wf__field || '0';
	
	if (iswfld == '1') {
        cols.insert(cols.length, {col:
            {header:'单据设置', width:100, align:'center', 
                renderer: function(value, metaData, record) {
                    var node_type = record.get('wf_node__node_type');
                    var html = '';
                    if (node_type == 'start' || node_type == 'task') {
                        html = '<a>单据设置</a>';
                    }
                    return html;
                },
                listeners: {click: function(col, grid, row, e){
                    //取当前过程ID与节点ID
                    var target = e.getTarget();
                    var rec = grid.getStore().getAt(row);
                    var wfnode_id = rec.get('wf_node__wfnode_id');
                    var node_id = rec.get('wf_node__node_id');
                    var process_id = rec.get('wf_node__process_id');
                    
                    //取当前功能ID，导入字段用
                    var tab = grid.findParentByType('tabpanel');
                    var pgrid = tab.getComponent(0).getComponent(0);
                    var record = JxUtil.getSelectRows(pgrid)[0];
                    var wf_funid = record.get('wf_process__fun_id');

                    var hdcall = function(grid) {
                        grid.fkValue = wfnode_id;
                        grid.wf_funid = wf_funid;
                        
                        var options = {};
                        options.where_sql = 'wf_node_field.process_id = ? and wf_node_field.node_id = ?';
                        options.where_type = 'string;string';
                        options.where_value = process_id+';'+node_id;
                        //显示数据
                        Jxstar.loadData(grid, options);
                    };

                    var define = Jxstar.findNode('wf_node_field');
                    //显示界面
                    Jxstar.showData({
                        filename: define.gridpage,
                        title: define.nodetitle, 
                        pagetype: 'editgrid',
                        nodedefine: define,
                        callback: hdcall
                    });
                }}
            }
        });

        cols.insert(cols.length, {col:
            {header:'单据预览', width:100, align:'center', 
                renderer: function(value, metaData, record) {
                    var node_type = record.get('wf_node__node_type');
                    var html = '';
                    if (node_type == 'start' || node_type == 'task') {
                        html = '<a>单据预览</a>';
                    }
                    return html;
                },
                listeners: {click: function(col, grid, row, e){
                    var target = e.getTarget();
                    var rec = grid.getStore().getAt(row);
                    var node_id = rec.get('wf_node__node_id');
                    var process_id = rec.get('wf_node__process_id');

                    var tab = grid.findParentByType('tabpanel');
                    var pgrid = tab.getComponent(0).getComponent(0);
                    var record = JxUtil.getSelectRows(pgrid)[0];
                    var wf_funid = record.get('wf_process__fun_id');

                    Jxstar.createNode(wf_funid, {isfast:true, nodeid:node_id, processid:process_id});
                }}
            }
        });
   
    }

	config.initpage = function(gridNode){
		var grid = gridNode.page;
		
        //加载数据后再更新标签颜色
        grid.getStore().on('load', function (st, records) {
            if (records.length == 0) return;
            
            var process_id = records[0].get('wf_node__process_id');
            var hdcall = function(datas) {
                for (var i = 0; i < datas.length; i++) {
                    var index = st.find('wf_node__node_id', datas[i].node_id);
                    if (index >= 0) {
                        var d = grid.getView().getCell(index, 7);
                        if (d) {
                            var t = Ext.get(d).query('div>a');
                            if (t && t.length > 0) t[0].style.color = '#D15B47';
                        }
                        
                    }
                }
            };
            var param = 'funid=wf_node_field&eventcode=queryset&processid='+process_id;
            Request.dataRequest(param, hdcall);
        });
	};
		
	return new Jxstar.GridNode(config);
}