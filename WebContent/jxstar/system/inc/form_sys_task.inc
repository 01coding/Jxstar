	config.eventcfg = {	
		initOther: function(){
			var state = this.form.get('task_base__task_state');
			var tbar = this.page.getTopToolbar();
			//状态为注册的不需要禁用与重载
			//状态为生效的不需要启用
			//状态为禁用的不需要重载
			JxUtil.delay(500, function(){
				JxUtil.getButton(tbar, 'disable').setDisabled(state != '2');
				JxUtil.getButton(tbar, 'reload').setDisabled(state != '2');
				JxUtil.getButton(tbar, 'enable').setDisabled(state == '2');
				JxUtil.getButton(tbar, 'delete').setDisabled(state == '2');
			});
		},
		
		/**
		 * 手动执行
		 **/
		exetask: function() {
			var keyid = this.getPkField().getValue();
			if (keyid.length == 0) {
				JxHint.alert(jx.event.nosave);
				return;
			}
			
			var self = this;
			var hdcall = function() {
				//发送请求
				var params = 'funid=sys_task&pagetype=form&eventcode=exetask&keyid=' + keyid;
				Request.postRequest(params, null);
			};
			
			Ext.Msg.confirm(jx.base.hint, '确定手动执行一次定时任务？', function(btn) {
				if (btn == "yes") hdcall();
			});
		},
		
		/**
		 * 启用后台任务
		 **/
		enable: function() {
			var keyid = this.getPkField().getValue();
			if (keyid.length == 0) {
				JxHint.alert(jx.event.nosave);
				return;
			}
			
			var self = this;
			var hdcall = function() {
				var endcall = function() {
					self.form.oset('task_base__task_state', '2');
					self.form.myRecord.set('task_base__task_state', '2');
					self.form.myRecord.commit();
					self.initOther();
				};
				//发送请求
				var params = 'funid=sys_task&pagetype=form&eventcode=enable&keyid=' + keyid;
				Request.postRequest(params, endcall);
			};
			
			Ext.Msg.confirm(jx.base.hint, jx.sys.useyes, function(btn) {
				if (btn == "yes") hdcall();
			});
		},
		
		/**
		 * 禁用后台任务
		 **/
		disable: function() {
			var keyid = this.getPkField().getValue();
			if (keyid.length == 0) {
				JxHint.alert(jx.event.nosave);
				return;
			}
			
			var self = this;
			var hdcall = function() {
				var endcall = function() {
					self.form.oset('task_base__task_state', '3');
					self.form.myRecord.set('task_base__task_state', '3');
					self.form.myRecord.commit();
					self.initOther();
				};
				//发送请求
				var params = 'funid=sys_task&pagetype=form&eventcode=disable&keyid=' + keyid;
				Request.postRequest(params, endcall);
			};
			
			Ext.Msg.confirm(jx.base.hint, jx.sys.disyes, function(btn) {
				if (btn == "yes") hdcall();
			});
		},
		
		/**
		 * 重新加载后台任务
		 **/
		reload: function() {
			var keyid = this.getPkField().getValue();
			if (keyid.length == 0) {
				JxHint.alert(jx.event.nosave);
				return;
			}
			//发送请求
			var params = 'funid=sys_task&pagetype=form&eventcode=reload&keyid=' + keyid;
			Request.postRequest(params, null);
		},
	
		/**
		 * 显示执行计划设置界面
		 **/
		setplan: function() {
			var self = this;
			//取执行计划
			var datePlan = self.form.get('task_base__task_plan');
			//取任务状态
			var taskState = self.form.get('task_base__task_state');
			
			//取设置FORM
			var planForm = self.createPlanForm();
			
			//创建对话框
			var win = new Ext.Window({
				title:jx.sys.plantitle,	//'设置执行计划'
				layout:'fit',
				width:750,
				height:470,
				resizable: false,
				modal: true,
				closeAction:'close',
				items:[planForm],

				buttons: [{
					text:jx.sys.view,	//'预览'
					handler:function(){
						self.viewDatePlan(planForm);
					}
				},{
					text:jx.base.ok,	//'确定'
					handler:function(){
						//取设置后的执行计划
						var newPlan = self.getDatePlan(planForm);
						self.form.set('task_base__task_plan', newPlan);
						win.close();
					}
				},{
					text:jx.base.cancel,	//'取消'
					handler:function(){win.close();}
				}]
			});
			win.show();
			
			//设置值
			this.setDatePlan(planForm, datePlan);
		},
		
		/**
		 * 创建执行计划设置FORM界面
		 **/
		createPlanForm: function() {
			//星期值
			var weekdays = ComboData.weekdays;
			//哪一周
			var weeknums = ComboData.weeknums;
			//哪一月
			var monthnums = ComboData.monthnums;
		
			var planForm = new Ext.form.FormPanel({
				bodyStyle:'padding: 5px',
				border: false,
				frame: false,
				baseCls:'x-plain',
				layout:'column',
				labelWidth:10,
				items: [{
                    style:'padding:5px; margin-right:10px',
					columnWidth:0.8,
                    baseCls:'xf-panel',
					title:jx.sys.seltitle,	//'选择时间间隔'
					defaults:{height:35},
					items: [
						{
							xtype:'compositefield',
							items: [
								{xtype:'radio', name:'planType', inputValue:'min', checked: true},
								{xtype:'displayfield', value:jx.sys.each},	//'每'
								{xtype:'numberfield', allowDecimals:false, name:'min_num', value:'1', width:40},
								{xtype:'displayfield', value:jx.sys.minute}	//'分钟'
							]
						},{
							xtype:'compositefield',
							items: [
								{xtype:'radio', name:'planType', inputValue:'hour'},
								{xtype:'displayfield', value:jx.sys.each},	//'每'
								{xtype:'numberfield', allowDecimals:false, name:'hour_num', value:'1', width:40},
								{xtype:'displayfield', value:jx.sys.hour},	//'小时，第'
								{xtype:'numberfield', allowDecimals:false, name:'hour_min', value:'00', maxValue:59, width:40},
								{xtype:'displayfield', value:jx.sys.minute}	//'分钟'
							]
						},{
							xtype:'compositefield',
							items: [
								{xtype:'radio', name:'planType', inputValue:'day'},
								{xtype:'displayfield', value:jx.sys.each},	//'每'
								{xtype:'numberfield', allowDecimals:false, name:'day_num', value:'1', width:40},
								{xtype:'displayfield', value:'天，时间是'},
								{xtype:'textfield',    name:'day_time', value:'00:00', vtype:'time24', width:60}
							]
						},{
							xtype:'compositefield',
							items: [
								{xtype:'radio', name:'planType', inputValue:'week'},
								{xtype:'displayfield', value:jx.sys.each},	//'每'
								{xtype:'numberfield', allowDecimals:false, name:'week_num', value:'1', width:40},
								{xtype:'displayfield', value:jx.sys.week},	//'周，日期是'
								{xtype:'combo',    name:'week_day', width:100, 
									store: new Ext.data.SimpleStore({
										fields:['value','text'],
										data: weekdays
									}),
									mode:'local',
									triggerAction:'all',
									valueField:'value',
									displayField:'text',
									value: weekdays[0][0]},
								{xtype:'displayfield', value:jx.sys.time},	//'，时间是'
								{xtype:'textfield',    name:'week_time', value:'00:00', width:60}
							]
						},{
							xtype:'compositefield',
							items: [
								{xtype:'radio', name:'planType', inputValue:'month'},
								{xtype:'displayfield', value:jx.sys.each},	//'每'
								{xtype:'numberfield', allowDecimals:false, name:'month_num', value:'1', width:40},
								{xtype:'displayfield', value:jx.sys.monthdate},	//'个月，日期是'
								{xtype:'numberfield', allowDecimals:false, name:'month_day', value:'1', maxValue:31, width:40},
								{xtype:'displayfield', value:jx.sys.time},	//'，时间是'
								{xtype:'textfield',    name:'month_time', value:'00:00', width:60}
							]
						},{
							xtype:'compositefield',
							items: [
								{xtype:'radio', name:'planType', inputValue:'monthw'},
								{xtype:'displayfield', value:jx.sys.each},	//'每'
								{xtype:'numberfield', allowDecimals:false, name:'monthw_num', value:'1', width:40},
								{xtype:'displayfield', value:jx.sys.month},	//'个月，'
								{xtype:'combo',    name:'monthw_week', width:100,
									store: new Ext.data.SimpleStore({
										fields:['value','text'],
										data: weeknums
									}),
									mode:'local',
									triggerAction:'all',
									valueField:'value',
									displayField:'text',
									value: weeknums[0][0]},
								{xtype:'displayfield', value:jx.sys.date},	//'，日期是'
								{xtype:'combo',    name:'monthw_day', width:100,
									store: new Ext.data.SimpleStore({
										fields:['value','text'],
										data: weekdays
									}),
									mode:'local',
									triggerAction:'all',
									valueField:'value',
									displayField:'text',
									value: weekdays[0][0]},
								{xtype:'displayfield', value:jx.sys.time},	//'，时间是'
								{xtype:'textfield',    name:'monthw_time', value:'00:00', width:60}
							]
						},{
							xtype:'compositefield',
							items: [
								{xtype:'radio', name:'planType', inputValue:'year'},
								{xtype:'displayfield', value:jx.sys.each},	//'每'
								{xtype:'numberfield', allowDecimals:false, name:'year_num', value:'1', width:40},
								{xtype:'displayfield', value:jx.sys.yearm},	//'年，月份是'
								{xtype:'combo',    name:'year_month', width:100,
									store: new Ext.data.SimpleStore({
										fields:['value','text'],
										data: monthnums
									}),
									mode:'local',
									triggerAction:'all',
									valueField:'value',
									displayField:'text',
									value: monthnums[0][0]},
								{xtype:'displayfield', value:jx.sys.date},	//'，日期是'
								{xtype:'numberfield', allowDecimals:false, name:'year_day', value:'1', maxValue:31, width:40},
								{xtype:'displayfield', value:jx.sys.time},	//'，时间是'
								{xtype:'textfield',    name:'year_time', value:'00:00', width:60}
							]
						},{
							xtype:'compositefield',
							items: [
								{xtype:'radio', name:'planType', inputValue:'yearw'},
								{xtype:'displayfield', value:jx.sys.each},	//'每'
								{xtype:'numberfield', allowDecimals:false, name:'yearw_num', value:'1', width:40},
								{xtype:'displayfield', value:jx.sys.year},	//'年，'
								{xtype:'combo',    name:'yearw_week', width:100,
									store: new Ext.data.SimpleStore({
										fields:['value','text'],
										data: weeknums
									}),
									mode:'local',
									triggerAction:'all',
									valueField:'value',
									displayField:'text',
									value: weeknums[0][0]},
								{xtype:'displayfield', value:jx.sys.date},	//'，日期是'
								{xtype:'combo',    name:'yearw_day', width:100,
									store: new Ext.data.SimpleStore({
										fields:['value','text'],
										data: weekdays
									}),
									mode:'local',
									triggerAction:'all',
									valueField:'value',
									displayField:'text',
									value: weekdays[0][0]},
								{xtype:'displayfield', value:jx.sys.time},	//'，时间是'
								{xtype:'textfield',    name:'yearw_time', value:'00:00', width:60}
							]
						}
					]
				},{
					bodyStyle:'padding: 5px 0',
					columnWidth:0.2,
					layout:'form',
					labelWidth:1,
                    baseCls:'xf-panel',
					title:jx.sys.viewplan,	//'预览计划'
					items: [{
							xtype:'textarea',
							name:'date_plan',
							readOnly: true,
							height: 308,
                            width:145
						}
					]
				}]
			});

			return planForm;
		},
		
		/**
		 * 取执行计划字符串
		 **/
		getDatePlan: function(planForm) {
			var ff = function(n) {
				return planForm.getForm().get(n);
			};
			var planType = planForm.getForm().findField('planType').getGroupValue();
			
			var datePlan = '';
			if (planType == 'min') {
				datePlan = 'min=' + ff('min_num') + 'm';
			} else if (planType == 'hour') {
				datePlan = 'hour=' + ff('hour_num') + 'h,' + ff('hour_min') + 'm';
			} else if (planType == 'day') {
				datePlan = 'day=' + ff('day_num') + 'd,' + ff('day_time') + 't';
			} else if (planType == 'week') {
				datePlan = 'week=' + ff('week_num') + 'w,' + ff('week_day') + 'd,' + ff('week_time') + 't';
			} else if (planType == 'month') {
				datePlan = 'month=' + ff('month_num') + 'm,' + ff('month_day') + 'd,' + ff('month_time') + 't';
			} else if (planType == 'monthw') {
				datePlan = 'monthw=' + ff('monthw_num') + 'm,' + ff('monthw_week') + 'w,' + ff('monthw_day') + 'd,' + ff('monthw_time') + 't';
			} else if (planType == 'year') {
				datePlan = 'year=' + ff('year_num') + 'y,' + ff('year_month') + 'm,' + ff('year_day') + 'd,' + ff('year_time') + 't';
			} else if (planType == 'yearw') {
				datePlan = 'yearw=' + ff('yearw_num') + 'y,' + ff('yearw_week') + 'w,' + ff('yearw_day') + 'd,' + ff('yearw_time') + 't';
			}
			
			return datePlan;
		},
		
		/**
		 * 预览执行计划
		 **/
		viewDatePlan: function(planForm) {
			//显示预览计划
			var endcall = function(data) {
				planForm.getForm().set('date_plan', data.plan);
			};
		
			var datePlan = this.getDatePlan(planForm);
			var params = 'funid=sys_task&pagetype=form&eventcode=plan'+
						 '&starttime=' + JxUtil.getTodayTime() + '&dateplan=' + datePlan;
			//发送请求
			Request.postRequest(params, endcall);
		},
		
		/**
		 * 设置执行计划
		 **/
		setDatePlan: function(planForm, datePlan) {
			var plans = datePlan.split('=');
			var planType = plans[0];
			var values = this.getValues(plans[1]);
			var fs = function(n, v) {
				planForm.getForm().set(n, v);
			};
			
			if (planType == 'min') {
				fs('min_num', values[0]);
			} else if (planType == 'hour') {
				fs('hour_num', values[0]);
				fs('hour_min', values[1]);
			} else if (planType == 'day') {
				fs('day_num', values[0]);
				fs('day_time', values[1]);
			} else if (planType == 'week') {
				fs('week_num', values[0]);
				fs('week_day', values[1]);
				fs('week_time', values[2]);
			} else if (planType == 'month') {
				fs('month_num', values[0]);
				fs('month_day', values[1]);
				fs('month_time', values[2]);
			} else if (planType == 'monthw') {
				fs('monthw_num', values[0]);
				fs('monthw_week', values[1]);
				fs('monthw_day', values[2]);
				fs('monthw_time', values[3]);
			} else if (planType == 'year') {
				fs('year_num', values[0]);
				fs('year_month', values[1]);
				fs('year_day', values[2]);
				fs('year_time', values[3]);
			} else if (planType == 'yearw') {
				fs('yearw_num', values[0]);
				fs('yearw_week', values[1]);
				fs('yearw_day', values[2]);
				fs('yearw_time', values[3]);
			}
			
			var fe = planForm.getForm().el;
			var fd = fe.child('input[value='+planType+']', true);
			fd.checked = true;
		},
		
		getValues: function(plan) {
			var values = plan.split(',');
			for (var i = 0, n = values.length; i < n; i++) {
				values[i] = values[i].substring(0, values[i].length-1);
			}
			return values;
		}
	};