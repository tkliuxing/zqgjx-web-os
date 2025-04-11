<template>
  <el-card style="position:relative">
    <div slot="header" class="clearfix">
      <span>单位列表</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="jilv">来访记录</el-button>
    </div>
    <div v-if="open_id">
      <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="margin-bottom: 5%"
          @input="filterNode"
          clearable
      >
      </el-input>

      <el-card shadow="always" v-for="item in data" style="height: 55px">
        <div>
          <span>{{ item.name }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="shenqing(item)">来访申请</el-button>
        </div>

      </el-card>

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

import resource from "@/mobile/resource";
import moment from "moment";
import {LOGIN, LOGOUT, USERINFO} from "@/mobile/mobile.store";
import {Row,  Col,Button, Result,Message} from 'element-ui';
Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Result);
Vue.use(Message);

export default {
  name: "",
  data() {
    return {
      open_id: null,
      data: [],
      data_old: [],
      filterText: '',
      code: null,
      uri: window.location.href,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
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
        Message.success("微信授权失败，请重试！！！")
      }
      // this.open_id = 'o21hvuK_LiWecht58-23RWJgFDEAs';
    },
    async jilv() {
      this.$router.push({name: 'sf_shen_he_list', query: {open_id: this.open_id}});
    },
    async shenqing(data) {
      this.$router.push({name: 'sf_shen_qing', query: {pk: data.org_id, open_id: this.open_id}});
    },
    async loadData() {
      let params = {
        org_id: null,
        sys_id: 1,
      }
      let res = await resource.getList("systemorg", params);
      if (res.length > 0) {
        this.data = res;
        this.data_old = JSON.parse(JSON.stringify(res));
      }
    },
    filterNode() {
      if (this.filterText) {
        let option = this.data_old.filter((item) => {
          return item["name"].indexOf(this.filterText) > -1;
        });
        this.data = JSON.parse(JSON.stringify(option));
      } else {
        this.data = JSON.parse(JSON.stringify(this.data_old));
      }
    },
    listToTree(data) {
      // * 先生成parent建立父子关系
      const obj = {};
      data.forEach((item) => {
        obj[item.pk] = item;
      });
      const parentList = [];
      data.forEach((item) => {
        const parent = obj[item.parent];
        if (parent) {
          // * 当前项有父节点
          parent.children = parent.children || [];
          parent.children.push(item);
        } else {
          // * 当前项没有父节点 -> 顶层
          parentList.push(item);
        }
      });
      return parentList;
    },
  },
  async created() {
    this.open_id = this.$route.query.open_id;
    if (!this.open_id) {
      this.open_id = await localStorage.getItem("open_id");
    }
    this.uri = window.location.href;
    this.code = this.$route.query.code;
    if (!this.open_id) {
      if (this.code) {
        await this.wx_authorize();
      } else {
        // await this.wx_authorize();
        await this.wx_token();
      }
    }

    // await this.getLocalDataSource();
    await this.loadData();

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