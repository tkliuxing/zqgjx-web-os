<template>
  <div class="pc-box">
    <div class="index">
      <background :background="background" :color="color"></background>
      <!-- 题目 -->
      <wj-item
        v-if="isQuest"
        :ktitem="tikuList"
        @submit="submit"
        :color="color"
        @back="back"
      ></wj-item>
      <!-- 结果 -->
      <re-sult
        v-if="isResult"
        :dtInfo="dtInfo"
        :showresult="shijuaninfo.show_result"
        :color="color"
      ></re-sult>
      <!-- 答题首页 -->
      <div class="index-info" v-if="!isAnswer">
        <div class="title" v-if="!background">{{ shijuaninfo.name }}</div>
        <div class="title-desc" v-if="!background">{{ shijuaninfo.desc }}</div>
        <div class="btn-box">
          <div class="btn-list">
            <button :style="{ background: color }" @click="startTab">
              问卷开始
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import resource from "@/resource.js";
import WjItem from "./components/WjItem";
import ReSult from "./components/ReSult";
import Background from "./components/Background";
import { mapState } from "vuex";
import moment from "moment";

export default {
  name: "index",
  components: {
    WjItem,
    ReSult,
    Background,
  },
  data() {
    return {
      isAnswer: false,
      isQuest: false,
      isResult: false,
      message: "",
      questFroms: [],
      dati_id: null,
      dtInfo: {},
      background: null,
      sjState: null,
      color: "#e41e1e",
      shijuan_id: null,
      shijuaninfo: {},
      tikuList: [],
      starTime: null,
    };
  },
  async created() {
    if (this.$route.query.pk) {
      this.shijuan_id = this.$route.query.pk;
      await this.getSjInfo();
    }
    if (this.shijuaninfo.need_login == "是") {
      if (!this.token) {
        this.$router.push({
          path: "/log",
        });
      }
    }
  },
  computed: {
    ...mapState(["token", "userinfo"]),
  },
  methods: {
    // 获取试卷信息
    async getSjInfo() {
      let params = {
        biz_id: this.$bizCode.wenjuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT138890411468054528",
      };
      const res = await resource.getObj("data", this.shijuan_id, params);
      this.background = res.background;
      this.color = res.color;
      this.shijuaninfo = res;
    },
    // 获取题目
    async getTkList() {
      let data = {
        biz_id: this.$bizCode.shijuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT138911001835397120",
        shijuan_id: this.shijuan_id,
      };
      const res = await resource.getList("data", data);
      console.log(res)
      this.tikuList = res;
    },
    // 开始答题
    async startTab() {
      if (this.shijuaninfo.start_time) {
        let start_time = moment(this.shijuaninfo.start_time);
        if (moment().isBefore(start_time)) {
          this.$toast("试卷未开启");
          return;
        }
      }
      if (this.shijuaninfo.end_time) {
        let end_time = moment(this.shijuaninfo.end_time);
        if (moment().isAfter(end_time)) {
          this.$toast("试卷已过期");
          return;
        }
      }
      await this.getTkList();
      this.isAnswer = true;
      this.isQuest = true;
      this.starTime = new moment();
    },
    // 返回
    back() {
      this.isAnswer = false;
      this.isQuest = false;
    },

    recordTab() {
      this.$router.replace({
        path: "/ksrecord",
        query: {
          id: this.sjId,
        },
      });
    },

    rankTab() {
      this.$router.replace({
        path: "/ksrank",
        query: {
          id: this.sjId,
        },
      });
    },
    // 获取试卷Id/提交答案
    async submit(questFroms) {
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
        duration: 0,
      });
      // 获取答题ID
      const data = {
        org_id: this.shijuaninfo.org_id,
        sys_id: this.shijuaninfo.sys_id,
        shijuan_id: this.shijuan_id,
        biz_id: this.$bizCode.wenjuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT138522014027272192",
        user_id: this.userinfo.pk,
        user_name: this.userinfo.full_name,
        department_name: this.userinfo.department_name,
        duration: this.transDuration(this.getDuration()),
      };
      // 提交答题
      const resp = await resource.createObj("data", data);
      this.dtInfo = resp;
      for (let i = 0; i < questFroms.length; i++) {
        questFroms[i].shijuan_id = this.shijuan_id;
        questFroms[i].dati_id = resp.pk;
        questFroms[i].org_id = this.shijuaninfo.org_id;
        questFroms[i].sys_id = this.shijuaninfo.sys_id;
        questFroms[i].biz_id = this.$bizCode.wenjuan_biz;
        questFroms[i].src_id = this.$sourceCode.source_id;
        questFroms[i].template_id = "FT138488002023051264";
        questFroms[i].result = JSON.stringify(questFroms[i].result);
      }
      console.log(questFroms,22)
      await resource.createObj("data", questFroms);
      // 关闭loading
      this.$toast.clear();
      this.isQuest = false;
      this.isResult = true;
    },
    // 用时
    getDuration() {
      let tt = 0;
      if (this.starTime) {
        let st = this.starTime;
        let et = new Date();
        let time = et - st;
        tt = parseInt(time / 1000);
      }
      return tt;
    },

    transDuration(duration) {
      let du = moment.duration(duration, 'seconds');
      return `${du.hours()}小时${du.minutes()}分${du.seconds()}秒`
    },


  },
};
</script>

<style scoped>
.pc-box {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
}
.index {
  position: relative;
  padding: 60px 20px 40px;
}
.btn-box {
  position: fixed;
  bottom: 120px;
  left: 0;
  text-align: center;
  width: 100%;
}
.btn-box button {
  display: inline-block;
  line-height: 44px;
  padding: 0 60px;
  font-size: 16px;
  border-radius: 200px 200px;
  background: none;
  color: #fff;
  border: none;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
}
.btn-list {
  margin: 20px 0;
}

.index-info {
  padding: 20% 0 15%;
  position: relative;
  z-index: 9;
}
.title {
  line-height: 1.8;
  text-align: center;
  font-size: 20px;
  color: #fff;
}
.title-desc {
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.5;
  color: #fff;
  text-align: center;
  padding: 0 20px;
}
.wjtips {
  text-align: center;
  color: #666;
  font-size: 16px;
}
</style>
