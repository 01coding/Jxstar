Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datadatatype = Jxstar.findComboData('datatype');
	var Datacondtype = Jxstar.findComboData('condtype');
	var Dataparamsrc = Jxstar.findComboData('paramsrc');
	var Datadatastyle = Jxstar.findComboData('datastyle');
	var Datactltype = Jxstar.findComboData('ctltype');

	var cols = [
	{col:{header:'*序号', width:62, sortable:true, align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatInt()}, field:{name:'rpt_param__param_index',type:'float'}},
	{col:{header:'*参数标题', width:143, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'rpt_param__param_name',type:'string'}},
	{col:{header:'*参数名称', width:149, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'rpt_param__param_code',type:'string'}},
	{col:{header:'*数据类型', width:100, sortable:true, defaultval:'string', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datadatatype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datadatatype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadatatype.length; i++) {
				if (Datadatatype[i][0] == value)
					return Datadatatype[i][1];
			}
		}}, field:{name:'rpt_param__data_type',type:'string'}},
	{col:{header:'比较字段', width:161, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'rpt_param__col_name',type:'string'}},
	{col:{header:'比较方式', width:82, sortable:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datacondtype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datacondtype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datacondtype.length; i++) {
				if (Datacondtype[i][0] == value)
					return Datacondtype[i][1];
			}
		}}, field:{name:'rpt_param__operator',type:'string'}},
	{col:{header:'*值来源', width:82, sortable:true, defaultval:'request', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataparamsrc
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataparamsrc[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataparamsrc.length; i++) {
				if (Dataparamsrc[i][0] == value)
					return Dataparamsrc[i][1];
			}
		}}, field:{name:'rpt_param__data_src',type:'string'}},
	{col:{header:'*数据样式', width:80, sortable:true, defaultval:'text', align:'center',
		editable:true, hcss:'color:#0077FF;',
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
			editable:false, allowBlank:false,
			value: Datadatastyle[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadatastyle.length; i++) {
				if (Datadatastyle[i][0] == value)
					return Datadatastyle[i][1];
			}
		}}, field:{name:'rpt_param__format',type:'string'}},
	{col:{header:'控件类型', width:85, sortable:true, defaultval:'text', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datactltype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datactltype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datactltype.length; i++) {
				if (Datactltype[i][0] == value)
					return Datactltype[i][1];
			}
		}}, field:{name:'rpt_param__ctl_type',type:'string'}},
	{col:{header:'控件代号', width:80, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TriggerField({
			maxLength:20,
			editable:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				if (this.menu == null) {
					var selcfg = {"pageType":"combogrid", "nodeId":"sel_combo", "layoutPage":"", "sourceField":"v_combo_control.control_code", "targetField":"rpt_param.ctl_code", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"rpt_param.ctl_code"};
					this.menu = Jxstar.createComboMenu(this);
					JxSelect.createComboGrid(selcfg, this.menu, 'node_rpt_param_editgrid');
				}
				this.menu.show(this.el);
			}
		})}, field:{name:'rpt_param__ctl_code',type:'string'}},
	{col:{header:'显示?', width:54, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_param__is_show',type:'string'}},
	{col:{header:'必填?', width:50, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'rpt_param__is_must',type:'string'}},
	{col:{header:'选择来源字段', width:220, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'rpt_param__ctl_srccol',type:'string'}},
	{col:{header:'选择目标字段', width:192, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'rpt_param__ctl_descol',type:'string'}},
	{col:{header:'显示位置', width:75, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'rpt_param__param_pos',type:'string'}},
	{col:{header:'缺省值', width:115, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TriggerField({
			maxLength:20,
			editable:true,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				if (this.menu == null) {
					var selcfg = {"pageType":"combogrid", "nodeId":"sys_default", "layoutPage":"", "sourceField":"funall_default.func_name", "targetField":"rpt_param.def_val", "whereSql":"func_name like 'fun_%'", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"","fieldName":"rpt_param.def_val"};
					this.menu = Jxstar.createComboMenu(this);
					JxSelect.createComboGrid(selcfg, this.menu, 'node_rpt_param_editgrid');
				}
				this.menu.show(this.el);
			}
		})}, field:{name:'rpt_param__def_val',type:'string'}},
	{col:{header:'参数ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_param__param_id',type:'string'}},
	{col:{header:'区域ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_param__area_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'rpt_param'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}