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
          <!--          <el-select v-model="form.permissions" multiple placeholder="权限">-->
          <!--            <el-option-->
          <!--                v-for="permission in funcPermissions"-->
          <!--                :key="permission.pk"-->
          <!--                :label="permission.name"-->
          <!--                :value="permission.pk">-->
          <!--            </el-option>-->
          <!--          </el-select>-->
          <el-cascader
            @change="getOptions"
            v-model="form.permissions"
            :options="funcPermissions"
            :props="{ multiple: true, checkStrictly: true ,emitPath: false,children: 'children',label: 'name',value: 'pk'}"
            :show-all-levels="false"
            clearable></el-cascader>
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
import {mapState} from "vuex";
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
      funcPermissions: [],
      funcflatPermissions: [], // 扁平化的权限列表
    };
  },
  mounted() {
    this.loadFuncPermission();
    if (this.pk) {
      this.loadFuncGroup(this.pk);
    }
  },
  computed:{
    ...mapState(['userinfo'])
  },
  methods: {
    getOptions(value){
      this.funcflatPermissions.forEach((item) => {
        if (value.indexOf(item.pk) > -1) {
          // 可能会有多层父节点，所以需要递归查找
          this.findParent(item.pk, this.form.permissions, this.funcflatPermissions);
        }
      });
      this.form.permissions = [...new Set(this.form.permissions)];
    },
    findParent(pk, permissionsArray, funcflatPermissions) {
      const item = funcflatPermissions.find(item => item.pk === pk);
      if (item) {
        permissionsArray.push(item.pk);
        if (item.parent) {
          this.findParent(item.parent, permissionsArray, funcflatPermissions);
        }
      }
    },
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
        let resp = await resource.getList('systemorgperms',{org_id:this.userinfo.org_id,sys_id:this.userinfo.sys_id});
        this.funcflatPermissions = [...resp];
        this.funcPermissions = this.buildPermissionTree(resp);
      } catch (e) {
        this.$message.error('数据获取失败');
        this.$emit('close');
      }
    },
    buildPermissionTree(flatPermissions, parent = null) {
      const tree = [];
      for (let i = 0; i < flatPermissions.length; i++) {
        const permission = flatPermissions[i];
        if (permission.parent === parent) {
          const children = this.buildPermissionTree(flatPermissions, permission.pk);
          if (children.length > 0) {
            permission.children = children;
          }
          tree.push(permission);
          // 删除已经添加到树中的子节点
          flatPermissions.splice(i, 1);
          i--; // 调整循环索引
        }
      }
      return tree;
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