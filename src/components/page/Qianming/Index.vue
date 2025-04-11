<template>
  <el-card style="position:relative">
    <el-button
      type="warning"
      @click="ShuoMingTo"
      class="fix-shuoming"
      round
      plain
      icon="el-icon-notebook-2"
    >使用说明</el-button
    >
    <el-button
      type="primary"
      @click="ShiLiTo"
      class="fix-tab"
      plain
      round
      icon="el-icon-picture-outline">
      查看示例
    </el-button>
    <el-form inline>
    </el-form>
    <el-form inline>
      <el-form-item>
        <el-button @click="xinjian" type="primary" round icon="el-icon-plus">新建</el-button>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="searchForm.title" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="SearchData" type="primary" round icon="el-icon-search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="()=>{this.searchForm.title = null;this.page = 1;this.loadData();}" type="success" round icon="el-icon-refresh">全部</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" v-loading="loading" element-loading-text='加载中...' @selection-change="(data)=>batchDelData = data">
      <el-table-column type="selection" label="测试" width="55"></el-table-column>
        <el-table-column label="序号"  width="100">
            <template slot-scope="scope">
                <span>{{ (page - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
        </el-table-column>
          <el-table-column label="创建人"  prop="user_id" width="100">
            <template slot-scope="{ row }">
              {{get_use_option_data_display(row.user_id)}}
            </template>
          </el-table-column>
            <el-table-column label="创建部门"  prop="dep_id"  width="100">
              <template slot-scope="{ row }">
                {{get_use_dep_option_data_display(row.dep_id)}}
              </template>
            </el-table-column>
            <el-table-column label="创建时间"  prop="create_time">
              <template slot-scope="{ row }">
                {{ moment(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="文件" prop="file">
        <template slot-scope="{ row }">
          <span>{{row.file}}</span>
<!--          <template v-if="row.file && row.file.length === 0">-->
<!--            <span style="color: #3E83EB; cursor: pointer">暂无数据...</span>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            <span @click="chakan(row.file)" style="color: #3E83EB; cursor: pointer">{{ isPDFs(row.file) }}</span>-->
<!--          </template>-->
        </template>
      </el-table-column>
      <el-table-column label="操作"  fixed="right" width="410px">
        <template slot-scope="{row}">
          <div style="display:flex;justify-content: space-between">
            <el-button  round type="primary" icon="el-icon-full-screen" @click="erweima(row)" >二维码</el-button>
            <el-button  round type="primary"  @click="settings(row)" >设置签名位置</el-button>

            <el-button  round type="primary" icon="el-icon-edit" @click="editTable(row)" >更改文件</el-button>
            <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="删除后不可恢复，确定删除吗？" @confirm="delTable(row)">
              <el-button round slot="reference"  type="danger" icon="el-icon-remove" >删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <div class="batchClass">
      <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确定批量删除吗" @confirm="batchDelDataFn">
        <el-button icon="el-icon-delete" type="danger" round slot="reference">批量删除</el-button>
      </el-popconfirm>
    </div>
    <el-dialog :destroy-on-close="true" :title="form.pk?'更改文件':'新建'" :visible.sync="formDialogVisable" width="40%" :close-on-click-modal="false"
               :close-on-press-escape="false" top="3vh" center  @close="clearForm">
      <el-form :model='form' ref="form" label-width="100px" status-icon :rules="rule">
        <el-row>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 50%"></el-input>
          </el-form-item>
            <el-form-item label="文件" prop="file">
              <QMFileUpload
                            v-if="!readonly"
                            :file-list="form.file || []"
                            @on-change="(file, flist)=>{ this.pmfileSuccess(file, flist,'file')}">
              </QMFileUpload>
            </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>
    <pdfview v-if="pdfurl" :pdf-url="pdfurl" :visable="pdfVisable" @close="pdfVisable=false"></pdfview>

    <el-dialog :visible.sync="viewQR" @before-close="closeQR" width="auto" style="margin: 0 auto" class="qianming" top="0vh">
      <el-card shadow="always">
        <div v-if="qianmingData.length > 0" >
          <div style="display: flex; flex-direction: row; align-items: center; flex-wrap: wrap; max-height: 600px; overflow: auto;max-width: 900px;" >
            <div v-for="(item,index) in qianmingData" :key="index">
              <div style="padding: 0px 10px">
                <Qr v-if="viewQR" :url="url+item.pk+'&text='+item.text" style="margin: auto "></Qr>
                <div class="tips" style="text-align: center; margin: 20px 0 20px 0">{{ item.text }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else style="width: 300px;">
          <el-empty description="未设置签名或都已签完！！！"></el-empty>
        </div>
      </el-card>
    </el-dialog>


    <el-dialog :show-close="false" top="5%" destroy-on-close :visible.sync="settingDialogVisable" v-loading="saveloading" element-loading-text="保存中..."
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)" fullscreen :close-on-click-modal="false">
      <iframe v-if="settingDialogVisable" :key="reloadSignal" ref="iframe" style="height: 730px;width: 100%;" id="fd-jspdf" name="fd-jspdf" :src="`/pdf-annotations/index.html?file=${pdfUrl}`" @load="initLoaded"></iframe>
      <div slot="footer" >
        <el-button @click="cancelPDF" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="saveData">确定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
//
// TEMPLATE_ID: FT343995190686593024
// 字段说明:
// user_id:创建人
// dep_id:创建部门
// create_time:创建时间
// file:文件
import XLSX from "xlsx";
import resource from "@/resource";
import {mapState} from "vuex";
import moment from "moment";
import pdfview from "@/components/common/PDFViewer.vue";
import Qr from "@/components/common/QR.vue";
import QMFileUpload from "@/components/common/QMFileUpload";
const TEMPLATE_ID = "FT343995190686593024";
const TEMPLATE_APP_ID = "FT395048722988179456";
import axios from "axios";
export default {
  name: "",
  data() {
    return {
      form: {
        user_id: null,
        dep_id: null,
        create_time: null,
        file: [],
        title: null,
      },
      searchForm:{
        title: null,
      },
      headers: {
        Authorization: null
      },
      fileData: {
        sys_id: null,
        org_id: null
      },
      data: [],
      batchDelData: [],
      loading: false,
      formDialogVisable: false,
      excelDialogVisable: false,
      page: 1,
      pageSize: 10,
      total: 0,
      chckedData: [],
      settingsDialogVisable: false,
      readonly: false,
      fileFormatError: false,
      alluser: [],
      use_dep_option_data: [],
      pdfurl: null,
      pdfVisable: false,
      viewQR: false,
      qrcode: null,
      url: null,
      settingDialogVisable: false,
      pdfUrl: null,
      fabricHistoryJson: [],
      qmform:{
        user_id: null,
        dep_id: null,
        create_time: null,
        weizhi: null,
        guanlian_id: null,
      },
      currentPk: null,
      qianmingData:[], // 需要签名的二维码数组
      iframeWin: null,
      isSave: false,
      saveloading:false,
      rule:{
        file: [
          { required: true, message: "请上传文件", trigger: "change" },
        ],
        title:[
          { required: true, message: "请输入标题", trigger: "blur" },
        ]
      },
      reloadSignal:0,
  }
  },
  beforeDestroy() {
    window.removeEventListener("message", this.handleMessage);
  },
  methods: {
    xinjian(){
      if(!this.quanxian.app签名 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.formDialogVisable=true;
        this.clearForm()
      }
    },
    SearchData(){
      this.page = 1;
      this.loadData();
    },
    initLoaded(){
      if(this.isSave) {this.isSave = false; return}
      this.iframeWin = this.$refs.iframe.contentWindow;
      this.iframeLoaded();
      window.addEventListener("message", this.handleMessage);
    },
    async iframeLoaded(val){
      let params;
      if(val == 'save'){
        params = val
      }else{
        let params2 = {
          guanlian_id: this.currentPk,
          template_id: TEMPLATE_APP_ID
        }
        let resp =await resource.getList("data", params2);
        this.qmform =resp.length>0 ?  JSON.parse(JSON.stringify(resp[0])) : [];
        params= this.qmform.length == 0 ? [] : JSON.parse(this.qmform.weizhi);
        this.fabricHistoryJson = params.length>0? params.map(item=>{
          return {
            objects:item.objects,
            version:item.version
          }
        }): []
        params = JSON.parse(JSON.stringify(this.fabricHistoryJson))
      }
      this.iframeWin.postMessage({
        params: params  /*在iframe页面中接收通过key也就是param接收，因此传输的数据可以是对象，包含多个key以及对应的数据*/
      }, "*");

    },
    reloadIframe() {
      // 修改 reloadSignal 的值，将触发重新加载 iframe
      this.reloadSignal += 1;
    },
    handleMessage(event) {
      // 获取从iframe页面中传过来的值
      let cmd = event.data.cmd;
      let params = event.data.params;
      if (cmd == "save") {
        this.saveUpdatePDF(params)
      }else{
        this.fabricHistoryJson = params;
      }
    },
    async saveUpdatePDF(params) {
      try {
        let fileName = `${new Date().getTime()}.pdf`;
        let formdatafile = new FormData();
        formdatafile.append("file", params, fileName);
        formdatafile.append("org_id",  this.userinfo.org_id);
        let resp = await resource.createObj('fileupload', formdatafile);
        await resource.updateObj("data", this.qmform.pk, {
          update_pdf_id:resp.pk,
          template_id: TEMPLATE_APP_ID
        });
        this.$message.success("编辑成功!")
        this.settingDialogVisable = false;
        this.saveloading = false;
      } catch (e) {
        console.log(e)
      }

    },
    async saveData(){
      this.saveloading = true
      try {
        let fabricJson = [];
        this.fabricHistoryJson.map(item=>{
          let dataArray = item.length == 0?{ "version": "4.3.0", "objects": []}:item[item.length-1]
          fabricJson.push(dataArray)
        })
        this.qmform.weizhi = fabricJson;
        this.qmform.guanlian_id = this.currentPk;
        this.qmform.create_time = this.moment().format("YYYY-MM-DD HH:mm:ss");
        this.qmform.user_id = this.userinfo.pk;
        this.qmform.dep_id = this.userinfo.department;
        let form = {...this.qmform}
        for (const key in form) {
          if (form[key] !== null && typeof form[key] === "object") {
            form[key] = JSON.stringify(form[key]);
          }
        }
        if (form.pk) {
          await resource.updateObj("data", form.pk, {
            ...form,
            template_id: TEMPLATE_APP_ID
          });
          this.$message.success("编辑成功!")
        } else {
          this.qmform = await resource.createObj("data", {
            ...form,
            template_id: TEMPLATE_APP_ID
          });
          this.$message.success("新建成功!")
        }
        await this.iframeLoaded('save');
        this.isSave = true;
      }catch (e) {
        console.log(e)
      }
    },
    async settings(row){
      let bb = {...row};
      this.pdfUrl =JSON.parse(bb.file)[0].file;
      this.currentPk = bb.pk;
      this.reloadIframe();
      this.settingDialogVisable = true;
    },
    cancelPDF(){
      this.settingDialogVisable = false;
    },
    ShuoMingTo() {
      this.$router.push({ name: "qianming-shuoming" });
    },
    ShiLiTo() {
      this.$router.push({name:'qianming-shili'});
    },
    async chakan(val) {
      if(val && JSON.parse(val).length>0){
        let pdf = JSON.parse(val)[0].file;
        let isTure = this.isPDF(pdf);
        if (isTure) {
          this.pdfurl = pdf;
          this.pdfVisable = true;
        } else {
          window.open(pdf);
        }
      }
    },
    isPDF(filename) {
      return filename && filename.toLowerCase().endsWith('.pdf');
    },
    isPDFs(val) {
      // 判断文件后缀是否是pdf
       if(val && JSON.parse(val).length>0){
         let pdf = JSON.parse(val)[0].file;
         let suffix = pdf.split(".");
         let suffix1 = suffix[suffix.length - 1];
         if (suffix1 == "pdf" || suffix1 == "PDF") {
           return '查看';
         } else {
           return '查看';
         }
       }
    },
    cancel(){
      this.formDialogVisable=false;
      this.clearForm();
    },
    async erweima(val){
      let param = {
        guanlian_id:val.pk,
        template_id: TEMPLATE_APP_ID
      }
      let resp = await resource.getList("data",param);
     if(resp.length>0){
       let arr = [];
       let data = JSON.parse(resp[0].weizhi);
       data.forEach(item=>{
         if(item && item.objects.length>0){
           item.objects.forEach(item1=>{
             if(item1.type == 'textbox'){
               arr.push({
                 left:item1.left,
                 top:item1.top,
                 text:item1.text,
                 pk:val.pk
               })
             }
           })
         }
       })
       this.qianmingData = arr;
       this.viewQR = true;
     }else{
       this.$message.error('您还未设置签名位置')
     }
      this.url = window.location.origin + "/mobile/h5qianming?pk=";


    },
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID
      }
      if(this.searchForm.title){
        params.title_like = this.searchForm.title;
      }
      let res = await resource.getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },
    pmfileSuccess(file, flist, value) {
      this.form[value] = flist.map((item) => {
        return {
          name: item.name,
          file: item.response ? item.response.file : item.file,
          pk: item.response ? item.response.pk : item.pk,
          category: item.response ? item.response.category : item.category,
          desc: item.response ? item.response.desc : item.desc,
          file_name: item.response ? item.response.file_name : item.file_name
        };
      });
    },
    loadAll(){
      this.page = 1;
      this.searchForm = {
        user_id: null,
        title: null,
      };
      this.loadData();
    },
    async submit() {
      let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)));
      if (valid) {
        this.form.user_id = this.userinfo.pk;
        this.form.dep_id = this.userinfo.department;
        this.form.create_time = this.moment().format("YYYY-MM-DD HH:mm:ss");
        let form = {...this.form}
        for (const key in form) {
          if (form[key] !== null && typeof form[key] === "object") {
            form[key] = JSON.stringify(form[key]);
          }
        }
        try {
          if (form.pk) {
            await resource.updateObj("data", form.pk, {
              ...form,
              user_id:this.userinfo.pk,
              template_id: TEMPLATE_ID
            });
            this.$message.success("编辑成功!")
          } else {
            await resource.createObj("data", {
              ...form,
              user_id:this.userinfo.pk,
              template_id: TEMPLATE_ID
            });
            this.$message.success("新建成功!")
          }
          this.formDialogVisable = false;
          this.clearForm();
          this.loadData()
        } catch (error) {
          console.error(error)
        }
      }else{
        this.$message.warning("请先上传文件!")
      }

    },
    editTable(row) {
      let form = {...row}
      for (const key in form) {
        if (form[key] && typeof form[key] === 'string' && form[key].startsWith('[') && form[key].endsWith(']')) {
          form[key] = JSON.parse(form[key]);
        }
      }
      this.form = JSON.parse(JSON.stringify(form));

      this.formDialogVisable = true
    },
    get_use_dep_option_data_display(value) {
      let option = this.use_dep_option_data.filter((item) => {
        return item["pk"] === value;
      });
      if (option.length > 0) return option[0]["name"];
      return value;
    },
    get_use_option_data_display(value) {
      let option = this.alluser.filter((item) => {
        return item["pk"] === value;
      });
      if (option.length > 0) return option[0]["full_name"];
      return value;
    },
    async delTable(row) {
      try {
        await resource.deleteObj("data", row.pk, row.sys_id,row.template_id)
        this.$message.success("删除成功!")
        this.loadData()
      } catch (err) {
        this.$message.error("删除失败!")
      }
    },
    excelExport(){
      let header = [
        "创建人",
        "创建部门",
        "创建时间",
        "文件",
      ]
      let tmp = [];
      this.data.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) obj[this.excelDownloadTranslate[key]] = i[key];
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "app签名.xlsx");
    },
    clearForm() {
      this.form = {
        user_id: null,
        dep_id: null,
        create_time: null,
        file: [],
      }
      // this.$refs.FormComp.$refs.form.resetFields();
    },
    // 关闭二维码
    closeQR() {
      this.qrcode.clear();
    },

    async batchDelDataFn() {
      if (this.batchDelData.length === 0) {
        return this.$message.error("请选择要删除的数据!");
      }
      try {
        let pk_list = this.batchDelData.map((i) => i.pk); //data-delete
        await resource.createObj("data-delete", {
          template_id: TEMPLATE_ID,
          querys: {pk: pk_list.join(",")},
        });
        this.$message.success("批量删除成功!");
        this.loadData();
      } catch (error) {}
    },

    async getLocalDataSource() {
      this.headers.Authorization = "Bearer " + this.$store.state.token;
      this.fileData.sys_id=this.$store.state.sys_id;
      this.fileData.org_id=this.$store.state.userinfo.org_id;
      this.alluser = await resource.getList('usermin');
      this.use_dep_option_data = await resource.getList("flatdepartment", {});
    },
    handlefileExceed(){
      this.$message.warning("只可选择 1 个文件");
    },
    handlefileRemove(field){
      this.form[field]=null;
    },
    handlefilePreview(res){
      if(res.url){
        let a = document.createElement("a");
        a.href = res.url;
        a.target = "_blank";
        a.click();
      }
    },
    handlefileSuccess(res,field){
      if(res.file){
        this.form[field] = res.file;
      }
    },
    // 判断文件类型
    isImg(file) {
      if (!file) return;
      const pdf = file.substr(file.lastIndexOf(".") + 1) === "pdf";
      const jpg = file.substr(file.lastIndexOf(".") + 1) === "jpg";
      const jpeg = file.substr(file.lastIndexOf(".") + 1) === "jpeg";
      const png = file.substr(file.lastIndexOf(".") + 1) === "png";
      if (pdf || jpeg || jpg || png) {
        return true;
      } else {
        return false;
      }
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        val.forEach((item) => {
          item.show = true;
        });
      } else {
        this.columns.forEach((item) => {
          item.show = false;
        });
      }
      this.chckedData = val;
    },
    // 处理时间方法
    dateFormat(time) {
      if (!time) return '';
      let date = this.moment(time).format("YYYY-MM-DD");
      return date;
    },
  },
  created() {
    this.loadData();
    this.getLocalDataSource();
  },
  computed:{
    moment() {
      return moment
    },
    ...mapState(["userinfo","httpurl","quanxian"]),
    excelDownloadTranslate(){
      return {
        "user_id":"创建人",
        "dep_id":"创建部门",
        "create_time":"创建时间",
        "file":"文件",

      }
    }
  },
  components: {
    Qr,
    pdfview,
    QMFileUpload,
  }
}
</script>
<style scoped>
.batchClass {
position: absolute;
right: 20px;
bottom: 17px;
}
.qianming{
  max-width: 100%;
  min-width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
