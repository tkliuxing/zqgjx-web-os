<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item label="请输入机构名称:">
          <el-input clearable v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="()=>{this.page =1 ; this.getLoadData()}" round>搜索</el-button>
          <span style="color: red;margin-left: 15px">注意：每个模块如果未设置时间或时间小于当前时间，那么只能添加一条数据，为非会员状态；只有会员状态可以添加多条数据！</span>
        </el-form-item>
      </el-form>
      <el-table
        :data="data"
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
        >
          <template slot-scope="{ row }">
            {{ moment(row.create_time).format('yyyy-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="end_date"
          label="到期时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button @click="setting(row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="getLoadData" @current-change="getLoadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="设置"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      >
      <el-form inline :model="isguoqi" label-width="100px" v-if="dialogVisible">
        <el-row>
          <el-col :span="7" v-for="(item, index) in modelData" :key="index">
            <!-- 循环modelData并显示每一项的内容 -->
            <el-form-item>
              {{ item.name }}
              <!-- 时间选择器 -->
              <el-date-picker v-model="isguoqi[item.name]" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="saveData">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import resource, {getObjFromList} from "@/resource";
import moment from "moment";
import {mapState} from "vuex";
const TEMPLATE_ID = 'FT342205780363792384';
export default {
  data() {
    return {
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      searchForm:{
        name: null,
      },
      dialogVisible: false,
      modelData: [],
      isguoqi:{},
      pk:null, // 每一项的pk
      form: {
        ids: null,
        isguoqi: null,
        create_time: null,
        dep_id: null,
        user_id: null,
        org_ids: null,
      },
      org_ids: null,
    }
  },
  computed:{
    ...mapState(['userinfo']),
    moment() {
      return moment
    }
  },
  async mounted() {
    await this.getLoadData();
    await this.getLocalDataSource();
  },
  components:{},
  methods:{
    cancel(){
      this.dialogVisible = false;
      this.isguoqi = {};
    },
    setting(val){
      this.org_ids = val.org_id;
      this.pk = val.pk;
      this.editData(val.pk);
      this.dialogVisible = true;
    },
    async editData(val){
      this.loading = true;
      try{
        let params = {
          template_id: TEMPLATE_ID,
          ids:val,
        }
        let resp = await resource.getList('data',params);
       if(resp.length>0){
         this.form = resp[0];
         this.isguoqi = JSON.parse(resp[0].isguoqi);
       }else{
         this.isguoqi = {};
       }
      }catch (e) {
        console.log(e)
      }
      this.loading = false;
    },
    async saveData(){
      this.loading = true;
      for (const key in this.isguoqi) {
        if (this.isguoqi[key] !== null && typeof this.isguoqi[key] === "object") {
          this.isguoqi[key] = JSON.stringify(this.isguoqi[key]);
        }
      }
      try{
        this.form.create_time = this.moment().format('yyyy-MM-DD HH:mm:ss');
        this.form.dep_id = this.userinfo.department;
        this.form.user_id = this.userinfo.pk;
        this.form.ids = this.pk;
        this.form.org_ids = this.org_ids;
        this.form.isguoqi = JSON.stringify(this.isguoqi);
        if (this.form.pk) {
          await resource.updateObj("data", this.form.pk, {
            ...this.form,
            template_id: TEMPLATE_ID
          });
          this.$message.success("设置成功!");

        } else {
          let tem = await resource.createObj("data", {
            ...this.form,
            template_id: TEMPLATE_ID
          });
          this.$message.success("设置成功!")
        }
        this.dialogVisible = false;
      }catch (e) {
        console.log(e)
      }
      this.loading = false;
    },
    async getLoadData(){
      this.loading = true;
      try {
        let params = {
          page: this.page,
          pageSize: this.pageSize,
        }
        if(this.searchForm.name){
          params.search = this.searchForm.name
        }
        let resp = await resource.getList('systemorg',params);
        this.total = resp.count;
        this.data = resp.data;
        //bt342206002070765568
      }catch (e) {
        console.log(e)
      }
      this.loading = false;
    },
    async getLocalDataSource(){
      this.loading = true;
      try{
        let params = {
          name:'政企模块',
          org_id: 0,
        }
        let resp = await resource.getObjFromList('basetree',params);

        this.modelData = resp.items;
      }catch (e) {
        console.log(e)
      }
      this.loading = false;
    },
  }
}
</script>
<style scoped>

</style>