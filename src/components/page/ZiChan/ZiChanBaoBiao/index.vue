<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="分类明细">
        <FenLeiMingXi />
      </el-tab-pane>
      <el-tab-pane label="资产明细">
        <ZiChanMingXi />
      </el-tab-pane>
      <el-tab-pane label="分类汇总">
        <FenLeiHuiZong />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FenLeiMingXi from "./FenLeiMingXi.vue";
import ZiChanMingXi from "./ZiChanMingXi.vue";
import FenLeiHuiZong from "./FenLeiHuiZong.vue";
export default {
  components: {
    FenLeiMingXi,
    FenLeiHuiZong,
    ZiChanMingXi,
  },
};
</script>

<style>
</style>