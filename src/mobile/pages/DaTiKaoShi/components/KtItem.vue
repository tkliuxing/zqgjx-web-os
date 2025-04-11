<template>
  <div class="st-info" v-if="ktitem.length > 0 && questFroms.length > 0">
    <div v-for="(item, index) in ktitem" :key="index">
      <div v-if="index === count">
        <div class="cf">
          <div class="leixing" :style="{ color: color }">
            {{ item.leixing }} {{ index + 1 }}/{{ length }}
          </div>
          <div class="fr" v-if="clock">答题倒计时：{{ timeDown }}s</div>
        </div>
        <div class="title">{{ index + 1 }}、{{ item.timu }}</div>
        <div class="answer">
          <!-- 单选、判断 -->
          <van-radio-group
            v-model="questFroms[count].result"
            v-if="item.leixing === '单选' || item.leixing === '判断'"
          >
            <div v-for="(i, index) in item.choices_length" :key="index">
              <van-radio :name="index" checked-color="#e41e1e">{{itoa(index)}}.{{
                item[`xuanxiang_${index > 8 ? index + 1 : "0" + (index + 1)}`]
              }}</van-radio>
            </div>
          </van-radio-group>
          <!-- 多选 -->
          <van-checkbox-group
            v-model="questFroms[count].result"
            v-if="item.leixing === '多选'"
          >
            <div v-for="(i, index) in item.choices_length" :key="index">
              <van-checkbox
                :name="index"
                shape="square"
                checked-color="#e41e1e"
                >{{itoa(index)}}.{{
                  item[`xuanxiang_${index > 8 ? index + 1 : "0" + (index + 1)}`]
                }}</van-checkbox
              >
            </div>
          </van-checkbox-group>
          <!-- 问答 -->
          <div v-if="item.leixing === '问答'">
            <textarea
              v-model="questFroms[count].result"
              placeholder="请输入答案"
              cols="30"
              rows="10"
            ></textarea>
          </div>

        </div>
      </div>
    </div>
    <div class="card-next">
      <div class="btn-item">
        <button @click="upTab" v-if="count > 0">上一题</button>
        <button
          @click="backTab"
          v-if="count === 0"
          :style="{ borderColor: color, color: color }"
        >
          返回
        </button>
      </div>
      <div class="btn-item">
        <button v-if="isSubmit" @click="nextTab" :style="{ background: color }">
          提交试卷
        </button>
        <button v-else @click="nextTab" :style="{ background: color }">
          下一题
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { RadioGroup, Radio } from 'vant';
import { Checkbox, CheckboxGroup } from 'vant';
import resource from "@/mobile/resource";
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(RadioGroup);
export default {
  props: {
    ktitem: {
      type: Array,
      default() {
        return [];
      },
    },
    pk: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#e41e1e",
    },
  },
  data() {
    return {
      count: 0,
      questFroms: [],
      clock: null,
      totalClock: null,
      timeDown: null,
      shijuaninfo: null,
    };
  },
  async mounted() {
    this.$nextTick(function () {
      this.init();
    });
    await this.getShijuan();
    await this.timer();
    console.log(this.ktitem)
  },
  methods: {
    async getShijuan(){
      let params ={
        template_id: 'FT138149866856067072',
      }
      this.shijuaninfo = await resource.getObj('data',this.$route.query.pk,params)
      console.log(this.shijuaninfo,'12313')
    },
    itoa(index){
      return String.fromCharCode(index + 65)
    },
    // 初始化答案列表
    init() {
      let ll = [];
      for (let i = 0; i < this.ktitem.length; i++) {
        ll.push({
          shiti_id:this.ktitem[i].pk,
          result: [],
        });
      }
      this.questFroms = ll;
    },
    // 下一题
    nextTab() {
      clearInterval(this.clock);
      if (this.ktitem.length - 1 > this.count) {
        this.count++;
        this.timer();
      } else {
        clearInterval(this.totalClock);
        this.Submit();
      }
    },
    // // 上一题
    upTab() {
      let count = this.count;
      if (count >= 1) {
        this.count--;
      }
    },
    // 时间计时
    // timer() {
    //   let time = this.shijuaninfo.deadline;
    //   if (time) {
    //     this.clock = window.setInterval(() => {
    //       time--;
    //       // console.log(time);
    //       this.timeDown = time;
    //       if (time < 1) {
    //         clearInterval(this.clock);
    //         this.nextTab();
    //       }
    //     }, 1000);
    //
    //     let delay = this.shijuaninfo.delay = 5; // 设置允许的延迟时间，单位为秒
    //     if (delay) {
    //       setTimeout(() => {
    //         clearInterval(this.clock);
    //         this.nextTab();
    //       }, delay * 1000);
    //     }
    //   } else {
    //     return;
    //   }
    // },
    // 判断每道题的答题时长
    startQuestionTimer() {
      let count = this.count + 1;
      let questionTime = this.shijuaninfo.ever_deadline; // 获取每道题的答题时长
      this.clock = window.setInterval(() => {
        questionTime--;
        this.timeDown = questionTime;
        if(this.length == count) return; // 当题目长度和答题的长度相等时，不走这个提交逻辑
        if (questionTime < 1) {
          clearInterval(this.clock);
            this.nextTab(); // 切换到下一题的逻辑
        }
      }, 1000);
    },

// 判断总共的答题时长
    startTotalTimer() {
      let totalTime = this.shijuaninfo.deadline; // 获取总共的答题时长
      this.totalClock = window.setTimeout(() => {
        clearInterval(this.clock); // 停止每道题的计时器
        this.nextTab(); // 提交试卷的逻辑
      }, totalTime * 1000);
    },

    timer() {
      // 判断每道题的答题时长
      this.startQuestionTimer();

      // 判断总共的答题时长
      this.startTotalTimer();
    },
    // 返回
    backTab() {
      this.$emit("back");
    },
    // 提交答案
    Submit() {
      this.$emit("submit", this.questFroms);
    },

  },
  computed: {
    length() {
      return this.ktitem.length;
    },
    isSubmit() {
      return this.count == this.ktitem.length - 1;
    },
  },
};
</script>

<style scoped>
.cf {
  overflow: hidden;
}
.leixing {
  padding: 4px 10px;
  color: #fff;
  float: left;
  font-size: 14px;
  border-radius: 3px;
}
.fr {
  float: right;
  line-height: 26px;
  color: #999;
  font-size: 14px;
  color: #666;
}
.card-next {
  display: flex;
  margin-top: 30px;
}
.btn-item {
  flex: 1;
  padding: 0 20px;
}
.card-next button {
  line-height: 44px;
  font-size: 16px;
  border-radius: 200px 200px;
  background: #e41e1e;
  color: #fff;
  border: none;
  width: 100%;
}
.card-next .btn-item:first-child button {
  background: none;
  border: 1px solid #e41e1e;
  color: #e41e1e;
  background: #fff;
}
.van-checkbox {
  margin: 10px 0;
  font-size: 14px;
  background: #fafafa;
  padding: 10px;
}
.van-radio {
  margin: 10px 0;
  font-size: 14px;
  background: #fafafa;
  padding: 10px;
}
.st-info {
  background: #fff;
  position: relative;
  margin-top: 80px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.1);
}
.title {
  margin-top: 10px;
  border-top: 1px solid #f1f1f1;
  padding: 10px 0;
  line-height: 1.8;
  color: #333;
}
textarea {
  border: 1px solid #ddd;
  width: 100%;
  padding: 10px;
  font-size: 14px;
  resize: none;
  outline: none;
}
</style>
