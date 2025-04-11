<template>
  <div>
    <el-form label-width="100px" :model="form" ref="form">
      <template v-for="i in JSON.parse(this.datas.text_01)">
        <div :key="i.pk">
          <el-form-item
            v-if="i.col_title === '部门'"
            label="所属部门"
            prop="department"
            :rules="{ required: true, message: '请选择所属部门' }"
          >
            <el-cascader
              v-model="form.department"
              style="width: 100%"
              placeholder="请选择所属部门"
              :props="defineProps"
              :options="department"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            v-else
            :label="i.col_title"
            :prop="i.alias"
            :rules="{
              required: i.is_required,
              message: `${i.col_title}为必填项!`,
            }"
          >
            <template v-if="i.widget === 'radio'">
              <el-radio-group v-model="form[i.alias]">
                <el-radio
                  v-for="(j, idx) in i.local_data_source.split('\n')"
                  :label="j"
                  :key="idx"
                ></el-radio>
              </el-radio-group>
            </template>
            <template v-if="i.widget === 'input'">
              <el-input
                v-model="form[i.alias]"
                :placeholder="`请输入${i.col_title}`"
              ></el-input>
            </template>
            <template v-if="i.widget === 'number'">
              <el-input
                type="number"
                v-model="form[i.alias]"
                :placeholder="`请输入${i.col_title}`"
              ></el-input>
            </template>
            <template v-if="i.widget === 'date'">
              <el-date-picker
                style="width: 100%"
                v-model="form[i.alias]"
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="`请选择${i.col_title}`"
              ></el-date-picker>
            </template>
            <template v-if="i.widget === 'select'">
              <el-select
                v-model="form[i.alias]"
                style="width: 100%"
                :placeholder="`请选择${i.col_title}`"
                filterable
              >
                <el-option
                  v-for="(j, idx) in i.local_data_source.split('\n')"
                  :label="j"
                  :value="j"
                  :key="idx"
                ></el-option>
              </el-select>
            </template>
            <template v-if="i.widget == 'upload'">
              <FileUploadV4 :limit="1" :uploadType="['png','jpg','webp','jpeg','glb']" v-model="form[i.alias]" categoryName="设备" ref="childfile"></FileUploadV4>
            </template>
          </el-form-item>
        </div>
      </template>
    </el-form>
    <div style="display: flex; justify-content: center">
      <el-button icon="el-icon-close" @click="$emit('close')">取消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="submit"
        >确定</el-button
      >
    </div>
    <el-dialog
      width="80%"
      :visible.sync="map.mapVisable"
      :close-on-click-modal="false"
      append-to-body
      center
      :show-close="false"
      top="4vh"
    >
      <div style="text-align: center; margin-bottom: 20px">
        <h1>当前经纬度：</h1>
        <h2>经度：{{ form.longitude || 0 }}，纬度：{{ form.latitude || 0 }}</h2>
      </div>
      <amap style="height: 500px" @click="getPos" defaultCursor="pointer">
        <amap-marker
          :position="[form.longitude, form.latitude]"
          v-if="form.longitude"
        />
      </amap>
      <div slot="footer">
        <el-button @click="cancel" icon="el-icon-close">取消</el-button>
        <el-button
          icon="el-icon-check"
          @click="map.mapVisable = false"
          type="primary"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import resource from "@/resource";
import {BASE_HOST} from "@/constvars";
import FileUploadV4 from "@/components/common/FileUploadV4.vue";
export default {
  name: "DyamicForm",
  computed: {
    ...mapState(["token", "sys_id", "org_id"]),
  },
  components:{FileUploadV4},
  props: {
    datas: {
      type: Object,
      default() {
        return {};
      },
    },
    update: Object,
  },
  data() {
    return {
      BASE_HOST:BASE_HOST+'/api/v1/fileupload/',
      map: {
        mapVisable: false,
        marker: null,
      },
      form: {
        // department: "",
        // longitude: "",
        // latitude: "",
        // altitude: null,
      },
      department: null,
      headers: { Authorization: null },
      formData: { sys_id: null, org_id: null },
      defineProps: {
        label: "name",
        children: "items",
        value: "pk",
        checkStrictly: true,
        emitPath: false,
      },
    };
  },
  methods: {
    getPos(evt) {
      this.form.longitude = evt.lnglat.toJSON()[0];
      this.form.latitude = evt.lnglat.toJSON()[1];
    },
    async initForm() {
      let tmp = {};
      if (this.update) {
        let form = { ...this.form, ...this.update };
        this.form = {pk:form.pk,...form.text_01}
      } else {
        if (this.datas.field && this.datas.field.length > 0) {
          this.datas.field.forEach((i) => {
            tmp[i.alias] = null;
          });
          this.form = { ...this.form, ...tmp };
        }
      }
      if (this.datas.biz_id === 10001) {
        let res = await resource.getList("department");
        this.department = this.deepFindArray(res);
      }
      this.headers.Authorization = `Bearer ${this.token}`;
      this.formData.sys_id = this.sys_id;
      this.formData.org_id = this.org_id;
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    handlerSuccess(res, obj) {
      if (res.file) {
        this.form[obj.alias] = res.file;
      }
    },
    deepFindArray(data) {
      data.forEach((i) => {
        if (i.items.length === 0) {
          i.items = null;
        } else {
          this.deepFindArray(i.items);
        }
      });
      return data;
    },
    async submit() {
      let valid = await new Promise((resolve) =>
        this.$refs.form.validate((validate) => resolve(validate))
      );
      if (valid) {
        if(this.$refs.childfile && this.$refs.childfile.length>0){
          for (let i = 0; i < this.$refs.childfile.length; i++) {
            let item = this.$refs.childfile[i]
            try {
              let file = await item.submits();
              if (file && file.status == 'error') {
                this.$message.warning('附件上传失败，请重新上传');
                return;
              }
            } catch (error) {
              this.$message.error('附件上传过程中发生错误');
              return;
            }
          }
        }
        await this.$emit("formData", {title:this.form[this.datas.field_03], form: this.form,datas:this.datas, });
      } else {
        this.$message.error("请检查表单");
      }
    },
    cancel() {
      this.map.mapVisable = false;
      this.form.longitude = "";
      this.form.latitude = "";
      this.$refs.form.resetFields();
    },
  },
  created() {
    this.initForm();
  },
};
</script>

<style></style>
