<template>
  <div style="position:relative">
    <el-form inline>
      <el-form-item>
        <el-button type="warning" icon="el-icon-download" @click="downloadExcelTemplate">下载模板</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload action="" accept=".xlsx,.xls" :http-request="httpRequest" :show-file-list="false">
          <el-button type="primary" icon="el-icon-upload">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="tips">
      <span>数据导入确认无误后请及时提交!</span>
    </div>
    <el-table :data="data.slice((page-1)*pageSize,page*pageSize)" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" @selection-change="(data) => (batchDelData = data)" v-loading="loading" element-loading-text="导入中...">
      <el-table-column type="selection" width="55"></el-table-column>
      
      <el-table-column label="创建人" prop="user_id"></el-table-column>
      <el-table-column label="创建部门" prop="dep_id"></el-table-column>
      <el-table-column label="创建时间" prop="create_time"></el-table-column>
      <el-table-column label="表单名称" prop="name"></el-table-column>
      <el-table-column label="使用部门范围" prop="use_dep"></el-table-column>
      <el-table-column label="表单备注" prop="remark"></el-table-column>
      <el-table-column label="表格配置" prop="peizhi"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button title="编辑" circle type="primary" icon="el-icon-edit" @click="editExcelTable(row)" />
          <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="确定删除吗？" @confirm="delExcelTable(row)">
            <el-button slot="reference" title="删除" circle type="danger" icon="el-icon-remove" />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
    </el-pagination>

    <div class="batchCtl">
      <el-button type="success" icon="el-icon-check" @click="batchSubmit">批量提交</el-button>
      <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="确定删除吗？" @confirm="batchDelete">
        <el-button type="danger" icon="el-icon-delete" slot="reference">批量删除</el-button>
      </el-popconfirm>
    </div>

    <el-dialog :visible.sync="excelEditDialogVisible" append-to-body title="编辑" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close>
      <Form :form="form" ref="FormComp" @checked="editedForm" />
      <div slot="footer">
        <el-button @click="excelEditDialogVisible = false" icon="el-icon-close">取消</el-button>
        <el-button @click="$refs.FormComp.submit()" icon="el-icon-check" type="primary">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import Form from "./Form.vue";
import moment from "moment";
import XLSX from "xlsx";

const TEMPLATE_ID = "FT341057895368679424";

export default {
  name: "Excel",
  data() {
    return {
    data: [],
    batchDelData: [],
    form: {},
    loading: false,
    excelEditDialogVisible: false,
    page: 1,
    pageSize: 10,
    excelTmp: {
       "创建人": "user_id",
       "创建部门": "dep_id",
       "创建时间": "create_time",
       "表单名称": "name",
       "使用部门范围": "use_dep",
       "表单备注": "remark",
       "表格配置": "peizhi",
      
    }
    }
  },
  methods: {
    editExcelTable(row) {
      this.form = {
        ...row
      };
      this.excelEditDialogVisible = true;
    },
    delExcelTable(row) {
      let idx = this.data.findIndex((i) => i.identifier_id === row.identifier_id);
      this.data.splice(idx, 1);
    },
    editedForm() {
      let idx = this.data.findIndex((i) => i.identifier_id === this.form.identifier_id);
      this.data.splice(idx, 1, this.form);
      this.excelEditDialogVisible = false;
    },
    downloadExcelTemplate() {
      let header = [
        "创建人",
        "创建部门",
        "创建时间",
        "表单名称",
        "使用部门范围",
        "表单备注",
        "表格配置",
      ]
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet([], {
        header
      });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "template.xlsx");
    },
    httpRequest(e) {
      this.loading = true;
      try {
        let file = e.file; // 文件信息
        if (!file) {
          return false;
        } else if (!/.(xls|xlsx)$/.test(file.name.toLowerCase())) {
          // 格式根据自己需求定义
          this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
          return false;
        }
        const fileReader = new FileReader();
        fileReader.onload =async (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
            cellDates: true,
          });
          const exlname = workbook.SheetNames[0];
          const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]); // 生成json表格内容
          let template = await this.$resource.getObj("formtemplate", TEMPLATE_ID);
          let excelData = exl.slice((JSON.parse(template.header_conf).start)-2);
          if (excelData && excelData.length > 0) {
            let tmp = [];
            excelData.forEach(i => {
              let obj = {
                template_id: TEMPLATE_ID
              };
              for (const key in i) {
                if(i[key] instanceof Date){
                  obj[this.excelTmp[key]] = moment(i[key]).add(1,'day').format('YYYY-MM-DD');
                }else{
                  obj[this.excelTmp[key]] = i[key];
                }
              }
              tmp.push(obj);
            })
            this.data.push(...tmp)
          }
        } catch (e) {
          return false;
        }
        this.loading = false;
        };
        fileReader.readAsBinaryString(file);
      } catch (err) {
        this.$message.error("导入失败，请重试!");
        this.loading = false
      }
    },
    async batchSubmit() {
      if (this.data.length === 0) {
        return this.$message.error("请导入数据后再提交!")
      }
      try {
        await this.$resource.createObj("data", this.data.reverse());
        this.$message.success("提交成功!");
        this.$emit("close");
        this.$emit("loadData");
      } catch (err) {
        this.$message.error("提交失败，请稍后再试!");
      }
    },
    batchDelete() {
      if (this.batchDelData.length === 0) {
        return this.$message.error("请选择要删除的数据!")
      }
      this.batchDelData.forEach((i) => {
        let idx = this.data.findIndex((j) => j === i);
        this.data.splice(idx, 1);
      });
      this.$message.success("删除成功!");
    }
  },
  components: {
    Form,
  },
}
</script>
<style scoped>
.batchCtl {
  position: absolute;
  bottom: 0;
  right: 0;
}

.tips {
  position: absolute;
  right: 0;
  top: 0;
  color: red;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
