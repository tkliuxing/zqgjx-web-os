<template>
  <div class="BuMenRenYuanGuanLi">
    <el-row :gutter="5">
      <el-col :span="6">
        <el-card v-loading="loading" style="height: calc(100vh - 130px)">
          <div style="margin-bottom: 10px;">
            <!--        <el-button type="primary" icon="el-icon-circle-plus-outline" round @click="add_department=true" class="ln-yellow">-->
            <!--          新增顶级部门-->
            <!--        </el-button>-->
            <el-button v-if="is_collapse" type="info" icon="el-icon-minus" round @click="toggleCollapse" class="ln-yellow">
              全部收起
            </el-button>
            <el-button v-else type="info" icon="el-icon-plus" round @click="toggleCollapse" class="ln-yellow">
              全部展开
            </el-button>
            <!--<el-button type="warning" round size="medium" @click="loadData" class="ln-yellow"><i
              class="el-icon-refresh"></i><span>刷新</span></el-button>-->
          </div>
          <div class="block" style="width: 380px;overflow-x: visible;">
            <el-tree
              :data="data"
              node-key="pk"
              ref="selectTree"
              :props="{children:'items',label:'name'}"
              default-expand-all
              :expand-on-click-node="false"
              :draggable="true"
              @node-drop="movenode"
            >
          <span class="custom-tree-node" slot-scope="{ data }">
        <span  @click="user_list(data)">{{ data.name }}</span>
        <span style="text-align: center">
          <el-button
            type="text"
            size="small"
            @click="child_add_department(data.pk)" style="margin: 0 10px">
            增加子部门
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="update_department(data)" style="margin: 0 10px">
            编辑
          </el-button>
          <!--          <el-button-->
          <!--              type="text"-->
          <!--              size="small"-->
          <!--              v-if="data.parent"-->
          <!--              @click="delete_department(data)" style="margin: 0 10px">-->
          <!--            删除-->
          <!--          </el-button>-->
                    <el-button
                        type="text"
                        size="small"
                        @click="view_department(data)" style="margin: 0 10px">
                      查看
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="user_list(data)" style="margin: 0 10px">
                      人员
                    </el-button>
          <!--          <el-button-->
          <!--              type="text"-->
          <!--              size="small"-->
          <!--              @click="creatQrCode(data)" style="margin: 0 10px">-->
          <!--            二维码-->
          <!--          </el-button>-->
        </span>
      </span>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card style="height: calc(100vh - 130px)">
          <el-form inline>
<!--            <el-form-item>-->
<!--              <el-button type="info" round @click="$router.go(-1)">-->
<!--                <i class="el-icon-arrow-left"></i><span>返回</span>-->
<!--              </el-button>-->
<!--            </el-form-item>-->
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
            layout="total, sizes, prev, pager, next, jumper"
            :page-size.sync="config.params.pageSize"
            :page-sizes="[10, 50, 100, 200]"
            :current-page="config.params.page"
            :total="zongshu"
            :hide-on-single-page="true"
            @current-change="pageChange"
            style="margin-top: 10px"
          >
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>


    <!--新增部门-->
    <el-dialog title="新增部门" :visible.sync="add_department" width="30%">
      <el-form :model="department_form" :rules="rules" ref="createForm" label-width="100px">
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="department_form.name" autocomplete="off" style="width:60%"
                    placeholder="请输入名称"></el-input>
        </el-form-item>
        <!--        <el-form-item label="类别：">-->
        <!--          <el-select v-model="department_form.category" placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="item in options"-->
        <!--              :key="item.value"-->
        <!--              :label="item.label"-->
        <!--              :value="item.value">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="联系人：">
          <el-input v-model="department_form.contact_name" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="department_form.contact_mobile" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="add_department = false" class="ln-button" round>取 消</el-button>
        <el-button type="primary" @click="department_add" class="ln-button" round>确 定</el-button>
      </div>
    </el-dialog>
    <!--查看部门-->
    <el-dialog title="查看部门信息" :visible.sync="departmentView" width="30%">
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
        <el-button @click="departmentView = false" class="ln-button" round>关 闭</el-button>
      </div>
    </el-dialog>
    <!--单位来访二维码-->
    <el-dialog
        title="二维码"
        :visible.sync="viewQR"
        @before-close="closeQR"
        width="19%"
        center
    >
      <!--   替换dialog中title   -->
      <span slot="title">
        {{ form.title }}
      </span>
      <div style="text-align: center;width: 200px;">
        <qr-code v-if="viewQR" :url="url" ref="qrCodeUrl"></qr-code>
        <div class="tips" style="text-align: center">点击二维码保存图片</div>
      </div>

    </el-dialog>
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
import QrCode from "@/components/common/QrCode";
import QrCodedown from "@/components/common/QrCodedown";
import Uploadexl from "@/components/common/HxUploadExl.vue";
import {awrap} from "regenerator-runtime";
import resource from "@/resource";

const empty_form = {
  pk: null,
  title: '单位来访二维码',
  content: "",
}

