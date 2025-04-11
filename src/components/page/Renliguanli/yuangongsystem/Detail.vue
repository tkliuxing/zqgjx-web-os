<template>
  <div class="RenYuanXinXi" ref="form">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span v-if="customerinfo && customerinfo.name">{{ customerinfo.name || "" }}・个人信息</span>
        <!--        <el-button type="primary" style="float: right;margin-left: 10px" size="mini" @click="()=>{this.$router.go(-1)}">返回</el-button>-->
        <!--        <el-button v-if="showEdit" type="primary" style="float: right;" size="mini" @click="toEdit">编辑-->
        <!--        </el-button>-->
      </div>
      <el-row :gutter="10" v-if="customerinfo">
        <el-col :span="5">
          <img v-if="customerinfo.photo" :src="JSON.parse(customerinfo.photo).file" style="margin-left: 30px;width: 208px;
                          height: 291px;
                          border: 1px solid #ddd;
                          text-align: center;
                          box-sizing: border-box;
                        " alt=""/>
          <div v-else style="
                          margin-left: 30px;
                          width: 208px;
                          height: 291px;
                          line-height: 291px;
                          border: 1px solid #ddd;
                          text-align: center;
                          box-sizing: border-box;
                        ">
            照片未上传
          </div>
          <div class="nameinfo">
            <el-descriptions :column="1" size="medium">
              <el-descriptions-item label="部　　门" label-class-name="nameinfo-label">{{ get_department_option_data_display(customerinfo.department) || "" }}
              </el-descriptions-item>
              <el-descriptions-item label="编　　号" label-class-name="nameinfo-label">
                <template v-if="customerinfo">
                  {{ customerinfo.bianhao || "" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="姓　　名" label-class-name="nameinfo-label">
                <template v-if="customerinfo && customerinfo.name">
                  {{ customerinfo.name }}
                </template>
                <template v-else>
                  {{ user.full_name || "-" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="性　　别" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.gender || "" }}
                </template>
              </el-descriptions-item>
               <el-descriptions-item label="年　　龄" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.nianling || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="身份证号" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.id_card || "-" }}
                </template>
              </el-descriptions-item>

            </el-descriptions>
          </div>

        </el-col>
        <el-col :span="18">

          <div class="text-info">
            <el-descriptions :column="3" size="medium" title="基本信息">
              <el-descriptions-item label="民　　族" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.nation || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="出生日期" label-class-name="nameinfo-label">
                <template>
                  {{ moment(customerinfo.birthday).format("YYYY年MM月DD日") || "-" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="婚姻状况" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.marital_status || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="政治面貌" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.mianmao || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="入党时间" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.rudang_date || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="电　　话" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.phone || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="现居地址" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.address || "---" }}
                </template>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-divider></el-divider>
          <div class="text-info">
            <el-descriptions :column="3" size="medium" title="工作情况">
              <el-descriptions-item label="参工时间" label-class-name="nameinfo-label">
                <template >
                  {{ customerinfo.ruzhi_date || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="职　　务" label-class-name="nameinfo-label">
                <template >
                  {{ customerinfo.yn_zw || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="职务获取时间" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.yn_zw_date || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="首次合同期限" label-class-name="nameinfo-label">
                <template v-if="customerinfo.shouci && customerinfo.ht_end_date">
                  {{ customerinfo.shouci || "---" }} - {{ customerinfo.ht_end_date || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="续聘期限" label-class-name="nameinfo-label">
               <template v-if="customerinfo.xupin && customerinfo.xp_end_date">
                  {{ customerinfo.xupin || "---" }} - {{ customerinfo.xp_end_date || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="聘　　期" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.pinqi || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="聘用方式" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.pinyongfangshi || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="是否在职" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.zaizhi || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="职　　称" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.zhicheng || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="职称取得时间" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.zc_date || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="聘任岗位（职务）" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.zhiwu || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="聘岗取得时间" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.zw_date || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="行政职务" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.xingzhengzhiwu || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="行政职务取得时间" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.xzzw_date || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="实配职数" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.shipeizhishu || "---" }}
                </template>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-divider></el-divider>
          <div class="text-info">
            <el-descriptions :column="3" size="medium" title="学历信息">
              <el-descriptions-item label="最高学历" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.education || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="最高学历毕业院校" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.byyx_s_2 || "---" }}
                </template>

              </el-descriptions-item>
              <el-descriptions-item label="最高学历毕业时间" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.biyedate || "---" }}
                </template>

              </el-descriptions-item>
              <el-descriptions-item label="最高学历学位" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.xuewei || "---" }}
                </template>

              </el-descriptions-item>
              <el-descriptions-item label="全日制学历" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.fulltime_education || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="全日制学历毕业院校" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.byyx_s_1 || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="全日制学历毕业时间" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.qrz_date || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="全日制学历专业" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.qrz_zhuanye || "---" }}
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="全日制学历学位" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.qrz_xuewei || "---" }}
                </template>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-divider></el-divider>
          <div class="text-info">
            <el-descriptions :column="1" size="medium" title="其他信息">
              <el-descriptions-item label="备注" label-class-name="nameinfo-label">
                <template>
                  {{ customerinfo.beizhu || "---" }}
                </template>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-divider></el-divider>
          <div class="text-info">
            <div class="zsHeader">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 20px">
                证明材料
              </div>
              <div>
                <TableFileView isCustomName :category="category" :isType="true" :file-list="customerinfo.fujian"></TableFileView>
