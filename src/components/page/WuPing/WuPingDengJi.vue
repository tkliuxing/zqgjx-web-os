<template>
  <el-card v-loading="loading" element-loading-text="导入中...">
    <div style="
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        align-items: center;
      ">
      <div>
        <el-button icon="el-icon-plus" @click="addItemsVisable = true" type="primary">新增</el-button>
        <el-button icon="el-icon-download" @click="downloadTmp" type="success">导入模板</el-button>
        <el-button icon="el-icon-upload" @click="$refs.file.click()" type="info">物品导入</el-button>
      </div>
      <h2>{{ $route.params.categoryName }}</h2>
      <el-button type="info" @click="$router.go(-1)" icon="el-icon-back">返回</el-button>
    </div>
    <el-table :data="data" :cell-style="{ textAlign: 'center' }" border stripe :header-cell-style="{ textAlign: 'center' }">
<!--      <el-table-column label="物品名称" prop="name"></el-table-column>-->
<!--      <el-table-column label="规格型号" prop="size"></el-table-column>-->
<!--      <el-table-column label="单位" prop="unit"></el-table-column>-->
      <el-table-column label="物品数量" prop="number"></el-table-column>
      <el-table-column label="物品单价" prop="price"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
<!--      <el-table-column label="图片">-->
<!--        <template slot-scope="{ row }">-->
<!--          <el-image v-if="row.photo" :src="row.photo" :preview-src-list="[row.photo]" fit="fill" style="width: 100px; height: 100px">-->
<!--          </el-image>-->
<!--          <span v-else>暂无图片！</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" width="240">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="editItems(row)" icon="el-icon-edit">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="delItems(row)" style="margin-left: 10px">
            <el-button type="danger" slot="reference" icon="el-icon-remove">
              删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 10px" @size-change="
        (pageSize) => {
          this.pageSize = pageSize;
          this.getItems();
        }
      " @current-change="
        (page) => {
          this.page = page;
          this.getItems();
        }
      " :current-page="page" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog :visible.sync="addItemsVisable" center :title="form.pk ? '编辑' : '新增'" @closed="clear">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
<!--        <el-form-item label="物品名称" prop="name">-->
<!--          <el-input v-model="form.name"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="规格型号">-->
<!--          <el-input v-model="form.size"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="单位">-->
<!--          <el-input v-model="form.unit"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="物品数量" prop="number">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="物品单价" prop="price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
<!--        <el-form-item label="图片">-->
<!--          <el-upload :action="BASE_HOST+'/api/v1/fileupload/'" :data="uploadData"-->
<!--                     :headers="headers" list-type="picture-card" :limit="1"-->
<!--                     :on-exceed="handleExceed" :on-success="handleSuccess" :file-list="fileList" :on-remove="handleRemove">-->
<!--            <i class="el-icon-plus"></i>-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer">
        <el-button @click="addItemsVisable = false" icon="el-icon-close">取消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="submit">确定</el-button>
      </div>
    </el-dialog>
    <input type="file" accept=".xls,.xlsx" style="display:none" ref="file" @change="uploadExcel" />
  </el-card>
</template>

