function conversionSeries(datas, config) {
  let series = [];
  config["y"].forEach((e) => {
    let obj = {
      type: "map",
      name: config["aggregate_name"],
      map: "china",
      label: {
        normal: {
          show: true, //省份名称
        },
      },
      data: [],
    };
    for (const key in e) {
      if (key === "key") {
        datas.forEach((i, index) => {
          let name = datas[index][config["x"]["key"]];
          let sheng = new RegExp("省", "g");
          let zzq = new RegExp("自治区", "g");
          let shi = new RegExp("市", "g");
          if (name.includes("省")) {
            name = name.replace(sheng, "");
          } else if (name.includes("自治区")) {
            if (name === "新疆维吾尔族自治区") {
              name = "新疆";
            } else if (name === "宁夏回族自治区") {
              name = "宁夏";
            } else {
              name = name.replace(zzq, "");
            }
          } else if (name.includes("市")) {
            name = name.replace(shi, "");
          }
          obj.data.push({
            name,
            value: i[e[key]],
          });
        });
      }
    }
    series.push(obj);
  });
  return series;
}

function Map(data, config) {
  let series = conversionSeries(data, config);
  let option = {
    visualMap: {
      show: true,
      backgroundColor: "#FFFFFF",
      x: "left",
      y: "center",
      pieces: [
        { max: 0 },
        { min: 1, max: 10 },
        { min: 11, max: 80 },
        { min: 81, max: 120 },
        { min: 121, max: 160 },
        { min: 161, max: 200 },
        { min: 201, max: 4000 },
        { min: 4001 },
      ],
      color: [
        "#99CC33",
        "#FF9900",
        "#FFCC00",
        "#CC6600",
        "#CCCC33 ",
        "#336699",
      ],
    },
    backgroundColor: "#FFFFFF",
    title: {
      text: config["chart_name"],
      x: "center",
      backgroundColor: "#FFFFFF",
    },
    tooltip: {
      trigger: "item",
    },
    series,
  };
  return option;
}
export default Map;
