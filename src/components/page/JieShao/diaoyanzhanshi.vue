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
              <h2>扫码调研问卷</h2>
              <p class="wzxbj" style="height: 40px">
                问卷调查系统支持多种题型，包括单项选择、多项选择、问答题等。
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
                      <h4>干部思想状况调研问卷</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>满意度调查</h4>
                    </div>
                  </el-col>
<!--                  <el-col :span="4">-->
<!--                    <div>-->
<!--                      <img-->
<!--                        src="@/assets/img/shili/zq.jpg"-->
<!--                        alt=""-->
<!--                        style="display: block; float: left; margin-right: 14px"-->
<!--                      />-->
<!--                      <h4>民意调研问卷</h4>-->
<!--                    </div>-->
<!--                  </el-col>-->
<!--                  <el-col :span="4">-->
<!--                    <div>-->
<!--                      <img-->
<!--                        src="@/assets/img/shili/zq.jpg"-->
<!--                        alt=""-->
<!--                        style="display: block; float: left; margin-right: 14px"-->
<!--                      />-->
<!--                      <h4>民生问题调研问卷</h4>-->
<!--                    </div>-->
<!--                  </el-col>-->
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
              <h2 class="shenhui">01. 干部思想状况调研问卷</h2>
              <p class="wzxbj-01" style="height: 70px">
                如何了解目前各领导干部的心理状况、思想状况等问题？在越来越丰富的社会发展形态下，就领导的思想状况做一个调查，这关系到他/她未来能否带领团队一起创造价值？
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/gbsx.png" alt="" />
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
                  <img src="@/assets/img/shili/gbsx-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    问卷封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/gbsx-02.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    问答题<span style="color: #bbb"> - 示例</span>
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
              <h2 class="shenhui">02. 满意度调查</h2>
              <p class="wzxbj-01" style="height: 70px">
                俗话说，民以食为天，食堂的卫生和品质状况备受人们关注，因此越来越多关于食堂满意度的调查问卷陆续被开展。
              </p>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px; float: right">
            <el-col :span="24">
              <div>
                <img src="@/assets/img/shili/myddc.png" alt="" />
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
                  <img src="@/assets/img/shili/myddc-01.png" />
                  <div style="color: #333; line-height: 30px; text-align: center">
                    问卷封面<span style="color: #bbb"> - 示例</span>
                  </div>
                </el-col>
                <el-col :span="12" class="img-center">
                  <img src="@/assets/img/shili/myddc-02.png" />
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
<!--    <el-row :gutter="160" style="margin-bottom: 80px">-->
<!--      <el-col :span="10">-->
<!--        <div class="grid-content bg-purple">-->
<!--          <el-row>-->
<!--            <el-col :span="24">-->
<!--              <h2 class="shenhui">03. 民意调研问卷</h2>-->
<!--              <p class="wzxbj-01" style="height: 70px">-->
<!--                知民意方能办明事，不管是企业，政府还是高校，了解民意对其发展起到了非常重要的作用。-->
<!--              </p>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row style="margin-top: 30px; float: right">-->
<!--            <el-col :span="24">-->
<!--              <div>-->
<!--                <img src="@/assets/img/shili/mydy.png" alt="" />-->
<!--                <p class="xiaozi">※ 扫码查看示例</p>-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :span="14">-->
<!--        <div class="grid-content bg-purple">-->
<!--          <el-row>-->
<!--            <el-col :span="24">-->
<!--              <el-row>-->
<!--                <el-col :span="12" class="img-center">-->
<!--                  <img src="@/assets/img/shili/mydy-01.png" />-->
<!--                  <div style="color: #333; line-height: 30px; text-align: center">-->
<!--                    问卷封面<span style="color: #bbb"> - 示例</span>-->
<!--                  </div>-->
<!--                </el-col>-->
<!--                <el-col :span="12" class="img-center">-->
<!--                  <img src="@/assets/img/shili/mydy-02.png" />-->
<!--                  <div style="color: #333; line-height: 30px; text-align: center">-->
<!--                    选择题<span style="color: #bbb"> - 示例</span>-->
<!--                  </div>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row :gutter="160" style="margin-bottom: 80px">-->
<!--      <el-col :span="10">-->
<!--        <div class="grid-content bg-purple">-->
<!--          <el-row>-->
<!--            <el-col :span="24">-->
<!--              <h2 class="shenhui">04. 民生问题调研问卷</h2>-->
<!--              <p class="wzxbj-01" style="height: 70px">-->
<!--                民生问题主要表现在百姓的吃穿住行、养老就医、子女教育等生活必需上面，同时也是人民群众最关心、最直接、最现实的利益问题。-->
<!--              </p>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row style="margin-top: 30px; float: right">-->
<!--            <el-col :span="24">-->
<!--              <div>-->
<!--                <img src="@/assets/img/shili/msdy.png" alt="" />-->
<!--                <p class="xiaozi">※ 扫码查看示例</p>-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :span="14">-->
<!--        <div class="grid-content bg-purple">-->
<!--          <el-row>-->
<!--            <el-col :span="24">-->
<!--              <el-row>-->
<!--                <el-col :span="12" class="img-center">-->
<!--                  <img src="@/assets/img/shili/msdy-01.png" />-->
<!--                  <div style="color: #333; line-height: 30px; text-align: center">-->
<!--                    问卷封面<span style="color: #bbb"> - 示例</span>-->
<!--                  </div>-->
<!--                </el-col>-->
<!--                <el-col :span="12" class="img-center">-->
<!--                  <img src="@/assets/img/shili/msdy-02.png" />-->
<!--                  <div style="color: #333; line-height: 30px; text-align: center">-->
<!--                    选择题<span style="color: #bbb"> - 示例</span>-->
<!--                  </div>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->

  </el-card>
</template>

<script>
export default {
  name: "diaoyanzhanshi",
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
