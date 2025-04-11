<template>
<div class="xunjian">
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"/>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
</div>
</template>

<script>
export default {
  name: "xunjian"
}
</script>

<style scoped>

</style>
