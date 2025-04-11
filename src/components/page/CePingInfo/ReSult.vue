<template>
  <div class="result">
    <div class="result-icon"><img src="@/assets/img/result.png" alt="" /></div>
    <div class="result-info">
      <div class="suss">提交完成</div>
    </div>
    <div class="bg" :style="{background:color}"></div>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: "#e41e1e",
    },
  },
};
</script>

<style scoped>
.bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 50%;
  width: 100%;
  border-radius: 0 0 50% 50%;
}
.result {
  text-align: center;
  padding: 60px 0;
  position: absolute;
  background: #fff;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
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
  margin-top: 10px;
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
}

.time {
  margin-top: 10px;
  color: #fff;
  font-size: 14px;
}
</style>
