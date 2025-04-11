<template>
  <div class="ShiTi">
    <el-card class="box-card">
      <el-button type="primary" round icon="el-icon-plus" @click="xinjian">新建试卷</el-button>
      <el-button type="primary" @click="ShiLiTo" class="fix-tab" round icon="el-icon-picture-outline" plain>查看示例</el-button>
      <el-button type="warning" @click="ShuoMingTo" class="fix-shuoming" round icon="el-icon-notebook-2" plain>使用说明</el-button>
      <el-table v-loading="loading" element-loading-text="正在加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" border :data="data"
        style="margin-top: 1rem">
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="is_enabled" label="是否可用" width="70" align="center"></el-table-column>
        <el-table-column prop="start_time" label="开始日期" width="100" align="center"></el-table-column>
        <el-table-column prop="end_time" label="截止日期" width="100" align="center"></el-table-column>
        <el-table-column label="总题数" prop="tongji.total_count" width="70" align="center">
          <template slot-scope="{row}">
            {{ row.count }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="380">
          <template slot-scope="{row}">
            <el-button type="primary" round icon="el-icon-full-screen" @click="creatQrCode(row.pk)">二维码</el-button>
            <el-button type="primary" round icon="el-icon-edit" :loading="editState" @click="editRow(row.pk)">编辑</el-button>
            <el-button type="success" round icon="el-icon-tickets" @click="toJieguo(row)">统计结果</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteRow(row)">
              <el-button class="deleteButton" type="danger" round slot="reference" icon="el-icon-remove">
                删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[15, 30, 50, 100, 500, 1000]" :page-size="pageSize" @size-change="
          (pageSize) => {
            this.page = 1;
            this.pageSize = pageSize;
            this.loadData();
          }
        " :current-page.sync="page" @current-change="loadData" :total="total" style="margin-top: 10px">
      </el-pagination>
    </el-card>
    <el-dialog title="试卷" :visible.sync="createDialogVisiable" @closed="clearFormData('form')" fullscreen modal-append-to-body>
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item prop="name" label="试卷名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="desc" label="试卷描述">
          <el-input type="textarea" :rows="2" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="选择题库" required prop="tiku_id">
          <el-select v-model="form.tiku_id" placeholder="请选择题库" @change="tikuChange">
            <el-option v-for="item in tiku_list" :key="item.pk" :label="item.name" :value="item.pk" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否随机出题"  prop="suiji_shiti">
          <el-switch v-model="form.suiji_shiti" active-text="是" inactive-text="否" active-value="是" inactive-value="否">
          </el-switch>
          <span class="score-label" v-if="form.suiji_shiti == '是'">每次打开试卷后题目不同</span>
          <span class="score-label" v-else>卷面显示固定题目</span>
        </el-form-item>
        <el-form-item  v-if="form.suiji_shiti == '否'">
          <el-button type="primary" @click="dialogVisible = true">选择题目</el-button>
        </el-form-item>
          <template v-if="form.suiji_shiti === '否'">
            <el-form-item label="单选题数量">
              <span>{{ form.danxuan_count }}</span>
              <span class="score-label">每题分数</span>
              <el-input-number v-model="form.danxuan_score" :min="0" label="label"></el-input-number>
            </el-form-item>
            <el-form-item label="多选题数量">
              <span>{{ form.duoxuan_count }}</span>
              <span class="score-label">每题分数</span>
              <el-input-number v-model="form.duoxuan_score" :min="0" label="多选每题分数"></el-input-number>
            </el-form-item>
            <el-form-item label="判断题数量">
              <span>{{ form.panduan_count }}</span>
              <span class="score-label">每题分数</span>
              <el-input-number v-model="form.panduan_score" :min="0" label="判断每题分数"></el-input-number>
            </el-form-item>
            <el-form-item label="问答题数量">
              <span>{{ form.wenda_count }}</span>
              <span class="score-label">每题分数</span>
              <el-input-number v-model="form.wenda_score" :min="0" label="问答每题分数"></el-input-number>
            </el-form-item>
          </template>
        <template v-if="form.tiku_id && form.suiji_shiti == '是'">
          <el-row> <el-col v-loading="tikuLoading">
<!--          <el-form-item prop="is_all_tiku" label="题目范围">-->
<!--            <el-switch v-model="form.is_all_tiku" active-text="全部题库" inactive-text="自定义数量" active-value="是" inactive-value="否">-->
<!--            </el-switch>-->
<!--            <span class="score-label">从题库中选择试卷题目的数量</span>-->
<!--          </el-form-item>-->
<!--          <template v-if="form.is_all_tiku == '是'">-->
<!--            <el-form-item label="单选题数量">-->
<!--               <span>{{ danxuan_max }}</span>-->
<!--              <span class="score-label">每题分数</span>-->
<!--              <el-input-number v-model="form.danxuan_score" :min="0" label="label"></el-input-number>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="多选题数量">-->
<!--               <span>{{ duoxuan_max }}</span>-->
<!--              <span class="score-label">每题分数</span>-->
<!--              <el-input-number v-model="form.duoxuan_score" :min="0" label="多选每题分数"></el-input-number>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="判断题数量">-->
<!--               <span>{{ panduan_max }}</span>-->
<!--              <span class="score-label">每题分数</span>-->
<!--              <el-input-number v-model="form.panduan_score" :min="0" label="判断每题分数"></el-input-number>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="问答题数量">-->
<!--               <span>{{ wenda_max }}</span>-->
<!--              <span class="score-label">每题分数</span>-->
<!--              <el-input-number v-model="form.wenda_score" :min="0" label="问答每题分数"></el-input-number>-->
<!--            </el-form-item>-->
<!--          </template>-->
          <template v-if="form.suiji_shiti == '是'">
            <el-form-item label="单选题数量">
              <el-input-number v-model="form.danxuan_count" :max="danxuan_max" :min="0" label="单选题数量" @change="updateTotalScore"></el-input-number>
              <span class="score-label">单选每题分数</span>
              <el-input-number v-model="form.danxuan_score" :min="0" :disabled="!danxuan_max" label="label" @change="updateTotalScore"></el-input-number>
            </el-form-item>
            <el-form-item label="多选题数量">
              <el-input-number v-model="form.duoxuan_count" :max="duoxuan_max" :min="0" label="单选每题分数" @change="updateTotalScore"></el-input-number>
              <span class="score-label">多选每题分数</span>
              <el-input-number v-model="form.duoxuan_score" :min="0" :disabled="!duoxuan_max" label="多选每题分数" @change="updateTotalScore"></el-input-number>
            </el-form-item>
            <el-form-item label="判断题数量">
              <el-input-number v-model="form.panduan_count" :max="panduan_max" :min="0" label="判断题数量" @change="updateTotalScore"></el-input-number>
              <span class="score-label">判断每题分数</span>
              <el-input-number v-model="form.panduan_score" :min="0" :disabled="!panduan_max"  label="判断每题分数" @change="updateTotalScore"></el-input-number>
            </el-form-item>
            <el-form-item label="问答题数量">
              <el-input-number v-model="form.wenda_count" :max="wenda_max" :min="0" label="问答题数量" @change="updateTotalScore"></el-input-number>
              <span class="score-label">问答每题分数</span>
              <el-input-number v-model="form.wenda_score" :min="0" :disabled="!wenda_max" label="问答每题分数" @change="updateTotalScore"></el-input-number>
            </el-form-item>
          </template>
          </el-col></el-row>
          <el-form-item label="试卷满分">{{ form.manfen }}</el-form-item>
        </template>
        <el-form-item prop="deadline" label="答题时间">
          <el-slider style="margin: 0 0 10px 10px" v-model="deadline" @change="deadlineChange" :min="0" :max="120" :step="10" :marks="marks" :format-tooltip="(val) => (val === 0 ? '不限' : `${val} 分钟`)"
            show-stops>
          </el-slider>
        </el-form-item>
        <el-form-item prop="ever_deadline" label="单题时长">
          <el-slider style="margin: 0 0 10px 10px" v-model="form.ever_deadline" :min="0" :max="400" :step="30" :marks="seconds_marks" :format-tooltip="(val) => (val === 0 ? '不限' : `${val} 秒`)"
            show-stops>
          </el-slider>
        </el-form-item>
        <el-form-item prop="start_time" label="开始日期" :rules="{ required: true, message: '必选项!' }">
          <el-date-picker v-model="form.start_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="start_time" label="结束日期" :rules="{ required: true, message: '必选项!' }">
          <el-date-picker v-model="form.end_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="start_time" label="是否启用">
          <el-switch v-model="form.is_enabled" active-value="是" inactive-value="否">
          </el-switch>
        </el-form-item>
        <el-form-item prop="start_time" label="是否登录">
          <el-switch v-model="form.need_login" active-value="是" inactive-value="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="重复答题">
          <el-switch v-model="form.kechongfu" active-value="是" inactive-value="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="主题色" prop="color">
          <el-color-picker v-model="form.color" :predefine="predefineColors"></el-color-picker>
        </el-form-item>
        <el-form-item label="背景图片">
          <el-image v-if="form.background" style="width: 100px; height: 100px; margin-top: 5px" :src="form.background" :preview-src-list="[form.background]"></el-image>
          <my-upload @change="changeBackground" />
          <el-button type="danger" v-if="form.background" round size="medium" @click="form.background = null">删除图片</el-button>
        </el-form-item>
        <el-form-item>
          <el-button round size="medium" @click="createDialogVisiable = false">取 消</el-button>
          <el-button round size="medium" type="primary" @click="submitForm('form')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog  :visible.sync="viewQR" @before-close="closeQR" width="20%">
      <div style="display: flex;flex-direction: column;align-items: center">
<!--        <qr-code v-if="viewQR" :url="url" ref="qrCodeUrl"></qr-code>-->
        <Qr v-if="viewQR" :url="url" style="margin: auto "></Qr>
        <div class="tips" style="text-align: center">点击二维码保存图片</div>
      </div>
    </el-dialog>
    <el-dialog
      title="题目"
      :visible.sync="dialogVisible"
      fullscreen
      modal-append-to-body
      :close-on-click-modal = 'false'
      @close = "closeDialog"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-table :data="shiti_data" height="600px">
            <el-table-column prop="timu" label="题目"></el-table-column>
            <el-table-column prop="leixing" label="类型" width="100"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="{row}">
                <!--            存在的话禁用按钮    -->
                <el-button type="success" :disabled="multipleSelection.some(item=>item.pk == row.pk)"   size="mini" @click="ChoseItem(row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100, 500, 1000]" :page-size="pageSize" @size-change="
          (pageSize) => {
            this.pages = 1;
            this.pageSize = pageSize;
            this.getTikuShiti(this.pages);
          }
        " :current-page.sync="pages" @current-change="getTikuShiti" :total="totals" style="margin-top: 10px">
          </el-pagination>
        </el-col>
        <el-col :span="12">
          <h3>已选题目</h3>
          <fieldset style="padding: 20px;border-radius: 15px;margin: 20px 0">
            <legend style="padding:0 10px;font-size: 16px;font-weight: bolder;color:#ff7070;">机选</legend>
            <el-form inline>
              <el-form-item label="单选">
                <el-input-number size="small" :controls="false" v-model="Typedan"  :min="0" :max="danxuan_max" label="单选" style="width: 100px;"></el-input-number>
              </el-form-item>
              <el-form-item label="多选">
                <el-input-number size="small" :controls="false" v-model="Typeduo"  :min="0" :max="duoxuan_max" label="多选" style="width: 100px;"></el-input-number>
              </el-form-item>
              <el-form-item label="判断">
                <el-input-number size="small" :controls="false" v-model="Typepan"  :min="0" :max="panduan_max" label="判断" style="width: 100px;"></el-input-number>
              </el-form-item>
              <el-form-item label="问答">
                <el-input-number size="small" :controls="false" v-model="Typewen"  :min="0" :max="wenda_max" label="问答" style="width: 100px;"></el-input-number>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="SelectData">抽取</el-button>
              </el-form-item>
            </el-form>
          </fieldset>
          <div style="margin-bottom: 15px">
            <!--            单选多少道题-->
            <p style="margin: 0 10px">已选题目数量统计:</p>
            <span style="margin: 0 10px">单选:{{multipleSelection.filter(item => item.leixing === '单选').length || 0 }}道</span>
            <span style="margin: 0 10px">多选:{{multipleSelection.filter(item => item.leixing === '多选').length || 0 }}道</span>
            <span style="margin: 0 10px">问答:{{multipleSelection.filter(item => item.leixing === '问答').length || 0 }}道</span>
            <span style="margin: 0 10px">判断:{{multipleSelection.filter(item => item.leixing === '判断').length || 0 }}道</span>
            <span style="margin-left: 100px">共{{multipleSelection.length}}道题</span>
          </div>
          <el-table :data="multipleSelection" height="367px">
            <el-table-column label="操作" width="100">
              <template slot-scope="{row}">
                <el-button type="danger" size="mini" @click="removeItem(row)">移除</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="timu" label="题目"></el-table-column>
            <el-table-column prop="leixing" label="类型" width="100"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" style="float: right;margin-right: 50px" @click="queding">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { mapState } from "vuex";
import resource from "@/resource";
import SingleFileUpload from "@/components/common/SingleFileUpload";
import { PREDEFINE_COLORS } from "@/constvars";
import QrCode from "@/components/common/QrCode";
import Qr from '@/components/common/QR.vue';
const TMP_ID = "FT138149866856067072"; //试卷
const TMP_ID_TK = "FT138152757582053376"; // 题库
const TMP_ID_ST = "FT138153450912034816"; //试题
const FORM = {
  name: "",
  desc: "",
  deadline: 0,
  start_time: "",
  end_time: "",
  need_login: "是",
  is_enabled: "是",
  show_result: "是",
  show_paiming: "否",
  paiming_count: 10,
  suiji_shiti: "否",
  manfen: 0,
  tiku_id: "",
  kechongfu: "否",
  danxuan_count: 0,
  danxuan_score: 0,
  duoxuan_count: 0,
  duoxuan_score: 0,
  panduan_count: 0,
  panduan_score: 0,
  ever_deadline: 0,
  wenda_count: 0,
  wenda_score: 0,
  color: "#e41e1e",
  background: "",
  is_all_tiku: "否",

  template_id: TMP_ID,
  shiti_ids: '',
  count: 0,
};
export default {
  name: "ShiTi",
  components: { "my-upload": SingleFileUpload, QrCode,Qr },
  computed: {
    ...mapState(["org_id", "httpurl",'userinfo',"quanxian"]),
    danxuan_max(){
      if(!this.shiti_list || this.shiti_list.length === 0) return 0;
      return this.shiti_list.filter(item => item.leixing === '单选').length;
    },
    duoxuan_max(){
      if(!this.shiti_list || this.shiti_list.length === 0) return 0;
      return this.shiti_list.filter(item => item.leixing === '多选').length;
    },
    panduan_max(){
      if(!this.shiti_list || this.shiti_list.length === 0) return 0;
      return this.shiti_list.filter(item => item.leixing === '判断').length;
    },
    wenda_max(){
      if(!this.shiti_list || this.shiti_list.length === 0) return 0;
      return this.shiti_list.filter(item => item.leixing === '问答').length;
    },
  //   是否随机出题
    Isdanxuan_max(){
      if(!this.multipleSelection || this.multipleSelection.length === 0) return 0;
      return this.form.danxuan_count = this.multipleSelection.filter(item => item.leixing === '单选').length;
    },
    Isduoxuan_max(){
      if(!this.multipleSelection || this.multipleSelection.length === 0) return 0;
      return this.form.duoxuan_count =  this.multipleSelection.filter(item => item.leixing === '多选').length;
    },
    Ispanduan_max(){
      if(!this.multipleSelection || this.multipleSelection.length === 0) return 0;
      return this.form.panduan_count =  this.multipleSelection.filter(item => item.leixing === '判断').length;
    },
    Iswenda_max(){
      if(!this.multipleSelection || this.multipleSelection.length === 0) return 0;
      return this.form.wenda_count =  this.multipleSelection.filter(item => item.leixing === '问答').length;
    },
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      pages:1,
      total: 0,
      data: [],
      tiku_list: [],
      shiti_list: [],
      viewQR: false,
      dialogVisible:false,
      multipleSelection:[],
      predefineColors: PREDEFINE_COLORS,
      rules: {
        name: [{ required: true, message: "请填写试卷名" }],
        tiku_id: [{ required: true, message: "请选择题库" }],
      },
      marks: {
        0: "不限",
        30: "30分钟",
        60: "60分钟",
        90: "90分钟",
      },
      seconds_marks: {
        0: "不限",
        60: "60秒",
        120: "2分钟",
        300: "5分钟",
      },
      deadline: 0,
      form: {
        ...FORM,
      },
      qrcode: null,
      url: null,
      loading: false,
      createDialogVisiable: false,
      editState: false,
      count: null, //总题数
      tikuLoading:false, // 题库加载
      totals:null, // 试题总数用来做分页
      shiti_data: [], // 试题列表
      type_data:[],// 试题类型
      Typevalue:null, // 选中的试题类型
      Typedan:null,  // 单选题数量
      Typeduo:null,  // 多选题数量
      Typepan:null,  // 判断题数量
      Typewen:null,  // 问答题数量
    };
  },
  methods: {
    updateTotalScore() {
      const danxuanTotal = this.form.danxuan_count * this.form.danxuan_score;
      const duoxuanTotal = this.form.duoxuan_count * this.form.duoxuan_score;
      const panduanTotal = this.form.panduan_count * this.form.panduan_score;
      const wendaTotal = this.form.wenda_count * this.form.wenda_score;
      this.form.manfen = danxuanTotal + duoxuanTotal + panduanTotal + wendaTotal;
    },
    xinjian(){
      if(!this.quanxian.扫码答题考试 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.createDialogVisiable = true;
      }
    },
    SelectData(){
      this.$confirm('随机抽选题目将会清空已选的题目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 根据试题this.Typedan(数量) 随机从this.shiti_list 随机抽取该数量的题目
        let danxuan = this.shiti_list.filter(item => item.leixing === '单选').sort(() => Math.random() - 0.5).slice(0,this.Typedan);
        let duoxuan = this.shiti_list.filter(item => item.leixing === '多选').sort(() => Math.random() - 0.5).slice(0,this.Typeduo);
        let panduan = this.shiti_list.filter(item => item.leixing === '判断').sort(() => Math.random() - 0.5).slice(0,this.Typepan);
        let wenda = this.shiti_list.filter(item => item.leixing === '问答').sort(() => Math.random() - 0.5).slice(0,this.Typewen);
        // 数组拼接 生成随机试题
        let suijiTimu = danxuan.concat(duoxuan,panduan,wenda);
        this.multipleSelection = suijiTimu;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 关闭选择题库,情况选中的题
    closeDialog(){
      // this.multipleSelection = [];
      this.dialogVisible = false;
    },
    queding(){
      this.form.duoxuan_count = this.multipleSelection.filter(item => item.leixing === '多选').length;
      this.form.danxuan_count = this.multipleSelection.filter(item => item.leixing === '单选').length;
      this.form.panduan_count = this.multipleSelection.filter(item => item.leixing === '判断').length;
      this.form.wenda_count = this.multipleSelection.filter(item => item.leixing === '问答').length;
      this.form.count = this.form.duoxuan_count + this.form.danxuan_count + this.form.panduan_count + this.form.wenda_count;
      this.dialogVisible = false;
    },
    ChoseItem(val){
      // 重复的题目不在push
      if(this.multipleSelection.indexOf(val) === -1){
        this.multipleSelection.push(val);
      }
    },
    // 选中的题目
    removeItem(val) {
      // 从数组中截取一个元素,并删除
      this.multipleSelection.splice(this.multipleSelection.indexOf(val), 1);
    },

    // 加载试卷
    async loadData() {
      this.loading = true;
      try {
        let params = {
          page: this.page,
          pageSize: this.pageSize,
          biz_id: this.$bizCode.kaoshi_biz,
          src_id: this.$sourceCode.source_id,
          template_id: TMP_ID,
        };
        let resp = await resource.getList("data", params);
        for (let i = 0; i < resp.data.length; i++) {
          const element = resp.data[i];
            element.count =
              Number(element.danxuan_count) +
              Number(element.duoxuan_count) +
              Number(element.wenda_count) +
              Number(element.panduan_count);
        }
        this.data = resp.data;
        this.total = resp.count;
      }catch (e) {
        console.log(e)
      }
      this.loading = false;
    },
    // 加载题库
    async loadTiku() {
      this.loading = true;
      let params = {
        biz_id: this.$bizCode.tiku_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID_TK,
      };
      let res = await resource.getList("data", params);
      this.tiku_list = res;


      this.loading = false;
    },
    // 删除试卷
    async deleteRow(row) {
      try {
        try {
          await resource.deleteList(
            {
              pk: row.pk,
            },
            row.template_id
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
    // 提交保存
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.fillShiTiIds();
          if(this.form.suiji_shiti == '否' && this.multipleSelection.length > 0){
            this.form.danxuan_count = this.multipleSelection.filter(item => item.leixing === '单选').length;
            this.form.duoxuan_count = this.multipleSelection.filter(item => item.leixing === '多选').length;
            this.form.wenda_count = this.multipleSelection.filter(item => item.leixing === '问答').length;
            this.form.panduan_count = this.multipleSelection.filter(item => item.leixing === '判断').length;
            this.form.count = this.form.duoxuan_count + this.form.danxuan_count + this.form.panduan_count + this.form.wenda_count;
          }
          let data = {
            ...this.form,
            biz_id: this.$bizCode.kaoshi_biz,
            src_id: this.$sourceCode.source_id,
          };
          if (data.pk) {
            await resource.updateObj("data", data.pk, data);
            this.$message.success("编辑成功!");
          } else {
            await resource.createObj("data", data);
            this.$message.success("新建成功!");
          }
          this.createDialogVisiable = false;
          this.loadData();
        } else {
          this.$message.error("请检查所填项!");
          return false;
        }
      });
    },
    // 清除表格数据
    clearFormData(formName) {
      this.deadline = 0;
      this.form = { ...FORM };
      this.$refs[formName].resetFields();
    },
    // 编辑
    async editRow(pk) {
      this.editState = true;
      let params = {
        biz_id: this.$bizCode.kaoshi_biz,
        src_id: this.$sourceCode.source_id,
        template_id: TMP_ID,
      };
      this.form = await resource.getObj("data", pk, params);
      this.deadline = this.form.deadline / 60;
      await this.getTikuShiti(this.pages);
      this.createDialogVisiable = true;
      this.editState = false;
      console.log(this.tiku_list,this.form.tiku_id)
      //若题库被删则数据清空
      let tiku=this.form.tiku_id
      const is_del =this.tiku_list.some(function (item){
        return item.pk==tiku
      })
      this.form.tiku_id = is_del ? this.form.tiku_id : ''
      this.form.danxuan_count = is_del ? this.form.danxuan_count : 0
      this.form.duoxuan_count = is_del ? this.form.duoxuan_count : 0
      this.form.panduan_count = is_del ? this.form.panduan_count : 0
      this.form.wenda_count = is_del ? this.form.wenda_count : 0
      this.form.count = this.form.duoxuan_count + this.form.danxuan_count + this.form.panduan_count + this.form.wenda_count;
      let data = {
        ...this.form,
        biz_id: this.$bizCode.kaoshi_biz,
        src_id: this.$sourceCode.source_id,
      };
      if (!is_del) {await resource.updateObj("data", data.pk, data);}
      console.log(is_del)
      this.loading = false;
    },
    // 答题总时长
    deadlineChange(val) {
      this.form.deadline = val * 60;
    },
    // 结果
    toJieguo(data) {
      this.$router.push({ name: "jieguolist", params: { id: data.pk } });
    },
    // 二维码显示
    creatQrCode(pk) {
      this.viewQR = true;
      this.url = window.location.origin + "/mobile/shijuaninfo?pk=" + pk;
    },
    // 关闭二维码
    closeQR() {
      this.qrcode.clear();
    },
    // 背景图片
    changeBackground(val) {
      this.form.background = val.response.file;
    },
    // 查看示例
    ShiLiTo() {
      this.$router.push("/kaoshizhanshi");
    },
    // 查看说明
    ShuoMingTo() {
      this.$router.push({ name: "kaoshi-shuoming" });
    },
    // 选择题库操作
    async tikuChange(val) {
      this.form.danxuan_count = 0;
      this.form.duoxuan_count = 0;
      this.form.panduan_count = 0;
      this.form.wenda_count = 0;
      this.form.count = 0;
      if (val) {
        this.this_tiku = this.tiku_list.filter((item) => item.pk === val)[0];
        await this.getTikuShiti(this.pages);
      } else {
        this.clearThisTiku();
      }
    },
    async getTikuShiti(page){
      this.tikuLoading = true;
      let tkId = this.form.tiku_id;
      if(!tkId){
        this.shiti_list = [];
        this.tikuLoading = false;
        return;
      }
      let params = {
        tiku_id: tkId,
        template_id: TMP_ID_ST,
      };
      this.shiti_list = await resource.getList("data", params);
      // 回显选中的题
      if(this.form.shiti_ids){
        let shiti_ids = this.form.shiti_ids;
        let arr= [];
        this.shiti_list.forEach(item => {
          if(shiti_ids.indexOf(item.pk) > -1){
            arr.push(item);
          }
        })
        this.multipleSelection = arr;
      }
      // 加个page是用来判断是否是点击分页触发的，如果是，就不需要再次请求题库数据
      if(page){
        params.page = page;
        params.pageSize = 15;
        let shiti_data = await resource.getList("data", params);
        this.shiti_data = shiti_data.data
        this.totals = shiti_data.count;
      }
      this.tikuLoading = false;
    },
    fillShiTiIds(){
      if(this.form.suiji_shiti == '否'){
        this.form.shiti_ids = JSON.stringify(this.multipleSelection.map(item => item.pk));
        this.form.count = this.multipleSelection.length;
      }else {
        this.form.shiti_ids = '';
      }
    },
    clearThisTiku() {
      this.form.shiti_ids = '';
      this.this_tiku = {
        tongji: {
          danxuan_count: 0,
          duoxuan_count: 0,
          panduan_count: 0,
        },
      };
    },
   async getLocalDataSourceSource() {
     this.type_data = await resource.getList("basetree", {
        parent: 'bt336755779406397440',
      });
    }
  },
  async mounted() {
    await this.loadData();
    this.loadTiku();
    this.getLocalDataSourceSource();
  },
};
</script>

<style scoped>
.score-label {
  margin-left: 10px;
  margin-right: 10px;
  color: #999;
}
.red {
  color: red;
}
.qrcode {
  margin: 10px auto;
}
.tiku-info {
  padding-left: 100px;
}
.tips {
  margin-top: 10px;
}
.deleteButton {
  margin-left: 5px;
}
.dialog-container {
  display: flex;
}

.left-table {
  width: 50%;
  padding-right: 10px;
}

.right-table {
  width: 50%;
  padding-left: 10px;
}

.el-table {
  width: 100%;
  margin-bottom: 20px;
}

.el-table__body-wrapper {
  overflow: auto;
}

.el-table__body {
  overflow: hidden;
}

.el-table__row:hover {
  background-color: #f5f7fa;
}

.el-table__column--selection {
  width: 50px;
}

.el-checkbox__inner {
  border-radius: 2px;
}

</style>
