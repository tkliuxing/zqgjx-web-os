/**
 * PDFAnnotate v1.0.0
 */

var PDFAnnotate = function(container_id, url, options = {}) {
	this.number_of_pages = 0;
	this.pages_rendered = 0;
	this.active_tool = 0; // 0 - 自由选择,1 - 画笔, 2 - 文本, 3 - 箭头, 4 - 矩形, 5 - 签字笔, 6 - 橡皮擦
	this.fabricObjects = [];
	this.fabricObjectsData = [];
	this.color = '#212121';
	this.borderColor = '#000000';
	this.borderSize = 1;
	this.font_size = 16;
	this.active_canvas = 0;
	this.container_id = container_id;
	this.url = url;
	this.fabricHistoryJson = [];
	this.mods = 0;
	this.viewHeight = 0;
	this.initLeftLabel = false;
	this.mouseTo ={};
	this.mouseFrom = {};
	this.brushWidth =1;
	this.isLock = false
	this.hisStep = []
	var inst = this;

	var loadingTask = pdfjsLib.getDocument(this.url);
	loadingTask.promise.then(function (pdf) {
		var scale = options.scale ? options.scale : 1.3;
	    inst.number_of_pages = pdf.numPages;
		$("#allPage").html(inst.number_of_pages);
	    for (var i = 1; i <= pdf.numPages; i++) {
	        pdf.getPage(i).then(function (page) {
				inst.fabricHistoryJson.push([])
	            var viewport = page.getViewport({scale: scale});
	            var canvas = document.createElement('canvas');
	            document.getElementById(inst.container_id).appendChild(canvas);
	            canvas.className = 'pdf-canvas';
	            canvas.height = viewport.height;
	            canvas.width = viewport.width;
	            context = canvas.getContext('2d');
				inst.viewHeight = viewport.height + 25;
	            var renderContext = {
	                canvasContext: context,
	                viewport: viewport
				};

	            var renderTask = page.render(renderContext);
	            renderTask.promise.then(function () {
	                $('.pdf-canvas').each(function (index, el) {
	                    $(el).attr('id', 'page-' + (index + 1) + '-canvas');
	                });
	                inst.pages_rendered++;
	                if (inst.pages_rendered == inst.number_of_pages) inst.initFabric();
	            });
	        });
	    }


	}, function (reason) {
	    console.error(reason);
	});

	this.initFabric = function () {
		var inst = this;
		let canvases = $('#' + inst.container_id + ' canvas')
	    canvases.each(function (index, el) {
	        var background = el.toDataURL("image/png");
	        var fabricObj = new fabric.Canvas(el.id, {
	            freeDrawingBrush: {
	                width: 1,
	                color: inst.color
	            }
	        });

			inst.fabricObjects.push(fabricObj);
			if (typeof options.onPageUpdated == 'function') {
				fabricObj.on('object:added', function() {

					var oldValue = Object.assign({}, inst.fabricObjectsData[index]);
					inst.fabricObjectsData[index] = fabricObj.toJSON()
					//判断是否 签字笔工具
                   if(inst.active_tool == 5){
					   inst.fabricObjects[index]._objects.forEach((item)=>{
						   if(item.path && !item.extendType){
							   item.extendType = 'signPen'
						   }
					   })
				   }
					if(oldValue.backgroundImage){
						fabricObj.setBackgroundImage(oldValue.backgroundImage.src, fabricObj.renderAll.bind(fabricObj));
					}
					if(inst.active_tool !== 0 && !inst.isLock){
						var hisObj = {}
						hisObj.index = index
						oldValue.backgroundImage = inst.fabricObjectsData[index].backgroundImage;
						hisObj.oldValue = oldValue
						hisObj.newValue = JSON.parse(JSON.stringify(inst.fabricObjectsData[index]))
						if(inst.fabricHistoryJson[index].length <1){
							inst.fabricHistoryJson[index].push(hisObj.oldValue)
							inst.fabricHistoryJson[index].push(hisObj.newValue)
							var obj = {}
							obj.x = index
							obj.y = inst.fabricHistoryJson[index].length -1
							inst.hisStep.push(obj)
						}else{
							inst.fabricHistoryJson[index].push(hisObj.newValue)
							var obj = {}
							obj.x = index
							obj.y = inst.fabricHistoryJson[index].length -1
							inst.hisStep.push(obj)
						}
            window.parent.postMessage({
              params: inst.fabricHistoryJson,
              cmd: "iframeOne" /*当有多个iframe页面传值时，可以设计通过其中的字段获取对应的值*/
            },'*');
					}

					options.onPageUpdated(index + 1, oldValue, inst.fabricObjectsData[index])
				})
				fabricObj.on('object:modified', function() {
					var oldValue = Object.assign({}, inst.fabricObjectsData[index]);

					inst.fabricObjectsData[index] = fabricObj.toJSON()
					if( !inst.isLock){

						var hisObj = {}
						hisObj.index = index
						oldValue.backgroundImage = inst.fabricObjectsData[index].backgroundImage;
						hisObj.oldValue = oldValue
						hisObj.newValue = JSON.parse(JSON.stringify(inst.fabricObjectsData[index]))
						if(inst.fabricHistoryJson[index].length <1){
							inst.fabricHistoryJson[index].push(hisObj.oldValue)
							inst.fabricHistoryJson[index].push(hisObj.newValue)
							var obj = {}
							obj.x = index
							obj.y = inst.fabricHistoryJson[index].length -1
							inst.hisStep.push(obj)
						}else{
							inst.fabricHistoryJson[index].push(hisObj.newValue)
							var obj = {}
							obj.x = index
							obj.y = inst.fabricHistoryJson[index].length -1
							inst.hisStep.push(obj)
						}
						console.log(inst.fabricHistoryJson)
						window.parent.postMessage({
							params: inst.fabricHistoryJson,
							cmd: "iframeOne" /*当有多个iframe页面传值时，可以设计通过其中的字段获取对应的值*/
						  },'*');
					}

					options.onPageUpdated(index + 1, oldValue, inst.fabricObjectsData[index])
				})
				fabricObj.on('object:removed', function() {
					var oldValue = Object.assign({}, inst.fabricObjectsData[index]);
					inst.fabricObjectsData[index] = fabricObj.toJSON()
					if( !inst.isLock){

						var hisObj = {}
						hisObj.index = index
						oldValue.backgroundImage = inst.fabricObjectsData[index].backgroundImage;
						hisObj.oldValue = oldValue
						hisObj.newValue = JSON.parse(JSON.stringify(inst.fabricObjectsData[index]))
						if(inst.fabricHistoryJson[index].length <1){
							inst.fabricHistoryJson[index].push(hisObj.oldValue)
							inst.fabricHistoryJson[index].push(hisObj.newValue)
							var obj = {}
							obj.x = index
							obj.y = inst.fabricHistoryJson[index].length -1
							inst.hisStep.push(obj)
						}else{
							inst.fabricHistoryJson[index].push(hisObj.newValue)
							var obj = {}
							obj.x = index
							obj.y = inst.fabricHistoryJson[index].length -1
							inst.hisStep.push(obj)
						}
						console.log(inst.fabricHistoryJson)
						window.parent.postMessage({
							params: inst.fabricHistoryJson,
							cmd: "iframeOne" /*当有多个iframe页面传值时，可以设计通过其中的字段获取对应的值*/
						  },'*');
					}

					options.onPageUpdated(index + 1, oldValue, inst.fabricObjectsData[index])
				})

				fabricObj.on('selection:created', function(e) {
					// 判断橡皮擦工具
                   if(inst.active_tool == 6){
					   if (e.target._objects) {
						   //多选删除
						   var etCount = e.target._objects.length;
						   for (var etindex = 0; etindex < etCount; etindex++) {
							   fabricObj.remove(e.target._objects[etindex]);
						   }
					   } else {
						   //单选删除
						   fabricObj.remove(e.target);
					   }
					   fabricObj.discardActiveObject(); //清除选中框
				   }

				})
			}

	        fabricObj.setBackgroundImage(background, fabricObj.renderAll.bind(fabricObj));
			fabricObj.on({
				'mouse:down': (o)=> {
					inst.isLock = false
					inst.mouseFrom.x = o.pointer.x;
					inst.mouseFrom.y = o.pointer.y;
				},
				'mouse:up': (o)=> {

					inst.mouseTo.x = o.pointer.x;
					inst.mouseTo.y = o.pointer.y;
					// 判断箭头工具
					if(inst.active_tool == 3){
						var fabricObj = inst.fabricObjects[inst.active_canvas];
						fabricObj.isDrawingMode = false;
						var arrow = new fabric.Path(drawArrow(inst.mouseFrom.x, inst.mouseFrom.y, inst.mouseTo.x, inst.mouseTo.y, 15.5, 15.5), {
							stroke: inst.color,
							fill: "rgba(255,255,255,0)",
							strokeWidth: inst.brushWidth
						});
						fabricObj.add(arrow)
						//inst.active_tool = 0;
					}
					// 判断矩形工具
					if(inst.active_tool == 4){
						var fabricObj = inst.fabricObjects[inst.active_canvas];

						if (inst.fabricObjects.length > 0) {
							$.each(inst.fabricObjects, function (index, fabricObj) {
								fabricObj.isDrawingMode = false;
							});
						}

						var rect =  new fabric.Rect({
							left: inst.mouseFrom.x,
							top: inst.mouseFrom.y,
							width: inst.mouseTo.x - inst.mouseFrom.x,
							height: inst.mouseTo.y - inst.mouseFrom.y,
							fill: "rgba(255, 255, 255, 0)",
							stroke: inst.color,
							strokeWidth: inst.brushWidth
						});
						fabricObj.add(rect);
						//inst.active_tool = 0;
					}
				},
				'mouse:move': (o)=> {
					inst.mouseTo.x = o.pointer.x;
					inst.mouseTo.y = o.pointer.y;

				}
			});

	        $(fabricObj.upperCanvasEl).click(function (event) {
	            inst.active_canvas = index;
				var currentPage = inst.active_canvas+1;
				$("#currentPage").val(currentPage);
	            inst.fabricClickHandler(event, fabricObj);
			});
			fabricObj.on('after:render', function () {
				inst.fabricObjectsData[index] = fabricObj.toJSON()
				fabricObj.off('after:render')

			})

			if (index === canvases.length - 1 && typeof options.ready === 'function') {
				options.ready()
			}
		});

	}

	this.fabricClickHandler = function(event, fabricObj) {
		var inst = this;
	    if (inst.active_tool == 2) {
	        var text = new fabric.Textbox('请输入签字框说明：如刘总签字位置', {
	            left: inst.mouseFrom.x,
	            top: inst.mouseFrom.y,
	            fill: inst.color,
            width: 200,
	            fontSize: inst.font_size,
	            selectable: true,
				"splitByGrapheme": true ,//自动分行
	        });
	        fabricObj.add(text);
        text.selectAll();
        text.enterEditing();
      	inst.active_tool = 0;
	    }
	}

}
// 自由选择
PDFAnnotate.prototype.enableSelector = function () {
	var inst = this;
	inst.active_tool = 0;
	if (inst.fabricObjects.length > 0) {
    $.each(inst.fabricObjects, function (index, fabricObj) {
      fabricObj.isDrawingMode = false;
      $.each(fabricObj.getObjects(), function (index, fabricObj) {
        if (fabricObj.type == 'textbox') {
          fabricObj.exitEditing();
        }
      })
    });
  }
}

