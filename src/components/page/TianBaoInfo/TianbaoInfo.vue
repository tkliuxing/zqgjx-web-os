<template>
    <div class="article">
        <div class="title">{{ listInfo.title }}</div>
        <div class="list-box">
            <van-form @submit="onSubmit">
                <div style="margin: 20px" v-if="isState || isEnd">
                </div>
                <div style="margin: 20px" v-else>
                <template v-for="item in formList" v-if="remark.qy_state == '是'">
                    <template v-if="remark.type == '自然日'">
<!--                        <template v-if="item.data">-->
<!--                            <template v-if="getDayState(item.data[0], item.data[1])">-->
                                <div class="list" :key="item.pk">
                                    <van-field
                                        v-model="form.result[item.col_title]"
                                        :name="item.col_title"
                                        :label="item.col_title"
                                        :placeholder="item.col_title"
                                        :rules="[{ required: item.is_required, message: '请填写' }]"
                                        v-if="item.widget == 'input'"
                                    />
                                    <template v-if="item.widget == 'select'">
                                        <van-field
                                            readonly
                                            clickable
                                            name="picker"
                                            :value="form.result[item.col_title]"
                                            :label="item.col_title"
                                            placeholder="请选择"
                                            @click="showPopup"
                                        />
                                        <van-popup
                                            v-model="show"
                                            round
                                            position="bottom"
                                        >
                                            <van-picker
                                                show-toolbar
                                                :default-index="1"
                                                :columns="item.local_data_source ? item.local_data_source : []"
                                                @confirm="(val) => onConfirm(val, item.col_title)"
                                                @cancel="cPopup"
                                            />
                                        </van-popup>
                                    </template>
                                </div>
<!--                            </template>-->
<!--                        </template>-->
                    </template>
                    <template v-else>
                        <div class="list" :key="item.pk">
                            <van-field
                                v-model="form.result[item.col_title]"
                                :name="item.col_title"
                                :label="item.col_title"
                                :rules="[{ required: item.is_required, message: '请填写' }]"
                                v-if="item.widget == 'input'"
                            />
                            <template v-if="item.widget == 'select'">
                                <van-field
                                    readonly
                                    clickable
                                    name="picker"
                                    :value="form.result[item.col_title]"
                                    :label="item.col_title"
                                    placeholder="请选择"
                                    @click="showPopup"
                                />
                                <van-popup
                                    v-model="show"
                                    round
                                    position="bottom"
                                >
                                    <van-picker
                                        show-toolbar
                                        :default-index="1"
                                        :columns="item.local_data_source ? item.local_data_source : []"
                                        @confirm="(val) => onConfirm(val, item.col_title)"
                                        @cancel="cPopup"
                                    />
                                </van-popup>
                            </template>
                        </div>
                    </template>
                </template>
                </div>
                <div>
                    <div style="margin: 20px">
                        <div style="margin: 20px" v-if="isState || isEnd">
                            <van-button round block disabled type="info" v-if="isState" style="margin: 10px 0">
                                活动暂未开启
                            </van-button>
                            <van-button round block disabled type="info" v-if="isEnd" style="margin: 10px 0">
                                活动已结束
                            </van-button>
                        </div>
                        <div style="margin: 20px" v-else>
                            <van-button round block type="info" native-type="submit">
                                提交
                            </van-button>
                        </div>
                     <div style="margin: 20px">
                       <van-button round v-if="remark.shuoming == '是'" @click="Shuoming" block type="info" native-type="submit">
                         返回
                       </van-button>
                     </div>
                    </div>
<!--                    <div v-else>-->
<!--                        <div style="margin: 20px">-->
<!--                            <van-button round block type="info" disabled>-->
<!--                                活动暂未开启-->
<!--                            </van-button>-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
            </van-form>
        </div>
        <div class="success" v-if="isSuccess">
            <div class="success-icon">
                <img src="@/assets/img/success.jpg" alt=""/>
            </div>
            <div class="success-text">提交成功</div>
        </div>
        <div class="success" v-if="isSubmit">
            <div class="success-icon">
                <img src="@/assets/img/success.jpg" alt=""/>
            </div>
            <div class="success-text">您已提交过，请不要重复提交</div>
        </div>
    </div>
</template>

<script>
import resource from "@/resource.js";
import moment from "moment";
import {mapState} from "vuex";

