Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstatus = Jxstar.findComboData('regstatus');

	var cols = [
	{col:{header:'序号', width:61, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'lab_model__model_index',type:'int'}},
	{col:{header:'模板名称', width:140, sortable:true}, field:{name:'lab_model__model_name',type:'string'}},
	{col:{header:'状态', width:88, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataregstatus
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataregstatus[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataregstatus.length; i++) {
				if (Dataregstatus[i][0] == value)
					return Dataregstatus[i][1];
			}
		}}, field:{name:'lab_model__auditing',type:'string'}},
	{col:{header:'方案id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'lab_model__case_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'lab_model__model_id',type:'string'}},
	{col:{header:'宽度mm', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__lab_width',type:'float'}},
	{col:{header:'高度mm', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__lab_height',type:'float'}},
	{col:{header:'几排', width:100, sortable:true, hidden:true}, field:{name:'lab_model__colnum',type:'string'}},
	{col:{header:'水平间隙mm', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__coljx',type:'float'}},
	{col:{header:'左边距mm', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__lab_left',type:'float'}},
	{col:{header:'上边距mm', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__lab_top',type:'float'}},
	{col:{header:'打印机序号', width:100, sortable:true, hidden:true}, field:{name:'lab_model__print_index',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'lab_model1'
	};
	
	config.param.selectModel = 'nocheck';
	config.param.hidePageTool = true;
	config.param.noRowNum = true;

	
		
	return new Jxstar.GridNode(config);
}