<template>
  <div class="jieguolist">
    <el-card class="box-card">

      <el-form inline>
        <el-form-item>
          <el-button
              type="info"
              round
              icon="el-icon-arrow-left"
              @click="$router.replace({ name: 'tianbao-duohang' })"
          >返回
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button round type="success" icon="el-icon-upload2" @click="allExport">导出本页</el-button>
        </el-form-item>
        <template v-if="Object.keys(filter_form).length > 0">
          <el-form-item>
            <el-button round type="primary" icon="el-icon-search" @click="search">查找</el-button>
          </el-form-item>
          <el-form-item>
            <el-button round type="success" icon="el-icon-plus" @click="nosearch">全部</el-button>
          </el-form-item>
        </template>
      </el-form>

      <el-table :data="data" style="width: 100%; margin: 10px 0" ref="table">
        <el-table-column label="提交人" prop="create_user_info.full_name"></el-table-column>
        <el-table-column label="电话" prop="create_user_info.mobile"></el-table-column>
        <el-table-column label="提交时间">
          <template slot-scope="{ row }">
            {{ transTime(row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="success" round @click="viewResult(row)">查看</el-button>
            <el-button type="danger" round @click="deleteRow(row)">删除</el-button>
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

    <el-dialog
        title="查看"
        :visible.sync="showResult"
        width="800px">
      <el-table :data="resultData" style="width: 100%; margin: 10px 0" ref="table">
        <template v-for="item in tableList">
          <el-table-column :prop="item.col_name" :label="item.col_title">
          </el-table-column>
        </template>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showResult = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import resource from "@/resource.js";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { manyJsonToZip } from "@/utils/excelzip.js";

export default {
  name: "JieGuoList",
  data() {
    return {
      exporting: false,
      page: 1,
      pageSize: 15,
      id: null,
      total: 0,
      data: [],
      tableList: [],
      filter_form: {},
      origin_filter_form: {},
      showResult: false,
      resultData: [],
      tianbao: {
        pk: null,
        title: null,
      },
    };
  },
  methods: {
    async getTable() {
      let resp = await resource.getObj("formtemplate", this.id);
      this.tianbao = resp;
      let fields = resp.field;
      let filter_form = {};
      fields.forEach((item) => {
        if (item.in_filter) {
          filter_form[item.col_name] = "";
        }
      });
      this.filter_form = filter_form;
      this.origin_filter_form = {...filter_form};
      this.tableList = resp.field;
    },
    resetFilterForm() {
      this.filter_form = {...this.origin_filter_form};
    },
    async loadData() {
      let params = {
        field_01: this.id,
      };
      let resp = await resource.getList("services", params, this.page, this.pageSize);
      this.data = resp.data;
      this.total = resp.count;
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

    async deleteRow(row) {
      let params = {
        template: this.tianbao.pk,
        field_01_display: row.pk,
      };
      try {
        await this.$confirm("是否确定删除? 此操作不可恢复!");
        try {
          await resource.deleteObj("services", row.pk);
          this.resultData = await resource.getList('formdata', params);
          for (let i = 0; i < this.resultData.length; i++) {
            let pk = this.resultData[i].pk;
            await resource.deleteObj("formdata", pk);
          }
          this.$message.success("删除成功!");
          await this.loadData();
        } catch (e) {
          this.$message.error("删除失败!");
        }
      } catch (e) {
        this.$message.info("取消删除");
      }
    },

    transTime(timeStr) {
      return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
    },

    async viewResult(row) {
      let params = {
        template: this.tianbao.pk,
        field_01_display: row.pk,
      };
      this.resultData = await resource.getList('formdata', params);
      this.showResult = true;
    },

    async getExcel() {
      const confirmResult = await this.$confirm("是否下载Excel表格到电脑中?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
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
      let wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "array"});
      try {
        FileSaver.saveAs(
            new Blob([wbout], {type: "application/octet-stream;charset=utf-8"}),
            "填报结果.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

    lineToExcelJson(line) {
      let data = {};
      for (let i = 0; i < this.tableList.length; i++) {
        data[this.tableList[i].col_title] = line[this.tableList[i].col_name];
      }
      return data;
    },
    tableToExcelJson(table) {
      let data = [];
      for (let i = 0; i < table.length; i++) {
        data.push(this.lineToExcelJson(table[i]))
      }
      return data;
    },
    async allExport() {
      this.exporting = true;
      try{
        let exportDatas = [];
        for (let i = 0; i < this.data.length; i++) {
          let params = {
            template: this.tianbao.pk,
            field_01_display: this.data[i].pk,
          };
          let tableDatas = await resource.getList('formdata', params);
          let excel_filename = this.data[i].create_user_info ? this.data[i].create_user_info.full_name + i.toString() : i.toString()
          exportDatas.push({
            data: this.tableToExcelJson(tableDatas),
            filename: excel_filename,
          })
        }
        console.log(exportDatas);
        await manyJsonToZip(exportDatas, `${this.tianbao.title}-${this.page}`);
      } catch (e) {
        console.error(e);
      } finally {
        this.exporting = false;
      }
    },
  },

  async created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      // await this.loadShijuan();
      await this.loadData();
      await this.getTable();
    }
  },
};
</script>

<style scoped></style>
