<template>
    <div>
      <div v-if="isShowSm == '是'">
        <div class="box">
          <span v-html="shuoming" > </span>
        </div>
        <div class="bottom-button">
          <van-button round block style="color: #ffffff;margin-bottom: 10px" type="info" @click="startR">
            开始填报
          </van-button>
        </div>
      </div>
      <div class="article" v-else>
        <div class="title">{{ listInfo.title }}</div>
        <div class="list-box">
          <van-form @submit="onSubmit">
            <div  v-if="isState || isEnd"></div>
            <div  v-else>
              <template style="margin: 20px" v-for="(item,index) in formList" v-if="remark.qy_state == '是'">
                <template v-if="remark.type == '自然日'">
                  <div class="list" :key="item.pk">
                    <van-field
                      v-model="form.result[item.col_title]"
                      :name="item.col_title"
                      rows="1"
                      autosize
                      type="textarea"
                      :label="item.col_title+' :'"
                      :placeholder="item.tishi"
                      :rules="[{ required: item.is_required == 'true' ? true: false, message: '请填写' }]"
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
                        @click="showPopup(index)"
                      />
                      <van-popup
                        v-model="show[index]"
                        round
                        position="bottom"
                      >
                        <van-picker
                          show-toolbar
                          :default-index="1"
                          :columns="item.local_data_source ? item.local_data_source : []"
                          @confirm="(val) => onConfirm(val, item.col_title)"
                          @cancel="cPopup(index)"
                        />
                      </van-popup>
                    </template>
                    <template v-if="item.widget == 'checkbox'">
                      <van-cell >
                        <van-field
                          :label="item.col_title"
                          :rules="[{ required: item.is_required == 'true' ? true: false, message: '请选择' }]"
                        >
                          <template #input>
                            <van-checkbox-group
                              v-model="form.result[item.col_title]"
                              @change="(val) => onCheckboxChange(val, item.col_title)"
                            >
                              <template v-for="(option, index) in item.local_data_source">
                                <van-checkbox :name="option" :key="index">{{ option }}</van-checkbox>
                              </template>
                            </van-checkbox-group>
                          </template>
                        </van-field>
                      </van-cell>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <div class="list" :key="item.pk">
                    <van-field
                      v-model="form.result[item.col_title]"
                      :name="item.col_title"
                      rows="1"
                      autosize
                      type="textarea"
                      :label="item.col_title+' :'"
                      :placeholder="item.tishi"
                      :rules="[{ required: item.is_required == 'true' ? true: false, message: '请填写' }]"
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
                        @click="showPopup(index)"
                      />
                      <van-popup
                        v-model="show[index]"
                        round
                        position="bottom"
                      >
                        <van-picker
                          show-toolbar
                          :default-index="1"
                          :columns="item.local_data_source ? item.local_data_source : []"
                          @confirm="(val) => onConfirm(val, item.col_title)"
                          @cancel="cPopup(index)"
                        />
                      </van-popup>
                    </template>
                    <template v-if="item.widget == 'checkbox'">
                      <van-cell >
                        <van-field
                          :label="item.col_title"
                          :rules="[{ required: item.is_required == 'true' ? true: false, message: '请选择' }]"
                        >
                          <template #input>
                            <van-checkbox-group
                              v-model="form.result[item.col_title]"
                              @change="(val) => onCheckboxChange(val, item.col_title)"
                            >
                              <template v-for="(option, index) in item.local_data_source">
                                <van-checkbox :name="option" :key="index">{{ option }}</van-checkbox>
                              </template>
                            </van-checkbox-group>
                          </template>
                        </van-field>
                      </van-cell>
                    </template>
                  </div>
                </template>
              </template>
            </div>
          </van-form>
          <div>
            <div style="margin: 20px">
              <span v-if="remark.qy_state == '否'" style="font-size: 20px">填报未启用</span>
              <div style="margin: 20px" v-if="isState || isEnd">

                <span v-if="isState" style="font-size: 20px">活动暂未开启</span>
                <span v-if="isEnd" style="font-size: 20px">
                  活动已结束
                </span>
              </div>
              <div style="margin: 20px 0;width: 95%" v-else>
                <van-button round block type="info" @click="onSubmit" v-if="remark.qy_state == '是'">
                  提交
                </van-button>
              </div>
              <div style="margin: 20px 0;width: 95%">
                <van-button round v-if="remark.shuoming == '是'" @click.stop="Shuoming" block plain  type="info">
                  返回
                </van-button>
              </div>
            </div>
          </div>
        </div>
        <div class="success" v-if="isSuccess">
          <div class="success-icon">
            <img src="@/assets/img/success.jpg" alt=""/>
          </div>
          <div class="success-text">提交成功</div>
        </div>
        <div class="success" v-if="isSubmit">
          <div class="success-icon">
            <img src="@/mobile/assets/img/success.jpg" alt=""/>
          </div>
          <div class="success-text">您已提交过，请不要重复提交</div>
        </div>
      </div>
    </div>
