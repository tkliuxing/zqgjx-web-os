<template>
  <div class="rank">
    <background :background="background" :color="color"></background>
    <div class="rank-title">排行榜</div>
    <div class="rank-info">
      <div class="rank-tab">
        <span style="text-align: center;margin:0 auto">总排名</span>
      </div>
      <div class="rank-list">
        <div class="list-item title">
          <div class="fx-item number">排名</div>
          <div class="fx-item name">姓名</div>
          <div class="fx-item fen">得分</div>
          <div class="fx-item time">用时</div>
        </div>

        <div class="box" v-if="currentIndex === 0">
          <div class="list-item" v-for="(item, index) in dayRank" :key="index">
            <div class="fx-item number">{{ index + 1 }}</div>
            <div class="fx-item name">
              {{ item.user_name || "---" }}
            </div>
            <div class="fx-item fen">{{ item.defen }}</div>
            <div class="fx-item time">{{ item.duration }}</div>
          </div>
        </div>
        <!--这一块是总排名 暂时用不到-->
        <!--        <div class="box" v-if="currentIndex === 1">-->
        <!--          <div class="list-item" v-for="(item, index) in zongRank" :key="index">-->
        <!--            <div class="fx-item number">{{ index + 1 }}</div>-->
        <!--            <div class="fx-item name">-->
        <!--              {{ item.full_name || "-&#45;&#45;"}}-->
        <!--            </div>-->
        <!--            <div class="fx-item fen">{{ item.zongfen }}</div>-->
        <!--            <div class="fx-item time">{{ transDuration(item.duration) }}</div>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
    <div class="btn">
      <button @click="back" :style="{background:color}">返回首页</button>
    </div>
    <!-- 加载 -->
    <!--    <loading></loading>-->
  </div>
</template>

<script>
// import Loading from "@/components/Loading";
import resource from "@/resource.js";
import Background from '../../page/ShiJuanInfo/components/Background.vue';
import moment from "moment";

const TMP_ID_SJ = "FT138149866856067072"; //试卷
export default {
  data() {
    return {
      currentIndex: 0,
      // item: ["当日排名", "总排名"],
      dayRank: [],
      zongRank: [],
      background: null,
      color: null,
      sjInfo: null, //试卷信息
      loading: false,
    };
  },
  components: {
    // Loading,
    Background
  },
  mounted() {
    this.sjInfo = JSON.parse(localStorage.getItem('datiinfo'));
    if(!this.sjInfo){
      this.sjInfo={
        shijuan_id : this.$route.query.id
      }
    }
    this.getSjInfo();
    this.getListinfo();
  },
  methods: {
    itemTab(index) {
      this.currentIndex = index;
    },
    transDuration(duration) {
      if (duration) {
        let du = moment.duration(parseInt(duration), "seconds");
        return `${du.minutes()}分${du.seconds()}秒`;
      }
      return "0";
    },
    async getListinfo() {
      this.loading = true;
      let resp = await resource.getList("reportcomp/101010", {
        shijuan_id: this.sjInfo.shijuan_id,
        pageSize: 100,
      });
      console.log(resp,'resp')
      resp.data.map((item) => {
        resp.header.map((head, ind) => {
          item[head.key] = item[ind]
        })
      })
      this.dayRank = resp.data;
      this.loading = false;
      // 关闭loading
    },
    back() {
      this.$router.replace({
        path: `/shijuaninfo?pk=${this.sjInfo.shijuan_id}`,
      });
    },
    // 获取试卷信息的 背景色和字体颜色
    async getSjInfo() {
      this.loading = true;
      let params = {
        biz_id: this.$bizCode.shijuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_SJ,
      };
      const res = await resource.getObj("data", this.sjInfo.shijuan_id, params);
      this.background = res.background;
      this.color = res.color;
      this.loading = false;
    },
  },
};
</script>

<style scoped>
body {
  padding-bottom: 120px;
}

.rank-title {
  font-size: 18px;
  color: #fff;
  text-align: center;
  position: relative;
  z-index: 2;
  margin-top: 20px;
}

.rank {
  padding: 20px;
  max-width: 640px;
  margin: 0 auto;
  position: relative;
}

.rank-info {
  position: relative;
  z-index: 9;
  background: #fff;
  border-radius: 10px;
  margin-top: 40px;
  padding: 20px;
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.1);
  margin-bottom: 80px;
}

.rank-tab {
  display: flex;
  height: 44px;
  border-bottom: 1px solid #f1f1f1;
}

.rank-tab .item {
  flex: 1;
  text-align: center;
  color: #333;
  line-height: 44px;
  font-size: 14px;
}

.active span {
  color: #e41e1e;
  border-bottom: 2px solid #e41e1e;
  padding: 5px;
}

.rank-list {
  margin-top: 10px;
}

.list-item {
  display: flex;
}

.list-item .fx-item {
  flex: 3;
  line-height: 35px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  color: #333;
  /*padding: 0 3px;*/
}

.title {
  color: #666;
  font-size: 14px;
}

.list-item .fx-item.number {
  color: #666;
  flex: 1;
}

.list-item .fx-item.fen {
  flex: 1;
}

.list-item .fx-item.time {
  flex: 2.1;
  width: 50px;
  text-align: right;
  color: #999;
}

.btn {
  text-align: center;
  position: fixed;
  z-index: 9;
  bottom: 40px;
  left: 0;
  width: 100%;

}

.btn button {
  display: inline-block;
  background: #e41e1e;
  color: #fff;
  border: none;
  border-radius: 200px 200px;
  padding: 10px 30px;
  font-size: 16px;
}

</style>
