<template>
  <div id="app">
    <transition :name="direction">
    <keep-alive :include="keepAlives">
      <router-view class="appView"></router-view>
    </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return {
      direction: 'slide-right',
      keepAlives: ['Home', 'RenYuan', 'FeiYong', 'GongShiFeiYongSub', 'XianYouXiTong',],
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      // if (to.path === "/home") {
      //   this.direction = "slide-right";
      // } else if (from.path === "/home") {
      //   this.direction = "slide-left";
      // }else{
      //   this.direction = toDepth < fromDepth ? "slide-right" : "slide-left";
      // }
    }
  }
}
</script>

<style>
body{
  background-color: #f7f8fa;
}
html, body, #app, .wrapper{
  background-color: #f7f8fa;
  height: 100%;
  width: 100%;
}
</style>
