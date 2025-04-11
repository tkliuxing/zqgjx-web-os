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
        <el-form-item>
          <el-button
              v-if="templateData.remark.group_type.length === 1"
              type="success"
              round
              icon="el-icon-download"
              @click="dialogVisible=true"
          >查看图表
          </el-button>
         <span v-else style="color: red;font-size: 12px">*注：只有选择单列数据可查看图表，不包含统计列</span>
        </el-form-item>
      </el-form>

      <el-table
          ref="table"
          v-loading="loading"
          element-loading-text="正在加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          stripe
          border
          row-key="pk"
          :data="data"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
          max-height="480px"
          @sort-change="sortable"
      >
        <template v-for="item in groupHeader">
          <el-table-column :label="item.name" :key="item.pk" :prop="`${item['value']}`" :sortable="sortabled">
            <template slot-scope="{ row }">
              {{ row[item.value] }}
            </template>
          </el-table-column>
        </template>
        <template v-for="item in tjHeader">
          <el-table-column :label="item.name" :key="item.pk" :prop="`${item['value']}`" :sortable="sortabled">
            <template slot-scope="{ row }">
              {{ row[item.value] }}
            </template>
          </el-table-column>
        </template>
        <el-table-column label="填写行数" :sortable="sortabled" prop="count">
          <template slot-scope="{ row }">
            <span>{{ row.count }}</span>
            <!--            {{ transTime(row.create_time) }}-->
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
          title=""
          :visible.sync="dialogVisible"
          width="80%">
        <tbbb :is-data="tubiao_data"/>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
      </el-dialog>
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
import {getChartsData,genChartConfig } from "@/components/TuBiaoBaoBiao/chart/util";
import {getList, getObj} from "@/resource";


export default {
  name: "Results",
  components: {
    tbbb: TuBiaoBaoBiao
  },
  data() {
    return {
      tid: null,
      data: [],
      tableList: [],
      groupHeader: [],
      tubiao_data: null,
      tjHeader: [],
      ChartsHeaders: [],
      Chartsgroup: null,
      excelTmp: {},
      fieldType: {},
      title: "",
      loading: false,
      dialogVisible: false,
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
      this.loading = true;
      await this.loadTemplate();
      await this.loadData();
      this.loading = false;
      await this.tubiaoData();
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
      this.groupHeader = data.remark.group_type.map((val) => {
        let obj = {};
        obj.name = val;
        obj.value = this.excelTmp[val];

        return obj
      });
      if (data.remark.group_type.length === 1) {
        this.Chartsgroup = {
          "key": this.excelTmp[data.remark.group_type[0]],
          "title": data.remark.group_type[0],
          "type": "str",
          "length": 30
        }
        this.ChartsHeaders.push({
          "key": this.excelTmp[data.remark.group_type[0]],
          "title": data.remark.group_type[0],
          "type": "str",
          "length": 30
        })
      }
      //统计表头,需要给数据列表中追加统计结果，统计结果可搜索  统计0002 查看
      for (let key in data.remark.resource) {
        for (let item of data.remark.resource[key]) {
          let obj = {};
          obj.name = key + "_" + item;
          obj.value = key + "_" + item;
          this.excelTmp[key + "_" + item] = key + "_" + item;
          this.tjHeader.push(obj);
          this.ChartsHeaders.push({"key": key + "_" + item, "title": key + "_" + item, "type": "str", "length": 30})
        }
      }
      this.ChartsHeaders.push({"key": "count", "title": "填写行数", "type": "str", "length": 30})
    },
    async loadData() {
      let templateData = {...this.templateData};
      let data = await resource.getList(`data`, {template_id: this.tid,});
      for (let item in data) {
        for (let i in data[item]) {
          if (this.fieldType[i] === 'number' && data[item][i]) {
            data[item][i] = Number(data[item][i]);
          }
        }
      }

      data = collection.groupBy(data, (n) => {
        let obj = null;
        // 对多个值进行分组
        for (let item of this.templateData.remark.group_type) {
          if (!obj) {
            obj = n[this.excelTmp[item]]
          } else {
            obj = obj + '#' + n[this.excelTmp[item]]
          }
        }
        return obj
      });

      let data_array = [];
      for (let key in data) {
        let data_obj = {...data[key][0]};

        // 统计行数
        data_obj.count = data[key].length

        // 根据配置统计出平均值及总计
        for (let i in templateData.remark.resource) {
          for (let item of templateData.remark.resource[i]) {
            data_obj[i + "_" + item] = 0
            if (item === "总计") {
              data_obj[i + "_" + item] = _.round(_.sumBy(data[key], this.excelTmp[i]), 2)
            } else {
              data_obj[i + "_" + item] = _.round(_.meanBy(data[key], this.excelTmp[i]), 2)
            }
          }
        }

        data_array.push(data_obj)
      }
      this.data = [...JSON.parse(JSON.stringify(data_array))];

    },
    async tubiaoData() {
      let report_data = {
        data: [...this.data],
        header: [...this.ChartsHeaders],
        title: this.title + '-统计图表',
      }
      this.tubiao_data = getChartsData(report_data, this.title + '-统计图表', this.ChartsHeaders, this.Chartsgroup, 'bar');
      // this.tubiao_data = genChartConfig(this.title + '-统计图表', "name", {
      //   "key": "name",
      //   "title": "物品名称",
      //   "type": "str",
      //   "length": 30
      // }, 'line');
      console.log(this.tubiao_data)
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
    },
  },
};
</script>

<style scoped></style>
