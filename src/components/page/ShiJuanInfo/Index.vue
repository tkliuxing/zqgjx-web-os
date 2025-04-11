<template>
  <div class="pc-box">
    <div class="index">
      <background :background="background" :color="color"></background>
      <!-- 题目 -->
      <kt-item
        v-if="isQuest"
        :ktitem="tikuList"
        :color="color"
        @submit="submit"
        @back="back"
      ></kt-item>
      <!-- 结果 -->
      <re-sult
        v-if="isResult"
        :dtInfo="dtInfo"
        :showresult="shijuaninfo && shijuaninfo.need_login == '是' ? true : false && shijuaninfo.show_result"
        :color="color"
      ></re-sult>
      <!-- 答题首页 -->
      <div class="index-info" v-if="!isAnswer">
        <div class="title" v-if="!background">{{ shijuaninfo.name }}</div>
        <div class="title-desc" v-if="!background">{{ shijuaninfo.desc }}</div>
        <div class="btn-box" v-if="shijuaninfo && shijuaninfo.is_enabled == '是'  ? true : false">
          <div class="btn-list">
            <button @click="startTab" :style="{ background: color }">
              开始答题
            </button>

          </div>
          <!--          <div class="btn-list">-->
          <!--            <button @click="recordTab" :style="{ background: color }">-->
          <!--              答题记录-->
          <!--            </button>-->
          <!--          </div>-->
          <!-- <div class="btn-list">
            <button @click="recordTab" :style="{ background: color }">
              答题记录
            </button>
          </div>
          -->
          <div class="btn-list" v-if="shijuaninfo && shijuaninfo.need_login == '是'  ? true : false">
            <button @click="rankTab" :style="{ background: color }">
              答题排名
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {mapState} from "vuex";
import resource from "@/resource.js";
import KtItem from "./components/KtItem";
import ReSult from "./components/ReSult";
import Background from "./components/Background";
import _ from 'lodash';
const TMP_ID_SJ = "FT138149866856067072"; //试卷
const TMP_ID_ST = "FT138153450912034816"; //试题
const TMP_ID_DT = "FT138522014027272192"; //答题
const TMP_ID_JG = "FT336770984361844736"; //结果
export default {
  name: "index",
  components: {
    KtItem,
    ReSult,
    Background,
  },
  data() {
    return {
      isAnswer: false,
      isQuest: false,
      isResult: false,
      message: "",
      questFroms: [],
      dati_id: null,
      dtInfo: {},
      background: null,
      sjState: null,
      color: "#e41e1e",
      shijuan_id: null,
      shijuaninfo: {},
      tikuList: [],
      starTime: null,
      datiinfo: null,
      defen: null,
      loading: false,
    };
  },
  async created() {
    if (this.$route.query.pk) {
      this.shijuan_id = this.$route.query.pk;
      await this.getSjInfo();
    }
    if (this.shijuaninfo.need_login == "是") {
      if (!this.token) {
        this.$router.push({
          path: "/log",
        });
      }
    }
    // this.loadDtinfo();
  },
  computed: {
    ...mapState(["token", "userinfo"]),
  },
  methods: {
    // 获取试卷信息
    async getSjInfo() {
      this.loading = true;
      let params = {
        biz_id: this.$bizCode.shijuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_SJ,
      };
      const res = await resource.getObj("data", this.shijuan_id, params);
      this.background = res.background;
      this.color = res.color;
      this.shijuaninfo = res;
      this.loading = false;
    },
    // 获取题目
    async getTkList() {
      let data = {
        // biz_id: this.$bizCode.shijuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_ST,
        tiku_id: this.shijuaninfo.tiku_id,
      };
      let res = await resource.getList("data", data);
      if (this.shijuaninfo.suiji_shiti == '是') {
        if (this.shijuaninfo.is_all_tiku == "是") {
          let shiti_ids = new Array();
          shiti_ids = shiti_ids.concat(res.filter(item => item.leixing == '单选'));
          shiti_ids = shiti_ids.concat(res.filter(item => item.leixing == '多选'));
          shiti_ids = shiti_ids.concat(res.filter(item => item.leixing == '判断'));
          shiti_ids = shiti_ids.concat(res.filter(item => item.leixing == '问答'));
          this.tikuList = shiti_ids;
        } else {
          const shiti_list = res;
          if (shiti_list.length > 0) {
            let shiti_ids = new Array();
            shiti_ids = shiti_ids.concat(shiti_list.filter(item => item.leixing == '单选').sort(() => Math.random() - 0.5).slice(0, Number(this.shijuaninfo.danxuan_count)));
            shiti_ids = shiti_ids.concat(shiti_list.filter(item => item.leixing == '多选').sort(() => Math.random() - 0.5).slice(0, Number(this.shijuaninfo.duoxuan_count)));
            shiti_ids = shiti_ids.concat(shiti_list.filter(item => item.leixing == '判断').sort(() => Math.random() - 0.5).slice(0, Number(this.shijuaninfo.panduan_count)));
            shiti_ids = shiti_ids.concat(shiti_list.filter(item => item.leixing == '问答').sort(() => Math.random() - 0.5).slice(0, Number(this.shijuaninfo.wenda_count)));
            this.tikuList = shiti_ids;
          }
        }
        return;
      }
      let shiti_ids = JSON.parse(this.shijuaninfo.shiti_ids)
      data = {
        biz_id: this.$bizCode.shijuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_ST,
        tiku_id: this.shijuaninfo.tiku_id,
        pk: shiti_ids.join(','),
      };
      res = await resource.getList("data", data);
      const timu_map = _.keyBy(res, 'pk')
      let timu = shiti_ids.map(id => timu_map[id]);
      shiti_ids = new Array();
      shiti_ids = shiti_ids.concat(timu.filter(item => item.leixing == '单选'));
      shiti_ids = shiti_ids.concat(timu.filter(item => item.leixing == '多选'));
      shiti_ids = shiti_ids.concat(timu.filter(item => item.leixing == '判断'));
      shiti_ids = shiti_ids.concat(timu.filter(item => item.leixing == '问答'));
      this.tikuList = shiti_ids;
    },
    // 开始答题
    async startTab() {
      if (this.shijuaninfo.start_time) {
        let start_time = moment(this.shijuaninfo.start_time);
        if (moment().isBefore(start_time)) {
          this.$toast("试卷未开启");
          return;
        }
      }
      if (this.shijuaninfo.end_time) {
        let end_time = moment(this.shijuaninfo.end_time);
        if (moment().isAfter(end_time)) {
          this.$toast("试卷已过期");
          return;
        }
      }
      await this.getTkList();
      this.isAnswer = true;
      this.isQuest = true;
      this.starTime = new moment();
    },
    // 返回
    back() {
      this.isAnswer = false;
      this.isQuest = false;
    },

    recordTab() {
      this.$router.replace({
        name: "ksrecord",
        query: {
          id: this.sjId,
        },
      });
    },

    rankTab() {
      this.$router.replace({
        name: "ksrank",
        query: {
          id: this.$route.query.pk,
        },
      });
    },
    // 获取试卷Id/提交答案
    async submit(questFroms) {
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
        duration: 0,
      });
      // 获取答题ID
      const data = {
        shijuan_id: this.shijuan_id,
        biz_id: this.$bizCode.kaoshi_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_DT,
        user_id: this.userinfo.pk,
        user_name: this.userinfo.full_name,
        department_name: this.userinfo.department_name,
        duration: this.transDuration(this.getDuration()),
        defen: this.defen
      };
      // 提交答题
      const resp = await resource.createObj("data", data);
      //  获取答题信息
      await this.loadDtinfo(resp.pk);
      // this.dtInfo = resp;
      // 提交答案
      let datass = questFroms.map((item) => {
        return {
          ...item,
          shijuan_id: this.shijuan_id,
          dati_id: resp.pk,
          org_id: this.shijuaninfo.org_id,
          sys_id: this.shijuaninfo.sys_id,
          biz_id: this.$bizCode.kaoshi_biz,
          src_id: this.$sourceCode.source_id,
          template_id: TMP_ID_JG,
          result: JSON.stringify(item.result), // 多选题的结果 多了一层数组,需要转成字符串
          resultA: item.result.toString()
        }
      })
      // 用来提交答案
     await resource.createObj("data", datass);
      let params = {
        dati_id: resp.pk,
        biz_id: this.$bizCode.kaoshi_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_JG,
      };
      let res = await resource.getList("data", params);
      // 拿tikulist的leixing赋值给res的shiti_id_leixing
      this.tikuList.forEach((item) => {
        res.forEach((item2) => {
          if (item.pk == item2.shiti_id) {
            item2.shiti_id_timu = item.timu;
            item2.shiti_id_leixing = item.leixing;
          }
        });
      });
      res.forEach((item) => {
        if (item.shiti_id_leixing == "多选") {
          // 字符串转成数组
          let arr = item.result.split(",");
          // ['[0', '1]'] 处理成 ['0', '1']
          // 将数组中的第一个元素去掉开头的方括号，并将结果赋给变量newArr
          let newArr = arr[0].replace('[', '').split(',');
          // 将数组中的最后一个元素去掉末尾的方括号，并将结果追加到变量newArr中
          newArr.push(arr[arr.length - 1].replace(']', '').trim());
          // 对于其他的元素，去掉前后的空格即可
          for (let i = 1; i < arr.length - 1; i++) {
            newArr.push(arr[i].trim());
          }
          let xuan_arr = newArr.map((xuan) => {
            return this.transIndexToABC(Number(xuan));
          });
          item.result = xuan_arr.sort().join('');
        }
        if (item.shiti_id_leixing == "单选" || item.shiti_id_leixing == "判断") {
          let arr = [parseInt(item.result)];
          let xuan_arr = arr.map((xuan) => {
            return this.transIndexToABC(xuan);
          });
          item.result = xuan_arr.join();
        }
        if (item.shiti_id_leixing == "问答") {
          item.result = item.result;
        }
      })
      // 计算正确的题目
      let aa = [];
      res.forEach((item) => {
        if (item.shiti_id_leixing != '问答') {
          if (item.result == item.shiti_id_daan) {
            aa.push(item)
          }
        } else {
          let result = item.result;
          let can = this.reg_replace_sign(item.shiti_id_cankao).split(' ')
          let cankao = can.filter(item => item);  // 去除空字符串
          //判断这两个数组的每一项是否相等,相等则为true
          let isSame = true;
          for (let i = 0; i < cankao.length; i++) {
            if (result.indexOf(cankao[i]) == -1) {
              isSame = false;
              break;
            }
          }
          if (isSame) {
            aa.push(item)
          }
        }
      });
      let danxuan = 0; //答对的单选题数量
      let duoxuan = 0; //答对的多选题数量
      let panduan = 0; //答对的判断题数量
      let wenda = 0; //答对的问答题数量
      for (let i = 0; i < aa.length; i++) {
        if (aa[i].shiti_id_leixing == '单选') {
          danxuan += 1;
        }
        if (aa[i].shiti_id_leixing == '多选') {
          duoxuan += 1;
        }
        if (aa[i].shiti_id_leixing == '判断') {
          panduan += 1;
        }
        if (aa[i].shiti_id_leixing == '问答') {
          wenda += 1;
        }
      }
      // 计算总得分
      this.defen = Number(
          this.shijuaninfo.danxuan_score) * danxuan
        + Number(this.shijuaninfo.duoxuan_score) * duoxuan
        + Number(this.shijuaninfo.panduan_score) * panduan
        + Number(this.shijuaninfo.wenda_score) * wenda;
      // 把得分信息更新到答题信息中
      const datas = {
        shijuan_id: this.shijuan_id,
        biz_id: this.$bizCode.kaoshi_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_DT,
        user_id: this.userinfo.pk,
        user_name: this.userinfo.full_name,
        department_name: this.userinfo.department_name,
        duration: this.transDuration(this.getDuration()),
        defen: this.defen
      };
      // 提交答题 更新答题信息 追加分数
      const resps = await resource.updateObj("data", resp.pk, datas);
      localStorage.setItem('datiinfo', JSON.stringify(resps));
      this.dtInfo = resps;
      // 关闭loading
      this.$toast.clear();
      this.isQuest = false;
      this.isResult = true;
    },
    reg_replace_sign(str) {
      let regexp = new RegExp("[`~!@#$^&*()=|\{\}':;,\.<>/?！￥…（）—【】‘；：”“。，、？\n]", "g");
      return str.replace(regexp, ' ');
    },
    // 获取答题信息
    async loadDtinfo(id) {
      this.loading = true;
      const data = {
        biz_id: this.$bizCode.kaoshi_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_DT,
      };
      let res = await resource.getObj("data", id, data);
      this.datiinfo = res;
      this.loading = false;
    },
    // 结果转换
    transIndexToABC(index) {
      switch (index) {
        case 0:
          return "A";
        case 1:
          return "B";
        case 2:
          return "C";
        case 3:
          return "D";
        case 4:
          return "E";
        case 5:
          return "F";
        case 6:
          return "G";
        case 7:
          return "H";
        case 8:
          return "I";
        case 9:
          return "J";
        default:
          return "";
      }
    },
    // 用时
    getDuration() {
      let tt = 0;
      if (this.starTime) {
        let st = this.starTime;
        let et = new Date();
        let time = et - st;
        tt = parseInt(time / 1000);
      }
      return tt;
    },

    transDuration(duration) {
      let du = moment.duration(duration, 'seconds');
      return `${du.hours()}小时${du.minutes()}分${du.seconds()}秒`
    },


  },
};
</script>

<style scoped>
.pc-box {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
}

.index {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0 20px;
}

.btn-box {
  position: fixed;
  bottom: 120px;
  left: 0;
  text-align: center;
  width: 100%;
}

.btn-box button {
  display: inline-block;
  line-height: 44px;
  padding: 0 60px;
  font-size: 16px;
  border-radius: 200px 200px;
  background: none;
  color: #fff;
  background: #e41e1e;
  border: none;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
}

.btn-list {
  margin: 20px 0;
}

.index-info {
  padding: 20% 0 15%;
  position: relative;
  z-index: 9;
}

.title {
  line-height: 1.8;
  text-align: center;
  font-size: 20px;
  color: #f93f3f;
}

.title-desc {
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.5;
  color: #f93f3f;
  text-align: center;
  padding: 0 20px;
}
</style>
