<template>
  <div>
    <el-form inline>
      <el-form-item label="选择部门">
        <el-cascader
          clearable
          v-model="departmentpk"
          ref="departmentCascader"
          :options="department_display1"
          :show-all-levels="false"
          :props="{
            children: 'items',
            label: 'name',
            value: 'pk',
            checkStrictly: true,
          }"
          @change="Changeshiyong"
          style="width: 300px"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="选择分类">
        <el-cascader
          clearable
          v-model="categorypk"
          ref="categoryCascader"
          :options="category_display1"
          :show-all-levels="false"
          :props="{
            children: 'items',
            label: 'name',
            value: 'pk',
            checkStrictly: true,
          }"
          @change="Changefenlei"
          style="width: 300px"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-search" @click="search"
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
      :data="data"
      border
      stripe
      ref="table"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="资产名称" prop="name"></el-table-column>
      <el-table-column label="资产规格" prop="size"></el-table-column>
      <el-table-column label="资产型号" prop="model_num"></el-table-column>
      <el-table-column label="资产性质" prop="nature"></el-table-column>
      <el-table-column label="资产分类" prop="category_display">
      </el-table-column
      ><el-table-column label="计量单位" prop="unit"> </el-table-column
      ><el-table-column label="资产原值" prop="cost"> </el-table-column>
      <el-table-column label="购置日期" prop="release_time"></el-table-column>
      <el-table-column label="购置方式" prop="purchase_method"></el-table-column
      ><el-table-column
        label="保管单位/部门"
        prop="bg_department_display"
      ></el-table-column
      ><el-table-column label="保管人员" prop="bg_persion"></el-table-column
      ><el-table-column label="存放地点" prop="location"></el-table-column
      ><el-table-column label="使用期限" prop="down_time"></el-table-column
      ><el-table-column label="入账编号" prop="account_number"></el-table-column
      ><el-table-column label="入账日期" prop="account_date"></el-table-column
      ><el-table-column
        label="使用单位/部门"
        prop="department_display"
        width="250px"
      ></el-table-column
      ><el-table-column label="使用人员" prop="persion"></el-table-column
      ><el-table-column label="资产状态" prop="status"></el-table-column
      ><el-table-column label="出厂编号" prop="brand"></el-table-column
      ><el-table-column
        label="保修期限"
        prop="warranty_period"
      ></el-table-column
      ><el-table-column label="原资产号" prop="origin_sn"></el-table-column
      ><el-table-column label="是否盘点" prop="need_pandian"></el-table-column
      ><el-table-column
        label="累计折旧"
        prop="accumulated_depreciation"
      ></el-table-column
      ><el-table-column label="净值" prop="net_worth"></el-table-column
      ><el-table-column
        label="备注"
        prop="product_description"
      ></el-table-column
      ><el-table-column label="供应商" prop="gys"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next, sizes, total"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="search"
      @size-change="
        (pageSize) => {
          this.page = 1;
          this.pageSize = pageSize;
          this.search();
        }
      "
      :hide-on-single-page="false"
      :total="total"
      style="margin-top: 20px"
    ></el-pagination>
  </div>
</template>

<script>
import { mapState } from "vuex";
import resource from "@/resource.js";
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      data: [],
      department_display1: [],
      category_display1: [],
      departmentpk: "",
      categorypk: "",
      searchForm: {
        department: "",
        department_display: "",
        category: "",
        category_display: "",
      },
      page: 1,
      pageSize: 8,
      total: 0,
    };
  },
  methods: {
    async getDepartment() {
      let params = {
        org_id: this.org_id,
      };
      const res = await resource.getList("department", params);
      this.department_display1 = this.filterChildrenNull(res);
    },
    async getZiChanFenLei() {
      let params = {
        org_id: this.org_id,
        name:'资产分类'
      };
      const res = await resource.getObjFromList("basetree", params);
      if(res.items.length>0){
        this.category_display1 = this.filterChildrenNull(res.items);
      }

    },
    Changeshiyong(value) {
      this.departmentpk = value;
      this.searchForm.department = value.slice(-1).toString();
      let display =
        this.$refs.departmentCascader.getCheckedNodes()[0].pathLabels;
      this.searchForm.department_display = display.slice(-1);
    },
    Changefenlei(value) {
      this.categorypk = value;
      this.searchForm.category = value.slice(-1).toString();
      let display = this.$refs.categoryCascader.getCheckedNodes()[0].pathLabels;
      this.searchForm.category_display = display.slice(-1);
    },
    filterChildrenNull(data) {
      data.forEach((i) => {
        if (i.items.length > 0) {
          this.filterChildrenNull(i.items);
        } else {
          i.items = undefined;
        }
      });
      return data;
    },
    download() {
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
            `${this.searchForm.department_display}-${this.searchForm.category_display}-固定资产明细表.xlsx`
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
      });
    },
    async search() {
      let params = {template_id: "FT8172429443072",};
      if (this.searchForm.department) {
        params["department"] = this.searchForm.department;
      }
      if (this.searchForm.category) {
        params["category"] = this.searchForm.category;
      }
      let res = await resource.getList(
        "data",
        params,
        this.page,
        this.pageSize
      );
      this.data = res.data;
      this.total = res.count;
      if (res.data.length === 0) {
        this.$message.error("暂无资产!");
      }
    },
  },
  computed: {
    ...mapState(["org_id"]),
  },
  created() {
    this.getDepartment();
    this.getZiChanFenLei();
  },
};
</script>

<style>
</style>
