<template>
  <div>
      <div style="width: 20%;float: left;display: flex;justify-content: space-around;padding: 20px 0" :style="{height:(screenHeight - 100) + 'px'}">
       <div style="display: flex;flex-direction: column;justify-content: space-between">
         <el-button type="warning" class="buttons" @click="clearCanvas">清空</el-button>
         <el-button type="info" class="buttons" @click="undo">撤销</el-button>
         <el-button type="success" class="buttons" @click="saveCanvas">保存</el-button>
       </div>
      </div>
     <div style="width: 70%;float: left">
       <canvas :width="screenWidth+ 'px'" :height="screenHeight + 'px'" ref="handWritingCanvas" @touchstart="startDrawing" @touchmove="draw" @touchend="endDrawing"></canvas>
     </div>

    </div>

</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      drawing: false,
      points: [],
      screenHeight: 0,
      screenWidth: 0,
    };
  },
  mounted() {
    this.canvas = this.$refs.handWritingCanvas;
    this.ctx = this.canvas.getContext("2d");
    this.screenHeight = (window.innerHeight - 100);
    this.screenWidth = (window.innerWidth - 100);
  },
  methods: {
    startDrawing(e) {
      this.drawing = true;
      const x = e.touches[0].clientX - this.canvas.offsetLeft;
      const y = e.touches[0].clientY - this.canvas.offsetTop;
      this.points.push({ x, y });
    },
    draw(e) {
      if (!this.drawing) return;
      const x = e.touches[0].clientX - this.canvas.offsetLeft;
      const y = e.touches[0].clientY - this.canvas.offsetTop;
      this.points.push({ x, y });

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        this.ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      this.ctx.stroke();
    },
    endDrawing() {
      this.drawing = false;
    },
    undo() {
      this.points.pop();
      this.redrawCanvas();
    },
    clearCanvas() {
      this.points = [];
      this.redrawCanvas();
    },
    saveCanvas() {
      // const dataURL = this.canvas.toDataURL("image/png");
      // const link = document.createElement("a");
      // link.href = dataURL;
      // link.download = "signature.png";
      // link.click();
      alert('签名成功!');
      //清空签名
      this.clearCanvas();
    },
    redrawCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      if (this.points.length > 0) {
        this.ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          this.ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        this.ctx.stroke();
      }
    },
  },
};
</script>

<style>
canvas {
  border: 1px dashed #000;
}
button {
  margin: 10px;
}
.buttons{
  width: 60px;
  height: 30px;
  transform: rotate(90deg);
  padding: 0 5px;
  writing-mode: unset;
  text-orientation: mixed;
  transform-origin: center center;
}
</style>
