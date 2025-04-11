<template>
  <div class="contract">
    <el-card>
      <el-form inline>
        <el-form-item>
          <el-button type="info" round @click="$router.go(-1)">
            <i class="el-icon-arrow-left"></i><span>返回</span>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="xinzengrenyuan = true">
            <i class="el-icon-plus"></i><span>新增用户</span>
          </el-button>
        </el-form-item>
        <el-form-item>
          <uploadexl
              class="up-loade"
              :formTable="formTable"
              :textTable="textTable"
              @getTableList="getTableList"
          ></uploadexl>
        </el-form-item>
        <el-form-item>
          <el-button
              style="margin-left: 10px"
              round
              type="warning"
              @click="downTemplate"
              icon="el-icon-download"
          >下载模版
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column
            prop="full_name"
            label="姓名"

        ></el-table-column>
        <!--        <el-table-column prop="sex" label="性别" align="center"></el-table-column>-->
        <el-table-column
            prop="username"
            label="用户名"
            width="200"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="mobile"
            label="手机号"
            width="200"
            align="center"
        ></el-table-column>
        <el-table-column prop="description" label="备注" align="center"></el-table-column>
        <el-table-column prop="operation" label="操 作" width="260" align="center">
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
                type="danger"
                round
                @click="toggleActive(scope.row)"
            >禁用
            </el-button
            >
            <el-button
                v-else
                size="mini"
                type="success"
                round
                @click="toggleActive(scope.row)"
            >启用
            </el-button
            >
            <el-button
                size="mini"
                type="danger"
                round
                @click="delete_xinzengrenyuan(scope.row)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="prev, pager, next"
          :page-size="config.params.pageSize"
          :current-page="config.params.page"
          :total="zongshu"
          :hide-on-single-page="true"
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
    >
      <el-form :model="xinzeng_form" :rules="rules" ref="createForm" label-width="100px">
        <el-form-item label="当前部门：">
          {{ department.name }}
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="xinzeng_form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password" >
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
          <el-input v-model="xinzeng_form.full_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="xinzeng_form.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <!--        <el-form-item label="性别：">-->
        <!--          <el-select v-model="xinzeng_form.sex" placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="item in options"-->
        <!--              :key="item.value"-->
        <!--              :label="item.label"-->
        <!--              :value="item.value"-->
        <!--            >-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
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
        <el-form-item label="备注：">
          <el-input
              type="textarea"
              v-model="xinzeng_form.description"
              autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="xinzengrenyuan = false" class="ln-button" round>取 消</el-button>
        <el-button type="primary" @click="add_xinzengrenyuan" class="ln-button" round>确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑用户-->
    <el-dialog
        title="编辑用户"
        :visible.sync="bianji_renyuan"
        width="50%"
        :close-on-click-modal="false"
    >
      <el-form :model="bianji_form" :rules="rules" ref="edtForm" label-width="100px">
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
          <el-input v-model="bianji_form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input
              v-model="bianji_form.password"
              show-password
              placeholder="非修改密码可不填写"
          ></el-input>
        </el-form-item>

        <el-form-item label="姓名：" prop="full_name">
          <el-input v-model="bianji_form.full_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="bianji_form.mobile" autocomplete="off"></el-input>
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
        <el-form-item label="备注：">
          <el-input
              type="textarea"
              v-model="bianji_form.description"
              autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="bianji_renyuan = false" class="ln-button" round
        >取 消
        </el-button
        >
        <el-button type="primary" @click="edt_xinzengrenyuan" class="ln-button" round
        >确 定
        </el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import moment from "moment/moment";
import resource from "@/resource";
import Uploadexl from "@/components/common/HxUploadExl.vue";

