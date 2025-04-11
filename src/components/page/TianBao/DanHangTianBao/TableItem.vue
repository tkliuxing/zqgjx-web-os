<template>
    <div>
        <div style="display: flex">
            <Form
                ref="formData"
                v-model="form"
                @add="addformList"
                :update="editValue"
                @update="updateValue"
                style="width: 300px"
            />
            <div style="flex: 1">
                <el-table
                    :data="fields"
                    border
                    max-height="450"
                    :cell-style="{ 'text-align': 'center' }"
                    :header-cell-style="{ 'text-align': 'center' }"
                >
                    <el-table-column label="排序编号" prop="sort_num"></el-table-column>
                    <el-table-column label="字段名称" prop="col_title"></el-table-column>
                    <el-table-column label="提示语" prop="tishi"></el-table-column>
                    <el-table-column label="控件类型">
                        <template slot-scope="{ row }">
                            {{ widgetType(row.widget) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="填报时间"
                        prop="data"
                        v-if="template.type === '自然日' || template.type === '工作日'"
                    ></el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="{ row }">
                            <el-button @click="edit(row)" type="primary">编辑</el-button>
                            <el-button @click="del(row)" type="danger">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="form-footer">
            <el-button @click="$emit('close', false)">取 消</el-button>
            <el-button type="primary" @click="createTemplate('template')">确 定</el-button>
        </div>
    </div>
</template>

<script>
import Form from "./Form.vue";
import {mapState} from "vuex";
import resource from "@/resource";

const template_form = {
    sort_num: null,
    title: null,
    remark: null,
    form_type: 1,
    keyword: "",
    api_version: "v1",
    api_name: "formdata",
    code: "",
    photo: "",
    biz_id: 10000,
};

export default {
    computed: {
        ...mapState(["systemlist"]),
    },
    props: {
        updateForm: Object,
        pid : String,
    },
    data() {
        return {
            template: {...template_form},
            form: {
                pk: null,
                sort_num: null,
                col_title: null,
                widget: "input",
                local_data_source: null,
                in_filter: false,
                is_required: false,
                parent_id : this.pid,
                tishi:null,
                template_id: "FT202308301655334912",
            },
            tempApi_name: "formdata",
            fields: [],
            editValue: false,
            templateData_copy: [],
            loading: false,
            search: "",
        };
    },
    methods: {
        /*
        * 表单添加数据
        * */
        async addformList() {
            // if (!this.form.widget_attr) {
            //     this.form.widget_attr = "{}";
            // }
            // if (!this.form.verify_exp) {
            //     this.form.verify_exp = "[]";
            // }
            if (this.template.pk) {
                if (this.form.data) {
                    // this.form.data[0] = moment(this.form.data[0]).format("HH:mm:ss");
                    // this.form.data[1] = moment(this.form.data[1]).format("HH:mm:ss");
                    this.form.data = this.form.data.join("-");
                } else {
                    this.form.data = "00:00:00-23:59:59";
                }
                this.form.template = this.template.pk;
                this.form.col_name = this.getColName();
                this.form.in_filter = this.form.in_filter.toString();
                this.form.is_required = this.form.is_required.toString();
                let data = this.form;
                let res = await resource.createObj("data", data);
                this.updateForm.field.push(res);
                this.clear();
            }
            this.initUpdate();
        },
        /*
        * 表单修改数据
        * */
        async updateValue() {

            // if (this.form.data) {
            //     this.form.data = this.form.data.join("-");
            // }

            this.form.in_filter = this.form.in_filter.toString();
            this.form.is_required = this.form.is_required.toString();
            let data = this.form;
            await resource.updateObj("data", data.pk, data);

            // let res = await resource.updateObj("formfields", this.form.pk, this.form);
            // let idx = this.updateForm.field.findIndex((i) => {
            //     return i.pk === res.pk;
            // });
            // this.updateForm.field.splice(idx, 1, JSON.parse(JSON.stringify(res)));
            this.clear();
            this.editValue = false;
            this.initUpdate();
        },

        async createTemplate(formName) {
            // let objToStr = JSON.stringify(this.template.remark);
            // let data = { ...this.template };
            // data.remark = objToStr;
            // data.form_type = 1;
            //console.log(data.remark);

            // await resource.updateObj("formtemplate", data.pk, data);
            this.$emit("close");
            // this.$emit("loadData");
        },

        async initUpdate() {
            this.fields = this.updateForm.field.length > 0 ? [...this.updateForm.field] : [];
            this.template = {...this.template, ...this.updateForm};
            if (this.updateForm.pk) {
                this.tempApi_name = this.updateForm.api_name;
            }

            let params = {
                parent_id : this.pid,
                template_id: "FT202308301655334912",
            };
            let res = await resource.getList("data", params);
            this.fields = res.reverse();
        },
        /*
        *表格->表单
        * */
        edit(obj) {
            let ll = {...obj};
            // if (ll.data) {
            //     console.log(1)
            //     ll.data = ll.data.split("-");
            // }
            if(ll.is_required == 'true'){
                ll.is_required = true;
            }else {
                ll.is_required = false;
            }
            if(ll.in_filter == 'true'){
                ll.in_filter = true;
            }else {
                ll.in_filter = false;
            }
            this.form = ll;
            this.editValue = true;
        },

        del(obj) {
            this.$confirm("删除不可恢复, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    if (obj.pk) {
                        await resource.deleteObj("data", obj.pk,1,"FT202308301655334912");
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                    }
                    let idx = this.updateForm.field.findIndex((i) => {
                        return i.pk === obj.pk;
                    });
                    this.updateForm.field.splice(idx, 1);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },



        clear() {
            this.form = {
                pk: null,
                sort_num: null,
                col_title: null,
                tishi:null,
                widget: "input",
                local_data_source: null,
                in_filter: false,
                is_required: false,
                parent_id : this.pid,
                template_id: "FT202308301655334912",
            };
            this.$refs.formData.$refs["ruleForm"].resetFields();
        },

        getColName() {
            let exist_field_names = this.fields.map((val) => val.col_name);
            for (let i = 1; i < 101; i++) {
                let db_field_name = "field_" + this.pad(i, 2);
                if (exist_field_names.indexOf(db_field_name) === -1) {
                    return db_field_name;
                }
            }
            this.$message.error("数据库字段已用完");
            throw Error("数据库字段已用完");
        },

        pad(num, n) {
            var len = num.toString().length;
            while (len < n) {
                num = "0" + num;
                len++;
            }
            return num;
        },
        widgetType(type) {
            if (type === "input") {
                return "输入框";
            }
            if (type === "select") {
                return "选项框";
            }
            if (type === "checkbox") {
              return "多选框";
            }
        },
    },
    created() {
        this.initUpdate();
    },
    components: {
        Form,
    },
    watch: {
        updateForm: {
            handler() {
                this.initUpdate();
            },
            deep: true,
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
