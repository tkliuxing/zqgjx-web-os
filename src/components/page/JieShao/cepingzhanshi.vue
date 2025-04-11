<template>
  <el-card style="padding: 34px">
    <el-button
      type="info"
      round
      style="margin-bottom: 15px"
      icon="el-icon-arrow-left"
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
              <h2>扫码考评</h2>
              <p class="wzxbj" style="height: 40px">
                在线考评系统，可以在线设计考评问卷、设置题目维度和考评结果，从而轻易构建您自己的考评模型，自动生成考评报告。
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
                      <h4>干部年度考评</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>部门测评</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>评选投票</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>心理测评</h4>
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
    <el-row :gutter="160" style="margin-bottom: 80px">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <h2 class="shenhui">01. 干部年度考评</h2>
              <p class="wzxbj-01" style="height: 70px">
                干部考核工作一直以来都是一项非常重要的工作，更重要的是它激励广大干部积极向上，在自己工作岗位上能尽职尽责、勤劳勤恳的工作。因此，它是激励干部担当作为、促进事业发展的重要抓手。
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/gbnd.png" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/gbnd-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    考评封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/gbnd-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    考评内容<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="160" style="margin-bottom: 80px">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <h2 class="shenhui">02. 部门考评</h2>
              <p class="wzxbj-01" style="height: 70px">
                部门考评包括许多功能，政府单位需要它，企业也需要它。它能服务于人力资源规划，为安置、考核、晋升提供依据，同时也是个人择业的参考，是职业/生涯规划的基础
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/bmcp.png" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/bmcp-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    考评封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/bmcp-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    考评内容<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="160" style="margin-bottom: 80px">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <h2 class="shenhui">03. 评选投票</h2>
              <p class="wzxbj-01" style="height: 70px">
                随着微信的绝对普及，使用微信进行投票也已经成为大众流行，可以通过扫码进行投票评选等一系列投票操作。
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/pxtp.png" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/pxtp-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    考评封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/pxtp-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    考评内容<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="160" style="margin-bottom: 80px">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <h2 class="shenhui">04. 心理测评</h2>
              <p class="wzxbj-01" style="height: 70px">
                心理测试是指通过一系列手段，将人的某些心理特征数量化，来衡量个体心理因素水平和个体心理差异的一种科学测量方法。
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/xlcp.png" alt="" />
                <p class="xiaozi">※ 扫码查看示例</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/xlcp-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    考评封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/xlcp-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    考评内容<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "cepingzhanshi",
};
</script>

<style scoped>
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

.img-center {
  text-align: center;
}
</style>
