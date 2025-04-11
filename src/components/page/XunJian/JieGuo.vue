<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-button
          type="info"
          round
          icon="el-icon-arrow-left"
          @click="$router.go(-1);"
        >
          返回
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-download" @click="download"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      element-loading-text="正在加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      stripe
      border
      :data="data"
      ref="table"
      :row-class-name="tableRowClassName"
      style="width: 100%; margin: 10px 0"
    >
      <el-table-column prop="name" label="巡检点名称"> </el-table-column>
      <el-table-column prop="user_full_name" label="巡检人"> </el-table-column>
      <el-table-column prop="yichang" label="是否异常"> </el-table-column>
      <el-table-column prop="shuoming" label="异常说明"> </el-table-column>
      <el-table-column prop="xunjiantime" label="巡检时间">
        <template slot-scope="{ row }">
          {{ row.xunjiantime ? moment(row.xunjiantime).format('YYYY-MM-DD HH:mm:ss') : '' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="danger" round @click="deleteRow(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
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
import xlsxExcel from "@/utils/xlsxExcel";
import resource from "@/resource";
import moment from "moment";
const SMXJ_TMPL_ID = "FT6628950761472";

export default {
  name: "JieGuo",
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      data: [],
      xiangmu_id: null,
      renwu_id: null,
      loading:false
    };
  },
  methods: {
    async loadData() {
      let params = {
        xiangmu_id:this.xiangmu_id,
        renwu_id: this.renwu_id,
        biz_id: this.$bizCode.xunjian_biz,
        src_id: this.$sourceCode.source_id,
        template_id:'FT6632213925888'
      };
      let resp = await resource.getList(
        "data",
        params,
        this.page,
        this.pageSize
      );
      let p = {
        template_id : SMXJ_TMPL_ID,
        renwu_id: this.renwu_id,
      }
      let res = await resource.getList('data',p)
      if(res.length>0){
        resp.data.forEach(item=>{
          res.forEach(item1=>{
            if(item.xiangmu_id == item1.pk){
              item.name = item1.name
              item.xunjiantime = item.xunjiantime ? moment(item.xunjiantime).format('YYYY-MM-DD HH:mm:ss') : ''
            }
          })
        })
      }
      this.data = resp.data;
      this.total = resp.count;
    },
    tableRowClassName({row}) {
      return row.yichang == '是'? 'errorStatus' : ''
    },
    async deleteRow(row) {
      try {
        await this.$confirm("是否确定删除? 此操作不可恢复!");
        try {
          await resource.deleteList(
            {
              pk:row.pk,
            },
            row.template_id
          );
          this.$message.success("删除成功!");
          await this.loadData();
        } catch (e) {
          this.$message.error("删除失败!");
        }
      } catch (e) {
        this.$message.info("取消删除");
      }
    },
    // 导出表格
    download() {
      let headers = [
        { 巡检点名称: "name" },
        { 巡检人: "user_full_name" },
        { 是否异常: "yichang" },
        { 异常说明: "shuoming" },
        { 巡检时间: "xunjiantime" },
      ];
      xlsxExcel(headers, "巡检结果", this.data);
    },
  },
  async mounted() {
    await this.loadData();
  },
  created() {
    this.renwu_id = this.$route.query.renwu_id;
    this.xiangmu_id = this.$route.query.xiangmu_id;
  },
};
</script>

<style>
.errorStatus td{
    color: red;
  }
</style>
