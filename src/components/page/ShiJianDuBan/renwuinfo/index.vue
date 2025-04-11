<template>
  <div class="taskinfo" v-loading="loading">
    <div class="header">
      <div class="title">{{taskObj.task_name}} </div>
      <div style="margin: 20px 10px"><van-button type="primary" round  size="mini" @click="goAllTask">任务统计</van-button></div>
    </div>
    <div class="center">
      <div style="padding: 10px 10px">
      <el-row style="padding: 3px 0px">
<!--        <el-col :span="12">-->
<!--          任务名称: {{ taskObj.task_name }}-->
<!--        </el-col>-->
        <el-col :span="12">
          任务类型: {{ taskObj.task_type }}
        </el-col>
        <el-col :span="12">
          任务状态: {{ taskObj.task_status }}
        </el-col>
      </el-row>
        <el-row style="padding: 3px 0px">
          <el-col :span="12">
            执行人: {{ taskObj.zhixingren }}
          </el-col>
          <el-col :span="12">
            优先级: {{ taskObj.level }}
          </el-col>
        </el-row>
        <el-row style="padding: 3px 0px">
          <el-col :span="12">
            任务时限: {{ taskObj.task_endtime }}
          </el-col>
          <el-col :span="12">
            创建时间: {{ moment(taskObj.create_time).format("yyyy-MM-DD HH:mm") }}
          </el-col>
        </el-row>
        <el-row style="padding: 3px 0px">
          <el-col :span="12" class="renwudesc">
            任务描述: {{ taskObj.task_content }}
          </el-col>
          <el-col :span="12" >
            附件: <span @click="downLoadFile(taskObj.fujian)">{{ taskObj.fujian ? '查看/预览' : '暂未上传附件' }}</span>
          </el-col>
        </el-row>
      </div>

    </div>
    <div class="jindu">
      <van-steps direction="vertical" :active="data.length-1"  active-color="#07c160" inactive-color="#07c160">
        <van-step v-for="item in data" :key="item.pk">
          <h3>【{{item.next_task_status}}】{{item.zhixingren}}</h3>
          <div class="comments">处理意见：{{item.make_idea}}</div>
          <p>
            <span v-if="item.make_time">{{moment(item.make_time).format('yyyy-MM-DD HH:mm:ss')}}</span>
            <span v-else style="display:block;min-height:16px"> </span>
          </p>
        </van-step>

      </van-steps>
    </div>
  </div>
</template>

<script>
import { getList, createObj, getObj, updateObj, deleteObj } from "@/resource";
import moment from "moment";
export default {
  data() {
    return {
      id: null,
      loading: false,
      data: [],
      total: 0,
      taskObj: {},
    };
  },
  methods: {
    //查看附件
    downLoadFile(file) {
      window.open(file)
    },
    // 任务统计
    goAllTask(){
      this.$router.push({
        path: "/renwuliebiao",
      })
    },
    moment,
    async loadData() {
      this.loading = true;
      let params = {
        template_id: "FT210655946362568704",
        task_id: this.id,
        o: "-make_time",
      };
      let res = await getList("data", params);
      console.log(res)
      this.data = res.reverse();
      this.total = res.length;
      let res2 = await getObj("data", this.id, {
        template_id: "FT204884904327495680",
      });
      console.log(res2)
      this.taskObj = res2;
      this.loading = false;
    },
  },
  created() {
    this.id = this.$route.query.id;
    this.$router.push({
      path: "/log",
    });
  },
  mounted() {
    this.id = this.$route.query.id;
    this.loadData();
  },
};
</script>

<style lang="scss" scoped>
.taskinfo{
  min-height:100vh;
  background-color: #f5f5f5;
}
.header{
  height: 130px;
  background-color: #7ba0f9;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .title {
    font-size: 18px;
    line-height: 1.6;
    padding: 20px 10px 10px 10px;
    color: #ffffff;
    text-align: left;
  }
}

.center{
  height: 150px;
  background-color: #ffffff;
  width: 90%;
  position: absolute;
  top: 75px;
  left: 5%;
  border-radius: 15px;
  z-index: 1;
  font-size: 14px;
}
.jindu{
  width: 90%;
  border-radius: 15px;
  overflow: auto;
  margin: 110px auto 10px;
  margin-bottom: 20px !important;
}
.renwudesc{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.comments{
    font-size: 14px;
    margin:7px 0 7px 7px;
}
::v-deep .van-step__circle-container{
  top:18px
}
</style>

<style>
    #app {
        min-width: 0;
        width: 100%;
    }
</style>