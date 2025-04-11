<template>
  <el-card style="position:relative">
    <el-button
      type="warning"
      @click="ShuoMingTo"
      class="fix-shuoming"
      round
      plain
      icon="el-icon-notebook-2"
    >使用说明</el-button
    >
    <el-button
      type="primary"
      @click="ShiLiTo"
      class="fix-tab"
      plain
      round
      icon="el-icon-picture-outline">
      查看示例
    </el-button>
    <el-form inline>
      <el-form-item label="任务名称">
        <el-input v-model="searchForm.search" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="searchForm.task_type" style="width:100%" clearable filterable>
          <el-option v-for="item in type" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select v-model="searchForm.task_status" style="width:100%" clearable filterable>
          <el-option v-for="item in status" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="searchForm.level" style="width:100%" clearable filterable>
          <el-option v-for="item in priority" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="loadData" type="primary" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-form inline>
      <el-form-item>
        <el-button @click="addTable" type="primary" icon="el-icon-plus">新建</el-button>
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="excelDialogVisable=true" type="info" icon="el-icon-upload">数据导入</el-button> -->
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="excelExport" type="success" icon="el-icon-download">Excel导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" v-loading="loading" element-loading-text='加载中...'
      @selection-change="(data)=>batchDelData = data">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="任务名称" prop="task_name"></el-table-column>
      <el-table-column label="任务类型" prop="task_type" width="100px"></el-table-column>
      <el-table-column label="任务状态" prop="task_status" width="100px"></el-table-column>
      <el-table-column label="负责人" prop="fuzeren_name" width="100px"></el-table-column>
      <el-table-column label="执行人" prop="zhixingren" width="100px"></el-table-column>
      <el-table-column label="优先级" prop="level" width="80px"></el-table-column>
      <el-table-column label="任务描述" prop="task_content" width="300px">
        <template slot-scope="{row}">
          <el-popover placement="top-start"
                      width="400"
                      trigger="hover">
            <div slot="reference">{{ row.task_content ? truncateContent(row.task_content, 30) : '' }}</div>
            <p v-html="row.task_content"></p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="任务时限" prop="task_endtime" width="100px"></el-table-column>
      <el-table-column label="附件" prop="fujian" width="100px">
        <template slot-scope="{row}">
          <a v-if="row.fujian" :href="row.fujian" download target="_blank" >
            <i class="el-icon-download">下载/预览</i>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template slot-scope="{row}">
          <el-button title="二维码" round size="mini" type="primary" @click="creatQrCode(row)">二维码</el-button>
          <el-button title="编辑" round size="mini" type="primary" @click="editTable(row)">编辑</el-button>
          <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="删除后不可恢复，确定删除吗？" @confirm="delTable(row)">
            <el-button round size="mini" slot="reference" title="删除" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <div class="batchClass">
      <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确定批量删除吗" @confirm="batchDelDataFn">
        <el-button icon="el-icon-delete" type="danger" slot="reference">批量删除</el-button>
      </el-popconfirm>
    </div>
    <el-dialog :title="form.pk?'编辑':'新建'" :visible.sync="formDialogVisable" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close
      @close="clearForm">
      <Form v-model="form" ref="FormComp" @checked="submitForm" />
      <div slot="footer">
        <el-button @click="formDialogVisable=false" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="$refs.FormComp.submit()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Excel导入" :visible.sync="excelDialogVisable" width="95%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close>
      <ImportData @loadData="loadData" @close="excelDialogVisable=false" />
    </el-dialog>
    <el-dialog  :visible.sync="viewQR" @before-close="closeQR" width="20%">
      <Qr v-if="viewQR" :url="url" style="margin: auto "></Qr>
      <div class="tips" style="text-align: center">点击二维码保存图片</div>
    </el-dialog>
  </el-card>
</template>
<script>
//
// TEMPLATE_ID: FT204884904327495680
// 字段说明:
// task_id:任务编号
// task_name:任务名称
// task_type:任务类型
// task_status:任务状态
// fuzeren_name:负责人
// fuzeren_id:负责人ID
// zhixing_department:执行部门
// department_id:部门ID
// zhixingren:执行人
// zhixingren_id:执行人ID
// level:优先级
// task_content:任务描述
// create_time:创建时间
// task_endtime:任务时限
// fujian:附件

import Form from "./Form.vue";
import ImportData from "./ImportData.vue";
import XLSX from "xlsx";
import QrCode from "@/components/common/QrCode";

