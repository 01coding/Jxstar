	//在最后添加一列按钮
	cols[cols.length] = {col:
		{header:'', width:50, xtype:'actioncolumn', menuDisabled:true, align:'center', items:[{
			icon: 'resources/images/icons/button/cancel.gif',
			tooltip: '删除',
			handler: function(grid, rowIndex, colIndex) {
				var sm = grid.getSelectionModel();
				sm.selectRow(rowIndex);
				
				var ge = grid.gridNode.event;
				ge.del();
			}
			}]
		}
	};
