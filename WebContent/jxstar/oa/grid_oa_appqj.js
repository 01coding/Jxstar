Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataaudit = Jxstar.findComboData('audit');
	var Dataoaappqj = Jxstar.findComboData('oaappqj');

	var cols = [
	{col:{header:'记录状态', width:100, sortable:true, align:'center',
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
	{col:{header:'请假类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataoaappqj
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataoaappqj[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataoaappqj.length; i++) {
				if (Dataoaappqj[i][0] == value)
					return Dataoaappqj[i][1];
			}
		}}, field:{name:'oa_apply__app_type',type:'string'}},
	{col:{header:'天数', width:50, sortable:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'oa_apply__app_days',type:'float'}},
	{col:{header:'申请人', width:100, sortable:true}, field:{name:'oa_apply__edit_user',type:'string'}},
	{col:{header:'请假事由', width:259, sortable:true}, field:{name:'oa_apply__app_desc',type:'string'}},
	{col:{header:'开始时间', width:172, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'oa_apply__begin_date',type:'date'}},
	{col:{header:'结束时间', width:159, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'oa_apply__end_date',type:'date'}},
	{col:{header:'单号', width:113, sortable:true}, field:{name:'oa_apply__app_code',type:'string'}},
	{col:{header:'所属部门', width:125, sortable:true}, field:{name:'oa_apply__dept_name',type:'string'}},
	{col:{header:'申请时间', width:100, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'oa_apply__app_date',type:'date'}},
	{col:{header:'业务类型', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__bus_type',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__apply_id',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__dept_id',type:'string'}},
	{col:{header:'申请人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_apply__edit_userid',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'oa_appqj'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}