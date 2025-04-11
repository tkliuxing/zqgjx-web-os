<template>
  <div class="tongji">

    <div class="center m10">

      <h2 v-if="shijuaninfo">{{ shijuaninfo.name }} 结果统计</h2>

      <el-button
        class="fleft"
        type="info"
        round
        icon="el-icon-arrow-left"
        @click="$router.replace({ name: 'wenjuan-shijuan' })"
        >返回问卷列表
      </el-button>
      <div style="float: left;margin-left: 20px">
        <el-form inline >
          <el-form-item label="题目类型">
            <el-radio v-model="radio" label="1" @input="choseType">单选</el-radio>
            <el-radio v-model="radio" label="2" @input="choseType">多选</el-radio>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" plain icon="el-icon-download" @click="daochu">导出明细</el-button>
            <el-button type="primary" plain icon="el-icon-download" @click="daochuHZ">导出汇总</el-button>
<!--            以下两个事件用于人社局导出-->
<!--            <el-button type="primary" plain icon="el-icon-download" @click="Titledaochu">导出明细</el-button>-->
<!--            <el-button type="primary" plain icon="el-icon-download" @click="DaoChuHZ">导出汇总</el-button>-->
          </el-form-item>
        </el-form>
      </div>
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
    <board  v-for="(d, index) in datas" :is-data="d" :key="index" />
  </div>
</template>

