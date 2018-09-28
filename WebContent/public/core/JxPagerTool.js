/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Plugin for PagingToolbar which replaces the textfield input with a combo 
 */
Ext.ux.JxPagerTool = function(config){
	Ext.apply(this, config);

};
Ext.extend(Ext.ux.JxPagerTool, Object, {
    init : function(pbar){
    	var me = this;
		var pageSizeData = [[20, '20'], [50, '50'], [100, '100'], [200, '200']];
		var pageSizeCombo = new Ext.form.ComboBox({
			triggerAction: 'all',
			mode: 'local', width: 70, editable:false,
			store: new Ext.data.SimpleStore({fields:['value','text'],
				data: pageSizeData}),
			valueField: 'value',
			displayField: 'text',
			value: me.pageSize || Jxstar.pageSize,
			listeners: {
                select: function(combo, record, index){
                    pbar.pageSize = record.get('value');
					pbar.changePage(1);
					return true;
                }
            }
		});
		
		var T = Ext.Toolbar;
		var idx = pbar.items.indexOf(pbar.displayItem);
		pbar.insert(idx+1, new T.TextItem(', '+jx.query.ppage));//每页
		pbar.insert(idx+2, pageSizeCombo);
		pbar.insert(idx+3, new T.TextItem(jx.query.row));//'条'
    }
});