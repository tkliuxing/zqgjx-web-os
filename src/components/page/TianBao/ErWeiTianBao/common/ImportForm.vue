<template>
  <el-form :model='form' ref="form" label-width="100px" status-icon>

    <el-form-item v-for="(item, index) in tableHeader" :label="item.name" :key="index" :prop="`${item.value}`" :rules="[]">
      <el-input v-model="form[item.value]"></el-input>
    </el-form-item>

  </el-form>
</template>
<script>
export default {
  name: "Form",
  model: {
    prop: "form"
  },
  props: {
    form: Object,
    tableHeader: Array,
  },
  data() {
    return {
      headers: {
        Authorization: null
      },
      fileData: {
        sys_id: null,
        org_id: null
      },
    }
  },
  methods: {
    async getLocalDataSource() {
      this.headers.Authorization = `Bearer ${this.$store.state.token}`;
      this.fileData.sys_id = this.$store.state.sys_id;
      this.fileData.org_id = this.$store.state.userinfo.org_id;
    },
    async submit() {
      let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)))
      if (valid) {
        this.$emit("checked");
      } else {
        this.$message.warning("请认真填写表单!")
      }
    },
  },
  created() {
    this.getLocalDataSource()
  }
}
</script>