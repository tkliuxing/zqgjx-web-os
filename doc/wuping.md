## 物品领用

### 接口列表

* 物品类别  Api:basetree   biz_id:1248
    * 字段说明:
        * biz_id  1248
        * name  类别名称
* 物品登记  Api:data  database:public.goods_goods   template_id: FT140632863333752832
    * 字段说明:
        * biz_id  5847
        * category  所属类别
        * name  物品名称
        * size  规格型号
        * unit  单位
        * number  数量
        * price  单价
        * remark  备注
        * photo  图片
    

* 物品申请  Api: goodsreceipt、goodstogoodsreceipt
    * 字段说明（goodsreceipt）:
        * name  物品申请
        * field_03  发放状态
        * create_user  申请人
        * biz_id  5847

    * 字段说明（goodstogoodsreceipt）:
        * goodsPk  对应物品的pk,
        * goodsreceipt  生成单据的pk,
        * field_01   申请物品名称
        * field_02   用途
        * field_03   领用借用
        * field_04   归还期限
        * int_01  物品申请数量,
        * int_02  物品发放数量
        * int_03  物品归还数量
        * datetime_01  应归还日期,
        * datetime_02  发放时间
        * datetime_03  实际归还日期