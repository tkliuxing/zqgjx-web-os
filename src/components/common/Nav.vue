<template>
<!--  <el-row :gutter="12" class="nav-card-group">-->
<!--    <el-col :span="6">-->
<!--      <router-link :to='zhanshiUrl' @click.native="changeSide(1)">-->
<!--        <el-card :shadow="shadow" class="zhanshibg" :class="{ nocolor: zhanshiColor }">-->
<!--          <i class="el-icon-chat-line-square" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>扫码展示</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link to='/home/kaoshi/shijuan'>-->
<!--        <el-card @click.native="kaoshishow" :shadow="shadow1" class="kaoshibg" :class="{ nocolor: kaoshiColor }">-->
<!--          <i class="el-icon-tickets" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>扫码答题考试</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link :to='wenjuanUrl' @click.native="changeSide(3)">-->
<!--        <el-card :shadow="shadow2" class="wenjuanbg" :class="{ nocolor: wenjuanColor }">-->
<!--          <i class="el-icon-chat-line-square" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>扫码调研问卷</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link :to='cepingUrl' @click.native="changeSide(4)">-->
<!--        <el-card :shadow="shadow3" class="cepingbg" :class="{ nocolor: cepingColor }">-->
<!--          <i class="el-icon-data-line" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>扫码考评</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link to='/fapiao/fapiao'>-->
<!--        <el-card @click.native="fapiaoshow" :shadow="shadow4" class="fapiaobg" :class="{ nocolor: fapiaoColor }">-->
<!--          <i class="el-icon-postcard" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>发票扫码查验</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link to='/tianbao/tbindex'>-->
<!--        <el-card @click.native="tianbaoshow" :shadow="shadow5" class="tianbaobg" :class="{ nocolor: tianbaoColor }">-->
<!--          <i class="el-icon-edit-outline" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>扫码填报</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link :to='xunjianUrl' @click.native="changeSide(7)">-->
<!--        <el-card :shadow="shadow6" class="xunjianbg" :class="{ nocolor: xunjianColor }">-->
<!--          <i class="el-icon-tickets" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>扫码巡检</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link to='/zichan/ZiChanFenLei'>-->
<!--        <el-card @click.native="zichanshow" :shadow="shadow7" class="zichanbg" :class="{ nocolor: zichanColor }">-->
<!--          <i class="el-icon-tickets" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>固定资产</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link to='/items/items_category'>-->
<!--        <el-card @click.native="wupinshow" :shadow="shadow8" class="wupinbg" :class="{ nocolor: wupinColor }">-->
<!--          <i class="el-icon-goods" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>物品领用</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    &lt;!&ndash; <el-col :span="6">-->
<!--      <router-link :to='xitongUrl' @click.native="changeSide(10)">-->
<!--        <el-card :shadow="shadow9" class="xitongbg" :class="{ nocolor: xitongColor }">-->
<!--          <i class="el-icon-setting" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>系统设置</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col> &ndash;&gt;-->
<!--    <el-col :span="6">-->
<!--      <router-link to='/fabuyemian/faburenwu'>-->
<!--        <el-card @click.native="shijianshow" :shadow="shadow10" class="xitongbg" :class="{ nocolor: xitongColor }">-->
<!--          <i class="el-icon-goods" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>任务督办</span>-->
<!--        </el-card>-->
<!--      </router-link>-->

