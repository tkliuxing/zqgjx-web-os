<template>
  <el-card style="position:relative">
    <div slot="header" class="clearfix">
      <span>拜访审核</span>
    </div>
    <div v-if="pk">
      <div v-if="open_id">
        <div v-if="status">
          <Form v-if="form.pk" v-model="form" :org_id="org_id" :status="0" ref="FormComp" @checked="submitForm"/>
          <div class="footer" style="text-align: center" v-if="form.status==='待审核'">
            <el-button icon="el-icon-close" type="danger" @click="submitForm(0)">不同意</el-button>
            <el-button icon="el-icon-check" type="primary" @click="submitForm(1)">同意</el-button>
          </div>
        </div>
        <el-row v-else>
          <el-col :sm="12" :lg="6">
            <el-result icon="success" title="成功提示" :subTitle="title">
              <template slot="extra">
                <el-button type="primary" size="medium" @click="status=true">返回</el-button>
              </template>
            </el-result>
          </el-col>
        </el-row>
      </div>

      <div v-else>
        <el-row v-if="code">
          <el-col :sm="12" :lg="6">
            <el-result icon="info" title="信息提示" subTitle="微信授权失败，请重新授权！">
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
    </div>
    <div v-else>
      <el-row>
        <el-col :sm="12" :lg="6">
          <el-result icon="info" title="信息提示" subTitle="链接地址不正确!">
            <template slot="extra">
              <!--              <el-button type="primary" size="medium">返回</el-button>-->
            </template>
          </el-result>
        </el-col>
      </el-row>
    </div>

  </el-card>
</template>
<script>
//
// TEMPLATE_ID: FT251654980880760832
// 字段说明:
// user_id:受访人员
// wx_openid:来访人openid
// lf_name:来访人姓名
// lf_dep:所属单位
// lf_mobile:联系方式
// lf_sy:来访事由
// create_time:来访时间
// status:申请状态
// remarks:备注
// sf_name:受访人姓名
// sf_mobile:受访人联系方式
// sh_time:审核时间

import Form from "../Form.vue"
import resource from "@/mobile/resource";
import moment from "moment";
import store, {LOGIN, LOGOUT, USERINFO} from "@/mobile/mobile.store";
import {wx_token} from "./constvars";
import Vue from 'vue';
import {Button,Row,Col,Result,Message} from 'element-ui';
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Result);
Vue.use(Message);

const TEMPLATE_ID = "FT251654980880760832";

export default {
  name: "",
  data() {
    return {
      form: {
        pk: null,
        user_id: null,
        wx_openid: null,
        lf_name: null,
        lf_dep: null,
        lf_mobile: null,
        lf_sy: null,
        create_time: null,
        status: null,
        remarks: null,
        sf_name: null,
        sf_mobile: null,
        sh_time: null,
      },
      status: true,
      pk: null,
      org_id: null,
      open_id: null,
      user_id_option_data: null,
      title: '信息审核提交成功！',
      code: null,
      uri: window.location.href,
    }
  },
  methods: {
    async wx_token() {
      let url = wx_token(this.uri);
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
        this.open_id = res.open_id;
        await localStorage.setItem("open_id", res.open_id);
        // this.open_id = 'o21hvuK_LiWecht58-23RWJgFDEA';
        await this.login();
      } catch (err) {
        console.log("微信openid---", err.response.data.non_field_errors);
        Message.success("微信授权失败，请重试！！！")
      }
      // this.open_id = 'o21hvuK_LiWecht58-23RWJgFDEA';
      //  await this.login();
    },
    async login() {
      try {
        let resp = await resource.createObj("mp-openidlogin", {
          sys_id: 1,
          openid: this.open_id
        });
        this.$store.commit(LOGIN, resp.token);
        const myinfo = await this.$http.get("/myinfo/");
        this.$store.commit(USERINFO, myinfo.data);
      } catch (err) {

      }
    },
    async loadData() {
      this.loading = true;
      let params = {
        sys_id: 1,
        template_id: TEMPLATE_ID
      }
      let res = await resource.getObj("data", this.pk, params);
      let data = res;
      if (data) {
        data.create_time = moment(data.create_time).format("YYYY-MM-DD HH:mm:ss");
        this.org_id = data.org_id;
      }
      this.form = data;
    },
    async submitForm(data) {
      for (const key in this.form) {
        if (this.form[key] !== null && typeof this.form[key] === "object") {
          this.form[key] = JSON.stringify(this.form[key]);
        }
      }
      try {
        if (this.form.pk) {
          this.form.status = "同意";
          if (data === 0) {
            this.form.status = "不同意";
          }
          this.form.sh_time = moment().format("YYYY-MM-DD HH:mm:ss");
          let res = await resource.updateObj("data", this.form.pk, {
            ...this.form,
            template_id: TEMPLATE_ID
          });
          // await this.toNotice(res);
          Message.success("提交成功!")
        }
        await this.loadData();
        this.status = false;
        // this.clearForm();
      } catch (error) {
        Message.success("提交失败，请重试!")
      }
    },
    async toNotice(data) {
      let wx_openid = data.wx_openid;
      if (!wx_openid) {
        this.title = '消息推送失败了，对方未绑定公众号,请电话联系受访人确认!';
        Message.error("消息推送失败了，对方未绑定公众号!")
        return;
      }
      await resource.createObj("mp-send-template-msg", {
        "sys_id": 1,
        "touser": wx_openid,
        "template_id": 1,
        "url": window.location.host + "?pk=" + data.pk,
        "data": {},
      });
      this.title = '消息已发送至受访人,请关注下方公众号接收审核状态！！！';
      Message.success("消息已发送至对方!")
    },
    clearForm() {
      this.form = {

        user_id: null,

        wx_openid: null,

        lf_name: null,

        lf_dep: null,

        lf_mobile: null,

        lf_sy: null,

        create_time: null,

        status: null,

        remarks: null,
        sh_time: null,

      }
      this.$refs.FormComp.$refs.FormComp.resetFields();
    },
    async getLocalDataSource() {
      let res0 = await resource.getList("user", {
        'org_id': this.org_id || this.$store.state.userinfo.org_id,
        "sys_id": 1
      });
      this.user_id_option_data = res0;
    },
    get_user_id_option_data_display(value) {
      let option = this.user_id_option_data.filter((item) => {
        return item["pk"] === value;
      });
      if (option.length > 0) return option[0]["wechart_oid"];
      return value;
    },
  },
  async created() {
    this.pk = this.$route.query.pk;
    this.uri = window.location.href;
    this.code = this.$route.query.code;
    this.open_id = this.$route.query.open_id;
    if (!this.open_id) {
      this.open_id = await localStorage.getItem("open_id");
    }

    if (this.pk) {
      if (this.open_id) {
        await this.login();
      } else {
        if (this.code) {
          await this.wx_authorize();
        } else {
          await this.wx_token();
          // await this.wx_authorize();
        }
      }
      await this.loadData();
      await this.getLocalDataSource();

    }
  },
  computed: {},
  components: {
    Form,
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