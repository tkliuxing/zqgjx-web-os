<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">{{ departmentName || "暂无数据" }} |
      <span class="departmentName">
        政企工具箱
      </span>
      <!--            <router-link :to='home'>-->
      <!--                <el-button type="primary" round>快捷导航</el-button>-->
      <!--            </router-link>-->
    </div>
    <div class="header-right">
      <div class="header-user-con">
<!--        <el-popover-->
<!--          placement="top-start"-->
<!--          title="标题"-->
<!--          width="200"-->
<!--          trigger="hover"-->
<!--          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">-->
<!--          <el-button class="kuaijie" type="primary" round slot="reference">快捷导航</el-button>-->
<!--        </el-popover>-->
        <el-popover placement="bottom-start" trigger="hover">
          <el-button class="kuaijie" type="primary" round slot="reference">快捷导航</el-button>
          <div style="display: flex; flex-wrap: wrap;width: 340px;justify-content: space-between;align-items: center">
            <div class="ver-layout-center" @click="changeSide(1)">
                <div class="icon-bg" :class="this.$store.state.sidebar_id == 1?'icon-select':''" >
                  <i class="el-icon-chat-line-square"></i>
                </div>
                <div class="icon-text">扫码展示</div>
            </div>
            <div class="ver-layout-center" @click="changeSide(2)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 2?'icon-select':''">
                <i class="el-icon-tickets"></i>
              </div>
              <div class="icon-text">扫码答题考试</div>
            </div>
            <div class="ver-layout-center" @click="changeSide(3)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 3?'icon-select':''">
                <i class="el-icon-chat-line-square"></i>
              </div>
              <div class="icon-text">扫码调研问卷</div>
            </div>
            <div class="ver-layout-center" @click="changeSide(4)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 4?'icon-select':''">
                <i class="el-icon-data-line"></i>
              </div>
              <div class="icon-text">扫码考评</div>
            </div>
<!--            <div class="ver-layout-center" @click="changeSide(5)">-->
<!--              <div class="icon-bg" :class="this.$store.state.sidebar_id == 5?'icon-select':''">-->
<!--                <i class="el-icon-postcard"></i>-->
<!--              </div>-->
<!--              <div class="icon-text">发票扫码查验</div>-->
<!--            </div>-->
            <div class="ver-layout-center" @click="changeSide(6)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 6?'icon-select':''">
                <i class="el-icon-edit-outline"></i>
              </div>
              <div class="icon-text">扫码填报</div>
            </div>
            <div class="ver-layout-center" @click="changeSide(7)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 7?'icon-select':''">
                <i class="el-icon-tickets"></i>
              </div>
              <div class="icon-text">扫码巡检</div>
            </div>
            <div class="ver-layout-center" @click="changeSide(8)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 8?'icon-select':''">
                <i class="el-icon-tickets"></i>
              </div>
              <div class="icon-text">固定资产</div>
            </div>
            <div class="ver-layout-center" @click="changeSide(9)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 9?'icon-select':''">
                <i class="el-icon-goods"></i>
              </div>
              <div class="icon-text">物品领用</div>
            </div>
            <div class="ver-layout-center" @click="changeSide(11)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 11?'icon-select':''">
                <i class="el-icon-setting"></i>
              </div>
              <div class="icon-text">任务督办</div>
            </div>
            <div class="ver-layout-center" @click="changeSide(12)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 12?'icon-select':''">
                <i class="el-icon-tickets"></i>
              </div>
              <div class="icon-text">单位来访登记</div>
            </div>
<!--            <div class="ver-layout-center" @click="changeSide(13)">-->
<!--              <div class="icon-bg" :class="this.$store.state.sidebar_id == 13?'icon-select':''">-->
<!--                <i class="el-icon-tickets"></i>-->
<!--              </div>-->
<!--              <div class="icon-text">人力管理</div>-->
<!--            </div>-->
            <div class="ver-layout-center" @click="changeSide(14)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 14?'icon-select':''">
                <i class="el-icon-tickets"></i>
              </div>
              <div class="icon-text">档案管理</div>
            </div>
            <div class="ver-layout-center" @click="changeSide(15)">
              <div class="icon-bg" :class="this.$store.state.sidebar_id == 15?'icon-select':''">
                <i class="el-icon-tickets"></i>
              </div>
              <div class="icon-text">手机签名</div>
            </div>
          </div>
        </el-popover>
