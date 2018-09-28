/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 对ExtJs部分组件功能进行扩展或完善。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */
JxExt = {};
(function(){
	//浏览器端信息
	var ua = navigator.userAgent.toLowerCase();
	var isTrident = function(){
		var re = /trident/;
		return re.test(ua);
	};
	//是否IE浏览器内核
	Ext.isTrident = isTrident();
	JxExt.isIE = isTrident()||Ext.isIE;
	//取高版本IE号
	JxExt.getIE = function(){
		var i = ua.indexOf('msie ');
		if (i >= 0) {
			var s = ua.substring(i, ua.length).split(';');
			if (s[0] && s[0].length > 6) {
				s = s[0].split(' ');
				var no = s[s.length-1];
				return parseInt(no);
			}
		} else if (Ext.isTrident) {
			i = ua.indexOf('rv:');
			var s = ua.substring(i, ua.length).split(')');
			if (s[0] && s[0].length > 4) {
				s = s[0].split(':');
				var no = s[s.length-1];
				return parseInt(no);
			}
		}
		return -1;
	};
	if (Ext.isTrident) {
		var c = document.body || document.getElementsByTagName("body")[0];
		Ext.fly(c, "_internal").replaceClass('ext-gecko ext-gecko3', 'ext-ie');
	}
	
	//IE9 不支持classList属性
	window.HTMLElement = window.HTMLElement || Element;
	
	if (!("classList" in document.documentElement)) {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/g),
                            index = classes.indexOf(value);
                        
                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    }
                }
                
                return {                    
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),
                    
                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),
                    
                    toggle: update(function(classes, index, value) {
                        if (~index)
                            classes.splice(index, 1);
                        else
                            classes.push(value);
                    }),
                    
                    contains: function(value) {
                        return !!~self.className.split(/\s+/g).indexOf(value);
                    },
                    
                    item: function(i) {
                        return self.className.split(/\s+/g)[i] || null;
                    }
                };
            }
        });
    }
	
	//是否启用XSS过滤
	var filterXSS = function() {
		var filter_re1 = /[=][\s]*on/gi;//过滤所有 = onxxx 前台方法；
		var filter_re2 = /(script)|(eval)|(frame)|(src)|(cookie)|(style)|(expression)/gi;//过滤这些关键字
		
		//前面那些数据库相关的关键字在java后台有处理；中间那些运算符号不处理，会影响系统运行，那些没有安全问题；
		var xss_filter = function(str) {
			var s = "";   
			if (typeof str == "undefined" || str.length == 0) return "";
			s = str.replace(filter_re1, "");   
			s = s.replace(filter_re2, "");
			return s;
		};
			
		/**
		 * 是否启用XSS过滤检查。
		 **/
		Ext.form.Field.prototype.beforeBlur = function() {
			var v = this.getValue();
		    if(typeof v == "string"){
		    	v = xss_filter(v);
		        this.setValue(v);
		    }
		};
	};
	setTimeout(function(){
		if (Jxstar.systemVar) {
			var fxss = Jxstar.systemVar.page__filter__xss;
			if (fxss == '1') filterXSS();
		}
	}, 2000);
	
})();

/**
 * 新增方法：在数组中插入对象
 * index -- 指要插入的位置，从0开始，如果是负数，则从尾部开始
 * item -- 指要插入的项目
 **/
Array.prototype.insert = function(index, item) {
	if (index >= this.length) {
		this[this.length] = item;
		return this;
	}
	if (index < 0) {
		index = this.length + index;
	}
	
	for(var i = this.length-1; i >= index; i--) {
		this[i+1] = this[i];
	}
	this[index] = item;
	return this;
};

/**
 * 解决在IE10下菜单与标签打不开的问题
 **/
Ext.Element.prototype.getAttribute = Ext.isIE ? function(name, ns){
	var d = this.dom;
	//add by tony.tan IE10 use
	if (d.getAttribute(name)) return d.getAttribute(name);
	if (d.getAttribute(ns + ":" + name)) return d.getAttribute(ns + ":" + name);
	//---------------
	var type = typeof d[ns + ":" + name];

	if(['undefined', 'unknown'].indexOf(type) == -1){
		return d[ns + ":" + name];
	}
	return d[name];
} : function(name, ns){
	var d = this.dom;
	return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name) || d.getAttribute(name) || d[name];
};

/**
 * 修改属性：定期清理孤立节点
 **/
Ext.enableListenerCollection = true;

/**
 * ext-3.3.1
 * 修改方法：把Date对象格式化yyyy-mm-dd格式的字符串。
 **/
Ext.urlEncode = function(o, pre){
	var empty, buf = [], e = encodeURIComponent;
	
	Ext.iterate(o, function(key, item){
		empty = Ext.isEmpty(item);
		Ext.each(empty ? key : item, function(val){
			//Ext.encode(val).replace(/"/g, '') --> val.dateFormat('Y-m-d H:i:s') //modify by tony
			buf.push('&', e(key), '=', (!Ext.isEmpty(val) && (val != key || !empty)) ? (Ext.isDate(val) ? val.dateFormat('Y-m-d H:i:s') : e(val)) : '');
		});
	});
	if(!pre){
		buf.shift();
		pre = '';
	}
	return pre + buf.join('');
};

/* 调整样式后，对话框中不需要边框，避免btns显示错位 */
Ext.Window.prototype.border = false;

/**
 * ext-3.3.1
 * 修改方法：分页栏刷新数据时加上上次的参数。
 **/
Ext.PagingToolbar.prototype.doLoad = function(start){
	var o = {};
	var options = this.store.lastOptions;//---add by tony
	if (options && options.params) {
		o = options.params;
	}//---add by
	
	var pn = this.getParams();
	o[pn.start] = start;
	o[pn.limit] = this.pageSize;
	if(this.fireEvent('beforechange', this, o) !== false){
		this.store.load({params:o});
	}
	
	//---add by tony, store.load set startno = 0
	Jxstar.startNo = start;
};
Ext.PagingToolbar.prototype.onLoad = function(store, r, o){
	/*if(!this.rendered){
		this.dsLoaded = [store, r, o];
		return;
	}*/
	var p = this.getParams();
	this.cursor = (o.params && o.params[p.start]) ? o.params[p.start] : 0;
	var d = this.getPageData(), ap = d.activePage, ps = d.pages;
	if(!this.rendered){
		this.dsLoaded = [store, r, o];
		this.fireEvent('change', this, d);//add by tony.tan 方便用分页工具栏模型，不显示对象
		return;
	}

	this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
	this.inputItem.setValue(ap);
	this.first.setDisabled(ap == 1);
	this.prev.setDisabled(ap == 1);
	this.next.setDisabled(ap == ps);
	this.last.setDisabled(ap == ps);
	this.refresh.enable();
	this.updateInfo();
	this.fireEvent('change', this, d);
};
Ext.PagingToolbar.prototype.cls = 'x-pagebar';

/**
 * ext-3.3.1
 * 修改方法：设置表格行号列的缺省宽度为40
 **/
Ext.grid.RowNumberer.prototype.width = 40;
//通过GridView.getColumnStyle的方法会把样式添加到序号列中
var rownumwidth = (Ext.isGecko) ? 39 : 41;
Ext.grid.RowNumberer.prototype.css = 'width:'+ rownumwidth +'px !important;';

/**
 * ext-3.3.1
 * 修改方法：支持设置表格头部的样式
 **/ 
Ext.grid.GridView.prototype.getColumnStyle = function(colIndex, isHeader){
	var colModel  = this.cm,
		colConfig = colModel.config,
		style     = isHeader ? colConfig[colIndex].hcss || '' : colConfig[colIndex].css || '',//添加了属性：colConfig[colIndex].hcss || 
		align     = colConfig[colIndex].align;
	
	style += String.format("width: {0};", this.getColumnWidth(colIndex));
	
	if (colModel.isHidden(colIndex)) {
		style += 'display: none; ';
	}
	
	if (align) {
		style += String.format("text-align: {0};", align);
	}
	
	return style;
};

