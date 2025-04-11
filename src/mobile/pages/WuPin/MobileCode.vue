<template>
  <div v-loading="loading">
    <van-nav-bar title="物品申请" fixed placeholder />
    <van-search v-model="search" placeholder="请输入物品名称搜索"  clearable show-action @input="filter" />
    <div style="padding-bottom:60px;">
      <div v-if="isShow">
        <van-cell v-for="i in item_list" :key="i.pk" :label="i.size" :value="i.number" is-link center @click="openForm(i)">
          <template #title>
            <span class="custom-title">{{ i.name }}</span>
          </template>
        </van-cell>
      </div>
      <div v-if="!isShow">
        <van-collapse v-for="i in Tree" :key="i.pk" v-model="activeNames" >
          <van-collapse-item :name="i.pk" :title="i.name">
            <div v-if="i.children && i.children.length>0">
              <van-cell v-for="chi in i.children" :key="chi.pk"  :value="chi.number"  center @click="openForm(chi)">
                <template #title>
                  <span class="custom-title hidd">{{chi.name}}</span>
                </template>
              </van-cell>
            </div>
            <!-- 判断是否有子集，如果有则递归渲染 -->
            <div v-if="i.items && i.items.length > 0">
              <van-collapse v-for="i in filteredChildren(i.items)" :key="i.pk" v-model="activeNames" :border="false" >
                <van-collapse-item :name="i.pk" :title="i.name">
                  <div v-if="i.children && i.children.length>0">
                    <van-cell v-for="chi in i.children" :key="chi.pk"  :value="chi.number"  center @click="openForm(chi)">
                      <template #title>
                        <span class="custom-title hidd">{{chi.name}}</span>
                      </template>
                    </van-cell>
                  </div>
                  <!-- 判断是否有子集，如果有则递归渲染 -->
                  <div v-if="i.items && i.items.length > 0">
                    <van-collapse v-for="i in filteredChildren(i.items)" :key="i.pk" v-model="activeNames"  :border="false" >
                      <van-collapse-item :name="i.pk" :title="i.name" >
                        <div v-if="i.children && i.children.length>0">
                          <van-cell v-for="chi in i.children" :key="chi.pk"  :value="chi.number"  center @click="openForm(chi)">
                            <template #title >
                              <span class="hidd">{{chi.name}}</span>
                            </template>
                          </van-cell>
                        </div>
                        <div v-if="i.items && i.items.length > 0">
                          <van-collapse v-for="i in filteredChildren(i.items)" :key="i.pk" v-model="activeNames"  :border="false" >
                            <van-collapse-item :name="i.pk" :title="i.name" >
                              <div v-if="i.children && i.children.length>0">
                                <van-cell v-for="chi in i.children" :key="chi.pk"   :value="chi.number"  center @click="openForm(chi)">
                                  <template #title>
                                    <span class="custom-title hidd">{{chi.name}}</span>
                                  </template>
                                </van-cell>
                              </div>
                              <div v-if="i.items && i.items.length > 0">
                                <van-collapse v-for="i in filteredChildren(i.items)" :key="i.pk" v-model="activeNames"  :border="false" >
                                  <van-collapse-item :name="i.pk" :title="i.name" >
                                    <div v-if="i.children && i.children.length>0">
                                      <van-cell v-for="chi in i.children" :key="chi.pk" :value="chi.number" center @click="openForm(chi)">
                                        <template #title>
                                          <span class="custom-title hidd">{{chi.name}}</span>
                                        </template>
                                      </van-cell>
                                    </div>
                                  </van-collapse-item>
                                </van-collapse>
                              </div>
                            </van-collapse-item>
                          </van-collapse>
                        </div>
                      </van-collapse-item>
                    </van-collapse>
                  </div>
                </van-collapse-item>
              </van-collapse>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <van-goods-action>
      <van-goods-action-icon icon="cart-o" text="数量" :badge="store.list.length"  @click="add" />
      <van-goods-action-button type="danger" text="申领清单" @click="add" />
    </van-goods-action>
    <van-dialog v-model="showOpenFormVisable" title="申请物品"   :show-confirm-button="false" @closed="clearForm">
      <van-form style="padding:20px;max-height: 450px;overflow-y: auto;" @submit="submit" >
        <van-field :value="form.field_01" label="物品名称" readonly></van-field>
        <van-field :value="form.guige" label="规格型号" readonly></van-field>
        <van-field :value="form.danwei" label="单位" readonly></van-field>
        <van-field type="number" v-model="form.int_01" label="申请数量" required placeholder="请填写申请数量" :rules="[{ required: true }]" @blur="reqNumber"></van-field>
        <van-field v-model="form.field_02" label="用途" placeholder="请填写用途"></van-field>
        <van-field name="radio" label="领用借用">
          <template #input>
            <van-radio-group v-model="form.field_03" direction="horizontal">
              <van-radio name="领用">领用</van-radio>
              <van-radio name="借用">借用</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field readonly clickable name="calendar" :value="form.datetime_01" label="归还日期" placeholder="请选择归还日期" :required="form.field_03 === '借用'" @click="showCalendar = true" :rules="[{ required: form.field_03 === '借用' }]" />
        <van-field v-model="form.field_04" label="归还期限" placeholder="请填写归还期限"></van-field>
       <div v-if="form.text_01 && form.text_01.length>0" style="display: flex;padding-top: 10px;width: 100%;justify-content: flex-start;flex-wrap: wrap">
         <div
           v-for="(item, index) in form.text_01"
           :key="index"
           style="padding-right: 10px"
         >
           <VanImage
             @click="Views(item,index)"
             width="80"
             height="80"
             :src="item"
             fit="cover"
           />
         </div>
       </div>
        <div style="margin: 16px;display:flex;justify-content:space-evenly">
          <van-button type="info" round style="width:110px" native-type="button" @click="showOpenFormVisable = false">取消</van-button>
          <van-button type="primary" round style="width:110px" native-type="submit">确定</van-button>
        </div>
      </van-form>
    </van-dialog>
    <van-calendar v-model="showCalendar" @confirm="CalendarConfirm" />
  </div>
