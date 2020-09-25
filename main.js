import Vue from 'vue'
import App from './App'

import common from './common/common.vue'

import guide from './common/api/guide.js'

Vue.config.productionTip = false
Vue.prototype.$guide = guide

Vue.prototype.$common = common

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
