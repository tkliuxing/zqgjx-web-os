<template>
  <div>
    <div class="xunjian-info">
      <div class="img-box"><img :src="info.photo" alt="" /></div>
      <div class="content">{{ info.desc }}</div>
    </div>
    <div class="xunjian-table">
      <div class="title-item">设备参数</div>
      <div class="list">
        <ul>
          <li>
            <div class="fl">设备编号</div>
            <div class="fr">{{ info.sn }}</div>
          </li>
          <li>
            <div class="fl">类别</div>
            <div class="fr">{{ info.category }}</div>
          </li>
        </ul>
      </div>
    </div>
    <template>
      <div class="xunjian-table" v-if="peizhiList.length>0">
        <div class="title-item">巡检项目</div>
        <div class="list">
          <ul>
            <li v-for="(item, index) in peizhiList" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
      <div class="xunjian-table">
        <div class="title-item">巡检填报</div>
        <div class="list">
          <van-form @submit="submitTab">
            <van-field name="switch" label="是否异常">
              <template #input>
                <van-switch
                  v-model="yichang"
                  size="20"
                  active-color="#ee0a24"
                  inactive-color="#1a8afb"
                />
              </template>
            </van-field>
            <van-field
              v-if="yichang === true"
              type="textarea"
              v-model="shuoming"
              label="异常原因"
              placeholder="请填写异常原因"
              :rules="[{ required: true, message: '请填写异常原因' }]"
            />
            <div style="margin: 20px" v-if="info.is_enabled === '否'">
              <van-button round block disabled type="info" v-if="isState"
                >巡查暂未开启</van-button
              >
            </div>
            <div style="margin: 20px" v-else>
              <van-button
                v-if="!isSubmit"
                round
                block
                type="info"
                native-type="submit"
                >提交</van-button
              >
              <van-button v-else round block type="info" disabled
                >已巡检</van-button
              >
            </div>
          </van-form>
        </div>
      </div>
      <div class="success" v-if="isSuccess">
        <div class="success-icon">
          <img src="@/mobile/assets/img/success.jpg" alt="" />
        </div>
        <div class="success-text">提交成功</div>
      </div>
    </template>
  </div>
</template>

