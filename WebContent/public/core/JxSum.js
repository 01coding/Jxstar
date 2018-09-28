/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 生成表格统计数据栏的控件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Ext.ns('Jxstar');
Jxstar.JxSum = Ext.extend(Ext.util.Observable, {

    constructor : function(config){
        Ext.apply(this, config);
        Jxstar.JxSum.superclass.constructor.call(this);
    },
	
    init : function(grid){
        this.grid = grid;
		this.grid.jxsum = this;
		
		var v = this.view = grid.getView();
        //v.doGroupEnd = this.doGroupEnd.createDelegate(this);

        v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
        v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
        v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
        v.afterMethod('onUpdate', this.doUpdate, this);
        v.afterMethod('onRemove', this.doRemove, this);

        if(!this.rowTpl){
            this.rowTpl = new Ext.Template(
                '<div class="x-grid3-summary-row" style="{tstyle}">',
                '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                    '<tbody><tr>{cells}</tr></tbody>',
                '</table></div>'
            );
            this.rowTpl.disableFormats = true;
        }
        this.rowTpl.compile();

        if(!this.cellTpl){
            this.cellTpl = new Ext.Template(
                '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}">',
                '<div class="x-grid3-cell-inner x-grid3-col-{id}">{value}</div>',
                "</td>"
            );
            this.cellTpl.disableFormats = true;
        }
        this.cellTpl.compile();
    },

    toggleSummaries : function(visible){
        var el = this.grid.getGridEl();
        if(el){
            if(visible === undefined){
                visible = el.hasClass('x-grid-hide-summary');
            }
            el[visible ? 'removeClass' : 'addClass']('x-grid-hide-summary');
        }
    },

    renderSummary : function(o, cs){
		//用于平均数计算
		var st = this.grid.getStore();
		var gn = this.grid.gridNode;
		var avgs = gn.param.average_fields;//--------------
		
        cs = cs || this.view.getColumnData();
        var cfg = this.grid.getColumnModel().config,
            buf = [], c, p = {}, cf, last = cs.length-1;
        for(var i = 0, len = cs.length; i < len; i++){
            c = cs[i];
            cf = cfg[i];
            p.id = c.id;
            p.style = c.style;
            p.css = (i == 0) ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
			
			p.value = o.data[c.name];//处理小数点之前的0为空的问题
			p.value = Ext.data.Types.FLOAT.convert(p.value);
			if (p.value == undefined || p.value === "") {
				if (i == 0) {
					p.value = "<i class='fa eb_sum'></i>";
				} else {
					p.value = "&#160;";
				}
			} else {//处理汇总值的小数位
				if (!isNaN(p.value) && cf.renderer) {
					var t = p.value;
					p.value = (cf.renderer)(p.value);
					//用于平均数计算
					if (avgs && avgs.length > 0) {
						for (var j = 0; j < avgs.length; j++) {
							if (c.name == avgs[j]) {
								var tc = st.getTotalCount();
								if (tc == 0) {
									p.value = '&#160;';
								} else {
									p.value = '平均: '+(cf.renderer)(t/tc);
								}
								break;
							}
						}
					}//--------------
				}
			}
            buf[buf.length] = this.cellTpl.apply(p);
        }

        return this.rowTpl.apply({
            tstyle: 'width:'+this.view.getTotalWidth()+';',
            cells: buf.join('')
        });
    },
	
	isGrouped : function(){
        return true; 
		//!Ext.isEmpty(this.grid.getStore().groupField);
    },
	
	doWidth : function(col, w, tw){
        if(!this.isGrouped()){
            return;
        }
        var //gs = this.view.getGroups(),
            //len = gs.length,
			len = 1,
            i = 0,
            s;
		var rdom = this.view.mainBody.dom.childNodes;
			rlen = rdom.length;
			
        for(; i < len; ++i){
            //s = gs[i].childNodes[2];
			s = rdom[rlen-1];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.width = w;
        }
    },

    doAllWidths : function(ws, tw){
        if(!this.isGrouped()){
            return;
        }
        var //gs = this.view.getGroups(),
            //len = gs.length,
			len = 1,
            i = 0,
            j, 
            s, 
            cells, 
            wlen = ws.length;
		var rdom = this.view.mainBody.dom.childNodes;
			rlen = rdom.length;
            
        for(; i < len; i++){
            //s = gs[i].childNodes[2];
			s = rdom[rlen-1];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            cells = s.firstChild.rows[0].childNodes;
            for(j = 0; j < wlen; j++){
                cells[j].style.width = ws[j];
            }
        }
    },

    doHidden : function(col, hidden, tw){
        if(!this.isGrouped()){
            return;
        }
        var //gs = this.view.getGroups(),
            //len = gs.length,
			len = 1,
            i = 0,
            s, 
            display = hidden ? 'none' : '';
		var rdom = this.view.mainBody.dom.childNodes;
			rlen = rdom.length;
			
        for(; i < len; i++){
            //s = gs[i].childNodes[2];
			s = rdom[rlen-1];
            if (s.style) {
				s.style.width = tw;
				s.firstChild.style.width = tw;
				s.firstChild.rows[0].childNodes[col].style.display = display;
			}
        }
    },

    // Note: requires that all (or the first) record in the
    // group share the same group value. Returns false if the group
    // could not be found.
    refreshSummary : function(groupValue){
        //return this.refreshSummaryById(this.view.getGroupId(groupValue));
    },

    getSummaryNode : function(gid){
        var g = Ext.fly(gid, '_gsummary');
        if(g){
            return g.down('.x-grid3-summary-row', true);
        }
        return null;
    },

    refreshSummaryById : function(gid){
        var g = Ext.getDom(gid);
        if(!g){
            return false;
        }
        var rs = [];
        this.grid.getStore().each(function(r){
            if(r._groupId == gid){
                rs[rs.length] = r;
            }
        });
        var cs = this.view.getColumnData(),
            //data = this.calculate(rs, cs),
            markup = this.renderSummary({data: data}, cs),
            existing = this.getSummaryNode(gid);
            
        if(existing){
            g.removeChild(existing);
        }
        Ext.DomHelper.append(g, markup);
        return true;
    },

    doUpdate : function(ds, record){
        //this.refreshSummaryById(record._groupId);
    },

    doRemove : function(ds, record, index, isUpdate){
        /*if(!isUpdate){
            this.refreshSummaryById(record._groupId);
        }*/
    },
	
	refresh : function(data) {
		var body = this.grid.getView().mainBody;
		if (!body) return;
		var markup = this.renderSummary(data);
		
		body.select('.x-grid3-summary-row').remove();
		body.insertHtml('beforeEnd', markup);
	}
});
