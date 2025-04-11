<template>
  <el-form :model='form' ref="form" label-width="100px" status-icon>
    <el-form-item  label="任务状态" prop="task_status" :rules="[
            { required:true, message:'任务状态为必填项' },
        ]">
      <el-select :disabled="readonly" v-model="form.task_status" style="width:100%" clearable filterable>
        <el-option v-for="item in status" :key="item.pk" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="form.task_status !== '完成'" label="执行人" prop="zhixingren" :rules="[]">
      <el-select :disabled="readonly" v-model="form.zhixingren" style="width:100%" clearable filterable>
        <el-option v-for="item in user_option_data" :key="item.pk" :label="item.full_name" :value="item.full_name" @click.native="changeuser(item)"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="处理时间" prop="make_time" :rules="[  { required:true, message:'处理时间为必填项' },]">
      <el-date-picker :disabled="readonly" type="datetime" v-model="form.make_time" style="width:100%"  value-format="yyyy-MM-dd HH:mm:ss" />
    </el-form-item>

    <el-form-item label="任务时限" prop="task_endtime" :rules="[]">

      <el-date-picker :disabled="readonly" v-model="form.task_endtime" style="width:100%" value-format="yyyy-MM-dd" />

    </el-form-item>
    <!-- <el-form-item label="任务状态" prop="task_status" :rules="[
            { required:true, message:'任务状态为必填项' },
        ]">

      <el-select :disabled="readonly" v-model="form.task_status" style="width:100%" clearable filterable>
        <el-option v-for="item in status" :key="item.pk" :label="item.name" :value="item.name"></el-option>
      </el-select>

    </el-form-item> -->
    <el-form-item label="附件" prop="fujian" :rules="[]">
      <!-- <el-input :disabled="readonly" v-model="form.fujian"></el-input> -->
      <el-upload :action="BASE_HOST+'/api/v1/fileupload/'" :limit="1" :on-exceed="handlefileExceed" :on-success="(res)=>handlefileSuccess(res,'fujian')" :on-remove="()=>handlefileRemove('fujian')"
        :headers="headers" :data="fileData" :on-preview="handlefilePreview" :file-list="form['fujian']?[{name:'附件',url:form['fujian']}]:[]">
        <el-button type="primary" v-if="!readonly">点击上传</el-button>
        <div v-else>

          <el-link v-if="form.fujian" :href="form.fujian">查看/下载</el-link>
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item label="处理意见" prop="make_idea" :rules="[{ required:true, message:'处理意见为必填项' },]">
      <el-input :disabled="readonly" v-model="form.make_idea"></el-input>
    </el-form-item>

  </el-form>
</template>
<script>
//
// TEMPLATE_ID: FT210655946362568704
// 字段说明:
// task_status:任务状态
// task_id:任务编号
// task_name:任务名称
// zhixing_department:执行部门
// department_id:部门ID
// zhixingren:执行人
// zhixingren_id:执行人ID
// make_time:处理时间
// fujian:附件
// make_idea:处理意见
import { mapState } from "vuex";
import { verifyMobile, verifyEmail, verifyIdCard } from "@/utils/verify.js";
import {getList, createObj, getObj, updateObj, deleteObj, getObjFromList} from "@/resource";
import { BASE_HOST } from "@/constvars";
export default {
  name: "logForm",
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
      fileData: {
        sys_id: null,
        org_id: null,
      },
      status: [],
      BASE_HOST: BASE_HOST,
      zhixing_department_option_data: [],
      user_option_data: [],
      verifyMobile,
      verifyEmail,
      verifyIdCard,
    };
  },
  methods: {
    changeuser(row) {
      this.form.zhixingren_id = row.pk;
      this.form.zhixingren = row.full_name;
    },
    async getLocalDataSource() {
      this.headers.Authorization = "Bearer " + this.$store.state.token;
      this.fileData.sys_id = this.$store.state.sys_id;
      this.fileData.org_id = this.$store.state.userinfo.org_id;
      // let res1 = await getList("basetree", { parent: "bt275147447960932352" });
      // this.status = res1;
      let res3 = await getList("flatdepartment", {});
      this.zhixing_department_option_data = res3;
      let res7 = await getList("usermin", {});
      this.user_option_data = res7;

      let res1 = await getObjFromList("basetree", { name: "任务状态" ,org_id: 0});
      if(res1.items.length>0){
        this.status = res1.items;
      }


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
