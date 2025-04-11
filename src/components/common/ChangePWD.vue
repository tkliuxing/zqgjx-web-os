<template>
  <div class="changepwd">
    <el-dialog
        title="修改密码"
        :visible="visable"
        @close="close"
        width="30%">
      <el-form status-icon :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="原密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="form.new_password" type="password" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="form.checkPass" type="password" placeholder="确认密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ChangePWD',
  data(){
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('validatePass2');
        }
        if (value.length < 6) {
          callback(new Error('密码长度需要大于等于六位'));
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        password: '',
        new_password: '',
        checkPass: '',
      },
      rules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        new_password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },
  props: {
    visable: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    close(){
      this.form = {
        password: '',
        new_password: '',
        checkPass: '',
      };
      this.$emit('close');
    },
    submit(){
      this.$refs.form.validate(is_valid => {
        if (is_valid) {
          let {password, new_password} = this.form;
          this.$http.post('/changepwd/', {password, new_password})
          .then((resp) => {
            if(!resp.data.error){
              this.$message.success('修改成功！');
              this.form = {
                password: '',
                new_password: '',
                checkPass: '',
              };
              this.$emit('close');
            } else {
              this.$message.error(resp.data.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          })
        }
      })
    },
  }
};
</script>

<style scoped>

</style>
