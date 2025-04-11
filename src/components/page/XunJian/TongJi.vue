<template>
  <div class="tongji">
    <div class="center m10">
      <h2>{{ shijuan.name }} 结果统计</h2>
      <el-button
        class="fleft"
        type="info"
        round
        icon="el-icon-arrow-left"
        @click="$router.replace({ name: 'xunjian-renwu' })"
        >返回巡检任务
      </el-button>
<!--      <el-button-->
<!--        type="primary"-->
<!--        icon="el-icon-download"-->
<!--        @click="$bus.$emit('charts')"-->
<!--        >图表</el-button-->
<!--      >-->
<!--      <el-button-->
<!--        type="primary"-->
<!--        icon="el-icon-download"-->
<!--        @click="$bus.$emit('report')"-->
<!--        >表格</el-button-->
<!--      >-->
<!--      <el-button-->
<!--        type="primary"-->
<!--        icon="el-icon-download"-->
<!--        @click="$bus.$emit('svg')"-->
<!--        >svg</el-button-->
<!--      >-->
      <div class="clean"></div>
    </div>
    <board v-for="(d, index) in datas" :is-data="d" :key="index" />
  </div>
</template>

<script>
import Board from "@/components/TuBiaoBaoBiao/Board";
import resource from "@/resource";
import mixins from "@/mixins/exportTableSvgEhart.js";
export default {
  name: "TongJi",
  mixins: [mixins],
  components: { board: Board },
  // props: {
  //   id: {
  //     type: String,
  //   },
  // },
  data() {
    return {
      shijuan: {
        name: "",
      },
      datas: [],
      exportEchartsData: [],
      exportReportData: [],
      exportSvgData: [],
    };
  },
  created() {
    this.id = this.$route.params.renwu_id;
  },
  methods: {
    async loadShiJuan() {
      let params = {
        template_id: 'FT6626455150592',
        // biz_id: this.$bizCode.xunjian_biz,
      }
      this.shijuan = await resource.getObj("data", this.id,params);
      // this.shijuan.timu_list = await resource.getList('data',{
      //   template_id: 'FT138911001835397120',
      //   shijuan_id:this.id,
      // })
      // console.log(this.shijuan.timu_list)
    },
    async loadData() {
      let results = [];
        let pk = this.shijuan.pk;
        let data = await resource.getObj("formdatareport", 5862,{
          renwu_id: pk,
        });
        results.push({...data, id:5862});
      this.datas = results;
    },
  },
  async mounted() {
    await this.loadShiJuan();
    await this.loadData();
  },
  beforeDestroy() {
    this.$bus.$off();
  },
  watch: {
    exportEchartsData: {
      handler() {
        if (this.exportEchartsData.length === this.datas.length) {
          this.exportEchart("调研问卷统计");
        }
      },
    },
    exportReportData: {
      handler() {
        if (this.exportReportData.length === this.datas.length) {
          this.exportReport("调研问卷统计表格");
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
};
</script>

<style scoped>
.center {
  text-align: center;
}
.fleft {
  float: left;
}
.clean {
  clear: both;
}
.m10 {
  margin: 10px;
}
</style>
