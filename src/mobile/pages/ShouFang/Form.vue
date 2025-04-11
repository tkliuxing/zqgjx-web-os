<template>
  <el-form :model='form' ref="FormComp" label-width="95px" status-icon>
    <el-form-item label="受访单位" v-if="sys_org_data">
      <span>{{sys_org_data.name || "-"}}</span>
    </el-form-item>
    <el-form-item label="受访人员" prop="user_id" :rules="[
        { required:true, message:'受访人员为必填项' },
      ]">
        <el-select
          style='width: 100%'
          v-model="form.user_id"
          filterable
          ref="select"
          clearable
          remote
          reserve-keyword
          :disabled="status===1?false:true"
          placeholder="请输入完整姓名或联系方式..."
          :remote-method="remoteMethod"
          :loading="loading"
          @change="onChanges"
          @blur.native.capture="onblur"
          @hook:mounted="cancalReadOnly"
          @visible-change="cancalReadOnly"
          :popper-append-to-body="true"
        >
          <el-option
            v-for="item in user_id_option"
            :key="item.pk"
            :label="item.full_name+'('+item.mobile+')'"
            :value="item.pk">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="来访人姓名" prop="lf_name" :rules="[
        { required:true, message:'来访人姓名为必填项' },
      ]">
      <el-input v-model="form.lf_name" clearable :disabled="status===1?false:true"></el-input>
    </el-form-item>
    <el-form-item label="所属单位" prop="lf_dep" :rules="[]">
      <el-input v-model="form.lf_dep" clearable :disabled="status===1?false:true"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="lf_mobile" :rules="[
        { validator: verifyMobile, trigger: 'blur' },
        { required:true, message:'联系方式为必填项' },
      ]">
      <el-input v-model="form.lf_mobile" clearable :disabled="status===1?false:true"></el-input>
    </el-form-item>
    <el-form-item label="身份证" prop="id_number" :rules="[
        { validator: verifyIdCard, trigger: 'blur' },
      ]">
      <el-input v-model="form.id_number" clearable :disabled="status===1?false:true"></el-input>
    </el-form-item>
    <el-form-item label="体温" prop="heat" :rules="[]">
      <el-input v-model="form.heat" clearable :disabled="status===1?false:true"></el-input>
    </el-form-item>
    <el-form-item label="来访事由" prop="lf_sy" :rules="[
        { required:true, message:'来访事由为必填项' },
      ]">
      <el-input :disabled="status===1?false:true" type="textarea" v-model="form.lf_sy" :rows="4" :maxlength="300"
                :show-word-limit="true" clearable></el-input>
    </el-form-item>
    <el-form-item v-if="status!==1" label="拜访访时间" prop="create_time" :rules="[
        { required:true, message:'拜访时间为必填项' },
      ]">
      <span>{{ form.create_time }}</span>
    </el-form-item>

    <el-form-item v-if="status!==1 && form.sh_time" label="审核访时间" prop="create_time">
      <span>{{ form.sh_time }}</span>
    </el-form-item>
  </el-form>
</template>
<script>
//
// TEMPLATE_ID: FT251654980880760832
// 字段说明:
// user_id:受访人员
// wx_openid:来访人openid
// lf_name:来访人姓名
// lf_dep:所属单位
// lf_mobile:联系方式
// lf_sy:来访事由
// create_time:来访时间
// status:申请状态
// remarks:备注
// sf_name:受访人姓名
// sf_mobile:受访人联系方式
import {verifyMobile, verifyEmail, verifyIdCard} from "@/mobile/utils/verify.js"
import {BASE_HOST} from "@/mobile/mobile.constvars";

import Vue from 'vue';
import {Input,Select,Option,Form,FormItem,Message} from 'element-ui';
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Message);
import resource from "@/mobile/resource";

export default {
  name: "Form",
  model: {
    prop: "form"
  },
  props: {
    form: Object,
    org_id: String,
    status: Number,
  },
  data() {
    return {
      headers: {
        Authorization: null
      },
      fileData: {
        sys_id: null,
        org_id: null
      },
      BASE_HOST: BASE_HOST,

      user_id_option_data: null,

      status_option_data: null,
      sys_org_data: null,
      loading: false,
      user_id_option: null,

      verifyMobile, verifyEmail, verifyIdCard
    }
  },
  methods: {
    onblur(){
      setTimeout(() => {
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){ //判断iPhone|iPad|iPod|iOS
          this.$refs.select.blur()
        }
        let scrollHeight=document.documentElement.scrollTop || document.body.scrollTop||0;
        window.scrollTo(0,Math.max(scrollHeight-1,0))
      }, 100);
    },
    //取消只读
    cancalReadOnly(onOff){
      this.$nextTick(()=>{
        if(!onOff){
          const {select} =this.$refs;
          const input =select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    onChanges(value) {
      if (value) {
        this.form.sf_name = this.user_id_option[0].full_name;
        this.form.sf_mobile = this.user_id_option[0].mobile;
      } else {
        this.form.sf_name = null;
        this.form.sf_mobile = null;
      }
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        let res = await resource.createObj("userfind", {
          'org_id': this.org_id || this.$store.state.userinfo.org_id,
          "sys_id": 1,
          'search': query
        });

        if (res) {
          if (res.count === 1 && res.wechart_oid) {
            this.user_id_option = [res];
          } else {
            this.user_id_option = [];
          }
        } else {
          this.user_id_option = [];
        }
        this.loading = false;
      } else {
        this.user_id_option = [];
      }
    },
    async getLocalDataSource() {
      this.headers.Authorization = this.org_id ? '' : `Bearer ${this.$store.state.token}`;
      this.fileData.sys_id = 1;
      this.fileData.org_id = this.org_id || this.$store.state.userinfo.org_id;

      // let res0 = await resource.getList("user", {
      //   'org_id': this.org_id || this.$store.state.userinfo.org_id,
      //   "sys_id": 1
      // });
      // let res0 = await resource.getList("user", {"department": "dep251618165655273472"});
      // this.user_id_option_data = res0;
      let res1 = await resource.getList("systemorg", {
        'org_id': this.org_id,
        "sys_id": 1
      });
      this.sys_org_data= res1[0]

    },
    async submit() {
       new Promise(resolve => this.$refs.FormComp.validate(validate => resolve(validate)))
      if (!this.form.user_id || !this.form.lf_name || !this.form.lf_mobile || !this.form.lf_sy) {
        Message.warning("请认真填写表单!");
        return;
      }
      this.$emit("checked");
      // let valid = await new Promise(resolve => this.$refs.FormComp.validate(validate => resolve(validate)))
      // if (valid) {
      //   console.log(this.form);
      //   this.$emit("checked");
      // } else {
      //   Message.warning("请认真填写表单!")
      // }
    },
    async get_user_id_option_data_display() {
      let res = await resource.createObj("userfind", {
        'org_id': this.org_id || this.$store.state.userinfo.org_id,
        "sys_id": 1,
        'search': this.form.sf_mobile
      });
      if (res) {
        if (res.count === 1 && res.wechart_oid) {
          this.user_id_option = [res];
        } else {
          this.user_id_option = [];
        }
      } else {
        this.user_id_option = [];
      }
    },
    handlefileSuccess(res, field) {
      if (res.file) {
        this.form[field] = res.file;
        this.form = {...this.form}
      }
    }
  },
  async created() {
    await this.getLocalDataSource();
    if (this.form.pk) {
      await this.get_user_id_option_data_display();
    }

  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.select-container {
  //height: 200px; /* 根据需要设置高度 */
  overflow: auto;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>