//画笔
PDFAnnotate.prototype.enablePencil = function () {
	var inst = this;
	inst.active_tool = 1;
	if (inst.fabricObjects.length > 0) {
	    $.each(inst.fabricObjects, function (index, fabricObj) {
	        fabricObj.isDrawingMode = true;
			fabricObj.freeDrawingBrush.width = inst.brushWidth;
			fabricObj.freeDrawingBrush.color = inst.color;
	    });
	}
}

//文本框
PDFAnnotate.prototype.enableAddText = function () {
	var inst = this;
	inst.active_tool = 2;
	if (inst.fabricObjects.length > 0) {
	    $.each(inst.fabricObjects, function (index, fabricObj) {
	        fabricObj.isDrawingMode = false;
	    });

	}
	console.log("选择文本框")
}
// 矩形
PDFAnnotate.prototype.enableRectangle = function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	inst.active_tool = 4;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}

}

// 箭头
PDFAnnotate.prototype.enableAddArrow = function () {
	var inst = this;
	inst.active_tool = 3;
	if (inst.fabricObjects.length > 0) {
	    $.each(inst.fabricObjects, function (index, fabricObj) {
	        fabricObj.isDrawingMode = false;
	        // new Arrow(fabricObj, inst.color, function () {
	        //     inst.active_tool = 0;
	        // });
	    });
	}

}

