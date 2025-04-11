<template>
  <div class="article">
    <div class="title">{{ listInfo.title }}</div>
    <div class="list-box">
      <van-form @submit="onSubmit">
        <div class="table-list" v-for="(list, index) in remark.total_length" :key="index">
          <template v-for="item in formList">
            <template v-if="item.data">
              <template v-if="getDayState(item.data[0], item.data[1])">
                <div class="list" :key="item.pk">
                  <van-field
                    v-model="tbFroms[index][item.col_name]"
                    :name="item.col_title"
                    :label="item.col_title"
                    :placeholder="item.col_title"
                    :rules="[{ required: item.is_required, message: '请填写' }]"
                    v-if="item.widget === 'input'"
                  />
                  <template v-if="item.widget === 'select'">
                    <van-field
                      readonly
                      clickable
                      name="picker"
                      :value="tbFroms[index][item.col_name]"
                      :label="item.col_title"
                      :placeholder="item.col_title"
                      @click="tbFroms[index]['showPicker' + item.col_name] = true"
                    />
                    <van-popup
                      v-model="tbFroms[index]['showPicker' + item.col_name]"
                      position="bottom"
                    >
                      <van-picker
                        show-toolbar
                        :default-index="0"
                        :columns="item.local_data_source"
                        @confirm="(val) => onConfirm(val, index, item.col_name)"
                        @cancel="tbFroms[index]['showPicker' + item.col_name] = false"
                      />
                    </van-popup>
                  </template>
                </div>
              </template>
            </template>
            <template v-else>
              <div class="list" :key="item.pk">
                <van-field
                  v-model="tbFroms[index][item.col_name]"
                  :name="item.col_title"
                  :label="item.col_title"
                  :placeholder="item.col_title"
                  :rules="[{ required: item.is_required, message: '请填写' }]"
                  v-if="item.widget === 'input'"
                />
                <template v-if="item.widget === 'select'">
                  <van-field
                    readonly
                    clickable
                    name="picker"
                    :value="tbFroms[index][item.col_name]"
                    :label="item.col_title"
                    :placeholder="item.col_title"
                    @click="tbFroms[index]['showPicker' + item.col_name] = true"
                  />
                  <van-popup
                    v-model="tbFroms[index]['showPicker' + item.col_name]"
                    position="bottom"
                  >
                    <van-picker
                      show-toolbar
                      :default-index="0"
                      :columns="item.local_data_source"
                      @confirm="(val) => onConfirm(val, index, item.col_name)"
                      @cancel="tbFroms[index]['showPicker' + item.col_name] = false"
                    />
                  </van-popup>
                </template>
              </div>
            </template>
          </template>
        </div>

        <div style="margin: 20px" v-if="remark.qy_state === '是'">
          <div style="margin: 20px" v-if="isState || isEnd">
            <van-button round block disabled type="info" v-if="isState"
              >活动暂未开启</van-button
            >
            <van-button round block disabled type="info" v-if="isEnd" style="margin-top: 25px"
              >活动已结束</van-button
            >
          </div>
          <div style="margin: 20px" v-else>
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </div>

        <div v-else>
          <div style="margin: 20px">
            <van-button round block type="info" disabled>活动暂未开启</van-button>
          </div>
        </div>
      </van-form>
    </div>

    <div v-if="isSuccess" class="success">
      <div class="success-icon"><img src="@/assets/img/success.jpg" alt="" /></div>
      <div class="success-text">提交成功</div>
    </div>
    <div class="success" v-if="isSubmit">
      <div class="success-icon"><img src="@/assets/img/success.jpg" alt="" /></div>
      <div class="success-text">您已提交过，请不要重复提交</div>
    </div>
  </div>
</template>

<script>
import resource from "@/resource.js";
// import moment from "moment";
import { mapState } from "vuex";
import Vue from "vue";
import { Form, Field, Button, RadioGroup, Radio, Toast, Picker, Popup } from "vant";
import "vant/lib/index.css";
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Toast);
Vue.use(Picker);
Vue.use(Popup);

