import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import ZkTable from 'vue-table-with-tree-grid'
// 导入axios
import axios from 'axios'
// 配置axios
axios.defaults.timeout = 10000
axios.defaults.baseURL = 'http://49.235.75.29:8888/api/private/v1/'
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

//创建一个全局的时间过滤函数
Vue.filter('dataFormate', function(oringinVal) {
  const dt = new Date(oringinVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 富文本编辑器
Vue.use(VueQuillEditor)
Vue.component('tree-table', ZkTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
