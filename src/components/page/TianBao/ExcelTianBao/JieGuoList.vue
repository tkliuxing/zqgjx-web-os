<template>
  <div class="jieguolist">
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.go(-1)"
            >返回
          </el-button>
          <el-button round type="success" @click="getExcel"
            >导出表格
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        element-loading-text="正在加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        ref="table"
        border
        :data="data"
        style="width: 100%; margin: 10px 0"
      >
        <el-table-column label="提交人" prop="user_name"></el-table-column>
        <el-table-column label="Excel文件" width="120px">
          <template slot-scope="{ row }">
            <a v-if="row.file" :href="row.file" target="_blank">下载</a>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="提交时间">
          <template slot-scope="{ row }">
            {{ transTime(row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }"><el-popconfirm title="确定删除吗？" @confirm="deleteRow(row)" style="margin-left: 10px">
            <el-button type="danger" size="mini" round slot="reference" icon="el-icon-remove">
              删除</el-button>
          </el-popconfirm>
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
  </div>
</template>

<script>
import moment from "moment";
import resource from "@/resource.js";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  name: "JieGuoList",
  data() {
    return {
      page: 1,
      pageSize: 15,
      id: null,
      total: 0,
      data: [],
      tableList: [],
      filter_form: {},
      origin_filter_form: {},
      loading: false,
    };
  },
  methods: {
    // 加载
    async loadData() {
      this.loading = true;
      let params = {
        tianbao_id: this.id,
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.tianbao_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT140720949716258816",
      };
      let resp = await resource.getList("data", params);
      // console.log(resp);
      this.data = resp.data;
      this.total = resp.count;
      this.loading = false;
    },
    // 删除
    async deleteRow(row) {
      try {
        // await this.$confirm("是否确定删除? 此操作不可恢复!");
        try {
          await resource.deleteList(
            {
              pk: row.pk,
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
    // 格式化时间
    transTime(timeStr) {
      return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
    },

    async getExcel() {
      const confirmResult = await this.$confirm(
        "是否下载Excel表格到电脑中?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消下载");
      }
      this.exportExcel();
    },

    exportExcel() {
      let fix = document.querySelector(".el-table__fixed");
      let wb;
      if (fix) {
        wb = XLSX.utils.table_to_book(this.$refs["table"].$el.removeChild(fix));
        this.$refs["table"].$el.appendChild(fix);
      } else {
        wb = XLSX.utils.table_to_book(this.$refs["table"].$el);
      }
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
          "填报结果.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
  },

  async created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      await this.loadData();
    }
  },
};
</script>

<style scoped></style>
