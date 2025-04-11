<template>
  <el-card>
    <div v-if="state">
      <el-button
        type="info"
        round
        icon="el-icon-arrow-left"
        @click="$router.go(-1)"
        >返回</el-button
      >
    </div>
    <el-form
      inline
      :model="form"
      :rules="rules"
      ref="form"
      class="formstyle"
      label-width="140px"
      :disabled="state"
      style="margin-top:1rem;"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="资产名称" prop="name">
            <el-input v-model="form.name" style="width: 210px" />
          </el-form-item>
          <el-form-item label="资产编号" prop="sn" v-if="form.number == 1">
            <el-input v-model="form.sn" style="width: 210px" />
          </el-form-item>
          <el-form-item label="资产分类" prop="category">
            <el-cascader
              v-model="form.category"
              :options="category_display_arr"
              :show-all-levels="false"
              :props="{
                children: 'items',
                label: 'name',
                value: 'pk',
                checkStrictly: true,
              }"
              @change="Changefenlei"
              style="width: 210px"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="资产数量" prop="count">
            <el-input v-model="count" style="width: 210px" min="1" />
          </el-form-item>

          <el-form-item label="出厂编号" prop="brand">
            <el-input v-model="form.brand" style="width: 210px" />
          </el-form-item>
          <el-form-item label="入账编号" prop="account_number" :rules="[]">
            <el-input v-model="form.account_number" style="width: 210px" />
          </el-form-item>
          <el-form-item label="入账日期" prop="account_date" :rules="[]">
            <el-date-picker
              v-model="form.account_date"
              type="datetime"
              placeholder="选择入账日期"
              value-format="yyyy-MM-dd"
              style="width: 210px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="购置方式" prop="purchase_method" :rules="[]">
            <el-input v-model="form.purchase_method" style="width: 210px" />
          </el-form-item>
          <el-form-item label="购置日期" prop="release_time">
            <el-date-picker
              v-model="form.release_time"
              type="date"
              placeholder="选择购置日期"
              value-format="yyyy-MM-dd"
              style="width: 210px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="保管人员" prop="bg_persion" :rules="[]">
            <el-input v-model="form.bg_persion" style="width: 210px" />
          </el-form-item>
          <el-form-item label="保管单位/部门" prop="bg_department">
            <el-cascader
              v-model="form.bg_department"
              :options="department_display_arr"
              :props="{
                children: 'items',
                label: 'name',
                value: 'pk',
                checkStrictly: true,
              }"
              @change="Changebaoguan"
              style="width: 210px"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="保修期限" prop="warranty_period" :rules="[]">
            <el-date-picker
              v-model="form.warranty_period"
              type="date"
              placeholder="选择截止日期"
              value-format="yyyy-MM-dd"
              style="width: 210px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="存放地点" prop="location" :rules="[]">
            <el-input v-model="form.location" style="width: 210px" />
          </el-form-item>
          <el-form-item label="净值" prop="net_worth" :rules="[]">
            <el-input v-model="form.net_worth" style="width: 210px" />
          </el-form-item>
          <el-form-item label="资产性质" prop="nature" :rules="[]">
            <el-input v-model="form.nature" style="width: 210px" />
          </el-form-item>
          <el-form-item label="供应商" prop="gys" :rules="[]">
            <el-input v-model="form.gys" style="width: 210px" />
          </el-form-item>
          <el-form-item label="计量单位" prop="unit" :rules="[]">
            <el-input v-model="form.unit" style="width: 210px" />
          </el-form-item>
          <el-form-item
            label="累计折旧"
            prop="accumulated_depreciation"
            :rules="[]"
          >
            <el-input
              v-model="form.accumulated_depreciation"
              style="width: 210px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="原资产号" prop="origin_sn" :rules="[]">
            <el-input v-model="form.origin_sn" style="width: 210px" />
          </el-form-item>
          <el-form-item label="资产原值" prop="cost" :rules="[]">
            <el-input v-model="form.cost" style="width: 210px" />
          </el-form-item>
          <el-form-item label="资产型号" prop="model_num" :rules="[]">
            <el-input v-model="form.model_num" style="width: 210px" />
          </el-form-item>
          <el-form-item label="资产规格" prop="size" :rules="[]">
            <el-input v-model="form.size" style="width: 210px" />
          </el-form-item>
          <el-form-item label="资产状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择"
              style="width: 210px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="使用人员"
            prop="persion"
            v-if="form.status == '已分配'"
          >
            <el-input v-model="form.persion" style="width: 210px" />
          </el-form-item>
          <el-form-item
            label="使用单位/部门"
            prop="department"
            v-if="form.status == '已分配'"
          >
            <el-cascader
              v-model="form.department"
              :options="department_display_arr"
              :props="{
                children: 'items',
                label: 'name',
                value: 'pk',
                checkStrictly: true,
              }"
              @change="Changeshiyong"
              style="width: 210px"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="使用期限"
            prop="down_time"
            :rules="[]"
            v-if="form.status == '已分配'"
          >
            <el-date-picker
              v-model="form.down_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 210px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="product_description" :rules="[]">
            <el-input
              type="textarea"
              placeholder="请输入备注内容"
              v-model="form.product_description"
              maxlength="100"
              show-word-limit
              style="width: 210px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!state">
        <el-col style="text-align: center">
          <el-form-item>
            <el-button icon="el-icon-close" @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" @click="onSubmit('form')" icon="el-icon-check"
              >保存修改</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import resource from "@/resource";