<script>
import resource from "../../../resource";
import {BASE_HOST} from "../../../constvars";
import { mapState } from "vuex";
import XLSX from "xlsx";
export default {
  name: "WuPingDengJi",
  computed: {
    ...mapState(["token"]),
  },
  data() {
    return {
      BASE_HOST,
      data: [],
      form: {},
      addItemsVisable: false,
      page: 1,
      pageSize: 10,
      total: 0,
      rules: {
        number: [{ required: true, message: "请输入物品数量",trigger: 'blur'},{
          pattern: /^[0-9]+$/,
          message: '物品数量只能为数字',
          trigger: 'blur'
        }],
        price: [ { required: true, message: '物品单价不能为空', trigger: 'blur' },
          {
            pattern: /^[0-9]+(\.[0-9]{1,4})?$/,
            message: '物品单价必须为数字，最多保留四位小数',
            trigger: 'blur'
          }],
      },
      uploadData: {
        sys_id: 5,
        biz_id: 1,
      },
      headers: {
        Authorization: "",
      },
      fileList: [],
      loading: false,
    };
  },
  methods: {
    clear() {
      this.fileList = [];
      this.initForm();
    },
    initForm() {
      this.form = {
        name: "",
        category: this.$route.params.pk,
        root: this.$route.params.root,
        size: "",
        unit: "",
        number: "",
        price: "",
        remark: "",
        photo: "",
      };
      this.headers.Authorization = `Bearer ${this.token}`;
    },
    async getItems() {
      let res = await resource.getList("data", {
        template_id: "FT140632863333752832",
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
        page: this.page,
        pageSize: this.pageSize,
        category: this.$route.params.pk,
      });
      this.data = res.data;
      this.total = res.count;
    },
    editItems(row) {
      this.form = { ...row };
      // if (row.photo) {
      //   this.fileList = [{ url: row.photo, name: "图片" }];
      // }
      this.addItemsVisable = true;
    },
    async delItems(row) {
      try {
        await resource.deleteObj('data', row.pk, 1, "FT140632863333752832")
        this.$message.success("删除成功!");
        this.getItems();
      } catch (error) {
        this.$message.error("删除失败!");
      }
    },
    handleSuccess(resp) {
      if (resp.file) {
        this.form.photo = resp.file;
      }
    },
    handleRemove() {
      this.form.photo = null;
    },
    handleExceed() {
      this.$message.warning("只允许上传一张照片!");
    },
    async submit() {
      let valid = await new Promise((resolve) =>
        this.$refs.form.validate((validate) => resolve(validate))
      );
      if (valid) {
        try {
          let data = {
            template_id: "FT140632863333752832",
            biz_id: this.$bizCode.wuping_biz,
            src_id: this.$sourceCode.source_id,
            ...this.form,
          }
          if (this.form.pk) {
            await resource.updateObj("data", this.form.pk, data);
            this.$message.success("编辑成功!");
          } else {
            await resource.createObj("data", data);
            this.$message.success("新建成功!");
          }
          this.$refs.form.resetFields();
          this.addItemsVisable = false;
          this.getItems();
          this.initForm();
        } catch (error) { }
      } else {
        this.$message.error("请检查表单!");
      }
    },
    downloadTmp() {
      let a = document.createElement("a");
      a.href = "/wupintemplate.xlsx";
      a.click();
    },
    uploadExcel(evt) {
      this.loading = true;
      const files = evt.target.files[0];
      if (!files) {
        //如果没有文件
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = async (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], {
            defval: "",
          }); //生成json表格内容
          if (ws.length > 0) {
            let check = ws.every((j) => {
              let value = Object.values(j);
              if (value[0] && value[1]) {
                return true;
              }
              return false;
            });
            if (check) {
              for (let i = 0; i < ws.length; i++) {
                const e = ws[i];
                let value = Object.values(e);
                let data = {
                  template_id: "FT140632863333752832",
                  biz_id: this.$bizCode.wuping_biz,
                  src_id: this.$sourceCode.source_id,
                  // name: value[0],
                  category: this.$route.params.pk,
                  root: this.$route.params.root,
                  // size: value[1],
                  // unit: value[2],
                  number: value[0],
                  price: value[1],
                  remark: value[2],
                  // photo: "",
                };
                await resource.createObj("data", data);
              }
              this.$message.success("导入成功!");
              this.getItems();
            } else {
              this.$message.error("导入失败！模板中物品数量、物品单价为必填项！");
            }
            this.loading = false;
          } else {
            return this.$message.error("您导入了一张空表!");
          }
        } catch (error) {
          console.log(error.response);
        }
        this.loading = false;

      };
      fileReader.readAsBinaryString(files);
    },
  },
  created() {
    this.initForm();
    this.getItems();
  },
};
</script>

<style></style>
