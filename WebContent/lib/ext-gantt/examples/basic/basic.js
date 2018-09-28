Ext.ns('App');

Ext.onReady(function() {App.Gantt.init(); });

App.Gantt = {
    
    // Initialize application
    init : function(serverCfg) {  
        Ext.QuickTips.init();      
       
        var taskStore = new Ext.ux.maximgb.tg.AdjacencyListStore({
            defaultExpanded : true,
    	    autoLoad : true,
            proxy : new Ext.data.HttpProxy({
                url : 'tasks.xml',
                method:'GET'
            }),
		   reader: new Ext.data.XmlReader({
                // records will have a 'Task' tag
                record: 'Task',
                idPath: "Id",
                fields : [
                    // Mandatory fields
     	            {name:'Id'},
                    {name:'Name', type:'string'},
                    {name:'StartDate', type : 'date', dateFormat:'c'},
                    {name:'EndDate', type : 'date', dateFormat:'c'},
                    {name:'PercentDone'},
                    {name:'ParentId', type: 'auto'},
                    {name:'IsLeaf', type: 'bool'},

                    // Your task meta data goes here
                    {name:'Responsible'}
                ]
            })
        });

        var dependencyStore = new Ext.data.Store({   
            autoLoad : true,
            proxy : new Ext.data.HttpProxy({
                url : 'dependencies.xml',
                method:'GET'
            }),
            reader: new Ext.data.XmlReader({
                // records will have a 'Task' tag
                record: 'Link',
                fields : [
                    // 3 mandatory fields
                    {name:'From'},
                    {name:'To'},
                    {name:'Type', type : 'int'}
                ]
            })
        });
        

        var colSlider = new Ext.slider.SingleSlider({
            width : 120,
            value : Sch.PresetManager.getPreset('weekAndDayLetter').timeColumnWidth,
            minValue : 80,
            maxValue : 240,
            increment : 10
        });
        
        var g = new Sch.gantt.GanttPanel({
            height : 600,
            width: 1000,
            renderTo : Ext.getBody(),
            leftLabelField : 'Name',
            highlightWeekends : false,
            showTodayLine : true,
            loadMask : true,
            enableDependencyDragDrop : false,
            //snapToIncrement : true,
            stripeRows : true,
            
            startDate : new Date(2010,0,4), 
            endDate : Sch.util.Date.add(new Date(2010,0,4), Sch.util.Date.WEEK, 20), 
            viewPreset : 'weekAndDayLetter',
            
            tooltipTpl : new Ext.XTemplate(
                '<h4 class="tipHeader">{Name}</h4>',
                '<table class="taskTip">', 
                    '<tr><td>Start:</td> <td align="right">{[values.StartDate.format("y-m-d")]}</td></tr>',
                    '<tr><td>End:</td> <td align="right">{[values.EndDate.format("y-m-d")]}</td></tr>',
                    '<tr><td>Progress:</td><td align="right">{PercentDone}%</td></tr>',
                '</table>'
            ).compile(),
            
            
            // Setup your static columns
            columns : [
                {
                    header : 'Tasks', 
                    sortable:true, 
                    dataIndex : 'Name', 
                    locked : true,
                    width:250, 
                    editor : new Ext.form.TextField()
                }
            ],

            taskStore : taskStore,
            dependencyStore : dependencyStore,
            plugins : [
                new Sch.plugins.Pan(), 
                this.depEditor = new Sch.gantt.plugins.DependencyEditor({
                    buttons : [
                        {
                            text : 'Ok',
                            scope : this,
                            handler : function() {  
                                var formPanel = this.depEditor;
                                formPanel.getForm().updateRecord(formPanel.dependencyRecord);
                                this.depEditor.collapse();
                            }
                        },
                        {
                            text : 'Cancel',
                            scope : this,
                            handler : function() {
                                this.depEditor.collapse();
                            }
                        },
                        {
                            text : 'Delete',
                            scope : this,
                            handler : function() {
                                var formPanel = this.depEditor,
                                    record = this.depEditor.dependencyRecord;
                                record.store.remove(record);
                                formPanel.collapse();
                            }
                        }
                    ]
                })
            ],
            tbar : [
                {
                    text : 'Add new task...',
                    iconCls : 'icon-add',
                    handler : function() {
                        var lastStart = taskStore.getAt(taskStore.getCount() - 1).get('StartDate'),
                            newTask = new taskStore.recordType({
                                StartDate : lastStart,
                                EndDate : Sch.util.Date.add(lastStart, Sch.util.Date.DAY, 5),
                                Name : 'New task',
                                PercentDone : 0,
                                ParentId : null,
                                IsLeaf : true
                            });

                        taskStore.add(newTask);
                    }
                },
                {
                    enableToggle : true,
                    text : 'Read only mode',
                    pressed : false,
                    handler : function() {
                        g.setReadOnly(this.pressed);
                    }
                },
                '->',
                {
                    xtype : 'label',
                    text : 'Column Width'
                },
                ' ',
                colSlider
            ]
        });

        colSlider.on({
            change : function(s, v) {
                g.updateTimeColumnHeaderWidths(v);
            },
            changecomplete : function(s, v) {
                g.setTimeColumnWidth(v);
            }
        });
    }
};
