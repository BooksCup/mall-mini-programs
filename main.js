import Vue from 'vue'
import App from './App'

import common from './common/common.vue'

import guide from './common/api/guide.js'
import goodsClass from './common/api/goodsClass.js'
import user from './common/api/user.js'

Vue.config.productionTip = false
Vue.prototype.$guide = guide
Vue.prototype.$goodsClass = goodsClass
Vue.prototype.$user = user

Vue.prototype.$common = common

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
