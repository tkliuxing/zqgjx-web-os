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
                <i class="el-icon-plus"></i> 新建盘点
              </div>
              <div class="list-item">
                <p>点击“新建盘点”，打开添加窗口，添加盘点任务信息</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 编辑功能</div>
              <div class="list-item">
                点击“编辑”按钮，打开编辑窗口，可根据自己的需要编辑调整已经填好的盘点任务信息。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-document-checked"></i> 盘点资产</div>
              <div class="list-item">
                <p>1、点击“盘点资产”，进入盘点资产页</p>
                <p>2、进入盘点资产页可按资产分类，使用部门分类查找资产信息</p>
                <p>3、可全选或勾选部分资产添加到盘点列表</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-document "></i> 盘点结果</div>
              <div class="list-item">
                <p>1、通过二维码扫一扫进行资产盘点</p>
                <p>2、点击“盘点结果”，进入盘点结果统计页</p>
                <p>3、可查看已盘点或未盘点的资产信息，可分别导出对应的列表</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-delete"></i> 删除功能</div>
              <div class="list-item">
                方便管理者管理有效数据，通过“删除”功能将无效数据从后台删除。
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/pandian1.jpg')"
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
        require("@/assets/img/shiyong/pandian1.jpg"),
        require("@/assets/img/shiyong/pandian2.jpg"),
        require("@/assets/img/shiyong/pandian3.jpg")
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
