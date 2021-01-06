import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'

import ZkTable from 'vue-table-with-tree-grid'
// 导入axios
import axios from 'axios'
// 配置axios
axios.defaults.timeout = 10000
axios.defaults.baseURL = 'http://188.131.149.98:8888/api/private/v1/'
// 设置请求拦截器，为所有的请求添加一个Authorization字段携带token信息
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 固定写法 将config返回回去
  return config
})
Vue.prototype.$axios_ = axios
// Vue.prototype.$confirm = confirm

Vue.config.productionTip = false

Vue.config.devtools = true

Vue.component('tree-table', ZkTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
