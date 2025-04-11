<template>
  <div class="BuMenRenYuanGuanLi">
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card v-loading="loading">
            <div style="margin-bottom: 10px">
              <el-button
                  type="primary"
                  icon="el-icon-circle-plus-outline"
                  round
                  @click="newdepartment"
                  class="ln-yellow"
              >
                新增顶级部门
              </el-button>
              <el-button
                  v-if="is_collapse"
                  type="info"
                  icon="el-icon-minus"
                  round
                  @click="toggleCollapse"
                  class="ln-yellow"
              >
                全部收起
              </el-button>
              <el-button
                  v-else
                  type="info"
                  icon="el-icon-plus"
                  round
                  @click="toggleCollapse"
                  class="ln-yellow"
              >
                全部展开
              </el-button>
            </div>
            <div class="block">
              <el-tree
                  :data="data"
                  node-key="pk"
                  ref="selectTree"
                  :props="{ children: 'items', label: 'name' }"
                  default-expand-all
                  :expand-on-click-node="false"
                  :draggable="true"
                  @node-drop="movenode"
              >
                <span class="custom-tree-node" slot-scope="{ data }">
                  <span>{{ data.name }}</span>
                  <span style="text-align: center">
                    <el-button
                        type="text"
                        size="small"
                        @click="child_add_department(data.pk)"
                        style="margin: 0 10px"
                    >
                      增加子部门
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="update_department(data)"
                        style="margin: 0 10px"
                    >
                      编辑
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        v-if="data.parent"
                        @click="delete_department(data)"
                        style="margin: 0 10px"
                    >
                      删除
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="view_department(data)"
                        style="margin: 0 10px"
                    >
                      查看
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="user_list(data)"
                        style="margin: 0 10px"
                    >
                      人员
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <ZGGL :department_id="dep_id"></ZGGL>
        </el-col>
      </el-row>
      <!--新增部门-->
      <el-dialog title="新增部门" :visible.sync="add_department" width="30%">
        <el-form
            :model="department_form"
            :rules="rules"
            ref="createForm"
            label-width="100px"
        >
          <el-form-item label="部门名称：" prop="name">
            <el-input
                v-model="department_form.name"
                autocomplete="off"
                style="width: 60%"
                placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input
                v-model="department_form.contact_name"
                autocomplete="off"
                style="width: 60%"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input
                v-model="department_form.contact_mobile"
                autocomplete="off"
                style="width: 60%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="add_department = false" class="ln-button" round
          >取 消
          </el-button
          >
          <el-button
              type="primary"
              @click="department_add"
              class="ln-button"
              round
          >确 定
          </el-button
          >
        </div>
      </el-dialog>
      <!--查看部门-->
      <el-dialog
          title="查看部门信息"
          :visible.sync="departmentView"
          width="30%"
      >
        <el-form :model="departmentView_list" label-width="100px">
          <el-form-item label="部门名称：" prop="name">
            {{ departmentView_list.name }}
          </el-form-item>
          <el-form-item label="联系人：">
            {{ departmentView_list.contact_name }}
          </el-form-item>
          <el-form-item label="手机号：">
            {{ departmentView_list.contact_mobile }}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="departmentView = false" class="ln-button" round
          >关 闭
          </el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ZGGL from './ZhiGongGuanLi/ZGGuanLi.vue';

export default {
  name: 'BuMenRenYuanGL',
  components: {
    ZGGL
  },
  computed: {
    ...mapState(['org_id'])
  },
  data() {
    return {
      is_collapse: true,
      loading: false,
      data: [],
      add_department: false,
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'change' }
        ]
      },
      department_form: {
        name: '',
        category: 'moren',
        contact_name: '',
        contact_mobile: ''
      },
      departmentView: false,
      dep_id: null,
      departmentView_list: {
        name: '',
        category: 'moren',
        contact_name: '',
        contact_mobile: ''
      }
    };
  },
  methods: {
    async loadData() {
      this.loading = true;
      let params = {
        org_id: this.org_id,
        // biz_id: this.$bizCode.zhigong_biz_id,
        // source_id: this.$sourceCode.source_id

      };
      // 加载数据列表及刷新
      try {
        this.data = await resource.getList('department', params);
      } catch (err) {
        this.$message.error({ message: '数据获取失败！！', center: true });
      } finally {
        this.loading = false;
      }
    },

    form_clean() {
      // 还原from表单
      this.department_form = {
        org_id: this.org_id,
        name: '',
        parent: '',
        category: 'moren',
        contact_name: '',
        contact_mobile: ''
      };
    },
    // 新增顶级部门
    newdepartment() {
      this.add_department = true;
    },
    async department_add() {
      // 新增部门
      let valid = await new Promise((resolve, reject) => {
        this.$refs.createForm.validate((valid) => resolve(valid));
      });
      if (valid) {
        if (this.department_form.pk) {
          try {
            await resource.patchObj('department', this.department_form.pk, this.department_form);
          } catch (e) {
            this.$message.error({ message: '编辑失败，请重试！！', center: true });
          }
        } else {
          try {
            await resource.createObj('department', this.department_form);
          } catch (e) {
            this.$message.error({ message: '数据获取失败！！', center: true });
          }
        }
        this.loadData();
        this.form_clean();
        this.add_department = false;
      } else {
        this.$message.error('请填写完整信息后提交');
        return false;
      }
    },
    child_add_department(pk) {
      // 新增子部门
      this.add_department = true;
      this.department_form = {};
      this.department_form.parent = pk;
    },

    update_department(data) {
      // 编辑部门
      this.department_form = { ...data };
      this.add_department = true;
    },

    async delete_department(data) {
      try{
        await this.$confirm(
            '此操作将永久删除 "' + data.name + '" 及所属部门, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        );
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        return;
      }
      try {
        await resource.deleteObj('department', data.pk);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.loadData();
      } catch (e) {
        this.$message.error({ message: '删除失败！！', center: true });
      }
    },

    view_department(data) {
      this.departmentView = true;
      this.departmentView_list = { ...data };
    },
    user_list(data) {
      this.dep_id = data.pk;
    },
    movenode(node, target, position, event) {
      let pos = '';
      switch (position) {
        case 'before':
          pos = 'left';
          break;
        case 'after':
          pos = 'right';
          break;
        case 'inner':
          pos = 'first-child';
          break;
      }
      let params = {
        department: node.data.pk,
        target: target.data.pk,
        position: pos
      };
      resource.createObj('departmentmove', params);
    },
    toggleCollapse() {
      this.is_collapse = !this.is_collapse;
      let treeList = this.data;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.selectTree.store.nodesMap[treeList[i].pk].expanded =
            this.is_collapse;
      }
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>


<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
