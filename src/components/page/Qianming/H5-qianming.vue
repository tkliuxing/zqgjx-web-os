<template>
  <div>
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>
    <div v-else class="pdf-container">
      <iframe v-if="pdfUrl" id="fd-jspdf" name="fd-jspdf" :src="`/pdf/web/viewer.html?file=${pdfUrl}`"
              width="100%" :height="screenHeight" ></iframe>
      <div style="display: flex;justify-content: center">
        <el-button @click="startSigning">开始签名</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import resource from "@/resource";
const TEM_ID = 'FT343995190686593024'
export default {
  data() {
    return {
      loading: false,
      pk:this.$route.query.pk,
      file: null,
      screenHeight: 0, // 记录屏幕高度
    }
  },
  mounted() {
    this.screenHeight = (window.innerHeight - 100) + 'px'; // 获取屏幕高度
    this.getData();
  },
  computed: {
    pdfUrl() {
      return this.file ? this.file : '';
    },
  },
  methods:{
   async startSigning(){
      this.$router.push({ name: 'SignaturePage' });
    },
    async getData(){
      this.loading = true;
      try {
        let params = {
          pk:this.pk,
          template_id:TEM_ID
        }
         let resp = await resource.getList('data',params)
         this.file = resp[0].file;
      }catch (e) {
        console.log(e)
      }
       this.loading = false;
    },
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 10px;
  font-size: 16px;
  color: #555;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pdf-container {
  width: 100%;
  height: 100vh;
  overflow: auto;
}
</style>