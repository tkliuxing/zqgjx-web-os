<template>
    <el-card>
        <div>
            <el-form inline>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="xinjian"
                        round
                        icon="el-icon-plus">
                        新建任务
                    </el-button>
                    <el-button
                        type="primary"
                        @click="ShiLiTo"
                        class="fix-tab"
                        plain
                        round
                        icon="el-icon-picture-outline">
                        查看示例
                    </el-button>
                    <el-button
                        type="warning"
                        @click="ShuoMingTo"
                        class="fix-shuoming"
                        round
                        plain
                        icon="el-icon-notebook-2">
                        使用说明
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filterData.search" placeholder="任务名称" clearable @clear="loadData"  />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round icon="el-icon-search" @click="search"
                    >搜索
                    </el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <el-table
            v-loading="loading"
            element-loading-text="正在加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            stripe
            border
            :data="data"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
        >
            <el-table-column label="任务名称" prop="name"></el-table-column>
            <el-table-column label="说明" prop="desc"></el-table-column>
            <el-table-column
                label="巡检点数"
                prop="tongji.xunjianzongshu"
            >
              <template slot-scope="{ row }">
                {{ row.tongji && row.tongji.xunjianzongshu ? row.tongji.xunjianzongshu : 0 }}
              </template>
            </el-table-column>
            <el-table-column
                label="累计巡检"
                prop="tongji.leijixunjian"
            >
              <template slot-scope="{ row }">
                {{ row.tongji && row.tongji.leijixunjian ? row.tongji.leijixunjian : 0 }}
              </template>
            </el-table-column>
            <el-table-column
                label="异常次数"
                prop="tongji.yichangcishu"
            >
              <template slot-scope="{ row }">
                {{ row.tongji && row.tongji.yichangcishu ? row.tongji.yichangcishu : 0 }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="500px">
                <template slot-scope="{ row }">
                  <div class="btn">
                      <el-button
                        type="primary"
                        round
                        @click="edit(row.pk)"
                        icon="el-icon-edit"
                        :loading="editState"
                      >编辑任务
                      </el-button>
                      <el-button
                        type="primary"
                        round
                        @click="xmlist(row.pk)"
                        icon="el-icon-tickets">
                        巡检点管理
                      </el-button>
                    <el-popconfirm title="确定删除吗？" @confirm="del(row)">
                      <el-button
                        type="danger"
                        round
                        class="deleteButton"
                        slot="reference"
                        icon="el-icon-remove">
                        删除
                      </el-button>
                    </el-popconfirm>

                    <el-popover
                      placement="bottom"
                      width="350"
                      style="margin-left: 10px"
                      trigger="click">
                      <el-button slot="reference" type="info" round @click="visible = !visible">更多操作
                        <i class="el-icon-arrow-down el-icon--right"></i></el-button>
                      <template >
                        <el-button
                          type="primary"
                          round
                          @click="tongji(row.pk)"
                          icon="el-icon-tickets">
                          巡检统计
                        </el-button>
                    <el-button
                      type="success"
                      round
                      @click="jilu(row.pk)"
                      icon="el-icon-tickets">
                      巡检记录
                    </el-button>
                    <el-button
                      type="warning"
                      round
                      @click="lookguiji(row)"
                      icon="el-icon-location-information">
                      巡检轨迹
                    </el-button>

                      </template>
                    </el-popover>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[15, 30, 50, 100, 500, 1000]"
            :page-size="pageSize"
            @size-change="(pageSize) => {
                          this.page = 1;
                          this.pageSize = pageSize;
                          this.loadData();
                        }"
            :current-page.sync="page"
            @current-change="loadData"
            :total="total"
            style="margin-top: 10px">
        </el-pagination>
        <el-dialog
            title="表单"
            :visible.sync="createDialogVisiable"
            width="480px"
            center
            @closed="clearFormData('form')">
            <el-form :model="form" ref="form" label-width="100px">
                <el-form-item
                    label="任务名称"
                    prop="name"
                    :rules="[{ required: true, message: '请填写任务名称' }]">
                    <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="说明" prop="desc" :rules="[]">
                    <el-input v-model="form.desc" type="textarea" :rows="2"/>
                </el-form-item>
            </el-form>
            <span slot="footer">
        <el-button icon="el-icon-close" @click="createDialogVisiable = false">
            取消
        </el-button>
        <el-button
            type="primary"
            icon="el-icon-check"
            @click="submitForm('form')">
            确定
        </el-button>
      </span>
        </el-dialog>

      <el-dialog :title="name" :visible.sync="guijiDialogVisiable" width="75%" style="height:90%" append-to-body>
        <Map
          v-if="flag"
          :center="center"
          :layereditable="true"
          :val="val"
        />
        <div v-else>
          <el-empty description="暂未设置巡检点..."></el-empty>
        </div>
      </el-dialog>
    </el-card>
