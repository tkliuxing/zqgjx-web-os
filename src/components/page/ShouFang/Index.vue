<template>
  <el-card style="position:relative">
    <el-form inline>
       <el-button
        type="warning"
        @click="ShuoMingTo"
        class="fix-shuoming"
        round
        style="right: 40px"
        plain
        icon="el-icon-notebook-2"
        >使用说明</el-button>
      <el-form-item label="受访人员">
        <el-select v-model="searchForm.user_id" filterable clearable style="width:100%">
          <el-option v-for="item in user_id_option_data" :key="item.pk" :label="item.full_name"
                     :value="item.pk"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="来访人姓名">
        <el-input v-model="searchForm.lf_name" clearable></el-input>
      </el-form-item>

      <el-form-item label="联系方式">
        <el-input v-model="searchForm.lf_mobile" clearable></el-input>
      </el-form-item>


      <el-form-item label="来访时间">
        <!--        <el-date-picker v-model="searchForm.create_time" clearable value-format="yyyy-MM-dd"/>-->
        <el-date-picker
            v-model="searchForm.create_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="loadData" type="primary" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-form inline>
<!--      <el-form-item>-->
<!--        <el-button @click="formDialogVisable=true" type="primary" icon="el-icon-plus">新建</el-button>-->
<!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-button @click="excelDialogVisable=true" type="info" icon="el-icon-upload">数据导入</el-button>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="excelExport" type="success" icon="el-icon-download">Excel导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}"
              v-loading="loading" element-loading-text='加载中...' @selection-change="(data)=>batchDelData = data">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column label="受访人员" prop="user_id" fixed>
        <template slot-scope="{row}">{{ get_user_id_option_data_display(row.user_id) }}</template>
      </el-table-column>

      <!--      <el-table-column label="来访人openid" prop="wx_openid"></el-table-column>-->

      <el-table-column label="来访人姓名" prop="lf_name"></el-table-column>

      <el-table-column label="所属单位" prop="lf_dep"></el-table-column>

      <el-table-column label="联系方式" prop="lf_mobile"></el-table-column>
      <el-table-column label="身份证号" prop="id_number"></el-table-column>
      <el-table-column label="体温" prop="heat"></el-table-column>
<!--      <el-table-column label="健康码" prop="img_jkm">-->
<!--        <template slot-scope="{row}">-->
<!--          <el-image-->
<!--              v-if="row.img_jkm"-->
<!--              style="width: 45px; height: 45px"-->
<!--              :src="row.img_jkm"-->
<!--              :preview-src-list="[row.img_jkm]">-->
<!--          </el-image>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="行程码" prop="img_xcm">-->
<!--        <template slot-scope="{row}">-->
<!--          <el-image-->
<!--              v-if="row.img_xcm"-->
<!--              style="width: 45px; height: 45px"-->
<!--              :src="row.img_xcm"-->
<!--              :preview-src-list="[row.img_xcm]">-->
<!--          </el-image>-->
<!--        </template>-->

<!--      </el-table-column>-->

      <el-table-column label="来访事由" prop="lf_sy"></el-table-column>

      <el-table-column label="来访时间" prop="create_time"></el-table-column>
      <el-table-column label="门岗人员" prop="mg_name">
        <template slot-scope="{row}">{{ get_user_id_option_data_displays(row.mg_name) }}</template>
      </el-table-column>
      <el-table-column label="门岗确认时间" prop="mg_time"></el-table-column>


      <el-table-column label="申请状态" prop="status">
        <template slot-scope="{row}">{{ get_status_option_data_display(row.status) }}</template>
      </el-table-column>
       <el-table-column label="审核时间" prop="sh_time"></el-table-column>

