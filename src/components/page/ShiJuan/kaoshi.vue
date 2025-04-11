<template>
<div class="kaoshi">
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"/>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
</div>
</template>

<script>
export default {
  name: "kaoshi"
}
</script>

<style scoped>

</style>
