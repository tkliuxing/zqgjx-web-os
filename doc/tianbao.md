## 填报

### 接口列表

* 填报定义: formtemplate, 业务id(biz_id): 900
  * 字段说明:
    * biz_id: 900
    * org_id: 机构ID
    * title: 填报名称
    * api_version: v1
    * api_name: formdata
    * form_type: 1
    * create_time: 创建时间（只读）
    * remark: 配置信息json
  * 配置信息json
    * is_enabled: boolean 是否启用
    * start_date: date string 开始时间
    * end_date: date string 结束时间
    * day_loop: boolean 是否每日循环
    * month_loop: boolean 是否每月循环
    * need_login: boolean 是否需要登录
  
* 填报字段定义: formfields, 业务id(biz_id): 900
  * 字段说明:
    * biz_id: 900
    * org_id: 机构ID
    * template: formtemplate_id
    * col_title: 名称
    * col_name: API字段名
    * widget:
    * widget_attr:
    * verify_exp:
    * data_source:
    * sort_num:

* 填报结果：formdata, 业务id(biz_id): 900
  * 字段说明:
    * biz_id: 900
    * org_id: 机构ID
    * template: formtemplate_id
    * user: uid（在需要登录时填写）
    * field_01---field_100: 填写内容
    * field_01_display: openid

* 多行填报--主表：services，业务id(biz_id) 10000
  * 字段说明:
    * biz_id: 10000
    * org_id: 机构ID
    * field_01: formtemplate_id
    * name: title
    * create_user: uid（在需要登录时填写）
  * 返回的pk作为多行填报子表的数据项保存（formdata的field_01_display）
  
* 多行填报--子表：formdata, 业务id(biz_id): 10000
  * 字段说明:
    * biz_id: 10000
    * org_id: 机构ID
    * template: formtemplate_id
    * user: uid（在需要登录时填写）
    * field_01---field_100: 填写内容
    * field_01_display: services_id（services的pk）
  

#### Excel填报

* 配置API: services, 业务id(biz_id): 910
  * 字段说明:
    * biz_id: 910
    * org_id: 机构ID
    * name: 标题
    * desc: 描述
    * field_01: 是否开启 ("是", "否")
    * start_time: 开始时间
    * end_time: 结束时间
    * file: Excel模版

* 数据API: services, 业务id(biz_id): 911
  * 字段说明:
    * biz_id: 911
    * name: 标题（从配置中复制）
    * file: Excel文件
    * field_01: openid（可选）
    * create_user: uid（本接口需登录）
    * create_time: 创建时间，只读
    
