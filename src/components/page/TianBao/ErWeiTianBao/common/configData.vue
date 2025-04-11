<template>
  <div style="position:relative">
    <el-form :model='form' ref="form" label-width="110px" status-icon>

      <el-form-item label="选择分组列" prop="group_type" :rules="{ required: true, message: '至少选择一项!' }">
        <el-checkbox-group v-model="form.group_type">
          <el-checkbox v-for="(item, index) in tableHeader" :label="item.name"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择统计列" prop="col_type">
        <el-checkbox-group v-model="form.col_type">
          <el-checkbox v-for="(item, index) in tableHeader" v-if="fieldType[item.value]==='number'"
                       :label="item.name"></el-checkbox>
        </el-checkbox-group>
        <span style="color: red;font-size: 12px">*注：只能选择类型为数字的列</span>
      </el-form-item>
      <el-form-item v-for="item in form.col_type" :label="item" prop="resource" v-if="form.col_type.length>0"
                    :rules="{ required: true, message: '至少选择一项!' }">
        <el-select
            v-model="form.resource[item]"
            multiple
            filterable
            default-first-option
            placeholder="请统计类型...">
          <el-option
              v-for="value in zj_options"
              :key="value.value"
              :label="value.label"
              :value="value.value">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import moment from "moment";
import resource, {
  createObj,
  getObj
} from "@/resource"
import XLSX from "xlsx";
import {mapState} from "vuex";
import axios from "axios";
import {BASE_HOST} from "@/constvars";

export default {
  name: "Excel",
  model: {
    prop: "tid"
  },
  computed: {
    ...mapState(["userinfo"]),
  },
  props: {
    tid: {
      type: String,
    }
  },
  data() {
    return {
      tableData: {header: [], data: [], title: "", boxplotData: false},
      end_data: [],
      tableHeader: [],
      templateData: {
        title: null,
        form_type: 4,
        keyword: "",
        api_version: "v1",
        api_name: "formdata",
        code: "",
        department: [],
        photo: "",
        remark: {
          group_type: [],
          col_type: [],
          resource: {},
          bz_info: null,
          is_groups: false,
          groups: {
            heard: [
              {
                name: "",
                row_list: [],
              }
            ],
            col_list: [],
            resource: {}
          }
        },
        need_login: false,
      },
      fieldType: {},
      form: {},
      excelTmp: {},
      zj_options: [{
        value: '总计',
        label: '总计'
      }, {
        value: '平均值',
        label: '平均值'
      }],
    }
  },
  methods: {
    async submit() {
      for (let i in this.form.resource) {
        if (this.form.col_type.indexOf(i) < 0) {
          delete this.form.resource[i];
        }
      }
      let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)))
      if (valid) {
        await this.remarkSave();
        this.$emit("checked");
      } else {
        this.$message.warning("请认真填写表单!")
      }
    },
    async remarkSave() {
      let objToStr = JSON.stringify(this.form);
      let data = {
        ...this.templateData,
        biz_id: this.$bizCode.tianbao_biz,
        src_id: this.$sourceCode.source_id,
        remark: objToStr,
      };
      await resource.updateObj("formtemplate", data.pk, data);
      this.$router.push({
        name: "ewtianbao-jieguotongji",
        params: {tid: this.tid},
      });
    },
    async loadTemplate() {
      const resp = await axios.get(`${BASE_HOST}/api/v1/formtemplate/${this.tid}/`);
      let data = resp.data;
      data.remark = JSON.parse(data.remark);
      this.form = {...data.remark};
      this.templateData = data;
      this.tableData.title = resp.data.title;
      this.tableData.header = resp.data.field.map((val) => {
        val.title = val.col_title;
        val.key = val.alias || val.col_name;
        return val
      })

      this.tableHeader.splice(0);
      let obj = this.tableData.header;
      obj.forEach((i) => {
        if (i["key"] !== 'user_id') {
          this.tableHeader.push({name: i["title"], value: i["key"], pk: i['pk']});
        }
        this.fieldType[i["key"]] = i["widget"];
      });
    },
    async loadData() {
      let params = {
        template_id: this.tid,
        o: '-create_time'
      }
      this.data = await resource.getList(`data`, params);
    }
  },
  async mounted() {
    await this.loadTemplate();
    await this.loadData();
    for (let item of this.tableHeader) {
      this.excelTmp[item.name] = item.value;
    }
  },
  components: {},
}
</script>
<style scoped>
.batchCtl {
  position: absolute;
  bottom: 0;
  right: 0;
}

.tips {
  position: absolute;
  right: 0;
  top: 0;
  color: red;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
