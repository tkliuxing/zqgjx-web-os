<template>
  <div>
    <div>
      <el-form inline>
        <el-form-item>
          <el-cascader
            :show-all-levels="false"
            v-model="searchData.category"
            placeholder="选择分类"
            :options="category_display1"
            clearable
            :props="{
              children: 'items',
              label: 'name',
              value: 'pk',
              checkStrictly: true,
            }"
            @change="Changefenlei"
            @clear="loadData"
            style="width: 150px"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-cascader
            v-model="searchData.department"
            :options="department_display1"
            placeholder="选择使用部门"
            clearable
            :props="{
              children: 'items',
              label: 'name',
              value: 'pk',
              checkStrictly: true,
            }"
            @change="Changeshiyong"
            @clear="loadData"
            style="width: 150px"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData" round>查询</el-button>
          <el-button type="success" @click="add" round
          >添加到盘点列表
          </el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="正在加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      stripe
      border
      ref="table"
      :data="data"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      @select="SelectionChange"
      @select-all="SelectAll"
    >
      <el-table-column type="selection" width="55" ></el-table-column>
      <el-table-column label="资产名称" prop="name"></el-table-column
      >
      <el-table-column label="资产编号" prop="sn"></el-table-column>
      <el-table-column
        label="资产分类"
        prop="category_display"
      ></el-table-column
      >
      <el-table-column
        label="使用单位/部门"
        prop="department_display"
      ></el-table-column
      >
      <el-table-column label="使用人员" prop="persion"></el-table-column>
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
      style="margin-top: 10px"
    ></el-pagination>
  </div>
</template>
<script>
import {mapState} from "vuex";
import resource from "@/resource";

export default {
  computed: {
    ...mapState(["org_id", "sys_id", "userinfo"]),
  },
  props: {
    task_id: {
      type: String,
      default: "",
    },
  },
  watch: {
    task_id: {
      handler(newName, oldName) {
        this.task_id = newName
      },
      immediate: true,
    },
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      searchData: {
        category: null,
        department: null,
      },
      department_display1: [],
      category_display1: [],
      pandianList: [],
      loading: false,
      zhutai:false,
    };
  },
  methods: {
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.zichan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT8172429443072",
      };
      if (this.searchData.department) {
        params['department'] = this.searchData.department
      }
      if (this.searchData.category) {
        params['category'] = this.searchData.category
      }
      if (this.userinfo.func_group_names.indexOf("政企工具箱管理员") === -1) {
        params.department = this.userinfo.department;
      }
      let res = await resource.getList("data", params);
      this.total = res.count;
      this.data = res.data;
      this.loading = false;
    },

    async getZiChanFenLei() {
      let params = {
        org_id: 0,
        biz_id: this.$bizCode.zichanfenlei_biz,
        isroot: true,
      };
      const res = await resource.getList("basetree", params);
      this.category_display1 = this.filterChildrenNull(res);
    },
    async getDepartment() {
      let params = {
        org_id: this.org_id,
      };
      const res = await resource.getList("department", params);
      this.department_display1 = this.filterChildrenNull(res);
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

    Changeshiyong(value) {
      this.searchData.department = value.slice(-1).toString();
    },
    Changefenlei(value) {
      this.searchData.category = value.slice(-1).toString();
    },

    SelectionChange(val) {
      this.pandianList = val;
      console.log(val)
    },
    SelectAll(val) {
      this.pandianList = val;
    },

    async add() {
      try {
        for (let item of this.pandianList) {
          item['task_id'] = this.task_id;
          item['state'] = '未盘点';
          item['template_id'] = 'FT9231247929344';
          item.zichan_id = item.pk;
          item.pd_name = item.name;
          item.sn = item.sn;
        }
        let res = await resource.createObj("data", this.pandianList);
        this.$emit("freshen");
        this.$message.success("编辑成功!");
      } catch (err) {
        this.$message.warning("未选择资产");
      }
    },
  },
  created() {
    this.getZiChanFenLei();
  },
  mounted() {
    this.loadData();
    this.getZiChanFenLei();
    this.getDepartment();
  },
};
</script>

<style>
</style>
