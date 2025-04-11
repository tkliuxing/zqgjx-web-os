export declare function jsonToExcel(json: object[]): any
export declare function manyFilesZip(fileList: FileList[], filename: string): Promise<any>
export declare function manyJsonToZip(jsons: JsonList[], filename: string): Promise<any>

export interface FileList {
  filename: string,
  file: any
}

export interface JsonList {
  data: any,
  filename?: string
}

