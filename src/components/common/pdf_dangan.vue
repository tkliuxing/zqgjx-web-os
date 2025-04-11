<template>

  <el-dialog class="chakan"  :modal-append-to-body="false" title="预览" :visible="visable"  width="900px" :close-on-click-modal="false" @close="close">
    <template slot-scope="dialog__body" class="el-dialog__body" >
      <div style="height: 650px">
        <!--      <p >如在下方看不到正文，请 <el-link type="primary" underline :href=pdfUrl target="_blank">下载打开</el-link> 后查看</p>-->
        <iframe style="height: 80%" v-if="url" id="fd-jspdf" name="fd-jspdf" :src="`/pdf/web/viewer.html?file=${pdfUrl[a]}`"
                :style="{width, height, border: 'none'}"></iframe>
      </div>
    </template>
    <span slot="title" >
      预览
        <el-button style="margin-left: 600px"  type="info" @click="a -= 1" :disabled="0 >= a">上一份</el-button>
      <el-button style="margin-right: 10px"  type="info" @click="a += 1" :disabled="pdfUrl.length <=a+1 ">下一份</el-button>

<!--     <el-button @click="close">关闭</el-button>-->

    </span>



  </el-dialog>
</template>

<script>


export default {
  props: {
    pdfUrl: {
      type:Array ,
      default: []
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '94vh',
    },
    visable: {
      type: Boolean,
      default: false,
    }
  },



  computed:{

  },
  data() {
    return {
      pdfDialogVisible: true,
      urlPdf:'',
      a:0
    }
  },
  mounted() {
    this.handlePdfUrl();

  },
  watch: {
    pdfUrl() {
      this.handlePdfUrl();
    }
  },
  methods: {
    url(){
      this.a += 1
      this.urlPdf= this.pdfUrl[this.a]

    },

    down(){
      this.a += 1
    },
    close(){
      this.a=0
      this.$emit('close');
    },
    handlePdfUrl() {
      if (window.location.protocol === 'https:' && this.pdfUrl.startsWith('http:')) {
        this.pdfUrl = this.pdfUrl.replace('http:', 'https:');
      }
    }
  },
}
</script>

<style scoped>
.chakan{
  overflow:Scroll;
  overflow-y:hidden;
  overflow-x:hidden ;
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  .el-dialog {
    margin: 0 auto !important;
    height: 100%;
    overflow: hidden;
    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
    }
  }


}
</style>
