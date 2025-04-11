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
                <i class="el-icon-plus"></i> 新增单行填报
              </div>
              <div class="list-item">
                <p>1、新增单行填报,表单名称为必填选项</p>
                <p>2、基本配置，填报可选择是否重复填报,如果选择重复填报则可以选择6种填报周期(如选择自然日重复填报,则每日最多重复填报3次,每次可配置重复填报的时间段)</p>
                <p>3、选项配置，可编辑填报选项,可自定义填报的选项名称和选项类型,选项类型分为输入框和选项框,可配置该选项是否为必填选项</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title">
                <i class="el-icon-plus"></i> 新增表格填报
              </div>
              <div class="list-item">
                <p>1、新增表格填报,表单名称为必填选项</p>
                <p>2、基本配置，设置是否开启多行统计（设置后不可更改）</p>
                <p>3、选项配置,可自定义添加表格的选项列与表格的行选项,最终结果以表格的形式显示</p>
                <p>4、信息填报,根据表单相关配置进行填报信息</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title">
                <i class="el-icon-plus"></i> 新增Excel填报
              </div>
              <div class="list-item">
                <p>1、新增表格填报,标题为必填选项</p>
                <p>2、Excel为可编辑的表格,用户可根据上传的表格进行填报</p>
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
              <div class="list-item">点击“二维码”，可用微信扫一扫功能进行提交测试。</div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-tickets"></i> 结果</div>
              <div class="list-item">
                "结果"功能旨在方便管理者查看、统计和导出本次填报的结果。
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
                “查看示例”是个基本功能的展示页面，方便展示“扫码填报”这个功能使用的，为了让大家更快的了解扫码填报所呈现的内容样式，没有实际操作功能。
              </div>
            </div> -->
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/tianbao1.jpg')"
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
        require("@/assets/img/shiyong/tianbao1.jpg"),
        require("@/assets/img/shiyong/tianbao2.jpg"),
        require("@/assets/img/shiyong/tianbao3.jpg"),
        require("@/assets/img/shiyong/tianbao4.jpg")
      ],
    };
  },
  components: {
    goumaishuoming
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
