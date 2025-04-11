function WordCloud(data) {
  let option = {
    series: [
      {
        type: "wordCloud",
        shape: "circle",
        left: "center",
        top: "center",
        width: "70%",
        height: "80%",
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          normal: {
            fontFamily: "sans-serif",
            fontWeight: "bold",
            // Color can be a callback function or a color string
            color: function() {
              // Random color
              return (
                "rgb(" +
                [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                ].join(",") +
                ")"
              );
            },
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        data,
      },
    ],
  };
  return option;
}

export default WordCloud;
