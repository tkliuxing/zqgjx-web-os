<template>
  <div class="contract">
    <el-card>
      <div style="margin-bottom: 10px">
        <el-button type="primary" round @click="xinzengrenyuan = true"
          ><i class="el-icon-plus"></i><span>新增用户</span></el-button
        >
      </div>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        stripe
        border
      >
        <el-table-column
          prop="username"
          label="用户名"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="full_name"
          label="姓名"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="operation"
          label="操 作"
          width="260"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              round
              class="ln-xiangqing"
              @click="bianji_xinzengrenyuan(scope.row)"
              >编辑
            </el-button>
            <el-button
              v-if="scope.row.is_active"
              size="mini"
              type="warning"
              round
              @click="toggleActive(scope.row)"
              >禁用</el-button
            >
            <el-button
              v-else
              size="mini"
              type="success"
              round
              @click="toggleActive(scope.row)"
              >启用</el-button
            >
            <el-button
              size="mini"
              type="danger"
              round
              @click="delete_xinzengrenyuan(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next, sizes, total"
        :page-size="config.params.pageSize"
        :current-page="config.params.page"
        :total="zongshu"
        @current-change="pageChange"
      >
      </el-pagination>
    </el-card>
    <!--新增用户-->
    <el-dialog
      title="新增用户"
      :visible.sync="xinzengrenyuan"
      width="50%"
      :close-on-click-modal="false"
      top="3vh"
      @closed="type = '基本信息'"
    >
      <el-tabs v-model="type" type="card" v-if="xinzengrenyuan">
<!--        <el-tab-pane label="基本信息" name="基本信息">-->
          <el-form
            :model="xinzeng_form"
            :rules="rules"
            ref="createForm"
            label-width="100px"
          >
            <el-form-item label="当前部门：">
              {{ department.name }}
            </el-form-item>
            <el-form-item label="用户名：" prop="username">
              <el-input
                v-model="xinzeng_form.username"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input
                v-model="xinzeng_form.password"
                show-password
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="checkpassword">
              <el-input
                v-model="xinzeng_form.checkpassword"
                show-password
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="full_name">
              <el-input
                v-model="xinzeng_form.full_name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input
                v-model="xinzeng_form.mobile"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="角色：">
              <el-select
                v-model="xinzeng_form.func_groups"
                multiple
                placeholder="请选择当前角色"
              >
                <el-option
                  v-for="item in group"
                  :key="item.pk"
                  :label="item.name"
                  :value="item.pk"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
<!--        </el-tab-pane>-->
<!--        <el-tab-pane label="其他信息" name="其他信息">-->
<!--          <QTINFO @customer="customers"></QTINFO>-->
<!--        </el-tab-pane>-->
      </el-tabs>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="xinzengrenyuan = false" class="ln-button" round
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="add_xinzengrenyuan"
          class="ln-button"
          round
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--编辑用户-->
    <el-dialog
      title="编辑用户"
      :visible.sync="bianji_renyuan"
      width="50%"
      :close-on-click-modal="false"
      @closed="type = '基本信息'"
    >
      <el-tabs v-model="type" type="card" v-if="bianji_renyuan">
<!--        <el-tab-pane label="基本信息" name="基本信息">-->
          <el-form
            :model="bianji_form"
            :rules="rules"
            ref="edtForm"
            label-width="100px"
          >
            <el-form-item label="当前部门：">
              <el-select v-model="bianji_form.department" placeholder="请选择">
                <el-option
                  v-for="item in dep_array"
                  :key="item.pk"
                  :label="item.name"
                  :value="item.pk"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名：" prop="username">
              <el-input
                v-model="bianji_form.username"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input
                v-model="bianji_form.password"
                show-password
                placeholder="非修改密码可不填写"
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="full_name">
              <el-input
                v-model="bianji_form.full_name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input
                v-model="bianji_form.mobile"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="角色：">
              <el-select
                v-model="bianji_form.func_groups"
                multiple
                placeholder="请选择当前角色"
              >
                <el-option
                  v-for="item in group"
                  :key="item.pk"
                  :label="item.name"
                  :value="item.pk"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
<!--        </el-tab-pane>-->
<!--        <el-tab-pane label="其他信息" name="其他信息">-->
<!--          <QTINFO @customer="customers" :cusinfo="customerinfo"></QTINFO>-->
<!--        </el-tab-pane>-->
      </el-tabs>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="bianji_renyuan = false" class="ln-button" round
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="edt_xinzengrenyuan"
          class="ln-button"
          round
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import QTINFO from "./QiTaInfo.vue";