</template>
<script>
import { store, commit } from "./store";
import resource from "@/mobile/resource.js";
import "./vant.plugin";
import moment from "moment";
import {Toast,Image as VanImage,ImagePreview} from "vant";
export default {
  name: "MobileCode",
  components:{VanImage,ImagePreview},
  data() {
    return {
      show:false,
      images: [],
      search: "",
      currentGoods: null,
      activeNames:null,
      item_list: [],
      allData: [],
      showOpenFormVisable: false,
      showCalendar: false,
      loading: false,
      form: {
        goodsPk: "",
        field_01: "",
        danwei:'',
        guige:'',
        text_01:[],
        field_02: "",
        field_03: "领用",
        field_04: "",
        int_01: "",
        datetime_01: null,
      },
      store,
      treeListIndex: 0,
      isOpenAll: false,
      Tree: null,
      AA: null,
      Res: null,
      isShow: false,
      index:0,
    };
  },
  computed: {
    filteredChildren() {
      return (children) => {
        if (!this.search) {
          return children;  // 如果没有搜索条件，直接返回原数据
        }
       // 因为children数组是个树状数组，每一项都有items，确保把每一项的items都搜索一遍，
        let i = children.filter((item) => {
          return item.name.indexOf(this.search) > -1 || (item.items && item.items.length > 0 && this.filteredChildren(item.items).length > 0);
        });
        return i;
      };
    }
  },
  watch:{
    search:{
      handler(val){
        if(val){
          this.isShow = true;
          this.item_list = this.Res.filter(item => item.name.indexOf(val) > -1)
        }else{
          this.isShow = false;
        }
      },
      deep: true
    }
  },
  created() {
    if(this.$route.query && this.$route.query.pk){
      this.getItems(this.$route.query.pk);
    }
  },
  methods: {
    Views(val,index){
        ImagePreview({
          images: this.form.text_01,
          startPosition: index,
          loop: false, //是否开启循环
          closeable: true,
          closeIconPosition: 'top-left'
        });
    },
    commit,
    reqNumber(val) {
      if (!Number.isInteger(val.target.value)) {
        this.form.int_01 = parseInt(val.target.value)
      }
      if (Number(val.target.value) < 0) {
        this.form.int_01 = 0
      }
      if (Number(val.target.value) > Number(this.currentGoods.number)) {
        this.form.int_01 = this.currentGoods.number
      }
    },
    add() {
      this.$router.push("/itemlist");
    },
    async getItems(val) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.loading = true;
      let p = {
        template_id: "FT140632863333752832",
        biz_id: this.$bizCode.wuping_biz,
        src_id: this.$sourceCode.source_id,
        root: val,
      }
      let re = await resource.getObj('basetree',val,{})
      this.Tree = [re];
      this.activeNames = [re.pk]
      let aa = this.extractSubtrees(re)
      this.AA = aa;
      let res = await resource.getList("data",p );
      this.Res = res;
      const aaMap1 = new Map(aa.map(item => [item.pk, item]));
      for (let i = 0; i < res.length; i++) {
        let item = res[i];
        let ji = aaMap1.get(item.category);
        if (ji) {
          item.guige = ji.field_01;
          item.danwei = ji.field_02;
          item.text_01 = ji.text_01 ? JSON.parse(ji.text_01) : [];
        }
      }

      const aaMap = aa.reduce((map, item) => {
        map[item.pk] = item.name;
        return map;
      }, {});
      for (let i = 0; i < res.length; i++) {
        let item = res[i];
        // 直接用 aaMap 查找 name
        if (aaMap[item.category]) {
          item.name = aaMap[item.category];
        }
      }
      const categoryMap = new Map();
      for (let j = 0; j < res.length; j++) {
        let ji = res[j];
        if (!categoryMap.has(ji.category)) {
          categoryMap.set(ji.category, []);
        }
        categoryMap.get(ji.category).push(ji);
      }
// 2. 遍历 aa 数组，直接查找对应的分类数组并赋值给 children
      for (let i = 0; i < aa.length; i++) {
        let item = aa[i];
        item.children = categoryMap.get(item.pk) || [];
      }

      // this.item_list = res;
      // this.allData = res;
      this.loading = false;
      Toast.clear();
    },
    extractSubtrees(node) {
      // 创建一个结果数组用于存放当前节点及其子树
      const subtrees = [node];  // 每个节点本身也是一颗树

      // 如果当前节点有子节点（items数组不为空），递归提取子树
      if (node.items && node.items.length > 0) {
        for (let child of node.items) {
          subtrees.push(...this.extractSubtrees(child));  // 递归提取子节点的子树
        }
      }

      return subtrees;
    },
    querySearch(queryString, cb) {
      var restaurants = this.item_list;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.name.indexOf(queryString) > -1;
      };
    },
    CalendarConfirm(value) {
      this.form.datetime_01 = moment(value).format("yyyy-MM-DD");
      this.showCalendar = false;
    },
    async filter(value) {
      if(!value) return this.isShow = false;
      if(value){
        this.isShow = true;
        this.item_list = this.Res.filter(item => item.name.indexOf(value) > -1)
      }
    },
    openForm(row) {
      this.currentGoods = row;
      this.form.field_01 = row.name;
      this.form.guige = row.guige || ''
      this.form.danwei = row.danwei || ''
      this.form.text_01 = row.text_01 && row.text_01.length>0 ? row.text_01 : []
      this.form.goodsPk = row.pk;
      this.showOpenFormVisable = true;
    },
    submit() {
      commit("setList", this.form);
      this.showOpenFormVisable = false;
      Toast.success("已添加到申领清单！");
    },
    clearForm() {
      this.form = {
        goodsPk: "",
        field_01: "",
        field_02: "",
        field_03: "领用",
        field_04: "",
        int_01: "",
        datetime_01: null,
      };
    },
  },

};
</script>

<style scoped>
.form {
  padding: 30px 50px;
}
.van-cell__title{
  width: 85%;
}
.hidd{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 90%;
  display: block;
}
</style>