<!--      <el-table-column label="备注" prop="remarks"></el-table-column>-->

      <el-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="{row}">
          <!--          <el-button title="编辑" circle type="primary" icon="el-icon-edit" @click="editTable(row)"/>-->
          <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消'
                         icon="el-icon-info" icon-color="red" title="删除后不可恢复，确定删除吗？"
                         @confirm="delTable(row)">
            <el-button slot="reference" title="删除" circle type="danger" icon="el-icon-remove"/>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page"
                   :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <div class="batchClass">
      <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
                     title="确定批量删除吗" @confirm="batchDelDataFn">
        <el-button icon="el-icon-delete" type="danger" slot="reference">批量删除</el-button>
      </el-popconfirm>
    </div>
    <el-dialog :title="form.pk?'编辑':'新建'" :visible.sync="formDialogVisable" width="50%"
               :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close
               @close="clearForm">
      <Form v-model="form" ref="FormComp" @checked="submitForm"/>
      <div slot="footer">
        <el-button @click="formDialogVisable=false" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="$refs.FormComp.submit()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Excel导入" :visible.sync="excelDialogVisable" width="95%" :close-on-click-modal="false"
               :close-on-press-escape="false" top="3vh" center destroy-on-close>
      <ImportData @loadData="loadData" @close="excelDialogVisable=false"/>
    </el-dialog>
  </el-card>
</template>
<script>
//
// TEMPLATE_ID: FT251654980880760832
// 字段说明:
// user_id:受访人员
// wx_openid:来访人openid
// lf_name:来访人姓名
// lf_dep:所属单位
// lf_mobile:联系方式
// lf_sy:来访事由
// create_time:来访时间
// status:申请状态
// remarks:备注
// mg_name:门岗扫码
// mg_time:门岗扫码时间
// id_number:身份证
// heat:体温
// img_jkm:健康码
// img_xcm:行程码

import Form from "./Form.vue"
import ImportData from "./ImportData.vue"
import XLSX from "xlsx";
import resource from "@/resource";
import moment from "moment";

const TEMPLATE_ID = "FT251654980880760832";

