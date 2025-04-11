<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-button
          @click="getCategory"
          type="primary"
          icon="el-icon-plus"
          round
        >
          新建</el-button
        >
      </el-form-item>
    </el-form>
<!--    <el-tabs v-model="search.category" type="card" @tab-click="handleClick">-->
<!--      <el-tab-pane-->
<!--        v-for="i in search.categoryItems"-->
<!--        :label="i.name"-->
<!--        :name="i.pk"-->
<!--        :key="i.pk"-->
<!--      >-->
<!--      </el-tab-pane>-->
<!--    </el-tabs>-->
    <el-table
      :data="pageData"
      v-loading="loading"
      element-loading-text="加载中..."
      border
      stripe
      :show-summary="isHeji ? true : false"
      :summary-method="getSummaries"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <template v-if="headers.length > 0">
        <template>
          <el-table-column
            v-for="(header, index) in headers"
            :key="index"
            :label="header.label"
            :prop="`text_01.${header.prop}`"
          >
            <template slot-scope="{ row }">
             <div v-if="header.widget == 'upload'">
               <el-button type="primary" plain @click="getFile(row.text_01[header.prop])">查看文件</el-button>
             </div>
              <div v-else>
                {{row.text_01[header.prop]}}
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" fixed="right" width="300">
          <template slot-scope="{ row }">
            <el-button type="warning" icon="el-icon-location-information" @click="editAddress(row)" >修改坐标点</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="edit(row)" >编辑</el-button>
            <el-popconfirm
              style="margin-left: 10px"
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="del(row)"
            >
              <el-button slot="reference" type="danger" icon="el-icon-remove"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
      <el-table-column v-else></el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 12px;text-align: left;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal">
    </el-pagination>
    <el-dialog
      v-if="createDialogVisable"
      :visible.sync="createDialogVisable"
      center
      :title="updateObj ? '编辑实体':'新建实体'"
      :close-on-click-modal="false"
      @closed="clear"
      append-to-body
    >
      <el-form ref="form" label-width="100px">
<!--        <el-form-item label="模板" v-if="categoryList && !updateObj">-->
<!--          <el-select-->
<!--            v-model="categoryObj"-->
<!--            style="width: 100%"-->
<!--            @change="findFields"-->
<!--            value-key="pk"-->
<!--            filterable-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="i in categoryList"-->
<!--              :label="i.name"-->
<!--              :value="i"-->
<!--              :key="i.pk"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <DyamicForm
          v-if="categoryObj"
          :datas="categoryObj"
          @close="createDialogVisable = false"
          @formData="dymaicData"
          :update="updateObj"
        />
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="pointVisable"
      :close-on-click-modal="false"
      title="选取坐标点"
      width="95%"
      top="3vh"
      fullscreen
      append-to-body
      center
    >
      <template v-if="['point','model'].includes(ObjItem.field_01)">
        <selectPoint  :coordinate="EchoPoint" @select="getPoint"/>
      </template>
      <template v-if="['line','polygon'].includes(ObjItem.field_01)">
        <drawFeatures  :type="ObjItem.field_01 == 'line' ? 'LineString' : 'Polygon'"    @change="getCoordinate"/>
      </template>
      <div style="text-align: center;margin-top: 20px">
        <el-button @click="pointVisable = false" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag append-to-body :visible.sync="imgShow" width="650px">
      <el-image v-if="imgShow" fit="contain" style="width: 600px; height: 500px" :src="url">
      </el-image>
    </el-dialog>
    <PDFViewer v-if="pdfurl" :pdf-url="pdfurl" :visable="pdfVisable" @close="pdfVisable=false"></PDFViewer>
    <el-dialog v-dialogDrag append-to-body :visible.sync="mp4Show" width="600px">
      <video controls :src="mp4url" style="width: 500px"></video>
    </el-dialog>
    <el-dialog v-dialogDrag title="文件查看" v-if="lookfilevisible" append-to-body :visible.sync="lookfilevisible" width="50%">
      <el-descriptions border :column="1" v-loading="loading"
                       element-loading-text="拼命加载中"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.8)">

        <el-descriptions-item label="附件" :labelStyle="[lablewidth]">
          <div class="filebox" v-for="(item,index) in lookfiledata" :key="index">
            <div class="fileitem">
                        <span class="filename">
                          <span style="float: left">文件名称：</span>
                          <span class="filefile" @click="Previews(item)">{{item.name}}</span>
                        </span>
              <span v-if="Has_create_time" class="fileClass">
                            <span>上传时间：</span>
                            <span>{{item.create_time}}</span>
                        </span>
              <span v-if="Has_user" class="fileClass">
                            <span>上传人：</span>
                            <span>{{item.user}}</span>
                        </span>
              <span v-if="Has_category" class="fileClass">
                            <span>分类：</span>
                            <span>{{item.category}}</span>
                        </span>
              <span style="display: block;border-bottom: 1px dashed #c3c3c3"></span>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-card>
