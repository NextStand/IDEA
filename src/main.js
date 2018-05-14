// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Index from './Index'
import Router from 'vue-router'
import routes from './router'
import VueResource from 'vue-resource'
import store from "./store"
//element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import FontAwesome from '@/assets/css/font-awesome.min.css'
//animate
import Animate from '@/assets/css/animate.css'
//自定义样式
import AppStyles from './assets/css/app.less'
//核心类
import Idea from "./CIDEA/idea"


Vue.use(Router);
Vue.use(VueResource);
Vue.use(ElementUI);
Vue.use(Idea)

Vue.config.productionTip = false

let router = new Router(routes);
let getCookie = (cname) => {
  let name = cname + "=",
    ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}
router.beforeEach((to, from, next) => {
  if (to.name == "login") {
    next({replace: true});
  } else {
    let f = from.path;
    if (f === "/") {
      let userInfo = sessionStorage.getItem('userInfo');
      if (!userInfo) {
        alert("您还未登录或登录过期,跳转到登录");
        next({ name: 'login', replace: true });
      } else {
        let rex = getCookie("_validlog_");
        if (rex) {
          next({replace: true})
        } else {
          alert("您还未登录或登录过期,跳转到登录");
          next({ name: 'login', replace: true });
        }
      }
    } else {
      let rex = getCookie("_validlog_");
      if (rex) {
        next({replace: true})
      } else {
        alert("您还未登录或登录过期,跳转到登录");
        next({ name: 'login', replace: true });
      }
    }
  }
})
/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  store,
  router,
  template: '<Index/>',
  components: { Index },
  /* created() {
    if (!sessionStorage.getItem('userInfo')) {
      const loading = this.$loading({
        lock: true,
        text: '您还未登录或登录过期，3秒后将跳转到登录',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 1)'
      });
      setTimeout(() => {
        loading.close();
        router.replace({ name: 'login', replace: true });
      }, 3000);
    }
  } */
})
