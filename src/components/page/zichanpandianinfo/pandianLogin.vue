<template>
  <div class="log">
    <div class="close"></div>
    <template>
      <div class="log-title">
        <h2>请登录</h2>
      </div>
      <div class="from">
        <van-form>
          <div class="log-from">
            <div class="from-title">
              <span class="from-icon"
              ><img src="@/assets/img/log/phone.png" alt=""
              /></span>
              <span class="from-text">用户名</span>
            </div>
            <div class="from-input">
              <van-field
                v-model="logForm.username"
                placeholder="用户名"
                :rules="[{ required: true, message: '请输入用户名' }]"
              ></van-field>
            </div>
          </div>
          <div class="log-from">
            <div class="from-title">
              <span class="from-icon"
              ><img src="@/assets/img/log/mima.png" alt=""
              /></span>
              <span class="from-text">密码</span>
            </div>
            <div class="from-input">
              <van-field
                type="password"
                v-model="logForm.password"
                placeholder="密码"
                :rules="[{ required: true, message: '请输入密码' }]"
              ></van-field>
            </div>
          </div>
        </van-form>
      </div>
      <div class="from-btn"><button @click="logTab">确定登录</button></div>
    </template>
  </div>
</template>

<script>
import resource from "@/resource.js";
import Vue from "vue";
import { Field, Form, Toast } from "vant";
import "vant/lib/index.css";
import { commit } from "./store";
import bus from "@/components/utils/bus"

Vue.use(Field);
Vue.use(Form);
Vue.use(Toast);

export default {
  data() {
    return {
      logForm: {
        username: null,
        password: null,
      },
      message: "",
      isShow: false,
      isLog: true,
      pk:'',
    };
  },
  methods: {
    // sendMsg(){
    //   setTimeout(()=>{
    //     bus.$emit('jiehshou', this.pk)
    //   },100);
    //
    //
    // },
    // //自己声明一个方法
    employeesdetails(){
      this.$router.push(
        {
          //添加需要传值到那个页面的路径
          path:'/shoujiinof',
          //携带需要传递的参数
          query:{pk:this.pk}
        })
    },

    // 登录
    async logTab() {
      let data = { ...this.logForm };
      data.username = data.username;
      data.password = data.password;
      try {
        let login = await resource.createObj("auth", data);
        this.$store.commit("LOGIN", login.token);
      } catch (e) {
        Toast("无法使用认证的信息登录!");
        return;
      }
      let userinfo = await resource.getList("myinfo", { org_id: this.org_id });
      this.$store.commit("USERINFO", userinfo);
      Toast("登录成功");

      // this.sendMsg(this.pk)
      this.employeesdetails()

      // console.log(this.pk)
    },
    closeTab() {
      this.$router.go(-1);
    },
    toZc() {
      this.isLog = false;
    },
    toLog() {
      this.isLog = true;
    },
  },
  created() {
    // commit("category", this.$route.query.pk);
    this.pk = this.$route.query.pk;
    if (this.pk) {

      // this.getInfo();
    }

  },
};
</script>

<style scoped>
.log {
  padding: 30px;
  background: #fff;
}
.log-title {
  padding: 10px 0;
  margin-bottom: 10px;
}
.log-title h2 {
  padding: 0;
  font-size: 18px;
  margin: 0;
  line-height: 1.5;
  color: #070707;
}

.log-from {
  padding: 10px 0;
  margin-top: 10px;
}
.from-icon {
  display: inline-block;
  width: 22px;
  vertical-align: middle;
}
.from-icon img {
  width: 100%;
  display: block;
}
.from-text {
  display: inline-block;
  font-size: 14px;
  vertical-align: middle;
  margin-left: 10px;
}
.from-input {
  margin-top: 5px;
  position: relative;
  border-bottom: 1px solid #eaeaea;
}
.van-cell {
  padding: 5px;
  line-height: 30px;
}
.van-cell .van-field__control {
  line-height: 40px;
}
.from-input input::-webkit-input-placeholder {
  color: #c9c9c9;
}
.from-input button {
  position: absolute;
  right: 0;
  top: 50%;
  line-height: 34px;
  font-size: 12px;
  border-radius: 200px 200px;
  margin-top: -17px;
  width: 84px;
  text-align: center;
  background: #e41e1e;
  color: #fff;
  border: none;
}
.from-btn {
  margin-top: 20px;
  text-align: center;
}
.from-btn button {
  display: inline-block;
  border: none;
  background: #e41e1e;
  color: #fff;
  border-radius: 200px 200px;
  line-height: 44px;
  padding: 0 40px;
  font-size: 16px;
}
.input-r80 {
  padding-right: 80px;
}
.img {
  width: 120px;
  height: 30px;
  position: absolute;
  right: 0;
  bottom: 5px;
  z-index: 2;
}
.from-item {
  line-height: 30px;
  color: #666;
  font-size: 14px;
  overflow: hidden;
  padding: 10px 0;
}
.from-item .fl {
  float: left;
  width: 80%;
  line-height: 30px;
}
.from-item .fr {
  float: right;
  width: 15%;
  text-align: right;
  line-height: 30px;
}
.van-cell::after {
  border: none;
}
.close {
  overflow: hidden;
}
.close-btn {
  width: 16px;
  height: 16px;
  padding: 10px;
  float: right;
}
.close-btn img {
  width: 100%;
}
.tips {
  margin-top: 10px;
  text-align: center;
  line-height: 44px;
  font-size: 14px;
  color: #666;
}
.tips span {
  color: #1965f0;
}
</style>
