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
    <el-row
      style="
        margin-bottom: 80px;
        padding: 20px;
        border: 1px solid #e8e8e8;
        border-radius: 20px;
      "
    >
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <h2>扫码填报</h2>
              <p class="wzxbj" style="height: 40px">
                扫描二维码可进行一系列填报工作，如单位食堂用餐统计、人员签到、活动报名、信息反馈等，或通过导入Excel创建填报表等。
              </p>
              <div style="background: #fafafa; padding: 20px">
                <el-row>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>单位食堂用餐统计</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>人员签到</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>活动报名</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>信息反馈</h4>
                    </div>
                  </el-col>
                  <el-col :span="4"> </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="30" style="margin-bottom: 80px">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">01. 单位食堂用餐统计</h2>
              <p class="wzxbj-01" style="height: 120px">
                单位食堂想控制成本，只需要扫二维码预约第二天就餐人数，方便后厨统计预约人数备餐，没预约的就不能就餐。食堂根据订餐数量进行食材采购，精准备餐，确保有量有节，既不浪费又满足了用餐者需要，大大节省食堂经营成本。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/dw.jpg" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/dw-01.png" />
              <div style="color: #333; line-height: 30px; text-align: center">
                单位食堂用餐统计<span style="color: #bbb"> - 示例</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">02. 人员签到</h2>
              <p class="wzxbj-01" style="height: 100px">
                单位正在举办一场会议或活动，如何确保每位成员都正常到场？使用扫码签到表单，到达现场才可扫码签到，有效保证活动的正常开展。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/xw.jpg" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/xw-01.png" />
              <div style="color: #333; line-height: 30px; text-align: center">
                人员签到<span style="color: #bbb"> - 示例</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="30" style="margin-bottom: 80px">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">03. 活动报名</h2>
              <p class="wzxbj-01" style="height: 100px">
                支持各类活动报名表单的创建，不管是大型晚会、发布会、志愿活动等还是各种小型聚会，一份表单即可收集您想要的全部信息。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/sq.jpg" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/sq-01.png" />
              <div style="color: #333; line-height: 30px; text-align: center">
                活动报名<span style="color: #bbb"> - 示例</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">04. 信息反馈</h2>
              <p class="wzxbj-01" style="height: 100px">
                单位举办了一个活动如何得知活动效果？创建一份信息反馈收集表单，在线发放并回收，只有了解个人想法，才能让下次活动更加贴合单位的实际需求。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/ch.jpg" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/ch-01.png" />
              <div style="color: #333; line-height: 30px; text-align: center">
                信息反馈<span style="color: #bbb"> - 示例</span>
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
  name: "tianbaozhanshi",
};
</script>

<style scoped>
.lnsmore-nav {
  background: url("../../../assets/img/xbg-01.jpg") no-repeat bottom left;
}
.nav2 {
  background: url("../../../assets/img/xbg-02.jpg") no-repeat bottom left;
}
.nav3 {
  background: url("../../../assets/img/xbg-03.jpg") no-repeat bottom left;
}
.nav4 {
  background: url("../../../assets/img/xbg-04.jpg") no-repeat bottom left;
}
h2 {
  color: #5caaff;
  margin: 10px 0;
  font-weight: normal;
}

.shenhui {
  color: #525252;
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
