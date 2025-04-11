<template>
  <el-card>
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
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="data"
      v-loading="loading"
      element-loading-text="正在加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      border
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      ref="table"
      :default-sort = "{prop: 'zongfen',order: 'ascending', sortBy: (a, b) => parseInt(a.zongfen).toFixed(2) - parseInt(b.zongfen).toFixed(2)}"
    >
      <el-table-column prop="name" label="被评价人"

                       :filters="filterData"
                       :filter-method="filterHandler"
      > </el-table-column>
      <el-table-column prop="dep_name" label="被评价部门"> </el-table-column>

      <template v-for="index in ceping.xiangmu_length">
        <el-table-column
          :prop="getFenShuProp(index)"
          :label="getNameProp(index)"
          :key="index"
        >
        </el-table-column>
      </template>
      <el-table-column prop="zongfen" label="总分" sortable>
<!--        <template slot-scope="{ row }">-->
<!--          <div>{{ getfixNumber(row.zongfen) }}</div>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column prop="zongfen" label="操作">
        <template slot-scope="{ row }">
          <el-popconfirm title="确定删除吗？" @confirm="del(row)">
            <el-button type="danger" class="deleteButton" size="mini" round slot="reference" icon="el-icon-remove">
              删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
import resource from "@/resource";
import XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  name: "JieGuo",
  props: ["ceping_id"],
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      ceping: {
        xiangmu_length: 0,
      },
      loading:false
    };
  },
  methods: {
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    // 结果列表
    async loadData() {
      this.loading = true
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        ceping_id: this.ceping_id,
        biz_id: this.$bizCode.ceping_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT6624995528704",
        o:'-zongfen'
      };
      try {
        let resp = await resource.getList("data", params);
        resp.data.forEach(i=>{
          if(i.zongfen){
            i.zongfen = Number(parseInt(i.zongfen).toFixed(2))
          }
        })
        this.data = resp.data;
        this.total = resp.count;
      } catch (e) {
        this.$message.error("数据获取错误!");
      }
      this.loading = false
    },
    // 测评详情
    async loadCePing() {
      try {
        let params = {
          biz_id: this.$bizCode.ceping_biz_id,
          src_id: this.$sourceCode.source_id,
          template_id: "FT6372255133696",
        };
        this.ceping = await resource.getObj("data", this.ceping_id, params);
        } catch (e) {
        this.$message.error("数据获取错误!");
      }
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
    pad(num, n) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    getNameProp(index) {
      return this.ceping["xiangmu_" + this.pad(index, 2)];
    },
    getFenShuProp(index) {
      return "defen_" + this.pad(index, 2);
    },
    getfixNumber(num) {
      return Number(parseInt(num).toFixed(2));
    },
    exportExcel() {
      let header = [
        "被评价人",
        "被评价部门",
        "总分"
      ]
      if(this.ceping.xiangmu_length>0){
        for(let i=0;i<this.ceping.xiangmu_length;i++){
          header.splice(2+i,0,this.ceping["xiangmu_"+this.pad(i+1,2)])
          this.excelDownloadTranslate[this.getFenShuProp(i+1)] = this.ceping["xiangmu_"+this.pad(i+1,2)]
        }
      }
      let tmp = [];
      this.data.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) {
            if(key == 'zongfen'){
              obj[this.excelDownloadTranslate[key]] = i[key] ? Number(parseInt(i[key]).toFixed(2)): 0;
            }else{
              obj[this.excelDownloadTranslate[key]] = i[key];
            }
          }
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, (this.ceping.name || "") +"测评结果.xlsx");
    },
  },
  computed: {
    excelDownloadTranslate(){
      return {
        "name": "被评价人",
        "dep_name": "被评价部门",
        "zongfen": "总分"
      }
    },
    filterData(){
      let filData =  this.data.map((i)=>{
       let obj = {};
       obj = {
         value:i.name,
         text:i.name,
       }
       return obj
      })
      return filData.filter((i,index)=>{
        return filData.findIndex((j)=>j.value === i.value) === index
      })

    }
  },
  async mounted() {
    await this.loadCePing();
    await this.loadData();
  },
};
</script>

<style scoped>
</style>
