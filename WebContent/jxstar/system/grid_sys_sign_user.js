Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstate = Jxstar.findComboData('regstate');

	var cols = [
	{col:{header:'状态', width:51, sortable:true, defaultval:'0', align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataregstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataregstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataregstate.length; i++) {
				if (Dataregstate[i][0] == value)
					return Dataregstate[i][1];
			}
		}}, field:{name:'wf_signet__state',type:'string'}},
	{col:{header:'*工号', width:104, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TriggerField({
			maxLength:20,
			editable:false, allowBlank:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				var selcfg = {"pageType":"combogrid", "nodeId":"sys_user", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"sys_user.user_id;user_code;user_name", "targetField":"wf_signet.data_id;data_code;data_name", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"wf_signet.data_code"};
				JxSelect.createSelectWin(selcfg, this, 'node_sys_sign_user_editgrid');
			}
		})}, field:{name:'wf_signet__data_code',type:'string'}},
	{col:{header:'姓名', width:118, sortable:true, editable:false,
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'wf_signet__data_name',type:'string'}},
	{col:{header:'版本', width:56, sortable:true, defaultval:'1', align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'wf_signet__version_code',type:'int'}},
	{col:{header:'*版本日期', width:136, sortable:true, defaultval:'fun_getToday()', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.DateField({
			format: 'Y-m-d H:i', allowBlank:false,
			minValue: '1900-01-01'
		}),
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'wf_signet__version_date',type:'date'}},
	{col:{header:'创建人', width:62, sortable:true, defaultval:'fun_getUserName()', editable:false,
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'wf_signet__up_user',type:'string'}},
	{col:{header:'图片文件名', width:136, sortable:true, hidden:true}, field:{name:'wf_signet__img_file',type:'string'}},
	{col:{header:'印章说明', width:129, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'wf_signet__stamp_desc',type:'string'}},
	{col:{header:'数据区别', width:100, sortable:true, colindex:10000, hidden:true, defaultval:'1'}, field:{name:'wf_signet__data_diff',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_signet__data_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_signet__signet_id',type:'string'}},
	{col:{header:'上传人ID', width:100, sortable:true, colindex:10000, hidden:true, defaultval:'fun_getUserId()'}, field:{name:'wf_signet__up_userid',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user__dept_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'sys_sign_user'
	};
	
	
	cols[cols.length] = {col:
		{header:jx.bus.text48, width:50, xtype:'actioncolumn', align:'center', items:[{//'上传'
				icon: 'resources/images/icons/button/upload.gif',
				tooltip: jx.bus.text49,//'上传图片',
				handler: function(grid, rowIndex, colIndex) {
					var sm = grid.getSelectionModel();
					if (sm.selectRow) {
						sm.selectRow(rowIndex);
					} else {
						sm.select(rowIndex, colIndex);
					}
					var ge = grid.gridNode.event;
					ge.addAttach('img_file');
				}
			}]
		}
	};
	
	cols[cols.length] = {col:
		{header:jx.bus.text50, width:40, align:'center', //'预览'
			renderer: function(value, metaData, record) {
				var dataId = record.get('wf_signet__signet_id');
				//取图片的路径
				var showUrl = function(dataId) {
					var params = 'funid=sys_attach&pagetype=editgrid&eventcode=fdown';
					params += '&attach_field=img_file&dataid='+ dataId;
					params += '&table_name=wf_signet&datafunid=sys_sign_dept';
					
					var url = Jxstar.path+'/fileAction.do?' + params + '&dataType=byte&nousercheck=1&dc=' + (new Date()).getTime();
					return url;
				};
				//显示图片
				JxUtil.showImage = function(img) {
					var el = Ext.get(img);
					if (el.toolTip) {el.toolTip.show(); return;}
					
					var url = showUrl(el.getAttribute('dataId'));
					var html = '<img src="'+ url +'">';
					var cfg = {
						target: el,
						autoWidth: true,
						autoHeight: true,
						html: html,
						anchor: 'left',//设置该参数，可以自动控制tip显示位置，防止图片被挡住
						dismissDelay: 15000
					};
					//IE下面tip显示错位，不能使用autoWidth参数
					if (Ext.isIE) {
						cfg.autoWidth = false;
						cfg.width = 50;
					}
					el.toolTip = new Ext.ToolTip(cfg);
					el.toolTip.show();
				};
				
				var html = '<img src="'+ showUrl(dataId) +'" dataId="'+ dataId +'" onmouseover="JxUtil.showImage(this);" style="width:30px; height:30px; cursor:pointer;">';
				return html;
			}
		}
	};
	
	config.initpage = function(gridNode){
		var event = gridNode.event;
		event.on('beforeaudit', function(ge){
			var records = JxUtil.getSelectRows(ge.grid);
			for (var i = 0; i < records.length; i++) {
				var img_file = records[i].get('wf_signet__img_file');
				if (img_file.length == 0) {
					JxHint.alert(jx.bus.text51);//'要提交的记录没有上传印章图片，不能启用！'
					return false;
				}
			}
			return true;
		});
	};
		
	return new Jxstar.GridNode(config);
}