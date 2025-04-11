<template>
  <el-form :model='form' ref="form" label-width="100px" :rules="rules" status-icon>
    <el-form-item label="文档分类" prop="wendang_fenlei">
      <el-input :disabled="readonly" v-model="form.wendang_fenlei" clearable name="form.wendang_fenlei" autocomplete="on"></el-input>
    </el-form-item>

  </el-form>
</template>
<script>
  //
  // TEMPLATE_ID: FT333844674657345536
  // 字段说明:
  // wendang_fenlei:文档分类
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
        rules: {

        },
        verifyMobile,
        verifyEmail,
        verifyIdCard
      }
    },
    methods: {
      async getLocalDataSource() {
        this.headers.Authorization = "Bearer " + this.$store.state.token;
        this.fileData.sys_id=this.$store.state.sys_id;
        this.fileData.org_id=this.$store.state.userinfo.org_id;

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
