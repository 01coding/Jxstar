/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 甘特图功能布局。
 * iframe内取外部js对象，如：window.top.JxUtil.selectPlan();
 * iframe外取内部js对象，如：frm.contentWindow.App.Gantt.reloadData();
 * 
 * @author TonyTan
 * @version 1.0, 2011-10-06
 */

Jxstar.currentPage = function(define, dataId) {
	if (dataId == null) dataId = '';
	var frmid = "frmGantt_Plan";//parseInt(Math.random() * 10000);
	
	var ganttPanel = new Ext.Panel({
		pagetype:'formrpt',
		layout:'fit',
		border:false,
		closable: false,
		iconCls:'tab_form',
		html:'<iframe id="'+ frmid +'" frameborder="no" style="display:none;border-width:0;"></iframe>'
	});
	
	ganttPanel.on('beforedestroy', function(t){
		JxUtil.savePlan = null;
		JxUtil.selectPlan = null;
	
		Ext.fly(frmid).remove();
		return true;
	});
	
	//选择需要编制实际进度的项目
	JxUtil.selectPlan = function() {
		var hdcall = function(grid) {
			JxUtil.delay(500, function(){
				Jxstar.loadData(grid, {where_sql:'auditing = ?', where_value:'1', where_type:'string'});
			});
		};

		//显示数据
		var define = Jxstar.findNode('project_mplan');
		Jxstar.showData({
			filename: define.gridpage,
			title: define.nodetitle,
			pagetype: 'selgrid1',
			nodedefine: define,
			callback: hdcall
		});
	};
	
	//保存修改后的实际进度
	JxUtil.savePlan = function(gantt) {
		var mrow = gantt.taskStore.getModifiedRecords();
		if (mrow.length == 0) {
			JxHint.alert('没有修改记录，不需要保存！');//jx.bus.text2
			return;
		}
		
		var keys = '';
		for (var i = 0, n = mrow.length; i < n; i++) {
			keys += '&keyid=' + mrow[i].get('PlanId');
		}
		
		var params = 'funid=project_plan' + keys + '&pagetype=editgrid&eventcode=saveplan';
		Ext.each(mrow, function(item) {
			params += '&task_content=' + encodeURIComponent(item.get('Name'));
			params += '&done_sdate=' + item.get('StartDate').dateFormat('Y-m-d');
			params += '&done_edate=' + item.get('EndDate').dateFormat('Y-m-d');
			params += '&done_day=' + item.get('Duration');
			params += '&done_ratio=' + item.get('PercentDone');
		});
		
		var endcall = function(){
			gantt.taskStore.commitChanges();
		};
		Request.postRequest(params, endcall);
	};
	
	JxUtil.delay(500, function(){
		var href = Jxstar.path + "/jxstar/gantt/advanced.jsp?user_id=" + Jxstar.session['user_id'] + "&dataid=" + dataId;
	
		var frm = Ext.get(frmid);
		frm.setWidth(ganttPanel.getWidth());
		frm.setHeight(ganttPanel.getHeight());
		frm.dom.src = href + '&_dc=' + (new Date()).getTime();
		frm.show();
	});
	
	return ganttPanel;
};
