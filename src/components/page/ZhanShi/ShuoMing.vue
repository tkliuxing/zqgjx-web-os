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
          <el-col :span="12">
            <div class="info-list">
              <div class="title"><i class="el-icon-plus"></i> 新建功能</div>
              <div class="list-item">
                点击“新建内容”按钮，打开新建窗口，填写对应信息，文本编辑器可编辑文字、图片和视频内容，排版方式自定义即可。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 编辑功能</div>
              <div class="list-item">
                点击“编辑”按钮，打开编辑窗口，可根据自己的需要编辑调整已经填好的内容。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-full-screen"></i> 二维码识别</div>
              <div class="list-item">
                点击“二维码”，可用微信扫一扫功能进行查看后台填写的内容。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-delete"></i> 删除功能</div>
              <div class="list-item">
                为了方便管理者管理有效数据，通过“删除”功能将无效数据从后台删除。
              </div>
            </div>
             <div class="info-list">
              <div class="title"><i class="el-icon-picture-outline"></i> 查看示例</div>
              <div class="list-item">
                “查看示例”是个基本功能的展示页面，方便展示“扫码展示”这个功能使用，为了让大家更快的了解扫码展示所呈现的内容样式，没有实际操作功能。
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/zhanshi1.jpg')"
                :preview-src-list="srcList"
                fit="cover"
              >
              </el-image>
            </div>
          </el-col>
        </el-row>
      </div>

    </el-card>
    <goumaishuoming />
  </div>
</template>

<script>
import goumaishuoming from "@/components/common/goumaishuoming.vue";
export default {
  data() {
    return {
      srcList: [require('@/assets/img/shiyong/zhanshi1.jpg')],
    };
  },
  components: {
    goumaishuoming,
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
