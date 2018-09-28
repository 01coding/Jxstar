Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datadatastyle = Jxstar.findComboData('datastyle');

	var cols = [
	{col:{header:'*显示值', width:132, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'rpt_head__col_code',type:'string'}},
	{col:{header:'*字段标签', width:122, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'rpt_head__display',type:'string'}},
	{col:{header:'显示位置', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'rpt_head__col_pos',type:'string'}},
	{col:{header:'表头ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_head__head_id',type:'string'}},
	{col:{header:'报表ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_head__report_id',type:'string'}},
	{col:{header:'显示样式', width:100, sortable:true, defaultval:'text', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datadatastyle
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datadatastyle[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadatastyle.length; i++) {
				if (Datadatastyle[i][0] == value)
					return Datadatastyle[i][1];
			}
		}}, field:{name:'rpt_head__format',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'rpt_head'
	};
	
	
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		grid.on('rowclick', function(g, rowindex, e) {
			var frm = Ext.get('frm_designer_report').dom;
			if (frm == null) return;
			var seldiv = frm.contentWindow.getSelectDiv();
			if (seldiv != null) {
				var record = g.getStore().getAt(rowindex);
				
				seldiv.oldRecord = seldiv.curRecord;
				seldiv.curRecord = record;
				seldiv.titleField = 'rpt_head__display';
				seldiv.positionField = 'rpt_head__col_pos';
			}
		});
	};
		
	return new Jxstar.GridNode(config);
}