export default {
  name: "contract",
  computed: {
    ...mapState(["org_id", "sys_id", "httpurl"]),
  },
  components: {
    Uploadexl,
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
        sex: "",
        is_active: true,
        func_groups: [],
        description: "",
      },
      xinzengrenyuan: false,
      xinzeng_form: {
        org_id: null,
        username: "",
        password: "",
        checkpassword: "",
        full_name: "",
        department: "",
        mobile: "",
        sex: "",
        is_active: true,
        func_groups: [],
        description: "",
      },
      rules: {
        username: [{required: true, message: "请输入用户名", trigger: "change"}],
        full_name: [{required: true, message: "请输入姓名", trigger: "change"}],
        mobile: [{required: true, "pattern":"(^(\\d{3,4}-)?\\d{7,8})$|(1[3|5|7|8]\\d{9})",message: "请输入正确的手机号码或固定电话", trigger: "blur"}],
        password: [{required: true,validator: validatePass, trigger: "blur"}],
        checkpassword: [{required: true,validator: validatePass2, trigger: "blur"}],
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
      formTable: [
        "username",
        "full_name",
        "mobile",
        "description",
      ],
      textTable: [
        "用户名",
        "姓名",
        "联系方式",
        "备注"
      ],
    };
  },
  methods: {
    groupData() {
      this.loading = true;
      this.$http.get("/group/").then((resp) => {
        this.group = resp.data;
      });
    },
    //清空当前新增表单（初始化表单）
    xinzeng_clean() {
      this.xinzeng_form = {
        org_id: this.org_id,
        username: "",
        password: "",
        full_name: "",
        department: "",
        mobile: "",
        sex: "",
        is_active: true,
        groups: [],
        description: "",
      };
    },
    async loadData() {
      let params = {
        org_id: this.org_id,
      };
      // 加载数据列表及刷新
      let dep_resp = await this.$http.get(`/department/${this.$route.params.pk}/`);
      this.department = dep_resp.data;
      let rep = await this.$http.get(`/flatdepartment/`, {params});
      this.dep_array = rep.data;
      let resp = await this.$http.get("/user/", this.config);
      this.tableData = resp.data.data;
      this.zongshu = resp.data.count;
      this.next = resp.data.next;
      this.previous = resp.data.previous;
    },
    //当前页码发生变化时触发的事件
    pageChange(page) {
      this.config.params.page = page;
      this.loadData();
    },
    //新增单条数据的方法
    add_xinzengrenyuan() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.xinzeng_form.department = this.department.pk;
          this.$http
              .post("/user/", this.xinzeng_form)
              .then((resp) => {
                this.xinzengrenyuan = false;
                this.$message.success({message: "添加成功！！", center: true});
                this.loadData();
                this.xinzeng_clean();
              })
              .catch((err) => {
                this.$message.error({message: "数据获取失败！！", center: true});
              });
        } else {
          this.$message.error("请填写完整信息后提交");
          return false;
        }
      });
    },
    async toggleActive(data) {
      let params = {
        is_active: !data.is_active,
      };
      try {
        await this.$http.patch("/user/" + data.pk + "/", params);
        data.is_active = !data.is_active;
      } catch (e) {
        this.$message.error(e);
      }
    },
    //点击编辑按钮事件的方法↓
    bianji_xinzengrenyuan(data) {
      data.password = "";
      this.bianji_form = {...data};
      this.bianji_renyuan = true;
    },
    //编辑弹窗内容的方法↓
    edt_xinzengrenyuan() {
      this.$refs.edtForm.validate((valid) => {
        if (valid) {
          this.$http
              .patch("/user/" + this.bianji_form.pk + "/", this.bianji_form)
              .then((resp) => {
                this.bianji_renyuan = false;
                this.$message.success({message: "编辑成功！！", center: true});
                this.loadData();
              })
              .catch((err) => {
                this.$message.error({message: "编辑失败，轻重试！！", center: true});
              });
        } else {
          this.$message.error("请填写完整信息后提交");
          return false;
        }
      });
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
                .delete("/user/" + data.pk + "/", {params: {real: "True"}})
                .then((resp) => {
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                  this.loadData();
                })
                .catch((err) => {
                  this.$message.error({message: "删除失败！！", center: true});
                });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
    },
    // Excel数据提交
    async getTableList(info) {
      for (let i = 0; i < info.length; i++) {
        if (info[i].username == undefined) {
          this.$message({
            type: "warning",
            message: "第" + (i + 2) + "行的用户名未填写！",
          });
          return;
        }
        if (info[i].full_name == undefined) {
          this.$message({
            type: "warning",
            message: "第" + (i + 2) + "行的姓名未填写！",
          });
          return;
        }
        if (info[i].mobile == undefined) {
          this.$message({
            type: "warning",
            message: "第" + (i + 2) + "行的联系方式未填写！",
          });
          return;
        }

        if (info[i].mobile) {
          const regExp = /^1(3|4|5|6|7|8|9)\d{9}$/;
          if (!regExp.test(info[i].mobile)) {
            this.$message({
              type: "warning",
              message: "第" + (i + 2) + "行的手机号格式不正确！",
            });
            return;
          }
        }
      }
      this.loading = true;
      for (let item of info) {
        if (item.username === undefined) {
          item.username = "";
        }
        if (item.full_name === undefined) {
          item.full_name = "";
        }
        if (item.mobile === undefined) {
          item.mobile = "";
        }
        if (item.description === undefined) {
          item.description = "";
        }
        item.org_id = this.org_id;
        item.department = this.department.pk;
        item.is_active = true;
        item.password = item.mobile.toString();
        item.checkpassword = item.mobile.toString();
        // item.description = item.mobile;
        console.log(item.mobile);
        try {
          let res = await this.$http.post("/user/", item);
        } catch (e) {
          this.$message({
            type: "warning",
            message: "导入错误！",
          });
          break;
        }

      }
      this.loading = false;
      await this.loadData();
    },
    // 下载模版
    downTemplate() {
      // console.log("下载模版");
      window.location.href = this.httpurl + "/excel/人员录入模版.xls";
    },
  },
  mounted() {
    // 先获取上一级页面传过来的部门信息
    this.config.params.department = this.$route.params.pk;
    this.xinzeng_clean();
    this.loadData();
    this.groupData();
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
