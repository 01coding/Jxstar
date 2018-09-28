Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datayesno = Jxstar.findComboData('yesno');
	var Datawfusertype = Jxstar.findComboData('wfusertype');

	var cols = [
	{col:{header:'编码', width:100, sortable:true}, field:{name:'wf_user__user_code',type:'string'}},
	{col:{header:'名称', width:101, sortable:true, editable:false,
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'wf_user__user_name',type:'string'}},
	{col:{header:'是否定制类', width:70, sortable:true, colindex:10000, hidden:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
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
		}}, field:{name:'wf_user__use_class',type:'string'}},
	{col:{header:'部门', width:100, sortable:true}, field:{name:'wf_user__dept_name',type:'string'}},
	{col:{header:'分配条件', width:256, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:1000
		})}, field:{name:'wf_user__cond_where',type:'string'}},
	{col:{header:'类型', width:77, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datawfusertype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datawfusertype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datawfusertype.length; i++) {
				if (Datawfusertype[i][0] == value)
					return Datawfusertype[i][1];
			}
		}}, field:{name:'wf_user__user_type',type:'string'}},
	{col:{header:'知会?', width:70, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
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
		}}, field:{name:'wf_user__do_type',type:'string'}},
	{col:{header:'上级', width:83, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TriggerField({
			maxLength:20,
			editable:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				var selcfg = {"pageType":"combogrid", "nodeId":"sys_user", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"sys_user.user_name;user_id", "targetField":"wf_user.up_user;up_userid", "whereSql":"sys_user.is_novalid = '0'", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"wf_user.up_user"};
				JxSelect.createSelectWin(selcfg, this, 'node_wf_user_editgrid');
			}
		})}, field:{name:'wf_user__up_user',type:'string'}},
	{col:{header:'任务属性ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_user__nodeattr_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_user__wfuser_id',type:'string'}},
	{col:{header:'上级用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_user__up_userid',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_user__user_id',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_user__process_id',type:'string'}},
	{col:{header:'节点ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_user__node_id',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_user__dept_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '0',
		funid: 'wf_user'
	};
	
	
	config.initpage = function(pageNode){		var event = pageNode.event;		event.on('beforeimport', function(){		var fkValue = pageNode.page.fkValue;		if (!fkValue) {			JxHint.alert(jx.util.selectno);			return false;		}		return true;	});
};
		
	return new Jxstar.GridNode(config);
}