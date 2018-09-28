Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'类别名称', width:119, sortable:true}, field:{name:'sys_datatype__dtype_name',type:'string'}},
	{col:{header:'权限字段', width:100, sortable:true}, field:{name:'sys_datatype__dtype_field',type:'string'}},
	{col:{header:'含下级?', width:59, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_user_data__has_sub',type:'string'}},
	{col:{header:'数据值', width:119, sortable:true}, field:{name:'sys_user_data__dtype_data',type:'string'}},
	{col:{header:'显示值', width:172, sortable:true}, field:{name:'sys_user_data__display',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_datatype__funid',type:'string'}},
	{col:{header:'显示字段', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_datatype__fun_vfield',type:'string'}},
	{col:{header:'数据字段', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_datatype__fun_field',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_data__user_data_id',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_data__user_id',type:'string'}},
	{col:{header:'数据权限ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_data__dtype_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_user_data'
	};
	
	
	//添加权限添加功能
	config.toolext = function(node, tbar, extItems){
		if (node.state == '1') return;
		
		var extMenu = new Ext.menu.Menu({items:[]});
		tbar.insert(1, {
			eventCode: 'ext_menu',
			text:jx.bus.text52,//'导入数据…',
			iconCls: 'eb_menu',
			menu: extMenu
		});
		
		var showData = function(obj) {
			var md = obj.initialConfig.data;
			var funid = md.funid;
			var define = Jxstar.findNode(funid);
			
			var endcall = function(grid) {
				JxUtil.delay(1000, function(){
                    if (define.isCloud) {
                        var layout = JxCloud.apps[funid];
                        if (layout) {
                            grid = layout.getComponent(0).getComponent(0);
                            if (!grid) {
                                alert('没有找到Grid对象！');
                           		return;
                            }
                        } else {
                        	alert('没有找到布局对象！');
                            return;
                        }
                    } else 
					//树形结构
					if (!grid.isXType('grid')) {
						grid = grid.getComponent(1).getComponent(0);
						if (!grid.isXType('grid')) {
							grid = grid.getComponent(0).getComponent(0);
						}
					}
					//设置数据类别ID
					grid.rightTypeId = md.typeid;
					//设置数据权限表格
					grid.rightGrid = node.page;
					//设置选择用户ID
					grid.selUserIds = node.page.selUserIds;
					//如果是选择选项控件
					if (md.controlcode.length > 0 && funid == 'sys_control') {
						Jxstar.loadData(grid, {where_sql:'control_code = ?', where_value:md.controlcode, where_type:'string'});
					}
				});
			};
			
			//显示数据
			var url = define.layout;
			if (Ext.isEmpty(url)) url = define.gridpage;
			Jxstar.showData({
				filename: url,
				title: define.nodetitle, 
				pagetype: 'imptype',
				nodedefine: define,
				callback: endcall
			});
		};
		
		var createMenu = function(data) {
			var items = [];
			for (var i = 0, n = data.length; i < n; i++) {
				items[i] = {
					data:data[i],
					text:jx.bus.text53 + data[i].text,//'导入'
					handler:showData
				}
			}
			extMenu.add(items);
		};
		
		var hdCall = function(qd) {
			//alert(Ext.encode(data));
			var data = qd.root;
			if (data == null || data.length == 0) {
				JxHint.alert(jx.bus.text54);//'没有定义数据分类数据！'
				return;
			}
			//构建类别数据
			var mydata = [];
			for (var i = 0, n = data.length; i < n; i++) {
				var d = {
					text:data[i].sys_datatype__dtype_name, 
					funid:data[i].sys_datatype__funid,
					typeid:data[i].sys_datatype__dtype_id,
					controlcode:data[i].sys_datatype__control_code
				};
				mydata[i] = d;
			}
			createMenu(mydata);
		};
		
		//查询所有数据分类数据
		var params = 'eventcode=query_data&funid=queryevent&pagetype=editgrid'+
			'&query_funid=sys_datatype';
		Request.dataRequest(params, hdCall);
	};
		
	return new Jxstar.GridNode(config);
}