<template>
  <div class="JiBenXinXiGuanLi">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="档案分类" name="first">
        <BaseconfigCURD category-name="档案分类" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="保密等级" name="second">
        <BaseconfigCURD category-name="保密等级" str-default></BaseconfigCURD>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import BaseconfigCURD from '@/components/common/BaseconfigCURD.vue';
export default {
  name: "JiBenXinXi",
  components: {BaseconfigCURD},
  data(){
    return {
      activeName: 'first'
    }
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style scoped>
.JiBenXinXiGuanLi{
//background-color: #ffffff;
}
::v-deep .el-tabs__header{
  background-color: #ffffff;
  margin: 0px;
  border-bottom: none;
}
::v-deep .cell{
  line-height: 25px !important;
}
</style>
