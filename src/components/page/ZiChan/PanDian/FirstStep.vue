<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="160px"
      style="margin-top: 2rem"
    >
      <el-form-item label="任务编号" prop="sn">
        <el-input v-model="form.sn" style="width: 240px" />
      </el-form-item>
      <el-form-item label="盘点负责人" prop="fzr">
        <el-select v-model="form.fzr" placeholder="请选择" style="width: 240px"  @change="changePeople">
          <el-option
            v-for="item in peoplelist"
            :key="item.pk"
            :label="item.full_name"
            :value="item.pk"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="任务截至日期" prop="task_end_date">
        <el-date-picker
          v-model="form.task_end_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          style="width: 240px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="盘点说明" prop="description">
        <el-input
          type="textarea"
          v-model="form.description"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="onSubmit">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import resource from "@/resource";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["org_id"]),
  },
  props: {
    taskobj: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        pk: null,
        sn: null,
        fzr: null,
        fzr_display: null,
        name: null,
        task_end_date: null,
        description: null,
      },
      peoplelist: [],
      rules: {
        sn: [{ required: true, message: "请输入资产编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入资产名称", trigger: "blur" }],
        fzr: [{ required: true, message: "请选择盘点负责人", trigger: "blur" }],
      },
    };
  },
  watch: {
    taskobj: {
      handler(newName, oldName) {
        this.form = this.taskobj;
      },
      immediate: true,
    },
  },
  created() {
    this.getPeopleList();
  },
  methods: {
    async getPeopleList() {
      let params = {
        org_id: this.org_id,
      };
      let res = await resource.getList("user", params);
      this.peoplelist = res;
    },
    // 提交
    async onSubmit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          try {
            let data = {
              ...this.form,
              biz_id: this.$bizCode.zichan_biz,
              src_id: this.$sourceCode.source_id,
              template_id: "FT9228425158656",
            };
            console.log(data)
            if (data.pk!=null) {
              await resource.updateObj("data", data.pk, data);
            } else {
              let res = await resource.createObj("data", data);
              this.$emit("submit", res.pk);
            }
            this.$emit("addStep");
          } catch {
            console.log("提交出现错误");
          }
        } else {
          this.$message.error("请检查所填项!");
          return false;
        }
      });
    },
    async changePeople(value){
      let res = await resource.getObj('user',value)
      this.form.fzr_display = res.full_name
    }
  },
};
</script>
