//屏蔽报表的右键菜单
window.oncontextmenu = function(){return false;};

/**
*	获取当前document的第一个table对象
*/
function f_getTblObj() {
	var objs = document.getElementsByTagName("TABLE");
	if (objs != null && objs.length > 0) {
		return objs[0];
	}

	return null;
}

/**
*	插入一个新的table
*/
function f_insertTable(tblContent, tblobj) {
	var strTblId = f_createTblID();
	//alert(tblobj.width);

	var strContent = "<table id=\""+strTblId+"\" x:str border=0 cellpadding=0 cellspacing=0 style='border-collapse:collapse;table-layout:fixed'>";
	strContent += tblContent + "</table>";

	document.writeln(strContent);

	var tblObj = document.getElementById(strTblId);

	//设置新table的style属性
	setTblStyle(tblobj, tblObj);

	//alert(tblObj.style.height);

	return tblObj;
}

/**
* 插入一个新的row
* tblObj -- 插入记录的表格
* copyIndex -- 拷贝行位置
* rows -- 需要插入的行数
*/
function f_insertRow(tblObj, copyIndex, rows) {
	var copyRow = f_getRow(tblObj, copyIndex-1);
	for (var i = 0; i < rows; i++) {
		var newRow = tblObj.insertRow(copyIndex);
		newRow.style.width = copyRow.style.width;
		newRow.style.height = copyRow.style.height;
		newRow.className = copyRow.className;
		
		var cells = copyRow.cells;
		for (var j = 0; j < cells.length; j++) {
			var newCell = newRow.insertCell(j);
			newCell.style.width = cells[j].style.width;
			newCell.style.height = cells[j].style.height;
			newCell.className = cells[j].className;
		}
	}
}

/**
* 删除row
* tblObj -- 表格
* copyIndex -- 开始行位置
* rows -- 需要删除的行数
*/
function f_deleteRow(tblObj, startIndex, rows) {
	for (var i = 0; i < rows; i++) {
		tblObj.deleteRow(startIndex);
	}
}

/**
*	设置新table的style属性
*/
function setTblStyle(oldTbl, newTbl) {
	newTbl.style.width = oldTbl.style.width;
}

/**
*	获取随机数
*/
function f_random() {
	var idval = Math.random() * 10000000;
	var vals = new String(idval).split('.');
	return vals[0];
}

/**
*	创建表格ID
*/
function f_createTblID() {
	var tblID = "rtbl_" + f_random();
	var tblObj = document.getElementById(tblID);

	var isHas = false;
	if (tblObj != null && tblObj.tagName == "TABLE") {
		isHas = true;
	}

	while (isHas == true) {
		tblID = "rtbl_" + f_random();
		tblObj = document.getElementById(tblID);

		if (tblObj != null && tblObj.tagName == "TABLE") {
			isHas = true;
		} else {
			isHas = false;
		}
	}

	return tblID;
}

/**
*	根据
*
*	@param	posi		当前行
*	@param	mutilNum	倍数
*	@param	stblObj		表格对象
*/
function f_setRowHeightByPos(posi, mutilNum, stblObj) {
	var trObj = f_getRow(stblObj, posi);
	trObj.cells[0].height = trObj.cells[0].height * mutilNum;
}

/**
*/
function f_hiddenRowByPos(posi, hiddenLineNum, stblObj) {
	var trObj = null;
	for (var i = hiddenLineNum ;i > 0 ;i--)	{
		trObj = f_getRow(stblObj, parseInt(posi) + i);
		trObj.style.display = "none";
	}
//	var trObj = f_getRow(stblObj, posi);
//	trObj.cells[0].height = trObj.cells[0].height * mutilNum;
}

