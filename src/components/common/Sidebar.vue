<template>
  <div class="sidebar" ref="sidebar">
    <el-menu v-if="isShow" class="sidebar-el-menu" @select="onMenuSelect" :default-active="isActive" unique-opened :collapse="collapse"
    >
      <!--      :default-openeds="['dangan','kaoshi','kaoshizhanshi','wenjuan-shijuan','ceping-ceping','fapiao','tianbao','xunjian','zichan','items','system','fabuyemian','systems','renliguanli']"-->
      <el-submenu index="renliguanli" v-if="this.$store.state.sidebar_id == 13">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span>人力管理</span>
        </template>
        <el-menu-item index="yuangongxinxitongji" class="ln_erji">
          人员统计
        </el-menu-item>
        <el-menu-item index="yuangongliebiao" class="ln_erji">
          员工列表
        </el-menu-item>
        <el-menu-item index="BuMenRenYuanGuanLi" class="ln_erji">
          部门列表
        </el-menu-item>
        <el-menu-item index="jueseguanli">角色管理</el-menu-item>
        <el-menu-item index="jibenxinxi" class="ln_erji">
          基本信息管理
        </el-menu-item>
        <el-menu-item index="adminshenhe" class="ln_erji" v-if="hasPerm('设置过期权限')">
          设置会员到期
        </el-menu-item>
      </el-submenu>
      <!--       && this.$store.state.sidebar_id == 1-->
      <el-menu-item v-if="hasPerm('内容发布')" index="article-info" class="ln_erji">
        <i class="el-icon-full-screen"></i>
        <span slot="title">扫码展示</span>
      </el-menu-item>
      <!--      <el-menu-item v-if="hasPerm('内容发布')==false && this.$store.state.sidebar_id == 1" index="saomazhanshi" class="ln_erji">-->
      <!--        <i class="el-icon-full-screen"></i>-->
      <!--        <span slot="title">扫码展示</span>-->
      <!--      </el-menu-item>-->
      <!--      <el-menu-item v-if="hasPerm('部门管理')==false && this.$store.state.sidebar_id == 1" index="saomazhanshi" class="ln_erji">-->
      <!--        <span slot="title">部门管理</span>-->
      <!--      </el-menu-item>-->
      <!--      && this.$store.state.sidebar_id == 2-->
      <el-submenu v-if="hasPerm('考试') " index="kaoshi">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span>扫码答题考试</span>
        </template>
        <el-menu-item index="shijuan">试卷</el-menu-item>
        <el-menu-item index="tiku">题库</el-menu-item>
      </el-submenu>
      <!--      && this.$store.state.sidebar_id == 2-->
      <!--      <el-menu-item v-if="hasPerm('考试')" index="kaoshizhanshi" class="ln_erji">-->
      <!--        <i class="el-icon-tickets"></i>-->
      <!--        <span slot="title">扫码答题考试</span>-->
      <!--      </el-menu-item>-->
      <!-- && this.$store.state.sidebar_id == 3-->
      <el-menu-item v-if="hasPerm('问卷')" index="wenjuan-shijuan" class="ln_erji">
        <i class="el-icon-chat-line-square"></i>
        <span slot="title">扫码调研问卷</span>
      </el-menu-item>
      <!--      <el-menu-item v-if="hasPerm('问卷')==false && this.$store.state.sidebar_id == 3" index="diaoyanzhanshi" class="ln_erji">-->
      <!--        <i class="el-icon-chat-line-square"></i>-->
      <!--        <span slot="title">扫码调研问卷</span>-->
      <!--      </el-menu-item>-->

      <el-menu-item v-if="hasPerm('测评')" index="ceping-ceping" class="ln_erji">
        <i class="el-icon-data-line"></i>
        <span slot="title">扫码考评</span>
      </el-menu-item>
      <!--      <el-menu-item v-if="hasPerm('测评')==false && this.$store.state.sidebar_id == 4" index="cepingzhanshi" class="ln_erji">-->
      <!--        <i class="el-icon-data-line"></i>-->
      <!--        <span slot="title">扫码考评</span>-->
      <!--      </el-menu-item>-->

      <el-submenu v-if="hasPerm('发票') && this.$store.state.sidebar_id == 5" index="fapiao">
        <template slot="title">
          <i class="el-icon-postcard"></i>
          <span>发票扫码查验</span>
        </template>
        <el-menu-item index="fapiao-fapiao">发票</el-menu-item>
        <el-menu-item index="fapiao-tongji">统计</el-menu-item>
      </el-submenu>
      <el-menu-item v-if="hasPerm('发票')==false && this.$store.state.sidebar_id == 5" index="fapiaozhanshi" class="ln_erji">
        <i class="el-icon-postcard"></i>
        <span slot="title">发票扫码查验</span>
      </el-menu-item>

      <el-submenu v-if="hasPerm('填报')" index="tianbao">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span>扫码填报</span>
        </template>
        <el-menu-item index="tianbao-index">一般填报</el-menu-item>
        <!--                 <el-menu-item index="tianbao-duohang">多行填报</el-menu-item>-->
        <!--        <el-menu-item index="tianbao-table">表格填报</el-menu-item>-->
        <!--        <el-menu-item index="ewtianbao-index">表格填报</el-menu-item>-->
        <el-menu-item index="biaogetianbao-index">表格填报</el-menu-item>
        <el-menu-item index="tianbao-excel">Excel 填报</el-menu-item>
      </el-submenu>
      <!--      <el-menu-item v-if="hasPerm('填报')==false && this.$store.state.sidebar_id == 6" index="tianbaozhanshi" class="ln_erji">-->
      <!--        <i class="el-icon-edit-outline"></i>-->
      <!--        <span slot="title">扫码填报</span>-->
      <!--      </el-menu-item>-->

      <el-submenu index="xunjian" v-if="hasPerm('巡检')">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span>扫码巡检</span>
        </template>
        <el-menu-item index="xunjian-renwu">巡检任务</el-menu-item>
        <el-menu-item index="xunjiantongjiye">巡检统计页</el-menu-item>
      </el-submenu>
      <!--      <el-menu-item v-if="hasPerm('巡检')==false && this.$store.state.sidebar_id == 7" index="xunjianzhanshi" class="ln_erji">-->
      <!--        <i class="el-icon-tickets"></i>-->
      <!--        <span slot="title">扫码巡检</span>-->
      <!--      </el-menu-item>-->

      <el-submenu index="zichan" v-if="hasPerm('固定资产')">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span>固定资产</span>
        </template>
        <el-menu-item index="zichan-fenlei">分类管理</el-menu-item>
        <el-menu-item index="zichan-xinxi">资产信息</el-menu-item>
        <el-menu-item index="zichan-pandian">资产盘点</el-menu-item>
        <el-menu-item index="zichan-cz">资产处置记录</el-menu-item>
        <!--        <el-menu-item index="zichan-zhuanyi">资产转移记录</el-menu-item>-->
        <!--        <el-menu-item index="zichan-chuzhi">资产处置记录</el-menu-item>-->
        <!--        <el-menu-item index="zichan-weixiu">资产报修记录</el-menu-item>-->
        <!--        <el-menu-item index="zichan-chujie">资产出借记录</el-menu-item>-->
        <!--        <el-menu-item index="zichan-chuzu">资产出租记录</el-menu-item>-->
        <!--        <el-menu-item index="zichan-baofei">资产报废记录</el-menu-item>-->
        <el-menu-item index="zichan-baobiao">资产报表</el-menu-item>
      </el-submenu>

      <el-submenu index="items" v-if="hasPerm('物品领用')">
        <template slot="title">
          <i class="el-icon-goods"></i>
          <span>物品领用</span>
        </template>
        <el-menu-item index="items_category" class="ln_erji">物品管理</el-menu-item>
        <el-menu-item index="items_request" class="ln_erji">物品申请</el-menu-item>
        <el-menu-item index="items_response" class="ln_erji">物品归还</el-menu-item>
        <el-menu-item index="items_issue" class="ln_erji">发放记录</el-menu-item>
        <el-menu-item index="wplymx" class="ln_erji">物品领用明细</el-menu-item>
        <el-menu-item index="wpjymx" class="ln_erji">物品借用明细</el-menu-item>
        <el-menu-item index="wplyjyreport" class="ln_erji">物品领用借用报表</el-menu-item>
      </el-submenu>
      <!--      <el-menu-item v-if="hasPerm('物品领用')==false && this.$store.state.sidebar_id == 9" index="wupinzhanshi" class="ln_erji">-->
      <!--        <i class="el-icon-goods"></i>-->
      <!--        <span slot="title">物品领用</span>-->
      <!--      </el-menu-item>-->
      <!-- <el-submenu index="system" v-if="hasPerm('系统设置')==false && this.$store.state.sidebar_id == 10">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>系统设置</span>
        </template> -->
      <!-- <el-menu-item index="BuMenRenYuanGuanLi" class="ln_erji">
          部门和人员管理
        </el-menu-item> -->
      <!-- <el-menu-item index="jueseguanli">角色管理</el-menu-item> -->
      <!-- </el-submenu> -->
      <el-menu-item v-if="hasPerm('系统设置')==false && this.$store.state.sidebar_id == 10" index="systems">
        <i class="el-icon-setting"></i>
        <span>系统设置</span>
      </el-menu-item>
      <el-submenu index="fabuyemian" v-if="hasPerm('任务督办') ">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>任务督办</span>
        </template>
        <el-menu-item index="faburenwu" class="ln_erji">
          督办任务单
        </el-menu-item>
        <el-menu-item index="gerenbangong" class="ln_erji">
          个人办公
        </el-menu-item>
        <el-menu-item index="taizhangliebiao" class="ln_erji">
          督办任务台账列表
        </el-menu-item>
        <el-menu-item index="renwutongji" class="ln_erji">
          任务统计
        </el-menu-item>
      </el-submenu>

      <el-submenu index="system" v-if="hasPerm('受访') ">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span>单位来访登记</span>
        </template>
        <el-menu-item index="dep_qr" class="ln_erji">
          单位二维码
        </el-menu-item>
        <el-menu-item index="shoufangs_jilu" class="ln_erji">
          来访记录
        </el-menu-item>
      </el-submenu>

      <el-submenu v-if="hasPerm('档案管理')" index="dangan">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span>档案管理</span>
        </template>
        <el-menu-item index="da_dashboard" style="font-size: 16px">
          <i class="el-icon-house"></i>
          <span slot="title">数据分析</span>
        </el-menu-item>

        <el-menu-item index="guanli" style="font-size: 16px">
          <i class="el-icon-suitcase"></i>
          <span slot="title">文档管理</span>
        </el-menu-item>
        <el-menu-item index="zhuanyi" style="font-size: 16px">
          <i class="el-icon-sort"></i>
          <span slot="title">文档转移记录</span>
        </el-menu-item>
        <el-menu-item index="jiechu" style="font-size: 16px">
          <i class="el-icon-upload2"></i>
          <span slot="title">文档借出/归还</span>
        </el-menu-item>
        <el-menu-item index="jiben" style="font-size: 16px">
          <i class="el-icon-user"></i>
          <span slot="title">基本信息</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu v-if="hasPerm('地图管理')" index="maps">
        <template slot="title">
          <i class="el-icon-map-location"></i>
          <span>地图工具</span>
        </template>
        <el-menu-item index="maps_lists" style="font-size: 16px">
          <i class="el-icon-location-information"></i>
          <span slot="title">地图管理</span>
        </el-menu-item>
