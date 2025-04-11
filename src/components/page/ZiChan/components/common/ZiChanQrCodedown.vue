<template>
  <div>
    <div style="display: none">
      <div ref="print" id="printStyle">
        <div class="item" v-for="(item, index) in goodsData" :key="index">
         <!-- <h3>{{ item.name }}</h3>
          <div class="qrcode-pic" ref="codeItem"></div> -->
          
          <table class="person-info" border="1" cellspacing="0">
            <tbody>
              <tr>
                <th>资产名称</th>
                <td>{{ item.name }}</td>
                <th>资产规格</th>
                <td>{{item.size}}</td>
              </tr>
              <tr>
                <th>资产型号</th>
                <td>{{item.model_num}}</td>
                <th>资产性质</th>
                <td>{{item.nature}}</td>
              </tr>
              <tr>
                <th>资产分类</th>
                <td>{{item.category_display}}</td>
                <th>二维码</th>
                <td><div class="qrcode-pic" ref="codeItem" ></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['httpurl'])
  },
  props: {
    goodsData: {
      type: Array,
      default () {
        return []
      }
    },
    url: String
  },

  methods: {
    handleBatchPrintCode () {
      //必须要等到页面加载完成，不然会报错
      this.$nextTick(() => {
        this.goodsData.forEach((item, index) => {
          let code = this.httpurl + this.url + item.pk
          this.$refs.codeItem[index].innerHTML = ''
          new QRCode(this.$refs.codeItem[index], {
            text: code, //二维码内容
            width: 200,
            height: 200,
            colorDark: '#000', //二维码颜色
            colorLight: '#fff' //二维码背景色
          })
        })
        setTimeout(() => {
          this.$print(this.$refs.print)
        }, 200)
      })
    }
  }
}
</script>

<style scoped>
#printStyle .item {
  padding: 10px;
}
#printStyle h3 {
  font-size: 28px;
  line-height: 1.8;
}
.person-info {
    width: 100%;
    margin: 10px 10px;
    color: #8e9fc2;
    border-top: 1px solid #D1CECE;
    border-left: 1px solid #D1CECE;
    }
</style>
