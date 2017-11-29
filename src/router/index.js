import Vue from 'vue'
import VueRouter from "vue-router"
import App from '../App'
import header from '../pages/common/header'
import footer from '../pages/common/footer'
import index from '../pages/index/index'

// 首页中间部分组件
import main from '../pages/index/main'

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  linkActiveClass: 'active',  // 全局配置 默认 class 激活类名
  routes: [
    {
      path: '/index', // 默认首页
      components: {
        // header: header,
        default: index
      },
      children: [
        {
          path: 'main/:module?',
          name: 'main',
          component: main,
        },
        {
          path: '',
          component: main,
        },
        {
          path: 'login',
          name: 'login',
          component: main
        }
      ],
    },
    {
      path: '*',  // 不存在的地址自动跳转
      redirect: '/index'
    }
  ]
});

export default router;