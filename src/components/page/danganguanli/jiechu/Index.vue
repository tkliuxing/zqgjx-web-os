<template>
  <el-card style="position:relative">
    <el-form inline>

      <el-form-item label="借出单号">
        <el-input v-model="searchForm.pk" clearable name="searchForm.pk" autocomplete="on"></el-input>
      </el-form-item>
<!--      <el-form-item label="档案名称">-->
<!--        <el-input v-model="searchForm.name" clearable name="searchForm.name" autocomplete="on"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="借出人员">
        <el-select style="width: 100%"  clearable v-model="searchForm.jiechu_ren">
          <el-option v-for="item in zhunrurny_option_data" :key="item.pk" :label="item.name" :value="item.full_name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button @click="loadAll" type="success">全部</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="excelExport" type="info" icon="el-icon-download">Excel导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" v-loading="loading" element-loading-text='加载中...' @selection-change="(data)=>batchDelData = data">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="借出单号" prop="pk"></el-table-column>
      <el-table-column label="档案名称" prop="name"></el-table-column>
      <el-table-column width="80px" label="借出部门" prop="jiechu_bumen">
        <template slot-scope="{row}">{{get_jiechu_bumen_option_data_display(row.jiechu_bumen)}}</template>
      </el-table-column>
      <el-table-column width="106px" label="借出人员" prop="jiechu_ren"></el-table-column>
      <el-table-column width="106px" label="联系方式" prop="lianxi_fangshi"></el-table-column>
      <el-table-column label="借出时间" prop="jiechu_time"></el-table-column>
      <el-table-column label="预归还时间" prop="yjiechu_time"></el-table-column>
      <el-table-column label="归还时间" prop="guihuan_time" ></el-table-column>
      <el-table-column label="借出说明" prop="jiechu_shuom"></el-table-column>
      <el-table-column
        prop="tag"
        label="归还/剩余"
        width="100"
        :filters="[{ text: '未归还', value: '未归还' }, { text: '已归还', value: '已归还' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="{row}"  >
          <el-tag :type="row.tag === '未归还' ? 'primary' : 'success'"
                  v-if="row.tag === '未归还' ? false: true"
                  disable-transitions>{{row.tag}}</el-tag>
          <el-tag effect="dark"
            :type="get_end_time(row.yjiechu_time) > 0 ? 'warning' : 'danger'"
                  v-if="row.tag === '已归还' ? false: true"
                  >{{get_end_time(row.yjiechu_time)}}</el-tag>
        </template>

      </el-table-column>
      <el-table-column label="操作" width="100px" >
        <template slot-scope="{row}">
          <el-button :disabled="row.tag === '已归还'" title="归还" type="success" icon="el-icon-check" circle @click="show_time(row)"></el-button>
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
    <el-dialog title="确认是否归还" :visible.sync="ormDialogVisable" width="35%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close @close="clearForm">
    <Form v-model="form" ref="FormComp" @checked="submitForm"  style="display: none"/>

    <el-form :model="form"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="文档名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="form"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="借出人员" prop="renyuan">
        <el-input v-model="form.jiechu_ren"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="ormDialogVisable=false" icon="el-icon-close">取消</el-button>
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
// TEMPLATE_ID: FT333844772808392704
// 字段说明:
// jiechu_danhao:借出单号
// name:档案名称
// jiechu_bumen:借出部门
// jiechu_ren:借出人员
// lianxi_fangshi:联系方式
// jiechu_time:借出时间
// guihuan_time:归还时间
// jiechu_shuom:借出说明

import Form from "./Form.vue"
import ImportData from "./ImportData.vue"
import XLSX from "xlsx";
import row from "element-ui/packages/row";
import resource from "@/resource";


const TEMPLATE_ID = "FT333844772808392704";

const FORM = {
  jiechu_danhao: null,
  name: null,
  jiechu_bumen: null,
  jiechu_ren: null,
  lianxi_fangshi: null,
  jiechu_time: null,
  guihuan_time: null,
  jiechu_shuom: null,
  caozuo_time:null,
  shifou_guihuan:null,
  tag:null,
  yjiechu_time: null,
  template_id: TEMPLATE_ID,
};

