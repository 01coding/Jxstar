Ext.ux.tree.EditTreeGrid = Ext.extend(Ext.ux.tree.TreeGrid, {
    /**
     * @cfg {String} idProperty ID属性名 (defaults to 'id')
     */
    idProperty: 'id',

    /**
     * @cfg {Boolean} enableSort True启用列排序（默认false），如果启用了列排序功能，会导致树节点上移（upgrade）、下移（degrade）两个功能失效
     */
    enableSort: false,

    /**
     * @cfg {Boolean} enableHdMenu True启用列隐藏功能（默认false），此属性暂时禁用
     */
    enableHdMenu: false,

    /**
     * @cfg {String} highlightColor 增删改动作执行完后，高亮提示颜色 (defaults to '#d9e8fb')
     */
    highlightColor: '#d9e8fb',

    /**
     * @cfg {Number} depth 树层级，最深层级关系，默认无级限制
     */
    depth: Number.MAX_VALUE,

    /**
     * @cfg {Object} requestApi <p>设置树节点‘增’、‘删’、‘查’、‘上移’、‘下移’AJAX远程调用接口。</p>
     * 
     * <p>与服务端交互时，AJAX请求提交参数保留关键字，如下：</p>
     * <div class="mdetail-params"><ul>
     * <li><b>id</b> : 树节点ID</li>
     * <li><b>parentNodeId</b> : 父节点ID</li>
     * <li><b>requestAction</b> : 当前请求执行动作（点击功能按钮动作）</li>
     * </ul></div>
     * 
     * <p>For example:
     * <pre><code>
requestApi: {
    upgrade: '/rest/upgrade',
    degrade: '/rest/degrade',
    add: '/rest/add',  // 服务端必须返回idProperty的新节点ID
    update: '/rest/update',
    remove: '/rest/remove'
}

// 或者，如果希望在请求结束后，执行回调函数，可以向下面这样写：

requestApi: {
    upgrade: {
        url: '/rest/upgrade',
        success: function(response, options) {
            // 成功后调函数
        }, 
        failure: function(response, options) {
            // 失败回调函数
        }
    },
    degrade: '/rest/degrade',
    add: '/rest/add',  // 服务端必须返回idProperty的新节点ID
    update: '/rest/update',
    remove: '/rest/remove'
}
     * </code></pre>
     */

    /**
     * @cfg {Boolean} rowEdit 行编辑选项开关，True开启行编辑功能，False表示点击功能按钮时，只触发回调函数，默认true
     */
    rowEdit: true,
    
    /**
     * @cfg {String} delConfirm 删除树节点提示确认框标题
     */
    delConfirm: '提示',
    
    /**
     * @cfg {String} delConfirmMsg 删除树节点提示确认框内容
     */
    delConfirmMsg: '确定删除当前记录吗？',

    // private
    isTreeEditor: true,

    // private
    initComponent: function() {
        this.enableHdMenu = false; // TODO 此属性暂时禁用，需要解决功能按钮被隐藏时，无法重新渲染的问题

        if (this.rowEdit) {
            this.animate = false; // 当treegrid为行编辑状态时，需要关闭折叠/展开动画效果，否则会导致行编辑组件定位不错误

            this.editor = new Ext.ux.tree.TreeRowEditor({
                listeners: {
                    scope: this,
                    canceledit: this.cancelEdit,
                    afteredit: this.saveNode
                }
            });
            this.plugins = this.plugins || [];
            this.plugins.push(this.editor);
        }

        Ext.ux.tree.EditTreeGrid.superclass.initComponent.call(this);
    },

    // private
    beforeDestroy: function() {
        Ext.destroy(this.editor);
        Ext.ux.tree.EditTreeGrid.superclass.beforeDestroy.call(this);
    },

    /**
     * 添加节点
     * @param {Ext.tree.TreeNode} parentNode
     */
    addNode: function(parentNode) {
        if (this.editor.editing || parentNode.getDepth() + 1 > this.depth) {
            return;
        }

        var o = {
            _isNewTreeGridNode: true
        };
        o[this.idProperty] = '';
        var cs = this.columns, len = cs.length, c;
        for (i = 0; i < len; i++) {
            c = cs[i];
            if (c.dataIndex) {
                o[c.dataIndex] = '';
            }
        }
		//添加jxstar需要的属性
		o.node_level = parentNode.attributes.node_level;

        var node = new Ext.tree.TreeNode(o);
        if (parentNode.isLeaf()) {
            parentNode.leaf = false;
        } else if (parentNode.lastChild) {
            var degradeButton = this.getButton(parentNode.lastChild, 'degrade');
            if (degradeButton) {
                degradeButton.enable();
            }
        }
        parentNode.expand(false, false, function() {
            parentNode.appendChild(node);
            Ext.fly(node.ui.elNode).highlight(this.highlightColor);
            this.editNode(node);
        }, this);
    },

    /**
     * 修改节点
     * @param {Ext.tree.TreeNode} node
     */
    updateNode: function(n) {
        if (this.editor.editing) {
            return;
        }
        this.editNode(n);
    },

    // private
    cancelEdit: function(n) {
        if (n.attributes._isNewTreeGridNode) {
            var parentNode = n.parentNode;
            if (parentNode.childNodes.length == 1) {
                parentNode.leaf = true;
            }
            n.remove();
            if (parentNode.childNodes.length < 1) {
                this.updateLeafIcon(parentNode);
            } else {
                var degradeButton = this.getButton(parentNode.lastChild, 'degrade');
                if (degradeButton) {
                    degradeButton.disable();
                }
            }
        }
    },

    // private
    saveNode: function(n, changes) {
        Ext.fly(n.ui.elNode).highlight(this.highlightColor);

        var params = {}, options = {
            node: n,
            changes: changes
        };
        Ext.applyIf(params, n.attributes);
        params.parentNodeId = n.parentNode.id;

        var cm = this.columns;
        Ext.iterate(changes, function(name, value) {
            var index = 0, c;
            for (var i = 0, len = cm.length; i < len; i++) {
                c = cm[i];
                if (c.dataIndex == name) {
                    index = i;
                    break;
                }
            }
            Ext.fly(n.ui.elNode.childNodes[index]).addClass('x-grid3-dirty-cell');
        });

        //this.doRequest(n.attributes._isNewTreeGridNode ? 'add' : 'update', this.filterParams(params), this.processSave, options);
		var action = n.attributes._isNewTreeGridNode ? 'add' : 'update';
		this.actions[action](n, options);
    },

    // private
    processSave: function(response, options) {
        try {
            var n = options.node, changes = options.changes;
            if (n.attributes._isNewTreeGridNode) {
                var resp = Ext.decode(response.responseText);
                n.attributes._isNewTreeGridNode = false;
                if (resp.id) {
                    n.setId(resp.id);
                }
                if (resp[this.idProperty]) {
                    n.attributes[this.idProperty] = resp[this.idProperty];
                }
            }
            var cm = this.columns;
            Ext.iterate(changes, function(name, value) {
                var index = 0, c;
                for (var i = 0, len = cm.length; i < len; i++) {
                    c = cm[i];
                    if (c.dataIndex == name) {
                        index = i;
                        break;
                    }
                }
                Ext.fly(n.ui.elNode.childNodes[index]).removeClass('x-grid3-dirty-cell');
            });
        } catch (e) {
        }
    },

    /**
     * 移除节点
     * @param {Ext.tree.TreeNode} node
     */
    removeNode: function(n) {
        if (this.editor.editing) {
            return;
        }

        var parentNode = n.parentNode, previousSibling = n.previousSibling, nextSibling = n.nextSibling;
        if (parentNode.childNodes.length == 1) {
            parentNode.leaf = true;
        }
        n.remove();
        if (parentNode.childNodes.length < 1) {
            this.updateLeafIcon(parentNode);
        } else {
            if (previousSibling && previousSibling.isLast()) {
                var degradeButton = this.getButton(previousSibling, 'degrade');
                if (degradeButton) {
                    degradeButton.disable();
                }
            }
            if (nextSibling && nextSibling.isFirst()) {
                var upgradeButton = this.getButton(nextSibling, 'upgrade');
                if (upgradeButton) {
                    upgradeButton.disable();
                }
            }
        }
		/*
        var params = {
            id: n.id,
            parentNodeId: parentNode.id
        };
        params[this.idProperty] = n.attributes[this.idProperty];
        this.doRequest('remove', this.filterParams(params));
		*/
		this.actions.remove(n);
    },

    /**
     * 上移节点
     * @param {Ext.tree.TreeNode} node
     */
    upgradeNode: function(n) {
        if ((this.editor && this.editor.editing) || n.isFirst()) {
            return;
        }
        n.parentNode.insertBefore(n, n.previousSibling);
        if (n.isFirst()) {
            this.getButton(n, 'upgrade').disable();
            this.getButton(n, 'degrade').enable();
            this.getButton(n.nextSibling, 'upgrade').enable();
            if (n.nextSibling.isLast()) {
                this.getButton(n.nextSibling, 'degrade').disable();
            }
        } else {
            this.getButton(n, 'degrade').enable();
            this.getButton(n.nextSibling, 'upgrade').enable();
            if (n.nextSibling.isLast()) {
                this.getButton(n.nextSibling, 'degrade').disable();
            }
        }
        Ext.fly(n.ui.elNode).highlight(this.highlightColor);

        var params = {
            id: n.id,
            parentNodeId: n.parentNode.id
        };
        params[this.idProperty] = n.attributes[this.idProperty];
        this.doRequest('upgrade', this.filterParams(params));
    },

    /**
     * 下移节点
     * @param {Ext.tree.TreeNode} node
     */
    degradeNode: function(n) {
        if ((this.editor && this.editor.editing) || n.isLast()) {
            return;
        }
        n.parentNode.insertBefore(n, n.nextSibling.nextSibling);
        if (n.isLast()) {
            this.getButton(n, 'upgrade').enable();
            this.getButton(n, 'degrade').disable();
            if (n.previousSibling.isFirst()) {
                this.getButton(n.previousSibling, 'upgrade').disable();
            }
            this.getButton(n.previousSibling, 'degrade').enable();
        } else {
            this.getButton(n, 'upgrade').enable();
            this.getButton(n, 'degrade').enable();
            if (n.previousSibling.isFirst()) {
                this.getButton(n.previousSibling, 'upgrade').disable();
            }
            this.getButton(n.previousSibling, 'degrade').enable();
        }
        Ext.fly(n.ui.elNode).highlight(this.highlightColor);

        var params = {
            id: n.id,
            parentNodeId: n.parentNode.id
        };
        params[this.idProperty] = n.attributes[this.idProperty];
        this.doRequest('degrade', this.filterParams(params));
    },

    /*
     * @private
     * 执行AJAX调用动作，参数requestAction为保留关键字
     * @param {String} action 执行动作，功能按钮唯一标识，会作为AJAX请求的requestAction参数提交给服务端处理
     * @param {Object} params 提交到服务端的参数
     * @param {Function} callback AJAX请求回调函数
     * @param {Object} options AJAX请求选项，参见{@link Ext.Ajax#request}
     */
    doRequest: function(action, params, callback, o) {
		if (!this.requestApi || !this.requestApi[action]) {
            return;
        }
        params = Ext.apply({
            requestAction: action
        }, params);
        o = Ext.applyIf(o || {}, {
            params: params
        });
        if (Ext.isString(this.requestApi[action])) {
            o.url = this.requestApi[action];
        } else {
            Ext.applyIf(o, this.requestApi[action]);
        }
        if (callback) {
            if (o.success) {
                o.success = callback.createDelegate(this).createSequence(o.success);
            } else if (o.callback) {
                o.callback = callback.createDelegate(this).createSequence(o.callback);
            } else {
                o.success = callback.createDelegate(this);
            }
        }
        Ext.Ajax.request(o);
    },

    // private
    getButton: function(n, k) {
        return n.buttons.get(k);
    },

    // private
    updateLeafIcon: function(n) {
        if (n.ui.elNode) {
            Ext.fly(n.ui.elNode).replaceClass("x-tree-node-collapsed", "x-tree-node-leaf");
        }
    },

    // private
    filterParams: function(params) {
        delete params.uiProvider;
        delete params.iconCls;
        delete params.loader;
        delete params.leaf;
        delete params.children;
        delete params._isNewTreeGridNode;
        return params;
    },

    /**
     * 禁用功能按钮，上移、下移节点功能按钮除外；
     * @param {String/Ext.tree.TreeNode} node 树节点id或对象
     * @param {String} button 
     */
    disableButton: function(n, b) {
        n = Ext.isString(n) ? this.getNodeById(n) : n;
        n.disableButton(b);
    },
    
    /**
     * 启用功能按钮，上移、下移节点功能按钮除外；
     * @param {String/Ext.tree.TreeNode} node 树节点id或对象
     * @param {String} button 
     */
    enableButton: function(n, b) {
        n = Ext.isString(n) ? this.getNodeById(n) : n;
        n.enableButton(b);
    },
    
    /**
     * 隐藏功能按钮
     * @param {String/Ext.tree.TreeNode} node 树节点id或对象
     * @param {String} button 
     */
    hideButton: function(n, b) {
        n = Ext.isString(n) ? this.getNodeById(n) : n;
        n.hideButton(b);
    },
    
    /**
     * 显示功能按钮
     * @param {String/Ext.tree.TreeNode} node 树节点id或对象
     * @param {String} button 
     */
    showButton: function(n, b) {
        n = Ext.isString(n) ? this.getNodeById(n) : n;
        n.showButton(b);
    }
});

Ext.reg('edittreegrid', Ext.ux.tree.EditTreeGrid);