//书写箭头的方法
function drawArrow(fromX, fromY, toX, toY, theta, headlen) {
	theta = typeof theta != "undefined" ? theta : 30;
	headlen = typeof theta != "undefined" ? headlen : 10;
	// 计算各角度和对应的P2,P3坐标
	let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
		angle1 = (angle + theta) * Math.PI / 180,
		angle2 = (angle - theta) * Math.PI / 180,
		topX = headlen * Math.cos(angle1),
		topY = headlen * Math.sin(angle1),
		botX = headlen * Math.cos(angle2),
		botY = headlen * Math.sin(angle2);
	let arrowX = fromX - topX,
		arrowY = fromY - topY;
	let path = " M " + fromX + " " + fromY;
	path += " L " + toX + " " + toY;
	arrowX = toX + topX;
	arrowY = toY + topY;
	path += " M " + arrowX + " " + arrowY;
	path += " L " + toX + " " + toY;
	arrowX = toX + botX;
	arrowY = toY + botY;
	path += " L " + arrowX + " " + arrowY;
	return path;
}
// 添加图片
PDFAnnotate.prototype.addImageToCanvas = function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];

	if (fabricObj) {
		var inputElement = document.createElement("input");
		inputElement.type = 'file'
		inputElement.accept = ".jpg,.jpeg,.png,.PNG,.JPG,.JPEG";
		inputElement.onchange = function() {
			var reader = new FileReader();
			reader.addEventListener("load", function () {
				inputElement.remove()
				var image = new Image();
				image.onload = function () {
					fabricObj.add(new fabric.Image(image))
				}
				image.src = this.result;
			}, false);
			reader.readAsDataURL(inputElement.files[0]);
		}
		document.getElementsByTagName('body')[0].appendChild(inputElement)
		inputElement.click()
	}
}
// 删除选中对象
PDFAnnotate.prototype.deleteSelectedObject = function () {
	var inst = this;
	var activeObject = inst.fabricObjects[inst.active_canvas].getActiveObject();
	if (activeObject)
	{
	    if (confirm('确定执行该操作?')) inst.fabricObjects[inst.active_canvas].remove(activeObject);
	}
}

