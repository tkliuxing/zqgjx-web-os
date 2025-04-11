<template>
   <div>
     <van-nav-bar title="已盘点物品" left-arrow left-text="返回" fixed placeholder @click-left="goBack" />
     <el-table style="margin:20px 0" :data="store.list" :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" border stripe>
       <el-table-column label="物品名称" prop="field_01"></el-table-column>
 <!--      <el-table-column label="盘点数量" prop="int_01"></el-table-column>-->
       <el-table-column label="正常/损坏" prop="field_03"></el-table-column>
       <el-table-column label="盘点人" prop="field_04"></el-table-column>
       <el-table-column label="操作">
         <template slot-scope="{ $index }">
           <van-button type="danger" round @click="del($index)"  icon="delete-o"></van-button>
         </template>
       </el-table-column>
     </el-table>
     <div style="padding:0 30px">
       <van-button round block type="primary" @click="submit">确认盘点</van-button>
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
 created() {
     console.log(store.list[0].goodsPk,11)
   },
  data() {
     return {
       store,
       };
   },
  methods: {
     goBack() {
           history.back()
       },
     async submit() {
         if (store.list.length === 0) {
             return Toast.fail("请选择物品后提交!");
           }
         try {
             for (let i = 0; i < store.list.length; i++) {
                 const e = store.list[i];
                 await resource.patchObj("data",  e.goodsPk, {
                     template_id: "FT9231247929344",
                     state: "已盘点",
                     status:e.field_03,
                     pdname:e.field_04,

                     });
                 console.log(e.goodsPk)
               }
             Toast.success("盘点成功");
             commit("clearList");
             this.goBack()

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