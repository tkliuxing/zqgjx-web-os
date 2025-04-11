<template>
  <div>
    <div class="box">
      <span v-html="shuoming" > </span>
    </div>
    <div class="bottom-button">
       <van-button round block type="info" native-type="submit" @click="back">
         下一页
       </van-button>
    </div>
  </div>
</template>
<script>
import resource from "@/resource";

export default {
  data() {
    return {
      loading: false,
      shuoming: null,
    }
  },
  mounted() {
    let pk = this.$route.query.pk
    this.getInfo(pk)
  },
  methods:{
    back(){
        this.$router.push({
          path: "/tianbaoinfo",
          query: {
            pk: this.$route.query.pk,
          },
        });
    },
    async getInfo(pk){
      this.loading = true;
      try {
        let params = {
          template_id: "FT181649085367160832",
        }
        let resp = await resource.getObj("data", pk, params);
        this.shuoming = resp.sm;  // 说明
      }catch (e) {
        console.log(e)
      }
      this.loading = false;
    }
  }
}
</script>
<style scoped>
.box{
  padding: 10px  12px 40px 12px;
  max-height: calc(100vh - 130px);
  overflow: auto;
}
.bottom-button {
  position: fixed;
  bottom: 10px; /* 距离底部的距离，根据需要调整 */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center; /* 水平居中 */
  padding: 0 50px; /* 可根据需要调整 */
}
</style>