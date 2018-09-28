Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataareatypetot = Jxstar.findComboData('areatypetot');
	var Datadatasrc = Jxstar.findComboData('datasrc');
	var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'checkbox', fieldLabel:'主区域?', name:'rpt_area__is_main', defaultval:'1', disabled:false, anchor:'100%'},
					{xtype:'textfield', fieldLabel:'名称', name:'rpt_area__area_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'区域类型', name:'rpt_area__area_type', defaultval:'assort',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataareatypetot
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataareatypetot[0][0]},
					{xtype:'combo', fieldLabel:'来源类型', name:'rpt_area__data_type', defaultval:'sql',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datadatasrc
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datadatasrc[0][0]},
					{xtype:'hidden', fieldLabel:'序号', name:'rpt_area__area_index', anchor:'61%'},
					{xtype:'hidden', fieldLabel:'占几列', name:'rpt_area__head_colnum', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'表格标题?', name:'rpt_area__is_head', defaultval:'0', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'checkbox', fieldLabel:'输出合计列', name:'rpt_area__has_sum', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'textfield', fieldLabel:'分类标示字段', name:'rpt_area__type_field', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'分类标题字段', name:'rpt_area__type_field_title', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'数据源', name:'rpt_area__ds_name', defaultval:'default', anchor:'100%', maxLength:25},
					{xtype:'hidden', fieldLabel:'权限功能', name:'rpt_area__fun_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'权限?', name:'rpt_area__is_userdata', defaultval:'0', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textarea', fieldLabel:'SQL|类', name:'rpt_area__data_sql', anchor:'100%', height:180, maxLength:2000},
					{xtype:'textfield', fieldLabel:'WHERE参数值', name:'rpt_area__ext_wherevalue', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'WHERE参数类型', name:'rpt_area__ext_wheretype', anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'统计区域?', name:'rpt_area__is_stat', defaultval:'0', anchor:'46%'},
					{xtype:'hidden', fieldLabel:'报表ID', name:'rpt_area__report_id', anchor:'28%'},
					{xtype:'hidden', fieldLabel:'区域ID', name:'rpt_area__area_id', anchor:'28%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'total_area'
	};

	
	config.initpage = function(formNode){
	var event = formNode.event;
	
	//扩展保存前事件
	event.on('beforesave', function(event, data) {
		var form = event.form;
        
        var area_type = form.get('rpt_area__area_type');
		var type_field = form.get('rpt_area__type_field');
        var field_title = form.get('rpt_area__type_field_title');
        
		if (area_type == 'cross' && type_field.length > 0 && field_title.length > 0) {
            if (type_field == field_title) {
                JxHint.alert('分类标示字段不能与分类标题字段相同！');
                return false;
            }
		}
		
		return true;
	});
	
};
	
	return new Jxstar.FormNode(config);
}