<!--        <router-link :to='home'>-->
<!--          <el-button class="kuaijie" type="primary" round>快捷导航</el-button>-->
<!--        </router-link>-->
        <!-- 全屏显示 -->
        <div v-if="canFullScreen" class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <MailBox></MailBox>
        <i class="el-icon-s-tools" @click="goSystem"></i>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userinfo.full_name || "未命名" }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changepwd" v-if="!userinfo.is_tester">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item command="system">系统设置</el-dropdown-item>
            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <ChangePWD :visable="showChangePWD" @close="closeChangePWD" />
  </div>
</template>
<script>
import bus from "../utils/bus";
import MailBox from "./MailBox.vue";
import ChangePWD from "./ChangePWD.vue";
import { mapState } from "vuex";
import { LOGOUT } from "../../store";

export default {
  data() {
    return {
      canFullScreen: true,
      showChangePWD: false,
      collapse: false,
      fullscreen: false,
      name: "linxin",
      message: 2,
      departmentName: null,
      home: "/home",
    };
  },
  components: { MailBox, ChangePWD },
  computed: {
    ...mapState(["userinfo"]),
    ...mapState(["departmentname"]),
  },
  methods: {
    changeSide(n) {
      this.$store.state.sidebar_id = n;
      switch (n) {
          case 1:
              this.$router.push('/article/article-info')
              break;
          case 2:
              this.$router.push('/home/kaoshi/shijuan')
              break;
          case 3:
              this.$router.push('/wenjuan/shijuan')
              break;
          case 4:
              this.$router.push('/ceping/ceping')
              break;
          case 5:
              this.$router.push('/fapiao/fapiao')
              break;
          case 6:
              this.$router.push('/tianbao/tbindex')
              break;
          case 7:
              this.$router.push('/home/xunjian/renwu')
              break;
          case 8:
              this.$router.push('/zichan/ZiChanFenLei')
              break;
          case 9:
              this.$router.push('/items/items_category')
              break;
          case 11:
              this.$router.push('/fabuyemian/faburenwu')
              break;
          case 12:
              this.$router.push('/shoufangs/dep_qr')
              break;
          case 13:
              this.$router.push('/renliguanli/yuangongliebiao')
              break;
          case 14:
              this.$router.push('/danganguanli/dashboard')
              break;
          case 15:
              this.$router.push('/qianming/qianming-qm')
              break;
      }
    },
    closeChangePWD() {
      this.showChangePWD = false;
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === "loginout") {
        this.$store.commit(LOGOUT);
        localStorage.clear();
        this.$router.push("/login");
      } else if (command === "system") {
        this.$router.push("/system/BuMenRenYuanGuanLi");
      } else if (command === "changepwd") {
        this.showChangePWD = true;
      }
    },
    goSystem(){
      // this.$router.push('/system/BuMenRenYuanGuanLi')
      this.$store.state.sidebar_id = 13;
      this.$router.push("/renliguanli/yuangongliebiao");
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
  async created() {
    let orgId = this.userinfo.org_id;
    let departmentName = await this.$http.get("/systemorg/", {
      params: {
        org_id: orgId,
      },
    });
    this.departmentName = departmentName.data[0].name;
  },
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
}

.kuaijie {
  margin-right: 10px;
}

.departmentName {
  line-height: 70px;
  font-size: 18px;
  color: #888;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  float: left;
  line-height: 70px;
  margin-left: 10px;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
.ver-layout-center {
  width: 33%;
  //margin-left: 40px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon-bg {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  padding: 5px;
  //background: #459FFF;
  background: -webkit-linear-gradient(left, #459FFF, #9ED3FF);
  cursor:pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-bg:hover {
  background: -webkit-linear-gradient(left, #4FD19D,#B9F0D6);
}
.icon-select{
  background: -webkit-linear-gradient(left, #4FD19D, #B9F0D6);
}
.icon-bg i {
  font-size: 34px;
  color: #fff;
}
.icon-text{
  color: #666;
  font-size: 12px;
  margin-top: 10px;
}
</style>
