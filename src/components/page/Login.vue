<template>
    <div class="login-wrap">
        <div v-if="isLogin" class="ms-login">
            <div class="hello-title">欢迎登录政企工具箱</div>
            <div class="log-tab">
                <div class="tab-item" :class="countIndex == index ? 'active' : ''" v-for="(item, index) in tabitem"
                     :key="index" @click="tabClick(index)">
                    {{ item }}
                </div>
            </div>

            <el-form :validate-on-rule-change="false" :model="param" :rules="rules" ref="Login" label-width="0px"
                     class="ms-content" v-if="countIndex === 0">
                <el-form-item prop="username">
                    <el-input name="username" v-model="param.username" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" v-model="param.password" show-password placeholder="密码"></el-input>
                </el-form-item>
                <div class="login-btn">
<!--                    <el-button type="primary" plain @click="toRegister">注册</el-button>-->
                    <el-button style="width: 100%" type="primary" @click="userLogin">登录</el-button>
                </div>
            </el-form>

            <el-form :validate-on-rule-change="false" :model="form" :rules="phoneCode" ref="phoneLogin"
                     label-width="0px" class="ms-content" v-if="countIndex === 1">
                <el-form-item prop="phone">
                    <el-input v-model="form.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="phone_access">
                    <el-input v-model="form.phone_access" placeholder="验证码">
                        <el-button slot="append" type="primary" v-if="showtime === null" @click="sendCode()">获取验证码
                        </el-button>
                        <el-button slot="append" type="primary" v-else :loading="loading">
                            请稍等({{ showtime }})
                        </el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
<!--                    <el-button type="primary" plain @click="toRegister">注册</el-button>-->
                    <el-button style="width: 100%" type="primary" @click="phoneCodeLogin">登录</el-button>
                </div>
            </el-form>
            <div class="login-shiyong" @click="experience">
                没有账号，去试用>
            </div>
        </div>

        <register v-if="!isLogin" @toLogin="isLogin = true"></register>
    </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {LOGIN, USERINFO, ORGINFO} from "@/store";
import Register from "./Register";
import resource from "@/resource";

