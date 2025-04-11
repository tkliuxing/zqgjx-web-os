<template>
  <fieldset class="ziduan">
    <legend><h4>表单字段</h4></legend>
    <el-form label-width="120px" :model="value" ref="ruleForm">
      <el-form-item
        label="排序编号"
        prop="sort_num"
        :rules="{ required: true, message: '必填项!' }"
      >
        <el-input v-model.number="value.sort_num" />
      </el-form-item>
      <el-form-item
        label="名称"
        prop="col_title"
        :rules="{ required: true, message: '必填项!' }"
      >
        <el-input v-model="value.col_title" />
      </el-form-item>
      <el-form-item
        label="控件类型"
        prop="widget"
        :rules="{ required: true, message: '必填项!' }"
      >
        <el-select v-model="value.widget">
          <el-option
            v-for="item in controls"
            :label="item.label"
            :value="item.value"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="value.widget == 'select'"
        label="选项"
        prop="col_title"
      >
        <el-input
          type="textarea"
          v-model="value.local_data_source"
          placeholder="每行一个选项"
        ></el-input>
        <span style="color: #999">每个回车一个选项</span>
      </el-form-item>
      <el-form-item
        label="填报时间"
        v-if="remark.type === '自然日' || remark.type === '工作日'"
      >
        <el-time-picker
          is-range
          clearable
          value-format="HH:mm:ss"
          v-model="value.data"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        >
        </el-time-picker>
      </el-form-item>
    </el-form>
    <div class="foot">
      <el-button v-if="update" type="success" @click="saveValue('ruleForm')"
        >保存</el-button
      >
      <el-button v-else type="primary" @click="addList('ruleForm')"
        >添加</el-button
      >
    </div>
  </fieldset>
</template>

<script>
export default {
  name: "Form",
  props: {
    value: Object,
    update: {
      type: Boolean,
      default: false,
    },
    api_name: String,
    remark: Object,
  },
  data() {
    return {
      editor: null,
      type: "",
      controls: [
        { id: 1, label: "数字框", value: "number" },
        { id: 3, label: "输入框", value: "input" },
      ],
      dataSource: [],
      fieldList: [],
    };
  },
  methods: {
    loadField() {
      this.fieldList = [];
      this.$http({ url: `/${this.api_name}/`, method: "OPTIONS" })
        .then((resp) => {
          let data = resp.data.actions.POST;
          for (let k in data) {
            if (k !== "sys_id" && k !== "pk" && !data[k].read_only) {
              let obj = {
                value: k,
                label: data[k].label,
                required: data[k].required,
                is_show: true,
              };
              this.$parent.updateForm.field.filter((field) => {
                if (field.col_name === k) {
                  obj.is_show = false;
                }
              });
              if (data[k].required) {
                this.fieldList.unshift(obj);
              } else {
                this.fieldList.push(obj);
              }
            }
          }
        })
        .catch((e) => {
          if (e.response.status === 404) {
            this.$message.error("接口不存在！");
          } else if (e.response.status === 500) {
            this.$message.error("服务器错误！");
          }
        });
    },

    addList(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.debounce(this.addinfo(), 1000, true);
        } else {
          this.$message.error("请认真检查必填项!");
          return false;
        }
      });
    },

    addinfo() {
      this.$emit("add");
      this.fieldList.filter((field) => {
        if (field.value === this.value.col_name) {
          field.is_show = false;
        }
      });
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

    saveValue(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("update");
          this.fieldList.filter((field) => {
            if (field.value === this.value.col_name) {
              field.is_show = false;
            }
          });
        } else {
          this.$message.error("请认真检查必填项!");
          return false;
        }
      });
    },
  },
  created() {
    // this.loadField();
  },
  watch: {
    api_name: "loadField",
  },
};
</script>

<style scoped>
.el-form-item *:not(label) {
  width: 100%;
}

.ziduan {
  width: 35%;
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
