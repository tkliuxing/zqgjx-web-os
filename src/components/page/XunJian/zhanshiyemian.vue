<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content" style="background-color: #568af7;">
            <div class="grid_item">
              <span class="grid_item_span1">{{ renwutongji }}</span>
              <span>任务统计</span>
            </div>
            <img src="@/assets/img/renwuduban_tongji/faqi.png" style="width: 60px;" />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content daiban" style="background-color: #fb882f">
            <div class="grid_item">
              <span class="grid_item_span1">{{ xunjiandianshu }}</span>
              <span>巡检点数</span>
            </div>
            <img src="@/assets/img/renwuduban_tongji/daiban.png" style="width: 60px;" />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content yiban" style="background-color: #17cca1">
            <div class="grid_item">
              <span class="grid_item_span1">{{ leijixunjian }}</span>
              <span>累计巡检</span>
            </div>
            <img src="@/assets/img/renwuduban_tongji/yiban.png" style="width: 60px;" />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content yanqi" style="background-color: #02aef8">
            <div class="grid_item">
              <span class="grid_item_span1">{{ yichangcishu }}</span>
              <span>异常次数</span>
            </div>
            <img src="@/assets/img/renwuduban_tongji/yanqi.png" style="width: 60px;" />
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-card class="dianshu">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-button round type="primary" icon="el-icon-download" @click="download" style="margin-bottom: 5px">导出</el-button>
          <el-tab-pane label="累计巡检点数" name="first">
            <el-table :data="dataXunjian" stripe style="width: 100%">
              <el-table-column prop="xunjiantime" label="巡检时间" width="180">
                <template slot-scope="{ row }">
                  {{ moment(row.xunjiantime).format('yyyy-MM-DD HH:mm:ss') }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="巡检人">
              </el-table-column>
              <el-table-column prop="yichang" label="是否异常">
              </el-table-column>
              <el-table-column prop="shuoming" label="说明">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="累计异常次数" name="second">
            <el-table :data="yichang" stripe style="width: 100%">
              <el-table-column prop="xunjiantime" label="巡检时间" width="180">
                <template slot-scope="{ row }">
                  {{ moment(row.xunjiantime).format('yyyy-MM-DD HH:mm:ss') }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="巡检人">
              </el-table-column>
              <el-table-column prop="yichang" label="是否异常">
              </el-table-column>
              <el-table-column prop="shuoming" label="说明">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>

    </div>
  </div>
</template>

<script>
import resource from "@/resource";
import XLSX from "xlsx";
import { mapState } from 'vuex';

export default {
  name: "zhanshiyemian",
  data() {
    return {
      loading: false,
      renwutongji: 0,
      xunjiandianshu: 0,
      leijixunjian: 0,
      yichangcishu: 0,
      dataXunjian: [],
      page: 1,
      pageSize: 10,
      yichang: [],
      activeName: "first",
      daochuData: null,
    };
  },
  computed: {
    ...mapState(['userinfo']),
    excelDownloadTranslate() {
      return {
        xunjiantime: "巡检时间",
        name: "巡检人",
        yichang: "是否异常",
        shuoming: "说明",
      };
    },
  },
  components: {},
  async mounted() {
    await this.getLoadData();
  },
  methods: {
    handleClick(tab, e) {
      if (tab.name == "second") {
        this.daochuData = "second";
      }
    },
    download() {
      let data = [];
      if (this.daochuData == "second") {
        data = this.yichang;
      } else {
        data = this.dataXunjian;
      }
      let header = ["巡检时间", "巡检人", "是否异常", "说明"];
      let tmp = [];
      data.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) {
            if (key == "xunjiantime") {
              obj[this.excelDownloadTranslate[key]] = this.moment(
                i[key]
              ).format("yyyy-MM-DD HH:mm:ss");
            } else {
              obj[this.excelDownloadTranslate[key]] = i[key];
            }
          }
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "巡检结果.xlsx");
    },
    async getLoadData() {
      this.loading = true;
      try {
        let params = {
          biz_id: this.$bizCode.xunjian_biz,
          src_id: this.$sourceCode.source_id,
          org_id: this.userinfo.org_id,
        };
        let resp = await resource.getObj('formdatareport',100017,params)
        this.renwutongji = resp.data[0].he || 0; // 任务统计

        let resp1 = await resource.getObj('formdatareport',100018,params)
        this.xunjiandianshu = resp1.data[0].he || 0;

        let resp2 = await resource.getObj('formdatareport',100019,params)
        this.leijixunjian = resp2.data[0].he || 0;
          // 获取异常次数

        let resp3 = await resource.getObj("formdatareport",100019, {...params,yichang:'是'});
        this.yichangcishu = resp3.data[0].he || 0;

          // 累计巡检点数
          let params4 = {
            template_id: "FT6632213925888",
            org_id: this.userinfo.org_id
          }
          let leijixunjian = await resource.getObj('formdatareport',5863,params4)
          this.dataXunjian = leijixunjian.data;

          // 累计巡检异常点数
          let params5 = {
            template_id: "FT6632213925888",
            org_id: this.userinfo.org_id,
            yichang: '是'
          }
          let yichang = await resource.getObj('formdatareport',5864,params5)
          this.yichang = yichang.data;

      } catch (e) {}
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.grid-content {
  border-radius: 4px;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.grid_item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 18px;
  color: #ffffff;
}
.grid_item_span1 {
  margin-bottom: 5px;
}
.dianshu{
  height: 600px;
  overflow: auto;
}
</style>