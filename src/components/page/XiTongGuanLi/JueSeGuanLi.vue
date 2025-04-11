<template>
  <div class="JueSeGuanLi">
    <el-card>
      <div style="margin: 15px;">
        <div class="head-line">
          <h2 class="el-icon-s-grid">角色管理</h2>
          <el-button type="primary" @click="newGroup" icon="el-icon-plus">新建角色</el-button>
        </div>
        <el-table :data="data" style="margin-top: 20px" v-loading="loading" border>
          <el-table-column type="index" label="#" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="角色名称" width="200" align="center"></el-table-column>
          <el-table-column label="权限" width="400" align="center">
            <template slot-scope="scope">
              <span v-for="p in scope.row.permissions_name">{{p}}&nbsp;</span>
            </template>
          </el-table-column>
          <el-table-column label="用户数量" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.user.length}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" @click="editFuncGroup(scope.row.pk)">编辑</el-button>
              <el-button type="danger" @click="deleteGroup(scope.row.pk)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :hide-on-single-page="true"
          :total="total"
          :current-page.sync="page"
          :page-size="pageSize"
          @current-change="loadData"
          layout="prev, pager, next">
        </el-pagination>
      </div>
    </el-card>
    <JueSeGuanLiEdit v-if="showEditDialog" :pk="editPK" :show-dialog="showEditDialog"
                     @close="closeEditDialog"></JueSeGuanLiEdit>
  </div>
</template>

<script>
import JueSeGuanLiEdit from './JueSeGuanLiEdit';

export default {
  name: 'JueSeGuanLi',
  components: { JueSeGuanLiEdit },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      loading: false,
      showEditDialog: false,
      editPK: null
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$http.get('/group/', { params: { page: this.page, pageSize: this.pageSize } }).then((resp) => {
        this.data = resp.data.data;
        this.total = resp.data.count;
        this.loading = false;
      });
    },
    editFuncGroup(pk) {
      this.editPK = pk;
      this.showEditDialog = true;
    },
    closeEditDialog(status) {
      this.showEditDialog = false;
      if (status === 'success') {
        this.loadData();
      }
    },
    newGroup() {
      this.editPK = null;
      this.showEditDialog = true;
    },
    deleteGroup(pk) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/group/${pk}/`).then(() => {
          this.$message.success('成功');
          this.loadData();
        }).catch(() => {
          this.$message.error('删除失败');
        });
      }).catch(() => {
        this.$message.success('已取消');
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
.JueSeGuanLi .head-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>