import Vue from 'vue'
import App from './index'
import wxRequest from '../../utils/wx-request'

const app = new Vue(App)
app.$mount()

Vue.prototype.globalData = getApp().globalData
Vue.prototype.$wxRequest = wxRequest
