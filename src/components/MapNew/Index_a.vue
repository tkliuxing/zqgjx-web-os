<template>
  <div style="widht: 100%; height: 100%">
    <my-map
      style="widht: 100%; height: 600px"
      ref="mymap"
      adapter="Amap"
      :zoom="zoom"
      :center="center"
      :filter="mapFilter"
      @ready="handleReady"
      @dblclick="handleDBClick"
      @singleclick="handleClick"
    >
      <my-map-placement v-if="showLayerToolbar && layereditable" placement="right-top">
        <LayerToolbar
          :center="center"
          :zoom="zoom"
          @init-category="initCategory"
          @category-change="onCategoryChange"
          @node-click="toolbarNodeClick"
          @onAddClick="onAddClick"
          :can-edit="canEdit"
        >
          <template v-slot:manager="{layerManagerVisible}">
            <LayerManager v-if="layerManagerVisible" :center="center" :zoom="zoom" :layermanaged="layermanaged" :layereditable="layereditable"></LayerManager>
          </template>
        </LayerToolbar>
      </my-map-placement>
      <my-map-placement v-if="$slots.righttop" placement="right-top">
        <slot name="righttop"></slot>
      </my-map-placement>
      <my-map-placement v-if="$slots.bottom" placement="center-bottom">
        <slot name="bottom"></slot>
      </my-map-placement>
      <my-map-marker
        v-for="m in showMarkers"
        :key="m.pk"
        :coordinate="m.coordinate"
        :src="m.icon"
        @click="markerClick(m)"
      >
        <template v-slot="mm">
          {{ m.data.name || m.data.paizhao }} <br/>
        </template>
      </my-map-marker>
<!--      <my-map-polygon-->
<!--        v-for="p in showPolygons"-->
<!--        :key="p.pk"-->
<!--        :stroke="p.stroke"-->
<!--        :coordinates="p.coordinates"-->
<!--        :text="p.styleText"-->
<!--      />-->
      <my-map-polygon
        v-for="p in showPolygons"
        :key="p.pk"
        :coordinates="p.coordinates"
      />
      <my-map-track
        :period="trackPeriod"
        :coordinates="trackPoints"
        v-if="showTrack && trackPoints.length > 0"
        :effect="effect"
      ></my-map-track>
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
  MyMapGeo,
} from "$ui/map";
import car from "$ui/map/sources/arrows/car.png";
import MapStyles, {getIconsAsync} from "./MapStyles";
import LayerToolbar from "./LayerToolbar";
import LayerManager from "./LayerManager.vue";
import resource from "@/resource";

export default {
  name: "Map",
  components: {
    MyMap,
    MyMapLayers,
    MyMapPlacement,
    MyMapMarker,
    MyMapPolygon,
    MyMapTrack,
    MyMapGeo,
    LayerToolbar,
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
      default: true,
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
  },
  computed: {
    mapFilter() {
      return this.dark ? this.styles[1].style : this.styles[0].style;
    },
    showMarkers() {
      return this.markers.filter((i) => this.selectedNodes.includes(i.data.sn));
    },
    showPolygons() {
      return this.polygons.filter((i) => this.selectedNodes.includes(i.data.sn));
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
    };
  },
  methods: {
    async initCategory(categorys) {
      if (categorys.length > 0 && categorys[0].items.length > 0) {
        this.currentCategorys = [...categorys[0].items];
      } else {
        this.currentCategorys = [];

      }
      await this.loadIcons();
      this.loadMarkers();
      this.loadPolygons();
      // this.currentCategorys = categorys.items;

    },
    async onCategoryChange(selectedCategory) {
      if (selectedCategory.length > 0) {
        this.selectedNodes = selectedCategory.map((item) => item.pk);
        await this.loadIcons();
        this.loadMarkers();
        this.loadPolygons();
      }else{
        this.markers=[];
        this.polygons=[];
      }
    },
    async loadIcons() {
      if (this.icons.length > 0) return;
      let icons = await getIconsAsync();
      let iconMap = {};
      icons.forEach((icon) => {
        iconMap[icon.color] = icon.img;
      });
      this.icons = iconMap;
    },
    getIcon(categoryID) {
      let category = this.currentCategorys.find((c) => c.pk === categoryID);
      if (!category) return;
      return this.icons[category.icon];
    },
    async loadMarkers() {

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
      this.markers = data.map((d) => {
        return {
          coordinate: [
            Number(d.gps_point.longitude),
            Number(d.gps_point.latitude),
          ],
          icon: this.getIcon(d.category.pk),
          data: d,
          pk: d.pk,
        };
      });
    },
    async loadMarkerFromCategory(category) {
      if (category.field_02 === "is_template") {
        let url;
        if(['polygon','line'].includes(category.field_01)){
          url = 'gps-polygon'
        }else{
          url = 'gps-point'
        }
        let data = await resource.getList(url, {
          sn: [category.pk],
        });

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
    async loadPolygons() {
      let promises = [];
      let categorys = this.currentCategorys.filter(
        (i) => i.field_01 === "polygon" || i.field_01 === "line"
      );
      for (let i = 0; i < categorys.length; i++) {
        let category = categorys[i];
        promises.push(this.loadPolygonFromCategory(category));
      }
      let data = await Promise.all(promises);
      data = data.flat();
      this.polygons = data.map((d) => {
        return {
          coordinates: JSON.parse(d.line),
          data: d,
          text: d.field_01,
          stroke: d.stroke,
          styleText: d.styleText,
          pk: d.sn,
        };
      });
    },
    async loadPolygonFromCategory(category) {
      let data = await resource.getList("gps-polygon", {
        sn: category.pk,
      });
      return data.map((i) => {
        return {
          ...i,
          // pk: i.sn,
          category: category,
          stroke: {
            width: 2,
            color: "#ff0000",
          },
          styleText: {
            text: i.field_01,
            fill: "#ff0404",
            scale: 1.5,
          },
        };
      });
    },
    onAddClick(category) {
      this.currentCategory = category;
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
    markerClick(marker) {
      this.$emit("markerclick", marker);
    },
    async toolbarNodeClick(node) {
      if (!node._type || node._type !== "leaf") {
        return;
      }
      if (node.gis_type === "polygon") {
        const data_pk = node.pk;
        const obj = await resource.getObjFromList("gps-polygon", {
          sn: data_pk,
        });
        if (obj.center) {
          this.$emit("focus", obj.center);
        }
      } else if (node.gps_point && node.gps_point.coordinate) {
        this.$emit("focus", node.gps_point.coordinate);
      } else {
        this.$message.error("该数据没有坐标信息");
      }
    },
  },
  async mounted() {
    await this.loadIcons();
    if (this.flushTime > 0 && this.trackPoints.length === 0) {
      this.timer = setInterval(async () => {
        await this.loadMarkers();
      }, this.flushTime * 1000);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  watch: {
    center(val) {
      this.$refs.mymap.moveTo(val);
    },
    flushTime(val) {
      if (!val && this.timer) {
        clearInterval(this.timer);
        return;
      }
      if (val > 0 && this.trackPoints.length === 0) {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(async () => {
          await this.loadMarkers();
        }, val * 1000);
      }
    },
    trackPoints(val) {
      if (val.length === 0 && this.flushTime > 0) {
        this.showTrack = false;
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(async () => {
          await this.loadMarkers();
        }, this.flushTime * 1000);
      } else if (val.length > 0 && this.timer) {
        clearInterval(this.timer);
        this.showTrack = true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>