</template>

<script>
import resource from "@/resource";
import DyamicForm from "./DyamicForm.vue";
import {BASE_HOST, BIZ_ID} from "@/constvars";
import selectPoint from "@/components/MapNew/selectPoint.vue";
import drawFeatures from "@/components/MapNew/drawFeatures.vue";
import PDFViewer from "@/components/common/PDFViewer.vue";
export default {
  name: "PointManage",
  components: {
    PDFViewer,
    DyamicForm,
    selectPoint,
    drawFeatures
  },
  watch:{
    createDialogVisable:{
      handler(val){
        if(!val){
          this.categoryObj = {}
          this.updateObj = null;
        }
      },
      deep: true
    }
  },
  props:{
    category:{
      type: Object,
      default:{},
    }
  },
  data() {
    return {
      search: {
        category: "",
        categoryItems: [],
        categoryObj: null,
      },
      gpsPoint: {
        pos: [],
      },
      headers: [],
      data: [],
      loading: false,
      lookPosVisable: false,
      updateObj: null,
      createDialogVisable: false,
      pointVisable: false,
      categoryList: null,
      categoryObj: null,
      historyGpsList: null,
      // 总的数据
      tableData: [],
      // 分页的数据
      pageData: [],
      // 总数据量 默认为 0
      pageTotal: 0,
      // 当前页 默认是第一页
      currentPage: 1,
      // 每页大小 默认每页10条数据
      pageSize: 10,
      isHeji: false,
      EchoPoint: [],
      markerPoint: null, // 点的数据
      ObjItem:{},
      LineData: [],
      imgShow: false,
      url: null,
      pdfurl: null,
      pdfVisable: false,
      mp4Show: false,
      mp4url: null,
      lookfilevisible: false,
      lookfiledata:[],
      AllUser: [],
      BASE_HOST,
    };
  },
  methods: {
    async getFile(val){
      if(val && val.length>0){
        this.lookfiledata = await this.lookfile(val)
        this.lookfilevisible = true;
      }else{
        this.$message.warning('未找到文件信息')
      }
    },
    async lookfile(val){
      try {
        resource.getList('fileupload', { pk_in: val.join(',') })
          .then(async resp => {
            const file = [];
            for (const item of resp) {
              const newItem = {
                name: item.file_name,
                file: item.file,
              };
              newItem.create_time = this.moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
              file.push(newItem);
            }
            this.lookfiledata = file;
            this.lookfilevisible = true;
          })
          .catch(error => {
            // 错误处理
          });
      }catch (e) {
        console.error(e)
      }
    },


    // 预览文件，根据文件类型不同，做不同操作；
    Previews(res) {
      const imageRegex = /\.(jpg|jpeg|png|webp)$/i;
      const mp4Regex = /\.mp4$/i;
      // 定义文档类型的正则表达式
      const docRegex = /(\.pdf)$/i;
      // 定义其他文档
      const doc = /(\.doc|\.docx|\.xls|\.xlsx|\.txt)$/i;
      // 定义其他文件类型的正则表达式
      const othersRegex = /(\.txt|\.csv|\.xlsx)$/i;
      // 利用正则表达式判断文件类型
      if (imageRegex.test(res.name)) {
        this.url = BASE_HOST + res.file;
        this.imgShow = true;
      } else if (docRegex.test(res.name)) {
        this.pdfurl = BASE_HOST + res.file
        this.pdfVisable = true;
      } else if (doc.test(res.name) || othersRegex.test(res.name)) {
        let a = document.createElement('a');
        a.href = BASE_HOST + res.file;
        a.download = res.name;
        a.click();
      }else if(mp4Regex.test(res.file)){
        this.mp4url = BASE_HOST + res.file;
        this.mp4Show = true;
      } else {
        let a = document.createElement('a');
        a.href = BASE_HOST + res.file;
        a.download = res.name;
        a.click();
        // this.$message.error('暂不支持预览或下载');
      }
    },

    getCoordinate(val){
      if(this.ObjItem.field_01 == 'line'){
        this.LineData = val.coordinates;
      }else{
        this.LineData = val.coordinates[0];
      }
    },
    getPoint(val){
      this.markerPoint = val;
    },
    editAddress(row){
      this.ObjItem = row;
      this.pointVisable = true;
      console.log(row,'row')
    },
    async save(){
      try {
        let url;
        if(['polygon','line'].includes(this.ObjItem.field_01)){
          url = 'gps-polygon'
        }else{
          url = 'gps-point'
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
        // if(this.ObjItem.pk){
        //   if(['point','model'].includes(this.ObjItem.field_01)) {
        //     await resource.updateObj('basetree',this.ObjItem.pk,{
        //       field_01:this.markerPoint[0],
        //       field_02:this.markerPoint[1],
        //     })
        //   }
        //   if(['line','polygon'].includes(this.ObjItem.field_01)){
        //     await resource.updateObj('basetree',this.ObjItem.pk,{
        //       field_01:this.LineData
        //     })
        //   }
        // }
        if(this.form && this.form.pk){
          await resource.updateObj(url,this.form.pk,params)
        }else{
          await resource.createObj(url,params)
        }
        this.$message.success('操作成功！')
        this.pointVisable = false;
        // await this.loadData(this.ObjItem)
      }catch (e) {
        console.error(e)
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      // 初始化 sums 数组
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        let currentSum = 0;
        let max = -Infinity;
        let min = Infinity;
        let count = 0;
        let tongjileixing = null;
        for (let i = 0; i < data.length; i++) {
          let da = data[i];
          for (let j = 0; j < this.headers.length; j++) {
            let he = this.headers[j];
            let bValue = column.property && column.property.split('.').pop();
            let item;
            if (he.widget === 'number') {
              item = he;
              if (item.prop === bValue) {
                // 获取统计类型
                tongjileixing = item.tongji;
                let textValue = Number(da.text_01[bValue]);
                if (typeof textValue === 'number') {
                  // 计算总和
                  currentSum += textValue;
                  // 计算最大值
                  if (textValue > max) max = textValue;
                  // 计算最小值
                  if (textValue < min) min = textValue;
                  // 计算数量
                  count++;
                } else {
                  currentSum = '';
                  sums[index] = '';
                  break;
                }
              }
            }
          }
        }

        // 根据统计类型计算结果
        switch (tongjileixing) {
          case 'count':
            sums[index] = currentSum === 0 ? '' : currentSum;
            break;
          case 'max':
            sums[index] = max === -Infinity ? '' : max;
            break;
          case 'min':
            sums[index] = min === Infinity ? '' : min;
            break;
          case 'avg':
            sums[index] = count === 0 ? '' : Number((currentSum / count)).toFixed(2);
            break;
          default:
            sums[index] = '';
            break;
        }
      });

      return sums;
    },
    handleClick(tab) {
      this.headers = [];
      let pk = tab.name;
      let obj = this.search.categoryItems.find((i) => i.pk === pk);
      this.search.categoryObj = obj;
      this.loadData();
    },
    async loadCategory() {
      let res = await resource.getObj("basetree",this.category.pk, {
        // noroot: true,
        // biz_id: BIZ_ID,
      });
      console.log(res,'res')
      this.search.categoryItems = res;
      if (res) {
        this.search.category = res.pk;
        this.search.categoryObj = res;
        this.loadData();
      }
    },
    async loadData() {
      let row = this.search.categoryObj;
      let field = row.text_01 ? JSON.parse(row.text_01) : []
      this.loading = true;
      let tmp = [];
      if (row) {
        if (field && field.length > 0) {
          field.forEach((i) => {
            tmp.push({ label: i.col_title, prop: i.alias,widget: i.widget,tongji:i.tongjiType });
          });
        }
        let res = await resource.getList('basetree',{
          parent: this.search.categoryObj.pk,
        })
        console.log(res,'res')
        res.forEach(i=>{
          if(i.text_01){
            i.text_01 = JSON.parse(i.text_01)
          }
        })
        this.tableData = res
        this.pageTotal = res.length
        this.pageData = this.queryByPage()
      } else {
        this.data = [];
      }
      console.log(this.tableData,'123')
      let isfind = tmp.find(i=>i.widget == 'number')
      if(isfind){
        this.isHeji = true
      }else{
        this.isHeji = false;
      }
      this.headers = tmp;
      console.log(this.headers,'999')
      this.loading = false;
    },
    // 改变每页大小的回调
    handleSizeChange (val) {
      this.pageSize = val
      this.pageData = this.queryByPage()
    },
    // 改变当前页的回调
    handleCurrentChange (val) {
      this.currentPage = val
      this.pageData = this.queryByPage()
    },
    // 实现分页的方法
    queryByPage () {
      // 起始位置 = (当前页 - 1) x 每页的大小
      const start = (this.currentPage - 1) * this.pageSize
      // 结束位置 = 当前页 x 每页的大小
      const end = this.currentPage * this.pageSize
      return this.tableData.slice(start, end)
    },
    async getCategory() {
      this.categoryObj = null;
      let res = await resource.getObj("basetree", this.category.pk,{
        // noroot: true,
        // biz_id: BIZ_ID,
        // name: this.category.name
      });
      this.categoryList = res;
      if(res){
        this.categoryObj = res
      }else{
        this.categoryObj = {};
      }
      this.createDialogVisable = true;
    },
    clear() {
      this.categoryObj = null;
      this.categoryList = null;
    },
    findFields(row) {
      this.categoryObj = row;
    },
    async dymaicData(data) {
      try {
        if (data.form.pk) {
          await resource.updateObj('basetree',data.form.pk,{
            name: data.title,
            field_01: data.datas.field_01,
            field_02: data.datas.field_02,
            text_01:JSON.stringify(data.form)
          })
          this.$message.success("编辑成功!");
        } else {
          let p = {
            parent:this.search.categoryObj.pk,
            name: data.title,
            field_01: data.datas.field_01,
            field_02: data.datas.field_02,
            text_01:JSON.stringify(data.form)
          }
          await resource.createObj('basetree',p)
          // let res = await resource.createObj("data", {
          //   template_id: this.categoryObj.pk,
          //   ...data.form,
          //   biz_id: BIZ_ID.GPS_GOODS_BIZ,
          //   gps_sn: "",
          // });
          // await resource.createObj("gps-point", {
          //   ...data.form,
          //   biz_id: BIZ_ID.GPS_GOODS_BIZ,
          //   sn: res.gps_sn,
          // });
          this.$message.success("新建成功!");
        }
        this.createDialogVisable = false;
        await this.loadData();
        this.$emit('getRefresh')
      } catch (error) {
        this.$message.error("新建失败!");
      }
    },
    async edit(row) {
      let res = await resource.getObj("basetree",row.parent, {});
      if (res) {
        this.updateObj = {
          ...res,
          ...row,
          pk: row.pk,
        };
        this.categoryObj = this.search.categoryObj;
        this.createDialogVisable = true;
      }
    },
    async del(row) {
      try {
        await resource.deleteObj('basetree',row.pk,{})
        this.$message.success("删除成功!");
        await this.loadData();
        this.$emit('getRefresh')
      } catch (error) {}
    },
    async historyTrack(row) {
      if (row.gps_sn) {
        let res = await resource.getList("gps-point", {
          sn: row.gps_sn,
          o: "create_time",
        });
        this.historyGpsList = { template: this.search.categoryObj, data: res };
        this.historyVisable = true;
      }
    },
  },
  async created() {
    await this.loadCategory();
  },
};
</script>

<style scoped>
  ::v-deep .el-table__cell{
    text-align: center !important;
  }
  .fileClass{
    width: 220px;
    display: inline-block;
  }
  .filebox{
    font-size: 14px;display: block
  }
  .fileitem{
    display: flex; flex-direction: row;
  }
  .filename{
    width: 300px; display: inline-block;
  }
  .filefile{
    width: 220px;text-overflow: ellipsis;white-space: nowrap;overflow:hidden;float: left;
    color: #409EFF;
    font-size: 15px;
  }
  .filefile:hover{
    cursor: pointer;
    text-decoration: underline;
  }
</style>