<!--        <el-menu-item index="maps_list" style="font-size: 16px">-->
<!--          <i class="el-icon-location-information"></i>-->
<!--          <span slot="title">地图管理</span>-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="maps_quyu" style="font-size: 16px">-->
<!--          <i class="el-icon-location"></i>-->
<!--          <span slot="title">地图区域管理</span>-->
<!--        </el-menu-item>-->
      </el-submenu>
      <!--      <el-menu-item  index="app-qianming" v-if="hasPerm('档案管理') && this.$store.state.sidebar_id == 15" class="ln_erji">-->
      <!--        <i class="el-icon-mobile"></i>-->
      <!--        <span slot="title">签名</span>-->
      <!--      </el-menu-item>-->
      <el-menu-item index="qianming-qm" v-if="hasPerm('手机签名')" class="ln_erji">
        <i class="el-icon-mobile"></i>
        <span slot="title">手机签名</span>
      </el-menu-item>
      <!--      <el-submenu index="xitongguanli" v-if="hasPerm('人力管理') && this.$store.state.sidebar_id == 13">-->
      <!--        <template slot="title">-->
      <!--          <i class="el-icon-tickets"></i>-->
      <!--          <span>系统管理</span>-->
      <!--        </template>-->
      <!--        -->

      <!--      </el-submenu>-->
    </el-menu>
  </div>
