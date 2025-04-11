<template>
  <div class="record">
    <jlitem :datijilu="timu_list" @back='back'></jlitem>
  </div>
</template>

<script>
import Jlitem from "../../page/ShiJuanInfo/components/Jlitem.vue"
export default {
  data() {
    return {
      id: null,
      ktitem:[]
    };
  },
  components: {
    Jlitem,
  },
  created() {
    this.timu_list = JSON.parse(localStorage.getItem("datiinfo"));
  },
  methods:{
      back(pk){
        this.$router.replace({
          path: `/shijuaninfo?pk=${pk}`,
        })
      }
  },
};
</script>

<style scoped>
.record{
    padding:20px;
    max-width:640px;
    margin:0 auto;
    position:relative;
}
</style>
