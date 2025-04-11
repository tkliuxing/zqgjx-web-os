<template>
  <div style="width: 200px;height: 200px">
    <div ref="qrCodeUrl" @click="download_canvas"></div>
    <div class="tip" v-if="showTip">点击下载二维码</div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import download_canvas from "@/utils/download_canvas";
export default {
  /**
   * @prop {url:生成二维码的地址,title:该二维码的一级标题,text:该二维码的二级标题,showTip:是否显示点击下载二维码}
   */
  props: {
    url: String,
    title: String,
    text: String,
    showTip: {
      type: Boolean,
      default: false,
    },
    width: Number,
    height: Number,
    logoWidth:{
      type: Number,
      default: 50,
    },
    logoHeight:{
      type: Number,
      default: 50,
    }
  },
  data() {
    return {
      qrcode: null,
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
            width: this.width || 200,
            height: this.height || 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L,
          });
          //加载要显示的图片
          let logo = new Image();
          logo.crossOrigin = 'Anonymous';
          // 填入你本地log图片
          logo.src = this.src
          logo.onload=()=>{
            let container = this.$refs.qrCodeUrl;
            container.innerHTML = ''; // 清空容器内容
              let canvas = this.qrcode._oDrawing._elCanvas; // 获取QRCode实例的内部canvas元素
              // console.log(canvas,'canvas')
              let ctx = canvas.getContext("2d");
              let logoWidth = this.logoWidth;
              let logoHeight = this.logoHeight;
              let logoX = (this.width - logoWidth) / 2;
              let logoY = (this.height - logoHeight) / 2;
              let qrImg = new Image();
              qrImg.src = canvas.toDataURL();
              console.log(logo,'logo')
              ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
              container.appendChild(qrImg); // 将生成的带有logo的二维码图片添加到容器中
          }
          logo.onerror = (error) => {
            console.error("Error loading logo:", error);
          };

        })

      }
      // if (this.text && !this.title) {
      //   this.qrcode._el.append(this.createText());
      // }
      // if (this.title && !this.text) {
      //   this.qrcode._el.append(this.createTitle());
      // }
      // if (this.title && this.text) {
      //   this.qrcode._el.append(this.createTitle());
      //   this.qrcode._el.append(this.createText());
      // }
    },
    download_canvas() {
      html2canvas(this.$refs.qrCodeUrl, { scale: 1 }).then((canvas) => {
        download_canvas(canvas);
      });
      // download_canvas(this.$refs.qrCodeUrl.children[0]);
    },
    createText() {
      let oDiv = document.createElement("div");
      oDiv.innerHTML = this.text;
      oDiv.style.textAlign = "center";
      oDiv.style.color = "#000";
      // oDiv.style.marginTop = "10px";
      oDiv.style.fontSize = "1rem";
      return oDiv;
    },
    createTitle() {
      let oDivTitle = document.createElement("div");
      oDivTitle.innerHTML = this.title;
      // oDivTitle.style.marginTop = "20px";
      oDivTitle.style.textAlign = "center";
      oDivTitle.style.color = "#000";
      oDivTitle.style.fontSize = "1.2rem";
      return oDivTitle;
    },
  },
  watch: {
    url: {
      handler() {
        this.createQRcode();
      },
      deep: true,
    },
  },
  mounted() {
    if (this.url) {
      this.createQRcode();
    }
  },
};
</script>

<style scoped>
.tip {
  margin-top: 20px;
  color: red;
  font-size: 13px;
  text-align: center;
}
</style>
