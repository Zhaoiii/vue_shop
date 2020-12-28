import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'

// 导入axios
import axios from 'axios'
// 配置axios
axios.defaults.baseURL = 'http://188.131.149.98:8888/api/private/v1/'
Vue.prototype.$axios_ = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
