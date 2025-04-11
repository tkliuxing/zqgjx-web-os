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
              <div class="title"><i class="el-icon-plus"></i> 新建物品管理</div>
              <div class="list-item">
                <p>点击“新建物品管理”，打开添加窗口，填入物品名称即可创建物品</p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 编辑功能</div>
              <div class="list-item">
                点击“编辑”按钮，打开编辑窗口，可根据自己的需要编辑调整已经填好的物品名称。
              </div>
            </div>
            <div class="info-list">
              <div class="title">
                <i class="el-icon-full-screen"></i> 二维码识别
              </div>
              <div class="list-item">
                点击“二维码”，可用手机扫一扫登陆以后查看这个类别下的物品信息列表用来申请物品
              </div>
            </div>
            <div class="info-list">
              <div class="title">
                <i class="el-icon-document"></i> 新建子物品
              </div>
              <div class="list-item">
                点击“新建子物品”，填入物品名称可新增对应物品下的子物品
              </div>
            </div>
            <div class="info-list">
              <div class="title">
                <i class="el-icon-folder-add"></i> 物品登记
              </div>
              <div class="list-item">
                <p>
                  点击“物品登记”，在对应类别下新增物品，通过扫这个类别的二维码即可查看新增的物品
                </p>
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-delete"></i> 删除功能</div>
              <div class="list-item">
                为了方便管理者管理有效数据，通过“删除”功能将无效数据从后台删除。
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/wupin.jpg')"
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
        require("@/assets/img/shiyong/wupin.jpg"),
        require("@/assets/img/shiyong/wupindengji.jpg"),
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
