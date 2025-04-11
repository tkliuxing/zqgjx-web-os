<template>
  <el-card style="position:relative">
    <el-form inline>
      <el-form-item>
        <el-button @click="formDialogVisable=true" type="primary" icon="el-icon-plus">新建</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="excelDialogVisable=true" type="info" icon="el-icon-upload">数据导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="excelExport" type="success" icon="el-icon-download">Excel导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" v-loading="loading" element-loading-text='加载中...' @selection-change="(data)=>batchDelData = data">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="文档分类" prop="wendang_fenlei"></el-table-column>

      <el-table-column label="操作" width="150px">
        <template slot-scope="{row}">
          <el-button title="编辑" circle type="primary" icon="el-icon-edit" @click="editTable(row)" />
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
// TEMPLATE_ID: FT333844674657345536
// 字段说明:
// wendang_fenlei:文档分类

import Form from "./Form.vue"
import ImportData from "./ImportData.vue"
import XLSX from "xlsx";
import resource from "@/resource";

const TEMPLATE_ID = "FT333844674657345536";

const FORM = {
  wendang_fenlei: null,
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

    },

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
  methods: {
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID
      }

      let res = await resource.getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },
    loadAll(){
      this.page = 1;
      this.searchForm = {

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
    editTable(row) {
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string' && row[key].startsWith('[') && row[key].endsWith(']')) {
        row[key] = JSON.parse(row[key]);
        }
      }
      this.form = {
        ...row
      };
      this.formDialogVisable = true
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
        "文档分类",
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
      XLSX.writeFile(wb, "文档分类.xlsx");
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

    async getLocalDataSource() {

    },
  },
  created() {
    this.loadData()
    this.getLocalDataSource()
  },
  computed:{
    excelDownloadTranslate(){
      return {
        "wendang_fenlei":"文档分类",

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
