Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataareatype = Jxstar.findComboData('areatype');
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
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'序号', name:'rpt_area__area_index', anchor:'63%', maxLength:22},
					{xtype:'textfield', fieldLabel:'名称', name:'rpt_area__area_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'区域类型', name:'rpt_area__area_type', defaultval:'grid',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataareatype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataareatype[0][0]},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'每页行数', name:'rpt_area__page_size', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'textfield', fieldLabel:'数据源', name:'rpt_area__ds_name', defaultval:'default', anchor:'100%', maxLength:25},
					{xtype:'hidden', fieldLabel:'表格标题?', name:'rpt_area__is_head', defaultval:'0', anchor:'30%'},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'一条记录占几行', name:'rpt_area__one_rows', defaultval:'1', anchor:'53%', maxLength:22},
					{xtype:'hidden', fieldLabel:'是否输出合计', name:'rpt_area__has_sum', defaultval:'0', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'不输出空行', name:'rpt_area__is_notout', defaultval:'0', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'emptybox'},
					{xtype:'checkbox', fieldLabel:'主区域?', name:'rpt_area__is_main', defaultval:'1', disabled:false, anchor:'100%'},
					{xtype:'checkbox', fieldLabel:'Grid不分页', name:'rpt_area__not_page', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'checkbox', fieldLabel:'删除子表空行', name:'rpt_area__not_row', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'textfield', fieldLabel:'主键字段', name:'rpt_area__pk_col', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'子区域外键', name:'rpt_area__sub_fkcol', anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'分类标示字段', name:'rpt_area__type_field', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'占几列', name:'rpt_area__head_colnum', anchor:'25%'},
					{xtype:'hidden', fieldLabel:'分类标题字段', name:'rpt_area__type_field_title', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'区域SQL', name:'rpt_area__data_sql', anchor:'100%', height:180, maxLength:2000},
					{xtype:'textarea', fieldLabel:'区域Where', name:'rpt_area__data_where', anchor:'100%', height:60, maxLength:500},
					{xtype:'textfield', fieldLabel:'区域Group', name:'rpt_area__data_group', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'区域Order', name:'rpt_area__data_order', anchor:'100%', maxLength:100},
					{xtype:'hidden', fieldLabel:'扩展WhereSql', name:'rpt_area__ext_wheresql', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'扩展WhereValue', name:'rpt_area__ext_wherevalue', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'扩展WhereType', name:'rpt_area__ext_wheretype', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'表名', name:'rpt_area__main_table', anchor:'46%'},
					{xtype:'hidden', fieldLabel:'报表ID', name:'rpt_area__report_id', anchor:'28%'},
					{xtype:'hidden', fieldLabel:'范围', name:'rpt_area__area_pos', anchor:'26%'},
					{xtype:'hidden', fieldLabel:'统计区域?', name:'rpt_area__is_stat', defaultval:'0', anchor:'46%'},
					{xtype:'hidden', fieldLabel:'区域ID', name:'rpt_area__area_id', anchor:'28%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'rpt_area'
	};

	
	
	
	return new Jxstar.FormNode(config);
}