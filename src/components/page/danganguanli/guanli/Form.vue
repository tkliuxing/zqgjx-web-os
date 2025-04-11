<template>
  <div>
    <el-form ref="form" :model='form' :rules="rules" label-width="100px" status-icon>
      <el-row>
        <el-col :span="12">
          <el-form-item label="文档分类" prop="fenlei">
            <el-select v-model="form.fenlei" :disabled="readonly" clearable style="width: 100%">
              <el-option v-for="item in fenlei_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item label="部门" prop="bumen">
              <el-select v-model="form.bumen" :disabled="readonly" clearable style="width: 100%">
                <el-option v-for="item in bumen_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="文档编号" prop="bianhao">
        <el-input v-model="form.bianhao" :disabled="readonly" autocomplete="on" clearable name="form.bianhao"></el-input>
      </el-form-item>
      <el-form-item label="文档字号" prop="zihao">
        <el-input v-model="form.zihao" :disabled="readonly" autocomplete="on" clearable name="form.zihao"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" :disabled="readonly" autocomplete="on" clearable name="form.name"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <div>
            <el-form-item label="保密等级" prop="baomi">
              <el-select v-model="form.baomi" :disabled="readonly" clearable style="width: 100%" @change="qita()">
                <el-option v-for="item in baomi_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="存放位置" prop="weizhi">
        <el-input v-model="form.weizhi" :disabled="readonly" autocomplete="on" clearable name="form.weizhi"></el-input>
      </el-form-item>
      <el-form-item label="附件" prop="fujian">
        <PMFileUpload v-if="!readonly" :category="categoryPK" :file-list="form.fujian" :limit="20" :validatePDF="validatePDF"
                      isCustomName @on-change="(file, flist)=>{ this.pmfileSuccess(file, flist,'fujian')}">
        </PMFileUpload>
        <TableFileView v-else :file-list="form.fujian" isCustomName></TableFileView>
      </el-form-item>
      <el-form-item label="备注" prop="beizhu">
        <el-input v-model="form.beizhu" :disabled="readonly" clearable name="form.beizhu" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="renyuan_show"
      append-to-body
      title="人员密级"
      width="50%"
    >
      <el-checkbox-group v-model="form.baomi_renyuan" >
        <el-checkbox v-for="item in namne_option_data" :label="item.pk" :key="item.pk">{{item.full_name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
    <el-button @click="renyuan_show = false">取 消</el-button>
    <el-button type="primary" @click="renyuan_show = false">确 定</el-button>
       </span>
    </el-dialog>

    <el-dialog
      :visible.sync="bumen_show"
      append-to-body
      title="部门密级"
      width="50%"
    >
      <el-checkbox-group v-model="form.baomi_bumen" >
        <el-checkbox v-for="item in bumen_option_data" :label="item.pk" :key="item.pk">{{item.name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
    <el-button @click="bumen_show = false">取 消</el-button>
            <el-button type="primary" @click="bumen_show = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
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
import {mapState} from "vuex";
import {BASE_HOST} from "@/constvars";
import {verifyMobile, verifyEmail, verifyIdCard} from "@/utils/verify.js"
import resource, {getList} from "@/resource";
import PMFileUpload from "@/components/common/PMFileUpload.vue";
import TableFileView from "@/components/common/TableFileView.vue";
import pdfview from "@/components/common/PDFViewer.vue";

export default {
  name: "Form",
  components: {pdfview, TableFileView, PMFileUpload},
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
      renyuan_show: false,
      bumen_show: false,
      rules: {
        fenlei: [
          {required: true, message: '请选择部门分类', trigger: 'blur'},
        ],
        bumen: [
          {required: true, message: '请选择部门', trigger: 'blur'},
        ],
        bianhao: [
          {required: true, message: '请选择文档编号', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入文档名称', trigger: 'change'}
        ],
        baomi: [
          {required: true, message: '请选择保密等级', trigger: 'change'}
        ],
        weizhi: [
          {required: true, message: '请输入存放位置', trigger: 'change'}
        ],
      },
      headers: {
        Authorization: null
      },
      fileData: {
        sys_id: null,
        org_id: null
      },
      categoryPK: null,
      fenlei_option_data: null,
      bumen_option_data: null,
      baomi_option_data: [],
      namne_option_data: [],
      verifyMobile,
      verifyEmail,
      verifyIdCard,

    }
  },
  methods: {
    qita(){
     if (this.form.baomi=='公开'){
       this.form.baomi_renyuan=[]
       this.form.baomi_bumen= this.bumen_option_data.map(item => item.pk);
     }else if (this.form.baomi=='人员密级'){
       this.renyuan_show=true
       this.form.baomi_bumen=[]
     }else if (this.form.baomi=='部门密级'){
       this.bumen_show=true
       this.form.baomi_renyuan=[]
     }else if (this.form.baomi=='私密'){
       this.form.baomi_renyuan=[]
       this.form.baomi_bumen=[]
     }
    },
    validatePDF(file) {
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        this.$message.error('只能上传PDF格式的文件');
      }
      return isPDF;
    },
    pmfileSuccess(file, flist, value) {
      console.log(this.form.fujian)
      this.form[value] = flist.map((item) => {
        return {
          name: item.name,
          file: item.response ? item.response.file : item.file,
          pk: item.response ? item.response.pk : item.pk,
          category: item.response ? item.response.category : item.category,
          desc: item.response ? item.response.desc : item.desc,
          file_name: item.response ? item.response.file_name : item.file_name,
        };
      });
    },
    BASE_HOST() {
      return BASE_HOST
    },
    async getLocalDataSource() {
      this.headers.Authorization = "Bearer " + this.$store.state.token;
      this.fileData.sys_id = this.$store.state.sys_id;
      this.fileData.org_id = this.$store.state.userinfo.org_id;
      // 获取文档分类:fenlei数据源数据
      let fenlei = await resource.getObjFromList("basetree", {"name": '档案分类', org_id: this.userinfo.org_id});
      if (fenlei.items.length > 0) {
        this.fenlei_option_data = fenlei.items;
      }
      this.namne_option_data = await resource.getList("usermin", {});
      // 获取部门:bumen数据源数据
      this.bumen_option_data = await resource.getList("flatdepartment", {});
      // 获取保密等级:baomi数据源数据
      let baomi = await resource.getObjFromList("basetree", {"name": "保密等级", org_id: this.userinfo.org_id});
      if (baomi.items.length > 0) {
        this.baomi_option_data = baomi.items;
      }
      let fujian = await resource.getObjFromList("basetree", {'name': '档案附件', org_id: 0});
      if (fujian.items.length > 0) {
        this.categoryPK = fujian.items;
      }
      // this.categoryPK =[{"(目前只允许pdf格式)"}]
      // console.log(category,'90')
      // if (category.length > 0) {
      //   this.categoryPK = category[0].parent;
      // }
    },
    async submit() {
      let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)));
      if (valid) {
        this.$emit("checked");
      } else {
        this.$message.warning("请认真填写表单!")
      }
    },

    handlefileExceed() {
      this.$message.warning("最多上传100个文件");
    },
    handlefileRemove(field) {
      this.form[field] = null;
    },
    handlefilePreview(res) {
      if (res.url) {
        let a = document.createElement("a");
        a.href = res.url;
        a.target = "_blank";
        a.click();
      }
    },
    handlefileSuccess(res, field) {
      if (res.file) {
        this.form[field] = res.file;
      }
      this.$message.warning("上传成功");
    }
  },
  created() {
    this.getLocalDataSource()
  },


}
</script>
