<template>
  <el-card>
    <div>
      <el-button
        type="primary"
        round
        icon="el-icon-plus"
        @click="xinjian"
        >新建题库</el-button
      >
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="正在加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      stripe
      border
      :data="data"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      style="margin-top: 1rem"
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="描述" prop="desc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            round
            icon="el-icon-edit"
            @click="edit(row.pk)"
            :loading="editState"
            >编辑</el-button
          >
          <el-button
            type="warning"
            round
            @click="shiti(row.pk)"
            icon="el-icon-tickets"
            >试题管理</el-button
          >
          <el-popconfirm title="确定删除吗？" @confirm="del(row)">
            <el-button class="deleteButton" type="danger" round slot="reference" icon="el-icon-remove">
              删除</el-button>
          </el-popconfirm>
          <!-- <el-button type="danger" round @click="del(row)" icon="el-icon-remove"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[15, 30, 50, 100, 500, 1000]"
      :page-size="pageSize"
      @size-change="
        (pageSize) => {
          this.page = 1;
          this.pageSize = pageSize;
          this.loadData();
        }
      "
      :current-page.sync="page"
      @current-change="loadData"
      :total="total"
      style="margin-top: 10px"
    ></el-pagination>
    <el-dialog
      title="题库"
      :visible.sync="createDialogVisiable"
      width="30%"
      center
      @closed="clearFormData('form')"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button icon="el-icon-close" @click="createDialogVisiable = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="submitForm('form')"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import resource from "@/resource";
const TMP_ID_TK = "FT138152757582053376"; // 题库
const TMP_ID_ST = "FT138153450912034816"; // 试题
const TMP_ID_JG = "FT336770984361844736"; // 考试结果
import {mapState} from "vuex";
export default {
  name: "TiKu",
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      form: { name: null, desc: null, template_id: TMP_ID_TK },
      filterData: {},
      data: [],
      createDialogVisiable: false,
      rules: {
        name: [{ required: true, message: "请填写题库名称" }],
      },
      loading: false,
      editState: false,
    };
  },
  computed:{
    ...mapState(["userinfo",'quanxian'])
  },
  methods: {
    xinjian(){
      if(!this.quanxian.扫码答题考试 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.createDialogVisiable = true;
      }
    },
    // 加载题库
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.tiku_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_TK,
      };
      let res = await resource.getList("data", params);
      this.total = res.count;
      this.data = res.data;
      this.loading = false;
    },
    // 添加题库
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            ...this.form,
            biz_id: this.$bizCode.tiku_biz,
            src_id: this.$sourceCode.source_id,
          };
          if (data.pk) {
            await resource.updateObj("data", data.pk, data);
            this.$message.success("编辑成功!");
          } else {
            await resource.createObj("data", data);
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
    // 删除题库
    async del(row) {
      try {
        // await this.$confirm("是否确定删除? 此操作不可恢复!");
        try {
          await resource.deleteList(
            {
              pk: row.pk,
            },
            row.template_id
          );
          await resource.deleteList(
            {
              tiku_id: row.pk,
            },
            TMP_ID_ST
          );
          await resource.deleteList(
            {
              shiti_id: row.pk,
            },
            TMP_ID_JG
          );
          this.$message.success("删除成功!");
          await this.loadData();
        } catch (e) {
          this.$message.error("删除失败!");
        }
      } catch (e) {
        this.$message.info("取消删除");
      }
    },
    // 跳转试题
    shiti(pk) {
      this.$router.push({
        name: "tikushiti",
        params: { id: pk, dtype: "tiku" },
      });
    },
    // 清除数据表
    clearFormData(formName) {
      this.form = {
        name: null,
        desc: null,
        template_id: TMP_ID_TK,
      };
      this.$refs[formName].resetFields();
    },
    // 编辑
    async edit(pk) {
      this.editState = true;
      let params = {
        biz_id: this.$bizCode.tiku_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_TK,
      };
      let res = await resource.getObj("data", pk, params);
      this.form = res;
      this.createDialogVisiable = true;
      this.editState = false;
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style scoped>
.score-label {
  margin-left: 10px;
  margin-right: 10px;
}
.deleteButton{
 margin-left: 6px;
}
</style>
