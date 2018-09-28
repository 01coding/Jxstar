/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 数据列表选择控件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

JxLists = function(config){
    config = config || {};
	if (config.isSelect == null) config.isSelect = true;
	
	Ext.apply(this, config);
};

Ext.apply(JxLists.prototype, {
    /**
     * @cfg {boolean} isSelect
     * 是否为双向选择控件，缺省为true
     */

    /**
     * @cfg {[['value','text'],['value','text'],...]} leftData
     * 左边列表的数据，第1个为字段名，第2个位字段标题，缺省为[]
     */
	 
    /**
     * @cfg {[['value','text'],['value','text'],...]} rightData
     * 左边列表的数据，缺省为[]
     */
	 
    /**
     * @cfg {[]} leftHeader
     * 左边列表的数据标题，缺省为'数据字段'
     */
	 
    /**
     * @cfg {[]} rightHeader
     * 左边列表的数据标题，缺省为'已选字段'
     */
	 
    /**
     * @cfg {Ext.ListView} lsLeft
     * 左边的数据列表控件
     */
	
    /**
     * @cfg {Ext.ListView} lsRight
     * 右边的数据列表控件
     */
	 
    /**
     * @cfg {Ext.Panel} lsCenter
     * 中间的分隔栏
     */
	
    /**
     * 显示选择列表控件
     */
	render: function() {
		var self = this;
		//构建结果集
		var dsLeft = new Ext.data.ArrayStore({
			data: self.leftData || [],
			fields: ['value','text']
		});
		var dsRight = new Ext.data.ArrayStore({
			data: self.rightData || [],
			fields: ['value','text']
		});
		
		//构建两个字段列表对象
		var lsLeft, lsRight, lsCenter;
		lsLeft = new Ext.ListView({
				region: 'west',
				width: self.leftWidth || 180,
				store: dsLeft,
				style: 'background-color:#fff;',
				disableHeaders: true,
				multiSelect: true,
				columns: [{
					header: self.leftHeader || jx.group.datafield,	//'数据字段'
					dataIndex: 'text'
				}],
				listeners: {dblclick: function(view, index, node, event){
					if (!self.isSelect) return false;
					var store = view.getStore();
					var record = store.getAt(index);
					
					lsRight.getStore().add(record);
					store.removeAt(index);
					
				}}
			});
					
		lsRight = new Ext.ListView({
				region: 'east',
				width: self.rightWidth || 180,
				store: dsRight,
				style: 'background-color:#fff;',
				disableHeaders: true,
				multiSelect: true,
				columns: [{
					header: self.rightHeader || jx.base.selfield,	//'已选字段'
					dataIndex: 'text'
				}],
				listeners: {dblclick: function(view, index, node, event){
					if (!self.isSelect) return false;
					var store = view.getStore();
					var record = store.getAt(index);
					
					lsLeft.getStore().add(record);
					store.removeAt(index);
				}}
			});
		
		var img = './lib/ext/ux/images/';
		lsCenter = this.lsCenter || new Ext.Panel({
				baseCls: 'x-plain',
				style: 'border-right:1px solid #ddd; border-left:1px solid #ddd;',
				region: 'center',
				border: false,
				layout: {
					type:'vbox',
					pack:'center',
					align:'center'
				},
				defaults:{margins:'0 0 10 0', cls:'x-btn-primary'},
				items:[{
					xtype:'button',
					tooltip: '选择全部字段',
					iconCls: 'fa-angle-double-right',
					handler: function() {
						var store = lsLeft.getStore();
						var records = store.getRange(0, store.getCount());
						lsRight.getStore().add(records);
						store.removeAll();
					}
				},{
					xtype:'button',
					tooltip: '右移选择的字段',
					iconCls: 'fa-angle-right',
					handler: function() {
						var records = lsLeft.getSelectedRecords();
						lsRight.getStore().add(records);
						for (var i = 0; i < records.length; i++) {
							lsLeft.getStore().remove(records[i]);
						}
					}
				},{
					xtype:'button',
					tooltip: '左移选择的字段',
					iconCls: 'fa-angle-left',
					handler: function() {
						var records = lsRight.getSelectedRecords();
						lsLeft.getStore().add(records);
						for (var i = 0; i < records.length; i++) {
							lsRight.getStore().remove(records[i]);
						}
					}
				},{
					xtype:'button',
					tooltip: '取消全部字段',
					iconCls: 'fa-angle-double-left',
					handler: function() {
						var store = lsRight.getStore();
						var records = store.getRange(0, store.getCount());
						lsLeft.getStore().add(records);
						store.removeAll();
					}
				}]
			});
			
		this.lsLeft = lsLeft;
		this.lsRight = lsRight;
		this.lsCenter = lsCenter;
		
		//创建字段选择列表
		var listPanel = new Ext.Panel({
				layout:'border', 
				border: false,
				items:[lsLeft,lsCenter,lsRight]
			});
		
		return listPanel;
	},
	
	/**
	* public
	* 返回右边选择的列表数据，
	* 当该控件时双向选择控件时才有返回值，否则返回null。
	**/
	getSelectStore: function() {
		if (!this.isSelect) return null;
		return this.lsRight.getStore();
	},
	
	/**
	* public
	* 返回右边选择的列表数据构成到字符串，
	* 当该控件时双向选择控件时才有返回值，否则返回''。
	**/
	getSelectData: function() {
		if (!this.isSelect) return '';
		
		var fieldStore = this.lsRight.getStore();
		if (fieldStore.getCount() == 0) {
			return '';
		}

		var selfields = '';
		for (var i = 0, n = fieldStore.getCount(); i < n; i++) {
			var field = fieldStore.getAt(i).get('value');
			selfields += field.replace('__', '.') + ',';
		}
		selfields = selfields.substr(0, selfields.length-1);
		
		return selfields;
	}
});
