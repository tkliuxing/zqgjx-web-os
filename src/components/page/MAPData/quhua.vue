<template>
    <el-card class="my-map" style="width: 100%; height: 700px;">
      <!-- 悬浮的 LayerToolbar -->
      <div class="my-map-placement is-light right-top" style="z-index: 1; margin: 10px;">
        <LayerToolbar
          @init-category="initCategory"
          @category-change="onCategoryChange"
          @node-click="toolbarNodeClick"
          @onAddClick="onAddClick"
          :can-edit="true"
        >
          <template v-slot:manager="{layerManagerVisible}">
            <LayerManager v-if="layerManagerVisible" :layermanaged="true" :layereditable="true"></LayerManager>
          </template>
        </LayerToolbar>
      </div>
      <div class="arrow-tag" v-if="isShowButton">
        <el-button style="margin-left: 5px" @click="Back">返回上一级</el-button>
      </div>
      <div id="map" class="networkChart"></div>
    </el-card>
</template>
<script>
import * as echarts from "echarts";

require("echarts/lib/component/geo");
// 散点图
require("echarts/lib/chart/scatter");
// 散点图放大
require("echarts/lib/chart/effectScatter");
// 地图
require("echarts/lib/chart/map");
// 图例
require("echarts/lib/component/legend");
// 提示框
require("echarts/lib/component/tooltip");
// 引入 polygon 支持
// require("echarts/lib/chart/polygon");
import axios from "axios";
import LayerManager from "@/components/MapNew/LayerManager.vue";
import LayerToolbar from "@/components/MapNew/LayerToolbar.vue";
import resource from "@/resource";

