<template>
  <el-card style="width: 100%">
    <el-row :gutter="10">
      <el-col>
        <el-form inline label-width="80px" style="margin-top: 10px">
          <el-form-item>
            <el-button
              type="primary"
              @click="createTemplate"
              round
              icon="el-icon-plus"
              >新建多行填报
            </el-button>
            <el-button
              type="primary"
              @click="ShiLiTo"
              class="fix-tab"
              plain
              round
              icon="el-icon-picture-outline"
              >查看示例</el-button
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
          stripe
          :data="data"
          v-loading="loading"
          :default-sort="{ prop: 'sort_num', order: 'ascending' }"
        >
          <el-table-column label="填报名称" prop="title"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="{ row }">
              {{ transTime(row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="400px" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                round
                @click="creatQrCode(scope.row.pk)"
                >二维码
              </el-button>
              <el-button
                type="success"
                size="mini"
                round
                @click="toJieguo(scope.row)"
                >结果
              </el-button>
              <el-button
                type="warning"
                size="mini"
                round
                @click="edit(scope.row)"
                >编辑表单
              </el-button>
              <el-button
                type="warning"
                size="mini"
                round
                @click="editform(scope.row)"
                >编辑选项
              </el-button>
              <el-button
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
          layout="prev, pager, next, sizes"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          @current-change="loadData"
          @size-change="loadData"
          :hide-on-single-page="false"
          :total="total"
          style="margin-top: 20px"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="dialogVisiable"
      title="表单"
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
      title="表单"
      top="3vh"
      width="1000px"
      @closed="updateValue = { field: [] }"
    >
      <table-item
        v-if="dialogVisiableform"
        :updateForm="updateValue"
        @close="(status) => (this.dialogVisiableform = status)"
        @loadData="loadData"
      />
    </el-dialog>

    <el-dialog
      title="二维码"
      :visible.sync="viewQR"
      @before-close="closeQR"
      width="30%"
    >
      <div @click="download_canvas" class="qrcode" ref="qrCodeUrl"></div>
      <div><span class="red">点击二维码另存</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewQR = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import TableForm from "./TableForm";
import TableItem from "./TableItem";
import resource from "@/resource";
import moment from "moment";
import QRCode from "qrcodejs2";
import download_canvas from "@/utils/download_canvas";

const BIZ_ID = 10000;

export default {
  computed: {
    ...mapState(["org_id"]),
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
      dialogVisiableform: false,
      editValue: false,
    };
  },
  methods: {
    async loadData() {
      this.loading = true;
      let params = {
        biz_id: 10000,
        form_type: 2,
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
      };
      let res = await resource.getList("formtemplate", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },
    createTemplate() {
      this.dialogVisiable = true;
      this.updateValue = { field: [] };
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
    del(pk) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await resource.deleteObj("formtemplate", pk);
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
    transTime(timeStr) {
      return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
    },

    download_canvas() {
      download_canvas(this.$refs.qrCodeUrl.children[0]);
    },
    closeQR() {
      this.qrcode.clear();
    },
    creatQrCode(pk) {
      // console.log(pk)
      this.viewQR = true;
      this.$nextTick(() => {
        if (this.qrcode) {
          this.qrcode.makeCode(
            `http://${window.location.hostname}/duohangtianbaoinfo?id=${pk}`
          );
        } else {
          this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: `http://${window.location.hostname}/duohangtianbaoinfo?id=${pk}`, // 需要转换为二维码的内容
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M,
          });
        }
      });
    },
    toJieguo(data) {
      this.$router.push({
        name: "tianbao-duohang-jieguolist",
        params: { id: data.pk },
      });
    },
    ShiLiTo() {
      this.$router.push("/tianbaozhanshi");
    },
  },
  async created() {
    await this.loadData();
  },
  components: {
    TableForm,
    TableItem,
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
