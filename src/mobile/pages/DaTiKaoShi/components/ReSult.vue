<template>
  <div class="result">
    <div class="result-icon"><img src="@/assets/img/result.png" alt="" /></div>
    <div class="result-info">
      <div v-if="dtInfo.defen != null">
        <div class="suss">完成答题，获得分数</div>
        <div class="num">{{ dtInfo.defen }}</div>
      </div>
      <div class="suss" v-else>完成答题</div>
      <div class="time">答题用时：{{ dtInfo.duration }}</div>
    </div>
    <div class="btn">
      <button @click="finishTab" :style="{ background: color }">
        答题完成
      </button>
    </div>
    <div class="btn" style="margin-top: 5%">
      <button @click="Dati_jilu" :style="{ background: color }">
        答题记录
      </button>
    </div>
    <div class="btn" style="margin-top: 5%" v-if="showresult">
      <button @click="rankTab" :style="{ background: color }">
        答题排名
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dtInfo: {
      type: Object,
      default() {
        return [];
      },
    },
    showresult: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#e41e1e",
    },
  },
  data() {
    return {
      time: "",
    };
  },
  methods: {
    finishTab() {
      location.reload();
    },
    rankTab() {
      this.$router.replace({
        name: "/ksrank",
        query: {
          id: this.sjId,
        },
      });
    },
    Dati_jilu(){
      this.$router.replace({
        name: "/ksrecord",
        query: {
          id: this.sjId,
        },
      });
    }
  },
};
</script>

<style scoped>
.result {
  text-align: center;
  padding: 40px 0;
}
.result-icon {
  position: relative;
  z-index: 9;
}
.result-info {
  position: relative;
  z-index: 9;
}
.result-icon img {
  width: 60px;
}
.suss {
  margin-top: 30px;
  color: #fff;
}
.num {
  font-size: 34px;
  color: #fff;
  margin-top: 10px;
}
.btn {
  margin-top: 50%;
  text-align: center;
  position: relative;
  z-index: 99;
}
.btn button {
  display: inline-block;
  border: none;
  color: #fff;
  border-radius: 200px 200px;
  line-height: 44px;
  padding: 0 40px;
  font-size: 16px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
}
.time {
  margin-top: 10px;
  color: #fff;
  font-size: 12px;
}
</style>
