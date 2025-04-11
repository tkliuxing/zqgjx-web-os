<template>
  <div>
    <div>
      <el-form inline>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addForm">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="data" border stripe  :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" element-loading-text='加载中...' @selection-change="(data)=>batchDelData = data">
      <el-table-column   type="selection"  width="55"></el-table-column>
      <el-table-column label="序号"  width="80" fixed="left">
        <template slot-scope="scope">
          <span>{{ (page - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <template>
        <el-table-column label="创建时间" prop="create_time" max-width="150">
          <template slot-scope="{row}">
            {{ row.create_time ? moment(row.create_time).format("YYYY-MM-DD HH:mm:ss") : '' }}
          </template>
        </el-table-column>
        <template v-if="['point','model'].includes(ObjItem.field_01)">
          <el-table-column label="经度" prop="longitude" min-width="150"></el-table-column>
          <el-table-column label="纬度" prop="latitude" min-width="150"> </el-table-column>
        </template>
        <template v-else-if="['line','polygon'].includes(ObjItem.field_01)">
          <el-table-column label="线" prop="line" min-width="150"> </el-table-column>
        </template>
      </template>
      <el-table-column label="操作" width="150px" fixed="right"  >
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="light" content="编辑" placement="top-start">
            <el-button circle type="primary" icon="el-icon-edit" @click="editTable(row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除" style="padding-top: 5px" placement="top-start">
            <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="删除后不可恢复，确定删除吗？" @confirm="delTable(row)">
              <el-button slot="reference"  circle type="danger" icon="el-icon-remove" />
            </el-popconfirm>
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 10px" class="top-table" @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>


    <el-dialog
      v-if="Visable"
      :visible.sync="Visable"
      :close-on-click-modal="false"
      :title="form.pk?'编辑':'新增'"
      center
      width="60%"
      top="4vh"
      append-to-body
    >
      <el-form  :model='form' ref="form" label-width="120px" status-icon>
        <template v-if="['point','model'].includes(ObjItem.field_01)">
          <el-form-item label="模型文件"  v-if="ObjItem.field_01 == 'model'">
            <mps-upload-file v-model="Model" categoryName="模型" ref="childModel"></mps-upload-file>
          </el-form-item>
          <selectPoint :style="{height:height + 'px'}" :coordinate="EchoPoint" @select="getPoint"/>
        </template>
        <template v-if="['line','polygon'].includes(ObjItem.field_01)">
          <drawFeatures  :type="ObjItem.field_01 == 'line' ? 'LineString' : 'Polygon'"  :EchoLine="EchoLine" @change="getCoordinate"/>
        </template>
      </el-form>
      <div style="text-align: center;margin-top: 20px">
        <el-button @click="Visable = false" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import selectPoint from "@/components/MapNew/selectPoint.vue";
import drawFeatures from "@/components/MapNew/drawFeatures.vue";
import resource from "@/resource";
export default {
  data(){
    return{
      page: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      data: [],
      ObjItem: {},
      Visable: false,
      form: { },
      Model: [],
      EchoPoint: [], // 编辑时使用用于回显 ‘点’ 使用
      markerPoint: null, // 点的数据
      LineData: null, // ‘线’ 和 ‘多边形’ 的数据
      EchoLine: [], // 编辑时使用用于回显 ‘线’ 和 ‘多边形’ 使用
    }
  },
  components: {
    selectPoint,
    drawFeatures,
  },
  props:{
    // 是否显示深色地图
    dark: {
      type: Boolean,
      default: false,
    },
    item:{
      type: Object,
      default:{},
    },
    // 缩放级别
    zoom: {
      type: Number,
      default: 12,
    },
    // 中心点坐标
    center: {
      type: Array,
      default: () => [
        111.67110998107798,
        40.82054115452758
      ],
    },
    // 选点地图的高度
    height:{
      type:Number,
      default: 400
    }
  },
  watch:{
    item:{
      handler(val){
        if(val){
          this.ObjItem = val;
          this.loadData(val);
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    getCoordinate(val){
      if(this.ObjItem.field_01 == 'line'){
        this.LineData = val.coordinates;
      }else{
        this.LineData = val.coordinates[0];
      }
    },
    // 编辑事件
    editTable(row) {
      console.log(row,'row')
      this.form = JSON.parse(JSON.stringify(row))
      this.Visable = true;
      if(['point','model'].includes(this.ObjItem.field_01)){
        this.EchoPoint = [Number(this.form.longitude),Number(this.form.latitude)]
      }
      if(['line','polygon'].includes(this.ObjItem.field_01)){
        this.EchoLine = JSON.parse(row.line)
      }
      if(this.ObjItem.field_01 == 'model'){
        this.Model = JSON.parse(row.field_01)
      }
    },
    // 删除事件
    async delTable(row) {
      let url;
      if (['polygon', 'line'].includes(this.ObjItem.field_01)) {
        url = 'gps-polygon'
      } else {
        url = 'gps-point'
      }
      await resource.deleteObj(url, row.pk, {})
      this.$message.success('删除成功！')
      await this.loadData(this.ObjItem)
    },
    getPoint(val){
      this.markerPoint = val;
    },
    // 保存方法
    async save(){
      try {
        if(!this.markerPoint && ['point','model'].includes(this.ObjItem.field_01)){
          this.$message.warning('还未选择坐标点！')
          return
        }
        let url;
        if(['polygon','line'].includes(this.ObjItem.field_01)){
          url = 'gps-polygon'
        }else{
          url = 'gps-point'
        }
        // 为模型时调用组件提交方法，返回值就是v-model绑定的值
        if(this.ObjItem.field_01 == 'model'){
          let image_file = await this.$refs.childModel.submits();
          // 可根据返回值判断附件上传是否成功
          if(image_file && image_file.status == 'error') return this.$message.warning('附件上传失败，请重新上传')
        }
        let params = {
          sn: this.ObjItem.pk,
          create_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        if(['point','model'].includes(this.ObjItem.field_01)){
          params.longitude = this.markerPoint[0]
          params.latitude = this.markerPoint[1]
        }
        if(['line','polygon'].includes(this.ObjItem.field_01)){
          params.line = this.LineData;
        }
        if(this.ObjItem.field_01 == 'model'){
          if(this.Model && this.Model.length>0){
            params.field_01 = JSON.stringify(this.Model) // 模型文件，存放到gps-point中的field_01字段
          }else{
            return this.$message.warning('请上传模型文件！')
          }
        }
        if(this.form && this.form.pk){
          await resource.updateObj(url,this.form.pk,params)
        }else{
          await resource.createObj(url,params)
        }
        this.$message.success('操作成功！')
        this.Visable = false;
        await this.loadData(this.ObjItem)
      }catch (e) {
        console.error(e)
      }
    },
    addForm(){
      this.form = {};
      this.Visable = true;
      if(this.ObjItem.field_01 == 'model'){
        this.Model = []
      }
      this.EchoPoint = [];
      this.EchoLine = [];
    },
    async loadData(val) {
      try {
        let params = {
          sn: val.pk,
          page: this.page,
          pageSize: this.pageSize,
        }
        let url;
        if(['polygon','line'].includes(val.field_01)){
          url = 'gps-polygon'
        }else{
          url = 'gps-point'
        }
        let resp = await resource.getList(url, params)
        this.data = resp.data;
        this.total = resp.count;
      } catch (e) {
        console.error(e)
      }
    },

  }
}
</script>
<style scoped>

</style>