export default {
    data() {
        return {
            isShow: false,
            id: null,
            listInfo: {},
            formList: [],
            form: {
                a : false,
                result: {},
            },
            remark: {},
            isSuccess: false,
            dateStr: null,
            isState: false,
            isEnd: false,
            showPicker: false,
            value: null,
            uid: null,
            isSubmit: false,
            is_ChongFu: false,
            params:{
                template_id: "FT181649085367160832",
            },
            show: false,
            atime: null,
        };
    },
    watch: {
        $route() {
            this.uid = this.$store.state.userinfo.pk;
            if (
                this.listInfo.need_login == "true" &&
                this.uid &&
                this.remark.show_result == "否"
            ) {
                this.getStateCf();
            }
            if (this.remark.show_result == "是") {
                if (this.remark.type == "不限") {
                    this.isShow = true;
                }
                this.typeJudge();
            }
        },
    },
    async created() {
        this.id = this.$route.query.id;
      await this.getInfo();

        if (this.listInfo.need_login === "true") {
            this.$router.push({
                path: "/log",
            });
            return;
        }
      console.log(this.remark.shuoming)
      if(this.remark.shuoming == '是'){
        this.$router.push({
          path: "/tianbaoshuoming",
          query: {
            pk: this.remark.pk,
          },
        });
      }
    },
    methods: {
      Shuoming(){
        this.$router.go(-1);
      },
        // 获取填报信息
        async getInfo() {
            let resp = await resource.getObj("data", this.id, this.params);
            document.title = resp.title;
            let remark = resp;
            let fomrListParams = {
                parent_id : this.id,
                template_id: "FT202308301655334912",
            }
            let res = await resource.getList("data", fomrListParams);
            this.formList = res.reverse();

            this.remark = remark;
            if (resp.need_login == "true" && remark.show_result == "否") {
                await this.getStateCf();
            }


            for (let i = 0; i < this.formList.length; i++) {
                // 选项转换
                if (this.formList[i].local_data_source != null) {
                    let str = this.formList[i].local_data_source;
                    let snsArr = str.split(/[(\r\n)\r\n]+/);
                    this.formList[i].local_data_source = snsArr;
                }
                // 时间格式转换
                if (this.formList[i].data) {
                    let str = this.formList[i].data;
                    let snsArr = str.split(/-/);
                    this.formList[i].data = snsArr;
                }
            }

            this.listInfo = resp;
            // this.formList = resp.field;

            this.getTime(this.remark.start_time, this.remark.end_time);
            if (resp.need_login == "true" && remark.show_result == "是") {
                await this.typeJudge();
            }
            this.form = {...this.form};
        },

        // 提交
        async onSubmit() {
            if (this.listInfo.need_login == "true") {
                if (this.remark.show_result == "否") {
                    const chongfu = await this.getStateCf();
                    if (chongfu == 'chongfu') {
                        return
                    }
                }
            }
            this.submitFrom();
        },

        // 提交结果
        async submitFrom() {
            this.$toast.loading({
                message: "提交中...",
                forbidClick: true,
                duration: 0,
            });
            var aData = new Date();
            this.atime = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate()
                + " " + aData.getHours() + ":" + aData.getMinutes() + ":" + aData.getSeconds();
            try {
                let form = {
                    sys_id: this.listInfo.sys_id,
                    org_id: this.listInfo.org_id,
                    biz_id: this.$bizCode.tianbao_biz,
                    src_id: this.$sourceCode.source_id,
                    template_id: "FT139612458194108416",
                    tianbao_id: this.id,
                    user_id: this.$store.state.userinfo.pk,
                    user_name: this.$store.state.userinfo.full_name,
                    create_time: this.atime,
                    result: JSON.stringify(this.form.result),
                };
                await resource.createObj("data", form);
                this.$toast.clear();
                this.$toast("提交成功11212");
                this.isSuccess = true;
            } catch {
                console.log("出现错误");
            }
        },

        // 判断是否重复
        async getStateCf() {
            const form = {
                template_id: "FT139612458194108416",
                user: this.$store.state.userinfo.pk,
            };
            let resp = await resource.getList("data", form);
            if (resp.length > 0) {
                this.isSubmit = true;
                return "chongfu";
            }
        },

        async getState(before, after, count = 1) {
            count = count - 1;
            let data = {
                template: this.listInfo.pk,
                user: this.$store.state.userinfo.pk,
                date_after: after,
                date_before: before,
                template_id: "FT139612458194108416",
            };
            let resp = await resource.getList("data", data);

            if (resp.length > count && this.$store.state.userinfo.pk) {
                this.isSubmit = true;
                return;
            }
            if (!(resp.length > count)) {
                this.isShow = true;
            }
        },

        getTime(stime, etime) {
            let s = new Date(stime); //开始时间
            let e = new Date(etime); //结束时间
            let n = new Date(); //当前时间
            if (n.valueOf() < s.valueOf()) {
                this.isState = true;
            }
            if (n.valueOf() > e.valueOf()) {
                this.isEnd = true;
            }
        },

        // 选项选择
        onConfirm(value, item) {
            this.form.result[item] = value;
            this.show = false;
        },

        // 时间判断
        typeJudge() {
            switch (this.remark.type) {
                case "季度":
                    this.returnJiduTime();
                    break;
                case "月度":
                    this.returnYuduTime();
                    break;
                case "旬":
                    this.returnXunTime();
                    break;
                case "周":
                    this.returnZhouTime();
                    break;
                case "自然日":
                    this.returnDayTime();
                    break;
                default:
                    break;
            }
        },
        // 返回季度时间
        returnJiduTime() {
            let jidu = moment().quarter();
            let year = moment().year();
            let after = "";
            let before = "";
            switch (jidu) {
                case 1:
                    after = year + "-01-01";
                    before = year + "-03-31";
                    break;
                case 2:
                    after = year + "-04-01";
                    before = year + "-06-30";
                    break;
                case 3:
                    after = year + "-07-01";
                    before = year + "-09-30";
                    break;
                case 4:
                    after = year + "-10-01";
                    before = year + "-12-31";
                    break;
            }
            this.getState(before, after);
            return;
        },
        // 返回月度时间
        returnYuduTime() {
            let after = moment().date(1).format("YYYY-MM-DD");
            let before = moment()
                .date(1)
                .add(1, "month")
                .subtract(1, "days")
                .format("YYYY-MM-DD");
            this.getState(before, after);
            return;
        },
        // 返回旬时间
        returnXunTime() {
            let day = moment().date();
            let year = moment().year();
            let month = moment().month();
            let lastday = moment()
                .date(1)
                .add(1, "month")
                .subtract(1, "days")
                .format();
            if (day > 0 && day < 11) {
                after = year + month + "-01";
                before = year + month + "-10";
            }
            if (day > 10 && day < 21) {
                after = year + month + "-11";
                before = year + month + "-20";
            }
            if (day > 20 && day < lastday) {
                after = year + month + "-11";
                before = year + month + lastday;
            }
            this.getState(before, after);
            return;
        },
        // 返回周时间
        returnZhouTime() {
            let after = moment().isoWeekday(1).format("YYYY-MM-DD");
            let before = moment().isoWeekday(7).format("YYYY-MM-DD");
            this.getState(before, after);
            return;
        },
        // 返回日时间
        returnDayTime() {
            let after = moment().format("YYYY-MM-DD");
            let before = moment().format("YYYY-MM-DD");
            this.getState(before, after, this.remark.day_number || 1);
            return;
        },
        getDayState(before, after) {
            let daytime = moment().format("YYYY-MM-DD hh:mm:ss");
            let day = moment().format("YYYY-MM-DD");
            return moment(daytime).isBetween(day + " " + before, day + " " + after);
        },
        showPopup() {
            this.show = true;
        },
      cPopup() {
            this.show = false;
        },
    },
    computed: {
        ...mapState(["token", "openid", "userinfo"]),
    },
    async mounted() {
        this.uid = this.userinfo.pk;
        if (
            this.listInfo.need_login == "true" &&
            this.uid &&
            this.remark.show_result == "否"
        ) {
            await this.getStateCf();

        }
    },
};
</script>

<style scoped>
.article {
    padding: 20px;
}

.title {
    font-size: 18px;
    line-height: 1.6;
    padding: 10px 0;
    color: #333;
    text-align: center;
}

.van-form {
    border: 1px solid #f1f1f1;
}

.list {
    border-bottom: 1px solid #f1f1f1;
}

.list:last-child {
    border: none;
}

.success {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    padding: 60px 40px;
    text-align: center;
}

.success .success-icon {
    display: inline-block;
    width: 60px;
    height: 60px;
}

.success .success-icon img {
    width: 60px;
    height: 60px;
}

.success-text {
    text-align: center;
    font-size: 16px;
    color: #333;
    margin-top: 20px;
}

.van-radio {
    margin-bottom: 16px;
}

.no-time {
    text-align: center;
    line-height: 88px;
    font-size: 18px;
    color: #666;
}

.van-cell::after {
    display: none;
}
</style>
