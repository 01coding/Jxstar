Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstate = Jxstar.findComboData('regstate');

	var cols = [
	{col:{header:'状态', width:53, sortable:true, defaultval:'0', align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataregstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataregstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataregstate.length; i++) {
				if (Dataregstate[i][0] == value)
					return Dataregstate[i][1];
			}
		}}, field:{name:'wf_sheet__state',type:'string'}},
	{col:{header:'审批单说明', width:145, sortable:true, hidden:true}, field:{name:'wf_sheet__sheet_desc',type:'string'}},
	{col:{header:'*报表名称', width:123, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TriggerField({
			maxLength:50,
			editable:false, allowBlank:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				var selcfg = {"pageType":"combogrid", "nodeId":"rpt_list", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"rpt_list.report_name;report_file;report_id", "targetField":"wf_sheet.report_name;report_file;report_id", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"wf_sheet.report_name"};
				JxSelect.createSelectWin(selcfg, this, 'node_wf_sheet_editgrid');
			}
		})}, field:{name:'wf_sheet__report_name',type:'string'}},
	{col:{header:'模板文件', width:207, sortable:true, editable:false,
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'wf_sheet__report_file',type:'string'}},
	{col:{header:'版本', width:43, sortable:true, defaultval:'1', align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'wf_sheet__version_code',type:'int'}},
	{col:{header:'版本日期', width:113, sortable:true, defaultval:'fun_getToday()', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.DateField({
			format: 'Y-m-d H:i',
			minValue: '1900-01-01'
		}),
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'wf_sheet__version_date',type:'date'}},
	{col:{header:'使用过滤条件', width:224, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'wf_sheet__where_sql',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_sheet__sheet_id',type:'string'}},
	{col:{header:'报表ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_sheet__report_id',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_sheet__process_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'wf_sheet'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}