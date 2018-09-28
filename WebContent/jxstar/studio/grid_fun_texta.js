Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datatexttype = Jxstar.findComboData('texttype');
	var Datapropsrc = Jxstar.findComboData('propsrc');

	var cols = [
	{col:{header:'*键值', width:132, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'funall_text__prop_key',type:'string'}},
	{col:{header:'*中文描述', width:243, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:200, allowBlank:false
		})}, field:{name:'funall_text__prop_value',type:'string'}},
	{col:{header:'类型', width:100, sortable:true, defaultval:'pro', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatexttype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatexttype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatexttype.length; i++) {
				if (Datatexttype[i][0] == value)
					return Datatexttype[i][1];
			}
		}}, field:{name:'funall_text__sys_type',type:'string'}},
	{col:{header:'英文描述', width:243, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:500
		})}, field:{name:'funall_text__prop_value_en',type:'string'}},
	{col:{header:'T1描述', width:157, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'funall_text__prop_value_t1',type:'string'}},
	{col:{header:'属性ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'funall_text__prop_id',type:'string'}},
	{col:{header:'来源', width:100, sortable:true, hidden:true, defaultval:'6', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datapropsrc
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datapropsrc[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datapropsrc.length; i++) {
				if (Datapropsrc[i][0] == value)
					return Datapropsrc[i][1];
			}
		}}, field:{name:'funall_text__prop_src',type:'string'}},
	{col:{header:'T2描述', width:100, sortable:true, hidden:true}, field:{name:'funall_text__prop_value_t2',type:'string'}},
	{col:{header:'T3描述', width:100, sortable:true, hidden:true}, field:{name:'funall_text__prop_value_t3',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'fun_texta'
	};
	
	config.param.notNullFields = 'funall_text__prop_key;funall_text__prop_value;';
	
	config.eventcfg = {
       	
		createjs: function(){
			var params = 'funid=fun_texta&pagetype=editgrid&eventcode=createjs&projectpath=' + 
							Jxstar.session['project_path'];

			var hdcall = function() {
				
			};

			//发送请求
			Request.postRequest(params, hdcall);
		}
	};
	
	config.initpage = function(gridNode){
		var event = gridNode.event;
		event.on('beforesave', function(event) {
			var grid = event.grid;
			var store = grid.getStore();
			var mrow = store.getModifiedRecords();
			
			for (var i = 0, n = mrow.length; i < n; i++) {
				var record = mrow[i];
				var propkey = record.get('funall_text__prop_key');
				propkey = propkey.trim();
				//键值【{0}】不合格，必需且只能有一个“.”，如aaa.bbb！
				var hint = String.format(jx.fun.novalidkey, propkey);
				var keys = propkey.split('.');
				if (keys.length != 2) {
					JxHint.alert(hint); return false;
				} else {
					if (keys[0].length == 0 || keys[1].length == 0) {
						JxHint.alert(hint); return false;
					}
				}
			}
			return true;
		});
	};
		
	return new Jxstar.GridNode(config);
}