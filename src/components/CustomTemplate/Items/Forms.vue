<template>
  <div>
    <fieldset class="ziduan">
<!--      <legend><h4>对象属性定义</h4></legend>-->
      <el-form label-width="120px" :model="value" ref="ruleForm">
<!--        <el-form-item-->
<!--          label="排序编号"-->
<!--          prop="sort_num"-->
<!--          :rules="{ required: true, message: '必填项!' }"-->
<!--        >-->
<!--          <el-input v-model.number="value.sort_num" />-->
<!--        </el-form-item>-->
        <el-form-item
          label="名称"
          prop="col_title"
          :rules="{validator: validatePass, required: true, trigger: 'blur' }"
        >
          <el-input v-model="value.col_title" @change="getTitle"/>
        </el-form-item>
<!--        <el-form-item-->
<!--          label="字段别名"-->
<!--          prop="alias"-->
<!--          :rules="{ required: true, message: '必填项!' }"-->
<!--        >-->
<!--          <el-input v-model="value.alias" />-->
<!--        </el-form-item>-->
<!--        <el-form-item-->
<!--          label="字段名"-->
<!--          prop="col_name"-->
<!--          :rules="{ validator: validatePass, required: true, trigger: 'blur' }"-->
<!--        >-->
<!--          <el-autocomplete-->
<!--            v-model="value.col_name"-->
<!--            :trigger-on-focus="false"-->
<!--            :fetch-suggestions="querySearch"-->
<!--          >-->
<!--            <el-button-->
<!--              slot="append"-->
<!--              icon="el-icon-more"-->
<!--              @click="showFieldList = true"-->
<!--            ></el-button>-->
<!--            <template slot-scope="{ item }">-->
<!--              <div class="name">{{ item.value }}</div>-->
<!--              <span class="lab">{{ item.label }}</span>-->
<!--            </template>-->
<!--          </el-autocomplete>-->
<!--        </el-form-item>-->
        <el-form-item
          label="控件类型"
          prop="widget"
          :rules="{ required: true, message: '必填项!' }"
        >
          <el-select v-model="value.widget" @change="getWidget">
            <el-option
              v-for="(item, index) in controls"
              :label="item.label"
              :value="item.value"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="统计类型" v-if="value.widget == 'number'" prop="tongjiType" :rules="{required: true,message: '必填项!'}">
          <el-select v-model="value.tongjiType">
            <el-option
              v-for="(item, index) in TongjiType"
              :label="item.label"
              :value="item.value"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="value.widget == 'select' || value.widget == 'radio'"
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
        <el-form-item label="是否必填">
          <el-switch
            v-model="value.is_required"
            :active-value="true"
            :inactive-value="false"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="查询项">
          <el-switch
            v-model="value.in_filter"
            inactive-color="#ff4949"
            inactive-text-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
          >
          </el-switch>
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
    <el-dialog
      :visible.sync="showFieldList"
      title="选择数据库字段"
      append-to-body
      top="5vh"
    >
      <template v-for="item in fieldList">
        <div
          v-if="item.is_show"
          @click="handleClickField(item)"
          :class="['field-name', item.required ? 'field-name-color' : null]"
          :key="item.pk"
        >
          <div class="field-item">
            {{ item.value }}
            <span>({{ item.help_text || item.label }})</span>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {Field} from "./models";
import resource from "@/resource";

export default {
  name: "Form",
  props: {
    value: Object,
    update: {
      type: Boolean,
      default: false,
    },
    api_name: String,
  },
  data() {
    return {
      editor: null,
      type: "",
      controls: [
        { id: 1, label: "输入框", value: "input" },
        { id: 2, label: "选项框", value: "select" },
        { id: 3, label: "日期", value: "date" },
        { id: 4, label: "文件", value: "upload" },
        { id: 5, label: "单选按钮", value: "radio" },
        { id: 6, label: "数值", value: "number" },
      ],
      TongjiType:[
        { id: 1, label: "不统计", value: "not_counted" },
        { id: 2, label: "求和", value: "count" },
        { id: 3, label: "最大值", value: "max" },
        { id: 4, label: "最小值", value: "min" },
        { id: 4, label: "平均值", value: "avg" },
      ],
      editorList: [],
      dataSource: [],
      fieldList: [],
      showFieldList: false,
    };
  },
  methods: {
    getTitle(val){
      if(val){
        this.value.alias = val;
      }
    },
    // 选择控件类型不为数值的话 清空统计类型
    getWidget(val){
      if(val !='number'){
        this.value.tongjiType = ''
      }
    },
    loadField() {
      this.fieldList = [];
      this.$http({ url: `/goods/`, method: "OPTIONS" })
        .then((resp) => {
          let data = resp.data.actions.POST;
          for (let k in data) {
            if (k !== "sys_id" && k !== "pk" && !data[k].read_only) {
              let obj = {
                value: k,
                label: data[k].label,
                help_text: data[k].help_text,
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
    querySearch(queryString, cb) {
      var restaurants = this.fieldList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        if (restaurant.is_show) {
          return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >
              -1 || restaurant.label.indexOf(queryString) > -1
          );
        }
      };
    },
    validatePass(_, value, callback) {
      if (this.$parent.editValue) {
        if (!value) {
          return callback(new Error("不允许为空"));
        } else {
          this.$parent.updateForm.fields.forEach((i) => {
            if ( i.col_title === value) {
              return callback(new Error("已定义字段名!"));
            }
          });
          callback();
        }
      } else {
        if (!value) {
          return callback(new Error("不允许为空"));
        } else {
          this.$parent.updateForm.fields.forEach((i) => {
            if (i.col_title === value) {
              return callback(new Error("已定义字段名!"));
            }
          });
          callback();
        }
      }
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
      this.$emit("add",new Field(this.value));
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
      this.$emit("update",this.value)
    },
    handleClickField(obj) {
      this.value.col_name = obj.value;
      this.showFieldList = false;
    },
    editField(field_name) {
      this.fieldList.filter((field) => {
        if (field.value === field_name) {
          field.is_show = true;
        }
      });
    },
  },
  created() {
    // this.loadField();
  },
};
</script>

<style scoped>
.el-form-item *:not(label) {
  width: 100%;
}

.ziduan {
  width: 90%;
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
