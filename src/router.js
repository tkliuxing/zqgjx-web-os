import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const originalPush = Router.prototype.push;
//修改原型对象中的push方法解决点击相同的菜单页报错重复点击
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default new Router({
  mode: "history",
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
      path: "/",
      name: "main",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "home" */ "./components/common/Home.vue"),
      meta: {title: "首页"},
      redirect: "/nav",
      children: [
        {
          path: "/saomazhanshi",
          name: "saomazhanshi",
          component: () => import("./components/page/JieShao/saomazhanshi.vue"),
          meta: {title: "扫码展示"},
        },
        {
          path: "/nav",
          name: "nav",
          component: () =>
            import("./components/common/Nav.vue"),
          meta: {title: "首页导航"},
        },

        {
          path: "/kaoshizhanshi",
          name: "kaoshizhanshi",
          component: () =>
            import("./components/page/JieShao/kaoshizhanshi.vue"),
          meta: {title: "考试展示"},
        },
        {
          path: "/diaoyanzhanshi",
          name: "diaoyanzhanshi",
          component: () =>
            import("./components/page/JieShao/diaoyanzhanshi.vue"),
          meta: {title: "调研展示"},
        },
        {
          path: "/cepingzhanshi",
          name: "cepingzhanshi",
          component: () =>
            import("./components/page/JieShao/cepingzhanshi.vue"),
          meta: {title: "测评展示"},
        },
        {
          path: "/fapiaozhanshi",
          name: "fapiaozhanshi",
          component: () =>
            import("./components/page/JieShao/fapiaozhanshi.vue"),
          meta: {title: "发票展示"},
        },
        {
          path: "/tianbaozhanshi",
          name: "tianbaozhanshi",
          component: () =>
            import("./components/page/JieShao/tianbaozhanshi.vue"),
          meta: {title: "填报展示"},
        },
        {
          path: "/xunjianzhanshi",
          name: "xunjianzhanshi",
          component: () => import("./components/page/JieShao/saomaxunjian.vue"),
          meta: {title: "扫码巡检"},
        },
        {
          path: "/pandianzhanshi",
          name: "pandianzhanshi",
          component: () => import("./components/page/ZiChan/PanDian/pandianzhanshi.vue"),
          meta: {title: "盘点示例"},
        },
        {
          path: "/wupinzhanshi",
          name: "wupinzhanshi",
          component: () =>
            import("./components/page/JieShao/wupinlingyongzhanshi.vue"),
          meta: {title: "物品领用展示"},
        },

        {
          path: "/article",
          name: "article",
          component: () => import("./components/page/ZhanShi/Index.vue"),
          meta: {title: "扫码查看"},
          redirect: "/article/article-info",
          children: [
            {
              path: "article-info",
              name: "article-info",
              component: () => import("./components/page/ZhanShi/article.vue"),
              meta: {title: "内容发布"},
            },
            {
              path: "zhanshi-shuoming",
              name: "zhanshi-shuoming",
              component: () => import("./components/page/ZhanShi/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
          ],
        },
        {
          path: "/qianming",
          name: "qianming",
          component: () => import("./components/page/Qianming/qianming.vue"),
          meta: {title: "签名"},
          redirect: "/qianming/qm",
          children: [
            {
              path: "qianming-qm",
              name: "qianming-qm",
              component: () => import("./components/page/Qianming/Index.vue"),
              meta: {title: "手机签名"},
            },
            {
              path: "qianming-shuoming",
              name: "qianming-shuoming",
              component: () => import("./components/page/Qianming/Shuoming.vue"),
              meta: {title: "使用说明"},
            },
            {
              path: "qianming-shili",
              name: "qianming-shili",
              component: () => import("./components/page/Qianming/Shili.vue"),
              meta: {title: "查看示例"},
            },
          ],
        },
        {
          path: "/danganguanli",
          name: "danganguanli",
          component: () => import("./components/page/danganguanli/Index.vue"),
          meta: {title: "档案管理"},
          redirect: "/danganguanli",
          children: [
            {
              path: "/danganguanli/dashboard",
              name: "da_dashboard",
              component: () =>
                import(/* webpackChunkName: "Dashboard" */ "./components/page/danganguanli/Dashboard.vue"),
              meta: {title: "档案展示"},
            },
            {
              path: "guanli",
              name: "guanli",
              component: () =>
                import(
                  "./components/page/danganguanli/guanli/Index.vue"
                  ),
              meta: {title: "文档管理"},
            },
            {
              path: "zhuanyi",
              name: "zhuanyi",
              component: () =>
                import(
                  "./components/page/danganguanli/zhuanyi/Index.vue"
                  ),
              meta: {title: "文档转移"},
            },
            {
              path: "jiechu",
              name: "jiechu",
              component: () =>
                import(
                  "./components/page/danganguanli/jiechu/Index.vue"
                  ),
              meta: {title: "文档借出/归还"},
            },
            {
              path: "jiben",
              name: "jiben",
              component: () =>
                import(
                  "./components/page/danganguanli/jibenxinxi/jibenxinxi.vue"
                  ),
              meta: {title: "基本信息"},
            },
            {
              path: "ZhiGongGuanLi",
              name: "ZhiGongGuanLi",
              component: () =>
                import(
                  "./components/page/danganguanli/XiTongGuanLi/ZhiGongGuanLi/BuMenRenYuanGL.vue"
                  ),
              meta: {title: "职工管理"},
            },
            {
              path: "/danganshuoming",
              name: "danganshuoming",
              component: () =>
                import(
                  "./components/page/danganguanli/Shuoming.vue"
                  ),
              meta: {title: "使用说明"},
            },

          ],
        },
        {
          path: "/danganguanli",
          name: "danganguanli",
          component: () =>
            import(/* webpackChunkName: "home" */ "./components/page/danganguanli/Dashboard.vue"),
          meta: {title: "档案管理"},
          redirect: "/dashboard",
          children: [
            {
              path: "/dashboard",
              name: "dashboard",
              component: () =>
                import(/* webpackChunkName: "Dashboard" */ "./components/page/danganguanli/Dashboard.vue"),
              meta: {title: "档案"},
            },
            {
              path: "/system",
              name: "system",
              meta: {title: "档案首页"},
              component: () =>
                import(/* webpackChunkName: "Container" */ "./components/page/danganguanli/Container.vue"),
              children: [],
            },
          ],
        },
        {
          path: "kaoshi",
          name: "kaoshi",
          component: () =>
            import(
              /* webpackChunkName: "kaoshi" */
              "./components/page/ShiJuan/kaoshi.vue"
              ),
          meta: {title: "考试"},
          children: [
            {
              path: "shijuan",
              name: "shijuan",
              component: () =>
                import(
                  /* webpackChunkName: "kaoshi" */
                  "./components/page/ShiJuan/ShiJuan.vue"
                  ),
              meta: {title: "试卷"},
            },
            {
              path: "jieguolist/:id",
              name: "jieguolist",
              component: () =>
                import(
                  /* webpackChunkName: "kaoshi" */
                  "./components/page/ShiJuan/JieGuoList.vue"
                  ),
              meta: {title: "答卷"},
              props: true,
            },
            {
              path: "tikushiti/:id",
              name: "tikushiti",
              component: () =>
                import(
                  /* webpackChunkName: "kaoshi" */
                  "./components/page/ShiJuan/TiKuShiTi.vue"
                  ),
              meta: {title: "题库试题"},
              props: true,
            },
            {
              path: "tiku",
              name: "tiku",
              component: () =>
                import(
                  /* webpackChunkName: "kaoshi" */
                  "./components/page/ShiJuan/TiKu.vue"
                  ),
              meta: {title: "题库"},
            },
            {
              path: "tikushitiexcel/:id",
              name: "tikushitiexcel",
              component: () =>
                import(
                  /* webpackChunkName: "kaoshi" */
                  "./components/page/ShiJuan/TiKuShiTiExcel.vue"
                  ),
              meta: {title: "题库"},
            },
            {
              path: "kaoshi-shuoming",
              name: "kaoshi-shuoming",
              component: () => import("./components/page/ShiJuan/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
          ],
        },
        {
          path: "/fabuyemian",
          name: "fabuyemian",
          meta: {title: "事件督办"},
          component: () =>
            import(
              /* webpackChunkName: "system" */
              "./components/page/ShiJianDuBan/index.vue"
              ),
          children: [
            {
              path: "faburenwu",
              name: "faburenwu",
              component: () =>
                import(
                  /* webpackChunkName: "BuMenRenYuanGuanLi" */
                  "./components/page/ShiJianDuBan/FaBuRenWu/index.vue"
                  ),
              meta: {title: "督办任务单"},
            },
            {
              path: "gerenbangong",
              name: "gerenbangong",
              component: () =>
                import(
                  /* webpackChunkName: "BuMenRenYuanGuanLi" */
                  "./components/page/ShiJianDuBan/GeRenBanGong/index.vue"
                  ),
              meta: {title: "个人办公"},
            },
            {
              path: "taizhangliebiao",
              name: "taizhangliebiao",
              component: () =>
                import(
                  /* webpackChunkName: "BuMenRenYuanGuanLi" */
                  "./components/page/ShiJianDuBan/taizhangliebiao/index.vue"
                  ),
              meta: {title: "督办任务台账列表"},
            },
            {
              path: "renwutongji",
              name: "renwutongji",
              component: () =>
                import(
                  /* webpackChunkName: "BuMenRenYuanGuanLi" */
                  "./components/page/ShiJianDuBan/renwutongji/index.vue"
                  ),
              meta: {title: "任务统计"},
            },
            {
              path: "duban-shuoming",
              name: "duban-shuoming",
              component: () =>
                import("./components/page/ShiJianDuBan/FaBuRenWu/Shuoming.vue"),
              meta: {title: "使用说明"},
            },
            {
              path: "/duban",
              name: "duban",
              component: () => import("./components/page/ShiJianDuBan/FaBuRenWu/duban.vue"),
              meta: {title: "督办示例"},
            },
          ]
        },
        {
          path: "/renliguanli",
          name: "renliguanli",
          meta: {title: "人力管理"},
          component: () =>
            import(
              /* webpackChunkName: "system" */
              "./components/page/Renliguanli/index.vue"
              ),
          children: [
            {
              path: "jueseguanli",
              name: "jueseguanli",
              component: () =>
                import(
                  /* webpackChunkName: "BuMenRenYuanGuanLi" */
                  "./components/page/XiTongGuanLi/JueSeGuanLi.vue"
                  ),
              meta: {title: "角色管理"},
            },
            {
              path: "yuangongliebiao",
              name: "yuangongliebiao",
              component: () =>
                import(
                  /* webpackChunkName: "BuMenRenYuanGuanLi" */
                  "./components/page/Renliguanli/yuangongsystem/Index.vue"
                  ),
              meta: {title: "员工列表"},
            },
            {
              path: "yuangongxinxitongji",
              name: "yuangongxinxitongji",
              component: () =>
                import(
                  /* webpackChunkName: "BuMenRenYuanGuanLi" */
                  "./components/page/Renliguanli/ry_report/index.vue"
                  ),
              meta: {title: "员工信息统计"},
            },

            {
              path: "jibenxinxi",
              name: "jibenxinxi",
              component: () =>
                import(
                  "./components/page/Renliguanli/XiTongGuanLi/JiBenXinXiGuanLi.vue"
                  ),
              meta: {title: "基本信息管理"},
            },
            {
              path: 'adminshenhe',
              name: 'adminshenhe',
              component: () =>
                import(
                  "./components/page/Renliguanli/adminshenhe/index.vue"
                  ),
              meta: {title: "审核页面"},
            },
            {
              path: 'renli-shuoming',
              name: 'renli-shuoming',
              component: () =>
                import(
                  "./components/page/Renliguanli/Shuoming.vue"
                  ),
              meta: {title: "使用说明"},
            }
          ]
        },

        // {
        //
        // },
        // {
        //   path: "/fabuyemian",
        //   name: "fabuyemian",
        //   meta: { title: "事件督办" },
        //   component: () =>
        //       import(
        //           /* webpackChunkName: "system" */
        //           "./components/page/shijianduban"
        //           ),
        //   children:[
        //     {
        //       path: "faburenwu",
        //       name: "faburenwu",
        //       component: () =>
        //           import(
        //               /* webpackChunkName: "BuMenRenYuanGuanLi" */
        //               "./components/page/ShiJianDuBan/FaBuRenWu/FaBuRenWu"
        //               ),
        //       meta: { title: "发布任务" },
        //     },
        //     {
        //       path: "gerenbangong",
        //       name: "gerenbangong",
        //       component: () =>
        //           import(
        //               /* webpackChunkName: "BuMenRenYuanGuanLi" */
        //               "./components/page/ShiJianDuBan/GeRenBanGong/GeRenBanGong"
        //               ),
        //       meta: { title: "个人办公" },
        //     },
        //     {
        //       path: "renwuguanli",
        //       name: "renwuguanli",
        //       component: () =>
        //           import(
        //               /* webpackChunkName: "BuMenRenYuanGuanLi" */
        //               "./components/page/ShiJianDuBan/RenWuGuanLI/RenWuGuanLi"
        //               ),
        //       meta: { title: "任务管理" },
        //     },
        //     {
        //       path: "renwuxiangqing",
        //       name: "renwuxiangqing",
        //       component: () =>
        //           import(
        //               /* webpackChunkName: "BuMenRenYuanGuanLi" */
        //               "./components/page/ShiJianDuBan/RenWuXiangQing"
        //               ),
        //       meta: { title: "任务详情及处理" },
        //     }
        //   ]
        // },
        {
          path: "/system",
          name: "system",
          meta: {title: "部门人员管理"},
          component: () =>
            import(
              /* webpackChunkName: "system" */
              "./components/page/system.vue"
              ),
          redirect: "/system/BuMenRenYuanGuanLi",
          children: [
            // {
            //   path: "jueseguanli",
            //   name: "jueseguanli",
            //   component: () =>
            //     import(
            //       /* webpackChunkName: "BuMenRenYuanGuanLi" */
            //       "./components/page/XiTongGuanLi/JueSeGuanLi.vue"
            //     ),
            //   meta: { title: "角色管理" },
            // },
            {
              path: "BuMenRenYuanGuanLi",
              name: "BuMenRenYuanGuanLi",
              component: () =>
                import(
                  /* webpackChunkName: "BuMenRenYuanGuanLi" */
                  "./components/page/XiTongGuanLi/BuMengRenYuanGuanLi/BuMenRenYuanGuanLi"
                  ),
              meta: {title: "部门管理"},
            },
            {
              path: "bumenrenyuanguanli/bianjibumen/:pk",
              name: "bianjibumen",
              meta: {title: "部门编辑"},
              component: () =>
                import(
                  /* webpackChunkName: "indexs" */
                  "./components/page/XiTongGuanLi/BuMengRenYuanGuanLi/BianJiBuMen"
                  ),
            },

            {
              path: "bumenrenyuanguanli/xinzengbumen",
              name: "xinzengbumen",
              meta: {title: "部门新增"},
              component: () =>
                import(
                  /* webpackChunkName: "indexs" */
                  "./components/page/XiTongGuanLi/BuMengRenYuanGuanLi/XinZengBuMen"
                  ),
            },
            {
              path: "renyuanguanli/:pk",
              name: "renyuanguanli",
              component: () =>
                import(
                  /* webpackChunkName: "RenYuanGuanLi" */
                  "./components/page/XiTongGuanLi/BuMengRenYuanGuanLi/RenYuanGuanLi/RenYuanGuanLi.vue"
                  ),
              meta: {title: "人员管理"},
            },
          ],
        },

        {
          path: "/wenjuan",
          name: "wenjuan",
          component: () =>
            import(
              /* webpackChunkName: "wenjuan" */
              "./components/page/WenJuan/wenjuan.vue"
              ),
          meta: {title: "问卷"},
          redirect: "/wenjuan/shijuan",
          children: [
            {
              path: "shijuan",
              name: "wenjuan-shijuan",
              component: () =>
                import(
                  /* webpackChunkName: "wenjuan" */
                  "./components/page/WenJuan/ShiJuan.vue"
                  ),
              meta: {title: "问卷管理"},
            },
            {
              path: "shiti/:id",
              name: "wenjuan-shiti",
              component: () =>
                import(
                  /* webpackChunkName: "wenjuan" */
                  "./components/page/WenJuan/ShiTi.vue"
                  ),
              meta: {title: "题目"},
              props: true,
            },
            {
              path: "jieguolist/:id",
              name: "wenjuan-jieguolist",
              component: () =>
                import(
                  /* webpackChunkName: "wenjuan" */
                  "./components/page/WenJuan/JieGuoList.vue"
                  ),
              meta: {title: "答卷"},
              props: true,
            },
            {
              path: "tongji/:id/",
              name: "wenjuan-tongji",
              component: () =>
                import(
                  /* webpackChunkName: "wenjuantongji" */
                  "./components/page/WenJuan/Tongji.vue"
                  ),
              meta: {title: "统计"},
              props: true,
            },
            {
              path: "wenjuanExcel/:id/",
              name: "wenjuan-excel",
              component: () =>
                import(
                  /* webpackChunkName: "wenjuantongji" */
                  "./components/page/WenJuan/WenJuanShiTiExcel.vue"
                  ),
              meta: {title: "统计"},
              props: true,
            },
            {
              path: "wenjuan-shuoming",
              name: "wenjuan-shuoming",
              component: () => import("./components/page/WenJuan/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
          ],
        },
        {
          path: "/fapiao",
          name: "fapiao",
          component: () =>
            import(
              /* webpackChunkName: "fapiao" */
              "./components/page/FaPiao/fapiao.vue"
              ),
          meta: {title: "发票管理"},
          redirect: "/fapiao/fapiao",
          children: [
            {
              path: "fapiao",
              name: "fapiao-fapiao",
              component: () =>
                import(
                  /* webpackChunkName: "fapiao" */
                  "./components/page/FaPiao/Index.vue"
                  ),
              meta: {title: "发票"},
            },
            {
              path: "tongji",
              name: "fapiao-tongji",
              component: () =>
                import(
                  /* webpackChunkName: "fapiao" */
                  "./components/page/FaPiao/TongJi.vue"
                  ),
              meta: {title: "统计"},
            },
            {
              path: "fapiao-shuoming",
              name: "fapiao-shuoming",
              component: () => import("./components/page/FaPiao/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
          ],
        },
        {
          path: "/tianbao",
          name: "tianbao",
          component: () =>
            import(
              /* webpackChunkName: "tianbao" */
              "./components/page/TianBao/DanHangTianBao/TianBao.vue"
              ),
          meta: {title: "扫码填报"},
          redirect: "/tianbao/tbindex",
          children: [
            {
              path: "tbindex",
              name: "tianbao-index",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/DanHangTianBao/Index.vue"
                  ),
              meta: {title: "填报列表"},
            },
            {
              path: "jieguolist/:id",
              name: "tianbao-jieguolist",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/DanHangTianBao/JieGuoList.vue"
                  ),
              meta: {title: "填报结果"},
              props: true,
            },
            {
              path: "excel/",
              name: "tianbao-excel",
              component: () =>
                import(
                  /* webpackChunkName: "wenjuan" */
                  "./components/page/TianBao/ExcelTianBao/ExcelTianBao.vue"
                  ),
              meta: {title: "Excel填报"},
            },
            {
              path: "exceljieguo/:id",
              name: "excel-jieguo",
              component: () =>
                import(
                  /* webpackChunkName: "wenjuan" */
                  "./components/page/TianBao/ExcelTianBao/JieGuoList.vue"
                  ),
              meta: {title: "Excel填报结果"},
            },
            {
              path: "duohang",
              name: "tianbao-duohang",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/DuoHangTianBao/Index.vue"
                  ),
              meta: {title: "多行填报"},
            },
            {
              path: "duohangjieguo/:id",
              name: "tianbao-duohang-jieguolist",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/DuoHangTianBao/JieGuoList.vue"
                  ),
              meta: {title: "多行填报结果"},
              props: true,
            },
            {
              path: "table",
              name: "tianbao-table",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/TableTianBao/Index.vue"
                  ),
              meta: {title: "表单填报"},
            },
            {
              path: "tableinfo",
              name: "tianbao-table-info",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/TableTianBao/TableInfo.vue"
                  ),
              meta: {title: "表格详情"},
            },
            {
              path: "tablejieguo/:id",
              name: "tianbao-table-jieguolist",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/TableTianBao/JieGuoList.vue"
                  ),
              meta: {title: "表格填报结果"},
              props: true,
            },


            {
              path: "ewtbindex",
              name: "ewtianbao-index",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/ErWeiTianBao/Index.vue"
                  ),
              meta: {title: "表格填报列表"},
            },
            {
              path: "biaogetianbao",
              name: "biaogetianbao-index",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/BiaoGeTianBao/Index.vue"
                  ),
              meta: {title: "表格填报列表"},
            },
            {
              path: "biaogetianbao/:id",
              name: "biaogetianbao-biaogetianbao",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/BiaoGeTianBao/tianbao.vue"
                  ),
              meta: {title: "填报结果"},
              props: true,
            },
            {
              path: "biaogetianbao/:id",
              name: "biaogetianbao-log",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/BiaoGeTianBao/Log.vue"
                  ),
              meta: {title: "日志信息"},
              props: true,
            },
            {
              path: "biaogetianbao/:id",
              name: "biaogetianbao-tongji",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/BiaoGeTianBao/tongji.vue"
                  ),
              meta: {title: "信息统计"},
              props: true,
            },
            {
              path: "ewjieguotianbao/:id",
              name: "ewtianbao-jieguotianbao",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/ErWeiTianBao/PCTianBao"
                  ),
              meta: {title: "填报结果"},
              props: true,
            },
            {
              path: "ewjieguotongji/:id",
              name: "ewtianbao-jieguotongji",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/ErWeiTianBao/Results"
                  ),
              meta: {title: "填报结果统计"},
              props: true,
            },
            {
              path: "ewjieguotongji_group/:id",
              name: "ewtianbao-jieguotongji-group",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/ErWeiTianBao/groupResults"
                  ),
              meta: {title: "填报结果统计"},
              props: true,
            },
            {
              path: "ewlog/:id",
              name: "ewtianbao-log",
              component: () =>
                import(
                  /* webpackChunkName: "tianbao" */
                  "./components/page/TianBao/ErWeiTianBao/common/Log.vue"
                  ),
              meta: {title: "日志信息"},
              props: true,
            },


            {
              path: "tianbao-shuoming",
              name: "tianbao-shuoming",
              component: () => import("./components/page/TianBao/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
          ],
        },
        {
          path: "xunjian",
          name: "xunjian",
          component: () =>
            import(
              "./components/page/XunJian/Index.vue"
              ),
          meta: {title: "巡检"},
          redirect: "/xunjian/renwu",
          children: [
            {
              path: "renwu",
              name: "xunjian-renwu",
              component: () =>
                import(
                  "./components/page/XunJian/RenWu.vue"
                  ),
              meta: {title: "巡检任务"},
              props: true,
            },
            {
              path: "xunjiantongjiye",
              name: "xunjiantongjiye",
              component: () =>
                import(
                  "./components/page/XunJian/zhanshiyemian.vue"
                  ),
              meta: {title: "巡检统计页"},
              props: true,
            },
            {
              path: "xiangmu",
              name: "xunjian-xiangmu",
              component: () =>
                import(
                  "./components/page/XunJian/XiangMu.vue"
                  ),
              meta: {title: "巡检列表"},
              props: true,
            },
            {
              path: "xunjian-tongji",
              name: "xunjian-tongji",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/XunJian/TongJi.vue"
                  ),
              meta: {title: "巡检统计"},
              props: true,
            },
            {
              path: "jieguo",
              name: "xunjian-jieguo",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/XunJian/JieGuo.vue"
                  ),
              meta: {title: "巡检结果"},
            },
            {
              path: "xunjian-shuoming",
              name: "xunjian-shuoming",
              component: () => import("./components/page/XunJian/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
          ],
        },
        {
          path: "/ceping",
          name: "ceping",
          component: () =>
            import(
              /* webpackChunkName: "ceping" */
              "./components/page/CePing/ceping.vue"
              ),
          meta: {title: "测评管理"},
          redirect: "/ceping/ceping",
          children: [
            {
              path: "ceping",
              name: "ceping-ceping",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/CePing/Index.vue"
                  ),
              meta: {title: "测评"},
            },
            {
              path: "jieguo/:ceping_id",
              name: "ceping-jieguo",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/CePing/JieGuo.vue"
                  ),
              meta: {title: "测评记录统计"},
              props: true,
            },
            {
              path: "result/:ceping_id",
              name: "result-jieguo",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/CePing/tongjijieguo.vue"
                  ),
              meta: {title: "测评结果统计"},
              props: true,
            },
            {
              path: "ceping-shuoming",
              name: "ceping-shuoming",
              component: () => import("./components/page/CePing/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
          ],
        },
        {
          path: "/zichan",
          name: "zichan",
          component: () =>
            import(
              /* webpackChunkName: "tianbao" */
              "./components/page/ZiChan/Index.vue"
              ),
          meta: {title: "资产管理"},
          redirect: "/zichan/ZiChanXinXi",
          children: [
            {
              path: "/zichan/ZiChanXinXi",
              name: "zichan-xinxi",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/ZiChan/ZiChanXinXi/ZiChanXinXi.vue"
                  ),
              meta: {title: "资产信息"},
              props: true,
            },
            {
              path: "/zichan/ZiChanXinXiExcel",
              name: "zichan-xinxiexcel",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/ZiChan/ZiChanXinXi/ZiChanXinXiExcel.vue"
                  ),
              meta: {title: "资产信息Excel上传"},
              props: true,
            },
            {
              path: "/zichan/CreateZiChanXinXi",
              name: "zichan-createxinxi",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/ZiChan/ZiChanXinXi/CreateZiChanXinXi.vue"
                  ),
              meta: {title: "新建资产信息"},
              props: true,
            },
            {
              path: "/zichan/EditZiChanXinXi",
              name: "zichan-editxinxi",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/ZiChan/ZiChanXinXi/EditZiChanXinXi.vue"
                  ),
              meta: {title: "编辑资产信息"},
              props: true,
            },
            {
              path: "zichan-shuoming",
              name: "zichan-shuoming",
              component: () =>
                import("./components/page/ZiChan/ZiChanXinXi/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
            {
              path: "/zichan/ZiChanWeiXiu",
              name: "zichan-weixiu",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/ZiChan/ZiChanWeiXiu.vue"
                  ),
              meta: {title: "资产报修记录"},
              props: true,
            },
            {
              path: "/zichan/ZiChanFenLei",
              name: "zichan-fenlei",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/ZiChan/ZiChanFenLei.vue"
                  ),
              meta: {title: "资产分类管理"},
              props: true,
            },
            {
              path: "/zichan/zichanbaobiao",
              name: "zichan-baobiao",
              component: () =>
                import(
                  /* webpackChunkName: "ZiChanBaoBiao" */
                  "./components/page/ZiChan/ZiChanBaoBiao/index.vue"
                  ),
              meta: {title: "资产报表"},
              props: true,
            },
            {
              path: "/zichan/zichanpandian",
              name: "zichan-pandian",
              component: () =>
                import(
                  /* webpackChunkName: "ZiChanBaoBiao" */
                  "./components/page/ZiChan/PanDian/Index.vue"
                  ),
              meta: {title: "资产盘点"},
              props: true,
            },
            {
              path: "/zichan/cz",
              name: "zichan-cz",
              component: () =>
                import(
                  /* webpackChunkName: "ZiChanBaoBiao" */
                  "./components/page/ZiChan/ZiChanChuZhi/index.vue"
                  ),
              meta: {title: "资产处置记录"},
              props: true,
            },
            {
              path: "/zichan/CreatePanDian",
              name: "zichan-createpandian",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/ZiChan/PanDian/CreatePanDian.vue"
                  ),
              meta: {title: "新建盘点"},
              props: true,
            },
            {
              path: "jieguo/:pandian_id",
              name: "pandian-jieguo",
              component: () =>
                import(
                  /* webpackChunkName: "ceping" */
                  "./components/page/ZiChan/PanDian/JieGuo.vue"
                  ),
              meta: {title: "盘点结果统计"},
              props: true,
            },
            {
              path: "/zichan/pandianzichan",
              name: "pandian-zichan",
              component: () =>
                import(
                  /* webpackChunkName: "ZiChanBaoBiao" */
                  "./components/page/ZiChan/PanDian/PanDianZiChan.vue"
                  ),
              meta: {title: "盘点资产"},
              props: true,
            },

            {
              path: "/zichan/zichanbiangeng/zichanzhuanyi",
              name: "zichan-zhuanyi",
              component: () =>
                import(
                  /* webpackChunkName: "ZiChanBaoBiao" */
                  "./components/page/ZiChan/BianGeng/ZhuanYi.vue"
                  ),
              meta: {title: "资产转移"},
              props: true,
            },
            {
              path: "/zichan/zichanbiangeng/zichanchuzhi",
              name: "zichan-chuzhi",
              component: () =>
                import(
                  /* webpackChunkName: "ZiChanBaoBiao" */
                  "./components/page/ZiChan/BianGeng/ChuZhi.vue"
                  ),
              meta: {title: "资产处置"},
              props: true,
            },
            {
              path: "/zichan/zichanbiangeng/zichanbaofei",
              name: "zichan-baofei",
              component: () =>
                import(
                  /* webpackChunkName: "ZiChanBaoBiao" */
                  "./components/page/ZiChan/BianGeng/BaoFei.vue"
                  ),
              meta: {title: "资产报废"},
              props: true,
            },
            {
              path: "/zichan/zichanbiangeng/zichanchujie",
              name: "zichan-chujie",
              component: () =>
                import(
                  /* webpackChunkName: "ZiChanBaoBiao" */
                  "./components/page/ZiChan/BianGeng/ChuJie.vue"
                  ),
              meta: {title: "资产出借"},
              props: true,
            },
            {
              path: "/zichan/zichanbiangeng/zichanchuzu",
              name: "zichan-chuzu",
              component: () =>
                import(
                  /* webpackChunkName: "ZiChanBaoBiao" */
                  "./components/page/ZiChan/BianGeng/ChuZu.vue"
                  ),
              meta: {title: "资产出租"},
              props: true,
            },
            {
              path: "zichanpandian-shuoming",
              name: "zichanpandian-shuoming",
              component: () =>
                import("./components/page/ZiChan/PanDian/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
          ],
        },
        {
          path: "/items",
          name: "items",
          component: () =>
            import(
              /* webpackChunkName: "wuping" */
              "./components/page/WuPing/Index.vue"
              ),
          meta: {title: "物品领用"},
          children: [
            {
              path: "items_category",
              name: "items_category",
              component: () =>
                import("./components/page/WuPing/WuPingLeiBie.vue"),
              meta: {title: "物品管理"},
            },
            {
              path: "items_request",
              name: "items_request",
              component: () =>
                import("./components/page/WuPing/WuPingShenQing.vue"),
              meta: {title: "物品申请"},
            },
            {
              path: "items_response",
              name: "items_response",
              component: () =>
                import("./components/page/WuPing/WuPingGuiHuan.vue"),
              meta: {title: "物品归还"},
            },
            {
              path: "additems",
              name: "additems",
              component: () =>
                import("./components/page/WuPing/WuPingDengJi.vue"),
              meta: {title: "物品登记"},
            },
            {
              path: "items_issue",
              name: "items_issue",
              component: () =>
                import("./components/page/WuPing/WuPingIssue.vue"),
              meta: {title: "物品发放记录"},
            },
            {
              path: "wplymx",
              name: "wplymx",
              component: () =>
                import("./components/page/WuPing/WuPingLingYongDetail.vue"),
              meta: {title: "物品领用明细"},
            },
            {
              path: "wpjymx",
              name: "wpjymx",
              component: () =>
                import("./components/page/WuPing/WuPingJieYongDetail.vue"),
              meta: {title: "物品借用明细"},
            },
            {
              path: "wplyjyreport",
              name: "wplyjyreport",
              component: () =>
                import(
                  "./components/page/WuPing/WuPingLingYongJieYongReport.vue"
                  ),
              meta: {title: "物品领用借用报表"},
            },
            {
              path: "wplb-shuoming",
              name: "wplb-shuoming",
              component: () =>
                import("./components/page/WuPing/ShuoMing/WuPingLeiBie.vue"),
              meta: {title: "物品类别说明"},
            },
            {
              path: "wpsq-shuoming",
              name: "wpsq-shuoming",
              component: () =>
                import("./components/page/WuPing/ShuoMing/WuPinShenQing.vue"),
              meta: {title: "物品申请说明"},
            },
            {
              path: "ffwc-shuoming",
              name: "ffwc-shuoming",
              component: () =>
                import("./components/page/WuPing/ShuoMing/WuPinIssue.vue"),
              meta: {title: "发放完成说明"},
            },
            {
              path: "wplymx-shuoming",
              name: "wplymx-shuoming",
              component: () =>
                import("./components/page/WuPing/ShuoMing/WuPinLYMX.vue"),
              meta: {title: "物品领用明细说明"},
            },
            {
              path: "wpjymx-shuoming",
              name: "wpjymx-shuoming",
              component: () =>
                import("./components/page/WuPing/ShuoMing/WuPinJYMX.vue"),
              meta: {title: "物品借用明细说明"},
            },
            {
              path: "wplyjyreport-shuoming",
              name: "wplyjyreport-shuoming",
              component: () =>
                import(
                  "./components/page/WuPing/ShuoMing/WuPingLingYongJieYongReport.vue"
                  ),
              meta: {title: "物品领用借用报表说明"},
            },
          ],
        },
        {
          path: "/shoufangs",
          name: "shoufangs",
          component: () =>
            import(
              /* webpackChunkName: "shoufangs" */
              "./components/page/ShouFang/sf"
              ),
          meta: {title: "单位来访登记"},
          children: [
            {
              path: "shoufangs_jilu",
              name: "shoufangs_jilu",
              component: () =>
                import("./components/page/ShouFang/Index"),
              meta: {title: "来访记录"},
            },
            {
              path: "dep_qr",
              name: "dep_qr",
              component: () =>
                import("./components/page/ShouFang/dep_qr"),
              meta: {title: "单位二维码"},
            },
            {
              path: "lfdj-shuoming",
              name: "lfdj-shuoming",
              component: () => import("./components/page/ShouFang/ShuoMing.vue"),
              meta: {title: "使用说明"},
            },
          ],
        },
        {
          path: "/maps_data",
          name: "maps_data",
          component: () =>
            import(
              /* webpackChunkName: "maps" */
              "./components/page/MAPData/map"
              ),
          meta: {title: "地图工具"},
          children: [
            {
              path: "maps_lists",
              name: "maps_lists",
              component: () =>
                import("./components/page/MAPData/hebing"),
              meta: {title: "地图"},
            },
            {
              path: "maps_list",
              name: "maps_list",
              component: () =>
                import("./components/page/MAPData/Index"),
              meta: {title: "地图管理"},
            },
            {
              path: "maps_quyu",
              name: "maps_quyu",
              component: () =>
                import("./components/page/MAPData/quhua.vue"),
              meta: {title: "地图区域管理"},
            },
                        {
              path: "/mapsming",
              name: "mapsming",
              component: () =>
                import(
                  "./components/page/MAPData/Shuoming.vue"
                  ),
              meta: {title: "使用说明"},
            },
          ],
        },
      ],
    },
    {
      path: "/targetlink",
      name: "targetlink",
      component: () => import("./components/page/WenJuan/TargetLink.vue"),
      meta: {title: "地址链接"},
    },
    {
      path: "/wplogin",
      component: () => import("./components/page/WuPing/WPMobileLogin.vue"),
      meta: {title: "物品领用登录"},
    },
    {
      path: "/wpmobilecode",
      component: () => import("./components/page/WuPing/MobileCode.vue"),
      meta: {title: "物品申请", keepAlive: true},
    },
    {
      path: "/itemlist",
      component: () => import("./components/page/WuPing/MobileItems.vue"),
      meta: {title: "物品添加"},
    },
    {
      path: "/pandianLogin",
      component: () => import("./components/page/zichanpandianinfo/pandianLogin.vue"),
      meta: {title: "盘点登录"},
    },
    {
      path: "/shoujiinof",
      component: () => import("./components/page/zichanpandianinfo/shoujiinof.vue"),
      meta: {title: "资产盘点", keepAlive: true},
    },
    {
      path: "/endpandian",
      component: () => import("./components/page/zichanpandianinfo/endpandian.vue"),
      meta: {title: "已盘点", keepAlive: true},
    },
    {
      path: "/registerSuccess",
      name: "registerSuccess",
      component: () =>
        import(
          /* webpackChunkName: "registerSuccess" */
          "./components/page/RegisterSuccess.vue"
          ),
      meta: {title: "申请注册成功"},
    },
    {
      path: "/login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./components/page/Login.vue"),
      meta: {title: "登录"},
    },
    {
      path: "/404",
      component: () =>
        import(/* webpackChunkName: "404" */ "./components/page/404.vue"),
      meta: {title: "404"},
    },
    {
      path: "/log",
      component: () => import("./components/page/Log.vue"),
      meta: {title: "手机登录"},
    },
    {
      path: "/articleinfo",
      component: () => import("./components/page/articleinfo.vue"),
      meta: {title: "详情"},
    },
    {
      path: "/sf_shen_qing",
      name: "sf_shen_qing",
      component: () => import("./components/page/ShouFang/wx/sf_sq"),
      meta: {title: "拜访申请"},
    },
    {
      path: "/sf_shen_he",
      component: () => import("./components/page/ShouFang/wx/sf_sp"),
      meta: {title: "来访审核"},
    },
    {
      path: "/sf_shen_he_list",
      name: "sf_shen_he_list",
      component: () => import("./components/page/ShouFang/wx/sf_sp_list"),
      meta: {title: "拜访记录"},
    },
    {
      path: "/sf_shen_he_list_view",
      name: "sf_shen_he_list_view",
      component: () => import("./components/page/ShouFang/wx/sf_sp_list_view"),
      meta: {title: "拜访记录详情"},
    },
    {
      path: "/sf_mg",
      name: "sf_mg",
      component: () => import("./components/page/ShouFang/wx/sf_mg"),
      meta: {title: "门岗查验"},
    },
    {
      path: "/wx_bd",
      name: "wx_bd",
      component: () => import("./components/page/ShouFang/wx/wx_bd"),
      meta: {title: "微信用户绑定"},
    },
    {
      path: "/sf_dep",
      name: "sf_dep",
      component: () => import("./components/page/ShouFang/wx/sf_dep"),
      meta: {title: "单位列表"},
    },
    {
      path: "/tianbaoinfo",
      component: () => import("./components/page/TianBaoInfo/TianbaoInfo.vue"),
      meta: {title: "填报详情", keepAlive: true},
    },
    {
      path: "/tianbaoshuoming",
      // name: "tianbaoshuoming",
      component: () => import("./components/page/TianBaoInfo/Tianbaoshuoming.vue"),
      meta: {title: "填报说明"},
    },
    {
      path: "/kaopingshuoming",
      // name: "kaopingshuoming",
      component: () => import("./components/page/CePingInfo/Tianbaoshuoming.vue"),
      meta: {title: "填报说明"},
    },
    {
      path: "/duohangtianbaoinfo",
      component: () => import("./components/page/TianBaoInfo/MoreTianbao.vue"),
      meta: {title: "多行填报"},
    },
    {
      path: "/cepinginfo",
      component: () => import("./components/page/CePingInfo/Index.vue"),
      meta: {title: "测评详情"},
    },
    {
      path: "/exceltianbao",
      component: () => import("./components/page/TianBaoInfo/ExcelTianBao.vue"),
      meta: {title: "Excel填报"},
    },
    {
      path: "/tabletianbao",
      component: () => import("./components/page/TianBaoInfo/TableTianbao.vue"),
      meta: {title: "表格填报", keepAlive: true},
    },
    {
      path: "/xunjianinfo",
      component: () => import("./components/page/XunJianInfo/Index.vue"),
      meta: {title: "巡检详情"},
    },
    {
      path: "/zichaninfo",
      component: () => import("./components/page/ZiChan/ZiChanInfo/Index.vue"),
      meta: {title: "资产详情"},
    },
    {
      path: "/shijuaninfo",
      component: () => import("./components/page/ShiJuanInfo/Index.vue"),
      meta: {title: "试卷详情"},
    },
    {
      path: "/h5qianming",
      component: () => import("./components/page/Qianming/H5-qianming.vue"),
      meta: {title: "签名"},
    },
    {
      path: "/SignaturePage",
      name: "SignaturePage",
      component: () => import("./components/page/Qianming/SignaturePage.vue"),
      meta: {title: "签名"},
    },
    {
      path: "ksrank",
      name: "ksrank",
      component: () => import("./components/page/ShiJuanInfo/Rank.vue"),
      meta: {title: "答题排名"},
    },
    {
      path: "ksrecord",
      name: "ksrecord",
      component: () => import("./components/page/ShiJuanInfo/Record.vue"),
      meta: {title: "答题记录"},
    },
    {
      path: "/wenjuaninfo",
      component: () => import("./components/page/WenJuanInfo/Index.vue"),
      meta: {title: "问卷详情"},
    },
    {
      path: "/renwuinfo",
      component: () => import("./components/page/ShiJianDuBan/renwuinfo/index.vue"),
      meta: {title: "填报详情", keepAlive: true},
    },
    {
      path: "/renwuliebiao",
      component: () => import("./components/page/ShiJianDuBan/renwuinfo/renwuliebiao.vue"),
      meta: {title: "任务列表", keepAlive: true},
    },
    {
      path: "/piliang",
      name: "piliang",
      component: () =>
        import(
          "./components/common/Piliang"
          ),
      meta: {title: "批量下载二维码"},
      props: true,
    },
    {
      path: "/plqrcode",
      name: "plqrcode",
      component: () =>
        import(
          "./components/common/PlQrCode"
          ),
      meta: {title: "批量下载二维码"},
      props: true,
    },
  ],
});
