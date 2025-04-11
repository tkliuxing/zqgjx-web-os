<template>
  <div style="border-radius: 4px; border: 1px solid #DDDFE0;text-align: center;">
    <div style="margin: 10px">
      <el-form>
        <el-row :gutter="10">
          <el-col :span="24" style="text-align: left;color: #f80303">
            <div>* 请先选择附件分类后，再点击上传文件选择文件上传<span v-if="limit && limit>1">，最多可上传{{limit}}个附件</span></div>
          </el-col>

          <el-col :span="10">
            <el-form-item v-if="isCustomName" prop="category">
              <label style="text-align: center;">附件分类：</label>
              <el-select style="width: 80%" placeholder="请选择附件分类(必填)" v-model="fileData.category" clearable filterable>
                <el-option v-for="ct in category" :key="ct.pk" :label="ct.name" :value="ct.pk"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="name">
              <label style="text-align: center;">文件备注：</label>
              <el-input style="width: 80%" v-if="isCustomName" v-model="mytitle" placeholder="文件自定义备注"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-upload
              :action="BASE_HOST+'/api/v1/fileupload/'"
              :before-remove="pmfileRemove"
              :before-upload="beforeUploadFun"
              :data="fileData"
              :disabled="loading"
              :file-list="fileList"
              :headers="pmfileHeaders"
              :limit="limit"
              :on-error="onError"
              :on-exceed="handleExceed"
              :on-preview="preview"
              :on-success="pmfileSuccess"
              :show-file-list="false"
              class="pmfileupload"

            >
