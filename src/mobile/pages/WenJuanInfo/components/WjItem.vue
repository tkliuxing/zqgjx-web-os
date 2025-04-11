<template>
  <div class="st-info">
    <div v-for="(item, index) in ktitem" :key="index" class="st-list">
      <template v-if="index === count">
        <div style="display: flex;justify-content: flex-start">
          <div :style="{ background: color }" class="leixing" style="height: 15px;line-height: 15px">
            {{ index + 1 }}/{{ length }}
          </div>
          <div style="display:flex;flex-direction: column;justify-content: flex-start">
            <div style="margin-bottom: 10px">{{ item.timu }}</div>
            <div style="margin-bottom: 10px">
              {{item.zhushi}}
            </div>
          </div>
        </div>



        <div class="answer">
          <div
            v-if="item.max_length > 0 && item.leixing === '多选'"
            class="check-tips"
          >
            该题目最多可选 {{ item.max_length }} 个选项
          </div>
          <div
            v-if="item.must_length > 0 && item.leixing === '多选'"
            class="check-tips"
          >
            该题目只能选 {{ item.must_length }} 个选项
          </div>
          <div v-if="item.is_required == '是'" class="check-tips">
            该题目为必填选项
          </div>
          <div v-if="questFroms.length>0">
            <van-radio-group
              v-if="item.leixing === '单选'"
              v-model="questFroms[index].result"
            >
              <template v-for="(itemtm, idx) in item.choices_length">
                <van-radio
                  :key="idx"
                  :name="itemtm"
                  checked-color="#e41e1e"
                >{{
                    item[`xuanxiang_${idx > 8 ? idx + 1 : "0" + (idx + 1)}`]
                  }}
                </van-radio>
              </template>
            </van-radio-group>
          </div>

          <div v-if="questFroms.length>0">
          <van-checkbox-group
            v-if="item.leixing === '多选'"
            v-model="questFroms[index].result"
            :max="item.max_length > 0 ? item.max_length : ''"
          >
            <template v-for="(itemtm, idx) in item.choices_length">
              <van-checkbox
                :key="idx"
                :name="itemtm"
                checked-color="#e41e1e"
                shape="square"
              >{{
                  item[`xuanxiang_${idx > 8 ? idx + 1 : "0" + (idx + 1)}`]
                }}
              </van-checkbox
              >
            </template>
          </van-checkbox-group>
            </div>
              <div v-if="questFroms.length>0">
          <template v-if="item.leixing === '问答'">
            <textarea
              v-model="questFroms[index].result"
              cols="30"
              placeholder="请输入答案"
              rows="10"
            ></textarea>
          </template>
                </div>
<!--          &&
             questFroms[index].result.length>0 && questFroms[index].result.indexOf(item.choices_length) != -1 && questFroms.length>0-->
          <div
            v-if="
              item.qita_number == '1'
            "
          >
            <input
              v-model="questFroms[index].qita_result"
              placeholder="请注明"
              style="box-sizing: border-box"
              type="text"
            />
          </div>
        </div>
      </template>
    </div>
    <div class="card-next">
      <div class="btn-item">
        <button v-if="count > 0" @click="upTab">上一题</button>
        <button
          v-if="count === 0"
          :style="{ borderColor: color, color: color }"
          @click="backTab"
        >
          返回
        </button>
      </div>
      <div class="btn-item">
        <button v-if="isSubmit" :style="{ background: color }" @click="nextTab">
          提交试卷
        </button>
        <button v-else :style="{ background: color }" @click="nextTab">
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
  components: {},
  data() {
    return {
      count: 0,
      questFroms: [],
      isShow: false,
      is_base: false,
      result: [],
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.init();
    });
    console.log(this.ktitem,'123')
  },
  methods: {

    // 初始化答案列表
    init() {
      let ll = [];
      for (let i = 0; i < this.ktitem.length; i++) {
        ll.push({
          shiti_id: this.ktitem[i].pk,
          result: [],
          qita_result: "",
        });
      }
      this.questFroms = ll;


    },

    // 下一题
    nextTab() {
      if (this.ktitem[this.count].is_required == "是") {
        if (
          this.questFroms[this.count].result == [] ||
          this.questFroms[this.count].result == ""
        ) {
          this.$toast("该题目为必答题");
          return;
        } else {
          if (this.ktitem.length - 1 > this.count) {
            this.count++;
          } else {
            this.Submit();
          }
        }
      } else {
        if (this.ktitem.length - 1 > this.count) {
          this.count++;
        } else {
          this.Submit();
        }
      }
    },

    // 上一题
    upTab() {
      let count = this.count;
      if (count >= 1) {
        this.count--;
      }
    },

    // 返回
    backTab() {
      this.$emit("back");
    },

    // 提交答案
    Submit() {
      this.$emit("submit", this.questFroms);
      console.log(this.questFroms,222)
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
.st-title {
  margin-bottom: 20px;
  line-height: 1.6;
}

.cf {
  overflow: hidden;
}

.leixing {
  padding: 4px 6px;
  color: #fff;
  font-size: 10px;
  border-radius: 3px;
  margin-right: 5px;
  line-height: 1;
  background: #e41e1e;
  vertical-align: middle;
  display: inline-block;
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
  color: #fff;
  border: none;
  width: 100%;
}

.card-next .btn-item:first-child button {
  background: none;
  border: 1px solid #e41e1e;
  background: #fff;
  color: #e41e1e;
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
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.1);
}

.title {
  float: left;
  margin-left: 5px;
  line-height: 24px;
}

textarea {
  border: 1px solid #ddd;
  width: 100%;
  padding: 10px;
  font-size: 14px;
  resize: none;
  outline: none;
  box-sizing: border-box;
}

input {
  border: 1px solid #ddd;
  width: 100%;
  padding: 10px;
  font-size: 14px;
  outline: none;
  margin-top: 10px;
}

.check-tips {
  font-size: 12px;
  color: #e41e1e;
  background: #fff7f7;
  padding: 10px;
  border-radius: 3px;
  margin-top: 10px;
}

.wj-tips {
  font-size: 12px;
  color: #e41e1e;
  background: #fff7f7;
  padding: 10px;
  border-radius: 3px;
  margin: 10px 0;
}
</style>
