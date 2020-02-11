import Vue from 'vue'
import App from './index'
import dateTimePicker from '../../utils/dateTimePicker'

const app = new Vue(App)
app.$mount()

Vue.prototype.$dateTimePicker = dateTimePicker
