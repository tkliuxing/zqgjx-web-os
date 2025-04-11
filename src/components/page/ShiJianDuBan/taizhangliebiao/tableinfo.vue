<template>
  <div style="height:300px">
    <div style="float:left">
      <el-descriptions :model='form' ref="form" class="margin-top" :column="2" :size="size" border>
        <template slot="extra">
        </template>
        <el-descriptions-item>
          <template slot="label">
            <!-- <i class="el-icon-user"></i> -->
            任务名称
          </template>
          {{form.task_name}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <!-- <i class="el-icon-mobile-phone"></i> -->
            任务类型
          </template>
          {{form.task_type}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <!-- <i class="el-icon-location-outline"></i> -->
            任务状态
          </template>
          {{form.task_status}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <!-- <i class="el-icon-tickets"></i> -->
            执行人
          </template>
          {{form.zhixingren}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <!-- <i class="el-icon-office-building"></i> -->
            优先级
          </template>
          {{form.level}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <!-- <i class="el-icon-office-building"></i> -->
            任务描述
          </template>
          {{form.task_content}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <!-- <i class="el-icon-office-building"></i> -->
            创建时间
          </template>
          {{moment(form.create_time).format('yyyy-MM-DD HH:mm')}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <!-- <i class="el-icon-office-building"></i> -->
            任务时限
          </template>
          {{form.task_endtime}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <!-- <i class="el-icon-office-building"></i> -->
            附件
          </template>
          <template>
            <el-link v-if="form.fujian" :href="form.fujian" icon="el-icon-download">
              下载
            </el-link>
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="jindu" v-if="data.length > 0">
      <h4 style="line-height: 30px;margin-bottom: 20px;">
        <i class="el-icon-info" style="color:#409EFF;margin-right:10px;"></i>
        流程进度
      </h4>
      <el-timeline :reverse="false" style="margin-top:5px;">
        <el-timeline-item v-for="(row, index) in data" :key="index" :color="row.color" style="margin:10px 0;">
          <div style="display:flex;flex-direction: row">
            <el-tag v-if="row.next_task_status">{{ row.next_task_status }}</el-tag>
            <span v-if="row.zhixingren" style="margin-left:5px">{{ row.zhixingren }}</span>
          </div>
          <div style="display: flex;flex-direction: column">
            <span v-if="row.make_idea" style="float:left">处理意见:{{row.make_idea}}</span>
            <span v-if="row.make_time" style="float:left;font-size:12px;color:gray">{{moment(row.make_time).format('yyyy-MM-DD HH:mm:ss')}}</span>
          </div>
        </el-timeline-item>
      </el-timeline>

    </div>
  </div>
</template>
<script>
//
// TEMPLATE_ID: FT204884904327495680
// 字段说明:
// task_id:任务编号
// task_name:任务名称
// task_type:任务类型
// task_status:任务状态
// fuzeren_name:负责人
// fuzeren_id:负责人ID
// zhixing_department:执行部门
// department_id:部门ID
// zhixingren:执行人
// zhixingren_id:执行人ID
// level:优先级
// task_content:任务描述
// create_time:创建时间
// task_endtime:任务时限
// fujian:附件
import { mapState } from "vuex";
import { verifyMobile, verifyEmail, verifyIdCard } from "@/utils/verify.js";
import {getList, getObj, getObjFromList} from "@/resource";
import moment from "moment";
import { BASE_HOST } from "@/constvars";
export default {
  name: "Form",
  model: {
    prop: "form",
  },
  props: {
    form: Object,
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["userinfo"]),
  },
  data() {
    return {
      headers: {
        Authorization: null,
      },
      size: "",
      BASE_HOST: BASE_HOST,
      fileData: {
        sys_id: null,
        org_id: null,
      },
      zhixing_department_option_data: null,
      user_option_data: [],
      priority: [],
      status: [],
      type: [],
      verifyMobile,
      verifyEmail,
      verifyIdCard,
      loading: false,
      data: [],
      total: 0,
      taskObj: {},
    };
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(newval) {
        newval.map((item) => {
          item.color = "#0bbd87";
        });
      },
    },
  },
  methods: {
    moment,
    async loadData() {
      console.log("dada");
      this.loading = true;
      let params = {
        template_id: "FT210655946362568704",
        task_id: this.form.pk,
        o: "-make_time",
      };
      let res = await getList("data", params);
      this.data = res.reverse();
      this.total = res.length;
      let res2 = await getObj("data", this.form.pk, {
        template_id: "FT204884904327495680",
      });
      this.taskObj = res2;
      this.loading = false;
    },
    async getLocalDataSource() {
      this.headers.Authorization = "Bearer " + this.$store.state.token;
      this.fileData.sys_id = this.$store.state.sys_id;
      this.fileData.org_id = this.$store.state.userinfo.org_id;
      let res6 = await getList("flatdepartment", {});
      this.zhixing_department_option_data = res6;
      let res7 = await getList("usermin", {});
      this.user_option_data = res7;
      let res8 = await getObjFromList("basetree", { parent_name: "任务优先级" ,org_id: 0});
      this.priority = res8;
      let res1 = await getObjFromList("basetree", { parent_name: "任务状态" ,org_id: 0});
      this.status = res1;
      let res2 = await getObjFromList("basetree", { parent_name: "任务类型" ,org_id: 0});
      this.type = res2;
    },
  },
  async mounted() {
    await this.loadData();
  },
  async created() {
    await this.getLocalDataSource();
  },
};
</script>
<style scoped>
::v-deep .el-timeline-item__tail {
  height: 120% !important;
  left: 5px;
}
::v-deep .el-timeline-item__node--normal{
  left: 0px;
}
::v-deep .el-timeline-item{
  padding-bottom: 0px;
}
.jindu {
  height: 300px;
  width: 220px;
  float: right;
  overflow-y: scroll;
}
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
