import { getX } from "../../util.js";
import { colorTable } from "../../util.js";
let common = {
  backgroundColor: "#FFFFFF",
  textStyle: {
    fontFamily: "Microsoft YaHei",
    backgroundColor: "#ffffff",
  },
  grid: {
    top: 100,
    left: 100,
    bottom: 80,
  },
  legend: { top: 30, backgroundColor: "#ffffff" },
  animation: false,
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c}"
  },
};

function conversionSeries(datas, config) {
  if (Object.prototype.toString.call(config.y) === "[object Array]") {
    let series = [];
    config["y"].forEach((e) => {
      let obj = {
        name: e["name"],
        type: "bar",
        data: [],
        yAxisIndex: e["yAxisIndex"],
        itemStyle: { color: null },
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

function Column(datas, config) {
  let series = conversionSeries(datas, config);
  let data = getX(datas, config);
  let option = {
    ...common,
    title: {
      text: config["chart_name"],
      left: "center",
      backgroundColor: "#ffffff",
    },
    xAxis: {
      type: "value",
      backgroundColor: "#ffffff",
    },
    yAxis: {
      type: "category",
      data,
      axisLabel: {
        interval: "auto",
      },
      backgroundColor: "#ffffff",
    },
    series,
    color: colorTable["1"],
  };
  return option;
}

export default Column;