/**
 * ext-3.3.1
 * 修改方法：表格在编辑时表头不能排序
 **/ 
Ext.grid.GridView.prototype.onHeaderClick = function(g, index) {
    if (this.headersDisabled || !this.cm.isSortable(index)) {
        return;
    }
    //add by tony
    if (g.store.getModifiedRecords().length > 0) return;
    g.stopEditing(true);
    g.store.sort(this.cm.getDataIndex(index));
};

/**
 * ext-3.3.1
 * 修改方法：修改表格单元可选择字符，1行增加：x-selectable，二行删除：unselectable="on"，原：
 * '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
 *     '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
 * '</td>'
 **/ 
Ext.grid.GridView.prototype.cellTpl = new Ext.Template(
	'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',
		'<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
	'</td>'
);

/**
 * ext-3.3.1
 * 修改方法：去掉属性表格中按属性名排序的特性
 **/
Ext.grid.PropertyGrid.prototype.initComponent = function(){
	this.customRenderers = this.customRenderers || {};
	this.customEditors = this.customEditors || {};
	this.lastEditRow = null;
	var store = new Ext.grid.PropertyStore(this);
	this.propStore = store;
	var cm = new Ext.grid.PropertyColumnModel(this, store);
	//store.store.sort('name', 'ASC');	//delete by tony
	this.addEvents(
		'beforepropertychange',
		'propertychange'
	);
	this.cm = cm;
	this.ds = store.store;
	Ext.grid.PropertyGrid.superclass.initComponent.call(this);

	this.mon(this.selModel, 'beforecellselect', function(sm, rowIndex, colIndex){
		if(colIndex === 0){
			this.startEditing.defer(200, this, [rowIndex, 1]);
			return false;
		}
	}, this);
};

/**
 * ext-3.3.1
 * 修改方法：把返回结果中的树形数据作为响应数据
 **/
Ext.tree.TreeLoader.prototype.handleResponse = function(response){
	this.transId = false;
	var a = response.argument;
	
	//---add by tony
	//-------------------前端分页取数------------------
	var node = a.node;
	var getPageData = function(datas, node){
		var p = node.queryParams;
		if (!p) return datas;
		if (!node.total) return datas;
		
		var start = p.start;
		var limit = p.limit;
		var rets = [];
		if (node.count < limit) {
			rets = datas.slice(start);
		} else {
			rets = datas.slice(start, start+limit);
		}
		//alert('total:'+node.total+'; start:'+start+'; limit:'+limit+'; rets='+rets.length);
		return rets;
	};
	//如果有数据后取分页数据
	if (node.myResults) {
		response.responseData = getPageData(node.myResults, node);
	//-------------------end------------------
	
	} else {
		var tranFn = this.treeDataFn;//支持把数组转换为tree
		var f = Ext.decode(response.responseText);
		var d = f.data;
		if (d != null) {
			if (tranFn) {
				response.responseData = tranFn(d, node);
			} else {
				if (d.total && d.root) {
					node.total = d.total||0;
					node.count = d.root.length;
					response.responseData = d.root;
				} else {
					response.responseData = d;
				}
			}
		} else {
			if (tranFn) {
				response.responseData = tranFn(f, node);
			} else {
				response.responseData = f;
			}
		}
		//保存结果集到节点对象
		if (node.loadRemote === false) {
			node.myResults = response.responseData;
			//只取第一页的数据
			response.responseData = getPageData(node.myResults, node);
		}
	//----add end
	}
	
	this.processResponse(response, node, a.callback, a.scope);
	this.fireEvent("load", this, node, response);
};
Ext.tree.TreeLoader.prototype.getParams = function(node){
	var bp = Ext.apply({}, this.baseParams),
		np = this.nodeParameter;

	np && (bp[ np ] = node.id);
	//分页参数
	if (node.queryParams) {
		bp = Ext.apply(bp, node.queryParams);
	}
	
	return bp;
};
//为实现支持前端分页效果，重构此方法
Ext.tree.TreeLoader.prototype.requestData = function(node, callback, scope){
	if(this.fireEvent("beforeload", this, node, callback) !== false){
		if(this.directFn){
			var args = this.getParams(node);
			args.push(this.processDirectResponse.createDelegate(this, [{callback: callback, node: node, scope: scope}], true));
			this.directFn.apply(window, args);
		}else{
			//false表示前端分页取数，有数据后就不调用后台了
			if (node.loadRemote === false && node.myResults) {
				this.handleResponse({
					responseData: node.myResults,
					responseText: null,
					argument: {callback: callback, node: node, scope: scope}
				});//add by
			} else {
				this.transId = Ext.Ajax.request({
					timeout:this.timeout || 100000,//add by tony
					method:this.requestMethod,
					url: this.dataUrl||this.url,
					success: this.handleResponse,
					failure: this.handleFailure,
					scope: this,
					argument: {callback: callback, node: node, scope: scope},
					params: this.getParams(node)
				});
			}
		}
	}else{
		// if the load is cancelled, make sure we notify
		// the node that we are done
		this.runCallback(callback, scope || node, []);
	}
};

/**
 * 新增方法：模拟record的set/get方法，在JxSelect.setSelectData中使用。
 **/
Ext.form.BasicForm.prototype.set = function(name, value) {
	var f = this.findField(name);
	if(f){
		var oldValue = f.getValue();
		f.setValue(value);
		//处理字段值修改标记
		f.fireEvent('change', f, oldValue, value);
	}
	return this;
};

/**
 * 新增方法：模拟record的set/get方法，在JxSelect.setSelectData中使用。
 **/
Ext.form.BasicForm.prototype.get = function(name) {
	var f = this.findField(name);
	if(f){
		return f.getValue();
	}
	return '';
};

/**
 * 新增方法：取数值。
 **/
Ext.form.BasicForm.prototype.getNum = function(name) {
	var value = '';
	var f = this.findField(name);
	if(f){
		value = f.getValue();
	}
	if (value == null || value.length == 0) return 0;
		
	return parseFloat(value);
};

/**
 * 新增方法：保证修改字段值后不标记为脏数据。
 **/
Ext.form.BasicForm.prototype.oset = function(name, value) {
	var f = this.findField(name);
	if(f){
		var oldValue = f.getValue();
		f.setValue(value);
		//取消字段修改痕迹，设置修改值为原值
		f.originalValue = value;
	}
	return this;
};

/**
* 新增方法：取当前表单的所有字段，含组合字段内的字段
**/
Ext.form.BasicForm.prototype.fieldItems = function() {
	var fields = new Ext.util.MixedCollection(false, function(o){
		return o.getItemId();
	});
	this.items.each(function(field){
		if (field.isComposite) {
			field.items.each(function(f){
				fields.add(f.getItemId(), f);
			});
		} else {
			fields.add(field.getItemId(), field);
		}
	});
	
	return fields;
};

/**
* ext-3.3.1 
* 修改方法：必须有name属性的字段才判断是否有值修改
**/
Ext.form.BasicForm.prototype.isDirty = function() {
	var dirty = false;
	this.items.each(function(f){
	   if(!Ext.isEmpty(f.name) && f.isDirty()){
		   dirty = true;
		   return false;
	   }
	});
	return dirty;
};

/**
 * 新增方法：保证修改字段值后不标记为脏数据。
 **/
Ext.form.ComboBox.prototype.restrictHeight = function(){
	this.innerList.dom.style.height = '';
	var inner = this.innerList.dom,
		pad = this.list.getFrameWidth('tb') + (this.resizable ? this.handleHeight : 0) + this.assetHeight,
		h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight),
		ha = this.getPosition()[1]-Ext.getBody().getScroll().top,
		hb = Ext.lib.Dom.getViewHeight()-ha-this.getSize().height,
		space = Math.max(ha, hb, this.minHeight || 0)-this.list.shadowOffset-pad-5;

	h = Math.min(h, space, this.maxHeight);
	
	//如果是IE，当有X方向的滚动条时显示不全了，则添加高度18，其它浏览器添加1
	if (Ext.isIE) {
		var cw = inner.clientWidth, ow = inner.offsetWidth;
		if (cw < ow) {
			h += 18;
		}
	} else {
		h += 1;
	}
	//add by tony.tan

	this.innerList.setHeight(h);
	this.list.beginUpdate();
	this.list.setHeight(h+pad);
	this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
	this.list.endUpdate();
};

