<template>

  <el-dialog class="chakan"  :modal-append-to-body="true" title="预览" append-to-body :visible="visable" width="80%" :close-on-click-modal="false" @close="close">
    <template slot-scope="dialog__body" class="el-dialog__body" >
      <div style="height: 650px">
      <iframe style="height: 80%" v-if="url" id="fd-jspdf" name="fd-jspdf" :src="`/pdf/web/viewer.html?file=${pdfUrl}`"
              :style="{width, height, border: 'none'}"></iframe>
      </div>
    </template>
    <span slot="footer" class="dialog-footer">
     <el-button @click="close">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>


export default {
  props: {
    pdfUrl: {
      type:String,
      default: ''
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '680px',
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
  overflow-y:hidden
}
.chakan /deep/ .el-dialog__body{height: 75vh;margin-top: -31px}

.chakan.el-dialog__wrapper{top: -94px }
</style>
