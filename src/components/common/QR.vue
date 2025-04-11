<template>
  <div style="width: 200px;height: 200px">
    <div ref="qrCodeUrl" :url="url"  @click="download_canvas"></div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import download_canvas from "@/utils/download_canvas";
import html2canvas from "html2canvas";
import {BASE_HOST} from "@/constvars";

export default {
  name: 'mps-qrcode',
  props: {
    url: String,
    isShow:{
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    logoWidth: {
      type: Number,
      default: 50
    },
    logoHeight: {
      type: Number,
      default: 50
    },
  },
  data() {
    return {
      qrcode: null,
      BASE_HOST,
      src: "",
    };
  },
  methods: {
    createQRcode() {
      if (this.qrcode) {
        this.qrcode.makeCode(this.url);
      } else {
        this.$nextTick(()=>{
          this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: this.url, // 需要转换为二维码的内容
            width: this.width,
            height: this.height,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M,
          });
          //加工要显示的图片
          let logo = new Image();
          logo.crossOrigin = 'Anonymous';
          // 填入你本地log图片
          logo.src = this.src? this.src : '';
          logo.onload=()=>{
            let canvas = this.qrcode._oDrawing._elCanvas; // 获取QRCode实例的内部canvas元素
            let ctx = canvas.getContext("2d");

            let logoWidth = this.logoWidth;
            let logoHeight = this.logoHeight;
            let logoX = (this.width - logoWidth) / 2;
            let logoY = (this.height - logoHeight) / 2;

            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
            let qrImg = new Image();
            qrImg.src = canvas.toDataURL();

            let container = this.$refs.qrCodeUrl;
            container.innerHTML = ''; // 清空容器内容
            container.appendChild(qrImg); // 将生成的带有logo的二维码图片添加到容器中
          }

        })

      }
    },
    download_canvas() {
      html2canvas(this.$refs.qrCodeUrl, { scale: 1 }).then((canvas) => {
        download_canvas(canvas);
      });
      // download_canvas(this.$refs.qrCodeUrl.children[0]);
    },
  },
  watch: {
    url: {
      handler() {
        this.createQRcode()
      },
      deep: true
    }
  },
  mounted() {
    if (this.url) {
      this.createQRcode();
    }
  },

};
</script>

<style></style>
