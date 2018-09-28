Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datapletcols = Jxstar.findComboData('pletcols');

	var cols = [
	{col:{header:'序号', width:71, sortable:true, defaultval:'10', align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'plet_templet__templet_no',type:'int'}},
	{col:{header:'*模板名称', width:226, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'plet_templet__templet_name',type:'string'}},
	{col:{header:'显示列数', width:100, sortable:true, hidden:true, defaultval:'2', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datapletcols
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datapletcols[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datapletcols.length; i++) {
				if (Datapletcols[i][0] == value)
					return Datapletcols[i][1];
			}
		}}, field:{name:'plet_templet__col_num',type:'string'}},
	{col:{header:'列宽', width:144, sortable:true, hidden:true}, field:{name:'plet_templet__col_width',type:'string'}},
	{col:{header:'模板ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'plet_templet__templet_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'plet_templet'
	};
	
	
	config.eventcfg = {		//读取模板设置数据		settemp: function() {			var self = this;			var records = JxUtil.getSelectRows(this.grid);			if (!JxUtil.selectone(records)) return;			var keyid = records[0].get(self.define.pkcol);						JxPortalExt.readTemp('settemp', keyid, '0');		},				//重新设置模板数据		redotemp: function() {			var self = this;			var records = JxUtil.getSelectRows(this.grid);			if (!JxUtil.selectone(records)) return;			var keyid = records[0].get(self.define.pkcol);						Ext.Msg.confirm(jx.base.hint, '将删除原模板，确定重新设置吗？', function(btn) {				if (btn == 'yes') {					JxPortalExt.readTemp('redotemp', keyid, '0');				}			});		}
	};		config.initpage = function(gn){			};
		
	return new Jxstar.GridNode(config);
}