<template>
  <div>

    <background :background="background" :color="color"></background>
    <div class="st-info" v-if="ktitem.length > 0">
    <div v-for="(item, index) in ktitem" :key="index">
      <div v-if="index === count">
        <div class="cf">
          <div class="leixing" :style="{ background: color }">
            {{item.shiti_id_leixing}}
          </div>
        </div>
        <div class="title">{{ index + 1 }}、{{item.shiti_id_timu}}</div>
        <div class="answer">
          <van-radio-group
            v-model="item.result"
            v-if="item.shiti_id_leixing == '单选' || item.shiti_id_leixing == '判断'"
          >
            <div v-for="(itemtm, index) in item.shiti_id_choices_length" :key="index">
              <van-radio disabled :name="index" checked-color="#e41e1e">{{itoa(index)}}.{{
                  item[`shiti_id_xuanxiang_${index > 8 ? index + 1 : "0" + (index + 1)}`]
                }}</van-radio>
            </div>
          </van-radio-group>
          <van-checkbox-group
            v-model="item.result"
            v-if="item.shiti_id_leixing == '多选'"
          >
            <div v-for="(itemtm, index) in item.shiti_id_choices_length" :key="index">
              <van-checkbox
                :name="index"
                disabled
                shape="square"
                checked-color="#e41e1e"
              >{{itoa(index)}}.{{
                  item[`shiti_id_xuanxiang_${index > 8 ? index + 1 : "0" + (index + 1)}`]
                }}</van-checkbox>
            </div>
          </van-checkbox-group>
          <div v-if="item.shiti_id_leixing == '问答'">
            <textarea
              v-model="item.result"
              placeholder="请输入答案"
              cols="30"
              rows="10"
              readonly
            ></textarea>
          </div>
        </div>
        <div class="zq" v-if="item.shiti_id_leixing == '问答'">正确答案：{{ item.shiti_id_cankao}}</div>
        <div class="zq" v-if="item.shiti_id_leixing != '问答'">正确答案：{{ item.shiti_id_daan}}</div>

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

  </div>
</template>

<script>
import Background from "./Background.vue";
import resource from "@/resource";
const TMP_ID_JG = "FT336770984361844736"; //结果
const TMP_ID_SJ = "FT138149866856067072"; //试卷
const TMP_ID_ST = "FT138153450912034816"; //试题
export default {
  props: {
    datijilu: {
      type: Object,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      count: 0,
      loading:false,
      ktitem:[],
      color:null,
      background:null,
      res: null,
    };
  },
  components:{
    Background
  },
  created() {
    this.getSjInfo();
    this.getTiList();
  },
  methods: {
    itoa(index){
      return String.fromCharCode(index + 65)
    },
    async getTiList(){
      this.loading = true;
      let data = {
        biz_id: this.$bizCode.shijuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_JG,
        dati_id: this.datijilu.pk,
      };
      let res = await resource.getList("data", data);

      let data1 = {
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_ST,
        tiku_id: this.res.tiku_id,
      };
      console.log(data1)
      let timu = await resource.getList("data", data1);
      timu.forEach((item) => {
        res.forEach((item2) => {
          if (item.pk == item2.shiti_id) {
            item2.shiti_id_timu = item.timu;
            item2.shiti_id_leixing = item.leixing;
          }
        });
      });
      console.log(timu)
      res.forEach((item) => {
        if(item.shiti_id_leixing == '问答'){
          item.result = JSON.parse(item.result)
        }
        if(item.shiti_id_leixing=='单选' || item.shiti_id_leixing=='判断'){
          // 转成数组
          item.result = JSON.parse(item.result)
        }
      });
      this.ktitem = res;
      this.loading = false;
    },
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
      this.$emit("back",this.datijilu.shijuan_id);
    },
    async getSjInfo() {
      this.loading = true;
      let params = {
        biz_id: this.$bizCode.shijuan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_SJ,
      };
      const res = await resource.getObj("data", this.datijilu.shijuan_id, params);
      this.res = res;
      this.color = res.color;
      this.background = res.background;
      this.loading = false;
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
