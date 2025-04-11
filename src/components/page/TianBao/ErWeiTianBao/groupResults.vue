<template>
  <div class="results">
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <el-button
              type="info"
              round
              icon="el-icon-arrow-left"
              @click="$router.go(-1);"
          >返回
          </el-button>
        </el-form-item>
        <el-form-item>
          <div style="text-align: center; font-size: 1.5rem;padding-bottom: 20px">
            {{ title }}
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="getExcel" type="warning" round icon="el-icon-download">数据导出</el-button>
        </el-form-item>
      </el-form>
      <table>
      </table>
      <el-table
          ref="table"
          v-loading="loading"
          element-loading-text="正在加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          stripe
          border
          show-summary
          sum-text="合计"
          row-key="pk"
          :data="data"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
          max-height="480px"
          @sort-change="sortable"
      >
        <el-table-column label="" prop="region" style="text-align: center">
          <template slot-scope="{ row }">
            {{ row.region }}
          </template>
        </el-table-column>
        <template v-for="item in groupHeader">
          <el-table-column :label="item.name">
            <template v-for="tjh in tjHeader[item.name]">
              <el-table-column :label="tjh.name" :key="tjh.pk" :prop="tjh.pk" :sortable="sortabled">
                <template slot-scope="{ row }">
                  {{ row[tjh.pk] }}
                </template>
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table>

    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import resource from "@/resource.js";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import axios from "axios";
import {BASE_HOST} from "@/constvars";
import collection from "lodash/collection";
import _ from "lodash";
import TuBiaoBaoBiao from "@/components/TuBiaoBaoBiao/index.vue";
import {getChartsData, genChartConfig} from "@/components/TuBiaoBaoBiao/chart/util";
import {getList, getObj} from "@/resource";


export default {
  name: "Results",
  components: {
    tbbb: TuBiaoBaoBiao
  },
  data() {
    return {
      tid: null,
      pk: null,
      data: [],
      tableList: [],
      groupHeader: [],
      tjHeader: {},
      ChartsHeaders: [],
      Chartsgroup: null,
      excelTmp: {},
      fieldType: {},
      title: "",
      loading: false,
      templateData: {
        title: null,
        form_type: 3,
        keyword: "",
        api_version: "v1",
        api_name: "formdata",
        code: "",
        department: [],
        photo: "",
        remark: {
          group_type: [],
          col_type: [],
          resource: {},
          bz_info: null,
        },
        need_login: false,
      },
      sortabled: 'custom',
    };
  },
  async created() {
    if (this.$route.params.tid) {
      this.tid = this.$route.params.tid;
      this.pk = this.$route.params.pk;
      this.loading = true;
      await this.loadTemplate();
      await this.loadData();
      this.loading = false;
    }
  },
  methods: {
    sortable({column, prop, order}) {
      if (order === null || prop === null) {
        this.data = collection.sortBy(this.data, ['pk'], ['asc']);
      } else {
        let oo = order === "ascending" ? 'asc' : 'desc';
        let dd = collection.orderBy(this.data, [prop], [oo]);
        this.data = dd;
      }

    },
    async loadTemplate() {
      const resp = await axios.get(`${BASE_HOST}/api/v1/formtemplate/${this.tid}/`);
      let data = resp.data;
      data.remark = JSON.parse(data.remark);
      // 字段键值对应列
      data.field.map((val) => {
        val.name = val.col_title;
        val.value = val.alias || val.col_name;
        this.excelTmp[val.name] = val.value;
        this.fieldType[val["value"]] = val["widget"];
      })

      // 将数据和表头赋值给变量
      this.templateData = data;
      this.title = data.title;
      // 分组列表头
      let group_type = []
      for (let key in data.remark.group_type) {
        if (data.remark.group_type[key].pk === this.pk) {
          group_type = data.remark.group_type[key].value;
          break;
        }
      }

      this.groupHeader = group_type.map((val) => {
        let obj = {};
        obj.name = val.col_title;
        obj.value = this.excelTmp[val.col_title];
        this.tjHeader[val.col_title] = [];
        if (val.col_type) {
          this.tjHeader[val.col_title].push({
            pk: val.pk + "_1",
            name: val.hj_title,
            value: val.hj_title,
          })
        }
        if (val.htj_title) {
          this.tjHeader[val.col_title].push({
            pk: val.pk + "_2",
            name: val.htj_title,
            value: val.htj_title,
          })
        }
        return obj
      });
    },
    async loadData() {
      // 分组列表头
      let group_type = []
      for (let key in this.templateData.remark.group_type) {
        if (this.templateData.remark.group_type[key].pk === this.pk) {
          group_type = this.templateData.remark.group_type[key].value;
          break;
        }
      }
      let data = await resource.getList(`data`, {template_id: this.tid,});
      for (let item in data) {
        for (let i in data[item]) {
          if (this.fieldType[i] === 'number' && data[item][i]) {
            data[item][i] = Number(data[item][i]);
          }
        }
      }
      data = collection.groupBy(data, 'region');
      let end_data = []
      for (let key in data) {
        let zi_data = data[key];
        let obj = {region: key};
        for (let item of group_type) {
          let counts = 0;
          let numbers = 0;
          for (let zi of zi_data) {
            let name = zi[this.excelTmp[item.group_type]];
            if (item.resource[item.group_type].indexOf(name) > -1) {
              counts = counts + zi[this.excelTmp[item.col_type]]
              numbers = numbers + 1;
            }
          }
          obj[item.pk + '_1'] = counts;
          obj[item.pk + '_2'] = numbers;
        }
        end_data.push(obj);
      }
      this.data = [...end_data];
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
            new Blob([wbout], {type: "application/octet-stream;charset=utf-8"}),
            "填报结果.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  },
};
</script>

<style scoped lang="scss">

.el-table__footer-wrapper tbody td.el-table__cell, .el-table__header-wrapper tbody td.el-table__cell {
  background-color: #F5F7FA;
  color: #606266;
  text-align: center;
}
::v-deep  .has-gutter{
  tr td{
    text-align: center !important;
  }
}
</style>
