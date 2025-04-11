<template>
  <div class="article">
    <div class="title">{{ articleInfo.title }}</div>
    <div class="time">
      <i class="el-icon-time"></i>发布时间：{{
        moment(articleInfo.create_time).format("YYYY-MM-DD HH:mm:ss")
      }}
    </div>
    <div class="content" v-html="articleInfo.content"></div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
import resource from "@/resource.js";
import "vant/lib/index.css";
import moment from "moment";
Vue.use(Toast);
export default {
  computed: {
    moment() {
      return moment
    }
  },
  data() {
    return {
      pk: null,
      articleInfo: "",
    };
  },
  created() {
    this.pk = this.$route.query.pk;
    if (this.pk) {
      this.getInfo();
    }
  },
  methods: {
    async getInfo() {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        let resp = await resource.getObj("article", this.pk);
        this.articleInfo = resp;
        document.title = this.articleInfo.title;
        Toast.clear();
      } catch {
        console.log("出现错误")
      }
    },
  },
};
</script>

<style scoped>
.article {
  padding: 20px;
}
.title {
  font-size: 22px;
  line-height: 1.6;
  padding: 5px 0;
  font-weight: bold;
}
.time {
  color: #999;
  font-size: 12px;
}
.time i {
  margin-right: 3px;
}
.content {
  margin-top: 20px;
  padding: 0;
  color: #333;
  line-height: 1.6;
}
</style>
