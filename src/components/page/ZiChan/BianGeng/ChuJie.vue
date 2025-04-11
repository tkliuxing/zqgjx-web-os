<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-input
            v-model="searchData.search"
            placeholder="单号、资产名称、资产编号"
            clearable
            @clear="loadData"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" round @click="loadData">
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
            type="success"
            icon="el-icon-download"
            round
            @click="download"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        element-loading-text="正在加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="data"
        ref="table"
        border
        stripe
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column label="出借单号" prop="pk" width="130px"></el-table-column>
      <el-table-column label="资产名称" prop="zichan_name"></el-table-column>
      <el-table-column label="资产编号" prop="zichan_sn"></el-table-column>
      <el-table-column label="所属部门" prop="out_department_display"></el-table-column>
      <el-table-column label="出借部门" prop="to_department"></el-table-column>
      <el-table-column label="出借人员" prop="to_person"></el-table-column>
      <el-table-column label="联系方式" prop="to_mobile"></el-table-column>
      <el-table-column label="经办人员" prop="hanlder_person"></el-table-column>
      <el-table-column label="出借时间" prop="create_time"></el-table-column>
      <el-table-column label="归还时间" prop="return_time">
        <template slot-scope="{ row }">
          <el-button
              v-if="!row.return_time"
              type="success"
              @click="guihuan(row)"
              round
              size="mini"
          >归还
          </el-button>
          <span v-else>{{ row.return_time || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出借说明" prop="remark"></el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="{ row }">
          <el-button
              type="primary"
              icon="el-icon-edit"
              @click="lookZichan(row)"
              round
              size="mini"
          >资产详情
          </el-button>
          <el-popconfirm title="确定删除吗？" @confirm="del(row)" v-if="userinfo.func_group_names.indexOf('记录删除') > -1">
            <el-button
                type="danger"
                round
                class="deleteButton"
                size="mini"
                slot="reference"
                icon="el-icon-remove"
            >
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        style="margin-top: 20px"
        layout="total, sizes, prev, pager, next"
        :page-sizes="[15, 30, 50, 100, 500, 1000]"
        :page-size="pageSize"
        @size-change="
        (pageSize) => {
          this.page = 1;
          this.pageSize = pageSize;
          this.loadData();
        }
      "
        :current-page.sync="page"
        @current-change="loadData"
        :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import moment from "moment";
import {mapState} from "vuex";
import xlsxExcel from "@/utils/xlsxExcel";
import resource from "@/resource";

export default {
  computed: {
    ...mapState(["org_id", "sys_id", "httpurl", "orginfo", "userinfo"]),
  },
  data() {
    return {
      searchData: {
        search: "",
      },
      data: [],
      zichan: [],
      page: 1,
      pageSize: 15,
      total: 0,
      loading: false
    };
  },
  methods: {
    moment,
    async loadData() {
      this.loading = true
      let params = {
        ...this.searchData,
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.zichan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT301604846818111488",
      };
      if(this.userinfo.func_group_names.indexOf("政企工具箱管理员") === -1){
         params.out_department = this.userinfo.department;
      }
      let res = await resource.getList("data", params);
      for (let item of res.data) {
        item.create_time = moment(item.create_time).format("YYYY-MM-DD")
        if(item.return_time){
          item.return_time = moment(item.return_time).format("YYYY-MM-DD")
        }
      }
      this.total = res.count;
      this.data = res.data;
      this.loading = false
    },
    async del(info) {
      try {
        try {
          await resource.deleteList(
              {
                pk: info.pk,
              },
              info.template_id
          );

          this.$message({
            type: "success",
            message: "删除成功!",
          });
          setTimeout(() => {
            this.loadData();
          }, 200);
        } catch (e) {
          this.$message.error("删除失败!");
        }
      } catch (e) {
        this.$message.info("取消删除");
      }
    },
    async guihuan(data) {
      await resource.updateObj("data", data.pk, {
        return_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        template_id: 'FT301604846818111488'
      });

      await resource.updateObj("data", data.zichan_id, {
        status: "闲置",
        template_id: 'FT8172429443072'
      });
      await this.loadData();
    },
    lookZichan(row) {
      this.$router.push({
        name: "zichan-editxinxi",
        params: {pk: row.zichan_id, state: true},
      });
    },
    // 导出表格
    download() {
      let headers = [
        {出借单号: "pk"},
        {资产名称: "zichan_name"},
        {资产编号: "zichan_sn"},
        {所属部门: "out_department_display"},
        {出借部门: "to_department"},
        {出借人员: "to_person"},
        {联系方式: "to_mobile"},
        {经办人员: "hanlder_person"},
        {出借时间: "create_time"},
        {归还时间: "return_time"},
        {出借说明: "remark"},
      ];
      xlsxExcel(headers, "固定资产出借记录", this.data);
    },
  },
  created() {
    // this.loadData();
  },
};
</script>

<style>
</style>
