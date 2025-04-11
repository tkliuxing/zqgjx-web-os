// 以下方法仅用于人社局做导出使用
import XLSX from "xlsx";

export default {
  data(){
    return{
      excelDownload: {
          timu: "题目",
          zhushi: "注释",
      },
    }
  },
  computed:{

  },
  methods:{
    Result(item) {
      if (item.shiti_id_leixing == '单选') {
        return item[`xuanxiang_0${item.result}`] || '';
      } else if (item.shiti_id_leixing == '多选') {
        let results = JSON.parse(item.result);
        return results.map(r => item[`xuanxiang_0${r}`]).filter(Boolean).join(', ');
      } else if (item.shiti_id_leixing == '问答') {
        return item.result.replace(/\"/g, ''); // 去除引号
      }
      return item.result;
    },
    async Titledaochu(){
      if(this.mingxiData.length<=0) return this.$message.warning('暂无数据...')
      let header = [
        "题目",
        "注释",
      ]
      let tmp = [];
      const firstItem = this.mingxiData[0];
      for (let i = 1; i <= 10; i++) {
        const key = `xuanxiang_0${i}`;
        if (firstItem[key] && !header.includes(firstItem[key])) {
          header.push(firstItem[key]); // 使用映射表头
          this.excelDownload = {
            ...this.excelDownload,
            [firstItem[key]]: firstItem[key],
          }
        }
      }

      this.mingxiData.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if(['timu','zhushi'].includes(key)){
            obj[this.excelDownload[key]] = i[key];
          }else{
            obj[this.excelDownload[key]] = ''
          }
          let xuanxiangKeys = ['xuanxiang_01', 'xuanxiang_02', 'xuanxiang_03', 'xuanxiang_04', 'xuanxiang_05', 'xuanxiang_06', 'xuanxiang_07', 'xuanxiang_08', 'xuanxiang_09', 'xuanxiang_10'];
          xuanxiangKeys.forEach((item) => {
            if (i.hasOwnProperty(item)) {
              let value = i[item];
              if(value && key == 'result' && value == this.Result(i)){
                obj[this.excelDownload[value]] = this.Result(i);
              }
            }
          });
        }
        tmp.push(obj);
      });
      let aa = tmp.map(obj => {
        return Object.fromEntries(
          Object.entries(obj).filter(([key, value]) => key !== 'undefined' && value !== undefined)
        );
      });
      // tmp数组中过滤掉key为undefined的
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(aa, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "明细列表.xlsx");
    },

   // 汇总导出
    async DaoChuHZ(){
      if(this.huizongData.length<=0) return this.$message.warning('暂无数据...')
      let NumData = this.huizongData[0]

      function padStart(str, length, char) {
        str = String(str);
        while (str.length < length) {
          str = char + str;
        }
        return str;
      }
      function countOptions(data) {
        const optionCount = {};

        data.forEach(item => {
          const { pk, shiti_id_leixing, timu, zhushi,
            ...options
          } = item;
          if (!optionCount[pk]) {
            optionCount[pk] = { timu, zhushi, 单选: {}, 多选: {},选项:{
                [NumData['xuanxiang_01']]:item.xuanxiang_01,
                [NumData['xuanxiang_02']]:item.xuanxiang_02,
                [NumData['xuanxiang_03']]:item.xuanxiang_03,
                [NumData['xuanxiang_04']]:item.xuanxiang_04,
                [NumData['xuanxiang_05']]:item.xuanxiang_05,
                [NumData['xuanxiang_06']]:item.xuanxiang_06,
                [NumData['xuanxiang_07']]:item.xuanxiang_07,
                [NumData['xuanxiang_08']]:item.xuanxiang_08,
                [NumData['xuanxiang_09']]:item.xuanxiang_09,
                [NumData['xuanxiang_10']]:item.xuanxiang_10,
              } };
          }
          if (shiti_id_leixing === '单选') {
            const optionKey = `xuanxiang_${padStart(item.result, 2, '0')}`;
            const optionValue = options[optionKey];
            if (optionValue && optionCount[pk].选项[optionValue]) {
              optionCount[pk].单选[optionValue] = (optionCount[pk].单选[optionValue] || 0) + 1;
            }
          }
          if (shiti_id_leixing === '多选') {
            const results = JSON.parse(item.result);
            results.forEach(res => {
              const optionKey = `xuanxiang_${padStart(res, 2, '0')}`;
              const optionValue = options[optionKey];
              if (optionValue && optionCount[pk].选项[optionValue]) {
                optionCount[pk].多选[optionValue] = (optionCount[pk].多选[optionValue] || 0) + 1;
              }
            });
          }
        });
        return optionCount;
      }
      const optionCount = countOptions(this.huizongData);
      function updateOptions(单选, 多选, 选项) {
        for (let key in 选项) {
          let value =选项[key];
          // 对于单选
          if (单选[value]) {
            选项[key] = 单选[value];
          }
          // 对于多选
          if (多选[value]) {
            选项[key] = 多选[value];
          }
        }
      }
      function convertToSheetData(optionCount) {
        let sheetData = [];

        for (const pk in optionCount) {
          const item = optionCount[pk];
          updateOptions(item.单选, item.多选, item.选项);
          const timu = item.timu;
          const zhushi = item.zhushi;
          let row = {
            题目: timu,
            注释: zhushi,
            [NumData['xuanxiang_01']]: typeof item.选项[NumData['xuanxiang_01']] != 'number' ? 0 : item.选项[NumData['xuanxiang_01']],
            [NumData['xuanxiang_02']]: typeof item.选项[NumData['xuanxiang_02']] != 'number' ? 0 : item.选项[NumData['xuanxiang_02']],
            [NumData['xuanxiang_03']]: typeof item.选项[NumData['xuanxiang_03']] != 'number' ? 0 : item.选项[NumData['xuanxiang_03']],
            [NumData['xuanxiang_04']]: typeof item.选项[NumData['xuanxiang_04']] != 'number' ? 0 : item.选项[NumData['xuanxiang_04']],
            [NumData['xuanxiang_05']]: typeof item.选项[NumData['xuanxiang_05']] != 'number' ? 0 : item.选项[NumData['xuanxiang_05']],
            [NumData['xuanxiang_06']]: typeof item.选项[NumData['xuanxiang_06']] != 'number' ? 0 : item.选项[NumData['xuanxiang_06']],
            [NumData['xuanxiang_07']]: typeof item.选项[NumData['xuanxiang_07']] != 'number' ? 0 : item.选项[NumData['xuanxiang_07']],
            [NumData['xuanxiang_08']]: typeof item.选项[NumData['xuanxiang_08']] != 'number' ? 0 : item.选项[NumData['xuanxiang_08']],
            [NumData['xuanxiang_09']]: typeof item.选项[NumData['xuanxiang_09']] != 'number' ? 0 : item.选项[NumData['xuanxiang_09']],
            [NumData['xuanxiang_10']]: typeof item.选项[NumData['xuanxiang_10']] != 'number' ? 0 : item.选项[NumData['xuanxiang_10']],
          };
          sheetData.push(row)
        }
        return sheetData;
      }
      const sheetData = convertToSheetData(optionCount);
      let aa = sheetData.map(obj => {
        return Object.fromEntries(
          Object.entries(obj).filter(([key, value]) =>key !== ''&& key !== 'undefined' && value !== undefined&& key !== 'null' && value !== null)
        );
      });
      // 导出到 Excel 文件
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(aa);
      XLSX.utils.book_append_sheet(wb, ws, "统计结果");
      XLSX.writeFile(wb, "汇总统计.xlsx");
    },
  }
}