export default {
    components: {register: Register},
    computed: {
        ...mapState(["token", "sys_id"]),
    },
    data() {
        return {
            isLogin: true,
            loginType: true,
            orgId : null,
            //发送验证码后的按钮loading
            loading: false,
            showtime: null,
            //验证码的form
            form: {
                phone: "",
                phone_access: "",
            },

            //验证码登录时的校验
            phoneCode: {
                phone: [{required: true, validator: this.checkPhone, trigger: "blur"}],
                phone_access: [{required: true, message: "请输入验证码"}],
            },

            //用户名密码登录时的form
            param: {
                username: "",
                password: "",
            },

            //用户名密码登录时的校验
            rules: {
                username: [{required: true, message: "请输入用户名"}],
                password: [{required: true, message: "请输入密码"}],
            },

            tabitem: ["密码登录", "验证码登录"],
            countIndex: 0,
        };
    },
    methods: {
        ...mapMutations(["resetState"]),
        //点击 '发送验证码' 按钮后的倒计时方法，调用countDown()方法即可，传入参数为倒计时时间，以秒为单位
        // 倒计时显示处理
        countDownText(s) {
            this.showtime = `${s}`;
        },
        // 倒计时 60秒 不需要很精准
        countDown(times) {
            this.loading = true;
            const self = this;
            // 时间间隔 1秒
            const interval = 1000;
            let count = 0;
            self.timeCounter = setTimeout(countDownStart, interval);

            function countDownStart() {
                if (self.timeCounter == null) {
                    return false;
                }
                count++;
                self.countDownText(times - count + 1);
                if (count > times) {
                    clearTimeout(self.timeCounter);
                    self.showtime = null;
                    this.loading = false;
                } else {
                    self.timeCounter = setTimeout(countDownStart, interval);
                }
            }
        },

        //发送验证码的方法，传入参数为验证码form表单的ref，发送验证码之前需校验一次手机号
        async sendCode() {
            this.form.phone_access = "";
            const valid = await new Promise((resolve, reject) => {
                this.$refs.phoneLogin.validateField("phone", resolve);
            });
            if (!valid) {
                try {
                    await this.$http.post("/smscode/", {phone: this.form.phone});
                    this.countDown(60);
                    this.$message({
                        message: "短信已发送",
                        type: "success",
                    });
                } catch (e) {
                    this.$message.error({
                        message: e.response.statusText,
                    });
                }
            } else {
                this.$message.error(valid);
            }
        },

        //验证码登录的方法
        async phoneCodeLogin() {
            const valid = await new Promise((resolve, reject) => {
                this.$refs.phoneLogin.validate(resolve);
            });
            if (valid) {
                try {
                    const resp = await this.$http.post("/phonelogin/", {
                        ...this.form,
                        sys_id: this.sys_id,
                    });
                    this.$store.commit(LOGIN, resp.data.token);
                    const myinfo = await this.$http.get("/myinfo/");
                    this.$store.commit(USERINFO, myinfo.data);
                    const orginfo = await this.$http.get("/systemorg/", {params: {org_id: myinfo.data.org_id}});
                    this.$store.commit(ORGINFO, orginfo.data[0]);
                    this.$message({
                        message: "登录成功！",
                        type: "success",
                        duration: 1000,
                        center: true,
                    });
                    const params = {
                        sys_id: 5,
                    };
                    this.$http.get("/system/", params).then((resp) => {
                        this.$store.commit("HTTPURL", resp.data[0].url);
                    });
                    await this.$router.push({name: "home"});
                } catch (err) {
                    if (err.response && err.response.status === 400) {
                        try {
                            await this.$confirm("用户不存在，是否前去注册", "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning",
                            });
                            this.toRegister();
                        } catch (e) {
                            this.$message({
                                type: "info",
                                message: "已取消",
                            });
                        }
                    }
                }
            }
        },
        toRegister() {
            this.$refs.phoneLogin && this.$refs.phoneLogin.resetFields();
            this.isLogin = false;
        },
        checkPhone(rule, value, callback) {
            if (!value) {
                return callback(new Error("请输入手机号"));
            } else {
                const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error("请输入正确的手机号"));
                }
            }
        },
        async userLogin() {
            const valid = await new Promise((resolve, reject) => {
                this.$refs.Login.validate(resolve);
            });
            if (valid) {
                try {
                    const resp = await this.$http.post("/auth/", {
                        ...this.param,
                        sys_id: this.sys_id,
                    });

                    this.$store.commit(LOGIN, resp.data.token);
                    const myinfo = await this.$http.get("/myinfo/");
                  let params = {
                    template_id:'FT342205780363792384',
                    org_ids: myinfo.data.org_id.toString(),
                  }
                  let resp1  = await resource.getList('data',params)
                  if (resp1.length > 0){
                    let quanxian= JSON.parse( resp1[0].isguoqi);
                    const updatedQuanxian = { ...this.$store.state.quanxian };
                    for (const resp1Key in quanxian) {
                        if (this.isDate1BeforeDate2(quanxian[resp1Key])){
                          updatedQuanxian[resp1Key] = true;
                      }
                    }
                    this.$store.commit('quanxian', updatedQuanxian);
                  }
                    this.orgId = myinfo.data.org_id;
                    const orginfo = await this.$http.get("/systemorg/", {params: {org_id: myinfo.data.org_id}});
                    this.$store.commit(ORGINFO, orginfo.data[0]);

                    this.$store.commit(USERINFO, myinfo.data);
                    this.$message({
                        message: "登录成功！",
                        type: "success",
                        duration: 1000,
                        center: true,
                    });
                    this.$store.commit("HTTPURL", window.location.origin);
                    await this.$router.push({name: "home"});
                } catch (err) {
                    if (err.response && err.response.status === 400) {
                        this.$message.error("用户名或密码错误");
                    }
                }
            }
        },
      isDate1BeforeDate2(datea) {
        let date = new Date(this.moment().format('YYYY-MM-DD'));
        let date1 = new Date(datea);
        return date1 >= date;
      },
        tabClick(index) {
            if (this.$refs.Login) {
                this.$refs.Login.resetFields();
            }
            if (this.$refs.phoneLogin) {
                this.$refs.phoneLogin.resetFields();
            }
            this.countIndex = index;
        },

        experience() {
            this.param.username = "18666666666";
            this.param.password = "123456";
            this.userLogin();
        },

    },
    mounted() {
        if (this.token !== "") {
            this.$router.push("/home");
        } else {
            this.resetState();
        }
    },
};
</script>

<style scoped>
.login-wrap {
    /*position: relative;*/
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}

body .el-scrollbar__wrap {
    overflow-x: hidden;
}

.back-btn {
    position: absolute;
    left: 10px;
    top: 10px;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 1);
    /*overflow: hidden;*/
}

.ms-content {
    padding: 30px 30px 10px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 48%;
    height: 36px;
    margin-bottom: 10px;
}

.pull-right {
    float: right;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}

.hello-title {
    position: absolute;
    top: -20%;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 24px;
}

.log-tab {
    display: flex;
}

.tab-item {
    flex: 1;
    text-align: center;
    line-height: 54px;
    font-size: 14px;
    border-bottom: 1px solid #f1f1f1;
    border-right: 1px solid #f1f1f1;
    cursor: pointer;
    color: #333;
    background: #fafafa;
    border-radius: 5px 5px 0 0;
}

.tab-item.active {
    border-bottom: none;
    color: #409eff;
    background: #fff;
}

.tab-item:last-child {
    border-right: none;
}

.login-shiyong {
    overflow: hidden;
    padding: 0 30px;
    text-align: center;
    color: #409eff;
    font-size: 12px;
    cursor: pointer;
    line-height: 44px;
    margin-bottom: 10px;
}
</style>
