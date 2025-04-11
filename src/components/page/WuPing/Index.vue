<template>
<div class="wenjuan">
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"/>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
</div>
</template>

<script>
export default {
  name: "WuPing"
}
</script>

<style scoped>

</style>