export default {
  name: "BuMenRenYuanGuanLi",
  computed: {
    ...mapState(["org_id", "sys_id", "httpurl"]),
  },
  components: {
    Uploadexl,
    QrCode,
    QrCodedown,
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
      is_collapse: true,
      loading: false,
      data: [],
      d_id: null,
      add_department: false,
      // rules: {
      //   name: [{required: true, message: "请输入部门名称", trigger: 'change'}],
      // },
      department_form: {
        name: '',
        category: 'moren',
        contact_name: '',
        contact_mobile: '',
      },
      departmentView: false,
      departmentView_list: {
        name: '',
        category: 'moren',
        contact_name: '',
        contact_mobile: '',
      },
      viewQR: false,
      url: null,
      form: {
        ...empty_form
      },
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
        name: [{required: true, message: "请输入部门名称", trigger: 'change'}],
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
          pageSize: 10, //当前页显示条数
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
    }
  },
  methods: {
    async loadData() {
      this.loading = true;
      let params = {
        org_id: this.org_id
      };
      // 加载数据列表及刷新
      try {
        const resp = await this.$http.get("/department/", {params});
        this.data = resp.data;
        this.d_id = resp.data[0].pk;
        this.config.params.department = this.d_id;
        this.loadRyData();
      } catch (err) {
        this.$message.error({message: "数据获取失败！！", center: true})
      } finally {
        this.loading = false;
      }
    },
    async loadRyData() {
      let params = {
        org_id: this.org_id,
      };
      // 加载数据列表及刷新
      console.log(this.d_id);
      let dep_resp = await this.$http.get(`/department/${this.d_id}/`);
      this.department = dep_resp.data;
      let rep = await this.$http.get(`/flatdepartment/`, {params});
      this.dep_array = rep.data;
      let resp = await this.$http.get("/user/", this.config);
      this.tableData = resp.data.data;
      this.zongshu = resp.data.count;
      this.next = resp.data.next;
      this.previous = resp.data.previous;
    },
    form_clean() {
      // 还原from表单
      this.department_form = {
        sys_id: this.sys_id,
        org_id: this.org_id,
        name: '',
        parent: '',
        category: 'moren',
        contact_name: '',
        contact_mobile: '',
      };
    },

    department_add() {
      // 新增顶级部门
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.add_department = false;
          this.$http.post("/department/", this.department_form).then((resp) => {
            this.loadData();
            this.form_clean();
          }).catch((err) => {
            this.$message.error({message: "数据获取失败！！", center: true})
          })
        } else {
          this.$message.error('请填写完整信息后提交');
          return false
        }
      })
    },
    child_add_department(pk) {
      // 新增子部门
      this.$router.push({name: 'xinzengbumen', params: {pk: pk}});
    },

    update_department(data) {
      // 编辑部门
      this.$router.push({name: 'bianjibumen', params: {pk: data.pk}});
    },

    delete_department(data) {
      this.$confirm('此操作将永久删除  "' + data.name + '"  及所属部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete("/department/" + data.pk + "/").then((resp) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.loadData();
        }).catch((err) => {
          this.$message.error({message: "删除失败！！", center: true})
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    view_department(data) {
      this.departmentView = true;
      this.departmentView_list = {...data};
      // this.$router.push({name: 'chakanbumen', params: {pk: pk}});
    },

    user_list(data) {
      // this.$router.push({name: 'renyuanguanli', params: {pk: data.pk}});
      this.d_id = data.pk;
      this.config.params.department = this.d_id;
      this.loadRyData();
    },
    // 二维码生成
    async creatQrCode(data) {
      this.viewQR = true;
      this.url = this.httpurl + "/sf_shen_qing?pk=" + data.org_id;
    },
    closeQR() {
      this.qrcode.clear();
    },
    movenode(node, target, position, event) {
      let pos = "";
      switch (position) {
        case "before":
          pos = "left";
          break;
        case "after":
          pos = "right";
          break;
        case "inner":
          pos = "first-child";
          break;
      }
      let params = {
        department: node.data.pk,
        target: target.data.pk,
        position: pos,
      };
      this.$http.post("/departmentmove/", params).then((resp) => {
      });
    },
    toggleCollapse() {
      this.is_collapse = !this.is_collapse;
      let treeList = this.data;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.selectTree.store.nodesMap[treeList[i].pk].expanded = this.is_collapse
      }
    },
    async groupData() {
      this.loading = true;
      // this.$http.get(`/group/`).then((resp) => {
      //   console.log(resp,'resp');
      //   this.group = resp.data;
      // });
      let res = await resource.getList('group',{})
      this.group = res;
      console.log(res,'res')
      this.loading = false;
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
    pageChange(page) {
      this.config.params.page = page;
      this.loadData();
    },
    //新增单条数据的方法
    add_xinzengrenyuan() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.xinzeng_form.department = this.department.pk;
          this.xinzeng_form.org_id = this.org_id;
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
    this.loadData();
    this.groupData();
    this.department_form.sys_id = this.sys_id;
    this.department_form.org_id = this.org_id;
  }
}
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
