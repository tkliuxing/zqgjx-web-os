<template>
  <el-card size="mini" class="layer-toolbar" :body-style="{padding: 0, paddingTop: '10px'}">
    <div class="title" slot="header" style="width: 100%">
      <div style="display:flex;justify-content: space-between">
        <span>图层</span>
        <el-button v-show="canEdit" style="float: right; padding: 3px 0" type="text" icon="el-icon-edit" @click="layerManagerVisible=true"></el-button>
      </div>
    </div>

    <div style="max-height: 600px;overflow: auto;">
      <el-tabs v-model="activeName" @tab-click="handleClick"  style="margin-left: 10px">
        <template v-for="(item,index) in TreeTabs" >
          <el-tab-pane  :label="item.name" :name="item.name" :key="index"></el-tab-pane>
        </template>
      </el-tabs>
      <div>
        <el-input style="width: 80%;margin: 0px 0px 5px 5px" placeholder='请输入...' @input="handleInput" v-model="value" clearable></el-input>
      </div>
      <div>
        <el-tree
          v-loading="loading"
          :data="categorys"
          :props="{label: 'name', children: 'items'}"
          show-checkbox
          default-expand-all
          node-key="pk"
          @node-click="onNodeClick"
          @check-change="onCategoryChange"
          :filter-node-method="filterNode"
          ref="tree"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <div class="custom-tree-label" :style="{color: data.field_02 ? data.field_02 : '#606266'}">
              <img v-if="data.icon && data.icon.includes('#') &&  hasIcon(data)" :src="icon_display(data.icon)" alt="">{{ data.name }}
            </div>
          </div>
        </el-tree>
      </div>
    </div>
    <el-dialog
      title="图层管理"
      append-to-body
      v-if="layerManagerVisible"
      :visible.sync="layerManagerVisible"
      @close="loadCategorys"
      fullscreen>
      <slot name="manager" :layerManagerVisible="layerManagerVisible"></slot>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round class="footer-btn" icon="el-icon-close" @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {getIconsAsync} from './MapStyles'
import resource from "@/resource";

