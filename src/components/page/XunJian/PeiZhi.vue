<template>
  <el-card>
    <div>
      <el-form inline>
        <el-form-item>
          <el-button
            type="primary"
            @click="createDialogVisiable = true"
            round
            icon="el-icon-plus"
            >新建配置</el-button
          >
        </el-form-item>
        <el-form-item label="配置名称">
          <el-input v-model="filterData.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      stripe
      border
      :data="data"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      style="margin-top: 1rem"
    >
      <el-table-column label="设备名称" prop="name"></el-table-column>
      <el-table-column label="开始时间" prop="start_time"></el-table-column>
      <el-table-column label="结束时间" prop="end_time"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" icon="el-icon-edit" round @click="edit(row)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-remove" round @click="del(row.pk)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, sizes, total"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="loadData"
      @size-change="loadData"
      :hide-on-single-page="false"
      :total="total"
      style="margin-top: 20px"
    ></el-pagination>
    <el-dialog
      title="表单"
      :visible.sync="createDialogVisiable"
      width="480px"
      center
      @closed="clearFormData('form')"
    >
      <el-form :model="form" ref="form" label-width="110px">
        <el-form-item
          prop="name"
          label="配置名称"
          :rules="[{ required: true, message: '请填写配置名称' }]"
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="form.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="form.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="巡检周期">
          <el-select v-model="form.zhouqi" placeholder="请选择填报类型">
            <el-option label="小时" value="小时"></el-option>
            <el-option label="日" value="日"></el-option>
            <el-option label="周" value="周"></el-option>
            <el-option label="月" value="月"></el-option>
            <el-option label="季度" value="季度"></el-option>
            <el-option label="年" value="年"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检项目">
          <el-tag
            :key="tag"
            v-for="tag in form.json"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput"
            >添加项目</el-button
          >
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button icon="el-icon-close" @click="createDialogVisiable = false"
          >取消</el-button
        >
        <el-button type="primary" icon="el-icon-check" @click="submitForm('form')"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import resource from "@/resource";
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        start_time: null,
        end_time: null,
        name: null,
        json: [],
        template: "69f6bfa8-73ee-4efc-bef5-8eb2291c88ec",
      },
      filterData: { name: null },
      data: [],
      createDialogVisiable: false,
      inputValue: "",
      inputVisible: false,
    };
  },
  methods: {
    // 加载列表
    async loadData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
      };
      let res = await resource.getList("xunjianm-conf", params);
      // console.log(res)
      this.total = res.count;
      this.data = res.data;
    },
    // 提交
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = this.form;
          if (data.pk) {
            await resource.updateObj("xunjianm-conf", this.form.pk, data);
            this.$message.success("编辑成功!");
          } else {
            await resource.createObj("xunjianm-conf", data);
            this.$message.success("新建成功!");
          }
          this.createDialogVisiable = false;
          this.loadData();
        } else {
          this.$message.error("请检查所填项!");
          return false;
        }
      });
    },
    // 删除
    del(pk) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await resource.deleteObj("xunjianm-conf", pk);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          setTimeout(() => {
            this.loadData();
          }, 200);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 搜索
    async search() {
      let params = {};
      let check = Object.prototype.toString;
      for (const key in this.filterData) {
        if (check.call(this.filterData[key]) === "[object Array]") {
          params[key + "_before"] = this.filterData[key][0];
          params[key + "_after"] = this.filterData[key][1];
        } else {
          params[key] = this.filterData[key];
        }
      }
      let res = await this.$http.get("/xunjianm-conf/", { params });
      this.data = res.data;
    },

    clearFormData(formName) {
      this.form = {
        start_time: null,
        end_time: null,
        name: null,
        json: [],
        template: "69f6bfa8-73ee-4efc-bef5-8eb2291c88ec",
      };
      this.$refs[formName].resetFields();
    },
    // 编辑
    edit(obj) {
      this.form = { ...obj };
      this.createDialogVisiable = true;
    },

    // 自定义标签
    handleClose(tag) {
      this.form.json.splice(this.form.json.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.json.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
  async mounted() {
    await this.loadData();
  },
  created() {},
};
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
