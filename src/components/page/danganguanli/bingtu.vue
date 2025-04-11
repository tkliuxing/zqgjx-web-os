<template>
  <div>
    <div
      ref="echarts"
      style="width: 390px;height: 235px"
    ></div>
  </div>

</template>

<script>
import * as echarts from 'echarts'
import resource from "@/resource";
export default {
 data(){
   return{
     ren:0,
     cai:0,
     xing:0,
     shi:0,
     ying:0,
     ji:0,
     kai:0,
     wu:0,
     data:[],
     dataYuan:[],
     danganData_bumen:[],

   }
 },
  created() {
    this.loadData()

    this.getLocalDataSource()

  },
  methods: {
    async getLocalDataSource() {
      this.sys_id=1;
      this.org_id=1;
      let dangan_data = await resource.getList("data", {"template_id":"FT333844866544001024"});
      for(let item in dangan_data){
        this.danganData_bumen.push(dangan_data[item].bumen)
      }
      let bumen_data =  await resource.getList("flatdepartment",{});
      for(let item in bumen_data){
        this.dataYuan.push(bumen_data[item].name)
      }
      this.traverse()
    },
    async loadData() {

    },
    filterTag(value, row) {
      return row.zhuangtai === value;
    },
    traverse(){

      let aa = this.danganData_bumen;
      let self = this;

      this.dataYuan.forEach(function (item) {

        let count = aa.reduce(function (acc, curr) {
          if (curr == item) {
            acc++;
          }
          return acc;
        }, 0);

        self.data.push({ name: item, value: count });

      });
      let data = this.data.filter(item=>  item != undefined)
      this.echarts(data);





      // for (let i in this.date){
      //   let fen =this.date[i].bumen
      //
      //
      //   if (fen == '汇鑫软件') {
      //     this.ren+=1
      //     this.date.push(this.bumen_renshi={name:'汇鑫软件',value:this.ren})

        // } else if (fen == '行政部') {
        //   this.xing+=1
        //   this.date.push(this.bumen_xingzheng={name:'行政部',value:this.xing})

        // } else if (fen == '财务部') {
        //   this.cai+=1
        //   this.date.push(this.bumen_caiwu={name:'财务部',value:this.cai})

        // }else if (fen == '销售部') {
        //   this.shi+=1
        //   this.date.push(this.bumen_shichang={name:'销售部',value:this.shi})

        // }else if (fen == '硬件部') {
        //   this.ying+=1
        //   this.date.push(this.bumen_yingjian={name:'硬件部',value:this.ying})

        // }else if (fen == '技术部') {
        //   this.ji+=1
        //   this.date.push(this.bumen_jishu={name:'技术部',value:this.ji})

        // }else if (fen == '开发部') {
        //   this.kai+=1
        //   this.date.push(this.bumen_kaifa={name:'开发部',value:this.kai})

      //   }else {
      //     this.wu+=1
      //       this.date.push(this.bumen_wu={name:'暂无数据',value:this.wu})
      //   }
      // }
      // this.data.push(this.bumen_renshi)
      // this.data.push(this.bumen_xingzheng)
      // this.data.push(this.bumen_caiwu)
      // this.data.push(this.bumen_shichang)
      // this.data.push(this.bumen_yingjian)
      // this.data.push(this.bumen_jishu)
      // this.data.push(this.bumen_kaifa)
      // this.data.push(this.bumen_wu)
      // this.option.series.data = this.data;
      //
    },

    echarts(data){

      let Myecharts = echarts.init(this.$refs.echarts);

     let option = {
        title: {  // 标题
          text: '文档部门',
            left: 'center'
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
        orient:'vertical',
          right:'1%',


        },
        series: [
          {
            name: '部门类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 17,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            date:[],


            data:data

          }
        ]
      };
      return Myecharts.setOption(option)
    }
  }

}

</script>

<style scoped>

</style>