import {getList, createObj, getObj, updateObj, deleteObj, getObjFromList} from "@/resource";
const TEMPLATE_ID = "FT204884904327495680";
import { mapState } from "vuex";
import moment from "moment";
import Qr from "@/components/common/QR.vue";

export default {
  name: "",
  data() {
    return {
      form: {
        task_id: null,
        task_name: null,
        task_type: null,
        task_status: null,
        fuzeren_name: null,
        fuzeren_id: null,
        zhixing_department: null,
        department_id: null,
        zhixingren: null,
        zhixingren_id: null,
        level: null,
        task_content: null,
        create_time: null,
        task_endtime: null,
        fujian: null,
      },
      searchForm: {
        task_id: null,
        search: null,
        task_type: null,
        task_status: null,
        fuzeren_name: null,
        fuzeren_id: null,
        zhixing_department: null,
        department_id: null,
        zhixingren: null,
        zhixingren_id: null,
        level: null,
        task_content: null,
        create_time: null,
        task_endtime: null,
      },
      zhixing_department_option_data: [],
      data: [],
      batchDelData: [],
      loading: false,
      formDialogVisable: false,
      excelDialogVisable: false,
      page: 1,
      pageSize: 10,
      total: 0,
      user_option_data: [],
      priority: [],
      status: [],
      type: [],
      viewQR: false,
      pviewQR: false,
      url: null,
      title: "",
    };
  },
  methods: {
    truncateContent(content, length) {
      if (content.length > length) {
        return content.substring(0, length) + '...';
      } else {
        return content;
      }
    },
    ShuoMingTo() {
      this.$router.push({ name: "duban-shuoming" });
    },
    ShiLiTo() {
      this.$router.push("/duban");
    },
    closeQR() {
      this.qrcode.clear();
    },
    creatQrCode(row) {
      this.url = window.location.origin + "/mobile/renwuinfo?id=" + row.pk;
      this.title = "";
      this.title = row.task_name + "二维码";
      this.viewQR = true;
    },
    moment,
    addTable() {
      if(!this.quanxian.任务督办 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.form.create_time = moment().format("yyyy-MM-DD HH:mm:ss");
        this.formDialogVisable = true;
      }

    },
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID,
      };

      if (this.searchForm.task_id) {
        params["task_id"] = this.searchForm.task_id;
      }

      if (this.searchForm.search) {
        params["search"] = this.searchForm.search;
      }

      if (this.searchForm.task_type) {
        params["task_type"] = this.searchForm.task_type;
      }

      if (this.searchForm.task_status) {
        params["task_status"] = this.searchForm.task_status;
      }

      if (this.searchForm.fuzeren_name) {
        params["fuzeren_name"] = this.searchForm.fuzeren_name;
      }

      if (this.searchForm.fuzeren_id) {
        params["fuzeren_id"] = this.searchForm.fuzeren_id;
      }

      if (this.searchForm.zhixing_department) {
        params["zhixing_department"] = this.searchForm.zhixing_department;
      }

      if (this.searchForm.department_id) {
        params["department_id"] = this.searchForm.department_id;
      }

      if (this.searchForm.zhixingren) {
        params["zhixingren"] = this.searchForm.zhixingren;
      }

      if (this.searchForm.zhixingren_id) {
        params["zhixingren_id"] = this.searchForm.zhixingren_id;
      }

      if (this.searchForm.level) {
        params["level"] = this.searchForm.level;
      }

      if (this.searchForm.task_content) {
        params["task_content"] = this.searchForm.task_content;
      }

      if (this.searchForm.create_time) {
        params["create_time"] = this.searchForm.create_time;
      }

      if (this.searchForm.task_endtime) {
        params["task_endtime"] = this.searchForm.task_endtime;
      }

      let res = await getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },
    async submitForm() {
      for (const key in this.form) {
        if (this.form[key] !== null && typeof this.form[key] === "object") {
          this.form[key] = JSON.stringify(this.form[key]);
        }
      }
      try {
        if (this.form.pk) {
          await updateObj("data", this.form.pk, {
            ...this.form,
            template_id: TEMPLATE_ID,
          });
          this.$message.success("编辑成功!");
        } else {
          this.form.faqiren_name = this.userinfo.full_name;
          this.form.faqiren_id = this.userinfo.pk;
          await createObj("data", {
            ...this.form,
            template_id: TEMPLATE_ID,
          });
          this.$message.success("新建成功!");
        }
        this.formDialogVisable = false;
        this.loadData();
      } catch (error) {}
    },
    editTable(row) {
      for (const key in row) {
        if (
          row[key] &&
          typeof row[key] === "string" &&
          row[key].startsWith("[") &&
          row[key].endsWith("]")
        ) {
          row[key] = JSON.parse(row[key]);
        }
      }
      this.form = {
        ...row,
      };
      this.form.create_time = moment(this.form.create_time).format(
        "yyyy-MM-DD HH:mm:ss"
      );
      this.formDialogVisable = true;
    },
    async delTable(row) {
      try {
        await deleteObj("data", row.pk, this.$store.state.sys_id, TEMPLATE_ID);
        this.$message.success("删除成功!");
        this.loadData();
      } catch (err) {
        this.$message.error("删除失败!");
      }
    },
    excelExport() {
      let header = [
        "任务编号",

        "任务名称",

        "任务类型",

        "任务状态",

        "负责人",

        "负责人ID",

        "执行部门",

        "部门ID",

        "执行人",

        "执行人ID",

        "优先级",

        "任务描述",

        "创建时间",

        "任务时限",

        "附件",
      ];
      let tmp = [];
      this.data.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) {
            obj[this.excelDownloadTranslate[key]] = i[key];
          }
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "事件督办.xlsx");
    },
    clearForm() {
      this.form = {
        task_id: null,

        task_name: null,

        task_type: null,

        task_status: null,

        fuzeren_name: null,

        fuzeren_id: null,

        zhixing_department: null,

        department_id: null,

        zhixingren: null,

        zhixingren_id: null,

        level: null,

        task_content: null,

        create_time: null,

        task_endtime: null,

        fujian: null,
      };
      this.$refs.FormComp.$refs.form.resetFields();
    },
    async batchDelDataFn() {
      if (this.batchDelData.length === 0) {
        return this.$message.error("请选择要删除的数据!");
      }
      try {
        let pk_list = this.batchDelData.map((i) => i.pk); //data-delete
        await createObj("data-delete", {
          template_id: TEMPLATE_ID,
          querys: { pk: pk_list.join(",") },
        });
        this.$message.success("批量删除成功!");
        this.loadData();
      } catch (error) {}
    },

    get_zhixing_department_option_data_display(value) {
      let option = this.zhixing_department_option_data.filter((item) => {
        return item["name"] === value;
      });
      if (option.length > 0) return option[0]["name"];
      return value;
    },

    async getLocalDataSource() {
      let res6 = await getList("flatdepartment", {});
      console.log(res6,'2')
      this.zhixing_department_option_data = res6;
      let res8 = await getObjFromList("basetree", { name: "任务优先级" ,org_id: 0});
      if(res8.items.length>0){
        this.priority = res8.items;
      }
      let res1 = await getObjFromList("basetree", { name: "任务状态" ,org_id: 0});
      if(res1.items.length>0){
        this.status = res1.items;
      }
      let res2 = await getObjFromList("basetree", { name: "任务类型" ,org_id: 0});
      if(res2.items.length>0){
        this.type = res2.items;
      }
    },
  },
  created() {
    this.loadData();
    this.getLocalDataSource();
  },
  computed: {
    ...mapState(["userinfo", "httpurl", "org_id","quanxian"]),
    excelDownloadTranslate() {
      return {
        task_id: "任务编号",
        task_name: "任务名称",
        task_type: "任务类型",
        task_status: "任务状态",
        fuzeren_name: "负责人",
        fuzeren_id: "负责人ID",
        zhixing_department: "执行部门",
        department_id: "部门ID",
        zhixingren: "执行人",
        zhixingren_id: "执行人ID",
        level: "优先级",
        task_content: "任务描述",
        create_time: "创建时间",
        task_endtime: "任务时限",
        fujian: "附件",
      };
    },
  },
  components: {
    Qr,
    Form,
    ImportData,
    QrCode,
  },
};
</script>
<style scoped>
.batchClass {
  position: absolute;
  right: 20px;
  bottom: 17px;
}
.qrcodeurl {
  margin: 0 auto;
  text-align: center;
}
.tips {
  margin-top: 30px;
  text-align: center;
}
</style>
<style scoped>
.qrcodeurl > div > div {
  text-align: center !important;
}
</style>