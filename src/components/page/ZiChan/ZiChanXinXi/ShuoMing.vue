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
                <i class="el-icon-plus"></i> 添加资产
              </div>
              <div class="list-item">
                <p>点击“添加资产”，打开添加窗口，根据资产实际信息添加资产内容</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 编辑功能</div>
              <div class="list-item">
                点击“编辑”按钮，打开编辑窗口，可根据自己的需要编辑调整已经填好的资产内容。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-full-screen"></i> 二维码识别</div>
              <div class="list-item">点击“二维码”，可用微信扫一扫查看资产信息列表</div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-document "></i> 详情</div>
              <div class="list-item">点击“详情”，可查看完整资产信息</div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-scissors"></i> 报修</div>
              <div class="list-item">
                <p>1、点击“报修”，可新建报修单，填写报修人，联系方式，报修原因</p>
                <p>2、生成报修单后可在资产维修页查看报修信息列表</p>
              </div>
            </div>
             <div class="info-list">
              <div class="title"><i class="el-icon-position"></i> 转移</div>
              <div class="list-item">
                <p>1、点击“转移”，可新建转移单，填写转入单位、转入人员、经办人员等信息</p>
                <p>2、生成转移单后可在资产变更记录转移记录中查看转移信息</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit-outline"></i> 处置</div>
              <div class="list-item">
                <p>1、点击“处置”，可新建处置单，填写处置原因、处置方式、处置费用等信息</p>
                <p>2、生成处置单后可在资产变更记录处置记录中查看处置信息</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-delete"></i> 删除功能</div>
              <div class="list-item">
                “删除”功能就是为了方便管理者使用，将一些不必要的数据直接从后台删除。
              </div>
            </div>
            <!-- <div class="info-list">
              <div class="title"><i class="el-icon-picture-outline"></i> 查看示例</div>
              <div class="list-item">
                “查看示例”是个基本功能的展示页面，方便展示“扫码展示”这个功能使用的，为了让大家更快的了解扫码展示所呈现的内容的样式所用，没有实际操作功能。
              </div>
            </div> -->
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/zichan.jpg')"
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
        require("@/assets/img/shiyong/zichan.jpg"),
        require("@/assets/img/shiyong/zichan1.jpg"),
        require("@/assets/img/shiyong/zichan2.jpg")
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
