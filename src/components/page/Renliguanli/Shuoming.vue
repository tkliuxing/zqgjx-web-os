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
                <i class="el-icon-plus"></i> 新建员工
              </div>
              <div class="list-item">
                点击“新建功能”按钮，打开新建窗口，填写员工信息，展示员工信息统计列表。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-plus"></i> 新建部门</div>
              <div class="list-item">
                点击“新建功能”按钮，打开新建窗口，填写部门信息，添加部门相关用户，以做登录账号。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 编辑功能</div>
              <div class="list-item">
                点击“编辑”按钮，打开编辑窗口，可更改表单信息内容。
              </div>
            </div>

            <div class="info-list">
              <div class="title"><i class="el-icon-tickets"></i> 查看</div>
              <div class="list-item">
                点击“查看”，打开员工信息页面，不可进行内容更改。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-setting"></i> 基本信息管理</div>
              <div class="list-item">
                自定义配置表单信息选项，例如：最高学历字段、职称字段、聘任岗位（职务）等。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-delete"></i> 删除功能</div>
              <div class="list-item">
                为了方便管理者管理有效数据，通过“删除”功能将无效数据从后台删除。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-view"></i> 查看示例</div>
              <div class="list-item">
                “查看示例”是个基本功能的展示页面，方便展示“人力管理”这个功能使用，为了让大家更快的了解人力管理所呈现的内容样式，没有实际操作功能。
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/rl1.jpg')"
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
        require("@/assets/img/shiyong/rl1.jpg"),
        require("@/assets/img/shiyong/rl2.jpg")
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
