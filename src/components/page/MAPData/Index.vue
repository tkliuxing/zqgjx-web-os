<template>
  <el-card>
    <Map
      :showLayerToolbar="true"
      :canEdit="true"
      :layermanaged="true"
      :center="center"
      :layereditable="true"
    />
  </el-card>
</template>
<script>
import Map from "@/components/MapNew/Index_a.vue";
import resource from "@/resource";
import {mapState} from "vuex";

export default {
  components: {Map},
  computed: {
    ...mapState(["userinfo"]),
  },
  data() {
    return {
      zoom: 8,
      center: [111.67, 40.83],
      val: null,
    };
  },
  methods: {

    // 地图经纬度
    mapTab(data) {
      this.form.lng = data.lng;
      this.form.lat = data.lat;
      this.center = [data.lng, data.lat];
    },

  },
  async mounted() {
  },
  created() {
  },
};
</script>
<style>
.errorStatus td {
  color: red;
}

.trueStatus td {
  color: black;
}

.el-dialog__body {
  padding: 10px !important;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