export default {
  name: "LayerToolbar",
  props: {
    canEdit: {
      type: Boolean,
      default: true,
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
  data() {
    return {
      loading: true,
      categorys: [],
      selectedCategory: [],
      emitChange: null,
      layerManagerVisible: false,
      icons: [],
      TreeTabs: [],
      value: '',
      activeName: '多边形',
      currentName: '多边形', // 当前所点击的,默认为摄像头
      AllItems: [],
      show: false
    }
  },
  watch: {
    activeName: {
      handler(val) {
        this.$emit('activeName', val)
        this.value = null;
      },
      deep: true,
      immediate: true
    },
    value: {
      handler(val) {
        if (val) {
          this.$refs.tree.filter(val);
        }
      },
    }
  },
  methods: {
    cancel() {
      this.$emit('getViewReady')
      this.refreshCategorys();
      this.layerManagerVisible = false;
    },
    handleClick(e) {
      this.currentName = e.name;
      this.refreshCategorys();
    },
    async loadCategorys() {
      const data = await resource.getList('basetree', {parent_name: '地图图层', is_root: true});
      let datas;
      datas = data.find(i => i.name === this.currentName)
      this.TreeTabs = [];
      for (let item of data) {
        if (item.field_02 === "is_template" && item.int_01 === 2) {
          this.TreeTabs.push({...item});
        }
      }
      if(this.TreeTabs.length === 0){
        this.loading = false;
      }
      // this.TreeTabs = data;
      let promises = [];
      for (let item of [datas]) {
        promises.push(this.loadCategoryItems(item));
      }
      let dd = await Promise.all(promises);
      this.categorys = dd.flat();
      this.$emit('init-category', this.categorys);
    },
    async loadCategoryItems(item) {
      const {arguments: nameCol, field_03: template_id, field_01: gis_type, field_02: is_template} = item;

      if(is_template === "is_template"){
        const {items: existingItems} = item;
        const int_02 = existingItems || [];

        let url;
        if(['polygon','line'].includes(gis_type)){
          url = 'gps-polygon'
        }else{
          url = 'gps-point'
        }

        const fetchPromises = int_02.map(i =>
          resource.getList(url, {
          sn: i.pk,
        })
        );
        const results = await Promise.all(fetchPromises);
        const int_02Map = new Map(int_02.map(i => [i.pk, i]));
        const items2 = results.flat().map(data => {
          const ji = int_02Map.get(data.sn);
          return ji ? {
            name: data[ji.name],
            _type: 'leaf',
            leaf: true,
            pk: data.sn,
            items: [],
            gis_type
          } : null;
        }).filter(item => item !== null);

        existingItems.forEach(i => {
          if (i.int_01 === 1) {
            i.items = items2;
            i.leaf = false;
          }
        });

        return item;


      }else if (template_id && nameCol) {
        const params = {template_id, include_gps: true};
        const res = await resource.getList("data", params);

        item.items = res.map(i => ({
          ...i,
          name: i[nameCol],
          _type: 'leaf',
          leaf: true,
          items: [],
          gis_type
        }));
        item.leaf = false;
        return item;
      } else {
        const {items: existingItems} = item;
        const int_02 = (existingItems || []).filter(i => i.int_01 === 1);

        const fetchPromises = int_02.map(i =>
          resource.getList('data', {
            template_id: i.field_03,
            include_gps: true
          })
        );
        const results = await Promise.all(fetchPromises);
        const int_02Map = new Map(int_02.map(i => [i.field_03, i]));
        const items2 = results.flat().map(data => {
          const ji = int_02Map.get(data.template_id);
          return ji ? {
            name: data[ji.arguments],
            _type: 'leaf',
            leaf: true,
            pk: data.pk,
            items: [],
            gis_type
          } : null;
        }).filter(item => item !== null);

        existingItems.forEach(i => {
          if (i.int_01 === 1) {
            i.items = items2;
            i.leaf = false;
          }
        });

        return item;
      }
    },

    onNodeClick(data, node, tree) {
      this.$emit('node-click', data)
    },
    async refreshCategorys() {
      this.loading = true;
      await this.loadCategorys();
      this.$nextTick(() => {
        this.selectAllNode();
        this.loading = false;
      })
    },
    onCategoryChange(val, val1, val2) {
      this.selectedCategory = this.$refs.tree.getCheckedNodes();
      this.$emit('category-change', this.selectedCategory)
      // this.$emit('isShowEntity', {
      //   id: val.pk,
      //   isShow: val1,
      // })
      this.emitChange();
    },
    handleInput(value) {
      this.value = value;
      this.$nextTick(() => {
        this.$refs.tree.filter(value);
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    selectAllNode() {
      let tree = this.$refs.tree
      for (let item of this.categorys) {
        tree.setChecked(item.pk, true, true)
      }
    },
    hasIcon(data) {
      if (data.field_01 != 'Point') return false;
      return true;
    },
    icon_display(color) {
      if (color.includes('#')) {
        return this.icons.find((item) => item.color == color).img;
      }
    },
  },
  async mounted() {
    this.icons = await getIconsAsync();
    this.emitChange = this._.debounce(() => {
      this.$emit('category-change', this.selectedCategory)
    }, 300)
    await this.refreshCategorys();
  },
}
</script>

<style lang="scss" scoped>
.layer-toolbar {
  width: 15vw;
  height: calc(100vh - 160px);
  //background: transparent;
  background-color: #fff;

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    .custom-tree-label {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;

      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
    }
  }
}

.dialog-footer {
  text-align: center;

  .footer-btn {
    width: 100px;
  }
}

::v-deep .el-tabs__item {
  color: #333333 !important;
}
</style>