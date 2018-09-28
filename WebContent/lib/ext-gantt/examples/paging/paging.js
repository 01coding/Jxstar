Ext.ns('App');

Ext.onReady(function() {App.Gantt.init(); });

App.Gantt = {
    
    // Initialize application
    init : function(serverCfg) {  
        Ext.QuickTips.init();      
        
    
        var start = new Date(2010,0,1),
            end = Sch.util.Date.add(start, Sch.util.Date.WEEK, 10);
        
        var store = new Ext.ux.maximgb.tg.AdjacencyListStore({
            defaultExpanded : true,
            proxy : new Ext.ux.data.PagingMemoryProxy(taskData),
		    reader: new Ext.data.JsonReader({idProperty : 'Id'}, [
                    // Mandatory fields
     	            {name:'Id'},
                    {name:'Name', type:'string'},
                    {name:'StartDate', type : 'date', dateFormat:'c'},
                    {name:'EndDate', type : 'date', dateFormat:'c'},
                    {name:'PercentDone'},
                    {name:'ParentId', type: 'auto'},
                    {name:'IsLeaf', type: 'bool'}
                ]
            )
        });
        
        var g = new Sch.gantt.GanttPanel({
            height : 600,
            width: 1000,
            renderTo : Ext.getBody(),
            leftLabelField : 'Name',
            highlightWeekends : false,
            showTodayLine : false,
            enableDependencyDragDrop : false,
            
            startDate : start, 
            endDate : end, 
            viewPreset : 'weekAndMonth',
            
            // Setup your static columns
            columns : [
                {
                    header : 'Tasks', 
                    sortable:true, 
                    dataIndex : 'Name', 
                    locked : true,
                    width:250
                }
            ],
            taskStore : store,
            stripeRows : true,
            plugins : [new Sch.plugins.Pan()],
            
            // paging bar on the bottom
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: store,
                displayInfo: true,
                displayMsg: 'Displaying tasks {0} - {1} of {2}',
                emptyMsg: "No tasks to display"
            })
        });
        
        store.load({
            params : {
                start : 0,
                limit : 25
            }
        });
    }
};

// Records are already sorted for this example, no need to re-sort
Ext.override(Ext.ux.maximgb.tg.AbstractTreeStore, {
    applyTreeSort : Ext.emptyFn
});