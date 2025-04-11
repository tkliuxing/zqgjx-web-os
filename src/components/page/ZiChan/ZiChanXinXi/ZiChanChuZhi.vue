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
        <el-form-item label="处置原因">
          <el-input v-model="form.disposeReason"></el-input>
        </el-form-item>
        <el-form-item label="处置方式">
          <el-input v-model="form.disposeMode"></el-input>
        </el-form-item>
        <el-form-item label="处置总价(￥)">
          <el-input v-model="form.disposePrice"></el-input>
        </el-form-item>
        <el-form-item label="处置费用(￥)">
          <el-input v-model="form.disposeMoney"></el-input>
        </el-form-item>
        <el-form-item label="经办人员">
          <el-input v-model="form.handlerPeroson"></el-input>
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
import { getList, createObj, updateObj } from "@/resource.js";
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
      form: {
        disposeMode: "",
        disposePrice: "",
        disposeMoney: "",
        disposeReason: "",
        handlerPeroson: "",
        remark: "",
        zichan_id:null,
        zichan_name:null,
        zichan_sn:null,
        template_id: "FT9213304709120",
      },
      rules: {},
    };
  },
  methods: {
    async submit() {
      let valid = await new Promise((reslove) =>
        this.$refs.form.validate(reslove)
      );
      if (valid) {
        try {
          let data = {
            ...this.form,
            zichan_id: this.data.pk,
            zichan_name:this.data.name,
            zichan_sn:this.data.sn,
            biz_id: this.$bizCode.zichan_biz,
            src_id: this.$sourceCode.source_id,
          }
          await createObj("data", data);
          await updateObj("data", this.datas.pk, {
            status: "已处置",
            template_id:"FT8172429443072"
          });
          this.$message.success("处置成功!");
          this.$emit("close", false);
        } catch (error) {
          this.$message.error("出现错误,请稍后重试!");
        }
      } else {
        this.$message.error("请认真填写表单");
      }
    },
  },
  watch: {
    visable: {
      handler(value) {
        this.dialogVisable = value;
        this.datas = this.data;
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