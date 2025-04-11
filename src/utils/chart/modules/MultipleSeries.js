import { getX } from "../../util.js";
import { colorTable } from "./../../util.js";
/**
 * 公共的图表配置
 */
let common = {
  animation: false,
  backgroundColor: "#FFFFFF",
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c}"
  },
  grid: {
    top: 100,
    left: 100,
    bottom: 80,
  },
};

/**
 *  转化为可用的series数组
 *
 * @param {数据集} datas
 * @param {图表配置} config
 * @param {类型，默认折线} defaultType
 */
function conversionSeries(datas, config, defaultType) {
  if (Object.prototype.toString.call(config.y) === "[object Array]") {
    let series = [];
    config["y"].forEach((e) => {
      let obj = {
        name: e["name"],
        type: config.y.length === 1 ? defaultType : e["type"],
        data: [],
        center: ["60%", "60%"],
        radius: defaultType === "pie" && "50%",
        yAxisIndex: e["index"],
        label: {
          show: false,
        },
      };
      for (const key in e) {
        if (key === "key") {
          datas.forEach((i, index) => {
            obj.data.push({
              name: datas[index][config["x"]["key"]],
              value: i[e[key]],
            });
          });
        }
      }
      series.push(obj);
    });
    return series;
  }
}

/**
 * 控制x、y轴显示与否，有些图表不需要显示x、y轴
 *
 * @param {数据集} data
 * @param {图表配置} config
 */

function coordinate(datas, config) {
  let data = getX(datas, config);
  let Axis = {
    xAxis: {
      type: "category",
      data,
      axisLabel: {
        interval: "0",
        rotate: 30,
      },
      backgroundColor: "#ffffff",
    },
    yAxis: config["yAxis"],
  };
  return Axis;
}

/**
 *
 * @param {数据集} data
 * @param {图表的配置} config
 * @param {图表类型 默认折线} type
 */

function MultipleSeries(data, config, type = "line") {
  let series = conversionSeries(data, config, type);
  let coordinates = coordinate(data, config);
  let option = {
    title: {
      text: config["chart_name"],
      left: "center",
      backgroundColor: "#FFFFFF",
    },
    ...common,
    legend: {
      top: 50,
      orient: type === "pie" ? "vertical" : "horizontal",
      left: type === "pie" ? 0 : "center",
      backgroundColor: "#FFFFFF",
    },
    xAxis: type === "pie" ? null : coordinates.xAxis,
    yAxis: type === "pie" ? null : coordinates.yAxis,
    series,
    color: colorTable["1"],
  };
  return option;
}

export default MultipleSeries;
