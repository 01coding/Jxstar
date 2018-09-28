/*
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
Jxstar.currentPage={layoutEl:null,parentEl:null,graphId:"",compnum:0,currentComp:null,editor:null,render:function(c,g,k,a){var l=this;this.graphId=c;this.layoutEl=k;var j=['<div id="mx_page_nav" style="background-color:#f2f2f2;height:100%;">','<table border="0" width="90%">',"<tr>",'<td id="mx_toolbar_nav" style="width:16px;padding-left:5px;" valign="top">',"</td>",'<td valign="top" style="border-width:0px;border-style:solid;border-color:#99BBE8;">','<div id="mx_graph_nav" style="position:relative;height:520px;width:100%;background-color:white;overflow:hidden;cursor:default;">','<center id="mx_splash" style="padding-top:230px;">','<img src="lib/graph/images/loading.gif">',"</center>","</div>","</td>","</tr>","</table>","</div>"];var d=k.getTopToolbar();var h=k.getComponent(0);if(h){d.removeAll(true)}else{h=new Ext.Panel({border:false,html:j.join("")});k.add(h)}k.on("beforedestroy",function(){if(Jxstar.editorNav){Jxstar.editorNav.destroy();mxClient.dispose();Jxstar.editorNav=null}h.removeAll(true);h.destroy();h=null;return true});var i=[{text:jx.base.del+" Del",handler:function(){l.editor.execute("delete")}},{text:jx.base.undo+" Ctrl+Z",handler:function(){l.editor.execute("undo")}},{text:jx.base.cut+" Ctrl+X",handler:function(){l.editor.execute("cut")}},{text:jx.base.copy+" Ctrl+C",handler:function(){l.editor.execute("copy")}},{text:jx.base.paste+" Ctrl+V",handler:function(){l.editor.execute("paste")}},{text:jx.wfx.group,handler:function(){l.editor.execute("group")}},{text:jx.wfx.ungroup,handler:function(){l.editor.execute("ungroup")}},{text:jx.wfx.setpic,handler:function(){l.setImagePath()}}];var e=[{text:jx.wfx.zoomin,handler:function(){l.editor.execute("zoomIn")}},{text:jx.wfx.zoomout,handler:function(){l.editor.execute("zoomOut")}},{text:jx.wfx.actual,handler:function(){l.editor.execute("actualSize")}},{text:jx.wfx.fit,handler:function(){l.editor.execute("fit")}}];var b=[{text:jx.wfx.del,iconCls:"eb_delete",handler:function(){l.deleteDesign()}},{text:jx.wfx.exp,iconCls:"eb_exp",handler:function(){l.exportDesign()}}];d.add({text:jx.base.save,iconCls:"eb_save",handler:function(){l.saveDesign()}},{xtype:"tbseparator"},{text:jx.wfx.extdo,iconCls:"eb_menu",menu:b},{xtype:"tbseparator"},{text:jx.wfx.prop,iconCls:"eb_prop",id:"set_attri",handler:function(){l.modifyDefine()}},{xtype:"tbfill"},{xtype:"tbseparator"},{text:jx.wfx.picdo,iconCls:"eb_menu",menu:i},{text:jx.wfx.sizedo,iconCls:"eb_menu",menu:e});k.doLayout();l.parentEl=h.el;if(Jxstar.editorNav==null){JxUtil.loadJxGraph();var f=new mxCanvas("lib/graph/config/editor_nav.xml");l.editor=f;Jxstar.editorNav=f}else{l.editor=Jxstar.editorNav}l.disableDesign(g);l.readDesign()},disableDesign:function(b){var a=(b!="0");this.editor.graph.setEnabled(b!="3");this.editor.graph.setConnectable(!a);this.editor.graph.setDropEnabled(!a);this.editor.graph.setCellsDeletable(!a);this.editor.graph.setCellsMovable(!a);Ext.fly("mx_toolbar_nav").setDisplayed(!a);var c=this.layoutEl.getTopToolbar();c.setDisabled(a);c.getComponent("set_attri").setDisabled(b=="3")},saveDesign:function(){var c=this,b=new mxCodec(),f=c.editor.graph,d=b.encode(f.getModel());var a=mxUtils.getPrettyXml(d);var g=encodeURIComponent;var h="funid=wfnav_graph&eventcode=savedesign&pagetype=formdes&graph_id="+c.graphId+"&xmlfile="+g(a);Request.postRequest(h,null)},readDesign:function(){var a=this;var b=function(d){if(d==null||d.length==0){d="<?xml version='1.0' encoding='utf-8'?>";d+="<mxGraphModel><root><mxCell id='0'/><mxCell id='1' parent='0'/></root></mxGraphModel>"}var e=mxUtils.parseXml(d);var f=new mxCodec(e);f.decode(e.documentElement,a.editor.graph.getModel())};var c="funid=wfnav_graph&eventcode=readdesign&pagetype=formdes";c+="&graph_id="+a.graphId;Request.dataRequest(c,b,{type:"xml",wait:true})},createDesign:function(){var b=this,f=b.editor.graph,d=f.getModel(),e=f.getDefaultParent();d.beginUpdate();try{var c=f.insertVertex(e,null,jx.wfx.start,20,20,80,40,"hexagon");var a=f.insertVertex(e,null,jx.wfx.end,30,250,40,40,"doubleEllipse")}finally{d.endUpdate()}},deleteDesign:function(){var b=this,d=b.editor.graph,c=d.getDefaultParent();var a=function(){d.selectCells(true,true,c);var f=d.getSelectionCells();d.removeCells(f,true)};var e=function(){var f="funid=wfnav_graph&eventcode=deldesign&pagetype=formdes&graph_id="+b.graphId;Request.postRequest(f,a)};Ext.Msg.confirm(jx.base.hint,jx.wfx.delyes,function(f){if(f=="yes"){e()}})},exportDesign:function(){var c=this,b=new mxCodec(),e=b.encode(c.editor.graph.getModel()),a=mxUtils.getPrettyXml(e);var d=new Ext.Window({title:jx.wfx.showdes,layout:"fit",width:750,height:500,resizable:true,modal:true,closeAction:"close",items:[{xtype:"textarea",name:"wfnav_graph__design_file",border:false,value:a,style:"font-size:13px;border-width:0;line-height:20px;",readOnly:true}]});d.show()},importDesign:function(){JxHint.alert(jx.bus.text34)},modifyDefine:function(){var i=this,h=i.editor.graph,g=h.getSelectionCell();if(g==null){JxHint.alert(jx.wfx.nopic);return}var c=g.getId();var f=new mxCodec();var d=f.encode(g);var b=d.getAttribute("nodetype");var a=d.getAttribute("source");var e=null;if(b=="task"){e=Jxstar.findNode("wfnav_node");e.width=700;e.height=480}else{JxHint.alert(jx.wfx.tip02);return}i.setProcessAttr(c,i.graphId,e)},setProcessAttr:function(e,b,h){var g=h.nodeid;var d=h.tablename;var c="node_id";var f=function(i){JxUtil.delay(500,function(){var j={where_sql:d+"."+c+" = ? and "+d+".graph_id = ?",where_type:"string;string",where_value:e+";"+b,callback:function(l){if(l.length==0){i.formNode.event.create();i.getForm().set(d+"__"+c,e);i.getForm().set(d+"__graph_id",b)}else{var k=i.formNode.event.newRecord(l[0]);i.getForm().myRecord=k;i.getForm().loadRecord(k)}}};Jxstar.queryData(g,j)})};var a=(g=="wf_nodeattr")?h.layout:h.formpage;Jxstar.showData({filename:a,title:h.nodetitle,width:h.width,height:h.height,nodedefine:h,callback:f})},setImagePath:function(){var a=this;graph=a.editor.graph;curCell=graph.getSelectionCell();if(curCell==null){JxHint.alert(jx.wfx.nopic);return}var b=curCell.getStyle();if(b.indexOf("image")!=0){JxHint.alert(jx.wfx.tip03);return}var c=function(d){graph.setCellStyles("image",d,[curCell])};Ext.Msg.prompt(jx.wfx.picname,jx.wfx.defval+": lib/graph/images/dude.png",function(d,e){if(d!="ok"){return}if(e.length==0){JxHint.alert(jx.wfx.tip04);return}if(e.charAt(0)=="/"){e=e.substring(1)}c(e)})}};