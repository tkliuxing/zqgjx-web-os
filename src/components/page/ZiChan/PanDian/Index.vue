<template>
  <el-card>
    <div>
      <el-button
        type="warning"
        @click="ShuoMingTo"
        class="fix-shuoming"
        round
        plain
        icon="el-icon-notebook-2"
        >使用说明</el-button
      >
        <el-button
          type="primary"
          @click="ShiLiTo"
          class="fix-tab"
          plain
          round
          icon="el-icon-picture-outline">
          查看示例
        </el-button>
      <el-form inline>
        <el-form-item>
          <el-button
            type="primary"
            round
            icon="el-icon-circle-plus-outline"
            @click="addTab"
            >新建盘点</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="filterData.search"
            clearable
            @clear="loadData"
            placeholder="任务名称、编号"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            round
            icon="el-icon-search"
            @click="loadData"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            icon="el-icon-download"
            round
            @click="download"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
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
      <el-table-column label="盘点编号" prop="sn"></el-table-column
      ><el-table-column label="盘点名称" prop="name"></el-table-column>
      <el-table-column label="负责人" prop="fzr_display"></el-table-column>
      <el-table-column
        label="任务截至日期"
        prop="task_end_date"
      ></el-table-column
      ><el-table-column label="盘点说明" prop="description"></el-table-column>
      <el-table-column label="操作" width="400px">
        <template slot-scope="{ row }">
          <el-button type="success" icon="el-icon-tickets" @click="code(row)" round size="mini">二维码</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-edit"
            @click="edit(row.pk)"
            >编辑</el-button>

          <el-button
            type="success"
            round
            icon="el-icon-tickets"
            @click="lookjieguo(row)"
            style="margin-right: 10px"
            >盘点结果</el-button>

          <el-popconfirm title="确定删除吗？" @confirm="del(row)">
            <el-button
              type="danger"
              round
              slot="reference"
              icon="el-icon-remove"
            >删除</el-button>
          </el-popconfirm>
          <!-- <el-button type="danger" round icon="el-icon-remove" @click="del(row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showCodeVisable" width="20%" center>
<!--        <QrCode :url="codeInfo.codeurl" v-if="showCodeVisable" :text="codeInfo.title" title="资产盘点" style="cursor: pointer"/>-->
        <Qr v-if="showCodeVisable" :url="codeInfo.codeurl" style="margin: auto;cursor: pointer "></Qr>
          <div class="tips" style="margin: 15px 0;text-align: center">
            点击二维码保存图片
          </div>
<!--          <div style="text-align:center">地址：<a :href="codeInfo.codeurl" target="_blank">{{ codeInfo.codeurl }}</a></div>-->
    </el-dialog>
    <!-- 分页 -->
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
  </el-card>
</template>
<script>
import { mapState } from "vuex";
import resource from "@/resource";
import xlsxExcel from "@/utils/xlsxExcel";
import QrCode from "@/components/common/QrCode.vue";
import Qr from "@/components/common/QR.vue";
export default {
  components: {Qr, QrCode},
  computed: {
    ...mapState(["org_id", "sys_id", "httpurl", "userinfo","quanxian"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      filterData: { search: null },
      data: [],
      loading: false,
      showCodeVisable: false,
      codeInfo: {
        codeurl: "",
        title: "",
      },
    };
  },
  methods: {
    code(row) {
      this.codeInfo.codeurl = `${window.location.origin}/gdzc/?pk=${row.pk}`;
      this.codeInfo.title = row.name;
      this.showCodeVisable = true;
    },
    async loadData() {
      this.loading = true;
      let params = {
        ...this.filterData,
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.zichan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT9228425158656",
      };
      let res = await resource.getList("data", params);
      this.total = res.count;
      this.data = res.data;
      this.loading = false;
    },
    ShiLiTo() {
      this.$router.push("/pandianzhanshi");
    },
    addTab() {
      if(!this.quanxian.固定资产 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.$router.push({ name: "zichan-createpandian" });
      }

    },
    edit(pk) {
      this.$router.push({
        name: "zichan-createpandian",
        query: { task_id: pk },
      });
    },
    // 结果列表
    lookjieguo(row) {
      this.$router.push({
        name: "pandian-jieguo",
        params: { id: row.pk },
      });
    },

    // 导出表格
    download() {
      let headers = [
        { 盘点编号: "sn" },
        { 盘点名称: "name" },
        { 负责人: "fzr_display" },
        { 任务截至日期: "task_end_date" },
        { 盘点说明: "description" },
      ];
      xlsxExcel(headers, "固定资产盘点任务列表", this.data);
    },

async del(info) {
      try {
        try {
          await resource.deleteList(
            {
              pk: info.pk,
            },
            info.template_id
          );
          await resource.deleteList(
            {
              task_id: info.pk,
            },
            "FT9231247929344"
          );
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          setTimeout(() => {
            this.loadData();
          }, 200);
        } catch (e) {
          this.$message.error("删除失败!");
        }
      } catch (e) {
        this.$message.info("取消删除");
      }
    },

    // del(info) {
    //   this.$confirm("是否删除?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       await resource.deleteList(
    //         {
    //           pk: info.pk,
    //         },
    //         info.template_id
    //       );
    //       await resource.deleteList(
    //         {
    //           task_id: info.pk,
    //         },
    //         "FT9231247929344"
    //       );
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!",
    //       });
    //       setTimeout(() => {
    //         this.loadData();
    //       }, 200);
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },

    ShuoMingTo() {
      this.$router.push({ name: "zichanpandian-shuoming" });
    },
  },
  mounted() {
    this.loadData();
  },
  created() {},
};
</script>
