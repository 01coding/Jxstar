Ext.layout.FixTableLayout = Ext.extend(Ext.layout.ContainerLayout, {

    columns: 24,
    //虚拟表格的列数
    // private
    rowsnum: 29,
    //虚拟表格的行数
    // private
    monitorResize: true,

    type: 'fixtable',

    targetCls: 'x-fixtable-layout-ct',

    tableAttrs: null,

    // private
    onLayout: function(ct, target) {
        var cs = ct.items.items,
        len = cs.length,
        c, i;

        if (!this.table) {
            target.addClass('x-table-layout-ct');

            this.table = target.createChild(Ext.apply({
                tag: 'table',
                cls: 'x-fixtable-layout',
                cellspacing: 0
            },
            this.tableAttrs), null, true);
        }
		this.renderAll(ct, target);
    },

    // private
    getRow: function(index) {
        var row = this.table.childNodes[index];
        if (!row) {
            row = document.createElement('tr');
            this.table.appendChild(row);
        }
        return row;
    },

    // private
    // 标准table布局是在此方法逐步创建tr、td，而FixTable布局是在取cell前提前创建好了
    getNextCell: function(c) {
        var tr = this.getRow(c.rowindex);
        var tm, td;
        for (var i = 0,
        n = tr.cells.length; i < n; i++) {
            tm = tr.cells[i];
            //找到td后，设置元素的宽度为td的宽度
            if (tm.colIndex == c.colindex) {
                c.setWidth(tm.scrollWidth);
                td = tm;
                break;
            }
        }

        return td;
    },

    // private
    // 判断当前cell中是否需要构建新的TD，如果需要则返回存放哪个item
    hasNewTD: function(items, rowIndex, colIndex) {
        for (var i = 0; i < items.length; i++) {
            var c = items[i];
            var endRowIndex = c.rowindex + c.rowspan; //td占用的cell行结束位置
            var endColIndex = c.colindex + c.colspan; //td占用的cell列结束位置
            if (rowIndex == c.rowindex && colIndex == c.colindex) {
                //当前cell就是元素应该插入的位置
                return c;
            } else if (rowIndex > c.rowindex && rowIndex < endRowIndex && colIndex >= c.colindex && colIndex < endColIndex) {
                //当前cell是被元素所在的td合并的位置
                return null;
            } else {
                continue;
            }
        }
        return null;
    },
	
	//提前创建表格中的tr\td
    createCells: function(items) {
		//不重复建设表格
		var cs = this.table.childNodes;
		if (cs.length > 0) return;
		
        var rows = this.rowsnum;
        var cells = this.columns;
        var cnt = 0;
        //根据表格行数与表格列数循环检查，再根据item设置的所在行列，检查应该显示在哪个td中
        for (var i = 0; i < rows && cnt < items.length; i++) {
            var tr = document.createElement('tr');
            this.table.appendChild(tr);

            //var hasFields = false;
            for (var j = 0; j < cells; j++) {
                //检查cells是否占用，如果占用则继续查询新的cell
                var item = this.hasNewTD(items, i, j);
                if (!item) continue;

                var td = document.createElement('td');
                td.className = 'x-fixtable-cell';

                cnt++;
                //hasFields = true;

                if (item.rowspan > 1) {
                    td.rowSpan = item.rowspan;
                }
                if (item.colspan > 1) {
                    td.colSpan = item.colspan;
                }
                //查找td与元素位置用
                td.colIndex = item.colindex;

                tr.appendChild(td);
				
				//也可以在这里直接render元素，但性能差点
				
            }
            //标记此行没有元素；删除空行后会造成表格显示混乱
            //if (!hasFields) {
                //tr.setAttribute('class', 'nofields');
            //}
        }
    },

    renderAll: function(ct, target) {
        var items = ct.items.items,
        i, c, len = items.length;

        //创建table所有的tr、td
        this.createCells(items);

        for (i = 0; i < len; i++) {
            c = items[i];
			
			if (c) {
				if (!c.rendered || !this.isValidParent(c, target)) {
					this.renderItem(c, i, target);
				} else {
					//doLayout()时，重新计算元素的宽度
					var w = c.container.getWidth();
					if (w && w > 0) {
						c.setWidth(w);
					}
				}
			}
            
        }
    },

    // private
    renderItem: function(c, position, target) {
        // Ensure we have our inner table to get cells to render into.
        if (!this.table) {
            this.table = target.createChild(Ext.apply({
                tag: 'table',
                cls: 'x-fixtable-layout',
                cellspacing: 0
            },
            this.tableAttrs), null, true);
        }
        if (c && !c.rendered) {
			var tm = this.getNextCell(c);
            c.render(tm);
            this.configureItem(c);
			//隐藏元素添加属性
			if (c.xtype == 'hidden' || c.hidden) {
				tm.classList.add('x-hidden-cell');
			}
        } else if (c && !this.isValidParent(c, target)) {
            var container = this.getNextCell(c);
            container.insertBefore(c.getPositionEl().dom, null);
            c.container = Ext.get(container);
            this.configureItem(c);
        }
    },

    // private
    isValidParent: function(c, target) {
        return c.getPositionEl().up('table', 5).dom.parentNode === (target.dom || target);
    },

    destroy: function() {
        delete this.table;
        Ext.layout.FixTableLayout.superclass.destroy.call(this);
    }

    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['fixtable'] = Ext.layout.FixTableLayout;