<template>
  <div class="record">
    <div class="bg" :style="{background:color}"></div>
    <jlitem :ktitem="stinfo.timu_list" @back='back'></jlitem>
  </div>
</template>

<script>
import Jlitem from "@/components/Jlitem";
import { mapState } from "vuex";
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
  methods:{
      back(){
          this.$router.replace('/ksindex')
      }
  },
  computed:{
    ...mapState(["stinfo","color"])
  }
};
</script>

<style scoped>
.record{
    padding:20px;
    max-width:640px;
    margin:0 auto;
    position:relative;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  height:300px;
  width:100%;
  background-image: linear-gradient(#f52020, #e83e3e);
  border-radius:0 0 50% 50%;
}
</style>
