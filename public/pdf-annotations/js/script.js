// 实例化pdf
console.log(window.fileValue,'fileValue');
var pdf = new PDFAnnotate('pdf-container',  window.fileValue, {
    onPageUpdated(page, oldData, newData) {
     //   console.log(page, oldData, newData);
    },


  ready() {
    console.log('Plugin initialized successfully');
      // 在接收到消息后，加载 PDF 数据
    console.log(window.sampleOutput,'sampleOutput');
      pdf.loadFromJSON(window.sampleOutput);
  },
    scale: 1.5
});
pdf.pageImageCompression = 'SLOW';

function changeActiveTool(event) {
    var element = $(event.target).hasClass("tool-button")
      ? $(event.target)
      : $(event.target).parents(".tool-button").first();
    $(".tool-button.active").removeClass("active");
    $(element).addClass("active");
}

// 自由选择
function enableSelector(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableSelector();
}

// 添加画笔
function enablePencil(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enablePencil();
}

// 添加签字笔
function enableSignPen(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableSignPen();
}

// 添加文本框
function enableAddText(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableAddText();
}

// 添加箭头
function enableAddArrow(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableAddArrow();
}

// 添加图片
function addImage(event) {
    event.preventDefault();
    pdf.addImageToCanvas()
}

// 添加矩形
function enableRectangle(event) {
    event.preventDefault();
    changeActiveTool(event);
    //pdf.setColor('rgba(255, 0, 0, 0.3)');
   // pdf.setBorderColor('red');
    pdf.enableRectangle();
}

// 添加矩形
function eraser(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.eraser();
}


// 删除选中对象
function deleteSelectedObject(event) {
  event.preventDefault();
  pdf.deleteSelectedObject();
}

// 保存为pdf
function savePDF() {
    pdf.savePdf();
}
function savePDFCopy() {
    pdf.savePdfCopy();
}

// 清除页面
function clearPage() {
    pdf.clearActivePage();
}

//撤销操作
function undo(event) {
    pdf.undo();
}

// 恢复操作
function redo(event) {

    pdf.redo();
}

//上一页
function lastPage(event) {
    pdf.lastPage();
}

// 下一页
function nextPage(event) {
    pdf.nextPage();
}

// 展示左侧缩略图面板
function showLeftLabel() {
    pdf.showLeftLabel();
    var element=$('#leftPanel');
    if (!element.is(':visible')) {　　//如果 element 是隐藏的则显示 element 元素，否则隐藏
        element.show();
    } else {
        element.hide();
    }
}

// 缩略图选中事件
function fnLoadPageFromThumb(event){
    var element = $(event).find('img');
    var page = $(event).find('span');
    $(".thumbImg.thumbSel").removeClass("thumbSel");
    $(element).addClass("thumbSel");
    pdf.goPage(page.text());

}

// 显示pdf数据
function showPdfData() {
    var string = pdf.serializePdf();
    $('#dataModal .modal-body pre').first().text(string);
    PR.prettyPrint();
    $('#dataModal').modal('show');
}

// 初始化
$(function () {
    $('.color-tool').click(function () {
        $('.color-tool.active').removeClass('active');
        $(this).addClass('active');
        color = $(this).get(0).style.backgroundColor;
        pdf.setColor(color);
    });

    $('#brush-size').change(function () {
        var width = $(this).val();
        pdf.setBrushSize(width);
    });

    $('#font-size').change(function () {
        var font_size = $(this).val();
        pdf.setFontSize(font_size);
    });

   setTimeout(showLeftLabel,3000);
});
