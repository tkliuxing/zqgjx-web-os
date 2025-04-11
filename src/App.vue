<template>
  <div id="app">
    <!-- <router-view></router-view> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
    
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { USERINFO } from "@/store";
export default {
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    ...mapMutations([USERINFO]),
    async updateUserinfo() {
      if (this.token) {
        try {
          const myinfo = await this.$http.get("/myinfo/");
          this[USERINFO](myinfo.data);
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
  mounted() {
    this.updateUserinfo();
  },
};
</script>
<style>
@import "./assets/css/main.css";
@import "./assets/css/color-light.css"; /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>
