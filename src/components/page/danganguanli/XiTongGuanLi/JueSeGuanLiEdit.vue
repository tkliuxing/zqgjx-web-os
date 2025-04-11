<template>
  <div class="jueseguanliedit">
    <el-dialog
        title="提示"
        :visible="showDialog"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="form.permissions" multiple placeholder="权限">
            <el-option
                v-for="permission in funcPermissions"
                :key="permission.pk"
                :label="permission.name"
                :value="permission.pk">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="() => {this.clearForm(); this.$emit('close', '')}">取 消</el-button>
        <el-button type="primary" @click="validForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import resource from "@/resource";
  export default {
    name: 'JueSeGuanLiEdit',
    props: ['showDialog', 'pk'],
    data() {
      return {
        form: {
          pk: null,
          name: '',
          permissions: []
        },
        rules: {
          name: [{ required: true, message: '请填写角色名称', trigger: 'blur' }]
        },
        funcPermissions: []
      };
    },
    mounted() {
      this.loadFuncPermission();
      if (this.pk) {
        this.loadFuncGroup(this.pk);
      }
    },
    methods: {
      async loadFuncGroup(pk) {
        try {
          let resp = await this.$http.get(`/group/${pk}/`);
          this.form = resp.data;
        } catch (e) {
          
          this.$message.error('数据获取失败');
          this.$emit('close');
        }
      },
      async loadFuncPermission() {
        try {
          let resp = await resource.getList('permissions',{org_id:null});
          // console.log(resp)
          this.funcPermissions = resp
        } catch (e) {
          console.error(e)
          this.$message.error('数据获取失败');
          this.$emit('close');
        }
      },
      validForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submit();
          } else {
            return false;
          }
        });
      },
      async submit() {
        if (this.form.pk) {
          try {
            await this.$http.put(`/group/${this.form.pk}/`, this.form);
            this.$message.success('提交成功');
            this.clearForm();
            this.$emit('close', 'success');
          } catch (e) {
            this.$message.error('提交失败');
          }
        } else {
          try {
            await this.$http.post(`/group/`, this.form);
            this.$message.success('提交成功');
            this.clearForm();
            this.$emit('close', 'success');
          } catch (e) {
            this.$message.error('提交失败');
          }
        }
      },
      clearForm() {
        this.form = {
          pk: null,
          name: '',
          permissions: []
        };
        this.$refs.form.resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