<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link to='/shoufangs/dep_qr'>-->
<!--        <el-card @click.native="shoufangshow" :shadow="shadow11" class="shijianbg" :class="{ nocolor: wupinColor }">-->
<!--          <i class="el-icon-tickets" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>来访登记</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link to='/renliguanli/yuangongliebiao'>-->
<!--        <el-card @click.native="renlishow" :shadow="shadow12" class="shijianbg" :class="{ nocolor: wupinColor }">-->
<!--          <i class="el-icon-tickets" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>人力管理</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    <el-col :span="6">-->
<!--      <router-link to='/dashboard'>-->
<!--        <el-card @click.native="danganshow" :shadow="shadow13" class="danganbg" :class="{ nocolor: wupinColor }">-->
<!--          <i class="el-icon-tickets" style="font-size: 50px;color:white"></i><br>-->
<!--          <span>档案管理</span>-->
<!--        </el-card>-->
<!--      </router-link>-->
<!--    </el-col>-->
<!--    &lt;!&ndash;      <el-col :span="6">&ndash;&gt;-->
<!--    &lt;!&ndash;            <router-link :to='shoufangUrl' @click.native="changeSide(10)">&ndash;&gt;-->
<!--    &lt;!&ndash;                <el-card :shadow="shadow11" class="shoufang" :class="{ nocolor: shoufangColor }">&ndash;&gt;-->
<!--    &lt;!&ndash;                    <i class="el-icon-tickets" style="font-size: 50px;color:white"></i><br>&ndash;&gt;-->
<!--    &lt;!&ndash;                    <span>受访记录</span>&ndash;&gt;-->
<!--    &lt;!&ndash;                </el-card>&ndash;&gt;-->
<!--    &lt;!&ndash;            </router-link>&ndash;&gt;-->
<!--    &lt;!&ndash;        </el-col>&ndash;&gt;-->

