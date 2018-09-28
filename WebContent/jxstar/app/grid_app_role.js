Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datarbustype = Jxstar.findComboData('rbustype');
	var Dataroletype = Jxstar.findComboData('roletype');

	var cols = [
	{col:{header:'*角色编号', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'app_role__role_code',type:'string'}},
	{col:{header:'*角色名称', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'app_role__role_name',type:'string'}},
	{col:{header:'描述', width:282, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'app_role__role_memo',type:'string'}},
	{col:{header:'角色ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_role__role_id',type:'string'}},
	{col:{header:'版本', width:100, sortable:true, hidden:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datarbustype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datarbustype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datarbustype.length; i++) {
				if (Datarbustype[i][0] == value)
					return Datarbustype[i][1];
			}
		}}, field:{name:'app_role__bus_type',type:'string'}},
	{col:{header:'类型', width:100, sortable:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataroletype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataroletype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataroletype.length; i++) {
				if (Dataroletype[i][0] == value)
					return Dataroletype[i][1];
			}
		}}, field:{name:'app_role__role_type',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'app_role'
	};
	
	
	config.eventcfg = {
        pushrole: function(){
            var records = this.grid.getSelectionModel().getSelections();
            if (!JxUtil.selectone(records)) return;

            var roleId = records[0].get('app_role__role_id');
            var params = 'eventcode=pushrole&funid=app_role&roleId='+roleId;
            Request.postRequest(params, null);
        }
    }
		
	return new Jxstar.GridNode(config);
}