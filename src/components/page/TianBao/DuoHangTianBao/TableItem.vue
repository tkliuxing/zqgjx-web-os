<template>
  <div>
    <div style="display: flex">
      <Form
        ref="formData"
        v-model="form"
        @add="addformList"
        :update="editValue"
        :api_name="template.api_name"
        :remark="template.remark"
        @update="updateValue"
      />
      <div style="flex: 1">
        <el-table
          :data="fields"
          border
          max-height="450"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="排序编号" prop="sort_num"></el-table-column>
          <el-table-column label="字段名称" prop="col_title"></el-table-column>
          <el-table-column label="控件类型" prop="widget"></el-table-column>
          <el-table-column
            label="填报时间"
            prop="data"
            v-if="template.remark.type === '自然日' || template.remark.type === '工作日'"
          ></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button @click="edit(row)" type="primary">编辑</el-button>
              <el-button @click="del(row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="form-footer">
      <el-button @click="$emit('close', false)">取 消</el-button>
      <el-button type="primary" @click="createTemplate('template')">确 定</el-button>
    </div>
  </div>
</template>

<script>
import Form from "./Form.vue";
import { mapState } from "vuex";
import resource from "@/resource";
const template_form = {
  sort_num: null,
  title: null,
  remark: null,
  form_type: 1,
  keyword: "",
  api_version: "v1",
  api_name: "formdata",
  code: "",
  photo: "",
  biz_id: 10000,
};

export default {
  computed: {
    ...mapState(["systemlist"]),
  },
  props: { updateForm: Object },
  data() {
    return {
      template: { ...template_form },
      form: {
        template: null,
        sort_num: null,
        col_title: null,
        col_name: null,
        widget: "input",
        widget_attr: null,
        verify_exp: null,
        data_source: null,
        local_data_source: null,
        in_filter: false,
        date: null,
      },
      tempApi_name: "formdata",
      fields: [],
      editValue: false,
      templateData_copy: [],
      loading: false,
      search: "",
    };
  },
  methods: {
    async addformList() {
      if (!this.form.widget_attr) {
        this.form.widget_attr = "{}";
      }
      if (!this.form.verify_exp) {
        this.form.verify_exp = "[]";
      }
      if (this.template.pk) {
        if (this.form.data) {
          // this.form.data[0] = moment(this.form.data[0]).format("hh:mm:ss");
          // this.form.data[1] = moment(this.form.data[1]).format("hh:mm:ss");
          this.form.data = this.form.data.join("-");
        }
        this.form.template = this.template.pk;
        this.form.col_name = this.getColName();
        let res = await resource.createObj("formfields", this.form);
        this.updateForm.field.push(res);
        this.clear();
      }
      this.initUpdate();
    },

    async createTemplate(formName) {
      let objToStr = JSON.stringify(this.template.remark);
      let data = { ...this.template };
      data.remark = objToStr;
      data.form_type = 2;
      await resource.updateObj("formtemplate", data.pk, data);
      this.$emit("close");
      this.$emit("loadData");
    },

    initUpdate() {
      this.fields = this.updateForm.field.length > 0 ? [...this.updateForm.field] : [];
      this.template = { ...this.template, ...this.updateForm };
      if (this.updateForm.pk) {
        this.tempApi_name = this.updateForm.api_name;
      }
    },

    edit(obj) {
      let ll = {...obj}
      if (ll.data) {
        ll.data = ll.data.split("-");
      }
      this.form = ll;
      this.editValue = true;
    },

    del(obj) {
      this.$confirm("删除不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          if (obj.pk) {
            await resource.deleteObj("formfields", obj.pk);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          let idx = this.updateForm.field.findIndex((i) => {
            return i.pk === obj.pk;
          });
          this.updateForm.field.splice(idx, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    async updateValue() {
      if (this.form.data) {
        // this.form.data[0] = moment(this.form.data[0]).format("HH:mm:ss");
        // this.form.data[1] = moment(this.form.data[1]).format("HH:mm:ss");
        this.form.data = this.form.data.join("-");
      }
      let res = await resource.updateObj("formfields", this.form.pk, this.form);
      let idx = this.updateForm.field.findIndex((i) => {
        return i.pk === res.pk;
      });
      this.updateForm.field.splice(idx, 1, JSON.parse(JSON.stringify(res)));
      this.clear();
      this.editValue = false;
    },

    clear() {
      this.form = {
        template: null,
        sort_num: null,
        col_title: null,
        col_name: null,
        widget: "input",
        widget_attr: null,
        verify_exp: null,
        width: null,
        data_source: null,
      };
      this.$refs.formData.$refs["ruleForm"].resetFields();
    },

    getColName() {
      let exist_field_names = this.fields.map((val) => val.col_name);
      for (let i = 1; i < 101; i++) {
        let db_field_name = "field_" + this.pad(i, 2);
        if (exist_field_names.indexOf(db_field_name) === -1) {
          return db_field_name;
        }
      }
      this.$message.error("数据库字段已用完");
      throw Error("数据库字段已用完");
    },

    pad(num, n) {
      var len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
  },
  created() {
    this.initUpdate();
  },
  components: {
    Form,
  },
  watch: {
    updateForm: {
      handler() {
        this.initUpdate();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.form-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  box-sizing: border-box;
}

.upload /deep/ .el-upload {
  display: none;
}
</style>