/**
 * 修改方法：如果值为'请选择'，则为空。
 **/
Ext.form.ComboBox.prototype.getValue = function(){
	var v = '';
	if(this.valueField){
		v = Ext.isDefined(this.value) ? this.value : '';
	}else{
		v = Ext.form.ComboBox.superclass.getValue.call(this);
	}
	if(v == jx.star.select) {//添加这个判断，this.emptyText为空了
		v = '';
		this.value = '';
		this.originalValue = '';
	}
	return v;
};

/**
 * ext-3.3.1
 * 修改方法：取checkbox的值时取 0 或 1，而不是true false。
 **/
Ext.form.Checkbox.prototype.getValue = function(){
	if(this.rendered && this.el){
		return this.el.dom.checked ? '1' : '0';
	} else {
		return this.checked ? '1' : '0';
	}
};

Ext.form.Checkbox.prototype.isDirty = function(){
	if(this.disabled || !this.rendered) {
		return false;
	}
	//console.log('...........isDirty inputValue='+this.inputValue+', '+String(this.getValue())+';'+String(this.originalValue));
	return String(this.getValue()) !== String(this.originalValue);
};

/**
 * ext-3.3.1
 * 修改方法：返回 null 改为 ''。
 **/
Ext.form.RadioGroup.prototype.getValue = function() {
	var val = '';
	this.eachItem(function (item) {
		if (item.checked) {
			val = item.inputValue;
			return false;
		}
	});
	return val;
};

/**
 * ext-3.3.1
 * 修改方法：支持多个值拼从字符串。
 **/
Ext.form.CheckboxGroup.prototype.getValue = function() {
	var val = '';
	this.eachItem(function (item) {
		if (item.checked) {
			val += item.inputValue + ',';
		}
	});
	val = val.slice(0, val.length - 1);
	return val;
};

/**
 * ext-3.3.1
 * 修改方法：设置未勾选值显示空
 **/
Ext.form.CheckboxGroup.prototype.setValueForItem = function(val){
	this.originalValue = val;//add by 
	
	val = String(val).split(',');
	this.eachItem(function(item){
		if(val.indexOf(item.inputValue)> -1){
			item.setValue(true);
		} else {
			item.setValue(false);//add by 
		}
	});
};

Ext.form.CheckboxGroup.prototype.isDirty = function(){
	//override the behaviour to check sub items.
	if (this.disabled || !this.rendered) {
		return false;
	}
	/*
	var dirty = false;
	this.eachItem(function(item){
		if(item.isDirty()){
			dirty = true;
			return false;
		}
	});*/
	return String(this.getValue()) !== String(this.originalValue);
};

/**
 * ext-3.3.1
 * 修改方法：支持多个值拼从字符串。
 **/
Ext.form.BasicForm.prototype.updateRecord = function(record){
	record.beginEdit();
	var fs = record.fields,
		field,
		value;
	fs.each(function(f){
		field = this.findField(f.name);
		if(field){
			value = field.getValue();
			if (typeof value != undefined && value.getGroupValue) {
				value = value.getGroupValue();
			} /*else if (field.eachItem) {//这类控都自定义了取值方法，修改支持CheckboxGroup控件
				value = [];
				field.eachItem(function(item){
					value.push(item.getValue());
				});
			}*/
			record.set(f.name, value);
		}
	}, this);
	record.endEdit();
	return this;
};

/**
 * 新增方法：保证修改字段值后不标记为脏数据。
 **/
Ext.form.Field.prototype.osetValue = function(value){
	this.setValue(value);
	this.originalValue = value;
};

/**
 * ext-3.3.1
 * 修改方法：支持在选择日期的时候，自动带上时间值，设置样式：Y-m-d H:i，就支持显示时间。
 **/
Ext.form.DateField.prototype.onSelect = function(m, d){
	if (Ext.isDate(d)) {//---add by tony
		var curd = new Date();
		d.setHours(curd.getHours(), curd.getMinutes(), curd.getSeconds());
	}//---add by
	this.setValue(d);
	this.fireEvent('select', this, d);
	this.menu.hide();
};

/**
 * ext-3.3.1
 * 修改方法：如果是样式Y-m，在显示日期值取的是当前日，应该取1号
 **/
Ext.form.DateField.prototype.parseDate = function(value) {
	if(!value || Ext.isDate(value)){
		return value;
	}
	
	if (!Ext.isEmpty(value) && value.length == 7 && this.format == 'Y-m') {//---add by tony
		return Date.parseDate(value+'-01', 'Y-m-d');
	}//---add by

	var v = this.safeParse(value, this.format),
		af = this.altFormats,
		afa = this.altFormatsArray;

	if (!v && af) {
		afa = afa || af.split("|");

		for (var i = 0, len = afa.length; i < len && !v; i++) {
			v = this.safeParse(value, afa[i]);
		}
	}
	return v;
},

/**
 * 修改属性：FormLayout的标签描述不添加':'符号。
 **/
Ext.layout.FormLayout.prototype.labelSeparator = '';

/**
 * 修改属性：NumberField缺省不允许输入负数。
 **/
//Ext.form.NumberField.prototype.allowNegative = false;

/**
 * 修改属性：NumberField聚焦则全选。
 **/
Ext.form.NumberField.prototype.selectOnFocus = true;

/**
 * 修改属性：TextField聚焦则全选。
 **/
Ext.form.TextField.prototype.selectOnFocus = true;

/**
 * 修改属性：BasicForm加载数据后设置为初始值。
 **/
Ext.form.BasicForm.prototype.trackResetOnLoad = true;

/**
 * 修改属性：Component状态支持缺省值为否，设置所有控件都不保存状态。
 **/
Ext.Component.prototype.stateful = false;

/**
 * 修改属性：对话框的缺省标题。
 **/
/*Ext.Window.prototype.iconCls = 'eb_win';*/

/**
 * 修改属性：对话框的缺省不带阴影。
 **/
Ext.Window.prototype.shadow = false;

/**
 * ext-3.3.1
 * 修改方法：处理重复打开combogrid页面时报下面的错误。
 **/
Ext.layout.MenuLayout.prototype.isValidParent = function(c, target) {
	var el = c.el.up('li.x-menu-list-item', 5);
	if (Ext.isEmpty(el)) return false;//add by tony
	return el.dom.parentNode === (target.dom || target);
};

/**
 * ext-3.3.1
 * 修改方法：如果是只读，则需要添加只读样式。
 **/
Ext.form.Field.prototype.setReadOnly = function(readOnly){
	if(this.rendered && this.el){
		this.el.dom.readOnly = readOnly;
		if (readOnly) {//---add by tony
			this.el.addClass('x-field-only');
		} else {
			this.el.removeClass('x-field-only');
		}//---add by
	}
	this.readOnly = readOnly;
};
Ext.form.TriggerField.prototype.setReadOnly = function(readOnly){
	if(readOnly != this.readOnly && this.el){
		if (readOnly) {//---add by tony
			this.el.addClass('x-field-only');
		} else {
			this.el.removeClass('x-field-only');
		}//---add by
		this.readOnly = readOnly;
		this.updateEditState();
	}
};

/**
 * ext-3.3.1
 * 修改方法：如果是只读，则需要添加只读样式。
 **/
