<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
        <el-backtop target=".content"></el-backtop>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vTags from "./Tags.vue";
import bus from "../utils/bus";
export default {
  data() {
    return {
      tagsList: [],
      collapse: true,
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags,
  },
  created() {
    bus.$on("collapse-content", (msg) => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", (msg) => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
    watch:{
        $route(to,from){
            // console.log(from.name) // 从哪来
            // console.log(to.name) // 到哪去
            if(to.name == 'nav'){
                this.isShow = false;
                this.collapse = true;
            }else {
                this.isShow = true;
                this.collapse = false;
            }
            // this.isActive = to.name;
            // this.$refs.sidebar.scrollTop = this.$refs.sidebar.scrollHeight
            // if(to.name.indexOf('zichan') > -1 || to.name.indexOf('item') > -1 || to.name.indexOf('wp') > -1){
            //     this.$refs.sidebar.scrollTop = this.$refs.sidebar.scrollHeight
            // }
        }
    }
};
</script>
