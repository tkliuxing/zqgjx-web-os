<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="资产转移记录" name="first">
        <zhuanYi ref="child1"/>
      </el-tab-pane>
      <el-tab-pane label="资产处置记录" name="second">
        <chuZhi ref="child2"/>
      </el-tab-pane>
      <el-tab-pane label="资产报修记录" name="third">
        <weixiu ref="child3"/>
      </el-tab-pane>
      <el-tab-pane label="资产出借记录" name="fourth">
        <chuJie ref="child4"/>
      </el-tab-pane>
      <el-tab-pane label="资产出租记录" name="fifth">
        <chuZu ref="child5"/>
      </el-tab-pane>
      <el-tab-pane label="资产报废记录" name="sixth">
        <baoFei ref="child6"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import zhuanYi from "@/components/page/ZiChan/BianGeng/ZhuanYi.vue";
import chuZhi from "@/components/page/ZiChan/BianGeng/ChuZhi.vue";
import weixiu from "@/components/page/ZiChan/ZiChanWeiXiu.vue";
import chuJie from "@/components/page/ZiChan/BianGeng/ChuJie.vue";
import chuZu from "@/components/page/ZiChan/BianGeng/ChuZu.vue";
import baoFei from "@/components/page/ZiChan/BianGeng/BaoFei.vue";
  export default {
    data(){
      return{
        activeName: 'first'
      }
    },
    components:{
      zhuanYi,
      chuZhi,
      weixiu,
      chuJie,
      chuZu,
      baoFei
    },
    watch:{
      activeName:{
        handler(val) {
          const childRefs = {
            first: 'child1',
            second: 'child2',
            third: 'child3',
            fourth: 'child4',
            fifth: 'child5',
            default: 'child6'
          };
          const refName = childRefs[val] || childRefs.default;
          this.$nextTick(() => {
            this.$refs[refName].loadData();
          });
        },
        deep: true,
        immediate: true
      },
    },
  }
</script>
<style scoped>

</style>