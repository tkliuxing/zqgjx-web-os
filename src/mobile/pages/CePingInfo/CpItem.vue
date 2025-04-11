<template>
  <div class="card">
    <div class="title" v-if="cpInfo">{{ cpInfo.name }}</div>
    <div v-for="(item, index) in cpFroms" :key="index">
      <template v-if="count === index">
        <div class="card-top">
          <div class="card-item" v-if="item.dep_name">
            <div class="item">测评部门</div>
            <div class="item">{{ item.dep_name }}</div>
          </div>
          <div class="card-item" v-if="item.name">
            <div class="item">测评人员</div>
            <div class="item">{{ item.name }}</div>
          </div>
        </div>
        <div class="card-box">
          <div
            class="card-info"
            v-for="(option, index) in cpInfo.xiangmu_length"
            :key="index"
          >
            <div class="info-item">{{ cpInfo[getName(option)] }}</div>
            <div class="info-r">
              <van-stepper
                v-model="item[getDefen(option)]"
                integer
                :max="cpInfo[getFenzhi(option)]"
                :default-value="cpInfo[getFenzhi(option)]"
              />
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="card-next">
      <div class="btn-item">
        <button v-if="count > 0" @click="upTab" :style="{borderColor:color,color:color}">上一个</button>
        <button v-if="count == 0" @click="back" :style="{borderColor:color,color:color}">返回</button>

      </div>
      <div class="btn-item">

        <button v-if="isSubmit" @click="nextTab" :style="{background:color}">提 交</button>
        <button v-else @click="nextTab" :style="{background:color}">下一个</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Stepper } from "vant";
import "vant/lib/index.css";
Vue.use(Stepper);

export default {
  props: {
    cpInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    color:{
      type:String,
      default:"#e41e1e"
    }
  },
  data() {
    return {
      value: 1,
      count: 0,
      cpFroms: [],
      cpOption: {
        zongfen: 0,
        defen_01: null,
        defen_02: null,
        defen_03: null,
        defen_04: null,
        defen_05: null,
        defen_06: null,
        defen_07: null,
        defen_08: null,
        defen_09: null,
        defen_10: null,
        template_id:"FT6624995528704"
      },
    };
  },
  watch: {
    cpInfo() {
      this.init();
    },
  },
  methods: {
    // 初始化列表
    init() {
      let ll = [];
      let beipingrenarr = JSON.parse(this.cpInfo.beipingren)
      for (let i = 0; i < beipingrenarr.length; i++) {
        ll.push({
          ...this.cpOption,
          index: i,
          dep_name: beipingrenarr[i].dep,
          name: beipingrenarr[i].name,
          ceping_id: this.cpInfo.pk,
          biz_id: this.cpInfo.biz_id,
          src_id: this.cpInfo.src_id,
          org_id : this.cpInfo.org_id,
          sys_id:this.cpInfo.sys_id,

        });
      }
      this.cpFroms = ll;
    },
    // 下一个
    nextTab() {
      if (this.cpFroms.length - 1 > this.count) {
        this.count++;
      } else {
        this.Submit();
      }
    },
    // 返回
    back() {
      this.$emit("back");
    },
    // 上一个
    upTab() {
      let count = this.count;
      if (count >= 1) {
        this.count--;
      }
    },
    // 提交
    Submit() {
      this.$emit("submit", this.cpFroms);
    },

    getName(num) {
      let name = "xiangmu_" + this.getNumber(num);
      return name;
    },
    getDefen(num) {
      let fen = "defen_" + this.getNumber(num);
      return fen;
    },
    getFenzhi(num) {
      let fen = "fenzhi_" + this.getNumber(num);
      return fen;
    },
    getNumber(num) {
      var len = num.toString().length;
      while (len < 2) {
        num = "0" + num;
        len++;
      }
      return num;
    },
  },
  computed: {
    isSubmit() {
      if (this.cpInfo) {
        return this.count == this.cpFroms.length - 1;
      }
    },
  },
};
</script>

<style scoped>
.title {
  text-align: center;
  line-height: 1.8;
  padding: 10px 0;
}
.card {
  background: #fff;
  position: relative;
  margin-top: 60px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.1);
}
.card-item {
  display: flex;
  line-height: 34px;
  color: #666;
  border-left: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
  border-top: 1px solid #f1f1f1;
}

.card-item .item {
  flex: 1;
  text-align: center;
  border-right: 1px solid #f1f1f1;
}
.card-item .item:last-child {
  border: none;
  color: #333;
}
.card-info {
  display: flex;
  border-top: 1px solid #f1f1f1;
  border-left: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
  line-height: 24px;
}
.info-item {
  flex: 1;
  font-size: 16px;
  color: #666;
  text-align: center;
  border-right: 1px solid #f1f1f1;
  padding: 12px 0;
}
.info-r {
  flex: 1;
  padding: 12px 0;
  text-align: center;
}
.card-info:last-child {
  border-bottom: 1px solid #f1f1f1;
}

.card-next {
  display: flex;
  margin-top: 20px;
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
  color: #e41e1e;
  background: #fff;
}
</style>