const ZCFORM = {
  template_id: "FT8172429443072",
  sn: null,
  name: null,
  category_display: null,
  category: null,
  brand: null,
  persion: null,
  department_display: null,
  cost: null,
  bg_department_display: null,
  bg_department: null,
  bg_persion: null,
  model_num: null,
  size: null,
  nature: null,
  purchase_method: null,
  gys: null,
  release_time: null,
  location: null,
  account_number: null,
  down_time: null,
  origin_sn: null,
  accumulated_depreciation: null,
  warranty_period: null,
  unit: null,
  net_worth: null,
  account_date: null,
  status: "未分配",
  product_description: null,
  number: 1,
};
export default {
  computed: {
    ...mapState(["org_id", "sys_id", "userinfo"]),
  },
  data() {
    return {
      options: [
        {
          value: "闲置",
          label: "闲置",
        },
        {
          value: "已分配",
          label: "已分配",
        },
        {
          value: "出借",
          label: "出借",
        },
        {
          value: "出租",
          label: "出租",
        },
        {
          value: "已处置", // 已处置
          label: "已处置",
        },
        {
          value: "已报废",
          label: "已报废",
        },
        {
          value: "待报废",
          label: "待报废",
        }
      ],
      pk: null,
      state:false,
      categorypk: "",
      bg_departmentpk: "",
      departmentpk: "",
      form: {
        ...ZCFORM,
      },
      count: 1,
      department_display_arr: [], //部门列表
      category_display_arr: [], //分类列表
      rules: {
        name: [{ required: true, message: "请输入资产名称", trigger: "blur" }],
        department: [
          { required: true, message: "请选择使用部门", trigger: "blur" },
        ],
        persion: [
          { required: true, message: "请输入使用人员", trigger: "blur" },
        ],
        category: [
          { required: true, message: "请选择资产分类", trigger: "blur" },
        ],
        sn: [
          { required: true, message: "请输入资产编号", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.pk = this.$route.params.pk;
    this.state = this.$route.params.state;
    this.getCategoryList();
    this.getDepartmentList();
    this.loadData();
  },
  methods: {
    // 获取部门列表
    async getDepartmentList() {
      let params = {
        org_id: this.org_id,
        isroot: true,
      };
      const res = await resource.getList("department", params);
      this.department_display_arr = this.filterChildrenNull(res);
    },
    // 获取分类列表
    async getCategoryList() {
      let params = {
        org_id: this.userinfo.org_id,
        name: '资产分类'
      };
      const res = await resource.getObjFromList("basetree", params);
      this.category_display_arr = this.filterChildrenNull(res.items);
    },
    // 获取详情
    async loadData() {
      let data = {
        biz_id: this.$bizCode.zichan_biz,
        src_id: this.$sourceCode.source_id,
        template_id: "FT8172429443072",
      };
      const res = await resource.getObj("data", this.pk, data);
      this.form = res;
    },
    // 选取保管单位
    async Changebaoguan(value) {
      this.form.bg_department = value.slice(-1).toString();
      let pk = value.slice(-1).toString();
      const res = await resource.getObj("department", pk);
      this.form.bg_department_display = res.name;
    },
    // 选取使用单位
    async Changeshiyong(value) {
      this.form.department = value.slice(-1).toString();
      let pk = value.slice(-1).toString();
      const res = await resource.getObj("department", pk);
      this.form.department_display = res.name;
    },
    // 选取分类
    async Changefenlei(value) {
      this.form.category = value.slice(-1).toString();
      let pk = value.slice(-1).toString();
      const res = await resource.getObj("flatbasetree", pk,{org_id:this.userinfo.org_id});
      this.form.category_display = res.name;
    },

    async onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let data = {
            ...this.form,
            biz_id: this.$bizCode.zichan_biz,
            src_id: this.$sourceCode.source_id,
          };
          await resource.updateObj("data", this.pk, data);
          this.$message.success("编辑成功");
          this.$router.go(-1)
        } else {
          return false;
        }
      });
    },

    filterChildrenNull(data) {
      data.forEach((i) => {
        if (i.items.length > 0) {
          this.filterChildrenNull(i.items);
        } else {
          i.items = undefined;
        }
      });
      return data;
    },
  },
};
</script>

<style></style>
