<template>
  <el-card style="position:relative">
    <div slot="header" class="clearfix">
      <span>拜访记录详情</span>
    </div>
    <div v-if="pk">
      <div v-if="open_id">
        <el-descriptions title="" :column="1" size="medium" :colon="false">
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              受访单位：
            </template>
            {{ get_sys_org_data_display(form.org_id) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              受访人：
            </template>
            {{ form.sf_name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-chat-line-square"></i>
              拜访事由：
            </template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
            </template>
            {{ form.lf_sy }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              申请时间：
            </template>
            {{ form.create_time }}
          </el-descriptions-item>
          <el-descriptions-item v-if="form.mg_name">
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              入门时间：
            </template>
            {{ form.mg_time }}
          </el-descriptions-item>
          <el-descriptions-item v-if="form.status === '同意'">
            <template slot="label">
              <i class="el-icon-cpu"></i>
              二维码：
            </template>

          </el-descriptions-item>
          <el-descriptions-item v-if="form.status === '同意'" :colon="false">
            <template slot="label">
            </template>
            <div style="width: 300px;" v-if="creatQrCode(form)">
               <qr-canvas :text="creatQrCode(form)" width="250px" height="250px" v-if="creatQrCode(form)"></qr-canvas>
            </div>
            <div v-else style="color: #910202">审核后查看二维码</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-else>
        <el-row v-if="code">
          <el-col :sm="12" :lg="6">
            <el-result icon="warning" title="提示" subTitle="微信授权失败，请重新授权！">
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

import resource from "@/resource";
import moment from "moment";
import store, {LOGIN, LOGOUT, USERINFO} from "@/store";
import QrCanvas from "@/components/common/QrCanvas.vue";
import { APP_ID } from "./constvars";
// import QrCode from "@/components/common/QrCode";
// import QrCodedown from "@/components/common/QrCodedown";

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
      pk: null,
      org_id: null,
      open_id: null,
      user_id_option_data: null,
      sys_org_data: [],
      code: null,
      uri: window.location.href,
    }
  },
  methods: {
    async wx_token() {
      let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APP_ID + "&redirect_uri=" + this.uri + "&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
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
        await localStorage.setItem("open_id", res.open_id);
      } catch (err) {
        console.log("微信openid---", err.response.data.non_field_errors);
        this.$message.success("微信授权失败，请重试！！！")
      }
    },
    async loadData() {
      this.loading = true;
      let params = {
        sys_id: 1,
        template_id: TEMPLATE_ID
      };
      let res = await resource.getObj("data", this.pk, params);
      let data = res;
      if (data) {
        data.create_time = moment(data.create_time).format("YYYY-MM-DD HH:mm:ss");
        this.org_id = data.org_id;
      }
      this.form = data;
      this.loading = false;
    },
    async getLocalDataSource() {
      let res1 = await resource.getList("systemorg", {
        "sys_id": 1
      });
      this.sys_org_data = res1;
    },
    get_user_id_option_data_display(value) {
      let option = this.user_id_option_data.filter((item) => {
        return item["pk"] === value;
      });
      if (option.length > 0) return option[0]["wechart_oid"];
      return value;
    },
    get_sys_org_data_display(value) {
      let option = this.sys_org_data.filter((item) => {
        return item["org_id"] === value;
      });
      if (option.length > 0) return option[0]["name"];
      return value;
    },
    // 二维码生成
    creatQrCode(data) {
      if (data.status === "同意") {
        let uri = window.location.origin + "/sf_mg?pk=" + data.pk;
        return uri;
      }
      return "";

    },
  },
  async created() {
    this.pk = this.$route.query.pk;
    this.open_id = this.$route.query.open_id;
    this.uri = window.location.href;
    this.code = this.$route.query.code;
    if (!this.open_id) {
      this.open_id = await localStorage.getItem("open_id");
    }
    if (this.pk) {
      if (!this.open_id) {
        if (this.code) {
          await this.wx_authorize();
        } else {
          await this.wx_token();
        }
      }
      await this.loadData();
      await this.getLocalDataSource();
    }
  },
  computed: {},
  components: {
    QrCanvas,
    // QrCode,
    // QrCodedown
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