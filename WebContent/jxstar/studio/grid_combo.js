Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datactlprop = Jxstar.findComboData('ctlprop');

	var cols = [
	{col:{header:'*控件代码', width:125, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'funall_control__control_code',type:'string'}},
	{col:{header:'*控件名称', width:136, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'funall_control__control_name',type:'string'}},
	{col:{header:'*控件值', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'funall_control__value_data',type:'string'}},
	{col:{header:'*显示值', width:119, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'funall_control__display_data',type:'string'}},
	{col:{header:'*序号', width:63, sortable:true, align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatInt()}, field:{name:'funall_control__control_index',type:'int'}},
	{col:{header:'控件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'funall_control__control_id',type:'string'}},
	{col:{header:'控件类型', width:100, sortable:true, colindex:10000, hidden:true, defaultval:'combo'}, field:{name:'funall_control__control_type',type:'string'}},
	{col:{header:'控件属性', width:78, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datactlprop
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datactlprop[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datactlprop.length; i++) {
				if (Datactlprop[i][0] == value)
					return Datactlprop[i][1];
			}
		}}, field:{name:'funall_control__control_prop',type:'string'}},
	{col:{header:'显示值-英文', width:304, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:300
		})}, field:{name:'funall_control__title_en',type:'string'}},
	{col:{header:'显示值-T1', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'funall_control__title_t1',type:'string'}},
	{col:{header:'显示值-T2', width:100, sortable:true, hidden:true}, field:{name:'funall_control__title_t2',type:'string'}},
	{col:{header:'显示值-T3', width:100, sortable:true, hidden:true}, field:{name:'funall_control__title_t3',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'sys_control'
	};
	
	config.param.notNullFields = 'funall_control__control_code;funall_control__control_name;funall_control__value_data;funall_control__display_data;funall_control__control_index;';
	
	config.eventcfg = {
		createjs: function(){
			//取选择记录的主键值
			var params = 'funid='+ this.define.nodeid;
			
			//设置请求的参数
			params += '&pagetype=editgrid&eventcode=createjs&projectpath=' + Jxstar.session['project_path'];

			//生成文件后自动加载该文件
			var hdcall = function() {				ComboData = null;
				Request.loadJS('/public/locale/combo-lang-zh.js');
			};

			//发送请求
			Request.postRequest(params, hdcall);
		},				createjse: function(lang){			var params = 'funid=sys_control&pagetype=editgrid&eventcode=createjse&lang='+ lang +'&projectpath=' + 							Jxstar.session['project_path'];			//发送请求			Request.postRequest(params, null);		}
	};
		
	return new Jxstar.GridNode(config);
}