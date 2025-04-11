<template>
  <el-form :model='form' ref="form" label-width="150px" :rules="rules" status-icon>
    <el-row>
      <el-col :span="24">
        <el-form-item label="照片" prop="photo">
          <div v-if="form.photo" style="cursor: pointer">
            <img :src="JSON.parse(form.photo).file" @click="openImagePreview" alt="" width="200" height="180">
            <i class="el-icon-close" v-if="!readonly" @click="removeImg(form.photo)"></i>
          </div>
          <div v-if="!readonly">
            <el-upload
              v-if="!form.photo"
              :action="BASE_HOST+'/api/v1/fileupload/'"
              list-type="picture-card"
              :limit="1"
              :headers="headers"
              :data="fileData"
              :on-error="uploaderror"
              :on-success="uploadImg"
              :on-remove="handleRemove"
              :before-upload="beforeUpload">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>

        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">

      <div class="order">
        <span class="line"></span>
        <span class="txt">基本信息</span>
        <span class="line"></span>
      </div>
      <el-col :span="10">
        <el-form-item label="编号" prop="bianhao">
          <el-input :disabled="readonly" v-model="form.bianhao" clearable name="form.bianhao" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="姓名" prop="name" :rules="[{ required:true, message:'姓名为必填项' }]">
          <el-input :disabled="readonly" v-model="form.name" clearable name="form.name" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="性别" prop="gender" :rules="[{ required:true, message:'性别为必填项' }]">
          <el-radio-group :disabled="readonly" v-model="form.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="民族" prop="nation" :rules="[{ required:true, message:'民族为必填项' }]">
          <el-select :disabled="readonly" style="width: 100%" clearable v-model="form.nation">
            <el-option v-for="item in nation_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="身份证号码" prop="id_card" :rules="[{ required:true, message:'身份证号码为必填项' },{validator: verifyIdCard, trigger: 'blur'},]">
          <el-input :disabled="readonly" clearable v-model="form.id_card" name="form.id_card" autocomplete="on" @change="onidCardChange"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="出生年月" prop="birthday" :rules="[{ required:true, message:'出生年月为必填项' }]">
          <el-date-picker :disabled="readonly" @change="addnianling" style="width: 100%" v-model="form.birthday" clearable value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="年龄" prop="nianling" :rules="[{ required:true, message:'年龄为必填项' }]">
          <el-input :disabled="true" v-model="form.nianling" clearable name="form.nianling" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="婚姻状况" prop="marital_status" :rules="[]">
          <el-select :disabled="readonly" style="width: 100%" clearable v-model="form.marital_status">
            <el-option v-for="item in marital_status_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="政治面貌" prop="mianmao">
          <el-select :disabled="readonly" style="width: 100%" clearable v-model="form.mianmao">
            <el-option v-for="item in mianmao_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="入党时间" prop="rudang_date" :rules="[]">
          <el-date-picker :disabled="readonly" style="width: 100%" v-model="form.rudang_date" clearable value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="电话" prop="phone" :rules="[{ required:true, message:'电话为必填项' },{validator: verifyMobile, trigger: 'blur'}]">
          <el-input :disabled="readonly" clearable v-model="form.phone" name="form.phone" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="现居地址" prop="address" :rules="[]">
          <el-input :disabled="readonly" clearable v-model="form.address" name="form.address" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="order">
          <span class="line"></span>
          <span class="txt">工作相关信息</span>
          <span class="line"></span>
        </div>
      </el-col>
      <el-col :span="10">
        <el-form-item label="参工时间" prop="ruzhi_date" :rules="[{ required:true, message:'参工时间为必填项' }]">
          <el-date-picker :disabled="readonly" style="width: 100%" v-model="form.ruzhi_date" clearable value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="职务" prop="yn_zw" :rules="[]">
          <el-input :disabled="readonly" v-model="form.yn_zw" clearable name="form.yn_zw" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="院内职务获取时间" prop="yn_zw_date" :rules="[]">
          <el-date-picker :disabled="readonly" style="width: 100%" v-model="form.yn_zw_date" clearable value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="所在部门" prop="department" :rules="[{ required:true, message:'所在部门为必填项' }]">
          <el-select :disabled="readonly" style="width: 100%" clearable v-model="form.department">
            <el-option v-for="item in department_option_data" :key="item.pk" :label="item.name" :value="item.pk"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item label="首次合同期限" prop="shouci">
          <el-col :span="10">
            <el-date-picker style="width: 100%" :disabled="readonly" v-model="form.shouci" clearable value-format="yyyy-MM-dd" @change="pingqi_change"/>
          </el-col>
          <el-col :span="2" style="text-align: center">
            -
          </el-col>
          <el-col :span="10">
            <el-date-picker style="width: 100%" :disabled="readonly" v-model="form.ht_end_date" clearable value-format="yyyy-MM-dd" @change="pingqi_change"/>
          </el-col>
          <!--          <el-date-picker type="daterange" unlink-panels :disabled="readonly" v-model="shouci_to_ht_end_date" @change="shouci_change" clearable value-format="yyyy-MM-dd"/>-->
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item label="续聘期限" prop="xupin">
          <el-col :span="10">
            <el-date-picker style="width: 100%" :disabled="readonly" v-model="form.xupin" clearable value-format="yyyy-MM-dd" @change="pingqi_change"/>
          </el-col>
          <el-col :span="2" style="text-align: center">
            -
          </el-col>
          <el-col :span="10">
            <el-date-picker style="width: 100%" :disabled="readonly" v-model="form.xp_end_date" clearable value-format="yyyy-MM-dd" @change="pingqi_change"/>
          </el-col>
          <!--          <el-date-picker type="daterange" unlink-panels :disabled="readonly" v-model="xupin_to_xp_end_date" @change="xupin_change" clearable value-format="yyyy-MM-dd"/>-->
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="聘期" prop="pinqi" :rules="[{ required:true, message:'聘期为必填项' }]">
          <el-input type="number" :disabled="readonly" v-model="form.pinqi" name="form.pinqi" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="聘用方式" prop="pinyongfangshi" :rules="[{ required:true, message:'聘用方式为必填项' }]">
          <el-radio-group :disabled="readonly" v-model="form.pinyongfangshi">
            <el-radio v-for="item in pinyongfangshi_option_data" :key="item.pk" :label="item.name">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="是否在职" prop="zaizhi" :rules="[{ required:true, message:'是否在职为必填项' }]">
          <el-radio-group :disabled="readonly" style="width: 100%" v-model="form.zaizhi">
            <el-radio v-for="item in zaizhi_option_data" :key="item.pk" :label="item.name">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="职称" prop="zhicheng" :rules="[]">
          <el-select :disabled="readonly" @change="selectzhicheng" style="width: 100%" clearable v-model="form.zhicheng">
            <el-option v-for="item in zhicheng_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="职称取得时间" prop="zc_date">
          <el-date-picker style="width: 100%" :disabled="isDatePickerDisabled" v-model="form.zc_date" clearable value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="聘任岗位（职务）" prop="zhiwu" :rules="[]">
          <el-select :disabled="readonly" style="width: 100%" clearable v-model="form.zhiwu">
            <el-option v-for="item in zhiwu_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="聘岗取得时间" prop="zw_date" :rules="[]">
          <el-date-picker style="width: 100%" :disabled="readonly" v-model="form.zw_date" clearable value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="行政职务" prop="xingzhengzhiwu" :rules="[]">
          <el-select :disabled="readonly" style="width: 100%" clearable v-model="form.xingzhengzhiwu">
            <el-option v-for="item in xingzhengzhiwu_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="行政职务取得时间" prop="xzzw_date">
          <el-date-picker style="width: 100%" :disabled="isDatePickerDisabled" v-model="form.xzzw_date" clearable value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="实配职数" prop="shipeizhishu" :rules="[]">
          <el-select :disabled="readonly" style="width: 100%" clearable v-model="form.shipeizhishu">
            <el-option v-for="item in shipeizhishu_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="order">
          <span class="line"></span>
          <span class="txt">学历信息</span>
          <span class="line"></span>
        </div>
      </el-col>
      <el-col :span="10">
        <el-form-item label="最高学历" prop="education" :rules="[]">
          <el-select :disabled="readonly" style="width: 100%" clearable v-model="form.education">
            <el-option v-for="item in education_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="最高学历毕业院校" prop="byyx_s_2" :rules="[]">
          <el-input :disabled="readonly" clearable v-model="form.byyx_s_2" name="form.byyx_s_2" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="最高学历毕业时间" prop="biyedate" :rules="[]">
          <el-date-picker style="width: 100%" :disabled="readonly" v-model="form.biyedate" clearable value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="最高学历专业" prop="majors" :rules="[]">
          <el-input :disabled="readonly" clearable v-model="form.majors" name="form.majors" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="最高学历学位" prop="xuewei" :rules="[]">
          <el-input :disabled="readonly" v-model="form.xuewei" clearable name="form.xuewei" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="全日制学历" prop="fulltime_education">
          <el-select :disabled="readonly" style="width: 100%" clearable v-model="form.fulltime_education">
            <el-option v-for="item in education_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="全日制学历毕业院校" prop="byyx_s_1" :rules="[]">
          <el-input :disabled="readonly" clearable v-model="form.byyx_s_1" name="form.byyx_s_2" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="全日制学历毕业时间" prop="qrz_date">
          <el-date-picker style="width: 100%" :disabled="readonly" v-model="form.qrz_date" clearable value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="全日制学历专业" prop="qrz_zhuanye">
          <el-input :disabled="readonly" clearable v-model="form.qrz_zhuanye" name="form.qrz_zhuanye" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="全日制学历学位" prop="qrz_xuewei" :rules="[]">
          <el-input :disabled="readonly" v-model="form.qrz_xuewei" clearable name="form.qrz_xuewei" autocomplete="on"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="order">
          <span class="line"></span>
          <span class="txt">其他信息</span>
          <span class="line"></span>
        </div>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="beizhu">
          <el-input type="textarea" :disabled="readonly" :rows="5" clearable v-model="form.beizhu" name="form.beizhu" autocomplete="on" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-col>


    </el-row>
    <el-row>

      <el-col :span="24">
        <el-form-item label="证明材料" prop="fujian" :rules="[]">
          <PMFileUpload isCustomName v-if="!readonly" :category="categoryPK" :file-list="form.fujian"
                        @on-change="(file, flist)=>{ this.pmfileSuccess(file, flist,'fujian')}">
          </PMFileUpload>
          <TableFileView isCustomName v-else :file-list="form.fujian"></TableFileView>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