</template>

<script>
import bus from "../utils/bus";
import {mapState} from "vuex";

export default {
  data() {
    return {
      collapse: false,
      isActive: "home",
      isShow: false,
    };
  },
  methods: {
    onMenuSelect(name) {
      // if (name === "logout") {
      //   this.logout()
      //   return
      // }
      // this.$store.commit(MENUINDEX, name);
      this.$router.push({name});
    },

    //权限判断的方法
    hasPerm(name) {
      return this.userinfo.func_names.indexOf(name) > -1;
    },
  },
  computed: {
    ...mapState(["userinfo"]),
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {
    console.log(this.userinfo);
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  },
  watch: {
    $route(to, from) {
      // console.log(from.name) // 从哪来
      // console.log(to.name) // 到哪去
      if (to.name == "nav") {
        this.isShow = false;
        this.collapse = true;
      } else {
        this.isShow = true;
        this.collapse = false;
      }
      this.isActive = to.name;
      if (
        to.name.indexOf("zichan") > -1 ||
        to.name.indexOf("item") > -1 ||
        to.name.indexOf("wp") > -1
      ) {
        this.$refs.sidebar.scrollTop = this.$refs.sidebar.scrollHeight;
      }
      if (from.name.indexOf("nav") > -1) {
        this.$refs.sidebar.scrollTop = this.$refs.sidebar.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
