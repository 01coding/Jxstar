Ext.ns('App');

Ext.onReady(function() {App.Gantt.init(); });

App.Gantt = {
    
    // Initialize application
    init : function(serverCfg) {  
        Ext.QuickTips.init();      
        
        var store = new Ext.ux.maximgb.tg.AdjacencyListStore({
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
                    {name:'ParentId', type: 'auto'},
                    {name:'IsLeaf', type: 'bool'},

                    // Your task meta data goes here
                    {name:'Responsible'}
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
        
        var g = new Sch.gantt.GanttPanel({
            height : 600,
            width: 1000,
            renderTo : Ext.getBody(),
            leftLabelField : 'Name',
            highlightWeekends : true,
            showTodayLine : true,
            loadMask : true,
            enableDependencyDragDrop : false,
            
            cls : 'style1',
            tbar : [
                {
                    text : 'Style 1',
                    iconCls : 'theme',
                    scale : 'large',
                    handler : function() {
                        g.el.removeClass(['style2', 'style3']).addClass('style1');
                        g.view.refresh();
                    }
                },
                {
                    text : 'Style 2',
                    iconCls : 'theme',
                    scale : 'large',
                    handler : function() {
                        g.el.removeClass(['style1', 'style3']).addClass('style2');
                        g.view.refresh();
                    }
                },
                {
                    iconCls : 'theme',
                    text : 'Style 3',
                    scale : 'large',
                    handler : function() {
                        g.el.removeClass(['style2', 'style1']).addClass('style3');
                        g.view.refresh();
                    }
                }
            ],

            startDate : new Date(2010,0,11), 
            endDate : Sch.util.Date.add(new Date(2010,0,4), Sch.util.Date.WEEK, 20), 
            viewPreset : 'weekAndDayLetter',
            
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
            dependencyStore : dependencyStore,
            trackMouseOver : false,
            stripeRows : true
        });
    }
};
