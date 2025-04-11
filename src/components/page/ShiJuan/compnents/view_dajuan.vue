<template>
  <el-dialog
    title="查看答卷"
    :visible="show"
    width="60%"
    v-loading="loading"
    :before-close="beforeClose"
  >
    <div class="info" v-if="data">
      <el-row class="timu-row" :gutter="10">
        <el-col :span="24">
          <h3>答卷信息:</h3>
        </el-col>
      </el-row>
      <el-row class="timu-row" :gutter="10">
        <el-col :span="12"
          >答题时间: {{ datetimeFormat(datiinfo.create_time) }}</el-col
        >
        <el-col :span="12">用时: {{ datiinfo.duration }}</el-col>
        <el-col :span="12"
          >用户:
          {{ datiinfo.user_name ? datiinfo.user_name : "------" }}</el-col
        >
        <el-col :span="12"
          >部门:
          {{
            datiinfo.department_name ? datiinfo.department_name : "------"
          }}</el-col
        >
        <el-col :span="12">实际得分: {{ sumfen }}</el-col>
        <el-col :span="12">问答得分: {{ datiinfo.defen }}</el-col>
      </el-row>
      <el-row class="timu-row" :gutter="10">
        <el-col :span="24">
          <h3>答题信息:</h3>
        </el-col>
      </el-row>
      <el-row
        class="timu-row"
        :gutter="10"
        v-for="(item, index) in data"
        :key="item.pk"
      >
        <el-col :span="24" style="font-weight: bolder">
          {{ index + 1}}:{{ item.shiti_id_timu }}
        </el-col>

        <template v-if="item.shiti_id_leixing !== '问答'">
          <el-col
            :span="24"
            v-for="(xuan, idx) in item.shiti_id_choices_length"
            :key="idx"
            >{{ transIndexToABC(idx) }}.
            {{
              item[`shiti_id_xuanxiang_${idx > 8 ? idx + 1 : "0" + (idx + 1)}`]
            }}</el-col
          >
        </template>
        <el-col :span="24" style="color: #67c33b">
          {{ item.shiti_id_leixing !== "问答" ? "正确答案" : "参考答案" }}:
          {{
            item.shiti_id_leixing !== "问答"
              ? item.shiti_id_daan
              : item.shiti_id_cankao
          }}
        </el-col>

        <el-col :span="24" v-if="item.shiti_id_leixing !== '问答'"
          >答: {{ item.result }}</el-col
        >

        <el-col :span="24" v-else>答: {{ item.result }}</el-col>

        <!-- <el-col :span="24" style="font-weight: bolder">
          <span class="success" v-if="ti.defen > 0">得分: {{ ti.defen }}</span>
          <span class="error" v-else>得分: {{ ti.defen }}</span>
        </el-col> -->
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="beforeClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from "moment";
import resource from "@/resource.js";
import {jsonToExcel} from "@/utils/excelzip";
const TMP_ID_DT = "FT138522014027272192"; //答题
const TMP_ID_JG = "FT336770984361844736"; //结果
const TMP_ID_SJ = "FT138149866856067072"; //试卷
const TMP_ID_ST = "FT138153450912034816"; //试题
export default {
  name: "viewdajuan",
  props: ["id", "show"],
  data() {
    return {
      loading: false,
      data: null,
      shitiobj: {},
      datiinfo: {},
      sumfen:0, // 总分
    };
  },
  methods: {

    // 获取结果列表
    async loadJieguoData() {
      this.loading = true;
      let params = {
        dati_id: this.id,
        biz_id: this.$bizCode.kaoshi_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_JG,
      };
      try {
        let res = await resource.getList("data", params);

        let paramss = {
          biz_id: this.$bizCode.kaoshi_biz,
          src_id: this.$sourceCode.source_id,
          template_id: TMP_ID_SJ,
        };
        // 获取试卷信息
        let shijuaninfo = await resource.getList("data", paramss);
        // 用试卷信息和答题信息对比判断是否是同一套试卷
        let infoObj={};
        infoObj = shijuaninfo.find(item=>{
          if(item.pk == this.datiinfo.shijuan_id){
            return item
          }
        })
         let data = {
           src_id: this.$sourceCode.source_id,
           template_id: TMP_ID_ST,
           tiku_id: infoObj.tiku_id,
         };
        let timu = await resource.getList("data", data);
        timu.forEach((item) => {
          res.forEach((item2) => {
            if (item.pk == item2.shiti_id) {
              item2.shiti_id_timu = item.timu;
              item2.shiti_id_leixing = item.leixing;
            }
          });
        });
        res.forEach((item) => {
          if (item.shiti_id_leixing == "多选") {
            let arr = JSON.parse(item.result);
            let xuan_arr = arr.map((xuan) => {
              return this.transIndexToABC(xuan);
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
            if(Array.isArray(JSON.parse(item.result))){
              item.result = ""
            }else {
              item.result = JSON.parse(item.result);
            }
          }
        })
        // 获取所有题目,用来计算总分数
        let dan = 0; //单选题数量
        let duo = 0; //多选题数量
        let pan = 0; //判断题数量
        let wen = 0; //问答题数量
        for (let i = 0; i < res.length; i++) {
          if(res[i].shiti_id_leixing == '单选'){
            dan += 1;
          }
          if(res[i].shiti_id_leixing == '多选'){
            duo += 1;
          }
          if(res[i].shiti_id_leixing == '判断'){
            pan += 1;
          }
          if(res[i].shiti_id_leixing == '问答'){
            wen += 1;
          }
        }
        this.sumfen = Number(infoObj.danxuan_score) * dan + Number(infoObj.duoxuan_score) * duo + Number(infoObj.panduan_score) * pan + Number(infoObj.wenda_score) * wen;
        this.data = res;
      } catch (e) {
        console.log(e);
      } finally {
      }
  this.loading = false;
    },

    // 获取答题信息
    async loadDtinfo() {
      this.loading = true;
      const data = {
        biz_id: this.$bizCode.kaoshi_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_DT,
      };
      let res = await resource.getObj("data", this.id, data);
      this.datiinfo = res;
      this.loading = false;
    },

    // 时间格式化
    datetimeFormat(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },

    beforeClose() {
      this.$emit("beforeClose");
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

  },
  watch: {
    async id(val) {
      await this.loadDtinfo();
      await this.loadJieguoData();
    },
    // async show(val) {
    //   if (val === true) {
    //     await this.loadDtinfo();
    //     await this.loadJieguoData();
    //   }
    // },
  },
};
</script>

<style scoped>
.timu-row,
.el-row {
  margin: 10px 0;
}
.success {
  color: #67c23a;
}
.error {
  color: #f56c6c;
}
</style>
