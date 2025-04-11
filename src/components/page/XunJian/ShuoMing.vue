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
                <i class="el-icon-plus"></i> 新增巡检
              </div>
              <div class="list-item">
                <p>1、新增巡检项目</p>
                <p>2、巡检列表中添加可巡检的任务,填写巡检任务名称,可手动填写可巡检的项目</p>
                <p>3、每天巡检任务可配置巡检周期,共6个巡检周期选项</p>
                <p>4、巡检任务新建可配置巡检的地点,如果在该范围内才可以进行巡检</p>
                <p>5、每条巡检点任务可快捷复制新建</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 编辑功能</div>
              <div class="list-item">
                点击“编辑”按钮，打开编辑窗口，可根据自己的需要编辑调整已经填好的内容
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-tickets"></i> 巡检点管理</div>
              <div class="list-item">
                <p>1、点击“巡检点管理”，用来管理巡检列表</p>
                <p>2、点击“二维码”扫一扫，可进行巡检信息填报</p>
              </div>
            </div>

            <div class="info-list">
              <div class="title"><i class="el-icon-tickets"></i> 巡检记录</div>
              <div class="list-item">
                “巡检记录”功能就是为了方便管理者对该项目查看巡检记录。
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
                “查看示例”是个基本功能的展示页面，方便展示“扫码巡检”这个功能使用的，为了让大家更快的了解扫码巡检所呈现的内容样式，没有实际操作功能。
              </div>
            </div> -->
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/xunjian1.jpg')"
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
        require("@/assets/img/shiyong/xunjian1.jpg"),
        require("@/assets/img/shiyong/xunjian2.jpg")
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
