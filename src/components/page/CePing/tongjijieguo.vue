<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-button
          type="info"
          round
          icon="el-icon-arrow-left"
          @click="$router.replace({ name: 'ceping-ceping' })"
        >
          返回
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          round
          icon="el-icon-download"
          @click="exportExcel"
        >导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="pageData"
      border
      stripe
      :default-sort = "{prop: 'zongfen'}"
      size="mini"
      style="width: 100%">
      <el-table-column prop="name" label="被评价人"  align="center" />
      <el-table-column prop="dep_name" label="被评价部门"  align="center" />
      <el-table-column prop="namenum" label="已评价次数" align="center" />
      <el-table-column prop="zongfen" label="评价总分" align="center" sortable/>
      <el-table-column prop="avg_fen" label="评价平均分" align="center" />
    </el-table>

    <el-pagination
      style="margin-top: 12px;text-align: left;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal">
    </el-pagination>
  </div>
</template>
<script>
import resource from "@/resource";
import {mapState} from "vuex";
import XLSX from "xlsx";
export default {
  data(){
    return{
      data:[],
      tableData: [],
      // 分页的数据
      pageData: [],
      // 总数据量 默认为 0
      pageTotal: 0,
      // 当前页 默认是第一页
      currentPage: 1,
      // 每页大小 默认每页10条数据
      pageSize: 10,
    }
  },
  created() {
    this.loadData();
  },
  computed:{
    ...mapState(['userinfo']),
    excelDownloadTranslate(){
      return {
        "name": "被评价人",
        "dep_name": "被评价部门",
        "namenum": "已评价次数",
        "zongfen": "评价总分",
        "avg_fen": "评价平均分",
      }
    },
  },
  props:{
    ceping_id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  methods:{
    // 改变每页大小的回调
    handleSizeChange (val) {
      this.pageSize = val

      this.pageData = this.queryByPage()
    },
    // 改变当前页的回调
    handleCurrentChange (val) {
      this.currentPage = val

      this.pageData = this.queryByPage()
    },
    // 实现分页的方法
    queryByPage () {
      // 起始位置 = (当前页 - 1) x 每页的大小
      const start = (this.currentPage - 1) * this.pageSize
      // 结束位置 = 当前页 x 每页的大小
      const end = this.currentPage * this.pageSize

      return this.tableData.slice(start, end)
    },
    async loadData(){
      try {
        let params = {
          ceping_id: this.ceping_id,
          biz_id: this.$bizCode.ceping_biz,
          src_id: this.$sourceCode.source_id,
          sys_id:this.userinfo.sys_id,
          org_id: this.userinfo.org_id
        }
        let resp2 = await resource.getObj('formdatareport',100020,params)
        if(resp2.data.length>0){
          this.tableData = resp2.data
          this.pageTotal = resp2.data.length

          this.pageData = this.queryByPage()
        }
      }catch (e) {
        console.error(e)
      }
    },
    exportExcel() {
      let header = [
        "被评价人",
        "被评价部门",
        "已评价次数",
        "评价总分",
        "评价平均分"
      ]
      let tmp = [];
      this.pageData.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) {
              obj[this.excelDownloadTranslate[key]] = i[key];
          }
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, (this.name || "") +"测评结果.xlsx");
    },
  }
}

</script>
<style>

</style>