</template>
<script>
import resource from "@/resource";
import {mapState} from "vuex";
const XJD_TMPL_ID = 'FT6628950761472';
import Map from "@/components/MapNew/Index.vue";
export default {
    computed: {
        ...mapState(["org_id", "userinfo","quanxian"]),
    },
  components:{
    Map
  },
    data() {
        return {
          visible: false,
          zoom:8,
          center: [111.67,40.83],
           guijiDialogVisiable: false,
            page: 1,
            pageSize: 10,
            total: 0,
            data: [],
            form: {
                pk: null,
                name: null,
                desc: null,
                template_id: "FT6626455150592",
            },
            filterData: {
                search: null,
            },
            createDialogVisiable: false,
            loading: false,
            editState: false,
          name: null,
          showPolygons: [],
          val: null,
          flag: false
        };
    },
    methods: {
      async lookguiji(val){
        try {
          this.name = val.name + '巡检轨迹';
          this.val = val;
          this.guijiDialogVisiable = true;
          let resp = await resource.getList("data",{
            biz_id: this.$bizCode.xunjian_biz,
            src_id: this.$sourceCode.source_id,
            template_id: XJD_TMPL_ID,
            renwu_id:val.pk
          });
          if(resp.length>0){
           this.flag = true;
          }
        }catch (e) {
          console.error(e)
        }
      },

      xinjian(){
        if(!this.quanxian.扫码巡检 && this.data.length>=1){
          this.$message({
            message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
            type: 'warning',
            duration: 3000
          });
        }else{
          this.createDialogVisiable = true;
        }
      },
        async loadData() {
            this.loading = true;
            let params = {
                page: this.page,
                pageSize: this.pageSize,
                biz_id: this.$bizCode.xunjian_biz,
                src_id: this.$sourceCode.source_id,
                template_id: "FT6626455150592",
            };
            let res = await resource.getList("data", params);
            this.total = res.count;
            this.data = res.data;
          // 循环data,拿着data里面的pk去请求巡检点接口
          for(let i=0;i<this.data.length;i++){
            // 异常次数
            let params ={
              biz_id: this.$bizCode.xunjian_biz,
              src_id: this.$sourceCode.source_id,
              template_id: "FT6632213925888",
              renwu_id:this.data[i].pk
            }
            let res = await resource.getList("data",params );
            // 巡检点数
            let params1 = {
              biz_id: this.$bizCode.xunjian_biz,
              src_id: this.$sourceCode.source_id,
              template_id: "FT6628950761472",
              renwu_id:this.data[i].pk
            }
            let res1 = await resource.getList("data",params1 );
            // 然后循环返回的数据,拿着this.data[i].pk去匹配,如果相等,就把返回的数据长度赋值给this.data[i].tongji.dianshu
            this.data[i].tongji={
              leijixunjian:res.length,
              xunjianzongshu:res1.length,
              // yichangcishu 取yichang字段为是的数据长度
              yichangcishu:res.filter(item=>item.yichang=='是').length
            }
          }
          this.loading = false;
        },

        async submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let data = {
                        ...this.form,
                        biz_id: this.$bizCode.xunjian_biz,
                        src_id: this.$sourceCode.source_id,
                    };
                    if (data.pk) {
                        await resource.updateObj("data", data.pk, data);
                        this.$message.success("编辑成功!");
                    } else {
                        await resource.createObj("data", data);
                        this.$message.success("新建成功!");
                    }
                    this.createDialogVisiable = false;
                    this.loadData();
                } else {
                    this.$message.error("请检查所填项!");
                    return false;
                }
            });
        },
        // 删除
        async del(info) {
            try {
                try {
                    await resource.deleteList(
                        {
                            pk: info.pk,
                        },
                        info.template_id
                    );
                    await resource.deleteList(
                        {
                            ceping_id: info.pk,
                        },
                        "FT6628950761472"
                    );
                    await resource.deleteList(
                        {
                            renwu_id: info.pk,
                        },
                        "FT6632213925888"
                    );
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                    setTimeout(() => {
                        this.loadData();
                    }, 200);
                } catch (e) {
                    this.$message.error("删除失败!");
                }
            } catch (e) {
                this.$message.info("取消删除");
            }
        },

        // 搜索
        async search() {
            this.loading = true;
            let params_search = {};
            let check = Object.prototype.toString;
            for (const key in this.filterData) {
                if (check.call(this.filterData[key]) === "[object Array]") {
                    params_search[key + "_before"] = this.filterData[key][0];
                    params_search[key + "_after"] = this.filterData[key][1];
                } else {
                    params_search[key] = this.filterData[key];
                }
            }
            let params = {
                ...params_search,
                biz_id: this.$bizCode.xunjian_biz,
                src_id: this.$sourceCode.source_id,
                template_id: "FT6626455150592",
            };
            let res = await resource.getList("data", params);
            this.data = res;
            this.loading = false;
        },

        // 清除表格数据
        clearFormData(formName) {
            this.form = {
                pk: null,
                name: null,
                desc: null,
                template_id: "FT6626455150592",
            };
            this.$refs[formName].resetFields();
        },

        // 显示修改
        async edit(pk) {
            this.editState = true;
            let params = {
                biz_id: this.$bizCode.xunjian_biz,
                src_id: this.$sourceCode.source_id,
                template_id: "FT6626455150592",
            };
            let res = await resource.getObj("data", pk, params);
            this.form = res;
            this.editState = false;
            this.createDialogVisiable = true;
        },

        // 巡检列表
        xmlist(pk) {
            this.$router.push({name: "xunjian-xiangmu", params: {renwu_id: pk}});
        },
        //巡检统计
        tongji(pk) {
            this.$router.push({name: "xunjian-tongji", params: {renwu_id: pk}});
        },
        //巡检记录
        jilu(pk) {
            this.$router.push({
                name: "xunjian-jieguo",
                query: {
                    renwu_id: pk,
                },
            });
        },
        ShiLiTo() {
            this.$router.push("/xunjianzhanshi");
        },
        ShuoMingTo() {
            this.$router.push({name: "xunjian-shuoming"});
        },
    },
    async mounted() {
        await this.loadData();
    },
    created() {
    },
};
</script>
<style scoped>
.deleteButton {
    margin-left: 10px;
}
.btn{
  display: flex;align-items: center;flex-wrap: wrap;
  justify-content: center;
}
.btn ::v-deep .el-button{
  width: 110px;
  text-align: center;
}
</style>
