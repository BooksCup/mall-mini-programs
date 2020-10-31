import Vue from 'vue'
import App from './App'
import store from './store'

import common from './common/common.vue'

import authorize from './components/authorize.vue'
import weixinAuth from './components/auth/mpweixin/mpweixin.vue'
import uniLoadMore from './components/uni-load-more.vue'

import index from './common/api/index.js'
import guide from './common/api/guide.js'
import goodsClass from './common/api/goodsClass.js'
import goods from './common/api/goods.js'
import shop from './common/api/shop.js'
import user from './common/api/user.js'
import verifyCode from './common/api/verifyCode.js'

Vue.config.productionTip = false

Vue.prototype.authorize = authorize
Vue.prototype.weixinAuth = weixinAuth

Vue.prototype.$index = index
Vue.prototype.$guide = guide
Vue.prototype.$goodsClass = goodsClass
Vue.prototype.$goods = goods
Vue.prototype.$shop = shop
Vue.prototype.$user = user
Vue.prototype.$verifyCode = verifyCode

Vue.component('authorize', authorize)
Vue.component('uniLoadMore', uniLoadMore)

Vue.prototype.$common = common

Vue.prototype.$store = store

App.mpType = 'app'

// let statusBarHeight = getStatusBarHeight()

Vue.mixin({
    data() {
        return {
            access_id: Vue.prototype.$store.state.access_id || uni.getStorageSync('access_id')
        }
    },
    created() {
        // #ifdef H5
        window.onbeforeunload = function() {
            window.scrollTo(0, 0);
        }
        // #endif
    },
    onLoad: function(option) {
        // #ifdef H5
        jssdk_share(this, option)
        // #endif
    },
    computed: {
        // halfWidth () {
        //     return `${statusBarHeight}px`
        // }
    },
    methods: {
        // 检测登录
        isLogin(callback) {
            this.$nextTick(() => {
                this.$refs.authorizeComp.handleAfterAuth(this, '/pages/login/login?landing_code=1',
                    function() {
                        callback && callback()
                    });
            })
        },
        guid() {
            return guid();
        },
        navTo(url, checkLogin = false, me = null) {
            return navigator.to(url, checkLogin, me)
        },
        navToHome() {
            return navigator.toHome()
        },
        navBack() {
            return navigator.back()
        },
        navSwitchTab(url) {
            return navigator.switchTab(url)
        }
    }
})

const app = new Vue({
    ...App
})
app.$mount()
