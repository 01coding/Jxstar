/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 
 * 
 * @author TonyTan
 * @version 1.0, 2013-05-13
 */
 
Jxstar.currentPage = function(define) {
	//同步加载文件
	if (typeof CodeMirror == "undefined") {
		JxUtil.loadCss('/lib/codemirror/codemirror.css');
		JxUtil.loadJS('/lib/codemirror/codemirror.js');
		JxUtil.loadJS('/lib/codemirror/mode/sql.js');
		JxUtil.loadJS('/lib/codemirror/mode/javascript.js');
		JxUtil.loadJS('/lib/codemirror/jsformat.js');
	}
	
	//工具栏定义
	var tbar = new Ext.Toolbar({
		items:[{text:'执行', cls:'x-btn x-btn-primary', iconCls:'fa fa-cog', handler:function(){implement();}}, '->', {text:'CloseTabs', handler:function(){tabs.removeAll(true);}}]
	});
	
	var rightLayout  = new Ext.Container({
		layout:'border',
		border:false,
		items:[{
		  tbar:tbar,
		  height:180,
		  region:'north',
		  split:true,
		  layout:'fit',
		  style:"font-size:16px",
		  items:[{xtype:'textarea'}]
		},{
			cls:'sub_tab',
			region:'center',
			layout:'fit'
		}]
		});
	var layout = new Ext.Container({
		layout:'border',
		border:false,
		items:[{
		  width:200,
		  region:'west',
		  layout:'fit'
		},{
			region:'center',
			layout:'fit',
			items:[rightLayout]
		}]
	
	}); 
	
	//选项卡加载
	var tabs = new Ext.TabPanel();
	rightLayout.getComponent(1).add(tabs);
	//codeMirror 加载
	var editor;
	JxUtil.delay(500, function(){
		var t = rightLayout.getComponent(0).body.first().dom;
		editor = CodeMirror.fromTextArea(t, {
			readOnly : false,
			lineNumbers : false,
			matchBrackets : true,//匹配关闭括弧
			autoCloseBrackets : true,//自动创建关闭括弧
			indentUnit : 4,//缩进字符个数
			mode : 'text/x-sql'
		});
		editor.setSize("100%","100%");
		editor.focus();
	});

	//执行sql操作
	function implement(){
		var data = (!editor.getSelection())?editor.getValue():editor.getSelection();
		var params = "funid=data_sql&eventcode=implement";
		params += "&data="+encodeURIComponent(data)+"";
		if(data.toLowerCase().trim().indexOf("select") == 0){
			doImplement(data,1);
		}else{
			Request.postRequest(params, doImplement);
		}
	}
	
	
	//显示表格名,左侧表格名显示
	function queryTable(){
		var params = "funid=data_sql&eventcode=queryTable";
		Request.postRequest(params,showTable);
	}
	
	//显示表格的回调方法,功能实现左侧表格显示,及右键菜单功能
	function showTable(data){
		var columns = [{header:"表格名",dataIndex:"table_name",width:100}];
		var datas = data.data;
		var fields = [{name:"table_name"}];
		var store = new Ext.data.JsonStore({
			data:datas,
			fields:fields
		});
		var grid = new Ext.grid.GridPanel({
			store:store,
			columns:columns,
			enableHdMenu:false,
			hideHeaders:true,
			viewConfig: {forceFit: true}
		});
		//表格右键菜单  
		var menuParams = "funid=data_sql&eventcode=getTableInfo";
		var menuItems = [{  
				text:'查看详情',  
				handler:function(){  
					Request.postRequest(menuParams, showTableInfo);
					menuParams = "funid=data_sql&eventcode=getTableInfo";
				}  
			}];  
		var contextmenu = new Ext.menu.Menu({  
			items:menuItems
		});  
		grid.on("rowcontextmenu",function(grid, rowIndex, e){  
			menuParams += "&tableName='"+this.getView().getCell(rowIndex,0).innerText+"'";
			e.preventDefault();  
			contextmenu.showAt(e.getXY());  
		});  
		layout.getComponent(0).removeAll();
		layout.getComponent(0).add(grid);
		layout.doLayout();
		
	}
	
	//右键菜单点击的回调方法，功能显示表格详细信息
	function showTableInfo(data){
		var columns = [{header:"field_name",dataIndex:"field_name"},	
					   {header:"field_title",dataIndex:"field_title"},	
					   {header:"data_type",dataIndex:"data_type"},	
					   {header:"data_size",dataIndex:"data_size"},
					   {header:"data_scale",dataIndex:"data_scale"},
					   {header:"nullable",dataIndex:"nullable"}];	
		var datas = data.data;
		var fields = [{name:"field_name"},
					{name:"field_title"},
					{name:"data_type"},
					{name:"data_size"},
					{name:"data_scale"},
					{name:"nullable"}];
		var store = new Ext.data.JsonStore({
				data:datas,
				fields:fields
			});
		var grid = new Ext.grid.GridPanel({
			store:store,
			columns:columns
		}); 
		var tab = tabs.add({
			title:data.data[0].table_name,
			closable:true,
			layout:'fit',
			items:[grid]
		});
		tabs.activate(tab);
		tabs.doLayout();
	}
	
	//"执行"操作回调方法,功能显示查询或者更新的结果.
	function doImplement(data,type){
		if(type == 1){
            var sqldata = encodeURIComponent(data);
			var params = "funid=data_sql&eventcode=getColAndField&sql="+sqldata;
			Request.postRequest(params,function(res){
				if(res){
					columns= res.columns;
					fields=res.fields;
                    var url = Jxstar.path + '/commonAction.do?funid=data_sql&eventcode=implement&user_id='+Jxstar.session['user_id'];
					
                    var store = new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
							method: 'POST',
							url:url,
							listeners: {exception: function(a, b, c, d, e, f){
								store.removeAll();
								e.srcdesc = 'GridNode.js?url='+url;
								JxUtil.errorResponse(e);
								return;
							}}
						}),
						reader: new Ext.data.JsonReader({
							root: 'data.root',
							totalProperty: 'data.total'
						}, fields),
					
					});
					
					var padebar = new Ext.PagingToolbar({
						pageSize:10,
						store:store,
						displayInfo:true,
						displayMsg:'共{2}条',
						emptyMsg:"没有记录"
					});  
					
					var rn = new Ext.grid.RowNumberer({
                        renderer : function(v, p, record, rowIndex){
                            if(this.rowspan){
                                p.cellAttr = 'rowspan="'+this.rowspan+'"';
                            }
                            return rowIndex+1+Jxstar.startNo;
                        }
                    });
					columns.insert(0, rn);
					
					var grid = new Ext.grid.GridPanel({
						store:store,
						columns:columns,
						tbar:padebar
					});
					
					store.load({params:{data:data,start:0,limit:10}});
                    
					var tab = tabs.add({
						title:'查询结果',
						layout:'fit',
						items:[grid]
					});
					tabs.activate(tab);
					//要设置一下高度才能出现滚动条，doLayout无效
					grid.setHeight(tab.getHeight()-20);
				}
				
			});
			
			
		}else{
			var tab = tabs.add({
				title:'执行消息',
				closable:true,
				layout:'fit',
				html:data.data
			});
			tabs.activate(tab);
		}
	}
	
	
	
	//预加载表格名列表
	queryTable();
	return layout;
};