<!--                <div v-for="(item,index) in zhengShuList" :key="index">-->
<!--                  <div class="zs-left">-->
<!--                    <el-image style="width: 100px; height: 100px" :src="item.image_url" :preview-src-list="[item.image_url]">-->

<!--                    </el-image>-->
<!--                  </div>-->
<!--                  <div class="zs-right">-->
<!--                    <div>{{ item.name }}</div>-->
<!--                    &lt;!&ndash; <div>级别：{{ item.level }}</div>-->
<!--                      <div>颁发单位：{{ item.banfadanwei }}</div> &ndash;&gt;-->
<!--                  </div>-->
<!--                </div>-->
              </div>
            </div>
          </div>


        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import {mapState} from "vuex";
import hjqk from "@/assets/img/dangan/06.png";
import zlqk from "@/assets/img/dangan/07.png";
import bzqk from "@/assets/img/dangan/08.png";
import lwqk from "@/assets/img/dangan/09.png";
import {getList, getObjFromList} from "@/resource";
import moment from "moment";
import TableFileView from "@/components/common/TableFileView.vue";
// import gwfb from "../../../../public/img/方形/01方形.png";

export default {
  model: {
    prop: "form"
  },
  props: {
    form: Object,
  },
  data() {
    return {
      alluser: [], // 所有用户
      customerinfo: null,
      infohuojiangdialogVisible: false, // 获奖登记
      infozhuanlidialogVisible: false, // 专利登记
      infobiaozhundialogVisible: false, // 标准登记
      infolunwendialogVisible: false, // 论文登记
      infozhuzuodialogVisible: false, // 著作登记
      user: {
        avatar: null,
      },
      formDialogVisable: false,

      zhengShuList: [],
      zhengshuListPreview: [],
      nkMineData: [],
      nKMineCount: "-",
      nKMineTotalFee: "-",
      nkTaskData: [],
      XiangMuList: [],
      HuoJiangList: [],
      ZhuangLiList: [],
      BiaoZhunList: [],
      LunWenList: [],
      ZhuZuoList: [],
      nkFaQiData: [],
      nKFaQicount: 0,
      kyFaQicount: 0,
      jiaData: [],
      kydone: 0,
      loading_db: false,
      nKFaQiFee: "-",
      leftlist: [
        {
          text: "获奖情况",
          bgc: "#2e71da",
          width: "125px",
          height: "40px",
          color: "#ffffff",
          count: 1,
          data: 0,
          icon: hjqk,
        },
        {
          text: "专利",
          bgc: "#ee7f13",
          width: "125px",
          height: "40px",
          color: "#ffffff",
          count: 2,
          data: 0,
          icon: zlqk,
        },
        {
          text: "标准",
          bgc: "#56b980",
          width: "125px",
          height: "40px",
          color: "#ffffff",
          count: 3,
          data: 0,
          icon: bzqk,
        },
        {
          text: "论文",
          bgc: "#d82d35",
          width: "125px",
          height: "40px",
          color: "#ffffff",
          count: 4,
          data: 0,
          icon: lwqk,
        },
        {
          text: "著作",
          bgc: "#ffcc00",
          width: "125px",
          height: "40px",
          color: "#ffffff",
          count: 5,
          data: 0,
          icon: lwqk,
        },
      ],
      rightlist: [
        {
          text: "我的待办",
          bgc: "#d3e1ee",
          width: "150px",
          height: "40px",
          color: "#000",
          countColor: "#000",
          count: 12,
          icon: hjqk,
        },
        {
          text: "我的发起",
          bgc: "#d3e1ee",
          width: "150px",
          height: "40px",
          color: "#000",
          countColor: "#000",
          count: 35,
          icon: hjqk,
        },
        {
          text: "我完成的",
          bgc: "#d3e1ee",
          width: "150px",
          height: "40px",
          color: "#000",
          countColor: "#000",
          count: 105,
          icon: hjqk,
        },
      ],
      feiyong_data: {},
      project_list: [
        // {
        //   title: "我发起的",
        //   icon: gwfb,
        //   pk: this.CVARS.LIUCHENG_ID.FA_WEN_GAO_ZHI,
        //   index: 1,
        //   type: "zhc",
        // },
        // {
        //   title: "我参与的",
        //   icon: gwfb,
        //   pk: this.CVARS.LIUCHENG_ID.FA_WEN_GAO_ZHI,
        //   index: 1,
        //   type: "zhc",
        // },
      ],
      department_option_data: [],
      moment: moment,
      category: null,
    };
  },
  computed: {
    ...mapState(["userinfo", "token"]),
  },
  components: {TableFileView},
  methods: {
    get_department_option_data_display(value) {
      let option = this.department_option_data.filter((item) => {
        return item.pk === value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    async getLocalDataSource() {
      this.department_option_data = await getList("flatdepartment", {});

      let fujian = await getObjFromList(`basetree`, {'name':'人力-附件类型',isroot:true, org_id:this.userinfo.org_id });
      this.category = fujian.items;
    },

  },
  async mounted() {
    this.getLocalDataSource();
    this.customerinfo = {...this.form};
  },
};
</script>
<style lang="scss" scoped>
.zsHeader {
  box-sizing: border-box;
  font-size: 14px;
  color: #303133;

  .zs {
    display: flex;
    flex-direction: row;
    overflow: scroll;
    margin: 20px;

    .zs-left {
      // flex: 1;
      width: 140px;
      display: flex;
      justify-content: center;
    }

    .zs-right {
      width: 140px;
      // flex: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 10px;

      div {
        width: 120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }
    }
  }
}

.daiban-list {
  padding: 0;
  height: 274px;
  overflow-y: scroll;

  li {
    padding: 5px;
    cursor: pointer;
    border-bottom: 1px dotted #ffffff;
    box-sizing: border-box;

    .name {
      color: #515151;
      margin-right: 10px;
    }

    .time {
      float: right;
      color: #8c939d;
    }

    &:hover {
      color: #2d8cf0;
      border-bottom: 1px dotted #2d8cf0;

      & .name,
      & .time {
        color: #2d8cf0;
      }
    }
  }
}

.navigator-right-content {
  background: #fff;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0;
  box-sizing: border-box;
}

.navigator-right-item {
  box-sizing: border-box;
  cursor: pointer;
  padding: 10px;
}

.navigator-right-item div:first-child {
  font-size: 20px;
  color: #fff;
}

.navigator-right-item div:last-child > span {
  font-size: 30px;
  color: #fff;
  font-weight: bold;
}

.navigator-right-item div:last-child span:last-child {
}

.navigator-one {
  background: url("../../../../assets/img/zhtj01.png");
  width: 246px;
  height: 96px;
}

.navigator-two {
  background: url("../../../../assets/img/zhtj02.png");
  width: 246px;
  height: 96px;
}

.navigator-three {
  background: url("../../../../assets/img/zhtj03.png");
  width: 246px;
  height: 96px;
}

.navigator-four {
  background: url("../../../../assets/img/zhtj04.png");
  width: 246px;
  height: 96px;
}

.text-info {
  margin-top: 20px;
}
</style>
<style>
.RenYuanXinXi {
  width: 100%;
  position: relative;
  /*top: -70px;*/
}

.RenYuanXinXi .nameinfo {
  box-sizing: border-box;
  padding-left: 30px;
  margin-top: 30px;
}

.RenYuanXinXi .nameinfo-label {
  text-align: justify;
  color: #7a85ac;
}

.quick-nav-content {
  display: flex;
  background: #fff;
  align-items: center;
  justify-content: flex-start;
  min-height: 92px;
  flex-wrap: wrap;
  width: 608px;

  .split {
    width: 100%;
    margin: 5px 0;
    border-left: 5px solid #0a84ff;
    padding-left: 10px;
  }
}

.quick-nav-content-item {
  box-sizing: border-box;
  /* padding: 8px 15px 8px; */
  padding: 6px 13px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  /* border: 1px dotted #ffffff; */
  border: 1px dotted #0f4d8a;
  border-radius: 5px;
  margin-right: 10px;
}

.quick-nav-content-item:hover {
  border: 1px dotted #aaaaaa;
}

.quick-nav-content-item img {
  margin: 0 auto;
}

.quick-nav-content-item-title {
  margin: 10px 0 0;
  width: 70px;
  text-align: center;
}

.itemTitle {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
}

.itemTitle::before {
  content: " ";
  border: 1px solid #329afc;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  position: relative;
  background: #329afc;
  display: inline-block;
}

.image-slot {
  /* font-size: 90px; */
  line-height: 60px;
}
</style>