// 另存为pdf
PDFAnnotate.prototype.savePdf = function () {
	var inst = this;
	var format = inst.format || 'a4';
	var orientation = inst.orientation || 'portrait';
	if (!inst.fabricObjects.length) return;
	var doc = new jspdf.jsPDF({ format, orientation });
	if (typeof fileName === 'undefined') {
		fileName = `${new Date().getTime()}.pdf`;
	}

	inst.fabricObjects.forEach(function (fabricObj, index) {
		if (index != 0) {
			doc.addPage(format, orientation);
			doc.setPage(index + 1);
		}
		doc.addImage(
			fabricObj.toDataURL({
				format: 'png',
			}),
			inst.pageImageCompression == 'NONE' ? 'PNG' : 'JPEG',
			0,
			0,
			doc.internal.pageSize.getWidth(),
			doc.internal.pageSize.getHeight(),
			`page-${index + 1}`,
			['FAST', 'MEDIUM', 'SLOW'].indexOf(inst.pageImageCompression) >= 0 ?
				inst.pageImageCompression :
				undefined
		);
		if (index === inst.fabricObjects.length - 1) {
			doc.save(fileName);
		}
	});
}

// 另存为pdfcopy
PDFAnnotate.prototype.savePdfCopy = function () {
  var inst = this;
  var format = inst.format || 'a4';
  var orientation = inst.orientation || 'portrait';
  if (!inst.fabricObjects.length) return;
  var doc = new jspdf.jsPDF({ format, orientation });
  if (typeof fileName === 'undefined') {
    fileName = `${new Date().getTime()}.pdf`;
  }
  console.log('进来了')
  inst.fabricObjects.forEach(function (fabricObj, index) {
    if (index != 0) {
      doc.addPage(format, orientation);
      doc.setPage(index + 1);
    }
    doc.addImage(
      fabricObj.toDataURL({
        format: 'png',
      }),
      inst.pageImageCompression == 'NONE' ? 'PNG' : 'JPEG',
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      `page-${index + 1}`,
      ['FAST', 'MEDIUM', 'SLOW'].indexOf(inst.pageImageCompression) >= 0 ?
        inst.pageImageCompression :
        undefined
    );

    if (index === inst.fabricObjects.length - 1) {
		var file = doc.output('blob');
		window.parent.postMessage({
		  params: file,
		  cmd: "save" /*当有多个iframe页面传值时，可以设计通过其中的字段获取对应的值*/
		},'*');
    }
  });
}

