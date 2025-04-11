## 试卷

### 接口列表

* 试卷总表: service
  * 字段说明:
    * pk 试卷ID
    * sys_id 系统ID
    * org_id 机构ID
    * biz_id 100
    * name 试卷名称
    * desc 试卷简介
    * start_time 试卷开始日期
    * end_time 试卷结束日期
    * field_01 是否需要注册用户(0或1)
    * field_02 是否选择机构部门(0或1)
    * field_03 是否答题时立即显示对错并出分(0或1)

* 试卷题目表: formdata
  * 字段说明:
    * pk 题目ID
    * sys_id 系统ID
    * org_id 机构ID
    * biz_id 100
    * field_01 试卷总表ID
    * field_02 题目内容
    * field_03 题目类型(单选\多选\问答)
    * field_04 到 field_13 题目选项文字(共10条)
    * int_01 题目序号
    * int_02 必选N项(优先级高于最多选N项)
    * int_03 最多选N项
    * int_04 至少选N项(必须小于最多选N项)

* 试卷答题总表: formdata
  * 字段说明:
    * pk 答题ID
    * sys_id 系统ID
    * org_id 机构ID
    * biz_id 110
    * field_01 试卷总表ID
    * field_02 来源标识(user_id\weixin_oid\UA等)
    * datetime_01 提交时间

* 试卷答题结果表: formdata
  * 字段说明:
    * pk 答题ID
    * sys_id 系统ID
    * org_id 机构ID
    * biz_id 111
    * field_01 试卷总表ID
    * field_02 试卷答题总表ID
    * field_04 到 field_13 题目选项文字 (共10条,问答题结果填写到field_04,
      单选多选按照相应选项字段名称填写为0或1) `前端初始化答题时必须填写field_04 到 field_13为0`
