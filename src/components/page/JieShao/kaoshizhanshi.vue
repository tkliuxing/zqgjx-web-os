<template>
  <el-card style="padding: 24px">
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
              <h2>扫码答题考试</h2>
              <p class="wzxbj" style="height: 40px">
                在线考试系统支持题库随即抽题组卷，模仿线下考试设置考试时间，并进行其它设置，提交考试后系统可以自动阅卷输出考试成绩单。
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
                      <h4>知识竞赛</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>党建专题考试</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>培训考试</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>政策考试</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>制度考试</h4>
                    </div>
                  </el-col>
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
              <h2 class="shenhui">01. 知识竞赛</h2>
              <p class="wzxbj-01" style="height: 70px">
                通过知识竞赛增强知识学习的积极性和趣味性，还能发掘各方面的优秀人才，一举两得，是当前党政机关和企业非常青睐的一种模式。
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/zsjs.png" alt="" />
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
                  <img src="@/assets/img/shili/zsjs-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    试卷封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/zsjs-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    选择题<span style="color: #bbb"> - 示例</span>
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
              <h2 class="shenhui">02. 党建专题考试</h2>
              <p class="wzxbj-01" style="height: 70px">
                随着两学一做，三会一课等学习党建知识热潮的掀起，政府机构及各大企业都积极响应党的号召，开展各类党建专题竞赛。
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/djzt.png" alt="" />
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
                  <img src="@/assets/img/shili/djzt-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    试卷封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/djzt-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    选择题<span style="color: #bbb"> - 示例</span>
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
              <h2 class="shenhui">03. 培训考试</h2>
              <p class="wzxbj-01" style="height: 70px">
                如何确保花费大精力进行的培训达到了相应的效果？进行在线培训考试即可，这里整理了相关考试模板，可供借鉴。
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/pxks.png" alt="" />
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
                  <img src="@/assets/img/shili/pxks-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    试卷封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/pxks-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    判断题<span style="color: #bbb"> - 示例</span>
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
              <h2 class="shenhui">04. 政策考试</h2>
              <p class="wzxbj-01" style="height: 70px">
                国家或地方有了新政策，如何确保职员都已经知晓，采用在线考试是最明智的方法。很多单位都在使用，我们也帮您整理了一些～
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/zcks1.png" alt="" />
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
                  <img src="@/assets/img/shili/zcks-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    试卷封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/zcks-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    选择题<span style="color: #bbb"> - 示例</span>
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
              <h2 class="shenhui">05. 制度考试</h2>
              <p class="wzxbj-01" style="height: 70px">
                政府单位的制度考试是很多单位非常重视的考试，关乎每位职员对制度的了解和认同程度。
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/zdks.png" alt="" />
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
                  <img src="@/assets/img/shili/zdks-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    试卷封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/zdks-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    选择题<span style="color: #bbb"> - 示例</span>
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
  name: "kaoshizhanshi",
};
</script>

<style scoped>
.lnsmore-nav {
  background: url("../../..//assets/img/xbg-01.jpg") no-repeat bottom left;
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

.img-center {
  text-align: center;
}
</style>
