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
              <div class="title"><i class="el-icon-s-claim"></i> 概述</div>
              <div class="list-item">
                物品领用借用报表记录了发放完成的物品中每个物品中各有哪些部门领用、借用，领用、借用的数量为多少，合计为多少
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-document"></i> 查询条件</div>
              <div class="list-item">
                <p>
                  1、开始日期
                  ~结束日期：默认为当月，查询某个时间段内物品各部门领用数量
                </p>
                <p>
                  2、领用、借用查询：点击领用借用表头选择要查看的类别，点击筛选即可筛选数据
                </p>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/wupinlyreport.png')"
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
      srcList: [require("@/assets/img/shiyong/wupinlyreport.png")],
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
