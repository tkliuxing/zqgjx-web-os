<template>
  <div>
    <div
      style="
      background: #fff;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0px 0px 15px #ccc;
    "
    >
      <div>
        <el-form inline>
          <el-form-item>
            <el-button
              type="info"
              round
              icon="el-icon-arrow-left"
              @click="$router.replace({ name: 'biaogetianbao-index' })"
            >返回
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              round
              @click="submit"
            >填报完成
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="info"
              round
              @click="gotoLog"
            >操作日志
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" round @click="daochu"  icon="el-icon-download">数据导出</el-button>
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-button @click="excelDialogVisable=true" type="success" round icon="el-icon-upload">数据导入</el-button>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button @click="excelExport" type="warning" round icon="el-icon-download">数据导出</el-button>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button @click="logView" type="info" round plain icon="el-icon-s-order">操作日志</el-button>-->
<!--          </el-form-item>-->
          <!--        <el-form-item v-if="hasPerm('二维填报结果统计')">-->
          <!--          <el-button @click="configurelDialogVisable=true" type="primary" round plain icon="el-icon-s-data">结果统计-->
          <!--          </el-button>-->
          <!--        </el-form-item>-->
        </el-form>
      </div>
      <div v-if="!loading"  style="overflow: hidden">
        <div id="x-spreadsheet-demo"></div>
      </div>
    </div>
  </div>
</template>
<script>
import resource from "@/resource";
import Spreadsheet from 'x-data-spreadsheet';
import zhCN from 'x-data-spreadsheet/src/locale/zh-cn';
import {mapState} from "vuex";
import XLSX from 'xlsx';
import {xtos} from "@/components/page/TianBao/BiaoGeTianBao/xlsxsprea";

