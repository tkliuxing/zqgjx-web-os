<template>
  <fieldset class="ziduan">
    <legend><h4>配置表单</h4></legend>
    <el-form :model='data_form' ref="ruleForm" label-width="110px" status-icon>

      <el-form-item
          label="列名称"
          prop="col_title"
          :rules="{ required: true, message: '必填项!' }"
      >
        <el-input v-model="data_form.col_title"/>
      </el-form-item>

      <el-form-item label="选择分组列" prop="group_type" :rules="{ required: true, message: '至少选择一项!' }">
        <el-select
            v-model="data_form.group_type"
            filterable
            default-first-option
            placeholder="请统计类型...">
          <el-option
              v-for="item in tableHeader"
              v-if="item.value!=='region'"
              :key="item.name"
              :label="item.name"
              :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="data_form.group_type" prop="resource" v-if="data_form.group_type"
                    :rules="{ required: true, message: '至少选择一项!' }">
        <el-select
            v-model="data_form.resource[data_form.group_type]"
            multiple
            filterable
            clearable
            default-first-option
            placeholder="请统计类型...">
          <el-option
              v-for="value in optionMaps(data_form.group_type)"
              :key="value.text"
              :label="value.text"
              :value="value.text">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="选择统计列" prop="col_type">
        <el-select
            v-model="data_form.col_type"
            filterable
            clearable
            default-first-option
            placeholder="请统计类型...">
          <el-option
              v-for="item in tableHeader"
              v-if="fieldType[item.value]==='number'"
              :key="item.name"
              :label="item.name"
              :value="item.name">
          </el-option>
        </el-select>
        <span style="color: red;font-size: 12px">*注：只能选择类型为数字的列</span>
      </el-form-item>

      <el-form-item
          v-if="data_form.col_type"
          label="合计列名称"
          prop="hj_title"
          :rules="{ required: true, message: '必填项!' }"
      >
        <el-input v-model="data_form.hj_title"/>
      </el-form-item>

      <el-form-item
          label="行统计列名称"
          prop="htj_title"
      >
        <el-input v-model="data_form.htj_title"/>
      </el-form-item>

    </el-form>
    <div class="foot">
      <el-button type="primary" @click="addList('ruleForm')"
      >添加
      </el-button
      >
    </div>
  </fieldset>
</template>

<script>
import {mapState} from "vuex";
import array from "lodash/array";

export default {
  name: "groupForm",
  computed: {
    ...mapState(["userinfo"]),
    optionMaps() {
      return function (item) {
        let key = this.excelTmp[item];
        let data = array.uniq(this.data.map((val) => val[key])).map((val) => {
          return {text: val, value: val}
        });
        return data;
      };
    },
  },
  model: {
    prop: "data_form"
  },
  props: {
    data_form: Object,
    tableHeader: Array,
    data: Array,
    excelTmp: Object,
    fieldType: Object,
  },
  data() {
    return {};
  },
  methods: {
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    addList(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.debounce(this.addinfo(formName), 1000, true);
        } else {
          this.$message.error("请认真检查必填项!");
          return false;
        }
      });
    },

    addinfo(formName) {
      this.data_form.pk = this.guid();
      this.$emit("add");
      this.$nextTick(() => {
        this.$refs[formName].clearValidate();
      })

    },
    debounce(func, wait, immediate) {
      let timeout;
      return function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        if (immediate) {
          var callNow = !timeout;
          timeout = setTimeout(() => {
            timeout = null;
          }, wait);
          if (callNow) func.apply(context, args);
        } else {
          timeout = setTimeout(function () {
            func.apply(context, args);
          }, wait);
        }
      };
    },
  },
  created() {
  },
};
</script>

<style scoped>
.el-form-item *:not(label) {
  width: 100%;
}

.ziduan {
  width: 30%;
  position: relative;
  padding: 0 10px;
  padding-top: 1rem;
  margin: 10px;
  border-color: #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

h4 {
  width: 6rem;
  text-align: center;
}

.foot {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.name {
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: normal;
}

.lab {
  font-size: 12px;
  color: #a0a0a0;
}

.field-name {
  width: auto;
  display: inline-block !important;
  display: inline;
  margin: 0 20px 10px 0;
}

.field-name:hover {
  color: #2d8cf0;
  cursor: pointer;
}

.field-name-color {
  color: #f5b748;
}

.el-tag {
  width: auto !important;
  margin: 0 2px;
}
</style>