export default {
  name: "",
  data() {
    return {
      form: {
        user_id: null,
        wx_openid: null,
        lf_name: null,
        lf_dep: null,
        lf_mobile: null,
        lf_sy: null,
        create_time: null,
        status: null,
        remarks: null,
        mg_name: null,
        mg_time: null,
        id_number: null,
        heat: null,
        img_jkm: null,
        img_xcm: null,
        sh_time: null,
      },
      searchForm: {
        user_id: null,
        wx_openid: null,
        lf_name: null,
        lf_mobile: null,
        create_time: [],
        mg_name: null,
        mg_time: null,
      },
      user_id_option_data: [],
      status_option_data: [],
      data: [],
      batchDelData: [],
      loading: false,
      formDialogVisable: false,
      excelDialogVisable: false,
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    ShuoMingTo() {
      this.$router.push({ name: "lfdj-shuoming" });
    },
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID
      }

      if (this.searchForm.user_id) {
        params["user_id"] = this.searchForm.user_id
      }


      if (this.searchForm.wx_openid) {
        params["wx_openid"] = this.searchForm.wx_openid
      }


      if (this.searchForm.lf_name) {

        params["lf_name_like"] = this.searchForm.lf_name

      }
      if (this.searchForm.lf_mobile) {
        params["lf_mobile_like"] = this.searchForm.lf_mobile
      }
      if (this.searchForm.create_time) {
        params["create_time_after"] = this.searchForm.create_time[0]
        params["create_time_before"] = this.searchForm.create_time[1]
      }
      let res = await resource.getList("data", params);
      if (res.data.length > 0) {
        let data = res.data;
        for (let i in data) {
          data[i].user_name = await this.get_user_id_option_data_display(data[i].user_id)
          data[i].mg_names = await this.get_user_id_option_data_displays(data[i].mg_name)
          data[i].status_name = await this.get_status_option_data_display(data[i].status)
          data[i].create_time = moment(data[i].create_time).format("YYYY-MM-DD HH:mm:ss");
          // if (data[i].mg_time && data[i].name) {
            data[i].mg_time =data[i].mg_time ?  moment(data[i].mg_time).format("YYYY-MM-DD HH:mm:ss") : '';
          // }else{
          //   data[i].mg_time = '';
          // }
          if (data[i].sh_time) {
            data[i].sh_time = moment(data[i].sh_time).format("YYYY-MM-DD HH:mm:ss");
          }
        }
      }
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
          await resource.updateObj("data", this.form.pk, {
            ...this.form,
            template_id: TEMPLATE_ID
          });
          this.$message.success("编辑成功!")
        } else {
          await resource.createObj("data", {
            ...this.form,
            template_id: TEMPLATE_ID
          });
          this.$message.success("新建成功!")
        }
        this.formDialogVisable = false;
        this.loadData()
      } catch (error) {

      }
    },
    editTable(row) {
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string' && row[key].startsWith('[') && row[key].endsWith(']')) {
          row[key] = JSON.parse(row[key]);
        }
      }
      this.form = {
        ...row
      };
      this.formDialogVisable = true
    },
    async delTable(row) {
      try {
        let pk_list = [row.pk]; //data-delete
        await resource.createObj("data-delete", {
          template_id: TEMPLATE_ID,
          querys: {pk: pk_list.join(",")},
        });
        this.$message.success("批量删除成功!");
        await this.loadData();

      } catch (err) {
        this.$message.error("删除失败!")
      }
    },
    excelExport() {
      let header = [
        "受访人员",
        // "来访人openid",
        "来访人姓名",
        "所属单位",
        "联系方式",
        "身份证",
        "体温",
        "来访事由",
        "来访时间",
        "申请状态",
        "门岗人员",
        "门岗扫码时间",
        "审核时间",
      ]
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
      let ws = XLSX.utils.json_to_sheet(tmp, {header});
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "单位受访记录.xlsx");
    },
    clearForm() {
      this.form = {

        user_id: null,

        wx_openid: null,

        lf_name: null,

        lf_dep: null,

        lf_mobile: null,

        lf_sy: null,

        create_time: null,

        status: null,

        remarks: null,

        mg_name: null,
        mg_time: null,
        id_number: null,
        heat: null,
        img_jkm: null,
        img_xcm: null,
        sh_time: null,
      }
    },
    async batchDelDataFn() {
      if (this.batchDelData.length === 0) {
        return this.$message.error("请选择要删除的数据!");
      }
      try {
        let pk_list = this.batchDelData.map((i) => i.pk); //data-delete
        await resource.createObj("data-delete", {
          template_id: TEMPLATE_ID,
          querys: {pk: pk_list.join(",")},
        });
        this.$message.success("批量删除成功!");
        await this.loadData();
      } catch (error) {
      }
    },

    get_user_id_option_data_display(value) {
      let option = this.user_id_option_data.filter((item) => {
        return item["pk"] === value;
      });
      if (option.length > 0) return option[0]["full_name"];
      return value;
    },
    get_user_id_option_data_displays(value) {
      let option = this.user_id_option_data.filter((item) => {
        return item["wechart_oid"] === value;
      });
      if (option.length > 0) return option[0]["full_name"];
      return value;
    },

    get_status_option_data_display(value) {
      let option = this.status_option_data.filter((item) => {
        return item["name"] === value;
      });
      if (option.length > 0) return option[0]["name"];
      return value;
    },

    async getLocalDataSource() {

      // let res0 = await resource.getList("user", {"department": "dep251618165655273472"});
      let res0 = await resource.getList("usermin");
      this.user_id_option_data = res0;

      let res7 = await resource.getObjFromList("basetree", {"name": "申请状态", 'org_id': 0});
      if(res7.items.length>0){
        this.status_option_data = res7.items;
      }

    },
  },
  created() {
    this.loadData()
    this.getLocalDataSource()
  },
  computed: {
    excelDownloadTranslate() {
      return {

        // "user_id": "受访人员",
        "user_name": "受访人员",

        // "wx_openid": "来访人openid",

        "lf_name": "来访人姓名",

        "lf_dep": "所属单位",

        "lf_mobile": "联系方式",

        "id_number": "身份证",

        "heat": "体温",

        "lf_sy": "来访事由",

        "create_time": "来访时间",

        // "status": "申请状态",
        "status_name": "申请状态",

        "mg_names": "门岗人员",

        "mg_time": "门岗扫码时间",

        // "img_jkm": "健康码",

        // "img_xcm": "行程码",

        // "remarks": "备注",
        "sh_time": "审核时间",

      }
    }
  },
  components: {
    Form,
    ImportData
  }
}
</script>
<style scoped>
.batchClass {
  position: absolute;
  right: 20px;
  bottom: 17px;
}
</style>