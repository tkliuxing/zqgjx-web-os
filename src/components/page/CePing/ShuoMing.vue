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
              <div class="title">
                <i class="el-icon-plus"></i> 新增测评
              </div>
              <div class="list-item">
                <p>1、新增测评,测评名称为必填选项</p>
                <p>2、可自定义主题颜色或者上传主题图片,图片可在移动端首页显示</p>
                <p>3、被测评对象下载Excel模版进行填写后上传到表单中</p>
                <p>4、可限制测评提交数量,0为不限数量</p>
                <p>5、可自定义测评选项内容及数量</p>
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
              <div class="list-item">点击“二维码”，可用微信扫一扫功能进行测评。</div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-tickets"></i> 统计结果</div>
              <div class="list-item">
                “统计结果”功能就是为了方便管理者对本次测评结果进行查看和统计
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-delete"></i> 删除功能</div>
              <div class="list-item">
                为了方便管理者管理有效数据，通过“删除”功能将无效数据从后台删除。
              </div>
            </div>
            <!-- <div class="info-list">
              <div class="title"><i class="el-icon-picture-outline"></i> 查看示例</div>
              <div class="list-item">
                “查看示例”是个基本功能的展示页面，方便展示“扫码考评”这个功能使用，为了让大家更快的了解扫码考评所呈现的内容样式，没有实际操作功能。
              </div>
            </div> -->
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/ceping1.jpg')"
                :preview-src-list="srcList"
                fit="cover"
              >
              </el-image>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <goumaishuoming/>
  </div>
</template>

<script>
import goumaishuoming from "@/components/common/goumaishuoming.vue";
export default {
  data() {
    return {
      srcList: [
        require("@/assets/img/shiyong/ceping1.jpg"),
        require("@/assets/img/shiyong/ceping2.jpg")
      ],
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