Ext.form.TriggerField.prototype.updateEditState = function(){
	if(this.rendered && this.el){
		if (this.readOnly) {
			this.el.dom.readOnly = true;
			this.el.addClass('x-field-only');//add by tony.tan
			this.el.addClass('x-trigger-noedit');
			this.mun(this.el, 'click', this.onTriggerClick, this);
			//this.trigger.setDisplayed(false);
			this.emptyText = '';//add by tony.tan
		} else {
			if (!this.editable) {
				this.el.dom.readOnly = true;
				this.el.addClass('x-trigger-noedit');
				this.mon(this.el, 'click', this.onTriggerClick, this);
			} else {
				this.el.dom.readOnly = false;
				this.el.removeClass('x-field-only');//add by tony.tan
				this.el.removeClass('x-trigger-noedit');
				this.mun(this.el, 'click', this.onTriggerClick, this);
			}
			//this.trigger.setDisplayed(!this.hideTrigger);
		}
		//del by tony.tan 它会造成控件很窄
		//this.onResize(this.width || this.wrap.getWidth());
	}
};

/**
 * ext-3.3.1
 * 修改方法：处理日期控件的按钮只读后还可以选择的问题
 **/
Ext.form.DateField.prototype.onTriggerClick = function(){
	if(this.readOnly || this.disabled){//modify by tony.tan add 'this.readOnly || '
		return;
	}
	if(this.menu == null){
		this.menu = new Ext.menu.DateMenu({
			hideOnClick: false,
			focusOnSelect: false
		});
	}
	this.onFocus();
	Ext.apply(this.menu.picker,  {
		minDate : this.minValue,
		maxDate : this.maxValue,
		disabledDatesRE : this.disabledDatesRE,
		disabledDatesText : this.disabledDatesText,
		disabledDays : this.disabledDays,
		disabledDaysText : this.disabledDaysText,
		format : this.format,
		showToday : this.showToday,
		startDay: this.startDay,
		minText : String.format(this.minText, this.formatDate(this.minValue)),
		maxText : String.format(this.maxText, this.formatDate(this.maxValue))
	});
	this.menu.picker.setValue(this.getValue() || new Date());
	this.menu.show(this.el, "tl-bl?");
	this.menuEvents('on');
};

/**
 * 修改日期字段控件的样式，显示居中。
 **/
Ext.form.DateField.prototype.fieldClass = 'x-field-d';

/**
 * 修改数字字段控件的样式，显示居右。
 **/
Ext.form.NumberField.prototype.fieldClass = 'x-field-n';

/**
 * ext-3.3.1
 * 修改方法：添加F1 -- F12为特殊键，用于处理字段的帮助信息CTRL+F1。
 **/
Ext.EventObjectImpl.prototype.isSpecialKey = function(){
   var k = this.normalizeKey(this.keyCode);
   return (this.type == 'keypress' && this.ctrlKey) ||
   this.isNavKeyPress() ||
   (k == this.BACKSPACE) || // Backspace
   (k >= 16 && k <= 20) ||	// Shift, Ctrl, Alt, Pause, Caps Lock
   (k >= 44 && k <= 46) ||	// Print Screen, Insert, Delete
   (k >= 112 && k <= 123);	// F1 -- F12
};
	
/**
 * 新增方法：用来解决RowEditor类中这行ed = c.getEditor(); is not a function的错误
 **/
Ext.grid.RowSelectionModel.prototype.getEditor = Ext.emptyFn;

/**
 * ext-3.3.1
 * 问题：如果int，float类型的值为null时，在record中取到后为0；
 * 分析：在Ext.data.JsonReader.extractValues中转换值时改变了，分析是Types.INT FLOAT的两个方法转换了，增加了this.useNull判断
 *       实际上是判断field对象的属性useNull，所以增加下面的一行，保留数值可以显示null
 *		 如果设置useNull值，会造成输出值为null，在grid编辑中还会出现异常，所以直接替换INT\FLOAT这两个方法
 **/
//Ext.data.Field.prototype.useNull = true;
Ext.data.Types.INT = {
	convert: function(v){
		return v !== undefined && v !== null && v !== '' ?
			parseInt(String(v).replace(Ext.data.Types.stripRe, ''), 10) : '';//(this.useNull ? null : 0) --> ''
	},
	sortType: Ext.data.SortTypes.none,
	type: 'int'
};
		
Ext.data.Types.FLOAT = {
	convert: function(v){
		return v !== undefined && v !== null && v !== '' ?
			parseFloat(String(v).replace(Ext.data.Types.stripRe, ''), 10) : '';//(this.useNull ? null : 0) --> ''
	},
	sortType: Ext.data.SortTypes.none,
	type: 'float'
};
//在editgrid，如果可编辑字段为date类型，且值为空，则点击可编辑单元，光标离开时会给脏标记，
//是因为startValue=null，而当前值为空，所以值改变了。特修改如下：如果值为空，则返回''
Ext.data.Types.DATE = {
	convert: function(v){
		var df = this.dateFormat;
		if(!v){
			return '';//null -->''
		}
		if(Ext.isDate(v)){
			return v;
		}
		if(df){
			if(df == 'timestamp'){
				return new Date(v*1000);
			}
			if(df == 'time'){
				return new Date(parseInt(v, 10));
			}
			return Date.parseDate(v, df);
		} else {
			//调整后台输出的日期对象为字符串，如: 2016-04-01 12:02:01；支持JSON标准格式
			if (Ext.isString(v) && v.length == 19) {
				return Date.parseDate(v, 'Y-m-d H:i:s');
			}
		}
		var parsed = Date.parse(v);
		return parsed ? new Date(parsed) : '';//null -->''
	},
	sortType: Ext.data.SortTypes.asDate,
	type: 'date'
};

/**
 * ext-3.3.1
 * 新增属性：添加24小时制时间格式校验
 **/
Ext.apply(Ext.form.VTypes, {
	//24小时制时间格式校验
    time24: function(val, field) {
		var time24Test = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/i;
        return time24Test.test(val);
    },
    //错误提示
    time24Text: jx.base.timetext	//'无效时间格式，格式如："22:34"'
});

/**
 * 新增方法：给Record对象添加一个取数字的方法。
 **/
Ext.data.Record.prototype.getNum = function(name){
	var value = this.data[name];
	if (value == null || value.length == 0) return 0;
		
	return parseFloat(value);
};
Ext.data.Record.prototype.set = function(name, value){
	//add by tony.tan 处理json数据用字符串赋值给date字段的问题
	//---------------------------------------------------------
	if (this.fields) {
		var f = this.fields.get(name);
		if (f && f.type.type == 'date') {
			if (Ext.isString(value) && value.length == 19) {
				value = Date.parseDate(value, 'Y-m-d H:i:s');
			}
		}
	}
	//---------------------------------------------------------
    var encode = Ext.isPrimitive(value) ? String : Ext.encode;
    if(encode(this.data[name]) == encode(value)) {
        return;
    }        
    this.dirty = true;
    if(!this.modified){
        this.modified = {};
    }
    if(this.modified[name] === undefined){
        this.modified[name] = this.data[name];
    }
    this.data[name] = value;
    if(!this.editing){
        this.afterEdit();
    }
};

//如果是日期对象赋值，则会显示错误字符串
Ext.form.Hidden.prototype.setValue = function(v){
	if (!Ext.isEmpty(v) && Ext.isDate(v)) {
		v = v.dateFormat('Y-m-d H:i:s');
	}
	
	this.value = v;
    if(this.rendered){
        this.el.dom.value = (Ext.isEmpty(v) ? '' : v);
        this.validate();
    }
    return this;
};

/**
 * ext-3.3.1
 * 修改方法：修改取字符长度的方法，如果是汉字则是两个字节。
 **/
