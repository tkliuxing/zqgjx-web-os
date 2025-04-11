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
      xiao:0,
      wu:0,
      data:[],
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
        this.danganData_bumen.push(dangan_data[item].fenlei)
      }
      // let bumen_data = await resource.getObjFromList("basetree",{"parent_name":'档案分类',org_id:1});
      // for(let item in bumen_data){
      //   this.dataYuan.push(bumen_data[item].name)
      // }
      let bumen_data =  await resource.getObjFromList("basetree",{"name":"档案分类",org_id:this.userinfo.org_id});
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
    },

    echarts(data){

      let Myecharts = echarts.init(this.$refs.echarts);

      let option = {
        title: {
          text: '档案类型',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient:'vertical',
          left: '-2.1%'

        },
        series: [
          {
            name: '类型分类',
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
