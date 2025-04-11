<template>
  <el-card style="padding: 34px">
    <el-row :gutter="160" style="margin-bottom: 80px">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <h2>发票扫码查验</h2>
              <p class="wzxbj" style="height: 120px">
                发票管理小程序是一款实用的发票助手小工具，可用发票扫码后将数据自动录入到平台，平台可对发票进行汇总统计和报销记录的统计，还可以用日期、人员姓名和部门名称进行发票查询，对历史已经报销过的发票进行有效实时管理。
              </p>
              <div style="background: #fafafa; padding: 30px">
                <el-row>
                  <el-col :span="8">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>发票查真</h4>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>发票查重</h4>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>发票报销</h4>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 60px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/fapiao.jpg" alt="" />
                <p class="xiaozi">※ 扫码打开小程序</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/fp-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    01 发票主界面<span style="color: #bbb"></span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/fp-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    02 发票信息<span style="color: #bbb"></span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40" class="img-center">
      <el-col :span="6">
        <img src="@/assets/img/shili/fp-03.png" />
        <div style="color: #333; line-height: 30px; text-align: center">
          03 发票汇总-人员列表<span style="color: #bbb">(示例)</span>
        </div>
      </el-col>
      <el-col :span="6">
        <img src="@/assets/img/shili/fp-04.png" />
        <div style="color: #333; line-height: 30px; text-align: center">
          04 发票汇总-部门列表<span style="color: #bbb">(示例)</span>
        </div>
      </el-col>
      <el-col :span="6">
        <img src="@/assets/img/shili/fp-05.png" />
        <div style="color: #333; line-height: 30px; text-align: center">
          04 发票记录<span style="color: #bbb">(示例)</span>
        </div>
      </el-col>
      <el-col :span="6"> </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "fapiaozhanshi",
};
</script>

<style scoped>
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

.img-center {
  text-align: center;
}
</style>
