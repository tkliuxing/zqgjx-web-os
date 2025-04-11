<template>
    <div class="jieguolist">
        <el-card class="box-card">
            <el-form inline>
                <el-form-item>
                    <el-button
                        type="info"
                        round
                        icon="el-icon-arrow-left"
                        @click="$router.replace({ name: 'tianbao' })"
                    >返回
                    </el-button>
                    <el-button round type="success" @click="getExcel"
                    >导出表格
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table
                v-loading="loading"
                ref="table"
                element-loading-text="正在加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                stripe
                border
                :data="data"
                :cell-style="{ 'text-align': 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column v-if="isShow" label="填报人" prop="user_name">
              </el-table-column>
                <template v-for="item in tableList">
                    <el-table-column :label="item.col_title" :key="item.pk">
                      <template slot-scope="{ row }">
                        {{isJson(row.result[item.col_title])}}
                      </template>
                    </el-table-column>
                </template>

                <el-table-column label="提交时间">
                    <template slot-scope="{ row }">
                        {{ transTime(row.create_time) }}
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="{ row }">
                        <el-popconfirm title="确定删除吗？" @confirm="deleteRow(row)">
                            <el-button type="danger" class="deleteButton" round slot="reference" icon="el-icon-remove">
                                删除
                            </el-button>
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
    </div>
</template>

<script>
import moment from "moment";
import resource from "@/resource.js";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import is from "element-ui/src/locale/lang/is";

export default {
    name: "JieGuoList",
  computed: {
    is() {
      return is
    }
  },
    data() {
        return {
            id: null,
            page: 1,
            pageSize: 15,
            total: 0,
            data: [],
            tableList: [],
            filter_form: {},
            origin_filter_form: {},
            loading: false,
            isShow: false,
        };
    },
    async created() {
      if(this.$route.params && this.$route.params.need_login == 'true'){
        this.isShow = true;
      }
        if (this.$route.params.id) {
            this.id = this.$route.params.id;
            // await this.loadShijuan();
            await this.loadData();
            await this.getTable();
        }
    },
    methods: {
      isJson(val){
        if(!val) return val;
         if(Array.isArray(val)){
           return val.join(',')
         }
        return val
      },
        async getTable() {
            let data = {
                biz_id: this.$bizCode.tianbao_biz,
                // src_id: this.$sourceCode.source_id,
            };
            let fomrListParams = {
                parent_id : this.id,
                template_id: "FT202308301655334912",
            }
            let res = await resource.getList("data", fomrListParams);
            this.tableList = res.reverse();
            // let resp = await resource.getObj("data", this.id, data);
            //let fields = resp.field;
            let filter_form = {};
            // fields.forEach((item) => {
            //     if (item.in_filter) {
            //         filter_form[item.col_name] = "";
            //     }
            // });
            this.filter_form = filter_form;
            this.origin_filter_form = {...filter_form};
        },

        resetFilterForm() {
            this.filter_form = {...this.origin_filter_form};
        },

        async loadData() {
            this.loading = true;
            let params = {
                page: this.page,
                pageSize: this.pageSize,
                biz_id: this.$bizCode.tianbao_biz,
                // src_id: this.$sourceCode.source_id,
                tianbao_id: this.id,
                template_id: "FT139612458194108416",
            };
            // FT181649085367160832
            let resp = await resource.getList("data", params);
            this.data = resp.data.map((item)=>{
                item.result = JSON.parse(item.result);
                return item;
            });
            this.total = resp.count;
            this.loading = false;
        },

        async search() {
            this.page = 1;
            await this.loadData();
        },

        async nosearch() {
            this.page = 1;
            this.resetFilterForm();
            await this.loadData();
        },

        // 删除
        async deleteRow(row) {
            try {
                try {
                    await resource.deleteList(
                        {
                            pk: row.pk,
                        },
                        row.template_id
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

        // 时间转换
        transTime(timeStr) {
            return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
        },

        async getExcel() {
            const confirmResult = await this.$confirm(
                "是否下载Excel表格到电脑中?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (confirmResult !== "confirm") {
                return this.$message.info("取消下载");
            }
            this.exportExcel();
        },
        exportExcel() {
            let fix = document.querySelector(".el-table__fixed");
            let wb;
            if (fix) {
                wb = XLSX.utils.table_to_book(this.$refs["table"].$el.removeChild(fix));
                this.$refs["table"].$el.appendChild(fix);
            } else {
                wb = XLSX.utils.table_to_book(this.$refs["table"].$el);
                for(let key in wb.Sheets.Sheet1) {
                    if(wb.Sheets.Sheet1[key].hasOwnProperty('v') && (wb.Sheets.Sheet1[key].v === '操作'
                        || wb.Sheets.Sheet1[key].v === '新增下级批量添加编辑删除'
                        || wb.Sheets.Sheet1[key].v === '确定删除吗？取消确定删除')) {
                        delete wb.Sheets.Sheet1[key]
                    }
                }
            }
            let wbout = XLSX.write(wb, {
                bookType: "xlsx",
                bookSST: true,
                type: "array",
            });
            try {
                FileSaver.saveAs(
                    new Blob([wbout], {type: "application/octet-stream;charset=utf-8"}),
                    "填报结果.xlsx"
                );
            } catch (e) {
                if (typeof console !== "undefined") console.log(e, wbout);
            }
            return wbout;
        },
    },
};
</script>

<style scoped></style>
