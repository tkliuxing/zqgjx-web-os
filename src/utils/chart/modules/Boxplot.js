import { colorTable } from "../../util.js";
function Boxplot(data, config) {
  let option = {
    animation: false,
    backgroundColor: "#ffffff",
    title: {
      text: config.aggregate_name,
      left: "center",
      backgroundColor: "#ffffff",
    },
    tooltip: {
      trigger: "item",
    },
    yAxis: {
      type: "category",
      data: ["男生", "女生"],
      backgroundColor: "#ffffff",
    },
    xAxis: {
      type: "value",
      splitArea: {
        show: true,
      },
      max: 100,
      backgroundColor: "#ffffff",
    },
    series: [
      {
        name: config.chart_name,
        type: "boxplot",
        data: data,
        tooltip: {
          formatter: function(param) {
            return [
              "性别: " + param.name,
              "max:" + param.data[5],
              "Q3: " + param.data[4],
              "Q2: " + param.data[3],
              "Q1: " + param.data[2],
              "min: " + param.data[1],
            ].join("<br/>");
          },
        },
      },
    ],
    itemStyle: { backgroundColor: "#ffffff" },
    color: colorTable[0],
  };
  return option;
}

export default Boxplot;
