/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 甘特图显示控件。
 * 
 * @author TonyTan
 * @version 1.0, 2011-10-06
 */
JxGanttPanel = Ext.extend(Sch.gantt.GanttPanel, {
    //rightLabelField : 'Responsible',
    highlightWeekends : true,
    showTodayLine : true,
    loadMask : false,
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
                    '<tr><td>开始:</td> <td align="right">{[values.StartDate.format("Y-m-d")]}</td></tr>',
                    '<tr><td>结束:</td> <td align="right">{[values.EndDate.format("Y-m-d")]}</td></tr>',
                    '<tr><td>进度:</td><td align="right">{PercentDone}%</td></tr>',
                '</table>'
            ).compile(),
            
            // Define the static columns
            columns : [
                {
                    header : '任务', 
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
                    header : '开始时间', 
                    sortable:true, 
                    width:90, 
                    dataIndex : 'StartDate', 
                    locked : true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    editor : new Ext.form.DateField({
                        allowBlank : false,
                        format: 'Y-m-d'
                    })
                },
                {
                    header : '工期 d', 
                    sortable:true, 
                    width:50, 
                    dataIndex : 'Duration', 
                    renderer: function(v, m, r) {
                        var start = r.get('StartDate'),     
                            end = r.get('EndDate');
                        if (start && end) {
                            var d = Math.round(Sch.util.Date.getDurationInDays(start, end));
                            if (d > 0) {
                                return d;
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
                    header : '进度 %', 
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
            tbar : [
				{
					icon : 'images/select.gif',
					text : '选择项目',
                    scope : this,
                    handler : function() {
						window.top.JxUtil.selectPlan();
                    }
				},
				{
                    iconCls : 'icon-prev',
                    scope : this,
					tooltip: '显示前面的区域',
                    handler : function() {
                        this.shiftPrevious();
                    }
                },
                {
                    iconCls : 'icon-next',
                    scope : this,
					tooltip: '显示后面的区域',
                    handler : function() {
                        this.shiftNext();
                    }
                },
				{
					tooltip : '显示完整进度',
					iconCls : 'zoomfit',
					handler : function() {
						var first = new Date(9999,0,1), last = new Date(0);
						
						this.taskStore.each(function(r) {
							first = Sch.util.Date.min(r.get('StartDate'),first);
							last = Sch.util.Date.max(r.get('EndDate'),last);
						});
						
						if (first - new Date(9999,0,1) !== 0 && last - new Date(0) !== 0){
							this.setTimeSpan(first, last);
							//this.fitTimeColumns();
						}
					},
					scope : this
				},
				{
					xtype : 'textfield',
					emptyText : '查找任务...',
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
				},{
					iconCls : 'eb_save',
					text : '保存',
                    scope : this,
					tooltip: '保存',
                    handler : function() {
						window.top.JxUtil.savePlan(this);
                    }
				}
				/*,
				{
					text : '显示关键路径',
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
				}*/
            ]
        });
        
        JxGanttPanel.superclass.initComponent.apply(this, arguments);
    }
});