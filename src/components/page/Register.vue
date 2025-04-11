<!--
 * @Descripttion: 手机号注册页面，同时创建一个org
 * @Author: Bhr
 * @Date: 2020-04-09
-->

<template>
    <div class="Register">
        <el-row>
            <el-col :span="24">
                <el-card class="ms-register" v-loading="fullLoading">
                    <div class="ms-title">注册</div>
                    <el-form :model="form" :rules="rules" ref="register" label-width="120px" style="padding: 10px 20px">
                        <el-row>
                            <el-col :span="21">
                                <el-form-item label="单位名称：" prop="unit_name">
                                    <el-input v-model="form.unit_name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                                <el-form-item label="姓名：" prop="full_name">
                                    <el-input v-model="form.full_name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                                <el-form-item label="验证码：" prop="captcha_value">
                                    <div style="float: left;">
                                        <el-input v-model="form.captcha_value" style="width:150px;"></el-input>
                                    </div>
                                    <div style="float: right;">
                                        <el-button type="success" circle icon="el-icon-refresh"
                                                   @click="loadCaptcha"></el-button>
                                    </div>
                                    <div style="float: right;margin:0 10px;"><img :src="captcha_img" style="" alt="">
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                                <el-form-item label="手机号：" prop="phone">
                                    <el-input v-model="form.phone">
<!--                                        <el-button slot="append" type="primary" v-if="showtime === null"-->
<!--                                                   @click="sendRegisterCode()">获取验证码-->
<!--                                        </el-button>-->
<!--                                        <el-button slot="append" type="primary" v-else :loading="loading">-->
<!--                                            请稍等({{ showtime }})-->
<!--                                        </el-button>-->
                                    </el-input>
                                </el-form-item>
                            </el-col>
<!--                            <el-col :span="15">-->
<!--                                <el-form-item label="手机验证码：" prop="phone_access">-->
<!--                                    <el-input v-model="form.phone_access">-->
<!--                                    </el-input>-->
<!--                                </el-form-item>-->
<!--                            </el-col>-->
                        </el-row>
                        <el-row>
                            <el-col :span="15">
                                <el-form-item label="密码：" prop="password">
                                    <el-input show-password v-model="form.password"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                                <el-form-item label="确认密码：" prop="check_password">
                                    <el-input show-password v-model="form.check_password"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="login-btn">
                            <el-button type="primary" plain @click="toLogin">返回登录</el-button>
                            <el-button type="primary" @click="submitForm">提交注册</el-button>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {LOGIN, USERINFO} from "@/store";
import resource from "@/resource";

