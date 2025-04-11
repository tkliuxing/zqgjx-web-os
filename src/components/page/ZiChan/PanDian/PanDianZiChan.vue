<template>
  <el-row :gutter="20">
    <el-col :span="12" :body-style="{ height: '500px' }">
      <el-card class="yzichan">
        <YZiChan @freshen="getPanDianList"></YZiChan>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card>
        <div style="margin-bottom:10px">盘点列表</div>
        <el-button type="success" round @click="download" size="mini">
          导出
        </el-button>
        <el-table
          stripe
          border
          ref="table"
          :data="data"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
          style="margin-top: 1rem"
        >
          <el-table-column
            label="资产名称"
            prop="goods_info.name"
          ></el-table-column
          ><el-table-column
            label="资产分类"
            prop="goods_info.category_display"
          ></el-table-column
          ><el-table-column
            label="使用单位/部门"
            prop="goods_info.department_display"
          ></el-table-column
          ><el-table-column
            label="使用人员"
            prop="goods_info.persion"
          ></el-table-column>
          <el-table-column label="操作" width="160px">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                round
                size="mini"
                v-if="row.yipandian == '是'"
                plain
                @click="yipandian(row)"
                >已盘点</el-button
              >
              <el-button
                type="primary"
                round
                size="mini"
                v-else
                @click="pandian(row)"
                >盘点</el-button
              >
              <el-button type="danger" round size="mini" @click="del(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'
import resource from '@/resource'
import YZiChan from './YZiChan.vue'
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  components: {
    YZiChan
  },
  data(){
    return {
      data:[],
      pk:'',
      id:''
    }
  },
  created () {
    this.id = this.$route.query.pk
  },
  methods:{
    async getPanDianList(){
      this.data=[]
      let params={
        inventoryplan:this.id
      }
      let res = await resource.getList('gdzc-pandiantozichan',params)
      res.forEach(val => {
        this.data.push(val)
      });
    },
   async pandian(row){
          let data={
        goods_info:row,
        yipandian: "是",
        inventoryplan:this.id,
        goods:row.goods_info.pk
      }
      let res=await this.$http.put(`/gdzc-pandiantozichan/${row.pk}/`,data)
      this.$message({
            type: 'success',
            message: '盘点成功!'
          })
      this.getPanDianList()
    },
   async yipandian(row){
       let data={
        goods_info:row,
        yipandian: "否",
        inventoryplan:this.id,
        goods:row.goods_info.pk
      }
      let res=await this.$http.put(`/gdzc-pandiantozichan/${row.pk}/`,data)
      this.$message({
            type: 'info',
            message: '取消盘点!'
          })
      this.getPanDianList()
    },
    del(row){
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.delete('/gdzc-pandiantozichan/' + row.pk + '/')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          setTimeout(() => {
            this.getPanDianList()
          }, 200)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    download() {
      this.$nextTick(() => {
        let wb = XLSX.utils.table_to_book(this.$refs.table.$el),
          tmp = {};
        for (const key in wb.Sheets.Sheet1) {
          if (!key.startsWith("E")) {
            tmp[key] = wb.Sheets.Sheet1[key];
          }
        }
        wb.Sheets.Sheet1 = { ...tmp };
        let wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "盘点列表.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
      });
    },
  },
  mounted () {
    this.getPanDianList()
  }

}
</script>

<style></style>
