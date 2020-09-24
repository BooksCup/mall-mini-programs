import Vue from 'vue'
import App from './App'
import guide from './common/api/guide.js'

Vue.config.productionTip = false
Vue.prototype.$guide = guide

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
