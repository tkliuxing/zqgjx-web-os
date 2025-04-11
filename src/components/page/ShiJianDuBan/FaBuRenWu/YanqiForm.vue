<template>
  <div >
    <el-form :model='form' ref="form" label-width="100px" status-icon>
      <el-form-item label="任务名称" prop="task_name" :rules="[
            { required:true, message:'任务名称为必填项' },
        ]">
        <el-input :disabled="readonly" v-model="form.task_name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="任务类型" prop="task_type" :rules="[
            { required:true, message:'任务类型为必填项' },
        ]">
        <el-select :disabled="readonly" v-model="form.task_type" style="width:100%" clearable filterable>
          <el-option v-for="item in type" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="任务状态" prop="task_status" :rules="[
            { required:true, message:'任务状态为必填项' },
        ]">
        <el-select :disabled="readonly" v-model="form.task_status" style="width:100%" clearable filterable>
          <el-option v-for="item in status" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="fuzeren_name" :rules="[ { required:true, message:'负责人为必填项' },]">
        <el-select :disabled="readonly" v-model="form.fuzeren_name" style="width:100%" clearable filterable>
          <el-option v-for="item in user_option_data" :key="item.pk" :label="item.full_name" :value="item.full_name" @click.native="changefuzeren(item)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行人" prop="zhixingren" :rules="[ { required:true, message:'执行人为必填项' },]">
        <el-select :disabled="readonly" v-model="form.zhixingren" style="width:100%" clearable filterable>
          <el-option v-for="item in user_option_data" :key="item.pk" :label="item.full_name" :value="item.full_name" @click.native="changeuser(item)"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="执行人ID" prop="zhixingren_id" :rules="[
            { required:true, message:'执行人ID为必填项' },
        ]">

      <el-input :disabled="readonly" v-model="form.zhixingren_id"></el-input>

    </el-form-item> -->
      <el-form-item label="优先级" prop="level" :rules="[
            { required:true, message:'优先级为必填项' },
        ]">
        <el-select :disabled="readonly" v-model="form.level" style="width:100% " clearable filterable>
          <el-option v-for="item in priority" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="任务描述" prop="task_content" :rules="[
            { required:true, message:'任务描述为必填项' },
        ]">
        <el-input :disabled="readonly" v-model="form.task_content"></el-input>
      </el-form-item> -->
      <el-form-item label="创建时间" prop="create_time" :rules="[
            { required:true, message:'创建时间为必填项' },
        ]">

        <el-date-picker :disabled="readonly" type="datetime" v-model="form.create_time" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" />

      </el-form-item>
      <el-form-item label="任务时限" prop="task_endtime" :rules="[]">

        <el-date-picker :disabled="readonly" v-model="form.task_endtime" style="width:100%" value-format="yyyy-MM-dd" />

      </el-form-item>
      <!-- <el-form-item label="附件" prop="fujian" :rules="[]">

        <el-upload :disabled="readonly" :action="BASE_HOST+'/api/v1/fileupload/'" :limit="1" :on-exceed="handlefileExceed" :on-success="(res)=>handlefileSuccess(res,'fujian')"
          :on-remove="()=>handlefileRemove('fujian')" :headers="headers" :data="fileData" :on-preview="handlefilePreview" :file-list="form['fujian']?[{name:'附件',url:form['fujian']}]:[]">
          <el-button type="primary">点击上传</el-button>
        </el-upload>

      </el-form-item> -->
    </el-form>
  </div>

</template>
<script>
//
// TEMPLATE_ID: FT204884904327495680
// 字段说明:
// task_id:任务编号
// task_name:任务名称
// task_type:任务类型
// task_status:任务状态
// fuzeren_name:负责人
// fuzeren_id:负责人ID
// zhixing_department:执行部门
// department_id:部门ID
// zhixingren:执行人
// zhixingren_id:执行人ID
// level:优先级
// task_content:任务描述
// create_time:创建时间
// task_endtime:任务时限
// fujian:附件
import { mapState } from "vuex";
import { verifyMobile, verifyEmail, verifyIdCard } from "@/utils/verify.js";
import { getList } from "@/resource";
import { BASE_HOST } from "@/constvars";
export default {
  name: "Form",
  model: {
    prop: "form",
  },
  props: {
    form: Object,
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["userinfo"]),
  },
  data() {
    return {
      headers: {
        Authorization: null,
      },
      BASE_HOST: BASE_HOST,
      fileData: {
        sys_id: null,
        org_id: null,
      },

      zhixing_department_option_data: null,
      user_option_data: [],
      priority: [],
      status: [],
      type: [],
      verifyMobile,
      verifyEmail,
      verifyIdCard,
    };
  },
  methods: {
    changefuzeren(row) {
      this.form.fuzeren_id = row.pk;
      this.form.fuzeren_name = row.full_name;
    },
    changeuser(row) {
      this.form.zhixingren_id = row.pk;
      this.form.zhixingren = row.full_name;
    },
    async getLocalDataSource() {
      this.headers.Authorization = "Bearer " + this.$store.state.token;
      this.fileData.sys_id = this.$store.state.sys_id;
      this.fileData.org_id = this.$store.state.userinfo.org_id;

      let res6 = await getList("flatdepartment", {});
      this.zhixing_department_option_data = res6;
      let res7 = await getList("usermin", {});
      this.user_option_data = res7;
      let res8 = await getList("basetree", { parent: "bt275146066762592256" });
      this.priority = res8;
      let res1 = await getList("basetree", { parent: "bt275147447960932352" });
      this.status = res1;
      let res2 = await getList("basetree", { parent: "bt275148824974139392" });
      this.type = res2;
    },
    async submit() {
      let valid = await new Promise((resolve) =>
        this.$refs.form.validate((validate) => resolve(validate))
      );

      if (valid) {
        this.$emit("checked");
      } else {
        this.$message.warning("请认真填写表单!");
      }
    },
    handlefileExceed() {
      this.$message.warning("只可选择 1 个文件");
    },
    handlefileRemove(field) {
      this.form[field] = null;
    },
    handlefilePreview(res) {
      if (res.url) {
        let a = document.createElement("a");
        a.href = res.url;
        a.target = "_blank";
        a.click();
      }
    },
    handlefileSuccess(res, field) {
      if (res.file) {
        this.form[field] = res.file;
      }
    },
  },
  created() {
    this.getLocalDataSource();
  },
};
</script>
<style scoped>
</style>
