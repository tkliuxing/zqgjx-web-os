<template>
  <div>
    <div class="amap-wrapper">
      <el-amap-search-box
        class="search-box"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      ></el-amap-search-box>
      <el-amap
        class="amap-box"
        :vid="'amap-vue'"
        :center="center"
        :amap-manager="amapManager"
        :zoom="zoom"
        :plugin="plugin"
        :events="mapEvents"
      >
        <el-amap-marker
          :position="[lng, lat]"
          :events="marker.events"
          :visible="true"
          :vid="'0'"
        ></el-amap-marker>
      </el-amap>
    </div>
  </div>
</template>

<script>
import { AMapManager } from "vue-amap";
import { mapState } from "vuex";
let amapManager = new AMapManager();
export default {
  props: {
    lng: {
      type: Number,
      default: 111.670801,
    },
    lat: {
      type: Number,
      default: 40.818311,
    },
  },
  data() {
    return {
      amapManager,
      form: {
        longitude: 111.670801,
        latitude: 40.818311,
      },
      marker: {
        position: "",
      },
      // lng:111.670801,
      // lat:40.818311,
      searchOption: {},
      center: [111.670801, 40.818311],
      zoom: 12,
      plugin: ["ToolBar"],
      mapEvents: {
        click: (e) => {
          //   console.log(e)
          const { lng, lat } = e.lnglat;
          this.marker.position = [lng, lat];
          this.lng = lng;
          this.lat = lat;
          this.$emit("mapTab", e.lnglat);
        },
      },
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    onSearchResult(result) {
      // console.log(result)
      // this.$log(result[0]);
      // this.$log(result[0].location);
      let { lat, lng } = result[0].location;
      this.center = [lng, lat];
      this.amapManager.getMap().setZoom(17);
    },
  },
};
</script>

<style scoped>
.search-box {
  border: 1px solid #ddd;
  display: block;
  margin: 10px 0;
  width: 100%;
  box-sizing: border-box;
  box-shadow: none;
}
.amap-wrapper {
  width: 100%;
  height: 450px;
  overflow: hidden;
}
</style>
