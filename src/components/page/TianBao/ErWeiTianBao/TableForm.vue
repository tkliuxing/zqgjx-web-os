<template>
  <div>
    <el-form :model="template" ref="template" label-width="120px">
      <el-form-item
          label="表单名称"
          prop="title"
          :rules="{ required: true, message: '必填项!' }"
      >
        <el-input v-model="template.title" maxlength="120" show-word-limit suffix-icon="el-icon-warning"/>
      </el-form-item>

      <el-form-item label="开启多行统计">
        <el-switch
            v-model="template.remark.is_groups"
            :disabled="template.pk ?true :false"
            active-color="#13ce66"
            active-text="开启"
            inactive-text="关闭"
        >
        </el-switch>
        <el-tooltip style="margin-left: 15px" class="item" effect="light" content="当前填报只能设置一次，设置后不可变更"
                    placement="right-end">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="使用部门范围" prop="department" :rules="{ required: true, message: '必填项!' }">
        <el-select v-model="template.department" multiple placeholder="请选择" style="width: 100%">
          <el-option
              v-for="item in dep_array"
              :key="item.pk"
              :label="item.name"
              :value="item.pk">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="表单备注">
        <el-input v-model="template.remark.bz_info"/>
      </el-form-item>
    </el-form>
    <div class="form-footer">
      <el-button @click="$emit('close', false)">取 消</el-button>
      <el-button type="primary" @click="createTemplate('template')">
        确 定
      </el-button>
    </div>
  </div>
</template>

<script>
import resource from "@/resource";

export default {
  props: {updateForm: Object},
  data() {
    return {
      template: {
        title: null,
        form_type: 3,
        keyword: "",
        api_version: "v1",
        api_name: "formdata",
        code: "",
        department: [],
        photo: "",
        remark: {
          group_type: [],
          col_type: [],
          resource: {},
          bz_info: null,
          is_groups: false,
          groups: {
            heard: [],
            col_list: [],
            resource: {}
          }
        },
        need_login: false,
      },
      tempApi_name: "formdata",
      dep_array: [],
    };
  },
  methods: {
    // 获取部门信息
    async getDepartment() {
      let params = {
        pk: this.$store.state.userinfo.department_child_ids,
      };
      let res = await resource.getList("flatdepartment", params);
      this.dep_array = [...res];
    },
    // 修改表单
    createTemplate(formName) {
      let is_groups = this.template.remark.is_groups;
      let objToStr = JSON.stringify(this.template.remark);
      let data = {
        ...this.template,
        biz_id: this.$bizCode.tianbao_biz,
        src_id: this.$sourceCode.source_id,
        remark: objToStr,
      };
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (data.pk) {
            await resource.updateObj("formtemplate", data.pk, data);
          } else {
            let obj = await resource.createObj("formtemplate", data);
            await resource.createObj("formfields", {
              "template": obj.pk,
              "sort_num": 0,
              "alias": "user_id",
              "col_title": "所属用户",
              "col_name": "user_id",
              "widget": "input",
              "widget_attr": "{}",
              "verify_exp": "[]",
              "data_source": null,
              "local_data_source": null,
              "in_filter": true,
              "date": null,
              "data": "00:00:00-23:59:59"
            });
            if (is_groups) {
              await resource.createObj("formfields", {
                "template": obj.pk,
                "sort_num": 0,
                "alias": "region",
                "col_title": "地区",
                "col_name": "field_50",
                "widget": "input",
                "widget_attr": "{}",
                "verify_exp": "[]",
                "data_source": null,
                "local_data_source": null,
                "in_filter": true,
                "date": null,
                "data": "00:00:00-23:59:59"
              });

            }
          }
          this.$emit("close");
          this.$emit("loadData");
          this.clear();
        } else {
          this.$message.error("请认真检查必填项!");
          return;
        }
      });
    },

    // 初始化表单
    initUpdate() {
      this.template = {...this.template, ...this.updateForm};
      if (this.updateForm.pk) {
        this.tempApi_name = this.updateForm.api_name;
      } else {
        this.template.department.push(this.$store.state.userinfo.department)
      }
    },
    clear() {
      this.template = {
        title: null,
        form_type: 3,
        keyword: "",
        api_version: "v1",
        api_name: "formdata",
        code: "",
        department: [],
        photo: "",
        remark: {
          group_type: [],
          col_type: [],
          resource: {},
          bz_info: null,
          is_groups: false,
          groups: {
            heard: [],
            col_list: [],
            resource: {}
          }
        },
        need_login: false,
      };
      this.$refs.template.resetFields();
    },

  },

  created() {
    this.getDepartment();
    // this.initUpdate();

  },

  watch: {
    updateForm: {
      handler() {
        this.initUpdate();
      },
      immediate: true,
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
