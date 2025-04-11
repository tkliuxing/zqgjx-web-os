<template>
  <div class="searchResult">
    <!--    搜索框-->
    <div class="searchbox">
      <div class="searchBg">
        <h3 class="search-title">全局搜索</h3>
        <div style="position: relative;margin-right: 50px">
          <input type="text" placeholder="请输入搜索内容..." class="Input" v-model="searchValue" @keyup.enter="search">
          <div class="sousuoanniu">
            <span class="anniu" @click="search">搜索</span>
          </div>
        </div>
        <el-tooltip class="item" effect="light" content="点击清空将会清空以下子栏目" placement="top-start">
          <span style="color: #176DC4;font-weight: bold;margin-left: 20px;cursor: pointer" @click="clear">清空</span>
        </el-tooltip>
        <!--        背景图-->
        <div>
          <img :src="src" height="70px" style="float: right;border-top-right-radius: 10px"/>
        </div>

      </div>
      <!--      <div class="backbox">-->
      <!--        <div class="backbox-title" @click="backIndex">-->
      <!--          <img :src="back" style="margin-bottom: 5px;margin-right: 5px"/>-->
      <!--          <span  style="color: #1D538D;font-weight: 600;">返回</span>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <!--    线-->
    <div style="border-bottom: 2px  dashed #BFCDDF"></div>
    <div>
      <!--      tabs切换卡-->
<!--      <div class="tabs">-->
<!--          <span v-for="(tab, index) in tabs" :key="index" @click="selectTab(index)" :class="{ 'tab': true, 'active': index === selectedTabIndex, }">-->
<!--           <span class="tab_item" :class="{'selected':index==selectedTabIndex}" @mouseover="onTabMouseOver(index)">-->
<!--              <div style="display: flex;align-items: center;justify-content: center">-->
<!--                <img :src="index==selectedTabIndex ? tab.activeImg : tab.img " height="20px" style="margin-right: 5px"/>-->
<!--               <span>-->
<!--                  {{ tab.name }}-->
<!--               </span>-->
<!--              </div>-->
<!--           </span>-->
<!--          </span>-->
<!--      </div>-->
      <div class="tab-content">
        <ren v-show="selectedTabIndex == 0" ref="renChild" :keys="searchValue"/>
      </div>

    </div>

  </div>
</template>
<script>
import ren from './ren.vue';

let src = require('../../../../assets/img/searchIndex/ssbg.jpg');
let back = require('../../../../assets/img/searchIndex/pro_01.png');
export default {
  name: 'searchResultContainer',
  data() {
    return {
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      searchValue: null, // 搜索框的值
      tabs: [
        {
          img: require('../../../../assets/img/searchIndex/pro_ico01.png'),
          activeImg: require('../../../../assets/img/searchIndex/pro_ico01-2.png'),
          name: '搜人',
        },
      ],
      selectedTabIndex: 0,
      isMouseOver: false,
      src,
      back,
    }
  },
  components: {
    ren,
  },
  created() {
    // if(this.$route.params && this.$route.params.searchValue){
    //   this.searchValue = this.$route.params.searchValue.trim();
    // }
  },
  methods: {
    clear() {
      this.searchValue = null;
      this.$refs.renChild.reset();
      // this.$nextTick(()=>{
      //   this.$refs.renChild.loadData();
      //   this.$refs.xiangmuChild.loadData();
      //   this.$refs.chengguoChild.loadData();
      //   this.$refs.danganChild.loadData();
      // })
    },
    selectTab(index) {
      this.selectedTabIndex = index;
    },
    search() {
      if (!this.searchValue) return this.$message.warning('请输入搜索内容');
      this.searchValue = this.searchValue.trim();
      this.$refs.renChild.loadData();
    },
    onTabMouseOver(index) {
      this.isMouseOver = true;
      setTimeout(() => {
        this.isMouseOver = false;
      }, 200); // 调整这里的延迟时间，以控制动画持续时间
    },

    // 返回首页的方法
    backIndex() {
      // 执行返回首页的操作
      this.searchValue = null;
      window.location.href = '/dashboard';
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == 'dashboard' && from.name == 'searchResultContainer') {
      this.backIndex();
    } else {
      next();
    }
  },
}
</script>
<style scoped>
.searchResult {
  width: 99%;
  margin: 0px 10px;
  background-color: #F2F6F9;
  border-radius: 10px 10px 0 0;
  //padding: 30px 30px;
}

.searchBg {
  display: flex;
  background-image: linear-gradient(120deg, #F7FAFF 0%, #FFFFFF 100%);
  padding-left: 40px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 80%;
  height: 70px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.searchBg::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: -55px;
  width: 50px;
  height: 40px;
  background: linear-gradient(to bottom right, transparent, rgba(52, 152, 219, 0.3));
  transform: rotate(0deg);
  transform-origin: bottom left;
  filter: blur(10px);
}

.searchBg::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: -50px;
  width: 50px;
  height: 40px;
  background: linear-gradient(to bottom left, transparent, rgba(52, 152, 219, 0.3)); /* 修改渐变方向 */
  transform: rotate(0deg); /* 将角度修改为正数 */
  transform-origin: bottom right;
  filter: blur(10px);
}

.searchbox {
  display: flex;
  align-items: center
}

.search-title {
  margin-right: 30px;
  font-weight: 600
}

.sousuoanniu {
  background-color: #176DC4;
  color: #fff;
  width: 80px;
  position: absolute;
  right: -79px;
  top: 0;
  height: 45px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  cursor: pointer;
}

.anniu {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 45px;
}

.backbox {
  float: right;
  display: inline-block;
  margin-top: 15px;
}

.backbox-title {
  display: flex;
  align-items: center;
  cursor: pointer
}

.tabs {
  width: 100%;
  height: 50px;
  border-bottom: 2px solid #7094B8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 0 auto;
}

.tab {
  cursor: pointer;
  text-align: center;
  margin: 0;
}

.tab.active {
  color: #222;
}

.tab-content {
  margin-top: 25px;
}

.tab_item {
  width: 411px;
  line-height: 50px;
  display: block;
  font-size: 20px;
  color: #30639A;
}

.selected {
  color: #FFF;
  background-color: #176DC4;
}

.Input {
  width: 600px;
  height: 43px;
  padding-left: 20px;
  border-radius: 5px;
  border: 1px solid #DCDFE6;
  font-size: 18px;
}

input:focus {
  border-color: #409EFF;
  outline: none; /* 防止默认的外边框样式 */
}
</style>