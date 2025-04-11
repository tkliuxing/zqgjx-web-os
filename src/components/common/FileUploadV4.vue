<template>
  <div :style="{width:mwith}">
    <el-card>
      <el-tabs  v-if="categoryParentId" v-model="activeName" @tab-click="handleClick">
        <template v-for="(item,index) in data" >
          <el-tab-pane :label="item.name" :name="`${index}`" :key="index"></el-tab-pane>
        </template>
      </el-tabs>
      <div style="margin-top: 15px" >
        <el-upload
            :action="BASE_HOST+'/api/v1/fileupload/'"
            :before-remove="pmfileRemove"
            :data="fileData"
            :disabled="loading"
            :file-list="itemList"
            :headers="pmfileHeaders"
            :limit="limits"
            :accept="accept"
            :on-error="onError"
            :on-exceed="handleExceed"
            :on-success="pmfileSuccess"
            :on-change = "changeFileLength"
            :show-file-list="true"
            ref="upload"
            :auto-upload="false"
            list-type="picture-card"
            :multiple="limits>1"
            :class="itemList.length < limits ? 'show' : 'hide'"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}" style="display: flex;align-items: center;flex-direction: column">

            <span class="fa fas" style="font-size: 60px;" :style="{color:iconBgColor}"  :class="getLast(file.name)"></span>
            <span class="el-upload-list__item-actions">
             <span class="el-upload-list__item-preview">
               <i :class="['fa-file-pdf','fa-file-video','fa-file-image'].includes(file.iconClass) ? 'el-icon-zoom-in' : 'el-icon-download'" @click="Preview(file)"></i>
             </span>

             <span class="el-upload-list__item-delete" >
               <i class="el-icon-delete" @click="deleteFile(file)"></i>
             </span>
           </span>
            <!--            -->
            <div slot="tip" class="el-upload__tip">{{file.name}}</div>
          </div>
        </el-upload>
      </div>
            <PDFViewer v-if="pdfurl" :pdf-url="pdfurl" :visable="pdfVisable" @close="pdfVisable=false"/>
      <el-dialog width="50%" append-to-body :visible.sync="imgShow">
        <div style="background-color: #FBFDFF">
          <el-image
              v-if="imgShow"
              style="width: 100%; height: 500px"
              fit="contain"
              :src="url">
          </el-image>
        </div>
      </el-dialog>
      <el-dialog width="50%" append-to-body :visible.sync="mp4Show" >
        <div style="background-color: #FBFDFF">
          <video controls :src="mp4url" style="width: 100%;height: 500px"></video>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import {mapState} from 'vuex';
import PDFViewer from "@/components/common/PDFViewer.vue";
import {BASE_HOST} from "@/constvars";
import resource from "@/resource";

