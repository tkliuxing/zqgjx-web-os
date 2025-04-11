<template>
  <el-card style="padding: 34px">
    <el-button
      type="info"
      round
      icon="el-icon-arrow-left"
      style="margin-bottom: 15px"
      @click="$router.go(-1);"
    >
      返回
    </el-button>
    <el-row :gutter="30" style="margin-bottom: 80px">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">01. 督办事件</h2>
              <p class="wzxbj-01" style="height: 100px">
                支持各级领导通过系统手动录入督办事件，指定部门或指定人员进行任务分配，指定人员在办完事后填写处理过程和结果，方便领导对督办事件进行统计跟踪。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/duban1.jpg" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/dubanshili1.jpg" />
              <div style="color: #333; line-height: 30px; text-align: center">
                督办事件<span style="color: #bbb"> - 示例</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">02. 任务统计</h2>
              <p class="wzxbj-01" style="height: 100px">
                统计督办任务的待办、已办以及个人发起督办事件。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/duban2.jpg" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/dubanshili2.jpg" />
              <div style="color: #333; line-height: 30px; text-align: center">
                任务统计<span style="color: #bbb"> - 示例</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "saomaxunjian",
};
</script>

<style scoped>
.lnsmore-nav {
  background: url("../../../../assets/img/xbg-01.jpg") no-repeat bottom left;
}
.nav2 {
  background: url("../../../../assets/img/xbg-02.jpg") no-repeat bottom left;
}
.nav3 {
  background: url("../../../../assets/img/xbg-03.jpg") no-repeat bottom left;
}
.nav4 {
  background: url("../../../../assets/img/xbg-04.jpg") no-repeat bottom left;
}
h2 {
  color: #5caaff;
  margin: 10px 0;
  font-weight: normal;
}

.shenhui {
  color: #525252;
}

p {
}

.wzxbj {
  margin-bottom: 60px;
  line-height: 30px;
  margin: 6px 0 6px 0;
  color: #666;
  letter-spacing: 1px;
  font-size: 18px;
  height: 220px;
  text-align: justify;
}
.wzxbj-01 {
  margin: 6px 0 6px 36px;
  margin-bottom: 60px;
  line-height: 30px;
  color: #666;
  letter-spacing: 1px;
  font-size: 18px;
  height: 220px;
  text-align: justify;
}

.xiaozi {
  font-size: 14px;
  color: #409eff;
  line-height: 20px;
}
H3 {
  color: #ffb010;
  font-weight: normal;
}
.img-center {
  text-align: center;
}
</style>
