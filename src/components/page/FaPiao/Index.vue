<template>
  <el-card>
    <div>
      <el-form inline>
        <el-form-item>
          <el-button
            type="primary"
            @click="ShiLiTo"
            class="fix-tab"
            plain
            round
            icon="el-icon-picture-outline"
            >查看示例</el-button
          >
          <el-button
            type="warning"
            @click="ShuoMingTo"
            class="fix-shuoming"
            round
            plain
            icon="el-icon-notebook-2"
            >使用说明</el-button
          >
        </el-form-item>
        <el-form-item label="发票类型">
          <el-select v-model="filterData.orga_name">
            <el-option
              v-for="(item, index) in orga_name_option_data"
              :label="item.name"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报销时间">
          <el-date-picker
            v-model="filterData.create_time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="loadData"
            round
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="正在加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      stripe
      border
      :data="data"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      style="margin-top: 1rem"
    >
      <el-table-column label="发票类型" prop="fapiao_type"></el-table-column>
      <el-table-column label="发票代码" prop="fapiao_daima"></el-table-column>
      <el-table-column label="发票号码" prop="fapiao_number"></el-table-column>
      <el-table-column label="检验码" prop="jianyanma"></el-table-column>
      <el-table-column label="开票时间" prop="create_time"></el-table-column>
      <el-table-column label="购买方名称" prop="customera_name"></el-table-column>
      <el-table-column label="发票金额" prop="fapiao_init"></el-table-column>
      <el-table-column label="销售方名称" prop="customerb_name"></el-table-column>
      <el-table-column label="税率" prop="suilv"></el-table-column>
      <el-table-column label="是否已作废" prop="is_zuofei"></el-table-column>
      <el-table-column label="税额" prop="suie"></el-table-column>
      <el-table-column label="价税合计" prop="heji"></el-table-column>
      <el-table-column label="报销人员" prop="baoxiao_name"></el-table-column>
      <el-table-column label="报销部门" prop="baoxiao_bm"></el-table-column>
      <el-table-column label="报销凭证" prop="baoxiao_pz"></el-table-column>
      <el-table-column label="备注" prop="desc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="danger" icon="el-icon-remove" @click="del(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
</template>
<script>
import resource from "@/resource";
import moment from "moment";

export default {
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      filterData: {
        orga_name: null,
        create_time: null,
      },
      data: [],
      orga_name_option_data: [], //定义orga_name_option_data数据源
      sn_option_data: [], //定义sn_option_data数据源
      loading: false,
    };
  },
  methods: {
    orga_name_fn() {
      //获取 orga_name_option_data数据的函数
      this.orga_name_option_data = [
        {
          name: "增值税专⽤发票",
          value: "增值税专⽤发票",
        },
        {
          name: "货物运输业增值税专用发票",
          value: "货物运输业增值税专用发票",
        },
        {
          name: "机动⻋销售统⼀发票",
          value: "机动⻋销售统⼀发票",
        },
        {
          name: "增值税普通发票",
          value: "增值税普通发票",
        },
        {
          name: "增值税电⼦普通发票",
          value: "增值税电⼦普通发票",
        },
        {
          name: "增值税普通发票(卷票)",
          value: "增值税普通发票(卷票)",
        },
        {
          name: "增值税电⼦普通发票(通行费)",
          value: "增值税电⼦普通发票(通行费)",
        },
        {
          name: "⼆⼿⻋销售统⼀发票",
          value: "⼆⼿⻋销售统⼀发票",
        },
      ];
    },

    sn_fn() {
      //获取 sn_option_data数据的函数
      this.sn_option_data = [
        { name: "是", value: "1" },
        { name: "否", value: "0" },
      ];
    },

    // 加载
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.fapiao_biz,
        source_id: this.$sourceCode.source_id,
        template_id: "FT140734205059735552",
      };
      let check = Object.prototype.toString;
      for (const key in this.filterData) {
        if (
          check.call(this.filterData[key]) === "[object Array]" &&
          this.filterData[key].length === 2
        ) {
          params[key + "_after"] = this.filterData[key][0];
          params[key + "_before"] = this.filterData[key][1];
        } else {
          params[key] = this.filterData[key];
        }
      }
      let res = await resource.getList("data", params);
      this.total = res.count;
      this.data = res.data;
      this.loading = false;
    },

    // 删除
    async del(row) {
      try {
        await this.$confirm("是否确定删除? 此操作不可恢复!");
        try {
          await resource.deleteList(
            {
              pk: row.pk,
            },
            row.template_id
          );
          this.$message.success("删除成功!");
          await this.loadData();
        } catch (e) {
          this.$message.error("删除失败!");
        }
      } catch (e) {
        this.$message.info("取消删除");
      }
    },

    ShiLiTo() {
      this.$router.push("/fapiaozhanshi");
    },

    ShuoMingTo() {
      this.$router.push({ name: "fapiao-shuoming" });
    },
  },

  async mounted() {
    const today = moment();
    const start_date = today.subtract(1, "months").format("YYYY-MM-DD");
    const end_date = moment().format("YYYY-MM-DD");
    this.filterData.create_time = [start_date, end_date];
    this.orga_name_fn(); //调用获取orga_name_option_data数据源函数
    this.sn_fn(); //调用获取sn_option_data数据源函数
    await this.loadData();
  },

  created() {},

};
</script>

<style>
.el-dialog--center .el-dialog__body {
  padding: 20px 20px 5px;
}
</style>
