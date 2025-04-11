<template>
  <el-card style="width: 100%">
    <el-row :gutter="10">
      <el-col>
        <el-form inline label-width="80px" @submit.native.prevent>
          <el-form-item v-if="hasPerm('二维填报表格管理')">
            <el-button
              type="primary"
              round
              icon="el-icon-plus"
              @click="createTemplate"
            >新建填报
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="search"
              prefix-icon="el-icon-search"
              placeholder="关键字搜索"
              clearable
              @clear="loadData"
              @keyup.enter.native="loadData"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              round
              @click="loadData"
            >搜索
            </el-button>
          </el-form-item>
        </el-form>
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
        >
          <el-table-column label="填报名称" prop="title"></el-table-column>
          <el-table-column label="部门范围" prop="department_display"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="{ row }">
              {{ transTime(row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="450px" align="center"
                           v-if="hasPerm('二维填报表格管理') || hasPerm('二维填报') || hasPerm('二维填报查看填报汇总') ">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('二维填报表格管理')"
                type="primary"
                size="mini"
                round
                @click="edit(scope.row)"
              >基本配置
              </el-button>
              <el-button
                v-if="hasPerm('二维填报表格管理')"
                type="warning"
                size="mini"
                round
                @click="editform(scope.row)"
              >选项配置
              </el-button>
              <el-button
                v-if="hasPerm('二维填报') || hasPerm('二维填报查看填报汇总')"
                type="info"
                size="mini"
                round
                @click="toJieguo(scope.row)"
              >信息填报
              </el-button>
              <el-button
                v-if="hasPerm('二维填报结果统计')"
                type="success"
                size="mini"
                round
                @click="ConfigForm(scope.row)"
              >结果统计
              </el-button>
              <el-button
                v-if="hasPerm('二维填报表格管理')"
                type="danger"
                size="mini"
                round
                @click="del(scope.row.pk)"
              >删除
              </el-button>
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
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="dialogVisiable"
      title="基本配置"
      center
      top="3vh"
      width="500px"
      @closed="updateValue = { field: [] }"
    >
      <table-form
        v-if="dialogVisiable"
        :updateForm="updateValue"
        @close="(status) => (this.dialogVisiable = status)"
        @loadData="loadData"
      />
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisiableform"
      title="选项配置"
      center
      top="3vh"
      width="1000px"
      @closed="clearupdateValue"
    >
      <table-item
        v-if="dialogVisiableform"
        :updateForm="updateValue"
        @close="(status) => (this.dialogVisiableform = status)"
        @loadData="loadData"
      />
    </el-dialog>

    <!--    数据统计魔板模板-->
    <el-dialog :title="form.title+'-统计报表配置'" :visible.sync="configurelDialogVisable" :width="form.remark.is_groups?'80%':'50%'"
               :close-on-click-modal="false"
               :close-on-press-escape="false" top="3vh" center destroy-on-close append-to-body>
      <configData v-if="configurelDialogVisable && !form.remark.is_groups" v-model="form.pk"
                  @checked="submitConfigForm" ref="FormComp" @close="configurelDialogVisable=false"/>

      <groupConfigData v-if="configurelDialogVisable && form.remark.is_groups" v-model="form.pk"
                       @checked="submitConfigForm"
                       ref="FormComp"
                       @close="configurelDialogVisable=false"/>
      <div slot="footer">
        <el-button @click="configurelDialogVisable = false" icon="el-icon-close">关闭</el-button>
        <el-button @click="$refs.FormComp.submit()" icon="el-icon-check" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {mapState} from "vuex";
import TableForm from "./TableForm";
import TableItem from "./TableItem";
import resource from "@/resource";
import moment from "moment";
import QrCode from "@/components/common/QrCode";
import configData from "./common/configData"
import groupConfigData from "./common/groupConfigData"

export default {
  computed: {
    ...mapState(["userinfo", "org_id", "httpurl"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      search: "",
      systemPk: "",
      systemName: "",
      systemSearch: "",
      sys_id: null,
      loading: false,
      dialogVisiable: false,
      updateValue: null,
      data: [],
      systemData: [],
      viewQR: false,
      dialogVisiableform: false,
      editValue: false,
      configurelDialogVisable: false,
      url: null,
      form: {
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
    };
  },
  methods: {
    //权限判断的方法
    hasPerm(name) {
      return this.userinfo.func_names.indexOf(name) > -1;
    },
    async loadData() {
      this.loading = true;
      let params = {
        form_type: 3,
        page: this.page,
        pageSize: this.pageSize,
        // search: this.search,
        // biz_id: this.$bizCode.tianbao_biz,
        // src_id: this.$sourceCode.source_id,
      };
      if (this.search) {
        params['search'] = this.search;
      }
      if (await this.hasPerm("二维填报")) {
        params.department = this.userinfo.department;
      }
      if (await this.hasPerm("二维填报表格管理")) {
        let dep = this.userinfo.department_child_ids;
        if (!dep) {
          dep = this.userinfo.department;
        }
        params.department = dep;
      }
      let res = await resource.getList("formtemplate", params);
      let data = res.data;
      for (let i in data) {
        if (data[i].department) {
          let querys = {pk: data[i].department.join(',')}
          let dep = await resource.getList("flatdepartment", querys);
          let dep_array = dep.map((i) => i.name); //data-delete
          data[i].department_display = dep_array.join(',');
        } else {
          data[i].department_display = "";
        }
      }


      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },
    async seachData() {
      let params = {
        form_type: 3,
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
        biz_id: this.$bizCode.tianbao_biz,
        src_id: this.$sourceCode.source_id,
      };
      if (await this.hasPerm("二维填报")) {
        params.department = this.userinfo.department;
      }
      if (await this.hasPerm("二维填报表格管理")) {
        let dep = this.userinfo.department_child_ids;
        if (!dep) {
          dep = this.userinfo.department;
        }
        params.department = dep;
      }
      let res = await resource.getList("formtemplate", params);
      let data = res.data;
      for (let i in data) {
        if (data[i].department) {
          let querys = {pk: data[i].department.join(',')}
          let dep = await resource.getList("flatdepartment", querys);
          let dep_array = dep.map((i) => i.name); //data-delete
          data[i].department_display = dep_array.join(',');
        } else {
          data[i].department_display = "";
        }
      }
      this.data = res.data;
      this.total = res.count;
    },
    createTemplate() {
      this.dialogVisiable = true;
      this.updateValue = {field: []};
    },
    async clearupdateValue() {
      this.updateValue = {field: []};
      await this.seachData();
    },
    edit(obj) {
      if (typeof obj.remark == "string") {
        obj.remark = JSON.parse(obj.remark);
      }
      this.updateValue = obj;
      this.dialogVisiable = true;
    },
    editform(obj) {
      if (typeof obj.remark == "string") {
        obj.remark = JSON.parse(obj.remark);
      }
      this.updateValue = obj;
      this.dialogVisiableform = true;
    },
    async del(pk) {
      try {
        await this.$confirm("是否确定删除? 此操作不可恢复!");
        try {
          await resource.deleteObj("formtemplate", pk);
          await resource.deleteList(
            {
              tianbao_id: pk,
            },
            "FT301977801653833728"
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
    // 时间转换
    transTime(timeStr) {
      return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
    },
    closeQR() {
      this.qrcode.clear();
    },
    // 二维码生成
    creatQrCode(pk) {
      this.viewQR = true;
      this.url = this.httpurl + "/tianbaoinfo?id=" + pk;
    },
    // 统计
    toJieguo(data) {
      this.$router.push({
        name: "ewtianbao-jieguotianbao",
        params: {id: data.pk},
      });
    },
    ShiLiTo() {
      this.$router.push("/tianbaozhanshi");
    },
    ShuoMingTo() {
      this.$router.push({name: "tianbao-shuoming"});
    },
    ConfigForm(obj) {
      if (typeof obj.remark == "string") {
        obj.remark = JSON.parse(obj.remark);
      }
      this.form = {...obj};
      this.configurelDialogVisable = true;
    },
    submitConfigForm() {
      this.configurelDialogVisable = false;
    },
  },
  async created() {
    await this.loadData();
  },
  components: {
    TableForm,
    TableItem,
    QrCode,
    configData,
    groupConfigData,
  },
};
</script>

<style scoped>
.foot {
  width: 100%;
  display: flex;
}

.sys-tabs {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 30px;
}

.sys-tabs:hover {
  color: #2d8cf0;
  cursor: pointer;
}

.sys-tabs-color {
  color: #2d8cf0;
}
</style>
