<template>
    <el-card style="width: 100%">
        <el-row :gutter="10">
            <el-col>
                <el-form inline label-width="80px">
                    <el-form-item>
                        <el-button
                            type="primary"
                            round
                            icon="el-icon-plus"
                            @click="createTemplate">
                            新建填报
                        </el-button>
                        <el-button
                            type="primary"
                            @click="ShiLiTo"
                            class="fix-tab"
                            round
                            plain
                            icon="el-icon-picture-outline">
                            查看示例
                        </el-button>
                        <el-button
                            type="warning"
                            @click="ShuoMingTo"
                            class="fix-shuoming"
                            round
                            plain
                            icon="el-icon-notebook-2">
                            使用说明
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-input
                            v-model="search.search"
                            prefix-icon="el-icon-search"
                            placeholder="关键字搜索"
                            clearable
                            @clear="loadData">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            round
                            @click="loadData">
                            搜索
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            size="small"
                            type="primary"
                            round
                            @click="createQrCode">
                            批量下载二维码
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    v-loading="loading"
                    element-loading-text="正在加载中..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    stripe
                    border
                    :data="data"
                    :cell-style="{ 'text-align': 'center' }"
                    :header-cell-style="{ 'text-align': 'center' }">
                    <el-table-column label="填报名称" prop="title"></el-table-column>
                    <el-table-column label="创建时间">
                        <template slot-scope="{ row }">
                            {{ transTime(row.create_time) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="450px" align="center">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                size="mini"
                                round
                                @click="creatQrCode(scope.row)">
                                二维码
                            </el-button>
                            <el-button
                                type="warning"
                                size="mini"
                                round
                                @click="edit(scope.row)">
                                基本配置
                            </el-button>
                            <el-button
                                type="warning"
                                size="mini"
                                round
                                @click="editform(scope.row)">
                                选项配置
                            </el-button>
                            <el-button
                                type="success"
                                size="mini"
                                round
                                @click="toJieguo(scope.row)">
                                结果
                            </el-button>
                            <el-popconfirm
                                title="确定删除吗？"
                                @confirm="del(scope.row.pk)"
                                style="margin-left: 10px">
                                <el-button
                                    type="danger"
                                    size="mini"
                                    round
                                    slot="reference"
                                    icon="el-icon-remove">
                                    删除
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[15, 30, 50, 100, 500, 1000]"
                    :page-size="pageSize"
                    @size-change="
                        (pageSize) => {
                          this.page = 1;
                          this.pageSize = pageSize;
                          this.loadData();
                        }"
                    :current-page.sync="page"
                    @current-change="loadData"
                    :total="total"
                    style="margin-top: 10px"
                ></el-pagination>
            </el-col>
        </el-row>

        <el-dialog
            :visible.sync="dialogVisiable"
            title="基本配置"
            center
            top="3vh"
            width="1000px"
            @closed="clearFrom">
            <table-form
                v-if="dialogVisiable"
                :updateForm="form"
                @close="(status) => (this.dialogVisiable = status)"
                @loadData="loadData"
            />
        </el-dialog>

        <el-dialog
            :visible.sync="dialogVisiableform"
            title="选项配置"
            center
            top="3vh"
            width="1000px"
            @closed="clearFrom">
            <table-item
                v-if="dialogVisiableform"
                :updateForm="form"
                @close="(status) => (this.dialogVisiableform = status)"
                @loadData="loadData"
                :pid="form.pk"
            />
        </el-dialog>

        <el-dialog
            :visible.sync="viewQR"
            @before-close="closeQR"
            style="text-align: center"
            width="20%">
           <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
<!--             <qr-code-->
<!--               style="margin: auto"-->
<!--               :url="url"-->
<!--               v-if="viewQR"-->
<!--               :title="title"-->
<!--               ref="qrCodeUrl">-->
<!--             </qr-code>-->
             <Qr v-if="viewQR" :url="url" style="margin: auto "></Qr>
             <div style="margin: 10px 0">
               {{url}}
             </div>
             <div style="margin-top: 30px;text-align: center">点击二维码保存图片</div>
           </div>
        </el-dialog>

        <el-dialog
            title="批量二维码"
            :visible.sync="pviewQR"
            @before-close=""
            width="60%">
            <Piliang></Piliang>
        </el-dialog>

        <div class="QRCode" ref="qrCodeUrl"></div>
    </el-card>
</template>

<script>
import {mapState} from "vuex";
import TableForm from "./TableForm";
import TableItem from "./TableItem";
import resource from "@/resource";
import moment from "moment";
import QrCode from "@/components/common/QrCode";
import { saveAs } from 'file-saver'
import Piliang from "@/components/common/Piliang";
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import QRCode from 'qrcodejs2';
import html2canvas from "html2canvas";
import Qr from "@/components/common/QR.vue";


export default {
    computed: {
        ...mapState(["org_id", "httpurl","userinfo","quanxian"]),
    },
    data() {
        return {
            page: 1,
            pageSize: 15,
            total: 0,
            search:{
              search:null
            },
            systemPk: "",
            systemName: "",
            systemSearch: "",
            sys_id: null,
            loading: false,
            dialogVisiable: false,
            // updateValue: null,
            data: [],
            systemData: [],
            viewQR: false,
            pviewQR: false,
            dialogVisiableform: false,
            editValue: false,
            url: null,
            purl: null,
            form: {
                pk: null,
                title: null,
                bz_info: null,
                start_time: null,
                end_time: null,
                need_login: false,
                show_result: "否",
                type: null,
                create_time: null,
                template_id: "FT181649085367160832",
                field: [],
            },
            companyAttachmentsList:[],
            title: '',
            ptitle: ['1','2','3'],
            ids: [],
            QRCodeURL: [],//存放生成的二维码图片地址
        };
    },
    methods: {
        async loadData() {
            this.loading = true;
            let params = {
                form_type: 1,
                page: this.page,
                pageSize: this.pageSize,
                // title: this.search.title,
                biz_id: this.$bizCode.tianbao_biz,
                src_id: this.$sourceCode.source_id,
                template_id: "FT181649085367160832",
            };
            if(this.search.search){
              params.search = this.search.search;
            }
            let res = await resource.getList("data", params);
            this.data = res.data;
            this.total = res.count;
            this.loading = false;
            for(let i = 0; i < res.count; i++){
                this.ids[i] = this.httpurl + "/tianbaoinfo?id=" + this.data[i]['pk'];
                this.ptitle[i] = this.data[i]['title'];
            }
        },

        createTemplate() {
          if(!this.quanxian.扫码填报 && this.data.length>=1){
            this.$message({
              message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
              type: 'warning',
              duration: 3000
            });
          }else{
            this.dialogVisiable = true;
            this.form.need_login.toString();
          }
        },
        clearFrom() {
            this.form = {
                pk: null,
                title: null,
                bz_info: null,
                start_time: null,
                end_time: null,
                need_login: false,
                show_result: "否",
                type: null,
                template_id: "FT181649085367160832",
            };
        },

        edit(obj) {
            if (typeof obj == "string") {
                obj = JSON.parse(obj);
            }
            this.form = {...obj};

            // this.updateValue = obj;
            this.dialogVisiable = true;
        },

        editform(obj) {
            if (typeof obj == "string") {
                obj = JSON.parse(obj);
            }
            this.form = {...obj, field: []};
            this.dialogVisiableform = true;
        },
        //删除
        async del(pk) {
            try {
                try {
                    await resource.deleteObj(
                        "data",
                        pk,
                        this.$store.state.sys_id,
                        "FT181649085367160832"
                    );
                    this.$message.success("删除成功!");
                    await this.loadData();
                } catch (e) {
                    this.$message.error("删除失败!");
                }
            } catch (e) {
                this.$message.info("取消删除");
            }
        },

        // 时间转换
        transTime(timeStr) {
            return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
        },

        closeQR() {
            this.qrcode.clear();
        },
        // 二维码生成
        creatQrCode(row) {
            this.viewQR = true;
            this.url = window.location.origin + "/mobile/tianbaoinfo?id=" + row.pk;
            this.title = '';
            this.title = row.title + "二维码";
        },

        // 统计
        toJieguo(row) {
            this.$router.push({name: "tianbao-jieguolist", params: {id: row.pk,need_login:row.need_login},});
        },
        ShiLiTo() {
            this.$router.push("/tianbaozhanshi");
        },
        ShuoMingTo() {
            this.$router.push({name: "tianbao-shuoming"});
        },

        // 批量生成二维码
        async createQrCode() {
            if (!this.ids.length) return;
            let canvas = [];
            for(let i = 0;i<this.ids.length;i++){
                document.querySelector('.QRCode').innerHTML = "";  // 清空div中的二维码图片
                let each = this.ids[i];
                let title = this.createTitle(i);
                // 循环创建二维码
                let qrcode = new QRCode(this.$refs.qrCodeUrl, {// 将创建好的二维码图片放在div中
                    text: each,// 需要转换为二维码的内容
                    width: 300,
                    height: 300,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
                if (this.ptitle) {
                    qrcode._el.append(title);
                }
                let canvas_i = await html2canvas(this.$refs.qrCodeUrl, { scale: 1 });
                canvas.push(canvas_i)
            }

            const zip = new JSZip()
            for(let i=0;i<canvas.length;i++){
                let c_i = canvas[i];
                let base64 = c_i.toDataURL('image/jpeg');
                var img_arr = base64.split(',');
                zip.file(this.ptitle[i]+'.jpg', img_arr[1], {base64: true});
            }
            let content = await zip.generateAsync({type: 'blob'})
            FileSaver.saveAs(content, '一般填报二维码') // 利用file-saver保存文件  自定义文件名
        },
        createTitle(key) {
            let oDivTitle = document.createElement("div");
            oDivTitle.innerHTML = this.ptitle[key];
            oDivTitle.style.marginTop = "20px";
            oDivTitle.style.textAlign = "left";
            oDivTitle.style.color = "#000";
            oDivTitle.style.fontSize = "1.2rem";
            return oDivTitle;
        },

    },

    async created() {
        await this.loadData();
    },
    components: {
      Qr,
        TableForm,
        TableItem,
        QrCode,
        Piliang,
    },
};
</script>

<style scoped>
.foot {
    width: 100%;
    display: flex;
}

.sys-tabs {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-height: 30px;
}

.sys-tabs:hover {
    color: #2d8cf0;
    cursor: pointer;
}

.sys-tabs-color {
    color: #2d8cf0;
}
.QRCode{
    width: 345px;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    top: -450px;
}
</style>
