<template>
  <div class="article">
    <div class="title">{{ listInfo.title }}</div>
    <div class="list-box">
      <van-form>
        <div
          class="table-list"
          v-for="(list, index) in table_lines"
          :key="index"
        >
          <div class="table-title">{{ list }}</div>
          <template v-for="item in formList">
            <div class="list" :key="item.pk">
              <van-field
                v-model="tbFroms[index]['result'][item.col_name]"
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
                  :value="tbFroms[index].result[item.col_name]"
                  :label="item.col_title"
                  placeholder="请选择"
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
                    @cancel="
                      tbFroms[index]['showPicker' + item.col_name] = false
                    "
                  />
                </van-popup>
              </template>
            </div>
          </template>
        </div>
      </van-form>
    </div>

    <div class="btn-box" v-if="!yulanState">
      <div style="margin: 20px">
        <van-button round block type="info" @click="yulantab"
          >预览表格</van-button
        >
      </div>
    </div>

    <div class="success" v-if="yulanState">
      <hx-table
        :tableth="formList"
        :tabletr="table_lines"
        :tableitem="tbFroms"
      ></hx-table>
      <div style="margin: 30px 20px">
        <van-button
          round
          block
          type="info"
          @click="closeyulan"
          style="margin-bottom: 10px"
          >返回修改</van-button
        >
        <van-button round block type="info" @click="onSubmit">提交</van-button>
      </div>
    </div>

    <div class="success" v-if="remark.qy_state === '否'">
      <div class="success-text">活动暂未开启</div>
    </div>

    <div class="success" v-if="isState || isEnd">
      <div class="success-text" v-if="isState">活动暂未开启</div>
      <div class="success-text" v-if="isEnd">活动已结束</div>
    </div>
    <div v-if="isSuccess" class="success">
      <div class="success-icon">
        <img src="@/assets/img/success.jpg" alt="" />
      </div>
      <div class="success-text">提交成功</div>
    </div>

    <div class="success" v-if="isSubmit">
      <div class="success-icon">
        <img src="@/assets/img/success.jpg" alt="" />
      </div>
      <div class="success-text">您已提交过，请不要重复提交</div>
    </div>
  </div>
</template>

<script>
import resource from "@/resource.js";
import HxTable from "@/components/page/TianBaoInfo/HxTable";
import moment from "moment";
import { mapState } from "vuex";

export default {
  components: { HxTable },
  data() {
    return {
      id: null,
      listInfo: {},
      formList: null,
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
      stateFrom: {},
      isSuccess: false,
      isState: false,
      isEnd: false,
      uid: null,
      isSubmit: false,
      table_lines: [],
      yulanState: false,
      is_ChongFu: false,
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
      }
    }
  },
  methods: {
    // 获取填报信息
    async getInfo() {
      let resp = await resource.getObj("formtemplate", this.id);
      document.title = resp.title;
      let remark = JSON.parse(resp.remark);
      if (resp.need_login == "true" && remark.show_result == "否") {
        await this.getStateCf();
      }
      for (let i = 0; i < resp.field.length; i++) {
        let field = resp.field[i];
        if (field.widget === "select" && resp.field[i].local_data_source) {
          this.form["showPicker" + field.col_name] = false;
          let str = resp.field[i].local_data_source;
          // console.log(str);
          let snsArr = str.split(/[(\r\n)\r\n]+/);
          resp.field[i].local_data_source = snsArr;
        }
        if (resp.field[i].data) {
          let str = resp.field[i].data;
          // console.log(str);
          let snsArr = str.split(/-/);
          resp.field[i].data = snsArr;
        }
      }
      this.remark = remark;
      this.getTime(this.remark.start_time, this.remark.end_time);
      this.table_lines = JSON.parse(resp.table_lines);
      this.listInfo = resp;
      this.formList = { ...resp.field };
      if (resp.need_login == "true" && remark.show_result == "是") {
        await this.typeJudge();
      }
      this.init();
    },

    // 初始化结果数组
    init() {
      let ll = [];
      for (let i = 0; i < this.table_lines.length; i++) {
        ll.push({
          result: {},
          biz_id: this.$bizCode.tianbao_biz,
          src_id: this.$sourceCode.source_id,
          template_id: "FT140625926347358208",
          user: this.$store.state.userinfo.pk,
          user_name: this.$store.state.userinfo.full_name,
          tianbao_id: this.listInfo.pk,
        });
      }
      this.tbFroms = ll;
    },

    // 提交按钮
    async onSubmit() {
      if (this.listInfo.need_login == "true") {
        if (this.remark.show_result == "否") {
          const chongfu = await this.getStateCf();
          if (chongfu === "chongfu") {
            return;
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
      try {
        let data = {
          biz_id: this.$bizCode.tianbao_biz,
          src_id: this.$sourceCode.source_id,
          user: this.$store.state.userinfo.pk,
          user_name: this.$store.state.userinfo.full_name,
          tianbao_id:this.listInfo.pk,
          template_id:'FT140697558892748800'
        }
        let res = await resource.createObj('data',data)
        console.log(res)
        for (let item of this.tbFroms) {
          item.result = JSON.stringify(item.result);
          item.jieguo_id = res.pk
        }
        await resource.createObj("data", this.tbFroms);
        this.$toast.clear();
        this.$toast("提交成功");
        this.isSuccess = true;
      } catch (err) {
        console.log(err);
      }
    },

    yulantab() {
      this.yulanState = true;
    },
    closeyulan() {
      this.yulanState = false;
    },
    // 重复提交检验
    async getStateCf() {
      const form = {
        template_id: "FT140625926347358208",
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
      this.stateFrom.template = this.listInfo.pk;
      this.stateFrom.user = this.$store.state.userinfo.pk;
      this.stateFrom.date_after = after;
      this.stateFrom.date_before = before;
      let resp = await resource.getList("formdataprofile", this.stateFrom);
      if (resp.length > count && this.$store.state.userinfo.pk) {
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
      this.tbFroms[index].result[item] = value;
      this.tbFroms[index]["showPicker" + item] = false;
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
  },
  computed: {
    ...mapState(["token", "userinfo"]),
  },
};
</script>

<style scoped>
body {
  background: #f1f1f1;
}
.table-title {
  border-bottom: 1px solid #f1f1f1;
  text-align: center;
  line-height: 1.8;
  padding: 6px 0;
  color: #333;
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
  padding: 40px 20px;
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
