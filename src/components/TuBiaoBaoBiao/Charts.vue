<template>
  <div class="boxContainer">
    <div class="control" v-if="isSingle">
      <el-radio-group
        v-model="radio"
        @change="getOptions"
        v-if="isData.data.length > 0"
      >
        <el-radio label="line">折线图</el-radio>
        <el-radio label="column">条形图</el-radio>
        <el-radio label="pie">饼图</el-radio>
        <el-radio label="bar">柱图</el-radio>
      </el-radio-group>
      <div style="margin-top: 1rem; font-size: 1.5rem">{{ isData.title }}</div>
    </div>
    <div v-else style="height: 1rem"></div>
    <div class="theme" v-if="isData.data.length > 0">
      <el-button
        title="调整布局"
        icon="el-icon-setting"
        circle
        type="primary"
        style="margin-right: 1rem"
        @click="chartPropVisiable = true"
      />
      <span>配色:</span>
      <template v-for="(item, index) in colorPanel">
        <a :key="index" :class="themeIndex === index && 'currentTheme'">
          <span
            @click="
              () => {
                selectTheme(item, index);
              }
            "
            :style="`background:linear-gradient(135deg, ${item[0]} 0%,${item[1]} 50%, ${item[2]} 51%,${item[3]} 100%)`"
          ></span>
        </a>
      </template>
    </div>
    <div
      :style="`height:${charts.height}px;min-width:100%;width:${charts.width}px`"
    >
      <Echarts
        class="exportword"
        ref="chart"
        :options="options"
        :autoresize="true"
        :initOptions="{ renderer: 'svg' }"
      />
      <div class="control">{{ isData.charts.detail }}</div>
    </div>
    <el-dialog
      title="调整布局"
      :visible.sync="chartPropVisiable"
      width="30%"
      center
    >
      <el-form inline>
        <el-form-item label="高度">
          <el-input
            v-model.number="chartProp.box.height"
            placeholder="请输入图表高度"
          />
        </el-form-item>
        <el-form-item label="宽度">
          <el-input
            v-model.number="chartProp.box.width"
            placeholder="请输入图表宽度"
          />
        </el-form-item>
        <el-form-item label="上">
          <el-input v-model="chartProp.grid.top" />
        </el-form-item>
        <el-form-item label="下">
          <el-input v-model="chartProp.grid.bottom" />
        </el-form-item>
        <el-form-item label="左">
          <el-input v-model="chartProp.grid.left" />
        </el-form-item>
        <el-form-item label="右">
          <el-input v-model="chartProp.grid.right" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="chartPropVisiable = false">取消</el-button>
        <el-button type="primary" @click="settingGrid">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Echarts from "./vue-echarts/components/ECharts.vue";
import * as charts from "./chart/index.js";
import { colorTable } from "./chart/util.js";
export default {
  name: "Charts",
  props: {
    isData: {
      type: Object,
    },
  },
  data() {
    return {
      radio: "line",
      options: {},
      isCategory: false,
      isSingle: true,
      chartPropVisiable: false,
      borderVisiable: false,
      idx: 0,
      themeIndex: "1",
      chartProp: {
        grid: {
          top: 100,
          left: 100,
          right: 100,
          bottom: 100,
        },
        box: {
          height: 600,
          width: 1000,
        },
      },
      charts: {
        width: 0,
        height: 600,
      },
    };
  },
  methods: {
    settingGrid() {
      this.charts.width = this.chartProp.box.width;
      this.charts.height = this.chartProp.box.height;
      this.options["grid"] = JSON.parse(JSON.stringify(this.chartProp.grid));
      this.chartPropVisiable = false;
    },
    selectTheme(color, index) {
      this.options.color = color;
      if (this.options.visualMap) {
        this.options.visualMap.color = color;
      }
      this.themeIndex = index;
    },
    async getOptions() {
      if (this.isData.charts.more) {
        if (this.isData.charts.y[0]["type"] === "map") {
          this.options = await charts.Map(this.isData.data, this.isData.charts);
        } else {
          this.options = await charts.MultipleSeries(
            this.isData.data,
            this.isData.charts
          );
        }
        this.isSingle = false;
      } else {
        if (this.radio === "line") {
          this.options = await charts.MultipleSeries(
            this.isData.data,
            this.isData.charts
          );
        } else if (this.radio === "column") {
          this.options = await charts.Column(
            this.isData.data,
            this.isData.charts
          );
        } else if (this.radio === "pie") {
          this.options = await charts.MultipleSeries(
            this.isData.data,
            this.isData.charts,
            this.radio
          );
        } else if (this.radio === "bar") {
          this.options = await charts.MultipleSeries(
            this.isData.data,
            this.isData.charts,
            this.radio
          );
        }
      }

      this.options.color = colorTable[this.themeIndex];
      this.settingGrid();
    },
    getChartsType() {
      if (!this.isData.charts.more) {
        let type = this.isData.charts.y[0].type;
        if (type === "line") {
          this.radio = "line";
        } else if (type === "pie") {
          this.radio = "pie";
        } else if (type === "bar") {
          this.radio = "bar";
        } else if (type === "row") {
          this.radio = "column";
        }
      }
      this.getOptions();
    },
    registerEvent() {
      this.$bus.$on("charts", () => {
        try {
          let str = this.$refs.chart.$el.getElementsByTagName("div")[0];
          this.$bus.$emit("base64Img", {
            [`img_${this.isData.id}`]: str.innerHTML,
            [`title_${this.isData.id}`]: this.isData.title,
            [`desc_${this.isData.id}`]: "",
          });
        } catch {}
      });
      this.$bus.$on("svg", () => {
        try {
          let str = this.$refs.chart.$el.getElementsByTagName("div")[0];
          this.$bus.$emit("exportSvgData", {
            [`img_${this.isData.id}`]: str.innerHTML,
            [`title_${this.isData.id}`]: this.isData.title,
            [`desc_${this.isData.id}`]: "",
          });
        } catch {}
      });
    },
  },
  computed: {
    colorPanel() {
      return colorTable;
    },
  },
  created() {
    if (this.isData.data.length > 0) {
      this.getChartsType();
      this.registerEvent();
    }
  },
  directives: {
    focus: {
      inserted: function (el, binding, vnode) {
        el.getElementsByTagName("input")[0].focus();
      },
    },
  },
  watch: {
    isData: {
      handler(value) {
        this.getOptions();
      },
      deep: true,
    },
  },
  components: {
    Echarts,
  },
};
</script>

<style scoped>
.boxContainer {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 15px #ccc;
  margin-right: 1rem;
  position: relative;
  padding-top: 2rem;
}
.echarts {
  width: 100%;
  height: 95%;
}
.theme {
  position: absolute;
  top: 0;
  z-index: 4;
  border-radius: 10px;
  padding: 6px 5px;
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}
.theme a {
  width: 28px;
  height: 28px;
  display: inline-block;
  margin: 0 0.1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.theme a:hover {
  cursor: pointer;
}
.theme a span {
  display: inline-block;
  width: 24px;
  height: 24px;
}
.currentTheme {
  border: 1px solid red;
}
.control {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
}
.remark {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 20px 0;
}
</style>
