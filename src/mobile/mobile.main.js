import Vue from 'vue';
import axios from "axios";
import App from './mobile.vue';
import router from './mobile.router';
import VueAxios from "vue-axios";
import store from "./mobile.store";
import './mobile.vant.js';
import 'vant/lib/index.css';
import moment from "moment";
import { BASE_HOST } from "./mobile.constvars";
import { BIZ_CODE, SOURCE_CODE } from "./mobile.requestCode"
Vue.prototype.moment = moment;
import "element-ui/lib/theme-chalk/index.css"; // 默认主题
import VueAMap from "vue-amap";
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "0627c9b1098e23989f137cafc5b6458e",
  plugin: ["Autocomplete", "PlaceSearch", "Scale", "OverView", "ToolBar"],
  v: "1.4.15",
});
let app = null;
Vue.prototype.$bizCode = BIZ_CODE;
Vue.prototype.$sourceCode = SOURCE_CODE;
Vue.config.productionTip = false;
Vue.prototype.BASE_HOST = BASE_HOST;
axios.defaults.baseURL = `${BASE_HOST}/api/v1`;
axios.interceptors.request.use(
  config => {
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
    if(config.url == '/systemorg/'){
      delete  config.params.org_id
    }
    // 用来过滤flatbasetree的请求,,改为统一用org_id为1的数据(也就是政企的数据)
    // if(config.url == '/flatbasetree/'){
    //   if(config.params && config.params.org_id != 1){
    //     config.params.org_id = 1;
    //   }
    // }
    // 用来过滤group的请求 这个接口不需要org_id
    if(config.url == '/group/'){
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
// axios.interceptors.response.use(
//   async response => {
//     return response;
//   },
//   error => {
//     if(error.response.status === 401){
//       app.$store.commit('LOGOUT');
//       router.replace({name: 'log'});
//     }
//     return Promise.reject(error);
//   }
// );

Vue.use(VueAxios, axios);
app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

