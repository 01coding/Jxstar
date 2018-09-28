Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datatablestate = Jxstar.findComboData('tablestate');
	var Datafdatatype = Jxstar.findComboData('fdatatype');
	var Datayesno = Jxstar.findComboData('yesno');
	var Datafieldtype = Jxstar.findComboData('fieldtype');

	var cols = [
	{col:{header:'状态', width:65, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatablestate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatablestate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatablestate.length; i++) {
				if (Datatablestate[i][0] == value)
					return Datatablestate[i][1];
			}
		}}, field:{name:'dm_fieldcfg__state',type:'string'}},
	{col:{header:'序号', width:44, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'dm_fieldcfg__field_index',type:'int'}},
	{col:{header:'字段名称', width:122, sortable:true}, field:{name:'dm_fieldcfg__field_name',type:'string'}},
	{col:{header:'字段标题', width:134, sortable:true}, field:{name:'dm_fieldcfg__field_title',type:'string'}},
	{col:{header:'数据类型', width:75, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datafdatatype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datafdatatype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datafdatatype.length; i++) {
				if (Datafdatatype[i][0] == value)
					return Datafdatatype[i][1];
			}
		}}, field:{name:'dm_fieldcfg__data_type',type:'string'}},
	{col:{header:'长度', width:41, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'dm_fieldcfg__data_size',type:'int'}},
	{col:{header:'表名称', width:100, sortable:true}, field:{name:'dm_tablecfg__table_name',type:'string'}},
	{col:{header:'表标题', width:132, sortable:true}, field:{name:'dm_tablecfg__table_title',type:'string'}},
	{col:{header:'小数位', width:67, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'dm_fieldcfg__data_scale',type:'int'}},
	{col:{header:'必填?', width:55, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datayesno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'dm_fieldcfg__nullable',type:'string'}},
	{col:{header:'缺省值', width:71, sortable:true, hidden:true}, field:{name:'dm_fieldcfg__default_value',type:'string'}},
	{col:{header:'等同字段', width:127, sortable:true, hidden:true}, field:{name:'dm_fieldcfg__like_field',type:'string'}},
	{col:{header:'分类', width:67, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datafieldtype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datafieldtype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datafieldtype.length; i++) {
				if (Datafieldtype[i][0] == value)
					return Datafieldtype[i][1];
			}
		}}, field:{name:'dm_fieldcfg__field_type',type:'string'}},
	{col:{header:'字段说明', width:255, sortable:true, hidden:true}, field:{name:'dm_fieldcfg__field_memo',type:'string'}},
	{col:{header:'字段ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'dm_fieldcfg__field_id',type:'string'}},
	{col:{header:'表ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'dm_fieldcfg__table_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sel_fieldcfg'
	};
	
	
	config.initpage = function(gridNode){
		var event = gridNode.event;
		//导入字段后，修改主表为修改状态
		event.on('afterimport', function(ge) {
			//目标功能外键值
			var parentId = ge.grid.destParentId;
			//目标功能ID
			var destFunId = ge.grid.destNodeId;
			
			if (destFunId == 'dm_fieldcfg' && parentId && parentId.length > 0) {
				var params = 'funid=sel_fieldcfg&pagetype=editgrid&eventcode=impfield&tableid='+ parentId;
				Request.postRequest(params, null);
			}
		});
	};
		
	return new Jxstar.GridNode(config);
}