<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.go(-1)"
          >
            返回
          </el-button>
        </el-form-item>
      </el-form>
      <div class="zhanshi-info">
        <el-row>
          <el-col :span="12">
            <div class="info-list">
              <div class="title"><i class="el-icon-s-claim"></i> 概述</div>
              <div class="list-item">
                物品申请处理手机扫码后提交的物品申请请求（点击右边图片翻页查看）
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-document"></i> 物品列表</div>
              <div class="list-item">
                <p>
                  点击“物品列表”，打开申请的物品列表，查看申请物品信息，点击发放填入发放数量即可完成发放
                </p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 结束发放</div>
              <div class="list-item">
                点击“结束发放”按钮，即可将此次申请状态变为已完成发放，可到发放完成记录中查看
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/wupinshenqing1.png')"
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
        require("@/assets/img/shiyong/wupinshenqing1.png"),
        require("@/assets/img/shiyong/wupinshenqing2.png"),
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
