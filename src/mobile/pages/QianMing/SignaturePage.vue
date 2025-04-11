<template>
  <div>
    <div style="width: 20%;float: left;display: flex;justify-content: space-around;padding: 20px 0" :style="{height:(screenHeight - 50) + 'px'}">
      <div style="display: flex;flex-direction: column;justify-content: space-around">
        <van-button type="info" class="buttons" @click="undo">关闭</van-button>
        <van-button type="warning" class="buttons" @click="clearCanvas">清空</van-button>
        <van-button type="primary" class="buttons" @click="saveCanvas">保存</van-button>
      </div>
    </div>
    <div style="width: 70%;float: left">
      <canvas :width="screenWidth+ 'px'"
              :height="screenHeight + 'px'"
              ref="handWritingCanvas"
              @touchstart="startDrawing"
              @touchmove="draw"
              @touchend="endDrawing">
      </canvas>
    </div>

  </div>

</template>
<script>
import Vue from 'vue';
import { Button } from 'vant';
import resource from "@/mobile/resource";
import EventBus from "@/mobile/pages/QianMing/EventBus";
Vue.use(Button);
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
    document.body.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, { passive: false });
    this.canvas = this.$refs.handWritingCanvas;
    this.ctx = this.canvas.getContext("2d");
    this.screenHeight = (window.innerHeight - 50);
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
      if (this.points.length > 0) {
        const lastPoint = this.points[this.points.length - 1];
        this.ctx.beginPath();
        this.ctx.lineWidth = '5';  // 设置线条宽度
        this.ctx.strokeStyle = '#000000';  // 设置线条颜色
        this.ctx.moveTo(lastPoint.x, lastPoint.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
      }
      this.points.push({ x, y });
    },

    endDrawing() {
      this.drawing = false;
    },
    undo() {
      // 关闭操作
      this.$emit('close');
    },
    clearCanvas() {
      this.points = [];
      this.redrawCanvas();
    },
     saveCanvas() {
       try {
         if(this.points.length==0) return alert('您还未签名!')
         // 获取 canvas 元素
         const canvas = this.$refs.handWritingCanvas;

         // 创建新的 canvas 元素
         const rotatedCanvas = document.createElement("canvas");
         const rotatedContext = rotatedCanvas.getContext("2d");

         // 设置新 canvas 的尺寸，根据需要调整宽度和高度
         rotatedCanvas.width = canvas.height;
         rotatedCanvas.height = canvas.width;

         // 平移画布原点到旋转中心，并旋转
         rotatedContext.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
         rotatedContext.rotate(-90 * Math.PI / 180);

         // 绘制旋转后的图像
         rotatedContext.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
         var dataURL = rotatedCanvas.toDataURL("image/png");
         var base64String = dataURL.split(',')[1];
         console.log(base64String, 'base64String');
         // 将值返回出去
                 this.$emit('qianmingfile', base64String);
                  // 关闭操作
                 this.undo();
         // 将旋转后的图像转为 Blob
         // let that = this;
         // return new Promise((resolve) => {
         //   rotatedCanvas.toBlob(async (blob) => {
         //     // 将二进制对象的内容 转成file
         //     const file = new File([blob], Date.now() + '.png', { type: 'image/png' })
         //     // formData插入uploadFile相关数据
         //     const formData = new FormData()
         //     formData.append('file', file);
         //     // 发起请求 修改请求头为application/form-data
         //     resource.createObj('fileupload', formData,
         //       {headers: { 'Content-Type': 'application/form-data' }})
         //       .then(function (response) {
         //         // 上传成功 执行对应操作
         //         console.log(response);
         //         let file = response.file;
         //         // 将值返回出去
         //         EventBus.$emit('qianmingfile', file);
         //          // 关闭操作
         //         that.undo();
         //       })
         //       .catch(function (error) {
         //         // 上传失败 执行对应操作
         //         console.log(error);
         //       });
         //   }, 'image/png');
         // });
       } catch (error) {
         console.error('保存并上传出错：', error);
         throw error;
       } finally {
         // 清空签名
         this.clearCanvas();
       }
    },
    redrawCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.points.length > 0) {
        this.ctx.beginPath();
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
