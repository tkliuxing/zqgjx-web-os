<template>
  <div class="taskinfo" v-loading="loading">
    <div class="header">
      <div class="title">{{taskObj.task_name}} </div>
      <div style="margin: 20px 10px"><van-button type="primary" round  size="small" @click="goAllTask">任务统计 ></van-button></div>
    </div>
    <div class="center">
      <div class="center-type">
        <van-row style="padding: 3px 0px">
          <van-col :span="12">
            任务类型: {{ taskObj.task_type }}
          </van-col>
          <van-col :span="12">
            任务状态: {{ taskObj.task_status }}
          </van-col>
        </van-row>
        <van-row style="padding: 3px 0px">
          <van-col :span="12">
            执行人: {{ taskObj.zhixingren }}
          </van-col>
          <van-col :span="12">
            优先级: {{ taskObj.level }}
          </van-col>
        </van-row>
        <van-row style="padding: 3px 0px">
          <van-col :span="12">
            任务时限: {{ taskObj.task_endtime }}
          </van-col>
          <van-col :span="12">
            创建时间: {{ moment(taskObj.create_time).format("yyyy-MM-DD") }}
          </van-col>
        </van-row>
        <van-row style="padding: 3px 0px">
          <van-col :span="12" class="renwudesc">
            任务描述: {{ taskObj.task_content }}
          </van-col>
          <van-col :span="12" >
            附件: <span @click="downLoadFile(taskObj.fujian)">{{ taskObj.fujian ? '查看/预览' : '暂未上传附件' }}</span>
          </van-col>
        </van-row>
      </div>

    </div>
    <div class="jindu">
      <van-steps direction="vertical" :active="data.length-1"  active-color="#07c160" inactive-color="#07c160">
        <van-step v-for="item in data" :key="item.pk">
          <h3>【{{item.next_task_status}}】{{item.zhixingren}}</h3>
          <div class="comments">处理意见：{{item.make_idea}}</div>
          <p>
            <span v-if="item.make_time" class="jindu-time">{{moment(item.make_time).format('yyyy-MM-DD HH:mm:ss')}}</span>
            <span v-else style="display:block;min-height:16px"> </span>
          </p>
        </van-step>

      </van-steps>
    </div>
  </div>
</template>

<script>
import resource from "@/mobile/resource";
import moment from "moment";
import Vue from 'vue';
import { Step, Steps,Col, Row } from 'vant';

Vue.use(Step);
Vue.use(Steps);
Vue.use(Col);
Vue.use(Row);
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
  created() {
    this.id = this.$route.query.id;
    this.loadData();

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
      let res = await resource.getList("data", params);
      this.data = res.reverse();
      this.total = res.length;
      let res2 = await resource.getObj("data", this.id, {
        template_id: "FT204884904327495680",
      });
      this.taskObj = res2;
      this.loading = false;
    },
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
.center-type{
  padding: 10px 10px;
  font-size: 16px
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
.jindu-time{
  font-size: 28rpx;
}
</style>

<style>
    #app {
        min-width: 0;
        width: 100%;
    }
</style>