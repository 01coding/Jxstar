DemoGanttPanel = Ext.extend(Sch.gantt.GanttPanel, {
    rightLabelField : 'Responsible',
    highlightWeekends : true,
    showTodayLine : true,
    loadMask : true,
    stripeRows : true,
    enableProgressBarResize : true,

    initComponent : function() {
        
        Ext.apply(this, {
            leftLabelField : {
                dataIndex : 'Name',
                editor : { xtype : 'textfield' }
            },
            
            // Add some extra functionality
            plugins : [new Sch.gantt.plugins.TaskContextMenu(), new Sch.plugins.Pan()],

            // Define an HTML template for the tooltip
            tooltipTpl : new Ext.XTemplate(
                '<h4 class="tipHeader">{Name}</h4>',
                '<table class="taskTip">', 
                    '<tr><td>Start:</td> <td align="right">{[values.StartDate.format("y-m-d")]}</td></tr>',
                    '<tr><td>End:</td> <td align="right">{[values.EndDate.format("y-m-d")]}</td></tr>',
                    '<tr><td>Progress:</td><td align="right">{PercentDone}%</td></tr>',
                '</table>'
            ).compile(),
            
            // Define the static columns
            columns : [
                {
                    header : 'Tasks', 
                    sortable:true, 
                    dataIndex : 'Name', 
                    locked : true,
                    width:180, 
                    editor : new Ext.form.TextField({ allowBlank : false }),
                    renderer : function (v, m, r) {
                        if (r.get('IsLeaf')) {
                            m.css = 'task';
                        } else {
                            m.css = 'parent';
                        }
                        return v;
                    }
                },
                {
                    header : 'Start', 
                    sortable:true, 
                    width:90, 
                    dataIndex : 'StartDate', 
                    locked : true,
                    renderer: Ext.util.Format.dateRenderer('m/d/Y'),
                    editor : new Ext.form.DateField({
                        allowBlank : false,
                        format: 'm/d/y'
                    })
                },
                {
                    header : 'Duration', 
                    sortable:true, 
                    width:50, 
                    dataIndex : 'Duration', 
                    renderer: function(v, m, r) {
                        var start = r.get('StartDate'),     
                            end = r.get('EndDate');
                        if (start && end) {
                            var d = Math.round(Sch.util.Date.getDurationInDays(start, end));
                            if (d > 0) {
                                return d + 'd';
                            }
                        }
                    }, 
                    locked : true, 
                    editor: new Ext.ux.form.SpinnerField({
                        allowBlank:false,
                        minValue : 0,
                        decimalPrecision: 1,
                        incrementValue : 1
                    })
                },
                {
                    header : '% Done', 
                    sortable:true, 
                    width:50, 
                    dataIndex : 'PercentDone', 
                    renderer: function(v, m, r) {
                        return typeof v === 'number' ? (v + '%') : '';
                    }, 
                    locked : true, 
                    editor: new Ext.ux.form.SpinnerField({
                        allowBlank:false,
                        minValue : 0,
                        maxValue : 100,
                        incrementValue : 10
                    })
                }
            ],
            
             // Define the buttons that are available for user interaction
            tbar : [{
                xtype: 'buttongroup',
                title: 'Navigation',
                columns: 2,
                defaults: {
                    scale: 'large'
                },
                items: [{
                    iconCls : 'icon-prev',
                    scope : this,
                    handler : function() {
                        this.shiftPrevious();
                    }
                },
                {
                    iconCls : 'icon-next',
                    scope : this,
                    handler : function() {
                        this.shiftNext();
                    }
                }]
            },
            {
                xtype: 'buttongroup',
                title: 'View tools',
                columns: 2,
                defaults: {
                    scale: 'small'
                },
                items: [
                    {
                        text : 'Collapse all',
                        iconCls : 'icon-collapseall',
                        scope : this,
                        handler : function() {
                            this.taskStore.collapseAll();
                        }
                    },
                    {
                        text : 'Zoom to fit',
                        iconCls : 'zoomfit',
                        handler : function() {
                            var first = new Date(9999,0,1), last = new Date(0);
                            
                            this.taskStore.each(function(r) {
                                first = Sch.util.Date.min(r.get('StartDate'),first);
                                last = Sch.util.Date.max(r.get('EndDate'),last);
                            });
                            
                            if (first - new Date(9999,0,1) !== 0 && last - new Date(0) !== 0){
                                this.setTimeSpan(first, last);
                                this.fitTimeColumns();
                            }
                        },
                        scope : this
                    },
                    {
                        text : 'Expand all',
                        iconCls : 'icon-expandall',
                        scope : this,
                        handler : function() {
                            this.taskStore.expandAll();
                        }
                    }
                ]
            },
            {
                xtype: 'buttongroup',
                title: 'View resolution',
                columns: 2,
                defaults: {
                    scale: 'large'
                },
                items: [{
                        text: '10 weeks',
                        scope : this,
                        handler : function() {
                            this.switchViewPreset('weekAndDayLetter');
                        }
                    },
                    {
                        text: '1 year',
                        scope : this,
                        handler : function() {
                            this.switchViewPreset('monthAndYear');
                        }
                    }
                ]},
                '->',
                {
                    xtype: 'buttongroup',
                    title: 'Try some features...',
                    columns : 2,
                    items: [
                    {
                        text : 'Highlight critical chain',
                        iconCls : 'togglebutton',
                        scope : this,
                        enableToggle : true,
                        handler : function(btn) {
                            if (btn.pressed) {
                                this.highlightCriticalPaths(true);
                            } else {
                                this.unhighlightCriticalPaths(true);
                            }
                        }
                    },
                    {
                        iconCls : 'action',
                        text : 'Highlight tasks longer than 7 days',
                        scope : this,
                        handler : function(btn) {
                            this.taskStore.each(function(task) {
                                if (Sch.util.Date.getDurationInDays(task.get('StartDate'), task.get('EndDate')) > 7) {
                                    var el = this.getView().getElementFromEventRecord(task);
                                    el && el.frame('lime');
                                }
                            }, this);
                        }
                    },
                    {
                        iconCls : 'togglebutton',
                        text : 'Filter: Tasks with progress < 30%',
                        scope : this,
                        enableToggle : true,
                        toggleGroup : 'filter',
                        handler : function(btn) {   
                            if (btn.pressed) {
                                this.taskStore.filterBy(function(task) {
                                    return task.get('PercentDone') < 30;
                                });
                            } else {
                                this.taskStore.clearFilter();
                            }
                        }
                    },
                    {
                        iconCls : 'action',
                        text : 'Scroll to last task',
                        scope : this,
                        handler : function(btn) {
                            var last = this.taskStore.getAt(this.taskStore.getCount()-1);
                            this.getView().scrollEventIntoView(last);
                        }
                    },
                    {
                        iconCls : 'togglebutton',
                        text : 'Cascade changes',
                        scope : this,
                        enableToggle : true,
                        handler : function(btn) {
                            this.cascadeChanges = btn.pressed;
                        }
                    },
                    {
                        xtype : 'textfield',
                        emptyText : 'Search for task...',
                        scope : this,
                        width:150,
                        enableKeyEvents : true,
                        listeners : {
                            keyup : {
                                fn : function(field) {
                                    this.taskStore.filter('Name', field.getValue(), true, false);
                                },
                                scope : this
                            }
                        }
                    }]
                }
            ]
        });
        
        DemoGanttPanel.superclass.initComponent.apply(this, arguments);
    }
});