Ext.form.TextField.prototype.getErrors = function(value) {
	var errors = Ext.form.TextField.superclass.getErrors.apply(this, arguments);
	
	value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());        
	
	if (Ext.isFunction(this.validator)) {
		var msg = this.validator(value);
		if (msg !== true) {
			errors.push(msg);
		}
	}
	
	if (value.length < 1 || value === this.emptyText) {
		if (this.allowBlank) {
			//if value is blank and allowBlank is true, there cannot be any additional errors
			return errors;
		} else {
			if (!this.isBlankCheck) {//add by tony.tan
				errors.push(this.blankText);
			}
		}
	}
	//modify by Tony.Tan
	if (!this.isBlankCheck && !this.allowBlank && (value.length < 1 || value === this.emptyText)) { // if it's blank
		errors.push(this.blankText);
	}
	
	//modify by Tony.Tan
	if (JxUtil.strlen(value) < this.minLength) {
		errors.push(String.format(this.minLengthText, this.minLength));
	}
	
	//modify by Tony.Tan
	if (JxUtil.strlen(value) > this.maxLength) {
		errors.push(String.format(this.maxLengthText, this.maxLength));
	}
	
	if (this.vtype) {
		var vt = Ext.form.VTypes;
		if(!vt[this.vtype](value, this)){
			errors.push(this.vtypeText || vt[this.vtype +'Text']);
		}
	}
	
	if (this.regex && !this.regex.test(value)) {
		errors.push(this.regexText);
	}
	
	return errors;
};

/**
 * ext-3.3.1
 * 增加方法：增加一种不检查必填项的校验方法
 **/
Ext.form.BasicForm.prototype.isValidBlank = function(){
	var valid = true;
	this.items.each(function(f){
		f.isBlankCheck = true; //add by tony.tan
	   if(!f.validate()){
		   valid = false;
	   }
	   delete f.isBlankCheck; //add by tony.tan
	});
	return valid;
};

/**
 * ext-3.3.1
 * 修改方法：在导航图设计器中添加“提交”事件，JxAttach.js
 * var formPanel = formTab.getComponent(0);执行时报items is null的错误
 **/
Ext.Container.prototype.getComponent = function(comp){
	if(Ext.isObject(comp)){
		comp = comp.getItemId();
	}
	//add by tony.tan
	if (this.items == null) return null;
	return this.items.get(comp);
};

/**
 * ext-3.3.1
 * 修改方法：设置form中的字段，回车跳转到下一个控件的效果
 **/
Ext.form.Field.prototype.afterRender = function(){
	Ext.form.Field.superclass.afterRender.call(this);
	this.initEvents();
	this.initValue();
	//add by tony.tan
	var fn = function(e, t){
		if (e.getKey() == e.ENTER) {
			var me = this;
			var fp = me.findParentByType('form');
			if (Ext.isEmpty(fp)) return;
			
			var items = fp.form.items;
			//记录第一个有效字段的位置、当前字段的位置、当前字段的下一个位置
			//必须记录位置，而不能记录控件f，不然循环结束后取不到真实控件
			var i = 0, first = -1, index = -1, next = -1;
			items.each(function(f){
				//textarea控件中回车是文字换行
				if (f.isFormField && f.rendered && f.name && 
					!f.isXType('hidden') && !f.isXType('textarea')) {
					if (first < 0) first = i;
					if (f.name == me.name) {
						index = i;
					} else {
						if (index >= 0) {
							next = i;
							return false;
						}
					}
				}
				i++;
			});
			//JxHint.hint(index+';'+next+';'+first);
			//如果找到了当前位置，当没有找到下一个有效位置，则取第一个位置
			if (index >= 0 && next < 0) next = first;
			if (next >= 0) {
				var fn = items.get(next);
				if (fn) fn.focus(true);
			}
		}
	};
	//回车进入下一控件的开关
	var isEnter = Jxstar.systemVar.edit__field__next;
	if (isEnter == '1') {
		this.mon(this.el, Ext.EventManager.getKeyEvent(), fn, this);
	}
};

/**
 * ext-3.3.1
 * 修改方法：修改表格行选状态时，回车跳转到下一个控件的效果
 **/
Ext.grid.RowSelectionModel.prototype.onEditorKey = function(field, e){
	var k = e.getKey(), 
		newCell, 
		g = this.grid, 
		last = g.lastEdit,
		ed = g.activeEditor,
		shift = e.shiftKey,
		ae, last, r, c;
	
	//回车键开关
	var isEnter = (Jxstar.systemVar.edit__field__next == '1');
	//针对单个表格可以关闭此效果
	if (g.isNextField != null) isEnter = g.isNextField;
	
	if (isEnter) {//is enter
		if(k == e.ENTER){//modify, ed.row --> last.row, last.col
			//e.stopEvent();
			//ed.completeEdit(); //ENTER is completeEdited
			if(shift){
				newCell = g.walkCells(last.row, last.col-1, -1, this.acceptsNav, this);
			}else{
				newCell = g.walkCells(last.row, last.col+1, 1, this.acceptsNav, this);
			}
		}else if(k == e.TAB){//modify
			e.stopEvent();//add
			ed.completeEdit();//add
			if(this.moveEditorOnEnter !== false){
				if(shift){
					newCell = g.walkCells(last.row - 1, last.col, -1, this.acceptsNav, this);
				}else{
					newCell = g.walkCells(last.row + 1, last.col, 1, this.acceptsNav, this);
				}
			}
		}
	} else {//is old
        if(k == e.TAB){
            e.stopEvent();
            ed.completeEdit();
            if(shift){
                newCell = g.walkCells(ed.row, ed.col-1, -1, this.acceptsNav, this);
            }else{
                newCell = g.walkCells(ed.row, ed.col+1, 1, this.acceptsNav, this);
            }
        }else if(k == e.ENTER){
            if(this.moveEditorOnEnter !== false){
                if(shift){
                    newCell = g.walkCells(last.row - 1, last.col, -1, this.acceptsNav, this);
                }else{
                    newCell = g.walkCells(last.row + 1, last.col, 1, this.acceptsNav, this);
                }
            }
        }
	}
	if(newCell){
		r = newCell[0];
		c = newCell[1];

		this.onEditorSelect(r, last.row);

		if(g.isEditor && g.editing){ // *** handle tabbing while editorgrid is in edit mode
			ae = g.activeEditor;
			if(ae && ae.field.triggerBlur){
				// *** if activeEditor is a TriggerField, explicitly call its triggerBlur() method
				ae.field.triggerBlur();
			}
		}
		g.startEditing(r, c);
	}
	
	//add by tony 按下ctrl+alt键则完成编辑状态，用于执行表格快捷键
	if (e.ctrlKey && e.altKey && ed) {
		ed.completeEdit();
	}
};

/**
 * ext-3.3.1
 * 修改方法：在firefox、chrome中点击表格cell时没聚焦editor
 **/
Ext.Editor.prototype.onShow = function(){
    this.el.show();
    if(this.hideEl !== false){
        this.boundEl.hide();
    }
    if (Ext.isIE) {
    	this.field.show().focus(false, true);
    } else {
    	//add tony.tan 解决在firefox、chrome中点击表格cell没聚焦的问题
    	this.field.show().focus(false, 100);
    }
    this.fireEvent("startedit", this.boundEl, this.startValue);
};

/**
 * ext-3.3.1
 * 添加控件：工具栏中的支持快捷键设置的控件
 **/
Ext.ux.ToolbarKeyMap = Ext.extend(Object, (function() {
    var kb, owner, mappings;

    var addKeyBinding = function(c) {
        if (kb = c.keyBinding) {
            delete c.keyBinding;
            if (!kb.fn && c.handler) {
                kb.fn = function(k, e) {
                    e.preventDefault();
                    e.stopEvent();
                    c.handler.call(c.scope, c, e);
                }
            }
            mappings.push(kb);
        }
        if ((c instanceof Ext.Button) && c.menu) {
            c.menu.cascade(addKeyBinding);
        }
    };

    var findKeyNavs = function() {
        delete this.onRender;
        if (owner = this.ownerCt) {
            mappings = [];
            this.cascade(addKeyBinding);
            if (!owner.menuKeyMap) {
                owner.menuKeyMap = new Ext.KeyMap(owner.el, mappings);
                owner.el.dom.tabIndex = 0;
            } else {
                owner.menuKeyMap.addBinding(mappings);
            }
        }
    };

    return {
        init: function(toolbar) {
            toolbar.onRender = toolbar.onRender.createSequence(findKeyNavs);
            toolbar.doLayout = toolbar.doLayout.createSequence(findKeyNavs);
        }
    };
})());

