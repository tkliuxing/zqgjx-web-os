<template>
  <div class="jieguolist">
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.replace({ name: 'tianbao' })"
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
        stripe
        border
        :data="data"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <template v-for="item in tableList">
          <el-table-column :label="item.col_title" :key="item.pk">
            <template slot-scope="{ row }">
              {{ row.result[item.col_name] }}
            </template>
          </el-table-column>
        </template>
        <el-table-column label="提交时间"
          ><template slot-scope="{ row }">
            {{ transTime(row.create_time) }}
          </template></el-table-column
        >
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
      id: null,
      page: 1,
      pageSize: 15,
      total: 0,
      data: [],
      tableList: [],
      filter_form: {},
      origin_filter_form: {},
      loading: false,
    };
  },
  async created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      // await this.loadShijuan();
      await this.loadData();
      await this.getTable();
    }
  },
  methods: {
    async getTable() {
      let data = {
        biz_id: this.$bizCode.tianbao_biz,
        src_id: this.$sourceCode.source_id,
      };
      let resp = await resource.getObj("formtemplate", this.id, data);
      let fields = resp.field;
      let filter_form = {};
      fields.forEach((item) => {
        if (item.in_filter) {
          filter_form[item.col_name] = "";
        }
      });
      this.filter_form = filter_form;
      this.origin_filter_form = { ...filter_form };
      this.tableList = resp.field;
    },

    resetFilterForm() {
      this.filter_form = { ...this.origin_filter_form };
    },

    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.tianbao_biz,
        src_id: this.$sourceCode.source_id,
        tianbao_id: this.id,
        template_id: "FT301977801653833728",
      };
      let resp = await resource.getList("data", params);
      resp.data.forEach((item) => {
        item.result = JSON.parse(item.result);
      });
      this.data = resp.data;
      this.total = resp.count;
      this.loading = false;
    },

    async search() {
      this.page = 1;
      await this.loadData();
    },

    async nosearch() {
      this.page = 1;
      this.resetFilterForm();
      await this.loadData();
    },

    // 删除
    async deleteRow(row) {
      try {
        await this.$confirm("是否确定删除? 此操作不可恢复!");
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

    // 时间转换
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
};
</script>

<style scoped></style>
