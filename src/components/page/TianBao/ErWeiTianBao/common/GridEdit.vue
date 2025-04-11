<template>
  <div
    style="
      background: #fff;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0px 0px 15px #ccc;
    "
  >
    <div>
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.replace({ name: 'ewtianbao-index' })"
          >返回
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="excelDialogVisable=true" type="success" round icon="el-icon-upload">数据导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="excelExport" type="warning" round icon="el-icon-download">数据导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="logView" type="info" round plain icon="el-icon-s-order">操作日志</el-button>
        </el-form-item>
        <!--        <el-form-item v-if="hasPerm('二维填报结果统计')">-->
        <!--          <el-button @click="configurelDialogVisable=true" type="primary" round plain icon="el-icon-s-data">结果统计-->
        <!--          </el-button>-->
        <!--        </el-form-item>-->
      </el-form>

      <div style="text-align: center; font-size: 1.5rem">
        {{ isData.title }}
      </div>
    </div>
    <el-form inline label-width="80px" @submit.native.prevent>

      <el-form-item>
        <el-input
          v-model="search"
          prefix-icon="el-icon-search"
          placeholder="关键字搜索"
          @keyup.enter.native="seachData"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          icon="el-icon-search"
          round
          @click="seachData"
        >搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          round
          @click="clearData"
        >全部显示
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :id="isData.id"
      ref="dragTable"
      :data="data.slice((page-1)*pageSize,page*pageSize)"
      border
      stripe
      row-key="pk"
      highlight-current-row
      :header-cell-style="{ 'text-align': 'center' }"
      :row-style="{ height: '50px' }"
      :cell-style="{ 'text-align': 'center' }"
      :cell-class-name="getCellIndex"
      max-height="450"
      style="margin-top: 20px"
      @cell-dblclick="editTable"
      @cell-mouse-enter="showBtn"
      @cell-mouse-leave="hideBtn"
      @sort-change="sortable"
      @selection-change="selectChange"
      @filter-change="filterChange"
    >
      <el-table-column type="selection" reserve-selection width="55"></el-table-column>
      <el-table-column :sortable="sortabled" label="序号" prop="sn" width="80px"></el-table-column>

      <!--          :filter-method="filterRow"-->
      <el-table-column
        v-for="(item, index) in tableHeader"
        :label="item.name"
        :key="item.pk"
        :sortable="sortabled"
        :prop="`${item['value']}`"
        filter-multiple
        :filters="getFilter(item)"
        :column-key="item.value"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.pk === rowIndex &&
              scope.column.property === columnIndex &&
              allow_edit">
            <el-input-number v-if="fieldType[scope.column.property]==='number'"
                             v-focus
                             v-model="from[item.value]"
                             @blur="endEdit(scope.row,item.value)" :controls="false"></el-input-number>
            <el-input
              v-else
              v-focus
              v-model="from[item.value]"
              @blur="endEdit(scope.row,item.value)"
            />
            <!--            <el-button-->
            <!--                type="success"-->
            <!--                size="mini"-->
            <!--                icon="el-icon-delete"-->
            <!--                @click="endEdit(scope.row, item.value)"-->
            <!--            ></el-button>-->
          </template>
          <span v-else>{{ scope.row[item.value] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isData.boxplotData" label="操作" width="70">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            v-if="scope.row.index === hoverIndex"
            @click="del(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="data.length">
    </el-pagination>
    <div style="margin-top:10px;">
      <el-button icon="el-icon-delete" @click="batchDelDataFn" round :type="batchDelData.length>0?'danger':'info'"
                 slot="reference">批量删除
      </el-button>
      <el-button style="margin-left: 5px" v-loading="loading" type="primary" round icon="el-icon-plus" @click="add">
        添加一行
      </el-button>
    </div>
    <!--    数据导入模板-->
    <el-dialog :title="isData.title+'  Excel数据导入'" :visible.sync="excelDialogVisable" width="95%"
               :close-on-click-modal="false"
               :close-on-press-escape="false" top="3vh" center destroy-on-close append-to-body>
      <ImportData v-if="excelDialogVisable" v-model="tableHeader" :title="this.isData.title" :tid="tid"
                  @loadData="loadData" @close="excelDialogVisable=false"/>
    </el-dialog>
    <!--    数据统计魔板模板-->
    <el-dialog :title="isData.title+'-统计报表配置'" :visible.sync="configurelDialogVisable" :width="templateData.remark.is_groups?'80%':'50%'"
               :close-on-click-modal="false"
               :close-on-press-escape="false" top="3vh" center destroy-on-close append-to-body>
      <configData v-if="configurelDialogVisable && !templateData.remark.is_groups" v-model="tid"
                  @checked="submitConfigForm" ref="FormComp" @close="configurelDialogVisable=false"/>

      <groupConfigData v-if="configurelDialogVisable && templateData.remark.is_groups" v-model="tid"
                       @checked="submitDHConfigForm"
                       ref="FormComp"
                       @close="configurelDialogVisable=false"/>
      <div slot="footer">
        <el-button @click="configurelDialogVisable = false" icon="el-icon-close">关闭</el-button>
        <el-button @click="$refs.FormComp.submit()" icon="el-icon-check" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import Sortable from "sortablejs";
import XLSX from "xlsx";
import array from "lodash/array";
import collection from "lodash/collection";
import _ from "lodash";
import resource from '@/resource';
import ImportData from "./ImportData.vue"
import configData from "./configData"
import groupConfigData from "./groupConfigData"
import axios from "axios";
import {BASE_HOST} from "@/constvars";

export default {
  name: "",
  props: {
    isData: {
      type: Object,
    },
    tid: {
      type: String,
    }
  },
  computed: {
    ...mapState(["userinfo"]),
  },
  components: {
    ImportData,
    configData,
    groupConfigData,
  },
  data() {
    return {
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
      batchDelData: [],
      search: null,
      tableHeader: [],
      data: [],
      end_data: [],
      configurelDialogVisable: false,
      excelDialogVisable: false,
      allow_edit: false,
      rowIndex: null,
      columnIndex: null,
      hoverIndex: null,
      filters: {},
      loading: false,
      excelDownloadTranslate: {},
      fieldType: {},
      page: 1,
      pageSize: 10,
      sortby: null,
      sortsort: null,
      sortabled: 'custom',
      from: {},
      filteredValue: {},
      number: 1
    };
  },
  methods: {
    //权限判断的方法
    hasPerm(name) {
      return this.userinfo.func_names.indexOf(name) > -1;
    },
    filterChange(value) {
      if (Object.values(value)[0].length === 0) {
        delete this.filteredValue[Object.keys(value)[0]];
      } else {
        this.filteredValue[Object.keys(value)[0]] = [...Object.values(value)[0]];
      }
      this.filterSeach();
    },
    async filterSeach() {
      let end_data = [...JSON.parse(JSON.stringify(this.end_data))];
      let filteredValue = this.filteredValue;
      let data = [];
      if (this.search) {
        for (let key in end_data) {
          let item = end_data[key];
          let item_s = end_data[key];
          delete item.pk;
          delete item.sys_id;
          delete item.biz_id;
          delete item.index;
          delete item.src_id;
          delete item.org_id;
          delete item.template_id;
          for (let i in item) {
            if (typeof item[i] === 'number') {
              item[i] = item[i] + "";
            }
            if (item[i] && item[i].indexOf(this.search) > -1) {
              data.push(item_s);
              break;
            }
          }
        }
      } else {
        data = [...end_data];
      }

      if (JSON.stringify(filteredValue) !== "{}") {
        data = _.filter(data, (item) => {
          let obj = null;
          // 对多个值进行查找
          for (let key in filteredValue) {
            let state = null;
            let data_value = Object.values(filteredValue[key]);
            for (let i of data_value) {
              if (state === null) {
                state = item[key] === i;
              } else {
                state = state || item[key] === i;
              }
            }
            if (obj === null) {
              obj = state;
            } else {
              obj = obj && state;
            }
          }
          return obj
        });
      }
      this.data = [...data];
      await this.orderBy();
    },

    selectChange(data) {
      this.batchDelData = data;
    },
    showBtn(row, column, cell, event) {
      this.hoverIndex = parseInt(row.index);
    },
    hideBtn(row, column, cell, event) {
      this.hoverIndex = null;
    },
    async seachData() {
      await this.clearFilter();
      let end_data = [...JSON.parse(JSON.stringify(this.end_data))];
      this.data = [...end_data];
      let data = [];
      if (this.search) {
        for (let key in end_data) {
          let item = end_data[key];
          let item_s = end_data[key];
          delete item.pk;
          delete item.sys_id;
          delete item.biz_id;
          delete item.index;
          delete item.src_id;
          delete item.org_id;
          delete item.template_id;
          for (let i in item) {
            if (typeof item[i] === 'number') {
              item[i] = item[i] + "";
            }
            if (item[i] && item[i].indexOf(this.search) > -1) {
              data.push(item_s);
              break;
            }
          }
        }
      } else {
        data = [...end_data];
      }
      this.data = [...data];
      await this.orderBy();
    },
    orderBy() {
      let order = this.sortsort;
      let prop = this.sortby;
      if (order === null || prop === null) {
        this.data = collection.sortBy(this.data, ['create_time'], ['asc']);
      } else {
        let oo = order === "ascending" ? 'asc' : 'desc';
        let dd = collection.orderBy(this.data, [prop], [oo]);
        this.data = dd;
      }
    },
    clearFilter() {
      this.$refs.dragTable.clearFilter();
    },
    clearSelection() {
      this.$refs.dragTable.clearSelection();
    },
    clearSort() {
      this.$refs.dragTable.clearSort();
    },
    async clearData() {
      this.page = 1;
      this.search = null;
      this.sortsort = null;
      this.sortby = null;
      await this.clearSort();
      await this.clearFilter();
      await this.orderBy();
      await this.loadData();
    },
    getTableHeader() {
      this.tableHeader.splice(0);
      let obj = this.isData.header;
      this.excelDownloadTranslate['sn'] = "序号";
      obj.forEach((i) => {
        if (i["key"] !== 'user_id') {
          this.tableHeader.push({name: i["title"], value: i["key"], pk: i['pk']});
        }
        this.excelDownloadTranslate[i["key"]] = i["title"];
        this.fieldType[i["key"]] = i["widget"];
      });
      let obj_data = this.isData.data;
      this.number = 1;
      for (let item in obj_data) {
        obj_data[item].sn = this.number;
        this.number++;
        for (let i in obj_data[item]) {
          if (this.fieldType[i] === 'number' && obj_data[item][i]) {
            obj_data[item][i] = Number(obj_data[item][i]);
          }
        }
      }

      this.data = obj_data;
      // 可拖拽
      // this.$nextTick(() => {
      //   this.setSortTable();
      // });
    },
    editTable(row, column, cell, event) {
      this.from = {...row};
      this.rowIndex = row.pk;
      this.columnIndex = column.property;
      this.allow_edit = true;
    },
    getCellIndex: function ({row, column, rowIndex, columnIndex}) {
      row.index = rowIndex;
      column.index = columnIndex;
      // row.index = row.pk;
      // column.index = column.id;
    },
    async add() {
      this.loading = true;
      let obj = {template_id: this.tid};
      this.isData.header.forEach((i) => {
        obj[i["key"]] = "";
        if (i["key"] === 'region') {
          obj[i["key"]] = "呼和浩特市";
        }
      });
      obj["user_id"] = this.userinfo.pk;
      const data = await resource.createObj('data', obj);

      for (let i in data) {
        if (this.fieldType[i] === 'number' && data[i]) {
          data[i] = Number(data[i]);
        }
      }
      this.number = this.data.length + 1;
      data.sn = this.number;
      this.data.push({...data});
      this.end_data = [...JSON.parse(JSON.stringify(this.data))];
      // 写日志
      await this.LogEdit(`在${this.isData.title}中新增了一行数据`)
      this.$emit('addRow', obj);
      // await this.loadData();
      await this.orderBy();
      this.page = this.data.length % this.pageSize === 0 ? this.data.length / this.pageSize : Math.ceil(this.data.length / this.pageSize);
      this.loading = false;
    },
    async LogEdit(content) {
      await resource.createObj('systemlog', {
        "log_level": 2,
        "log_type": this.tid,
        "user": this.userinfo.pk,
        "content": content,
        "user_name": this.userinfo.full_name || this.userinfo.username
      });
    },
    endEdit(row, value) {
      if (value === 'region') {
        if (!this.from.region) {
          this.$message.warning("地区不能为空，请填写后提交");
          return;
        }
      }
      this.allow_edit = false;
      this.loading = true;
      this.save(row, value);
      this.loading = false;
    },
    async save(row, value) {
      let obj = {...this.from};
      if (obj[value] && this.fieldType[value] === 'number') {
        obj[value] = Number(obj[value]);
      }
      try {
        obj.user_id=this.userinfo.pk;
        let idx = this.end_data.findIndex((i) => i.pk === obj.pk);
        if (this.end_data[idx][value] !== this.from[value]) {
          await resource.updateObj('data', obj.pk, obj);
          row = {...this.from};
          let key = this.data.findIndex((i) => i.pk === obj.pk);
          this.data[key] = {...this.from};
          this.from = {};
          // 写日志
          await this.LogEdit(`将${this.isData.title}的${obj.pk}行的 ${this.excelDownloadTranslate[value]}(${value}) 由${this.end_data[idx][value]}改为${obj[value]}`)
          this.end_data = [...JSON.parse(JSON.stringify(this.data))];
          this.$message.success("编辑成功！！！");
          this.$emit('saveRow', obj);
          await this.loadData();
        }

      } catch (e) {
        this.$confirm(`当前行数据:${JSON.parse(e.request.response).detail}, 是否继续保存?`, '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning'
        }).then(async () => {
          const data = await resource.createObj('data', obj);
          // 写日志
          await this.LogEdit(`在${this.isData.title}中新增了一行数据`)
          await this.loadData();
        }).catch(async () => {
          await this.loadData();
        });
      }
      // this.sortable({column: null, prop: this.sortby, order: this.sortsort});
    },
    async del(obj) {
      let log_obj = {...obj};
      try {
        await this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        this.loading = true;
        await resource.deleteObj('data', obj.pk,this.$store.state.sys_id ,this.tid);
        delete log_obj.sys_id;
        delete log_obj.org_id;
        delete log_obj.biz_id;
        delete log_obj.src_id;
        delete log_obj.index;
        // 写日志
        await this.LogEdit(`删除了${this.isData.title}中一行数据：${JSON.stringify(log_obj)}`);
        let data = [...this.data];
        data.forEach((i) => {
          if (i.pk === obj.pk) {
            let idx = this.data.indexOf(i);
            this.data.splice(idx, 1);
            this.end_data.splice(idx, 1);
          }
        });
        await this.orderBy();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      } catch (e) {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      } finally {
        this.loading = false;
      }
    },
    getFilter(col) {
      return array.uniq(this.data.map((val) => val[col.value])).map((val) => {
        return {text: val || '空', value: val}
      });
    },
    setSortTable() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      Sortable.create(el, {
        ghostClass: "sortable-ghost",
        animation: 150,
        onEnd: (evt) => {
          const currRow = this.data.splice(evt.oldIndex, 1)[0];
          this.data.splice(evt.newIndex, 0, currRow);
        },
      });
    },
    sortable({column, prop, order}) {
      this.sortsort = order;
      this.sortby = prop;
      if (order === null || prop === null) {
        this.data = collection.sortBy(this.data, ['pk'], ['asc']);
      } else {
        let oo = order === "ascending" ? 'asc' : 'desc';
        let dd = collection.orderBy(this.data, [prop], [oo]);
        this.data = dd;
      }
    },
    async loadData() {
      this.$emit("loadData");
    },
    excelExport() {
      let header = ["序号"];
      for (let item of this.tableHeader) {
        header.push(item.name);
      }

      let tmp = [];
      this.data.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) {
            obj[this.excelDownloadTranslate[key]] = i[key];
          }
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, {header});
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, this.isData.title + "填报信息.xlsx");
    },
    logView() {
      this.$router.push({
        name: "ewtianbao-log",
        params: {tid: this.tid},
      });
    },
    async batchDelDataFn() {
      if (this.batchDelData.length === 0) {
        return this.$message.error("请选择要删除的数据!");
      }
      this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          let querys_array = this.batchDelData.map((i) => i.pk); //data-delete
          let querys = {id: querys_array.join(',')}
          await resource.deleteList(querys, this.tid);
          this.$message.success("批量删除成功!");
          let batchDelData = [...this.batchDelData];
          for (let key in batchDelData) {
            delete batchDelData[key].sys_id;
            delete batchDelData[key].org_id;
            delete batchDelData[key].biz_id;
            delete batchDelData[key].src_id;
            delete batchDelData[key].index;
          }
          // 写日志
          await this.LogEdit(`批量删除了${this.isData.title}中${querys_array.length}行数据：${JSON.stringify(batchDelData)}`);
          let data = [...this.data];
          data.forEach((i, index) => {
            if (querys_array.indexOf(i.pk) > -1) {
              let idx = this.data.indexOf(i);
              let id = this.end_data.indexOf(i);
              this.data.splice(idx, 1);
              this.end_data.splice(id, 1);
            }
          });
          await this.clearSelection();
          await this.orderBy();
        } catch (error) {
        }

      }).catch(() => {

      });


    },
    async submitDHConfigForm() {
      this.configurelDialogVisable = false;
    },
    async submitConfigForm() {
      this.configurelDialogVisable = false;
    },
    async loadTemplate() {
      const resp = await axios.get(`${BASE_HOST}/api/v1/formtemplate/${this.tid}/`);
      let data = resp.data;
      data.remark = JSON.parse(data.remark);
      this.templateData = data;
    },

  },
  async created() {
    await this.loadTemplate();
    await this.getTableHeader();
    // await this.orderBy();
    this.end_data = [...JSON.parse(JSON.stringify(this.data))];
    window.collection = collection;
  },
  directives: {
    focus: {
      inserted: function (el, binding, vnode) {
        el.getElementsByTagName("input")[0].focus();
      },
    },
  },
  watch: {
    isData: {
      handler() {
        this.getTableHeader();
      },
      deep: true,
    },
    // data: {
    //   handler() {
    //     this.getTableHeader();
    //   },
    //   deep: true,
    // },
  },
};
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}

.el-table__column-filter-trigger i {
  color: #909399;
  transform: scale(.75);
  padding: 4px;
  border: 1px solid;
  border-radius: 3px;
}
</style>
