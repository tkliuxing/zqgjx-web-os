<template>
  <div>
    <div class="headers">
      <span class="title" style="margin-left: 5px">业务办理</span>
      <div class="liebiao">
        <span v-for="(item,index) in liebiao" :key="index" class="liebiao_item">
          <div style="display: flex;justify-content: space-between;padding: 10px 15px" :style="{ backgroundColor: item.backgroundColor }">
            <div class="left" style="display: flex;flex-direction: column">
              <span style="color: #ffffff">{{ item.value }}</span>
              <span style="color: #ffffff">{{ item.label }}</span>
            </div>
            <div class="right">
              <img :src="item.img" alt="" style="width: 40px">
            </div>
          </div>
        </span>
      </div>
    </div>
    <div class="wanchengqingkuang">
      <span class="title" >完成情况</span>
      <div style="margin-top: 10px">
        <div v-for="(item,index) in type" :key="index" style="padding: 20rpx 0">
          <van-progress  :color="customColors[index].color" :percentage="item.percentage"></van-progress>
          <span class="leixing">{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="yichang">
      <span class="title">异常情况</span>
      <div style="margin-top: 10px">
        <div style="display: flex;justify-content: space-between;">
          <span class="flex_item" v-for="(item,index) in abnormal" :key="index">
            {{ item.name }}:    {{ item.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getList, getObjFromList} from "@/mobile/resource";
import moment from "moment";
const TEMPLATE_ID = "FT204884904327495680";
import { mapState } from "vuex";
import Vue from 'vue';
import { Progress } from 'vant';

Vue.use(Progress);
export default {
  name: "renwuliebiao",
  data(){
    return{
      loading:false,
      liebiao:[
        {value:0,label:'我的发起',img:require('@/assets/img/renwuduban_tongji/faqi.png'),backgroundColor:'#568af7'},
        {value:0,label:'我的待办',img:require('@/assets/img/renwuduban_tongji/daiban.png'),backgroundColor:'#fb882f'},
        {value:0,label:'我的已办',img:require('@/assets/img/renwuduban_tongji/yiban.png'),backgroundColor:'#17cca1'},
        {value:0,label:'延期任务',img:require('@/assets/img/renwuduban_tongji/yanqi.png'),backgroundColor:'#02aef8'},
      ],
      type: null, // 任务类型
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      abnormal:[        // 异常情况
        {name:'将到期',value:0},
        {name:'已延期',value:0},
        {name:'终止',value:0},
      ]
    }
  },
  computed: {
    ...mapState(["userinfo",'token'])
  },
  mounted() {

    if(!this.token){
      this.$router.push({
        path: "/log",
      })
    }
    this.getRenwu();
  },
  methods:{
    async getRenwu(){
      this.loading = true;
      // 我的发起
      let params_faqi = {
        template_id: TEMPLATE_ID,
        faqiren_id: this.userinfo.pk,
      };
      let res = await getList("data", params_faqi);
      res.forEach(item=>{
        // 异常情况 终止
        if(item.task_status == '终止'){
          this.abnormal[2].value += 1;
        }
      })
      this.liebiao[0].value = res.length;
      // 我的待办
      let params_daiban = {
        template_id: TEMPLATE_ID,
        zhixingren_id: this.userinfo.pk,
      }
      let res1 = await getList("data", params_daiban);
      res1.forEach(item=>{
        if(item.task_status != '完成'){
          this.liebiao[1].value += 1;
        }
      })
      // 我的已办
      let params_yiban = {
        template_id: TEMPLATE_ID,
        zhixingren_id: this.userinfo.pk,
      }
      let res3 = await getList("formdatareport/5854", params_yiban);
      this.liebiao[2].value = res3.data[0].count;

      // 延期任务
      res.forEach(item=>{
        let date = moment(new Date().getTime()).format("YYYY-MM-DD");
        if(item.task_endtime < date){
          this.liebiao[3].value += 1;
          // 异常情况 已延期
          this.abnormal[1].value += 1;
        }

        let endDate = moment(new Date().getTime() + 3 * 24*60*60*1000).format('YYYY-MM-DD');
        // 异常情况 到期
        if(item.task_endtime < endDate && item.task_endtime >= date){
          this.abnormal[0].value += 1;
        }
      })
      // 任务类型
      let type = await getObjFromList("basetree", { name: "任务类型" ,org_id:0});
      console.log(type,'type')
      if(type.items.length>0){
        this.type = type.items;
      }
      console.log(this.type)
      this.type.forEach(item=>{
        let data = res.filter(i=>i.task_type == item.name && i.task_status == "完成");
        item.percentage =  Number(((data.length / res.length) * 100).toFixed(1))
      })

      this.loading = false;
    },
  }
}
</script>

<style scoped lang="scss">
.headers{
  width: 95%;
  padding: 10px;
}
.title{
  font-size: 18px;
  color: #000000;
}
.liebiao{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}
.liebiao_item{
  width: 45%;
  margin:5px;
  border-radius: 10px;
  overflow: hidden;
}
.wanchengqingkuang{
  background-color: #ffffff;
  padding: 10px 10px;
  margin: 0 10px;
}
.leixing{
  margin-top:12px;
  display: block;
}
.van-progress{
  padding: 1px 0;
  margin-top: 7px;
}
.yichang{
  padding: 10px;
  background-color: #ffffff;
  margin: 10px 10px 0 10px;
}
</style>