<template>
  <div class="box">

    <tbbb :is-data="dangpai"></tbbb>
    <tbbb :is-data="bumenrenshu"></tbbb>
    <tbbb :is-data="xueli"></tbbb>
    <tbbb :is-data="nanv"></tbbb>
    <tbbb :is-data="zhicheng"></tbbb>
    <tbbb :is-data="nianling"></tbbb>
    <tbbb :is-data="minzu"></tbbb>
  </div>
</template>
<script>
import TuBiaoBaoBiao from "@/components/TuBiaoBaoBiao/index.vue";
import resource, {getList, createObj, getObj, updateObj, deleteObj, getObjFromList,patchObj} from "@/resource";

export default {
  data() {
    return {
      loading: false,
      dangpai: null,
      bumenrenshu: null,
      xueli: null,
      nanv: null,
      zhicheng: null,
      nianling: null,
      minzu: null,
    };
  },
  async created() {
    await this.loadData()
  },
  components: {
    tbbb: TuBiaoBaoBiao,
  },
  methods: {
    async loadData() {
      this.loading = true;
      // 政治面貌人数
      let resps = await resource.getList("formdatareport/12007")
      this.dangpai = resps;
      // 每部门人数
      let resp = await resource.getList("formdatareport/12001")
      this.bumenrenshu = resp;
      // 学历情况
      let resp1 = await resource.getList("formdatareport/12002")
      this.xueli = resp1;
      // 男女比例
      let resp2 = await resource.getList("formdatareport/12003")
      this.nanv = resp2;
      // 职称情况
      let resp3 = await resource.getList("formdatareport/12004")
      this.zhicheng = resp3;
      //年龄情况
      let resp4 = await resource.getList("formdatareport/12005")
      this.nianling = resp4;
      // 民族情况
      let resp5 = await resource.getList("formdatareport/12006")
      this.minzu = resp5;
      this.loading = false;
    }
  }
}
</script>
<style scoped lang="scss">
.box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>