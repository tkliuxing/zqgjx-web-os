<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="searchData.search"
            placeholder="资产名称、资产编号"
            clearable
            @clear="loadData"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            round
            @click="loadData"
          >
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
        stripe
        border
        ref="table"
        :data="data"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="资产名称" prop="name"></el-table-column
        ><el-table-column label="资产编号" prop="sn"></el-table-column>
        <el-table-column label="使用部门" prop="department_display">
        </el-table-column>
        <el-table-column label="报修人" prop="baoxiu_name"> </el-table-column>
        <el-table-column label="联系电话" prop="phone"> </el-table-column>
        <el-table-column label="报修原因" prop="remark"> </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              round
              icon="el-icon-edit"
              size="mini"
              @click="toinfo(row)"
              style="margin-right: 10px"
              >资产详情</el-button
            >
            <el-popconfirm title="确定删除吗？" @confirm="del(row)">
            <el-button
              type="danger"
              round
              slot="reference"
              icon="el-icon-remove"
            >
              删除</el-button
            >
          </el-popconfirm>
            <!-- <el-button
              type="danger"
              round
              icon="el-icon-remove"
              size="mini"
              @click="del(row)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
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
        style="margin-top: 10px"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import resource from "@/resource";
import xlsxExcel from "@/utils/xlsxExcel";
export default {
  computed: {
    ...mapState(["org_id", "sys_id", "httpurl"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      data: [],
      baoxiuform: [],
      zichaninfo: {},
      searchData: {
        search: "",
      },
      loading: false,
    };
  },
  mounted() {
    // this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      let params = {
        ...this.searchData,
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.zichan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT8900048969728",
      };
      let res = await resource.getList("data", params);
      this.total = res.count;
      this.data = res.data;
      this.loading = false;
    },
    toinfo(row) {
      this.$router.push({
        name: "zichan-editxinxi",
        params: { pk: row.zichan_id, state: true },
      });

    },
    // 导出表格
    download() {
      let headers = [
        { 资产名称: "name" },
        { 资产编号: "sn" },
        { 使用部门: "department_display" },
        { 报修人: "baoxiu_name" },
        { 联系电话: "phone" },
        { 报修原因: "remark" },
      ];
      xlsxExcel(headers, "固定资产报修记录", this.data);
    },

    // 删除
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

    // del(info) {
    //   this.$confirm("是否删除?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       await resource.deleteList(
    //         {
    //           pk: info.pk,
    //         },
    //         info.template_id
    //       );
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!",
    //       });
    //       setTimeout(() => {
    //         this.loadData();
    //       }, 200);
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },
  },
};
</script>

<style></style>
