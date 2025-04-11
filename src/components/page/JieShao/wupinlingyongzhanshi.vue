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
              <h2>物品领用</h2>
              <p class="wzxbj" style="height: 40px">
                规范化管理物品的采购、发放、领用、借用等环节，保证物品的有效使用和妥善管理。
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
                      <h4>扫码登录</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>选择物品</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>填写表单</h4>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <img
                        src="@/assets/img/shili/zq.jpg"
                        alt=""
                        style="display: block; float: left; margin-right: 14px"
                      />
                      <h4>提交申请</h4>
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
              <h2 class="shenhui">01. 扫码登录</h2>
              <p class="wzxbj-01" style="height: 100px">
                手机扫描二维码进入物品领用登录界面，手机号密码登录之后就可以进行物品申请。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/wpcode.png" alt="" />
                <p class="xiaozi">※ 登录查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/wplogin.jpg" class="example" />
              <div style="color: #333; line-height: 30px; text-align: center">
                扫码登录<span style="color: #bbb"> - 示例</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">02. 选择物品</h2>
              <p class="wzxbj-01" style="height: 100px">
                在物品列表中选择要申请的物品，可通过物品名称搜索。
                <span style="color: red">(需事先进行物品登记)</span>
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/wpcode.png" alt="" />
                <p class="xiaozi">※ 登录查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/wpll.jpeg" class="example" />
              <div style="color: #333; line-height: 30px; text-align: center">
                选择物品<span style="color: #bbb"> - 示例</span>
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
              <h2 class="shenhui">03. 填写表单</h2>
              <p class="wzxbj-01" style="height: 130px">
                选择物品点击后填写申请表单，点击确定按钮即可将本物品添加到申领清单中。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/wpcode.png" alt="" />
                <p class="xiaozi">※ 登录查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/wpsq.jpeg" class="example" />
              <div style="color: #333; line-height: 30px; text-align: center">
                填写表单<span style="color: #bbb"> - 示例</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">
              <h2 class="shenhui">04. 提交申请</h2>
              <p class="wzxbj-01" style="height: 130px">
                点击申领清单按钮跳转到待提交页，确定好申请物品后点击提交按钮即可提交本次物品申请。
              </p>
              <div style="margin-top: 30px; float: right">
                <img src="@/assets/img/shili/wpcode.png" alt="" />
                <p class="xiaozi">※ 登录查看示例</p>
              </div>
            </el-col>
            <el-col :span="12" class="img-center">
              <img src="@/assets/img/shili/wpsubmit.jpeg" class="example" />
              <div style="color: #333; line-height: 30px; text-align: center">
                提交申请<span style="color: #bbb"> - 示例</span>
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
h3 {
  color: #ffb010;
  font-weight: normal;
}
.img-center {
  text-align: center;
}
.example {
  width: 246px;
  height: 446px;
  border-radius: 5px;
}
</style>
