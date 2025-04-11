<template>
  <div>
    <div style="display: flex;flex-direction: column" >
      <el-form inline label-suffix=":" ref="tableTitle" :model="template">
        <el-row>
          <el-col :span="6">
                    <el-form-item label="请选择作为标题的字段" prop="title" :rules="[{required:true,message:'请选择作为标题的字段'}]">
                      <el-select v-model="template.title" >
                        <el-option
                          v-for="(item, index) in fields"
                          :label="item.alias"
                          :value="item.alias"
                          :key="index"
                        />
                      </el-select>
                    </el-form-item>
          </el-col>
<!--          <el-col :span="3">-->
<!--            <el-form-item label="图标" prop="code"  >-->
<!--              <el-upload-->
<!--                class="upload"-->
<!--                :class="{ disUoloadSty: noneBtnImg }"-->
<!--                :action="BASE_HOST"-->
<!--                :headers="upload.headers"-->
<!--                list-type="picture-card"-->
<!--                :data="upload.formData"-->
<!--                :limit="1"-->
<!--                :on-exceed="handleExceed"-->
<!--                :on-success="handlerSuccess"-->
<!--                :accept="imageAndModelTypes"-->
<!--                :on-remove="() => {-->
<!--                  this.template.code = '';-->
<!--                  this.fileList.splice(0);-->
<!--                }"-->
<!--                :file-list="fileList"-->
<!--              >-->
<!--                <i-->
<!--                  slot="default"-->
<!--                  class="el-icon-plus"-->
<!--                  style="font-size: 10px"-->
<!--                ></i>-->
<!--              </el-upload>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="10">
            <el-form-item label="类型">
              <el-radio-group  v-model="template.shape"
                               ref="radio"
                               :disabled="pk">
                <el-radio v-for="(item,index) in typeModel" :key="index" :label="item.value" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="display:flex;flex-direction: column">
        <div style="display: flex">
          <Form
            ref="formData"
            v-model="form"
            @add="addformList"
            :update="editValue"
            :api_name="template.api_name"
            @update="updateValue"
          />
          <el-table
            :data="fields"
            class="field-table"
            row-key="alias"
            border
            max-height="450"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              align="center"
              width="50"
              class-name="drag-column"
            >
              <template>
                <div class="drag-box">
                  <i class="el-icon-d-caret"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="col_title"></el-table-column>
            <el-table-column label="控件类型">
              <template slot-scope="{ row }">
                {{ widgetType(row.widget) }}
              </template>
            </el-table-column>
            <el-table-column label="是否必填" prop="is_required">
              <template slot-scope=" { row} ">
                <el-tag :type="row.is_required ? 'success':'danger'">
                  {{row.is_required ? '是':'否'}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="是否为查询项" prop="in_filter">
              <template slot-scope=" { row} ">
                <el-tag :type="row.in_filter ? 'success':'danger'">
                  {{row.in_filter ? '是':'否'}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="{ row,$index }">
                <el-button @click="edit(row)" type="primary">编辑</el-button>
                <el-button @click="del($index)" type="danger">删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="form-footer">
          <el-button @click="$emit('close', false)" icon="el-icon-close"
          >取 消</el-button
          >
          <el-button type="primary" @click="createTemplate" icon="el-icon-check"
          >确 定
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "./Forms.vue";
import { mapState } from "vuex";
import resource from "@/resource";
import Sortable from "sortablejs";
import area from "@/utils/area";
import {Field, TreeTemplate} from "./models"
import {BASE_HOST} from "@/constvars";

const template_form = {
  pk: null,
  sort_num: null,
  title: null,
  form_type: 1,
  keyword: "",
  shape: 'point',
  api_version: "v1",
  api_name: "goods",
  code: "",
  photo: "",
  biz_id: 1,
  remark:{
    is_static:null,
  },
};

export default {
  computed: {
    ...mapState(["systemlist"]),
    defineProps() {
      return {
        checkStrictly: true,
      };
    },
  },
  props: { updateForm: TreeTemplate },

  data() {
    return {
      area,
      BASE_HOST:BASE_HOST+'/api/v1/fileupload/',
      AMap: null,
      type: "mode",
      template: { ...template_form },
      fileList: [],
      noneBtnImg: false,
      mode: "none",
      administrative: [],
      mouseTag: [],
      imageAndModelTypes: '.png,.jpg,.jpeg,.webp,.glb',
      initMapElectronic: {
        polygon: { field_01: "" },
        area: { field_01: "" },
      },
      form: {
        template: null,
        sort_num: null,
        col_title: null,
        col_name: null,
        widget: "input",
        widget_attr: null,
        verify_exp: null,
        data_source: null,
        local_data_source: null,
        in_filter: false,
        date: null,
      },
      tempApi_name: "goods",
      fields: [],
      editValue: false,
      searchLoading: false,
      templateData_copy: [],
      loading: false,
      electronicFenceVisable: false,
      search: "",
      paramsObj: null,
      params: {
        maxSpeed: 0,
        minSpeed: 0,
        stopTime: 0,
        in_or_out: "",
        timeOut: 0,
      },
      upload: {
        headers: { Authorization: null },
        formData: { sys_id: null, org_id: null },
      },
      tableTitle:{
        title: null,
      },
      typeModel: [
        { id: 1, label: "点", value: "point" },
        { id: 2, label: "线", value: "line" },
        { id: 3, label: "多边形", value: "polygon" },
        // { id: 4, label: "模型", value: "model" },
      ],
      pk:null
    };
  },
  methods: {
    /**
     * @description  模板添加字段函数
     */
    async addformList(val) {
      this.updateForm.fields.push(val)
      this.form = {};
    },
    /**
     * @description 物品模板点击确定时的函数
     */
    async createTemplate() {
      try {
        let valid = await new Promise(resolve => this.$refs.tableTitle.validate(validate => resolve(validate)));
        if (valid) {
          // if(!this.template.code){
          //   this.$message.warning('请上传图标！')
          //   return
          // }
          this.updateForm.title_field_name = this.template.title;
          this.updateForm.shape = this.template.shape;
          this.updateForm.icon = this.template.code;
          await this.updateForm.save()
          this.$message.success("保存成功");
          this.$emit("close", false);
          this.$emit('loadData')
        }else{
          this.$message.warning('请选择表单名')
        }
      } catch (error) {
        console.log(error);
      }
    },
    edit(obj) {
      this.form = obj;
      this.editValue = true;
    },
    /**
     * @description  删除模板字段函数
     */
    del(obj) {
      this.$confirm("删除不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.updateForm.fields.splice(obj,1)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * @description  编辑模板字段函数
     */
    async updateValue(val) {
      const index = this.updateForm.fields.findIndex(i => i.alias === val.alias);
      if (index !== -1) {
        this.updateForm.fields[index] = val;
      }
      this.editValue = false;
      this.form = {};
    },
    clear() {
      this.form = {
        template: null,
        sort_num: null,
        col_title: null,
        col_name: null,
        widget: "input",
        widget_attr: null,
        verify_exp: null,
        width: null,
        data_source: null,
      };
      this.$refs.formData.$refs["ruleForm"].resetFields();
    },
    widgetType(type) {
      switch (type) {
        case "input":
          return "输入框";
        case "select":
          return "选项框";
        case "upload":
          return "文件";
        case "date":
          return "日期";
        case "radio":
          return "单选按钮";
        case "number":
          return "数值";
        default:
          return "";
      }
    },
    handlerSuccess(res) {
      if (res.file) {
        this.template.code = res.file;
        this.noneBtnImg = true;
      }
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(
        ".field-table .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.fields.splice(oldIndex, 1)[0];
          _this.fields.splice(newIndex, 0, currRow);
        },
      });
    },
    submit() {
      switch (this.type) {
        case "mode":
          this.submitMouseTag();
          break;
        case "area":
          this.submitAdministrativeRegion();
          break;
      }
    },
    /**
     * @description  电子围栏省市区提交函数
     */
    async submitAdministrativeRegion() {
      try {
        if (this.initMapElectronic.area) {
          await resource.updateObj(
            "gps-polygon",
            this.initMapElectronic.area.pk,
            this.initMapElectronic.area
          );
          this.$message.success("保存成功!");
          this.electronicFenceVisable = false;
        } else {
          this.$prompt("填个名称吧", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(async ({ value }) => {
              let province = this.administrative[0] || null;
              let city = this.administrative[1] || null;
              let region = this.administrative[2] || null;
              await resource.createObj("gps-polygon", {
                template: this.template.pk,
                province,
                city,
                region,
                field_01: value,
              });
              this.$message.success("保存成功!");
              this.electronicFenceVisable = false;
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消保存",
              });
            });
        }
      } catch (error) {}
    },
    /**
     * @description 电子围栏鼠标定义多边形提交函数
     */
    async submitMouseTag() {
      try {
        if (this.initMapElectronic.polygon) {
          await resource.updateObj(
            "gps-polygon",
            this.initMapElectronic.polygon.pk,
            this.initMapElectronic.polygon
          );
          this.$message.success("保存成功!");
          this.electronicFenceVisable = false;
        } else {
          this.$prompt("填个名称吧", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(async ({ value }) => {
              let pointers = this.mouseTag.points;
              await resource.createObj("gps-polygon", {
                template: this.template.pk,
                pointers,
                field_01: value,
              });
              this.$message.success("保存成功!");
              this.electronicFenceVisable = false;
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消保存",
              });
            });
        }
      } catch (error) {}
    },
  },
  async created() {
    this.upload.headers.Authorization = `Bearer ${this.$store.state.token}`;
    this.upload.formData.sys_id = this.$store.state.sys_id;
    this.upload.formData.org_id = this.$store.state.org_id;
  },
  mounted() {
    this.$refs.radio.$children.forEach((item) => {
      item.$refs.radio.removeAttribute("aria-hidden");
    });
    this.rowDrop();
  },
  components: {
    Form,
  },
  watch: {
    updateForm: {
      handler(val) {
        this.fields = val.fields;
        if(val.pk){
          this.pk = val.title_field_name?val.pk:null;
          this.template.title = val.title_field_name
          this.template.shape = val.field_01
          this.template.code = val.icon
          if (
            (this.template.code && this.fileList.length === 0) ||
            (this.template.code &&
              this.fileList.length === 1 &&
              this.fileList[0].url !== this.template.code)
          ) {
            this.fileList = [{ url: this.template.code, name: "图标" }];
            this.noneBtnImg = true;
          }
        }
      },
      deep: true,
      immediate: true,
    },
    fileList: {
      handler() {
        if (this.fileList.length > 0) {
          this.noneBtnImg = true;
        } else {
          this.noneBtnImg = false;
        }
      },
    },
  },
};
</script>

<style scoped>
.form-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  box-sizing: border-box;
}

.upload >>> .el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  line-height: 30px;
  vertical-align: top;
}

.upload >>> .el-upload-list--picture-card .el-upload-list__item {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  margin: 0 8px 8px 0;
  display: inline-block;
}
.disUoloadSty >>> .el-upload--picture-card {
  display: none;
}
</style>
