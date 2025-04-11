<template>
  <el-card>
    <el-form inline>
      <el-form-item label="开始日期">
        <el-date-picker v-model="search.ff_starttime" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker v-model="search.ff_endtime" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getReport" icon="el-icon-search" type="primary">搜索</el-button>

        <el-button type="warning" @click="ShuoMingTo" class="fix-shuoming" round icon="el-icon-notebook-2" plain>使用说明</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-download" type="success" @click="exportExcel">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="wplyjyreport" v-loading="loading" element-loading-text="加载中..." :data="data.slice((page - 1) * pageSize, page * pageSize)"
              stripe border :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
      <el-table-column v-for="i in header" :key="i.pk" :label="i.title || i.name" :filters="
          i.title === '领用/借用'
            ? [
                { text: '领用', value: '领用' },
                { text: '借用', value: '借用' },
              ]
            : null
        " :filter-method="i.title === '领用/借用' ? filterTag : null" :filter-placement="i.title === '领用/借用' ? 'bottom-end' : null">
        <template slot-scope="{ row }">
          {{ row[i.key] || row[i.title] || row[i.name] || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="合计" prop="totals"></el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px" @size-change="
        {
          this.pageSize = pageSize;
          this.page = 1;
        }
      " @current-change="(page) => (this.page = page)" :current-page="page" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
    </el-pagination>
  </el-card>
</template>

<script>
import resource from "../../../resource";
import lodash from "lodash";
import moment from "moment";
import XLSX from "xlsx";
export default {
  name: "WuPingLingYong",
  data() {
    return {
      data: [],
      header: [],
      loading: false,
      search: {
        ff_starttime: moment(new Date())
          .startOf("month")
          .format("YYYY-MM-DD"),
        ff_endtime: moment(new Date())
          .endOf("month")
          .format("YYYY-MM-DD"),
      },
      page: 1,
      pageSize: 10,
    };
  },
  methods: {
    filterTag(value, row) {
      return value === row.field_03;
    },
    async getReport() {
      let params = {
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
      };
      if (this.search.ff_starttime) {
        params["ff_starttime"] = this.search.ff_starttime;
      }
      if (this.search.ff_endtime) {
        params["ff_endtime"] = this.search.ff_endtime;
      }
      // this.loading = true;
      let th = [],
        data = [];
      let res = await resource.getObj("formdatareport", "5847", params);
      th = th.concat(res.header);
      let dp = await resource.getList("flatdepartment", {
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
      });
      this.header = th.concat(dp);

      console.log(this.header,'ee')
      let type = lodash.groupBy(res.data, "name");
      for (const name in type) {
        let groupby = lodash.groupBy(type[name], "field_03");
        for (const key in groupby) {
          let obj = { totals: 0 };
          let format = groupby[key].map((i) => {
            obj[i.dpname] = i.total;
            obj.totals += i.total;
            for (const key in i) {
              if (!Object.hasOwnProperty.call(obj, key)) {
                obj[key] = i[key];
              }
            }
            return obj;
          });
          let tmp = {};
          format.forEach((i) => {
            Object.assign(tmp, i);
          });
          data.push(tmp);
        }
      }
      this.data = data;
    },
    ShuoMingTo() {
      this.$router.push({ name: "wplyjyreport-shuoming" });
    },
    exportExcel() {
      let table_book = XLSX.utils.table_to_book(this.$refs.wplyjyreport.$el);
      XLSX.writeFile(table_book, "物品领用借用报表.xlsx")
    },
    moment,
  },
  created() {
    this.getReport();
  },
};
</script>

<style></style>
