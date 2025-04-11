<template>
  <el-card>
    <el-form inline>
<!--      <el-form-item label="物品类别">-->
<!--&lt;!&ndash;        <el-cascader v-model="search.category" :options="category_list" :props="{&ndash;&gt;-->
<!--&lt;!&ndash;            label: 'name',&ndash;&gt;-->
<!--&lt;!&ndash;            children: 'items',&ndash;&gt;-->
<!--&lt;!&ndash;            value: 'pk',&ndash;&gt;-->
<!--&lt;!&ndash;            checkStrictly: true,&ndash;&gt;-->
<!--&lt;!&ndash;            emitPath: false,&ndash;&gt;-->
<!--&lt;!&ndash;          }" clearable :show-all-levels="true"></el-cascader>&ndash;&gt;-->
<!--        <cascader v-model="search.category" :checkStrictly="true" :treeData="category_list" :show-all-levels="false"-->
<!--                  label="name"-->
<!--                  value="name" @change="change"></cascader>-->
<!--      </el-form-item>-->
      <el-form-item label="名称">
        <el-input v-model="search.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="部门">
        <el-select v-model="search.department" clearable>
          <el-option v-for="i in department_list" :label="i.name" :value="i.pk" :key="i.pk"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="借用人">
        <el-select v-model="search.user" filterable placeholder="请选择" clearable>
          <el-option v-for="item in user_list" :key="item.pk" :label="`${item.full_name}--${item.department_name}`" :value="item.pk">
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="开始时间">-->
<!--        <el-date-picker v-model="search.ff_starttime" value-format="yyyy-MM-dd" clearable></el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="结束时间">-->
<!--        <el-date-picker v-model="search.ff_endtime" value-format="yyyy-MM-dd" clearable></el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="getDetail" icon="el-icon-search">搜索</el-button>-->
<!--        <el-button type="warning" @click="ShuoMingTo" class="fix-shuoming" style="right: 40px" round icon="el-icon-notebook-2" plain>使用说明</el-button>-->
<!--      </el-form-item>-->
    </el-form>
    <el-form inline  >
      <el-form-item label="开始时间" >
        <el-date-picker v-model="search.ff_starttime" value-format="yyyy-MM-dd" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="search.ff_endtime" value-format="yyyy-MM-dd" clearable></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDetail" icon="el-icon-search">搜索</el-button>
        <el-button type="warning" @click="ShuoMingTo" class="fix-shuoming" style="right: 50px;" round icon="el-icon-notebook-2" plain>使用说明</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" element-loading-text="加载中..." :data="data.slice((page - 1) * pageSize, page * pageSize)" :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" stripe border>
<!--      <el-table-column label="物品类别" prop="category"></el-table-column>-->
      <el-table-column label="物品名称" prop="category"></el-table-column>
      <el-table-column label="规格型号" prop="field_01"></el-table-column>
      <el-table-column label="单位" prop="field_02"></el-table-column>
      <el-table-column label="单价" prop="price"></el-table-column>
      <el-table-column label="部门" prop="department"></el-table-column>
      <el-table-column label="申请人" prop="username"></el-table-column>
      <el-table-column label="申请数量" prop="sqtotal"></el-table-column>
      <el-table-column label="申请时间" sortable>
        <template slot-scope="{ row }">
          <span v-if="row.create_time">{{
            moment(row.create_time).format("yyyy-MM-DD")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发放数量" prop="fftotal"></el-table-column>
      <el-table-column label="发放时间" sortable>
        <template slot-scope="{ row }">
          <span v-if="row.ff_time">{{
            moment(row.ff_time).format("yyyy-MM-DD")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归还日期" sortable>
        <template slot-scope="{ row }">
          <span v-if="row.gh_time">{{
            moment(row.gh_time).format("yyyy-MM-DD")
          }}</span>
        </template>
      </el-table-column>
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
import moment from "moment";
import cascader from "@/components/common/Cascader.vue"
export default {
  name: "WPLYMX",
  data() {
    return {
      search: {
        category: "",
        department: "",
        name: "",
        user: "",
        ff_starttime: "",
        ff_endtime: "",
      },
      data: [],
      user_list: [],
      department_list: [],
      category_list: [],
      loading: false,
      page: 1,
      pageSize: 10,
    };
  },
  components:{cascader},
  methods: {
    moment,
    async getUser() {
      let res = await resource.getList("user", {
      });
      this.user_list = res;
    },
    change(val) {
      this.search.category = val;
    },
    async getDepartment() {
      let res = await resource.getList("flatdepartment", {
      });
      this.department_list = res;
    },
    async getDetail() {
      let params = {};
      this.loading = true;
      if (this.search.category) {
        params["category"] = this.search.category;
      }
      if (this.search.name) {
        params["category"] ='%'+ this.search.name +'%';
      }
      if (this.search.department) {
        params["department"] = this.search.department;
      }
      if (this.search.user) {
        params["user"] = this.search.user;
      }
      if (this.search.ff_starttime) {
        params["ff_starttime"] = this.search.ff_starttime;
      }
      if (this.search.ff_endtime) {
        params["ff_endtime"] = this.search.ff_endtime;
      }
      // 有开始时间就必须有结束时间,结束时间必须大于开始时间
      if (this.search.ff_starttime && !this.search.ff_endtime) {
        this.$message.error("请选择结束时间");
        this.loading = false;
        return;
      }
      // 结束时间必须大于开始时间
      if (
        this.search.ff_starttime &&
        this.search.ff_endtime &&
        this.search.ff_starttime > this.search.ff_endtime
      ) {
        this.$message.error("结束时间必须大于开始时间");
        this.loading = false;
        return;
      }
      let res = await resource.getObj("formdatareport", "5850", {
        ...params,
      });
      this.data = res.data;
      this.loading = false;
    },
    async getCategory() {
      let res = await resource.getObjFromList("basetree", {
        // biz_id: this.$bizCode.wuping_biz,
        // src_id: this.$sourceCode.source_id,
        // isroot: false,
        name:'物品类别'
      });
      // let topLevelItems = [];
      // let obj = {};
      // res.forEach((i) => {
      //   obj[i.pk] = i;
      // });
      // res.forEach((i) => {
      //   if (i.parent) {
      //     if (obj[i.parent]) {
      //       if (!obj[i.parent].items) {
      //         obj[i.parent].items = [];
      //       }
      //       // 然后把当前的这个对象删掉，并放入到父级的items中
      //       obj[i.parent].items.push(i);
      //       return; // 跳过对此对象的进一步处理
      //     }
      //   }
      //   topLevelItems.push(i); //把第一级的对象放入到topLevelItems中
      // });
      if(res.items.length>0){
        this.category_list = res.items;
      }
    },
    recursive(array) {
      array.forEach((i) => {
        if (i.items.length > 0) {
          this.recursive(i.items);
        } else {
          i.items = null;
        }
      });
    },
    ShuoMingTo() {
      this.$router.push({ name: "wpjymx-shuoming" });
    },
  },
  created() {
    this.getCategory();
    this.getUser();
    this.getDepartment();
    this.getDetail();
  },
};
</script>

<style></style>
