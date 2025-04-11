<template>
  <el-card style="position:relative">
    <div slot="header" class="clearfix">
      <span>拜访申请</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="jilv">拜访记录</el-button>
    </div>
    <div v-if="org_id">
      <div v-if="open_id">
        <div v-if="status">
          <Form v-model="form" :org_id="org_id" :status="1" ref="FormComp" @checked="submitForm"/>
          <div class="footer" style="text-align: center">
            <el-button icon="el-icon-check" type="primary" @click="$refs.FormComp.submit()">提交申请</el-button>
          </div>
        </div>
        <el-row v-else>
          <el-col :sm="12" :lg="6">
            <el-result icon="success" title="成功提示" :subTitle="title">
              <template slot="extra">
                <div>
                  <el-image
                      style="width: 200px; height: 200px"
                      :src="src"
                      :preview-src-list="[]">
                  </el-image>
                </div>

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
          <el-result icon="info" title="信息提示" subTitle="请扫正确的单位来访二维码!">
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
import {LOGIN, LOGOUT, USERINFO} from "@/mobile/mobile.store";
import {wx_token} from "./constvars";
import Vue from 'vue';
import {Button,Col,Row,Card,Result,Message} from 'element-ui';
Vue.use(Button);
Vue.use(Col);
Vue.use(Row);
Vue.use(Card);
Vue.use(Result);
Vue.use(Message);

const TEMPLATE_ID = "FT251654980880760832";

export default {
  name: "",
  data() {
    return {
      form: {
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
      org_id: null,
      open_id: null,
      user_id_option_data: null,
      src: "",
      title: '消息已发送至受访人,请关注下方公众号可查看审核状态！！！',
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
          "org_id": this.org_id,
          "code": this.code,
          "uri": this.uri
        });
        console.log("微信openid=", res);
        this.open_id = res.open_id;
        await localStorage.setItem("open_id", res.open_id);
      } catch (err) {
        console.log("微信openid---", err.response.data.non_field_errors);
        Message.success("微信授权失败，请重试！！！")
      }
      // this.open_id = 'o21hvuK_LiWecht58-23RWJgFDEA';
    },
    async submitForm() {
      for (const key in this.form) {
        if (this.form[key] !== null && typeof this.form[key] === "object") {
          this.form[key] = JSON.stringify(this.form[key]);
        }
      }
      try {
        this.form.wx_openid = this.open_id;
        this.form.create_time = moment().format("YYYY-MM-DD HH:mm:ss");
        this.form.status = "待审核";
        this.form.sys_id = 1;

        let res = await resource.createObj("data", {
          ...this.form,
          template_id: TEMPLATE_ID
        });
        await localStorage.setItem("sq_form", JSON.stringify(this.form));
        await this.toNotice(res);
        Message.success("申请提交成功!")
        // this.loadData()
        this.status = false;
        this.clearForm();
      } catch (error) {
        Message.success("申请提交失败，请重试!")
      }
    },
    async toNotice(data) {
      let wechart_oid = await this.get_user_id_option_data_display(data.sf_mobile);
      if (!wechart_oid) {
        this.title = '消息推送失败了，对方未绑定公众号,请电话联系受访人确认!';
        Message.error("消息推送失败了，对方未绑定公众号!")
        return;
      }
      let res = await resource.createObj("mp-send-template-msg", {
        "sys_id": 1,
        "org_id": this.org_id,
        "touser": wechart_oid,
        "template_id": "xUQxi1NZKFDiAPDSMVxgnHv1U0A60lt_cEhZTnfnZzE",
        "url": window.location.host + "/mobile/sf_shen_he?pk=" + data.pk,
        "data": {
          "first": {
            "value": "拜访申请",
            "color": "#173177"
          },
          "keyword1": {
            "value": data.lf_name,
            "color": "#173177"
          },
          "keyword2": {
            "value": data.create_time,
            "color": "#173177"
          },
          "remark": {
            "value": data.lf_sy,
            "color": "#173177"
          }
        },
      });
      if (res.errcode !== 0) {
        // this.title = '消息已发送至受访人,请关注下方公众号可查看审核状态！！！' + JSON.stringify(res);
        this.title = "消息推送失败了！！！" + JSON.stringify(res);
        Message.success(res.errmsg);
      } else {
        this.title = '消息已发送至受访人,请关注下方公众号可查看审核状态！！！';
        Message.success("消息已发送至对方!");
      }

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
        sf_name: null,
        sf_mobile: null,
        sh_time: null,
      }
      this.$refs.FormComp.$refs.FormComp.resetFields();
    },
    async getLocalDataSource() {
      // let res0 = await resource.createObj("userfind", {
      //   'org_id': this.org_id || this.$store.state.userinfo.org_id,
      //   "sys_id": 1
      // });
      // this.user_id_option_data = res0;

      let res1 = await resource.getList("systemorg", {
        'org_id': this.org_id,
        "sys_id": 1
      });
      // console.log(res1);
      // this.sys_org_data= res1[0]

    },
    async get_user_id_option_data_display(query) {
      let res = await resource.createObj("userfind", {
        'org_id': this.org_id || this.$store.state.userinfo.org_id,
        "sys_id": 1,
        'search': query
      });
      if (res) {
        if (res.count === 1 && res.wechart_oid) {
          this.user_id_option = [res];
          return res.wechart_oid;
        }

      }
      return null;
    },
    async jilv() {
      this.$router.push({name: 'sf_shen_he_list', query: {open_id: this.open_id}});
    }
  },
  async created() {
    this.org_id = this.$route.query.pk;
    this.open_id = this.$route.query.open_id;
    // this.open_id = 'onDmH6FWAzt-HNwWGfoBTJ3f7fj8';
    // this.open_id = 'onDmH6JXAojHW4nKa3jv1xeeu57U';
    this.form.org_id = this.org_id;
    this.uri = window.location.href;
    this.code = this.$route.query.code;
    if (!this.open_id) {
      this.open_id = await localStorage.getItem("open_id");
    }
    let sq_form = await localStorage.getItem("sq_form");
    if(sq_form){
      sq_form = JSON.parse(sq_form);
      sq_form.user_id=null;
      sq_form.wx_openid=null;
      sq_form.status=null;
      sq_form.create_time=null;
      this.form = {...sq_form};
    }
    this.open_id = 'o21hvuK_LiWecht58-23RWJgFDEA';
    if (this.org_id && !this.open_id) {
      console.log(this.org_id,this.open_id,this.code)
      if (this.code) {
        await this.wx_authorize();
      } else {
        // await this.wx_authorize();
        // await this.wx_token();
      }
    }
    // await this.getLocalDataSource();

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