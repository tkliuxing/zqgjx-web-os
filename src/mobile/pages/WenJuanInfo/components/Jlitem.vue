<template>
  <div class="st-info" v-if="ktitem.length > 0">
    <div v-for="(item, index) in ktitem" :key="index">
      <div v-if="index === count">
        <div class="cf">
          <div class="leixing" :style="{ background: color }">
            {{ item.leixing }} {{ index + 1 }}/{{ length }}
          </div>
        </div>
        <div class="title">{{ index + 1 }}、{{ item.timu }}</div>
        <div class="answer">
          <van-radio-group
            v-model="questFroms[count].danxuan_result"
            v-if="item.leixing === '单选' || item.leixing === '判断'"
          >
            <div v-for="(itemtm, index) in item.xuanxiang_list" :key="index">
              <van-radio :name="index" checked-color="#e41e1e" disabled>{{
                itemtm
              }}</van-radio>
            </div>
          </van-radio-group>
          <van-checkbox-group
            v-model="questFroms[count].result"
            v-if="item.leixing === '多选'"
          >
            <div v-for="(itemtm, index) in item.xuanxiang_list" :key="index">
              <van-checkbox
                :name="index"
                shape="square"
                checked-color="#e41e1e"
                disabled
                >{{ itemtm }}</van-checkbox
              >
            </div>
          </van-checkbox-group>
          <div v-if="item.leixing === '问答'">
            <textarea
              v-model="questFroms[count].wenda_result"
              placeholder="请输入答案"
              cols="30"
              rows="10"
              readonly
            ></textarea>
          </div>
        </div>
        <div class="zq" v-if="item.leixing != '问答'">正确答案：{{ item.daan }}</div>
      </div>
    </div>

    <div class="card-next">
      <div class="btn-item">
        <button
          @click="upTab"
          v-if="count > 0"
          :style="{ borderColor: color, color: color }"
        >
          上一题
        </button>
        <button @click="backTab" v-else :style="{ borderColor: color, color: color }">
          返回首页
        </button>
      </div>
      <div class="btn-item">
        <button @click="backTab" v-if="isSubmit" :style="{ background: color }">
          返回首页
        </button>
        <button v-else @click="nextTab" :style="{ background: color }">下一题</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { RadioGroup, Radio } from 'vant';
import { Checkbox, CheckboxGroup } from 'vant';

Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(RadioGroup);
import { mapState } from "vuex";
export default {
  props: {
    ktitem: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    // 下一题
    nextTab() {
      if (this.ktitem.length - 1 > this.count) {
        this.count++;
      }
    },
    // 上一题
    upTab() {
      let count = this.count;
      if (count >= 1) {
        this.count--;
      }
    },
    backTab() {
      this.$emit("back");
    },
  },
  computed: {
    ...mapState(["questFroms", "color"]),
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
  background: #e41e1e;
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
  /* margin-top: 60px; */
  padding: 20px;
  border-radius: 10px;
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
.zq {
  color: #333;
  font-size: 16px;
  margin-top: 30px;
  color: #15b04c;
}
</style>
