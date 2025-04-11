<template>
  <div v-loading="loading" element-loading-text="加载中...">
    <van-nav-bar title="物品申请" fixed placeholder />
    <van-search v-model="search" placeholder="请输入物品名称搜索" :clearable="false" show-action @input="filter" />
    <div style="padding-bottom:60px">
      <van-cell v-for="i in item_list" :key="i.pk" :label="i.size" :value="i.number" is-link center @click="openForm(i)">
        <template #title>
          <span class="custom-title">{{ i.name }}</span>
        </template>
      </van-cell>
    </div>
    <van-goods-action>
      <van-goods-action-icon icon="cart-o" text="数量" :badge="store.list.length"  @click="add" />
      <van-goods-action-button type="danger" text="申领清单" @click="add" />
    </van-goods-action>
    <van-dialog v-model="showOpenFormVisable" title="申请物品" :show-confirm-button="false" @closed="clearForm">
      <van-form style="padding:20px" @submit="submit">
        <van-field :value="form.field_01" label="物品名称" readonly></van-field>
        <van-field type="number" v-model="form.int_01" label="申请数量" required placeholder="请填写申请数量" :rules="[{ required: true }]" @blur="reqNumber"></van-field>
        <van-field v-model="form.field_02" label="用途" placeholder="请填写用途"></van-field>
        <van-field name="radio" label="领用借用">
          <template #input>
            <van-radio-group v-model="form.field_03" direction="horizontal">
              <van-radio name="领用">领用</van-radio>
              <van-radio name="借用">借用</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field readonly clickable name="calendar" :value="form.datetime_01" label="归还日期" placeholder="请选择归还日期" :required="form.field_03 === '借用'" @click="showCalendar = true" :rules="[{ required: form.field_03 === '借用' }]" />
        <van-field v-model="form.field_04" label="归还期限" placeholder="请填写归还期限"></van-field>
        <div style="margin: 16px;display:flex;justify-content:space-evenly">
          <van-button type="info" round style="width:110px" native-type="button" @click="showOpenFormVisable = false">取消</van-button>
          <van-button type="primary" round style="width:110px" native-type="submit">确定</van-button>
        </div>
      </van-form>
    </van-dialog>

    <van-calendar v-model="showCalendar" @confirm="CalendarConfirm" />
  </div>
</template>
<script>
import { store, commit } from "./store";
import resource from "@/resource.js";
import "./vant.plugin";
import moment from "moment";
import { Toast } from "vant";
import { parse } from 'qs';

export default {
  name: "MobileCode",
  data() {
    return {
      search: "",
      currentGoods: null,
      item_list: [],
      allData: [],
      showOpenFormVisable: false,
      showCalendar: false,
      loading: false,
      form: {
        goodsPk: "",
        field_01: "",
        field_02: "",
        field_03: "领用",
        field_04: "",
        int_01: "",
        datetime_01: null,
      },
      store,
    };
  },
  methods: {
    commit,
    reqNumber(val) {
      if (!Number.isInteger(val.target.value)) {
        this.form.int_01 = parseInt(val.target.value)
      }
      if (Number(val.target.value) < 0) {
        this.form.int_01 = 0
      }
      if (Number(val.target.value) > Number(this.currentGoods.number)) {
        this.form.int_01 = this.currentGoods.number
      }

    },
    add() {
      this.$router.push("/itemlist");
    },
    async getItems() {
      this.loading = true;
      let res = await resource.getList("data", {
        template_id: "FT140632863333752832",
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
        root: store.category,
      });
      this.item_list = res;
      this.allData = res;
      this.loading = false;
    },
    querySearch(queryString, cb) {
      var restaurants = this.item_list;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.name.indexOf(queryString) > -1;
      };
    },
    CalendarConfirm(value) {
      this.form.datetime_01 = moment(value).format("yyyy-MM-DD");
      this.showCalendar = false;
    },
    filter(value) {
      this.item_list = [
        ...this.allData.filter((i) => {
          return i.name.indexOf(value) > -1;
        }),
      ];
    },
    openForm(row) {
      this.currentGoods = row;
      this.form.field_01 = row.name;
      this.form.goodsPk = row.pk;
      this.showOpenFormVisable = true;
    },
    submit() {
      commit("setList", this.form);
      this.showOpenFormVisable = false;
      Toast.success("已添加到申领清单！");
    },
    clearForm() {
      this.form = {
        goodsPk: "",
        field_01: "",
        field_02: "",
        field_03: "领用",
        field_04: "",
        int_01: "",
        datetime_01: null,
      };
    },
  },
  created() {
    this.getItems();
  },
};
</script>

<style scoped>
.form {
  padding: 30px 50px;
}
</style>
