<template>
  <div class="jieguolist">
    <el-card class="box-card">
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.go(-1)"
            >返回
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-download"
            round
            @click="exportExcel"
            >导出</el-button
          >
        </el-form-item>
        <template v-if="shijuan.show_result === '否'">
          <el-form-item>
            <el-radio-group v-model="filters.is_result" @change="loadData">
              <el-radio-button label="否">未判分</el-radio-button>
              <el-radio-button label="是">已判分</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
      <el-table
        v-loading="loading"
        element-loading-text="正在加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        ref="table"
        :data="data"
        border
      >
        <el-table-column label="答题时间" width="180">
          <template slot-scope="{ row }">
            {{ transTime(row.create_time) }}
          </template>
        </el-table-column>
        <template>
          <el-table-column prop="department_name" label="部门">
          </el-table-column>
          <el-table-column prop="user_name" label="姓名">
          </el-table-column>
          <el-table-column prop="defen" label="问答得分" >
          </el-table-column>
        </template>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="{ row }">
            <el-button type="success" round @click="viewDajuan(row)"
              >查看</el-button
            >
            <el-button type="primary" round @click="panjuan(row)"
              >判卷</el-button
            >
            <el-popconfirm title="确定删除吗？" @confirm="deleteRow(row)">
            <el-button
              type="danger"
              round
              class="deleteButton"
              slot="reference"
              icon="el-icon-remove"
            >
              删除</el-button
            >
              <el-button round type="warning">{{data.defen}} </el-button>

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
      >
      </el-pagination>
    </el-card>
     <view-dajuan
       :id="dati_id"
       :show="showDaJuanDialog"
       @beforeClose="showDaJuanDialog = false"
     />
    <view-panjuan
      :id="dati_id"
      :show="showPanJuanDialog"
      @beforeClose="panjuanDone"
    />
  </div>
</template>

<script>
import moment from "moment";
import resource from "@/resource.js";
import viewDajuan from "./compnents/view_dajuan.vue";
import panJuan from "./compnents/panjuan.vue";
import XLSX from "xlsx";
import FileSaver from "file-saver";
const TMP_ID_DT = "FT138522014027272192"; //答题
const TMP_ID_JG = "FT336770984361844736"; //结果
const TMP_ID_SJ = "FT138149866856067072"; //试卷
export default {
  name: "JieGuoList",
  props: ["id"],
  components: { "view-dajuan": viewDajuan, "view-panjuan": panJuan },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      data: [],
      shijuan: {
        show_result: "是",
        need_login: "是",
      },
      filters: {},
      showDaJuanDialog: false,
      showPanJuanDialog: false,
      dati_id: null,
      loading: false,

    };
  },
  methods: {
    // 加载答题记录
    async loadData() {
      this.loading = true;
      let params = {
        ...this.filters,
        page: this.page,
        pageSize: this.pageSize,
        shijuan_id: this.id,
        biz_id: this.$bizCode.kaoshi_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_DT,
      };
      let resp = await resource.getList("data", params);
      this.data = resp.data;
      this.total = resp.count;
      this.loading = false;
    },

    // 删除答题记录
    async deleteRow(row) {
      try {
        try {
          await resource.deleteList(
            {
              pk: row.pk,
            },
            row.template_id
          );
          await resource.deleteList(
            {
              dati_id: row.pk,
            },
            TMP_ID_JG
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
    // 时间格式转换
    transTime(timeStr) {
      return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
    },
    // 导出
    exportExcel() {
      let header = [
        "答题时间",
        "部门",
        "姓名",
        "得分"
      ]
      let tmp = [];
      this.data.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) {
            if(key == 'create_time'){
              obj[this.excelDownloadTranslate[key]] = this.transTime(i[key]);
            }else{
              obj[this.excelDownloadTranslate[key]] = i[key];
            }
          }
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "测评结果.xlsx");
    },

    viewDajuan(row) {
      this.dati_id = row.pk;
      this.showDaJuanDialog = true;
    },

    panjuan(row) {
      this.dati_id = row.pk;
      this.showPanJuanDialog = true;
    },

    panjuanDone() {
      this.showPanJuanDialog = false;
      this.loadData();
    },

  },
  computed:{
    excelDownloadTranslate(){
      return {
        "create_time": "答题时间",
        "department_name": "部门",
        "user_name": "姓名",
        "defen": "得分"
      }
    }
  },
  async mounted() {
    await this.loadData();
  },
};
</script>

<style scoped>
.deleteButton{
    width: 56px;
    height: 32px;
    padding-left: 5px;
    margin-left: 9px;
}
</style>
