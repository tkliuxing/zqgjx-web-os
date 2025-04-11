<template>
  <el-card>
    <el-form inline>
      <el-form-item label="选择物品">
        <el-select v-model="search.goods" filterable placeholder="请选择" clearable>
          <el-option v-for="item in goods_list" :key="item.pk" :label="item.name" :value="item.pk"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="借用人">
        <el-select v-model="search.user" filterable placeholder="请选择" clearable>
          <el-option v-for="item in user_list" :key="item.pk" :label="`${item.full_name}--${item.department_name}`" :value="item.pk"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="selSearch" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="card" @tab-click="handlerClick" v-model="active">
      <el-tab-pane label="未归还">
        <el-table :data="data.slice((page - 1) * pageSize, page * pageSize)" :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }" border stripe v-loading="noLoading" element-loading-text="加载中...">
          <el-table-column label="申请人" prop="user"></el-table-column>
          <el-table-column label="申请物品" prop="goodsname"></el-table-column>
          <el-table-column label="申请数量" prop="req_total"></el-table-column>
          <el-table-column label="发放数量" prop="res_total"></el-table-column>
          <el-table-column label="申请时间">
            <template slot-scope="{ row }">
              <span v-if="row.sq_time">
                {{ moment(row.sq_time).format("yyyy-MM-DD") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发放时间">
            <template slot-scope="{ row }">
              <span v-if="row.ff_datetime">
                {{ moment(row.ff_datetime).format("yyyy-MM-DD") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="应归还时间">
            <template slot-scope="{ row }">
              <span v-if="row.gh_datetime">
                {{ moment(row.gh_datetime).format("yyyy-MM-DD") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button @click="gh(row)" type="primary" icon="el-icon-sell">归还</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top:10px" @size-change="
            (pageSize) => {
              this.pageSize = pageSize;
              this.page = 1;
            }
          " @current-change="(page) => (this.page = page)" :current-page="page" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="已归还">
        <el-table :data="data.slice((page - 1) * pageSize, page * pageSize)" :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }" border stripe v-loading="yesLoading" element-loading-text="加载中...">
          <el-table-column label="申请人" prop="user"></el-table-column>
          <el-table-column label="申请物品" prop="goodsname"></el-table-column>
          <el-table-column label="申请数量" prop="req_total"></el-table-column>
          <el-table-column label="发放数量" prop="res_total"></el-table-column>
          <el-table-column label="归还数量" prop="gh_total"></el-table-column>
          <el-table-column label="申请时间">
            <template slot-scope="{ row }">
              <span v-if="row.sq_time">
                {{ moment(row.sq_time).format("yyyy-MM-DD") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发放时间">
            <template slot-scope="{ row }">
              <span v-if="row.ff_datetime">
                {{ moment(row.ff_datetime).format("yyyy-MM-DD") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="应归还时间">
            <template slot-scope="{ row }">
              <span v-if="row.gh_datetime">
                {{ moment(row.gh_datetime).format("yyyy-MM-DD") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="已归还时间">
            <template slot-scope="{ row }">
              <span v-if="row.ygh_datetime">
                {{ moment(row.ygh_datetime).format("yyyy-MM-DD") }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top:10px" @size-change="
            (pageSize) => {
              this.pageSize = pageSize;
              this.page = 1;
            }
          " @current-change="(page) => (this.page = page)" :current-page="page" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import resource from "../../../resource.js";
import moment from "moment";
export default {
  name: "WuPinGuiHuan",
  data() {
    return {
      active: "0",
      search: { goods: "", user: "" },
      user_list: [],
      goods_list: [],
      noLoading: false,
      yesLoading: false,
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    moment,
    selSearch() {
      if (this.active === "0") {
        this.getJieYong();
      } else {
        this.getYiGuiHuan();
      }
    },
    async getJieYong() {
      this.noLoading = true;
      let params = {
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
      };
      if (this.search.user) {
        params["user"] = this.search.user;
      }
      if (this.search.goods) {
        params["goods"] = this.search.goods;
      }
      let res = await resource.getObj("formdatareport", "5851", params);
      this.data = res.data;
      this.noLoading = false;
    },
    async getUser() {
      let res = await resource.getList("user", {
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
      });
      this.user_list = res;
    },
    async getGoods() {
      let res = await resource.getList("data", {
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT140632863333752832",
      });
      this.goods_list = res;
    },
    gh(row) {
      this.$prompt("请输入归还数量", null, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async ({ value }) => {
          try {
            await resource.patchObj(
              "data",
              row.goodstogoodsreceipt_pk,
              {

                biz_id: this.$bizCode.wuping_biz,
                src_id: this.$sourceCode.source_id,
                template_id: "FT140638334658744320",
                int_03: value,
                datetime_03: moment().format("yyyy-MM-DD"),
              }
            );
            this.$message.success("归还成功!");
            this.getJieYong();
          } catch (error) {
            this.$message.error("归还失败，请稍后再试!");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    async getYiGuiHuan() {
      this.data = [];
      this.yesLoading = true;
      let params = {
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
      };
      if (this.search.user) {
        params["user"] = this.search.user;
      }
      if (this.search.goods) {
        params["goods"] = this.search.goods;
      }
      let res = await resource.getObj("formdatareport", "5852", params);
      this.data = res.data;
      this.yesLoading = false;
    },
    handlerClick(tab) {
      if (parseInt(tab.index)) {
        this.getYiGuiHuan();
      } else {
        this.getJieYong();
      }
    },
  },
  created() {
    this.getUser();
    this.getGoods();
    this.getJieYong();
  },
};
</script>

<style></style>
