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
Ext.ns('App');

Ext.onReady(function() {
	//修改Component状态支持缺省值为否，设置所有控件都不保存状态。
	Ext.Component.prototype.stateful = false;
    Ext.QuickTips.init();
    
    App.Gantt.init();
	if (DATAID.length > 0) {
		 App.Gantt.reloadData(DATAID);
	};
});

App.Gantt = {
    // Initialize application
    init : function(serverCfg) {        
        this.gantt = this.createGantt();
        
        var vp = new Ext.Viewport({
			border : false,
            layout : 'border',
            items : [
                this.gantt
            ]
        });
    },
	
    beforeEdit : function(o) {
        var r = o.record;

        // Set the duration field to help the editor get the value
        if (o.field === 'Duration' && r.get('StartDate') && r.get('EndDate')) {
            var durationDays = Math.round(Sch.util.Date.getDurationInHours(r.get('StartDate'), r.get('EndDate'))/12) / 2;
            
            r.set('Duration', durationDays);
        }
    },
    
    afterEdit : function(o) {
        if (o.field === 'Duration') {
            var start = o.record.get('StartDate');
            o.record.set('EndDate', Sch.util.Date.add(start, Sch.util.Date.HOUR, o.value * 24));
        } else if (o.field === 'StartDate' && o.value) {
            var dur = o.record.get('EndDate') - o.originalValue;
            o.record.set('EndDate', Sch.util.Date.add(o.value, Sch.util.Date.MILLI, dur));
        }
    },
    
    createGantt : function() {
		//处理显示日期的格式
      	var M = Sch.gantt.ViewPresets,
		vp = M.weekAndDayLetter;
		if (vp) {
			vp.headerConfig.middle.dateFormat = 'Y-m-d';
			vp.headerConfig.middle.align = 'center';
		}
	
        var store = new Ext.ux.maximgb.tg.AdjacencyListStore({
            defaultExpanded : true,
            proxy : new Ext.data.HttpProxy({
                url : CONTEXTPATH + '/commonAction.do?eventcode=querytask&funid=project_plan&pagetype=editgrid&user_id=' + USERID,
                method:'GET'
            }),
		    reader: new Ext.data.JsonReader({idProperty : 'Id', root: 'data'}, [
                    // Mandatory fields
     	            {name:'Id'},
                    {name:'Name', type:'string'},
					{name:'PlanId', type:'string'},
                    {name:'StartDate', type : 'date', dateFormat:'c'},
                    {name:'EndDate', type : 'date', dateFormat:'c'},
                    {name:'PercentDone'},
                    {name:'ParentId', type: 'auto'},
                    {name:'IsLeaf', type: 'bool'},

                    // Your task meta data goes here
                    {name:'Responsible'},
                    {name:'Duration'}
                ]
            )
        });
        
        var dependencyStore = new Ext.data.JsonStore({   
            idProperty : 'Id',
            proxy : new Ext.data.HttpProxy({
                url : CONTEXTPATH + '/commonAction.do?eventcode=querydepend&funid=project_plan&pagetype=editgrid&user_id=' + USERID,
                method:'GET'
            }),
			root: 'data',
			fields : [
                // 3 mandatory fields
                {name:'From'},
                {name:'To'},
                {name:'Type'}
            ]
        });
        
        var g = new JxGanttPanel({
            region : 'center',
            taskStore : store,
            dependencyStore : dependencyStore,
            //startDate : new Date(2011,9,4),
            //endDate : Sch.util.Date.add(new Date(2011,9,4), Sch.util.Date.WEEK, 10), 
            viewPreset : 'weekAndDayLetter'
        });
        
        g.on({
            dependencydblclick : function(ga, rec) {
                var from = store.getById(rec.get('From')).get('Name'),
                    to = store.getById(rec.get('To')).get('Name');
                Ext.Msg.alert('提示', String.format('你点击了依赖关系【"{0}"】与【"{1}"】', from, to));
				//jx.base.hint jx.bus.text1
            },
            beforeedit: this.beforeEdit, 
            afteredit : this.afterEdit,
            scope : this
        });
		
		//隐藏LOGO标志
		var fn = function() {
			var mya = Ext.select('a');
			mya.each(function(el){
				var href = el.dom.href;
				if (href.indexOf('www.ext-scheduler.com') >= 0) {
					el.remove();
				}
			});
		};
		(new Ext.util.DelayedTask(fn)).delay(500);

        return g;
    },
	
	//加载项目计划数据
	reloadData: function(dataId) {
		if (dataId == null || dataId.length == 0) {
			dataId = this.gantt.dataId;
		} else {
			this.gantt.dataId = dataId;
		}
		DATAID = dataId;
		
		var store1 = this.gantt.getTaskStore();
		store1.load({params:{mplanid:dataId}});
		
		var store2 = this.gantt.getDependencyStore();
		store2.load({params:{mplanid:dataId}});
	}
};

if (!Ext.isIE && Ext.ux && Ext.ux.form && Ext.ux.form.SpinnerField && Ext.ux.form.SpinnerField.prototype.onBlur === Ext.emptyFn) {
    Ext.ux.form.SpinnerField.prototype.onBlur = Ext.ux.form.SpinnerField.superclass.onBlur;
}   