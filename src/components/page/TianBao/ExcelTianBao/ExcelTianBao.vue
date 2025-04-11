<template>
  <el-card>
    <div>
      <el-form inline>
        <el-form-item>
          <el-button
            type="primary"
            @click="xinjian"
            round
            icon="el-icon-plus"
            >新建</el-button
          >
          <el-button
            type="primary"
            @click="ShiLiTo"
            class="fix-tab"
            plain
            round
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
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filterData.is_kaiqi"
            clearable
            placeholder="是否开启"
            @clear="loadData"
          >
            <el-option
              v-for="(item, index) in field_01_option_data"
              :label="item.name"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="loadData"
            round
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="正在加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      stripe
      border
      :data="data"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="标题" prop="name"></el-table-column>
      <el-table-column label="描述" prop="desc"></el-table-column>
      <el-table-column label="是否开启" prop="is_kaiqi"></el-table-column>
      <el-table-column label="开始时间" prop="start_time"></el-table-column>
      <el-table-column label="结束时间" prop="end_time"></el-table-column>
      <el-table-column label="Excel模版" width="120px">
        <template slot-scope="{ row }">
          <a v-if="row.file" :href="row.file" target="_blank">下载</a>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400px">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-full-screen"
            round
            @click="creatQrCode(row.pk)"
            >二维码</el-button
          >
          <el-button
            type="success"
            size="mini"
            icon="el-icon-tickets"
            @click="toJieguo(row)"
            round
            >结果</el-button
          >
          <el-button
            type="warning"
            size="mini"
            round
            icon="el-icon-edit"
            @click="edit(row)"
            >编辑</el-button
          >
          <el-popconfirm title="确定删除吗？" @confirm="del(row)">
            <el-button type="danger" size="mini" class="deleteButton" round slot="reference" icon="el-icon-remove">
              删除</el-button>
          </el-popconfirm>
          <!-- <el-button
            type="danger"
            size="mini"
            round
            icon="el-icon-remove"
            @click="del(row)"
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
      style="margin-top: 10px"
    ></el-pagination>
    <el-dialog
      title="编辑"
      :visible.sync="createDialogVisiable"
      width="50%"
      center
      @closed="clearFormData"
    >
      <el-form label-width="100px" :model="form" ref="form" >
        <el-form-item
          label="标题"
          prop="name"
          :rules="[{ required: true, message: '请填写标题' }]"
        >
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc" :rules="[]">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="是否开启" prop="field_01" :rules="[]">
          <el-select v-model="form.is_kaiqi" @change="field_01Change">
            <el-option
              v-for="(item, index) in field_01_option_data"
              :label="item.name"
              :value="item.name"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time" :rules="[]">
          <el-date-picker
            v-model="form.start_time"
            value-format="yyyy-MM-dd"
            type="date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time" :rules="[]">
          <el-date-picker
            v-model="form.end_time"
            value-format="yyyy-MM-dd"
            type="date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Excel模版" prop="file" :rules="{ required: true, message: '必填项' }">
          <div v-if="!form.file">

          <my-upload @change="changeExcel" />
          </div>
          <div v-else>
            <a :href="form.file" target="_blank" style="margin-right: 10px">下载</a>
            <el-button type="danger" size="mini" @click="delExcel">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button icon="el-icon-close" @click="quxiao"
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
      :visible.sync="viewQR"
      @before-close="closeQR"
      width="20%"
      style="text-align: center"
    >
     <div style="display:flex;align-items: center;justify-content: center;flex-direction: column">
<!--       <qr-code v-if="viewQR" :url="url" ref="qrCodeUrl"></qr-code>-->
      <Qr v-if="viewQR" :url="url" style="margin: auto "></Qr>
      <div style="margin-top: 15px;text-align: center" >点击二维码保存图片</div>
     </div>
    </el-dialog>
  </el-card>
</template>
<script>
import SingleFileUpload from "@/components/common/SingleFileUpload";
import { mapState } from "vuex";
import resource from "@/resource.js";
import QrCode from "@/components/common/QrCode";
import Qr from "@/components/common/QR.vue";

const empty_form = {
  pk: null,
  name: null,
  desc: null,
  is_kaiqi: "是",
  start_time: null,
  end_time: null,
  file: null,
  template_id: "FT140710482218266624",
}

export default {
  name: "ExcelTianBao",
  components: {Qr, "my-upload": SingleFileUpload, QrCode },
  computed: {
    ...mapState(["org_id", "httpurl", "userinfo","quanxian"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      form: { ...empty_form },
      filterData: { is_kaiqi: null },
      data: [],
      field_01_option_data: [
        {
          name: "是",
          value: "是",
        },
        {
          name: "否",
          value: "否",
        },
      ], //定义field_01_option_data数据源
      createDialogVisiable: false,
      qrcode: null,
      viewQR: false,
      loading: false,
      url: null,
    };
  },
  methods: {
    xinjian(){
      if(!this.quanxian.扫码填报 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.createDialogVisiable = true;
      }
    },
    delExcel(){
      this.form.file = null;
    },
    quxiao(){
      this.clearFormData()
      this.createDialogVisiable = false
    },
    // 获取文件地址
    changeExcel(val) {
      this.form.file = val.response.file;
    },

    // 加载
    async loadData() {
      this.loading = true;
      let params = {
        // ...this.filterData,
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.tianbao_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT140710482218266624",
      };
      if(this.filterData.is_kaiqi){
        params.is_kaiqi = this.filterData.is_kaiqi;
      }
      let res = await resource.getList("data", params);
      this.total = res.count;
      this.data = res.data;
      this.loading = false;
    },

    // 提交
    async submitForm(formName) {
      if (!this.form.file) {
        this.$message.error("请上传excel后提交！");
        return;
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            ...this.form,
            biz_id: this.$bizCode.tianbao_biz,
            src_id: this.$sourceCode.source_id,
          };
          // 开始时间不能小于结束时间
          if (data.start_time && data.end_time) {
            if (data.start_time > data.end_time) {
              this.$message.error("开始时间不能大于结束时间！");
              return;
            }
          }
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

    // 删除
    async del(row) {
      try {
        try {
          await resource.deleteList(
            {
              pk:row.pk,
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

    field_01Change(value) {
      let res = this.field_01_option_data.filter((i) => {
        return i.value === value;
      });
      this.form["is_kaiqi"] = res[0].name;
    },

    // 清楚数据
    clearFormData() {
      this.form = {...empty_form}
    },

    // 编辑
    edit(obj) {
      this.form = { ...obj };
      this.createDialogVisiable = true;
    },

    closeQR() {
      this.qrcode.clear();
    },
    creatQrCode(pk) {
      this.viewQR = true;
      this.url = window.location.origin + "/mobile/exceltianbao?id=" + pk;
    },
    toJieguo(data) {
      this.$router.push({ name: "excel-jieguo", params: { id: data.pk } });
    },
    ShiLiTo() {
      this.$router.push("/tianbaozhanshi");
    },
    ShuoMingTo() {
      this.$router.push({ name: "tianbao-shuoming" });
    },
  },
  async mounted() {
    await this.loadData();
  },
  created() {},
};
</script>
<style scoped>
.deleteButton{
 margin-left: 10px;
}
</style>
