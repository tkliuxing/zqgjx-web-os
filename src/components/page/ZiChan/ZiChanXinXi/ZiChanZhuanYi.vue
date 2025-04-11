<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisable"
      @closed="$emit('close', false)"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <el-form label-width="auto" ref="form" :model="form" :rules="rules">
        <el-form-item label="转入单位" prop="to_department">
          <el-cascader
            v-model="zrdw"
            :options="departmentList"
            :show-all-levels="false"
            :props="{
              children: 'items',
              label: 'name',
              value: 'pk',
              checkStrictly: true,
            }"
            @change="ChangeBumen"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="转入人员" prop="to_person">
          <el-input v-model="form.to_person"></el-input>
        </el-form-item>
        <el-form-item label="存放地点" prop="to_address">
          <el-input v-model="form.to_address"></el-input>
        </el-form-item>
        <el-form-item label="经办人员" prop="hanlder_person">
          <el-input v-model="form.hanlder_person"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="$emit('close', false)">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import resource from "@/resource";
export default {
  props: {
    visable: {
      type: Boolean,
      required: true,
      default: false,
    },
    data: Object,
  },
  data() {
    return {
      dialogVisable: false,
      datas: {},
      departmentList: [],
      zrdw: [],
      jbbm: [],
      form: {
        to_department: "",
        to_department_display: "",
        to_person: "",
        to_address: "",
        hanlder_person: "",
        remark: "",
        zichan_id: "",
        template_id: "FT9157579112448",
        zichan_name:'',
        zichan_sn:''
      },
      rules: {
        to_department: [{ required: true, message: "请选择转入部门" }],
        to_person: [{ required: true, message: "请填写转入人员" }],
        to_address: [{ required: true, message: "请填写存放地点" }],
        hanlder_person: [{ required: true, message: "请填写经办人员" }],
      },
    };
  },
  methods: {
    async loadDepartment() {
      let res = await resource.getList("department");
      this.departmentList = this.filterChildrenNull(res);
    },
    filterChildrenNull(data) {
      data.forEach((i) => {
        if (i.items.length > 0) {
          this.filterChildrenNull(i.items);
        } else {
          i.items = undefined;
        }
      });
      return data;
    },
    async ChangeBumen(value) {
      this.form.to_department = value.slice(-1)[0];
      let pk = value.slice(-1).toString();
      const res = await resource.getObj("department", pk);
      this.form.to_department_display = res.name;
    },
    async submit() {
      let valid = await new Promise((reslove) =>
        this.$refs.form.validate(reslove)
      );
      if (valid) {
        try {
          this.form.zichan_id = this.datas.pk;
          this.form.zichan_name=this.datas.name;
          this.form.zichan_sn=this.datas.sn;
          let zcdata = {
            ...this.form,
            biz_id: this.$bizCode.zichan_biz,
            src_id: this.$sourceCode.source_id,
          };
          await resource.createObj("data", zcdata);
          await resource.updateObj("data", this.datas.pk, {
            status: "已分配",
            department: this.form.to_department,
            department_display: this.form.to_department_display,
            persion: this.form.to_person,
            location: this.form.to_address,
            template_id:'FT8172429443072'
          });
          this.$message.success("转移成功!");
          this.$emit("close", false);
        } catch (error) {
          this.$message.error("出现错误,请稍后重试!");
        }
      } else {
        this.$message.error("请认真填写表单!");
      }
    },
  },
  created() {
    this.loadDepartment();
  },
  watch: {
    visable: {
      handler(value) {
        this.dialogVisable = value;
        this.datas = this.data;
        this.form.out_department=this.data.department;
        this.form.out_department_display=this.data.department_display;
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.el-form >>> .el-form-item__content .el-cascader {
  width: 100%;
}
</style>