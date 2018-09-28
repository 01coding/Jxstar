Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*查询方案', width:108, sortable:true, defaultval:'查询方案1', editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'sys_query__query_name',type:'string'}},
	{col:{header:'缺省?', width:44, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_query__is_default',type:'string'}},
	{col:{header:'共享?', width:48, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_query__is_share',type:'string'}},
	{col:{header:'序号', width:48, sortable:true, defaultval:'1', align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'sys_query__query_no',type:'int'}},
	{col:{header:'创建人', width:75, sortable:true, defaultval:'fun_getUserName()', editable:false,
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'sys_query__user_name',type:'string'}},
	{col:{header:'查询ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_query__query_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_query__fun_id',type:'string'}},
	{col:{header:'创建人ID', width:100, sortable:true, colindex:10000, hidden:true, defaultval:'fun_getUserId()'}, field:{name:'sys_query__user_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_query'
	};
	
	config.param.noRowNum = true;

	config.param.hidePageTool = true;	config.initpage = function(gridNode){ 	var event = gridNode.event;		event.on('beforecreate', function(ge) {		var myGrid = this.grid;		var rec = myGrid.store.getAt(0);		rec.set('sys_query__fun_id', myGrid.qryFunId);				return true;	});		//只能删除自己新建的方案，但管理员可以删除所有方案	event.on('beforedelete', function(ge, records) {		if (JxUtil.isAdminUser()) return true;				for (var i = 0; i < records.length; i++) {			var user_id = records[i].get('sys_query__user_id');			if (user_id != JxDefault.getUserId()) {				JxHint.alert(jx.bus.text47);//'选择的方案中含他人建立的方案，不能删除！'				return false;			}		}		ge.grid.selectKeyId = '';				return true;	});		event.newQry = function() {		var grid = event.grid;		var params = 'funid=sys_query&qryfunid='+ grid.qryFunId;		params += '&pagetype=editgrid&eventcode=create';		var endcall = function(data) {			grid.selectKeyId = data.qryid;//定位当前新增的记录			grid.getStore().reload();		};		Request.postRequest(params, endcall);	}};
		
	return new Jxstar.GridNode(config);
}