PDFAnnotate.prototype.setBrushSize = function (size) {
	var inst = this;
	inst.brushWidth =parseInt(size, 10);
	$.each(inst.fabricObjects, function (index, fabricObj) {
		if(inst.active_tool == 1){
			fabricObj.freeDrawingBrush.width = parseInt(size, 10) || 1;
		}
	});
}

PDFAnnotate.prototype.setColor = function (color) {
	var inst = this;
	inst.color = color;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		if(inst.active_tool == 1) {
			fabricObj.freeDrawingBrush.color = color;
		}
    });
}

PDFAnnotate.prototype.setBorderColor = function (color) {
	var inst = this;
	inst.borderColor = color;
}

PDFAnnotate.prototype.setFontSize = function (size) {
	this.font_size = size;
}

PDFAnnotate.prototype.setBorderSize = function (size) {
	this.borderSize = size;
}
// 清除激活页面数据
PDFAnnotate.prototype.clearActivePage = function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	var bg = fabricObj.backgroundImage;
	if (confirm('确定执行该操作?')) {
		// 保留不可控制的对象
		let data = fabricObj._objects.filter((item) => {
			return !item.hasControls;
		});
		fabricObj._objects= data;
	  //  fabricObj.clear();
	    fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj));
	}
}

PDFAnnotate.prototype.serializePdf = function() {
	var inst = this;
	return JSON.stringify(inst.fabricObjects, null, 4);
}


// 序列化pdf数据
PDFAnnotate.prototype.loadFromJSON = function(jsonData) {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		if (jsonData.length > index) {
			fabricObj.loadFromJSON(jsonData[index], function () {
				inst.fabricObjectsData[index] = fabricObj.toJSON()
			})
		}
	})
}