<!--              multiple-->
              <!--          <el-form-item label="附件分类"></el-form-item>-->
              <el-button :loading="loading" size="small" type="primary">{{ loading ? '上传中...' : '上传文件' }}</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      v-if="fileList.length > 0"
      size="mini"
      style="width:100%;"
      :data="fileList">
      <el-table-column
        label="附件类型"
        prop="desc"
        width="200">
        <template slot-scope="scope">{{ get_categorys_option_data_display(scope.row.category) }}</template>
      </el-table-column>

      <el-table-column
        label="文件">
        <template slot-scope="scope">
          <el-link type="primary"
                   :underline="false"
                   @click="openPDF(scope.row.file)">{{ scope.row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        v-if="isCustomName">
        <template slot-scope="scope">
          <el-link type="primary"
                   :underline="false"
                   @click="openPDF(scope.row.file)">{{ scope.row.file_name || "-" }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <!--          <el-button v-if="scope.row.pk" type="primary" size="mini" @click="remark(scope.row)">备注</el-button>-->
          <el-button type="danger" size="mini" @click="deleteFile(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      append-to-body
      width="80%">
      <div v-if="src_type=='img'" style="text-align: center">
        <el-image :src="src" lazy></el-image>
      </div>
      <iframe v-else :src="src" style="width: 100%;height: 70vh;" align="center"></iframe>
    </el-dialog>
    <pdfview v-if="pdfVisable" :pdf-url="pdfurl" :visable="pdfVisable" @close="pdfVisable=false"></pdfview>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import axios from "axios";
import {getList, createObj, getObj, updateObj, deleteObj} from "@/resource";
import pdfview from "@/components/common/PDFViewer.vue";

export default {
  name: 'PMFileUpload',
  components: {pdfview},
  props: {
    fileList: {
      type: Array,
      default: function () {
        return []
      }
    },
    validatePDF: Function,
    category: null,
    limit: {
      type: Number,
      default: null
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
    }
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
        category: null
      },
      loading: false,
      pdfVisable: false,
      pdfurl: null,
      dialogVisible: false,
      src: '',
      src_type: 'img',
      categorys: [],
    };
  },
  watch: {
    mytitle: {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        this.fileData.file_name = newval;
      }
    },
    "fileData.category": {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        this.fileData.category = newval;
      }
    },
    category: {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        if (newval) {
          this.getLocalDataSource();
        }
      }
    },
    $route: {
      deep: true,
      immediate: true,
      handler(newval) {
        this.fileData.obj_id = newval.query.field_01 || null;
      }
    }
  },
  computed: {
    ...mapState(['token'])
  },
  mounted() {
    this.pmfileHeaders.Authorization = "Bearer " + this.$store.state.token;
    this.fileData.sys_id = this.$store.state.sys_id;
    this.fileData.org_id = this.$store.state.userinfo.org_id;
    this.fileData.biz_id = 1;
    // this.fileData.category = this.category;//附件类型：如招标申请文件的id
  },
  methods: {
    //打开的文件一般是在后端存储的，从后端取到文件后，把文件传输到openPDF方法，用val接收即可。
    async openPDF(url) {
      // url = url.replace("http://", "//");
      // let res = await axios({
      //   method: "get",
      //   url: url,
      //   params: {},
      //   responseType: "blob",
      // });
      let suffix = url.split(".").pop();
      if (suffix == "pdf" || suffix == "PDF") {
        this.pdfVisable = true;
        this.pdfurl = url;
      } else if (suffix == 'jpg' || suffix == 'png' || suffix == 'jpeg' || suffix == 'JPG' || suffix == 'PNG' || suffix == 'JPEG') {
        this.src = url
        this.src_type = "img"
        this.dialogVisible = true
      } else if (suffix == 'txt' || suffix == 'TXT' || suffix == 'mp4' || suffix == 'MP4') {
        this.src_type = "qt"
        this.src = url
        this.dialogVisible = true
      } else {
        window.open(url, "_blank")
      }
      // let res = await axios({
      //   method: "get",
      //   url: url,
      //   params: {},
      //   responseType: "blob",
      // });
      // if (res.status == "500") {
      //   this.$message({
      //     message: "下载失败！",
      //     type: "error",
      //   });
      //   return;
      // }
      // //文件以pdf形式进行预览
      // let blob = new Blob([res.data], {
      //   type: "application/pdf;chartset=UTF-8",
      // });
      // let fileURL = URL.createObjectURL(blob);
      // window.open(fileURL, "_blank");
    },
    matchType(fileName) {
      // 后缀获取
      var suffix = '';
      // 获取类型结果
      var result = '';
      try {
        var flieArr = fileName.split('.');
        suffix = flieArr[flieArr.length - 1];
      } catch (err) {
        suffix = '';
      }
      // fileName无后缀返回 false
      if (!suffix) {
        result = false;
        return result;
      }
      // 图片格式
      var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
      // 进行图片匹配
      result = imglist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'image';
        return result;
      }
      ;
      // 匹配txt
      var txtlist = ['txt'];
      result = txtlist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'txt';
        return result;
      }
      ;
      // 匹配 excel
      var excelist = ['xls', 'xlsx'];
      result = excelist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'excel';
        return result;
      }
      ;
      // 匹配 word
      var wordlist = ['doc', 'docx'];
      result = wordlist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'word';
        return result;
      }
      ;
      // 匹配 pdf
      var pdflist = ['pdf'];
      result = pdflist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'pdf';
        return result;
      }
      ;
      // 匹配 ppt
      var pptlist = ['ppt'];
      result = pptlist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'ppt';
        return result;
      }
      ;
      // 匹配 视频
      var videolist = ['mp4', 'm2v', 'mkv'];
      result = videolist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'video';
        return result;
      }
      ;
      // 匹配 音频
      var radiolist = ['mp3', 'wav', 'wmv'];
      result = radiolist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'radio';
        return result;
      }
      // 其他 文件类型
      result = 'other';
      return result;
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
      // this.$emit('validatePDF',file)
      if (this.validatePDF && typeof this.validatePDF === 'function') {
        const isValid = this.validatePDF(file);
        if (!isValid) {
          return false;
        }
      }
      return true;
    },
    fileListChange(resp, file, filelist) {
      this.mytitle = '';
      if (this.categorys.length > 0) {
        this.fileData.category = this.categorys[0].pk
      }
      this.$emit('on-change', file, filelist);
    },
    pmfileRemove(file, flist) {
      let newFlist = flist.filter(item => item.file !== file.file);
      this.fileListChange(null, file, newFlist);
    },
    pmfileSuccess(resp, file, filelist) {
      // this.loading.close();
      this.loading = false
      console.log(this.fileList)
      this.$message.success('上传成功');
      this.fileListChange(null, file, filelist);
    },
    onError() {
      this.loading = false
      // this.loading.close();
      this.$message.error('上传失败,请检查是否选择类型');
    },
    // get_categorys_option_data_display(value) {
    //   let option = this.category.filter((item) => {
    //     return item.pk === value;
    //   });
    //   return option.length > 0 ? option[0].name : value;
    // },
    get_categorys_option_data_display(value) {
      if (!Array.isArray(this.category)) {
        return value;
      }

      let option = this.category.filter((item) => {
        return item && item.pk === value;
      });

      return option.length > 0 ? option[0].name : value;
    },

    async getLocalDataSource() {
      // this.categorys = await getList("basetree", {
      //   parent: this.category,
      // });
      // if (this.categorys.length > 0) {
      //   this.fileData.category = this.categorys[0].pk
      // }
    }
  }
};
</script>

<style scoped>

</style>
