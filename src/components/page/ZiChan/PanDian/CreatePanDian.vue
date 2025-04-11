<template>
  <el-card>
    <el-steps :active="step" simple>
      <el-step title="第一步:创建盘点任务" icon="el-icon-edit"></el-step>
      <el-step title="第二步:添加盘点项目" icon="el-icon-tickets"></el-step>
    </el-steps>
    <firststep v-if="step==0" @submit="firstSubmit" @addStep="addStep" :taskobj="taskobj"></firststep>
    <el-row :gutter="20" v-if="step == 1" style="margin-top: 2rem">
      <el-col :span="12">
        <yzichan @freshen="getPanDianList" :task_id="task_id"></yzichan>
      </el-col>
      <el-col :span="12">
        <el-form>
          <el-form-item>
            <el-button type="info" round @click="download">导出盘点列表</el-button>
            <el-button type="success" round @click="backload">确认盘点列表</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading"
          element-loading-text="正在加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          stripe
          border
          ref="table"
          :data="data"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="资产名称" prop="pd_name"></el-table-column>
          <el-table-column label="资产编号" prop="sn"></el-table-column>
          <el-table-column
            label="资产分类"
            prop="category_display"
          ></el-table-column>
          <el-table-column
            label="使用单位/部门"
            prop="department_display"
          ></el-table-column>
          <el-table-column label="使用人员" prop="persion"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="danger" round size="mini" @click="del(row)"
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
          style="margin-top: 10px"
        ></el-pagination>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import resource from "@/resource";
import yzichan from "./YZiChan.vue";
import firststep from "./FirstStep.vue"
import xlsxExcel from "@/utils/xlsxExcel";
export default {
  components: {
    yzichan,
    firststep
  },
  data() {
    return {
      form: {},
      page: 1,
      pageSize: 15,
      loading: false,
      step: 0,
      data: [],
      total: 0,
      task_id: null,
      taskobj:{},
      date:[],
    };
  },
  mounted() {
    if(this.$route.query.task_id){
      this.task_id = this.$route.query.task_id
      this.loadInfo()
    }
    this.loadData();
  },
  methods: {
    backload(){
      history.back()
      this.$message({
        type: "success",
        message: "保存成功!",
      });
    },
    async firstSubmit(pk) {
      this.task_id = pk
      this.loadData()
    },
    // 盘点项目列表
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.zichan_biz,
        src_id: this.$sourceCode.source_id,
        task_id: this.task_id,
        template_id: "FT9231247929344",
      };
      let res = await resource.getList("data", params);
      this.total = res.count;
      this.data=res.data;
      this.loading = false;

    },
    // 任务详情
    async loadInfo(){
      let params = {
        biz_id: this.$bizCode.zichan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT9228425158656",
      }
      let res = await resource.getObj("data",this.task_id,params)
      this.taskobj = res
    },
    // 下一步
    addStep(){
      this.step++
    },
    getPanDianList() {
      this.loadData();
    },
    // 删除
    async del(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await resource.deleteList(
            {
              pk: row.pk,
            },
            row.template_id
          );
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          setTimeout(() => {
            this.loadData();
          }, 200);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 导出表格
    download() {
      let headers = [
        { 资产名称: "pd_name" },
        { 资产编号: "sn" },
        { 资产分类: "category_display" },
        { 使用单位部门: "department_display" },
        { 使用人员: "persion" },
      ];
      xlsxExcel(headers, "固定资产盘点项目列表", this.data);
    },
  },
};
</script>

<style>

</style>
