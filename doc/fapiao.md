## 发票

### 接口列表

* 发票列表: service, 业务id(biz_id): 801
  * 字段说明:
    * biz_id: 801
    * orga_name: 发票类型 (fplx_display)
    * field_01: 发票代码  (fpdm)
    * field_02: 发票号码 (fphm)
    * field_03: 检验码 (jym)
    * start_time: 开票时间 (kprq)
    * customera_name: 购买方名称 (gfmc)
    * customerb_name: 销售方名称 (xfmc)
    * sn: 发票状态 \["0", "1"\] (yizuofei)
    * float_01: 发票金额 (fpje)
    * float_02: 税率
    * float_03: 税额 (sehj)
    * price: 价税合计 (jshj)
    * customerc_name: 报销人员
    * orgc_name: 报销部门
    * field_01_display: 报销凭证
    * desc: 备注

* 查询报销人员列表: formdatareport/8011
  * id: 8011
  * params:
    * org_id: 机构id, 必填
  * 返回值:
    ```json
    {
      "id": 8011,
      "title": "报销人员查询",
      "data": [{"name":  "张三"}, {"name":  "李四"}],
      "header": [
        {
          "key": "name",
          "title": "姓名",
          "type": "str",
          "length": 30
        }
      ],
      "charts": {}
    }
    ```

* 查询报销部门列表: formdatareport/8012
  * id: 8012
  * params:
    * org_id: 机构id, 必填
  * 返回值:
    ```json
    {
      "id": 8011,
      "title": "报销部门查询",
      "data": [{"name":  "部门名称1"}, {"name":  "部门名称2"}],
      "header": [
        {
          "key": "name",
          "title": "部门名称",
          "type": "str",
          "length": 30
        }
      ],
      "charts": {}
    }
    ```

* 查询开票单位列表: formdatareport/8013
  * id: 8013
  * params:
    * org_id: 机构id, 必填
  * 返回值:
    ```json
    {
      "id": 8011,
      "title": "开票单位查询",
      "data": [{"name":  "开票单位1"}, {"name":  "开票单位2"}],
      "header": [
        {
          "key": "name",
          "title": "开票单位名称",
          "type": "str",
          "length": 30
        }
      ],
      "charts": {}
    }
    ```
