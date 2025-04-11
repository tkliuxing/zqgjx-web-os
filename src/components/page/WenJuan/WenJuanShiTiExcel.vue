<template>
  <div class="shiti">
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <el-button
            icon="el-icon-arrow-left"
            round
            type="info"
            @click="$router.go(-1)"
          >返回
          </el-button>
          <el-button
            icon="el-icon-plus"
            round
            type="primary"
            @click="viewNewDialog"
          >手动添加
          </el-button
          >
          <uploadexl
            :formTable="formTable"
            :textTable="textTable"
            class="up-loade"
            @getTableList="getTableList"
          ></uploadexl>
          <el-button
            icon="el-icon-download"
            round
            style="margin-left: 10px"
            type="warning"
            @click="downTemplate"
          >下载模版
          </el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        :data="data"
        border
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-spinner="el-icon-loading"
        element-loading-text="正在加载中..."
        style="margin-top: 1rem"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" prop="number" width="80">
        </el-table-column>
        <el-table-column label="题目" prop="timu" width="400">
        </el-table-column>
        <el-table-column label="类型" prop="leixing"></el-table-column>
        <el-table-column label="注释" prop="zhushi"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button round type="success" @click="editRow(scope.row)">
              编辑
            </el-button>
            <el-button round type="danger" @click="deleteRow(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="12">
          <el-pagination
            :current-page.sync="page"
            :page-size="pageSize"
            :page-sizes="[15, 30, 50, 100, 500, 1000]"

            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="
          (pageSize) => {
            this.page = 1;
            this.pageSize = pageSize;
            this.loadData();
          }
        "
            @current-change="loadData"
          >
          </el-pagination>
        </el-col>
        <el-col :span="12">
          <div style="padding: 10px 0; overflow: hidden">
            <el-button
              icon="el-icon-delete"
              round
              style="float: right; margin-right: 10px"
              type="danger"
              @click="delAllTab"
            >批量删除
            </el-button
            >
          </div>
        </el-col>
      </el-row>


    </el-card>
    <el-dialog
      :visible.sync="showForm"
      title="题目"
      width="50%"
      @closed="closeDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="序号" prop="number">
          <el-input-number
            v-model="form.number"
            :min="1"
            label="序号"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="是否必答">
          <el-select v-model="form.is_required">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否收集信息">
          <el-select v-model="form.is_baseinfo">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="leixing">
          <el-select
            v-model="form.leixing"
            placeholder="类型"
            @change="formLeixingChange"
          >
            <el-option label="单选" value="单选"></el-option>
            <el-option label="多选" value="多选"></el-option>
            <el-option label="问答" value="问答"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目" prop="timu">
          <el-input
            v-model="form.timu"
            :rows="2"
            placeholder="题目"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="注释" prop="zhushi">
          <el-input
            clearable
            v-model="form.zhushi"
            placeholder="注释"
          ></el-input>
        </el-form-item>
        <el-form-item label="填写选项">
          <el-radio-group v-model="form.qita_number">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
          <div style="color: red; font-size: 10px">最后一项是否为填写项</div>
        </el-form-item>
        <template v-if="form.leixing === '单选' || form.leixing === '多选'">
          <template v-if="form.leixing === '多选'">
            <el-form-item label="最多选几项">
              <el-input-number
                v-model="form.max_length"
                :max="form.choices_length"
                :min="0"
                label="最多选几项"
                @change="maxTab"
              ></el-input-number>
              <span class="help">0 为不限制</span>
            </el-form-item>
            <el-form-item label="必须选几项">
              <el-input-number
                v-model="form.must_length"
                :max="form.choices_length"
                :min="0"
                label="必须选几项"
                @change="mustTab"
              ></el-input-number>
              <span class="help">0 为不限制</span>
            </el-form-item>
          </template>
          <el-form-item v-if="form.choices_length >= 1" label="选项A">
            <el-input
              v-model="form.xuanxiang_01"
              placeholder="选项A"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 2" label="选项B">
            <el-input
              v-model="form.xuanxiang_02"
              placeholder="选项B"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 3" label="选项C">
            <el-input
              v-model="form.xuanxiang_03"
              placeholder="选项C"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 4" label="选项D">
            <el-input
              v-model="form.xuanxiang_04"
              placeholder="选项D"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 5" label="选项E">
            <el-input
              v-model="form.xuanxiang_05"
              placeholder="选项E"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 6" label="选项F">
            <el-input
              v-model="form.xuanxiang_06"
              placeholder="选项F"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 7" label="选项G">
            <el-input
              v-model="form.xuanxiang_07"
              placeholder="选项G"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 8" label="选项H">
            <el-input
              v-model="form.xuanxiang_08"
              placeholder="选项H"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 9" label="选项I">
            <el-input
              v-model="form.xuanxiang_09"
              placeholder="选项I"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.choices_length >= 10" label="选项J">
            <el-input
              v-model="form.xuanxiang_10"
              placeholder="选项J"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="center">
              <el-button
                v-if="form.choices_length < 10"
                circle
                icon="el-icon-plus"
                plain
                type="primary"
                @click="form.choices_length += 1"
              ></el-button>
              <el-button
                v-if="form.choices_length > 2"
                circle
                icon="el-icon-minus"
                plain
                type="primary"
                @click="form.choices_length -= 1"
              ></el-button>
            </div>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import resource from "@/resource.js";
