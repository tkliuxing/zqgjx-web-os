<template>
  <el-card>
    <div>
      <el-button
        type="primary"
        @click="xinjian"
        round
        icon="el-icon-plus"
        >新建内容</el-button
      >
      <!-- <el-button type="primary" @click="downPrint" round icon="el-icon-download"
        >批量下载二维码</el-button
      > -->
      <!-- <qr-codedown ref="downcode" url="/articleinfo?id=" :goodsData="data"></qr-codedown> -->
      <el-button
        type="primary"
        @click="ShiLiTo"
        class="fix-tab"
        round
        plain
        icon="el-icon-picture-outline"
        >查看示例</el-button
      >
      <el-button
        type="warning"
        @click="ShuoMingTo"
        class="fix-shuoming"
        round
        plain
        icon="el-icon-notebook-2"
        >使用说明</el-button
      >
    </div>
    <el-table
      stripe
      border
      :data="data"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      style="margin-top: 1rem"
    >
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="时间" width="180">
        <template slot-scope="{ row }">
          {{ transTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            round
            icon="el-icon-full-screen"
            @click="creatQrCode(row.pk)"
            >二维码</el-button
          >
          <el-button
            type="primary"
            size="mini"
            round
            icon="el-icon-edit"
            :loading="editState"
            @click="edit(row)"
            >编辑</el-button
          >
          <el-popconfirm title="确定删除吗？" @confirm="del(row.pk)">
            <el-button class="deleteButton" type="danger" size="mini" round slot="reference" icon="el-icon-remove">
              删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[15, 30, 50, 100, 500, 1000]"
      :page-size="pageSize"
      @size-change="
        (pageSize) => {
          this.page = 1;
          this.pageSize = pageSize;
          this.loadData();
        }
      "
      :current-page.sync="page"
      @current-change="loadData"
      :total="total"
    >
      ></el-pagination
    >
    <el-dialog
      title="新建"
      :visible.sync="createDialogVisiable"
      width="50%"
      center
      :close-on-click-modal="false"
      @closed="clearFormData('form')"
    >
      <el-form :model="form" ref="form">
        <el-form-item
          label="标题"
          prop="title"
          :rules="[{ required: true, message: '请填写标题' }]
          "
        >
          <el-input style="width: 100%"
           placeholder="限制长度为100个字符"
          maxlength="100" v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <editor-bar
            v-model="form.content"
            :isClear="isClear"
            @change="change"
            style="margin-top: 40px"
          ></editor-bar>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button icon="el-icon-close" @click="createDialogVisiable = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="submitForm('form')"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="二维码"
      :visible.sync="viewQR"
      @before-close="closeQR"
      width="20%"
    >
      <!--   替换dialog中title   -->
      <span slot="title" >
        {{form.title}}
      </span>

<!--      <qr-code v-if="viewQR" :url="url"  style="margin: auto "></qr-code>-->
      <Qr v-if="viewQR" :url="url" style="margin: auto "></Qr>
      <div class="tips" style="text-align: center">点击二维码保存图片</div>
    </el-dialog>
  </el-card>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
import resource from "@/resource";
import EditorBar from "@/components/common/EditorBar";
import QrCode from "@/components/common/QrCode";
import QrCodedown from "@/components/common/QrCodedown";
import Qr from '@/components/common/QR.vue';

const empty_form = {
  pk: null,
  title: null,
  content: "",
}

export default {
  components: {
    EditorBar,
    QrCode,
    QrCodedown,
    Qr
  },
  computed: {
    ...mapState(["httpurl",'userinfo',"quanxian"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        ...empty_form
      },
      data: [],
      createDialogVisiable: false,
      viewQR: false,
      qrcode: null,
      isClear: false,
      url: null,
      editState: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    xinjian(){
      if(!this.quanxian.扫码展示 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.createDialogVisiable = true;
      }
    },
    // 加载内容
    async loadData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.zhanshi_biz,
        src_id: this.$sourceCode.source_id,
      };
      let res = await resource.getList("article", params);
      this.data = res.data;
      this.total = res.count;
    },
    // 提交
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            ...this.form,
            biz_id: this.$bizCode.zhanshi_biz,
            src_id: this.$sourceCode.source_id,
          };
          if (data.pk) {
            await resource.updateObj("article", data.pk, data);
            this.$message.success("编辑成功!");
          } else {
            await resource.createObj("article", data);
            this.$message.success("新建成功!");
          }
          this.createDialogVisiable = false;
          this.loadData();
        } else {
          this.$message.error("请检查所填项!");
          return false;
        }
      });
    },
    // 删除
    async del(pk) {
     try{
          await resource.deleteObj("article", pk);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          setTimeout(() => {
            this.loadData();
          }, 200);
        }
        catch(e) {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        }
    },
    // 清除数据
    clearFormData(formName) {
      this.form = {...empty_form};

    },
    // 获取编辑数据
    async edit(obj) {
      this.editState = true;
      let data = {
        biz_id: this.$bizCode.zhanshi_biz,
        src_id: this.$sourceCode.source_id,
      };
      let res = await resource.getObj("article", obj.pk, data);
      this.form = res;
      this.createDialogVisiable = true;
      this.editState = false;
    },
    // 二维码生成
    async creatQrCode(pk) {
      this.viewQR = true;

      this.url = window.location.origin + "/mobile/articleinfo?pk=" + pk;
    },
    // 批量生成二维码
    downPrint(){
      this.$refs.downcode.handleBatchPrintCode()
    },
    closeQR() {
      this.qrcode.clear();
    },
    change(val) {
      this.form.content = val;
    },
    transTime(timeStr) {
      return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
    },
    ShiLiTo() {
      this.$router.push("/saomazhanshi");
    },
    ShuoMingTo() {
      this.$router.push({ name: "zhanshi-shuoming" });
    },
  },
  mounted() {},
};
</script>

<style scope>
.tips {
  color: #333;
  line-height: 44px;
  text-align: center;
}

.deleteButton{
 margin-left: 10px;
}

img {
  width: auto;
  height: auto;
  max-width: 100%;
  /* 只要宽度100% 结合前面 auto就可以了 */
}
</style>
