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
                <i class="el-icon-plus"></i> 新增题库(需要先增加题库才可以新增试卷)
              </div>
              <div class="list-item">
                <p>1、新增题库,点击新建题库输入题库名称及描述</p>
                <p>2、新增试题,新建题库列表中点击‘试题管理’新增试卷的题目</p>
                <p>
                  3、题目分为四种类型,选项可根据需要自行增减数量,正确答案请按照选项A、B、C、D...格式填写
                </p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-plus"></i> 新建试卷</div>
              <div class="list-item">
                <p>1、新建试卷,点击左上角试卷进行新建</p>
                <p>2、可自定义主题颜色或者上传主题图片,图片可在移动端首页显示</p>
                <p>
                  3、试卷名称及选择题库为必填选项,选择题库从已建好的题库中选择,出题方式分为题库中所有题目及随机挑选题目两种,随机出题需要定义各题目类型数量
                </p>
                <p>
                  4、统计结果中进行判卷，可查看相应得分
                </p>
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
              <div class="list-item">点击“二维码”，可用微信扫一扫功能进行答题。</div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-delete"></i> 删除功能</div>
              <div class="list-item">
                为了方便管理者管理有效数据，通过“删除”功能删除无效数据。
              </div>
            </div>
            <!-- <div class="info-list">
              <div class="title"><i class="el-icon-picture-outline"></i> 查看示例</div>
              <div class="list-item">
                “查看示例”是个基本功能的展示页面，方便展示“扫码答题考试”功能，为了让大家更快的了解扫码答题考试所呈现的内容样式，没有实际操作功能。
              </div>
            </div> -->
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/kaoshi1.jpg')"
                :preview-src-list="srcList"
                fit="cover"
              >
              </el-image>
            </div>
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/kaoshi1-1.jpg')"
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
      srcList: [
        require("@/assets/img/shiyong/kaoshi1.jpg"),
        require("@/assets/img/shiyong/kaoshi1-1.jpg"),
        // require("@/assets/img/shiyong/kaoshi3.jpg"),
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
