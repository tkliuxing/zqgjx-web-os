<template>
  <div>
    <van-nav-bar title="申领清单" left-arrow left-text="返回" fixed placeholder @click-left="goBack" />
    <el-table style="margin:20px 0" :data="store.list" :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" border stripe>
      <el-table-column label="物品名称" prop="field_01"></el-table-column>
      <el-table-column label="申请数量" prop="int_01"></el-table-column>
      <el-table-column label="领用借用" prop="field_03"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ $index }">
          <van-button type="danger" @click="del($index)" round>移出</van-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding:0 30px">
      <van-button round block type="primary" @click="submit">提交申请</van-button>
    </div>
  </div>
</template>

<script>
import resource from "../../../resource";
import { commit, store } from "./store";
import { mapState } from "vuex";
import { Toast, Dialog } from "vant";
export default {
  name: "MobileItems",
  computed: {
    ...mapState(["userinfo"]),
  },
  data() {
    return {
      store,
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async submit() {
      if (store.list.length === 0) {
        return Toast.fail("请选择物品后提交!");
      }
      try {
        let res = await resource.createObj("data", {
          template_id: "FT140638058851151872",
          name: "物品申请",
          biz_id: this.$bizCode.wuping_biz,
          src_id: this.$sourceCode.source_id,
          field_03: "未发放",
          create_user: this.userinfo.pk,
          create_user_name: this.userinfo.full_name,
          department: this.userinfo.department,
        });
        for (let i = 0; i < store.list.length; i++) {
          const e = store.list[i];
          await resource.createObj("data", {
            biz_id: this.$bizCode.wuping_biz,
            src_id: this.$sourceCode.source_id,
            template_id: "FT140638334658744320",
            goodsreceipt: res.pk,
            goods: e.goodsPk,
            ...e,
          });
        }
        Toast.success("提交成功，请等待管理员审核!");
        commit("clearList");
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000);
      } catch (error) {
        Toast.fail("提交失败，请稍后再试！");
      }
    },
    del(index) {
      Dialog.confirm({
        title: "移出",
        message: "确认移出清单吗？",
      })
        .then(() => {
          commit("delItem", index);
          Toast.success("已移出！");
        })
        .catch(() => {
          Toast.fail("取消移出！");
        });
    },
  },
};
</script>

<style></style>
