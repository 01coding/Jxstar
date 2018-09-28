Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datadatastyle = Jxstar.findComboData('datastyle');

	var cols = [
	{col:{header:'序号', width:44, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:22
		})}, field:{name:'rpt_detail__col_index',type:'int'}},
	{col:{header:'*字段名', width:106, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'rpt_detail__col_code',type:'string'}},
	{col:{header:'*字段标签', width:96, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'rpt_detail__display',type:'string'}},
	{col:{header:'显示位置', width:78, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'rpt_detail__col_pos',type:'string'}},
	{col:{header:'显示样式', width:81, sortable:true, defaultval:'text', align:'center',
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
		}}, field:{name:'rpt_detail__format',type:'string'}},
	{col:{header:'统计?', width:49, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_detail__is_stat',type:'string'}},
	{col:{header:'显示?', width:49, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_detail__is_show',type:'string'}},
	{col:{header:'输出零?', width:63, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_detail__is_outzero',type:'string'}},
	{col:{header:'选项控件', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'rpt_detail__combo_code',type:'string'}},
	{col:{header:'明细ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_detail__det_id',type:'string'}},
	{col:{header:'区域ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_detail__area_id',type:'string'}},
	{col:{header:'列宽', width:58, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'rpt_detail__col_width',type:'float'}},
	{col:{header:'表达式', width:189, sortable:true, hidden:true}, field:{name:'rpt_detail__express',type:'string'}},
	{col:{header:'条码格式', width:87, sortable:true, defaultval:'code128', editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'rpt_detail__bar_format',type:'string'}},
	{col:{header:'字体大小', width:74, sortable:true, defaultval:'1', editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'rpt_detail__bar_fontsize',type:'string'}},
	{col:{header:'条码高度cm', width:100, sortable:true, defaultval:'2.5', editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'rpt_detail__bar_height',type:'string'}},
	{col:{header:'条码元素宽度mm', width:100, sortable:true, hidden:true, defaultval:'0.1'}, field:{name:'rpt_detail__bar_modulewidth',type:'string'}},
	{col:{header:'条码位图分辨率像素', width:100, sortable:true, defaultval:'300', editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'rpt_detail__bar_resolution',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'rpt_detail'
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
				seldiv.titleField = 'rpt_detail__display';
				seldiv.positionField = 'rpt_detail__col_pos';
			}
		});
	};
		
	return new Jxstar.GridNode(config);
}