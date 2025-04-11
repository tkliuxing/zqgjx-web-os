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
              <h2>扫码巡检</h2>
              <p class="wzxbj" style="height: 100px">
                相比较纸面巡检，或是设备点检管理系统方式检查，二维码设备巡检的方式，更适用于轻量，中量级的信息管理。使用扫码巡检的方案，可以大幅简化点检信息化的难度，不用培训员工，所有点检工作都在手机微信中完成。费用低，使用方便，部署容易。通过提供从扫码、管理，云端数据处理和二维码标签制作等一系列服务，帮每个企业高效完成二维码点检。大幅降低了使用门槛和管理成本。
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
                      <h4>财产巡检</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>设备巡检</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>区域巡检</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>桥梁巡检</h4>
                    </div>
                  </el-col>
                  <el-col :span="4"> </el-col>
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
              <h2 class="shenhui">01. 财产巡检</h2>
              <p class="wzxbj-01" style="height: 100px">
                批量快速扫码二维码标签进行财产巡检，手机扫码即可随时查看和编辑资产信息，支持后期更新，无需重新制作标签，还可实现简单的资产领用、报修及维修登记。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/sb.png" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/xj-01.png" />
              <div style="color: #333; line-height: 30px; text-align: center">
                财产巡检<span style="color: #bbb"> - 示例</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">02. 设备巡检</h2>
              <p class="wzxbj-01" style="height: 100px">
                一物一码，为每台设备生成二维码，并制作成标牌。操作人员微信扫码就能使用，添加巡检和维修记录，实现无纸化巡检。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/qy.png" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/xj-02.png" />
              <div style="color: #333; line-height: 30px; text-align: center">
                设备巡检<span style="color: #bbb"> - 示例</span>
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
              <h2 class="shenhui">03. 区域巡检</h2>
              <p class="wzxbj-01" style="height: 130px">
                一个区域一个二维码，适用于每一块工作区域，像夏日里办公区域中央空调的日常管理，各工作人员根据检查和保养规则，添加检查结果，异常情况可及时提醒到维修人员，缩短故障响应时长。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/ql.png" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/xj-03.png" />
              <div style="color: #333; line-height: 30px; text-align: center">
                区域巡检<span style="color: #bbb"> - 示例</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">04. 桥梁巡检</h2>
              <p class="wzxbj-01" style="height: 130px">
                一个部件一个二维码，适用于没个道路/桥梁，像桥梁的护栏安全，各工作人员根据检查和保养规则，添加检查结果，异常情况可及时提醒到维修人员，缩短故障响应时长。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/cc.png" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/xj-04.jpg" />
              <div style="color: #333; line-height: 30px; text-align: center">
                桥梁巡检<span style="color: #bbb"> - 示例</span>
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
