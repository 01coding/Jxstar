Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'Grid扩展文件', width:327, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'fun_ext__grid_initpage',type:'string'}},
	{col:{header:'Form扩展文件', width:329, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'fun_ext__form_initpage',type:'string'}},
	{col:{header:'扩展ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_ext__ext_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_ext__fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'fun_ext'
	};
	
	
	config.eventcfg = {
		createjs: function(){
			var params = 'funid=fun_text&pagetype=editgrid&eventcode=createjs&projectpath=' + 							Jxstar.session['project_path'];

			//生成文件后自动加载该文件
			var hdcall = function() {				jx = null;
				Request.loadJS('/public/locale/jxstar-lang-zh.js');
			};

			//发送请求
			Request.postRequest(params, hdcall);
		},				createjse: function(lang){			var params = 'funid=fun_text&pagetype=editgrid&eventcode=createjse&lang='+ lang +'&projectpath=' + 							Jxstar.session['project_path'];			//发送请求			Request.postRequest(params, null);		}
	};		config.initpage = function(gridNode){		var event = gridNode.event;		event.on('beforesave', function(event) {			var grid = event.grid;			var store = grid.getStore();			var mrow = store.getModifiedRecords();						for (var i = 0, n = mrow.length; i < n; i++) {				var record = mrow[i];				var propkey = record.get('funall_text__prop_key');				propkey = propkey.trim();				//键值【{0}】不合格，必需且只能有一个“.”，如aaa.bbb！				var hint = String.format(jx.fun.novalidkey, propkey);				var keys = propkey.split('.');				if (keys.length != 2) {					JxHint.alert(hint); return false;				} else {					if (keys[0].length == 0 || keys[1].length == 0) {						JxHint.alert(hint); return false;					}				}			}			return true;		});	};
		
	return new Jxstar.GridNode(config);
}