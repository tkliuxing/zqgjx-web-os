<template>
  <el-card>
    <div>
      <el-form inline>
        <el-form-item>
          <el-button
            type="info"
            round
            icon="el-icon-arrow-left"
            @click="$router.go(-1)"
          >
            返回
          </el-button>
          <el-button
            type="primary"
            @click="createDialogVisiable = true"
            round
            icon="el-icon-plus"
            >新建项目</el-button
          >
          <el-button
            type="primary"
            @click="ShiLiTo"
            class="fix-tab"
            plain
            round
            icon="el-icon-picture-outline"
            >查看示例</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filterData.search"
            placeholder="输入名称搜索"
            clearable
            @clear="loadData"
            style="width: 200px"
          />
          <el-input
              v-model="filterData.sn"
              placeholder="输入编号搜索"
              clearable
              @clear="loadData"
              style="width: 200px;margin-left: 20px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round icon="el-icon-search" @click="loadData"
            >搜索</el-button
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
      <el-table-column label="名称" prop="name"></el-table-column
      ><el-table-column label="类别" prop="category"></el-table-column
      ><el-table-column label="编号" prop="sn"></el-table-column>
      <el-table-column
        label="累计巡检次数"
        prop="tongji.xun_jian_total"
      ></el-table-column>
      <el-table-column
        label="当月巡检次数"
        prop="tongji.dang_yue__total"
      ></el-table-column>
      <el-table-column
        label="当天巡检次数"
        prop="tongji.dang_tian__total"
      ></el-table-column>
      <el-table-column
        label="最后巡检人"
        prop="tongji.user_full_name"
      ></el-table-column>
      <el-table-column
        label="最后巡检时间"
        prop="tongji.xunjiantime"
        width="145"
      >
        <template slot-scope="{ row }">
          {{row.tongji && row.tongji.xunjiantime ?  moment(row.tongji.xunjiantime).format('YYYY-MM-DD HH:mm:ss') : ''}}
        </template>
      </el-table-column>
      <el-table-column
        label="巡检说明"
        prop="tongji.shuoming"
      ></el-table-column>
      <el-table-column label="操作" width="400px">
        <template slot-scope="{ row }">
          <el-button type="primary" round @click="creatQrCode(row.pk)"
            >二维码</el-button
          >
          <el-button type="primary" round @click="edit(row)">编辑</el-button>
<!--          <el-button type="success" round @click="cpresult(row.pk)"-->
<!--            >巡检记录</el-button-->
<!--          >-->
          <el-button type="primary" round @click="copy(row)">复制</el-button>
          <el-button type="danger" round @click="del(row)">删除</el-button>
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
      style="margin-top: 10px"
    ></el-pagination>
    <el-dialog
      title="表单"
      :visible.sync="createDialogVisiable"
      width="680px"
      center
      @closed="clearFormData('form')"
    >
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请填写设备名称' }]"
        >
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类别" prop="category" :rules="[]">
          <el-input v-model="form.category" />
        </el-form-item>
        <el-form-item label="编号" prop="sn" :rules="[]">
          <el-input v-model="form.sn" />
        </el-form-item>
        <el-form-item label="说明" prop="desc" :rules="[]">
          <el-input type="textarea" :rows="3" v-model="form.desc" />
        </el-form-item>
        <el-form-item label="巡检周期">
          <el-select v-model="form.zhouqi" placeholder="请选择填报类型">
            <el-option label="小时" value="小时"></el-option>
            <el-option label="日" value="日"></el-option>
            <el-option label="周" value="周"></el-option>
            <el-option label="月" value="月"></el-option>
            <el-option label="季度" value="季度"></el-option>
            <el-option label="年" value="年"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检项目">
          <el-tag
            :key="tag"
            v-for="tag in form.json"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >添加项目</el-button
          >
        </el-form-item>
        <el-form-item label="巡检位置">
          <el-row>
            <el-col :span="8">
              <el-input v-model="form.lng" readonly>
                <template slot="prepend">经度</template>
              </el-input>
            </el-col>
            <el-col :span="8" style="padding-left: 10px">
              <el-input v-model="form.lat" readonly>
                <template slot="prepend">纬度</template>
              </el-input>
            </el-col>
            <el-col :span="8" style="text-align: center">
              <el-button type="primary" @click="dialogVisible = true"
                >打开地图</el-button
              >
              <el-button type="primary" @click="clearPosition"
                >清除位置</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="是否巡检" prop="is_enabled" :rules="[]">
          <el-switch
            v-model="form.is_enabled"
            inactive-color="#ff4949"
            active-text="开启"
            inactive-text="关闭"
            active-value="是"
            inactive-value="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="物品图片" prop="photo" :rules="[]">
