<template>
  <div class="ShiTi">
    <el-card class="box-card">
      <el-button
        type="primary"
        round
        icon="el-icon-plus"
        @click="xinjian"
        >新建问卷</el-button
      >
      <el-button
        type="primary"
        @click="ShiLiTo"
        class="fix-tab"
        plain
        round
        icon="el-icon-picture-outline"
        >查看示例
      </el-button>
      <el-button
        type="warning"
        @click="ShuoMingTo"
        class="fix-shuoming"
        round
        plain
        icon="el-icon-notebook-2"
        >使用说明</el-button
      >
      <el-table
        v-loading="loading"
        element-loading-text="正在加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        border
        :data="data"

        style="margin-top: 1rem ;text-align: center"
      >
        <el-table-column label="名称" >
          <template slot-scope="{ row }">
            <el-link type="primary" target="_blank" @click="targetLink(row)">
              {{ row.name }}
              <i class="el-icon-link" style="margin-left: 1px"></i>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="is_enabled" align="center" label="是否可用" width="70">
        </el-table-column>
        <el-table-column prop="need_login" align="center" label="是否注册" width="70">
        </el-table-column>
        <el-table-column prop="start_time" align="center" label="生效日期" width="100">
        </el-table-column>
        <el-table-column prop="end_time" align="center" label="截止日期" width="100">
        </el-table-column>
        <el-table-column label="操作" width="450">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              round
              @click="creatQrCode(scope.row.pk)"
              >二维码</el-button
            >
            <el-button

              type="primary"
              size="mini"
              round
              :loading="editState"
              @click="editRow(scope.row.pk)"
              >编辑</el-button
            >
            <el-button
              type="primary"
              size="mini"
              round
              @click="toTimu(scope.row)"
              >题目</el-button
            >
            <el-button
              type="primary"
              size="mini"
              round
              @click="toTongji(scope.row)"
              >统计</el-button
            >
            <el-button
              type="success"
              size="mini"
              round
              @click="toJieguo(scope.row)"
              >结果</el-button
            >
            <el-popconfirm title="确定删除吗？" @confirm="deleteRow(scope.row)">
            <el-button type="danger" class="deleteButton" size="mini" round slot="reference" icon="el-icon-remove">
              删除</el-button>
          </el-popconfirm>
            <!-- <el-button
              type="danger"
              size="mini"
              round
              @click="deleteRow(scope.row)"
              >删除</el-button
            > -->
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
      </el-pagination>
    </el-card>
    <el-dialog
      title="问卷"
      :visible.sync="createDialogVisiable"
      @closed="clearFormData('form')"
      width="50%"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="110px">
        <el-form-item prop="name" label="问卷名">
          <el-input v-model="form.name" maxlength="120" show-word-limit></el-input>
        </el-form-item>
        <el-form-item prop="desc" label="问卷描述">
          <el-input type="textarea" :rows="3" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item prop="is_enabled" label="是否启用">
          <el-switch
            v-model="form.is_enabled"
            inactive-color="#ff4949"
            active-text="允许答题"
            inactive-text="禁止答题"
            active-value="是"
            inactive-value="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item prop="start_time"  label="生效日期" :rules="{ required: true, message: '必填项!' }">
          <el-date-picker
            v-model="form.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="timedata"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="end_time" label="截止日期" :rules="{ required: true, message: '必填项!' }">
          <el-date-picker
            v-model="form.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="timedata"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="start_time" label="是否需要登录">
          <el-switch
            v-model="form.need_login"
            active-text="需要登录"
            inactive-text="无需登录"
            active-value="是"
            inactive-value="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="主题色" prop="color">
          <el-color-picker
            v-model="form.color"
            :predefine="predefineColors"
          ></el-color-picker>
        </el-form-item>
        <el-form-item label="背景图片">
          <my-upload @change="changeBackground" />
          <el-image
            v-if="form.background"
            style="width: 100px; height: 100px; margin-top: 5px"
            :src="form.background"
            :preview-src-list="[form.background]"
          ></el-image>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitShiJuan('form')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="viewQR"
      @before-close="closeQR"
      width="20%"
    >
<!--      <qr-code-->
<!--        v-if="viewQR"-->
<!--        :url="url"-->
<!--        ref="qrCodeUrl"-->
<!--        style="display: flex; justify-content: center;margin: auto "-->

<!--      ></qr-code>-->
      <Qr v-if="viewQR" :url="url" style="margin: auto "></Qr>
