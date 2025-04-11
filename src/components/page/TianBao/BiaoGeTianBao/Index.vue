<template>
  <el-card style="position:relative">
    <el-form inline>
      <el-form-item>
        <el-button @click="xinjian" type="primary" round icon="el-icon-plus" v-if="hasPerm('表格填报(新)-新建按钮')">新建</el-button>
      </el-form-item>
      <el-form-item label="表单名称">
        <el-input v-model="searchForm.name" clearable name="searchForm.name" autocomplete="on"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="loadData" type="primary" round icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-form inline>
    </el-form>
    <el-table :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" v-loading="loading" element-loading-text='加载中...' @selection-change="(data)=>batchDelData = data">
      <el-table-column label="表单名称" prop="name"></el-table-column>
      <el-table-column label="使用部门范围" prop="use_dep">
        <template slot-scope="{row}">{{get_use_dep_option_data_display(row.use_dep)}}</template>
      </el-table-column>
      <el-table-column label="表单备注" prop="remark"></el-table-column>
<!--      <el-table-column label="表格配置" prop="peizhi"></el-table-column>-->

      <el-table-column label="操作" width="360px" >
        <template slot-scope="{row}">
          <el-button  type="primary"  @click="editTable(row)" round v-if="hasPerm('表格填报(新)-新建按钮')">选项配置</el-button>
          <el-button  type="info"  @click="Infotianbao(row)" round>信息填报</el-button>
          <el-button  type="success"  @click="tongjitianbao(row)" round v-if="hasPerm('表格填报(新)-新建按钮')">信息统计</el-button>
          <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="删除后不可恢复，确定删除吗？" @confirm="delTable(row)">
            <el-button slot="reference" type="danger"  round v-if="hasPerm('表格填报(新)-新建按钮')">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog :fullscreen="true" :title="form.pk?'选项配置':'新建'" :visible.sync="formDialogVisable"  :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close @close="clearForm">
      <Form v-if="formDialogVisable"  v-model="form" ref="FormComp" @checked="submitForm" />
      <div slot="footer">
        <el-button @click="formDialogVisable=false" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="$refs.FormComp.submit()">确定</el-button>
      </div>
    </el-dialog>
<!--    <el-dialog title="Excel导入" :visible.sync="excelDialogVisable" width="95%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close>-->
<!--      <ImportData @loadData="loadData" @close="excelDialogVisable=false"/>-->
<!--    </el-dialog>-->
  </el-card>
</template>
<script>
//
// TEMPLATE_ID: FT341057895368679424
// 字段说明:
// user_id:创建人
// dep_id:创建部门
// create_time:创建时间
// name:表单名称
// use_dep:使用部门范围
// remark:表单备注
// peizhi:表格配置

import Form from "./Form.vue"
import ImportData from "./ImportData.vue"
import XLSX from "xlsx";
const TEMPLATE_ID = "FT341057895368679424";

const FORM = {
  user_id: null,
  dep_id: null,
  create_time: null,
  name: null,
  use_dep: null,
  remark: null,
  peizhi: null,
template_id: TEMPLATE_ID,
};
import resource from "@/resource";
import {mapState} from "vuex";
import {template} from "lodash";
export default {
  name: "",
  data() {
    return {
    form: {
      ...FORM
    },
    searchForm: {
      name: null,

    },
      xs: null,
      jsondata: {
        type: '',
        label: ''
      },
    use_dep_option_data: [],

    data: [],
    batchDelData: [],
    loading: false,
    formDialogVisable: false,
    excelDialogVisable: false,
    page: 1,
    pageSize: 10,
    total: 0
  }
  },
mounted() {
},
  methods: {
    xinjian(){
      if(!this.quanxian.扫码填报 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.formDialogVisable = true;
      }
    },
    hasPerm(name) {
      return this.userinfo.func_codenames.indexOf(name) > -1;
    },
    Infotianbao(row){
      this.$router.push({
        name: "biaogetianbao-biaogetianbao",
        params: {id: row.pk},
      });
    },
    tongjitianbao(row){
      this.$router.push({
        name: "biaogetianbao-tongji",
        params: {id: row.pk},
      });
    },
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID
      }
      if (this.searchForm.name) {
        params["name"] = this.searchForm.name
      }
      let res = await resource.getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },
    loadAll(){
      this.page = 1;
      this.searchForm = {
        name: null,

      };
      this.loadData();
    },
    get_use_dep_option_data_display(value) {
      let option = this.use_dep_option_data.filter((item) => {
        return item["pk"] === value;
      });
      if (option.length > 0) return option[0]["name"];
      return value;
    },
    async submitForm() {

      for (const key in this.form) {
        if (this.form[key] !== null && typeof this.form[key] === "object") {
        this.form[key] = JSON.stringify(this.form[key]);
        }
      }
      try {
        this.form.create_time = this.moment().format('yyyy-MM-DD HH:mm:ss');
        this.form.dep_id = this.userinfo.department;
        this.form.user_id = this.userinfo.pk;
        if (this.form.pk) {
        let tem = await resource.updateObj("data", this.form.pk, {
          ...this.form,
          template_id: TEMPLATE_ID
        });
        this.$message.success("编辑成功!");

        } else {
        let tem = await resource.createObj("data", {
          ...this.form,
          template_id: TEMPLATE_ID
        });
        this.$message.success("新建成功!")
        }
        this.formDialogVisable = false;
        this.loadData()
      } catch (error) {

      }
    },
    editTable(data) {
      let row = JSON.parse(JSON.stringify(data));
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string' && row[key].startsWith('[') && row[key].endsWith(']')) {
        row[key] = JSON.parse(row[key]);
        }
      }
      this.form = {...row};
      this.formDialogVisable = true;
    },
    async delTable(row) {
      try {
        await resource.deleteObj("data", row.pk, row.sys_id,row.template_id)
        this.$message.success("删除成功!")
        this.loadData()
      } catch (err) {
        this.$message.error("删除失败!")
      }
    },
    excelExport(){
      let header = [
        "创建人",
        "创建部门",
        "创建时间",
        "表单名称",
        "使用部门范围",
        "表单备注",
        "表格配置",
      ]
      let tmp = [];
      this.data.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) obj[this.excelDownloadTranslate[key]] = i[key];
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "表格填报(新的).xlsx");
    },
    clearForm() {
      let row = JSON.parse(JSON.stringify(FORM));
      this.form = {
        ...row
      }
      this.$refs.FormComp.$refs.form.resetFields();
    },

    async getLocalDataSource() {

      this.use_dep_option_data = await resource.getList("flatdepartment", {});
    },
  },
  created() {
    this.loadData()
    this.getLocalDataSource()
  },
  computed:{
    ...mapState(['userinfo',"quanxian"]),
    excelDownloadTranslate(){
      return {
        "user_id":"创建人",
        "dep_id":"创建部门",
        "create_time":"创建时间",
        "name":"表单名称",
        "use_dep":"使用部门范围",
        "remark":"表单备注",
        "peizhi":"表格配置",

      }
    }
  },
  components: {
    Form,
    ImportData
  }
}
</script>
<style scoped>
.batchClass {
position: absolute;
right: 20px;
bottom: 17px;
}
</style>
