<template>
  <div>
    <el-form inline>
      <el-form-item label="选择汇总类别">
        <el-select v-model="type" @change="data = {}">
          <el-option label="按分类汇总" value="分类汇总"></el-option>
          <el-option label="按部门汇总" value="部门汇总"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-search" @click="getReport"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          round
          icon="el-icon-download"
          @click="download"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="data.data"
      border
      stripe
      ref="table"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <template v-if="type === '分类汇总'">
        <el-table-column label="分类名称">
          <template slot-scope="{ row }">
            <span>{{ "\xa0".repeat(row.level * 5) + row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="资产总数"
          prop="count"
          align="center"
        ></el-table-column>
      </template>
      <template v-else-if="type === '部门汇总'">
        <el-table-column label="部门名称">
          <template slot-scope="{ row }">
            <span>{{ "\xa0".repeat(row.level * 5) + row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="资产总数"
          prop="count"
          align="center"
        ></el-table-column>
      </template>
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
      type: "",
      data: {},
    };
  },
  computed:{
    ...mapState(['userinfo'])
  },
  methods: {
    async getReport() {
      if (!this.type) {
        this.$message.error("请选择一个分类!");
      } else {
        let resp = await resource.getObjFromList('basetree',{name:'资产分类'})
        let params = {
          biz_id:1,
          sys_id: this.userinfo.sys_id,
          org_id:this.userinfo.org_id,
        }
        let res = await resource.getObj(
          `formdatareport`,
          this.type === "分类汇总" ? "100014" : "100015",
          this.type === "分类汇总" ? {...params,parent_id:resp.pk} : params,
        );
        this.data = res;
      }
    },
    download() {
      if (!this.type) {
        this.$message.error("请选择一个分类!");
      } else {
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
              `${this.type}表.xlsx`
            );
          } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
          }
        });
      }
    },
  },
};
</script>

<style>
</style>