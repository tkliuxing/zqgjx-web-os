<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content" style="background-color: #568af7;">
            <div class="grid_item">
              <span class="grid_item_span1">{{ faqi }}</span>
              <span>我的发起</span>
            </div>
            <img src="@/assets/img/renwuduban_tongji/faqi.png" style="width: 60px;"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content daiban" style="background-color: #fb882f">
            <div class="grid_item">
              <span class="grid_item_span1">{{ daiban }}</span>
              <span>我的待办</span>
            </div>
            <img src="@/assets/img/renwuduban_tongji/daiban.png" style="width: 60px;"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content yiban" style="background-color: #17cca1">
            <div class="grid_item">
              <span class="grid_item_span1">{{ yiban }}</span>
              <span>我的已办</span>
            </div>
            <img src="@/assets/img/renwuduban_tongji/yiban.png" style="width: 60px;"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content yanqi" style="background-color: #02aef8">
            <div class="grid_item">
              <span class="grid_item_span1">{{ yanqi }}</span>
              <span>延期任务</span>
            </div>
            <img src="@/assets/img/renwuduban_tongji/yanqi.png" style="width: 60px;"/>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="margin-bottom: 15px">
      <el-card>
        <span class="el-icon-menu" style="margin-bottom: 15px;font-size: 20px;">完成情况</span>
          <el-row :gutter="20">
            <el-col :span="6" v-for="(item,index) in type" :key="index">
              <el-progress  :color="customColors"  :percentage="item.percentage"></el-progress>
              {{item.name}}
            </el-col>
          </el-row>
      </el-card>
    </div>
    <div style="margin-bottom: 15px">
      <el-card>
        <span class="el-icon-menu title" >异常情况</span>
        <div class="yichang">
          <span class="flex_item" v-for="(item,index) in abnormal" :key="index">
            {{ item.name }}:    {{ item.value }}
          </span>
        </div>
      </el-card>
    </div>
    <el-card style="position:relative">
      <el-form inline>
        <el-form-item label="年限">
          <el-date-picker v-model="searchForm.create_time" type="year" placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadData" type="primary" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form inline>
        <el-form-item>
          <el-button @click="excelExport" type="success" icon="el-icon-download">Excel导出</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" v-loading="loading" element-loading-text='加载中...'
        @selection-change="(data)=>batchDelData = data">
        <el-table-column label="任务名称" prop="task_name"></el-table-column>
        <el-table-column label="任务类型" prop="task_type" width="100px"></el-table-column>
        <el-table-column label="任务状态" prop="task_status" width="100px"></el-table-column>
        <el-table-column label="负责人" prop="fuzeren_name" width="100px"></el-table-column>
        <el-table-column label="执行人" prop="zhixingren" width="100px"></el-table-column>
        <el-table-column label="优先级" prop="level" width="80px"></el-table-column>
        <el-table-column label="任务描述" prop="task_content" width="400px">
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
            <el-link v-if="row.fujian" :href="row.fujian" icon="el-icon-download">
              下载
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
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

import ImportData from "../FaBuRenWu/ImportData.vue";
import XLSX from "xlsx";

import {getList, getObjFromList} from "@/resource";
const TEMPLATE_ID = "FT204884904327495680";
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "",
  data() {
    return {
      searchForm: {
        create_time: moment().format("YYYY"),
      },
      data: [],
      count: [],
      batchDelData: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      faqi: 0, // 我的发起
      daiban: 0, // 我的待办
      yiban: 0, // 我的已办
      yanqi: 0, // 延期任务
      type: null, // 任务类型
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      abnormal:[        // 异常情况
        {name:'将到期',value:0},
        {name:'已延期',value:0},
        {name:'终止',value:0},
      ]
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
    moment,
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID,
        faqiren_id:this.userinfo.pk,

        create_time: this.searchForm.create_time,
      };
      let params1 = {
        template_id: TEMPLATE_ID,
        create_time: this.searchForm.create_time,
      };
      let year = new Date(params.create_time).getFullYear();
      params.create_time = year;
      if (this.searchForm.create_time) {
        params["create_time"] = year;
      }
      params["offset"] = (this.page - 1) * this.pageSize;
      let res = await getList("formdatareport/5855", params);
      this.data = res.data;

      let res1 = await getList("formdatareport/5857", params1);
      this.count = res1.data;
      let res2 = await getList("formdatareport/5856", params);
      this.total = res2.data[0].count;
      this.loading = false;
    },

    excelExport() {
      let header = [
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
      this.count.forEach((i) => {
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
      XLSX.writeFile(wb, "任务统计.xlsx");
    },
    async getRenwu(){
      this.loading = true;
      // 我的发起
      let params_faqi = {
        template_id: TEMPLATE_ID,
        faqiren_id: this.userinfo.pk,
      };
      let res = await getList("data", params_faqi);
      res.forEach(item=>{
        // 异常情况 终止
        if(item.task_status == '终止'){
          this.abnormal[2].value += 1;
        }
      })
      this.faqi = res.length;
      // 我的待办
      let params_daiban = {
        template_id: TEMPLATE_ID,
        zhixingren_id: this.userinfo.pk,
      }
      let res1 = await getList("data", params_daiban);
      res1.forEach(item=>{
        if(item.task_status != '完成'){
          this.daiban += 1;
        }
      })
      // 我的已办
      let params_yiban = {
        template_id: TEMPLATE_ID,
        zhixingren_id: this.userinfo.pk,
      }
      let res3 = await getList("formdatareport/5854", params_yiban);
      this.yiban = res3.data[0].count;

      // 延期任务
      res.forEach(item=>{
        let date = moment(new Date().getTime()).format("YYYY-MM-DD");
        if(item.task_endtime < date){
          this.yanqi += 1;
          // 异常情况 已延期
          this.abnormal[1].value += 1;
        }

        let endDate = moment(new Date().getTime() + 3 * 24*60*60*1000).format('YYYY-MM-DD');
        // 异常情况 到期
        if(item.task_endtime < endDate && item.task_endtime >= date){
          this.abnormal[0].value += 1;
        }
      })
      // 任务类型
      // this.type = await getObjFromList("basetree", { parent_name: "任务类型" ,org_id: 0});
      let res2 = await getObjFromList("basetree", { name: "任务类型" ,org_id: 0});
      if(res2.items.length>0){
        this.type = res2.items;
      }
      this.type.forEach(item=>{
        let data = res.filter(i=>i.task_type == item.name && i.task_status == "完成");
        item.percentage =  Number(((data.length / res.length) * 100).toFixed(1)) || 0
      })
      this.loading = false;
    },
  },
  async created() {
    await this.loadData();
    await this.getRenwu();
  },
  computed: {
    ...mapState(["userinfo"]),
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
    ImportData,
  },
};
</script>
<style scoped lang="scss">
.batchClass {
  position: absolute;
  right: 20px;
  bottom: 17px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.title{
  margin-bottom: 15px;
  font-size: 20px;
}
.yichang{
  display: flex;
  flex-direction: row;
  justify-content: space-between
}
.grid-content {
  border-radius: 4px;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.grid_item{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 18px;
  color: #ffffff;
}
.grid_item_span1{
  margin-bottom: 5px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.flex_item{
  width: 250px;
  border: 1px solid #d3cfcf;
  padding: 10px 20px;
  border-radius: 6px;
}
</style>