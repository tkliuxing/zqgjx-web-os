<template>
  <div>
    <el-form :model='form' ref="form" label-width="120px" status-icon>
      <el-row>
        <el-col :span="12">
          <el-form-item label="表单名称" prop="name" :rules="[{ required: true, message: '请输入表单名称' }]">
            <el-input :disabled="readonly" v-model="form.name" clearable name="form.name" autocomplete="on"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用部门范围" prop="use_dep" :rules="[{ required: true, message: '请选择使用部门范围' }]">
            <el-select :disabled="readonly" clearable v-model="form.use_dep" style="width: 100%">
              <el-option v-for="item in use_dep_option_data" :key="item.pk" :label="item.name" :value="item.pk"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>


      <el-form-item label="表单备注" prop="remark">
        <el-input :disabled="readonly" v-model="form.remark" clearable name="form.remark" autocomplete="on"></el-input>
      </el-form-item>
<!--      <el-form-item label="表格配置:" prop="peizhi">-->
<!--&lt;!&ndash;        <el-input :disabled="readonly" v-model="form.peizhi" clearable name="form.peizhi" autocomplete="on"></el-input>&ndash;&gt;-->
<!--      </el-form-item>-->
    </el-form>


    <div><span style="float: left">表格配置:</span>
      <el-upload style="float: left;margin-left: 10px"
                 class="upload"
                 action="#"
                 :show-file-list="false"
                 :on-change="handleExcel"
                 accept="'.xlsx','.xls'"
                 :auto-upload="false"
                 :headers="headers">
        <el-button type="success" round size="mini" icon="el-icon-upload">数据导入</el-button>
      </el-upload>
    </div>
    <div  style="width: 100%;overflow: hidden">
      <div id="x-spreadsheet-demo" ></div>
    </div>
  </div>
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
  //引入依赖包
  import Spreadsheet from 'x-data-spreadsheet';
  import zhCN from 'x-data-spreadsheet/src/locale/zh-cn';
  import XLSX from 'xlsx';
  //设置中文
  Spreadsheet.locale('zh-cn', zhCN);
  import {mapState} from "vuex";
  import {verifyMobile, verifyEmail, verifyIdCard} from "@/utils/verify.js";
  import resource from "@/resource";
  import {xtos , stox} from './xlsxsprea';
  export default {
    name: "Form",
    model: {
      prop: "form"
    },
    props: {
      form: Object,
      readonly: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      ...mapState(['userinfo']),
    },
    data() {
      return {
        headers: {
          Authorization: null
        },
        fileData: {
          sys_id: null,
          org_id: null
        },
        xs: null,
        jsondata: {
          type: '',
          label: ''
        },
        use_dep_option_data: null,
        verifyMobile,
        verifyEmail,
        verifyIdCard,
        xtos,
        stox
      }
    },
    async mounted(){
      await this.init();
    },

    methods: {
      handleExcel(file) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          // 将导入的数据转换为 x-spreadsheet 格式
          const xSpreadsheetData = stox(workbook);
          // 可以将 xSpreadsheetData 加载到 x-spreadsheet 中
          //  x-spreadsheet 实例是 this.xs
          this.xs.loadData(xSpreadsheetData);
        };
        fileReader.readAsArrayBuffer(file.raw);
      },

      init() {
        this.xs  = new Spreadsheet('#x-spreadsheet-demo')
          // .loadData([])
          .change((cdata) => {
            // console.log(cdata.rows);
          });
        if(this.form.pk){
          if(typeof this.form.peizhi == 'object'){
            this.form.peizhi = JSON.stringify(this.form.peizhi)
          }
          this.xs.loadData(JSON.parse(this.form.peizhi))
        }
        this.xs.on('cell-selected', (cell, ri, ci) => {
          console.log('cell:', cell, ', ri:', ri, ', ci:', ci);
        });
      },
      async getLocalDataSource() {
        this.headers.Authorization = "Bearer " + this.$store.state.token;
        this.fileData.sys_id=this.$store.state.sys_id;
        this.fileData.org_id=this.$store.state.userinfo.org_id;

        // 获取使用部门范围:use_dep数据源数据
        this.use_dep_option_data = await resource.getList("flatdepartment",{});
      },
      async submit() {
        const d = this.xs.getData()
        this.form.peizhi = d
        let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)));
        if (valid) {
          this.$emit("checked");
        } else {
          this.$message.warning("请认真填写表单!")
        }
      },

    },
    created() {
      this.getLocalDataSource();
    },
  }
</script>
