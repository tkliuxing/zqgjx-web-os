<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-button
          type="primary"
          round
          icon="el-icon-plus"
          @click="xinjian"
          >新建</el-button
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
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="filterData.search"
          clearable
          @clear="loadData"
          placeholder="测评名称"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search" round
        >搜索</el-button
      >
    </el-form>
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
      <el-table-column label="测评名称" prop="name"></el-table-column>
      <el-table-column
        label="是否可用"
        prop="is_enabled"
        width="100px"
      ></el-table-column>
      <el-table-column
        label="起始时间"
        prop="start_time"
        width="100px"
      ></el-table-column>
      <el-table-column
        label="结束时间"
        prop="end_time"
        width="100px"
      ></el-table-column>
      <el-table-column
        label="评价人数量"
        prop="qr_total"
        width="100px"
      ></el-table-column>
      <el-table-column label="操作" width="500px">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            round
            icon="el-icon-full-screen"
            @click="creatQrCode(row.pk)"
            >二维码
          </el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-edit"
            @click="edit(row.pk)"
            >编辑</el-button
          >
          <el-button
            type="warning"
            round
            icon="el-icon-tickets"
            @click="cpresult(row.pk)"
            >统计记录</el-button
          >
          <el-button
            type="success"
            round
            icon="el-icon-tickets"
            @click="allresult(row)"
          >统计结果</el-button
          >
          <el-popconfirm title="确定删除吗？" @confirm="del(row)">
            <el-button
              type="danger"
              round
              class="deleteButton"
              slot="reference"
              icon="el-icon-remove"
            >
              删除</el-button
            >
          </el-popconfirm>
          <!-- <el-button
              type="danger"
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
      title="测评"
      :visible.sync="createDialogVisiable"
      width="50%"
      center
      @closed="clearFormData('form')"
    >
      <el-form :model="form" ref="form" label-width="100px" style="max-height: 600px;overflow-y: auto;">
        <el-form-item
          label="测评名称"
          prop="name"
          :rules="[{ required: true, message: '请填写测评名称' }]"
        >
          <el-input style="" v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input style="" v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="是否可用" prop="is_enabled">
          <el-switch
            v-model="form.is_enabled"
            inactive-color="#ff4949"
            inactive-text-color="#ff4949"
            active-text="允许测评"
            inactive-text="禁止测评"
            active-value="是"
            inactive-value="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="起始时间" prop="start_time">
          <el-date-picker
            v-model="form.start_time"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="form.end_time"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="主题色" prop="color">
          <el-color-picker
            v-model="form.color"
            :predefine="predefineColors"
          ></el-color-picker>
        </el-form-item>
        <el-form-item label="背景图片" prop="background">
          <my-upload @change="changeBackground" />
          <el-image
            v-if="form.background"
            style="width: 100px; height: 100px; margin-top: 5px"
            :src="form.background"
            :preview-src-list="[form.background]"
          ></el-image>
          <el-button style="margin-left: 5px" @click="delePhoto(form.background)" size="mini" v-if="form.background" type="danger"> 删除</el-button>
        </el-form-item>

        <el-form-item label="评价人数量" prop="qr_total">
          <el-input-number style="" :controls="true" v-model="form.qr_total" />
          <span class="xm-span">0 为不限数量</span>
        </el-form-item>
        <el-form-item label="被评价对象">
          <el-button type="text" @click="exportExcel">下载模版</el-button>
          <span class="xm-span">每行一个被评对象，人员选填，部门必填</span>
          <beipingren-upload @change="changeBeipingren" />
          <span>数量：{{ beipingrenarr.length }}</span>
        </el-form-item>

        <el-form-item label="测评项目数" prop="xiangmu_length">
          <el-input-number
            style=""
            :controls="true"
            v-model="form.xiangmu_length"
            :max="10"
            :min="1"
          />
        </el-form-item>
        <el-form-item
          label="测评项目1"
          prop="xiangmu_01"
          v-if="form.xiangmu_length >= 1"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_01"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_01" />
        </el-form-item>
        <el-form-item
          label="测评项目2"
          prop="xiangmu_02"
          v-if="form.xiangmu_length >= 2"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_02"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_02" />
        </el-form-item>
        <el-form-item
          label="测评项目3"
          prop="xiangmu_03"
          v-if="form.xiangmu_length >= 3"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_03"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_03" />
        </el-form-item>
        <el-form-item
          label="测评项目4"
          prop="xiangmu_04"
          v-if="form.xiangmu_length >= 4"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_04"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_04" />
        </el-form-item>
        <el-form-item
          label="测评项目5"
          prop="xiangmu_05"
          v-if="form.xiangmu_length >= 5"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_05"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_05" />
        </el-form-item>
        <el-form-item
          label="测评项目6"
          prop="xiangmu_06"
          v-if="form.xiangmu_length >= 6"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_06"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_06" />
        </el-form-item>
        <el-form-item
          label="测评项目7"
          prop="xiangmu_07"
          v-if="form.xiangmu_length >= 7"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_07"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_07" />
        </el-form-item>
        <el-form-item
          label="测评项目8"
          prop="xiangmu_08"
          v-if="form.xiangmu_length >= 8"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_08"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_08" />
        </el-form-item>
        <el-form-item
          label="测评项目9"
          prop="xiangmu_09"
          v-if="form.xiangmu_length >= 9"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_09"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_09" />
        </el-form-item>
        <el-form-item
          label="测评项目10"
          prop="xiangmu_010"
          v-if="form.xiangmu_length >= 10"
        >
          <el-input
            placeholder="名称"
            style="width: 100px"
            v-model="form.xiangmu_10"
          />
          <span class="xm-span">分值</span>
          <el-input-number :min="1" v-model="form.fenzhi_10" />
        </el-form-item>
        <div style="padding: 20px;border-radius: 15px;margin: 20px 0;border: 1px solid #dcdfe6">
          <el-form-item label="填报说明" prop="shuoming">
            <el-switch v-model="form.shuoming" active-text="开启" inactive-text="关闭" active-value="是"
                       inactive-value="否">
            </el-switch>
          </el-form-item>

          <el-form-item prop="sm">
            <editor-bar
              v-if="createDialogVisiable"
              v-model="form.sm"
              :isClear="isClear"
              @change="change"
              style="margin-top: 40px"
            ></editor-bar>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button icon="el-icon-close" @click="createDialogVisiable = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="submitForm('form')"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="viewQR"
      @before-close="closeQR"
      width="20%"
      style="text-align: center"
    >
     <div style="display: flex;flex-direction: column;align-items: center">