import {mapState} from "vuex";
import Uploadexl from "@/components/common/HxUploadExl.vue";

export default {
  name: "ShiTi",
  props: ["id"],
  computed: {
    ...mapState(["org_id", "httpurl"]),
  },
  components: {
    Uploadexl,
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      data: [],
      shijuan: {},
      showForm: false,
      form: {
        shijuan_id: null,
        number: 0,
        qita_number: "0",
        timu: "",
        is_required: "否",
        leixing: "单选",
        choices_length: 4,
        max_length: 0,
        must_length: 0,
        is_baseinfo: "否",
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
        template_id: "FT138911001835397120",
        zhushi: null,
      },
      rules: {
        number: [{required: true, message: "请填写序号"}],
        timu: [{required: true, message: "请填写题目"}],
        leixing: [{required: true, message: "请选择类型"}],
      },
      formTable: [
        "leixing",
        "timu",
        "zhushi",
        "choices_length",
        "is_required",
        "is_baseinfo",
        "qita_number",
        "max_length",
        "must_length",
        'xuanxiang_01',
        'xuanxiang_02',
        'xuanxiang_03',
        'xuanxiang_04',
        'xuanxiang_05',
        'xuanxiang_06',
        'xuanxiang_07',
        'xuanxiang_08',
        'xuanxiang_09',
        'xuanxiang_10',
      ],
      textTable: [
        "试题类型",
        "题目",
        "注释",
        "选项数量",
        "是否必答",
        "是否收集信息",
        "填写选项",
        "最多填写项",
        "必须填写项",
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
      changeList: [],
      hasResult: false,
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.changeList = val;
    },

    // 加载
    async loadData() {


      this.loading = true;
      let params = {
        ...this.filters,
        page: this.page,
        pageSize: this.pageSize,
        shijuan_id: this.id,
        biz_id: this.$bizCode.wenjuantimu_biz,
        // source_id: this.$sourceCode.source_id,
        template_id: "FT138911001835397120",
      };
      let res = await resource.getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },

    // 删除
    async deleteRow(row) {
      if(this.hasResult){
        return this.$message.warning('已有答题结果，禁止删除题目！')
      }
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
            "FT138488002023051264"
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

    viewNewDialog() {
      this.resetForm();
      this.form.number = this.data.length + 1;
      this.showForm = true;
    },

    formLeixingChange(val) {
      if (val === "问答") {
        this.form = {
          ...this.form,
          leixing: val,
          choices_length: 0,
          max_length: 0,
          must_length: 0,
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
      if (val !== "问答" && this.form.choices_length === 0) {
        this.form.choices_length = 4;
      }
    },

    resetForm() {
      this.form = {
        shijuan_id: this.id,
        number: 0,
        qita_number: "0",
        timu: "",
        is_required: "否",
        is_baseinfo: "否",
        leixing: "单选",
        choices_length: 4,
        max_length: 0,
        must_length: 0,
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
        template_id: "FT138911001835397120",
        zhushi: null,
      };
    },
    async getLocalDataSource() {
      this.loading = true;
      try {
        let params = {
          shijuan_id: this.id,
          template_id: this.TMPL_ID.SMDY_JG,
        }
        let resp = await resource.getCount('data',params)
        this.hasResult = resp > 0; // 条数大于0 禁止编辑题目
      }catch (e) {
        console.log(e)
      }
      this.loading = false;
    },
    async editRow(data) {
      if(this.hasResult){
        return this.$message.warning('已有答题结果，禁止编辑题目！')
      }
      let params = {
        biz_id: this.$bizCode.wenjuantimu_biz,
        // src_id: this.$sourceCode.source_id,
        template_id: "FT138911001835397120",
      };
      console.log(params)
      // data.biz_id=this.$bizCode.wenjuantimu_biz
      console.log(data)
      let res = await resource.getObj("data", data.pk, params);
      this.form = res;
      this.createDialogVisiable = true;
      this.showForm = true;
    },

    closeDialog() {
      this.showForm = false;
      this.$refs.form.resetFields();
      this.resetForm();
    },

    // 提交
    async submitForm() {
      let valid = await new Promise((resolve, reject) => {
        this.$refs.form.validate(resolve);
      });
      let data = {
        ...this.form,
        biz_id: this.$bizCode.wenjuantimu_biz,
        // src_id: this.$sourceCode.source_id,
      };
      if (data.leixing === "问答") {
        let clean = {
          choices_length: 0,
          max_length: 0,
          must_length: 0,
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
        data = {...data, ...clean};
      }
      if (valid) {
        try {
          if (data.pk) {
            await resource.updateObj("data", data.pk, data);
          } else {
            await resource.createObj("data", data);
          }
          this.$message.success("保存成功!");
          this.closeDialog();
          await this.loadData();
        } catch (e) {
          console.error(e);
          this.$message.error("保存失败!");
        }
      } else {
        this.$message.error("请按要求填写!");
      }
    },

    maxTab(vule) {
      if (vule > 0) {
        this.form.must_length = 0;
      }
    },

    mustTab(vule) {
      if (vule > 0) {
        this.form.max_length = 0;
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
      for (let i = 0; i < info.length; i++) {
        info[i]["shijuan_id"] = this.id;
        info[i]["biz_id"] = this.$bizCode.wenjuantimu_biz;
        // info[i]["source_id"] = this.$sourceCode.source_id;
        info[i]["template_id"] = "FT138911001835397120";
        info[i].number = this.data.length + i + 1;
        if (info[i].leixing === "问答") {
          let clean = {
            choices_length: 0,
            max_length: 0,
            must_length: 0,
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
          info[i] = {...info[i], ...clean};
        }
        if (info[i].is_required == "是") {
          info[i].is_required = "是";
        } else {
          info[i].is_required = "否";
        }
        if (info[i].is_baseinfo == "是") {
          info[i].is_required = "是";
        } else {
          info[i].is_baseinfo = "否";
        }
        if (info[i].qita_number == "是") {
          info[i].qita_number = 1;
        } else {
          info[i].qita_number = 0;
        }
      }
      console.log(info,'123')
      await resource.createObj("data", info);
      this.loadData();
      this.loading = false;
    },

    // 批量删除
    async delAllTab(row) {
      if(this.hasResult){
        return this.$message.warning('已有答题结果，禁止删除题目！')
      }
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
            "FT138911001835397120"
          );
          await resource.deleteList(
            {
              shiti_id: row.pk,
            },
            "FT138488002023051264"
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

    // 下载模版
    downTemplate() {
      // console.log("下载模版");
      window.location.href = this.httpurl + "/excel/问卷试题模版.xls";
    },
  },
  async mounted() {
    this.resetForm();
    await this.loadData();
    await this.getLocalDataSource();
  },
};
</script>

<style scoped>
span.help {
  margin-left: 10px;
}

.up-loade {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}
</style>
