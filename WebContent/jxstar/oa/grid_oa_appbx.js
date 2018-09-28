Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataaudit = Jxstar.findComboData('audit');
	var Dataoaappbx = Jxstar.findComboData('oaappbx');

	var cols = [
	{col:{header:'记录状态', width:85, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataaudit
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataaudit[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataaudit.length; i++) {
				if (Dataaudit[i][0] == value)
					return Dataaudit[i][1];
			}
		}}, field:{name:'oa_apply__auditing',type:'string'}},
	{col:{header:'报销类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataoaappbx
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataoaappbx[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataoaappbx.length; i++) {
				if (Dataoaappbx[i][0] == value)
					return Dataoaappbx[i][1];
			}
		}}, field:{name:'oa_apply__app_type',type:'string'}},
	{col:{header:'报销内容', width:284, sortable:true}, field:{name:'oa_apply__app_desc',type:'string'}},
	{col:{header:'金额(元)', width:100, sortable:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'oa_apply__app_money',type:'float'}},
	{col:{header:'申请人', width:76, sortable:true}, field:{name:'oa_apply__edit_user',type:'string'}},
	{col:{header:'所属部门', width:144, sortable:true}, field:{name:'oa_apply__dept_name',type:'string'}},
	{col:{header:'申请时间', width:139, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'oa_apply__app_date',type:'date'}},
	{col:{header:'业务类型', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__bus_type',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__apply_id',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__dept_id',type:'string'}},
	{col:{header:'申请人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__edit_userid',type:'string'}},
	{col:{header:'流程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__process_id',type:'string'}},
	{col:{header:'单号', width:100, sortable:true, hidden:true}, field:{name:'oa_apply__app_code',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'oa_appbx'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}