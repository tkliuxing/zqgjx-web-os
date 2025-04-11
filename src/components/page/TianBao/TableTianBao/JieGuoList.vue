<template>
  <div class="jieguolist">
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.replace({ name: 'tianbao-table' })"
            >返回
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            round
            type="success"
            icon="el-icon-upload2"
            @click="getExcel"
            >导出本页</el-button
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
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        ref="table"
      >
        <el-table-column label="提交人" prop="user_name"></el-table-column>
        <el-table-column label="提交时间">
          <template slot-scope="{ row }">
            {{ transTime(row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              round
              :loading="editState"
              @click="viewResult(row)"
              icon="el-icon-tickets"
              >查看</el-button
            >
            <el-popconfirm title="确定删除吗？" @confirm="deleteRow(row)">
            <el-button type="danger"  class="deleteButton" round slot="reference" icon="el-icon-remove">
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

    <el-dialog title="查看结果" :visible.sync="showResult" width="800px">
      <table ref="table-info">
        <thead>
          <tr>
            <th>选项</th>
            <th v-for="(item, index) in tableList" :key="index">
              {{ item.col_title }}
            </th>
          </tr>
          <tr v-for="(item, index) in hanglist" :key="index">
            <td>{{ item.len_name }}</td>
            <td v-for="(tditem, tdindex) in tableList" :key="tdindex">
              <div v-for="(info, infoindex) in resultData" :key="infoindex">
                <div v-if="index === infoindex">
                  {{ info.result[tditem.col_name] }}
                </div>
              </div>
            </td>
          </tr>
        </thead>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" icon="el-icon-upload2" @click="getinfoExcel()"
          >导出</el-button
        >
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
      hanglist: null,
      loading: false,
      editState: false,
    };
  },
  methods: {
    // 加载填报详情
    async getTable() {
      let resp = await resource.getObj("data", this.id);
      this.tianbao = resp;
      if (typeof resp.table_lines == "string") {
        resp.table_lines = JSON.parse(resp.table_lines);
      }
      let newArr = resp.table_lines.map((item) => ({
        len_name: item,
      }));
      this.hanglist = newArr;
      this.tableList = resp.field;
    },

    // 加载结果列表
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.tianbao_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT140697558892748800",
        tianbao_id: this.id,
      };
      let resp = await resource.getList("data", params);
      this.data = resp.data;
      this.total = resp.count;
      this.loading = false;
    },

    // 删除
    async deleteRow(row) {
      try {
        try {
          await resource.deleteList(
            {
              pk: row.pk,
            },
            row.template_id
          );
          await resource.deleteList(
            {
              jieguo_id: row.pk,
            },
            "FT140625926347358208"
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

    // 查看结果
    async viewResult(row) {
      this.editState = true;
      try {
        let data = {
          biz_id: this.$bizCode.tianbao_biz,
          src_id: this.$sourceCode.source_id,
          jieguo_id: row.pk,
          template_id: "FT140625926347358208",
        };
        let resp = await resource.getList("data", data);
        for (let item of resp) {
          item.result = JSON.parse(item.result);
        }
        this.resultData = resp;
        this.editState = false;
        this.showResult = true;
      } catch {
        console.log("出现错误");
      }
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

    async getinfoExcel() {
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
      this.exportinfoExcel();
    },

    exportinfoExcel() {
      let wb = XLSX.utils.table_to_book(this.$refs["table-info"]);
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
      await this.getTable();
    }
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}
table td,
table th {
  border: 1px solid #ebeef5;
  color: #666;
  height: 40px;
  font-weight: normal;
  font-size: 14px;
}
table thead th {
  background-color: #f5f7fb;
}
table tr:nth-child(odd) {
  background: #f5f7fb;
}
table tr:nth-child(even) {
  background: #fff;
}
.deleteButton{
  margin-left: 5px;
}
</style>
