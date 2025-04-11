<template>
    <div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
export default {
  data(){
    return{

    }
  },
}
</script>



<style scoped>

</style>