//设置中文
Spreadsheet.locale('zh-cn', zhCN);
export default {
  data() {
    return {
      loading: false,
      data: {
        peizhi:null,
      },
      xs: null,
      form:{
        create_time: null,
        dep_id: null,
        user_id: null,
        shuju: null,
        id: null,
      },
      rzhi:{
        user_id: null,
        create_time: null,
        content: null,
      },
      tid:this.$route.params.id,
      zuobiao:{
        ri:null, // 行
        ci:null, // 列
      },
      selectData: null, // 选中的数据
      selectIdx: null, // 选中的下标
      dqData: [], // 当前数据
    }
  },
  async mounted() {
    await this.loadData();
    await this.init();
  },
  computed: {
    ...mapState(['userinfo']),
  },
  methods:{
    daochu(){
      var xSpreadsheetData = this.xs.getData();
      // 将 x-spreadsheet 数据对象转换为 SheetJS 格式的工作簿
      var workbook = xtos(xSpreadsheetData);
      // 导出为 Excel 文件
      XLSX.writeFile(workbook, `${this.data.name || null}.xlsx`);
    },
    gotoLog(){
      this.$router.push({
        name:'biaogetianbao-log',
        params:{tid:this.tid || null}
      })
    },
    async rzhisave(){
      for (const key in this.form) {
        if (this.form[key] !== null && typeof this.form[key] === "object") {
          this.form[key] = JSON.stringify(this.form[key]);
        }
      }
      try {
        this.form.create_time = this.moment().format('yyyy-MM-DD HH:mm:ss');
        this.form.user_id = this.userinfo.pk;
        let zuobiao = this.getExcelCellAddress(this.selectData.ci,this.selectData.ri);
        this.form.content = `坐标：${zuobiao},由${this.dqData[this.selectIdx].oldValue} 修改为:${this.dqData[this.selectIdx].newValue}`
        this.form.id = this.$route.params.id;
        // 创建日志
        await resource.createObj('data',{
          ...this.form,
          template_id:'FT341135442506866688'
        })
        let form = {
          create_time : this.moment().format('yyyy-MM-DD HH:mm:ss'),
          dep_id : this.userinfo.department,
          user_id : this.userinfo.pk,
          peizhi: JSON.stringify(this.xs.getData()[0]),
          guanlian_id : this.$route.params.id,
        }
        console.log(this.data)
        if(this.data.pk){
         this.data = await resource.patchObj('data',this.data.pk,{
            ...form,
            template_id:'FT341130672104083456'
          })
        }else{
         this.data = await resource.createObj('data',{
            ...form,
            template_id:'FT341130672104083456'
          })
        }
        this.selectData = null;
      }catch (e) {
        console.log(e)
      }
    },
    async submit(){
      try {
        await this.rzhisave();
        this.$message.success('填报成功')
      }catch (e) {
        console.log(e)
      }
    },
    async loadData(){
      this.loading = true;
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
     try{
       let data = await resource.getList(`data`, {
         user_id:this.userinfo.pk,
         guanlian_id: this.$route.params.id,
         template_id: 'FT341130672104083456'});
       let aa = null;
       if(data.length== 0){
         let resp = await resource.getList(`data`, {
           pk: this.$route.params.id,
           template_id: 'FT341057895368679424'});
          this.data.peizhi = resp[0].peizhi;

       }else{
          this.data = data[0];
         let resp = await resource.getList(`data`, {
           pk: this.$route.params.id,
           template_id: 'FT341057895368679424'});
          aa = resp[0].peizhi;
          let obj = JSON.parse(aa)[0].rows;
         // 拿obj.rows和this.data.peizhi的每一项数据对比(根据ri,ci做对比),如果text不一样就替换/
          // 1.拿到rows
          let data1 = obj;
          // 2.拿到this.data.peizhi
          let data2 = JSON.parse(this.data.peizhi).rows;
         for (const key1 in data1) {
           if (data1.hasOwnProperty(key1) && data2.hasOwnProperty(key1)) {
             const cells1 = data1[key1]["cells"];
             const cells2 = data2[key1]["cells"];
             for (const subKey1 in cells1) {
               if (cells1.hasOwnProperty(subKey1) && cells2.hasOwnProperty(subKey1)) {
                 if (cells1[subKey1]["text"] !== cells2[subKey1]["text"]) {
                   cells2[subKey1]["text"] = cells1[subKey1]["text"];
                 }
               }
             }
           }
         }
         let rows = this.replaceRows(this.data.peizhi.rows, data2 );
          JSON.parse(this.data.peizhi).rows = rows.rows;
       }
     }catch (e) {
     }
      this.loading = false;
      loading.close();
    },
    // 替换方法
    replaceRows(originalData, newData) {
      const result = { ...originalData }; // Clone the originalData object
      result.rows = { ...result.rows, ...newData };
      return result;
    },
    init() {
        this.xs  = new Spreadsheet('#x-spreadsheet-demo')
          .change((cdata) => {
            let data = cdata.rows;
            // 根据坐标拿到数据
            // this.zuobiao.ri是key this.zuobiao.ci是value
            if (data[this.zuobiao.ri] && data[this.zuobiao.ri].cells[this.zuobiao.ci]) {
              const targetData = data[this.zuobiao.ri].cells[this.zuobiao.ci];
              this.selectData = {
                ri: this.zuobiao.ri,
                ci: this.zuobiao.ci,
                value: targetData.text !== undefined ? targetData.text : '空',
              };
              this.selectIdx = this.dqData.findIndex((item)=>{
                return item.ri == this.zuobiao.ri && item.ci == this.zuobiao.ci
              });
              this.dqData[this.selectIdx].newValue = targetData.text !== undefined ? targetData.text : '空'
            } else {
            }
          });
        // this.xs.sheet.contextMenu.isHide = true  // 禁止右键菜单
        if(this.data && this.data.peizhi){
          this.xs.loadData(JSON.parse(this.data.peizhi));
        }
        this.xs.on('cell-selected', (cell, ri, ci) => {
          this.zuobiao.ri = ri;
          this.zuobiao.ci = ci;
          // 如果存的坐标和当前坐标一样,就提交数据,否则不提交
          //   console.log('提交数据',cell)
            let idx = this.dqData.findIndex((item)=>{
              return item.ri == this.zuobiao.ri && item.ci == this.zuobiao.ci
            });
          if (cell && cell.text !== undefined) {
              if(idx === -1){
                this.dqData.push({
                  ri: ri,
                  ci: ci,
                  oldValue: cell.text,
                  newValue:''
                })
              }else{
                this.dqData[idx] = {
                  ri: this.dqData[idx].ri,
                  ci: this.dqData[idx].ci,
                  oldValue: cell.text,
                  newValue:''
                }
              }
          } else {
            if(idx === -1){
              this.dqData.push({
                ri: ri,
                ci: ci,
                oldValue: '空',
                newValue:''
              })
            }
          }
           if(this.selectData){
             this.rzhisave();
           }
        });

    },
    // 转换列索引为 Excel 列字母
    getExcelCellAddress(ci, ri) {
      // 转换列索引 ci 为 Excel 列字母
      const columnLetter = String.fromCharCode(65 + ci);
      // 获取行索引 ri，再加上 1，因为 Excel 行索引从 1 开始
      const rowNumber = ri + 1;
      // 组合列字母和行索引，得到 Excel 单元格标识
      const cellAddress = `${columnLetter}${rowNumber}`;
      return cellAddress;
    },

  }

}
</script>
<style scoped>

</style>