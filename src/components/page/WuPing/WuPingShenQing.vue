<template>
  <el-card>
    <el-button type="warning" @click="ShuoMingTo" class="fix-shuoming" round icon="el-icon-notebook-2" plain>使用说明</el-button>
    <el-table :data="data" border stripe :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="申请人" prop="create_user_name"></el-table-column>
      <el-table-column label="申请名称" prop="name"></el-table-column>
      <el-table-column label="申请时间">
        <template slot-scope="{ row }">
          <span v-if="row.create_time">{{
            moment(row.create_time).format("yyyy-MM-DD HH:mm:ss")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="lookItems(row)" round icon="el-icon-tickets">物品列表</el-button>
          <el-popconfirm title="确定结束发放吗？" @confirm="issueSuccess(row)" style="margin-left:10px">
            <el-button type="success" round slot="reference" icon="el-icon-check">结束发放</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="
        (pageSize) => {
          this.pageSize = pageSize;
          this.getRequest();
        }
      " @current-change="
        (page) => {
          this.page = page;
          this.getRequest();
        }
      " :current-page="page" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog :visible.sync="lookItemsVisable" :close-on-click-modal="false" title="物品申请列表" @closed="currentGoodSreceipt = null" width="80%" center>
      <el-table :data="items" border stripe :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
        <el-table-column label="物品名称" prop="field_01"></el-table-column>
        <el-table-column label="申请数量" prop="int_01"></el-table-column>
        <el-table-column label="用途" prop="field_02"></el-table-column>
        <el-table-column label="领用借用" prop="field_03"></el-table-column>
        <el-table-column label="归还日期">
          <template slot-scope="{ row }">
            <span v-if="row.datetime_01">{{
              moment(row.datetime_01).format("yyyy-MM-DD")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="归还期限" prop="field_04"></el-table-column>
        <el-table-column label="发放数量" prop="int_02"></el-table-column>
        <el-table-column label="发放日期">
          <template slot-scope="{ row }">
            <span v-if="row.datetime_02">{{
              moment(row.datetime_02).format("yyyy-MM-DD")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="primary" @click="issue(row)" icon="el-icon-document-checked">发放</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="issueVisable" append-to-body center :title="`${title}发放`" @closed="clearIssue" width="50%" :close-on-click-modal="false">
      <el-form label-width="100px" :model="form" ref="form" v-if="issueVisable">
        <h3 style="text-align:center;color:red;margin:5px 0">
          申请数量:{{ currentItem.int_01 }}，已发放数量:{{
            currentItem.int_02 ? currentItem.int_02 : 0
          }}
        </h3>
        <el-form-item label="发放数量" prop="ffnumber" :rules="{ required: true, message: '请填写发放数量' }">
          <el-input v-model="form.ffnumber"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="issueVisable = false" icon="el-icon-close">取消</el-button>
        <el-button @click="issueSubmit" icon="el-icon-check" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import moment from "moment";
import resource from "../../../resource";
export default {
  name: "WuPingShenQing",
  data() {
    return {
      title: "",
      form: {
        ffnumber: "",
      },
      currentGoodSreceipt: null,
      currentItem: null,
      data: [],
      items: [],
      lookItemsVisable: false,
      issueVisable: false,
      page: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    async getRequest() {
      let res = await resource.getList("data", {
        template_id: "FT140638058851151872",
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
        page: this.page,
        pageSize: this.pageSize,
        field_03: "未发放",
      });
      this.data = res.data;
      this.total = res.count;
    },
    async lookItems(row) {
      this.currentGoodSreceipt = row;
      await this.getGoodItem();
      this.lookItemsVisable = true;
    },
    async getGoodItem() {
      let res = await resource.getList("data", {
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT140638334658744320",
        goodsreceipt: this.currentGoodSreceipt.pk,
      });
      this.items = res;
    },
    async issue(row) {
      this.currentItem = row;
      this.title = row.goods_name;
      this.form.ffnumber = row.int_01;
      this.issueVisable = true;
    },
    async issueSubmit() {
      let res = await new Promise((resolve) =>
        this.$refs.form.validate((validate) => resolve(validate))
      );
      if (res) {
        try {
          await resource.patchObj("data", this.currentItem.pk, {
            biz_id: this.$bizCode.wuping_biz,
            src_id: this.$sourceCode.source_id,
            template_id: "FT140638334658744320",
            int_02: this.form.ffnumber,
            datetime_02: moment().format("yyyy-MM-DD"),
          });
          this.$message.success("发放成功!");
          await this.getGoodItem();
          this.issueVisable = false;
        } catch (error) {
          this.$message.error("发放失败!");
        }
      } else {
        this.$message.error("请检查表单!");
      }
    },
    clearIssue() {
      this.currentItem = null;
      this.title = "";
      this.form = { ffnumber: "" };
    },
    async issueSuccess(row) {
      try {
        await resource.patchObj("data", row.pk, {
          biz_id: this.$bizCode.wuping_biz,
          src_id: this.$sourceCode.source_id,
          template_id: "FT140638058851151872",
          field_03: "已发放",
        });
        this.$message.success("已结束发放");
        this.getRequest();
      } catch (error) {
        this.$message.success("结束失败");
      }
    },
    ShuoMingTo() {
      this.$router.push({ name: "wpsq-shuoming" });
    },
    moment,
  },
  created() {
    this.getRequest();
  },
};
</script>

<style></style>
