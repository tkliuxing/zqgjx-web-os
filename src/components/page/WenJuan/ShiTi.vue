<template>
  <div class="shiti">
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.replace({ name: 'wenjuan-shijuan' })"
            >返回问卷列表
          </el-button>
          <el-button type="primary" round icon="el-icon-plus" @click="addTo"
            >添加题目</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.leixing"
            placeholder="类型"
            clearable
          >
            <el-option label="单选" value="单选"></el-option>
            <el-option label="多选" value="多选"></el-option>
            <el-option label="问答" value="问答"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.search"
            placeholder="查找题目内容"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="loadData"
            round
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
        border
        style="margin-top: 1rem"
      >
        <el-table-column prop="number" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="timu" label="题目" width="400">
        </el-table-column>
        <el-table-column prop="leixing" label="类型"> </el-table-column>
        <el-table-column prop="zhushi" label="注释"> </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" round @click="editRow(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" round @click="deleteRow(scope.row)">
              删除
            </el-button>
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
      title="题目"
      :visible.sync="createDialogVisiable"
      width="50%"
      @closed="clearFormData('form')"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item prop="number" label="序号">
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
        <el-form-item prop="leixing" label="类型">
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
        <el-form-item prop="timu" label="题目">
          <el-input
            type="textarea"
            :rows="2"
            v-model="form.timu"
            placeholder="题目"
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
          <div style="color: #999; font-size: 10px">(最后一项是否为填写项)</div>
        </el-form-item>
        <template v-if="form.leixing === '单选' || form.leixing === '多选'">
          <template v-if="form.leixing === '多选'">
            <el-form-item label="最多选几项">
              <el-input-number
                v-model="form.max_length"
                :min="0"
                :max="form.choices_length"
                label="最多选几项"
                @change="maxTab"
              ></el-input-number>
              <span class="help">0 为不限制</span>
            </el-form-item>
            <el-form-item label="必须选几项">
              <el-input-number
                v-model="form.must_length"
                :min="0"
                :max="form.choices_length"
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
  pk: null,
  org_id: null,
  shijuan_id: null,
  number: 0,
  qita_number: 0,
  timu: "",
  zhushi: null,
  is_required: "是",
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
};

export default {
  name: "ShiTi",
  props: ["id"],
  computed: {
    ...mapState(["org_id"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      data: [],
      showForm: false,
      filters: {
        leixing: "",
        search: "",
      },
      form: {
        ...FORM,
      },
      rules: {
        number: [{ required: true, message: "请填写序号" }],
        timu: [{ required: true, message: "请填写题目" }],
        leixing: [{ required: true, message: "请选择类型" }],
      },
      loading: false,
      createDialogVisiable: false,
      hasResult: false,
    };
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        shijuan_id: this.id,
        biz_id: this.$bizCode.wenjuan_biz_id,
        // source_id: this.$sourceCode.source_id,
        template_id: "FT138911001835397120",
      };
      if(this.filters.leixing){
        params.leixing = this.filters.leixing
      }
      if(this.filters.search){
        params.search = this.filters.search
      }
      let res = await resource.getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
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
    // 清除表格数据
    clearFormData(formName) {
      this.form = { ...FORM };
      this.$refs[formName].resetFields();
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

    // 编辑提交
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
    // 编辑
    async editRow(data) {
      if(this.hasResult){
        return this.$message.warning('已有答题结果，禁止编辑题目！')
      }
      let params = {
        biz_id: this.$bizCode.wenjuantimu_biz,
        // src_id: this.$sourceCode.source_id,
        template_id: "FT138911001835397120",
      };
      let res = await resource.getObj("data", data.pk, params);
      this.form = res;
      this.createDialogVisiable = true;
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
    // 添加题目
    addTo() {
      this.$router.push({
        name: "wenjuan-excel",
        params: {
          id: this.id,
        },
      });
    },
  },
  async mounted() {
    await this.loadData();
    await this.getLocalDataSource();
  },
};
</script>

<style scoped>
span.help {
  margin-left: 10px;
}
</style>
