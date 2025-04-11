import resource from "@/resource"
// 字段定义数据结构
export class Field {
  alias = ""
  col_name = ""
  col_title = ""
  data = ""
  desc = ""
  in_filter = false
  is_required = false
  verify_exp = []
  widget = "input"
  widget_attr = []
  constructor(params) {
    if(params && params.__proto__ === Object.prototype){
      Object.assign(this, params);
    } else {
      throw new Error("Field params must be an object");
    }
  }

  serialize(){
    return {
      alias: this.alias,
      col_name: this.col_name,
      col_title: this.col_title,
      data: this.data,
      desc: this.desc,
      in_filter: this.in_filter,
      is_required: this.is_required,
      verify_exp: this.verify_exp,
      widget: this.widget,
      widget_attr: this.widget_attr,
    };
  }
}

// 解析字段定义数据结构
function parse_fields(fields){
  try {
    return  JSON.parse(fields).map(i=>new Field(i))
  }catch (e) {
    return  []
  }
}

// 序列化字段定义数据结构
function serialize_fields(fields){
  let arr = [];
  for (const i of fields) {
    arr.push(i.serialize())
  }
  return JSON.stringify(arr)
}

// 分类树通用模板,包含地图元件字段
export class TreeTemplate {
  pk = null
  parent = null
  name = ""
  sort_number = 0
  title_field_name = "" // field_03 标题字段名
  is_template = "is_template" // field_02  是否为模板
  shape = ""  // field_01 地图图元形状
  coordinate = "" // description 地图图元坐标
  arguments = ""
  icon = ""
  text_01 = ""
  fields = null

  // params: 后端分类树节点数据结构
  constructor(params) {
    if(!params){
      throw new Error("params is required");
    }
    if(params.__proto__ !== Object.prototype){
      throw new Error("params must be an object");
    }
    if(params.field_02 != "is_template"){
      throw new Error("params is not a template");
    }
    Object.assign(this, params);
    this.title_field_name = params.field_03 || "";
    this.shape = params.field_01 || "";
    this.coordinate = params.description ? JSON.parse(params.description) : null;
    this.fields = parse_fields(this.text_01);
  }

  // 序列化为后分类树节点后端数据结构
  serialize() {
    return {
      pk: this.pk,
      parent: this.parent,
      type_id: this.type_id,
      name: this.name,
      sort_number: this.sort_number,
      description: JSON.stringify(this.coordinate),
      arguments: this.arguments,
      icon: this.icon,
      field_01: this.shape,
      field_02: "is_template",
      field_03: this.title_field_name,
      text_01: JSON.stringify(this.fields),
    };
  }

  add_field(field){
    this.fields.push(new Field(field));
  }

  async save(){
    const url = "basetree";
    let data = this.serialize();
    if(this.pk){
      return await resource.updateObj(url, this.pk, data);
    } else {
      return await resource.createObj(url, data);
    }
  }
}
