<template>
  <el-card>
    <el-form>
      <el-form-item>
        <el-button icon="el-icon-plus" type="primary" @click="xinjian">新建物品管理</el-button>
        <el-button type="warning" @click="ShuoMingTo" class="fix-shuoming" round icon="el-icon-notebook-2" plain>使用说明</el-button>
        <el-button type="primary" @click="ShiLiTo" class="fix-tab" round icon="el-icon-picture-outline" plain>查看示例
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" row-key="pk" border stripe :tree-props="{ children: 'items' }" default-expand-all>
      <el-table-column label="物品名称" prop="name"></el-table-column>
      <el-table-column label="操作" align="center" width="700" >
        <template slot-scope="{ row }">
           <div style="display: flex;justify-content: center">
              <el-button style="margin-left: -90px;margin-right: -3px" type="success"  v-if="row.level === 1"  icon="el-icon-tickets" @click="code(row)" round size="mini">二维码</el-button>
               <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addChildren(row.pk)" round size="mini" :disabled="row.level == 4">新建子物品</el-button>
               <el-button type="info" icon="el-icon-edit" round @click="editTreeNode(row)" size="mini">编辑</el-button>
               <el-button type="success" icon="el-icon-folder-add" @click="addItems(row)" round size="mini">物品入库</el-button>
               <el-popconfirm title="确定删除吗？" @confirm="delTreeNode(row.pk)" style="margin-left: 10px">
                 <el-button type="danger" round slot="reference" size="mini" icon="el-icon-remove">删除</el-button>
               </el-popconfirm>
           </div>
        </template>
      </el-table-column>
    </el-table>
    <router-view></router-view>
    <el-dialog :visible.sync="addEditVisable" center width="40%" :close-on-click-modal="false" :title="form.pk ? '编辑' : '新建'" @closed="clearDatas">
      <el-form v-if="addEditVisable" :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="物品名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="field_01">
          <el-input v-model="form.field_01"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="field_02">
          <el-input v-model="form.field_02"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="fileList">
          <el-upload :action="BASE_HOST+'/api/v1/fileupload/'" :data="uploadData"
                     :headers="headers" list-type="picture-card" :limit="9"
                     :on-exceed="handleExceed" :on-success="handleSuccess" :on-preview="handlePictureCardPreview" :file-list="fileList" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addEditVisable = false" icon="el-icon-close">取消</el-button>
        <el-button type="primary" @click="submit" icon="el-icon-check">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="500px"  append-to-body>
      <div style="width: 400px;height: 400px;margin: 0 auto">
        <img width="100%" height="100%" :src="dialogImageUrl" alt="">
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showCodeVisable"
      width="20%"
      style="text-align: center"
    >
      <div style="display:flex;align-items: center;justify-content: center;flex-direction: column">
        <!--       <qr-code v-if="viewQR" :url="url" ref="qrCodeUrl"></qr-code>-->
        <Qr v-if="showCodeVisable" :url="codeInfo.codeurl" style="margin: auto "></Qr>
        <div style="margin-top: 30px;text-align: center" >点击二维码保存图片</div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import QrCode from "@/components/common/QrCode.vue";