<script>
import resource from "@/mobile/resource.js";
import { BASE_HOST } from "@/mobile/mobile.constvars";
import { mapState } from "vuex";
// import moment from "moment";
import axios from "axios";
import Vue from "vue";
import {
  Form,
  Field,
  Button,
  RadioGroup,
  Radio,
  Toast,
  Picker,
  Popup,
  Switch,
} from "vant";
import "vant/lib/index.css";
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Toast);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Switch);
export default {
  data() {
    return {
      id: null,
      renwu_id: null,
      info: '',
      yichang: false,
      pzlist: [],
      shuoming: "",
      isSuccess: false,
      isSubmit: false,
      isState: false,
      peizhiList: [],
      userinfo:null
    };
  },
  async created() {
    this.id = this.$route.query.pk;
    if (this.id) {
      await this.getInfo();
      await this.getUserinfo();
      await this.typeJudge();
    }
  },
  computed:{
    ...mapState(['org_id'])
  },
  methods: {
    // 获取个人信息
    async getUserinfo() {
      try {
        let res = await resource.getList("myinfo");
        console.log(res);
        console.log(this.info);
        this.userinfo = res;
        if (res.org_id != this.info.org_id) {
          Toast("登录的账号与该机构不一致,请重新登录");
          this.$router.push({
            path: "/log",
          });
          let localStorageData = localStorage.getItem('vuex');
          console.log(localStorageData)
          if(localStorageData){
            localStorage.removeItem('vuex');
            // localStorage.clear();
          }
        }
      } catch {
        this.$router.push({
          path: "/log",
        });
      }
    },
    // 获取巡检项目
    async getInfo() {
      const axios = require('axios');
      const requestData = {
        template_id: "FT6628950761472",
      };
      const instance = axios.create({
        maxRedirects: 0, // 禁用重定向
      });
      instance.get(`${BASE_HOST}/api/v1/data/${this.id}`, {
        params: requestData,
      })
        .then(response => {
          // 处理响应数据
          this.info = response.data;
          this.renwu_id = response.data.renwu_id;
          this.peizhiList = JSON.parse(response.data.json);
          document.title = response.data.name
        })
        .catch(error => {
          // 处理请求错误
          console.error(error);
        });
      // let data = {
      //   biz_id: this.$bizCode.xunjian_biz,
      //   src_id: this.$sourceCode.source_id,
      //   // org_id: this.org_id,
      //   template_id: "FT6628950761472",
      // };
      // console.log(data,'2')
      // let resp = null;
      // resp = await resource.getObj("data", this.id, data);
      // console.log(resp,'12')
      // this.info = resp;
      // this.renwu_id = resp.renwu_id;
      // this.peizhiList = JSON.parse(resp.json);
      // document.title = resp.name;
    },
    // 触发提交
    submitTab() {
      Toast.loading({
        message: "正在提交...",
        forbidClick: true,
        duration: 0,
      });
      if (this.info.lng === 0 && this.info.lat === 0) {
        this.onSubmit();
      } else {
        this.getPosition();
      }
    },
    // 提交结果
    async onSubmit() {
      if (this.yichang == true) {
        this.yichang = "是";
      } else {
        this.yichang = "否";
      }
      const form = {
        biz_id:this.info.biz_id,
        src_id:this.info.src_id,
        renwu_id:this.info.renwu_id,
        xiangmu_id: this.info.pk,
        yichang: this.yichang,
        shuoming: this.shuoming,
        user: this.userinfo.pk,
        user_full_name:this.userinfo.full_name,
        xunjiantime: this.moment().format("YYYY-MM-DD HH:mm:ss"),
        template_id:"FT6632213925888"
      };
      await resource.createObj("data", form);
      Toast("提交成功");
      this.isSuccess = true;
    },
    // 判断巡检位置范围
    getPosition() {
      let that = this;
      AMap.plugin("AMap.Geolocation", function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "RB",
        });
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);
        function onComplete(data) {
          // data是具体的定位信息
          let juli = that.getGreatCircleDistance(
            that.info.lat,
            that.info.lng,
            data.position.lat,
            data.position.lng
          );
          if (juli < 200) {
            that.onSubmit();
          } else {
            Toast("请在巡查范围内提交");
          }
        }
        function onError(data) {
          // 定位出错
        }
      });
    },

    getGreatCircleDistance(lat1, lng1, lat2, lng2) {
      var EARTH_RADIUS = 6378137.0;
      var PI = Math.PI;

      function getRad(d) {
        return (d * PI) / 180.0;
      }
      var radLat1 = getRad(lat1);
      var radLat2 = getRad(lat2);

      var a = radLat1 - radLat2;
      var b = getRad(lng1) - getRad(lng2);

      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000.0;

      return s; // 米
    },

    typeJudge() {
      switch (this.info.zhouqi) {
        case "年":
          this.returNianTime();
          break;
        case "季":
          this.returnJiduTime();
          break;
        case "月":
          this.returnYuduTime();
          break;
        case "周":
          this.returnZhouTime();
          break;
        case "日":
          this.returnDayTime();
          break;
        case "小时":
          this.returnHourTime();
          break;
        default:
          break;
      }
    },
    // 返回年
    returNianTime() {
      let year = this.moment().year();
      let after = year + "-01-01";
      let before = year + "-12-31";
      this.getState(before, after);
      return;
    },
    // 返回季度时间
    returnJiduTime() {
      let jidu = this.moment().quarter();
      let year = this.moment().year();
      let after = "";
      let before = "";
      switch (jidu) {
        case 1:
          after = year + "-01-01";
          before = year + "-03-31";
          break;
        case 2:
          after = year + "-04-01";
          before = year + "-06-30";
          break;
        case 3:
          after = year + "-07-01";
          before = year + "-09-30";
          break;
        case 4:
          after = year + "-10-01";
          before = year + "-12-31";
          break;
      }
      this.getState(before, after);
      return;
    },
    // 返回月度时间
    returnYuduTime() {
      let after = this.moment().date(1).format("YYYY-MM-DD");
      let before = this.moment()
        .date(1)
        .add(1, "month")
        .subtract(1, "days")
        .format("YYYY-MM-DD");
      this.getState(before, after);
      return;
    },
    // 返回周时间
    returnZhouTime() {
      let after = this.moment().isoWeekday(1).format("YYYY-MM-DD");
      let before = this.moment().isoWeekday(7).format("YYYY-MM-DD");
      this.getState(before, after);
      return;
    },
    // 返回日时间
    returnDayTime() {
      let after = this.moment().format("YYYY-MM-DD");
      let before = this.moment().format("YYYY-MM-DD");
      this.getState(before, after);
      return;
    },
    // 返回小时
    returnHourTime() {
      let after = this.moment().format("YYYY-MM-DD HH:00:00");
      let before = this.moment().format("YYYY-MM-DD HH:59:59");
      this.getState(before, after);
      return;
    },
    // 查询是否填写
    async getState(before, after, count = 1) {
      count = count - 1;
      let data = {
        user: this.userinfo.pk,
        xiangmu_id: this.info.pk,
        biz_id:this.info.biz_id,
        src_id:this.info.src_id,
        xunjiantime_before: before,
        xunjiantime_after: after,
        template_id:"FT6632213925888"
      };
      let resp = await resource.getList("data", data);
      if (resp.length > count) {
        this.isSubmit = true;
        return;
      }
    },

  },
};
</script>

<style scoped>
.xunjian-info {
  padding:10px;
}
.title {
  text-align: center;
  padding: 10px 0;
  line-height: 44px;
  font-size: 18px;
}
.img-box {
  text-align: center;
}
.xunjian-info img {
  max-width: 100%;
  display: inline-block;
}
.content {
  line-height: 1.8;
  font-size: 14px;
  color: #666;
  padding:0;
}
.xunjian-table {
  padding: 10px;
}
.title-item {
  line-height: 40px;
  color:#333;
  text-align:center;
}
.xunjian-table .list {
  border: 1px solid #ebedf0;
}
.xunjian-table .list li {
  padding: 0 10px;
  line-height: 44px;
  display: flex;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #ebedf0;
}
.xunjian-table .list li:last-child {
  border: none;
}
.xunjian-table .list li .fl {
  width: 80px;
  float: left;
  padding: 0 10px;
  border-right: 1px solid #ebedf0;
}
.xunjian-table .list li .fr {
  flex: 1;
  color: #666;
  padding: 0 10px;
}
.success {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  padding: 60px 40px;
  text-align: center;
}
.success .success-icon {
  display: inline-block;
  width: 60px;
  height: 60px;
}
.success .success-icon img {
  width: 60px;
  height: 60px;
}
.success-text {
  text-align: center;
  font-size: 16px;
  color: #333;
  margin-top: 20px;
}
</style>
