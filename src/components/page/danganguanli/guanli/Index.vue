<template>
  <el-card style="position:relative">
    <el-button
      class="fix-shuoming"
      icon="el-icon-notebook-2"
      plain
      round
      type="warning"
      @click="ShuoMingTo"
    >使用说明
    </el-button
    >
    <el-form inline>

      <el-form-item label="文档分类">
        <el-select v-model="searchForm.fenlei" clearable>
          <el-option v-for="item in fenlei_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
        <el-select v-model="searchForm.bumen" clearable>
          <el-option v-for="item in bumen_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="searchForm.name" autocomplete="on" clearable name="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="search">搜索</el-button>
        <el-button type="success" @click="loadAll">全部</el-button>
      </el-form-item>
    </el-form>
    <el-form inline>
      <el-form-item>
        <el-button icon="el-icon-plus" type="primary" @click="xinjian">新建</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-upload" type="warning" @click="excelDialogVisable=true">数据导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-download" type="success" @click="excelExport">Excel导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :cell-style="{textAlign:'center'}"
      :data="data"
      :header-cell-style="{textAlign:'center'}"
      :row-class-name="tableRowClassName"
      border
      element-loading-text='加载中...'
      @selection-change="(data)=>batchDelData = data">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="文档分类" prop="fenlei">
        <template slot-scope="{row}">{{ get_fenlei_option_data_display(row.fenlei) }}</template>
      </el-table-column>
      <el-table-column label="部门" prop="bumen">
        <template slot-scope="{row}">{{ get_bumen_option_data_display(row.bumen) }}</template>
      </el-table-column>
      <el-table-column label="文档编号" prop="bianhao"></el-table-column>
      <el-table-column label="文档字号" prop="zihao"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="保密等级" prop="baomi">
        <template slot-scope="{row}">{{ get_baomi_option_data_display(row.baomi) }}</template>
      </el-table-column>
      <el-table-column label="存放位置" prop="weizhi"></el-table-column>
      <!--      <el-table-column label="附件" prop="fujian"></el-table-column>-->
      <el-table-column label="备注" prop="beizhu"></el-table-column>
      <el-table-column
        :filter-method="filterTag"
        :filters="[{ text: '正常', value: '正常' }, { text: '已借出', value: '已借出' }]"
        filter-placement="bottom-end"
        label="状态"
        prop="zhuangtai"
        width="70">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.zhuangtai === '正常' ? 'primary' : 'success'"
            disable-transitions>{{ scope.row.zhuangtai }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="time"></el-table-column>

      <el-table-column label="操作" width="230px">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="light" content="查看" placement="top">
            <el-button :disabled="row.zhuangtai === '已借出' || (!row.fujian || row.fujian.length === 2)" circle icon="el-icon-view" title="查看" type="success" @click="chakan(row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="编辑" placement="top">
            <el-button :disabled="row.zhuangtai === '已借出'" circle icon="el-icon-edit" title="编辑" type="primary" @click="editTable(row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="转移" placement="top">
            <el-button :disabled="row.zhuangtai === '已借出'" circle icon="el-icon-sort" title="转移" type="success" @click="zhuanyi(row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="借出" placement="top">
            <el-button :disabled="row.zhuangtai === '已借出'" circle icon="el-icon-upload2" title="借出" type="warning" @click="jiechu(row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除" placement="top" style="padding-top: 10px">
            <el-popconfirm cancel-button-text='取消' confirm-button-text='确定' icon="el-icon-info" icon-color="red" style="margin-left:10px" title="删除后不可恢复，确定删除吗？" @confirm="delTable(row)">
              <el-button slot="reference" circle icon="el-icon-delete" title="删除" type="danger"/>
            </el-popconfirm>
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page.sync="page" :page-size.sync="pageSize" :page-sizes="[10, 50, 100, 200]" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="loadData" @current-change="loadData">
    </el-pagination>
    <div class="batchClass">
      <el-popconfirm cancel-button-text="取消" confirm-button-text="确定" icon="el-icon-info" icon-color="red" title="确定批量删除吗" @confirm="batchDelDataFn">
        <el-button slot="reference" icon="el-icon-delete" type="danger">批量删除</el-button>
      </el-popconfirm>
    </div>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="LookformDialogVisable" center destroy-on-close title="查看" top="3vh" width="50%" @close="clearForm">
      <Form ref="FormComp" v-model="form" :readonly="true"/>
      <div slot="footer">
        <el-button icon="el-icon-close" @click="LookformDialogVisable=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="form.pk?'编辑':'新建'" :visible.sync="formDialogVisable" center destroy-on-close top="3vh" width="50%" @close="clearForm">
      <Form ref="FormComp" v-model="form" @checked="submitForm"/>
      <div slot="footer">
        <el-button icon="el-icon-close" @click="formDialogVisable=false">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="$refs.FormComp.submit()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="sormDialogVisable" center destroy-on-close title="文档转移" top="3vh" width="50%" @close="clearzyForm">
      <zy_Forms ref="zyFormComp" v-model="zy_form" @checked="zybmitForm"/>
      <div slot="footer">
        <el-button icon="el-icon-close" @click="sormDialogVisable=false">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="$refs.zyFormComp.submit()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="jiemDialogVisable" center destroy-on-close title="文档借出" top="3vh" width="50%" @close="clearjcForm">
      <jc_Forms ref="jcFromComp" v-model="jc_form" @checked="jcbmitForm"/>
      <div slot="footer">
        <el-button icon="el-icon-close" @click="jiemDialogVisable=false">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="$refs.jcFromComp.submit()">确定</el-button>
      </div>
    </el-dialog>
    <pdfview v-if="pdfurl" :pdf-url="pdfurl" :visable="pdfVisable" @close="pdfVisable=false"></pdfview>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="excelDialogVisable" center destroy-on-close title="Excel导入" top="3vh" width="95%">
      <ImportData @close="excelDialogVisable=false" @loadData="loadData"/>
    </el-dialog>
  </el-card>
</template>
<script>
//
// TEMPLATE_ID: FT333844866544001024
// 字段说明:
// fenlei:文档分类
// bumen:部门
// bianhao:文档编号
// zihao:文档字号
// name:名称
// baomi:保密等级
// weizhi:存放位置
// fujian:附件
// beizhu:备注
// depid:操作用户id
// time:操作时间

import Form from "./Form.vue"
import ImportData from "./ImportData.vue"
import XLSX from "xlsx";
import {mapState} from "vuex";
import zy_Forms from "@/components/page/danganguanli/zhuanyi/Form.vue";
import jc_Forms from "@/components/page/danganguanli/jiechu/Form.vue";
import resource, {deleteList} from "@/resource";
import pdfview from "@/components/common/pdf_dangan.vue";
import moment from "moment";


const TEMPLATE_ID_jc = "FT333844772808392704";
const JC_FORM = {
  jiechu_danhao: null,
  name: null,
  jiechu_bumen: null,
  jiechu_ren: null,
  lianxi_fangshi: null,
  jiechu_time: null,
  guihuan_time: null,
  jiechu_shuom: null,
  shifou_guihuan: null,
  tag: null,
  template_id: TEMPLATE_ID_jc,
};

const TEMPLATE_IDs = "FT333844825437347840";
const TEMPLATE_RY = 'FT360363871933534208'
const TEMPLATE_BM = 'FT361399700565704704'
const ZY_FORM = {
  wendang_id: null,
  dangan_name: null,
  zhuanrudanwei: null,
  zhunrurny: null,
  jiangban_userjiangban_user: null,
  cunfang: null,
  beizhu: null,
  caozuo_time: null,
  template_id: TEMPLATE_IDs,
};

const TEMPLATE_ID = "FT333844866544001024";

const FORM = {
  fenlei: null,
  bumen: null,
  bianhao: null,
  zihao: null,
  name: null,
  baomi: null,
  weizhi: null,
  fujian: [],
  beizhu: null,
  depid: null,
  time: null,
  zhuangtai: null,
  baomi_bumen:[],
  baomi_renyuan:[],

  template_id: TEMPLATE_ID,
};

export default {
  name: "",
  data() {
    return {
      // 当前实时时间
      current_timestamp: "",
      // 定时器
      timer: null,
      form: {
        ...FORM,

      },
      jc_form: {
        ...JC_FORM

      },
      zy_form: {
        ...ZY_FORM
      },
      searchForm: {
        fenlei: null,
        bumen: null,
        name: null,


      },
      fenlei_option_data: [],
      bumen_option_data: [],
      baomi_option_data: [],
      sormDialogVisable: false,
      jiemDialogVisable: false,
      data: [],
      batchDelData: [],
      loading: false,
      formDialogVisable: false,
      excelDialogVisable: false,
      page: 1,
      pageSize: 10,
      total: 0,
      LookformDialogVisable: false,
      pdfurl: null,
      pdfVisable: false,
      file: [],


    }
  },
  methods: {
    ShuoMingTo() {
      this.$router.push({name: "danganshuoming"});
    },
    chakan(val) {
      let data_fujian = JSON.parse(val.fujian)
      let isPDF = []
      for (let a in data_fujian) {
        this.file.push(data_fujian[a].file)
        isPDF.push(data_fujian[a].file)
      }
      // window.open(data_fujian[0].file);
      console.log(isPDF)
      this.pdfurl = isPDF;

      this.pdfVisable = true;


    },
    xinjian() {
      if (!this.quanxian.档案管理 && this.data.length >= 1) {
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      } else {
        this.formDialogVisable = true;
      }
    },
    viewTable(row) {
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string' && row[key].startsWith('[') && row[key].endsWith(']')) {
          row[key] = JSON.parse(row[key]);
        }
      }
      // if (typeof row.fujian === 'string') {
      //   row.fujian = [];
      // }

      this.form = {
        ...row
      };
      this.LookformDialogVisable = true
    },
    tableRowClassName({row,}) {
      if (row.zhuangtai === '已借出') {
        return 'warning-row';
      }
      return '';


      this.loading = true;    },
    filterTag(value, row) {
      return row.zhuangtai === value;
    },
    search() {
      this.page = 1;
      this.loadData();
    },
    async loadData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID,
      }
      let bumen = await resource.getList("data", { bumen_pk:this.userinfo.department,template_id:TEMPLATE_BM} );
      let renyuan = await resource.getList("data", { renyuan_pk:this.userinfo.pk,template_id:TEMPLATE_RY});
        params.pk =bumen.concat(renyuan).map(item=>{return item.wendanggunli_id}).toString()
      if (this.searchForm.fenlei) {
        params["fenlei"] = this.searchForm.fenlei

      }
      if (this.searchForm.bumen) {
        params["bumen"] = this.searchForm.bumen

      }
      if (this.searchForm.name) {
        params["name"] = this.searchForm.name

      }

      let res = await resource.getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;

    },
    hasPerm(name) {
      return this.userinfo.func_names.indexOf(name) > -1;
    },
    loadAll() {
      this.page = 1;
      this.searchForm = {
        fenlei: null,
        bumen: null,
        name: null,

      };
      this.loadData();
    },
    async submitForm() {  //提交传给父值,实现父值的点击提交
      let formData = JSON.parse(JSON.stringify(this.form));
      for (const key in formData) {
        if (formData[key] !== null && typeof formData[key] === "object") {
          formData[key] = JSON.stringify(formData[key]);
        }
      }
      formData.zhuangtai = '正常'
      formData.depid = this.userinfo.department
      formData.time = this.current_timestamp
      let tem_data = null
      try {
        if (formData.pk) {

          tem_data = await resource.updateObj("data", formData.pk, {
            ...formData,
            template_id: TEMPLATE_ID
          });

          this.$message.success("编辑成功!")
        } else {
          tem_data = await resource.createObj("data", {
            ...formData,
            template_id: TEMPLATE_ID
          });
          this.$message.success("新建成功!")
        }
        await resource.deleteList({wendanggunli_id: tem_data.pk}, TEMPLATE_RY);
        await resource.deleteList({wendanggunli_id: tem_data.pk}, TEMPLATE_BM);
        if (this.form.baomi == '私密') {
          let data = {
            renyuan_pk: this.userinfo.pk,
            name: this.userinfo.full_name,
            wendanggunli_id: tem_data.pk
          };
          await resource.createObj("data", {
            ...data,
            template_id: TEMPLATE_RY
          });
        } else if (this.form.baomi == '人员密级') {
          for (let item of this.form.baomi_renyuan) {
            let data = {
              renyuan_pk: item,
              name: this.userinfo.full_name,
              wendanggunli_id: tem_data.pk
            };
            await resource.createObj("data", {
              ...data,
              template_id: TEMPLATE_RY
            });
          }

        } else if (this.form.baomi == '部门密级') {
          for (let item of this.form.baomi_bumen) {
            let data = {
              bumen_pk: item,
              name: this.userinfo.full_name,
              wendanggunli_id: tem_data.pk
            };
            await resource.createObj("data", {
              ...data,
              template_id: TEMPLATE_BM
            });
          }
        } else if (this.form.baomi == '公开') {
          for (let item of this.form.baomi_bumen) {
            let data = {
              bumen_pk: item,
              name: this.userinfo.full_name,
              wendanggunli_id: tem_data.pk
            };
            await resource.createObj("data", {
              ...data,
              template_id: TEMPLATE_BM
            });
          }
        }
        this.formDialogVisable = false;
        this.loadData()
      } catch (error) {

      }
    },
    async zybmitForm() {  //提交传给父值,实现父值的点击提交
      for (const key in this.zy_form) {
        if (this.zy_form[key] !== null && typeof this.zy_form[key] === "object") {
          this.zy_form[key] = JSON.stringify(this.zy_form[key]);
        }
      }

      this.zy_form.depid = this.userinfo.department
      this.zy_form.caozuo_time = this.current_timestamp
      try {
        await resource.createObj("data", {
          ...this.zy_form,
          template_id: TEMPLATE_IDs
        });

        this.$message.success("转移成功!")
        await resource.patchObj("data", this.zy_form.wendang_id, {
          weizhi: this.zy_form.cunfang,
          template_id: TEMPLATE_ID
        });
        this.loadData();
        this.sormDialogVisable = false;
      } catch (error) {
      }
    },
    async jcbmitForm() {  //提交传给父值,实现父值的点击提交
      for (const key in this.jc_form) {
        if (this.jc_form[key] !== null && typeof this.jc_form[key] === "object") {
          this.jc_form[key] = JSON.stringify(this.jc_form[key]);
        }
      }
      this.jc_form.depid = this.userinfo.department
      this.jc_form.jiechu_time = this.current_timestamp
      // 开始时间不能小于结束时间
      let now_time = moment().format('yyyy-MM-DD')
      console.log(now_time)
      console.log(this.jc_form.yjiechu_time, 111)
      if (this.jc_form.yjiechu_time <= now_time) {
        this.$message.error("预归还时间不能小于或等于当前时间！");
        return;

      }
      this.jc_form.tag = "未归还"
      try {
        if (this.jc_form.pk) {
          await resource.updateObj("data", this.jc_form.pk, {
            ...this.jc_form,
            template_id: TEMPLATE_ID_jc
          });
          this.$message.success("编辑成功!")
        } else {
          await resource.createObj("data", {
            ...this.jc_form,
            template_id: TEMPLATE_ID_jc
          });
          this.$message.success("借出成功!")
        }
        console.log(this.jc_form.jiechu_danhao)
        await resource.patchObj("data", this.jc_form.jiechu_danhao, {
          zhuangtai: '已借出',
          template_id: TEMPLATE_ID
        });
        this.jiemDialogVisable = false
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
    zhuanyi(row) {
      this.zy_form = {
        ...ZY_FORM
      };
      this.zy_form.dangan_name = row.name
      this.zy_form.wendang_id = row.pk;

      this.sormDialogVisable = true;
    },
    jiechu(row) {
      this.jc_form = {
        ...JC_FORM
      };
      this.jc_form.name = row.name
      this.jc_form.jiechu_danhao = row.pk;

      this.jiemDialogVisable = true;
    },
    async delTable(row) {
      try {
        await resource.deleteObj("data", row.pk, this.$store.state.sys_id, row.template_id)
        this.$message.success("删除成功!")
        this.loadData()
      } catch (err) {
        this.$message.error("删除失败!")
      }
    },

    excelExport() {
      let header = [
        "文档分类",
        "部门",
        "文档编号",
        "文档字号",
        "名称",
        "保密等级",
        "存放位置",
        "备注",
        "状态",
        "操作时间",
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
      let ws = XLSX.utils.json_to_sheet(tmp, {header});
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "文档管理.xlsx");
    },
    clearForm() {
      this.form = {
        ...FORM
      }
      this.$refs.FormComp.$refs.form.resetFields();
    },
    clearzyForm() {//当点击时，清空表单
      this.zy_form = {
        ...ZY_FORM
      }
      this.$refs.zyFormComp.$refs.form.resetFields();
    },
    clearjcForm() {//当点击时，清空表单
      this.jc_form = {
        ...JC_FORM
      }
      this.$refs.jcFromComp.$refs.form.resetFields();
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
      } catch (error) {
      }
    },

    get_fenlei_option_data_display(value) {
      let option = this.fenlei_option_data.filter((item) => {
        return item.fenl === value;
      });
      return option.length > 0 ? option[0].fenl : value;
    },

    get_bumen_option_data_display(value) {
      let option = this.bumen_option_data.filter((item) => {
        return item.bumem === value;
      });
      return option.length > 0 ? option[0].bumem : value;
    },

    get_baomi_option_data_display(value) {
      let option = this.baomi_option_data.filter((item) => {
        return item.baomi === value;
      });
      return option.length > 0 ? option[0].baomi : value;
    },

    async getLocalDataSource() {
      // 获取文档分类:fenlei数据源数据
      let fenlei = await resource.getObjFromList("basetree", {"name": '档案分类', org_id: this.userinfo.org_id});
      if (fenlei.items.length > 0) {
        this.fenlei_option_data = fenlei.items;
      }
      // 获取部门:bumen数据源数据
      this.bumen_option_data = await resource.getList("flatdepartment", {});
      // 获取保密等级:baomi数据源数据
      let baomi = await resource.getObjFromList("basetree", {"name": "保密等级", org_id: this.userinfo.org_id});
      if (baomi.items.length > 0) {
        this.baomi_option_data = baomi.items;
      }
    },
  },
  created() {
    this.loadData()
    this.getLocalDataSource()
  },
  computed: {
    ...mapState(['userinfo', 'quanxian']),
    excelDownloadTranslate() {
      return {
        "fenlei": "文档分类",
        "bumen": "部门",
        "bianhao": "文档编号",
        "zihao": "文档字号",
        "name": "名称",
        "baomi": "保密等级",
        "weizhi": "存放位置",
        "beizhu": "备注",
        "zhuangtai":"状态",
        "time": "操作时间",

      }
    }
  },
  components: {
    pdfview,
    Form,
    ImportData,
    zy_Forms,
    jc_Forms,
  },
  mounted() {
    this.timer = setInterval(() => {
      this.current_timestamp = this.$dayjs().format("YYYY-MM-DD HH:mm:ss");
    }, 1000);
  }

}
</script>
<style>
.batchClass {
  position: absolute;
  right: 20px;
  bottom: 17px;
}

.el-table .warning-row {
  background: #f3f5f8;

  /*color: #FFFFFF;*/
}


</style>
