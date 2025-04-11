<template>
  <div class="baseconfigcurd">
    <el-row :gutter="10">
      <el-col :span="8" class="left-panel">
        <!--        <div v-if="layermanaged" style="text-align: center">-->
        <!--          <el-button icon="el-icon-circle-plus-outline" round type="primary" @click="createCategory">新建{{ categoryName }}1 </el-button>-->
        <!--        </div>-->

        <div class="tree-container">
          <el-button v-if="layermanaged" type="primary" plain style="margin-bottom: 10px" round @click="addChildren">新增图层</el-button>
          <el-tree v-loading="loading" :data="data" node-key="pk"
                   :props="{children: 'items',label: 'name'}"
                   :draggable="true"
                   :indent="20"
                   ref="tree"
                   @node-drop="movenode">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div class="custom-tree-label" :style="{ color: data.field_02 ? data.field_02 : '#606266' }">
                <img v-if=" data.icon  && data.icon.includes('#') && hasIcon(data)" :src="icon_display(data.icon)" alt=""/>
                {{ data.name }}
              </div>
              <div style="text-align: center">
                <el-tooltip v-if="data.int_01 == 0" content="添加子图层" effect="light" placement="left">
                  <el-button type="text" size="small" @click.stop="() => addChildren(data)" icon="el-icon-plus"></el-button>
                </el-tooltip>
                <el-tooltip v-if="data.int_01 == 2 " content="编辑模版" effect="light" placement="top">
                  <el-button type="text" size="small" @click.stop="() => updateMoBan(data)" icon="el-icon-edit-outline"></el-button>
                </el-tooltip>
                <!--                <el-tooltip v-if="data.name == '设备'" content="维护数据" effect="light" placement="top">-->
                <!--                  <el-button type="text" size="small" @click.stop="() => updateData(data)" icon="el-icon-plus"></el-button>-->
                <!--                </el-tooltip>-->
                <el-tooltip v-if="data.int_01 == 1 || data.int_01 == 0" content="编辑图层信息" effect="light" placement="top">
                  <el-button type="text" size="small" @click.stop="() => updateCategory(data)" icon="el-icon-edit"></el-button>
                </el-tooltip>
                <el-tooltip v-if="data.int_01 == 1 " content="编辑图层内容" effect="light" placement="top">
                  <el-button type="text" size="small" @click.stop="() => editContent(data)" icon="el-icon-location-outline"></el-button>
                </el-tooltip>
                <el-tooltip v-if="data.int_01 == 2" content='自定义数据' effect="light" placement="top">
                  <el-button type="text" size="small" @click.stop="() => addContent(data)" icon="el-icon-folder-add"></el-button>
                </el-tooltip>
                <!--                <el-tooltip v-if="layermanaged" content="删除图层" effect="light" placement="right">-->
                <!--                  <el-button type="text" size="small" @click.stop="() => onDelete(data.pk)" icon="el-icon-delete"></el-button>-->
                <!--                </el-tooltip>-->
              </div>
            </div>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="category-editor" style="color: #333333" v-show="showCreate">
          <el-form label-width="120px">
            <template v-if="form.int_01 == 0">
              <el-form-item label="图层名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="图层名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="形状类型">
                <el-radio-group v-model="form.field_01" @input="shapeChange">
                  <el-radio v-for="shape in shapes" :key="shape.value" :label="shape.value">{{ shape.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="标记样式" v-if="form.field_01 == 'Point'">
                <div style="display:flex; align-items: center;flex-direction: row">
                  <el-radio style="display:flex;justify-content: space-between;align-items: center;" v-model="form.icon" v-for="item in icons" :key="item.color" :label="item.color">
                    <img :src="item.img" :alt="item.color"/>
                  </el-radio>
                </div>
              </el-form-item>
              <el-form-item label="自定义标记样式" v-if="form.field_01 == 'Point'">
                <el-tooltip class="item" effect="light" content="只支持png，jpg，webp，jpeg，glb类型的文件；与标记样式仅有一个生效。" placement="top-start">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                <FileUploadV4 v-if="showCreate" :limit="1" :uploadType="['png','jpg','webp','jpeg','glb']" v-model="file" categoryName="图层模型文件" ref="childfile"></FileUploadV4>
              </el-form-item>
              <el-form-item label="标记颜色" v-if="form.field_01 != 'Point'">
                <el-color-picker v-model="form.icon" :predefine="colors"></el-color-picker>
              </el-form-item>
              <el-form-item label="文本颜色">
                <el-color-picker v-model="form.field_02" :predefine="colors"></el-color-picker>
              </el-form-item>
              <el-form-item label="关联数据">
                <el-select v-model="form.field_03" v-if="templates.length > 0" @change="templateChange" clearable>
                  <el-option v-for="item in templates" :key="item.pk" :label="item.title" :value="item.pk"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标题字段">
                <el-select v-model="form.arguments" v-if="templates.length > 0" clearable>
                  <el-option v-for="item in template_fields" :key="item.pk" :label="item.col_title" :value="item.alias"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="实时定位" v-if="form.field_01 == 'Point'">
                <el-switch v-model="form.is_realtime" active-value="是" inactive-value="否" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </el-form-item>
            </template>
            <el-form-item>
              <el-button type="primary" @click="onCreateSubmit">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <RelContentEdit :center="center" :zoom="zoom" v-if="showEditContent" :category="currentCategory"/>
        <Items v-if="showAddContent" @getRefresh="Refresh" ref="child" :category="addCategory"/>
      </el-col>
    </el-row>
    <el-dialog
      v-if="templateVisable"
      :visible.sync="templateVisable"
      :close-on-click-modal="false"
      title="编辑模板"
      center
      width="90%"
      top="4vh"
      :show-close="true"
      append-to-body
    >
      <TableItem
        v-if="templateVisable"
        :updateForm="updateItems"
        @close="(status) => (this.templateVisable = status)"
        @loadData="init"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="pointVisable"
      :close-on-click-modal="false"
      title="操作数据"
      center
      width="90%"
      top="4vh"
      :show-close="true"
      append-to-body
    >
      <gps_point :item="dataItem"/>
    </el-dialog>
    <el-dialog
      :visible.sync="addVisable"
      :close-on-click-modal="false"
      title="新增子集"
      center
      width="40%"
      top="4vh"
      :show-close="true"
      append-to-body
    >
      <el-form :model="addForm" ref="addForm" inline>
        <el-row style="width: 80%;margin: 0 auto">
          <el-col :span="24">
            <el-form-item label="子集类型" prop="int_01" :rules="{required:true,message:'必填项',trigger:'blur'}">
              <el-radio-group v-for="(item,index)  in type" :key="index" v-model="addForm.int_01">
                <el-radio :label="item.id" style="padding: 0 5px">{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称" prop="name" :rules="{required:true,message:'必填项',trigger:'blur'}">
              <el-input placeholder="名称" v-model="addForm.name" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center;padding-bottom: 20px;padding-top: 10px;">
        <el-button @click="addVisable = false" icon="el-icon-close">取消</el-button>
        <el-button
          icon="el-icon-check"
          type="primary"
          @click="addChild"
        >确定
        </el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {colors, getIconsAsync} from "./MapStyles";
import {SHAPES} from "./Index.vue";
import RelContentEdit from './RelContentEdit'
import {TreeTemplate} from "@/components/CustomTemplate/Items/models";
import TableItem from "@/components/CustomTemplate/Items/TableItem.vue";
import gps_point from "@/components/CustomTemplate/Items/gps_point.vue";
import Items from "@/components/CustomTemplate/Entity/Items.vue"

const name = "地图图层";
const parent = "bt4830962551780556801";
import FileUploadV4 from "@/components/common/FileUploadV4.vue";
import resource from "@/resource";

const FORM = {
  pk: null,
  parent: null,
  name: "",
  description: "",
  arguments: "",
  icon: "",
  field_01: "Point",
  field_02: "",
  field_03: "",
  text_01: "否",
};

class TreeNode {
  pk = null
  parent = null
  type_id = 1
  name = ""
  description = ""
  arguments = ""
  icon = ""
  field_01 = "Point"
  field_02 = ""
  field_03 = ""
  text_01 = ""
  json_data = null

  constructor(params) {
    if (params) {
      Object.assign(this, params);
    }
    if (this.text_01.startsWith("{")) {
      this.json_data = JSON.parse(this.text_01);
    } else {
      this.json_data = {is_realtime: '否'};
    }
  }

  get is_realtime() {
    return this.json_data.is_realtime;
  }

  set is_realtime(val) {
    this.json_data.is_realtime = val;
  }

  serialize() {
    return {
      pk: this.pk,
      parent: this.parent,
      type_id: this.type_id,
      name: this.name,
      description: this.description,
      arguments: this.arguments,
      icon: this.icon,
      field_01: this.field_01,
      field_02: this.field_02,
      field_03: this.field_03,
      text_01: JSON.stringify(this.json_data),
    };
  }

  onDelete() {
  }
}

export default {
  name: "LayerManager",
  components: {RelContentEdit, TableItem, gps_point, Items, FileUploadV4},
  props: {
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
  data() {
    return {
      addVisable: false,
      colors,
      name: null, // 搜索的名称
      data: [],
      categoryPK: null,
      showCreate: false,
      form: new TreeNode(),  //{ ...FORM },
      loading: false,
      categoryName: name,
      parent: null,
      root: null,
      shapes: SHAPES,
      props: {
        children: "items",
        label: "name",
      },
      file: null,
      currentCategory: null,
      showEditContent: false,
      templates: [],
      template_fields: [],
      icons: [],
      templateVisable: false,
      updateItems: null,
      dataItem: null,
      pointVisable: null,
      addForm: {
        int_01: 2,
        name: '',
        parent: '',
      },
      type: [
        // {id:0,name:'普通分类'},
        // {id:1,name:'关联表单'},
        {id: 2, name: '用户自定义模版'},
      ],
      showAddContent: false,
      addCategory: null,
    };
  },
  async mounted() {
    this.icons = await getIconsAsync();
    await this.init();
  },
  methods: {
    async addChild() {
      try {
        let valid = await new Promise((resolve) =>
          this.$refs.addForm.validate((validate) => resolve(validate))
        );
        if (valid) {
          this.addForm.text_01 = JSON.stringify({is_realtime: "否"})
          if (this.addForm.int_01 == 2 || this.addForm.int_01 == 0) {
            this.addForm.field_02 = 'is_template'
          }
          if (this.addForm.int_01 == 1) {
            this.addForm.field_01 = 'Point'
          }
          await resource.createObj('basetree', this.addForm)
          this.$message.success('新增成功！');
          await this.init();
          this.addVisable = false;
          this.addForm = {};
        } else {
          this.$message.warning('请填写完整信息')
        }
      } catch (e) {
        console.error(e)
      }
    },
    Refresh() {
      this.init();
    },
    async init() {
      this.loading = true;
      try {
        let params = {name: name, isroot: true};
        let resp = await resource.getObjFromList("basetree", params);
        this.data = resp.items;
        this.root = resp;
        this.parent = resp.pk;
      } catch (err) {
        this.$message.error("加载数据错误！");
      }
      await this.loadTemplates();
      this.loading = false;
    },

    async loadTemplates() {
      this.templates = await resource.getList("formtemplatemin");
    },
    data_is_realtime(data) {
      const dd = new TreeNode(data);
      return dd.is_realtime == '是';
    },
    addChildren(val) {
      if (val.pk) {
        this.addForm = {
          parent: val.pk,
        };
      } else {
        this.addForm = {
          parent: this.parent,
        };
      }
      this.addForm.int_01 = 2;
      this.addVisable = true;
      // this.showEditContent = false;
    },
    createCategory() {
      this.form = new TreeNode();  //{ ...FORM };
      this.form.parent = this.root.pk;
      this.templateChange(null);
      this.showCreate = true;
      this.showEditContent = false;
    },
    updateData(val) {
      this.dataItem = val;
      this.pointVisable = true;
    },
    updateMoBan(row) {
      this.updateItems = new TreeTemplate(row)
      this.templateVisable = true;
    },
    updateCategory(data) {
      this.form = new TreeNode(data);
      this.file = null;
      if (this.form.icon && this.form.icon == '[]') {
        this.form.icon = null;
      }
      if (this.form.icon && !this.form.icon.includes('#')) {
        this.file = JSON.parse(this.form.icon)
      }
      if (data.int_01 == 1) {
        this.templateChange(data.field_03);
      }
      this.showCreate = true;
      this.showEditContent = false;
      this.showAddContent = false;
    },
    hasIcon(data) {
      if (data.field_01 != 'Point') return false;
      return true;
    },
    async onCreateSubmit() {

      let {name} = this.form;
      if (!name) {
        this.$message.error(`请填写${this.categoryName}名称`);
      } else {
        let file = await this.$refs.childfile.submits();
        // 可根据返回值判断附件上传是否成功
        if (file && file.status == 'error') return this.$message.warning('附件上传失败，请重新上传')
        if (this.file && this.file.length > 0) {
          this.form.icon = null;
          this.form.icon = JSON.stringify(this.file)
        }
        console.log(this.file, '123')
        console.log(this.form, '21')
        if (this.form.pk) {
          await this.$http.put(`/basetree/${this.form.pk}/`, this.form.serialize());
        } else {
          // try {
          //   await this.$http.post("/basetree/", this.form.serialize());
          // }catch (e) {
          //   await this.$http.post("/basetree/", this.form);
          // }
          await this.$http.post("/basetree/", this.form.serialize());
        }
        this.showCreate = false;
        await this.init();
      }
    },
    async onDelete(pk) {
      this.showCreate = false;
      this.showEditContent = false;
      try {
        await this.$confirm(`此操作将永久删除该${this.categoryName}, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        try {
          await this.$http.delete(`/basetree/${pk}/`);
          this.$message.success("删除成功!");
          this.init();
        } catch (e) {
          this.$message.error("删除失败!");
          return;
        }
      } catch {
        return;
      }
    },
    movenode(node, target, position, event) {
      let pos = "";
      switch (position) {
        case "before":
          pos = "left";
          break;
        case "after":
          pos = "right";
          break;
        case "inner":
          pos = "first-child";
          break;
      }
      let params = {
        node: node.data.pk,
        target: target.data.pk,
        position: pos,
      };
      this.$http.post("/basetreemove/", params).then((resp) => {
      });
    },
    icon_display(color) {
      try {
        if (color.includes('#')) {
          return this.icons.find((item) => item.color == color).img;
        }

      } catch (e) {
        console.error(e);
        return "";
      }
    },
    shapeChange(shape) {
      if (shape !== "Point") {
        this.form.is_realtime = "否";
      }
    },
    async templateChange(template) {
      if (!template) {
        this.template_fields = [];
        return;
      }
      const templateobj = await resource.getObj("formtemplate", template);
      this.template_fields = templateobj.field;
    },
    addContent(category) {
      this.showCreate = false;
      this.showAddContent = false;
      this.showEditContent = false;
      this.addCategory = category;
      this.showAddContent = true;
      this.$nextTick(() => {
        this.$refs.child.loadCategory();
      })
    },
    editContent(category) {
      this.showCreate = false;
      this.showAddContent = false;
      this.showEditContent = false;
      this.currentCategory = category;
      this.showEditContent = true;
    },
  },
};
</script>

<style scoped>
.left-panel {
  border-right: 1px solid #ebeef5;
}

.tree-container {
  padding: 20px;
  height: calc(100vh - 300px);
}

::v-deep .el-radio__label {
  color: #333333 !important;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.custom-tree-label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
}

.custom-tree-label img {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.el-checkbox.is-disabled::v-deep {
  display: none;
}

::v-deep .el-form-item__label {
  color: #333333 !important;
}
</style>
