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
      <el-button v-if="editable" type="primary" round icon="el-icon-plus" @click="add"
        >添加</el-button
      >
      <div style="text-align: center">
        {{ this.isData.title }}
      </div>
    </div>
    <el-table
      :id="isData.id"
      ref="dragTable"
      :data="data"
      border
      stripe
      row-key="index"
      highlight-current-row
      :header-cell-style="{ 'text-align': 'center' }"
      :row-style="{ height: '50px' }"
      :cell-style="{ 'text-align': 'center' }"
      :cell-class-name="getCellIndex"
      max-height="550"
      style="margin-top: 20px"
      @cell-dblclick="editTable"
      @cell-mouse-enter="showBtn"
      @cell-mouse-leave="hideBtn"
      @sort-change="sortable"
    >
      <el-table-column
        v-for="(item, index) in tableHeader"
        :label="item.name"
        :key="index"
        sortable
        :prop="`${item['value']}`"
      >
        <template slot-scope="scope">
          <el-input
            v-if="
              scope.row.index === rowIndex &&
              scope.column.index === columnIndex &&
              allow_edit
            "
            v-focus
            v-model.number="scope.row[item.value]"
            @blur="allow_edit = false"
          />
          <span v-else>{{ scope.row[item.value] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isData.boxplotData && editable" label="操作" width="70">
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
  </div>
</template>

<script>
import Sortable from "sortablejs";
import XLSX from "xlsx";
export default {
  name: "",
  props: {
    isData: {
      type: Object,
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableHeader: [],
      data: [],
      allow_edit: false,
      rowIndex: null,
      columnIndex: null,
      hoverIndex: null,
    };
  },
  methods: {
    showBtn(row, column, cell, event) {
      this.hoverIndex = parseInt(row.index);
    },
    hideBtn(row, column, cell, event) {
      this.hoverIndex = null;
    },
    getTableHeader() {
      this.tableHeader.splice(0);
      let obj = this.isData.header;
      obj.forEach((i) => {
        this.tableHeader.push({ name: i["title"], value: i["key"] });
      });
      this.data = this.isData.data;
      this.$nextTick(() => {
        this.setSortTable();
      });
    },
    editTable(row, column, cell, event) {
      (this.rowIndex = row.index), (this.columnIndex = column.index);
      this.allow_edit = true;
    },
    getCellIndex: function ({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex;
      column.index = columnIndex;
    },
    add() {
      let obj = {};
      this.isData.header.forEach((i) => {
        obj[i["key"]] = "";
      });
      this.data.unshift({ ...obj });
    },
    del(obj) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.isData.data.forEach((i) => {
            if (i.index === obj.index) {
              let idx = this.isData.data.indexOf(i);
              this.isData.data.splice(idx, 1);
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
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
    sortable({ column, prop, order }) {
      this.data = this.data.sort((a, b) => {
        if (order === "ascending") {
          if (typeof a[prop] === "string") {
            return b[prop].localeCompare(a[prop]);
          } else {
            return a[prop] - b[prop];
          }
        } else if (order === "descending") {
          if (typeof a[prop] === "string") {
            return a[prop].localeCompare(b[prop]);
          } else {
            return b[prop] - a[prop];
          }
        }
      });
    },
    registerEvent() {
      this.$bus.$on("report", this.getEchats);
    },
    getEchats() {
      let exportTable = XLSX.utils.table_to_sheet(
        document.getElementById(this.isData.id),
        {
          raw: true,
        }
      );
      console.log(exportTable)
      this.$bus.$emit("exportTableData", {
        sheetName: this.isData.title,
        data: exportTable,
      });
    },
  },
  created() {
    this.getTableHeader();
    this.registerEvent();
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
    data: {
      handler() {
        this.getTableHeader();
      },
      deep: true,
    },
  },
};
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