/************* 为实现表单 NumberField 的千分位现实效果 *************/
Ext.form.NumberField.prototype.parseValue = function(value) {
	value = String(value).replace(/,/g, '');//去格式化
	value = parseFloat(String(value).replace(this.decimalSeparator, "."));
	return isNaN(value) ? '' : value;
};
Ext.form.NumberField.prototype.setValue = function(v) {
	v = String(v).replace(/,/g, '');//会重复赋值，需要去格式化
	v = this.fixPrecision(v);
	v = Ext.isNumber(v) ? v : parseFloat(String(v).replace(this.decimalSeparator, "."));
	v = isNaN(v) ? '' : String(v).replace(".", this.decimalSeparator);
	if (this.renderer) {//加格式化
		v = this.renderer(v);
	}
	return Ext.form.NumberField.superclass.setValue.call(this, v);
};
Ext.form.NumberField.prototype.getErrors = function(value) {
	var errors = Ext.form.NumberField.superclass.getErrors.apply(this, arguments);
	
	value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());
	
	if (value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
		 return errors;
	}
	
	value = String(value).replace(this.decimalSeparator, ".");

	value = String(value).replace(/,/g, '');//去格式化
	
	if(isNaN(value)){
		errors.push(String.format(this.nanText, value));
	}
	
	var num = this.parseValue(value);
	
	if (num < this.minValue) {
		errors.push(String.format(this.minText, this.minValue));
	}
	
	if (num > this.maxValue) {
		errors.push(String.format(this.maxText, this.maxValue));
	}
	//如果录入了汉字，就清空
	if (errors && errors.length > 0) this.setValue('');
	
	return errors;
};

JxExt.bbsurl = function(keyid) {
	var imgurl = "./fileAction.do?funid=sys_attach&pagetype=editgrid&eventcode=down&nousercheck=1&dataType=byte&keyid="+keyid;
	return imgurl;
};

//不用超链接的href，则采用click是防止页面跳转，退出系统
JxExt.bbsfile = function(a) {
	var iframe = document.getElementById('frmhidden');
	iframe.src = JxExt.bbsurl(a.id);
};

//给HtmlEditor控件添加图片的方法
ImgHtmlEditor = Ext.extend(Ext.form.HtmlEditor, {
	enableAlignments : false,
	enableColors : false,
	enableFont : false,
	enableFontSize : false,
	enableFormat : false,
	enableLinks : false,
	enableLists : false,
	enableSourceEdit: true,
	//fileType 文件类型：1 图片、0 文件
	addImage : function(fileType) {
		var editor = this;
		var fileForm = editor.findParentByType('form');
		if (Ext.isEmpty(fileForm)) {
			return;
		}
		var form = fileForm.getForm();
		var define = fileForm.formNode.define;
		var dataFunId = define.nodeid;
		var tableName = define.tablename;
		var dataId = form.get(define.pkcol);
		
		var formItems = [{
			xtype: 'fileuploadfield',
			useType: 'file',
			maxLength: 200,
			fieldLabel: jx.event.selfile,//'选择文件',
			name: 'attach_path',
			buttonText: '',
			buttonCfg: {
				iconCls: 'upload_icon'
			},
			listeners:{
				fileselected: function(f, path) {
					var len = path.length;
					if (len > 0) {
						var pos = path.lastIndexOf('\\');
						if (pos >= 0) {
							path = path.substr(pos+1, len);
						}
					}
					imgform.getForm().findField('attach_name').setValue(path);
				}
			}
		},{
			xtype: 'hidden',
			name: 'attach_name'
		}];
		var imgform = new Ext.form.FormPanel({
			layout:'form', 
			labelAlign:'right',
			labelWidth:80,
			border:false, 
			baseCls:'x-plain',
			autoHeight: true,
			bodyStyle: 'padding: 20px 10px 0 10px;',
			defaults: {
				anchor: '95%',
				allowBlank: false,
				msgTarget: 'side'
			},
			items : formItems
		});

		var win = new Ext.Window({
			title : jx.plet.text18,//"上传文件",
			width : 400,
			height : 170,
			modal : true,
			closeAction:'close',
			items:[imgform],
			
			buttons: [{
				text : jx.bus.text48,//'上传',
				type : 'submit',
				handler : function() {
					var form = imgform.form;
					//上传参数
					var params = 'funid=sys_attach&pagetype=editgrid';
						params += '&attach_field=&dataid='+ dataId +'&datafunid='+ dataFunId;
						params += '&eventcode=create';
					
					//上传成功后关闭窗口并刷新数据
					var hdCall = function(data) {
						if (Ext.isEmpty(data)) {
							JxHint.alert(jx.util.attfa);//'文件上传失败！'
							return;
						}
						var html;
						if (fileType == '1') {//上传图片
							html = '<div align="center"><img src="'+ JxExt.bbsurl(data.attachId) +'" height="400" width="640"></div>';
						} else {//上传文件
							html = '<div style="padding:2px 30px"><a id="'+ data.attachId +'" onclick="return JxExt.bbsfile(this);">'+ form.get('attach_name') +'</a></div>';
						}
						editor.focus();
						editor.insertAtCursor(html);
						
						win.close();
					};
					//上传附件
					Request.fileRequest(form, params, hdCall);
				}
			}, {
				text : jx.base.close,//'关闭',
				handler : function() {
					win.close();
				}
			}]
		});
		win.show();
	},
	
	createToolbar : function(editor) {
        ImgHtmlEditor.superclass.createToolbar.call(this, editor);
        this.tb.insertButton(0, {
					iconCls : "fa-image blue",
					tooltip:jx.plet.text16,//'添加图片',
                    handler : function(){this.addImage('1');},
                    scope : this
                });
		this.tb.insertButton(0, {
					iconCls : "fa-paperclip blue",
					tooltip:jx.plet.text17,//'添加文件',
                    handler : function(){this.addImage('0');},
                    scope : this
                });
        //this.tb.getComponent(0).hide();
        //this.tb.getComponent(1).hide();
    },
   
    initEditor : function() {
    	ImgHtmlEditor.superclass.initEditor.call(this);
    	this.getDoc().body.style.lineHeight = '28px';//设置文字行高
    }
});
Ext.reg('imghtmleditor', ImgHtmlEditor);

//处理LODOP设计器隐藏，现实对话框的效果
Ext.Window.prototype.show = function(animateTarget, cb, scope){
	if (window.LODOP_SHOW) {
		window.LODOP_SHOW.style.visibility = 'hidden';
	}
	//------------------

	if(!this.rendered){
		this.render(Ext.getBody());
	}
	if(this.hidden === false){
		this.toFront();
		return this;
	}
	if(this.fireEvent('beforeshow', this) === false){
		return this;
	}
	if(cb){
		this.on('show', cb, scope, {single:true});
	}
	this.hidden = false;
	if(Ext.isDefined(animateTarget)){
		this.setAnimateTarget(animateTarget);
	}
	this.beforeShow();
	if(this.animateTarget){
		this.animShow();
	}else{
		this.afterShow();
	}
	return this;
};
	
Ext.Window.prototype.doClose = function(){
	if (window.LODOP_SHOW) {
		window.LODOP_SHOW.style.visibility = 'visible';
	}
	//------------------
	this.fireEvent('close', this);
	this.destroy();
};

Ext.Button.buttonTemplate = new Ext.Template(//add by tony.tan
	'<table id="{4}" cellspacing="0" class="x-btn {3}"><tbody class="{1}">',
	'<tr><td class="x-btn-mc"><em class="{2}" unselectable="on"><button type="{0}"></button></em></td></tr>',
	'</tbody></table>');

