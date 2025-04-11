<template>
  <div>
    <div style="display: none">
      <div ref="print" id="printStyle">
        <div class="item" v-for="(item, index) in goodsData" :key="index">
          <h3>{{ item.title }}</h3>
          <div class="qrcode-pic" ref="codeItem"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["httpurl"]),
  },
  props: {
    goodsData: {
      type: Array,
      default() {
        return [];
      },
    },
    url: String,
  },

  methods: {
    handleBatchPrintCode() {
      //必须要等到页面加载完成，不然会报错
      // console.log(this.goodsData);
      this.$nextTick(() => {
        this.goodsData.forEach((item, index) => {
          let code = this.httpurl + this.url + item.pk;
          this.$refs.codeItem[index].innerHTML = "";
          new QRCode(this.$refs.codeItem[index], {
            text: code, //二维码内容
            width: 200,
            height: 200,
            colorDark: "#000", //二维码颜色
            colorLight: "#fff", //二维码背景色
          });
        });
        setTimeout(() => {
          this.$print(this.$refs.print);
        }, 200);
      });
    },
  },
};
</script>

<style scoped>
#printStyle .item {
  padding: 10px;
}
#printStyle h3 {
  font-size: 28px;
  line-height:1.8;
}
</style>
