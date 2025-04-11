<template>
  <div>
    <el-card style="margin-top: 10px">
      <div class="zhanshi-info">
        <el-row>
          <el-col :span="12" style="padding: 0 20px">
            <div class="info-list">
              <div class="title"><i class="el-icon-user"></i> 如您在使用我们软件时遇到任何问题或需求，可随时与我们进行联系。</div>

              <p class="title-item">我们为您提供：</p>
              <p class="title-item">①软件购买服务</p>
              <p class="title-item">②软件租用服务</p>
              <p class="title-item">③数据管理服务</p>
              <p class="title-item">④技术咨询服务</p>
              <p class="title-item">可咨询时间：周一 ~ 周五 9:00-18:00</p>
              <p class="title-item">联系电话：400-1369080</p>
              <p class="title-item">服务微信：扫码添加微信进行咨询</p>
              <img src="@/assets/img/shili/lianxiwomen.jpg"/>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
    }
  }
}
</script>
<style scoped>
.info-list {
  margin-bottom: 10px;
  background: #fafafa;
  padding: 15px 0px 10px 10px;
  border-radius: 5px;
}
.info-list .title {
  color: #333;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.info-list .list-item {
  color: #666;
  font-size: 14px;
  margin-top: 10px;
}
.title-item{
  color: #666;
  font-size: 14px;
  margin-top: 5px;
}
</style>