<!--          添加个仅上传图片的开关 传个:img='true' 就只能上传图片;-->
          <my-upload @change="changeBackground" :img="true" />
          <el-image
            v-if="form.photo"
            style="width: 100px; height: 100px; margin-top: 5px"
            :src="form.photo"
            :preview-src-list="[form.photo]"
          ></el-image>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button icon="el-icon-close" @click="createDialogVisiable = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="submitForm('form')"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="高德地图" :visible.sync="dialogVisible" width="50%">
      <Map v-if="dialogVisible" @mapTab="mapTab" :lng="form.lng" :lat="form.lat"></Map>
    </el-dialog>

    <el-dialog
      :visible.sync="viewQR"
      @before-close="closeQR"
      width="20%"
    >
      <div style="display: flex;flex-direction: column;align-items: center">
<!--        <qr-code v-if="viewQR" :url="url" ref="qrCodeUrl"></qr-code>-->
        <Qr v-if="viewQR" :url="url" ref="qrCodeUrl"></Qr>
        <div class="tips" style="text-align: center;margin: 20px 0;">点击二维码保存图片</div>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import SingleFileUpload from "@/components/common/SingleFileUpload";
import Map from "@/components/page/XunJian/Map";
import resource from "@/resource";
import { mapState } from "vuex";
// import QrCode from "@/components/common/QrCode";
import moment from "moment";
import Qr from "@/components/common/QR.vue";

