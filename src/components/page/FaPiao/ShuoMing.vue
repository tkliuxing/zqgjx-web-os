<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.go(-1);"
          >
            返回
          </el-button>
        </el-form-item>
      </el-form>
      <div class="zhanshi-info">
        <el-row>
          <el-col :span="12">
            <div class="info-list">
              <div class="title"><i class="el-icon-full-screen"></i> 扫码进入小程序</div>
              <div class="list-item">微信扫描右侧图片中二维码进入小程序‘汇鑫发票助手’</div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-user"></i> 登录小程序</div>
              <div class="list-item">填写账号密码登录小程序</div>
            </div>
            <div class="info-list">
              <div class="title">
                <i class="el-icon-tickets"></i> 发票核验
              </div>
              <div class="list-item">
                <p>1、在小程序中点击扫描发票二维码通过扫描发票上二维码进行核验</p>
                <p>2、如无法扫码,可以手动输入发票信息进行核验</p>
                <p>3、点击发票总汇可以查看全部发票汇总信息,可按照人员与部门筛选</p>
                <p>4、点击报销记录查看人员或者部门的报销记录</p>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/fapiao1.jpg')"
                :preview-src-list="srcList"
                fit="cover"
              >
              </el-image>
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
      srcList: [
        require("@/assets/img/shiyong/fapiao1.jpg")
      ],
    };
  },
};
</script>

<style scoped>
.zhanshi-info img {
  max-width: 100%;
}
.info-list {
  margin-bottom: 10px;
  background: #fafafa;
  padding: 15px 10px;
  border-radius: 5px;
}
.info-list .title {
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

.info-list .list-item {
  color: #666;
  font-size: 14px;
  margin-top: 10px;
}
.info-list .list-item p {
  margin-top: 5px;
}
.info-list .list-item span {
  color: #409eff;
  cursor: pointer;
}
.el-col {
  padding: 0 20px;
}
.img-box {
  max-width: 100%;
}
</style>
