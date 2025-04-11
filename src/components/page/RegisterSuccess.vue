<template>
  <div class="bac">
    <div class="registerSuccess">
      <img src="../../assets/img/success.jpg"/>
      <div class="word">
        您已成功注册<br/><br/>即将跳转到首页！
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "registerSuccess",
    mounted() {
      setTimeout(()=>{
        this.$router.replace({name: 'dashboard'});
      }, 2000);
    }
  }
</script>

<style scoped>
  body .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .bac {
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
  }

  .registerSuccess img {
    width: 60px;
    height: 60px;
    margin-bottom: 40px;
  }

  .registerSuccess {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 800px;
    height: 400px;
    margin: -190px 0 0 -400px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 1.0);
  }

  .word {
    font-size: 20px;
    margin-top: 30px;
  }
</style>
