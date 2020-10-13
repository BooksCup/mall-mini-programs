import Vue from 'vue'
import App from './App'
import store from './store'

import common from './common/common.vue'

import guide from './common/api/guide.js'
import goodsClass from './common/api/goodsClass.js'
import user from './common/api/user.js'

Vue.config.productionTip = false
Vue.prototype.$guide = guide
Vue.prototype.$goodsClass = goodsClass
Vue.prototype.$user = user

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
                this.$refs.lktAuthorizeComp.handleAfterAuth(this, '/pages/login/login?landing_code=1',
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
