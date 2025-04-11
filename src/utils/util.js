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

export { getX };

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

export { colorTable };
