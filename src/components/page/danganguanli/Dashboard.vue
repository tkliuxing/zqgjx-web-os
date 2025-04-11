<template>
  <el-container>
    <el-main class="div ">
      <div style="display: flex;justify-content: space-between;align-items: center">
        <div class="div-tongjitu">
          <bingtu/>
        </div>
        <div class="div-tongjitu">
          <bingtu_dengji/>
        </div>
        <div class="div-tongjitu">
          <bingtu_dangan/>
        </div>
      </div>
    </el-main>
    <el-container>
      <el-main class="div" style=";height: 450px ;display: flex;width: 70%">
        <div class="div_tongzhi">
          <el-col style="width: 100%">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <div slot="header" class="clearfix">
                  <el-badge class="item">
                    <el-button class="el-icon-s-order" style="font-size: 17px;color: black;" type="text" @click="">我进行的档案</el-button>
                  </el-badge>

                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text" @click="zhidao_daiban">
                  </el-button>
                </div>
              </div>
              <div>
                <el-table :data="data" border height="300" stripe>
                  <el-table-column label="编号" prop="bianhao" width="100">
                  </el-table-column>
                  <el-table-column label="档案分类" prop="fenlei" width="180">
                  </el-table-column>
                  <el-table-column label="档案名称" prop="name" width="180">
                  </el-table-column>
                  <el-table-column label="保密等级" prop="baomi" width="142">
                  </el-table-column>
                  <el-table-column label="存放位置" prop="weizhi"></el-table-column>
                  <el-table-column
                    :filter-method="filterTag"
                    :filters="[{ text: '正常', value: '正常' }, { text: '已借出', value: '已借出' }]"
                    filter-placement="bottom-end"
                    fixed="right"
                    label="状态"
                    prop="zhuangtai"
                    width="100">
                    <template slot-scope="scope">
                      <el-tag
                        :type="scope.row.zhuangtai === '正常' ? 'primary' : 'success'"
                        disable-transitions>{{ scope.row.zhuangtai }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <template slot="empty">
                    <el-empty v-if="data.length==0" description="没有档案正在进行哦！"></el-empty>
                  </template>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </div>
      </el-main>
      <!--          <div slot="header" class="clearfix">-->
      <!--            <p class="div_font"> 我进行的档案 </p>-->
      <!--          </div>-->
      <!--          <div style="margin: 1px 10px 10px;">-->
      <!--            <el-table :data="data" border height="375" stripe style="width: 100%">-->
      <!--              <el-table-column label="编号" prop="bianhao" width="100">-->
      <!--              </el-table-column>-->
      <!--              <el-table-column label="档案分类" prop="fenlei" width="180">-->
      <!--              </el-table-column>-->
      <!--              <el-table-column label="档案名称" prop="name" width="180">-->
      <!--              </el-table-column>-->
      <!--              <el-table-column label="保密等级" prop="baomi" width="142">-->
      <!--              </el-table-column>-->
      <!--              <el-table-column label="存放位置" prop="weizhi"></el-table-column>-->
      <!--              <el-table-column-->
      <!--                :filter-method="filterTag"-->
      <!--                :filters="[{ text: '正常', value: '正常' }, { text: '已借出', value: '已借出' }]"-->
      <!--                filter-placement="bottom-end"-->
      <!--                fixed="right"-->
      <!--                label="状态"-->
      <!--                prop="zhuangtai"-->
      <!--                width="100">-->
      <!--                <template slot-scope="scope">-->
      <!--                  <el-tag-->
      <!--                    :type="scope.row.zhuangtai === '正常' ? 'primary' : 'success'"-->
      <!--                    disable-transitions>{{ scope.row.zhuangtai }}-->
      <!--                  </el-tag>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--            </el-table>-->
      <!--          </div>-->
      <!--        </el-card>-->
      <!--      </el-aside>-->
      <el-main class="div" style="margin-left: 5px;height: 450px ;display: flex">
        <div class="div_tongzhi">
          <el-col style="width: 100%">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <el-badge :value=Tong_ji_D class="item">
                  <el-button class="el-icon-s-order" style="font-size: 17px;color: black;" type="text" @click="zhidao_daiban">待办事项</el-button>
                </el-badge>
                <el-button
                  style="float: right; padding: 3px 0"
                  type="text" @click="zhidao_daiban">我知道了
                </el-button>
              </div>
              <el-table
                :data="tableData_D"
                :show-header="false"
                border
                height="308"
                stripe
                style="width: 99%;"
                @cell-click="Jump"
              >
                <template slot="empty">
                  <el-empty v-if="tableData_D.length==0" description="没有代办事项哦！"></el-empty>
                </template>
                <el-table-column prop="address">
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </div>
      </el-main>
    </el-container>


    <el-footer class="div" height="50px">
      <div>
        <p style="font-size: 18px ;text-align: center ;line-height: 50px">内蒙古汇鑫电子商务有限公司</p>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import bingtu from "./bingtu.vue"
import bingtu_dangan from "@/components/page/danganguanli/bingtu_dangan.vue";
import bingtu_dengji from "@/components/page/danganguanli/bingtu_dengji.vue";
import resource from "@/resource";

export default {
  data() {
    return {
      data: [],
      daiban_data:[],
      tableData_D: [],
      // tableData_T: [{
      //   address: '这是一条消息通知，很重要！'
      // }, {
      //   address: '这是一条消息通知，很重要！'
      // }, {
      //   address: '这是一条消息通知，很重要！'
      // }, {
      //   address: '这是一条消息通知，很重要！'
      // }, {
      //   address: '这是一条消息通知，很重要！'
      // },],
      Tong_ji_D: '',
      Tong_ji_T: ''
    };
  },
  created() {
    this.loadData()
    this.getLocalDataSource()

    this.daiban()
  },
  methods: {
    Jump(){
      console.log('1')
this.$router.push("jiechu")
    },
    async daiban() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: "FT333844772808392704"
      }
      this.daiban_data=await resource.getList("data", params)
      console.log(this.daiban_data)
      let numb=0
      for (let item in this.daiban_data){
        if (this.daiban_data[item].tag=='未归还'){
          this.tableData_D.push({address: '您的 “'+this.daiban_data[item].name+'” 档案，将于'+this.daiban_data[item].yjiechu_time+'到达预归还时间，请按时归还'})
          numb+=1
        }
      }
      this.Tong_ji_D = numb==0? '':numb
    },
    async getLocalDataSource() {
      this.zhuanrudanwei_option_data = await resource.getList("data", {"template_id": "FT333844866544001024"});
    },
    async loadData() {
      this.loading = true;
      let params = {
        template_id: 'FT333844866544001024'
      }
      this.data = await resource.getList("data", params)
      this.loading = false;
      console.log(this.data)
    },
    filterTag(value, row) {
      return row.zhuangtai === value;
    },
    zhidao_daiban() {

      this.Tong_ji_D = '';
      this.$message({message: '所有代办消息已读！', type: 'success'});
    },
    // zhidao_tongzhi() {
    //   this.Tong_ji_T = '';
    //   this.$message({message: '所有通知消息已读！', type: 'success'});
    // },

    // list_tongji_T() {
    //   this.Tong_ji_T = this.tableData_T.length
    // }
  },
  components: {
    bingtu,
    bingtu_dangan,
    bingtu_dengji,

  }

};
</script>

<style>


.div {
  margin-top: 10px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 288px;


}

.div_font {
  font-size: 17px;
  margin-top: 20px;
  margin-left: 20px;
}

.user-avator img {
  float: left;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 7px;
  margin-left: 10px;

}

.div-tongjitu {
  margin-top: 10px;
  text-align: center;
}

.div_tongzhi {
  height: 370px;
  margin-top: 1px;

  width: 100%;
}


</style>
