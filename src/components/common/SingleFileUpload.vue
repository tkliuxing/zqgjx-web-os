<template>
  <div class="up-box">
    <el-upload
        class="pmfileupload"
        name="file"
        :accept="accept"
        :action="action"
        :data="data"
        :headers="pmfileHeaders"
        :on-preview="preview"
        :on-progress="progress"
        :on-error="error"
        :on-success="pmfileSuccess"
        :before-remove="pmfileRemove"
        :before-upload="beforeUpload"
        :show-file-list="false">
      <el-button size="medium" type="primary" round>点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { BASE_HOST } from '@/constvars';

export default {
  name: 'SingleFileUpload',
  props: {
    accept: {type:String, default: '*'},
    onProgress: {type:Function, default: ()=>{}},
    onError: Function,
    img:{type:Boolean, default: false}
  },
  data() {
    return {
      pmfileHeaders: {
        Authorization: ''
      },
      data: {
        sys_id: 0,
        org_id: 0,
      },
      action: BASE_HOST + '/api/v1/fileupload/',
    };
  },
  computed: {
    ...mapState(['token', 'sys_id', 'org_id'])
  },
  mounted() {
    this.data.sys_id = this.sys_id;
    this.data.org_id = this.org_id;
    this.pmfileHeaders.Authorization = `Bearer ${this.token}`;
  },
  methods: {
    beforeUpload(file){
     if(this.img){
       const isImage = file.type.startsWith('image/');
       if (!isImage) {
         this.$message.error('只能上传图片类型文件');
       }
       return isImage;
     }
    },
    preview(file) {
      const link = document.createElement('a');
      link.href = file.file;
      link.setAttribute('download', file.name);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
    },
    fileListChange(resp, file, filelist) {
      this.$emit('change', file, filelist);
    },
    error(err, file){
      this.onError(err, file)
    },
    progress(event, file){
      this.onProgress(event, file)
    },
    pmfileRemove(file, flist) {
      let newFlist = flist.filter(item => item.pk !== file.pk);
      this.fileListChange(null, file, newFlist);
    },
    pmfileSuccess(resp, file, filelist) {
      this.fileListChange(null, file, filelist);
    }
  }
};
</script>

<style scoped>
/* .up-box{text-align:center;}
.up-box .el-button{margin-top:20px;} */
</style>
