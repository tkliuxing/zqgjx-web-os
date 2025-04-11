// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import VueAxios from "vue-axios";
import store from "./store";
import dayjs from "dayjs";//档案管理
import lodash from 'lodash';
// 引入vant
import '@/utils/vant/index.js';
import { BIZ_CODE, SOURCE_CODE } from "./requestCode"
import "element-ui/lib/theme-chalk/index.css"; // 默认主题
// import "./assets/css/theme-green/index.css"; // 浅绿色主题
import "./assets/css/icon.css";
import "./assets/css/cg_css.css";
import "./components/utils/directives";
import EventBus from "./components/utils/bus.js";
import "babel-polyfill";
import "echarts";
import Print from "@/utils/print";
Vue.use(Print);
import VueAMap from "vue-amap";
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "0627c9b1098e23989f137cafc5b6458e",
  plugin: ["Autocomplete", "PlaceSearch", "Scale", "OverView", "ToolBar"],
  v: "1.4.15",
});
import { BASE_HOST,TMPL_ID } from "./constvars";
Vue.prototype._ = lodash; // 全局注册lodash
Vue.prototype.$dayjs = dayjs;//档案管理
Vue.prototype.$bus = EventBus;
Vue.prototype.$bizCode = BIZ_CODE;
Vue.prototype.$sourceCode = SOURCE_CODE;
Vue.config.productionTip = false;
import moment from "moment";
Vue.prototype.moment = moment;
Vue.prototype.BASE_HOST = BASE_HOST;
Vue.prototype.TMPL_ID = TMPL_ID;
axios.defaults.baseURL = `${BASE_HOST}/api/v1`;

// axios.defaults.baseURL = 'http://192.168.0.112:8000/api/v1';
axios.interceptors.request.use(
  (config) => {
    if (config.method === "get") {
      config["params"] = {
        sys_id: store.state.sys_id,
        org_id: store.state.org_id,
        ...(config.params || null),
      };
    } else {
      if (Object.prototype.toString.call(config["data"]) == '[object Array]') {
        config["data"].forEach(item => {
          item['sys_id'] = store.state.sys_id,
          item['org_id'] = item['org_id']?item['org_id']:store.state.org_id
        });
      } else if (Object.prototype.toString.call(config["data"]) == '[object Object]') {
        config["data"] = {
          sys_id: store.state.sys_id,
          org_id: store.state.org_id,
          ...(config.data || null),
        };
      }
    }
    // 用来过滤formtemplate的请求
    if(config.url == '/systemorg/' && !config.params.is_org_id){
      delete  config.params.org_id
    }
    // 用来过滤formtemplate的请求
    // 包含formtemplate的请求不需要org_id
    if (config.url.indexOf('formtemplate') !== -1) {
      // 删除org_id
      delete  config.params.org_id
    }
    if (store.state.token) {
      config.headers.Authorization = `Bearer ${store.state.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const requests = axios;
Vue.use(VueAxios, axios);
Vue.use(ElementUI, {
  size: "small",
});
let app = null;
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 政企工具箱`;
  let token = "";
  if (app) {
    // console.log(app.$store.state.userinfo);
    token = app.$store.state.token;
  }
  if (
    !token &&
    to.path !== "/login" &&
    to.path !== "/log" &&
    to.path !== "/registerSuccess" &&
    to.path !== "/404" &&
    to.path !== "/articleinfo" &&
    to.path !== "/cepinginfo" &&
    to.path !== "/duohangtianbaoinfo" &&
    to.path !== "/exceltianbao" &&
    to.path !== "/tianbaoinfo" &&
    to.path !== "/xunjianinfo" &&
    to.path !== "/zichaninfo" &&
    to.path !== "/tabletianbao" &&
    to.path !== "/additem" &&
    to.path !== "/wplogin" &&
    to.path !== "/targetlink" &&
    to.path !== "/wpmobilecode"&&
    to.path !== "/shijuaninfo"&&
    to.path !== "/wenjuaninfo"&&
    to.path !== "/wx_bd"&&
    to.path !== "/sf_shen_qing"&&
    to.path !== "/sf_shen_he"&&
    to.path !== "/sf_shen_he_list"&&
    to.path !== "/sf_shen_he_list_view"&&
    to.path !== "/pandianLogin"&&
    to.path !== "/sf_mg"&&
    to.path !== "/renwuinfo"&&
    to.path !== "/shoujiinof"&&
    to.path !== "/h5qianming"&&
    to.path !== "/tianbaoshuoming"&&
    to.path !== "/sf_dep"&&
    to.path !== "/gdzc"
  ) {
    next("/login");
  } else {
    next();
  }
});

app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
