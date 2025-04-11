<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item>
          <el-button
              type="info"
              round
              icon="el-icon-arrow-left"
              @click="$router.go(-1)">
            返回
          </el-button>
        </el-form-item>
      </el-form>
      <div class="zhanshi-info">
        <el-row>
          <el-col :span="24">
            <div class="info-list">
              <div class="title"><i class="el-icon-plus"></i> 单位拜访登记</div>
              <div class="list-item">
                打开微信，扫单位来访登记二维码，提交后，会给受访者推送一条消息提示
              </div>
              <div class="img-box">
                <el-image
                    style="width: 200px;padding: 10px"
                    :src="require('@/assets/img/shiyong/laifang.png')"
                    :preview-src-list="[require('@/assets/img/shiyong/laifang.png')]"
                    fit="cover"
                >
                </el-image>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 编辑拜访信息</div>
              <div class="list-item">
                拜访人扫单位来访二维码码后填写拜访信息,也可点击右上角查看拜访历史
              </div>
              <div class="img-box">
                <el-image
                    style="width: 200px;padding: 10px"
                    :src="require('@/assets/img/shiyong/baifang.png')"
                    :preview-src-list="[require('@/assets/img/shiyong/baifang.png')]"
                    fit="cover"
                >
                </el-image>
                <el-image
                    style="width: 200px;padding: 10px"
                    :src="require('@/assets/img/shiyong/baifangjilu.png')"
                    :preview-src-list="[require('@/assets/img/shiyong/baifangjilu.png')]"
                    fit="cover"
                >
                </el-image>
                <el-image
                    style="width: 200px;padding: 10px"
                    :src="require('@/assets/img/shiyong/baifangjilu_xq.png')"
                    :preview-src-list="[require('@/assets/img/shiyong/baifangjilu_xq.png')]"
                    fit="cover"
                >
                </el-image>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-full-screen"></i> 受访者审核</div>
              <div class="list-item">
                受访者接收到消息提示后可查看，拜访详细信息，审核通过后拜访者可通过拜访记录查看入门二维码
              </div>
              <div class="img-box">
                <el-image
                    style="width: 200px;padding: 10px"
                    :src="require('@/assets/img/shiyong/shoufang_sh.png')"
                    :preview-src-list="[require('@/assets/img/shiyong/shoufang_sh.png')]"
                    fit="cover"
                >
                </el-image>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-delete"></i> 门岗入门二维码核验</div>
              <div class="list-item">
                受访者审核通过后拜访者可通过拜访记录查看入门二维码，由门岗扫码进入
              </div>
            </div>
              <div class="img-box">
                <el-image
                    style="width: 200px;padding: 10px"
                    :src="require('@/assets/img/shiyong/baifang_qr.png')"
                    :preview-src-list="[require('@/assets/img/shiyong/baifang_qr.png')]"
                    fit="cover"
                >
                </el-image>
                <el-image
                    style="width: 200px;padding: 10px"
                    :src="require('@/assets/img/shiyong/menggang.png')"
                    :preview-src-list="[require('@/assets/img/shiyong/menggang.png')]"
                    fit="cover"
                >
                </el-image>
              </div>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <div class="img-box">-->
          <!--              <el-image-->
          <!--                :src="require('@/assets/img/shiyong/zhanshi1.jpg')"-->
          <!--                :preview-src-list="srcList"-->
          <!--                fit="cover"-->
          <!--              >-->
          <!--              </el-image>-->
          <!--            </div>-->
          <!--          </el-col>-->
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      laifang_list: [require('@/assets/img/shiyong/laifang.png')],
      srcList: [require('@/assets/img/shiyong/zhanshi1.jpg')],
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
