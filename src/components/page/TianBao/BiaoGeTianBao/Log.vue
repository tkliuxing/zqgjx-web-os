<template>
  <el-card style="position:relative">
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
      <el-form-item label="操作时间">
        <el-date-picker v-model="searchForm.create_time" clearable value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="loadData" type="primary" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}"
              v-loading="loading" element-loading-text='加载中...'>
      <el-table-column label="操作员" width="200px" prop="user_id">
        <template slot-scope="{ row }">
          {{ get_user_id_option_data_display(row.user_id) }}
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="150px" prop="create_time">
        <template slot-scope="{row}">
          {{ str_date(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作内容" prop="log_context">
        <template slot-scope="{row}">
          <div v-html="row.content"></div>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" width="150px">-->
<!--        <template slot-scope="{row}">-->
<!--          <el-button title="删除" type="primary" icon="el-icon-edit" @click="delTable(row)">删除(临时用)</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page"
                   :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
import resource, {
  getList,
  deleteObj
} from "@/resource"
import XLSX from "xlsx";
import moment from "moment";
import {mapState} from "vuex";

export default {
  name: "Log",
  data() {
    return {
      tid: this.$route.params.tid || null,
      searchForm: {
        obj_id: null,
        log_user_id: null,
        log_user_name: null,
        log_type: null,
        log_event: null,
        create_time: null,
      },
      data: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      allUser: [],
    }
  },
  methods: {
    str_date(date) {
      if (date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss")
      }
      return "-"
    },
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id:'FT341135442506866688',
        user_id: this.userinfo.pk,
        id:this.$route.params.id,
        o: '-create_time'
      }
      if (this.searchForm.create_time) {
        params["create_time_after"] = this.searchForm.create_time;
        params["create_time_before"] = moment(this.searchForm.create_time).add(1, 'day').format("YYYY-MM-DD");
      }

      let res = await getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },
    async getloadDatasource(){
      this.loading = true;
      this.allUser = await getList('usermin');
      this.loading = false;
    },
    get_user_id_option_data_display(value) {
      let option = this.allUser.filter((item) => {
        return item.pk === value;
      });
      return option.length > 0 ? option[0].full_name : value;
    },
    async delTable(row) {
      try {
        await deleteObj("systemlog", row.pk, {
          sys_id: this.$store.state.sys_id
        })
        this.$message.success("删除成功!")
        await this.loadData()
      } catch (err) {
        this.$message.error("删除失败!")
      }
    },

  },
  async created() {
    this.tid = this.$route.params.tid;
    await this.loadData();
    await this.getloadDatasource();
  },
  computed: {
    ...mapState(['userinfo'])
  },
}
</script>
