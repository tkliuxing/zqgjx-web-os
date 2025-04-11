<template>
  <div>
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <span>报销统计</span>
        </el-form-item>
        <el-form-item>
          <el-button
            class="fleft"
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.replace({ name: 'fapiao-fapiao' })"
            >返回
          </el-button>
        </el-form-item>
        <el-form-item label="报销时间">
          <el-date-picker
            @change="dateChange"
            v-model="filterData.create_time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button type="primary" icon="el-icon-search" @click="loadData"-->
<!--            >统计</el-button-->
<!--          >-->
<!--          <el-button-->
<!--            type="primary"-->
<!--            icon="el-icon-download"-->
<!--            @click="$bus.$emit('charts')"-->
<!--            >图表</el-button-->
<!--          >-->
<!--          <el-button-->
<!--            type="primary"-->
<!--            icon="el-icon-download"-->
<!--            @click="$bus.$emit('report')"-->
<!--            >表格</el-button-->
<!--          >-->
<!--          <el-button-->
<!--            type="primary"-->
<!--            icon="el-icon-download"-->
<!--            @click="$bus.$emit('svg')"-->
<!--            >svg</el-button-->
<!--          >-->
<!--        </el-form-item>-->
      </el-form>
    </el-card>
    <board v-for="(d, index) in datas" :is-data="d" :key="index" />
  </div>
</template>

<script>
import moment from "moment";
import Board from "@/components/TuBiaoBaoBiao/Board";
import resource from "@/resource";
import mixins from "@/mixins/exportTableSvgEhart.js";

export default {
  name: "FPTongJi",
  components: { board: Board },
  mixins: [mixins],
  data() {
    return {
      shijuan: {
        name: "",
      },
      tj_leixing: "dep",
      filterData: {
        // before: "",
        // after: "",
        create_time: [],
      },
      datas: [],
      exportEchartsData: [],
      exportReportData: [],
      exportSvgData: [],
    };
  },
  methods: {
    async loadData() {
      this.datas = [];
      let params = {
        ...this.filterData,
        // biz_id: this.$bizCode.fapiao_biz_id,
        // source_id: this.$sourceCode.source_id,
        template_id: 'FT140734205059735552',
      };
      //  let data = await resource.getObj("formdatareport",5858,{shiti_id:pk});
      // results.push({...data, id:pk});
      let result = await resource.getObj("formdatareport",5860, params);
      this.datas.push(result);
      let result1 = await resource.getObj("formdatareport",5861, params);
      this.datas.push(result1);
    },
    async dateChange() {
      if (
        this.filterData.create_time &&
        this.filterData.create_time.length === 2
      ) {
        this.filterData.before = this.filterData.create_time[0];
        this.filterData.after = this.filterData.create_time[1];
      } else {
        const today = moment();
        const start_date = today.subtract(1, "months").format("YYYY-MM-DD");
        const end_date = moment().format("YYYY-MM-DD");
        this.filterData.before = start_date;
        this.filterData.after = end_date;
        this.filterData.create_time = [start_date, end_date];
      }
    },
  },
  async mounted() {
    const today = moment();
    const start_date = today.subtract(1, "months").format("YYYY-MM-DD");
    const end_date = moment().format("YYYY-MM-DD");
    this.filterData.before = start_date;
    this.filterData.after = end_date;
    this.filterData.create_time = [start_date, end_date];
    await this.loadData();
  },
  watch: {
    exportEchartsData: {
      handler() {
        if (this.exportEchartsData.length === this.datas.length) {
          this.exportEchart("发票统计");
        }
      },
    },
    exportReportData: {
      handler() {
        if (this.exportReportData.length === this.datas.length) {
          this.exportReport("发票统计表格");
        }
      },
    },
    exportSvgData: {
      handler() {
        if (this.exportSvgData.length === this.datas.length) {
          this.exportSvg();
        }
      },
    },
  },
  beforeDestroy() {
    this.$bus.$off();
  },
};
</script>

<style scoped>
</style>
