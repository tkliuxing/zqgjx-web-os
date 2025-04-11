<template>
  <div class="app-content">
    <el-row>
      <el-col :span="7">
        <el-upload
          action="/"
          :on-change="onChange"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xls, .xlsx"
        >
          <el-button size="small" round icon="el-icon-upload2" type="primary"
            >Excel录入</el-button
          >
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import XLSX from "xlsx";
export default {
  data() {
    return {
      outputs: [], // 保存读取出来的数据列表
      fileData: "", // 保存选择的文件数据
    };
  },
  props: {
    formTable: {
      type: Array,
      default() {
        return [];
      },
    },
    textTable: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    //文件选择时
    onChange(file, fileList) {
      this.fileData = file; // 保存当前选择文件
      this.readExcel(); // 调用读取数据的方法
    },

    //读取文件数据
    readExcel(e) {
      let that = this;
      const files = that.fileData;
      if (!files) {
        //如果没有文件
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
            cellDates:true
          });
          //导入的文件名称
          // console.log(workbook.SheetNames);
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          that.outputs = []; //清空接收数据
          
          for (let i = 0; i < ws.length; i++) {
            let obj = {}
            for (let j = 0; j < that.formTable.length; j++) {
              obj[that.formTable[j]]= ws[i][that.textTable[j]]
            }
            that.outputs.push(obj);
          }
          
          that.$emit("getTableList", that.outputs);

        } catch (e) {
          console.log(e);
          return false;
        }
      };
      // 如果为原生 input 则应是 files[0]
      fileReader.readAsBinaryString(files.raw);
    },

    //格式转换
    formatJson(filterVal) {
      return this.outputs.map((v) =>
        // obj = {
        //   name:'',
        //   age:''
        // }
        filterVal.map((j) => {
          // obj[name]
          // obj[age]
          return v[j];
        })
      );
      // [[name,age],[name,age],[name,age]]
    },
  },
};
</script>

<style></style>
