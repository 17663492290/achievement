import Vue from 'vue'

import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import animate from 'animate.css'
import './styles/reset.less';
import Layout from './components/layout';
import VueRouter from 'vue-router';

// import axios from 'axios'
import services from './services'
import IndexPage from './pages/index'
import performanceFlow from './pages/performanceFlow'
import remind from './pages/remind'


Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(services); // api 接口服务
Vue.use(animate); // api 接口服务
// Vue.use(VueQuillEditor, /* { default global options } */)
Vue.config.productionTip = false;
// Vue.use(VueKindEditor);
// Vue.prototype.$http = axios;
let router = new VueRouter({
  mode: 'history',
  srcollBehavior(to,from,savedPosition){
    if(to.hash){
      return {
        selector:to.hash
      }
    }
  },
	routes: [
    {
      path: '/',
      redirect: '/index',
      meta: {
        title: '业绩提成总表'
      }
    },
    { 
      name: 'performanceFlow',
      path: '/performanceFlow',
      component: performanceFlow,
      meta: {
        title: '业绩核算明细'
      }
    },
		{
      name: 'index',
      path: '/index',
			component: IndexPage,
      meta: {
        title: '业绩提成总表'
      }
    },
    {
      name: 'remind',
      path: '/remind',
			component: remind,
      meta: {
        title: '提点设置'
      }
    }
  ],
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<Layout/>',
  components: { Layout }
})