const TEMPLATE_IDs = "FT333844866544001024";
export default {
  name: "",
  data() {
    return {
      // 当前实时时间
      current_timestamp: "",
      // 定时器
      timer: null,
    form: {
      ...FORM
    },
    searchForm: {
      pk: null,
      jiechu_ren: null,
    },
    jiechu_bumen_option_data: [],
    data: [],
    batchDelData: [],
    loading: false,
    formDialogVisable: false,
    ormDialogVisable: false,
    excelDialogVisable: false,
    page: 1,
    pageSize: 10,
    total: 0,
    pk_guihuan:'',
    shengyu_time:'',
    show_bu:'',
    zhunrurny_option_data:[],
  }
  },
  methods: {
    search(){
      this.page = 1;
      this.loadData()
    },
    get_end_time(start){
      if(!start) return;
      let time =this.moment(start).diff(this.moment(),"hours")
      console.log(time)
      if(time<0){
        if (time <= -24){
          return time=(this.moment(start).diff(this.moment(),"day")+'天')
        }else {
          return time=(this.moment(start).diff(this.moment(),"hours")+'小时')
        }
        // return  '已超出'+Math.abs(time)+'天'
      }else{
       if (time >= 24){
         return time=(this.moment(start).diff(this.moment(),"day")+'天')
       }else {
         return time=(this.moment(start).diff(this.moment(),"hours")+'小时')
       }
      }

    },
    filterTag(value, row) {
      return row.tag === value;

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
      if (this.searchForm.jiechu_ren) {
        params["jiechu_ren"] = this.searchForm.jiechu_ren

      }

      let res = await resource.getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;

    },
    loadAll(){
      this.page = 1;
      this.searchForm = {
        pk: null,
        jiechu_ren: null,

      };
      this.loadData();
    },
    async submitForm() {
      for (const key in this.form) {
        if (this.form[key] !== null && typeof this.form[key] === "object") {
        this.form[key] = JSON.stringify(this.form[key]);
        }
      }
      this.form.guihuan_time=this.current_timestamp
      this.form.tag='已归还'

      try {
        await resource.updateObj("data", this.form.pk, {
          ...this.form,
          template_id: TEMPLATE_ID
        });
        await resource.patchObj("data",  this.form.jiechu_danhao, {
          zhuangtai:'正常',
          template_id: TEMPLATE_IDs
        });
        this.$message.success("归还成功!")
        this.formDialogVisable = false;
        this.ormDialogVisable = false;
        this.loadData()
      } catch (error) {

      }
    },
    show_time(row) {
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string' && row[key].startsWith('[') && row[key].endsWith(']')) {
          row[key] = JSON.parse(row[key]);
        }
      }
      this.form = {
        ...row
      };
      this.ormDialogVisable = true
      this.pk_guihuan=row.pk
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
        "借出单号",
        "档案名称",
        "借出部门",
        "借出人员",
        "联系方式",
        "借出时间",
        "预归还时间",
        "归还时间",
        "借出说明",
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
      XLSX.writeFile(wb, "文档借出.xlsx");
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
    get_jiechu_bumen_option_data_display(value){
      let option = this.jiechu_bumen_option_data.filter((item)=>{
        return item.bumem === value;
      });
      return option.length > 0 ? option[0].bumem : value;
    },
    async getLocalDataSource() {
      // this.jiechu_bumen_option_data = await resource.getList("data", {"template_id":"FT333844613637038080"});
      this.jiechu_bumen_option_data = await resource.getList("flatdepartment",{});
      this.zhunrurny_option_data = await resource.getList("usermin",{});
    },
  },
  created() {
    this.loadData()
    this.getLocalDataSource()
  },
  computed:{
    row() {
      return row
    },
    excelDownloadTranslate(){
      return {
        "jiechu_danhao":"借出单号",
        "name":"档案名称",
        "jiechu_bumen":"借出部门",
        "jiechu_ren":"借出人员",
        "lianxi_fangshi":"联系方式",
        "jiechu_time":"借出时间",
        "yjiechu_time":"预归还时间",
        "guihuan_time":"归还时间",
        "jiechu_shuom":"借出说明",
      }
    }
  },
  components: {
    Form,
    ImportData,
  },
  mounted() {

    this.timer = setInterval(() => {
      this.current_timestamp = this.$dayjs().format("YYYY-MM-DD HH:mm:ss");
    }, 1000);
  }
}
</script>
<style scoped>
.batchClass {

position: absolute;
right: 20px;
bottom: 17px;
}
.display{
  display: none;
}
</style>