<script>
import Board from "@/components/TuBiaoBaoBiao/Board.vue";
import resource from "@/resource";
import mixins from "@/mixins/exportTableSvgEhart.js";
import XLSX from "xlsx";
import RSJ_daochu_excel from "@/components/page/WenJuan/RSJ_daochu_excel";
export default {
  name: "Tongji",
  mixins: [mixins,RSJ_daochu_excel],
  components: { board: Board },
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      shijuan: {
        name: "",
      },
      radio: '1',
      datas: [],
      exportEchartsData: [],
      exportReportData: [],
      exportSvgData: [],
      shijuaninfo: null,
      mingxiData: [],
      huizongData: [],
    };
  },
  computed:{
    excelDownloadTranslate() {
      return {
        timu: "题目",
        zhushi: "注释",
        xuanxiang_01: "选项A",
        xuanxiang_02: "选项B",
        xuanxiang_03: "选项C",
        xuanxiang_04: "选项D",
        xuanxiang_05: "选项E",
        xuanxiang_06: "选项F",
        xuanxiang_07: "选项G",
        xuanxiang_08: "选项H",
        xuanxiang_09: "选项I",
        xuanxiang_10: "选项J",
        result: '结果'
      };
    },
  },
  methods: {
    // 获取明细数据
    async getDatamingxi(){
      try {
        let data = await resource.getObj("formdatareport",100021,{shijuan_id:this.$route.params.id});
        this.mingxiData = data.data;
      }catch (e) {
        console.error(e)
      }
    },
    // 导出汇总
    async getDataHuizong(){
      try {
        let data = await resource.getObj("formdatareport",100022,{shijuan_id:this.$route.params.id});
        this.huizongData = data.data;
      }catch (e) {
        console.error(e)
      }
    },
    processResult(item) {
      if (item.shiti_id_leixing == '单选') {
        return item[`xuanxiang_0${item.result}`] || '';
      } else if (item.shiti_id_leixing == '多选') {
        let results = JSON.parse(item.result);
        return results.map(r => item[`xuanxiang_0${r}`]).filter(Boolean).join(', ');
      } else if (item.shiti_id_leixing == '问答') {
        return item.result.replace(/\"/g, ''); // 去除引号
      }
      return item.result;
    },
    async daochu(){
      let header = [
        "题目",
        "注释",
        "选项A",
        "选项B",
        "选项C",
        "选项D",
        "选项E",
        "选项F",
        "选项G",
        "选项H",
        "选项I",
        "选项J",
        "结果"
      ]
      let tmp = [];
      if(this.mingxiData.length<=0) return this.$message.warning('暂无数据...')
      this.mingxiData.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) {
            if (key == 'result') {
              obj[this.excelDownloadTranslate[key]] = this.processResult(i);
            } else {
              obj[this.excelDownloadTranslate[key]] = i[key];
            }
          }
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "明细列表.xlsx");
    },



    async daochuHZ(){
      if(this.huizongData.length<=0) return this.$message.warning('暂无数据...')
      function padStart(str, length, char) {
        str = String(str);
        while (str.length < length) {
          str = char + str;
        }
        return str;
      }
      function countOptions(data) {
        const optionCount = {};

        data.forEach(item => {
          const { pk, shiti_id_leixing, timu, zhushi,
            ...options
          } = item;
          if (!optionCount[pk]) {
            optionCount[pk] = { timu, zhushi, 单选: {}, 多选: {},选项:{
                xuanxiang_01:item.xuanxiang_01,
                xuanxiang_02:item.xuanxiang_02,
                xuanxiang_03:item.xuanxiang_03,
                xuanxiang_04:item.xuanxiang_04,
                xuanxiang_05:item.xuanxiang_05,
                xuanxiang_06:item.xuanxiang_06,
                xuanxiang_07:item.xuanxiang_07,
                xuanxiang_08:item.xuanxiang_08,
                xuanxiang_09:item.xuanxiang_09,
                xuanxiang_10:item.xuanxiang_10,
              } };
          }

          if (shiti_id_leixing === '单选') {
            const optionKey = `xuanxiang_${padStart(item.result, 2, '0')}`;
            optionCount[pk].单选[options[optionKey]] = (optionCount[pk].单选[options[optionKey]] || 0) + 1;
          }
          if (shiti_id_leixing === '多选') {
            const results = JSON.parse(item.result);
            results.forEach(res => {
              const optionKey = `xuanxiang_${padStart(res, 2, '0')}`;
              optionCount[pk].多选[options[optionKey]] = (optionCount[pk].多选[options[optionKey]] || 0) + 1;
            });
          }
        });
        return optionCount;
      }

      const optionCount = countOptions(this.huizongData);

      function updateOptions(单选, 多选, 选项) {
        for (let key in 选项) {
          let value =选项[key];
          // 对于单选
          if (单选[value]) {
            选项[key] = 单选[value];
          }
          // 对于多选
          if (多选[value]) {
            选项[key] = 多选[value];
          }
        }
      }
      // 转换结果为 Excel 友好的格式
     function convertToSheetData(optionCount) {
        let sheetData = [];

        for (const pk in optionCount) {
          const item = optionCount[pk];
          updateOptions(item.单选, item.多选, item.选项);
          const timu = item.timu;
          const zhushi = item.zhushi;
          let row = {
            题目: timu,
            注释: zhushi,
            选项A: typeof item.选项.xuanxiang_01 != 'number' ? 0 : item.选项.xuanxiang_01,
            选项B: typeof item.选项.xuanxiang_02 != 'number' ? 0 : item.选项.xuanxiang_02,
            选项C: typeof item.选项.xuanxiang_03 != 'number' ? 0 : item.选项.xuanxiang_03,
            选项D: typeof item.选项.xuanxiang_04 != 'number' ? 0 : item.选项.xuanxiang_04,
            选项E: typeof item.选项.xuanxiang_05 != 'number' ? 0 : item.选项.xuanxiang_05,
            选项F: typeof item.选项.xuanxiang_06 != 'number' ? 0 : item.选项.xuanxiang_06,
            选项G: typeof item.选项.xuanxiang_07 != 'number' ? 0 : item.选项.xuanxiang_07,
            选项H: typeof item.选项.xuanxiang_08 != 'number' ? 0 : item.选项.xuanxiang_08,
            选项I: typeof item.选项.xuanxiang_09 != 'number' ? 0 : item.选项.xuanxiang_09,
            选项J: typeof item.选项.xuanxiang_10 != 'number' ? 0 : item.选项.xuanxiang_10,
          };
          sheetData.push(row)
        }
        return sheetData;
      }
      const sheetData = convertToSheetData(optionCount);
      // 导出到 Excel 文件
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, "统计结果");
      XLSX.writeFile(wb, "汇总统计.xlsx");
    },

    choseType(){
      this.loadData();
    },
    async loadShiJuan() {
      let params1 = {
        template_id: 'FT138890411468054528',
      }
      let resp1 = await resource.getObj("data", this.id, params1);
      this.shijuaninfo = resp1;
      let params = {
        shijuan_id: this.id,
        template_id: "FT138911001835397120",
      };
      this.shijuan = await resource.getList("data", params);

    },
    async loadData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      });
      let results = [];
      let arra = [];
      let arrb = [];
      for (let ti of this.shijuan) {
        if (this.radio == '1') {
          if (ti.leixing === "问答" || ti.leixing === "多选") {
            continue;
          }
          let pk = ti.pk;
          arra.push(
            resource.getObj("formdatareport", 5858, { shiti_id: pk })
          );
        } else if (this.radio == '2') {
          if (ti.leixing === "问答" || ti.leixing === "单选") {
            continue;
          }
          let pk = ti.pk;
          arrb.push(
            resource.getObj("formdatareport", 5859, { shiti_id: pk })
          );
        }
      }
      if(this.radio == '1'){
        results = await Promise.all(arra);
      }
      if(this.radio == '2'){
        results = await Promise.all(arrb);
      }
      if(results && results.length>0){
        results.forEach(i => {
          if( i && i.data && i.data.length>0){
            i.title = i.data[0].timu + (i.data[0].zhushi ? ' ( '+i.data[0].zhushi + ' )' : '' );
          }
        });
      }
      this.datas = results;
      loading.close();

    },
  },
  async mounted() {
    this.getDatamingxi();
    this.getDataHuizong();
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
