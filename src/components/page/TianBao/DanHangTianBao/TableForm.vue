<template>
    <div>
        <el-form :model="template" ref="template" label-width="100px">
            <el-form-item label="表单名称" prop="title" :rules="{ required: true, message: '必填项!' }">
                <el-input v-model="template.title" maxlength="120"  show-word-limit/>
            </el-form-item>

            <el-form-item label="表单备注">
                <el-input type="textarea" v-model="template.bz_info"/>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否启用">
                  <el-switch v-model="template.qy_state" active-text="开启" inactive-text="关闭" active-value="是"
                             inactive-value="否">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生效日期">
                  <el-date-picker v-model="template.start_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="截止日期">
                  <el-date-picker v-model="template.end_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          <div style="padding: 20px;border-radius: 15px;margin: 20px 0;border: 1px solid #dcdfe6">
            <el-form-item label="填报说明" prop="shuoming">
              <el-switch v-model="template.shuoming" active-text="开启" inactive-text="关闭" active-value="是"
                         inactive-value="否">
              </el-switch>
            </el-form-item>

            <el-form-item prop="sm">
              <editor-bar
                v-model="template.sm"
                :isClear="isClear"
                @change="change"
                style="margin-top: 40px"
              ></editor-bar>
            </el-form-item>
          </div>


          <el-row>
            <el-col :span="8">
              <el-form-item label="是否登录">
                <el-switch v-model="template.need_login" active-text="是" inactive-text="否" @change="changelog">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="重复填报" v-if="template.need_login == true">
                <el-switch v-model="template.show_result" active-text="是" inactive-text="否" active-value="是"
                           inactive-value="否">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <template v-if="
        template.need_login == true && template.show_result === '是'
      ">
                <el-form-item label="填报周期">
                  <el-select v-model="template.type" placeholder="请选择填报类型">
                    <el-option label="不限" value="不限"></el-option>
                    <el-option label="季度" value="季度"></el-option>
                    <el-option label="月度" value="月度"></el-option>
                    <el-option label="旬" value="旬"></el-option>
                    <el-option label="周" value="周"></el-option>
                    <el-option label="自然日" value="自然日"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="每日次数" v-if="
          template.type === '自然日' ||
          template.type === '工作日'
        ">
                  <el-input-number v-model="template.day_number" :min="1" :max="3"/>
                </el-form-item>
              </template>
            </el-col>
          </el-row>





        </el-form>
        <div class="form-footer">
            <el-button @click="$emit('close', false)">取 消</el-button>
            <el-button type="primary" @click="createTemplate('template')">确 定</el-button>
        </div>
    </div>
</template>

<script>
import resource from "@/resource";
import moment from 'moment';
import EditorBar from "@/components/common/EditorBar";
export default {
    props: {updateForm: Object},
    data() {
        return {
            template: {
                pk: null,
                title: null,
                bz_info: null,
                start_time: null,
                shuoming: '否',
                end_time: null,
                sm: null,
                need_login: false,
                show_result: "否",
                qy_state: "是",
                type: "不限",
                day_number: null,
                template_id: "FT181649085367160832",
            },
          isClear: false,
          shuoming_option_data: [],
        };
    },
  components:{EditorBar},
    methods: {
        change(val) {
          this.template.sm = val;
        },
        // 修改表单
        createTemplate(formName) {

            let data = this.template;
            data.need_login = data.need_login + "";
            data.biz_id = this.$bizCode.tianbao_biz;
            data.src_id = this.$sourceCode.source_id;
            data.create_time = moment().format("YYYY-MM-DD HH:mm:ss")
          console.log(data)
          // 判断生效日期不能大于截止日期
          let start_time = moment(data.start_time).format("YYYY-MM-DD");
          let end_time = moment(data.end_time).format("YYYY-MM-DD");
          if(start_time > end_time){
            this.$message.error("生效日期不能大于截止日期!");
            return;
          }
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    if (data.pk) {
                        let res = await resource.updateObj("data", data.pk, data);
                        this.template = res;
                        if(res.need_login == 'true'){
                            this.template.need_login = true;
                        }else {
                            this.template.need_login = false;
                        }
                    } else {
                        await resource.createObj("data", data);
                    }
                    this.$emit("close");
                    this.$emit("loadData");
                    this.clear();
                } else {
                    this.$message.error("请认真检查必填项!");
                    return;
                }
            });
        },

        // 初始化表单
        initUpdate() {

            this.template = {...this.template, ...this.updateForm};
            if(this.updateForm.need_login == 'true'){
                this.template.need_login = true;
            }else {
                this.template.need_login = false;
            }

            // console.log(this.template.need_login)
        },

        changelog(val) {
            if (val == false) {
                this.template.show_result = "否";
            }
        },

        clear() {
            this.template = {
                title: null,
                bz_info: null,
                start_time: null,
                end_time: null,
                need_login: false,
                show_result: "否",
                qy_state: "是",
                type: "不限",
                template_id: "FT181649085367160832",
            }

            this.$refs.template.resetFields();
        },
      async getLocalDataSourceSourceSource() {
        // 获取填报说明:shuoming数据源数据
        this.shuoming_option_data = await resource.getList("parameters",{"category":"是否"});
      }

    },

    created() {
        this.initUpdate();
        this.getLocalDataSourceSourceSource();
    },

    watch: {
        updateForm: {
            handler() {
                this.initUpdate();
            },
            immediate: true,
        },
    },
};
</script>

<style scoped>
.form-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 1rem;
    box-sizing: border-box;
}

.upload /deep/ .el-upload {
    display: none;
}
</style>
