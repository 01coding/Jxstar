Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datataskstate = Jxstar.findComboData('taskstate');

	var cols = [
	{col:{header:'状态', width:87, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datataskstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datataskstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datataskstate.length; i++) {
				if (Datataskstate[i][0] == value)
					return Datataskstate[i][1];
			}
		}}, field:{name:'oa_work_config__state',type:'string'}},
	{col:{header:'功能ID', width:127, sortable:true}, field:{name:'oa_work_config__fun_id',type:'string'}},
	{col:{header:'业务标题', width:132, sortable:true}, field:{name:'oa_work_config__work_title',type:'string'}},
	{col:{header:'业务表名', width:125, sortable:true}, field:{name:'oa_work_config__table_name',type:'string'}},
	{col:{header:'APP工作页面', width:188, sortable:true}, field:{name:'oa_work_config__app_page',type:'string'}},
	{col:{header:'WEB工作页面', width:173, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_work_config__web_page',type:'string'}},
	{col:{header:'消息内容', width:197, sortable:true}, field:{name:'oa_work_config__msg_cont',type:'string'}},
	{col:{header:'APP传递参数', width:100, sortable:true, hidden:true}, field:{name:'oa_work_config__app_page_param',type:'string'}},
	{col:{header:'WEB传递参数', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_work_config__web_page_param',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_work_config__config_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'oa_work_config'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}