<!--       <qr-code v-if="viewQR" :url="url" ref="qrCodeUrl"></qr-code>-->
       <Qr v-if="viewQR" :url="url" style="margin: auto "></Qr>
       <div class="tips" style="text-align: center">点击二维码保存图片</div>
     </div>
    </el-dialog>
    <table ref="table" style="display: none">
      <tr>
        <td>部门</td>
        <td>人员</td>
      </tr>
    </table>
  </el-card>
</template>
<script>
import { mapState } from "vuex";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import SingleFileUpload from "@/components/common/SingleFileUpload";
import BeipingrenUpload from "./BeipingrenUpload";
import QrCode from "@/components/common/QrCode";
import { PREDEFINE_COLORS } from "@/constvars";
import resource from "@/resource.js";
import Qr from "@/components/common/QR.vue";
import EditorBar from "@/components/common/EditorBar.vue";

const MAIN_FORM = {
  name: null,
  desc: null,
  is_enabled: "是",
  start_time: null,
  end_time: null,
  beipingren: null,
  qr_total: 0,
  qr_used: 0,
  color: "#e41e1e",
  background: null,
  xiangmu_length: null,
  xiangmu_01: "",
  fenzhi_01: null,
  xiangmu_02: "",
  fenzhi_02: null,
  xiangmu_03: "",
  fenzhi_03: null,
  xiangmu_04: "",
  fenzhi_04: null,
  xiangmu_05: "",
  fenzhi_05: null,
  xiangmu_06: "",
  fenzhi_06: null,
  xiangmu_07: "",
  fenzhi_07: null,
  xiangmu_08: "",
  fenzhi_08: null,
  xiangmu_09: "",
  fenzhi_09: null,
  xiangmu_10: "",
  fenzhi_10: null,
  shuoming: null,
  sm: null,
  template_id: "FT6372255133696",
};

