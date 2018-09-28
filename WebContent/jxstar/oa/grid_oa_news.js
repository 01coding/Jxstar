﻿Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataaudit = Jxstar.findComboData('audit');
	var Datanewstype = Jxstar.findComboData('newstype');
	var Datayesno = Jxstar.findComboData('yesno');

	var cols = [
	{col:{header:'状态', width:92, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataaudit
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataaudit[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataaudit.length; i++) {
				if (Dataaudit[i][0] == value)
					return Dataaudit[i][1];
			}
		}}, field:{name:'oa_news__state',type:'string'}},
	{col:{header:'公告标题', width:272, sortable:true}, field:{name:'oa_news__news_title',type:'string'}},
	{col:{header:'信息类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datanewstype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datanewstype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datanewstype.length; i++) {
				if (Datanewstype[i][0] == value)
					return Datanewstype[i][1];
			}
		}}, field:{name:'oa_news__cont_type',type:'string'}},
	{col:{header:'公告内容', width:100, sortable:true, hidden:true}, field:{name:'oa_news__news_cont',type:'string'}},
	{col:{header:'发布时间', width:154, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'oa_news__edit_date',type:'date'}},
	{col:{header:'发布人', width:100, sortable:true}, field:{name:'oa_news__edit_user',type:'string'}},
	{col:{header:'发布单位', width:100, sortable:true}, field:{name:'oa_news__dept_name',type:'string'}},
	{col:{header:'置顶？', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datayesno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'oa_news__is_top',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_news__news_id',type:'string'}},
	{col:{header:'编号', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_news__news_code',type:'string'}},
	{col:{header:'发布人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_news__edit_userid',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_news__dept_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'oa_news'
	};
	
	
	config.eventcfg = {
	};
		
	return new Jxstar.GridNode(config);
}