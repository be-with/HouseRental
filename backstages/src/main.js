// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'


Vue.config.productionTip = false
Vue.use(ElementUI)
import '@/icons'

import Axios from "axios"

Vue.prototype.$axios = Axios

// Axios.defaults.baseURL = "http://xxx" 

// Axios.defaults.baseURL = "http://xxx" 

Axios.defaults.baseURL = "http://xxx"
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store:store,
  template: '<App/>'
})
