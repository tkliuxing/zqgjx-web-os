<template>
  <div>
    <el-table
      v-loading="loading"
      border
      :data="data"
      style="width: 100%">
      <el-table-column
        label="操作"
        width="100"
      >
        <template v-slot="{row}">
          <el-button v-if="category.field_01 == 'Point'" type="text" size="small" @click.stop="() => editContent(row)" icon="el-icon-location-outline"></el-button>
          <el-button v-else type="text" size="small" @click.stop="() => editContent(row)" icon="el-icon-edit"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        :prop="tableCol"
        label="标题">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog
      fullscreen
      title="绘制"
      :visible.sync="dialogVisible"
      width="width"
      append-to-body
    >
      <div>
        <selectPoint v-if="dialogVisible && category.field_01 == 'Point'" :center="center" :zoom="zoom" @select="changeCoordinate"/>
        <drawFeatures v-else :center="center" :type="category.field_01" :zoom="zoom" @change="changeDraw"/>
      </div>
      <div slot="footer">
        <el-button type="info" @click="clean">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import selectPoint from './selectPoint';
import drawFeatures from './drawFeatures.vue'
import resource from "@/resource";

const FORM = {
  sn: '',
  longitude: '',
  latitude: '',
}

export default {
  name: "RelContentEdit",
  components: {
    selectPoint,
    drawFeatures,
  },
  props: {
    category: {
      type: Object,
      default: () => ({}),
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
  },
  computed: {
    tableCol() {
      return this.category.arguments;
    },
    template_id() {
      return this.category.field_03;
    },
  },
  data() {
    return {
      loading: false,
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      form: {...FORM},
      feature: null,
      currentRow: null,
    }
  },
  methods: {
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: this.template_id,
      }
      let res = await resource.getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },
    changeCoordinate(coordinate) {
      this.form.longitude = coordinate[0];
      this.form.latitude = coordinate[1];
    },
    resetForm() {
      this.form = {...FORM};
    },
    clean() {
      this.dialogVisible = false;
      this.resetForm();
    },
    editContent(data) {
      this.resetForm();
      this.currentRow = data;
      this.form.sn = data.gps_sn;
      if (this.category.field_01 == 'Point') {
        this.dialogVisible = true;
        return;
      } else {
        this.dialogVisible = true;
        return;
      }
    },
    async submit() {
      if (this.category.field_01 == 'Point') {
        await this.submitPoint();
        return;
      } else if (this.category.field_01 == 'Polygon') {
        await this.submitPolygon();
        return;
      }
    },
    async submitPoint() {
      let params = {
        sn: this.form.sn,
        longitude: this.form.longitude,
        latitude: this.form.latitude,
        category: this.category.pk,
      }
      await resource.createObj("gps-point", params);
      resource.createObj("gps-refreshlastpoints", {
        sn: [this.form.sn]
      });
      this.$message.success("编辑成功!");
      this.clean();
    },
    async submitPolygon() {
      let find_params = {
        sn: this.form.sn,
        category: this.category.pk,
      };
      resource.getObjFromList('gps-polygon', find_params).then((data) => {
        if (data && data.pk) {
          resource.deleteObj("gps-polygon", data.pk);
        }
      });
      let params = {
        sn: this.form.sn,
        field_01: this.currentRow[this.tableCol],
        line: this.feature.coordinates[0],
        category: this.category.pk,
      }
      await resource.createObj("gps-polygon", params);
      this.$message.success("编辑成功!");
      this.clean();
    },
    changeDraw(data) {
      this.feature = data;
    },
  },
  mounted() {
    this.loadData();
  },
  watch: {
    category: {
      handler(newName, oldName) {
        this.loadData();
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
