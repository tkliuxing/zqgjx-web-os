<template>
  <div :style="{width:mwith}">
          <el-upload
            :action="BASE_HOST+'/api/v1/fileupload/'"
            :before-remove="pmfileRemove"
            :before-upload="beforeUploadFun"
            :data="fileData"
            :disabled="loading"
            :file-list="fileList"
            :headers="pmfileHeaders"
            :limit="limit"
            :accept="'application/pdf'"
            :on-error="onError"
            :on-exceed="handleExceed"
            :on-preview="preview"
            :on-progress="pmfileProgress"
            :on-success="pmfileSuccess"
            :show-file-list="false"
            class="pmfileupload"
            multiple
          >
            <el-button :loading="loading" size="small" type="primary" v-if="limit!=fileList.length">{{ loading ? '上传中...' : '上传文件' }} </el-button>
          </el-upload>
    <el-table
      v-if="fileList && fileList.length > 0"
      :data="fileList"
      size="mini"
      style="width:100%;margin: auto">
      <el-table-column
        label="文件">
        <template slot-scope="scope">
          <el-link v-if="matchType(scope.row.file)=='pdf'"
                   :underline="false"
                   type="primary"
                   @click="openPDF(scope.row.file)">{{ scope.row.name }}
          </el-link>
          <el-link v-else :href="scope.row.file" :underline="false" type="primary">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteFile(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pdfview v-if="pdfurl" :pdf-url="pdfurl" :visable="pdfVisable" @close="pdfVisable=false"></pdfview>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import axios from "axios";
import pdfview from "@/components/common/PDFViewer.vue";
export default {
  name: 'PMFileUpload',
  components:{pdfview},
  props: {
    fileList: {
      type: Array,
      default: function () {
        return []
      }
    },
    limit: {
      type: Number,
      default: 1
    },
    beforeUpload: {
      type: String,
      default: null
    },
    /**
     * 是否自定义文件名称
     */
    isCustomName: {
      type: Boolean,
      default: false
    },
    project_id: {
      type: String,
      default() {
        return null;
      }
    },
    mwith:{
      type: String,
      default() {
        return null;
      }
    },
  },
  data() {
    return {
      pmfileHeaders: {
        Authorization: ''
      },
      mytitle: '',
      fileData: {
        sys_id: null,
        org_id: null,
        biz_id: null,
      },
      loading: false,
      pdfurl: null,
      pdfVisable: false,
    };
  },
  computed: {
    ...mapState(['token'])
  },
  mounted() {
    this.pmfileHeaders.Authorization = "Bearer " + this.$store.state.token;
    this.fileData.sys_id = this.$store.state.sys_id;
    this.fileData.org_id = this.$store.state.userinfo.org_id;
    this.fileData.biz_id = 1;
  },
  methods: {
    pmfileProgress(){
      this.loading = true
    },
    beforeTime(file){
      // 上传时 只能上传pdf文件的判断
      const allowedTypes = ['application/pdf']; // 允许的文件类型

      if (!allowedTypes.includes(file.type)) {
        this.$message.error('只能上传 PDF 文件！');
        return true; // 阻止上传
      }
    },
    //打开的文件一般是在后端存储的，从后端取到文件后，把文件传输到openPDF方法，用val接收即可。
    async openPDF(url) {
      console.log(url,'rul')
      let type = this.matchType(url)
      if(type == 'pdf' || type == 'PDF'){
        this.pdfurl = url
        this.pdfVisable = true
      }else{
        window.open(url, "_blank");
      }
    },
    matchType(fileName) {
      // 后缀获取
      var suffix = '';
      try {
        var flieArr = fileName.split('.');
        suffix = flieArr[flieArr.length - 1];
      } catch (err) {
        suffix = '';
      }

      return suffix;
    },
    async remark(file) {
      try {
        let {value} = await this.$prompt('备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: file.desc || ''
        });
        file.desc = value;
        this.$nextTick(() => {
          this.fileListChange(file, this.fileList);
        })
      } catch (e) {

      }
    },
    async deleteFile(file) {
      if (file.pk) {
        await this.pmfileBeforeRemove(file);
      } else {
        this.$message.warning("该文件不存在");
        this.pmfileRemove(file, this.fileList);
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只可选择 ${this.limit} 个文件`);
    },
    preview(file) {
      const link = document.createElement('a');
      link.href = file.file;
      link.setAttribute('download', file.name);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
    },
    async pmfileBeforeRemove(file, flist) {
      try {
        await this.$confirm(`确定移除 ${file.name}？`);
        this.$http.delete(`/fileupload/${file.pk}/`);
        this.pmfileRemove(file, this.fileList);
      } catch (e) {
        console.log('cancel remove');
      }
    },
    beforeUploadFun(file) {
      this.loading = true
      if (this.validatePDF && typeof this.validatePDF === 'function') {
        const isValid = this.validatePDF(file);
        if (!isValid) {
          return false;
        }
      }
      return true;
    },
    validatePDF(file) {
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        this.$message.error('只能上传PDF格式的文件');
      }
      this.loading = false;
      return isPDF;
    },
    fileListChange(resp, file, filelist) {
      this.mytitle = '';
      this.$emit('on-change', file, filelist);
    },
    pmfileRemove(file, flist) {
      let newFlist = flist.filter(item => item.file !== file.file);
      this.fileListChange(null, file, newFlist);
    },
    pmfileSuccess(resp, file, filelist) {
      this.loading = false
      this.$message.success('上传成功');
      this.fileListChange(null, file, filelist);
    },
    onError() {
      this.$message.error('上传失败,请检查是否选择类型');
    },

  }
};
</script>

<style scoped>

</style>
