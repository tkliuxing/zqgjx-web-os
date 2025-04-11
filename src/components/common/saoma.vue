<template>
  <div class="scan">
    <!-- 我topTitle是封装的全局头部返回 根据自己条件进行休整 -->
    <topTitle>扫一扫</topTitle>
    <div id="bcid">
      <div style="height:40%"></div>
      <p class="item">...载入中...</p>
    </div>
  </div>
</template>

<script>
let scan = null;
export default {
  data() {
    return {
    };
  },
  mounted() {
    this.startRecognize();
    setTimeout(() => {
      this.startScan();
    }, 500);
  },
  methods: {
    //创建扫描控件
    startRecognize() {
      let that = this;
      if (!window.plus) return;
      //filter 扫描类型
      var filter = [
        plus.barcode.CODE128,
        plus.barcode.EAN13,
        plus.barcode.EAN8,
        plus.barcode.QR,
      ];
      scan = new plus.barcode.Barcode("bcid", filter);
      scan.onmarked = onmarked;
      function onmarked(type, result, file) {
        switch (type) {
          case plus.barcode.QR:
            type = "QR";
            break;
          case plus.barcode.EAN13:
            type = "EAN13";
            break;
          case plus.barcode.EAN8:
            type = "EAN8";
            break;
          case plus.barcode.CODE128:
            type = "EAN8";
            break;
          default:
            type = "其它" + type;
            break;
        }
        that.$toast(result); //我这里是封装的vant 需要根据自己情况进行修改
        that.closeScan();
      }
    },
    // 关闭控件a
    closeScan() {
      if (!window.plus) return;
      scan.close();
    },
    startScan() {
      if (!window.plus) return;
      scan.start();
    },
    // 关闭扫描
    cancelScan() {
      if (!window.plus) return;
      scan.cancel();
    },
  },
  destroyed() {
    this.cancelScan();
    this.closeScan();
  },
};
</script>

<style lang="scss">
.scan {
  width: 100%;
  height: 100vh;
  background-color: #ccc;
}
#bcid {
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 1.226667rem;
  bottom: 0;
  text-align: center;
  color: #fff;
  background: #ccc;
}
.item {
  font-size: 0.4rem;
}
</style>
