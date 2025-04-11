<template>
<div>
    <div class="QRCode" ref="qrCodeUrl"></div>
    <el-button size="small" type="primary" @click="createQrCode">下载二维码</el-button>
</div>


</template>

<script>
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import QRCode from 'qrcodejs2';
import axios from "axios";
import {Base64} from "js-base64";

export default {
    components: {},
    data() {
        return {
            ids: [
                "123123",
                "789789789"
            ],
            QRCodeURL: [],            //存放生成的二维码图片地址
        };
    },
    methods: {
        // 生成二维码
        createQrCode() {
            if (!this.ids.length) return;
            document.querySelector('.QRCode').innerHTML = "";  // 清空div中的二维码图片
            this.ids.forEach((each) => {                                // 循环创建二维码
                new QRCode(this.$refs.qrCodeUrl, {                   // 将创建好的二维码图片放在div中
                    text: each,                                  // 需要转换为二维码的内容
                    width: 200,
                    height: 200,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                })
            })

            let a = new Promise((resolve) => {
                setTimeout(() => {
                    this.QRCodeURL = [];
                    // 查找div中的二维码图片
                    document.querySelectorAll('.QRCode img').forEach((each) => {
                        this.QRCodeURL.push(each.src); // 保存创建的二维码图片地址
                    })
                    return resolve();
                }, 200);

            })
            a.then(() => {
                this.batchQrCodeZip();// 下载打包二维码图片
            })

        },


        batchQrCodeZip() {
            const zip = new JSZip()        //新建一个压缩文件
            const _this = this
            const promises = []
            for (const key in this.QRCodeURL) {
                // 根据二维码图片地址下载文件, 并存成ArrayBuffer对象
                const promise = _this.getImgArrayBuffer(this.QRCodeURL[key]).then(data => {
                    // 逐个添加文件，需要加后缀".png"
                    zip.file(`${key}` + '.png', data, { binary: true }); // 逐个添加文件

                })
                promises.push(promise);
            }

            Promise.all(promises).then(() => {
                zip.generateAsync({type: 'blob'})
                    .then(content => {
                        // 生成二进制流
                        FileSaver.saveAs(content, '二维码') // 利用file-saver保存文件  自定义文件名
                    })
                })
                .catch(res => {
                    console.log(res);
                })
            },

        // 根据二维码图片地址下载二维码

        getImgArrayBuffer(url){
            let _this=this;
            return new Promise((resolve, reject) => {
                //通过请求获取文件blob格式
                let xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", url, true);
                xmlhttp.responseType = "blob";
                xmlhttp.onload = function () {
                    if (this.status == 200) {
                        resolve(this.response);
                    }else{
                        reject(this.status);
                    }
                }
                xmlhttp.send();
            });
        },
        created() {
            this.createQrCode();
        },


    }
}
</script>


<style lang='less' scoped>
</style>