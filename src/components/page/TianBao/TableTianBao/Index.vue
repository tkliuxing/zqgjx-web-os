<template>
  <el-card style="width: 100%">
    <el-row :gutter="10">
      <el-col>
        <el-form inline label-width="80px">
          <el-form-item>
            <el-button type="primary" @click="createTemplate" round icon="el-icon-plus"
            >新建表格填报
            </el-button>
            <el-button
              type="primary"
              @click="ShiLiTo"
              class="fix-tab"
              plain
              round
              icon="el-icon-picture-outline"
            >查看示例
            </el-button
            >
            <el-button
              type="warning"
              @click="ShuoMingTo"
              class="fix-shuoming"
              round
              plain
              icon="el-icon-notebook-2"
            >使用说明
            </el-button
            >
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="search"
              prefix-icon="el-icon-search"
              clearable
              @clear="loadData"
              placeholder="关键字搜索"
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
          <el-table-column label="创建时间">
            <template slot-scope="{ row }">
              {{ transTime(row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="450px" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                round
                @click="creatQrCode(scope.row.pk)"
              >二维码
              </el-button>
              <el-button type="success" size="mini" round @click="toJieguo(scope.row)"
              >结果
              </el-button>
              <el-button type="warning" size="mini" round @click="edit(scope.row)"
              >基本配置
              </el-button>
              <el-button type="warning" size="mini" round @click="editform(scope.row.pk)"
              >表格配置
              </el-button>
              <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.pk)">
                <el-button type="danger" size="mini" class="deleteButton" round slot="reference" icon="el-icon-remove">
                  删除
                </el-button>
              </el-popconfirm>
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

    <el-dialog title="二维码" :visible.sync="viewQR" @before-close="closeQR" width="30%">
      <qr-code v-if="viewQR" :url="url" ref="qrCodeUrl"></qr-code>
      <div class="tips" style="text-align: center">点击二维码保存图片</div>
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

export default {
  computed: {
    ...mapState(["org_id", "httpurl"]),
  },
  data() {
    return {
      systemPk: "",
      systemName: "",
      systemSearch: "",
      sys_id: null,
      page: 1,
      pageSize: 10,
      total: 0,
      search: "",
      loading: false,
      dialogVisiable: false,
      updateValue: null,
      data: [],
      systemData: [],
      viewQR: false,
      editValue: false,
      url: null,
      create_time: null,
      end_time: null,
      need_login: false,
      template_id: "FT181659590589906944",
    };
  },
  methods: {
    // 加载列表
    async loadData() {
      this.loading = true;
      let params = {
        // form_type: 2,
        page: this.page,
        pageSize: this.pageSize,
        // title: this.search,
        // biz_id: this.$bizCode.tianbao_biz,
        // src_id: this.$sourceCode.source_id,
        template_id: "FT181659590589906944",
      };
      if (this.search) {
        params.title = this.search;
      }
      let res = await resource.getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },

    createTemplate() {
      this.dialogVisiable = true;
      this.updateValue = {field: []};
      // this.data.need_login.toString();
    },

    edit(obj) {
      if (typeof obj == "string") {
        obj = JSON.parse(obj);
      }
      this.updateValue = obj;
      this.dialogVisiable = true;
    },

    editform(pk) {
      this.$router.push({name: "tianbao-table-info", query: {pk: pk}});
    },

    // 删除
    async del(pk) {
      try {
        try {
          await resource.deleteObj("data", pk, this.$store.state.sys_id, "FT181659590589906944");
          await resource.deleteList(
            {
              tianbao_id: pk,
            },
            "FT139612458194108416"
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

    transTime(timeStr) {
      return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
    },
    // 二维码
    closeQR() {
      this.qrcode.clear();
    },
    creatQrCode(pk) {
      // console.log(pk)
      this.viewQR = true;
      this.url = this.httpurl + "/tabletianbao?id=" + pk;
      console.log(this.url)
    },

    toJieguo(data) {
      this.$router.push({name: "tianbao-table-jieguolist", params: {id: data.pk}});
    },
    ShiLiTo() {
      this.$router.push("/tianbaozhanshi");
    },
    ShuoMingTo() {
      this.$router.push({name: 'tianbao-shuoming'})
    }
  },
  async created() {
    await this.loadData();
    this.$store.commit('setActive', 'tianbao-table');
  },
  components: {
    TableForm,
    TableItem,
    QrCode
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

.deleteButton {
  margin-left: 10px;
}
</style>
