<template>
  <fieldset class="ziduan">
    <legend><h4>新增报表</h4></legend>
    <el-form :model='data_form' ref="ruleForm" label-width="110px" status-icon>

      <el-form-item
          label="报表名称"
          prop="col_title"
          :rules="{ required: true, message: '必填项!' }"
      >
        <el-input v-model="data_form.col_title"/>
      </el-form-item>
    </el-form>
    <div class="foot">
      <el-button type="primary" @click="addList('ruleForm')">
        <span v-if="data_form.pk">保存</span>
        <span v-else>添加</span>
      </el-button>
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
      if(!this.data_form.pk){
        this.data_form.pk = this.guid();
      }
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
