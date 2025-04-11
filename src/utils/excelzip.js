import JSZip from "jszip";
import XLSX from "xlsx";
import FileSaver from "file-saver";

export function jsonToExcel(json) {
  let ws_name = "Sheet1";
  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.json_to_sheet(json);
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  return XLSX.write(wb, { bookType: "xlsx", bookSST: true, type: "array" });
}

export async function manyFilesZip(fileList, filename){
  let zip = new JSZip();
  let folder = zip.folder(filename);
  for(let i = 0;i< fileList.length; i++){
    folder.file(fileList[i].filename + '.xlsx', fileList[i].file, {binary:true})
  }
  let content = await zip.generateAsync({ type: "blob" });
  FileSaver.saveAs(content, filename + ".zip");
}

export async function manyJsonToZip(jsons, filename){
  let excels = [];
  for(let i=0;i<jsons.length; i++){
    let json = jsons[0];
    let inzip_filename = Date.parse(new Date()).toString() + i.toString();
    if(!!json.filename){
      inzip_filename = json.filename
    }
    excels.push({filename: inzip_filename, file:jsonToExcel(json.data)});
  }
  await manyFilesZip(excels, filename)
}

