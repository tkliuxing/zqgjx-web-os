<template>
<div class="tianbao">
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"/>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
</div>
</template>

<script>
export default {
  name: "tianbao"
}
</script>

<style scoped>

</style>