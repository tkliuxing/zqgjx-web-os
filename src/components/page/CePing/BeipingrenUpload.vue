<template>
  <div>
    <el-upload
        class="pmfileupload"
        name="file"
        :accept="accept"
        :action="action"
        :before-upload="excelParse"
        :show-file-list="false">
      <el-button size="small" type="text">上传被评对象 Excel</el-button>
    </el-upload>
  </div>
</template>

<script>
import { BASE_HOST } from '@/constvars';
import XLSX from "xlsx";

export default {
  name: 'BeipingrenUpload',
  data() {
    return {
      action: BASE_HOST + '/api/v1/fileupload/',
      accept: ".xlsx"
    };
  },
  methods: {
    excelParse(file){
      let reader = new FileReader();
      reader.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        this.$emit('change', workbook);
      };
      reader.readAsArrayBuffer(file);
      return false;
    },
  }
};
</script>

<style scoped>

</style>
