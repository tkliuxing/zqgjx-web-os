<template>
  <el-card>
    <div>
      <el-button
        style="float: right"
        icon="el-icon-notebook-2"
        round
        plain
        type="warning"
        @click="ShuoMingTo"
      >使用说明
      </el-button>
      <el-form inline>
        <el-form-item>
          <el-button
            icon="el-icon-circle-plus-outline"
            round
            type="primary"
            @click="excelUp"
          >添加资产
          </el-button
          >
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchData.search"
            clearable
            placeholder="请输入资产名称"
            @clear="loadData"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchData.status"
            clearable
            placeholder="请选择资产状态"
            @clear="loadData"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="userinfo.func_group_names.indexOf('政企工具箱管理员') !== -1" label="选择部门">
          <el-cascader
            ref="departmentCascader"
            v-model="searchData.department"
            :options="department_display1"
            :props="{
            children: 'items',
            label: 'name',
            value: 'pk',
            checkStrictly: true,
            emitPath:false,
          }"
            :show-all-levels="false"
            clearable
            style="width: 300px"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-cascader
            ref="categoryCascader"
            v-model="searchData.category"
            :options="category_display1"
            :props="{
            children: 'items',
            label: 'name',
            value: 'pk',
            checkStrictly: true,
            emitPath:false,
          }"
            :show-all-levels="false"
            clearable
            style="width: 300px"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            round
            type="primary"
            @click="loadData"
          >查询
          </el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            class="exportExcel1"
            icon="el-icon-download"
            round
            type="success"
            @click="download"
          >导出
          </el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table
      ref="table"
      v-loading="loading"
      :cell-style="{ 'text-align': 'center' }"
      :data="data"
      :header-cell-style="{ 'text-align': 'center' }"
      border
      element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-spinner="el-icon-loading"
      element-loading-text="正在加载中..."
      stripe
    >
      <el-table-column label="资产名称" prop="name"></el-table-column
      >
      <el-table-column label="资产编号" prop="sn"></el-table-column>
      <el-table-column
        label="资产分类"
        prop="category_display"
      ></el-table-column
      >
      <el-table-column label="使用单位/部门" prop="department_display"></el-table-column>
      <el-table-column label="使用人员" prop="persion"></el-table-column
      >
      <el-table-column label="资产状态" prop="status"></el-table-column>
      <el-table-column label="操作" width="370px">
        <template slot-scope="{ row }">
          <div >
            <el-row style="display:flex;">
              <el-button
                round
                type="primary"
                @click="creatQrCode(row)"
              >二维码
              </el-button>
              <el-button round  @click="detail(row)">详情</el-button>

              <el-popconfirm title="确定删除吗？" @confirm="del(row)" class="button_ma">
                <el-button
                  slot="reference"
                  class="deleteButton"
                  round
                  type="danger">
                  删除
                </el-button>
              </el-popconfirm>
              <el-button round  type="primary" @click="edit(row.pk)">编辑</el-button>
              <el-popover
                placement="bottom"
                fade-in-linear
                width="150"
                class="button_ma"
                style="margin-right: 0"
                trigger="click">
                  <div style="text-align: center">
                    <el-row>
                      <el-col :span="12" class="top-bom" v-if="row.status==='闲置' || row.status==='已分配'">
                        <el-button type="success" round  @click="zhuanyi(row)" >转移</el-button>
                      </el-col>
                      <el-col :span="12" class="top-bom" v-if="row.status==='闲置' || row.status==='已分配'">
                        <el-button type="info" round  @click="chuzhi(row)" >处置</el-button>
                      </el-col>
                      <el-col :span="12" class="top-bom" v-if="row.status==='闲置'" >
                        <el-button type="warning" round @click="chujie(row)"  >出借  </el-button>
                      </el-col>
                      <el-col :span="12" class="top-bom" v-if="row.status==='闲置'">
                        <el-button type="success" round  @click="chuzu(row)">出租</el-button>
                      </el-col>
                      <el-col :span="12" class="top-bom" v-if="row.status==='闲置' || row.status==='已分配' || row.status==='待报废'">
                        <el-button type="info" round   @click="baofei(row)">报废</el-button>
                      </el-col>

                      <el-col :span="24">
                        <el-alert
                          title="无其他操作哦!"
                          type="success"
                          center
                          show-icon
                          :closable="false"
                          v-if="!((row.status==='闲置' || row.status==='已分配' || row.status==='待报废'))">
                        </el-alert>
                      </el-col>
                    </el-row>
                </div>

                <el-button slot="reference"  round  type="success">其他</el-button>
              </el-popover>
            </el-row>
          </div>

          <!-- <el-button type="danger" round size="mini" @click="del(row)"
            >删除</el-button
          > -->
        </template>

      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="page"
      :page-size="pageSize"
      :page-sizes="[15, 30, 50, 100, 500, 1000]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 10px"
      @size-change="
        (pageSize) => {
          this.page = 1;
          this.pageSize = pageSize;
          this.loadData();
        }
      "
      @current-change="loadData"
    ></el-pagination>
    <!-- 二维码 -->
    <el-dialog
      :visible.sync="viewQR"
      center
      title="二维码"
      width="500px"
      @before-close="closeQR"
    >
      <div ref="qrcard" class="qrcontent">
        <img v-show="!showQRTable" ref="qrcardimg" alt="" src="">
        <table v-if="showQRTable" border="1" style="border-collapse: collapse;color:#000000;">
          <tr>
            <td colspan="3" style="text-align: center;">{{ orginfo.name }}</td>
          </tr>
          <tr>
            <td style="width:100px;text-align: center;">资产编号</td>
            <td style="width:300px;">{{ form.sn || '' }}</td>
            <td rowspan="3" style="width:100px;padding:10px;">
              <div class="erweima">
                <qr-code v-if="viewQR" ref="qrCodeUrl" :height="100" :url="url" :width="100"></qr-code>
