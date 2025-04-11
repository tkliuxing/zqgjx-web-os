<template>
  <div id="blank">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: "system"
  }
</script>

<style scoped>
.blank{
  padding-top:8px;
}
</style>
