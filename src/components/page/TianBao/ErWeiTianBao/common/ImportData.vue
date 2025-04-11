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
    <el-table :data="data" border stripe :cell-style="{textAlign:'center'}"
              :header-cell-style="{textAlign:'center'}"
              @selection-change="selectChange"
              v-loading="loading" element-loading-text="导入中...">
      <el-table-column type="selection" reserve-selection width="55"></el-table-column>
      <el-table-column v-for="(item, index) in tableHeader"
                       :label="item.name"
                       :key="index"
                       :prop="`${item.value}`">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button title="编辑" circle type="primary" icon="el-icon-edit" @click="editExcelTable(row)"/>
          <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
                         icon-color="red" title="确定删除吗？" @confirm="delExcelTable(row)">
            <el-button slot="reference" title="删除" circle type="danger" icon="el-icon-remove"/>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>


    <div style="padding:10px 0 10px">
       <el-popconfirm style="margin:0px 10px 0 10px;float: left;" confirm-button-text='确定' cancel-button-text='取消'
                     icon="el-icon-info"
                     icon-color="red" title="确定删除吗？" @confirm="batchDelete">
        <el-button :type="batchDelData.length>0?'danger':'info'" icon="el-icon-delete" slot="reference">批量删除</el-button>
      </el-popconfirm>
      <el-button style="margin:0px 10px 0 10px;float: right" :type="data.length>0?'success':'info'" icon="el-icon-check" @click="batchSubmit">保存全部</el-button>
    </div>
    <el-dialog :visible.sync="excelEditDialogVisible" append-to-body title="编辑" width="50%"
               :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close>
      <Form :form="form" :tableHeader="tableHeader" ref="FormComp" @checked="editedForm"/>
      <div slot="footer">
        <el-button @click="excelEditDialogVisible = false" icon="el-icon-close">取消</el-button>
        <el-button @click="$refs.FormComp.submit()" icon="el-icon-check" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Form from "./ImportForm.vue";
import moment from "moment";
import resource, {
  createObj,
  getObj
} from "@/resource"
import XLSX from "xlsx";
import {mapState} from "vuex";

export default {
  name: "Excel",
  model: {
    prop: "tableHeader"
  },
  computed: {
    ...mapState(["userinfo"]),
  },
  props: {
    tableHeader: {
      type: Array,
    },
    title: {
      type: String,
    },
    tid: {
      type: String,
    },
  },
  data() {
    return {
      data: [],
      batchDelData: [],
      form: {},
      loading: false,
      excelEditDialogVisible: false,
      excelTmp: {},
    }
  },
  methods: {
    selectChange(data){
      this.batchDelData = data;
    },
    editExcelTable(row) {
      this.form = {
        ...row
      };
      this.excelEditDialogVisible = true;
    },
    delExcelTable(row) {
      let idx = this.data.findIndex((i) => i.index === row.index);
      this.data.splice(idx, 1);
    },
    editedForm() {
      let idx = this.data.findIndex((i) => i.index === this.form.index);
      this.data.splice(idx, 1, this.form);
      this.excelEditDialogVisible = false;
    },
    downloadExcelTemplate() {
      let header = [];
      for (let item of this.tableHeader) {
        header.push(item.name);
      }
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet([], {
        header
      });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, this.title + "导入模板.xlsx");
    },
    async httpRequest(e) {
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
        this.data = await new Promise((resolve, reject)=>{
        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result;
            const workbook = XLSX.read(data, {
              type: "binary",
              cellDates: true,
            });
            const exlname = workbook.SheetNames[0];
            const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]); // 生成json表格内容
            // let template = await getObj("formtemplate", "FT301977801653833728");
            let excelData = exl.slice(0);
            if (excelData && excelData.length > 0) {
              let tmp = [];
              excelData.forEach((item, index) => {
                let obj = {
                  index: index,
                  template_id: this.tid,
                  user_id: this.userinfo.pk,
                };
                for (const key in item) {
                  if (item[key] instanceof Date) {
                    obj[this.excelTmp[key]] = moment(item[key]).add(1, 'day').format('YYYY-MM-DD');
                  } else {
                    obj[this.excelTmp[key]] = item[key];
                  }
                }
                tmp.push(obj);
              })
              resolve(tmp);
            }

          } catch (e) {
            console.error(e);
          }
        };
        fileReader.readAsBinaryString(file);
        });
          this.loading = false;
      } catch (err) {
        console.error(err)
        this.$message.error("导入失败，请重试!");
        this.loading = false
      }
    },
    async batchSubmit() {
      if (this.data.length === 0) {
        return this.$message.error("请导入数据后再提交!")
      }
      try {
        await createObj("data", this.data.reverse());
        // 写日志
        await this.LogEdit(`向${this.title}中导入了${this.data.length}行数据`);
        this.$message.success("提交成功!");
        this.$emit("close");
        this.$emit("loadData");
      } catch (err) {
        this.$message.error("提交失败，请稍后再试!");
      }
    },
    async LogEdit(content) {
      await resource.createObj('systemlog', {
        "log_level": 2,
        "log_type": this.tid,
        "user": this.userinfo.pk,
        "content": content,
        "user_name": this.userinfo.full_name || this.userinfo.username
      });
    },
    batchDelete() {
      if (this.batchDelData.length === 0) {
        return this.$message.error("请选择要删除的数据!")
      }
      this.batchDelData.forEach((i) => {
        let idx = this.data.findIndex((j) => j.index === i.index);
        this.data.splice(idx, 1);
      });
      this.batchDelData = [];
      this.$message.success("删除成功!");
    }
  },
  mounted() {
    for (let item of this.tableHeader) {
      this.excelTmp[item.name] = item.value;
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
