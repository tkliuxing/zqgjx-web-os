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
        <el-row :gutter="160" style="margin-bottom: 80px">
            <el-col :span="12">
                <div class="grid-content bg-purple lnsmore-nav">
                    <el-row>
                        <el-col :span="16">
                            <h2>概 况</h2>
                            <p class="wzxbj">帮您对一个单位团体或工程项目做文字性的介绍。</p>
                            <div style="text-align: right; padding-right: 30px">
                                <img src="@/assets/img/shili/gaikuang.jpg"/>
                                <p class="xiaozi">※ 扫码查看示例</p>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <img src="@/assets/img/shili/gaikuang.png"/>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple lnsmore-nav nav2">
                    <el-row>
                        <el-col :span="16">
                            <h2>通知公告</h2>
                            <p class="wzxbj">
                                针对团体或部分成员，以通知公告的形式向大家公布某一件事情，让大家随时可查看此信息，使工作效率得到有效提升。
                            </p>
                            <div style="text-align: right; padding-right: 30px">
                                <img src="@/assets/img/shili/tongzhi.jpg"/>
                                <p class="xiaozi">※ 扫码查看示例</p>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <img src="@/assets/img/shili/tongzhi.png"/>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="160">
            <el-col :span="12">
                <div class="grid-content bg-purple lnsmore-nav nav3">
                    <el-row>
                        <el-col :span="16">
                            <h2>团队成员</h2>
                            <p class="wzxbj">
                                可以对团队整体或团队里的每位成员进行介绍，可以用文字形式、图片形式或图文混排的形式进行人员的信息展示。
                            </p>
                            <div style="text-align: right; padding-right: 30px">
                                <img src="@/assets/img/shili/tuandui.jpg"/>
                                <p class="xiaozi">※ 扫码查看示例</p>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <img src="@/assets/img/shili/tuandui.png"/>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple lnsmore-nav nav4">
                    <el-row>
                        <el-col :span="16">
                            <h2>服务流程</h2>
                            <p class="wzxbj">
                                是对某项服务内容或流程不清楚的外来办事人员进行图示引导，方便办事人可以顺利进行办事，无需在办事流程上浪费太多时间与精力，可大大提高整体办事效率。
                            </p>
                            <div style="text-align: right; padding-right: 30px">
                                <img src="@/assets/img/shili/liucheng.jpg"/>
                                <p class="xiaozi">※ 扫码查看示例</p>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <img src="@/assets/img/shili/liucheng.png"/>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple lnsmore-nav nav5">
              <el-row>
                <el-col :span="16">
                  <h2>政策“一本通”</h2>
                  <p class="wzxbj">
                    为进一步提升干部群众对惠民政策的知晓度、熟悉度，加强单位之间惠民政策信息互通，五原县把“推动惠民政策应享尽享”作为关键抓手，汇编形成《“十年一本账 幸福感党恩”——惠民政策“一本通”》，旨在让《一本通》成为群众政策知晓“明白卡”、干部答复咨询“指导书”、单位互通了解“信息册”、纪检监察机关监督检查“对账本”。
                  </p>
                  <div style="text-align: right; padding-right: 30px">
                    <img src="@/assets/img/shili/zhengce.jpg"/>
                    <p class="xiaozi">※ 扫码查看示例</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <img src="@/assets/img/shili/zhengce.png"/>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {
    name: "saomazhanshi",
};
</script>

<style scoped>
.lnsmore-nav {
    background: url("../../../assets/img/shili/xbg-01.jpg") no-repeat bottom left;
}

h2 {
    color: #5caaff;
    margin: 10px 0;
    font-weight: normal;
}

.wzxbj {
    margin-bottom: 60px;
    line-height: 30px;
    margin: 6px 30px 6px 0;
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

.nav2 {
    background: url("../../../assets/img/shili/xbg-02.jpg") no-repeat bottom left;
}

.nav3 {
    background: url("../../../assets/img/shili/xbg-03.jpg") no-repeat bottom left;
}

.nav4 {
    background: url("../../../assets/img/shili/xbg-04.jpg") no-repeat bottom left;
}
.nav5{
  background: url("../../../assets/img/shili/xbg-05.jpg") no-repeat bottom left;
}

.clearpadding {
    padding: 0;
}
</style>
