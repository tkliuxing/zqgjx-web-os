# FabricJS layer on top of Mozilla's PDFJS to add ANNOTATIONS

![Alt text](./Screenshot.png?raw=true "Screenshot")

# Features

- 支持多个页面的pdf文件

- 自由绘制工具

- 添加文本

- 添加箭头

- 添加矩形

- 改变颜色

- 改变画笔大小

- 改变字体大小

- 每个对象都可以调整

- 序列化所有canvas数据转换成JSON和重绘

- 删除单个对象

- 清除页面

- Export PDF with annotations (using jsPDF)

**Important: exported file will be a PDF with set of images. So you won't be able to use functions like text selections. trying my best to add the text layer. Due to lack of PDFJs documentation about this section progress is very slow. If anyone interested you can check the progress on `dev` branch.**

# Usage 

```javascript
var pdf = new PDFAnnotate('pdf-container-id', 'http://url-to.pdf');

pdf.enableSelector(); // 启用移动工具

pdf.enablePencil(); // 启用画笔工具

pdf.enableAddText(); // 启用添加文本工具

pdf.enableAddArrow(); // 启用添加箭头工具

pdf.enableRectangle(); // 启用添加矩形工具

pdf.deleteSelectedObject(); // 删除选中的对象

pdf.clearActivePage(); // 清除当前页

pdf.savePdf(); // 保存为pdf

pdf.serializePdf(); //返回 canvas的JSON数据

pdf.loadFromJSON(serializedJSON) // 继续编辑和保存 JSON. To do this on page load use `ready` option(scripts.js line 5)

pdf.setColor(color); // 颜色工具集 (例如: pdf.setColor(red) , pdf.setColor('#fff'), pdf.setColor('rgba(255,0,0,0.5)'))

pdf.setBorderColor(color); // 为矩形工具设置边框颜色 (例如: pdf.setBorderColor(red) , pdf.setBorderColor('#fff'))

pdf.setBrushSize(width); // 为铅笔工具设置画笔大小(例如: pdf.setBrushSize(5))

pdf.setFontSize(font_size); // 为文本工具设置字体大小 (例如: pdf.setFontSize(18))

pdf.setBorderSize(border_size); // 设置边界矩形的大小 (例如: pdf.setBorderSize(2))
```
