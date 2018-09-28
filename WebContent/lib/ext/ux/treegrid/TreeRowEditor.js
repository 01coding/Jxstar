/**
 * @class Ext.ux.tree.TreeRowEditor
 * @extends Ext.Panel
 * Plugin (ptype = 'roweditor') that adds the ability to rapidly edit full rows in a grid.
 * A validation mode may be enabled which uses AnchorTips to notify the user of all
 * validation errors at once.
 *
 * @ptype ptreeroweditor
 */
Ext.ux.tree.TreeRowEditor = Ext.extend(Ext.Panel, {
    hidden: true,
    floating: true,
    shadow: false,
    layout: 'hbox',
    cls: 'x-small-editor',
    buttonAlign: 'center',
    baseCls: 'x-row-editor',
    elements: 'header,footer,body',
    frameWidth: 5,
    buttonPad: 3,
    monitorValid: true,
    focusDelay: 250,

    saveText: '保存',
    cancelText: '取消',

    adjustHeight: 35,
    adjustButtonHeight: 7,
    columnButton: true,

    defaults: {
        normalWidth: true
    },

    initComponent: function() {
        if (this.columnButton) {
            this.adjustHeight = this.adjustButtonHeight;
            this.buttonWidth = this.buttonWidth || 50;
        } else {
            this.buttonWidth = this.buttonWidth || this.minButtonWidth;
        }

        Ext.ux.tree.TreeRowEditor.superclass.initComponent.call(this);
        this.addEvents(
        /**
         * @event beforeedit
         * Fired before the row editor is activated.
         * If the listener returns <tt>false</tt> the editor will not be activated.
         * @param {Ext.tree.Node} 被编辑的树节点
         */
        'beforeedit',
        /**
         * @event canceledit
         * Fired when the editor is cancelled.
         * @param {Ext.tree.Node} 被编辑的树节点
         */
        'canceledit',
        /**
         * @event validateedit
         * Fired after a row is edited and passes validation.
         * If the listener returns <tt>false</tt> changes to the record will not be set.
         * @param {Ext.tree.Node} 被编辑的树节点，树节点属性为旧属性
         * @param {Object} changes Object with changes made to the record.
         */
        'validateedit',
        /**
         * @event afteredit
         * Fired after a row is edited and passes validation.  This event is fired
         * after the store's update event is fired with this edit.
         * @param {Ext.tree.Node} 被编辑的树节点，树节点属性为修改完之后的属性
         * @param {Object} changes Object with changes made to the record.
         */
        'afteredit');
    },

    init: function(tree) {
        this.tree = tree;
        this.ownerCt = tree;

        Ext.applyIf(tree, {
            editNode: this.editNode.createDelegate(this)
        });

        tree.on({
            scope: this,
            beforedestroy: this.beforeDestroy,
            destroy: this.destroy,
            bodyscroll: {
                buffer: 250,
                fn: this.positionButtons
            }
        });
    },

    beforeDestroy: function() {
        this.stopEditing(false);
        this.node = null;
        Ext.destroy(this.saveBtn, this.cancelBtn);
        if (this.btns) {
            Ext.destroy(this.btns);
        }
    },

    refreshFields: function() {
        this.initFields();
        this.verifyLayout();
    },

    isDirty: function() {
        var dirty;
        this.items.each(function(f) {
            if (String(this.values[f.id]) !== String(f.getValue())) {
                dirty = true;
                return false;
            }
        }, this);
        return dirty;
    },

    startEditing: function(node, doFocus) {
        if (this.editing) { // 正在被编辑，直接跳过
            return;
        }
        if (this.fireEvent('beforeedit', node) !== false) {
            this.editing = true;
            var t = this.tree, ct = t.innerBody;
            this.node = node;
            this.values = {};
            if (!this.rendered) {
                this.render(ct);
            }
            var w = t.innerCt.getWidth();
            this.setSize(w);
            if (!this.initialized) {
                this.initFields();
            }
            var cm = t.columns, c, fields = this.items.items, f, val;
            for (var i = 0, len = cm.length; i < len; i++) {
                c = cm[i], f = fields[i];
                if (!c.buttons && this.isField(f)) { // 跳过按钮列
                    val = this.preEditValue(node, c.dataIndex);
                    f.setValue(val);
                    this.values[f.id] = Ext.isEmpty(val) ? '' : val;
                }
            }
            this.verifyLayout(node, true);
            var xy = Ext.fly(node.ui.elNode).getXY(), nh = Ext.fly(node.ui.elNode).getHeight(), ctY = ct.getXY()[1] + ct.getHeight();
            var ah = xy[1] + nh + this.adjustHeight;
            if (ah > ctY) {
                ct.scroll('b', ah);
                xy = Ext.fly(node.ui.elNode).getXY();
                ah = xy[1] + nh + this.adjustHeight;
                if (ah > ctY) {
                    xy[1] = ctY - nh - this.adjustHeight;
                }
            }
            if (!this.isVisible()) {
                this.setPagePosition(xy);
            } else {
                this.el.setXY(xy, {
                    duration: 0.15
                });
            }
            if (!this.isVisible()) {
                this.show().doLayout();
            }
            if (doFocus !== false) {
                this.doFocus.defer(this.focusDelay, this);
            }
        }
    },

    stopEditing: function(saveChanges) {
        this.editing = false;
        if (!this.isVisible()) {
            return;
        }
        if (saveChanges === false || !this.isValid()) {
            this.hide();
            this.fireEvent('canceledit', this.node);
            return;
        }
        var changes = {}, n = this.node, hasChange = false, cm = this.tree.columns, c, fields = this.items.items;
        for (var i = 0, len = cm.length; i < len; i++) {
            c = cm[i];
            if (!c.hidden && !c.buttons) {
                var dindex = c.dataIndex;
                var oldValue = n.attributes[dindex], value = this.postEditValue(fields[i].getValue(), oldValue, n, dindex);
                if (String(oldValue) !== String(value)) {
                    changes[dindex] = value;
                    hasChange = true;
                }
            }
        }
        if (hasChange && this.fireEvent('validateedit', n, changes) !== false) {
            Ext.apply(n.attributes, changes);
            Ext.iterate(changes, function(name, value) {
                var index = 0, c;
                for (var i = 0, len = cm.length; i < len; i++) {
                    c = cm[i];
                    if (c.dataIndex == name) {
                        index = i;
                        break;
                    }
                }
                if (index == 0) {
                    n.ui.textNode.innerHTML = c.tpl ? c.tpl.apply(n.attributes) : value;
                } else {
                    n.ui.elNode.childNodes[index].firstChild.innerHTML = c.tpl ? c.tpl.apply(n.attributes) : value;
                }
            });
            this.fireEvent('afteredit', n, changes);
        }
        this.hide();
    },

    verifyLayout: function(node, force) {
        if (this.el && (this.isVisible() || force === true)) {
            var elNode = node.ui.elNode;
            this.setSize(Ext.fly(elNode).getWidth(), Ext.isIE ? Ext.fly(elNode).getHeight() + 9 : undefined);
            var cm = this.tree.columns, fields = this.items.items, f;
            for (var i = 0, len = cm.length; i < len; i++) {
                f = fields[i];
                if (f && this.isField(f)) {
                    var adjust = 0;
                    if (i === (len - 1)) {
                        adjust += 3; // outer padding
                    } else {
                        adjust += 1;
                    }
                    f.setWidth(cm[i].width - adjust);
                }
            }
            this.doLayout();
            this.positionButtons();
        }
    },

    slideHide: function() {
        this.hide();
    },

    initFields: function() {
        var cm = this.tree.columns, pm = Ext.layout.ContainerLayout.prototype.parseMargins;
        this.removeAll(false);
        for (var i = 0, len = cm.length; i < len; i++) {
            var c = cm[i], ed = c.editor;
            if (this.columnButton) {
                if (i == len - 1) {
                    this.cancelBtn.margins = pm('0 0 2 2');
                    this.add([this.saveBtn, this.cancelBtn]);
                    continue;
                } else if (c.buttons) {
                    ed = new Ext.BoxComponent();
                }
            } else if (c.buttons) {
                continue;
            }
            if (!ed) {
                ed = c.displayEditor || new Ext.form.DisplayField();
            }
            if (i == 0) {
                ed.margins = pm('0 1 2 1');
            } else if (i == len - 1) {
                ed.margins = pm('0 0 2 1');
            } else {
                ed.margins = pm('0 1 2');
            }
			//添加隐藏属性，否则把后面的按钮列排不见了
			if (c.hidden) ed.hide();
            ed.setWidth(c.width);
            ed.column = c;
            if (ed.ownerCt !== this) {
                ed.on('specialkey', this.onKey, this);
            }
            this.insert(i, ed);
        }
        this.initialized = true;
    },

    onKey: function(f, e) {
        if (e.getKey() === e.ENTER) {
            this.stopEditing(true);
            e.stopPropagation();
        }
    },

    editNode: function(node) {
        this.startEditing(node, true);
    },

    onRender: function() {
        Ext.ux.tree.TreeRowEditor.superclass.onRender.apply(this, arguments);
        this.el.swallowEvent(['keydown', 'keyup', 'keypress']);

        this.saveBtn = new Ext.Button({
            ref: 'saveBtn',
            itemId: 'saveBtn',
            text: this.saveText,
            width: this.buttonWidth,
            handler: this.stopEditing.createDelegate(this, [true])
        });

        this.cancelBtn = new Ext.Button({
            text: this.cancelText,
            width: this.buttonWidth,
            handler: this.stopEditing.createDelegate(this, [false])
        });

        if (!this.columnButton) {
            this.btns = new Ext.Panel({
                baseCls: 'x-plain',
                cls: 'x-btns',
                elements: 'body',
                layout: 'table',
                width: (this.buttonWidth * 2) + (this.frameWidth * 2) + (this.buttonPad * 4), // width must be specified for IE
                items: [this.saveBtn, this.cancelBtn]
            });
            this.btns.render(this.bwrap);
        }
    },

    afterRender: function() {
        Ext.ux.tree.TreeRowEditor.superclass.afterRender.apply(this, arguments);
        this.positionButtons();
        if (this.monitorValid) {
            this.startMonitoring();
        }
    },

    onShow: function() {
        if (this.monitorValid) {
            this.startMonitoring();
        }
        Ext.ux.tree.TreeRowEditor.superclass.onShow.apply(this, arguments);
    },

    onHide: function() {
        Ext.ux.tree.TreeRowEditor.superclass.onHide.apply(this, arguments);
        this.stopMonitoring();
    },

    positionButtons: function() {
        if (this.btns) {
            var t = this.tree, h = this.el.dom.clientHeight, scroll = t.innerBody.dom.scrollLeft, bw = this.btns.getWidth(), width = t.getWidth();

            this.btns.el.shift({
                left: (width / 2) - (bw / 2) + scroll,
                top: h - 2,
                stopFx: true,
                duration: 0.2
            });
        }
    },

    // private
    preEditValue: function(node, field) {
        var value = node.attributes[field];
		//把日期字符串转换为日期对象
		if (field && field.toLowerCase().indexOf('date') >= 0) {
			if (value && value.length > 0) {
				value = Date.parseDate(value.split(' ')[0], 'Y-m-d');
			}
		}
        return this.autoEncode && typeof value === 'string' ? Ext.util.Format.htmlDecode(value) : value;
    },

    // private
    postEditValue: function(value, originalValue, node, field) {
        return this.autoEncode && typeof value == 'string' ? Ext.util.Format.htmlEncode(value) : value;
    },

    doFocus: function() {
        if (this.isVisible()) {
            var cm = this.tree.columns, c;
            for (var i = 0, len = cm.length; i < len; i++) {
                c = cm[i];
                if (!c.hidden && c.editor) {
                    c.editor.focus();
                    break;
                }
            }
        }
    },

    startMonitoring: function() {
        if (!this.bound && this.monitorValid) {
            this.bound = true;
            Ext.TaskMgr.start({
                run: this.bindHandler,
                interval: this.monitorPoll || 200,
                scope: this
            });
        }
    },

    stopMonitoring: function() {
        this.bound = false;
    },

    isValid: function() {
        var valid = true;
        this.items.each(function(f) {
            if (this.isField(f) && !f.isValid(true)) {
                valid = false;
                return false;
            }
        }, this);
        return valid;
    },
    
    // private
    isField: function(c) {
        return !!c.setValue && !!c.getValue && !!c.markInvalid && !!c.clearInvalid;
    },

    // private
    bindHandler: function() {
        if (!this.bound) {
            return false; // stops binding
        }
        var valid = this.isValid();
        this.saveBtn.setDisabled(!valid);
        this.fireEvent('validation', this, valid);
    }
});
Ext.preg('ptreeroweditor', Ext.ux.tree.TreeRowEditor);