import resource from "../../../resource";
import {BASE_HOST} from "@/constvars";
import { mapState } from "vuex";
import Qr from "@/components/common/QR.vue";
export default {
  name: "WuPingLeiBie",
  computed: {
    ...mapState(["httpurl", "userinfo","quanxian","token"]),
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: null,
      BASE_HOST,
      data: [],
      addEditVisable: false,
      showCodeVisable: false,
      parentPk: null,
      form: {
        name: "", // 物品名称
        filed_01:"", // 规格型号
        filed_02:"", // 单位
        text_01: [], // 图片
      },
      uploadData: {
        sys_id: 5,
        biz_id: 1,
      },
      rules: {
        name: { required: true, message: "请填写物品名称",trigger: 'blur' },
        field_01: { required: true, message: "请填写规格型号",trigger: 'blur' },
        field_02: { required: true, message: "请填写单位",trigger: 'blur' },
      },
      codeInfo: {
        codeurl: "",
        title: "",
      },
      headers: {
        Authorization: "",
      },
      categoryName: '物品类别',
      categoryPK: null,
      fileList: [],
      Img: [],
    };
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(resp,fileList,file) {
      if (resp.file) {
        this.Img.push(resp.file);
      }
    },
    handleRemove(file, fileList) {
      this.Img = this.Img.filter(i=>i!==file.url);
      this.fileList = this.fileList.filter(i=>i.url!==file.url);
    },
    handleExceed() {
      this.$message.warning("只允许上传9张图片!");
    },
    xinjian(){
      if(!this.quanxian.物品领用 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.Img = [];
        this.fileList = [];
        this.addEditVisable = true;
      }

    },
    code(row) {
      this.codeInfo.codeurl = `${window.location.origin}/mobile/wplogin?pk=${row.pk}`;
      this.codeInfo.title = row.name;
      this.showCodeVisable = true;
    },
    async getTree() {
      let res = await resource.getObjFromList("basetree", {
        name:this.categoryName,
      });
      this.data = res.items;
      this.categoryPK = res.pk;
    },
    async init(){
      try {
        let resp = await this.$http.get(`/flatbasetree/`,{ params: { name: this.categoryName },org_id:this.userinfo.org_id });
        if(resp.data.length>0){
          // this.categoryPK = resp.data[0].pk;
          await this.getTree();
        }
        else{
          let resp = await this.$http.post('/flatbasetree/', { name: this.categoryName });
          // this.categoryPK = resp.data.pk;
          await this.getTree();
        }
      } catch (err) {
        this.$message.error('加载数据错误！');
      }
    },
    async submit() {
      let valid = await new Promise((resolve) =>
        this.$refs.form.validate((validate) => resolve(validate))
      );
      if (valid) {
        try {
          this.form.text_01 = this.Img ? JSON.stringify(this.Img) : JSON.stringify([])
          // 可根据返回值判断附件上传是否成功
          let data = {
            ...this.form,
          }
          if (this.form.pk) {
            await resource.updateObj("basetree", this.form.pk, data);
            this.$message.success("编辑成功!");
          } else {
           let res =  await resource.createObj("basetree", {
              ...data,
              parent: this.categoryPK ? this.categoryPK : null,
            });
            this.$message.success("新建成功!");
          }
          this.$refs.form.resetFields();
          await this.getTree();
          this.addEditVisable = false;
        } catch (error) { }
      } else {
        this.$message.error("请检查表单!");
      }
    },
    addChildren(pk) {
      this.categoryPK = pk;
      this.addEditVisable = true;
      this.Img = [];
      this.fileList = []
    },
    editTreeNode(row) {
      this.Img = [];
      this.form = JSON.parse(JSON.stringify(row));
      if(row.text_01){
        this.fileList = [];
        let item = row.text_01 ? JSON.parse(row.text_01) : []
        if(item && item.length>0){
          item.forEach(i=>{
            this.fileList.push({
              url:i,
              name: i.split('/').pop(),
            })
            this.Img.push(i)
          })
        }
      }else{
        this.Img = [];
        this.fileList = [];
      }
      this.addEditVisable = true;
    },

    async delTreeNode(pk) {
      let result = this.parentTree(this.data, pk);
      let rootPk = result[result.length - 1].pk;
      try {
        await resource.deleteObj("basetree", pk);
        this.$message.success("删除成功!");
        this.getTree();
      } catch (error) {
        this.$message.error("删除失败!");
      }
    },
    parentTree(arr, id) {
      //arr 所有的树数据 id 某个子节点的id
      var temp = [];
      var callback = function (nowArr, id) {
        //先定义个函数寻找子节点位置 找到后 再找改节点父元素位置 以此类推
        for (var i = 0; i < nowArr.length; i++) {
          var item = nowArr[i];
          if (item.pk === id) {
            temp.push(item);
            callback(arr, item.parent); //parent 父级ID
            break;
          } else {
            if (item.items.length > 0) {
              callback(item.items, id); //items 子节点字段名称
            }
          }
        }
      };
      callback(arr, id);
      return temp; //最后返回
    },
    clearDatas() {
      this.form = { name: "",field_01:"",field_02:"",text_01: [] };
      this.parentPk = null;
    },
    addItems(row) {
      let result = this.parentTree(this.data, row.pk);
      let root = result[result.length - 1].pk;
      this.$router.push({
        name: "additems",
        params: { pk: row.pk, root: root, categoryName: row.name },
      });
    },
    ShuoMingTo() {
      this.$router.push({ name: "wplb-shuoming" });
    },
    ShiLiTo() {
      this.$router.push({ name: "wupinzhanshi" });
    },
  },
  activated() {
    this.init();
  },
  created() {
    this.init();
  },
  mounted() {
    this.headers.Authorization = `Bearer ${this.token}`;
  },
  components: {
    Qr,
    QrCode,
  },
};
</script>

<style></style>
