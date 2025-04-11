<template>
  <el-card>
    <el-button type="warning" @click="ShuoMingTo" class="fix-shuoming" round icon="el-icon-notebook-2" plain>使用说明</el-button>
    <el-table :data="data" border stripe :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="申请人" prop="create_user_name"></el-table-column>
      <el-table-column label="申请名称" prop="name"></el-table-column>
      <el-table-column label="申请时间">
        <template slot-scope="{ row }">
          <span v-if="row.create_time">{{
            moment(row.create_time).format("yyyy-MM-DD")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="lookItems(row)" round icon="el-icon-tickets">发放列表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px" @size-change="
        (pageSize) => {
          this.pageSize = pageSize;
          this.getIssueHistory();
        }
      " @current-change="
        (page) => {
          this.page = page;
          this.getIssueHistory();
        }
      " :current-page="page" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog :visible.sync="lookItemsVisable" :close-on-click-modal="false" title="物品发放列表" @closed="currentGoodSreceipt = null" center width="80%">
      <el-table :data="items" border stripe :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
        <el-table-column label="物品名称" prop="field_01"></el-table-column>
        <el-table-column label="申请数量" prop="int_01"></el-table-column>
        <el-table-column label="用途" prop="field_02"></el-table-column>
        <el-table-column label="领用借用" prop="field_03"></el-table-column>
        <el-table-column label="归还日期">
          <template slot-scope="{ row }">
            <span v-if="row.datetime_01">{{
              moment(row.datetime_01).format("yyyy-MM-DD")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="归还期限" prop="field_04"></el-table-column>
        <el-table-column label="发放数量" prop="int_02"></el-table-column>
        <el-table-column label="发放日期">
          <template slot-scope="{ row }">
            <span v-if="row.datetime_02">{{
              moment(row.datetime_02).format("yyyy-MM-DD")
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script>
import resource from "../../../resource";
import moment from "moment";
export default {
  name: "WuPingIssue",
  data() {
    return {
      data: [],
      items: [],
      currentGoodSreceipt: null,
      lookItemsVisable: false,
      page: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    async getIssueHistory() {
      let res = await resource.getList("data", {
        template_id: "FT140638058851151872",
        field_03: "已发放",
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
        page: this.page,
        pageSize: this.pageSize,
      });
      this.data = res.data;
      this.total = res.count;
    },
    async lookItems(row) {
      this.currentGoodSreceipt = row;
      await this.getGoodItem();
      this.lookItemsVisable = true;
    },
    async getGoodItem() {
      let res = await resource.getList("data", {
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT140638334658744320",
        goodsreceipt: this.currentGoodSreceipt.pk,
      });
      this.items = res;
    },
    ShuoMingTo() {
      this.$router.push({ name: "ffwc-shuoming" });
    },
    filterType(value, row) {
      return row.field_02 === value;
    },
    moment,
  },
  created() {
    this.getIssueHistory();
  },
};
</script>

<style></style>