export default {
  data() {
    return {
      id: null,
      listInfo: {},
      formList: null,
      form: {
        biz_id: 10000,
        org_id: null,
        template: null,
      },
      tbFroms: [],
      remark: {
        qy_state: null,
        bz_info: null,
        day_loop: null,
        show_result: null,
        start_time: null,
        end_time: null,
        total_length: null,
      },
      isSuccess: false,
      isState: false,
      isEnd: false,
      stateFrom: {
        field_01: null,
        create_user: null,
      },
      uid: null,
      isSubmit: false,
    };
  },
  async created() {
    this.$store.commit("ORGID", null);
    this.id = this.$route.query.id;
    if (this.id) {
      this.getInfo();
    }
    if (this.token) {
      try {
        let userinfo = await resource.getList("myinfo");
        this.uid = userinfo.pk;
        this.$store.commit("USERINFO", userinfo);
      } catch {
        this.$router.push({
          path: "/log",
        });
      }
      return;
    }
    let code = this.$route.query.code;
    if (code) {
      let resp = await resource.createObj("mp-codetoopenid", {
        code: code,
        uri: window.location.href,
      });
      let openid = resp.open_id;
      this.$store.commit("OPENID", openid);
      try {
        resp = await resource.createObj("mp-openidlogin", { openid });
        this.$store.commit("LOGIN", resp.token);
        let userinfo = await resource.getList("myinfo");
        this.uid = userinfo.pk;
        this.$store.commit("USERINFO", userinfo);
      } catch (e) {
        // console.log(e);
        this.$router.push({
          path: "/log",
        });
      }
      return;
    }
    if (!this.openid) {
      let resp = await resource.createObj("mp-getauthurl", {
        uri: window.location.href,
        state: "tinabao",
      });
      window.location.href = resp.authorize_url;
      return;
    }
  },
  methods: {
    // 获取填报信息
    async getInfo() {

      let resp = await resource.getObj("formtemplate", this.id);
      for (let i = 0; i < resp.field.length; i++) {
        let field = resp.field[i];
        if (field.widget === "select" && resp.field[i].local_data_source) {
          this.form["showPicker" + field.col_name] = false;
          let str = resp.field[i].local_data_source;
          // console.log(str);
          let snsArr = str.split(/[(\r\n)\r\n]+/);
          snsArr.forEach((item, index) => {
            if (!item) {
              snsArr.splice(index, 1); //删除空项
            }
          });
          resp.field[i].local_data_source = snsArr;
        }
        if (resp.field[i].data) {
          let str = resp.field[i].data;
          // console.log(str);
          let snsArr = str.split(/-/);
          snsArr.forEach((item, index) => {
            if (!item) {
              snsArr.splice(index, 1); //删除空项
            }
          });
          resp.field[i].data = snsArr;
        }
      }
      this.remark = JSON.parse(resp.remark);
      // console.log(resp);
      this.getTime(this.remark.start_time, this.remark.end_time);
      this.listInfo = resp;
      this.formList = { ...resp.field };
      this.form.template = resp.pk;
      this.form.org_id = resp.org_id;
      this.typeJudge();
      this.init();
    },
    // 提交按钮
    onSubmit() {
      if (this.remark.show_result === "否") {
        this.getStateCf();
        return;
      }
      this.submitFrom();
    },
    // 提交结果
    async submitFrom() {
      // 获取ID
      const data = {
        biz_id: 10000,
        name: this.listInfo.title,
        org_id: this.listInfo.org_id,
        field_01: this.listInfo.pk,
        create_user: this.uid,
      };
      // 提交答题
      const tbInfo = await resource.createObj("services", data);
      // console.log(tbInfo);
      for (let i = 0; i < this.tbFroms.length; i++) {
        let tbItem = this.tbFroms[i];
        tbItem.field_01_display = tbInfo.pk;
        await resource.createObj("formdata", tbItem);
      }
      Toast("提交成功");
      this.isSuccess = true;
    },
    // 重复提交检验
    async getStateCf() {
      const form = {
        field_01: this.listInfo.pk,
        user: this.uid,
      };
      let resp = await resource.getList("services", form);
      // console.log(resp);
      if (resp.length > 0) {
        Toast("请不要重复提交");
        return;
      } else {
        this.submitFrom();
      }
    },

    async getState(before, after, count = 1) {
      count = count - 1;
      this.stateFrom.field_01 = this.listInfo.pk;
      this.stateFrom.user = this.uid;
      this.stateFrom.after = after;
      this.stateFrom.before = before;
      let resp = await resource.getList("services", this.stateFrom);
      // console.log(resp);
      if (resp.length > count) {
        this.isSubmit = true;
        return;
      }
    },
    // 获取时间
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
    // picker选项选择
    onConfirm(value, index, item) {
      this.tbFroms[index][item] = value;
      this.tbFroms[index]["showPicker" + item] = false;
    },
    // 初始化结果数组
    init() {
      let ll = [];
      for (let i = 0; i < this.remark.total_length; i++) {
        ll.push({
          ...this.form,
        });
      }
      this.tbFroms = ll;
    },

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
      let lastday = this.moment().date(1).add(1, "month").subtract(1, "days").format();
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
  },
  computed: {
    ...mapState(["token", "openid"]),
  },
};
</script>

<style scoped>
body {
  background: #f1f1f1;
}
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
.table-list {
  border: 1px solid #f1f1f1;
  margin-bottom: 20px;
}
.table-list .list {
  border-bottom: 1px solid #f1f1f1;
}
.table-list .list:last-child {
  border: none;
}
.van-cell::after {
  display: none;
}
</style>
