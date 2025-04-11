<template>
  <div class="tablefileview">
    <!--    <el-button size="mini" type="primary" @click="showFiles = true">查看文件</el-button>-->
    <!--    <el-dialog-->
    <!--        title="文件列表"-->
    <!--        :visible.sync="showFiles"-->
    <!--        width="50%">-->
    <el-table
      :data="fileList" :show-header="showHeader" :cell-style="{textAlign:'left'}">
       <el-table-column
        v-if="isType"
        label="附件类型"
        prop="desc"
        width="200">
        <template slot-scope="scope">{{ get_categorys_option_data_display(scope.row.category) }}</template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="文件">
        <template slot-scope="scope">
          <a class="el-link el-link--primary is-underline" target="_blank" :download="scope.row.name"
             @click="openPDF(scope.row.file)" type="primary">
              <span class="el-link--inner" style="margin-top: -8px;">
              {{ scope.row.name }}</span>
          </a>

        </template>
      </el-table-column>
      <el-table-column
        v-if="isCustomName"
        prop="file_name"
        label="备注">
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
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="showFiles = false">关&nbsp;闭</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import axios from "axios";
import pdfview from "@/components/common/PDFViewer.vue";

export default {
  name: 'TableFileView',
  components: {pdfview},
  props: {
    category:null,
    fileList: {
      type: Array,
      default: [],
    },
    /**
     * 是否自定义文件名称
     */
    isType: {
      type: Boolean,
      default: false
    },
    /**
     * 是否自定义文件名称
     */
    isCustomName: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示表头
     */
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showFiles: false,
      pdfVisable: false,
      pdfurl: null,
      dialogVisible: false,
      src: '',
      src_type: 'img',
    }
  },
  methods: {
    //打开的文件一般是在后端存储的，从后端取到文件后，把文件传输到openPDF方法，用val接收即可。
    async openPDF(url) {
      url = url.replace("http://", "//");
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
    isImg(file) {
      if (file) {
        const pdf = file.substr(file.lastIndexOf('.') + 1) === 'pdf'
        const jpg = file.substr(file.lastIndexOf('.') + 1) === 'jpg'
        const jpeg = file.substr(file.lastIndexOf('.') + 1) === 'jpeg'
        const png = file.substr(file.lastIndexOf('.') + 1) === 'png'
        if (pdf || jpeg || jpg || png) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }

    },
    get_categorys_option_data_display(value) {
      if (!Array.isArray(this.category)) {
        return value;
      }

      let option = this.category.filter((item) => {
        return item && item.pk === value;
      });

      return option.length > 0 ? option[0].name : value;
    },

  }
};
</script>
