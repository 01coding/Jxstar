/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 条码标签打印控件，使用说明：
 * 客户端需要先安装：ysbarprintExe.msi插件程序，才能看到预览或打印效果
 * 如果要求支持直接打印，默认打印机必须设置为条码打印机
 * 如果条码标签样式改变了，则dataset.xml与dataset_head.xml文件必须修改，可以通过barset.exe工具设置
 * 如果要打印的数据字段有调整，则必须调整readCtlData方法中的后面两个参数
 *
 * 使用的示例代码，grid_equ_card.inc：
	config.eventcfg = {	
		//打印条码标签
		labelPrint: function() {
			var headFile = Jxstar.path+'/equip/asset/inc/dataset_head.xml';
			var dataFile = Jxstar.path+'/equip/asset/inc/dataset.xml';
			var tableName = 'equ_card';
			var filedNames = ['device_name', 'model_type', 'use_date', 'device_code'];
			JxLabelPrint.print(this.grid, headFile, dataFile, tableName, filedNames);
		},
		
		//预览条码标签
		labelView: function() {
			var headFile = Jxstar.path+'/equip/asset/inc/dataset_head.xml';
			var dataFile = Jxstar.path+'/equip/asset/inc/dataset.xml';
			var tableName = 'equ_card';
			var filedNames = ['device_name', 'model_type', 'use_date', 'device_code'];
			JxLabelPrint.print(this.grid, headFile, dataFile, tableName, filedNames, '1');
		}
	};
 * 
 * @author TonyTan
 * @version 1.0, 2012-11-18
 */
JxLabelPrint = {};

(function(){

	//读取条码设置的xml文件
	var readCtlXML = function(fileName) {
		if (Ext.isIE == false) {
			JxHint.alert(jx.util.labnie);//条码标签打印控件不支持非IE浏览器！
			return;
		}		
		
		var parseXML = function(o) {
			var retstr = '';
			var recursion = function(o){
				if(o==null){
				   return;
				}
				if(o.nodeType==1 || o.nodeType==2){
				   retstr += "<"+o.nodeName+">";
				}
				if(o.attributes){
					 for(i=0;i<o.attributes.length;i++){
						format = (i>0)?" ":":";
						retstr += (format+o.attributes[i].nodeName+"="+o.attributes[i].text);
					 }
				 }
				 if(o.hasChildNodes && o.firstChild.nodeType!=3){
					  for(var i=0;i<o.childNodes.length;i++){
						 arguments.callee(o.childNodes[i]);
						 if(i==o.childNodes.length-1)
						 retstr += "</"+o.nodeName+">";
					  }
				 }else{
					  retstr += o.text;
					  retstr += "</"+o.nodeName+">";
					  return;
				 }
			};
			recursion(o);
			return retstr;
		};
		
		var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
		xmlDoc.async = false;
		xmlDoc.load(fileName);
		root = xmlDoc.documentElement;
		return parseXML(root);
	};
	
	//从表格控件中取指定表的指定字段的值，构成xml字符串返回
	var readCtlData = function(grid, tableName, fieldNames) {
		var records = JxUtil.getSelectRows(grid);
		if (!JxUtil.selected(records)) return;
		
		var printValue = "";
		for (var i = 0, n = records.length; i < n; i++) {
			printValue += "<print>";
			for (var j = 0, m = fieldNames.length; j < m; j++) {
				var value = records[i].get(tableName+"__"+fieldNames[j]);
				value = Ext.isDate(value) ? value.dateFormat('Y-m-d') : value;
				printValue += "<" + fieldNames[j] + ">" + value + "</" + fieldNames[j] + ">";
			}
			printValue += "</print>##";
		}
		if (printValue.length > 2) {
			printValue = printValue.substr(0, printValue.length-2);
		}
		return printValue;
	};
	
	//获取条码打印控件
	var getPrintCtl = function() {
		var el = Ext.get('printcodectl');
		if (Ext.isEmpty(el)) {
			var html = '<object id="printcodectl" classid="clsid:7EDC7219-8CEE-451f-9C21-98C812DD8CAE" width="0" height="0" codebase="ysbarprintExe.exe"></object>';
			el = Ext.getBody().insertHtml('beforeEnd', html, true);
		}
		return el.dom;
	};
	
	Ext.apply(JxLabelPrint, {
		/**
		 * 标签打印与预览
		 * grid -- 当前要取数据的表格对象
		 * headFile -- 如：Jxstar.path+'/equip/asset/inc/dataset_head.xml'
		 * dataFile -- 如：Jxstar.path+'/equip/asset/inc/dataset.xml'
		 * tableName -- 如：'equ_card', 
		 * filedNames -- 如：['device_name', 'model_type', 'use_date', 'device_code']
		 * isView -- 1表示预览，否则为打印
		 **/
		print: function(grid, headFile, dataFile, tableName, filedNames, isView, printNum) {
			if (Ext.isIE == false) {
				JxHint.alert(jx.util.labnie);//'条码标签打印控件不支持非IE浏览器！'
				return;
			}
			var headXML = readCtlXML(headFile);
			var dataXML = readCtlXML(dataFile);
			if (Ext.isEmpty(headXML) || Ext.isEmpty(dataXML)) {
				JxHint.alert(jx.util.labnset);//没有找到条码标签设置文件！
				return;
			}
			var printValue = readCtlData(grid, tableName, filedNames);
			
			if (isView == '1') {
				getPrintCtl().printviewByXml(headXML, dataXML, printValue);
			} else {
				getPrintCtl().printByXml(headXML, dataXML, printValue);
			}
		},
		
		/**
		 * 取得打印控件
		 **/
		printCtl: function() {
			if (Ext.isIE == false) {
				JxHint.alert(jx.util.labnie);//'条码标签打印控件不支持非IE浏览器！'
				return;
			}
			return getPrintCtl();
		}
	});//Ext.apply

})();