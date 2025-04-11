<template>
  <div>
    <el-form label-width="100px" :model="form" ref="form">
      <el-form-item
          v-for="i in template.field"
          :label="i.col_title"
          :key="i.pk"
          :prop="i.col_name"
          :rules="JSON.parse(i.verify_exp)"
      >
        <template v-if="i.widget === 'input'">
          <span v-if="show">{{ form[i.col_name] }}</span>
          <el-input
              v-else
              :style="`width:${i.width}px`"
              v-model="form[i.col_name]"
          />
        </template>
        <template v-if="i.widget === 'numberInput'">
          <span v-if="show">{{ form[i.col_name] }}</span>
          <el-input-number
              v-else
              :controls="false"
              :style="`width:${i.width}px`"
              v-model.number="form[i.col_name]"
              :max="100"
              :min="0"
          />
        </template>
        <template v-if="i.widget === 'file'">
          <span v-if="show">
            <a :href="form[i.col_name]" target="_blank" download>{{
                form[`${i.col_name}_display`]
              }}</a>
          </span>
          <el-upload
              v-else
              action=""
              :style="`width:${i.width}px`"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="
              (file, fileList) => handleChange(file, fileList, i.col_name)
            "
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </template>
        <template v-if="i.widget === 'select'">
          <span v-if="show">{{ form[i.col_name] }}</span>
          <FormCmp
              v-else
              :type="i.widget"
              :source_info="i.data_source_info"
              v-model="form[i.col_name]"
          />
        </template>
        <template v-if="i.widget === 'multipleSelect'">
          <span v-if="show">{{ form[`${i.col_name}_display`] }}</span>
          <FormCmp
              v-else
              :type="i.widget"
              :source_info="i.data_source_info"
              v-model="form[i.col_name]"
              :display.sync="form[`${i.col_name}_display`]"
          />
        </template>
        <template v-if="i.widget === 'checkbox'">
          <span v-if="show">{{ form[`${i.col_name}_display`] }}</span>
          <FormCmp
              v-else
              :type="i.widget"
              :source_info="i.data_source_info"
              v-model="form[i.col_name]"
              :display.sync="form[`${i.col_name}_display`]"
          />
        </template>
        <template v-if="i.widget === 'date'">
          <span v-if="show">{{ form[i.col_name] }}</span>
          <el-date-picker
              v-else
              value-format="yyyy-MM-dd"
              v-model="form[i.col_name]"
          >
          </el-date-picker>
        </template>
        <template v-if="i.widget === 'radio'">
          <span v-if="show">{{ form[i.col_name] }}</span>
          <FormCmp
              v-else
              :type="i.widget"
              :source_info="i.data_source_info"
              v-model="form[i.col_name]"
          />
        </template>
      </el-form-item>
    </el-form>
    <div class="footer" v-if="showCtlButton">
      <el-button @click="$emit('onClose')">关闭</el-button>
      <el-button v-if="!show" type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import FormCmp from "./FormCmp.vue";
import resource from "@/resource";
export default {
  props: {
    showCtlButton: {
      type: Boolean,
      default: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    FormTemplateId: String,
    FormDataId: String,
  },
  data() {
    return { template: {}, form: {} };
  },
  methods: {
    async initTemplate() {
      let res = await resource.getObj('formtemplate', this.FormTemplateId);
      this.template = res.data;
      this.initFormData();
      if (this.FormDataId) {
        this.getFormTemplateData();
      }
    },
    async getFormTemplateData() {
      let res = await resource.getObj('formdata', this.FormDataId);
      let data = transform(res.data);
      this.form = { ...data };
      function transform(obj) {
        for (const key in obj) {
          if (key.startsWith("field") && !key.endsWith("display")) {
            if (
                obj[key] &&
                typeof obj[key] === "string" &&
                obj[key].startsWith("[") &&
                obj[key].endsWith("]")
            ) {
              obj[key] = JSON.parse(obj[key]);
            }
          }
        }
        return obj;
      }
    },
    initFormData() {
      let temp = {};
      this.template.field.forEach((i) => {
        if (i["widget"] === "checkbox" || i["widget"] === "multipleSelect") {
          temp[i.col_name] = [];
          temp[`${i.col_name}_display`] = "";
        } else {
          temp[i.col_name] = null;
        }
      });
      temp["template"] = this.template.pk;
      this.form = JSON.parse(JSON.stringify(temp));
    },
    async submit() {
      let valid = await new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
      if (valid) {
        let res;
        let form = { ...this.form };
        for (const i in form) {
          if (Object.prototype.toString.call(form[i]) === "[object Array]") {
            form[i] = JSON.stringify(form[i]);
          }
        }
        if (form.pk) {
          res = await resource.updateObj('formdata',form.pk, form);
        } else {
          res = await resource.createObj('formdata', form);
        }
        this.$emit("onSubmit", res.data);
        this.$emit("onClose");
        return res.data;
      } else {
        this.$message.error("请检查所填项!");
        throw new Error("校验失败");
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${
              files.length
          } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    async handleChange(file, fileList, field) {
      let formdatafile = new FormData();
      formdatafile.append("file", file.raw);
      let resp = await resource.createObj('fileupload', formdatafile);
      this.form[field] = resp.data.file;
      this.form[`${field}_display`] = file.name;
    },
  },
  created() {
    if (this.FormTemplateId) {
      this.initTemplate();
    }
  },
  watch: {
    FormTemplateId: {
      handler() {
        this.initTemplate();
      },
    },
  },
  components: {
    FormCmp,
  },
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