export default {
  name: "CePing",
  components: {
    EditorBar,
    Qr,
    "my-upload": SingleFileUpload,
    "beipingren-upload": BeipingrenUpload,
    QrCode,
  },
  computed: {
    ...mapState(["org_id", "httpurl",'userinfo',"quanxian"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      predefineColors: PREDEFINE_COLORS,
      form: { pk: null, ...MAIN_FORM },
      filterData: { search: null },
      data: [],
      background_option_data: [], //定义background_option_data数据源
      createDialogVisiable: false,
      qrcode: null,
      viewQR: false,
      url: null,
      beipingrenarr: [],
      editState: false,
      loading: false,
      isClear: false,
    };
  },
  methods: {
    xinjian(){
      if(!this.quanxian.扫码考评 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.createDialogVisiable = true;
      }
    },
    change(val) {
      this.form.sm = val;
    },
    delePhoto(val){
      this.form.background = null
    },
    async loadData() {
      this.loading = true;
      let params = {
        template_id: "FT6372255133696",
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.ceping_biz,
        src_id: this.$sourceCode.source_id,
      };
      let res = await resource.getList("data", params);
      this.total = res.count;
      this.data = res.data;
      this.loading = false;
    },

    // 编辑/添加
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            ...this.form,
            biz_id: this.$bizCode.ceping_biz,
            src_id: this.$sourceCode.source_id,
          };
          // 开始时间不能小于结束时间
          if (this.form.start_time && this.form.end_time) {
            if (this.form.start_time > this.form.end_time) {
              this.$message.error("开始时间不能大于结束时间！");
              return;
            }
          }
          if (data.pk != null) {
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
    async del(info) {
      try {
        try {
          await resource.deleteList(
            {
              pk: info.pk,
            },
            info.template_id
          );
          await resource.deleteList(
            {
              ceping_id: info.pk,
            },
            "FT6624995528704"
          );
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          setTimeout(() => {
            this.loadData();
          }, 200);
        } catch (e) {
          this.$message.error("删除失败!");
        }
      } catch (e) {
        this.$message.info("取消删除");
      }
    },

    // 搜索
    async search() {
      this.loading = true;
      let params_search = {};
      let check = Object.prototype.toString;
      // for (const key in this.filterData) {
      //   if (check.call(this.filterData[key]) === "[object Array]") {
      //     params_search[key + "_before"] = this.filterData[key][0];
      //     params_search[key + "_after"] = this.filterData[key][1];
      //   } else {
      //     params_search[key] = this.filterData[key];
      //   }
      // }
      let params = {
        // ...params_search,
        biz_id: this.$bizCode.ceping_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT6372255133696",
      };
      if(this.filterData.search){
        params.search = this.filterData.search
      }
      let res = await resource.getList("data", params);
      this.data = res;
      this.loading = false;
    },

    // 获取详情
    async edit(pk) {
      // this.editState = true;
      let params = {
        biz_id: this.$bizCode.ceping_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT6372255133696",
      };
      let res = await resource.getObj("data", pk, params);
      this.form = res;
      // this.editState = false;
      this.createDialogVisiable = true;
    },

    // 上传被测评名单
    async changeBeipingren(val) {
      if (this.form.qr_used > 0) {
        try {
          await this.$confirm(
            "本测评已有提交的数据，修改被测对象会造成数据统计混乱，确定要操作么？"
          );
        } catch (e) {
          this.$message.success("已取消");
          return;
        }
      }
      let first_sheet_name = val.SheetNames[0];
      let sheet = val.Sheets[first_sheet_name];
      let json = XLSX.utils.sheet_to_json(sheet);
      let bpr = json.map((value) => {
        return {
          name: value["人员"] || "",
          dep: value["部门"],
        };
      });
      this.beipingrenarr = bpr;
      this.form.beipingren = JSON.stringify(bpr);
    },

    // 下载模版
    exportExcel() {
      this.$nextTick(() => {
        let wb = XLSX.utils.table_to_book(this.$refs.table);
        let wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "测评模版.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      });
    },

    changeBackground(val) {
      this.form.background = val.response.file;
    },

    clearFormData(formName) {
      this.form = { pk: null, ...MAIN_FORM };
      if (formName) {
        this.$refs[formName].resetFields();
      }
    },

    creatQrCode(pk) {
      this.viewQR = true;
      this.url = window.location.origin + "/mobile/cepinginfo?pk=" + pk;
    },
    cpresult(ceping_id) {
      this.$router.push({ name: "ceping-jieguo", params: { ceping_id } });
    },
    allresult(row) {
      this.$router.push({ name: "result-jieguo", params: { ceping_id:row.pk,name:row.name } });
    },
    closeQR() {
      this.qrcode.clear();
    },
    ShiLiTo() {
      this.$router.push("/cepingzhanshi");
    },
    ShuoMingTo() {
      this.$router.push({ name: "ceping-shuoming" });
    },
  },
  async mounted() {
    this.clearFormData();
    await this.loadData();
  },
  created() {},
};
</script>

<style scopen>
.xm-span {
  margin: 0 10px;
}
.tips {
  color: #333;
  line-height: 44px;
  text-align: center;
}
.deleteButton{
 margin-left: 10px;
}
</style>
