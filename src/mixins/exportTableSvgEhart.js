/**
 *
 * ******************注意事项************************
 *
 *
 * 1. 需要在main.js引入EventBus      this.$bus = EventBus;
 *
 *
 * 2. (1). 导出excel按钮 @click=$bus.$emit('charts')
 *    (2). 导出表格按钮 @click=$bus.$emit('report')
 *    (3). 导出svg按钮 @click=$bus.$emit('svg')
 *
 *
 * 3. 需要在data定义接收图表(exportEchartsData)和表格(exportReportData)和svg(exportSvgData)的数组
 * 然后在watch监听这三个数据handler判断各自的长度是否和Board组件的数量相等,如相等:
 * exportEchartsData调用 exportEchart方法 params: title(导出的word名字)
 * exportReportData 调用 exportReport方法 params: title(导出的excel名字)
 * exportSvgData 调用 exportSvg方法 params: 无
 *
 *
 */
import XLSX from "xlsx";
import FileSaver from "file-saver";
import {BASE_HOST} from "../constvars";
export default {
    methods: {
        registerEvt() {
            this.$bus.$on("base64Img", async (data) => {
              console.log(data,'data');
                await this.exportEchartsData.push(data);
            });
            this.$bus.$on("exportTableData", async (data) => {
                await this.exportReportData.push(data);
            });
            this.$bus.$on("exportSvgData", async (data) => {
                await this.exportSvgData.push(data);
            });
        },
        exportEchart(title) {
            let obj = {};

            this.exportEchartsData.forEach((i) => {
                Object.assign(obj, i);
            });
            let form = document.createElement("form");
            form.action = BASE_HOST+"/api/v1/exportword/";
            form.target = "_blank";
            form.method = "post";
            for (const key in obj) {
                let input = document.createElement("input");
                input["type"] = "hidden";
                input["name"] = key;
                input["value"] = obj[key];
                form.appendChild(input);
            }
            let input1 = document.createElement("input");
            input1["type"] = "hidden";
            input1["name"] = "title";
            input1["value"] = title;
            form.appendChild(input1);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
            this.exportEchartsData = [];
        },
        exportReport(title) {
            let workbook = XLSX.utils.book_new();
            this.exportReportData.forEach((i) => {
                XLSX.utils.book_append_sheet(workbook, i.data, i.name);
            });
            var wbOut = XLSX.write(workbook, {
                bookType: "xlsx",
                bookSST: true,
                type: "array",
            });
            try {
                FileSaver.saveAs(
                    new Blob([wbOut], { type: "application/octet-stream" }),
                    ` ${title}.xlsx`
                );
            } catch { }
            this.exportTableList = [];
        },
        exportSvg() {
            let obj = {};
            this.exportSvgData.forEach((i) => {
                Object.assign(obj, i);
            });
            let form = document.createElement("form");
            form.action = BASE_HOST+"/api/v1/exportsvg/";
            form.target = "_blank";
            form.method = "post";
            for (const key in obj) {
                let input = document.createElement("input");
                input["type"] = "hidden";
                input["name"] = key;
                input["value"] = obj[key];
                form.appendChild(input);
            }
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
            this.exportEchartsData = [];
        }
    },
    created() {
        this.registerEvt()
    }
}
