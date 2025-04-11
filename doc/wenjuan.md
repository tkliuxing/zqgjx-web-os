## 问卷

### 接口列表

* 问卷总表: service
  * 字段说明:
    * pk 问卷ID
    * sys_id 系统ID
    * org_id 机构ID
    * biz_id 300
    * name 问卷名称
    * start_time 问卷开始日期
    * end_time 问卷结束日期
    * field_01 问卷简介
    * field_02 是否选择机构部门(0或1)

* 问卷题目表: formdata
  * 字段说明:
    * pk 题目ID
    * sys_id 系统ID
    * org_id 机构ID
    * biz_id 300
    * field_01 问卷总表ID
    * field_02 题目内容
    * field_03 题目类型(单选\多选\问答)
    * field_04 到 field_13 题目选项文字(共10条)
    * int_01 题目序号
    * int_02 必选N项(优先级高于最多选N项)
    * int_03 最多选N项
    * int_04 至少选N项(必须小于最多选N项)

* 问卷答题总表: formdata
  * 字段说明:
    * pk 答题ID
    * sys_id 系统ID
    * org_id 机构ID
    * biz_id 301
    * field_01 问卷总表ID
    * field_02 来源标识(user_id\weixin_oid\UA等)
    * datetime_01 提交时间

* 问卷答题结果表: formdata
  * 字段说明:
    * pk 答题ID
    * sys_id 系统ID
    * org_id 机构ID
    * biz_id 303
    * field_01 问卷总表ID
    * field_02 问卷答题总表ID
    * field_04 到 field_13 题目选项文字 (共10条,问答题结果填写到field_04, 单选多选按照相应选项字段名称填写为0或1) `前端初始化答题时必须填写field_04 到 field_13为0`

* 问卷题目选项统计: formdatareport/303
  * id: 303
  * params:
    * shiti_id: 试题id, 必填
  * 返回值:
    ```json
    {
      "id": 8011,
      "title": "问卷题目选项统计",
      "data": [{"xx":  "选项A", "jg": 12}],
      "header": [
        {
          "key": "xx",
          "title": "选项",
          "type": "str",
          "length": 30
        },
        {
          "key": "jg",
          "title": "数量",
          "type": "int",
          "length": 15
        }
      ],
      "charts": {
        "aggregate_name": "题目统计结果",
        "chart_name": "题目统计结果",
        "more": false,
        "x": {
          "key": "xx"
        },
        "y": [
          {
            "key": "jg",
            "name": "数量",
            "type": "pie",
            "index": 0
          }
        ],
        "yAxis": [
          {
            "name": "数量",
            "axisLabel": {
              "formatter": "{value} 人"
            },
            "splitLine": {
              "show": false
            }
          }
        ]
      }
    }
    ```
