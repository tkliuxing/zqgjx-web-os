<template>
  <div>
    <el-button
      type="success"
      icon="el-icon-download"
      @click="exportExcel"
      style="margin-bottom: 10px"
      round
    >
      导出
    </el-button>
    <el-table
      :data="data.data"
      border
      stripe
      ref="table"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column label="分类名称">
        <template slot-scope="{ row }">
          <span>{{ "\xa0".repeat(row.level * 5) + row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="折旧年限"
        prop="zjnx"
        width="200px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="年折旧率(%)"
        prop="nzjl"
        width="200px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="净残值率(%)"
        prop="jczl"
        width="200px"
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import resource from "@/resource.js";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import {mapState} from "vuex";
export default {
  data() {
    return {
      data: {},
    };
  },
  computed:{
    ...mapState(['org_id','userinfo'])
  },
  methods: {
    async getReport() {
      let params1 = {
        name:'资产分类'
      }
      let resp = await resource.getObjFromList('basetree',params1)
      let params = {
        biz_id:1,
        name:'资产分类',
        org_id: this.org_id,
        sys_id: this.userinfo.sys_id,
        parent_id: resp.pk
      }
      let res = await resource.getObj("formdatareport", "100013",params);
      this.data = res;
    },
    exportExcel() {
      this.$nextTick(() => {
        let wb = XLSX.utils.table_to_book(this.$refs.table.$el);
        let wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            `固定资产分类明细表.xlsx`
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
      });
    },
  },
  created() {
    this.getReport();
  },
};
</script>

<style>
</style>