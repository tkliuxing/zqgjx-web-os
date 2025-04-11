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
                <i class="el-icon-plus"></i> 地图切换
              </div>
              <div class="list-item">
                点击页面左上角“地图切换：普通地图、自定义地图”按钮，可切换地图类型，普通地图和自定义地图，默认为普通地图，自定义地图为echart地图。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-edit"></i> 编辑图层管理功能</div>
              <div class="list-item">
                点击地图右侧图层管理窗口，点击“编辑”按钮，打开编辑窗口，可根据自己的需要编辑调整已经填好的内容。
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-full-screen"></i> 图层管理</div>
              <div class="list-item">
                进入图层管理中管理步骤：
                <div style="text-indent: 2em">
                  <p class="title-item">① 新建一个自定义图层，点击“新建图层”按钮，弹出新建图层窗口，填写图层名称，点击“确定”，即可完成图层类型新建。</p>
                  <p class="title-item">② 点击“编辑模板”按钮，弹出编辑窗口，编辑模版，定义自定义模板内容，设置显示数据定位类型，可对已经填好的内容进行编辑，可对内容进行增删。</p>
                  <p class="title-item">③ 点击“自定义数据”按钮，弹出编辑窗口，跟据自定义模板内容填写数据信息并且设置数据点定位，点定位类型由模版决定，可对已经填好的内容进行编辑，可对内容进行增删。</p>
                </div>

              </div>
            </div>

            <div class="info-list">
              <div class="title"><i class="el-icon-sort"></i> 图层预览</div>
              <div class="list-item">
                点击“右侧图层列表”按钮，tab标签预览相应图层内容，如点击多边形，则显示多边形定义的多边形图层，列表中定位点数据为绑定的定位点，复选款选中的数据显示，默认为显示，取消勾选则不显示。
              </div>
            </div>

          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/maps/da1.png')"
                :preview-src-list="srcList"
                fit="cover"
              >
              </el-image>
              <el-image
                :src="require('@/assets/img/shiyong/maps/da0.png')"
                :preview-src-list="srcList"
                fit="cover"
              >
              </el-image>
              <el-image
                :src="require('@/assets/img/shiyong/maps/da2.png')"
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
        require("@/assets/img/shiyong/maps/da1.png"),
        require("@/assets/img/shiyong/maps/da0.png"),
        require("@/assets/img/shiyong/maps/da2.png"),
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
