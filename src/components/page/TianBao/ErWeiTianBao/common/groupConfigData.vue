<template>
  <div style="position:relative">
    <div style="display: flex">
      <groupListForm
          ref="formListData"
          v-model="list_form"
          @add="addListCol"
      />
      <el-table
          :data="form.group_type"
          border
          max-height="450"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="报表名称" prop="col_title"></el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="{ row }">
            <el-button @click="colListView(row)" type="success">查看报表结果</el-button>
            <el-button @click="colListPeiZhi(row)" type="warning">配置报表</el-button>
            <el-button @click="colListEdt(row)" type="primary">编辑</el-button>
            <el-button @click="colListDel(row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!--    数据统计魔板模板-->
    <el-dialog :title="shou_list.col_title+'-报表配置'" :visible.sync="is_show" width="70%"
               :close-on-click-modal="false"
               :close-on-press-escape="false" top="3vh" center destroy-on-close append-to-body>
      <div style="display: flex" v-if="is_show">
        <groupForm
            ref="formData"
            v-model="data_form"
            :tableHeader="tableHeader"
            :excelTmp="excelTmp"
            :fieldType="fieldType"
            :data="data"
            @add="addCol"
        />
        <el-table
            :data="list_data"
            border
            max-height="450"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="列名称" prop="col_title"></el-table-column>
          <el-table-column label="选择分组列" prop="group_type">
            <template slot-scope="{ row }">
              {{ row.group_type }}
            </template>
          </el-table-column>
          <el-table-column label="行统计信息" prop="resource[group_type]">
            <template slot-scope="{ row }">
              <span v-for="item in row.resource[row.group_type]">{{ item }}、  </span>
              <!--            {{ row.resource[row.group_type] }}-->
            </template>
          </el-table-column>
          <el-table-column label="统计列" prop="col_type"></el-table-column>
          <el-table-column label="合计列名称" prop="hj_title"></el-table-column>
          <el-table-column label="行统计列名称" prop="htj_title"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button @click="colDel(row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="is_show = false" icon="el-icon-close">取消</el-button>
        <el-button @click="onSave()" icon="el-icon-check" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import resource, {
  createObj,
  getObj
} from "@/resource"
import XLSX from "xlsx";
import _ from "lodash";
import {mapState} from "vuex";
import array from "lodash/array";
import groupForm from "./groupForm";
import groupListForm from "./groupListForm";
import axios from "axios";
import {BASE_HOST} from "@/constvars";

export default {
  name: "Excel",
  model: {
    prop: "tid"
  },
  components: {
    groupListForm,
    groupForm,
  },
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
  props: {
    tid: {
      type: String,
    },
  },
  data() {

    return {
      tableData: {header: [], data: [], title: "", boxplotData: false},
      end_data: [],
      tableHeader: [],
      templateData: {
        title: null,
        form_type: 3,
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
      is_show: false,
      data_form: {
        pk: null,
        col_title: null,
        group_type: null,
        resource: {},
        col_type: null,
        hj_title: null,
        htj_title: null
      },
      list_form: {
        pk: null,
        col_title: null,
        value: [],
      },
      list_data: [],
      shou_list: {},
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
      await this.remarkSave();
      this.$message.success("保存成功!")
      this.$emit("checked");
      // // 提交数据
      // let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)))
      // if (valid) {
      //
      // } else {
      //   this.$message.warning("请认真填写表单!")
      // }
    },
    clearForm() {
      this.data_form = {
        pk: null,
        col_title: null,
        group_type: null,
        resource: {},
        col_type: null,
        hj_title: null,
        htj_title: null
      };
      this.list_form = {
        pk: null,
        col_title: null,
        value: [],
      };

    },
    async addListCol() {
      let idx = this.form.group_type.findIndex((i) => {
        return i.pk === this.list_form.pk;
      });
      if (idx > -1) {
        // this.form.group_type.splice(idx, 1);
        for (let key in this.form.group_type) {
          if (this.form.group_type[key].pk === this.list_form.pk) {
            this.form.group_type[key] = {...this.list_form}
          }
        }
      } else {
        this.form.group_type.push(this.list_form)
      }
      await this.clearForm();

      await this.remarkSave();
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
    },
    colListEdt(item) {
      this.list_form = {...item}
    },
    colListPeiZhi(item) {
      this.is_show = true;
      this.shou_list = {...item};
      this.list_data = [...item.value]
    },
    colListView(item) {
      this.$router.push({
        name: "ewtianbao-jieguotongji-group",
        params: {tid: this.tid, pk: item.pk},
      });
    },
    colListDel(item) {
      let idx = this.form.group_type.findIndex((i) => {
        return i.pk === item.pk;
      });
      this.form.group_type.splice(idx, 1);
    },

    async addCol() {
      this.list_data.push(this.data_form)
      await this.clearForm();
    },
    colDel(item) {
      let idx = this.list_data.findIndex((i) => {
        return i.pk === item.pk;
      });
      this.list_data.splice(idx, 1);
    },
    async onSave() {
      this.shou_list.value = [...this.list_data];
      for (let key in this.form.group_type) {
        if (this.form.group_type[key].pk === this.shou_list.pk) {
          this.form.group_type[key] = {...this.shou_list}
        }
      }
      this.shou_list = [];
      this.is_show = false;
      await this.remarkSave();
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
