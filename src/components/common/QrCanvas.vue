<template>
    <div class="qrcode">
        <img :src="qrcodeUrl" ref="qrcodeUrl" :width="width" :height="height" @click="imageClick">
    </div>
</template>

<script>
import {qrcanvas} from 'qrcanvas';

export default {
    props: {
        text: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: '250px'
        },
        height: {
            type: String,
            default: '250px'
        },
    },
    data() {
        return {
            qrcodeUrl: null,
        };
    },
    methods: {
        imageClick() {
            this.$emit('qrImage', this.qrcodeUrl)
        },
        createQRCode() {
            let option = {
                cellSize: 8,
                correctLevel: 'H',
                data: this.text,
                padding: 10,
                size: 250,
                // typeNumber: 3
            };
            if (this.title) {
                option = Object.assign({
                    logo: {
                        text: this.title,
                        options: {
                            fontStyle: 'bolder',
                            fontSize: 50,
                            color: '#004b86',
                            padColor: '#ffffff',
                        },
                    },
                }, option);
            }
            const canvas = qrcanvas(option);
            this.qrcodeUrl = canvas.toDataURL("image/png");
        }
    },
    watch: {
        text: {
            handler(val) {
                if (val) {
                    this.createQRCode();
                }
            },
            deep: true,
            immediate: true
        },
        title: {
            handler(val) {
                if (val) {
                    this.createQRCode();
                }
            },
            deep: true,
            immediate: true
        }
    }
};
</script>

<style lang="scss" scoped>
.qrcode {
    display: flex;
    justify-content: center;
}
</style>