export default {
    name: "Register",
    computed: {
        ...mapState(['token', 'sys_id'])
    },
    props: [],
    data() {
        let validatePwd = (rule, value, callback) => {
            if (this.form.password === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.form.check_password !== '') {
                    this.$refs.register.validateField('check_password');
                }
                callback();
            }
        };
        let validateCheckPwd = (rule, value, callback) => {
            if (this.form.check_password === '') {
                callback(new Error('请再次输入密码'));
            } else if (this.form.check_password !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        // let validateUnitName = async (rule, value, callback) => {
        //     let resp = await this.$http.get('/org/', {
        //         params: {
        //             name: value
        //         }
        //     });
        //     if (resp.data.length > 0) {
        //         callback(new Error('此单位已存在!'));
        //     }
        // };
      let validateUnitName = async (rule, value, callback) => {
        if (!value) {
          callback(new Error("单位名称为必填项!"));
        }
        let resp = await this.$http.get("/usermin/", {
          params: {
            org_id: 1,
            // unit_name:value
          },
        });
        console.log(resp,'resp')
        // if (resp.data.length > 0) {
        //   callback(new Error("此单位已存在!"));
        // }
      };
        return {
            // 计时器,注意需要进行销毁
            timeCounter: null,
            // null 则显示按钮 秒数则显示读秒
            showtime: null,
            loading: false,
            fullLoading: false,
            category: [],
            unit_exist: false,
            captcha_img: '',
            form: {
                full_name: "",
                password: "",
                check_password: "",
                phone: "",
                // phone_access: "",
                captcha_value: "",
                captcha_key: "",
                unit_name: '',       //详细地址
            },
            rules: {
                full_name: [{required: true, message: '请输入真实姓名'}],
                password: [
                    {validator: validatePwd, required: true, trigger: 'blur'},
                    {min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur'}
                ],
                check_password: [{validator: validateCheckPwd, required: true, trigger: 'blur'}],
                phone: [{required: true, validator: this.checkPhone, trigger: 'blur'}],
                // phone_access: [{required: true, message: '请输入验证码'}],
                captcha_value: [{required: true, message: '请输入验证码'}],
                unit_name: [{required: true, message: '请填写单位名称'}, {validator: validateUnitName, trigger: 'blur'}],
            },
        }
    },
    methods: {
        async loadCaptcha() {
            let resp = await this.$http.post('/captcha/');
            this.form.captcha_key = resp.data.captcha_key;
            this.captcha_img = `data:${resp.data.image_type};${resp.data.image_decode},${resp.data.captcha_image}`;
        },
        //发送验证码后的倒计时
        // 倒计时显示处理
        countDownText(s) {
            this.showtime = `${s}`
        },
        // 倒计时 60秒 不需要很精准
        countDown(times) {
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
                    self.timeCounter = setTimeout(countDownStart, interval)
                }
            }
        },

        //发送验证码的方法，传入参数为form表单的ref，发送验证码之前需校验一次手机号
        sendRegisterCode() {
            this.form.phone_access = "";
            this.$refs.register.validateField('phone', valid => {
                if (!valid) {
                    this.$http.post('/phoneauth/', {phone: this.form.phone}).then(() => {
                        this.countDown(60);
                        this.$message({
                            message: "成功",
                            type: "success"
                        });
                    }).catch(e => {
                        this.$message.error({
                            message: e.response.statusText
                        });
                    });
                } else {
                    this.$message.error(valid)
                }
            });
        },

        //提交注册申请的方法
        async submitForm() {
            let valid = await new Promise((resolve, reject) => {
                this.$refs.register.validate(resolve)
            });
            if (valid) {
                this.fullLoading = true;
                try {
                    // this.form.username = this.form.phone;
                    // let resp = await this.$http.get('/orgnextid/', {params: {sys_id: this.sys_id}});
                    // this.form.org_id = resp.data.next;
                    // this.form.mobile = this.form.phone;
                    // 先生成用户，之后生成org，否则注册失败后还需要删除org
                    // resp = await this.$http.post('/userphonereg/', this.form);
                    // await this.addOrg(resp.data);
                  let params = {
                    captcha_value: this.form.captcha_value,
                    captcha_key: this.form.captcha_key,
                    username: this.form.phone,
                    full_name: this.form.full_name,
                    mobile: this.form.phone,
                    password: this.form.password,
                    is_active: true,
                    org_id:1,
                  }
                  let resp = await resource.createObj('userreg',params)
                  // console.log(resp,'resp')
                  // console.log(this.form,'form')
                } catch (e) {
                    if (e.response.data) {
                        const dd = e.response.data;
                        if (dd.phone) {
                            this.$message.error("此手机号码已注册")
                        } else if (dd.username) {
                            this.$message.error("此手机号码已注册")
                        } else if (dd.non_field_errors) {
                            if (dd.non_field_errors === "Invalid or expired captcha key") {
                                this.$message.error("验证码错误");
                                return
                            }
                            this.$message.error(e.response.data.non_field_errors[0])
                        }
                    }
                } finally {
                    this.fullLoading = false;
                }
            }
        },
        // 创建org
        async addOrg(user) {
            let params = {
                username: this.form.username,
                password: this.form.password,
            }
            let resp = await this.$http.post("/auth/", {...params});
            this.$store.commit(LOGIN, resp.data.token);
            await this.$http.post('/org/', {
                sys_id: this.sys_id,
                org_id: user.org_id,
                name: this.form.unit_name,
                manager_id: user.pk,
            });
            let info_resp = await this.$http.get("/userreg/");
            this.$store.commit(USERINFO, info_resp.data);
            this.$message({
                message: "注册成功！",
                type: "success",
                duration: 1000,
                center: true,
            });
            let {pk} = await this.addDep(user.org_id);
            await this.$http.patch(`/user/${user.pk}/`, {department: pk});
            await this.$router.push({name: 'registerSuccess'});
        },
        // 创建初始部门
        async addDep(org_id) {
            let params = {
                sys_id: this.sys_id,
                org_id: org_id,
                name: this.form.unit_name,
                category: 'moren',
            };
            let resp = await this.$http.post('/department/', params);
            return resp.data;
        },
        toLogin() {
            this.$emit('toLogin');
        },
        async checkPhone(rule, value, callback) {
            if (!value) {
                return callback(new Error('请输入手机号'))
            } else {
                const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的手机号'))
                }
                let resp = await this.$http.post('/userphonecheck/', {
                    phone: value,
                    sys_id: this.sys_id,
                });
                if (resp.data.exist) {
                    callback(new Error('此手机号已存在!'));
                }
            }
        },
    },
    mounted() {
        this.loadCaptcha();
    }
}
</script>

<style>
.ms-title {
    /*position: relative;*/
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #333;
    border-bottom: 1px solid #ddd;
}

.ms-register {
    width: 800px;
    margin: 50px auto;
    border-radius: 5px;
    background: rgba(255, 255, 255, 1.0);
    /*overflow: hidden;*/
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

.avatar {
    width: 120px;
    height: 120px;
    display: block;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 25%;
    height: 36px;
    margin-bottom: 10px;
}
</style>
