Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstatus = Jxstar.findComboData('regstatus');
	var Datalabelnum = Jxstar.findComboData('labelnum');

	var cols = [
	{col:{header:'*序号', width:56, sortable:true, align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatInt()}, field:{name:'lab_model__model_index',type:'int'}},
	{col:{header:'状态', width:68, sortable:true, defaultval:'0', align:'center',
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
		}}, field:{name:'lab_model__auditing',type:'string'}},
	{col:{header:'*模板名称', width:147, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'lab_model__model_name',type:'string'}},
	{col:{header:'方案id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'lab_model__case_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'lab_model__model_id',type:'string'}},
	{col:{header:'*宽度mm', width:77, sortable:true, defaultval:'80', align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__lab_width',type:'float'}},
	{col:{header:'*高度mm', width:78, sortable:true, defaultval:'40', align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__lab_height',type:'float'}},
	{col:{header:'*几排', width:70, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datalabelnum
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datalabelnum[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datalabelnum.length; i++) {
				if (Datalabelnum[i][0] == value)
					return Datalabelnum[i][1];
			}
		}}, field:{name:'lab_model__colnum',type:'string'}},
	{col:{header:'间距', width:49, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			maxLength:22
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__coljx',type:'float'}},
	{col:{header:'left', width:45, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			maxLength:22
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__lab_left',type:'float'}},
	{col:{header:'top', width:47, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			maxLength:22
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'lab_model__lab_top',type:'float'}},
	{col:{header:'index', width:92, sortable:true, hidden:true}, field:{name:'lab_model__print_index',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'lab_model'
	};
	
	config.param.hidePageTool = true;

	
		
	return new Jxstar.GridNode(config);
}