<template>
  <el-form :model='form'  ref="form" label-width="90px" :rules="rules" status-icon>
    <el-form-item label="文档名称" prop="ame">
      <el-input  v-model="form.name" utocomplete="on" :disabled="true"></el-input>
    </el-form-item>
        <el-form-item label="借出部门" prop="jiechu_bumen">
          <el-select style="width: 100%" :disabled="readonly" clearable v-model="form.jiechu_bumen"><el-option v-for="item in jiechu_bumen_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option></el-select>
        </el-form-item>
<!--        <el-form-item label="借出时间" prop="jiechu_time">-->
<!--        <el-date-picker :disabled="readonly" v-model="form.jiechu_time" clearable value-format="yyyy-MM-dd" />-->
<!--      </el-form-item>-->
    <el-form-item label="借出人员" prop="jiechu_ren">
      <el-select style="width: 100%"  :disabled="readonly" clearable v-model="form.jiechu_ren"><el-option v-for="item in jiechu_ren_option_data" :key="item.pk" :label="item.name" :value="item.full_name"></el-option></el-select>
    </el-form-item>
    <el-form-item label="联系方式" prop="lianxi_fangshi">
      <el-input :disabled="readonly" clearable v-model="form.lianxi_fangshi" name="form.lianxi_fangshi" autocomplete="on"></el-input>
    </el-form-item>
    <el-form-item label="预归还时间" prop="yjiechu_time">
      <el-date-picker style="width: 100%" :disabled="readonly" v-model="form.yjiechu_time" clearable value-format="yyyy-MM-dd" />
    </el-form-item>
    <el-form-item label="借出说明" prop="jiechu_shuom">
      <el-input type="textarea" :rows="3" :disabled="readonly" v-model="form.jiechu_shuom" clearable name="form.jiechu_shuom" autocomplete="on"></el-input>
    </el-form-item>

  </el-form>
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
  // shifou_guihuan:是否归还
  // tag:归还
  import {mapState} from "vuex";
  import {verifyMobile, verifyEmail, verifyIdCard} from "@/utils/verify.js"
  import resource from "@/resource";
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
        // jiechu_danhao:借出单号
        // name:档案名称
        // jiechu_bumen:借出部门
        // jiechu_ren:借出人员
        // lianxi_fangshi:联系方式
        // jiechu_time:借出时间
        // guihuan_time:归还时间
        // jiechu_shuom:借出说明
        // shifou_guihuan:是否归还
        // tag:归还
        rules: {
          lianxi_fangshi:[
            { required: true,"pattern":"(^(\\d{3,4}-)?\\d{7,8})$|(1[3|5|7|8]\\d{9})","message":"请输入正确的手机号码或固定电话","trigger":"blur"}
          ],
          jiechu_bumen: [
            { required: true, message: '请输入借出部门', trigger: 'blur' },
          ],
          jiechu_ren: [
            { required: true, message: '请输入借出人员', trigger: 'blur' }
          ],
          jiechu_time: [
            {  required: true, message: '请选择时间', trigger: 'change' }
          ],
        },
        jiechu_bumen_option_data: null,
        jiechu_ren_option_data:null,
        verifyMobile,
        verifyEmail,
        verifyIdCard,
      }
    },
    methods: {
      async getLocalDataSource() {
        this.headers.Authorization = "Bearer " + this.$store.state.token;
        this.fileData.sys_id=this.$store.state.sys_id;
        this.fileData.org_id=this.$store.state.userinfo.org_id;

        // 获取借出部门:jiechu_bumen数据源数据
        // this.jiechu_bumen_option_data = await resource.getList("data",{"template_id":"FT333844613637038080"});
        this.jiechu_bumen_option_data = await resource.getList("flatdepartment",{});
        // 获取借出人员:jiechu_ren数据源数据
        this.jiechu_ren_option_data = await resource.getList("usermin",{});
      },
      async submit() {
        let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)));
        if (valid) {
          this.$emit("checked");
        } else {
          this.$message.warning("请认真填写表单!")
        }
      },

      handlefileExceed(){
        this.$message.warning("只可选择 1 个文件");
      },
      handlefileRemove(field){
        this.form[field]=null;
      },
      handlefilePreview(res){
        if(res.url){
          let a = document.createElement("a");
          a.href = res.url;
          a.target = "_blank";
          a.click();
        }
      },
      handlefileSuccess(res,field){
        if(res.file){
          this.form[field] = res.file;
        }
      }
    },
    created() {
      this.getLocalDataSource()
    },
    mounted() {

    }
  }
</script>
