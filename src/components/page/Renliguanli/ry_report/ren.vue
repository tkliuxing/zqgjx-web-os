<template>
  <div class="peoplelist">
    <div class="search-criteria">
      <el-form label-width="120px" size="mini" @submit.native.prevent>
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门名称">
              <el-select v-model="searchForm.department" multiple clearable filterable style="width:100%">
                <el-option v-for="(item, index) in department_option_data" :key="index" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input clearable v-model="searchForm.name" placeholder="请输入姓名..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄段">
              <el-select v-model="searchForm.nianling" clearable filterable style="width:100%">
                <el-option v-for="(item, index) in nianling_option_data" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="最高学历">
              <el-select v-model="searchForm.education" clearable multiple style="width:100%">
                <el-option v-for="item in education_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学位">
              <el-input v-model.trim="searchForm.xuewei" clearable style="width: 100%" @keyup.enter.native="loadData()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="聘任岗位">
              <el-input v-model.trim="searchForm.zhiwu" clearable style="width: 100%" @keyup.enter.native="loadData()"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="职称">
              <el-input v-model.trim="searchForm.zhicheng" clearable style="width: 100%" @keyup.enter.native="loadData()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="聘期">
              <el-input v-model.trim="searchForm.pinqi" clearable style="width: 100%" @keyup.enter.native="loadData()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="专业">
              <el-input v-model.trim="searchForm.majors" clearable style="width: 100%" @keyup.enter.native="loadData()"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 20px;width: 100%; text-align: right;">
        <div style="margin-right: 150px">
          <el-button @click="()=>{this.page=1;this.loadData('current');}" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
    </div>
    <div class="ren_table">
      <el-table style="width: 100%;height: 500px;overflow: auto"
                height="500px"
                :data="pageData"
                border stripe :cell-style="{textAlign:'center'}"
                :header-cell-style="columnStyle" v-loading="dataloading" element-loading-text='加载中...'
                @selection-change="handleSelectionChange"
      >
        <el-table-column label="基本信息">
          <el-table-column label="头像">
            <template slot-scope="{ row }">
              <div style="display: flex;justify-content: center;align-items: center">
                <img v-if="row.photo" :src="JSON.parse(row.photo).file" width="80px" height="100px" @click="showphoto(row.photo)">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="编号" prop="bianhao" width="45"></el-table-column>
          <el-table-column label="部门" prop="department" width="100">
            <template slot-scope="{ row }">
              {{ get_department_option_data_display(row.department) }}
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="name" width="70">
            <template slot-scope="{ row }">
              <el-link type="primary" @click="viewTable(row)">{{ row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="年龄" prop="nianling" width="60"></el-table-column>
          <el-table-column label="民族" prop="nation" width="60"></el-table-column>
          <el-table-column label="出生年月" prop="birthday" width="80">
            <template slot-scope="{ row }">
              {{ moment(row.birthday).format("YYYY年MM月DD日") || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="婚姻状况" prop="marital_status" width="100"></el-table-column>
          <el-table-column label="政治面貌" prop="mianmao" width="100"></el-table-column>
          <el-table-column label="入党时间" prop="rudang_date" width="100"></el-table-column>
        </el-table-column>
        <el-table-column label="工作情况">
          <el-table-column label="参工时间" prop="ruzhi_date" width="100"></el-table-column>
          <el-table-column label="职务" prop="yn_zw" width="100"></el-table-column>
          <el-table-column label="职务获取时间" prop="yn_zw_date" width="100"></el-table-column>
          <el-table-column label="首次合同期限" prop="" width="200">
            <template slot-scope="{ row }">
              {{ row.shouci || "---" }} - {{ row.ht_end_date || "---" }}
            </template>
          </el-table-column>
          <el-table-column label="续聘期限" prop="" width="200">
            <template slot-scope="{ row }">
              {{ row.xupin || "---" }} - {{ row.xp_end_date || "---" }}
            </template>
          </el-table-column>
          <el-table-column label="聘期" prop="pinqi" width="100"></el-table-column>
          <el-table-column label="聘用方式" prop="pinyongfangshi" width="200"></el-table-column>
          <el-table-column label="是否在职" prop="zaizhi" width="100"></el-table-column>
          <el-table-column label="职称" prop="zhicheng" width="100"></el-table-column>
          <el-table-column label="职称取得时间" prop="zc_date" width="100"></el-table-column>
          <el-table-column label="聘任岗位（职务）" prop="zhiwu" width="100"></el-table-column>
          <el-table-column label="聘岗取得时间" prop="zw_date" width="100"></el-table-column>
          <el-table-column label="行政职务" prop="xingzhengzhiwu" width="100"></el-table-column>
          <el-table-column label="实配职数" prop="shipeizhishu" width="100"></el-table-column>
        </el-table-column>
        <el-table-column label="学历信息">
          <el-table-column label="最高学历" prop="education" width="100"></el-table-column>
          <el-table-column label="最高学历毕业院校" prop="byyx_s_2" width="200"></el-table-column>
          <el-table-column label="最高学历毕业时间" prop="biyedate" width="100">
             <template slot-scope="{ row }">
              {{ moment(row.biyedate).format("YYYY年MM月DD日") || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="最高学历学位" prop="xuewei" width="100"></el-table-column>
          <el-table-column label="全日制学历" prop="fulltime_education" width="100"></el-table-column>
          <el-table-column label="全日制学历毕业院校" prop="byyx_s_1" width="100"></el-table-column>
          <el-table-column label="全日制学历毕业时间" prop="qrz_date" width="100"></el-table-column>
          <el-table-column label="全日制学历专业" prop="qrz_zhuanye" width="100"></el-table-column>
          <el-table-column label="全日制学历学位" prop="qrz_xuewei" width="100"></el-table-column>
        </el-table-column>

      </el-table>
    </div>
<!--    <el-pagination style="background-color: #fff;padding: 10px 10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page" :page-sizes="[10,50, 100, 200, 500]" :page-size.sync="pageSize"-->
<!--                   layout="total, sizes, prev, pager, next, jumper" :total="total">-->
<!--    </el-pagination>-->
        <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog
      title="照片"
      :visible.sync="dialogVisiblePhoto"
      width="18%"
    >
      <img :src="photo" ref="print" width="300" height="400">
      <span slot="footer">
        <el-button @click="dialogVisiblePhoto=false">关闭</el-button>
        <!--        <el-button type="primary" @click="printDocument">打印</el-button>-->
      </span>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="LookformDialogVisable" width="85%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close @close="clearForm">
      <Detail v-if="LookformDialogVisable" v-model="form" ref="FormComp"/>
      <div slot="footer">
        <el-button @click="LookformDialogVisable=false" icon="el-icon-close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XLSX from "xlsx";
import {mapState} from "vuex";
import resource, {getList, createObj, getObj, updateObj, deleteObj, getObjFromList, patchObj} from "@/resource";
import moment from "moment";
import Detail from "@/components/page/Renliguanli/yuangongsystem/Detail.vue";

const TEMPLATE_ID = "FT336781955202547712";

export default {
  components: {Detail},
  data() {
    return {
      uids: [],
      searchForm: {
        department: [],
        name: [],
        nianling: null,
        education: [],
        xuewei: null,
        zhiwu: null,
        zhicheng: null,
        pinqi: null,
        majors: null,
      },
      canjiagongzuo_time: {
        after_year: null,
        before_year: null,
        after_day: null,
        before_day: null,
        after_month: null,
        before_month: null,
      },
      ruzhi_time: {
        after_year: null,
        before_year: null,
        after_day: null,
        before_day: null,
        after_month: null,
        before_month: null,
      },
      nianling_option_data: ['20以下', '20-30', '30-40', '40-50', '50-60', '60以上'], // 年龄段

      data: [],
      batchDelData: [],
      loading: false,
      dataloading: false,
      formDialogVisable: false,
      excelDialogVisable: false,
      page: 1,
      pageSize: 10,
      total: 0,
      pageData: [],

      department_option_data: [], // 部门
      allpeople: [], // 人员
      education_option_data: [], // 学历
      dialogVisible: false,
      currentData: [],
      currentloading: false,
      chengguoData: [], // 当前成果数据

      type: null,
      multipleSelection: [], // 多选
      ViewDialogVisible: false,
      tableData: [], // 对比查看的数据
      biaotouData: [], // 对比查看的表头数据
      countData: 0,
      moment: moment,
      dialogVisiblePhoto: false,
      photo: null,
      LookformDialogVisable: false,
      form: null,

    };
  },
  props: {
    keys: String,
  },
  created() {
    this.getLocalDataSource();
    this.loadData();
    this.loadUsers();
  },

  methods: {
    showphoto(row) {
      this.dialogVisiblePhoto = true;
      this.photo = JSON.parse(row).file;
    },
    // 打印图片
    printDocument() {
      this.$print(this.$refs.print)
    },

    reset() {
      this.page = 1;
      this.searchForm = {
        department: [],
        name: [],
        nianling: null,
        education: [],
        xuewei: null,
        zhiwu: null,
        zhicheng: null,
        pinqi: null,
        majors: null,
      }
      this.pageData = [];
      this.total = 0;
      // this.$emit('clearValue')
    },
    columnStyle({row, column, rowIndex, columnIndex}) {
      let cellStyle1;
      let cellStyle2;
      let cellStyle3;
      let cellStyle4;
      cellStyle1 = "color: #ffffff;background:#54A9A6 !important;text-align: center;"
      cellStyle2 = "color: #363739;background:#E7E6E6 !important;text-align: center;"
      cellStyle3 = "color: #ffffff;background:#2F75B5 !important;text-align: center;"
      cellStyle4 = "color: #363739;background:#FFD966 !important;text-align: center;"

      if (column.label == '基本信息') {
        return cellStyle2
      }
      if (column.label == '工作情况') {
        return cellStyle3
      }
      if (column.label == '学历信息') {
        return cellStyle1
      }
      if (column.label == '成果') {
        return cellStyle4
      }
      return 'text-align: center;'
    },
    // 跳转人员详情页

    // 改变每页大小的回调
    handleSizeChange(val) {
      this.pageSize = val
      this.pageData = this.queryByPage()
    },
    // 改变当前页的回调
    handleCurrentChange(val) {
      this.page = val
      this.pageData = this.queryByPage()
    },
    // 实现分页的方法
    queryByPage() {
      // 起始位置 = (当前页 - 1) x 每页的大小
      const start = (this.page - 1) * this.pageSize
      // 结束位置 = 当前页 x 每页的大小
      const end = this.page * this.pageSize

      return this.data.slice(start, end)
    },
    // 改变每页大小的回调
    handleSizeChanges(val) {
      this.pageSizes = val
      this.currentData = this.queryByPages();
    },
    // 改变当前页的回调
    handleCurrentChanges(val) {
      this.pages = val
      this.currentData = this.queryByPages();
    },
    // 实现分页的方法
    queryByPages() {
      // 起始位置 = (当前页 - 1) x 每页的大小
      const start = (this.pages - 1) * this.pageSizes
      // 结束位置 = 当前页 x 每页的大小
      const end = this.pages * this.pageSizes
      return this.chengguoData.slice(start, end)
    },
    async loadData(val) {
      this.dataloading = true;
      this.page = 1;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID,
      }
      // 带有关键字搜索
      let keys = this.keys
      let flag = true;
      if (keys) {
        flag = false;
      }
      // 如果是点击的当前的搜索,就不清空全局搜索条件,否则清空
      if (!val) {
        if (!flag) {
          this.searchForm = {
            department: [],
            name: [],
            nianling: null,
            education: [],
            xuewei: null,
            zhiwu: null,
            zhicheng: null,
            pinqi: null,
            majors: null,
          }
          this.canjiagongzuo_time = {
            after_year: null,
            before_year: null,
            after_month: null,
            before_month: null,
          }
          this.ruzhi_time = {
            after_year: null,
            before_year: null,
            after_month: null,
            before_month: null,
          }
        }
      }
      const nianlin = {'20以下':[0,19], '20-30':[20,29], '30-40':[30,39], '40-50':[40,49], '50-60':[50,59], '60以上':[60,150]}

      // 全局搜索
      if (this.keys) {
        params.search = this.keys.replace(/[,，;；.。\/、]/g, '|');
      }
      // 部门
      if (this.searchForm.department.length > 0) {
        params.department_name = this.searchForm.department.join(',');
      }
      // 姓名
      if (this.searchForm.name.length > 0) {
        params.name_like = this.searchForm.name;
      }
      // 年龄段
      if (this.searchForm.nianling) {
        params.nianling_range_min = nianlin[this.searchForm.nianling][0];
        params.nianling_range_max = nianlin[this.searchForm.nianling][1];
      }
      // 学历
      if (this.searchForm.education.length > 0) {
        params.education = this.searchForm.xueli.join(',');
      }
      // 学位
      if (this.searchForm.xuewei) {
        params.xuewei_like = this.searchForm.xuewei;
      }
      // 职务
      if (this.searchForm.zhiwu) {
        params.zhiwu_like = this.searchForm.zhiwu;
      }
      // 职称
      if (this.searchForm.zhicheng) {
        params.zhicheng_like = this.searchForm.zhicheng;
      }
      // 岗位
      if (this.searchForm.pinqi) {
        params.pinqi_like = this.searchForm.pinqi;
      }
      // 专业
      if (this.searchForm.majors) {
        params.majors_like = this.searchForm.majors;
      }


      if (this.keys
        || this.searchForm.department.length > 0
        || this.searchForm.name
        || this.searchForm.nianling
        || this.searchForm.education.length > 0
        || this.searchForm.xuewei
        || this.searchForm.zhiwu
        || this.searchForm.zhicheng
        || this.searchForm.pinqi
        || this.searchForm.majors
      ) {
        let resp = await getList("data", params);

        this.data = resp.data;
        // this.pageData = this.queryByPage();
        this.pageData = resp.data;
        // this.total = resp.data.length;
        this.total = resp.count;
        this.dataloading = false;
      } else {
        this.$message({
          message: '请输入搜索内容',
          type: 'warning'
        });
        this.dataloading = false;
        return;
      }
    },
    excelExport() {
      let header = [
        "工号",
        "姓名",
        "性别",
        "联系电话",
        "身份证号",
        "出生日期",
        "毕业院校",
        "毕业时间",
        "学历",
        "学位",
        "专业",
        "参加工作时间",
        "入职时间",
        "职务",
        "职称",
        "岗位",
        "转入本岗日期",
        "离职时间",
        "退休时间",
        "获得称号",
        "证书",
        "专利",
        "论文",
        "著作",
        "标准",
        "项目",
        "本年度经费使用",
        "备注",
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
      let ws = XLSX.utils.json_to_sheet(tmp, {header});
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "职工管理.xlsx");
    },
    clearForm() {
      this.form = {
        job_number: null,
        name: null,
        gender: null,
        certificate_number: null,
        birthday: null,
        graduated_college: null,
        graduation_date: null,
        education: null,
        academic_degree: null,
        majors: null,
        job_time: null,
        inauguration_date: null,
        job_position: null,
        profession: null,
        job_post: null,
        zhaunru_date: null,
        lizhi_date: null,
        tuixiu_date: null,
        chenghao: null,
        zhengshu: null,
        remark: null,
        user_id: null,
        phone: null,
      };
      this.$refs.FormComp.$refs.form.resetFields();
    },
    get_department_option_data_display(value) {
      let option = this.department_option_data.filter((item) => {
        return item.pk === value;
      });
      return option.length > 0 ? option[0].name : value;
    },

    async getLocalDataSource() {
      try {
        // 部门
        let rep = await this.$http.get(`/flatdepartment/`);
        this.department_option_data = rep.data;

        // 人员
        let allpeople = await getList("usermin");
        this.allpeople = allpeople;

        // 学历
        let education = await getObjFromList("basetree", {"name": "人力-最高学历字段", isroot: true, org_id: this.userinfo.org_id});
        this.education_option_data = education.items;
      } catch (e) {

      }
    },
    async loadUsers() {
      this.loading = true;
      let allpeople = await getList("usermin");
      // 过滤掉department为dep280995391926677504,dep374125845711179776的人员
      allpeople = allpeople.filter(
        (item) =>
          item.department != "dep280995391926677504" &&
          item.department != "dep374125845711179776"
      );
      this.users = allpeople;
      this.loading = false;
    },
    viewTable(row) {
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string' && row[key].startsWith('[') && row[key].endsWith(']')) {
          row[key] = JSON.parse(row[key]);
        }
      }
      if (typeof row.fujian === 'string') {
        row.fujian = [];
      }

      this.form = {...row};
      this.LookformDialogVisable = true
    },
  },


  computed: {
    ...mapState(["userinfo"]),
    excelDownloadTranslate() {
      return {
        job_number: "工号",
        name: "姓名",
        gender: "性别",
        certificate_number: "身份证号",
        birthday: "出生日期",
        graduated_college: "毕业院校",
        graduation_date: "毕业时间",
        education: "学历",
        academic_degree: "学位",
        majors: "专业",
        job_time: "参加工作时间",
        inauguration_date: "入职时间",
        job_position: "职务",
        profession: "职称",
        job_post: "岗位",
        zhaunru_date: "转入本岗日期",
        lizhi_date: "离职时间",
        tuixiu_date: "退休时间",
        chenghao: "获得称号",
        zhengshu: "证书",
        zhuanli: "专利",
        lunwen: "论文",
        zhuzuo: "著作",
        biaozhun: "标准",
        xiangmu: "项目",
        jingfei: "本年度经费使用",
        remark: "备注",
        // user_id: "用户id",
        phone: "联系电话",
      };
    },
    isCountDataEmpty() {
      return this.countData == 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.peoplelist {
  width: 100%;
  position: relative;
}

.chengguo {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ren_table {
  width: auto;
  text-align: center;
  margin-top: 20px
}

.search-criteria {
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 5px
}

.batchClass {
  position: absolute;
  right: 20px;
  bottom: 17px;
}
</style>
