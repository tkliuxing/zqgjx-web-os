<template>
  <el-form :model='form'  ref="form" label-width="100px" :rules="rules" status-icon>
    <el-form-item label="文档名称" prop="dangan_name">
      <el-input  v-model="form.dangan_name" utocomplete="on" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="转移部门" prop="zhuanrudanwei">
      <el-select style="width: 100%" :disabled="readonly" clearable v-model="form.zhuanrudanwei"><el-option v-for="item in zhuanrudanwei_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option></el-select>
    </el-form-item>
    <el-form-item label="转移人员" prop="zhunrurny">
      <el-select style="width: 100%" :disabled="readonly" clearable v-model="form.zhunrurny"><el-option v-for="item in zhunrurny_option_data" :key="item.pk" :label="item.name" :value="item.full_name"></el-option></el-select>
    </el-form-item>
    <el-form-item label="经办人员" prop="jiangban_user">
      <el-select style="width: 100%" :disabled="readonly" clearable v-model="form.jiangban_user"><el-option v-for="item in jiangban_user_option_data" :key="item.pk" :label="item.name" :value="item.full_name"></el-option></el-select>
    </el-form-item>
    <el-form-item label="存放地点" prop="cunfang">
      <el-input :disabled="readonly" v-model="form.cunfang" clearable name="form.cunfang" autocomplete="on"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="beizhu">
      <el-input type="textarea" :disabled="readonly" v-model="form.beizhu" clearable name="form.beizhu"></el-input>
    </el-form-item>

  </el-form>
</template>
<script>
  //
  // TEMPLATE_ID: FT333844825437347840
  // 字段说明:
  // wendang_id:文档id
  // dangan_name:档案名称
  // zhuanrudanwei:转入单位
  // zhunrurny:转入人员
  // jiangban_user:经办人员
  // cunfang:存放地点
  // beizhu:备注
  import {mapState} from "vuex";
  import resource from "@/resource";
  import {verifyMobile, verifyEmail, verifyIdCard} from "@/utils/verify.js"
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
      // wendang_id:文档id
      // dangan_name:档案名称
      // zhuanrudanwei:转入单位
      // zhunrurny:转入人员
      // jiangban_user:经办人员
      // cunfang:存放地点
      // beizhu:备注
      return {
        rules: {
          zhunrurny: [
            { required: true, message: '请输入转移人员', trigger: 'blur' },
          ],
          zhuanrudanwei: [
            { required: true, message: '请选择转移单位', trigger: 'change' }
          ],
          jiangban_user: [
            { required: true, message: '请输入经办人员', trigger: 'change' }
          ],
          cunfang: [
            { required: true, message: '请填写存房地点', trigger: 'blur' }
          ]
        },
        headers: {
          Authorization: null
        },
        fileData: {
          sys_id: null,
          org_id: null
        },

        zhuanrudanwei_option_data: null,
        zhunrurny_option_data: null,
        jiangban_user_option_data: null,
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
        // 获取转移部门:zhuanrudanwei数据源数据
        this.zhuanrudanwei_option_data = await resource.getList("flatdepartment",{});
        // 获取转移人员:zhunrurny数据源数据
        this.zhunrurny_option_data = await resource.getList("usermin",{});
        // 获取经办人员:jiangban_user数据源数据
        this.jiangban_user_option_data = await resource.getList("usermin",{});
      },
      async submit() {
        let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)));
        if (valid) {
          this.$emit("checked",11);
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
