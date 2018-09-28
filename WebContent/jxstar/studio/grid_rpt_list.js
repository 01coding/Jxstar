Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datarepttype = Jxstar.findComboData('repttype');
	var Datayesno = Jxstar.findComboData('yesno');
	var Dataregstatus = Jxstar.findComboData('regstatus');
	var Datap_rpttype = Jxstar.findComboData('p_rpttype');

	var cols = [
	{col:{header:'序号', width:47, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'rpt_list__report_index',type:'int'}},
	{col:{header:'*报表名称', width:211, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'rpt_list__report_name',type:'string'}},
	{col:{header:'*模板文件', width:225, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'rpt_list__report_file',type:'string'}},
	{col:{header:'*所属功能', width:122, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'rpt_list__fun_id',type:'string'}},
	{col:{header:'*所属模块', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:25, allowBlank:false
		})}, field:{name:'rpt_list__module_id',type:'string'}},
	{col:{header:'报表样式', width:79, sortable:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datarepttype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datarepttype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datarepttype.length; i++) {
				if (Datarepttype[i][0] == value)
					return Datarepttype[i][1];
			}
		}}, field:{name:'rpt_list__report_type',type:'string'}},
	{col:{header:'缺省?', width:48, sortable:true, defaultval:'1', align:'center',
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
		}}, field:{name:'rpt_list__is_default',type:'string'}},
	{col:{header:'状态', width:54, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataregstatus
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataregstatus[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataregstatus.length; i++) {
				if (Dataregstatus[i][0] == value)
					return Dataregstatus[i][1];
			}
		}}, field:{name:'rpt_list__status',type:'string'}},
	{col:{header:'用途分类', width:72, sortable:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datap_rpttype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datap_rpttype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datap_rpttype.length; i++) {
				if (Datap_rpttype[i][0] == value)
					return Datap_rpttype[i][1];
			}
		}}, field:{name:'rpt_list__bus_type',type:'string'}},
	{col:{header:'自定义报表类', width:136, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'rpt_list__custom_class',type:'string'}},
	{col:{header:'所属部门', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			maxLength:50, name:'rpt_list__dept_name', 
			editable:true, hcss:'color:#2E6DA4;',
			triggerClass:'x-form-search-trigger', 
			listeners:{afterrender: function(combo) {
				JxSelect.initCombo('rpt_list', combo, 'node_rpt_list_editgrid');
			}}
		})}, field:{name:'rpt_list__dept_name',type:'string'}},
	{col:{header:'报表备注', width:189, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'rpt_list__report_memo',type:'string'}},
	{col:{header:'报表ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_list__report_id',type:'string'}},
	{col:{header:'部门id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_list__dept_id',type:'string'}},
	{col:{header:'纸张宽度mm', width:100, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			maxLength:22
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'rpt_list__page_width',type:'float'}},
	{col:{header:'纸张高度mm', width:100, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			maxLength:22
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'rpt_list__page_height',type:'float'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'rpt_list'
	};
	
	
	var renderTask = function(value, metaData, record) {
		var color = value == '0' ? 'green' : 'red'
		var title = value || '';
		var cbo = Jxstar.findComboData('regstatus');
		for (var i = 0; i < cbo.length; i++) {
			if (cbo[i][0] == value) {
				title = cbo[i][1]; break;
			}
		}
		
		var html = '<span style="color:'+ color +'; font-weight:bold;">'+ title +'</span>';
		return html;
	};
	
	for (var i = 0; i < cols.length; i++) {
		if (cols[i].field.name.indexOf('__status') > 0) {
			cols[i].col.renderer = renderTask;
			break;
		}
	}
		
	config.initpage = function(gridNode){
		var event = gridNode.event;
		event.on('beforecreate', function(event) {
			var page = event.grid;
			var attr = page.treeNodeAttr;
			if (attr) {
				var record = page.getStore().getAt(0);
				record.set('rpt_list__module_id', attr.id);
			}
		});
	};
		
	return new Jxstar.GridNode(config);
}