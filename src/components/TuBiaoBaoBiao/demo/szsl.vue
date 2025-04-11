<template>
  <el-card>
    <!-- <el-tabs v-model="active" type="card" @tab-click="tabClick">
      <el-tab-pane label="分批次分工种统计考试通过人数" name="0"></el-tab-pane>
      <el-tab-pane label="统计每批次所有证书数量" name="1"></el-tab-pane>
      <el-tab-pane label="全年每工种证书数量" name="2"></el-tab-pane>
      <el-tab-pane label="全年证书数量" name="3"></el-tab-pane>
    </el-tabs> -->
    <div>
      <el-form inline>
        <el-form-item label="年份">
          <el-select v-model="searchForm.piciyear" clearable filterable>
            <el-option
              v-for="(item, index) in searchyear"
              :key="index"
              :value="item"
              :label="item + '年'"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次">
          <!-- <el-input type="number" v-model="searchForm.year" clearable></el-input> -->
          <el-select v-model="searchForm.batch" clearable filterable>
            <el-option
              v-for="(item, index) in 50"
              :key="index"
              :value="item"
              :label="'第' + item + '批'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期次">
          <!-- <el-input type="number" v-model="searchForm.year" clearable></el-input> -->
          <el-select v-model="searchForm.qici" clearable filterable>
            <el-option
              v-for="(item, index) in 50"
              :key="index"
              :value="item"
              :label="'第' + item + '期'"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item v-if="hasPerm('数据分析编辑')">
          <el-button
            type="success"
            icon="el-icon-download"
            @click="downloadExcel"
            >导出Excel</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            icon="el-icon-download"
            @click="dialogVisible=true"
            >查看图表</el-button
          >
        </el-form-item>
      </el-form>
      <report
        :loading="loading"
        :data="data"
        @loadPage="loadPage"
        :showtotal="false"
      ></report>
      <el-pagination
        style="margin-top: 10px"
        @size-change="loadPage"
        @current-change="loadPage"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="80%">
      <tbbb :is-data="tubiao_data" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import report from "@/components/me/report.vue";
import TuBiaoBaoBiao from "@/components/TuBiaoBaoBiao/index.vue";
import {getChartsData} from "@/components/TuBiaoBaoBiao/chart/util";
import { getList, getObj } from "../../../resource";
import XLSX from "xlsx";
import mixin from "@/plugins/mixin";
import _ from "lodash";
export default {
  name: "kaoshengrenshu",
  mixins: [mixin],
  data() {
    return {
      data: {},
      option: {},
      searchyear: [
        2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028,
        2029, 2030,
      ],
      searchForm: {
        year: "",
        bmgz: "",
        zylb: "",
        zslb: "",
        batch: "",
      },
      bmgz: [],
      zylb: [],
      zslb: [],
      active: 0,
      params: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      exportdata: {},
      tubiao_data: null,
      dialogVisible: false,
    };
  },
  components: {
    report: report,
    tbbb: TuBiaoBaoBiao
  },
  methods: {
    tabClick() {
      this.loadData();
    },
    async loadData() {
      this.loading = true;
      let params = {};

      if (this.searchForm.bmgz) {
        params.gz = this.searchForm.bmgz;
      }
      if (this.searchForm.piciyear) {
        params.year = this.searchForm.piciyear;
      }
      if (this.searchForm.batch) {
        params.batch = this.searchForm.batch;
      }
      if (this.searchForm.qici) {
        params.qici = this.searchForm.qici;
      }

      let res = await getObj("formdatareport", 3013, params);
      this.tubiao_data = getChartsData(res, '-----', [res.header[2], res.header[6], res.header[7]], res.header[2], 'bar');
      this.exportdata = res.data;

      this.total = res.data.length;
      this.getfenye(res);

      this.loading = false;
    },
    getfenye(res) {
      if (res.data.length > this.params.pageSize) {
        res.data = res.data.slice(
          (this.params.page - 1) * this.params.pageSize,
          this.params.pageSize * this.params.page
        );
      }
      this.data = res;
    },
    loadPage(params) {
      this.params.page = params;
      this.loadData();
    },
    async getzylb() {
      let res = await getList("data", {
        template_id: "FT161398821091192832",
      });
      this.zylb = res;
      this.bmgz = await getList("data", {
        template_id: "FT156218786785361920",
        o: "ordernumber",
      });
      let zslb = [];
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        zslb.push(element.id_type);
      }
      zslb = [...new Set(zslb)];
      // console.log(zslb);
      this.zslb = zslb;
    },
    async downloadExcel() {
      let header = [];

      let tmp = [];
      this.exportdata.forEach((i) => {
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
      XLSX.writeFile(
        wb,
        `${this.searchForm.year ? this.searchForm.year : ""}${
          this.searchForm.zylb ? this.searchForm.zylb : ""
        }${this.searchForm.bmgz ? this.searchForm.bmgz : ""}学员信息汇总.xlsx`
      );
    },
        filterdep(pk) {
            let value = '';
            if (pk) {

                value = this.option.department.find(i => {
                    return i.pk == pk;
                })
            } else {
                value = ''
            }
            if (value.name) {
                return value.name
            } else {
                return ''
            }
        },
  },
   watch: {
        data: {
            deep: true,
            handler(newval, oldval) {
                if (newval != oldval) {
                    for (let i = 0; i < newval.data.length; i++) {
                        const item = newval.data[i];
                        item.dep = newval.data[i].department
                        if (item.department) {

                            let dep = this.filterdep(item.department);
                            item.department = dep;
                        }
                    }

                }

            }
        }
    },
  computed: {
    excelDownloadTranslate() {
      return {
        department:'部门',
        batch:'批次',
        qici:'期次',
        handle_type:'培训类型',
        szsl:'三证数量',
        lzsl:'两证数量',
        dzsl:'单证数量',
        signup_date: "报名日期",
        name: "姓名",
        gender: "性别",
        health: "身体状况",
        education_level: "文化程度",
        id_card: "身份证号码",
        work_place: "工作单位",
        category: "培训类型",
        remark: "备注",
        signup_type: "准操项目",
        batch: "批次",
        qici: "期次",
        contact: "联系方式",
        channel_source: "渠道来源",
        paper: "纸质资料",
        electronic_data: "电子资料",
        learn_card: "学习卡号",
        amount_received: "已付款金额",
        pay_type: "付款方式",
        sjqk: "收据情况",
        receipt_content: "收据说明",
        fpqk: "发票情况",
        train_date: "培训日期",
        exam_date: "考试日期",
        lilun: "理论成绩",
        shicao: "实操成绩",
        lilun_bk: "理论补考成绩",
        shicao_bk: "实操补考成绩",
        lilun_num: "理论补考次数",
        shicao_num: "实操补考数",
        card_date: "出证日期",
        certificate_num: "证书号",
        certificate_range: "证件有效期",
        zpx_time: "在培训时间",
        certificate_sign: "发证签字",
        hrqk: "换人情况",
        tfqk: "退费情况",
        refund_desc: "退费说明",
      };
    },
  },
  async created() {
    this.loading = true;
    let rep = await this.$http.get(`/flatdepartment/`);
    this.option.department = rep.data;
    await this.getzylb();
    let res = await getList("data", { template_id: "FT156232675356413952" });
    this.option.batch = res;
    this.loading = false;
    this.loadData();0
  },
};
</script>

<style scoped>
/deep/ .el-table__footer-wrapper tbody td.el-table__cell,
.el-table__header-wrapper tbody td.el-table__cell {
  text-align: center;
}
</style>
