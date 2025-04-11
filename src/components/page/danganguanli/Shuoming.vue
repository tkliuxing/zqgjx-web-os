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
                <i class="el-icon-plus"></i> 新建档案管理
              </div>
              <div class="list-item">
                点击“新建功能”按钮，打开新建窗口，填写文档分类、名称等信息保存，可上文档附件。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 编辑功能</div>
              <div class="list-item">
                点击“编辑”按钮，打开编辑窗口，可根据自己的需要编辑调整已经填好的内容。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-full-screen"></i> 查看</div>
              <div class="list-item">
                点击“查看”，打开附件，可查看档案内容以及档案下载。
              </div>
            </div>

            <div class="info-list">
              <div class="title"><i class="el-icon-sort"></i> 文档转移</div>
              <div class="list-item">
                点击“文档转移”，转移到其他部门及存放位置，转移后在文档转移记录中统一进行统计。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-tickets"></i> 文档借出</div>
              <div class="list-item">
                点击“文档借出”，借出到其他部门及人员，可进行预约归还时间填写，借出后在文档借出记录中统一进行统计。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-tickets"></i> 其他信息</div>
              <div class="list-item">
                点击“其他信息”，自定义设置档案分类以及保密等级。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-delete"></i> 删除功能</div>
              <div class="list-item">
                为了方便管理者管理有效数据，通过“删除”功能将无效数据从后台删除。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-reading"></i> 查看示例</div>
              <div class="list-item">
                “查看示例”是个基本功能的展示页面，方便展示“档案管理”这个功能使用，为了让大家更快的了解档案管理所呈现的内容样式，没有实际操作功能。
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/da1.jpg')"
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
        require("@/assets/img/shiyong/da1.jpg"),
        require("@/assets/img/shiyong/da2.jpg"),
        require("@/assets/img/shiyong/da3.jpg"),
        require("@/assets/img/shiyong/da4.jpg"),
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