Ext.Button.prototype.setIconClass = function(cls){
	this.iconCls = cls;
	//add by tony.tan
	if(this.el && cls){
		var c = 'x-fa fa ' + cls;
		var t = this.getText();
		if (!t || t.length == 0) {//如果没有标题就用特殊样式，并去掉button中间的空格
			c = 'x-icon-only fa ' + cls;
			this.btnEl.update('');
		}
		this.btnEl.insertHtml('afterBegin', '<i class="'+c+'"></i>');
		this.setButtonClass();
	}
    /*if(this.el){
        this.btnEl.dom.className = '';
        this.btnEl.addClass(['x-btn-text', cls || '']);
        this.setButtonClass();
    }*/
	return this;
};
Ext.Panel.prototype.setIconClass = function(cls){
	var istog = (cls == 'x-tool-toggle');
	var old = this.iconCls;
	this.iconCls = cls;
	if(this.rendered && this.header){
		if(this.frame){
			this.header.addClass('x-panel-icon');
			this.header.replaceClass(old, this.iconCls);
		}else{
			var hd = this.header, img;
				//img = hd.child('img.x-panel-inline-icon');
				//add by tony.tan
				if (istog) {
					img = hd.child('button.x-tool');
				} else {
					img = hd.child('div.x-tool');
				}
			if(img){
				Ext.fly(img).replaceClass(old, this.iconCls);
			}else{
				var hdspan = hd.child('span.' + this.headerTextCls);
				if (hdspan && (!istog || (istog && this.collapsible))) {
					var cfg = {tag: "div", cls: "x-panel-inline-icon", html:"<i class='fa "+ this.iconCls +"'></i>"};//add by tony.tan
					if (istog) {
						cfg = {tag: "button", cls: "x-tool x-panel-inline-icon", html:"<i class='fa "+ this.iconCls +"'></i>"};//add by tony.tan
					}
					var n = Ext.DomHelper.insertBefore(hdspan.dom, cfg //add by tony.tan
						//{tag:'img', alt: '', src: Ext.BLANK_IMAGE_URL, cls:'x-panel-inline-icon '+this.iconCls}
					);
					//add by tony.tan, 如果用click在字段回车时会触发
					if (istog) {
						Ext.get(n).on('mousedown', this.toggleCollapse, this);
						setTimeout(function(){//删除自动创建的toggle按钮
							var t = hd.child('button.x-tool>i.toggle');
							if (t && t.dom.parentNode) Ext.get(t.dom.parentNode).remove();
						}, 500);
					}
				}
			 }
		}
	}
	this.fireEvent('iconchange', this, cls, old);
	//add by tony.tan
	/*this.header.on('click', function(){
		if (this.collapsed) {
			this.expand(true);
		} else {
			this.collapse(true);
		}
	}, this);*/
};

Ext.form.TriggerField.prototype.onRender = function(ct, position){
	this.doc = Ext.isIE ? Ext.getBody() : Ext.getDoc();
	Ext.form.TriggerField.superclass.onRender.call(this, ct, position);

	this.wrap = this.el.wrap({cls: 'x-form-field-wrap x-form-field-trigger-wrap'});
	this.trigger = this.wrap.createChild(this.triggerConfig ||
			//{tag: "img", src: Ext.BLANK_IMAGE_URL, alt: "", cls: "x-form-trigger " + this.triggerClass}
			{tag: "a", cls: "x-form-trigger", html:"<i class='fa "+ this.triggerClass +"'></i>"}//add by tony.tan
			);
	this.initTrigger();
	if(!this.width){
		this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
	}
	this.resizeEl = this.positionEl = this.wrap;
};

Ext.Panel.prototype.toolTemplate = new Ext.XTemplate(
		'<tpl if="id==\'space1\'">',
			'<div class="x-tool-space">&#160;</div>',
		'</tpl>',
		'<tpl if="id==\'close\'">',
			'<button class="x-tool" type="button"><i class="fa x-tool-{id}"></i></button>',
		'</tpl>',
		'<tpl if="(id!=\'space1\' && id!=\'close\')">',
			//'<div class="x-tool x-tool-{id}">&#160;</div>'
			'<button class="x-tool" type="button" righttype="{rightType}" eventcode="{eventCode}"><i class="fa {id}"></i></button>',
		'</tpl>'
	);

Ext.TabPanel.prototype.itemTpl = new Ext.Template(
		'<li class="{cls}" id="{id}">',
		'<a class="x-tab-strip-inner"><span class="x-tab-strip-text {iconCls}">{text}</span></a>',
		'</li>'
	);
	
Ext.Panel.prototype.border = false;
Ext.menu.Menu.prototype.shadow = false;

/******************************* 保存用户自定义表格列状态 *****************************/

(function(){
	//保存表格标题的位置与宽度
	var saveColumnState = function(g) {
		var state = g.getState();
		var cm = g.colModel;
		var cs = state.columns;
		var content = '';
		if(cs){
			for(var i = 0, len = cs.length; i < len; i++){
				var s = cs[i];
				var c = cm.getColumnById(s.id);
				if(c){
					if (!(c.dataIndex) || c.dataIndex.length == 0) continue;
					content += '{'
					content += 'n:' + c.dataIndex + ',';
					content += 'x:' + i + ',';
					content += 'w:' + s.width + ',';
					content += 'h:' + (s.hidden?'true':'false');
					content += '}-';
				}
			}
			if (cs.length > 0) {
				content = content.substring(0, content.length-1);
			}
		}
		return content;
	};
	
	//把状态信息字符串转换为对象
	var getGridState = function(state) {
		var cs = state.split('-');//n:dataIndex, w:width, h:hidden, x:index
		var s, c, d, os = [cs.length];
		for(var i = 0, len = cs.length; i < len; i++){
			s = cs[i].substring(1, cs[i].length-1);
			c = s.split(',');
			var o = {};
			for(var j = 0; j < c.length; j++){
				d = c[j];
				o[d.substr(0, 1)] = d.substr(2, d.length-2);
			}
			os[i] = o;
		}
		return os;
	};
		
	//加载表格标题的位置与宽度
	var applyColumnState = function(g, state) {
		if (!g || !state) return;
		var cs = getGridState(state);//n:dataIndex, w:width, h:hidden, x:index
		var cm = g.colModel, s, c, x;
		for(var i = 0, len = cs.length; i < len; i++){
			s = cs[i];
			c = cm.findColumnIndex(s.n);
			if (c > -1) {
				cm.setHidden(c, (s.h=='true'));
				cm.setColumnWidth(c, parseInt(s.w));
				x = parseInt(s.x);
				//alert(c+'//'+x+'//'+s.n);
				if(x != c){
					cm.moveColumn(c, x);
				}
			}
		}
	};
	
	/**
	 * 绑定列移动、调整宽度事件，保存状态信息；在表格对象呈现时再加载状态信息。
	 **/
	JxExt.gridStateEvent = function(g) {
		var fid = function(isold){
			var gn = g.gridNode;
			var id = gn.nodeId+'@@'+gn.pageType+'@@grid';
			if (isold) id += '_old';
			return id;
		};
		//列位置调整时保存状态信息
		var fn = function(){
			var ct = saveColumnState(g);
			Ext.util.Cookies.set(fid(), ct, (new Date()).add(Date.MONTH, 100));
		};
		g.on('columnmove', fn);
		g.on('columnresize', fn);
		var oldstate = '';
		//表格呈现时加载列位置状态
		var fx = function(){
			var ct = Ext.util.Cookies.get(fid());
			if (ct && ct.length > 0) {
				//保存原来的效果
				oldstate = saveColumnState(g);
				//应用表格自定义
				applyColumnState(g, ct);
			}
		};
		g.on('render', fx);
		//显示设置按钮
		g.on('headerclick', function(g, index){
			var id = g.colModel.getColumnId(index);
			if (id != 'numberer') return;
			
			var addlock = function(){
				if (!g.locker) return [];
			
				var cols = g.getColumnModel().config;
				var c, its = [];
				
				its.push({text:'解锁列', handler:function(){
					var l = g.locker;
					if (!l) return;
					l.unlock();
				}}, '-');
				
				var fn = function(){
					var id = this.colid;
					var l = g.locker;
					if (!l) return;
					//如果是同一列，则不用重新锁定
					if (l.lockColId == id) return;
					
					l.unlock();
					l.lock(id);
				};
				//支持锁定：第3显示列 - 第6显示列
				for (var i = 0, j = 0; i < cols.length; i++) {
					c = cols[i];
					if (c && !c.hidden) {
						j++;
						if (j >= 3 && j <= 6) {
							var s = c.header.replace('*', '');
							var t = '锁定列-' + s;
							its.push({text:t, colid:c.id, handler:fn});
						}
					}
				}
				its.push('-');
				
				return its;
			};

		
			var dv = g.getView().getHeaderCell(index);
			var dx = Ext.get(dv);
			if (!g.setmenu) {
				var items = addlock();
				var its = [
					{text:'恢复列位置', handler:function(){
						Ext.util.Cookies.set(fid(), '');
						Ext.util.Cookies.clear(fid());
						//加载原设置
						if (oldstate.length > 0) {
							applyColumnState(g, oldstate);
						}
					}}
				];
				items = items.concat(its);
				g.setmenu = new Ext.menu.Menu({items:items});
			}
			g.setmenu.showAt([dx.getX()+15, dx.getY()+30]);
		});
	};
	
})();

