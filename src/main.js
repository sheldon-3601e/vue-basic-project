import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入需要的vant组件，按需引入
import '@/utils/vant-ui'
// 导入通用样式
import '@/styles/common.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
