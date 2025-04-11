<template>
  <div class="XinZengBuMen">
    <el-row style="margin-top:8px; height:40px; line-height:40px">
      <el-col :span="24">
        <div class="el-icon-s-grid ln-daiban" style="float: left; line-height: 40px"><span>编辑部门</span></div>
      </el-col>
    </el-row>
    <el-card shadow="never" style="width: 75%">
      <el-form :model="department_form" :rules="rules" ref="edtForm" label-width="100px">
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="department_form.name" autocomplete="off" style="width:60%" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input v-model="department_form.contact_name" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="department_form.contact_mobile" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="$router.go(-1)" class="ln-button" round>取 消</el-button>
      <el-button type="primary" @click="department_add" class="ln-button" round>确 定</el-button>
    </el-card>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "XinZengBuMen",
  computed: {
    ...mapState(["org_id", "sys_id"]),
  },
  data() {
    return {
      loading: false,
      pk: '',
      rules: {
        name: [{required: true, message: "请输入部门名称", trigger: 'change'}],
        target: [{required: true, message: "请选择要移动的部门", trigger: 'change'}],
        position: [{required: true, message: "请选择要移动的位置", trigger: 'change'}],
      },
      department_form: {
        sys_id: null,
        org_id: null,
        name: '',
        parent: '',
        contact_name: '',
        contact_mobile: '',
      },
      dep_array: [],
    }
  },
  methods: {
    async loadData() {
      let params = {
        sys_id: this.sys_id,
        org_id: this.org_id,
      }
      // 加载数据列表及刷新
      let resp = await this.$http.get(`/department/${this.pk}/`);
      let rep = await this.$http.get(`/flatdepartment/`, {params});
      this.dep_array = rep.data;
      this.department_form = resp.data;
    },

    department_add() {
      // 编辑部门
      this.$refs.edtForm.validate((valid) => {
        if (valid) {
          this.$http.patch("/department/" + this.pk + "/", this.department_form).then((resp) => {
            this.$router.go(-1)
          }).catch((err) => {
            this.$message.error({message: "编辑失败，轻重试！！", center: true})
          })
        } else {
          this.$message.error('请填写完整信息后提交');
          return false
        }
      })
    },
  },
  mounted() {
    this.pk = this.$route.params.pk;
    this.loadData();
  }
}
</script>


<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
