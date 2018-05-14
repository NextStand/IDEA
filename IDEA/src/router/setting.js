//系统配置路由
//用户管理
const orz = () => import(/* webpackChunkName: "group-set" */ '@/pages/setting/orz.vue')
//权限管理
const workpower = () => import(/* webpackChunkName: "group-set" */ '@/pages/setting/workpower.vue')
//菜单权限
const menulimit = () => import(/* webpackChunkName: "group-set" */ '@/pages/setting/menuLimit.vue')
//菜单管理
const menuman = () => import(/* webpackChunkName: "group-set" */ '@/pages/setting/menuMan.vue')
//mongo配置
const mongcfglist = () => import(/* webpackChunkName: "group-set" */ '@/pages/setting/mongcfglist.vue')
export default [
    {
        path: "/users",
        name: "users",
        component: orz
    },
    {
        path: "/workpower",
        name: "workpower",
        component: workpower
    },
    {
        path: "/menulimit",
        name: "menulimit",
        component: menulimit
    },
    {
        path: "/mongcfglist",
        name: "mongcfglist",
        component: mongcfglist
    },
    {
        path: "/menuman",
        name: "menuman",
        component: menuman
    }
]