</template>

<script>
import resource from "@/mobile/resource.js";
// import moment from "moment";
import {mapState} from "vuex";

export default {
    data() {
        return {
          result: null,
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
            show: {},
            atime: null,
          should: true,
          isShowSm: null,
          shuoming: null,
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

        if (this.listInfo.need_login == "true") {
          if (!this.token) {
              this.$router.push({
                path: "/log",
              });
              return;
          }
        }
    },
    methods: {
      onCheckboxChange(value,item){
        this.form.result[item] = value;
      },
      async Shuoming(){
        try {
          let params = {
            template_id: "FT181649085367160832",
          }
          let resp = await resource.getObj("data", this.id,params);
          let shuoming = resp.shuoming;  // 说明
          if(shuoming == '是'){
            this.isShowSm = '是'
          }else{
            this.isState = false;
          }
        }catch (e) {
          console.log(e)
        }
      },
      startR(){
        if(this.isShowSm == '是'){
          this.isShowSm = '否';
        }
      },
        // 获取填报信息
        async getInfo(val) {
            let resp = await resource.getObj("data", this.id, this.params);
            document.title = resp.title;
            let remark = resp;
            let fomrListParams = {
                parent_id : this.id,
                template_id: "FT202308301655334912",
            }
          let res = await resource.getList("data", fomrListParams);
          this.formList = res.map(item => ({
            ...item,
            sort_num: item.sort_num ? Number(item.sort_num) : 0
          })).sort((a, b) => a.sort_num - b.sort_num);

            this.remark = remark;
            this.shuoming = remark.sm;
            this.isShowSm = remark.shuoming;
            if(val){
              this.isShowSm = '否'
            }
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
                this.$toast("提交成功");
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
            let jidu = this.moment().quarter();
            let year = this.moment().year();
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
            let after = this.moment().date(1).format("YYYY-MM-DD");
            let before = this.moment()
                .date(1)
                .add(1, "month")
                .subtract(1, "days")
                .format("YYYY-MM-DD");
            this.getState(before, after);
            return;
        },
        // 返回旬时间
        returnXunTime() {
            let day = this.moment().date();
            let year = this.moment().year();
            let month = this.moment().month();
            let lastday = this.moment()
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
            let after = this.moment().isoWeekday(1).format("YYYY-MM-DD");
            let before = this.moment().isoWeekday(7).format("YYYY-MM-DD");
            this.getState(before, after);
            return;
        },
        // 返回日时间
        returnDayTime() {
            let after = this.moment().format("YYYY-MM-DD");
            let before = this.moment().format("YYYY-MM-DD");
            this.getState(before, after, this.remark.day_number || 1);
            return;
        },
        getDayState(before, after) {
            let daytime = this.moment().format("YYYY-MM-DD hh:mm:ss");
            let day = this.moment().format("YYYY-MM-DD");
            return this.moment(daytime).isBetween(day + " " + before, day + " " + after);
        },
      showPopup(val) {
        this.show =  {
          [val]: true
        }
      },
      cPopup(val) {
        this.show =  {
          [val]: false
        }
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
.box{
  padding: 10px  12px 40px 12px;
  max-height: calc(100vh - 130px);
  overflow: auto;
}
.bottom-button {
  position: fixed;
  bottom: 10px; /* 距离底部的距离，根据需要调整 */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center; /* 水平居中 */
  padding: 0 50px; /* 可根据需要调整 */
}
</style>
