<template>
  <div class="JiBenXinXiGuanLi">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="最高学历字段" name="first">
        <BaseconfigCURD category-name="人力-最高学历字段" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="职称字段" name="second">
        <BaseconfigCURD category-name="人力-职称字段" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="聘任岗位（职务）" name="third">
        <BaseconfigCURD category-name="人力-职务字段" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="婚姻状况" name="fourth">
        <BaseconfigCURD category-name="人力-婚姻状况" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="民族字段" name="mingzu">
        <BaseconfigCURD category-name="人力-民族字段" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="实配职数" name="shipeizhishu">
        <BaseconfigCURD category-name="人力-实配职数" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="政治面貌" name="dangpai">
        <BaseconfigCURD category-name="人力-所属党派" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="行政职务" name="xingzhengzhiwu">
        <BaseconfigCURD category-name="人力-行政职务" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="附件类型" name="fujianleixing">
        <BaseconfigCURD category-name="人力-附件类型" str-default></BaseconfigCURD>
      </el-tab-pane>
      <el-tab-pane label="聘用方式" name="pinyongfangshi">
        <BaseconfigCURD category-name="人力-聘用方式" str-default></BaseconfigCURD>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import BaseconfigCURD from '@/components/common/BaseconfigCURD.vue';
  export default {
    name: "JiBenXinXiGuanLi",
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