const WHITE_COLOR = "#FFFFFF";
const GREEN_COLOR = "#00FF01";
export default {
  components: {LayerToolbar, LayerManager},
  data() {
    return {
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      mapHeight: "700px",
      links: [],
      isShowButton: false,
      startVal: 0,
      endVal: 3000000000,
      community: [],
      polygons: [],
      city_id: 354,
      level: 1,
      code: "0015",
      city_list: [],
      history_list: [],
      currentCategorys: [],
      geoData: null,
      mapData: null,
    };
  },
  created() {
    this.loadData();
    let mapHeight = document.documentElement.clientHeight - 110;
    this.mapHeight = mapHeight + "px";
    window.onresize = () => {
      window.screenHeight = document.documentElement.clientHeight;
      let mapHeight = document.documentElement.clientHeight - 110;
      if (this.fullscreen) {
        mapHeight = document.documentElement.clientHeight;
      }
      this.mapHeight = mapHeight + "px";
    };
  },
  async mounted() {
    await this.loadData();
    await this.initEchart();
    this.setMapData();
  },

  methods: {
    async loadData() {
      try {
        const resp = await axios.get(`https://data.avuejs.com/api/blade-visual/map/lazy-list?parentId=${this.city_id}`)
        if (resp.data.code === 200) {
          this.city_list = resp.data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async initEchart() {
      try {
        const resp = await axios.get(`https://data.avuejs.com/api/blade-visual/map/lazy-list?parentId=${this.city_id}`)
        if (resp.data.code === 200) {
          this.mapData = JSON.parse(resp.data.data.data);
          this.level = resp.data.data.level;
          this.code = resp.data.data.code;
          // 检查地图是否已经注册
          if (!echarts.getMap(this.code)) {
            echarts.registerMap(this.code, this.mapData);
          }
        }
      } catch (error) {
        console.log(error);
      }

      // 初始化echarts实例
      if (this.myChart) this.myChart.dispose();
      let myChart = echarts.init(document.getElementById("map"));
      this.myChart = myChart;
      // 设置地图配置项

      this.geoData = {
        type: "map",
        map: this.code ? this.code : "00",
        layoutCenter: ["50%", "50%"], // 将地图放置于容器正中央
        layoutSize: this.level === 3 ? "100%" : "130%", // 地图改变大小,可以设置根据层级设置
        roam: true, //是否开启平游或缩放
        scaleLimit: {
          //滚轮缩放的极限控制
          min: -10, //最小缩小
          max: 50, // 最大放大倍数
        },
        left: "3%",
        right: "3%",
        label: {
          show: true, // 显示地区名称
          textStyle: {
            color: "#fff",
          },
          emphasis: {
            // 鼠标触摸显示的字体样式
            textStyle: {
              color: "#fff",
            },
          },
        },
        itemStyle: {
          normal: {
            borderColor: 'rgb(70,68,68)',
            shadowColor: 'rgba(80,73,74,0.8)',
            shadowOffsetY: 0,
            shadowBlur: 15,
            areaColor: "#0369c9",
          },
          // 地图背景色
          areaColor: "#1c5c99",
          borderColor: "#1c5c99",
          shadowColor: "#1c5c99",
          shadowOffsetX: -2,
          shadowOffsetY: 2,
          shadowBlur: 10,
          // 鼠标触摸
          emphasis: {
            areaColor: "#5082fa",
          },
        },
      };

      let option = {
        animation: true,
        title: {
          textStyle: {
            color: "#FFFFFF",
            fontSize: 48,
            fontWeight: "normal",
          },
          left: "center",
          top: 30,
        },
        tooltip: {
          trigger: "item",
          formatter: function (item) {
            if (item.seriesType === "effectScatter") {
              return `<div>${item.name}</div>`;
            }
          },
        },
        series: [],
        // 地理坐标系组件
        // 文件6
        // backgroundColor: '#1D346F',
        //  geo: {
        //     show: true,
        //     map: this.code ? this.code : "00",
        //     label: {
        //         normal: {
        //             show: false
        //         },
        //         emphasis: {
        //             show: false,
        //         }
        //     },
        //     roam: true,
        //     itemStyle: {
        //         normal: {
        //             areaColor: '#1D346F',
        //             borderWidth: 0,
        //             shadowColor: '#23074d',
        //             shadowBlur: 30,
        //             shadowOffsetX: -2,
        //             shadowOffsetY: 5,
        //         },
        //         emphasis: {
        //             areaColor: '#52759b',
        //         },
        //     },
        // },
        //文件5
        // backgroundColor: '#020933',
        // geo: {
        //     map: this.code ? this.code : "00",//地图为刚刚设置的China
        //     aspectScale:0.75, //长宽比
        //     zoom:1.1,//当前视角的缩放比例
        //     roam: true,//是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        //     itemStyle: {//地图区域的多边形 图形样式
        //         normal: {
        //             areaColor: '#013C62',//地区颜色
        //             shadowColor: '#182f68',//阴影颜色
        //             shadowOffsetX: 0,//阴影偏移量
        //             shadowOffsetY: 5,//阴影偏移量
        //         },
        //         emphasis: {
        //             areaColor: '#2AB8FF',//地区颜色
        //             label: {
        //                 show: false,//是否在高亮状态下显示标签
        //             },
        //         },
        //     },
        // },
        // 文件4
        // backgroundColor: "black",
        /* geo: {
           roam: true,
           map: this.code ? this.code : "00",
           aspectScale: 0.8,
           layoutCenter: ["50%", "50%"],
           layoutSize: "120%",
           itemStyle: {
             normal: {
               areaColor: {
                 type: "linear-gradient",
                 x: 0,
                 y: 1200,
                 x2: 1000,
                 y2: 0,
                 colorStops: [
                   {
                     offset: 0,
                     color: "#152E6E", // 0% 处的颜色
                   },
                   {
                     offset: 1,
                     color: "#0673AD", // 50% 处的颜色
                   },
                 ],
                 global: true, // 缺省为 false
               },
               shadowColor: "#0f5d9d",
               shadowOffsetX: 0,
               shadowOffsetY: 5,
               opacity: 1,
             },
             emphasis: {
               areaColor: "#0f5d9d",
             },
           },
         },*/


        //原始地图
        geo: this.geoData,
      };


      // 加载地图
      myChart.setOption(option);
      let that = this;
      let selectedPointIndex = -1;
      myChart.on("click", function (params) {

        if (that.level === 3) {
          that.$message.warning("没有下级了呦！");
          return;
        }
        // 这里可以根据点击的省份或者地区参数 params 来进行相应的处理
        // 比如根据点击的省份加载该省份的地图数据，或者更新其他相关内容
        // 跳转到下一级
        //使用params.name 到this.city_list 找到对应的name 进行跳转
        // 根据 params.name 在 this.city_list 中查找对应的城市信息
        const selectedCity = that.city_list.find(city => city.name === params.name);

        if (selectedCity) {
          that.history_list.push(that.city_id);
          // 如果找到对应的城市信息，执行跳转逻辑
          that.city_id = selectedCity.id;
          that.ge(); // 假设 selectedCity.code 是需要传递的参数
          that.isShowButton = true; // 显示返回按钮
          // const option = myChart.getOption();
          // // 刷新图表
          // myChart.setOption(option, false, false);
        } else {
          console.warn(`未找到与名称 ${params.name} 匹配的城市`);
        }
        /*if (
          params.componentType === "series" &&
          params.seriesType === "effectScatter"
        ) {
          const clickedPoint = params.data;
          // 获取当前图表的配置项
          const option = myChart.getOption();
          // 还原上一个点的颜色
          if (selectedPointIndex !== -1) {
            const lastSelectedPoint = option.series[0].data[selectedPointIndex];
            lastSelectedPoint.itemStyle.color = WHITE_COLOR;
            lastSelectedPoint.label.color = WHITE_COLOR;
          }
          // 修改当前点击的点的颜色
          option.series[0].data.forEach((point, index) => {
            if (point.ids === clickedPoint.ids) {
              point.itemStyle.color = GREEN_COLOR;
              point.label.color = GREEN_COLOR;
              selectedPointIndex = index;
              // 处理社区的点击事件
              if (point.ids) {
                that.$emit("changes", point.ids, 2);
                that.loadData(point.ids, 2);
                that.isShowButton = true;
              }
            }
          });
          // 刷新图表
          myChart.setOption(option, false, false);
        }*/
      });
      return myChart;
    },
    async loadMarkers() {

      this.loading = true;
      try {
        this.community = [];

        let promises = [];
        let categorys = this.currentCategorys.filter(
          (i) => i.field_01 === "point"
        );
        for (let i = 0; i < categorys.length; i++) {
          let category = categorys[i];
          promises.push(this.loadMarkerFromCategory(category));
        }

        let data = await Promise.all(promises);
        data = data
          .flat()
          .filter((i) => i.gps_point.longitude && i.gps_point.latitude);
        if (data.length > 0) {
          this.community = data;
        }
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    },
    async loadPolygons() {
      this.loading = true;
      try {
        this.polygons = [];
        let promises = [];
        let categorys = this.currentCategorys.filter(
          (i) => i.field_01 === "polygon" || i.field_01 === "line"
        );
        for (let i = 0; i < categorys.length; i++) {
          let category = categorys[i];
          promises.push(this.loadMarkerFromCategory(category));
        }

        let data = await Promise.all(promises);

        data = data
          .flat();
        if (data.length > 0) {
          this.polygons = data;
        }
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    },
    async loadMarkerFromCategory(category) {
      if (category.field_02 === "is_template") {
        let url;
        if (['polygon', 'line'].includes(category.field_01)) {
          url = 'gps-polygon'
        } else {
          url = 'gps-point'
        }
        let data = await resource.getList(url, {
          sn: [category.pk],
        });
        if (data.length === 0) {
          return [{category: category, gps_point: {longitude: null, latitude: null}}]
        }
        if (['polygon', 'line'].includes(category.field_01)) {
          return [{...data[0], category: category, gps_point: {longitude: null, latitude: null}}]
        }
        return [{...data[0], category: category, gps_point: {longitude: data[0].longitude, latitude: data[0].latitude}}]
      } else {
        let data = await resource.getList("data-field-list", {
          template_id: category.field_03,
          field_names: `pk,${category.arguments}`,
          include_gps: "True",
        });
        return data.map((i) => {
          return {...i, category: category};
        });
      }
    },
    Back() {
      if (this.history_list.length > 0) {
        this.city_id = this.history_list[this.history_list.length - 1];
        this.history_list.pop();
        if (this.history_list.length === 0) {
          this.isShowButton = false; // 隐藏返回按钮
        }
      }
      this.loadData();
      this.initEchart();
      this.$emit("changes", "");
    },
    ge() {
      this.loadData();
      this.initEchart();
    },
    // 处理地图数据
    setMapData() {
      let myChart = this.myChart;
      // 设置marker点样式
      let itemStyle = {
        color: "#FFFFFF", // 默认状态为白色
        show: true,
      };

      // 设置字体样式
      let colorStyle = {
        show: true,
        color: "#fff",
        position: "right",
        formatter: "{b}",
        textStyle: {
          fontWeight: "blod",
          fontSize: 18,
          textShadowColor: "transparent", // 文字本身的阴影颜色。
          textShadowBlur: 1, // 文字本身的阴影长度。
          textShadowOffsetX: 5, // 文字本身的阴影 X 偏移。
          textShadowOffsetY: 0, //  文字本身的阴影 Y 偏移。
        },
      };
      // 绘制marker点
      let point = [];
      this.community.forEach((item) => {
        let color = WHITE_COLOR;
        point.push({
          name: item.category.name,
          ids: item.category.pk,
          value: [item.longitude, item.latitude],
          itemStyle: {color},
          label: {color},
        });
      });


      let series = [];
      if (point.length > 0) {
        series.push({
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          rippleEffect: {
            period: 2,
            brushType: "stroke",
            scale: 3,
          },
          label: colorStyle,
          //终点形象
          symbolSize: 10, // 圆点大小
          itemStyle: itemStyle,
          symbol: "circle",
          data: point, // marker点
        });
      }


      // 绘制多边形

      let polygons = []
      let polygons_data = []
      let geojson = JSON.parse(JSON.stringify(this.mapData));
      this.polygons.forEach((poly) => {
        if (poly && poly.line) {
          let line = JSON.parse(poly.line);
          polygons.push({
            name: `${poly.category.name}`,
            center: `${poly.center}`,
            itemStyle: {
              normal: {
                areaColor: this.getRandomColor(), // 自定义颜色
                borderColor: '#333',
                borderWidth: 1
              }
            },
            coord: [line],
          });
          polygons_data.push(line);
          geojson.features.push({
            type: "Feature",
            properties: {
              name: poly.category.name || "暂无名称...",
            },
            geometry: {
              type: "Polygon",
              coordinates: [line],
            },
          });
        }
      });
      if (polygons.length > 0) {
        // 显示多边形顶点
        /*   series.push({
             type: 'scatter',
             coordinateSystem: 'geo',
             data: polygons_data.flat(), // 显示多边形顶点
             itemStyle: {
               color: '#ffffff',
               borderColor: '#3b3a3a', // 描边颜色
               borderWidth: 1 // 描边宽度
             }
           })*/


        const mapName = this.getRandomInt(1000, 9999) + "" + this.code;
        // 检查地图是否已经注册
        echarts.registerMap(mapName, geojson);
        // 获取当前 option
        const currentOption = myChart.getOption();
        // 更新 geo.regions
        const newGeo = {...this.geoData};
        newGeo.map = mapName;
        newGeo.regions = polygons.map(region => ({
          name: region.name,
          itemStyle: region.itemStyle,
          coords: region.coords
        }))
        currentOption.geo = newGeo;
        // 完全替换 series
        currentOption.series = series;
        // 使用 notMerge: false（默认）允许部分更新
        myChart.setOption(currentOption, {replaceMerge: ['geo', 'series']}); // 只强制替换 series
        return;
      }

      myChart.setOption({
        series: series,
      });
    },
    async loadMap() {
      this.community = [];
      this.polygons = [];
      let myChart = this.myChart;
      // 获取当前 option
      const currentOption = myChart.getOption();
      const newGeo = JSON.parse(JSON.stringify(this.geoData));
      newGeo.map = this.code;
      currentOption.geo = newGeo;
      currentOption.series = [];
      // 直接设置新的 option 对象，确保 series 为空数组
      myChart.setOption({
        geo: newGeo,
        series: [{"data":[]}]  // 明确设置为空数组
      }, {
        replaceMerge: ['series'],  // 只替换 series
        notMerge: false           // 允许部分更新
      });
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomColor() {
      return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
    },
    async initCategory(categorys) {
      if (categorys && categorys.length > 0 && categorys[0].items.length > 0) {
        this.currentCategorys = [...categorys[0].items];
      } else {
        this.community = [];
        this.polygons = [];
        this.currentCategorys = [];
      }
      await this.loadMarkers();
      await this.loadPolygons();
      this.setMapData();
    },
    async onCategoryChange(selectedCategory) {
      this.currentCategorys = selectedCategory;
      this.loadMap();
      if (selectedCategory.length > 0) {
        this.selectedNodes = selectedCategory.map((item) => item.pk);
        await this.loadMarkers();
        await this.loadPolygons();
      }
      this.setMapData();
    },
    onAddClick(category) {
      this.currentCategory = category;
    },
    async toolbarNodeClick(node) {
      // if (!node._type || node._type !== "leaf") {
      //   return;
      // }
      // if (node.gis_type === "polygon") {
      //   const data_pk = node.pk;
      //   const obj = await resource.getObjFromList("gps-polygon", {
      //     sn: data_pk,
      //   });
      //   if (obj.center) {
      //     this.$emit("focus", obj.center);
      //   }
      // } else if (node.gps_point && node.gps_point.coordinate) {
      //   this.$emit("focus", node.gps_point.coordinate);
      // } else {
      //   this.$message.error("该数据没有坐标信息");
      // }
    },
  },
};
</script>
<style scoped>
.containerss {
  width: 100%;
  height: 900px;
}

.toolbar-container {
  position: fixed; /* 固定定位 */
  top: 180px; /* 距离顶部的距离 */
  right: 20px; /* 距离左侧的距离 */
  z-index: 9999; /* 确保在最上层 */
  background-color: rgba(243, 241, 241, 0.7); /* 半透明背景 */
  padding: 10px;
  border-radius: 5px; /* 圆角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.networkChart {
  width: 100%;
  height: 700px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
}

.arrow-tag {
  position: relative;
  display: inline-block;
  padding-left: 15px;
  margin-left: 20px;
  font-size: 16px;
  line-height: 1.6;
}

.arrow-tag::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid #f0f0f0;
}
</style>
