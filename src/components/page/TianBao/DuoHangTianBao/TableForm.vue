<template>
  <div>
    <el-form :model="template" ref="template" label-width="100px">
      <el-form-item
        label="表单名称"
        prop="title"
        :rules="{ required: true, message: '必填项!' }"
      >
        <el-input v-model="template.title" />
      </el-form-item>

      <el-form-item label="表单备注">
        <el-input v-model="template.remark.bz_info" />
      </el-form-item>

      <el-form-item label="是否启用">
        <el-switch
          v-model="template.remark.qy_state"
          active-text="开启"
          inactive-text="关闭"
          active-value="是"
          inactive-value="否"
        >
        </el-switch>
      </el-form-item>

      <el-form-item label="生效日期">
        <el-date-picker
          v-model="template.remark.start_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="截止日期">
        <el-date-picker
          v-model="template.remark.end_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="重复填报">
        <el-switch
          v-model="template.remark.show_result"
          active-text="是"
          inactive-text="否"
          active-value="是"
          inactive-value="否"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="表单行数">
        <el-input-number :min="1" v-model="template.remark.total_length" />
      </el-form-item>
      <template v-if="template.remark.show_result === '是'">
        <el-form-item label="填报周期">
          <el-select v-model="template.remark.type" placeholder="请选择填报类型">
            <el-option label="不限" value="不限"></el-option>
            <el-option label="季度" value="季度"></el-option>
            <el-option label="月度" value="月度"></el-option>
            <el-option label="旬" value="旬"></el-option>
            <el-option label="周" value="周"></el-option>
            <el-option label="自然日" value="自然日"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="每日次数"
          v-if="template.remark.type === '自然日' || template.remark.type === '工作日'"
        >
          <el-input-number v-model="template.remark.day_number" :min="1" :max="3" />
        </el-form-item>
        
      </template>
    </el-form>
    <div class="form-footer">
      <el-button @click="$emit('close', false)">取 消</el-button>
      <el-button type="primary" @click="createTemplate('template')">确 定</el-button>
    </div>
  </div>
</template>

<script>
import resource from "@/resource";

export default {
  props: { updateForm: Object },
  data() {
    return {
      template: {
        title: null,
        remark: null,
        form_type: 1,
        keyword: "",
        api_version: "v1",
        api_name: "formdata",
        code: "",
        photo: "",
        biz_id: 10000,
        remark: {
          show_result: "是",
          day_loop: "否",
          qy_state: "是",
          type: "不限",
          day_number: 1,
          total_length: 1,
        },
      },
      tempApi_name: "formdata",
    };
  },
  methods: {
    // 修改表单
    createTemplate(formName) {
      let objToStr = JSON.stringify(this.template.remark);
      let data = { ...this.template };
      data.remark = objToStr;
      data.form_type = 2;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (data.pk) {
            await resource.updateObj("formtemplate", data.pk, data);
          } else {
            await resource.createObj("formtemplate", data);
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
      this.template = { ...this.template, ...this.updateForm };
      if (this.updateForm.pk) {
        this.tempApi_name = this.updateForm.api_name;
      }
    },

    clear() {
      this.template = {
        title: null,
        remark: null,
        form_type: 1,
        keyword: "",
        api_version: "v1",
        api_name: "formdata",
        code: "",
        photo: "",
        biz_id: 10000,
        remark: {
          show_result: "是",
          day_loop: "否",
          qy_state: "是",
          type: "不限",
          day_number: 1,
          total_length: 1,
        },
      };
      this.$refs.template.resetFields();
    },
  },

  created() {
    this.initUpdate();
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

.help {
  margin: 0 10px;
}
</style>
