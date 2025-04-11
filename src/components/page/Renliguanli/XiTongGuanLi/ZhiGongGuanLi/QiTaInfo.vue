<template>
  <div class="content">
    <el-form ref="customerForm" :model="customer" label-width="100px">
      <el-form-item label="工号">
        <el-input v-model="customer.job_number"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="customer.name"></el-input>
      </el-form-item>
      <el-form-item label="性别：">
        <el-select v-model="customer.gender" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="customer.certificate_number"></el-input>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="customer.birthday"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="毕业院校">
        <el-input v-model="customer.graduated_college"></el-input>
      </el-form-item>
      <el-form-item label="毕业时间">
        <el-date-picker
          v-model="customer.graduation_date"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="学历">
        <el-select
          v-model="customer.education"
          filterable
          clearable
          allow-create
        >
          <el-option
            v-for="i in source.education_list"
            :key="i.pk"
            :label="i.name"
            :value="i.pk"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学位">
        <el-select
          v-model="customer.academic_degree"
          filterable
          clearable
          allow-create
        >
          <el-option
            v-for="i in source.academic_degreelist"
            :key="i.pk"
            :label="i.name"
            :value="i.pk"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业">
        <el-input v-model="customer.majors"></el-input>
      </el-form-item>
      <el-form-item label="参加工作时间">
        <el-date-picker
          v-model="customer.job_time"
          value-format="yyyy-MM-dd hh:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          v-model="customer.inauguration_date"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="职务">
        <el-input v-model="customer.job_position"></el-input>
      </el-form-item>
      <el-form-item label="职称">
        <el-input v-model="customer.profession"></el-input>
      </el-form-item>
      <el-form-item label="岗位">
        <el-input v-model="customer.job_post"></el-input>
      </el-form-item>
      <el-form-item label="转入本岗日期">
        <el-date-picker
          v-model="customer.zhaunru_date"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="离职时间">
        <el-date-picker
          v-model="customer.lizhi_date"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="退休时间">
        <el-date-picker
          v-model="customer.tuixiu_date"
          value-format="yyyy-MM-dd hh:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="获得称号">
        <el-input v-model="customer.chenghao"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="customer.remark"></el-input>
      </el-form-item>
      <el-form-item label="证书">
        <!-- <el-input v-model="customer.zhengshu"></el-input> -->
        <el-upload
          class="upload-demo"
          :action="CVARS.BASE_HOST+'/api/v1/fileupload/'"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          multiple
          :file-list="fileList"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  props: {
    cusinfo: {
      type: Object,
    },
  },
  data() {
    return {
      customer: {
        job_number: null,
        name: null,
        gender: null,
        certificate_number: null,
        birthday: null,
        graduated_college: null,
        graduation_date: null,
        education: null,
        academic_degree: null,
        majors: null,
        job_time: null,
        inauguration_date: null,
        job_position: null,
        profession: null,
        job_post: null,
        zhaunru_date: null,
        lizhi_date: null,
        tuixiu_date: null,
        chenghao: null,
        zhengshu: null,
        remark: null,
      },
      options: [
        {
          value: "男",
          label: "男",
        },
        {
          value: "女",
          label: "女",
        },
      ],

      fileList: [],
      source: {
        education_list: [],
        academic_degreelist: [],
      },
    };
  },
  watch: {
    customer: {
      handler() {
        this.$emit("customer", this.customer);
      },
      deep: true,
    },
    cusinfo: {
      handler() {
        this.customer = this.cusinfo;
        console.log(this.cusinfo.zhengshu);
        if (this.customer.zhengshu) {
            JSON.parse(this.customer.zhengshu).forEach(el=>{
                this.fileList = [
            {
              url: el,
              name: el.split("/").slice(-1).join(),
            },
          ];
            })
        }
      },
      deep: true,
    },
  },
  created() {},
  methods: {
    // async uploadChange(file, fileList) {
    //   this.fileList = fileList;
    //   let formData = new FormData();
    //   this.fileList.forEach((item) => {
    //     formData.append("file", item.raw);
    //   });
    //   let res=await resource.createObj("fileupload",formData)
    //   let list=[]
    //   list.push(res.file)
    //   this.customer.zhengshu = JSON.stringify(list)
    // },
    handleRemove(file, fileList) {
        let filePath=file.url
        let i=JSON.parse(this.customer.zhengshu).findIndex(el=>el===filePath)
        JSON.parse(this.customer.zhengshu).splice(i,1)

    },
    handleSuccess(response, file, fileList) {
        let zslist=[]
        zslist.push(response.file)
        this.customer.zhengshu = JSON.stringify(zslist);
    },
  },
};
</script>

<style>
</style>
