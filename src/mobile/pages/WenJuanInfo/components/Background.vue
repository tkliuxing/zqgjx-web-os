<template>
  <div class="background">
    <div class="bg-img" v-if="background"><img :src="background" mode="widthFix" /></div>
    <div class="bg" :style="{background:color}" v-else></div>
  </div>
</template>

<script>
export default {
  props: {
    background: {
      type: String,
      default: "",
    },
    color:{
      type:String,
      default:"#e41e1e"
    }
  },
};
</script>

<style scoped>
.bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 300px;
  width: 100%;
  border-radius: 0 0 50% 50%;
}
.bg-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.bg-img img {
  width: 100%;
}
</style>
