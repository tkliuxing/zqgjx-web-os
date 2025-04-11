<template>
  <div class="shiti">
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <el-button type="info" round icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" round icon="el-icon-plus" @click="createDialogVisiable = true">手动添加</el-button>
          <uploadexl class="up-loade" :formTable="formTable" :textTable="textTable" @getTableList="getTableList"></uploadexl>
          <el-button style="margin-left: 10px" round type="warning" @click="downTemplate" icon="el-icon-download">下载模版</el-button>
          <el-button @click="excelExport" type="success" round icon="el-icon-download">Excel导出</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" element-loading-text="正在加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }" :data="data" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="timu" label="题目" width="400">
        </el-table-column>
        <el-table-column prop="leixing" label="类型"> </el-table-column>
        <el-table-column prop="daan" label="答案">
          <template slot-scope="{row}">
            {{row.daan || row.cankao}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <el-button type="success" round @click="editRow(scope.row)">编辑</el-button>
            <el-button type="danger" round @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px">
        <el-button style="float: right; margin-right: 10px" type="danger" round icon="el-icon-delete" @click="delAllTab">批量删除</el-button>
      </div>
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[15, 30, 50, 100, 500, 1000]" :page-size="pageSize" @size-change="
          (pageSize) => {
            this.page = 1;
            this.pageSize = pageSize;
            this.loadData();
          }
        " :current-page.sync="page" @current-change="loadData" :total="total" style="margin-top: 10px">
      </el-pagination>
    </el-card>
    <el-dialog title="试题" :visible.sync="createDialogVisiable" width="50%" @closed="clearFormData('form')">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="leixing" label="类型">
          <el-select v-model="form.leixing" placeholder="类型" @change="formLeixingChange">
            <el-option label="单选" value="单选"></el-option>
            <el-option label="多选" value="多选"></el-option>
            <el-option label="判断" value="判断"></el-option>
            <el-option label="问答" value="问答"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="timu" label="题目">
          <el-input type="textarea" :rows="2" v-model="form.timu" placeholder="题目"></el-input>
        </el-form-item>
        <template v-if="form.leixing === '问答'">
          <el-form-item label="参考答案">
            <el-input type="textarea" :rows="4" v-model="form.cankao" placeholder="参考答案"></el-input>
          </el-form-item>
        </template>
        <template v-if="form.leixing === '判断'">
          <el-form-item label="选项A">
            <el-input v-model="form.xuanxiang_01" placeholder="选项A"></el-input>
          </el-form-item>
          <el-form-item label="选项B">
            <el-input v-model="form.xuanxiang_02" placeholder="选项B"></el-input>
          </el-form-item>
          <el-form-item label="正确答案">
            <el-input v-model="form.daan" placeholder="A或B"></el-input>
          </el-form-item>
        </template>
        <template v-if="form.leixing === '单选' || form.leixing === '多选'">
          <el-form-item v-if="form.choices_length >= 1" label="选项A">
            <el-input v-model="form.xuanxiang_01" placeholder="选项A"></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 2" label="选项B">
            <el-input v-model="form.xuanxiang_02" placeholder="选项B"></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 3" label="选项C">
            <el-input v-model="form.xuanxiang_03" placeholder="选项C"></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 4" label="选项D">
            <el-input v-model="form.xuanxiang_04" placeholder="选项D"></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 5" label="选项E">
            <el-input v-model="form.xuanxiang_05" placeholder="选项E"></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 6" label="选项F">
            <el-input v-model="form.xuanxiang_06" placeholder="选项F"></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 7" label="选项G">
            <el-input v-model="form.xuanxiang_07" placeholder="选项G"></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 8" label="选项H">
            <el-input v-model="form.xuanxiang_08" placeholder="选项H"></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 9" label="选项I">
            <el-input v-model="form.xuanxiang_09" placeholder="选项I"></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 10" label="选项J">
            <el-input v-model="form.xuanxiang_10" placeholder="选项J"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="center">
              <el-button v-if="form.choices_length < 10" type="primary" plain circle icon="el-icon-plus" @click="form.choices_length += 1"></el-button>
              <el-button v-if="form.choices_length > 2" type="primary" plain circle icon="el-icon-minus" @click="form.choices_length -= 1"></el-button>
            </div>
          </el-form-item>
          <el-form-item label="正确答案">
            <el-input v-model="form.daan" placeholder="请按照'ABC...'格式填写"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import resource from "@/resource.js";
import { mapState } from "vuex";
import Uploadexl from "@/components/common/HxUploadExl.vue";
import XLSX from "xlsx";
const TMP_ID_ST = "FT138153450912034816"; //试题
const TMP_ID_JG = "FT336770984361844736"; //结果
const FORM = {
  tiku_id: null,
  timu: "",
  leixing: "单选",
  daan: "",
  cankao: "",
  choices_length: 4,
  xuanxiang_01: "",
  xuanxiang_02: "",
  xuanxiang_03: "",
  xuanxiang_04: "",
  xuanxiang_05: "",
  xuanxiang_06: "",
  xuanxiang_07: "",
  xuanxiang_08: "",
  xuanxiang_09: "",
  xuanxiang_10: "",
  template_id: TMP_ID_ST,
};
export default {
  name: "ShiTi",
  computed: {
    ...mapState(["httpurl"]),
    excelDownloadTranslate() {
      return {
        leixing: "试题类型",
        timu: "题目",
        daan:"选项答案",
        cankao: "问答题答案",
        choices_length: "选项数量",
        xuanxiang_01: "选项一",
        xuanxiang_02: "选项二",
        xuanxiang_03: "选项三",
        xuanxiang_04: "选项四",
        xuanxiang_05: "选项五",
        xuanxiang_06: "选项六",
        xuanxiang_07: "选项七",
        xuanxiang_08: "选项八",
        xuanxiang_09: "选项九",
        xuanxiang_10: "选项十",
      };
    },
  },
  components: {
    Uploadexl,
  },
  data() {
    return {
      data: [],
      tiku: {},
      page: 1,
      pageSize: 15,
      total: 0,
      createDialogVisiable: false,
      form: {
        ...FORM,
      },
      rules: {
        timu: [{ required: true, message: "请填写题目" }],
        leixing: [{ required: true, message: "请选择类型" }],
      },
      tiku_id: null,
      formTable: [
        "leixing",
        "timu",
        "daan",
        "cankao",
        "choices_length",
        "xuanxiang_01",
        "xuanxiang_02",
        "xuanxiang_03",
        "xuanxiang_04",
        "xuanxiang_05",
        "xuanxiang_06",
        "xuanxiang_07",
        "xuanxiang_08",
        "xuanxiang_09",
        "xuanxiang_10",
      ],
      textTable: [
        "试题类型",
        "题目",
        "选项答案",
        "问答题答案",
        "选项数量",
        "选项一",
        "选项二",
        "选项三",
        "选项四",
        "选项五",
        "选项六",
        "选项七",
        "选项八",
        "选项九",
        "选项十",
      ],
      loading: false,
      fullscreenLoading: false, // 导出loading
      changeList: [],
    };
  },
  methods: {
    // 导出
    async excelExport(){
      this.$confirm("此导出导出所有的数据", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "开始导出...",
          });
          const loading = this.$loading({
            lock: true,
            text: '导出中Loading...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let params = {
            tiku_id: this.tiku_id,
            biz_id: this.$bizCode.shijuan_biz,
            src_id: this.$sourceCode.source_id,
            template_id: TMP_ID_ST,
          };
          let AllTimu = await resource.getList("data", params);
          let header = [
            "试题类型",
            "题目",
            "选项答案",
            "问答题答案",
            "选项数量",
            "选项一",
            "选项二",
            "选项三",
            "选项四",
            "选项五",
            "选项六",
            "选项七",
            "选项八",
            "选项九",
            "选项十",
          ];
          let tmp = [];
          AllTimu.forEach((i) => {
            let obj = {};
            for (const key in this.excelDownloadTranslate) {
              obj[this.excelDownloadTranslate[key]] = i[key];
            }
            tmp.push(obj);
          });
          let wb = XLSX.utils.book_new();
          let ws = XLSX.utils.json_to_sheet(tmp, { header });
          XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
          XLSX.writeFile(wb, "题目.xlsx");
          loading.close();
        })
        .catch((action) => {})
    },
    handleSelectionChange(val) {
      this.changeList = val;
    },
    // 下载模版
    downTemplate() {
      // console.log("下载模版");
      window.location.href = this.httpurl + "/excel/考试试题模版.xls";
    },
    // 加载
    async loadData(val) {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        tiku_id: this.tiku_id,
        biz_id: this.$bizCode.shijuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_ST,
      };
      let data = await resource.getList("data", params);
      this.total = data.count;
      this.data = data.data;
      this.loading = false;
    },
    // 类型选择
    formLeixingChange(val) {
      if (val === "判断" || val === "问答") {
        this.form = {
          ...this.form,
          leixing: val,
          daan: "",
          cankao: "",
          choices_length: val === "判断" ? 2 : 0,
          xuanxiang_01: "",
          xuanxiang_02: "",
          xuanxiang_03: "",
          xuanxiang_04: "",
          xuanxiang_05: "",
          xuanxiang_06: "",
          xuanxiang_07: "",
          xuanxiang_08: "",
          xuanxiang_09: "",
          xuanxiang_10: "",
        };
      }
    },
    // 清除数据
    clearFormData(formName) {
      this.form = {
        ...FORM,
      };
      this.$refs[formName].resetFields();
    },
    // 编辑显示
    editRow(data) {
      this.createDialogVisiable = true;
      this.form = { ...data };
    },

    // 删除
    async del(row) {
      try {
        await this.$confirm("是否确定删除? 此操作不可恢复!");
        try {
          await resource.deleteList(
            {
              pk: row.pk,
            },
            row.template_id
          );
          await resource.deleteList(
            {
              shiti_id: row.pk,
            },
            TMP_ID_JG
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

    // 批量删除
    async delAllTab() {
      let idarr = [];
      for (let item of this.changeList) {
        idarr.push(item.pk);
      }
      let idstr = idarr.join();
      try {
        await this.$confirm("是否确定删除? 此操作不可恢复!");
        try {
          await resource.deleteList(
            {
              pk: idstr,
            },
            TMP_ID_ST
          );
          await resource.deleteList(
            {
              shiti_id: idstr,
            },
            TMP_ID_JG
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
    async submitForm() {
      let valid = await new Promise((resolve, reject) => {
        this.$refs.form.validate(resolve);
      });
      let parmas_code = {
        tiku_id: this.tiku_id,
        biz_id: this.$bizCode.tiku_biz,
        src_id: this.$sourceCode.source_id,
      };
      let data = { ...this.form, ...parmas_code };
      if (data.leixing === "问答") {
        let clean = {
          field_11: "",
          field_12: "",
          field_13: "",
          field_14: "",
          field_15: "",
          field_16: "",
          field_17: "",
          field_18: "",
          field_19: "",
          field_20: "",
        };
        data = { ...data, ...clean };
      }
      if (valid) {
        try {
          if (data.pk) {
            await resource.updateObj("data", data.pk, data);
          } else {
            await resource.createObj("data", data);
          }
          this.$message.success("保存成功!");
          await this.loadData();
          this.createDialogVisiable = false;
        } catch (e) {
          this.$message.error("保存失败!");
        }
      } else {
        this.$message.error("请按要求填写!");
      }
    },
    // Excel数据提交
    async getTableList(info) {
      for (let i = 0; i < info.length; i++) {
        if (info[i].leixing == undefined) {
          this.$message({
            type: "warning",
            message: "第" + (i + 2) + "行的题目类型未填写！",
          });
          return;
        }
        if (info[i].timu == undefined) {
          this.$message({
            type: "warning",
            message: "第" + (i + 2) + "行的题目未填写！",
          });
          return;
        }
      }
      this.loading = true;
      for (let item of info) {
        item.tiku_id = this.tiku_id;
        item.biz_id = this.$bizCode.tiku_biz_id;
        item.src_id = this.$sourceCode.source_id;
        item.template_id = TMP_ID_ST;
        if (item.leixing === "问答") {
          let clean = {
            field_11: "",
            field_12: "",
            field_13: "",
            field_14: "",
            field_15: "",
            field_16: "",
            field_17: "",
            field_18: "",
            field_19: "",
            field_20: "",
          };
          item = { ...item, ...clean };
        }
        if (item.cankao === undefined) {
          item.cankao = "";
        }
      }
      await resource.createObj("data", info);
      this.loading = false;
      this.loadData();
    },
  },
  async mounted() {
    this.tiku_id = this.$route.params.id;
    await this.loadData();
  },
};
</script>

<style scoped>
.up-loade {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}
</style>