export default {
  components: { "my-upload": SingleFileUpload, Map ,Qr},
  computed: {
    ...mapState(["org_id", "httpurl"]),
  },
  props: ["renwu_id"],
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        name: null,
        sn: null,
        category: null,
        lat: 0,
        lng: 0,
        desc: null,
        photo: null,
        is_enabled: "是",
        json: [],
        zhouqi: "",
        renwu_id: null,
        template_id: "FT6628950761472",
      },
      filterData: {
        search: null,
      },
      data: [],
      createDialogVisiable: false,
      dialogVisible: false,
      viewQR: false,
      qrcode: null,
      inputValue: "",
      inputVisible: false,
      center: [],
      url: null,
      loading: false,
    };
  },
  methods: {
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        renwu_id: this.renwu_id,
        biz_id: this.$bizCode.xunjian_biz,
        source_id: this.$sourceCode.source_id,
        template_id: "FT6628950761472",
      };
      if(this.filterData.search){
        params.search = this.filterData.search;
      }
      if(this.filterData.sn){
        params.sn = this.filterData.sn;
      }
      let res = await resource.getList("data", params);
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].json = JSON.parse(res.data[i].json);
      }
      this.total = res.count;
      this.data = res.data;
      //循环data去调用接口
      let resArr = []; // 存放接口返回的数据
      for (let i = 0; i < this.data.length; i++) {
        let res = await resource.getList("data", {
          page: 1,
          pageSize: 1,
          xiangmu_id: this.data[i].pk,
          biz_id: this.$bizCode.xunjian_biz,
          source_id: this.$sourceCode.source_id,
          template_id: "FT6632213925888",
        });
        resArr.push(res.data[0]);
      }
      // 循环resArr和data,如果data的pk和resArr的xiangmu_id相等,就把resArr的数据添加到data里面
      for (let i = 0; i < this.data.length; i++) {
        // 先过滤掉resArr里面为undefined的数据
        resArr = resArr.filter((item) => {
          return item !== undefined;
        });
        for (let j = 0; j < resArr.length; j++) {
          if (this.data[i].pk === resArr[j].xiangmu_id) {
            this.data[i].tongji = resArr[j];
          }
        }
      }
      this.loading = false;
    },

    tableRowClassName({ row }) {
      if (row.tongji.xun_jian_state === "是") {
        return "errorStatus";
      }
      if (row.tongji.xun_jian_state === "否") {
        return "trueStatus";
      }
    },

    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            ...this.form,
            json: JSON.stringify(this.form.json),
            renwu_id: this.renwu_id,
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

    copy(obj) {
      this.$confirm("是否复制?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let data = {
            ...obj,
            json: JSON.stringify(obj.json),
            pk: null,
            sn: null,
          };
          await resource.createObj("data", data);
          this.$message({
            type: "success",
            message: "复制成功!",
          });
          setTimeout(() => {
            this.loadData();
            this.clearFormData("form");
          }, 200);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消复制",
          });
        });
    },

    del(info) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await resource.deleteList(
            {
              pk: info.pk,
            },
            info.template_id
          );
          await resource.deleteList(
            {
              xuangmu_id: info.pk,
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 搜索
    // async search() {
    //   this.loading = true;
    //   let params_search = {};
    //   let check = Object.prototype.toString;
    //   for (const key in this.filterData) {
    //     if (check.call(this.filterData[key]) === "[object Array]") {
    //       params_search[key + "_before"] = this.filterData[key][0];
    //       params_search[key + "_after"] = this.filterData[key][1];
    //     } else {
    //       params_search[key] = this.filterData[key];
    //     }
    //   }
    //   let params = {
    //
    //     biz_id: this.$bizCode.xunjian_biz,
    //     src_id: this.$sourceCode.source_id,
    //     template_id: "FT6628950761472",
    //     ...params_search,
    //   };
    //   let res = await resource.getList("data", params);
    //   this.data = res;
    //   this.loading = false;
    // },

    // 清除表格数据
    clearFormData(formName) {
      this.form = {
        name: null,
        sn: null,
        category: null,
        lat: 0,
        lng: 0,
        desc: null,
        photo: null,
        is_enabled: "是",
        json: [],
        zhouqi: "",
        renwu_id: null,
        template_id: "FT6628950761472",
      };
      //this.$refs[formName].resetFields();
    },

    // 清除位置信息
    clearPosition() {
      this.form.lat = 0;
      this.form.lng = 0;
    },

    // 显示修改
    edit(obj) {
      obj.lng = Number(obj.lng);
      obj.lat = Number(obj.lat);
      this.form = { ...obj };
      this.createDialogVisiable = true;
    },

    // 结果
    cpresult(xiangmu_id) {
      this.$router.push({
        name: "xunjian-jieguo",
        query: {
          xiangmu_id: xiangmu_id,
        },
      });
    },

    // 上传图片显示
    changeBackground(val) {
      // 判断类型是不是图片类型的
      let name = val.name;
      let index = name.lastIndexOf(".");
      let valType = name.substring(index);
      if (['.jpg','.png','.jpeg','.webp'].includes(valType)) {
        this.form.photo = val.response.file;
      }
    },

    // 地图经纬度
    mapTab(data) {
      this.form.lng = data.lng;
      this.form.lat = data.lat;
      this.center = [data.lng, data.lat];
    },
    // 二维码
    creatQrCode(pk) {
      this.viewQR = true;
      this.url = window.location.origin + "/mobile/xunjianinfo?pk=" + pk;
    },

    closeQR() {
      this.qrcode.clear();
    },
    ShiLiTo() {
      this.$router.push("/xunjianzhanshi");
    },

    // 自定义标签
    handleClose(tag) {
      this.form.json.splice(this.form.json.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.json.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
  async mounted() {
    await this.loadData();
  },
  created() {},
};
</script>
<style >
.errorStatus td {
  color: red;
}
.trueStatus td {
  color: black;
}
.el-dialog__body {
  padding: 10px !important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
