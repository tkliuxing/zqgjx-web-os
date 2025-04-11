<template>
  <div class="XinZengBuMen">
    <el-row style="margin-top:8px; height:40px; line-height:40px">
      <el-col :span="24">
        <div class="el-icon-s-grid ln-daiban" style="float: left; line-height: 40px"><span>新增部门</span></div>
      </el-col>
    </el-row>
    <el-card shadow="never" style="width: 75%">
      <el-form :model="department_form" :rules="rules" ref="createForm" label-width="100px">
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="department_form.name" style="width:60%" placeholder="请输入名称"></el-input>
        </el-form-item>
<!--        <el-form-item label="类别：">-->
<!--          <el-select v-model="department_form.category" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
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
        options: [{
          value: '客服',
          label: '客服'
        }, {
          value: 'moren',
          label: 'moren'
        }, {
          value: '检验室',
          label: '检验室'
        }],
        rules: {
          name: [{required: true, message: "请输入部门名称", trigger: 'change'}],
        },
        department_form: {
          sys_id: null,
          org_id: null,
          name: '',
          parent: '',
          category: 'moren',
          contact_name: '',
          contact_mobile: '',
        }
      }
    },
    methods: {
      department_add() {
        // 新增部门
        this.$refs.createForm.validate((valid) => {
          if (valid) {
            this.$http.post("/department/", this.department_form).then((resp) => {
              // 返回上一页
              this.$router.go(-1);
            }).catch((err) => {
              this.$message.error({message: "添加失败，请重试！！！", center: true})
            })
          } else {
            this.$message.error('请填写完整信息后提交');
            return false
          }
        })
      },
    },
    mounted() {
      this.department_form.parent = this.$route.params.pk;
      this.department_form.sys_id = this.sys_id;
      this.department_form.org_id = this.org_id;
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
