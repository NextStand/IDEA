import setting from "./setting"

import login from "./../pages/Login.vue";
import home from "./../pages/Home.vue";

const routes = [
  {
    path: "/",
    name:"login",
    component: login
  },
  {
    path: "/home",
    name: "home",
    component: home,
    children: setting
  }
]


export default {
  //mode: 'history',
  //history: true,
  routes
}