<!--                <Qr v-if="viewQR" :url="url" :height="100" :width="100" :logoWidth="30" :logoHeight="30" style="margin: auto ;"></Qr>-->
              </div>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">资产名称</td>
            <td>{{ form.name || '' }}</td>
          </tr>
          <tr>
            <td style="text-align: center;">使用部门</td>
            <td>{{ form.department_display || '' }}</td>
          </tr>
          <tr>
            <td style="text-align: center;">使用人</td>
            <td colspan="2">{{ form.persion || '' }}</td>
          </tr>
        </table>
      </div>
      <div class="memo" style="text-align: center;margin-top:20px;">
        <el-link type="success" @click="download_qrcard">点击保存卡片图片</el-link>
      </div>
    </el-dialog>
    <!-- 报修 -->
    <el-dialog
      :visible.sync="createDialogVisiable"
      center
      title="报修"
      width="500px"
      @closed="clearFormData('baoxiuform')"
    >
      <el-form ref="baoxiuform" :model="baoxiuform" label-width="100px">
        <el-form-item
          :rules="[{ required: true, message: '请填写报修人' }]"
          label="报修人"
          prop="baoxiu_name"
        >
          <el-input v-model="baoxiuform.baoxiu_name"/>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请填写联系电话' }]"
          label="联系电话"
          prop="phone"
        >
          <el-input v-model="baoxiuform.phone"/>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请填写报修原因' }]"
          label="报修原因"
          prop="remark"
        >
          <el-input v-model="baoxiuform.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button icon="el-icon-close" @click="createDialogVisiable = false"
        >取消</el-button
        >
        <el-button
          icon="el-icon-check"
          type="primary"
          @click="submitbaoxiuForm('baoxiuform')"
        >确定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog :visible.sync="lookDialogVisable" width="70%">
      <el-table
        v-if="lookDialogVisable"
        :cell-style="{ 'text-align': 'center' }"
        :data="lookData"
        :header-cell-style="{ 'text-align': 'center' }"
        border
        stripe
        style="margin-top: 1rem"
      >
        <el-table-column label="资产名称" prop="name"></el-table-column>
        <el-table-column label="资产规格" prop="size"></el-table-column>
        <el-table-column label="资产型号" prop="model_num"></el-table-column>
        <el-table-column label="资产性质" prop="nature"></el-table-column>
        <el-table-column label="资产分类" prop="category_display">
        </el-table-column
        >
        <el-table-column label="计量单位" prop="unit"></el-table-column
        >
        <el-table-column label="资产原值" prop="cost"></el-table-column>
        <el-table-column label="购置日期" prop="release_time"></el-table-column>
        <el-table-column
          label="购置方式"
          prop="purchase_method"
        ></el-table-column
        >
        <el-table-column
          label="保管单位/部门"
          prop="bg_department_display"
        ></el-table-column
        >
        <el-table-column label="保管人员" prop="bg_persion"></el-table-column
        >
        <el-table-column label="存放地点" prop="location"></el-table-column
        >
        <el-table-column label="使用期限" prop="down_time"></el-table-column
        >
        <el-table-column
          label="入账编号"
          prop="account_number"
        ></el-table-column
        >
        <el-table-column label="入账日期" prop="account_date"></el-table-column
        >
        <el-table-column
          label="使用单位/部门"
          prop="department_display"
          width="250px"
        ></el-table-column
        >
        <el-table-column label="使用人员" prop="persion"></el-table-column
        >
        <el-table-column label="资产状态" prop="status"></el-table-column
        >
        <el-table-column label="出厂编号" prop="brand"></el-table-column
        >
        <el-table-column
          label="保修期限"
          prop="warranty_period"
        ></el-table-column
        >
        <el-table-column label="原资产号" prop="origin_sn"></el-table-column
        >
        <el-table-column label="是否盘点" prop="need_pandian"></el-table-column
        >
        <el-table-column
          label="累计折旧"
          prop="accumulated_depreciation"
        ></el-table-column
        >
        <el-table-column label="净值" prop="net_worth"></el-table-column
        >
        <el-table-column
          label="备注"
          prop="product_description"
        ></el-table-column
        >
        <el-table-column label="供应商" prop="gys"></el-table-column>
      </el-table>
    </el-dialog>
    <ZiChanZhuanYi
      :data="mvzichan.data"
      :visable="mvzichan.status"
      @close="
        () => {
          this.mvzichan.status = false;
          this.mvzichan.data = {};
          this.loadData();
        }
      "
    />
    <ZiChanChuZhi
      :data="czzichan.data"
      :visable="czzichan.status"
      @close="
        () => {
          this.czzichan.status = false;
          this.czzichan.data = {};
          this.loadData();
        }
      "
    />

    <ZiChanChujie
      v-if="cjzichan.status"
      :data="cjzichan.data"
      :visable="cjzichan.status"
      @close="
        () => {
          this.cjzichan.status = false;
          this.cjzichan.data = {};
          this.loadData();
        }
      "
    />
    <ZiChanChuZu
      v-if="chuzuzichan.status"
      :data="chuzuzichan.data"
      :visable="chuzuzichan.status"
      @close="
        () => {
          this.chuzuzichan.status = false;
          this.chuzuzichan.data = {};
          this.loadData();
        }
      "
    />
    <ZiChanBaoFei
      v-if="baofeizichan.status"
      :data="baofeizichan.data"
      :visable="baofeizichan.status"
      @close="
        () => {
          this.baofeizichan.status = false;
          this.baofeizichan.data = {};
          this.loadData();
        }
      "
    />
  </el-card>
