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
                物品领用明细记录了发放完成的物品中使用方式为借用的物品申请记录
              </div>
            </div>
            <div class="info-list">
              <div class="title"><i class="el-icon-document"></i> 查询条件</div>
              <div class="list-item">
                <p>
                  1、物品类别：根据物品所属类别查询这一类下物品的发放记录
                </p>
                <p>
                  2、物品名称：根据物品名称查询这个物品的发放记录
                </p>
                <p>
                  3、部门：根据部门名称查询查询部门中领用的所有物品记录
                </p>
                <p>
                  4、领用人：根据领用人名称查询这个人领用的所有物品记录
                </p>
                <p>
                  5、开始时间 ~ 结束时间：发放时间按范围段查询
                </p>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="img-box">
              <el-image
                :src="require('@/assets/img/shiyong/wupinjymx.jpg')"
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
      srcList: [require("@/assets/img/shiyong/wupinjymx.jpg")],
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
