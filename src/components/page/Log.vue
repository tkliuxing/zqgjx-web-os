<template>
  <div class="log">
    <div class="close">
      <!-- <div class="close-btn" @click="closeTab">
        <img src="@/assets/img/log/close.png" alt="" />
      </div> -->
    </div>
    <template v-if="isLog">
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
              <span class="from-text">手机</span>
            </div>
            <div class="from-input">
              <van-field
                v-model="logForm.username"
                placeholder="手机号"
                :rules="[{ required: true, message: '请输入手机号' }]"
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
      <team @activeTeam="activeTeam" v-if="teamShow" :orgid="org_id"></team>
      <div class="tips" v-if="!isRegister">没有账号，<span  @click="toZc">去注册></span></div>
      <div class="from-btn"><button @click="logTab">确定登录</button></div>
    </template>
    <template v-else>
      <div class="log-title">
        <h2>请填写以下注册信息</h2>
      </div>
      <div class="from">
        <van-form>
          <div class="log-from">
            <div class="from-title">
              <span class="from-icon"
                ><img src="@/assets/img/log/user.png" alt=""
              /></span>
              <span class="from-text">姓名</span>
            </div>
            <div class="from-input">
              <van-field
                v-model="form.full_name"
                placeholder="请输入姓名"
                :rules="[{ required: true, message: '请输入姓名' }]"
              ></van-field>
            </div>
          </div>
          <div class="log-from">
            <div class="from-title">
              <span class="from-icon"
                ><img src="@/assets/img/log/phone.png" alt=""
              /></span>
              <span class="from-text">手机</span>
            </div>
            <div class="from-input">
              <van-field
                v-model="form.phone"
                placeholder="手机号"
                :rules="[{ required: true, message: '请输入手机号' }]"
              ></van-field>
            </div>
          </div>
          <div class="log-from">
            <div class="from-title">
              <span class="from-icon"
                ><img src="@/assets/img/log/mima.png" alt=""
              /></span>
              <span class="from-text">设置密码</span>
            </div>
            <div class="from-input">
              <van-field
                type="password"
                v-model="form.password"
                placeholder="密码"
                :rules="[{ required: true, message: '请输入密码' }]"
              ></van-field>
            </div>
          </div>
          <div class="log-from">
            <div class="from-title">
              <span class="from-icon"
                ><img src="@/assets/img/log/mima.png" alt=""
              /></span>
              <span class="from-text">确认密码</span>
            </div>
            <div class="from-input">
              <van-field
                type="password"
                v-model="form.password2"
                placeholder="再次输入密码"
                :rules="[{ required: true, message: '请输入密码' }]"
              ></van-field>
            </div>
          </div>
          <div class="log-from">
            <div class="from-title">
              <span class="from-icon"
                ><img src="@/assets/img/log/number.png" alt=""
              /></span>
              <span class="from-text">验证码</span>
            </div>
            <div class="from-input" style="padding-right: 140px">
              <van-field
                v-model="form.captcha_value"
                placeholder="请输入验证码"
                :rules="[{ required: true, message: '请输入验证码' }]"
              ></van-field>
              <img class="img" :src="captcha_img" @click="loadCaptcha" />
            </div>
          </div>
          <div class="log-from">
            <div class="from-title">
              <span class="from-icon"
                ><img src="@/assets/img/log/bumen.png" alt=""
              /></span>
              <span class="from-text">选择部门</span>
            </div>
            <div class="from-input">
              <div class="from-item" @click="temaTab">
                <div class="fl" v-if="!teamInfo.path_name">请选择部门</div>
                <div class="fl" v-else>{{ teamInfo.path_name }}</div>
                <div class="fr">></div>
              </div>
            </div>
          </div>
        </van-form>
      </div>
      <team @activeTeam="activeTeam" v-if="teamShow" :orgid="org_id"></team>
      <div class="tips">已有账号，<span @click="toLog">去登录></span></div>
      <div class="from-btn"><button @click="netTab">提交注册</button></div>
    </template>
  </div>
</template>

<script>
import resource from "@/resource.js";
import Team from "@/components/common/Team";
import { mapState } from "vuex";
import Vue from "vue";
import { Field, Form, Toast } from "vant";
import "vant/lib/index.css";
Vue.use(Field);
Vue.use(Form);
Vue.use(Toast);
export default {
  data() {
    return {
      captcha_img: "",
      form: {
        username: "",
        phone: "",
        password: "",
        password2: "",
        captcha_key: "",
        captcha_value: "",
        full_name: "",
        mobile: "",
        wechart_oid: "",
        department: null,
        org_id: null,
      },
      logForm: {
        username: null,
        password: null,
      },
      teamShow: false,
      teamInfo: [],
      message: "",
      isShow: false,
      isLog: true,
      isRegister:null,
    };
  },
  components: {
    Team,
  },
  methods: {
    // 注册
    async netTab() {
      let data = { ...this.form };
      data.username = data.phone;
      data.mobile = data.phone;
      data.password = data.password;
      data.wechart_oid = this.openID;
      data.org_id = this.org_id;
      try {
        if (data.password == data.password2) {
          await resource.createObj("userreg", data);
        } else {
          Toast("两次密码输入不一致");
        }
      } catch (e) {
        console.log(e);
        if (e.response.data.non_field_errors) {
          Toast(e.response.data.non_field_errors[0]);
          return;
        }
        Toast(JSON.stringify(e.response.data));
        return;
      }
      let login = await resource.createObj("auth", {
        username: data.username,
        password: data.password,
      });
      this.$store.commit("LOGIN", login.token);
      let userinfo = await resource.getList("myinfo");
      this.$store.commit("USERINFO", userinfo);
      this.$router.go(-1);
    },
    // 登录
    async logTab() {
      let data = { ...this.logForm };
      data.username = data.username;
      data.password = data.password;
      data.wechart_oid = this.openID;
      data.org_id = this.org_id;
      try {
       let login = await resource.createObj("auth", data);
       this.$store.commit("LOGIN", login.token);
      } catch (e) {
        if (e.response.data.non_field_errors) {
          Toast("手机号或密码错误");
          return;
        }else{
          Toast(e.response.data.password[0]);
          return;
        }
      }
      let userinfo = await resource.getList("myinfo",{org_id:this.org_id});
      // console.log(userinfo);
      Toast("登录成功");
      this.$store.commit("USERINFO", userinfo);
      this.$router.go(-1);
    },
    async loadCaptcha() {
      let resp = await resource.createObj("captcha", {});
      this.form.captcha_key = resp.captcha_key;
      this.captcha_img = `data:${resp.image_type};${resp.image_decode},${resp.captcha_image}`;
    },
    temaTab() {
      this.teamShow = true;
    },
    activeTeam(dep) {
      this.teamShow = false;
      this.teamInfo = dep;
      this.form.department = dep.pk;
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
  computed: {
    ...mapState(["openID", "org_id"]),
  },
  mounted() {
    if(this.$route.query.isRegister){
      this.isRegister = this.$route.query.isRegister
    }
    this.loadCaptcha();
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
