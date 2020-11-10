<template>
    <div class='mask' v-if="showWin">
        <div class='maskContent'>
            <div class='maskTitle'>欢迎您的到来</div>
            <div class='maskMain'>
                授权登录，获得完整购物体验.
            </div>
            <div class='maskBtn'>
                <button type="default" size="mini" @tap="closeWin">取消</button>
                <!-- #ifdef MP-ALIPAY -->
                <button open-type="getAuthorize" @tap="onGetAuthorize" size="mini" type="primary" scope='userInfo'>授权
                </button>
                <!-- #endif -->
                <!-- #ifdef MP-BAIDU -->
                <button open-type="getUserInfo" @tap="bdAuth" size="mini" type="primary">授权</button>
                <!-- #endif -->
                <!-- #ifdef MP-TOUTIAO -->
                <button open-type="getUserInfo" @tap="ttAuth" size="mini" type="primary">授权</button>
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN -->
                <button open-type="getUserInfo" @getuserinfo="bindWechatUser" type="primary" size="mini">授权</button>
                <!-- #endif -->

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showWin: false, //是否弹出授权窗

            }
        },
        props: ['login_status'], //界面传参用 login_status 父类登录状态
        methods: {
            closeWin() {
                this.showWin = false
                this.$emit('cancle')
            },

            /**
             * 认证后处理
             */
            handleAfterAuth(frompage, forwardUrl, callback, args) {
                this.weixinAuth.mp_weixin_checksession(this, frompage, callback, args)
                // var _this = this
                // var me = frompage
                // me.LaiKeTuiCommon.getLKTApiUrl().then(function() {
                //     // TODO 可能有登录过期的问题
                //     let LoingByHand = uni.getStorageSync('LoingByHand')
                //     let needRegister = uni.getStorageSync('needRegister')
                //     if (needRegister == me.LaiKeTuiCommon.LKT_NRL_TYPE.NRL && !LoingByHand) {
                //         // #ifdef MP-ALIPAY
                //         _this.LaiketuiAliAuth.laiketui_mp_alipay_check(_this, me, callback, args)
                //         // #endif
                //         // #ifdef MP-TOUTIAO
                //         _this.LaiketuiTTAuth.laiketui_mp_tt_check(_this, me, callback, args)
                //         // #endif
                //         // #ifdef MP-WEIXIN
                //         _this.LaiketuiWeixinAuth.laiketui_mp_weixin_checksession(_this, me, callback, args)
                //         // #endif
                //         // #ifdef MP-BAIDU
                //         _this.LaiketuiBDAuth.laiketui_mp_baidu_check(_this, me, callback, args)
                //         // #endif
                //     } else {
                //         _this.LaiKeTuiCommon.laikeCheckTimeout(me, forwardUrl).then(function(data) {
                //             if (data.visitor) {
                //                 uni.showToast({
                //                     title: '请登录！',
                //                     icon: 'none',
                //                     duration: 1000
                //                 })
                //                 setTimeout(function() {
                //                     if (forwardUrl) {
                //                         uni.navigateTo({
                //                             url: forwardUrl,
                //                         })
                //                     } else {
                //                         uni.navigateTo({
                //                             url: '/pages/login/login',
                //                         })
                //                     }
                //                 }, 1000)
                //             } else {
                //                 if (callback && typeof(callback) == 'function') {
                //                     if (args) {
                //                         callback(args)
                //                     } else {
                //                         callback()
                //                     }
                //                 }
                //             }
                //         })
                //     }
                // })
            },

            // 绑定微信用户
            bindWechatUser(res) {
                this.weixinAuth.bindWechatUser(res, this)
            },

            //头条授权
            ttAuth(res) {
                this.LaiketuiTTAuth.laiketui_mp_tt_userInfo(this)
            },

            //百度授权
            bdAuth(res) {
                this.LaiketuiBDAuth.laiketui_mp_baidu_userInfo(this)
            },

            //支付宝授权
            onGetAuthorize(res) {
                me.LaiketuiAliAuth.laiketui_mp_alipay_userInfo(res, this)
            }
        }
    }
</script>

<style>
    .maskContent {
        width: 90%;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 10rpx;
        padding: 40rpx 0;
    }

    .maskTitle {
        text-align: center;
        font-size: 40rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
    }

    .maskMain {
        border-bottom: 4rpx solid #EEEEEE;
        font-size: 32rpx;
        padding-bottom: 20rpx;
        text-align: center;
    }

    .maskBtn {
        display: flex;
        padding: 0 20rpx;
    }

    .maskBtn button {
        flex-grow: 1;
        margin-top: 40rpx;
        margin-right: 10rpx;
        border-radius: 5px
    }

    .aliAuthBt {
        flex-grow: 1;
        margin-top: 40rpx;
        margin-right: 10rpx;
        border-radius: 5px
    }
</style>
