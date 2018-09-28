Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataostype = Jxstar.findComboData('ostype');
	var Dataupdatetype = Jxstar.findComboData('updatetype');

	var cols = [
	{col:{header:'APP代号', width:120, sortable:true}, field:{name:'app_update__appid',type:'string'}},
	{col:{header:'版本号', width:116, sortable:true}, field:{name:'app_update__update_version',type:'string'}},
	{col:{header:'Jxstar版本', width:115, sortable:true}, field:{name:'app_update__server_version',type:'string'}},
	{col:{header:'系统类型', width:116, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataostype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataostype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataostype.length; i++) {
				if (Dataostype[i][0] == value)
					return Dataostype[i][1];
			}
		}}, field:{name:'app_update__os_type',type:'string'}},
	{col:{header:'更新类型', width:137, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataupdatetype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataupdatetype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataupdatetype.length; i++) {
				if (Dataupdatetype[i][0] == value)
					return Dataupdatetype[i][1];
			}
		}}, field:{name:'app_update__update_type',type:'string'}},
	{col:{header:'下载路径', width:413, sortable:true}, field:{name:'app_update__down_url',type:'string'}},
	{col:{header:'标题', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_update__update_title',type:'string'}},
	{col:{header:'更新内容', width:269, sortable:true, hidden:true}, field:{name:'app_update__update_note',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_update__update_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'app_update'
	};
	
	
	config.eventcfg = {
        pushapp: function(){
            var params = 'eventcode=pushapp&funid=app_update';
            Request.postRequest(params, null);
        }
    };
		
	return new Jxstar.GridNode(config);
}