/******************************* 表格列锁定控件 *****************************/
GridLocker = function(config){
	this.grid = config.grid;
	
	this.lockBody = null;//模拟锁定层
	this.lockInner = null;//内容区域，滑动区
	this.scrollBar = null;//模拟滚动条
	
	this.locked = false;//当前是否锁定列状态
	this.lockNum = 0;//锁定显示列数
	this.lockColId = null;//锁定列ID
	
	var grid = config.grid;
	//重建锁定区
	var relock = function(g){
		var l = g.locker;
		if (l && l.locked){
			var ln = l.lockColId;
			l.unlock();
			l.lock(ln);
		}
	};
	//调整锁定区的位置与大小
	grid.on('resize', relock);
	grid.getStore().on('load', function(){
		relock(grid);
	});
	
	//上下滚动同时滚动模拟层
	var scrollFn = function(scrollLeft, scrollTop){
		var l = this.locker;
		if (l && l.locked){
			l.lockInner.scrollTo('top', scrollTop);
		}
	};
	grid.on('bodyscroll', scrollFn);
};
GridLocker.prototype.getLockWidth = function(colid){
	var w = 0, c, j = 0;
	var cols = this.grid.getColumnModel().config;
	//根据指定列ID来计算宽度
	for (var i = 0; i < cols.length; i++) {
		c = cols[i];
		if (c.width && !c.hidden) {
			w += c.width;
			j++;
		}
		if (c.id == colid) {
			this.lockNum = j;
			return w;
		}
	}
};

GridLocker.prototype.copyHead = function(colIndex){
	var hd = this.grid.getView().innerHd;
	var tds = Ext.get(hd).query('td.x-grid3-hd');
	if (tds.length == 0) return;
	
	var ct = this.lockBody.child('tr.x-grid3-hd-row');
	var cols = this.grid.getColumnModel().config;
	var ht = '', c, w = 0;
	for (var i = 0, j = 0; j < colIndex; i++) {
		c = cols[i];
		ht += tds[i].outerHTML;
		if (c && c.width && !c.hidden) {
			w += c.width;
			j++;
		}
	}
	ct.update(ht);
	//设置table宽度保证标题不晃动
	var t = ct.up('table', 2);
	var wb = this.lockBody.getWidth() - 0.6;
	t.setWidth(wb);
};
GridLocker.prototype.copyRow = function(){
	var ct = this.grid.getView().mainBody;
	var ht = ct.dom.innerHTML;
	this.lockInner.update(ht);
	//标记序号，check选择用
	var rows = this.lockInner.dom.childNodes;
	for (var i = 0; i < rows.length; i++) {
		rows[i].rowIndex = i;
	}
};
GridLocker.prototype.lock = function(colId){
	if (this.locked) return;
	this.locked = true;
	this.lockColId = colId;
	
	var me = this;
	var grid = this.grid;
	var lockWidth = this.getLockWidth(colId);
	
	if (!this.lockBody) {
		var ct = grid.body;
		var buf = [
				'<div class="x-grid3-header">',
					'<div class="x-grid3-header-inner">',
						'<div class="x-grid3-header-offset">',
							'<table style="table-layout: fixed;" cellspacing="0" cellpadding="0" border="0">',
								'<thead><tr class="x-grid3-hd-row"></tr></thead>',
							'</table>',
						'</div>',
					'</div>',
                '</div>',
                '<div class="x-grid3-body">',
                '</div>'
			];
		var cf = {tag:'div', cls:'x-grid3-lockdiv', html:buf.join('')};
		var lb = ct.createChild(cf);
		lb.setHeight(grid.body.getHeight());
		lb.setWidth(lockWidth);
		this.lockBody = lb;
		
		//设置内容区的高度，这样滑动才有效果
		var iner = this.lockBody.down('div.x-grid3-body');
		iner.setHeight(grid.body.getHeight()-53);
		this.lockInner = iner;
		//锁定区光标移动时触发事件
		var v = grid.getView();
		this.lockInner.on({
                mouseover: function(e, target){
					v.onRowOver(e, target);
				},
                mouseout : function(e, target){
					v.onRowOut(e, target);
				}
            });
		
		//拷贝标题
		this.copyHead(this.lockNum);
		//拷贝内容
		this.copyRow();
	}
	if (!this.scrollBar) {
		var ct = grid.body;
		var buf = ['<div class="x-scroll-leftdiv">',
                '</div>',
                '<div class="x-scroll-rightdiv">',
                    '<div class="x-scroll-rightbar"></div>',
                '</div>'];
		var cf = {tag:'div', cls:'x-grid3-scrollbar', html:buf.join('')};
		var sb = ct.createChild(cf);
		var w = grid.body.getWidth();
		var h = grid.body.getHeight();
		sb.setWidth(w);
		sb.setTop((h-16)+'px');
		this.scrollBar = sb;
		
		//滑块左占位区
		var left = sb.down('div.x-scroll-leftdiv');
		left.setWidth(lockWidth);
		//滑块右占位区
		var right = sb.down('div.x-scroll-rightdiv');
		var rw = w - lockWidth;
		right.setWidth(rw);
		
		//因为DD.onDrag事件总是造成滑开丢失，所以用系统滑块
		var gv = grid.getView();
		var cwd = gv.mainBody.getWidth() - lockWidth;
		var sbar = sb.child('div.x-scroll-rightbar');
		if (rw < cwd) {
			//设置滑动块的宽度为真实文档宽度，用系统滚动条触发文档滚动
			sbar.setWidth(cwd);
			right.on('scroll', function(e){
				var sl = right.dom.scrollLeft;
				gv.scroller.scrollTo('left', sl);
			});
		}
		
	}
	
	//设置模拟层的初始滚动位置
	var top = this.grid.body.getScroll().top;
	this.lockInner.scrollTo('top', top);
};
GridLocker.prototype.unlock = function(){
	var grid = this.grid;
	this.locked = false;
	this.lockNum = 0;
	this.lockColId = null;
	this.lockInner = null;
	
	if (this.lockBody) {
		this.lockBody.remove();
		this.lockBody = null;
	}
	if (this.scrollBar) {
		this.scrollBar.remove();
		this.scrollBar = null;
	}
};
//------------------------ 同步行选择与滑动的光标效果 -----------------------------
var _updateLockRowCls = function(g, rowId, method, cls){
	var l = g.locker;
	if (l && l.locked){
		var rows = l.lockInner.dom.childNodes;
		Ext.fly(rows[rowId])[method](cls);
	}
};
// private
Ext.grid.GridView.prototype.addRowClass = function(rowId, cls) {
	var row = this.getRow(rowId);
	if (row) {
		this.fly(row).addClass(cls);
		_updateLockRowCls(this.grid, rowId, 'addClass', cls);
	}
};
// private
Ext.grid.GridView.prototype.removeRowClass = function(rowId, cls) {
	var row = this.getRow(rowId);
	if (row) {
		this.fly(row).removeClass(cls);
		_updateLockRowCls(this.grid, rowId, 'removeClass', cls);
	}
}