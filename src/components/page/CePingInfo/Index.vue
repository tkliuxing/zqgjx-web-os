<template>
  <div class="index" v-if="cpInfo">
    <background :background="background" :color="color"></background>
    <cp-item
      v-if="isState"
      :cpInfo="cpInfo"
      @submit="submit"
      :color="color"
    ></cp-item>
    <re-sult v-if="isResult" :color="color"></re-sult>
    <div class="cp-info" v-if="!isState">
      <template v-if="!background">
        <div class="title">{{ cpInfo.name }}</div>
        <div class="title-desc">{{ cpInfo.desc }}</div>
      </template>
      <div class="btn-box">
        <div class="btn-list" v-if="isState || isEnd">
          <button v-if="isState" :style="{ background: color }">
            暂未开始
          </button>
          <button v-if="isEnd" :style="{ background: color }">
            测评已结束
          </button>
        </div>
        <div class="btn-list" v-else>
          <button @click="start()" :style="{ background: color }">
            开始测评
          </button>
        </div>
      </div>
    </div>
    <div class="success" v-if="isMaxnum">
      <div class="success-icon">
        <img src="@/assets/img/success.jpg" alt="" />
      </div>
      <div class="success-text">测评数量已到上限</div>
    </div>
  </div>
</template>

<script>
import resource from "@/resource.js";
import Background from "./Background";
import CpItem from "./CpItem";
import ReSult from "./ReSult.vue";
import Vue from "vue";
import { Toast } from "vant";
import "vant/lib/index.css";
Vue.use(Toast);

export default {
  data() {
    return {
      background: null,
      pk: null,
      cpInfo: null,
      isResult: false,
      isState: false,
      isEnd: false,
      color: "#e41e1e",
      isMaxnum: false,
      is_enabled:null,
    };
  },
  components: {
    Background,
    CpItem,
    ReSult,
  },
  async created() {
    this.$store.commit("resetState");
    this.pk = this.$route.query.pk;
    if (this.pk) {
      this.getInfo();
    }
  },
  methods: {

    async getInfo() {
      let params = {
        biz_id: this.$bizCode.ceping_biz,
        source_id: this.$sourceCode.source_id,
        template_id: "FT6372255133696"
      };
      let resp = await resource.getObj("data", this.pk, params);
      this.is_enabled = resp.is_enabled;
      this.getTime(resp.start_time, resp.end_time);
      document.title = resp.name;
      this.background = resp.background;
      this.color = resp.color || "#e41e1e";
      this.cpInfo = resp;
      if (resp.qr_total > resp.qr_used || resp.qr_total === 0) {
        return;
      } else {
        Toast("测评数量已到上限");
        this.isMaxnum = true;
      }
    },

    async submit(cpFroms) {
      Toast.loading({
        message: "正在提交...",
        forbidClick: true,
        duration: 0,
      });
      let params = {
        biz_id: this.$bizCode.ceping_biz_id,
        source_id: this.$sourceCode.source_id,
        template_id: "FT6372255133696"
      };
      let resp = await resource.getObj("data", this.pk, params);
      if (resp.qr_total > resp.qr_used || resp.qr_total === 0) {
        let arrForm = [];
        for (let i = 0; i < cpFroms.length; i++) {
          let fen = 0;
          for (let j = 1; j < this.cpInfo.xiangmu_length + 1; j++) {
            fen += cpFroms[i][this.getDefen(j)];
          }
          cpFroms[i].zongfen = fen;
          cpFroms[i].org_id = this.cpInfo.org_id;
          cpFroms[i].sys_id = this.cpInfo.sys_id;
          let arrItem = cpFroms[i];
          arrForm.push(arrItem);
        }
        await resource.createObj("data", arrForm);
        resp.qr_used++;
        await resource.updateObj("data", this.pk,resp);
        // console.log(this.pk)
        Toast("提交成功");
        this.isResult = true;
      } else {
        Toast("测评数量已到上限");
      }
    },

    async start() {
      if(this.is_enabled=='否'){
        return Toast("测评已停用!");
      }
      if (this.cpInfo.beipingren==null){
        return Toast("未上传被评价对象!");
      }
      this.getInfo();
      this.isState = true;
    },

    getDefen(num) {
      let fen = "defen_" + this.getNumber(num);
      return fen;
    },

    getNumber(num) {
      var len = num.toString().length;
      while (len < 2) {
        num = "0" + num;
        len++;
      }
      return num;
    },

    getTime(stime, etime) {
      let s = new Date(stime); //开始时间
      let e = new Date(etime); //结束时间
      let n = new Date(); //当前时间
      if (n.valueOf() < s.valueOf()) {
        this.isState = true;
      }
      if (n.valueOf() > e.valueOf()) {
        this.isEnd = true;
      }
    },

  },
};
</script>

<style scoped>
.index {
  position: relative;
  padding: 20px;
}
.btn-box {
  position: fixed;
  bottom: 180px;
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
.cp-info {
  position: relative;
  z-index: 9;
}
.title {
  line-height: 1.8;
  text-align: center;
  font-size: 20px;
  color: #fff;
  margin-top: 40px;
}
.title-desc {
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.5;
  color: #fff;
  text-align: center;
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
  z-index: 9;
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
