<template>
  <el-card>
    <div>
      <el-button
        type="info"
        round
        icon="el-icon-arrow-left"
        @click="$router.go(-1)"
        >返回</el-button
      >
      <el-button
        type="primary"
        @click="create"
        icon="el-icon-circle-plus-outline"
        round
        >添加资产</el-button
      >
      <uploadexl
        class="up-loade"
        :formTable="formTable"
        :textTable="textTable"
        @getTableList="getTableList"
      ></uploadexl>
      <el-button
        style="margin-left: 10px"
        round
        type="warning"
        @click="downTemplate"
        icon="el-icon-download"
        >下载模版</el-button
      >
    </div>
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
      style="margin-top: 1rem"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="资产名称" prop="name"></el-table-column
      ><el-table-column
        label="资产分类"
        prop="category_display"
      ></el-table-column
      ><el-table-column
        label="使用单位/部门"
        prop="department_display"
      ></el-table-column
      ><el-table-column label="使用人员" prop="persion"></el-table-column
      ><el-table-column label="资产状态" prop="status"></el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="{ row }">
          <el-button type="primary" round size="mini" @click="edit(row)"
            >编辑</el-button
          >
          <el-popconfirm title="确定删除吗？" @confirm="del(row)">
            <el-button
              type="danger"
              round
              style="margin-left: 10px"
              size="mini"
              slot="reference"
              icon="el-icon-remove"
            >
              删除</el-button
            >
          </el-popconfirm>
          <!-- <el-button type="danger" round size="mini" @click="del(row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <!-- <div style="margin-top: 10px">
      <el-button
        style="float: right; margin-right: 10px"
        type="danger"
        round
        icon="el-icon-delete"
        @click="delAllTab"
        >批量删除</el-button
      >
    </div> -->
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
</template>
<script>
import { mapState } from "vuex";
import resource from "@/resource";
import Uploadexl from "@/components/common/HxUploadExl.vue";
import moment from "moment";
export default {
  computed: {
    ...mapState(["org_id", "sys_id", "httpurl", "userinfo",'quanxian']),
  },
  components: {
    Uploadexl,
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      data: [],
      url: null,
      formTable: [
        "sn",
        "name",
        "size",
        "model_num",
        "nature",
        "category",
        "unit",
        "cost",
        "release_time",
        "purchase_method",
        "bg_department",
        "bg_persion",
        "location",
        "down_time",
        "account_number",
        "account_date",
        "department",
        "persion",
        "status",
        "brand",
        "warranty_period",
        "origin_sn",
        "accumulated_depreciation",
        "net_worth",
        "product_description",
        "gys",
      ],
      textTable: [
        "资产编号",
        "资产名称",
        "资产规格",
        "资产型号",
        "资产性质",
        "资产分类",
        "计量单位",
        "资产原值",
        "购置日期",
        "购置方式",
        "保管单位/部门",
        "保管人员",
        "存放地点",
        "使用期限",
        "入账编号",
        "入账日期",
        "使用单位/部门",
        "使用人员",
        "资产状态",
        "出厂编号",
        "保修期限",
        "原资产号",
        "累计折旧",
        "净值",
        "备注",
        "供应商",
      ],
      loading: false,
      changeList: [],
      category_display1: [],
      department_display1: [],
    };
  },
  methods: {
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        // biz_id: this.$bizCode.zichan_biz,
        // src_id: this.$sourceCode.source_id,
        template_id: "FT8172429443072",
      };
      let res = await resource.getList("data", params);
      console.log(res.data,'12')
      this.total = res.count;
      this.data = res.data;
      this.loading = false;
    },

    create() {
      if(!this.quanxian.固定资产 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.$router.push({
          name: "zichan-createxinxi",
        });
      }

    },

    edit(row) {
      this.$router.push({ name: "zichan-editxinxi", params: { pk: row.pk } });
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
          await resource.deleteList(
            {
              zichan_id: info.pk,
            },
            "FT8900048969728"
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
    //       await resource.deleteList(
    //         {
    //           zichan_id: info.pk,
    //         },
    //         "FT8900048969728"
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

    // 格式转换
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    // Excel数据提交
    async getTableList(info) {
      for (let i = 0; i < info.length; i++) {
        if (info[i].name == undefined) {
          this.$message({
            type: "warning",
            message: "第" + (i + 2) + "行的资产名称未填写！",
          });
          return;
        }
        if (info[i].category == undefined) {
          this.$message({
            type: "warning",
            message: "第" + (i + 2) + "行的资产分类未填写！",
          });
          return;
        }
      }
      this.loading = true;
      for (let item of info) {
        item['template_id'] = 'FT8172429443072';
        if (item.cankao === undefined) {
          item.cankao = "";
        }
        if (item.account_date != undefined) {
          item.account_date = moment(item.account_date).format("YYYY-MM-DD");
        }
        if (item.down_time != undefined) {
          item.down_time = moment(item.down_time).format("YYYY-MM-DD");
        }
        if (item.release_time != undefined) {
          item.release_time = moment(item.release_time).format("YYYY-MM-DD");
        }
        if (item.warranty_period != undefined) {
          item.warranty_period = moment(item.warranty_period).format(
            "YYYY-MM-DD"
          );
        }
        if (item.department != undefined) {
          let departmentarr = this.department_display1.filter((i) => {
            return item.department == i.name;
          });
          if (departmentarr.length > 0) {
            item.department = departmentarr[0].pk;
          } else {
            this.$message({
              type: "warning",
              message: "请输入正确的使用部门",
            });
            return;
          }
        }
        if (item.bg_department != undefined) {
          let bgdepartmentarr = this.department_display1.filter((i) => {
            return item.bg_department == i.name;
          });
          if (bgdepartmentarr.length > 0) {
            item.bg_department = bgdepartmentarr[0].pk;
          } else {
            this.$message({
              type: "warning",
              message: "请输入正确的保管部门",
            });
            return;
          }
        }
        let categoryarr = this.category_display1.filter((i) => {
          return item.category == i.name;
        });
        if (categoryarr.length > 0) {
          item.category = categoryarr[0].pk;
        } else {
          this.$message({
            type: "warning",
            message: "请输入正确的资产分类名称",
          });
          return;
        }
        await resource.createObj("gdzc-zichan", item);
      }
      this.loading = false;
      this.loadData();
    },

    handleSelectionChange(val) {
      this.changeList = val;
    },
    // 删除全部
    async delAllTab() {
      if (this.changeList.length > 0) {
        try {
          await this.$confirm("是否确定删除? 此操作不可恢复!");
          try {
            for (let item of this.changeList) {
              await resource.deleteObj("kaoshi-tikushiti", item.pk);
            }
            this.$message.success("删除成功!");
            await this.loadData();
          } catch (e) {
            this.$message.error("删除失败!");
          }
        } catch (e) {
          this.$message.info("取消删除");
        }
      } else {
        this.$message({
          type: "info",
          message: "请选择数据",
        });
      }
    },
    // 获取资产分类列表
    async getZiChanFenLei() {
      let params = {
        org_id: 0,
        biz_id: this.$bizCode.zichanfenlei_biz,
        noroot: false,
      };
      const res = await resource.getList("basetree", params);
      this.category_display1 = this.allCategoryList(res);
    },
    // 获取部门
    async getDepartment() {
      let params = {
        org_id: this.org_id,
      };
      const res = await resource.getList("department", params);
      this.department_display1 = this.allCategoryList(res);
    },

    allCategoryList(data) {
      let arr = [];
      data.forEach((i) => {
        if (i.items.length > 0) {
          arr = [...arr, ...i.items];
        }
      });
      return arr;
    },
    // 下载模版
    downTemplate() {
      // console.log("下载模版");
      window.location.href = this.httpurl + "/excel/固定资产录入模版.xls";
    },
  },
  async mounted() {
    await this.loadData();
    await this.getZiChanFenLei();
    await this.getDepartment();
  },
};
</script>
<style scoped>
.up-loade {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}
</style>
