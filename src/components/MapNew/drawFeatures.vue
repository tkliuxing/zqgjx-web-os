<template>
  <my-map style="widht: 100%;height:calc(100vh - 220px);"
          adapter="Amap"
          :zoom="zoom"
          :center="center"
          :filter="mapFilter">
    <!-- <my-map-pointer :theme="dark ? 'light' : 'dark'"></my-map-pointer> -->
    <!-- <my-map-marker v-if="marker" :coordinate="marker.coordinate" :src="pin"></my-map-marker> -->
    <my-map-line v-if="type == 'LineString' && !show " :coordinates="EchoLine"></my-map-line>
    <my-map-polygon v-if="type == 'Polygon' && !show " :coordinates="EchoLine"></my-map-polygon>
    <my-map-draw ref="draw" :type="type" manual @drawstart="drawstart" @drawend="drawend"></my-map-draw>
  </my-map>
</template>

<script>
import { MyMap, MyMapPointer, MyMapDraw,MyMapLine,MyMapPolygon } from '$ui/map';
import {getDistance} from '$ui/map/utils/util';
import GeoJSON from 'ol/format/GeoJSON';
import pin from './img/pin/redCenter.png';
import MapStyles from './MapStyles';


export default {
  name: "selectPoint",
  components: { MyMap, MyMapPointer, MyMapDraw, MyMapLine,MyMapPolygon},
  props: {
    // 绘制类型
    type: {
      type: String,
      default: 'Polygon',
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
      default: () => [
        111.67110998107798,
        40.82054115452758
      ],
    },
    // 线和面的数据，用于回显
    EchoLine:{
      type:Array,
      default:[],
    }
  },
  data(){
    return {
      pin,
      show: false, // 编辑时用于回显
      styles: MapStyles,
      marker: null,
    }
  },
  computed: {
    mapFilter(){
      return this.dark ? this.styles[1].style : this.styles[0].style
    }
  },
  methods: {
    drawend(e){
      if(this.type == 'Circle'){
        let pointers = e.feature.getGeometry().flatCoordinates;
        let data = {
          type: this.type,
          center: e.feature.getGeometry().getCenter(),
          radius: getDistance([pointers[0], pointers[1]], [pointers[2], pointers[3]])
        }
        this.$emit('change', data);
        return
      }
      let data = (new GeoJSON()).writeFeature(e.feature);
      this.$emit('change', JSON.parse(data).geometry)
    },
    drawstart(){
      this.show = true;
      this.$refs.draw.clear();
    },
  },
  mounted(){
    this.$refs.draw.clear();
    this.$refs.draw.draw();
  }
}
</script>
