<template>
  <div class="containerss">

    <el-button
      class="fix-shuoming"
      icon="el-icon-notebook-2"
      plain
      round
      type="warning"
      @click="ShuoMingTo"
    >使用说明
    </el-button
    >
    <div style="margin: 20px;">
      <el-switch
        v-model="is_3DMAP"
        active-text="自定义地图"
        inactive-text="普通地图"
        @change="loadData"
      >
      </el-switch>
    </div>

    <quhua v-if="is_3DMAP"/>
    <Index v-else/>
  </div>
</template>
<script>

import quhua from "@/components/page/MAPData/quhua";
import Index from "@/components/page/MAPData/Index";

export default {
  components: {quhua, Index},
  data() {
    return {
      is_3DMAP: false,
    };
  },
  created() {
    this.loadData();
  },
  async mounted() {
    await this.loadData();

  },

  methods: {
    ShuoMingTo() {
      this.$router.push({name: "mapsming"});
    },
    async loadData() {
      console.log(this.is_3DMAP)
    },

  },
};
</script>
<style scoped>
.containerss {
  width: 100%;
  height: 700px;
}

</style>
