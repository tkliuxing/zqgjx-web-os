<template>
  <div class="zichaninfo">
    <table  border="1" cellspacing="0" v-if="zichanInfo">
      <caption class="head">
        资产信息
      </caption>
      <tbody>
        <tr>
          <th>资产名称</th>
          <td>{{ zichanInfo.name }}</td>
        </tr>
        <tr>
          <th>资产规格</th>
          <td>{{ zichanInfo.size }}</td>
        </tr>
        <tr>
          <th>资产型号</th>
          <td>{{ zichanInfo.model_num }}</td>
        </tr>
        <tr>
          <th>资产性质</th>
          <td>{{ zichanInfo.nature }}</td>
        </tr>
        <tr>
          <th>资产分类</th>
          <td>{{ zichanInfo.category_display }}</td>
        </tr>
        <tr>
          <th>资产状态</th>
          <td>{{ zichanInfo.status }}</td>
        </tr>
        <tr>
          <th>备注</th>
          <td>{{ zichanInfo.product_description }}</td>
        </tr>
        <tr>
          <th>存放地点</th>
          <td>{{ zichanInfo.location }}</td>
        </tr>
        <tr>
          <th>计量单位</th>
          <td>{{ zichanInfo.unit }}</td>
        </tr>
        <tr>
          <th>资产原值</th>
          <td>{{ zichanInfo.cost }}</td>
        </tr>
        <tr>
          <th>购置方式</th>
          <td>{{ zichanInfo.purchase_method }}</td>
        </tr>
        <tr>
          <th>使用期限</th>
          <td>{{ zichanInfo.down_time }}</td>
        </tr>
        <tr>
          <th>入账编号</th>
          <td>{{ zichanInfo.account_number }}</td>
        </tr>
        <tr>
          <th>入账日期</th>
          <td>{{ zichanInfo.account_date }}</td>
        </tr>
        <tr>
          <th>使用部门</th>
          <td>{{ zichanInfo.department_display }}</td>
        </tr>
        <tr>
          <th>使用人员</th>
          <td>{{ zichanInfo.persion }}</td>
        </tr>
        <tr>
          <th>购置日期</th>
          <td>{{ zichanInfo.release_time }}</td>
        </tr>
        <tr>
          <th>出厂编号</th>
          <td>{{ zichanInfo.brand }}</td>
        </tr>
        <tr>
          <th>保管部门</th>
          <td>{{ zichanInfo.bg_department_display }}</td>
        </tr>
        <tr>
          <th>保管人员</th>
          <td>{{ zichanInfo.bg_persion }}</td>
        </tr>
        <tr>
          <th>保修期限</th>
          <td>{{ zichanInfo.warranty_period }}</td>
        </tr>
        <tr>
          <th>原资产号</th>
          <td>{{ zichanInfo.origin_sn }}</td>
        </tr>
        <tr>
          <th>供应商</th>
          <td>{{ zichanInfo.gys }}</td>
        </tr>
        <tr>
          <th>净值</th>
          <td>{{ zichanInfo.net_worth }}</td>
        </tr>
        <tr>
          <th>累计折旧</th>
          <td>{{ zichanInfo.accumulated_depreciation }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import resource from '@/resource.js'
export default {
  data () {
    return {
      id: null,
      zichanInfo: {}
    }
  },
  created () {
    this.$store.commit('resetState')
    this.id = this.$route.query.id
    if (this.id) {
      this.getZiChanInfo()
    }
  },
  methods: {
    async getZiChanInfo () {
      let resp = await resource.getObj('data', this.id,{template_id: 'FT8172429443072'})
      this.$store.commit('ORGID', resp.org_id)
      this.zichanInfo = resp
    }
  }
}
</script>

<style>
.zichaninfo {
  padding: 15px;
}
.head {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}
th,td {
  height: 50px;
  width: 100vw;
}
th {
  width: 200px;
}
td {
  padding-left: 15px;
}
</style>
