import Vue from 'vue'
import Router from 'vue-router'
import login from '../pages/login.vue'
import index from '../pages/index.vue'
import accountManage from '../pages/accountManage.vue'
import houseResource from '../pages/houseResource.vue'
import permission from '../pages/power/permission.vue'
import adjust from '../pages/power/adjust.vue'
import application from '../pages/application.vue'

import Home from '@/pages/home.vue'
import Log from '@/pages/log.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      name: 'login',
      component: login
    }, {
      path: '/index',
      name: 'index',
      redirect:'/home',
      component: index,
      children: [
        {     
          path: '/home',
          component: Home,
          name: 'home',
          meta: {
            id: '1',
            name: '首页',
            icon: 'tree'
          }
        },
        {
          path: '/log',
          component: Log,
          name: 'log',
          meta: {
            id:'2',
            name: '日志管理',
            icon: 'tree'
          }
        },
        {
          path: '/account_manage',
          component: accountManage,
          name: 'accountManage',
          meta: {
            id:'3',
            name: '账户管理',
            icon: 'tree'
          }
        },
        {
          path: '/house_resource',
          component: houseResource,
          name: 'houseResource',
          meta: {
            id:'4',
            name: '房源管理',
            icon: 'tree'
          }
        },
        {
          path: '/application',
          component: application,
          name: 'application',
          meta: {
            id:'5',
            name: '看房预约',
            icon: 'tree'
          }
        },
        {
          path: '/permission',
          component: permission,
          name: 'permission',
          meta: {
            id:'6-1',
            name: '权限设置 / 管理员设置',
            icon: 'tree'
          }
        },
        {
          path: '/adjust',
          component: adjust,
          name: 'adjust',
          meta: {
            id:'6-2',
            name: '权限设置 / 业务调整',
            icon: 'tree'
          }
        }
      ]
    }]
})
