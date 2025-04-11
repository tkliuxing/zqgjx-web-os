<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 40px; margin: 0 0 0 15px" >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in tagsList" :key="item">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tagsList: []
      }
    },
    methods: {
      // 设置标签
      setTags(route) {
        const isExist = this.tagsList.some(item => {
          return item.path === route.fullPath;
        })
        if (!isExist) {
          this.tagsList = [];
          for (let i = 1; i < route.matched.length; i++) {
            this.tagsList.push(route.matched[i].meta.title)
          }
        }
      }
    },
    watch: {
      $route(newValue, oldValue) {
        this.setTags(newValue);
      }
    },
    created() {
      this.setTags(this.$route);
    }
  }

</script>


<style>

</style>

