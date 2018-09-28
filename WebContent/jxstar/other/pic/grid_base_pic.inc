	//显示拍照对话框
	var showPic = function(gridId) {
		var ifrHtml = '<iframe frameborder="no" style="display:none;border-width:0;width:100%;height:100%;" ></iframe>';
		var win = new Ext.Window({
			title:'拍照',
			layout:'fit',
			width:460,
			height:410,
			resizable: true,
			modal: true,
			closeAction:'close',
			html: ifrHtml,
			listeners: {show:function(cmp){
				var path = Jxstar.path;
				var href = path + '/jxstar/other/pic/index.html';

				var frm = cmp.getEl().child('iframe');
				frm.dom.src = href + '?_dc=' + (new Date()).getTime();//避免缓存
				frm.show();
				frm.dom.gridId = gridId;//保存当前拍照的表格控件ID，在viewpic.jsp用于回调找到当前表格
			}, beforedestroy:function(cmp){
				//处理：IE中打开拍摄窗口后直接关闭，摄像头一直亮着
				var frm = cmp.getEl().child('iframe');
				frm.dom.src = 'about:blank';
			}}
		});

		win.show();
	};
	
	var curGrid = null;
	var funid = config.param.funid;
	var tablename = 'base_mat_code';
	var pkcol = 'base_mat_code__mat_id';
	var picfield = 'img_file';
	
	//取图片的路径
	var showUrl = function(dataId) {
		var params = 'funid=sys_attach&pagetype=editgrid&eventcode=fdown';
		params += '&attach_field=img_file&dataid='+ dataId;
		params += '&table_name='+ tablename +'&datafunid='+ funid;
		
		var path = Jxstar.path;
		url += '/fileAction.do?' + params + '&dataType=byte&nousercheck=1&dc=' + (new Date()).getTime();
		return url;
	};
	
	//重新显示图片，不直接刷新所有数据，提高效率
	var reshow = function(grid, record) {
		var dataId = record.get(pkcol);
		var row = grid.getStore().indexOf(record);
		var cell = grid.getView().getCell(row, 2);
		if (cell) {
			var img = Ext.fly(cell).child('img', true);
			if (img) img.src = showUrl(dataId);
		}
	};
	
	//删除图片附件
	var delPic = function() {
		var records = JxUtil.getSelectRows(curGrid);
		if (!JxUtil.selected(records)) return;
		var dataId = records[0].get(pkcol);
		
		var hdcall = function() {
			//上传参数
			var params = 'funid=sys_attach&pagetype=editgrid&eventcode=fdelete';
				params += '&attach_field='+ picfield +'&dataid='+ dataId;
				params += '&table_name='+ tablename +'&datafunid='+ funid;
				
			//清除图片信息
			var cc = function() {
				//重新加载数据
				//curGrid.getStore().reload();
				reshow(curGrid, records[0]);
			};
			
			Request.postRequest(params, cc);
		};
		
		//确定删除选择的记录吗？
		Ext.Msg.confirm(jx.base.hint, jx.event.delyes, function(btn) {
			if (btn == 'yes') hdcall();
		});
	};
	
	//下载图片
	var downPic = function() {
		var records = JxUtil.getSelectRows(curGrid);
		if (!JxUtil.selected(records)) return;
		var dataId = records[0].get(pkcol);
		
		//发送下载请求
		var url = showUrl(dataId);
		Ext.fly('frmhidden').dom.src = url;
	};
	
	//用于readpic.jsp调用此方法保存附件给当前的记录
	Jxstar.uploadPic = function(picfile, gridId) {
		if (gridId) {//解决多个功能使用此方法上传图片
			curGrid = Ext.getCmp(gridId);
		}
		var records = JxUtil.getSelectRows(curGrid);
		if (!JxUtil.selected(records)) return;
		var dataId = records[0].get(pkcol);
		
		//上传参数
		var params = 'funid=sys_attach&pagetype=editgrid';
			params += '&attach_field='+ picfield +'&dataid='+ dataId +'&datafunid='+ funid;
			params += '&eventcode=camera&table_name='+ tablename +'&pic_file='+ encodeURIComponent(picfile);
		
		var hdcall = function(data) {
			//重新加载数据
			//curGrid.getStore().reload();
			reshow(curGrid, records[0]);
		};
		
		Request.postRequest(params, hdcall);
	};
	
	cols.insert(0, {col:
		{header:'下载', width:40, xtype:'actioncolumn', align:'center', items:[{
				icon: './resources/images/icons/button/imp.gif',
				tooltip: '下载图片',
				handler: function(grid, rowIndex, colIndex) {
					var sm = grid.getSelectionModel();
					if (sm.selectRow) {
						sm.selectRow(rowIndex);
					} else {
						sm.select(rowIndex, colIndex);
					}
					curGrid = grid;
					downPic();
				}
			}]
		}
	});
	
	cols.insert(0, {col:
		{header:'删除', width:40, xtype:'actioncolumn', align:'center', items:[{
				icon: './resources/images/icons/button/imgdel.png',
				tooltip: '删除图片',
				handler: function(grid, rowIndex, colIndex) {
					var sm = grid.getSelectionModel();
					if (sm.selectRow) {
						sm.selectRow(rowIndex);
					} else {
						sm.select(rowIndex, colIndex);
					}
					curGrid = grid;
					delPic();
				}
			}]
		}
	});
	
	cols.insert(0, {col:
		{header:'上传', width:40, xtype:'actioncolumn', align:'center', items:[{
				icon: './resources/images/icons/button/image.gif',
				tooltip: '上传图片',
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
	});
	
	cols.insert(0, {col:
		{header:'拍照', width:40, xtype:'actioncolumn', align:'center', items:[{
				icon: './resources/images/icons/button/camera.png',
				tooltip: '拍摄图片',
				handler: function(grid, rowIndex, colIndex) {
					var sm = grid.getSelectionModel();
					if (sm.selectRow) {
						sm.selectRow(rowIndex);
					} else {
						sm.select(rowIndex, colIndex);
					}
					curGrid = grid;
					//显示拍照对话框
					showPic(grid.getId());
				}
			}]
		}
	});
	
	cols.insert(0, {col:
		{header:'图片', width:40, align:'center', 
			renderer: function(value, metaData, record) {
				var dataId = record.get(pkcol);

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
	});
	
	config.eventcfg = {		
	
		todet: function() {
			var records = JxUtil.getSelectRows(this.grid);
			if (!JxUtil.selected(records)) return;
			
			var self = this;
			var hdcall = function() {
				//取选择记录的主键值
				var params = 'funid='+ self.define.nodeid;
				for (var i = 0; i < records.length; i++) {
					params += '&keyid=' + records[i].get(self.define.pkcol);
				}

				//设置请求的参数
				params += '&pagetype=grid&eventcode=todet';
				var endcall = function(data) {};

				//发送请求
				Request.postRequest(params, endcall);
			};
			
			Ext.Msg.confirm(jx.base.hint, '确定应用图片到物料明细吗？', function(btn) {
				if (btn == 'yes') hdcall();
			});
		}
	};
	