import _ from "lodash"

/**
 * 获取X轴的数据
 * @param {数据} data
 * @param {图表配置} config
 */
function getX(data, config) {
  let arr = [];
  data.forEach((i) => {
    let res = i[config["x"]["key"]];
    arr.push(res);
  });
  return arr;
}

/**
 * 生成图表
 * @param {String} title 图表标题
 * @param {String} x x轴关键字
 * @param {Object} y y轴header对象
 * @param {String} type 图表类型: line | bar | pie
 */
function genChartConfig(title, x, y, type){
  if(!_.isPlainObject(y)){
    throw Error('y 类型错误, 需要header');
  }
  if(!_.isString(x)){
    throw Error('x 类型错误, 需要字符串');
  }
  if(!_.isString(title)){
    throw Error('title 类型错误, 需要字符串');
  }
  if(!_.isString(type)){
    throw Error('type 类型错误, 需要字符串');
  }
  if(['line', 'bar', 'pie'].indexOf(type) < 0){
    throw Error('type 类型错误, 需要字符串 line 或 bar 或 pie');
  }
  return {
    "chart_name": title,
    "more": true,
    "x": {
      "key": x
    },
    "y": [{
      "key": y.key,
      "name": y.title,
      "type": type,
      "index": 0
    }],
    "yAxis": [{
      "name": y.title,
      "axisLabel": {
        "formatter": "{value}"
      },
      "splitLine": {
        "show": true
      }
    }]
  };
}

/**
 * 生成图表组件需要的数据
 * @param {String} report_data 报表接口原始数据，无副作用
 * @param {String} title 图表标题
 * @param {Array} data_headers 数据列header数组
 * @param {Object} group_header 分组列header
 * @param {String} type 图表类型: line | bar | pie
 */
function getChartsData(report_data, title, data_headers, group_header, type){
  console.log(data_headers)
  let data_keys = _.map(data_headers, e=>e.key);
  console.log(data_keys);
  let tubiao_data = JSON.parse((JSON.stringify(report_data)));
  tubiao_data.data = _.map(_.uniqBy(tubiao_data.data, group_header.key), _.partialRight(_.pick, data_keys));
  tubiao_data.header = _.filter(tubiao_data.header, e=>{return data_keys.indexOf(e.key) >= 0});
  tubiao_data.charts = genChartConfig('-------', group_header.key, group_header, type);
  return tubiao_data;
}


/**
 * 颜色主题
 */

let colorTable = {
  1: ["#CC9966", "#999999", "#663366", "#330033", "#666666", "#669999"],
  2: ["#663333", "#339999", "#CCCC66", "#336666", "#3399CC", "#666666"],
  3: ["#99CC33", "#FF9900", "#FFCC00", "#CC6600", "#CCCC33", "#336699"],
  4: ["#990066", "#FFCC00", "#CC0033", "#009966", "#006699", "#CC3399"],
  5: ["#FF9966", "#996600", "#CCCC00", "#CC9933", "#009999", "#FFCC33"],
  6: ["#669933", "#CCCC33", "#663300", "#666633", "#999933", "#CC9966"],
};

export {
  colorTable,
  getX,
  genChartConfig,
  getChartsData
};