export default {
  name: 'mps-upload-file',
  components: {PDFViewer},
  props: {
    mwith: {
      type: String,
      default() {
        return null;
      }
    },
    limit: {
      type: Number,
      default: 999,
    },
    // 是否仅支持PDF
    PDFOnly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 分类名称
    categoryName: {
      type: String,
      default: null
    },
    categoryParentId: {
      type: String,
      default: null,
    },
    // 上传文件的颜色
    iconBgColor: {
      type: String,
      default: '#8fc3ff'
    },
    // 上传文件的大小
    size: {
      type: Number,
      default: 10
    },
    // biz_id
    biz_id: {
      type: Number,
      default: 1
    },
    uploadType:{
      type:Array,
      default:[],
    }
  },

  data() {
    return {
      cateName: null,
      isHover: false,
      pmfileHeaders: {
        Authorization: ''
      },
      fileData: {
        sys_id: null,
        org_id: null,
        biz_id: null,
        category: null,
        file_name: null,
      },
      moment,
      BASE_HOST,
      loading: false,
      accept: null,
      allUser: [],
      fileList: [],
      categoryPK: null,
      data: [],
      percent: 0,
      del: [],
      pkList: [],
      cunzaiPk: [],
      imgShow: false,
      url: null,
      pdfurl: null,
      pdfVisable: false,
      mp4Show: false,
      mp4url: null,
      activeName: 0,
      itemList: [],
      AllList: [],
      limits: null,
    };
  },
  computed: {
    ...mapState(['token']),
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      async handler(newval) {
        if (newval) {
          let flag = false;
          newval.forEach(item => {
            this.fileList.forEach(item1 => {
              if (item.pk == item1.pk) {
                flag = true;
              }
            })
          })
          if (!flag) {
            this.getFile();
          }
        }
      }
    },
  },
  created() {
    if (this.categoryParentId) {
      this.getAllTree();
    } else {
      this.init();
      this.limits = this.limit;
    }
  },
  mounted() {
    if (this.PDFOnly) {
      this.accept = 'application/pdf'
    }
    this.pmfileHeaders.Authorization = "Bearer " + this.$store.state.token;
    this.fileData.sys_id = this.$store.state.sys_id;
    this.fileData.org_id = this.$store.state.userinfo.org_id;
    this.fileData.biz_id = this.biz_id;
  },
  methods: {
    async getAllTree() {
      try {
        let res = await resource.getList('basetree', {parent: this.categoryParentId})
        if (res.length > 0) {
          this.data = res;
          this.fileData.category = res[0].pk;
          // 判断 field_01 是否为数字类型
          if (typeof res[0].field_01 === 'number' && !isNaN(res[0].field_01)) {
            this.limits = res[0].field_01; // 如果是数字类型，则直接赋值
          } else if (typeof res[0].field_01 === 'string' && !isNaN(Number(res[0].field_01))) {
            // 如果是字符串类型，并且可以转换为数字，则赋值转换后的数字
            this.limits = Number(res[0].field_01);
          } else {
            // 如果不是数字类型也不是能够转换为数字的字符串类型，则设置一个默认值
            this.limits = 999;
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    handleClick(tab) {
      if (this.categoryParentId) {
        let obj = this.data.filter(item => item.name == tab.label)[0];
        this.fileData.category = obj.pk;
        if (typeof obj.field_01 === 'number' && !isNaN(obj.field_01)) {
          this.limits = obj.field_01; // 如果是数字类型，则直接赋值
        } else if (typeof obj.field_01 === 'string' && !isNaN(Number(obj.field_01))) {
          // 如果是字符串类型，则尝试将其转换为数字
          this.limits = Number(obj.field_01);
        } else {
          // 如果不是数字类型也不是字符串类型，则设置一个默认值
          this.limits = 999;
        }
      } else {
        this.fileData.category = this.data.filter(item => item.name == tab.label)[0].pk;
      }
      this.chulishuju();
    },
    chulishuju() {
      if(this.AllList.length>0){
        this.itemList = this.AllList.filter(item => item.category == this.fileData.category);
      }
    },
    Preview(val) {
      if (!val.pk) {
        this.Pr(val.name, val.url);
      } else {
        this.Previews(val);
      }
    },
    async Pr(item, file) {
      const imageRegex = /\.(jpg|jpeg|png|webp)$/i;
      const mp4Regex = /\.mp4$/i;
      // 定义文档类型的正则表达式
      const docRegex = /(\.pdf)$/i;
      // 定义其他文档
      // const doc = /(\.doc|\.docx|\.xls|\.xlsx|\.txt)$/i;
      // 定义其他文件类型的正则表达式
      // const othersRegex = /(\.txt|\.csv|\.xlsx)$/i;
      if (docRegex.test(item)) {
        this.pdfurl = file
        this.pdfVisable = true;
      } else if (imageRegex.test(item)) {
        this.url = file;
        this.imgShow = true;
      } else if (mp4Regex.test(item)) {
        this.mp4url = file;
        this.mp4Show = true;
      } else {
        // 下载文件
        const link = document.createElement('a');
        link.href = file;
        link.setAttribute('download', item);
        document.body.appendChild(link);
        link.click();

      }
    },
    async Previews(item) {
      //用正则去识别不同文件类型，然后对应不同文件类型去做不同操作
      // 定义图片类型的正则表达式
      try {
        let res = await resource.getObj('fileupload', item.pk)
        const imageRegex = /\.(jpg|jpeg|png|webp)$/i;
        const mp4Regex = /\.mp4$/i;
        // 定义文档类型的正则表达式
        const docRegex = /(\.pdf)$/i;
        // 定义其他文档
        const doc = /(\.doc|\.docx|\.xls|\.xlsx|\.txt)$/i;
        // 定义其他文件类型的正则表达式
        const othersRegex = /(\.txt|\.csv|\.xlsx)$/i;
        // 利用正则表达式判断文件类型
        if (imageRegex.test(res.file)) {
          this.url = this.CVARS.BASE_HOST + res.file;
          this.imgShow = true;
        } else if (docRegex.test(res.file)) {
          this.pdfurl = this.CVARS.BASE_HOST + res.file
          this.pdfVisable = true;
        } else if (doc.test(res.file) || othersRegex.test(res)) {
          let a = document.createElement('a');
          a.href = this.CVARS.BASE_HOST + res.file;
          a.download = res.file_name;
          a.click();
        } else if (mp4Regex.test(res.file)) {
          this.mp4url = this.CVARS.BASE_HOST + res.file;
          this.mp4Show = true;
        } else {
          let a = document.createElement('a');
          a.href = this.CVARS.BASE_HOST + res.file;
          a.download = res.file_name;
          a.click();
          // this.$message.error('暂不支持预览或下载');
        }
      } catch (e) {
        this.$message.error('暂不支持预览或下载');
      }
    },
    getLast(val) {
      if (!val) return;
      let lowerVal = val.toLowerCase();
      let fileType = lowerVal.split('.').pop(); // 获取文件后缀
      switch (true) {
        case fileType === 'pdf':
          return 'fa-file-pdf';
        case ['doc', 'docx'].includes(fileType):
          return 'fa-file-word';
        case ['xls', 'xlsx'].includes(fileType):
          return 'fa-file-excel';
        case ['jpg', 'jpeg', 'png','webp'].includes(fileType):
          return 'fa-file-image';
        case fileType === 'zip':
          return 'fa-file-zipper';
        case fileType === 'txt':
          return 'fa-file-lines';
        case ['ppt', 'pptx'].includes(fileType):
          return 'fa-file-powerpoint';
        case ['mp4', 'avi', 'rmvb', 'rm', 'flv', 'mov', 'wmv', '3gp', 'mkv'].includes(fileType):
          return 'fa-file-video';
        default:
          return 'fa-file';
      }
    },
    async init() {
      try {
        let params = {
          name: '附件类型',
          no_root: true,
          org_id: this.$store.state.userinfo.org_id,
        }
        let resp = await resource.getList('flatbasetree', params);
        if (resp.length > 0) {
          let arr = resp.filter(item => {
            return item.level == 0;
          });
          if (arr.length === 0) {
            arr = [resp[0]];
          }
          this.categoryPK = arr[0].pk;
          await this.loadData();
        } else {
          let p = {name: '附件类型'}
          let resp = await resource.createObj('basetree', p);
          this.categoryPK = resp.pk;
          await this.loadData();
        }
      } catch (err) {
        console.error(err);
      }
    },
    async loadData() {
      try {
        let data = [];
        let params = {parent: this.categoryPK,};
        if (this.categoryName) {
          params.name = this.categoryName
        }
        let resp = await resource.getList('basetree', params);
        if (resp.length > 0) {
          data = resp;
        } else {
          let p = {
            name: this.categoryName || '附件类型',
            parent: this.categoryPK
          }
          let rsp = await resource.createObj('basetree', p)
          data = [rsp];
        }
        this.data = data;
        if (this.data.length > 0) {
          if (this.categoryName) {
            this.fileData.category = data[0].pk
          } else {
            this.fileData.category = this.data[0].pk
          }

          await this.chulishuju();

        }
      } catch (e) {
        console.error(e)
      }
    },
    async getFile() {
      try {
        if (this.value.length > 0) {
          let res = await resource.getList('fileupload', {pk_in: this.value.map(item => item).join(',')})
          res.forEach(item => {
            const existingFile = this.fileList.find(file => file.pk == item.pk);
            if (!existingFile) {
              this.fileList.push({
                name: item.file_name,
                pk: item.pk,
                user: item.user,
                create_time: item.create_time,
                category: item.category,
                iconClass: this.getLast(item.file)
              });
            }
          });
          if (!this.categoryName) {
            this.AllList = this.fileList;
            await this.chulishuju();
          } else {
            this.itemList = this.fileList;
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    async downLoad(val) {
      let resp = await resource.getObj('fileupload', val.pk)
      if (resp.file) {
        let link = document.createElement('a');
        link.href = resp.file;
        link.download = val.name;
        link.click();
      }
    },
    getOptionDataDisplay(value) {
      let option = this.data.filter((item) => {
        return item.pk == value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    changeFileLength(file, fileList) {
      let fileNames = file.raw.name;
      const fileExtension = fileNames.split('.').pop().toLowerCase(); // 获取文件扩展名并转换为小写
      if (this.uploadType && this.uploadType.length > 0) {
        if (!this.uploadType.includes(fileExtension)) {
          let items = this.uploadType.join(' , ')
          this.$message.warning(`文件类型仅支持: ${items} 格式`)
          this.handleFileRemove(file, fileList)
          return;
        }
      }
      if (file.size > 1024 * 1024 * this.size) {
        this.$message.error(`文件大小不能超过${this.size}M`);
        this.handleFileRemove(file, fileList)
        return
      }
      if (this.PDFOnly) {
        const isPDF = file.name.toLowerCase().endsWith('.pdf');
        if (!isPDF) {
          return this.$message.error('只能上传PDF格式的文件');
        }
      }
      let fileName = encodeURI(file.name) // 如果可以上传多个文件，这里需要用fileList.forEach()处理
      let newFile = new File([file.raw], fileName);
      newFile.uid = file.uid; // new File 没有uid属性，会导致组件底层报错，这里手动加上
      file.raw = newFile;  // 替换file的数据
      let aa = [];
      aa.push({...file, category: this.fileData.category})
      aa.forEach(item => {
        item.iconClass = this.getLast(item.file || item.file_name || item.name)
        let {category} = item;
        item.category = category;
      })
      this.fileList = this.fileList.concat(aa);
      let fileList1 = JSON.parse(JSON.stringify(this.fileList));
      let ids = fileList1.map(item => item.uid);
      this.$emit('input', ids);
      this.AllList = fileList1;
      this.chulishuju();
    },
    handleFileRemove(file, fileList) {
      //过滤掉删除的那一项数据
      let arr = fileList.filter(item => item.uid != file.uid)
      this.fileList = arr;
      this.itemList = arr.filter(item => item.category == this.fileData.category);
      this.AllList = arr;
      if (file && file.pk) {
        this.del.push(file)
      }
      this.fileList = this.fileList.filter(item => item.uid != file.uid)
    },
    async deleteFile(file) {
      let val = null;
      if (file.response) {
        val = file.response
      } else {
        val = file
      }
      this.$emit('input', this.fileList.map(item => item.uid).filter(item => item != val.uid));
      this.handleFileRemove(val, this.fileList);
    },
    handleExceed() {
      // 根据this.fileData.category改为每个类型限制limit的个数
      if (!this.categoryName) {
        this.$message.warning(`只可选择 ${this.limits} 个文件`);
      } else {
        this.$message.warning(`只可选择 ${this.limits} 个文件`);
      }
    },
    async pmfileBeforeRemove(file) {
      try {
        let res = await resource.deleteObj('fileupload', file.pk)
        if (res.status == 204) {
          // 过滤掉删除的那一项数据
          let arr = this.fileList.filter(item => item.pk !== file.pk)
          this.pmfileRemove(file, arr);
        }
        return res;
      } catch (e) {
        console.log('cancel remove');
      }
    },
    pmfileRemove(file, flist) {
      this.fileListChange('删除', file, flist);
    },
    async fileListChange(resp, file, filelist) {
      if (resp == '删除') {
        let arr = [];
        if (filelist.length > 0) {
          filelist.forEach(item => {
            arr.push({
              pk: item.pk,
              file_name: item.name || item.file_name,
              user: item.user,
              create_time: item.create_time,
              iconClass: this.getLast(item.file || item.file_name || item.name)
            })
          })
        }
        this.fileList = arr;
      } else {
        let arr = [];
        if (this.fileList.length > 0) {
          this.fileList.forEach(item => {
            arr.push(item.pk)
          })
        }
        arr.push(file.response.pk)
        this.$emit('input', arr);
        // 否则就是新增,把新的文件添加到fileList中
        this.fileList.push(file.response);
        this.fileList.forEach(item => {
          item.iconClass = this.getLast(item.file || item.file_name || item.name)
        })

      }
    },
    pmfileSuccess(resp, file, filelist) {
      this.loading = false
      this.$message.success('上传成功');
      this.fileListChange(null, file, filelist);
    },
    async changeloader() {
      // 过滤掉this.fileList待有pk的,存放到pkArr数组,然后把没有pk的放到另外一个数组
      let pkArr = [];
      let noPkArr = [];
      if (this.fileList.length > 0) {
        this.fileList.forEach(item => {
          if (item.pk) {
            pkArr.push(item.pk)
          } else {
            noPkArr.push(item)
          }
        })
        this.cunzaiPk = pkArr;
      }
      this.pkList = [];
      if (noPkArr.length > 0) {
        let res;
        for (let i = 0; i < noPkArr.length; i++) {
          let item = noPkArr[i];
          let formdatafile = new FormData();
          formdatafile.append("file", item.raw);
          formdatafile.append('sys_id', this.$store.state.userinfo.sys_id)
          formdatafile.append('org_id', this.$store.state.userinfo.org_id)
          formdatafile.append('category', item.category)
          formdatafile.append('file_name', item.name)
          try {
            res = await resource.createObj('fileupload', formdatafile)
            this.pkList.push(res.pk)
          } catch (e) {
            res = {
              status:'error'
            }
            this.$message.error('文件上传失败');
          }
        }
        return res;
      }
    },
    async submits() {
      try {
        let res;
        res = await this.changeloader();
        this.$emit('input', [...this.pkList, ...this.cunzaiPk])
        // 删除方法
        if (this.del && this.del.length > 0) {
          for (const item of this.del) {
            res = await this.pmfileBeforeRemove(item);
          }
        }
        return res;
      } catch (e) {
        console.error(e)
      }
    },
    onError() {
      this.$message.error('上传失败,请传入分类ID');
      this.loading = false
    },

  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-list-enter-active,
::v-deep.el-list-leave-active {
  transition: none;
}

::v-deep .el-list-enter,
::v-deep .el-list-leave-active {
  opacity: 0;
}

::v-deep .el-upload-list__item {
  transition: none !important;
  width: 80px;
  height: 80px;
}

.el-upload__tip {
  width: 80px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
  margin-top: 0px;
}

::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}

.uploadBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  cursor: pointer
}

.uploadBox-item {
  display: block;
  width: 100px;
  height: 100px;
  margin: 10px 10px 10px 0;
}

.uploadBox-ite {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column
}

.iconSize {
  font-size: 90px;
}

.item-name {
  width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center
}

.item-del {
  position: absolute;
  right: -5px;
  top: -10px;
  font-size: 25px;
}

.rotate-animation {
  transition: transform 0.3s ease;
}

.rotate-animation:hover {
  transform: rotate(135deg);
}

.add_btn {
  border-radius: 5px;
  width: 100px;
  height: 100px;
  border: 1px dashed #636363;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add_btn:hover {
  border: 1px dashed #409eff;
}

.hide {
  ::v-deep {
    .el-upload--picture-card {
      display: none;
    }

    .el-upload-list__item {
      border: none;
    }
  }
}


.show {
  ::v-deep {
    .el-upload-list__item {
      border: none;
    }
  }
}
</style>
