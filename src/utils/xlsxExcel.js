import XLSX from "xlsx";
import FileSaver from "file-saver";
/**
 *
 * @param {Array} excelHeaders  {表头}
 * @param {String} excelName  {文件名称}
 * @param {Array} data   {数据}
 */
export default function xlsxExport(excelHeaders, excelName, data) {
  const wopts = {
    bookType: "xlsx",
    bookSST: false,
    type: "binary",
  };
  const workBook = {
    SheetNames: ["Sheet1"],
    Sheets: {},
    Props: {},
  };
  let table = [];
  if (data && data.length > 0) {
    data.forEach((i, index) => {
      let param = {};
      excelHeaders.forEach((j) => {
        for (const key in j) {
          param[key] = i[j[key]];
        }
      });
      table[index] = param;
    });
  } else {
    let param = {};
    excelHeaders.forEach((j) => {
      for (const key in j) {
        param[key] = "";
      }
    });
    table[0] = param;
  }
  workBook.Sheets["Sheet1"] = XLSX.utils.json_to_sheet(table);
  FileSaver.saveAs(
    new Blob([changeData(XLSX.write(workBook, wopts))], {
      type: "application/octet-stream",
    }),
    `${excelName}.xlsx`
  );
}

function changeData(s) {
  //如果存在ArrayBuffer对象(es6) 最好采用该对象
  if (typeof ArrayBuffer !== "undefined") {
    //1、创建一个字节长度为s.length的内存区域
    var buf = new ArrayBuffer(s.length);
    //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
    var view = new Uint8Array(buf);
    //3、返回指定位置的字符的Unicode编码
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  } else {
    var buf = new Array(s.length);
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
}
