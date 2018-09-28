Ext.ns('Ext.ux.tree');

/**
 * 树形数据的分页处理规则：根据当前级别的数据量进行分页处理，除了引入store参数，还需有进入当前级别的node对象，记录总数从node的属性中获取。
 *
 **/
Ext.ux.tree.TreePagingToolbar = Ext.extend(Ext.PagingToolbar, {
	
	/**
     * @cfg {Ext.tree.TreeLoader} store
	 * 用于加载树形数据
     */
	
	paramNames: {start: 'start', limit: 'limit'},
	
    // tree load params: ( loader, node, response ) 
    onLoad : function(store, node, response){
		var me = this;
		//不是当前节点，则不处理分页数据
		if (me.node && me.node != node) return;
		
        if(!this.rendered){
            this.dsLoaded = [store, node, response];
            return;
        }
		//---------get totalcount---------------
		if (!me.store.getCount) {
			me.store.getCount = function(){
				return me.node.count||0;
			};
		}
		if (!me.store.getTotalCount) {
			me.store.getTotalCount = function(){
				return me.node.total||0;
			};
		}
		
        var p = this.getParams();
		//use store params
        //this.cursor = (o.params && o.params[p.start]) ? o.params[p.start] : 0;
		o = me.node.queryParams;
		this.cursor = (o && o[p.start]) ? o[p.start] : 0;
		
        var d = this.getPageData(), ap = d.activePage, ps = d.pages;
		
        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
        this.inputItem.setValue(ap);
        this.first.setDisabled(ap == 1);
        this.prev.setDisabled(ap == 1);
        this.next.setDisabled(ap == ps);
        this.last.setDisabled(ap == ps);
        this.refresh.enable();
        this.updateInfo();
        this.fireEvent('change', this, d);
    },
	
    // private
    doLoad : function(start){
		var me = this;
        var o = {}, pn = this.getParams();
        o[pn.start] = start;
        o[pn.limit] = this.pageSize;
		
		//---------bind page param to tree
		Ext.apply(me.node.queryParams, o);
		
        if(this.fireEvent('beforechange', this, o) !== false){
			//---------load current treenode data
            this.store.load(me.node);
        }
    },

    /**
     * Binds the paging toolbar to the specified {@link Ext.data.Store}
     * @param {Store} store The store to bind to this toolbar
     * @param {Boolean} initial (Optional) true to not remove listeners
     */
    bindStore : function(store, initial){
        var doLoad;
        if(!initial && this.store){
            if(store !== this.store){
                this.store.destroy();
            }else{
                this.store.un('beforeload', this.beforeLoad, this);
                this.store.un('load', this.onLoad, this);
                this.store.un('loadexception', this.onLoadError, this);
            }
            if(!store){
                this.store = null;
            }
        }
        if(store){
            store = Ext.StoreMgr.lookup(store);
            store.on({
                scope: this,
                beforeload: this.beforeLoad,
                load: this.onLoad,
                loadexception: this.onLoadError
            });
            doLoad = true;
        }
        this.store = store;
        if(doLoad){
            this.onLoad(store, null, {});
        }
    }
});