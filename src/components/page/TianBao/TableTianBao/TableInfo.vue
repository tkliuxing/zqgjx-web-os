<template>
  <el-card class="box-card">
    <el-form inline>
      <el-form-item>
        <el-button
          type="info"
          round
          icon="el-icon-arrow-left"
          @click="$router.replace({ name: 'tianbao-table' })"
          >返回
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="hanglist" stripe border style="width: 100%">
      <el-table-column prop="len_name" label="项目"></el-table-column>
      <template v-for="item in form.field">
        <el-table-column prop="" :label="item.col_title" :key="item.pk">
        </el-table-column>
      </template>
      <el-table-column align="right" min-width="120">
        <template slot="header">
          <el-button round type="primary" icon="el-icon-plus" @click="addform()"
            >编辑列选项</el-button
          >
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            round
            icon="el-icon-remove"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button
      style="margin-top: 10px"
      round
      type="primary"
      icon="el-icon-plus"
      @click="createDialogVisiable = true"
      >添加行选项</el-button
    >
    <el-dialog
      :visible.sync="dialogVisiableform"
      title="表单"
      top="3vh"
      width="1000px"
      @closed="updateValue = [{ field: [] }]"
    >
      <table-item
        v-if="dialogVisiableform"
        :updateForm="updateValue"
        @close="(status) => (this.dialogVisiableform = status)"
        @loadData="getinfo"
      />
    </el-dialog>

    <el-dialog
      title="表单"
      :visible.sync="createDialogVisiable"
      width="480px"
      center
      @closed="clearFormData()"
    >
      <el-form label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="xiangmu_name" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button icon="el-icon-close" @click="createDialogVisiable = false"
          >取消</el-button
        >
        <el-button type="primary" icon="el-icon-check" @click="addTableLine()"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import resource from "@/resource";
import TableItem from "./TableItem";
export default {
  data() {
    return {
      form: {
        col_title: null,
        in_filter: null,
        is_required: null,
        widget:"input",
        sort_num: null,
        bgtb_id:null,
      },
      table_lines: [],
      dialogVisiableform: false,
      createDialogVisiable: false,
      updateValue: null,
      xiangmu_name: null,
      hanglist: null,
      sort_num: null,
      col_title: null,
      widget: "input",
      is_required:false,
      in_filter:false,
      template_id:"FT182699245302837248"
    };
  },
  created() {
    if (this.$route.query.pk) {
      this.pk = this.$route.query.pk;
      this.getinfo();
    }
  },
  methods: {
    // 获取数据
    async getinfo() {
      let params= {
         template_id:"FT182699245302837248"
      }
      // data.xiangmu_name = this.xiangmu_name
      const resp = await resource.getList("data",params);
      if (typeof resp.template == "string") {
        resp.template = JSON.parse(resp.template);
      }
      if (typeof resp.table_lines == "string") {
        resp.table_lines = JSON.parse(resp.table_lines);
      }
      if (resp.table_lines == null) {
        resp.table_lines = [];
      }
      this.form = resp;
      let newArr = resp.table_lines.map((item) => ({
        len_name: item,
      }));
      this.hanglist = newArr;
    },
    // 添加行头
    async addTableLine() {
      this.data.table_lines.push(this.xiangmu_name);
      let data = {
        table_lines: JSON.stringify(this.data.table_lines),
        title: this.form.title,
        template_id:"FT182699245302837248",
      };
      const resp = await resource.createObj("data",  data);
      this.createDialogVisiable = false;
      this.getinfo();
    },
    // 清除数据
    clearFormData() {
      this.xiangmu_name = "";
    },
    // 添加列表
    addform() {
      this.updateValue = this.form;
      this.dialogVisiableform = true;
    },
    //删除行
    async handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm("删除不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.form.table_lines.splice(index, 1);
          let data = {
            table_lines: JSON.stringify(this.data.table_lines),
            title: this.form.title,
          };
          const resp = await resource.updateObj(
            "data",
            this.form.pk,
            data
          );
          this.getinfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  components: {
    TableItem,
  },
};
</script>

<style scoped></style>
