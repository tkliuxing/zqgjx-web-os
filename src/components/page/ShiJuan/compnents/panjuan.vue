<template>
  <el-dialog
    title="判分"
    :visible="show"
    width="50%"
    v-loading="loading"
    :before-close="beforeClose"
  >
    <div class="info" v-if="data">
      <el-row class="timu-row" :gutter="10">
        <el-col :span="24"><h3>答卷信息:</h3></el-col>
      </el-row>
      <el-row class="timu-row" :gutter="10">
        <el-col :span="12">用户: {{ data.user_name || data.user_id }}</el-col>
        <el-col :span="12"
          >答题时间: {{ datetimeFormat(data.create_time) }}</el-col
        >
        <el-col :span="12">得分: {{ data.defen || 0 }}</el-col>
        <el-col :span="12"
          >用时: {{ data.duration ? data.duration : "------" }}</el-col
        >
      </el-row>
      <el-row class="timu-row" :gutter="10">
        <el-col :span="24"><h3>问答题判分:</h3></el-col>
      </el-row>
      <template v-for="ti in data.results">
        <el-row
          class="timu-row"
          :gutter="10"
          v-if="ti.shiti_id_leixing === '问答'"
          :key="ti.pk"
        >
          <el-col :span="24" style="font-weight: bolder">
            {{ ti.shiti_id_choices_length }}: {{ ti.shiti_id_timu }} ({{
              kaoshi.wenda_score
            }}分)
          </el-col>
          <el-col :span="24"> 参考答案: {{ ti.shiti_id_cankao }} </el-col>
          <el-col :span="24">答: {{ JSON.parse(ti.result) }}</el-col>
          <el-col :span="24" style="font-weight: bolder">
            <span class="success"
              >得分:
               <span class="success" v-if="data.ispanjuan=='是'">{{ ti.defen || 0.00 }}</span>
              <el-input-number
                v-else
                size="mini"
                :key="ti.pk"
                v-model="ti.defen"
                :min="0"
                :max="Number(kaoshi.wenda_score)"
                label="label"
                @change="changeScore($event)"
              ></el-input-number>
            </span>
          </el-col>
        </el-row>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="beforeClose">取 消</el-button>
      <el-button type="primary" @click="submitPanjuan" v-if="data.ispanjuan!='是'">判卷完成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from "moment";
import resource from "@/resource.js";
// import kaoshizhanshiVue from "@/pages/JieShao/kaoshizhanshi.vue";
const TMP_ID_DT = "FT138522014027272192"; //答题
const TMP_ID_JG = "FT336770984361844736"; //结果
const TMP_ID_SJ = "FT138149866856067072"; //试卷

export default {
  name: "panjuan",
  props: ["id", "show"],
  data() {
    return {
      loading: false,
      data: null,
      resultdata: [],
      kaoshi:null,
      defen: null,
    };
  },
  methods: {
    changeScore(val){
      this.$forceUpdate();
    },
    async loadData() {
      try {
        let parmas = {
          biz_id: this.$bizCode.dati_biz_id,
          source_id: this.$sourceCode.source_id,
          template_id: TMP_ID_DT,
        };
        this.loading = true;
        this.data = await resource.getObj("data", this.id, parmas);
        let paramss = {
          dati_id: this.id,
          biz_id: this.$bizCode.kaoshi_biz,
          src_id: this.$sourceCode.source_id,
          template_id: TMP_ID_JG,
        };
        let results = await resource.getList("data", paramss);
        results.forEach(item => {
          if (item.defen === '' || item.defen === null || item.defen === undefined) {
            item.defen = 0;
          } else {
            item.defen = Number(item.defen).toFixed(2)
          }
        });
        this.data.results = results;
        // this.data.results = await resource.getList("data", paramss);
        // this.data.results = jieguo;
        let kaoshi = await resource.getObj(
          "data",
          this.data.shijuan_id,
          {template_id: TMP_ID_SJ,}
        );
        this.kaoshi = kaoshi;


        let resp = await resource.getObj('data',this.kaoshi.tiku_id,{template_id:'FT138152757582053376'})

        let timu = await resource.getList('data',{template_id:'FT138153450912034816',tiku_id:resp.pk})

        // 计算正确的题目
        let aa = [];
        this.data.results.forEach((item)=>{
          timu.forEach(item1 =>{
            if(item.shiti_id == item1.pk){
              item.shiti_id_leixing = item1.leixing
            }
          })
          if(item.shiti_id_leixing != '问答') {
            if(item.result == item.shiti_id_daan){
              aa.push(item)
            }
          }
        });
        let danxuan = 0; //答对的单选题数量
        let duoxuan = 0; //答对的多选题数量
        let panduan = 0; //答对的判断题数量
        for (let i = 0; i < aa.length; i++) {
          if(aa[i].shiti_id_leixing == '单选'){
            danxuan += 1;
          }
          if(aa[i].shiti_id_leixing == '多选'){
            duoxuan += 1;
          }
          if(aa[i].shiti_id_leixing == '判断'){
            panduan += 1;
          }
        }
        this.defen = Number(this.kaoshi.danxuan_score) * danxuan + Number(this.kaoshi.duoxuan_score) * duoxuan + Number(this.kaoshi.panduan_score) * panduan;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    beforeClose() {
      this.$emit("beforeClose");
    },
    datetimeFormat(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    // transDuration(duration) {
    //   let du = moment.duration(duration, "seconds");
    //   return `${du.hours()}小时${du.minutes()}分${du.minutes()}秒`;
    // },
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
    async submitPanjuan() {
      this.loading = true;
      if(this.data.ispanjuan == '是'){
        this.$message.error("已判卷!");
        this.loading = false;
        return;
      }let defen = 0;
      let results = JSON.parse(JSON.stringify(this.data.results));
      //累计结果中的问题的defen的总计
      for (let i in results) {
        if (results[i].shiti_id_leixing === '问答') {
          defen += Number(results[i].defen);
          //接口更新结果中的defen
          await resource.updateObj('data', results[i].pk, {
            defen: results[i].defen,
            template_id: TMP_ID_JG
          })
        }
      }
      try {
        let zongfen = 0;
        // for (let i = 0; i < this.data.results.length; i++) {
        //   let ti = this.data.results[i];
        //   console.log("+++++++++",this.data.results)
        //   zongfen += ti.defen;
        //   // TODO: 保存
        //   await resource.updateObj("data", ti.pk, { ...ti });
        // }
        this.data.zongfen = zongfen;
        this.data.is_result = "是";
        let parmas = {
          biz_id: this.$bizCode.dati_biz_id,
          source_id: this.$sourceCode.source_id,
          template_id: TMP_ID_DT,
          defen: Number(defen) + Number(this.data.defen),
          ispanjuan: '是'
        };
        await resource.updateObj("data", this.id, parmas);
        // await resource.updateObj("data", this.id, { ...this.data });
        this.beforeClose();
        this.$message.success("保存成功!");
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    // async id(val) {
    //   await this.loadData();
    //   // console.log("1",this.data)
    // },
    show: {
      async handler(newVal, oldVal) {
        if (newVal) {
          await this.loadData();
          return;
        }
      },
      deep: true,
      immediate: true
    },
    // async show(val) {
    //   if (val === true) {
    //     await this.loadData();
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
