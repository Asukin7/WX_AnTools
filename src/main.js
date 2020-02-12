import Vue from 'vue'
import App from './App'
import wxRequest from './utils/wx-request'
import bkTypeTo from './components/bkTypeTo'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

Vue.prototype.globalData = getApp().globalData
Vue.prototype.$wxRequest = wxRequest
Vue.prototype.$bkTypeTo = bkTypeTo
