/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

/**
 * 处理多语言相关的工具类，系统支持根据当前语言环境调整初始的语言类型。
 * 全局语言对象有：
 * jx -- 自定义描述文字的语言对象
 * jeLang -- 按钮事件文字的语言对象
 * jfLang -- 菜单模块与功能名称的语言对象
 * jdLang -- 功能字段名的语言对象
 * ComboData -- 选项控件描述文字的语言对象
 * 
 * 本系统语言相关的文件有：
 * ext-lang-zh.js, jxstar-lang-zh.js, combo-lang-zh.js,
 * fun-lang-zh.js, event-lang-zh.js, field-lang-zh.js
 * 缺省状态下需要加载的语言文件有前三个文件，后三个采样页面文件中的文字；
 * 替换语言后，要清除原来的语言对象，重新加载所有语言文件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

//字段语言对象初始化
jdLang = {};
JxLang = {};
(function(){
	
	var changIndexLang = function() {
		Ext.fly('label_company').dom.innerHTML = jx.index.company + ' ' + jx.index.right + ' 2010';
		Ext.fly('label_usercode').dom.innerHTML = jx.index.usercode;
		Ext.fly('label_userpass').dom.innerHTML = jx.index.userpass;
		document.title = jx.index.proname + ' V1.0';
	};

	//把选择窗口where条件中的表名替换为多语言表名
	var langWhereSql = function(wheresql, cfg) {
		if (!wheresql || wheresql.length < 2) return wheresql;
		//源表名
		var orgtbl = cfg.orgTable;
		//多语言表名
		var langtbl = cfg.langTable;
		
		var re = new RegExp(orgtbl,"ig");  
		return wheresql.replace(re, langtbl);
	};
	//把主数据表替换为多语言表，表名前加 vl_xxx，字段名不变
	var langField = function(srcfield, cfg) {
		if (!srcfield || srcfield.length < 2) return srcfield;
		var fld = '', flds = '';
		//源表名
		var orgtbl = cfg.orgTable;
		//多语言表名
		var langtbl = cfg.langTable;
		
		//分解来源字段名
		var fields = srcfield.split(";");
		//第一个字段名必需带表名
		var tbl = fields[0].split(".")[0];
		//替换为多语言数据表
		if (tbl == orgtbl) tbl = langtbl;
		
		//根据每个字段，取来源数据写入目标数据对象中
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].length == 0) continue;
			//构建来源数据字段名
			var tmps = fields[i].split(".");
			if(tmps.length > 1){
				tbl = tmps[0];
				//替换为多语言数据表
				if (tbl == orgtbl) tbl = langtbl;
				
				fld = tbl + '.' + tmps[1];
			}else{
				fld = tbl + '.' + fields[i];
			}

			flds += fld+';';
		}
		if (flds.length > 0) flds = flds.substr(0, flds.length-1); 
		
		return flds;
	};
	
Ext.apply(JxLang, {
	//缺省母语类型
	BASE: 'zh',
	
	//当前系统语言类型
	type: 'zh',
	
	//多语言选择功能配置信息
	selectConfig: {},
	
	/**
	* 处理按钮文字的多语言，
	* 如果是功能自定义事件，则在功能事件中取值，否则在系统事件中取值
	* nodeId -- 功能ID
	* cfg -- 按钮配置对象
	*/
	eventLang: function(nodeId, cfg) {
		if (this.type == this.BASE) return;
		if (Ext.isEmpty(jeLang)) return;
		
		var ntext, code = cfg.eventCode;
		//先根据功能ID取值
		var lang = jeLang[nodeId];
		//如果是自定义事件，则有值
		if (lang) ntext = lang[code];
		//否则取系统事件中同名事件的值
		if (Ext.isEmpty(ntext)) ntext = (jeLang.sysevent)[code];
		
		//修改按钮的文字
		if (!Ext.isEmpty(ntext)) cfg.text = ntext;
	},
	
	/**
	* 处理菜单模块文字的多语言
	* moduleId -- 模块ID
	* text -- 母语文字
	*/
	moduleText: function(moduleId, text) {
		if (this.type == this.BASE) return text;
		if (Ext.isEmpty(jfLang)) return text;
		
		var ntext = jfLang.module[moduleId];
		return (ntext) ? ntext : text;
	},
	
	/**
	* 处理功能名称的多语言
	* nodeId -- 功能ID
	* text -- 母语文字
	*/
	funText: function(nodeId, text) {
		if (this.type == this.BASE) return text;
		if (Ext.isEmpty(jfLang)) return text;
		
		var ntext = jfLang.fun[nodeId];
		return (ntext) ? ntext : text;
	},
	
	/**
	* 处理其他文字的多语言
	* key1 -- 键值1
	* key2 -- 键值2
	* text -- 母语文字
	*/
	otherText: function(key1, key2, text) {
		if (this.type == this.BASE) return text;
		if (Ext.isEmpty(joLang)) return text;
		
		var ntext = joLang[key1][key2];
		return (ntext) ? ntext : text;
	},
	
	//----------------------------------下面处理字段名的多语言文字-----------------------------------
	//加载字段语言文件，如果存在则不重新加载
	fieldLang: function(nodeId) {
		var t = this.type;
		var lang = jdLang[nodeId];
		if (lang) return lang[t];
	
		var url = '/public/locale/field/'+ nodeId +'-lang.js';
		JxUtil.loadJS(url);
		if (!jdLang[nodeId]) return;
		
		return jdLang[nodeId][t];
	},
	
	//递归处理form页面文件中的字段文字
	formText: function(items, lang) {
		for (var i = 0, n = items.length; i < n; i++) {
			var name = items[i].name,
				label = items[i].fieldLabel;
			
			if (name && label && lang) {
				var ntext = lang[name];
				if (ntext) {
					items[i].fieldLabel = ntext;
				}
			}
			
			var subitems = items[i].items;
			if (subitems && subitems.length > 0) {
				JxLang.formText(subitems, lang);
			}
		}
	},
	
	/**
	* 处理Grid中字段名的多语言，功能字段信息动态加载
	* nodeId -- 功能ID
	* cols -- 表格类定义信息
	*/
	gridField: function(nodeId, cols) {
		if (this.type == this.BASE) return;
		if (cols == null || cols.length == 0) return;
		if (nodeId == null || nodeId.length == 0) return;
		
		var lang = this.fieldLang(nodeId);
		if (lang == null) return;
		
		for (var i = 0, n = cols.length; i < n; i++) {
			if (cols[i].col == null || cols[i].field == null) continue;
			var ntext = lang[cols[i].field.name];
			if (ntext) {
				cols[i].col.header = ntext;
			}
		}
	},
	
	/**
	* 处理Form中字段名的多语言，功能字段信息动态加载
	* nodeId -- 功能ID
	* cols -- 表格类定义信息
	*/
	formField: function(nodeId, items) {
		if (this.type == this.BASE) return;
		if (items == null || items.length == 0) return;
		if (nodeId == null || nodeId.length == 0) return;
		
		var lang = this.fieldLang(nodeId);
		JxLang.formText(items, lang);
		
		//处理Form中标题的多语言
		JxLang.formTitle(nodeId, items);
	},
	
	/**
	* 处理Form中标题的多语言
	* nodeId -- 功能ID
	* cols -- 表格类定义信息
	*/
	formTitle: function(nodeId, mitems) {
		for (var i = 0, n = mitems.length; i < n; i++) {
			var items = mitems[i].items;
			if (!items) continue;
			
			for (var j = 0, m = items.length; j < m; j++) {
				var title = items[j].title;
				items[j].title = JxLang.otherText('formtitle', nodeId+'__'+j, title);
			}
		}
	},
	
	/**
	 * 处理选择多语言数据功能
	 * config -- 选择窗口配置信息
	 */
	langSelectConfig: function(config) {
		if (Jxstar.systemVar.sys__lang__use != '1') return config;
		
		//替换选择来源功能为多语言数据功能
		var nodeId = config.nodeId;
		var cfg = this.selectConfig[nodeId];
		if (cfg) {
			config.nodeId = cfg.langFunId;
		} else {
			return config;
		}
		
		//替换为多语言数据表
		config.sourceField = langField(config.sourceField, cfg);
		//替换where中的多余言表
		config.whereSql = langWhereSql(config.whereSql, cfg);
	}
});
})();