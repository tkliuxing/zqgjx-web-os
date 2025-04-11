<template>
  <div>
    <div v-if="startqianming">
      <sign @close="handleClose" @qianmingfile="editQianming"></sign>
    </div>
    <div v-else>
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">加载中...</div>
      </div>
      <div v-else class="pdf-container">
        <iframe v-if="pdfUrl" id="fd-jspdf" name="fd-jspdf" :src="`/pdf/web/viewer.html?file=${pdfUrl}?t=`+new Date().getTime()"
                width="100%" :height="screenHeight" @load="iframeLoaded"></iframe>
        <div style="display: flex;justify-content: center">
          <van-button type="primary" @click="startqianming = true" v-if="isQianming">开始签名</van-button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import resource from "@/mobile/resource";
import Vue from 'vue';
import { Button } from 'vant';
// import EventBus from "@/mobile/pages/QianMing/EventBus";
Vue.use(Button);
import Sign from "@/mobile/pages/QianMing/SignaturePage.vue";
const TEM_ID = 'FT343995190686593024'
const TEMPLATE_APP_ID = "FT395048722988179456";
export default {
  data() {
    return {
      loading: false,
      pk:this.$route.query.pk,
      file: null,
      screenHeight: 0, // 记录屏幕高度
      text:this.$route.query.text,
      isQianming: false, // 是否已签过名
      qianinfo: null, // 签名信息
      startqianming: false,
      filePK:null, // 文件的pk
      pageIndex:0,
      jIndex:0,
      width: 0, // 签名框的宽度
      height: 0, // 签名框的高度
      left:0,
      top:0,
      weizhi:[]
    }
  },
  components:{
    Sign
  },
  mounted() {
    this.screenHeight = (window.innerHeight - 80) + 'px'; // 获取屏幕高度
    this.getData();
    // 在父组件中使用 EventBus 监听子组件的点击事件
    // EventBus.$on('qianmingfile', this.editQianming);
  },
  beforeDestroy() {
    // 在组件销毁前取消监听
    // EventBus.$off('qianmingfile',this.editQianming);
  },
  computed: {
    pdfUrl() {
      // if (window.location.protocol === 'https:' && this.file.startsWith('http:')) {
      //  return this.file = this.file.replace('http:', 'https:');
      // }else{
        return this.file
      // }
    },
  },

  methods:{
    async iframeLoaded(){
      let params = {
        guanlian_id: this.currentPk,
        template_id: TEMPLATE_APP_ID
      }
      let resp =await resource.getList("data", params);
      this.qmform =resp.length>0 ?  JSON.parse(JSON.stringify(resp[0])) : [];
    },
    handleClose(){
      this.startqianming = false;
    },
    async getData(){
      this.loading = true;
      try {
        console.log(this.pk,'pk')
        let params = {
          template_id:TEM_ID,
          pk:this.pk,
        }
         let resp = await resource.getList('data',params)
        console.log(resp,'resp')
        this.filePK = JSON.parse(resp[0].file)[0].pk;
        let para = {
          template_id:TEMPLATE_APP_ID,
          guanlian_id:this.pk
        }
        let resp1 = await resource.getList('data',para)
        if(resp1.length>0){
          this.qianinfo = resp1[0];
          this.weizhi = JSON.parse(resp1[0].weizhi)
          let llzip = await resource.getObj("fileupload",resp1[0].update_pdf_id)
          this.file = llzip.file
          for (let i = 0; i < this.weizhi.length; i++) {
            for (let j = 0; j < this.weizhi[i].objects.length; j++) {
              if (this.weizhi[i].objects[j].type == 'textbox' && this.weizhi[i].objects[j].text  == this.text) {

                this.width = Number(this.weizhi[i].objects[j].width * this.weizhi[i].objects[j].scaleX).toFixed(2); // 拿到签名框的大小
                this.height = Number(this.weizhi[i].objects[j].height * this.weizhi[i].objects[j].scaleY).toFixed(2);
                this.left = Number(this.weizhi[i].objects[j].left);
                this.top = Number(this.weizhi[i].objects[j].top);
                this.pageIndex = i
                this.jIndex = j
                this.isQianming = true;
              }
            }
             this.loading = false;
          }
          if(!this.isQianming){
            let params = {
              pk:this.pk,
              template_id:TEM_ID
            }
            let resp1 = await resource.getList('data',params)
            this.file = JSON.parse(resp1[0].file)[0].file
            console.log(this.file,'op')
          }
        }
        this.loading = false;
      }catch (e) {
        console.log(e)
      }

    },
    async editQianming(data){
      this.loading = true;
     try {
        let weizhi = JSON.parse(this.qianinfo.weizhi)

       let aa = {
           "type": "image",
           "version": "4.3.0",
           "originX": "left",
           "originY": "top",
           "left": 0,
           "top": 0,
           "width": 650,
           "height": 275,
           "fill": "#212121",
           "scaleX": 0.5,
           "scaleY": 0.5,
           "hasControls": false,
           "selectable":false,
           "src": data
       }
      let res = await resource.createObj('add_image_to_pdf',{
        file_id:this.filePK,
        page_number:this.pageIndex,
        x:this.left,
        y:this.top,
        width:Number(this.width),
        height:Number(this.height),
        image_base64:data,
      })
      let params = {
          pk:this.pk,
          template_id:TEM_ID
        }
        let resp1 = await resource.getList('data',params);
       console.log(resp1[0],'zjkk')
      this.file = JSON.parse(resp1[0].file)[0].file
      this.weizhi[this.pageIndex].objects.splice(this.jIndex,1);
       let resp =  await resource.updateObj("data", this.qianinfo.pk, {
        weizhi: JSON.stringify(this.weizhi),
         org_id:resp1[0].org_id,
        template_id: TEMPLATE_APP_ID,
      });
       this.isQianming = false;
     }catch (e) {

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