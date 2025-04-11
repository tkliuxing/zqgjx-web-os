<template>
  <el-card style="position:relative">
    <el-form inline>

      <el-form-item label="文档id">
        <el-input v-model="searchForm.pk" clearable name="searchForm.pk" autocomplete="on"></el-input>
      </el-form-item>
      <el-form-item label="经办人员">
        <el-select style="width: 100%"  clearable v-model="searchForm.jiangban_user">
          <el-option v-for="item in zhunrurny_option_data" :key="item.pk" :label="item.name" :value="item.full_name">
          </el-option>
        </el-select>
<!--        <el-input v-model="searchForm.jiangban_user" clearable name="searchForm.jiangban_user" autocomplete="on"></el-input>-->
      </el-form-item>
      <el-form-item>
        <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button @click="loadAll" type="success">全部</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="excelExport" type="info" icon="el-icon-download">Excel导出</el-button>
      </el-form-item>
    </el-form>
    <el-form inline>

    </el-form>
    <el-table :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" v-loading="loading" element-loading-text='加载中...' @selection-change="(data)=>batchDelData = data">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="文档id" prop="pk"></el-table-column>
      <el-table-column label="档案名称" prop="dangan_name"></el-table-column>
      <el-table-column label="转移单位" prop="zhuanrudanwei">
        <template slot-scope="{row}">{{get_zhuanrudanwei_option_data_display(row.zhuanrudanwei)}}</template>
      </el-table-column>
      <el-table-column width="106px" label="转移人员" prop="zhunrurny"></el-table-column>
      <el-table-column width="106px" label="经办人员" prop="jiangban_user"></el-table-column>
      <el-table-column label="存放地点" prop="cunfang"></el-table-column>
      <el-table-column label="操作时间" prop="caozuo_time"></el-table-column>
      <el-table-column  label="备注" prop="beizhu"></el-table-column>

      <el-table-column label="操作" width="80px">
        <template slot-scope="{row}">
          <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="删除后不可恢复，确定删除吗？" @confirm="delTable(row)">
            <el-button slot="reference" title="删除" circle type="danger" icon="el-icon-remove" />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <div class="batchClass">
      <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确定批量删除吗" @confirm="batchDelDataFn">
        <el-button icon="el-icon-delete" type="danger" slot="reference">批量删除</el-button>
      </el-popconfirm>
    </div>
    <el-dialog :title="form.pk?'编辑':'新建'" :visible.sync="formDialogVisable" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close @close="clearForm">
      <Form v-model="form" ref="FormComp" @checked="submitForm" />
      <div slot="footer">
        <el-button @click="formDialogVisable=false" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="$refs.FormComp.submit()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Excel导入" :visible.sync="excelDialogVisable" width="95%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close>
      <ImportData @loadData="loadData" @close="excelDialogVisable=false"/>
    </el-dialog>
  </el-card>
</template>
<script>
//
// TEMPLATE_ID: FT333844825437347840
// 字段说明:
// wendang_id:文档id
// dangan_name:档案名称
// zhuanrudanwei:转移单位
// zhunrurny:转移人员
// jiangban_user:经办人员
// cunfang:存放地点
// beizhu:备注

import Form from "./Form.vue"
import ImportData from "./ImportData.vue"
import resource from "@/resource";
import XLSX from "xlsx";

const TEMPLATE_ID = "FT333844825437347840";

const FORM = {
  pk:null,
  wendang_id: null,
  dangan_name: null,
  zhuanrudanwei: null,
  zhunrurny: null,
  jiangban_user: null,
  cunfang: null,
  beizhu: null,
  caozuo_time:null,
template_id: TEMPLATE_ID,
};

export default {
  name: "",
  data() {
    return {
    form: {
      ...FORM
    },
    searchForm: {
      pk: null,
      jiangban_user: null,

    },
    zhuanrudanwei_option_data: [],

    data: [],
    batchDelData: [],
    loading: false,
    formDialogVisable: false,
    excelDialogVisable: false,
    page: 1,
    pageSize: 10,
    total: 0,
    zhunrurny_option_data:[],
  }
  },
  methods: {
    search(){
      this.page = 1;
      this.loadData();
    },
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID
      }
      if (this.searchForm.pk) {
        params["pk"] = this.searchForm.pk

      }
      if (this.searchForm.jiangban_user) {
        params["jiangban_user"] = this.searchForm.jiangban_user
      }

      console.log(params,'sss')
      let res = await resource.getList("data", params);
      console.log(res,'res')
      this.data = res.data;
      this.total = res.count;
      this.loading = false;

    },
    loadAll(){
      this.page = 1;
      this.searchForm = {
        pk: null,
        jiangban_user: null,

      };
      this.loadData();
    },
    async submitForm() {
      for (const key in this.form) {
        if (this.form[key] !== null && typeof this.form[key] === "object") {
        this.form[key] = JSON.stringify(this.form[key]);
        }
      }
      try {
        if (this.form.pk) {
        await resource.updateObj("data", this.form.pk, {
          ...this.form,
          template_id: TEMPLATE_ID
        });
        this.$message.success("编辑成功!")
        } else {
        await resource.createObj("data", {
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

    async delTable(row) {
      try {
        await resource.deleteObj("data", row.pk,this.$store.state.sys_id,row.template_id)
        this.$message.success("删除成功!")
        this.loadData()
      } catch (err) {
        this.$message.error("删除失败!")
      }
    },
    excelExport(){
      let header = [
        "文档id",
        "档案名称",
        "转移单位",
        "转移人员",
        "经办人员",
        "存放地点",
        "操作时间",
        "备注",
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
      XLSX.writeFile(wb, "转移文档.xlsx");
    },
    clearForm() {
      this.form = {
        ...FORM
      }
      this.$refs.FormComp.$refs.form.resetFields();
    },
    async batchDelDataFn() {
      if (this.batchDelData.length === 0) {
        return this.$message.error("请选择要删除的数据!");
      }
      try {
        let pk_list = this.batchDelData.map((i) => i.pk); //data-delete
        await resource.createObj("data-delete", {
          template_id: TEMPLATE_ID,
          querys: {pk: pk_list.join(",")},
        });
        this.$message.success("批量删除成功!");
        this.loadData();
      } catch (error) {}
    },

    get_zhuanrudanwei_option_data_display(value){
      let option = this.zhuanrudanwei_option_data.filter((item)=>{
        return item.bumem === value;
      });
      return option.length > 0 ? option[0].bumem : value;
    },

    async getLocalDataSource() {

      this.zhuanrudanwei_option_data = await resource.getList("data", {"template_id":"FT333844613637038080"});
// 获取转移人员:zhunrurny数据源数据
      this.zhunrurny_option_data = await resource.getList("usermin",{});
      },
  },
  created() {
    this.loadData()
    this.getLocalDataSource()
  },
  computed:{
    excelDownloadTranslate(){
      return {
        "wendang_id":"文档id",
        "dangan_name":"档案名称",
        "zhuanrudanwei":"转移单位",
        "zhunrurny":"转移人员",
        "jiangban_user":"经办人员",
        "cunfang":"存放地点",
        "caozuo_time":"操作时间",
        "beizhu":"备注",

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
