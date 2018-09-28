Ext.ns('App');

Ext.onReady(function() {App.Gantt.init(); });

App.Gantt = {
    // Initialize application
    init : function() {
        Ext.QuickTips.init();   
        
        var resourceStore = new Ext.data.JsonStore({
            sortInfo:{field: 'Name', direction: "ASC"},
            idProperty : 'Id',
            fields : [
                {name: 'Id'},
                {name: 'Name'},
                {name: 'FavoriteColor'}
            ],
            data : [
                {Id : '1', Name : 'Mike', FavoriteColor : 'blue'},
                {Id : '2', Name : 'Linda', FavoriteColor : 'red'},
                {Id : '3', Name : 'Don', FavoriteColor : 'yellow'},
                {Id : '4', Name : 'Karen', FavoriteColor : 'black'},
                {Id : '5', Name : 'Doug', FavoriteColor : 'green'},
                {Id : '6', Name : 'Peter', FavoriteColor : 'lime'}
            ]
        });
        
        // Store holding all the events
        var eventStore = new Ext.data.JsonStore({
            fields : [
                {name: 'ResourceId'},
                {name: 'StartDate', type : 'date', dateFormat : 'Y-m-d G:i'},
                {name: 'EndDate', type : 'date', dateFormat : 'Y-m-d G:i'},
                {name: 'Title'}
            ],
            data : [
                {ResourceId: '1', Title : 'Assignment 1', StartDate : "2010-12-09 10:00", EndDate : "2010-12-09 11:00"},
                {ResourceId: '2', Title : 'Assignment 2', StartDate : "2010-12-09 10:00", EndDate : "2010-12-09 12:00"},
                {ResourceId: '3', Title : 'Assignment 3', StartDate : "2010-12-09 13:00", EndDate : "2010-12-09 15:00"}
            ]
        });
           
        this.initScheduler(resourceStore, eventStore);
        this.initGantt(resourceStore);
    },
        
    initScheduler : function(resourceStore, eventStore) {
        var scheduler = new Sch.SchedulerPanel({
            loadMask : true,
            title : 'Basic scheduler panel',
            eventBarTextField : 'Title',
            snapToIncrement : false,
            viewPreset : 'hourAndDay',
            startDate : new Date(2010, 11, 9, 8),
            endDate : new Date(2010, 11, 9, 16),
            renderTo : 'scheduler',
            height : 250,
            width : 900,
            clicksToEdit : 1,

            // Setup static columns
            columns : [
                {header : 'Name', width:100, dataIndex : 'Name', editor : new Ext.form.TextField()},
                {header : 'Favorite Color', width:70, dataIndex : 'FavoriteColor'}
            ],
                            
            // Store holding all the categories
            resourceStore : resourceStore,
            eventStore : eventStore,

            tbar : [
                {
                    iconCls : 'icon-prev',
                    scope : this,
                    handler : function() {
                        scheduler.shiftPrevious();
                    }
                },
                '->',
                {
                    iconCls : 'icon-next',
                    scope : this,
                    handler : function() {
                        scheduler.shiftNext();
                    }
                }
            ]
        });
    },

    initGantt : function(resourceStore) {
       
        var taskStore = new Ext.ux.maximgb.tg.AdjacencyListStore({
            defaultExpanded : true,
    	    autoLoad : true,
            proxy : new Ext.data.HttpProxy({
                url : 'tasks.json',
                method:'GET'
            }),
		    reader: new Ext.data.JsonReader({idProperty : 'Id'}, [
                    // Mandatory fields
     	            {name:'Id'},
                    {name:'Name', type:'string'},
                    {name:'StartDate', type : 'date', dateFormat:'c'},
                    {name:'EndDate', type : 'date', dateFormat:'c'},
                    {name:'PercentDone'},
                    {name:'ParentId'},
                    {name:'IsLeaf', type: 'bool'},

                    // Your task meta data goes here
                    {name:'AssignedResources'}
                ]
            )
        });
        
        var dependencyStore = new Ext.data.JsonStore({   
            autoLoad : true,
            proxy : new Ext.data.HttpProxy({
                url : 'dependencies.json',
                method:'GET'
            }),
            fields : [
                // 3 mandatory fields
                {name:'From'},
                {name:'To'},
                {name:'Type'}
            ]
        });

        var resourceRenderer = function(value){ 
    	    var valueList = [],
    	        findArr = value.split(','),
    	        i, l=findArr.length;

    	    for (i=0; i<l; i++) {
    		    if (record = resourceStore.getById(findArr[i])) {
    			    valueList.push(record.get('Name'));
    		    }
    	    }
    	    return valueList.join(', ');
        };

        var gantt = new Sch.gantt.GanttPanel({
            height : 300,
            width : 900,
            renderTo : 'gantt',
            leftLabelField : 'Name',
            rightLabelField : {
                dataIndex : 'AssignedResources',
                renderer : resourceRenderer
            },
            highlightWeekends : true,
            loadMask : true,
            snapToIncrement : true,
            title : 'Gantt panel with tasks and resources',

            startDate : new Date(2010,0,11), 
            endDate : Sch.util.Date.add(new Date(2010,0,11), Sch.util.Date.WEEK, 20), 
            viewPreset : 'weekAndDayLetter',
            stripeRows : true,

            // Setup your static columns
            columns : [
                {
                    header : 'Tasks', 
                    sortable:true, 
                    dataIndex : 'Name', 
                    locked : true,
                    width:200
                },
                {
                    header : 'Assigned Resources', 
                    width:200, 
                    dataIndex : 'AssignedResources',
                    locked : true,
                    renderer : resourceRenderer
                }
            ],

            taskStore : taskStore,
            dependencyStore : dependencyStore,
            tbar : [
               {
                    iconCls : 'icon-prev',
                    scope : this,
                    handler : function() {
                        gantt.shiftPrevious();
                    }
                },
                '->',
                {
                    iconCls : 'icon-next',
                    scope : this,
                    handler : function() {
                        gantt.shiftNext();
                    }
                }
            ]
        });

        // Refresh gantt row if a resource is updated
        resourceStore.on('update', function(s, rec) {
            var resId = rec.get('Id'),
                view = gantt.getView();
            
            taskStore.each(function(t, index) {
                if (t.get('AssignedResources').split(',').indexOf(resId) >= 0) {
                    view.refreshRow(index);
                }
            });
        });
        resourceStore.on('load', function() { gantt.getView().refresh(); });
    }
};
