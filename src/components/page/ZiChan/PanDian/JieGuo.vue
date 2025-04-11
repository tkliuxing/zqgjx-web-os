<template>
  <div>
    <el-card>

      <el-tabs v-model="active" type="card" @tab-click="handleClick">
        <el-tab-pane label="已盘点" name="finish">
          <el-button type="primary" icon="el-icon-download" round @click="exportExcel" style="margin-bottom:10px">导出</el-button>
          <el-table
            stripe
            border
            ref="table"
            :data="finish"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            style="margin-top: 1rem"
          >
            <el-table-column label="资产名称" prop="pd_name"></el-table-column
            >
            <el-table-column label="资产编号" prop="sn"></el-table-column>
            <el-table-column
              label="资产分类"
              prop="category_display"
            ></el-table-column
            >
<!--            <el-table-column label="存放地点" prop="location"></el-table-column-->
            >
            <el-table-column
              label="使用单位/部门"
              prop="department_display"
            ></el-table-column
            >
            <el-table-column label="使用人员" prop="persion" ></el-table-column>
            <el-table-column label="资产状态" prop="status"></el-table-column>
            <el-table-column label="盘点人" prop="pdname"></el-table-column>
            <el-table-column label="盘点时间" prop="pandian_time"></el-table-column>
            <el-table-column label="备注" prop="beizhu"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未盘点" name="unfinish">
          <el-button type="primary" icon="el-icon-download" round @click="exportExcel1" style="margin-bottom:10px">导出</el-button>
          <el-table
            stripe
            border
            ref="table1"
            :data="unfinish"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            style="margin-top: 1rem"
          >
            <el-table-column label="资产名称" prop="pd_name"></el-table-column
            >
            <el-table-column label="资产编号" prop="sn"></el-table-column>
<!--            <el-table-column-->
<!--              label="资产型号"-->
<!--              prop="model_num"-->
<!--            ></el-table-column>-->
<!--            <el-table-column label="资产性质" prop="nature"></el-table-column>-->
            <el-table-column
              label="资产分类"
              prop="category_display"
            ></el-table-column
            >
<!--            <el-table-column label="存放地点" prop="location"></el-table-column>-->
            <el-table-column
              label="使用单位/部门"
              prop="department_display"
            ></el-table-column
            >
            <el-table-column label="使用人员" prop="persion"></el-table-column
            >
            <el-table-column label="资产状态" prop="status"></el-table-column>
<!--            <el-table-column label="盘点人" prop="pdname"></el-table-column>-->
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next, sizes, total"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="handleClick"
        @size-change="handleClick"
        :hide-on-single-page="false"
        :total="total"
        style="margin-top: 20px"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import resource from "@/resource.js";
import XLSX from 'xlsx'
import FileSaver from 'file-saver'

export default {
  props: ['id'],
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      active: 'finish',
      finish: [],
      unfinish: []
    }
  },
  mounted() {
    this.handleClick()
  },
  methods: {
    Usage(res){
      for (let item in res.data){
        if (res.data[item].persion==null){
          res.data[item].persion='未使用'
        }
        if (res.data[item].department_display==null){
          res.data[item].department_display='未使用'
        }
      }

    },
    async handleClick() {
      if (this.active === 'finish') {
        this.finish = []
        let data = {
          task_id: this.id,
          state: "已盘点",
          template_id: "FT9231247929344",
          page: this.page,
          pageSize: this.pageSize,
        }
        let res = await resource.getList('data', data);
        console.log(res,'res')
        this.Usage(res)
        this.total = res.count;
        this.finish = res.data;
      } else {
        this.unfinish = []
        let data = {
          task_id: this.id,
          state: "未盘点",
          template_id: "FT9231247929344",
          page: this.page,
          pageSize: this.pageSize,
        }
        let res = await resource.getList('data', data);
        console.log(res,'res')
        this.Usage(res)
        this.total = res.count;
        this.unfinish = res.data;
      }
    },
    exportExcel() {
      this.$nextTick(() => {
        let wb = XLSX.utils.table_to_book(this.$refs.table.$el);
        let wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '已盘点-盘点结果统计表.xlsx');
        } catch (e) {
          if (typeof console !== 'undefined')
            console.log(e, wbout)
        }
        return wbout
      });
    },
    exportExcel1() {
      this.$nextTick(() => {
        let wb = XLSX.utils.table_to_book(this.$refs.table1.$el);
        let wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '未盘点-盘点结果统计表.xlsx');
        } catch (e) {
          if (typeof console !== 'undefined')
            console.log(e, wbout)
        }
        return wbout
      });
    },


  }
}
</script>

<style scoped></style>
