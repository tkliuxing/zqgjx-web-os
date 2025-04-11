<template>
  <el-card style="position:relative">

<!--单位来访二维码-->
    <div style="text-align: center;">
      <div id="target-element" class="erweima" @click="generateImage">
        <qr-canvas :text="url" width="300px" height="300px"  v-if="url"></qr-canvas>
        <!--      <qr-canvas :text="url" width="350px" height="350px" title="阿首都" v-if="url"></qr-canvas>-->
        <!--        <qr-code :url="url" ref="qrCodeUrl"></qr-code>-->
        <span v-if="sys_org_data" class="gs_name">{{ sys_org_data.name }}</span>
      </div>
        <div class="tips">点击保存图片</div>
      </div>
  </el-card>
</template>
<script>
import html2canvas from 'html2canvas';
import resource from "@/resource";
import moment from "moment";
import QrCanvas from "@/components/common/QrCanvas.vue";
// import QrCode from "@/components/common/QrCode";
// import QrCodedown from "@/components/common/QrCodedown";
import {mapState} from "vuex";

export default {
  name: "",
  data() {
    return {
      loading: false,
      url: null,
      sys_org_data: null,
    }
  },
  methods: {
    generateImage() {
      const element = document.getElementById('target-element'); // 替换为目标元素的id或class
      html2canvas(element).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'image.png';
        link.click();
      });
    },
    async getLocalDataSource() {
      let res1 = await resource.getList("department", {
        "org_id": this.$store.state.userinfo.org_id,
        "sys_id": this.userinfo.sys_id
      });
      this.sys_org_data = res1[0];
    },
  },
  async created() {
    await this.getLocalDataSource()
    this.url = window.location.origin + "/sf_shen_qing?pk=" + this.$store.state.userinfo.org_id;
    console.log(this.url)
  },
  computed: {
    ...mapState(['userinfo'])
  },
  components: {
    QrCanvas,
    // QrCode,
    // QrCodedown,
  }
}
</script>
<style scoped>
.batchClass {
  position: absolute;
  right: 20px;
  bottom: 17px;
}
.erweima{
  cursor: pointer;
  width: 300px;
  margin: 0 auto;
}
.gs_name{
  font-size: 18px;
  color: #000000;
}
</style>