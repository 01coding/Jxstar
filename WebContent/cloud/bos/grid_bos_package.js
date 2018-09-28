Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataappfunstate = Jxstar.findComboData('appfunstate');
	var Databospacktype = Jxstar.findComboData('bospacktype');

	var cols = [
	{col:{header:'状态', width:100, sortable:true, hidden:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataappfunstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataappfunstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataappfunstate.length; i++) {
				if (Dataappfunstate[i][0] == value)
					return Dataappfunstate[i][1];
			}
		}}, field:{name:'bos_package__auditing',type:'string'}},
	{col:{header:'*功能包代号', width:148, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'bos_package__pack_code',type:'string'}},
	{col:{header:'*功能包名称', width:191, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'bos_package__pack_name',type:'string'}},
	{col:{header:'包类型', width:100, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Databospacktype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Databospacktype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Databospacktype.length; i++) {
				if (Databospacktype[i][0] == value)
					return Databospacktype[i][1];
			}
		}}, field:{name:'bos_package__pack_type',type:'string'}},
	{col:{header:'功能包描述', width:328, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'bos_package__pack_memo',type:'string'}},
	{col:{header:'功能包ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_package__pack_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'bos_package'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}