<template>
  <my-map style="widht: 100%;height:calc(100vh - 220px);"
          adapter="Amap"
          :zoom="zoom"
          :center="center"
          :filter="mapFilter"
          @singleclick="handleClick">
    <my-map-pointer :theme="dark ? 'light' : 'dark'"></my-map-pointer>
    <my-map-marker v-if="marker" :coordinate="marker.coordinate" :src="pin"></my-map-marker>
  </my-map>
</template>

<script>
import { MyMap, MyMapPointer, MyMapMarker } from '$ui/map';
import pin from './img/pin/redCenter.png';
import MapStyles from './MapStyles'

export default {
  name: "selectPoint",
  components: { MyMap, MyMapPointer, MyMapMarker },
  props: {
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
    // 原始坐标
    coordinate: {
      type: Array,
      default: () => null,
    },
  },
  data(){
    return {
      pin,
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
    handleClick(e){
      this.marker = {
        coordinate: e.coordinate,
      }
      this.$emit('select', e.coordinate)
    },
  },
  mounted(){
    if(this.coordinate){
      this.marker = {
        coordinate: this.coordinate,
      }
    }
  }
}
</script>
