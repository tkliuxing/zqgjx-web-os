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
import {mapState} from "vuex";
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
      baomi_option_data:[],
      shujuleng:'',
      dataYuan:[],
      danganData_bumen:[],



    }
  },
  created() {
    this.getLocalDataSource()
  },
  computed:{
    ...mapState(['userinfo'])
  },
  methods: {
    async getLocalDataSource() {
      this.sys_id=1;
      this.org_id=1;
      let dangan_data = await resource.getList("data", {"template_id":"FT333844866544001024"});
      for(let item in dangan_data){
        this.danganData_bumen.push(dangan_data[item].baomi)
      }
      let bumen_data =  await resource.getObjFromList("basetree",{"name":"保密等级",org_id:this.userinfo.org_id});
      let bumen = bumen_data.items;
      if(bumen.length> 0){
        for(let item in bumen){
          this.dataYuan.push(bumen[item].name)
        }
      }
      this.traverse()
    },

    filterTag(value, row) {
      return row.zhuangtai === value;
    },
    traverse(){

      let aa = this.danganData_bumen;
      let self = this;

      this.dataYuan.forEach(function (item) {
        console.log(item);
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
      //   let fen =this.date[i].baomi
      //   if (fen == '公开') {
      //     this.ren+=1
      //     this.date.push(this.bumen_yiji={name:'公开',value:this.ren})
      //
      //   } else if (fen == '专用') {
      //     this.xing+=1
      //     this.date.push(this.bumen_erji={name:'专用',value:this.xing})
      //
      //   } else if (fen == '上级部门') {
      //     this.cai+=1
      //     this.date.push(this.bumen_sanji={name:'上级部门',value:this.cai})
      //
      //   }else if (fen == '本人') {
      //     this.shi+=1
      //     this.date.push(this.bumen_siji={name:'本人',value:this.shi})
      //
      //   }else if (fen == '本部门') {
      //   this.ying+=1
      //   this.date.push(this.bumen_wuji={name:'本部门',value:this.ying})
      // } else {
      //     this.wu+=1
      //     this.date.push(this.bumen_wu={name:'暂无数据',value:this.wu})
      //   }
      // }
      // this.data.push(this.bumen_yiji)
      // this.data.push(this.bumen_erji)
      // this.data.push(this.bumen_sanji)
      // this.data.push(this.bumen_siji)
      // this.data.push(this.bumen_wuji)
      // this.data.push(this.bumen_wu)
      //
      // // this.option.series.data = this.data;
      // let data = this.data.filter(item=>  item != undefined)
      // this.echarts(data);
    },

    echarts(data){

      let Myecharts = echarts.init(this.$refs.echarts);

      let option = {
        title: {
          text: '保密等级',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '90%',

        },
        series: [
          {
            name: '保密等级',
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
  },

}

</script>

<style scoped>

</style>