</template>
<script>
import {mapState} from "vuex";
import resource from "@/resource";
import download_canvas from "@/utils/download_canvas";
import QrCode from "@/components/common/QrCode";
import ZiChanZhuanYi from "./ZiChanZhuanYi.vue";
import ZiChanChuZhi from "./ZiChanChuZhi.vue";
import ZiChanChujie from "./ZiChanChuJie.vue";
import ZiChanChuZu from "./ZiChanChuZu.vue";
import ZiChanBaoFei from "./ZiChanBaoFei.vue";
import xlsxExcel from "@/utils/xlsxExcel";
import html2canvas from "html2canvas";
import Qr from "@/components/common/QR.vue";

export default {
  computed: {
    ...mapState(["org_id", "sys_id", "httpurl", "orginfo", "userinfo"]),
  },
  components: {
    Qr,
    ZiChanZhuanYi,
    ZiChanChuZhi,
    ZiChanChujie,
    ZiChanChuZu,
    ZiChanBaoFei,
    QrCode,
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      total: 0,
      data: [],
      lookData: [],
      viewQR: false,
      showQRTable: true,
      updateDialogVisiable: false,
      url: null,
      createDialogVisiable: false,
      lookDialogVisable: false,
      mvzichan: {
        status: false,
        data: {},
      },
      czzichan: {
        status: false,
        data: {},
      },
      cjzichan: {
        status: false,
        data: {},
      },
      chuzuzichan: {
        status: false,
        data: {},
      },
      baofeizichan: {
        status: false,
        data: {},
      },
      form: {},
      baoxiuform: {
        zichan_id: null,
        name: "",
        sn: null,
        department_display: null,
        department: null,
        baoxiu_name: "",
        phone: "",
        remark: "",
        template_id: "FT8900048969728",
      },
      searchData: {
        search: "",
        status: "",
        department: "",
        category: "",
      },
      loading: false,
      department_display1: [],
      category_display1: [],
      options: [
        {
          value: "闲置",
          label: "闲置",
        },
        {
          value: "已分配",
          label: "已分配",
        },
        {
          value: "出借",
          label: "出借",
        },
        {
          value: "出租",
          label: "出租",
        },
        {
          value: "已处置", // 已处置
          label: "已处置",
        },
        {
          value: "已报废",
          label: "已报废",
        },
        {
          value: "待报废",
          label: "待报废",
        }
      ],
    };
  },
  methods: {
    // 固定资产信息列表
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        biz_id: this.$bizCode.zichan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT8172429443072",
      };

      if (this.searchData.search) {
        params['search'] = this.searchData.search
      }
      if (this.searchData.status) {
        params['status'] = this.searchData.status
      }
      if (this.searchData.department) {
        params['department'] = this.searchData.department
      }
      if (this.searchData.category) {
        params['category'] = this.searchData.category
      }
      if (this.userinfo.func_group_names.indexOf("政企工具箱管理员") === -1) {
        params.department = this.userinfo.department;
      }
      let res = await resource.getList("data", params);
      this.total = res.count;
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].erweima = this.httpurl + "/zichaninfo?id=" + res.data[i].pk;
      }
      this.data = res.data;
      this.loading = false;
    },
    async getDepartment() {
      let params = {
        org_id: this.org_id,
      };
      const res = await resource.getList("department", params);
      this.department_display1 = this.filterChildrenNull(res);
    },
    async getZiChanFenLei() {
      let params = {
        name: '资产分类',
        org_id: this.userinfo.org_id,
      };
      const res = await resource.getObjFromList("basetree", params);
      this.category_display1 = this.filterChildrenNull(res.items);
    },
    filterChildrenNull(data) {
      data.forEach((i) => {
        if (i.items.length > 0) {
          this.filterChildrenNull(i.items);
        } else {
          i.items = undefined;
        }
      });
      return data;
    },
    create() {
      this.$router.push({
        name: "zichan-createxinxi",
      });
    },
    // 详情
    detail(row) {
      this.lookData = [row];
      this.lookDialogVisable = true;
    },
    // 编辑
    edit(pk) {
      this.$router.push({name: "zichan-editxinxi", params: {pk: pk}});
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
              zichan_id: info.pk,
            },
            "FT8900048969728"
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
    // del(info) {
    //   this.$confirm("是否删除?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       await resource.deleteList(
    //         {
    //           pk: info.pk,
    //         },
    //         info.template_id
    //       );
    //       await resource.deleteList(
    //         {
    //           zichan_id: info.pk,
    //         },
    //         "FT8900048969728"
    //       );
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!",
    //       });
    //       setTimeout(() => {
    //         this.loadData();
    //       }, 200);
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },

    // 导出
    download() {
      let headers = [
        {资产名称: "name"},
        {资产分类: "category_display"},
        {使用单位部门: "department_display"},
        {使用人员: "persion"},
        {资产状态: "status"},
        {二维码地址: "erweima"},
      ];
      xlsxExcel(headers, "资产信息", this.data);
    },

    // 格式转换
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    creatQrCode(row) {
      this.showQRTable = true;
      this.form = row;
      let pk = row.pk;
      this.viewQR = true;
      this.url = this.httpurl + "/zichaninfo?id=" + pk;
    },
    download_qrcard() {
      let elem = this.$refs['qrcard'];
      html2canvas(elem, {scale: 1}).then((canvas) => {
        download_canvas(canvas);
      });
    },
    closeQR() {
      this.qrcode.clear();
      this.showQRTable = true;
    },
    download_canvas() {
      download_canvas(this.$refs.qrCodeUrl.children[0]);
    },

    // 报修
    async baoxiu(row) {
      this.baoxiuform.zichan_id = row.pk;
      this.baoxiuform.name = row.name;
      this.baoxiuform.sn = row.sn;
      this.baoxiuform.department_display = row.department_display;
      this.baoxiuform.department = row.department;
      this.createDialogVisiable = true;

    },
    // 提交报修
    async submitbaoxiuForm() {
      this.$refs.baoxiuform.validate(async (valid) => {
        if (valid) {
          let params = {
            ...this.baoxiuform,
            biz_id: this.$bizCode.zichan_biz,
            src_id: this.$sourceCode.source_id,
          };
          await resource.createObj("data", params);
          this.$message.success("报修成功!");
          this.createDialogVisiable = false;
          this.$router.replace('/zichan/ZiChanWeiXiu')
        } else {
          return false;
        }
      });
    },
    // 转移
    zhuanyi(row) {
      this.mvzichan.data = row;
      this.mvzichan.status = true;
    },
    // 处置
    chuzhi(row) {
      this.czzichan.data = row;
      this.czzichan.status = true;
    },
    // 借出
    chujie(row) {
      this.cjzichan.data = row;
      this.cjzichan.status = true;
    },
    // 出租
    chuzu(row) {
      this.chuzuzichan.data = row;
      this.chuzuzichan.status = true;
    },
    // 报废
    baofei(row) {
      this.baofeizichan.data = row;
      this.baofeizichan.status = true;
    },

    clearFormData(baoxiuform) {
      this.baoxiuform = {
        name: null,
        phone: null,
        remark: null,
        zichanpk: null,
      };
      this.$refs[baoxiuform].resetFields();
    },
    ShuoMingTo() {
      this.$router.push({name: "zichan-shuoming"});
    },
    excelUp() {
      this.$router.push({name: "zichan-xinxiexcel"});
    },
  },
  async mounted() {
    this.getDepartment();
    this.getZiChanFenLei();
    await this.loadData();
  },
};
</script>
<style scoped>
.tips {
  color: #333;
  line-height: 44px;
  text-align: center;
}

.erweima {
  margin: 0px auto;
  width: 100px;
}
.button_ma{
  margin-left:10px;
  margin-right: 10px
}
.top-bom{
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
