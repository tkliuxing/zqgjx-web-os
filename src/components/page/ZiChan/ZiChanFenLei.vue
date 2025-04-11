<template>
  <div class="ZiChanFenLeiGuanLi">
    <el-card v-loading="loading">
      <div style="margin-bottom: 10px">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            round
            @click="xinjian"
            class="ln-yellow"
          >
            新增资产分类
          </el-button>
        <el-button
          v-if="is_collapse"
          type="info"
          icon="el-icon-minus"
          round
          @click="toggleCollapse"
          class="ln-yellow"
        >
          全部收起
        </el-button>
        <el-button
          v-else
          type="info"
          icon="el-icon-plus"
          round
          @click="toggleCollapse"
          class="ln-yellow"
        >
          全部展开
        </el-button>
      </div>
      <!-- 分类树 -->
      <div class="block" style="width: 600px; overflow-x: visible">
        <el-tree
          :data="data"
          node-key="pk"
          ref="selectTree"
          default-expand-all
          :props="{ children: 'items', label: 'name' }"
          :expand-on-click-node="false"
          :draggable="true"
          @node-drop="movenode"
        >
          <span class="custom-tree-node" slot-scope="{ data,node }">
            <span>{{ data.name }}</span>
            <span style="text-align: center">
              <el-button
                type="text"
                size="small"
                @click="Child_add_fenlei(data)"
                style="margin: 0 10px"
              >
                增加子分类
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="Edit_fenlei(data,node)"
                style="margin: 0 10px"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="delete_fenlei(data)"
                style="margin: 0 10px"
              >
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </el-card>
    <!--新增分类-->
    <el-dialog
      title="新增资产分类"
      :visible.sync="add_fenlei"
      width="30%"
      center
    >
      <el-form
        :model="fenlei_form"
        :rules="rules"
        ref="createForm"
        label-width="120px"
        :label-position="'right'"
      >
        <el-form-item label="名称：" prop="name">
          <el-input
            v-model="fenlei_form.name"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="折旧年限：" prop="field_01">
          <el-input
            v-model="fenlei_form.field_01"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入折旧年限"
          ></el-input>
        </el-form-item>
        <el-form-item label="年折旧率(%)：" prop="field_02">
          <el-input
            v-model="fenlei_form.field_02"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入年折旧率"
          ></el-input>
        </el-form-item>
        <el-form-item label="净残值率(%)：" prop="field_03">
          <el-input
            v-model="fenlei_form.field_03"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入净残值率"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="add_fenlei = false" class="ln-button" round
          >取 消</el-button
        >
        <el-button type="primary" @click="fenlei_add" class="ln-button" round
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--新增子分类-->
    <el-dialog
      title="新增子分类"
      :visible.sync="child_add_fenlei"
      width="30%"
      center
    >
      <el-form
        :model="fenlei_form"
        :rules="rules"
        ref="createChildForm"
        label-width="120px"
        :label-position="'right'"
      >
        <el-form-item label="名称：" prop="name">
          <el-input
            v-model="fenlei_form.name"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="折旧年限：" prop="field_01">
          <el-input
            v-model="fenlei_form.field_01"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入折旧年限"
          ></el-input>
        </el-form-item>
        <el-form-item label="年折旧率(%)：" prop="field_02">
          <el-input
            v-model="fenlei_form.field_02"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入年折旧率"
          ></el-input>
        </el-form-item>
        <el-form-item label="净残值率(%)：" prop="field_03">
          <el-input
            v-model="fenlei_form.field_03"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入净残值率"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="child_add_fenlei = false" class="ln-button" round
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="child_add(fenlei_form)"
          class="ln-button"
          round
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--编辑分类-->
    <el-dialog
      title="编辑资产分类"
      :visible.sync="edit_fenlei"
      width="30%"
      center
    >
      <el-form
        :model="bianji_form"
        :rules="rules"
        ref="editForm"
        label-width="120px"
        :label-position="'right'"
      >
        <el-form-item label="名称：" prop="name">
          <el-input
            v-model="bianji_form.name"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="折旧年限：" prop="field_01">
          <el-input
            v-model="bianji_form.field_01"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入折旧年限"
          ></el-input>
        </el-form-item>
        <el-form-item label="年折旧率(%)：" prop="field_02">
          <el-input
            v-model="bianji_form.field_02"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入年折旧率"
          ></el-input>
        </el-form-item>
        <el-form-item label="净残值率(%)：" prop="field_03">
          <el-input
            v-model="bianji_form.field_03"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入净残值率"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="edit_fenlei = false" class="ln-button" round
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="update(bianji_form)"
          class="ln-button"
          round
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import resource from "@/resource";
export default {
  name: "ZiChanFenLeiGuanLi",
  computed: {
    ...mapState(["org_id", "sys_id", "userinfo","quanxian"]),
  },
  data() {
    return {
      is_collapse: true,
      loading: false,
      data: [],
      add_fenlei: false,
      edit_fenlei: false,
      child_add_fenlei: false,
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "change" },
        ],
        field_01: [
          { required: true, message: "请输入折旧年限", trigger: "change" },
        ],
        field_02: [
          { required: true, message: "请输入年折旧率", trigger: "change" },
        ],
        field_03: [
          { required: true, message: "请输入净残值率", trigger: "change" },
        ],
      },
      fenlei_form: {
        name: "",
        field_01: "",
        field_02: "",
        field_03: "",
      },
      id: "",
      bianji_form: {
        name: "",
      },
      categoryName: '资产分类',
      pk: null,
    };
  },
  methods: {
    xinjian(){
      if(!this.quanxian.固定资产 && this.data.length>=1){
        this.$message({
          message: '非会员用户只可添加一条数据，如果想继续添加请联系管理员，电话:400-1369080',
          type: 'warning',
          duration: 3000
        });
      }else{
        this.add_fenlei = true;
      }
    },
    async loadData() {
      this.loading = true;
      let resp = await this.$http.get(`/basetree/`,{ params: { name: this.categoryName },org_id:this.userinfo.org_id});
      console.log(resp,'123132123')
      this.pk = resp.data[0].pk;
      this.data = resp.data[0].items;
      this.loading = false;
    },
async init(){
  try {
    let resp = await this.$http.get(`/flatbasetree/`,{ params: { name: this.categoryName },org_id:this.userinfo.org_id });
    if(resp.data.length>0){
      this.categoryPK = resp.data[0].pk;
      await this.loadData();
    }
    else{
      let resp = await this.$http.post('/flatbasetree/', { name: this.categoryName });
      this.categoryPK = resp.data.pk;
      await this.loadData();
    }
  } catch (err) {
    this.$message.error('加载数据错误！');
  }
},
    form_clean() {
      // 还原from表单
      this.fenlei_form = {
        name: "",
      };
    },

    fenlei_add() {
      // 新增顶级部门
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.add_fenlei = false;
          this.fenlei_form["parent"] = this.pk;
          // this.fenlei_form["biz_id"] = this.$bizCode.zichanfenlei_biz;
          this.fenlei_form.org_id = this.userinfo.org_id;
          this.$http
            .post("/basetree/", this.fenlei_form)
            .then((resp) => {
              this.loadData();
              this.form_clean();
            })
            .catch((err) => {
              this.$message.error({
                message: "数据获取失败！！",
                center: true,
              });
            });
        } else {
          this.$message.error("请填写完整信息后提交");
          return false;
        }
      });
    },
    // 增加子分类
    Child_add_fenlei(data) {
      this.child_add_fenlei = true;
      this.id = data.pk;
    },
    child_add() {
      this.$refs.createChildForm.validate((valid) => {
        if (valid) {
          this.child_add_fenlei = false;
          this.fenlei_form["parent"] = this.id;
          // this.fenlei_form["biz_id"] = this.$bizCode.zichanfenlei_biz;
          this.$http
            .post("/basetree/", this.fenlei_form)
            .then((resp) => {
              this.$refs["selectTree"].updateKeyChildren(this.id, resp.data);
              this.loadData();
              this.form_clean();
            })
            .catch((err) => {
              this.$message.error({
                message: "数据获取失败！！",
                center: true,
              });
            });
        } else {
          this.$message.error("请填写完整信息后提交");
          return false;
        }
      });
    },

    Edit_fenlei(data,node) {
      console.log(data,node)
      this.edit_fenlei = true;
      this.bianji_form = data;
    },

    update() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.edit_fenlei = false;
          // this.bianji_form["biz_id"] = this.$bizCode.zichanfenlei_biz;
          this.bianji_form.org_id = this.userinfo.org_id;
          this.$http
            .put("/basetree/" + this.bianji_form.pk + "/", this.bianji_form)
            .then((resp) => {
              this.loadData();
              this.form_clean();
            })
            .catch((err) => {
              this.$message.error({
                message: "数据获取失败！！",
                center: true,
              });
            });
        } else {
          this.$message.error("请填写完整信息后提交");
          return false;
        }
      });
    },

    delete_fenlei(data) {
      this.$confirm(
        '此操作将永久删除  "' + data.name + '"  及所属部门, 是否继续?',
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http
            .delete("/basetree/" + data.pk + "/")
            .then((resp) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.loadData();
            })
            .catch((err) => {
              this.$message.error({ message: "删除失败！！", center: true });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    movenode(node, target, position, event) {
      let pos = "";
      switch (position) {
        case "before":
          pos = "left";
          break;
        case "after":
          pos = "right";
          break;
        case "inner":
          pos = "first-child";
          break;
      }
      let params = {
        node: node.data.pk,
        target: target.data.pk,
        position: pos,
      };
      this.$http.post("/basetreemove/", params).then((resp) => {});
    },
    toggleCollapse() {
      this.is_collapse = !this.is_collapse;
      let treeList = this.data;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.selectTree.store.nodesMap[treeList[i].pk].expanded =
          this.is_collapse;
      }
    },
  },
  mounted() {
    this.init();
    this.fenlei_form.sys_id = this.sys_id;
    this.fenlei_form.org_id = this.org_id;
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