//canvas 历史后退
PDFAnnotate.prototype.undo = function () {
	var inst = this;
	let state = inst.hisStep;
	inst.isLock = true
	if(inst.mods < state.length) {
		debugger
		var activeIndex = state[state.length  -1- inst.mods].x;

		inst.fabricObjects[activeIndex].clear().renderAll();
		// console.log(state[state.length - 1 - inst.mods])
		// console.log(inst.fabricHistoryJson[activeIndex][state[state.length - 1 - inst.mods].y])
		console.log(inst.mods)
		console.log(state[state.length - 1 - inst.mods])
		inst.fabricObjects[activeIndex].loadFromJSON(inst.fabricHistoryJson[activeIndex][state[state.length - 1 - inst.mods].y-1]);
		inst.fabricObjects[activeIndex].renderAll();
		inst.mods += 1;
	}
};
//前进
PDFAnnotate.prototype.redo =function () {
	var inst = this;
	let state = inst.hisStep;
	inst.isLock = true
	if (inst.mods >0) {
		debugger
		var activeIndex = state[state.length - inst.mods].x;
		inst.fabricObjects[activeIndex].clear().renderAll();
		// console.log(state[state.length  - inst.mods])
		// console.log(inst.fabricHistoryJson[activeIndex][state[state.length - inst.mods].y])
		console.log(inst.mods)
		console.log(state[state.length - inst.mods])
		inst.fabricObjects[activeIndex].loadFromJSON(inst.fabricHistoryJson[activeIndex][state[state.length - inst.mods].y]);
		inst.fabricObjects[activeIndex].renderAll();
		inst.mods -= 1;
	}
};

//下一页
PDFAnnotate.prototype.nextPage =function () {
	var inst = this;
	var currentPage = $("#currentPage").val();

	if(currentPage<inst.number_of_pages){
		var val = Number(currentPage)+1;
		window.scrollTo(0,currentPage*inst.viewHeight)
		$("#currentPage").val(val)
	}

};

//上一页
PDFAnnotate.prototype.lastPage =function () {
	var inst = this;
	var currentPage = $("#currentPage").val();
	if(currentPage>1){
		var val = currentPage-1;
		window.scrollTo(0,(val-1)*inst.viewHeight)
		$("#currentPage").val(val)
	}

};

// 跳转分页
PDFAnnotate.prototype.goPage =function (pageNum) {
	var inst = this;
	window.scrollTo(0,(pageNum-1)*inst.viewHeight)
	$("#currentPage").val(pageNum)
};

// 左侧面板
PDFAnnotate.prototype.showLeftLabel =function () {
	var inst = this;
	if(!inst.initLeftLabel) {

		let canvases = $('#' + inst.container_id + ' canvas')
		for (var i = 1; i <= inst.number_of_pages; i++) {
			var panIndex = i - 1;
			var imgSrc = "";
			canvases.each(function (index, el) {
				if ((index / 2) == panIndex) {
					imgSrc = el.toDataURL("image/png", 0.1);
				}
			})
			var thumbParent = document.createElement('div');
			var imgContainer = document.createElement('div');
			var thumb = document.createElement('img');
			var span = document.createElement('span');
			span.className = 'page';
			span.innerText = i;
			thumb.id = 'thumb' + panIndex;
			thumb.className = 'thumbImg';
			thumb.setAttribute("src", imgSrc);
			imgContainer.className = 'imgContainer';
			imgContainer.appendChild(thumb);
			thumbParent.appendChild(imgContainer);
			thumbParent.appendChild(span);
			thumbParent.id = 'thumbParent' + i;
			thumbParent.className = 'thumb';
			thumbParent.setAttribute("onclick", "fnLoadPageFromThumb(this)");
			document.getElementById('thumbPane').appendChild(thumbParent);
		}
		inst.initLeftLabel = true;
	}


//签字笔
PDFAnnotate.prototype.enableSignPen = function () {
	var inst = this;
	inst.active_tool = 5;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = true;
			fabricObj.freeDrawingBrush.width = 1;
			fabricObj.freeDrawingBrush.color = '#212121';
		});
	}
}

//橡皮擦工具
PDFAnnotate.prototype.eraser = function () {
	var inst = this;
	inst.active_tool = 6;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}

};


