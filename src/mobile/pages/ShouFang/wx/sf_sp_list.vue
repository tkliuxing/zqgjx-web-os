<template>
  <el-card style="position:relative">
    <div slot="header" class="clearfix">
      <span>拜访记录</span>
    </div>
    <div v-if="open_id">
      <div v-if="data.length>0">
        <el-card class="box-card" v-for="item in data" style="margin: 10px 0">
          <div @click="jilu(item)">
            <el-row>
              <el-col :span="16">
                <el-descriptions title="" :column="1" size="mini">
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-office-building"></i>
                      受访单位
                    </template>
                    {{ get_sys_org_data_display(item.org_id) }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-user"></i>
                      受访人
                    </template>
                    {{ item.sf_name }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-mobile-phone"></i>
                      拜访时间
                    </template>
                    {{ item.create_time }}
                  </el-descriptions-item>
                  <!--          <el-descriptions-item>
                              <template slot="label">
                                <i class="el-icon-tickets"></i>
                                二维码
                              </template>
                              <div style="text-align: center;width: 300px;" v-if="creatQrCode(item)">

                                <qr-code :url="creatQrCode(item)" ref="qrCodeUrl"></qr-code>
                              </div>
                              <div v-else style="color: #910202">审核后查看二维码</div>
                            </el-descriptions-item>-->
                </el-descriptions>
              </el-col>
              <el-col :span="8">
                <el-row style="text-align: center;margin-top: 20%">
                  <el-col :span="22" style="text-align: right">
                    <el-tag size="small">{{ item.status }}</el-tag>
                  </el-col>
                  <el-col :span="2">
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
      <div v-else>
        <el-row>
          <el-col :sm="12" :lg="6">
            <el-result icon="info" title="信息提示" subTitle="您还没有拜访记录!">
              <template slot="extra">
                <!--                <el-button type="primary" size="medium" @click="wx_authorize()">重新授权</el-button>-->
              </template>
            </el-result>
          </el-col>
        </el-row>
      </div>
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
// mg_name:门岗扫码
// mg_time:门岗扫码时间
// id_number:身份证
// heat:体温
// img_jkm:健康码
// img_xcm:行程码
// sh_time:审核时间

// import XLSX from "xlsx";
import resource from "@/mobile/resource";
import moment from "moment";
import {LOGIN, LOGOUT, USERINFO} from "@/mobile/mobile.store";
import QrCode from "@/mobile/components/common/QrCode.vue";
import QrCodedown from "@/mobile/components/common/QrCodedown";
import Vue from 'vue';
import {Button,Row,Col,Result,Descriptions,DescriptionsItem,Card,Message} from 'element-ui';
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Result);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);
Vue.use(Card);
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
        mg_name: null,
        mg_time: null,
        id_number: null,
        heat: null,
        img_jkm: null,
        img_xcm: null,
        sh_time: null,
      },
      searchForm: {
        user_id: null,
        wx_openid: null,
        lf_name: null,
        lf_mobile: null,
        create_time: [],
        mg_name: null,
        mg_time: null,
      },
      user_id_option_data: [],
      status_option_data: [],
      sys_org_data: [],
      data: [],
      loading: false,
      open_id: null,
      url: "",
      code: null,
      uri: window.location.href,
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
        await localStorage.setItem("open_id", res.open_id);
      } catch (err) {
        console.log("微信openid---", err.response.data.non_field_errors);
        Message.success("微信授权失败，请重试！！！" + err.response.data.non_field_errors)
      }
      // this.open_id = 'o21hvuK_LiWecht58-23RWJgFDEA';
    },
    async loadData() {
      this.loading = true;
      let params = {
        template_id: TEMPLATE_ID
      }
      if (this.open_id) {
        params["wx_openid"] = this.open_id
      }
      let res = await resource.getList("data", params);
      if (res.length > 0) {
        let data = res;
        for (let i in data) {
          data[i].user_name = await this.get_user_id_option_data_display(data[i].user_id)
          data[i].mg_names = await this.get_user_id_option_data_display(data[i].mg_name)
          data[i].status_name = await this.get_status_option_data_display(data[i].status)
          data[i].create_time = moment(data[i].create_time).format("YYYY-MM-DD HH:mm:ss");
          if (data[i].mg_time) {
            data[i].mg_time = moment(data[i].mg_time).format("YYYY-MM-DD HH:mm:ss");
          }
        }
      }
      this.data = res;
      this.loading = false;
    },

    get_user_id_option_data_display(value) {
      let option = this.user_id_option_data.filter((item) => {
        return item["pk"] === value;
      });
      if (option.length > 0) return option[0]["full_name"];
      return value;
    },

    get_status_option_data_display(value) {
      let option = this.status_option_data.filter((item) => {
        return item["name"] === value;
      });
      if (option.length > 0) return option[0]["name"];
      return value;
    },

    get_sys_org_data_display(value) {
      let option = this.sys_org_data.filter((item) => {
        return item["org_id"] === value;
      });
      if (option.length > 0) return option[0]["name"];
      return value;
    },

    async getLocalDataSource() {
      let res1 = await resource.getList("systemorg", {
        "sys_id": 1
      });
      this.sys_org_data = res1;

      let res7 = await resource.getObjFromList("basetree", {"name": "申请状态", 'org_id': 0});
      if(res7.items.length> 0){
        this.status_option_data = res7.items;
      }

    },

    // 二维码生成
    creatQrCode(data) {
      if (data.status === "同意") {
        let uri = this.url + "/mobile/sf_mg?pk=" + data.pk;
        return uri;
      }
      return "";

    },
    jilu(data) {
      this.$router.push({name: 'sf_shen_he_list_view', query: {pk: data.pk, open_id: this.open_id}});
    }
  },
  async created() {
    this.uri = window.location.href;
    this.url = window.location.origin;
    this.code = this.$route.query.code;
    this.open_id = this.$route.query.open_id;
    // this.open_id = "o21hvuK_LiWecht58-23RWJgFDEA";
    // this.open_id = "onDmH6LB6-Q8hcOP70d5pvMGuDq0";
    if (!this.open_id) {
      this.open_id = await localStorage.getItem("open_id");
    }
    if (!this.open_id) {
      if (this.code) {
        await this.wx_authorize();
      } else {
        // await this.wx_authorize();
        await this.wx_token();
      }
    }
    await this.loadData()
    await this.getLocalDataSource()
  },
  computed: {},
  components: {
    QrCode,
    QrCodedown,
  },
}
</script>
<style scoped>
.batchClass {
  position: absolute;
  right: 20px;
  bottom: 17px;
}

.margin-top {
  margin-top: 20px;
}
</style>