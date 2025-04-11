<template>
  <div class="box">
    <template v-if="JSON.stringify(data) !== '{}'">
      <Report
        :isData="data"
        style="flex: 1;"
        v-bind="this.$attrs"
      />
      <Charts
        :isData="data"
        class="chartsStyle"
        v-bind="this.$attrs"
      />
    </template>
  </div>
</template>

<script>
import echarts from "echarts";
import dataTool from "echarts/extension/dataTool";
import Charts from "./Charts.vue";
import Report from "./Report.vue";
echarts.dataTool = dataTool;
export default {
  name: "Board",
  props: {
    isData: {
      type: Object,
    },
  },
  data() {
    return {
      data: {},
      onlyTableData: [],
      onlyTableHeader: [],
    };
  },
  methods: {
    change() {
      this.data = { ...this.isData };
    },
  },
  created() {
    this.change();
  },
  components: {
    Report,
    Charts,
  },
  watch: {
    isData: {
      handler() {
        this.change();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  min-height: 700px;
}
.chartsStyle {
  margin-left: 1rem;
  flex: 3;
  padding: 20px;
  overflow-x: scroll;
}
</style>
