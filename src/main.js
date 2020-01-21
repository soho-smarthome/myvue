// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store';
import echarts from 'echarts'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false
Vue.use(Antd)
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