//
// TEMPLATE_ID: FT336781955202547712
// 字段说明:
// bianhao:编号
// name:姓名
// gender:性别
// birthday:出生年月
// phone:电话
// education:最高学历
// ruzhi_date:参工时间
// department:所在科室
// zhicheng:职称
// zhiwu:聘任岗位（职务）
// nation:民族
// id_card:身份证号码
// address:现居地址
// mianmao:政治面貌
// photo:照片
// fujian:附件
// dangpai:附件
import {mapState} from "vuex";
import PMFileUpload from "@/components/common/PMFileUpload";
import TableFileView from "@/components/common/TableFileView";
import {verifyMobile, verifyEmail, verifyIdCard} from "@/utils/verify.js"
import moment from "moment";
import {getList, createObj, getObj, updateObj, deleteObj, getObjFromList} from "@/resource";
// import {BASE_HOST} from "@/constvars";

export default {
  name: "Form",
  model: {
    prop: "form"
  },
  props: {
    form: Object,
    readonly: {
      type: Boolean,
      default: false
    },
  },
  components: {
    PMFileUpload,
    TableFileView,
  },
  computed: {
    isDatePickerDisabled() {
      if (this.readonly) {
        return true
      }
      if (this.form.zhicheng === '无') {
        return true;
      }
    },
    ...mapState(['userinfo']),
  },
  data() {
    return {
      headers: {
        Authorization: null
      },
      photo: null, // 照片
      // dialogVisiblephoto: false,
      fileData: {
        sys_id: null,
        org_id: null
      },
      rules: {
        phone: [{"pattern": "^1[3|5|7|8]\\d{9}$", "message": "请输入正确的手机号码", "trigger": "blur"}],
        id_card: [{"pattern": "^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$", "message": "请输入正确的身份证号码", "trigger": "blur"}],

      },
      shouci_to_ht_end_date: [],
      xupin_to_xp_end_date: [],
      categoryPK: null,
      pinyongfangshi_option_data: null,
      nation_option_data: null,
      mianmao_option_data: null,
      education_option_data: null,
      department_option_data: null,
      zaizhi_option_data: null,
      zhicheng_option_data: null,
      zhiwu_option_data: null,
      marital_status_option_data: null,
      xingzhengzhiwu_option_data: null,
      shipeizhishu_option_data: null,
      dangpai_option_data: null,
      verifyMobile,
      verifyEmail,
      verifyIdCard
    }
  },
  mounted() {

  },
  watch: {
    form: {
      handler(newval, oldval) {
        if (newval != oldval) {
          // 首次合同期限:shouci 的附加 mounted_js
          this.shouci_to_ht_end_date = this.form.shouci && this.form.ht_end_date ? [this.form.shouci, this.form.ht_end_date] : [];
          // 续聘期限:xupin 的附加 mounted_js
          this.xupin_to_xp_end_date = this.form.xupin && this.form.xp_end_date ? [this.form.xupin, this.form.xp_end_date] : [];
        }

      }
    },
  },
  async created() {
    await this.getLocalDataSource()
  },
  methods: {
    get_Name(url) {
      let num = url.lastIndexOf('/') + 1
      let name = url.substring(num)
      return name;
    },
    IdCard(IdCard, type) {
      if (type === 1) {
        //获取出生日期
        let birthday = IdCard.substring(6, 10) + "-" + IdCard.substring(10, 12) + "-" + IdCard.substring(12, 14)
        return birthday
      }
      if (type === 2) {
        //获取性别
        if (parseInt(IdCard.substr(16, 1)) % 2 === 1) {
          return "男"
        } else {
          return "女"
        }
      }
      if (type === 3) {
        //获取年龄
        var ageDate = new Date()
        var month = ageDate.getMonth() + 1
        var day = ageDate.getDate()
        var age = ageDate.getFullYear() - IdCard.substring(6, 10) - 1
        if (IdCard.substring(10, 12) < month || IdCard.substring(10, 12) === month && IdCard.substring(12, 14) <= day) {
          age++
        }
        if (age <= 0) {
          age = 1
        }
        return age
      }
    },
    async onidCardChange() {
      this.form.birthday = await this.IdCard(this.form.id_card, 1);
      await this.addnianling(this.form.birthday);
    },
    openImagePreview() {
      const imageUrl = JSON.parse(this.form.photo).file;
      window.open(imageUrl, '_blank');
    },
    selectzhicheng(val) {
      if (val == '无') {
        this.form.zc_date = null;
      }
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片类型文件');
      }
      return isImage;
    },
    beforeUploadPDF(file) {
      const isPDF = file.type.startsWith('application/pdf') || file.type.startsWith('image/');
      if (!isPDF) {
        this.$message.error('只能上传 PDF 文件或者是图片类型文件');
      }
      return isPDF;
    },
    addnianling(val) {
      this.form.nianling = this.moment().diff(val, 'years')
      this.form.gengxindate = this.moment().format('YYYY-MM-DD');
    },
    // 删除图片
    async removeImg(row) {
      try {
        let pk = JSON.parse(row).pk;
        let resp = await deleteObj('fileupload', pk);
      } catch (e) {

      }

      this.form.photo = null
    },
    uploadImg(e, file, fileList) {
      // if (file.response.file.indexOf("192.168.0.168") > -1) {
      //   file.response.file = file.response.file.replace('192.168.0.168', '192.168.0.168:88')
      // }
      this.form.photo = JSON.stringify(file.response)
    },
    pingqi_change() {
      if (this.form.shouci && this.form.ht_end_date && this.form.xupin && this.form.xp_end_date) {
        // this.form.xupin = moment(this.form.shouci).add(Number(this.form.pinqi)*3-1,"years").format("YYYY-MM-DD");
        // this.form.xp_end_date = moment(this.form.ht_end_date).add(Number(this.form.pinqi)*3-1,"years").format("YYYY-MM-DD");
        this.form.pinqi = (moment(this.form.xupin).diff(moment(this.form.shouci), 'years') / 3).toFixed(0);
      }

    },
    // 首次合同期限:shouci 的附加 method
    shouci_change(val) {
      if (val) {
        this.form.shouci = val[0];
        this.form.ht_end_date = val[1];
      } else {
        this.form.shouci = "";
        this.form.ht_end_date = "";
      }
    },
    // 续聘期限:xupin 的附加 method
    xupin_change(val) {
      if (val) {
        this.form.xupin = val[0];
        this.form.xp_end_date = val[1];
      } else {
        this.form.xupin = "";
        this.form.xp_end_date = "";
      }
    },
    uploaderror(e, file, fileList) {
    },
    handleRemove(file, fileList) {
    },
    async getLocalDataSource() {
      this.headers.Authorization = "Bearer " + this.$store.state.token;
      this.fileData.sys_id = this.$store.state.sys_id;
      this.fileData.org_id = this.$store.state.userinfo.org_id;
      // this.pinyongfangshi_option_data = await getObjFromList("basetree", {"parent_name": "人力-聘用方式",org_id:1});
      // this.nation_option_data = await getObjFromList("basetree", {"parent_name": "人力-民族字段",org_id:1});
      // this.mianmao_option_data = await getObjFromList("basetree", {"parent_name": "人力-所属党派",org_id:1});
      // this.education_option_data = await getObjFromList("basetree", {"parent_name": "人力-最高学历字段", org_id:1});
      // console.log(this.education_option_data)
      // this.department_option_data = await getList("flatdepartment", {});
      // this.zaizhi_option_data = await getList("parameters", {"category": "是否"});
      //
      // this.zhicheng_option_data = await getObjFromList("basetree", {"parent_name": "人力-职称字段", org_id:1});
      // this.zhiwu_option_data = await getObjFromList("basetree", {"parent_name": "人力-职务字段", org_id:1});
      // this.marital_status_option_data = await getObjFromList("basetree", {"parent_name": "人力-婚姻状况", org_id:1});
      // this.xingzhengzhiwu_option_data = await getObjFromList("basetree", {"parent_name": "人力-行政职务", org_id:1});
      // this.shipeizhishu_option_data = await getObjFromList("basetree", {"parent_name": "人力-实配职数",org_id:1 });
      // this.dangpai_option_data = await getObjFromList("basetree", {"parent_name": "人力-所属党派",org_id:1 });
      let pinyong = await getObjFromList("basetree", {"name": "人力-聘用方式", isroot: true, org_id: this.userinfo.org_id});
      this.pinyongfangshi_option_data = pinyong.items;
      let nation = await getObjFromList("basetree", {"name": "人力-民族字段", isroot: true, org_id: this.userinfo.org_id});
      this.nation_option_data = nation.items;
      // let mianmao = await getObjFromList("basetree", {"name": "人力-政治面貌",isroot:true,org_id:this.userinfo.org_id});
      // this.mianmao_option_data = mianmao.items;
      let education = await getObjFromList("basetree", {"name": "人力-最高学历字段", isroot: true, org_id: this.userinfo.org_id});
      this.education_option_data = education.items;
      this.department_option_data = await getList("department", {});
      this.zaizhi_option_data = await getList("parameters", {"category": "是否"});
      //
      let zhicheng = await getObjFromList("basetree", {"name": "人力-职称字段", isroot: true, org_id: this.userinfo.org_id});
      this.zhicheng_option_data = zhicheng.items;
      let zhiwu = await getObjFromList("basetree", {"name": "人力-职务字段", org_id: this.userinfo.org_id});
      this.zhiwu_option_data = zhiwu.items;
      let marital = await getObjFromList("basetree", {"name": "人力-婚姻状况", isroot: true, org_id: this.userinfo.org_id});
      this.marital_status_option_data = marital.items;
      let xingzhengzhiwu = await getObjFromList("basetree", {"name": "人力-行政职务", isroot: true, org_id: this.userinfo.org_id});
      this.xingzhengzhiwu_option_data = xingzhengzhiwu.items;
      let shipeizhishu = await getObjFromList("basetree", {"name": "人力-实配职数", isroot: true, org_id: this.userinfo.org_id});
      this.shipeizhishu_option_data = shipeizhishu.items;
      let mianmao = await getObjFromList("basetree", {"name": "人力-所属党派", isroot: true, org_id: this.userinfo.org_id});
      this.mianmao_option_data = mianmao.items;
      let fujian = await getObjFromList(`basetree`, {'name': '人力-附件类型', isroot: true, org_id: this.userinfo.org_id});
      console.log(fujian, '3')
      this.categoryPK = fujian.items;
      // this.categoryPK
      // if (category.length > 0) {
      //   this.categoryPK = category[0].parent;
      // }
    },
    pmfileSuccess(file, flist, value) {
      this.form[value] = flist.map((item) => {
        return {
          name: item.name,
          file: item.response ? item.response.file : item.file,
          pk: item.response ? item.response.pk : item.pk,
          category: item.response ? item.response.category : item.category,
          desc: item.response ? item.response.desc : item.desc,
          file_name: item.response ? item.response.file_name : item.file_name,
        };
      });
    },

    async submit() {
      let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)));
      if (valid) {
        this.$emit("checked");
      } else {
        this.$message.warning("请认真填写表单!")
      }
    },

    handlefileExceed() {
      this.$message.warning("只可选择 1 个文件");
    },
    handlefileRemove(field) {
      this.form[field] = null;
    },
    handlefilePreview(res) {
      if (res.url) {
        let a = document.createElement("a");
        a.href = res.url;
        a.target = "_blank";
        a.click();
      }
    },
    handlefileSuccess(res, field) {
      if (res.file) {
        this.form[field] = res.file;
      }
    }
  },


}
</script>
<style>
.order {
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.order .line {
  display: inline-block;
  width: 35%;
  border-top: 1px solid #ccc;
}

.order .txt {
  color: #686868;
  vertical-align: middle;
}
</style>