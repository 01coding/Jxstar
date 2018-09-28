1、makepic.fla是flash源码，可以用“Macromedia Flash 8”工具打开；

2、发布makepic.swf文件时需要依赖两个类包：
   classes\it\sephiroth\PrintScreen.as、mloaderWindow.as

3、PrintScreen负责把图形内容提交到url中；在makepic.fla中可以修改提交路径。

4、如果生成图片的文件与路径需要调整，则需要修改“makepic.fla”文件21行，如：
   load_var.send("./public/pic/makepic.jsp", "pic_frm", "POST")
   
5、grid_base_pic.inc在表格中显示拍照功能的参考代码。