<!--    &lt;!&ndash;      background-image: linear-gradient(to right, #29b6f6,#01579b);&ndash;&gt;-->

<!--  </el-row>-->
</template>

<script>
import bus from "../utils/bus";
import { mapState } from "vuex";
// import '@/assets/icon/font-icon/iconfont.css'
import { getList } from "@/resource";
import moment from "moment";

export default {
  components: {},
  data() {
    return {
      shijianUrl: "",
      xitongUrl: "",
      wupinUrl: "",
      zichanUrl: "",
      xunjianUrl: "",
      tianbaoUrl: "",
      fapiaoUrl: "",
      cepingUrl: "",
      wenjuanUrl: "",
      kaoshiUrl: "",
      zhanshiUrl: "",
      xitongColor: false,
      wupinColor: false,
      zichanColor: false,
      xunjianColor: false,
      tianbaoColor: false,
      fapiaoColor: false,
      cepingColor: false,
      wenjuanColor: false,
      kaoshiColor: false,
      zhanshiColor: false,
      shoufangColor: false,
      shadow: "hover",
      shadow1: "hover",
      shadow2: "hover",
      shadow3: "hover",
      shadow4: "hover",
      shadow5: "hover",
      shadow6: "hover",
      shadow7: "hover",
      shadow8: "hover",
      shadow9: "hover",
      shadow10: "hover",
      shadow11: "hover",
      shadow12: "hover",
      shadow13: "hover",
      dialogVisible: false,
      dialogVisiblefapiao: false,
      dialogVisibletianbao: false,
      dialogVisiblexunjian: false,
      dialogVisiblezichan: false,
      dialogVisiblewupin: false,
      dialogVisibleshijian: false,
      dialogVisibleshoufang: false,
    };
  },
  methods: {
    changeSide(n) {
      this.$store.state.sidebar_id = n;
    },
    // hasPerm(name) {
    //     return this.userinfo.func_names.indexOf(name) > -1;
    // },
    getQ() {
      const func_names = this.userinfo.func_names;
      if (func_names.indexOf("内容发布") !== -1) {
        this.zhanshiUrl = "/article/article-info";
        this.shadow = "hover";
      } else {
        this.zhanshiUrl = "/article/article-info";
        this.zhanshiColor = true;
        this.shadow = "never";
      }
      if (func_names.indexOf("考试") !== -1) {
        this.shadow1 = "hover";
      } else {
        this.kaoshiColor = true;
        this.shadow1 = "never";
      }
      if (func_names.indexOf("问卷") !== -1) {
        this.wenjuanUrl = "/wenjuan/shijuan";
        this.shadow2 = "hover";
      } else {
        this.wenjuanUrl = "/article/zhanshi-shuoming";
        this.wenjuanColor = true;
        this.shadow2 = "never";
      }
      if (func_names.indexOf("测评") !== -1) {
        this.cepingUrl = "/ceping/ceping";
        this.shadow3 = "hover";
      } else {
        this.cepingUrl = "/article/zhanshi-shuoming";
        this.cepingColor = true;
        this.shadow3 = "never";
      }
      if (func_names.indexOf("发票") !== -1) {
        this.shadow4 = "hover";
      } else {
        this.fapiaoColor = true;
        this.shadow4 = "never";
      }
      if (func_names.indexOf("填报") !== -1) {
        this.tianbaoUrl = "/tianbao/tbindex";
        this.shadow5 = "hover";
      } else {
        this.tianbaoUrl = "/article/zhanshi-shuoming";
        this.tianbaoColor = true;
        this.shadow5 = "never";
      }
      if (func_names.indexOf("巡检") !== -1) {
        this.xunjianUrl = "/home/xunjian/renwu";
        this.shadow6 = "hover";
      } else {
        this.xunjianUrl = "/article/zhanshi-shuoming";
        this.xunjianColor = true;
        this.shadow6 = "never";
      }
      if (func_names.indexOf("固定资产") !== -1) {
        this.zichanUrl = "/zichan/ZiChanXinXi";
        this.shadow7 = "hover";
      } else {
        this.zichanUrl = "/article/zhanshi-shuoming";
        this.zichanColor = true;
        this.shadow7 = "never";
      }
      if (func_names.indexOf("物品领用") !== -1) {
        this.wupinUrl = "/items/items_request";
        this.shadow8 = "hover";
      } else {
        this.wupinUrl = "/article/zhanshi-shuoming";
        this.wupinColor = true;
        this.shadow8 = "never";
      }
      if (func_names.indexOf("系统设置") !== -1) {
        this.xitongUrl = "/system/BuMenRenYuanGuanLi";
        this.shadow9 = "hover";
      } else {
        this.xitongUrl = "/article/zhanshi-shuoming";
        this.xitongColor = true;
        this.shadow9 = "never";
      }

      if (func_names.indexOf("受访") !== -1) {
        this.shadow11 = "hover";
      } else {
        this.shoufangColor = true;
        this.shadow11 = "never";
      }
    },
    kaoshishow() {
      const func_names = this.userinfo.func_names;
      this.$store.state.sidebar_id = 2;
      if (func_names.indexOf("考试") !== -1) {
        this.dialogVisible = true;
      } else {
        this.dialogVisible = false;
        this.$router.push("/article/zhanshi-shuoming");
      }
    },
    fapiaoshow() {
      const func_names = this.userinfo.func_names;
      this.$store.state.sidebar_id = 5;
      if (func_names.indexOf("发票") !== -1) {
        this.dialogVisiblefapiao = true;
      } else {
        this.dialogVisiblefapiao = false;
        this.$router.push("/article/zhanshi-shuoming");
      }
    },
    tianbaoshow() {
      const func_names = this.userinfo.func_names;
      this.$store.state.sidebar_id = 6;
      if (func_names.indexOf("填报") !== -1) {
        this.dialogVisibletianbao = true;
      } else {
        this.dialogVisibletianbao = false;
        this.$router.push("/article/zhanshi-shuoming");
      }
    },
    zichanshow() {
      const func_names = this.userinfo.func_names;
      this.$store.state.sidebar_id = 8;
      if (func_names.indexOf("固定资产") !== -1) {
        this.dialogVisiblezichan = true;
      } else {
        this.dialogVisiblezichan = false;
        this.$router.push("/article/zhanshi-shuoming");
      }
    },
    wupinshow() {
      const func_names = this.userinfo.func_names;
      this.$store.state.sidebar_id = 9;
      console.log(this.$store.state.sidebar_id);
      if (func_names.indexOf("物品领用") !== -1) {
        this.dialogVisiblewupin = true;
      } else {
        this.dialogVisiblewupin = false;
        this.$router.push("/article/zhanshi-shuoming");
      }
    },
    shijianshow() {
      const func_names = this.userinfo.func_names;
      this.$store.state.sidebar_id = 11;
      if (func_names.indexOf("任务督办") !== -1) {
        this.dialogVisibleshijian = true;
      } else {
        this.dialogVisibleshijian = false;
        this.$router.push("/article/zhanshi-shuoming");
      }
    },
    renlishow(){
      const func_names = this.userinfo.func_names;
      this.$store.state.sidebar_id = 13;
      if (func_names.indexOf("人力管理") !== -1) {
        this.dialogVisibleshijian = true;
      } else {
        this.dialogVisibleshijian = false;
        this.$router.push("/article/zhanshi-shuoming");
      }

    },
    danganshow(){
      const func_names = this.userinfo.func_names;
      this.$store.state.sidebar_id = 14;
      if (func_names.indexOf("档案管理") !== -1) {
        this.dialogVisibleshijian = true;
      } else {
        this.dialogVisibleshijian = false;
        this.$router.push("/article/zhanshi-shuoming");
      }
    },
    shoufangshow() {
      const func_names = this.userinfo.func_names;
      this.$store.state.sidebar_id = 12;
      if (func_names.indexOf("受访") !== -1) {
        this.dialogVisibleshoufang = true;
      } else {
        this.dialogVisibleshoufang = false;
        this.$router.push("/shoufangs/lfdj-shuoming");
      }
    },
    async sendDaiBanMessage() {
      let params = {
        template_id: "FT204884904327495680",
        zhixingren_id: this.userinfo.pk,
      };
      let res = await getList("data", params);
      for (const item of res) {
        let days = moment(item.task_endtime).diff(
          moment().format("yyyy-MM-DD"),
          "days"
        );
        if (days <= 3 && days > 0) {
          this.$http.post("mailbox/", {
            title: "任务督办提醒",
            content: `您的待办任务“${item.task_name}”,距离结束还有${days}天，请及时处理！`,
            user: this.userinfo.pk,
            is_read: false,
          });
        }
      }
    },
    async sendMessage() {
      let params = {
        template_id: "FT204884904327495680",
        faqiren_id: this.userinfo.pk,
      };
      let res = await getList("data", params);
      for (const item of res) {
        if (item.task_status == "完成") {
          this.$http.post("mailbox/", {
            title: "任务督办提醒",
            content: `您发起的${item.task_name}任务已${item.task_status}`,
            user: item.faqiren_id,
            is_read: false,
          });
        }
      }
    },
  },
  computed: {
    ...mapState(["userinfo"]),
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  mounted() {
    this.sendDaiBanMessage();
    this.sendMessage();
  },
  created() {
    this.getQ();
    this.$store.state.sidebar_id = 13;
    this.$router.push("/renliguanli/yuangongxinxitongji");
  },
};
</script>

<style>
.nav-card-group .el-card__body {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}
</style>

<style scoped>
span {
  color: #fff;
}
.el-card {
  margin-bottom: 30px;
  height: 120px;
  text-align: center;
  cursor: pointer;
  background-color: #f2f6fc;
  margin-right: 20px;
  /*background-image: url('../../assets/img/img.jpg');*/
}
.el-card i {
  font-size: 30px;
  margin-left: 30px;
  margin-right: 30px;
}
.el-card span {
  font-size: 20px;
}
.zhanshibg {
  /*background-color: #CEE1FDFF;*/
  color: #fff;
  background-image: linear-gradient(to right, #ffecd2, #fcb69f);
}
.kaoshibg {
  background-image: linear-gradient(to left, #ff9a9e, #fad0c4);
}
.wenjuanbg {
  background-image: linear-gradient(to right, #ff9a9e, #ff8c7f);
}
.cepingbg {
  background-image: linear-gradient(
    to right,
    #ff8177 0%,
    #ff867a 0%,
    #ff8c7f 21%,
    #f99185 52%,
    #cf556c 78%,
    #b12a5b 100%
  );
}

.fapiaobg {
  background-image: linear-gradient(to right, #f3e5f5, #ce93d8);
}
.tianbaobg {
  background-image: linear-gradient(to right, #ce93d8, #ea80fc);
}
.xunjianbg {
  background-image: linear-gradient(to right, #ea80fc, #d500f9);
}
.zichanbg {
  background-image: linear-gradient(to right, #d500f9, #4a148c);
}

.wupinbg {
  background-image: linear-gradient(to right, #e1f5fe, #81d4fa);
}
.xitongbg {
  background-image: linear-gradient(to right, #81d4fa, #29b6f6);
}
.shijianbg {
  background-image: linear-gradient(to right, #29b6f6, #01579b);
}
.shoufang {
  background-image: linear-gradient(to right, #1795ce, #012846);
}
.danganbg {
  background-image: linear-gradient(to right, #eea07e, #e76c6c);
}

.nocolor {
  background-color: #f2f6fc;
  color: #b4b0b4;
}
</style>
