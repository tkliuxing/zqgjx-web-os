<template>
  <div class="shiti">
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.go(-1)"
            >返回</el-button
          >
          <el-button type="primary" round icon="el-icon-plus" @click="addTiku"
            >添加试题</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.leixing"
            placeholder="类型"
            clearable
            @change="changeLeixin"
          >
            <el-option label="单选" value="单选"></el-option>
            <el-option label="多选" value="多选"></el-option>
            <el-option label="判断" value="判断"></el-option>
            <el-option label="问答" value="问答"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.search"
            clearable
            placeholder="查找题目"
            @clear="loadData"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            round
            icon="el-icon-search"
            @click="loadData"
            >查找</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        element-loading-text="正在加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="data"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        border
        style="width: 100%; margin: 0 0 10px 0"
      >
        <el-table-column prop="timu" label="题目" width="400">
        </el-table-column>
        <el-table-column prop="leixing" label="类型"> </el-table-column>
        <el-table-column prop="daan" label="答案">
          <template slot-scope="{row}">
            {{row.daan || row.cankao}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="{ row }">
            <el-button type="success" round @click="editRow(row)"
              >编辑</el-button
            >
             <el-popconfirm title="确定删除吗？" @confirm="del(row)">
            <el-button type="danger" class="deleteButton"  round slot="reference" icon="el-icon-remove">
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
        style="margin-top: 10px"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="试题"
      :visible.sync="createDialogVisiable"
      width="50%"
      @closed="clearFormData('form')"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="leixing" label="类型">
          <el-select
            v-model="form.leixing"
            placeholder="类型"
            @change="formLeixingChange"
          >
            <el-option label="单选" value="单选"></el-option>
            <el-option label="多选" value="多选"></el-option>
            <el-option label="判断" value="判断"></el-option>
            <el-option label="问答" value="问答"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="timu" label="题目">
          <el-input
            type="textarea"
            :rows="2"
            v-model="form.timu"
            placeholder="题目"
          ></el-input>
        </el-form-item>

        <template v-if="form.leixing === '问答'">
          <el-form-item label="参考答案">
            <el-input
              type="textarea"
              :rows="4"
              v-model="form.cankao"
              placeholder="参考答案"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="form.leixing === '判断'">
          <el-form-item label="选项A">
            <el-input
              v-model="form.xuanxiang_01"
              placeholder="选项A"
            ></el-input>
          </el-form-item>
          <el-form-item label="选项B">
            <el-input
              v-model="form.xuanxiang_02"
              placeholder="选项B"
            ></el-input>
          </el-form-item>
          <el-form-item label="正确答案">
            <el-input v-model="form.daan" placeholder="A或B"></el-input>
          </el-form-item>
        </template>
        <template v-if="form.leixing === '单选' || form.leixing === '多选'">
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
                type="primary"
                plain
                circle
                icon="el-icon-plus"
                @click="form.choices_length += 1"
              ></el-button>
              <el-button
                v-if="form.choices_length > 2"
                type="primary"
                plain
                circle
                icon="el-icon-minus"
                @click="form.choices_length -= 1"
              ></el-button>
            </div>
          </el-form-item>
          <el-form-item label="正确答案">
            <el-input
              v-model="form.daan"
              placeholder="请按照'ABC...'格式填写"
            ></el-input>
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
const FORM = {
  tiku_id: null,
  number: 0,
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
const TMP_ID_ST = "FT138153450912034816"; // 试题
const TMP_ID_JG = "FT336770984361844736"; //结果
export default {
  name: "ShiTi",
  props: ["id"],
  computed: {
    ...mapState(["org_id"]),
  },
  data() {
    return {
      data: [],
      tiku: {},
      page: 1,
      pageSize: 15,
      total: 0,
      createDialogVisiable: false,
      filters: {
        leixing: null,
        search: null,
      },
      form: {
        ...FORM,
      },
      rules: {
        timu: [{ required: true, message: "请填写题目" }],
        leixing: [{ required: true, message: "请选择类型" }],
      },
      loading: false,
    };
  },
  methods: {
    // 跳转到批量上传
    addTiku() {
      this.$router.push({ name: "tikushitiexcel", params: { id: this.id } });
    },
    // 加载列表
    async loadData() {
      this.loading = true;

      let params = {
        page: this.page,
        pageSize: this.pageSize,
        tiku_id: this.id,
        // biz_id: this.$bizCode.tiku_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_ST,
      };
      if(this.filters.search){
        this.filters.search = this.filters.search;
        params.search = this.filters.search;
      }
      if(this.filters.leixing){
        this.filters.leixing = this.filters.leixing;
        params.leixing = this.filters.leixing;
      }
      let data = await resource.getList("data", params);
      this.total = data.count;
      this.data = data.data;
      this.loading = false;
    },
    // 类型搜索
    changeLeixin(value) {
      this.filters.leixing = value;
      this.loadData();
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
    // 清除数据表格
    clearFormData(formName) {
      this.form = {
        ...FORM,
      };
      this.$refs[formName].resetFields();
    },
    // 打开编辑
    editRow(data) {
      this.createDialogVisiable = true;
      this.form = { ...data };
    },
    // 删除
    async del(row) {
      try {
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
    // 编辑提交
    async submitForm() {
      let valid = await new Promise((resolve, reject) => {
        this.$refs.form.validate(resolve);
      });
      let data = {
        ...this.form,
        biz_id: this.$bizCode.tiku_biz,
        src_id: this.$sourceCode.source_id,
      };
      if (data.leixing === "问答") {
        let clean = {
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
          this.createDialogVisiable = false;
          this.loadData();
        } catch (e) {
          this.$message.error("保存失败!");
        }
      } else {
        this.$message.error("请按要求填写!");
      }
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>

<style scoped>
.deleteButton{
      width: 56px;
    height: 32px;
    padding-left: 5px;
    margin-left: 8px;
}
</style>
