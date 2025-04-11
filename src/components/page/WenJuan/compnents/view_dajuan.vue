<template>
  <el-dialog
    title="查看答卷"
    :visible="show"
    width="60%"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :before-close="beforeClose"
  >
    <div class="info" v-if="data" >
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
          {{ index+1 }}:{{ item.shiti_id_timu }}
        </el-col>

        <template v-if="item.shiti_id_leixing !== '问答'">
          <el-col
          :span="24"
          v-for="(xuan, idx) in item.shiti_id_choices_length"
          :key="idx">
<!--            {{idx}}、、{{xuan}}-->
        {{ transIndexToABC(idx+1) }}.
            {{
              item[`shiti_id_xuanxiang_${idx > 8 ? idx + 1 : "0" + (idx + 1)}`]
            }}
         </el-col>
        </template>
        <el-col :span="24" style="color: #67c33b">
          {{ item.shiti_id_leixing !== "问答" ? "选择答案" : "输入答案" }}:
          {{item.result}}
          <p v-if="item.qita_number == '1'">填写项: {{ item.qita_result }}</p>
        </el-col>
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
import result from "element-ui/packages/result";

export default {
  name: "viewdajuan",
  computed: {
    result() {
      return result
    }
  },
  props: ["id", "show", "shijuan_id"],
  data() {
    return {
      loading: false,
      data: null,
      shitiobj: {},
      datiinfo: {},
      timu: [],
    };
  },
  methods: {
    // 获取结果列表
    async loadJieguoData() {
      this.loading = true;
      // 获取题目
      let timu = {
        template_id: 'FT138911001835397120',
        shijuan_id: this.shijuan_id,
      }
    this.timu = await resource.getList('data', timu);
      console.log(this.timu,'timu')
      let params = {
        dati_id: this.id,
        biz_id: this.$bizCode.wenjuan_biz,
        // src_id: this.$sourceCode.source_id,
        template_id: "FT138488002023051264",
      };
      try {

        let res = await resource.getList("data", params);
        console.log(res,'res')
        res.forEach((item) => {
          this.timu.forEach(item1=>{
            if(item.shiti_id == item1.pk){
              item.qita_number = item1.qita_number
            }
          })

          if (item.shiti_id_leixing == "多选") {
            let arr = JSON.parse(item.result);
            let xuan_arr = arr.map((xuan) => {
              return this.transIndexToABC(xuan);
            });
            item.result = xuan_arr.join();
          }
          if (
            item.shiti_id_leixing == "单选" ||
            item.shiti_id_leixing == "判断"
          ) {
            let arr = [parseInt(item.result)];
            let xuan_arr = arr.map((xuan) => {
              return this.transIndexToABC(xuan);
            });

            item.result = xuan_arr.join();
          }
          if (item.shiti_id_leixing == "问答") {
            item.result = JSON.parse(item.result);
          }
        });
        this.data = res.reverse();
        console.log(this.data,'21313')
      } catch (e) {
        console.log(e,);
      } finally {
      }
      this.loading = false;
    },

    // 获取答题信息
    async loadDtinfo() {
      const data = {
        biz_id: this.$bizCode.wenjuan_biz,
        // src_id: this.$sourceCode.source_id,
        template_id: "FT138522014027272192",
      };
      let res = await resource.getObj("data", this.id, data);
      this.datiinfo = res;
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
      switch (index-1) {
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
  async created() {
    await this.loadDtinfo();
    await this.loadJieguoData();
  },
  async mounted() {
    await this.loadDtinfo();
    await this.loadJieguoData();
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
