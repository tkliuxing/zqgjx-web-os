export default function (element) {
  //cavas 保存图片到本地  js 实现
  //------------------------------------------------------------------------
  //1.确定图片的类型  获取到的图片格式 data:image/Png;base64,......
  let type = 'png';//你想要什么图片格式 就选什么吧
  let d = element;
  let imgdata = d.toDataURL(type);
  //2.0 将mime-type改为image/octet-stream,强制让浏览器下载
  let fixtype = function (type) {
    type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
    let r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
  };
  imgdata = imgdata.replace(fixtype(type), 'image/octet-stream');
  //3.0 将图片保存到本地
  let savaFile = function (data, filename) {
    let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;
    let event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
  };
  let filename = '' + new Date().getSeconds() + '.' + type;
  //我想用当前秒是可以解决重名的问题了 不行你就换成毫秒
  savaFile(imgdata, filename);
}
