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
          <el-table-column label="控件类型">
            <template slot-scope="{ row }">
              {{ widgetType(row.widget) }}
            </template>
          </el-table-column>
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
      <el-button type="primary" @click="createTemplate('template')"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<script>
import Form from "./Form.vue";
import { mapState } from "vuex";
import resource from "@/resource";
const template_form = {
  sort_num: null,
  col_title: null,
  in_filter: null,
  is_required: null,
  widget: "input",
  bgtb_id: null,
  // title: null,
  // remark: null,
  // form_type: 1,
  // keyword: "",
  // api_version: "v1",
  // api_name: "formdata",
  // code: "",
  // photo: "",
  // biz_id: 10000,
};

export default {
  computed: {
    ...mapState(["systemlist"]),
  },
  props: { updateForm: Array },
  data() {
    return {
      template: { ...template_form },
      form: {
        // biz_id: 1,
        col_title: null,
        in_filter: null,
        is_required: null,
        // org_id: 1,
        widget: "input",
        // pk: "D184183022507909120",
        sort_num: null,
        bgtb_id: null,
        // src_id: 1,
        // sys_id: 1,
        // template_id: "FT182699245302837248",
        // widget: null,
        // template: null,
        // sort_num: null,
        // col_title: null,
        // col_name: null,
        // widget: "input",
        // widget_attr: null,
        // verify_exp: null,
        // data_source: null,
        // local_data_source: null,
        // in_filter: false,
        // date: null,
      },
      tempApi_name: "formdata",
      fields: [],
      editValue: false,
      templateData_copy: [],
      loading: false,
      search: "",
      template_id: "FT182699245302837248",
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
          this.form.data = this.form.data.join("-");
        }
        // this.form.template = this.template.pk;
        this.form.col_name = this.getColName();
        let res = await resource.createObj("data", this.form);
        this.updateForm.field.push(res);
        this.clear();
      }
      this.initUpdate();
    },

    async createTemplate(formName) {
      // let objToStr = JSON.stringify(this.template.remark);
      let objToStr2 = JSON.stringify(this.template.table_lines);
      let data = { ...this.template };
      // data.remark = objToStr;
      data.table_lines = objToStr2;
      data.form_type = 2;
      await resource.updateObj("data", data.pk, data);
      this.$emit("close");
      this.$emit("loadData");
    },

    initUpdate() {
      this.fields =
        this.updateForm.field.length > 0 ? [...this.updateForm.field] : [];
      this.template = { ...this.template, ...this.updateForm };
      // if (this.updateForm.pk) {
      //   this.tempApi_name = this.updateForm.api_name;
      // }
    },

    edit(obj) {
      let ll = { ...obj };
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
            await resource.deleteObj("data", obj.pk);
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
        this.form.data = this.form.data.join("-");
      }
      let res = await resource.updateObj("data", this.form.pk, this.form);
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

    widgetType(type) {
      if (type === "input") {
        return "输入框";
      }
      if (type === "select") {
        return "选项框";
      }
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
