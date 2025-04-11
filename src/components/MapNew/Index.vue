<template>
  <div style="width: 100%; height: 100%">
    <my-map
      style="width: 100%; height: 600px"
      ref="mymap"
      adapter="Amap"
      :zoom="zoom"
      :center="center"
      :filter="mapFilter"
      @ready="handleReady"
      @dblclick="handleDBClick"
      @singleclick="handleClick"
    >
      <my-map-polygon
        v-for="p in showPolygons"
        :key="p.pk"
        :stroke="p.stroke"
        :coordinates="p.coordinates"
        :text="p.styleText"
      />
    </my-map>
  </div>
</template>

<script>
import {
  MyMap,
  MyMapLayers,
  MyMapPlacement,
  MyMapMarker,
  MyMapPolygon,
  MyMapTrack,
} from "$ui/map";
import car from "@xdh/my/ui/lib/map/sources/arrows/car.png";
import MapStyles, { getIconsAsync } from "./MapStyles";
import LayerManager from "./LayerManager.vue";
import resource from "@/resource";
export const SHAPES_MAP = {
  Point: "点",
  LineString: "线",
  Circle: "圆",
  // Rectangle: '矩形',
  Polygon: "多边形",
};
export const SHAPES = Object.keys(SHAPES_MAP).map((key) => ({
  label: SHAPES_MAP[key],
  value: key,
}));
const XJD_TMPL_ID = 'FT6628950761472';
export default {
  name: "Map",
  components: {
    'my-map':MyMap,
    MyMapLayers,
    MyMapPlacement,
    MyMapMarker,
    MyMapPolygon,
    MyMapTrack,
    LayerManager,
  },
  props: {
    // 是否显示图层工具栏
    showLayerToolbar: {
      type: Boolean,
      default: true,
    },
    // 是否显示深色地图
    dark: {
      type: Boolean,
      default: false,
    },
    // 缩放级别
    zoom: {
      type: Number,
      default: 12,
    },
    // 中心点坐标
    center: {
      type: Array,
      default: () => [111.67110998107798, 40.82054115452758],
    },
    // 是否可以编辑图层
    canEdit: {
      type: Boolean,
      default: false,
    },
    // 轨迹
    trackPoints: {
      type: Array,
      default: () => [],
    },
    // 轨迹动画播放时长
    trackPeriod: {
      type: Number,
      default: 20,
    },
    // 刷新定位点定时，0则不刷新
    flushTime: {
      type: Number,
      default: 0,
    },
    // 是否可以增删图层
    layermanaged: {
      type: Boolean,
      default: false,
    },
    // 是否可以编辑图层内容
    layereditable: {
      type: Boolean,
      default: false,
    },
    // 任务信息
    val:{
      type: Object,
      default: () => {},
    },
  },
  computed: {
    mapFilter() {
      return this.dark ? this.styles[1].style : this.styles[0].style;
    },
  },
  data() {
    return {
      styles: MapStyles,
      currentCategorys: [],
      markers: [],
      polygons: [],
      icons: {},
      currentCategory: null,
      effect: car,
      selectedNodes: [],
      timer: null,
      showTrack: false,
      showPolygons: [],
    };
  },
  methods: {
    async initCategory(){
      try {
        let res = await resource.getList("data",{
          biz_id: this.$bizCode.xunjian_biz,
          src_id: this.$sourceCode.source_id,
          template_id: XJD_TMPL_ID,
          renwu_id:this.val.pk
        });
        if(res.length>0){
          //根据res.create_time排序
          res.sort((a,b)=>{
            return new Date(a.create_time).getTime()-new Date(b.create_time).getTime()
          })
          // 创建一个新的数组用于存储 lng 和 lat
          let lngLatArray = [];
          // 遍历排序后的 res 数组，将 lng 和 lat 值 push 到新数组中
          res.forEach(item => {
            lngLatArray.push([item.lng, item.lat]);
          });
          let arr = [];
          let coordinates = lngLatArray;
          let styleText = {
            fill: '#2F54EB',
            scale: 1.5,
            text:this.val.name,
          };
          let text = this.val.name;
          let stroke = {
            color:'#14FA18',
            width: 2,
          };
          arr.push({
            coordinates: coordinates,
            styleText: styleText,
            text: text,
            stroke: stroke,
            pk: this.val.pk,
          });
          this.showPolygons = arr;
        }
      }catch (e) {
        console.error(e)
      }
    },
    getIcon(categoryID) {
      let category = this.currentCategorys.find((c) => c.pk === categoryID);
      if (!category) return;
      return this.icons[category.icon];
    },
    handleClick(event) {
      this.$emit("click", event);
    },
    handleDBClick(event) {
      this.showTrack = false;
      this.$emit("dbclick", event);
    },
    handleReady(map) {
      this.$emit("ready", map);
    },
  },
  async mounted() {
    await this.initCategory();
  },
};
</script>

<style scoped lang="scss">
</style>
