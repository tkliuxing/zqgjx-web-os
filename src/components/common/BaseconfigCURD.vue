<template>
  <div class="baseconfigcurd">
    <el-card>
      <div v-if="categoryPK">
<!--        <el-input style="width: 200px;margin-right: 20px" clearable  v-model="name" :placeholder="'请输入'+categoryName" ></el-input>-->
<!--        <el-button type="primary" icon="el-icon-search" round @click="loadData">搜索</el-button>-->
        <el-button icon="el-icon-circle-plus-outline" round type="primary" @click="createCategory">新建{{categoryName}}
        </el-button>
      </div>
      <el-table style="margin-top: 15px" ref="sortableList"  row-key="pk" :data="data">
        <el-table-column prop="name" align="center" :label="categoryName"></el-table-column>
        <el-table-column v-if="strDefault" prop="description" align="center" label="内容"></el-table-column>
        <el-table-column label="操作" align="center" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="updateCategory(scope.row)" round>编辑</el-button>
            <el-button type="danger" @click="onDelete(scope.row.pk)" round>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="-->
<!--          (pageSize) => {-->
<!--            this.page = 1;-->
<!--            this.pageSize = pageSize;-->
<!--            this.loadData(this.page);-->
<!--          }-->
<!--        " :current-page.sync="page" @current-change="loadData" :total="total" style="margin-top: 10px">-->
<!--      </el-pagination>-->
    </el-card>

    <el-dialog title="新增" :visible.sync="showCreate" width="500px">
      <el-form label-width="110px" >
        <el-row>
          <el-col :span="20">
            <el-form-item :label="categoryName + '：'">
              <el-input  v-model="createForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item v-if="strDefault" label="内容 :">
              <el-input  v-model="createForm.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCreate = false">取 消</el-button>
        <el-button type="primary" @click="onCreateSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="showUpdate" width="500px">
      <el-form label-width="110px">
        <el-row>
          <el-col :span="20">
            <el-form-item :label="categoryName + '：'">
              <el-input v-model="updateForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item v-if="strDefault" label="内容">
              <el-input v-model="updateForm.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import {mapState} from "vuex";
import resource from "@/resource";
export default {
  /**
   * 基本信息的增删改组件
   * 需传入参数 categoryName: 基本配置项名称 、  strDefault: 字符串的默认值
   */
  name: 'BaseconfigCURD',
  props: {
    // 分类名称
    categoryName: {
      type: String,
      default: '基本信息'
    },
    // 是否需要默认内容
    strDefault: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      page: 1,
      name: null, // 搜索的名称
      pageSize: 10,
      total: 0,
      data: [],
      categoryPK: null,
      showCreate: false,
      createForm: {
        name: '',
        description: '',
      },
      showUpdate: false,
      updateForm: {
        pk: null,
        name: '',
        description: '',
      },
      loading: false,
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      this.getDataFromAPI();
    });
  },
  computed:{
    ...mapState(['userinfo'])
  },
  methods: {
    async getDataFromAPI() {
      let el = this.$refs.sortableList.$el.querySelector('tbody');
      const that = this;
      Sortable.create(el, {
        animation: 150,
        async onEnd({newIndex,oldIndex}) {
          let newArr = [...that.data];
          // 获取变化的两个nav节点
          let nav = newArr[newIndex].pk + ',' + newArr[oldIndex].pk;
          let direction;
          if (Number(newIndex) > Number(oldIndex)) {
            direction = "right";
          } else if(Number(newIndex) < Number(oldIndex)){
            direction = "left";
          }else{
            direction = 'none'
          }
          let params = {
            node: nav.split(',')[1],
            target: nav.split(',')[0],
            position: direction,
          };
          if(direction=='none')return await that.loadData();
          let resp =  await that.$http.post("/basetreemove/",params)
          if(resp.status===200){
            that.$message.success('移动成功！');
            await that.loadData();
          }else{
            that.$message.error('移动失败！');
          }
        },
      });
    },
    async init() {
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
    async loadData() {
      this.loading = true;
      let params = {  name: this.categoryName ,org_id:this.userinfo.org_id};
      // if(this.name){
      //   params.name = this.name
      // }
      let resp = await resource.getObjFromList('basetree', params)
      this.data = resp.items;
      this.loading = false;
    },
    pagechange() {
      this.loadData();
    },
    createCategory() {
      this.createForm.name = '';
      this.createForm.description = '';
      this.createForm.parent = this.categoryPK;
      this.createForm.org_id = this.userinfo.org_id;
      this.showCreate = true;
    },
    updateCategory(data) {
      this.updateForm = {...data};
      this.showUpdate = true;
    },
    async onCreateSubmit() {
      let { name } = this.createForm;
      if (!name) {
        this.$message.error(`请填写${this.categoryName}名称`);
      } else {
        await this.$http.post('/flatbasetree/', this.createForm)
        this.showCreate = false;
        await this.loadData();
      }
    },
    async onUpdateSubmit() {
      let { name, pk } = this.updateForm;
      if (!name) {
        this.$message.error(`请填写${this.categoryName}名称`);
      } else {
        await this.$http.put(`/flatbasetree/${pk}/`, this.updateForm)
        this.showUpdate = false;
        await this.loadData();
      }
    },
    async onDelete(pk) {
      this.$confirm(`此操作将永久删除该${this.categoryName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        try{
          await this.$http.delete(`/flatbasetree/${pk}/`);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } catch (e) {
          this.$message({
            type: 'info',
            message: '删除失败!'
          });
          return;
        }
      }).catch(()=>{
        this.$message.info('取消删除')
      }).finally(()=>{
        this.page = 1;
        this.loadData();
      })
    }
  }
};
</script>

<style scoped>

</style>
