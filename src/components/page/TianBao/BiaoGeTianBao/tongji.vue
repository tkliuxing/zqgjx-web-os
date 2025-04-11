<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.go(-1)"
          >返回
          </el-button>
        </el-form-item>
        <el-form-item label="填报时间:">
          <el-date-picker   v-model="searchForm.create_time" clearable value-format="yyyy-MM-dd HH:mm:ss"/>
        </el-form-item>
        <el-form-item>
          <el-button round  @click="loadData" type="primary" icon="el-icon-search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button round @click="heji" :disabled="multipleSelection.length == 0"  type="primary">合计</el-button>
        </el-form-item>
      </el-form>


      <div style="margin-top: 10px">
        <el-table
          :data="data"
          stripe
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="user_id"
            label="填表人" align="center">
            <template slot-scope="{ row }">
              {{ get_use_dep_option_data_display(row.user_id) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="dep_id"
            label="填表部门" align="center">
            <template slot-scope="{ row }">
              {{ get_dep_option_data_display(row.dep_id) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="填表时间" align="center">
            <template slot-scope="{ row }">
              {{ moment(row.create_time).format('yyyy-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <!--    操作-->
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button @click="chakan(row)" type="primary">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog :fullscreen="true" title="查看" :visible.sync="formDialogVisable"  :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close @close="formDialogVisable = false">
      <el-button type="warning" round @click="daochu"  icon="el-icon-download">数据导出</el-button>
      <div slot="footer">
      <div id="x-spreadsheet-demo"></div>
        <el-button @click="formDialogVisable=false" icon="el-icon-close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Spreadsheet from 'x-data-spreadsheet';
import zhCN from 'x-data-spreadsheet/src/locale/zh-cn';
import XLSX from 'xlsx';
//设置中文
Spreadsheet.locale('zh-cn', zhCN);
import {xtos , stox} from './xlsxsprea';
import resource from "@/resource";
import Form from "@/components/page/TianBao/BiaoGeTianBao/Form.vue";
import moment from "moment/moment";
export default {
  components: {Form},
  data() {
    return {
      loading: false,
      pk:this.$route.params.id,
      data: [],
      alluser: [],
      formDialogVisable: false,
      xs: null,
      multipleSelection: [],
      row: null,
      searchForm:{
        create_time:null
      },
      use_dep_option_data: [],
    }
  },
  async mounted() {
    await this.loadData();
    await this.getLoadDataSource();
  },
  methods:{
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if(this.multipleSelection.length == 0){
        // 把data里面不带pk的数据删除
        this.data.forEach((item,index)=>{
          if(!item.pk){
            this.data.splice(index,1)
          }
        })
      }
    },
    daochu(){
      let xSpreadsheetData = this.xs.getData();
      // 将 x-spreadsheet 数据对象转换为 SheetJS 格式的工作簿
      let workbook = xtos(xSpreadsheetData);
      // 导出为 Excel 文件
      XLSX.writeFile(workbook, `数据表.xlsx`);
    },
    async heji(){
      let arr = [];
      this.multipleSelection.forEach(item=>{
        let every = JSON.parse(item.peizhi)
        arr.push(every.rows)
      })
      let resp1 = await resource.getList('data',{
        template_id:'FT341057895368679424',
        pk:this.pk
      })

      let data1 = JSON.parse(resp1[0].peizhi)[0].rows;
      let haha = this.compareAndAdd(data1,arr); // 计算总和
      let peizhidata = JSON.parse(resp1[0].peizhi)[0]; // 取原始数据
      let newData = this.replaceRows(peizhidata,haha);
      // 循环data里面的数据 保留第一条不带pk的数据,其他不带pk的数据删除
      this.data.forEach((item,index)=>{
        if(!item.pk){
          this.data.splice(index,1)
        }
      })
      this.data.unshift({
        user_id:'合计',
        name:'合计',
        crate_time:this.moment().format('YYYY-MM-DD HH:mm:ss'),
        peizhi: JSON.stringify(newData)
      })

    },
   async chakan(val){
      this.row = val;
      let peizhi = JSON.parse(val.peizhi);
      if(peizhi){
        await this.init(peizhi);
      }
     this.formDialogVisable = true;
    },
    init(val) {
      this.xs  = new Spreadsheet('#x-spreadsheet-demo')
        .change((cdata) => {
        });
      this.xs.sheet.contextMenu.isHide = true;
      if(val){
        this.xs.loadData(val)
      }
    },
    async loadData(){
      this.loading = true;
      try {
        let params={
          guanlian_id:this.pk,
          template_id:'FT341130672104083456'
        }
        if (this.searchForm.create_time) {
          params["create_time_after"] = this.searchForm.create_time;
          params["create_time_before"] = moment(this.searchForm.create_time).add(1, 'day').format("YYYY-MM-DD");
        }
        // 信息统计
        let resp = await resource.getList('data',params);
        this.data = resp;
        // let resp1 = await resource.getList('data',{
        //   template_id:'FT341057895368679424',
        //   pk:this.pk
        // })
        // let data1 = JSON.parse(resp1[0].peizhi)[0].rows;
        // let arr = [];
        // resp.forEach(item=>{
        //   let every = JSON.parse(item.peizhi)
        //   arr.push(every.rows)
        // })
        // let haha = this.compareAndAdd(data1,arr); // 计算总和
        // let peizhidata = JSON.parse(resp1[0].peizhi)[0]; // 取原始数据
        // let newData = this.replaceRows(peizhidata,haha) // 拿到替换后的数据,追加到数组第一条
        // this.data.unshift({
        //   user_id:'该条数据为总合计',
        //   crate_time:resp[0].create_time,
        //   peizhi: JSON.stringify(newData)
        // })
      }catch (e) {
        console.log(e)
      }
      this.loading = false;
    },
    // 替换方法
    replaceRows(originalData, newData) {
      const result = { ...originalData }; // Clone the originalData object
      result.rows = { ...result.rows, ...newData };
      return result;
    },

    compareAndAdd(originalData, arrayData) {
      const newItem = JSON.parse(JSON.stringify(originalData)); // Clone the originalData object

      for (const item of arrayData) {
        for (const key in item) {
          if (key === "len") continue; // Skip "len" property

          if (typeof item[key] === "object" && item[key].hasOwnProperty("cells")) {
            const originalCells = newItem[key].cells;
            const newCells = item[key].cells;

            for (const cellKey in newCells) {
              const newValue = parseInt(newCells[cellKey].text);
              if (!isNaN(newValue)) {
                if (originalCells.hasOwnProperty(cellKey)) {
                  const originalValue = parseInt(originalCells[cellKey].text);
                  if (!isNaN(originalValue)) {
                    originalCells[cellKey].text = (originalValue+ newValue).toString();
                  } else {
                    originalCells[cellKey].text = newValue.toString();
                  }
                } else {
                  originalCells[cellKey] = {text: newValue.toString()};
                }
              }
            }
          }
        }
      }
      return newItem;
    },
    get_use_dep_option_data_display(value) {
      let option = this.alluser.filter((item) => {
        return item["pk"] === value;
      });
      if (option.length > 0) return option[0]["full_name"];
      return value;
    },
    get_dep_option_data_display(value) {
      let option = this.use_dep_option_data.filter((item) => {
        return item["pk"] === value;
      });
      if (option.length > 0) return option[0]["name"];
      return value;
    },
    async getLoadDataSource(){
      this.loading = true;
      try{
        this.alluser = await resource.getList('usermin');
        this.use_dep_option_data = await resource.getList("flatdepartment", {});
      }catch (e) {
        console.log(e)
      }
      this.loading = false;
    }
  }
}
</script>
<style scoped>

</style>