<!--      <div class="tips" style="font-weight: bold" >地址：{{ url }}</div>-->
      <div class="tips" style="text-align: center">点击二维码保存图片</div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import resource from "@/resource";
import SingleFileUpload from "@/components/common/SingleFileUpload";
import { PREDEFINE_COLORS } from "@/constvars";
import QrCode from "@/components/common/QrCode";
import Qr from "@/components/common/QR.vue";
const FORM = {
  pk: null,
  name: "",
  desc: "",
  start_time: "",
  end_time: "",
  need_login: "否",
  is_enabled: "是",
  color: "#e41e1e",
  background: "",
  template_id: "FT138890411468054528",
};
export default {
  name: "ShiTi",
  components: {Qr, "my-upload": SingleFileUpload, QrCode },
  computed: {
    ...mapState(["org_id", "httpurl",'userinfo',"quanxian"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      data: [],
      editState: false,
      viewQR: false,
      predefineColors: PREDEFINE_COLORS,
      rules: {
        name: [{ required: true, message: "请填写问卷名" }],
      },
      form: {
        ...FORM,
      },
      qrcode: null,
      url: null,
      loading: false,
      createDialogVisiable: false,
    };
  },
  methods: {
    xinjian(){
      if(!this.quanxian.扫码调研问卷 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.createDialogVisiable = true;
      }
    },
    timedata(){
      const startDate = new Date(this.form.start_time);
      const endDate = new Date(this.form.end_time);
      if (startDate > endDate) {
        this.$message.error('开始日期不能大于结束日期');
        this.form.start_time = '';  // 清空开始日期
      }
    },
    // 加载数据
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        org_id: this.org_id,
        biz_id: this.$bizCode.wenjuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT138890411468054528",
      };
      let resp = await resource.getList("data", params);
      this.data = resp.data;
      this.total = resp.count;
      this.loading = false;
    },

    // 编辑
    async editRow(pk) {
      let params = {
        biz_id: this.$bizCode.wenjuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT138890411468054528",
      };
      let res = await resource.getObj("data", pk, params);
      this.form = res;
      this.createDialogVisiable = true;
    },

    // 清除表格数据
    clearFormData(formName) {
      this.form = { ...FORM };
      this.$refs[formName].resetFields();
    },

    // 删除
    async deleteRow(row) {
      try {
        // await this.$confirm("是否确定删除? 此操作不可恢复!");
        try {
          await resource.deleteList(
            {
              pk: row.pk,
            },
            row.template_id
          );
          this.$message.success("删除成功!");
          await this.loadData();
        } catch (e) {
          this.$message.error("删除失败!");
        }
      } catch (e) {
        this.$message.info("取消删除");
      }
    },

    // 提交
    async submitShiJuan(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            ...this.form,
            biz_id: this.$bizCode.wenjuan_biz,
            src_id: this.$sourceCode.source_id,
          };
          if (data.pk) {
            await resource.updateObj("data", data.pk, data);
            this.$message.success("编辑成功!");
          } else {
            await resource.createObj("data", data);
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
    // 背景颜色
    changeBackground(val) {
      this.form.background = val.response.file;
    },
    ShiLiTo() {
      this.$router.push("/diaoyanzhanshi");
    },
    ShuoMingTo() {
      this.$router.push({ name: "wenjuan-shuoming" });
    },
    // 二维码地址跳转
    targetLink(row) {
      let router = this.$router.resolve({
        name: "targetlink",
        query: { link: this.httpurl + "/kaoshi/wjindex?pk=" + row.pk },
      });
      window.open(router.href, "_blank");
    },
    // 题目
    toTimu(row) {
      this.$router.push({
        name: "wenjuan-shiti",
        params: { id: row.pk },
      });
    },
    // 结果
    toJieguo(data) {
      this.$router.push({
        name: "wenjuan-jieguolist",
        params: { id: data.pk },
      });
    },
    // 统计
    toTongji(data) {
      this.$router.push({ name: "wenjuan-tongji", params: { id: data.pk } });
    },
    closeQR() {
      this.qrcode.clear();
    },
    creatQrCode(pk) {
      this.viewQR = true;
      this.url = window.location.origin + "/mobile/wenjuaninfo?pk=" + pk;
      console.log(this.url)
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>

<style scoped>
.score-label {
  margin-left: 10px;
  margin-right: 10px;
}

.red {
  color: red;
}

.tips {
  text-align: center;
  margin-top: 30px;
}

.qrcode {
  margin: 10px auto;
}
.deleteButton{
 margin-left: 10px;
}
</style>