/**
*	根据当前字段填写的内容，设置当前行的行高。
*/
function f_setCellHeightByPos(posi, cellVal, colName, stblObj) {
	if (columnDefine.length == null || columnDefine.length == 0) return ;

	var row = posi[0];
	var column = posi[1];
	var trObj = null;

	//alert("stblObj.id = " + stblObj.id);

	var ableCharNum = 0;			//每个单元格可以显示的字符数
	var charLength = cellVal.length;//
	var heightNum = 0;
	var firstTD = "", tdInnerHTML = "";
	var tdContent = null;
	for (var i = 0, n = columnDefine.length ;i < n  ;i++ ) {
		//alert("columnDefine[i][0] = " + columnDefine[i][0]);
		if (columnDefine[i][0] == colName) {
			ableCharNum = columnDefine[i][1] * columnDefine[i][2];

			//alert("ableCharNum = " + ableCharNum);
			//alert("charLength = " + charLength);

			if (ableCharNum < charLength) {
				//字符的长度超出单元格显示------------

				//计算要加多少行高
				heightNum = parseInt(charLength / ableCharNum) + 1;

				//alert("heigthNum = " + heightNum);

				trObj = f_getRow(stblObj, row);
				if (trObj == null) {
					continue ;
				}
//				alert("trObj.cells[0].height = " + trObj.cells[0].height);
				//alert("trObj.outHTML = " + trObj.outerHTML);

				trObj.cells[0].height = trObj.cells[0].height * heightNum;
			}
		}
	}
}

/**
*	把字符串中的换行符号、空格转换为html的符号--会造成模板超一页的问题
*   改为把长字符串放到textarea控件中--会造成内容显示不全，建议调整模板大小
*/
function f_strToHtml(str) {
	if (str == null || str.length == 0) return '';
	
	if (str.length > 200) {
		str = '<textarea style="border-width:0px;font-size:9pt;width:98%;height:98%;" readonly=true>' + str + '</textarea >';
	}
	//替换字符中的换行符
	//var re = new RegExp("\n","igm");
	//str = str.replace(re, '<br>');
	return str;
}

/**
*	根据当前字段填写位置，将图片填写到相应的单元格中
*/
function f_setCellPic(width, height, px, py, posi, picHtml, tblObj) {
	var tdObj = f_getCellObj(tblObj, posi);

	if (tdObj == null) {
		return ;
	}
	
	if (py == 0) py = - height/2;
	//取到td的位置，如果输出多页，则需要加上表格的偏移位置
	var top = (tblObj.offsetTop - 10) + tdObj.offsetTop + py;
	var left = (tblObj.offsetLeft - 8) + tdObj.offsetLeft + px;
	
	var html = '<div style="position:absolute;left:'+ left +'px;top:'+ top +'px;">' + picHtml + '</div>';
	document.write(html);
}

/**
*	将图片填写到相应的单元格中
*/
function f_setTdPic(px, py, posi, picHtml, tblObj) {
	var tdObj = f_getCellObj(tblObj, posi);

	if (tdObj == null) {
		return ;
	}
	//不预留了，显示条码图片时造成边距很大
	var width = tdObj.offsetWidth;//预留像素 - 10
	var height = tdObj.offsetHeight;// - 10
	var html = '<div style="position:relative;padding:'+ px +'px;width:'+ width +'px;height:'+ height +'px;">' + picHtml + '</div>';
	tdObj.innerHTML = html;
}

/**
*	根据当前字段填写位置，将内容填写到相应的单元格中
*/
function f_setCellValueByPos(posi, cellVal, tblObj) {
	var tdObj = f_getCellObj(tblObj, posi);

	if (tdObj == null) {
		return ;
	}

	//设置单元格的内容
	tdObj.innerHTML = f_strToHtml(cellVal);
}

/**
*	根据位置获取td对象
*/
function f_getCellObj(tblObj, posi) {
	if (posi.length != 2) {
		return ;
	}
	
	if (tblObj == null || tblObj.tagName != "TABLE") {
		return ;
	}

	var row = posi[0];
	var column = posi[1];

	var trObj = f_getRow(tblObj, row);
	if (trObj == null) {
		return ;
	}

	return f_getCell(trObj, column);
}

/**
*	获取当前操作行对象
*/
function f_getRow(tblObj, rowIndex) {
	return tblObj.rows[rowIndex];
}

/**
*	获取当前操作单元格对象
*/
function f_getCell(trObj, colIndex) {
	var tdObjs = trObj.cells;
	var colspan = 0;
	var tdobj = null, retObj = null;
	for (var i = 0, n = tdObjs.length ;i < n ;i++) {
		tdobj = tdObjs[i];
		if (tdobj.tagName == "TD") {
			colspan = parseInt(colspan) + parseInt(tdobj.colSpan);

			if (colspan > colIndex) {
				retObj = tdobj;
				break;
			}
		}
	}

	return retObj;
}

/**
*	报表打印
*/
function f_window_print() {
	window.print();
}