<template>
  <el-card style="position:relative">
    <el-form inline :label-position="'right'" label-width="80px">
      <el-form-item label="查找">
        <el-input clearable v-model="searchForm.search" placeholder="姓名/电话/最高学历/职务..."></el-input>
      </el-form-item>

      <el-form-item label="最高学历">
        <el-select clearable filterable v-model="searchForm.education">
          <el-option v-for="item in education_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="聘任岗位">
        <el-select clearable v-model="searchForm.zhiwu" placeholder="请选择聘任岗位（职务）">
          <el-option v-for="item in zhiwu_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="职称">
        <el-select clearable v-model="searchForm.zhicheng">
          <el-option v-for="item in zhicheng_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="民族">
        <el-select clearable filterable v-model="searchForm.nation">
          <el-option v-for="item in nation_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="政治面貌">
        <el-select clearable filterable v-model="searchForm.mianmao">
          <el-option v-for="item in mianmao_option_data" :key="item.pk" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所在科室">
        <el-select clearable filterable v-model="searchForm.department">
          <el-option v-for="item in department_option_data" :key="item.pk" :label="item.name" :value="item.pk"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="聘用方式">
        <el-radio-group v-model="searchForm.pinyongfangshi" @change="selectRadio">
          <el-radio v-for="item in pinyongfangshi_option_data" :key="item.pk" :label="item.name">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="更多搜索" name="1">
          <el-row style="text-align: center">
            <el-form inline :label-position="'right'" label-width="100px">
              <el-col :span="6">
                <el-form-item label="首次合同期限">
                  <el-input clearable v-model="searchForm.ht_end_date" placeholder="首次合同期限..."></el-input>
                  <!--              <el-date-picker-->
                  <!--                v-model="searchForm.shouci"-->
                  <!--                type="daterange"-->
                  <!--                value-format="yyyy-MM-dd"-->
                  <!--                range-separator="至"-->
                  <!--                start-placeholder="开始日期"-->
                  <!--                end-placeholder="结束日期">-->
                  <!--              </el-date-picker>-->
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="续聘期限">
                  <el-input clearable v-model="searchForm.xp_end_date" placeholder="续聘期限..."></el-input>
                  <!--              <el-date-picker-->
                  <!--                v-model="searchForm.xupin"-->
                  <!--                type="daterange"-->
                  <!--                value-format="yyyy-MM-dd"-->
                  <!--                range-separator="至"-->
                  <!--                start-placeholder="开始日期"-->
                  <!--                end-placeholder="结束日期">-->
                  <!--              </el-date-picker>-->
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="聘期">
                  <el-input clearable v-model="searchForm.pinqi" placeholder="聘期..."></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="全日制学历">
                  <el-input style="width: 100%" v-model="searchForm.fulltime_education" placeholder="全日制学历..." clearable name="fulltime_education" autocomplete="on"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>


          <!--            <el-form-item label="最高学历毕业时间">-->
          <!--              <el-date-picker-->
          <!--                v-model="searchForm.biyedate"-->
          <!--                type="daterange"-->
          <!--                value-format="yyyy-MM-dd"-->
          <!--                range-separator="至"-->
          <!--                start-placeholder="开始日期"-->
          <!--                end-placeholder="结束日期">-->
          <!--              </el-date-picker>-->
          <!--            </el-form-item>-->


        </el-collapse-item>
      </el-collapse>


    </el-form>
    <el-form inline>
      <el-form-item>
        <el-button @click="loadData" round type="primary" icon="el-icon-search">搜索</el-button>
        <el-button @click="loadAll" round type="success">全部</el-button>
        <el-button @click="loadAll" round icon="el-icon-refresh-right">刷新</el-button>
      </el-form-item>
      <el-form-item>
        <el-button round @click="formDialogVisable=true" type="warning" icon="el-icon-plus">新建</el-button>
      </el-form-item>
      <!--      <el-form-item>-->
      <!--        <el-button @click="excelDialogVisable=true" type="info" icon="el-icon-upload">数据导入</el-button>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button round @click="excelExport" type="danger" icon="el-icon-download">Excel导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-button round @click="excelFujian" type="primary" icon="el-icon-download">附件下载</el-button>
      </el-form-item>
      <el-form-item>
        <!--        <el-button round @click="excelFujian" type="primary" icon="el-icon-download">通讯录</el-button>-->
        <el-button type="primary" size="mini" round icon="el-icon-full-screen" @click="creatQrCode()">通讯录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="warning"
          @click="ShuoMingTo"
          class="fix-shuoming"
          style="top: 208px"
          round
          plain
          icon="el-icon-notebook-2"
        >使用说明
        </el-button>
      </el-form-item>

    </el-form>
    <el-table ref="myTable" :default-sort="{prop: 'bianhao', order: 'descending'}" :data="data" border stripe :cell-style="{textAlign:'center'}" :header-cell-style="{textAlign:'center'}" v-loading="loading" element-loading-text='加载中...'
              @selection-change="(data)=>batchDelData = data">
      <el-table-column type="selection" width="55" v-if="batchDelData"></el-table-column>
      <el-table-column label="编号" v-if="showColumn('bianhao')" prop="bianhao" sortable width="70px"></el-table-column>
      <el-table-column label="姓名" v-if="showColumn('name')" prop="name"></el-table-column>
      <el-table-column label="性别" v-if="showColumn('gender')" prop="gender" width="50px"></el-table-column>
      <el-table-column label="生日" v-if="showColumn('birthday')" prop="birthday" width="100px"></el-table-column>
      <el-table-column label="入职日期" v-if="showColumn('ruzhi_date')" width="100px" prop="ruzhi_date"></el-table-column>
      <el-table-column label="民族" v-if="showColumn('nation')" prop="nation">
        <template slot-scope="{row}">{{ get_nation_option_data_display(row.nation) }}</template>
      </el-table-column>
      <el-table-column label="最高学历" v-if="showColumn('education')" prop="education">
        <template slot-scope="{row}">{{ get_education_option_data_display(row.education) }}</template>
      </el-table-column>
      <el-table-column label="最高学历毕业院校" v-if="showColumn('byyx_s_2')" prop="byyx_s_2"></el-table-column>
      <el-table-column label="最高学历毕业时间" v-if="showColumn('biyedate')" prop="biyedate">
        <template slot-scope="{row}">{{ dateFormat(row.biyedate) }}</template>
      </el-table-column>
      <el-table-column label="最高学历专业" v-if="showColumn('majors')" prop="majors"></el-table-column>
      <el-table-column label="最高学历学位" v-if="showColumn('xuewei')" prop="xuewei"></el-table-column>
      <el-table-column label="全日制学历" v-if="showColumn('fulltime_education')" prop="fulltime_education" width="110px"></el-table-column>
      <el-table-column label="全日制学历毕业院校" v-if="showColumn('byyx_s_1')" prop="byyx_s_1"></el-table-column>
      <el-table-column label="全日制学历毕业时间" v-if="showColumn('qrz_date')" prop="qrz_date" width="110px">
        <template slot-scope="{row}">{{ dateFormat(row.qrz_date) }}</template>
      </el-table-column>
      <el-table-column label="全日制学历专业" v-if="showColumn('qrz_zhuanye')" prop="qrz_zhuanye" width="110px"></el-table-column>
      <el-table-column label="职称" v-if="showColumn('zhicheng')" prop="zhicheng">
        <template slot-scope="{row}">{{ get_zhicheng_option_data_display(row.zhicheng) }}</template>
      </el-table-column>
      <el-table-column label="职称取得时间" v-if="showColumn('zc_date')" prop="zc_date">
        <template slot-scope="{row}">{{ dateFormat(row.zc_date) }}</template>
      </el-table-column>
      <el-table-column label="聘任岗位（职务）" v-if="showColumn('zhiwu')" prop="zhiwu">
        <template slot-scope="{row}">{{ get_zhiwu_option_data_display(row.zhiwu) }}</template>
      </el-table-column>
      <el-table-column label="职务取得时间" v-if="showColumn('zw_date')" prop="zw_date">
        <template slot-scope="{row}">{{ dateFormat(row.zw_date) }}</template>
      </el-table-column>
      <el-table-column label="所在科室" v-if="showColumn('department')" prop="department">
        <template slot-scope="{row}">{{ get_department_option_data_display(row.department) }}</template>
      </el-table-column>
      <el-table-column label="行政职务" v-if="showColumn('xingzhengzhiwu')" prop="xingzhengzhiwu">
        <template slot-scope="{row}">{{ row.xingzhengzhiwu }}</template>
      </el-table-column>
      <el-table-column label="行政职称取得时间" v-if="showColumn('xzzw_date')" prop="xzzw_date">
        <template slot-scope="{row}">{{ dateFormat(row.xzzw_date) }}</template>
      </el-table-column>
      <el-table-column label="实配职数" v-if="showColumn('shipeizhishu')" prop="shipeizhishu">
        <template slot-scope="{row}">{{ row.shipeizhishu }}</template>
      </el-table-column>
      <el-table-column label="身份证号码" v-if="showColumn('id_card')" width="143px" prop="id_card"></el-table-column>


      <el-table-column label="聘用方式" v-if="showColumn('pinyongfangshi')" prop="pinyongfangshi">
        <template slot-scope="{row}">{{ get_pinyongfangshi_option_data_display(row.pinyongfangshi) }}</template>
      </el-table-column>
      <el-table-column label="年龄" v-if="showColumn('nianling')" width="50px" prop="nianling"></el-table-column>

      <el-table-column label="婚姻状况" v-if="showColumn('marital_status')" prop="marital_status">
        <template slot-scope="{row}">{{ row.marital_status }}</template>
      </el-table-column>
      <el-table-column label="政治面貌" v-if="showColumn('mianmao')" prop="mianmao">
        <template slot-scope="{row}">{{ row.mianmao }}</template>
      </el-table-column>
      <el-table-column label="入党时间" v-if="showColumn('rudang_date')" prop="rudang_date">
        <template slot-scope="{row}">{{ dateFormat(row.rudang_date) }}</template>
      </el-table-column>
      <!--      <el-table-column label="所属党派" v-if="showColumn('dangpai')" prop="dangpai">-->
      <!--        <template slot-scope="{row}">{{ get_dangpai_option_data_display(row.dangpai) }}</template>-->
      <!--      </el-table-column>-->
      <el-table-column label="电话" v-if="showColumn('phone')" prop="phone" width="100px"></el-table-column>


      <el-table-column label="全日制学历学位" v-if="showColumn('qrz_xuewei')" prop="qrz_xuewei"></el-table-column>

      <el-table-column label="首次合同期限" v-if="showColumn('shouci')" prop="shouci">
        <template slot-scope="{row}">{{ dateFormat(row.shouci) }} 至 {{ dateFormat(row.ht_end_date) }}</template>
      </el-table-column>
      <el-table-column label="续聘期限" v-if="showColumn('xupin')" prop="xupin">
        <template slot-scope="{row}">{{ dateFormat(row.xupin) }} 至 {{ dateFormat(row.xp_end_date) }}</template>
      </el-table-column>
      <el-table-column label="聘期" v-if="showColumn('pinqi')" prop="pinqi">
        <template slot-scope="{row}">{{ row.pinqi }}</template>
      </el-table-column>
      <el-table-column label="是否在职" v-if="showColumn('zaizhi')" width="100px" prop="zaizhi">
        <template slot-scope="{row}">{{ get_zaizhi_option_data_display(row.zaizhi) }}</template>
      </el-table-column>

      <el-table-column label="现居地址" v-if="showColumn('address')" prop="address"></el-table-column>

      <el-table-column label="备注" v-if="showColumn('beizhu')" prop="beizhu"></el-table-column>
      <el-table-column label="照片" v-if="showColumn('photo')" prop="photo">
        <template slot-scope="{ row }">
          <div style="display: flex;justify-content: center;align-items: center">
            <img v-if="row.photo" :src="JSON.parse(row.photo).file" width="80px" height="100px" @click="showphoto(row.photo)">
          </div>
        </template>
      </el-table-column>
      <!--      <el-table-column label="附件" v-if="showColumn('fujian')" prop="fujian">-->
      <!--        <template slot-scope="{ row }">-->
      <!--          <a class="el-link el-link&#45;&#45;primary is-underline" target="_blank" :download="row.fujian"-->
      <!--             :href="row.fujian" type="primary">-->
      <!--            <span class="el-link&#45;&#45;inner">-->
      <!--              {{ isImg(row.fujian) ? '预览/下载' : '' }}</span>-->
      <!--          </a>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column label="操作" width="150px" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-popover width="180" popper-class="tablePopover" trigger="manual" ref="tablePopover" v-model="popoverVisible" @show="showPopover">
            <span slot="reference" @click="openPopover" style="cursor: pointer">操作<i class="el-icon-arrow-down" style="font-weight: bold;"/></span>
            <div class="popoverCheckBoxArea">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 10px 0;"></div>
              <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
                <el-checkbox v-for="column in columns" :label="column.value" :key="column.value">{{ column.text }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="popoverCheckBoxButton">
              <el-button size="mini" @click="cancelPopover">取消</el-button>
              <el-button type="primary" size="mini" @click="confirmPopover">确定</el-button>
            </div>
          </el-popover>
        </template>
        <template slot-scope="{row}">
          <el-button title="查看" circle type="success" icon="el-icon-view" @click="viewTable(row)"/>
          <el-button title="编辑" circle type="primary" icon="el-icon-edit" @click="editTable(row)"/>
          <el-popconfirm style="margin-left:10px" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="删除后不可恢复，确定删除吗？" @confirm="delTable(row)">
            <el-button slot="reference" title="删除" circle type="danger" icon="el-icon-remove"/>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="loadData" @current-change="loadData" :current-page.sync="page" :page-sizes="[10, 50, 100, 200]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <div class="batchClass">
      <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确定批量删除吗" @confirm="batchDelDataFn">
        <el-button icon="el-icon-delete" type="danger" slot="reference">批量删除</el-button>
      </el-popconfirm>
    </div>
    <el-dialog :title="form.pk?'编辑':'新建'" :visible.sync="formDialogVisable" width="70%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close @close="clearForm">
      <Form v-model="form" ref="FormComp" @checked="submitForm"/>
      <div slot="footer">
        <el-button @click="formDialogVisable=false" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="$refs.FormComp.submit()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看" :visible.sync="LookformDialogVisable" width="85%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close @close="clearForm">
      <Detail v-if="LookformDialogVisable" v-model="form" ref="FormComp"/>
      <div slot="footer">
        <el-button @click="LookformDialogVisable=false" icon="el-icon-close">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Excel导入" :visible.sync="excelDialogVisable" width="95%" :close-on-click-modal="false" :close-on-press-escape="false" top="3vh" center destroy-on-close>
      <ImportData @loadData="loadData" @close="excelDialogVisable=false"/>
    </el-dialog>
    <el-dialog
      title="照片"
      :visible.sync="dialogVisiblePhoto"
      width="18%"
    >
      <img :src="photo" ref="print" width="300" height="400">
      <span slot="footer">
        <el-button type="primary" @click="printDocument">打印</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选中的数据"
      :visible.sync="dialogVisibleFujian"
      width="30%"
      @close="Cancel"
    >
      <div style="margin-bottom: 10px">
        <el-checkbox :indeterminate="isIndeterminatetype" v-model="checkAlltype" @change="handleCheckAlltype">全选</el-checkbox>
        <el-checkbox-group v-model="checkType" @change="handleCheckedtype">
          <el-checkbox v-for="(item,index) in typeinfo" :label="item" :key="index">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <!--       显示选中的数据-->
      <div v-for="(item,index) in batchDelData" :key="index">
        <span style="margin-right: 15px">姓名: {{ item.name }}</span>
        <span>附件类型: {{ ISFujian(item.fujian) }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Cancel">取 消</el-button>
        <el-button type="primary" @click="daochu">导 出</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="二维码"
      :visible.sync="viewQR"
      @before-close="closeQR"
      width="20%"
    >
      <!--   替换dialog中title   -->
      <span slot="title">
        {{ form.title }}
      </span>

      <!--      <qr-code v-if="viewQR" :url="url"  style="margin: auto "></qr-code>-->
      <Qr v-if="viewQR" :url="url" style="margin: auto "></Qr>
      <div class="tips" style="text-align: center">点击二维码保存图片</div>
      <div class="tips" style="text-align: center">{{url}}</div>
    </el-dialog>
  </el-card>
</template>
<script>
//
// TEMPLATE_ID: FT336781955202547712
// 字段说明:
// bianhao:编号
// pinyongfangshi:聘用方式
// name:姓名
// gender:性别
// birthday:生日
// nianling:年龄
// id_card:身份证号码
// nation:民族
// mianmao:政治面貌
// phone:电话
// education:最高学历
// majors:最高学历专业
// biyedate:最高学历毕业时间
// fulltime_education:全日制学历
// qrz_zhuanye:全日制学历专业
// qrz_date:全日制学历毕业时间
// ruzhi_date:入职日期
// department:所在部门
// shouci:首次合同期限
// ht_end_date:合同结束时间
// xupin:续聘期限
// xp_end_date:续聘结束时间
// pinqi:聘期
// zaizhi:是否在职
// zhicheng:职称
// zhiwu:聘任岗位（职务）
// zc_date:职称取得时间
// zw_date:聘岗取得时间
// address:现居地址
// photo:照片
// fujian:附件
// user_id:用户id
// beizhu:备注
// gengxindate:年龄更新日期
// xuewei:最高学历学位
// byyx_s_1:毕业院校
// byyx_s_2:最高学历毕业院校
// marital_status:婚姻状况
// xingzhengzhiwu:行政职务
// xzzw_date:行政职务任职时间
// shipeizhishu:实配职数
// dangpai:所属党派

import Form from "./Form.vue"
import Detail from "@/components/page/Renliguanli/yuangongsystem/Detail.vue";
import ImportData from "./ImportData.vue"
import XLSX from "xlsx";
import axios from 'axios'
import resource, {getList, createObj, getObj, updateObj, deleteObj, getObjFromList, patchObj} from "@/resource";
import {on} from "element-ui";

const TEMPLATE_ID = "FT336781955202547712";
import {mapState} from "vuex";
import Qr from "@/components/common/QR.vue";

const FORM = {
  bianhao: null,
  pinyongfangshi: "在编",
  name: null,
  gender: null,
  birthday: null,
  nianling: null,
  id_card: null,
  nation: null,
  mianmao: null,
  phone: null,
  education: null,
  majors: null,
  biyedate: null,
  fulltime_education: null,
  qrz_zhuanye: null,
  qrz_date: null,
  ruzhi_date: null,
  department: null,
  shouci: null,
  ht_end_date: null,
  xupin: null,
  xp_end_date: null,
  pinqi: null,
  zaizhi: null,
  zhicheng: null,
  zhiwu: null,
  zc_date: null,
  zw_date: null,
  address: null,
  photo: null,
  fujian: [],
  user_id: null,
  beizhu: null,
  gengxindate: null,
  xuewei: null,
  byyx_s_1: null,
  byyx_s_2: null,
  marital_status: null,
  xingzhengzhiwu: null,
  xzzw_date: null,
  shipeizhishu: null,
  dangpai: null,
  qrz_xuewei: null,
  rudang_date: null,
  yn_zw: null,
  yn_zw_date: null,
  template_id: TEMPLATE_ID,
};

export default {
  name: "",
  data() {
    return {
      checkAlltype: false,
      isIndeterminatetype: true,
      checkType: [], // 选中的附件类型
      typeinfo: null,// 附件类型信息
      dialogVisibleFujian: false, // 导出附件的弹窗
      form: {
        ...FORM
      },
      LookformDialogVisable: false, // 查看
      popoverVisible: false,
      checkAll: false,
      isIndeterminate: false,
      columns: [],
      checkedColumns: [],
      activeNames: ['0'],
      searchForm: {
        name: null,
        education: null,
        department: null,
        zhicheng: null,
        pinyongfangshi: null,
        zhiwu: null,
        nation: null,
        mianmao: null,
        search: null,
        shouci: null,
        xupin: null,
        pinqi: null,
        fulltime_education: null,
        biyedate: null,
        ht_end_date: null,
        xp_end_date: null,
      },
      dialogVisiblePhoto: false, // 照片预览
      photo: '',
      pinyongfangshi_option_data: [],
      nation_option_data: [],
      mianmao_option_data: [],
      education_option_data: [],
      department_option_data: [],
      zaizhi_option_data: [],
      zhicheng_option_data: [],
      zhiwu_option_data: [],
      marital_status_option_data: [],
      xingzhengzhiwu_option_data: [],
      shipeizhishu_option_data: [],
      dangpai_option_data: [],

      data: [],
      batchDelData: [],
      loading: false,
      formDialogVisable: false,
      excelDialogVisable: false,
      page: 1,
      pageSize: 10,
      total: 0,
      viewQR: false
    }
  },
  mounted() {
    this.addnianling();
  },
  methods: {
    // 二维码生成
    async creatQrCode() {
      this.viewQR = true;
      // this.url = window.location.origin + "/uniapp/articleinfo?pk=" + pk;
      this.url = `${window.location.origin}/uniapp#/?sys_id=${this.$store.state.sys_id}&org_id=${this.userinfo.org_id}`;
    },
    closeQR() {
      this.qrcode.clear();
    },
    ShuoMingTo() {
      this.$router.push({name: "renli-shuoming"});
    },
    selectRadio(val) {
      this.searchForm.pinyongfangshi = val;
      this.loadData();
    },
    Cancel() {
      this.dialogVisibleFujian = false;
      //导出之后,清空页面上的选中项
      this.batchDelData = [];
      this.$refs.myTable.clearSelection(); // 取消选中状态
    },
    handleCheckedtype(value) {
      let checkedCount = value.length;
      this.checkAlltype = checkedCount === this.typeinfo.length;
      this.isIndeterminatetype = checkedCount > 0 && checkedCount < this.typeinfo.length;
    },
    daochu() {
      console.log('1')
      // 点击导出时,根据选中的附件类型 然后把对应的附件 下载下来,不改变原来的数据
      this.checkType.forEach(type => {
        // 遍历 batchDelData 数组，找到附件类型匹配的项
        this.batchDelData.forEach(async item => {
          try {
            const val = JSON.parse(item.fujian);
            if (Array.isArray(val)) {
              for (const item2 of val) {
                if (item2.category === type.pk) {
                  const fileUrl = item2.file;
                  // 执行文件下载操作
                  try {
                    const response = await axios.get(fileUrl, {responseType: 'blob'});
                    const blob = response.data;
                    const url = window.URL.createObjectURL(blob);
                    const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = "附件导出"; // 文件名可以根据实际情况进行设置
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(link);
                  } catch (error) {
                    console.error('Failed to download file:', error);
                    // 处理下载失败的情况
                  }
                }
              }
            }
          } catch (e) {
            return [];
          }

        });
      });
      // 关闭弹框 清空选中的附件类型
      this.dialogVisibleFujian = false;
      this.checkType = [];
      //导出之后,清空页面上的选中项
      this.batchDelData = [];
      this.$refs.myTable.clearSelection(); // 取消选中状态
    },

    handleCheckAlltype(val) {
      this.checkType = val ? this.typeinfo : [];
      this.isIndeterminatetype = false;
    },
    ISFujian(va) {
      if (typeof va === 'string') {
        try {
          const parsedData = JSON.parse(va);
          if (Array.isArray(parsedData)) {
            parsedData.forEach(item => {
              this.typeinfo.forEach(item2 => {
                if (item2.pk === item.category) {
                  item.categoryname = item2.name;
                }
              });
              item = {categoryname: item.categoryname};
            });
            return parsedData.map(item => item.categoryname).join(', ');
          } else {
            return [parsedData];
          }
        } catch (error) {
          return [];
        }
      } else {
        return va;
      }

    },
    excelFujian() {
      if (this.batchDelData.length === 0) {
        return this.$message.warning("请选择要导出附件的数据!");
      }
      console.log(this.batchDelData)
      // 选中要导出附近的数据 打开一个dialog框
      this.dialogVisibleFujian = true;
    },
    async getType() {
      let category = await getList(`flatbasetree`, {name: "人力-附件类型"});
      let pk;
      if (category.length > 0) {
        pk = category[0].pk;
      } else {
        let resp = await createObj('flatbasetree', {name: "人力-附件类型"});
        pk = resp.pk;
      }
      this.typeinfo = await getList('flatbasetree', {parent: pk});
    },
    async getColums() {
      let data = await getObj('formtemplate', TEMPLATE_ID)
      let columns = [];
      let datafiled = data.field;
      datafiled.forEach((item, index) => {
        columns.push({
          text: item.col_title,
          value: item.alias,
          show: true,
          index: index + 1
        })
      })
      // 判断是否有缓存
      let cacheColumns = localStorage.getItem(this.userinfo.pk + TEMPLATE_ID);
      if (!cacheColumns) {
        // 如果没有缓存，则将初始列数据存入缓存
        localStorage.setItem(this.userinfo.pk + TEMPLATE_ID, JSON.stringify(columns))
      } else {
        // 如果有缓存，则使用缓存的列数据
        // columns = JSON.parse(cacheColumns)
        // 先判断当前字段与缓存的字段是否相等,如果不等则用最新的数据
        let cacheColumnsArr = JSON.parse(cacheColumns);
        if (cacheColumnsArr.length !== columns.length) {
          localStorage.setItem(this.userinfo.pk + TEMPLATE_ID, JSON.stringify(columns))
        } else {
          // 如果相等，则使用缓存的数据
          columns = cacheColumnsArr;
        }
      }
      // 初始化选中列数据
      this.columns = columns;
    },
    // 点击“操作”打开菜单选择框
    openPopover() {
      this.popoverVisible = true;
      // 去掉第二个popover弹框（修改问题：使用fixed固定列后popover会出现两个）
      this.$nextTick(() => {
        document.getElementsByClassName('tablePopover')[1].style.display = 'none';
      });
    },
    // 点击弹出框的“全选”按钮
    handleCheckAllChange(val) {
      this.checkedColumns = val ? this.columns.map(item => item.value) : [];
      this.isIndeterminate = false;
    },
    // 点击弹出框的选择展示菜单的复选框
    handleCheckedColumnsChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.columns.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length;
    },
    // 点击弹出框的“取消”按钮
    cancelPopover() {
      this.popoverVisible = false;
    },
    // 确认操作
    confirmPopover() {
      // 更新列数据的show字段并存入缓存
      // if (this.checkedColumns.length < 5) {
      //   this.$message({
      //     message: '请至少选择5个表格字段',
      //     center: true,
      //     customClass: 'message-error'
      //   });
      //   return;
      // }

      // 更新列数据的show字段并存入缓存
      this.columns.forEach(item => {
        item.show = this.checkedColumns.includes(item.value);
      });
      localStorage.setItem(this.userinfo.pk + TEMPLATE_ID, JSON.stringify(this.columns));
      this.popoverVisible = false;
    },
    // 判断当前列是否显示
    showColumn(currentColumn) {
      const column = this.columns.find(item => item.value === currentColumn);
      return column ? column.show : false;
    },
    // 显示弹出框时，初始化选中列数据
    showPopover() {
      if (this.checkedColumns.length === this.columns.length) {
        // 如果选中的列数量等于总列数，则将全选按钮置为选中状态
        this.checkAll = true;
        this.isIndeterminate = false;
      }
      this.checkedColumns = this.columns.filter(item => item.show).map(item => item.value);
    },
    async addnianling() {
      let params = {
        template_id: TEMPLATE_ID
      }
      let resp = await getList("data", params);
      for (const item of resp) {
        if (item.gengxindate) {
          let year = Number(this.moment(item.gengxindate).format('YYYY'));
          let nowyear = new Date().getFullYear();
          // 如果更新时间不是今年，就更新年龄
          if (year != nowyear) {
            // 计算年龄
            let nianling = this.moment().diff(item.birthday, 'years');
            // 更新时间
            let gengxindate = this.moment().format('YYYY-MM-DD');
            await patchObj("data", item.pk, {nianling: nianling, gengxindate: gengxindate, template_id: item.template_id});
          }
        } else {
          let nianling = this.moment().diff(item.birthday, 'years');
          let gengxindate = this.moment().format('YYYY-MM-DD');
          await patchObj("data", item.pk, {nianling: nianling, gengxindate: gengxindate, template_id: item.template_id});
        }
      }

      this.loadData();
    },
    dateFormat(time) {
      if (!time) {
        return ""
      }
      let date = new Date(time);
      let year = date.getFullYear();
      // 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
      let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      // return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
      return year + "-" + month + "-" + day;
    },
    showphoto(row) {
      this.dialogVisiblePhoto = true;
      this.photo = JSON.parse(row).file;
    },
    // 打印图片
    printDocument() {
      this.$print(this.$refs.print)
    },
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        template_id: TEMPLATE_ID,
      }
      if (this.searchForm.search) {
        params["search"] = this.searchForm.search
      }
      if (this.searchForm.pinyongfangshi) {
        params["pinyongfangshi"] = this.searchForm.pinyongfangshi
      }
      if (this.searchForm.name) {
        params["name"] = this.searchForm.name
      }
      if (this.searchForm.education) {
        params["education"] = this.searchForm.education
      }
      if (this.searchForm.department) {
        params["department"] = this.searchForm.department
      }
      if (this.searchForm.zhicheng) {
        params["zhicheng"] = this.searchForm.zhicheng
      }
      if (this.searchForm.zhiwu) {
        params["zhiwu"] = this.searchForm.zhiwu
      }
      if (this.searchForm.nation) {
        params["nation"] = this.searchForm.nation
      }
      if (this.searchForm.fulltime_education) {
        params["fulltime_education"] = this.searchForm.fulltime_education
      }
      if (this.searchForm.mianmao) {
        params["mianmao"] = this.searchForm.mianmao
      }

      if (this.searchForm.shouci) {
        params.shouci_after = this.searchForm.shouci[0];
        params.shouci_before = this.searchForm.shouci[1];
      }

      if (this.searchForm.ht_end_date) {
        params["ht_end_date_like"] = this.searchForm.ht_end_date
      }
      if (this.searchForm.xupin) {
        params.xupin_after = this.searchForm.xupin[0];
        params.xupin_before = this.searchForm.xupin[1];
      }
      if (this.searchForm.xp_end_date) {
        params["xp_end_date_like"] = this.searchForm.xp_end_date
      }

      if (this.searchForm.biyedate) {
        params.biyedate_after = this.searchForm.biyedate[0];
        params.biyedate_before = this.searchForm.biyedate[1];
      }
      if (this.searchForm.xupin) {
        params.xupin_after = this.searchForm.xupin[0];
        params.xupin_before = this.searchForm.xupin[1];
      }
      if (this.searchForm.pinqi) {
        params["pinqi_like"] = this.searchForm.pinqi
      }
      let res = await getList("data", params);
      this.data = res.data;
      this.total = res.count;
      this.loading = false;
    },
    // 判断文件类型
    isImg(file) {
      if (!file) return;
      const pdf = file.substr(file.lastIndexOf('.') + 1) === 'pdf'
      const jpg = file.substr(file.lastIndexOf('.') + 1) === 'jpg'
      const jpeg = file.substr(file.lastIndexOf('.') + 1) === 'jpeg'
      const png = file.substr(file.lastIndexOf('.') + 1) === 'png'
      if (pdf || jpeg || jpg || png) {
        return true
      } else {
        return false
      }
    },
    loadAll() {
      this.page = 1;
      this.searchForm = {
        name: null,
        gender: null,
        education: null,
        department: null,
        zhicheng: null,
        zhiwu: null,
        nation: null,
        mianmao: null,

      };
      this.loadData();
    },
    async submitForm() {
      let form = {...this.form};
      for (const key in form) {
        if (form[key] !== null && typeof form[key] === "object") {
          form[key] = JSON.stringify(form[key]);
        }
      }
      try {
        if (form.zhicheng == '无') {
          form.zc_date = null;
        }
        if (form.pk) {
          await updateObj("data", form.pk, {
            ...form,
            template_id: TEMPLATE_ID
          });
          this.$message.success("编辑成功!")
        } else {
          await createObj("data", {
            ...form,
            template_id: TEMPLATE_ID
          });
          this.$message.success("新建成功!")
        }
        this.formDialogVisable = false;
        this.loadData()
      } catch (error) {

      }
    },
    editTable(row) {
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string' && row[key].startsWith('[') && row[key].endsWith(']')) {
          row[key] = JSON.parse(row[key]);
        }
      }

      if (typeof row.fujian === 'string') {
        row.fujian = [];
      }
      // console.log(this.form);
      // return;
      this.form = {
        ...row
      };
      this.formDialogVisable = true
    },
    viewTable(row) {
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string' && row[key].startsWith('[') && row[key].endsWith(']')) {
          row[key] = JSON.parse(row[key]);
        }
      }
      if (typeof row.fujian === 'string') {
        row.fujian = [];
      }

      this.form = {...row};
      this.LookformDialogVisable = true
    },
    async delTable(row) {
      try {
        // await resource.deleteObj("data", row.pk, {
        //   template_id: 'FT336781955202547712',
        //   sys_id: this.$store.state.sys_id
        // })
        await resource.deleteObj("data", row.pk, row.sys_id, row.template_id)
        this.$message.success("删除成功!")
        await this.loadData()
      } catch (err) {
        this.$message.error("删除失败!")
      }
    },
    async excelExport() {
      // let header = [
      //   "编号",
      //   "姓名",
      //   "性别",
      //   "生日",
      //   "入职日期",
      //   "民族",
      //   "所在部门",
      //   "最高学历",
      //   "最高学历毕业院校",
      //   "最高学历毕业时间",
      //   "最高学历专业",
      //   "学位",
      //   "全日制学历",
      //   "毕业院校",
      //   "全日制毕业时间",
      //   "全日制学历专业",
      //   "全日制学历学位",
      //   "职称",
      //   "职称取得时间",
      //   "聘任岗位（职务）",
      //   "聘岗取得时间",
      //   "院内职务",
      //   "院内职务获取时间",
      //   "行政职务",
      //   "行政职务任职时间",
      //   "实配职数",
      //   "身份证号码",
      //   "聘用方式",
      //   "年龄",
      //   "婚姻状况",
      //   "政治面貌",
      //   "入党时间",
      //   "电话",
      //   "首次合同期限",
      //   "合同结束时间",
      //   "聘期",
      //   "续聘期限",
      //   "续聘结束时间",
      //   "是否在职",
      //   "现居地址",
      //   "备注",
      //   "照片",
      //   "附件",
      // ]
      let header = []
      this.columns.forEach(item => {
        if (item.show == true) {
          header.push(item.text);
          this.excelDownloadTranslate[item.value] = item.text;
        }
      })
      let tmp = [];
      this.data.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)) {
            if (key == 'department') {
              obj[this.excelDownloadTranslate[key]] = this.get_department_option_data_display(i[key]);
            } else {
              obj[this.excelDownloadTranslate[key]] = i[key];
            }
          }
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, {header});
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "员工列表.xlsx");
    },
    clearForm() {
      this.form = {
        ...FORM
      }
      this.$refs.FormComp.$refs.form.resetFields();
    },
    async batchDelDataFn() {
      if (this.batchDelData.length === 0) {
        return this.$message.error("请选择要删除的数据!");
      }
      try {
        let pk_list = this.batchDelData.map((i) => i.pk); //data-delete
        await createObj("data-delete", {
          template_id: TEMPLATE_ID,
          querys: {pk: pk_list.join(",")},
        });
        this.$message.success("批量删除成功!");
        this.loadData();
      } catch (error) {
      }
    },

    get_education_option_data_display(value) {
      let option = this.education_option_data.filter((item) => {
        return item.name === value;
      });
      return option.length > 0 ? option[0].name : value;
    },

    get_zhicheng_option_data_display(value) {
      let option = this.zhicheng_option_data.filter((item) => {
        return item.name === value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    get_pinyongfangshi_option_data_display(value) {
      let option = this.pinyongfangshi_option_data.filter((item) => {
        return item.name === value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    get_zhiwu_option_data_display(value) {
      let option = this.zhiwu_option_data.filter((item) => {
        return item.name === value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    get_zaizhi_option_data_display(value) {
      let option = this.zaizhi_option_data.filter((item) => {
        return item.name === value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    get_nation_option_data_display(value) {
      let option = this.nation_option_data.filter((item) => {
        return item.name === value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    get_mianmao_option_data_display(value) {
      let option = this.mianmao_option_data.filter((item) => {
        return item.name === value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    get_department_option_data_display(value) {
      let option = this.department_option_data.filter((item) => {
        return item.pk === value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    get_dangpai_option_data_display(value) {
      let option = this.dangpai_option_data.filter((item) => {
        return item.name === value;
      });
      return option.length > 0 ? option[0].name : value;
    },
    async getLocalDataSource() {
      let pinyong = await getObjFromList("basetree", {"name": "人力-聘用方式", isroot: true, org_id: this.userinfo.org_id});
      this.pinyongfangshi_option_data = pinyong.items;
      let nation = await getObjFromList("basetree", {"name": "人力-民族字段", isroot: true, org_id: this.userinfo.org_id});
      this.nation_option_data = nation.items;
      // let mianmao = await getObjFromList("basetree", {"name": "人力-政治面貌",isroot:true,org_id:this.userinfo.org_id});
      // this.mianmao_option_data = mianmao.items;
      let education = await getObjFromList("basetree", {"name": "人力-最高学历字段", isroot: true, org_id: this.userinfo.org_id});
      this.education_option_data = education.items;
      this.department_option_data = await getList("flatdepartment", {});
      this.zaizhi_option_data = await getList("parameters", {"category": "是否"});
      //
      let zhicheng = await getObjFromList("basetree", {"name": "人力-职称字段", isroot: true, org_id: this.userinfo.org_id});
      this.zhicheng_option_data = zhicheng.items;
      let zhiwu = await getObjFromList("basetree", {"name": "人力-职务字段", org_id: this.userinfo.org_id});
      this.zhiwu_option_data = zhiwu.items;
      let marital = await getObjFromList("basetree", {"name": "人力-婚姻状况", isroot: true, org_id: this.userinfo.org_id});
      this.marital_status_option_data = marital.items;
      let xingzhengzhiwu = await getObjFromList("basetree", {"name": "人力-行政职务", isroot: true, org_id: this.userinfo.org_id});
      this.xingzhengzhiwu_option_data = xingzhengzhiwu.items;
      let shipeizhishu = await getObjFromList("basetree", {"name": "人力-实配职数", isroot: true, org_id: this.userinfo.org_id});
      this.shipeizhishu_option_data = shipeizhishu.items;
      let mianmao = await getObjFromList("basetree", {"name": "人力-所属党派", isroot: true, org_id: this.userinfo.org_id});
      this.mianmao_option_data = mianmao.items;
    },

  },
  created() {
    this.getColums();
    this.loadData();
    this.getType();
    this.getLocalDataSource()
  },
  computed: {
    ...mapState(['org_id', 'userinfo']),
    excelDownloadTranslate() {
      return {
        // "bianhao": "编号",
        // "name": "姓名",
        // "gender": "性别",
        // "birthday": "生日",
        // "ruzhi_date": "入职日期",
        // "nation": "民族",
        // "department": "所在部门",
        // "education": "最高学历",
        // "byyx_s_2": "最高学历毕业院校",
        // "biyedate": "最高学历毕业时间",
        // "majors": "最高学历专业",
        // "xuewei": "学位",
        // "fulltime_education": "全日制学历",
        // "byyx_s_1": "毕业院校",
        // "qrz_date": "全日制毕业时间",
        // "qrz_zhuanye": "全日制学历专业",
        // "qrz_xuewei": "全日制学历学位",
        // "zhicheng": "职称",
        // "zc_date": "职称取得时间",
        // "zhiwu": "聘任岗位（职务）",
        // "zw_date": "聘岗取得时间",
        // "yn_zw": "院内职务",
        // "yn_zw_date": "院内职务获取时间",
        // "xingzhengzhiwu": "行政职务",
        // "xzzw_date": "行政职务任职时间",
        // "shipeizhishu": "实配职数",
        // "id_card": "身份证号码",
        // "pinyongfangshi": "聘用方式",
        // "nianling": "年龄",
        // "marital_status": "婚姻状况",
        // "mianmao": "政治面貌",
        // "rudang_date": "入党时间",
        // "phone": "电话",
        // "shouci": "首次合同期限",
        // "ht_end_date": "合同结束时间",
        // "pinqi": "聘期",
        // "xupin": "续聘期限",
        // "xp_end_date": "续聘结束时间",
        // "zaizhi": "是否在职",
        // "address": "现居地址",
        // "beizhu": "备注",
        // "photo": "照片",
        // "fujian": "附件",


      }
    }
  },
  components: {
    Qr,
    Detail,
    Form,
    ImportData
  }
}
</script>
<style scoped>
.batchClass {
  position: absolute;
  right: 20px;
  bottom: 17px;
}

.popoverCheckBoxArea {
  padding: 10px 20px 0 20px;
  margin-bottom: 10px;
  max-height: 650px;
  overflow-y: auto;
  overflow-x: hidden;
}

.popoverCheckBoxButton {
  text-align: center;
  padding-bottom: 10px;
}
</style>
