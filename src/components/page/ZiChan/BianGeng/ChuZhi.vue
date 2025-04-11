<template>
  <el-card>
    <el-form inline>
      <el-form-item >
        <el-input
          v-model="searchData.search"
          placeholder="单号、资产名称、资产编号"
          clearable
          @clear="loadData"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-search" @click="loadData">
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" round icon="el-icon-download" @click="download">
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      element-loading-text="正在加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="data"
      ref="table"
      border
      stripe
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column label="处置单号" prop="pk" width="130px"></el-table-column>
      <el-table-column label="资产名称" prop="zichan_name"></el-table-column>
      <el-table-column label="资产编号" prop="zichan_sn"></el-table-column>
      <el-table-column label="处置方式" prop="disposeMode"></el-table-column>
      <el-table-column label="处置总价(￥)" prop="disposePrice"></el-table-column>
      <el-table-column label="处置价格(￥)" prop="disposeMoney"></el-table-column>
      <el-table-column label="处置原因" prop="disposeReason"></el-table-column>
      <el-table-column label="经办人员" prop="handlerPeroson"></el-table-column>
      <el-table-column label="处置时间" prop="create_time"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="{ row }">
          <el-button v-if="row.zichan_id"
            type="primary"
            icon="el-icon-edit"
            @click="lookZichan(row)"
            round
            size="mini"
            >资产详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px"
      layout="total, sizes, prev, pager, next"
      :page-sizes="[15, 30, 50, 100, 500, 1000]"
      :page-size="pageSize"
      @size-change="
        (pageSize) => {
          this.page = 1;
          this.pageSize = pageSize;
          this.loadData();
        }
      "
      :current-page.sync="page"
      @current-change="loadData"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import moment from "moment";
import resource from "@/resource";
import xlsxExcel from "@/utils/xlsxExcel";
export default {
  data() {
    return {
      searchData: {
        search: "",
      },
      data: [],
      dialogVisable: false,
      page: 1,
      pageSize: 15,
      total: 0,
      loading:false,
    };
  },
  methods: {
    moment,
    async loadData() {
      this.loading = true
      let params = {
        ...this.searchData,
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.zichan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT9213304709120",
      };
      let res = await resource.getList("data", params);
      for(let item of res.data){
        item.create_time = moment(item.create_time).format("YYYY-MM-DD")
      }
      this.total = res.count;
      this.data = res.data;
      this.loading = false
    },
    lookZichan(row) {
      this.$router.push({
        name: "zichan-editxinxi",
        params: { pk: row.zichan_id, state: true },

      });
    },
    // 导出表格
    download() {
      let headers = [
        { 处置单号: "pk" },
        { 资产名称: "zichan_name" },
        { 资产编号: "zichan_sn" },
        { 处置方式: "disposeMode" },
        { 处置总价: "disposePrice" },
        { 处置价格: "disposeMoney" },
        { 处置原因: "disposeReason" },
        { 经办人员: "handlerPeroson" },
        { 处置时间: "create_time" },
        { 备注: "remark" },
      ];
      xlsxExcel(headers, "固定资产处置记录", this.data);
    },
  },
  created() {
    // this.loadData();
  },
};
</script>

<style>
</style>