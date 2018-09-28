Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datafunreg_type = Jxstar.findComboData('funreg_type');

	var cols = [
	{col:{header:'功能名称', width:163, sortable:true}, field:{name:'fun_base__fun_name',type:'string'}},
	{col:{header:'功能ID', width:135, sortable:true}, field:{name:'fun_base__fun_id',type:'string'}},
	{col:{header:'注册类型', width:89, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datafunreg_type
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datafunreg_type[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datafunreg_type.length; i++) {
				if (Datafunreg_type[i][0] == value)
					return Datafunreg_type[i][1];
			}
		}}, field:{name:'fun_base__reg_type',type:'string'}},
	{col:{header:'功能模块ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_base__module_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sel_fun'
	};
	
	
	config.eventcfg = {
		addfun : function() {
			var self = this;
			var records = JxUtil.getSelectRows(self.grid);
			if (!JxUtil.selected(records)) return;
			
			//取选择记录的主键值
			var params = 'funid='+ self.define.nodeid;
			for (var i = 0; i < records.length; i++) {
				params += '&keyid=' + records[i].get(self.define.pkcol);
			}
			
			var fkg = self.grid.fkGrid;
			var pfunid = self.grid.fkFunId;
			var dataId = self.grid.fkValue;
			//设置请求的参数
			params += '&pagetype=selgrid&eventcode=addfun&srcFunId='+ pfunid +'&srcDataId='+ dataId;
			
			//删除后要处理的内容
			var endcall = function(data) {
				self.grid.getStore().reload();
				//目标表刷新
				if (fkg) {
					fkg.getStore().reload();
				}
			};
			
			//发送请求
			Request.postRequest(params, endcall);
		}
	};
		
	return new Jxstar.GridNode(config);
}