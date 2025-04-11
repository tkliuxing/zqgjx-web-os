import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/mobile',
  /**
   * router的配置：
   * 为了方便显示面包线的内容，需有层级关系，（目前最多有三层）
   * 所有的页面都在首页下
   *
   * 如有第三级页面，他的父级（也就是二级）也需要有path、name和路径
   * path和name可以随便取名（不冲突就可以），路径为page文件夹下的system.vue
   *
   * 不需要显示到面包线内的页面，需写到首页的同级，例如登录页
   */
  routes: [
    {
      path: '/log',
      name: 'log',
      component: () => import(/* webpackChunkName: "mblogs" */ '../mobile/pages/Log.vue'),
    },
    {
      path: '/articleinfo',
      name: 'articleinfo',
      component: () => import(/* webpackChunkName: "mbarticleinfo" */ './pages/SaoMaoZhanShi/articleinfo.vue'),
      meta: {title:'扫码展示详情'}
    },
    {
      path: "/shijuaninfo",
      name: "shijuaninfo",
      component: () => import(/* webpackChunkName: "mbdati" */"./pages/DaTiKaoShi/Index.vue"),
      meta: { title: "试卷详情" },
    },
    {
      path: "/ksrank",
      name: "/ksrank",
      component: () => import(/* webpackChunkName: "mbdati" */"./pages/DaTiKaoShi/Rank.vue"),
      meta: { title: "答题排名" },
    },
    {
      path: "/ksrecord",
      name: "/ksrecord",
      component: () => import(/* webpackChunkName: "mbdati" */"./pages/DaTiKaoShi/Record.vue"),
      meta: { title: "答题记录" },
    },
    {
      path: "/wenjuaninfo",
      name: 'wenjuaninfo',
      component: () => import(/* webpackChunkName: "mbwenjuan" */"./pages/WenJuanInfo/Index.vue"),
      meta: { title: "问卷详情" },
    },
    {
      path: "/cepinginfo",
      name: 'cepinginfo',
      component: () => import(/* webpackChunkName: "mbceping" */"./pages/CePingInfo/Index.vue"),
      meta: { title: "测评详情" },
    },
    {
      path: "/tianbaoinfo",
      name: 'tianbaoinfo',
      component: () => import(/* webpackChunkName: "mbtianbao" */"./pages/TianBaoInfo/TianbaoInfo.vue"),
      meta: { title: "填报详情" },
    },

    {
      path: "/exceltianbao",
      name: 'exceltianbao',
      component: () => import(/* webpackChunkName: "mbexceltianbao" */"./pages/TianBaoInfo/ExcelTianBao.vue"),
      meta: { title: "Excel填报" },
    },
    {
      path: "/xunjianinfo",
      name: 'xunjianinfo',
      component: () => import(/* webpackChunkName: "mbxunjian" */"./pages/XunJianInfo/Index.vue"),
      meta: { title: "巡检详情" },
    },
    {
      path: "/wplogin",
      name: 'wplogin',
      component: () => import(/* webpackChunkName: "mbwupin" */"./pages/WuPin/WPMobileLogin.vue"),
    },
    {
      path: "/wpmobilecode",
      name: 'wpmobilecode',
      component: () => import(/* webpackChunkName: "mbwupin" */"./pages/WuPin/MobileCode.vue"),
      meta: { title: "物品领用" },
    },
    {
      path: "/itemlist",
      name: 'itemlist',
      component: () => import(/* webpackChunkName: "mbwupin" */"./pages/WuPin/MobileItems.vue"),
      meta: { title: "物品添加" },
    },
    {
      path: "/renwuinfo",
      name: 'renwuinfo',
      component: () => import(/* webpackChunkName: "mbrenwu" */"./pages/RenWuInfo/index.vue"),
      meta: { title: "任务详情"},
    },
    {
      path: "/renwuliebiao",
      name: 'renwuliebiao',
      component: () => import(/* webpackChunkName: "mbrenwu" */"./pages/RenWuInfo/renwuliebiao.vue"),
      meta: { title: "任务列表"},
    },
    {
      path: "/h5qianming",
      component: () => import(/* webpackChunkName: "mbqianming" */"./pages/QianMing/H5-qianming.vue"),
      meta: { title: "签名" },
    },
    {
      path: "/SignaturePage",
      name: "SignaturePage",
      component: () => import(/* webpackChunkName: "mbqianming" */"./pages/QianMing/SignaturePage.vue"),
      meta: { title: "签名" },
    },
    {
      path: "/sf_shen_qing",
      name:"sf_shen_qing",
      component: () => import(/* webpackChunkName: "mbshoufang" */"./pages/ShouFang/wx/sf_sq.vue"),
      meta: { title: "拜访申请" },
    },
    {
      path: "/sf_shen_he",
      component: () => import(/* webpackChunkName: "mbshoufang" */"./pages/ShouFang/wx/sf_sp"),
      meta: { title: "来访审核" },
    },
    {
      path: "/sf_shen_he_list",
      name:"sf_shen_he_list",
      component: () => import(/* webpackChunkName: "mbshoufang" */"./pages/ShouFang/wx/sf_sp_list"),
      meta: { title: "拜访记录" },
    },
    {
      path: "/sf_shen_he_list_view",
      name:"sf_shen_he_list_view",
      component: () => import(/* webpackChunkName: "mbshoufang" */"./pages/ShouFang/wx/sf_sp_list_view"),
      meta: { title: "拜访记录详情" },
    },
    {
      path: "/sf_mg",
      name:"sf_mg",
      component: () => import(/* webpackChunkName: "mbshoufang" */"./pages/ShouFang/wx/sf_mg"),
      meta: { title: "门岗查验" },
    },
    {
      path: "/wx_bd",
      name:"wx_bd",
      component: () => import(/* webpackChunkName: "mbshoufang" */"./pages/ShouFang/wx/wx_bd"),
      meta: { title: "微信用户绑定" },
    },
    {
      path: "/sf_dep",
      name:"sf_dep",
      component: () => import(/* webpackChunkName: "mbshoufang" */"./pages/ShouFang/wx/sf_dep"),
      meta: { title: "单位列表" },
    },
  ]
});
