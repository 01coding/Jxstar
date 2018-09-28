Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataaudit = Jxstar.findComboData('audit');

	var cols = [
	{col:{header:'记录状态', width:100, sortable:true, defaultval:'0', align:'center',
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
		}}, field:{name:'wfnav_graph__auditing',type:'string'}},
	{col:{header:'流程图编号', width:127, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'wfnav_graph__graph_code',type:'string'}},
	{col:{header:'*流程图名称', width:227, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'wfnav_graph__graph_name',type:'string'}},
	{col:{header:'模块名称', width:133, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TriggerField({
			maxLength:50,
			editable:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				if (this.menu == null) {
					var selcfg = {"pageType":"combogrid", "nodeId":"sys_module", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"", "targetField":"", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"1", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"wfnav_graph.module_name"};
					this.menu = Jxstar.createComboMenu(this);
					JxSelect.createComboGrid(selcfg, this.menu, 'node_wfnav_graph_editgrid');
				}
				this.menu.show(this.el);
			}
		})}, field:{name:'wfnav_graph__module_name',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wfnav_graph__graph_id',type:'string'}},
	{col:{header:'模块ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wfnav_graph__module_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'wfnav_graph'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}