export default {
  name: "contract",
  components: {
    QTINFO,
  },
  computed: {
    ...mapState(["org_id"]),
  },
  props: {
    department_id: {
      type: String,
    },
    customer: {
      type: Object,
    },
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.xinzeng_form.password !== "") {
          this.$refs.createForm.validateField("checkpassword");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.xinzeng_form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      type: "基本信息",
      options: [
        {
          value: "男",
          label: "男",
        },
        {
          value: "女",
          label: "女",
        },
      ],
      bianji_renyuan: false,
      bianji_form: {
        org_id: null,
        username: "",
        password: "",
        full_name: "",
        department: "",
        mobile: "",
        is_active: true,
        func_groups: [],
        customer: {},
      },
      xinzengrenyuan: false,
      xinzeng_form: {
        org_id: "",
        username: "",
        password: "",
        checkpassword: "",
        full_name: "",
        department: "",
        mobile: "",
        is_active: true,
        func_groups: [],
        customer: {},
      },
      rules: {
        username: [{ required: true, message: "请输入用户名" }],
        full_name: [{ required: true, message: "请输入姓名" }],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        checkpassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
      rulesCustomer: {
        "customer.birthday": [{ required: true, message: "请选择出生日期" }],
      },
      tableData: [],
      department: {},
      zongshu: 0,
      next: false,
      previous: false,
      config: {
        params: {
          department: "",
          page: 1, //当前页码
          pageSize: 15, //当前页显示条数
        },
      },
      group: [],
      dep_array: [],
      source: {
        nation: [],
        politicsstatus: [],
        education_list: [],
        academic_degreelist: [],
      },
      customerinfo: {},
    };
  },
  methods: {
    async groupData() {
      this.loading = true;
      this.group = await this.$resource.getList('group');
    },
    //清空当前新增表单（初始化表单）
    xinzeng_clean() {
      this.xinzeng_form = {
        org_id: this.org_id,
        username: "",
        password: "",
        checkpassword: "",
        full_name: "",
        department: "",
        mobile: "",
        is_active: true,
        func_groups: [],
        customer: {},
      };
    },
    async loadData() {
      let params = {
        org_id: this.org_id,
      };
      if (this.department_id) {
        this.department = await this.$resource.getObj('department', this.department_id);
      } else {
        this.department = {
          name: "",
        };
      }
      this.dep_array = await this.$resource.getList('flatdepartment', params);
      let resp = await this.$resource.getList("user", this.config.params);
      this.tableData = resp.data;
      this.zongshu = resp.count;
      this.next = resp.next;
      this.previous = resp.previous;
    },
    //当前页码发生变化时触发的事件
    pageChange(page) {
      this.config.params.page = page;
      this.loadData();
    },
    //新增单条数据的方法
    async add_xinzengrenyuan() {
      let valid = await new Promise((resolve) =>
        this.$refs.createForm.validate((validate) => resolve(validate))
      );
      if (valid) {
        this.xinzeng_form.department = this.department.pk;
        try {
          let res = await this.$resource.createObj("user", this.xinzeng_form);
          // await this.$resource.createObj("data", {
          //   template_id: this.CVARS.TMPL_ID.ZGGL_TMPL_ID,
          //   ...this.xinzeng_form.customer,
          //   user_id: res.pk,
          // });
          this.xinzengrenyuan = false;
          this.$message.success({ message: "添加成功！！", center: true });
          this.loadData();
          this.xinzeng_clean();
        } catch (error) {}
      } else {
        this.$message.error("请填写完整信息后提交");
        return false;
      }
    },
    async toggleActive(data) {
      let params = {
        is_active: !data.is_active,
      };
      console.log(data,'22')
      try {
        await this.$http.patch("/user/" + data.pk + "/", params);
        data.is_active = !data.is_active;
      } catch (e) {
        this.$message.error(e);
      }
    },
    //点击编辑按钮事件的方法↓
    async bianji_xinzengrenyuan(data) {
      console.log(data);
      this.bianji_renyuan = true;
      let params = {
        ...data,
      };
      this.bianji_form = params;
      // this.customerinfo = params.customer;
    },
    //编辑弹窗内容的方法↓
    async edt_xinzengrenyuan() {
      let valid = await new Promise((resolve) =>
        this.$refs.edtForm.validate((validate) => resolve(validate))
      );
      console.log(this.bianji_form,'222')
      if (valid) {
        try {
          let res = await this.$resource.updateObj(
            "user",
            this.bianji_form.pk,
            this.bianji_form
          );
          // await this.$resource.updateObj("data", this.bianji_form.customer.pk, {
          //   template_id: this.CVARS.TMPL_ID.ZGGL_TMPL_ID,
          //   ...this.bianji_form.customer,
          //   user_id: res.pk,
          // });
          this.$message.success({ message: "编辑成功！！", center: true });
          this.bianji_form = {};
          this.loadData();
          this.bianji_renyuan = false;
        } catch (error) {}
      } else {
        this.$message.error("请填写完整信息后提交");
        return false;
      }
    },
    //删除当前单条数据内容的方法↓
    delete_xinzengrenyuan(data) {
      this.$confirm("此操作将永久删除该用户 , 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .delete("/user/" + data.pk + "/", { params: { real: "True" } })
            .then((resp) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.loadData();
            })
            .catch((err) => {
              this.$message.error({ message: "删除失败！！", center: true });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    customers(val) {
      this.xinzeng_form.customer = val;
      this.bianji_form.customer = val;
    },
  },
  mounted() {
    // 先获取上一级页面传过来的部门信息
    // this.config.params.department = this.$route.params.pk;
    this.config.params.department = this.department_id;
    this.xinzeng_clean();
    this.loadData();
    this.groupData();
    // this.getNational();
    // this.getPoliticsstatus();
    // this.getDegree();
    // this.getAcademicdegree()
  },
  watch: {
    async department_id(val) {
      this.config.params.page = 1;
      this.config.params.department = val;
      await this.loadData();
    },
  },
};
</script>

<style scoped>
.hover-rotate {
  transition: all 500ms;
}

.hover-rotate:hover {
  transform: rotate(360deg);
}

.el-icon-folder-add span {
  display: block;
  margin-left: 3px;
}

.ln-yellow {
  background: #ff9900;
  border-color: #ff9900;
}
</style>
