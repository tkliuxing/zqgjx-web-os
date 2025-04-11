<template>
  <el-card style="position:relative">
    <div slot="header" class="clearfix">
      <span>微信用户绑定</span>
    </div>
    <div v-if="open_id">

      <div v-if="login_status">

        <el-row>
          <el-col :sm="12" :lg="6">
            <el-result icon="success" title="" subTitle="微信号已绑定,点击解绑可取消绑定！！！">
              <template slot="extra">
                <el-button type="primary" size="medium" @click="jieBang">解绑</el-button>
              </template>
            </el-result>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-form :model='form' ref="FormComp" label-width="95px" status-icon>
          <el-form-item label="姓名" prop="phone" placeholder="请输入姓名..."
                        :rules="[{ required:true, message:'姓名为必填项' },]">
            <el-input v-model="form.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系方式" placeholder="请输入手机号..." prop="phone"
                        :rules="[{ validator: verifyMobile, trigger: 'blur' },{ required:true, message:'联系方式为必填项' },]">
            <el-input v-model="form.phone" clearable></el-input>
          </el-form-item>
        </el-form>
        <div class="footer" style="text-align: center">
          <el-button type="primary" size="medium" @click="submitForm()">绑定</el-button>
        </div>
      </div>
    </div>
    <div v-else>
      <el-row v-if="code">
          <el-col :sm="12" :lg="6">
            <el-result icon="info" title="提示" subTitle="微信授权失败，请重新授权！">
              <template slot="extra">
                <el-button type="primary" size="medium" @click="wx_authorize()">重新授权</el-button>
              </template>
            </el-result>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :sm="12" :lg="6">
            <el-result icon="info" title="" subTitle="正在努力获取中!!!">
              <template slot="extra">
                <i class="el-icon-loading"></i>
              </template>
            </el-result>
          </el-col>
        </el-row>
    </div>

  </el-card>
</template>
<script>
//
// name:绑定用户名
// openid:来访人openid
// phone:绑定手机号

import resource from "@/mobile/resource";
import moment from "moment";
import store, {LOGIN, LOGOUT, USERINFO} from "@/mobile/mobile.store";
import {verifyMobile, verifyEmail, verifyIdCard} from "@/mobile/utils/verify"
import Vue from 'vue';
import {Row,Col,Result,Button,Form,FormItem,Card,Message,Input} from 'element-ui';
Vue.use(Row);
Vue.use(Col);
Vue.use(Result);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Card);
Vue.use(Input);
Vue.use(Message);
const TEMPLATE_ID = "FT251654980880760832";

export default {
  name: "",
  data() {
    return {
      form: {
        name: null,
        openid: null,
        phone: null,
      },
      login_status: false,
      open_id: null,
      user_id_option_data: null,
      title: '信息审核提交成功！',
      code: null,
      uri: window.location.href,
      verifyMobile, verifyEmail, verifyIdCard
    }
  },
  methods: {
    async wx_token() {
      let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1896f3a6cb69e5a3&redirect_uri=" + this.uri + "&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
      // setTimeout(() => {
      window.location.href = url;
      // }, 10000);
    },
    async wx_authorize() {
      this.$store.commit(LOGOUT);
      this.$store.commit(LOGIN, '');
      try {
        let res = await resource.createObj("mp-codetoopenid", {
          "sys_id": 1,
          "code": this.code,
          "uri": this.uri
        });
        console.log("微信openid=", res);
        this.open_id = res.open_id;
        // this.open_id = 'onDmH6FWAzt-HNwWGfoBTJ3f7fj8';
        await this.login();
      } catch (err) {
        console.log("微信openid---", err.response.data.non_field_errors);
        Message.success("微信授权失败，请重试！！！")
      }
      // this.open_id = 'onDmH6FWAzt-HNwWGfoBTJ3f7fj8';
      await this.login();
    },
    async login() {
      try {
        let resp = await resource.createObj("mp-openidlogin", {
          sys_id: 1,
          openid: this.open_id
        });
        console.log("登录结果", resp)
        this.$store.commit(LOGIN, resp.token);
        const myinfo = await this.$http.get("/myinfo/");
        this.$store.commit(USERINFO, myinfo.data);
        this.login_status = true;
      } catch (e) {
        this.login_status = false;
      }
    },
    async submitForm() {
      new Promise(resolve => this.$refs.FormComp.validate(validate => resolve(validate)))
      if (!this.form.name || !this.form.phone) {
        Message.warning("请认真填写表单!");
        return;
      }
      try {
        this.form.openid = this.open_id;
        let res = await resource.createObj("mp-openidnamephonebind", {
          sys_id: 1,
          ...this.form,
        });
        this.login_status = true;
        this.clearForm();
      } catch (error) {
        this.login_status = false;
        Message.error(error.response.data.non_field_errors[0])
      }
    },
    async jieBang() {
      try {
        let userInfo = JSON.parse(JSON.stringify(this.$store.state.userinfo));
        userInfo.wechart_oid = '';
        this.form.openid = this.open_id;
        let res = await resource.patchObj("user", userInfo.pk, userInfo);
        console.log(res);
        this.login_status = false;
        Message.success("解绑成功！！！");
        this.clearForm();
      } catch (error) {
        Message.error(error.response.data.non_field_errors[0])
      }
    },
    clearForm() {
      this.form = {
        name: null,
        openid: null,
        phone: null,
      }
      this.$refs.FormComp.resetFields();
    },
  },
  async created() {
    this.open_id = await localStorage.getItem("open_id");
    // console.log("open_id", this.open_id);
    // this.open_id = 'onDmH6JXAojHW4nKa3jv1xeeu57U';
    this.uri = window.location.href;
    this.code = this.$route.query.code;
    if (!this.open_id) {
      if (this.code) {
        await this.wx_authorize();
      } else {
        // await this.wx_authorize();
        await this.wx_token();
      }
    }else{
      await this.login();
    }
  },
  computed: {},
  components: {}
}
</script>
<style scoped>
.batchClass {
  position: absolute;
  right: 20px;
  bottom: 17px;
}
</style>