<template>
    <div style='display: flex;flex-direction: column;min-height: 100vh;'>
        <div class="content">
            <!--登录页面-->
            <div class="data_h " :style="{height: halfLoginIosWidth}">
                <div class="data_h_h" :style="{height: halfLoginIosWidth}"></div>
            </div>

            <div :style="{position:'relative',top:baiduHeadTop + 'px'}">

                <div class="head">
                    <img class='head_close' :src="icon_close" @tap="back" />
                    <div @tap="_register_q()">
                        注册
                    </div>
                </div>

                <!--密码登录-->
                <div class='login' v-if="landing">
                    <div class='loginType'>
                        密码登录
                    </div>

                    <div class='login_inpu'>
                        <input type="text" placeholder="请输入账号/手机号" v-model='account' placeholder-style="color:#b8b8b8" />
                        <img :src="icon_delete" v-show="account.length" @tap="clearAccount()" />
                    </div>

                    <div class='login_inpu'>
                        <input type="text" :password="loginPwdIsShow" placeholder="请输入密码" v-model='password'
                            placeholder-style="color:#b8b8b8" />
                        <img :src="loginPwdIsShow ? icon_hide_password : icon_show_password" style='height: 32rpx;width: 32rpx;right: 20rpx;bottom: 24rpx;'
                            @tap="changePwdIsShow(1)" />
                    </div>

                    <p class='login_pass' v-if="landing"><span @tap='_navigateTo("retrievepassword")'>忘记密码？</span></p>
                    <div class='button1' style='margin-top: 70rpx;' @tap="loginByPwd">登录</div>
                    <div class='button2' @tap="switchToCodeLogin">验证码登录</div>
                </div>

                <!--验证码登录-->
                <div class='login' v-if="!landing">

                    <div class='loginType'>
                        验证码登录
                    </div>

                    <div class='login_inpu'>
                        <input type="number" placeholder="请输入手机号" v-model="phone" placeholder-style="color:#b8b8b8"
                            maxlength="11" />
                        <img :src="icon_delete" v-show="phone.length" @tap="clearPhone()" />
                    </div>

                    <div class='login_inpu' style='margin-bottom: 100rpx;'>
                        <input type="number" placeholder="请输入验证码" v-model="verifyCode" placeholder-style="color:#b8b8b8"
                            maxlength="6" />
                        <p class='login_p' style='z-index: 99;position: absolute;right: 24rpx;' @tap="getVerifyCode()"
                            :class="{color : 60 > count && count > 0 || count === 0}">{{vcBtnContent}}</p>
                    </div>

                    <div class='button1' style='margin-top: 70rpx;' @tap="loginByCode">登录</div>
                    <div class='button2' @tap="switchToPwdlogin">密码登录</div>
                </div>
            </div>
        </div>
        <div class='agreement' @tap="_navigateTo('agreement')">注册/登录即代表已同意<span style="text-decoration:underline">《{{agreement1}}》</span>
        </div>
    </div>
</template>

<script>
    import {
        verifyPhone
    } from '../../common/landing.js'
    import {
        mapMutations
    } from 'vuex'
    import {
        changePwdIsShow,
        lkt_telephone,
        lkt_phone_code,
        getVerifyCode,
    } from '../../static/js/login/login.js'

    export default {
        data() {
            return {
                icon_delete: this.$common.ROOT_URL + '/static/images/icon/login/icon_delete.png',
                icon_close: this.$common.ROOT_URL + '/static/images/icon/login/icon_close.png',
                icon_show_password: this.$common.ROOT_URL + '/static/images/icon/login/icon_show_password.png',
                icon_hide_password: this.$common.ROOT_URL + '/static/images/icon/login/icon_hide_password.png',
                toHome: false,
                togoodsDetail: false,
                phone_codeStatus1: false,
                loginPwdIsShow: true,
                // 密码登录按钮状态
                pwdLoginBtnStatus: false,
                // 验证码登录按钮状态
                codeLoginBtnStatus: false,
                fastTap: true,
                // 登录账号
                account: '',
                // 登录密码
                password: '',
                // 切换密码登录和手机号码登录
                landing: true,
                // 验证码登录手机号
                phone: '',
                // 验证码
                verifyCode: '',
                // 手机号码格式验证结果
                phoneVerifyResult: '',
                vcBtnContent: '获取验证码',
                timer: null,
                // 倒计时时间
                count: '',
                landing_code: '',
                provider: '',
                agreement1: '',
                company: '',
                logo: '',
                src: false,
                fatherId: '', //父级id(分销商分享使用)
                // 百度小程序头部兼容
                baiduHeadTop: 0
            }
        },
        onLoad(option) {
            // #ifdef MP-BAIDU
            // 百度小程序头部兼容
            uni.getSystemInfo({
                success: (res) => {
                    this.baiduHeadTop = res.navigationBarHeight
                }
            })
            // #endif
            let data = {
                module: 'app',
                action: 'login',
                app: 'index'
            }
            // this.$req.post({data}).then(res => {
            //     this.agreement1 = res.Agreement
            //     this.logo = res.logo
            //     this.company = res.company  
            // })

            // 获取服务供应商
            // uni.getProvider({
            //     service: 'oauth',
            //     success: res => {
            //         this.provider = res.provider
            //     }
            // })

            if (option.landing_code) {
                this.togoodsDetail = option.landing_code
            }

            if (option.fatherId) {
                this.fatherId = option.fatherId
            }

            this.toHome = option.toHome;

            if (uni.getStorageSync('fatherId')) {
                this.fatherId = uni.getStorageSync('fatherId')
            }
            console.log('--------this.fatherId----------' + this.fatherId)
        },
        methods: {
            ...mapMutations({
                setToken: 'setToken',
                user_phone: 'SET_USER_PHONE'
            }),
            // 返回
            back() {
                if (this.toHome) {
                    uni.switchTab({
                        url: '../tabBar/home'
                    })
                } else {
                    uni.navigateBack({
                        delta: 2
                    })
                }
            },
            //to注册页面
            _register_q() {
                this.account = ''
                this.password = ''
                this.phone = ''
                this.phone_code = ''
                this.pwdLoginBtnStatus = false
                this.codeLoginBtnStatus = false
                this.phone_codeStatus1 = false
                clearInterval(this.timer)
                this.time_code = '获取验证码'
                this.timer = null
                this.count = ''

                if (this.fatherId) {
                    uni.navigateTo({
                        url: '/pages/login/register?fatherId=' + this.fatherId
                    })
                } else {
                    uni.navigateTo({
                        url: '/pages/login/register'
                    })
                }

            },

            // 清空账号
            clearAccount() {
                this.account = ''
            },

            // 情况手机号
            clearPhone() {
                this.phone = ''
            },

            // 密码是否可见 1登录密码 2注册密码 3再次输入注册密码
            changePwdIsShow(type) {
                changePwdIsShow(type, this)
            },

            // 密码登录
            loginByPwd() {
                if (!this.account || !this.password) {
                    uni.showToast({
                        title: '账号或密码不能为空',
                        duration: 1000,
                        icon: 'none'
                    })
                } else {
                    let data = {
                        storeId: this.$common.STORE_ID,
                        account: this.account,
                        password: this.password,
                        token: this.$store.state.access_id,
                        clientId: uni.getStorageSync('cid')
                    }
                    this.$user.loginByPwd(data).then(res => {
                        let {
                            responseCode,
                            responseMessage,
                            token
                        } = res
                        if (responseCode == 'LOGIN_SUCCESS' && token) {
                            uni.showToast({
                                title: '登录成功！',
                                duration: 1000,
                                icon: 'none'
                            })
                            this.setToken(token)
                            if (this.togoodsDetail) {
                                if (getCurrentPages().length > 1) {
                                    setTimeout(function() {
                                        uni.navigateBack({
                                            delta: 1
                                        })
                                    }, 1000)
                                } else {
                                    uni.switchTab({
                                        url: '../tabBar/my',
                                        success: function() {}
                                    })
                                }
                            }
                        }
                    }).catch(e => {
                        uni.showToast({
                            title: e.responseMessage,
                            duration: 1000,
                            icon: 'none'
                        })
                    })
                }
            },

            // 验证码登录
            loginByCode() {
                this.phoneVerifyResult = verifyPhone(this.phone)
                if (!this.phone) {
                    uni.showToast({
                        title: '手机号码不能为空',
                        duration: 1000,
                        icon: 'none'
                    })
                } else if (this.phoneVerifyResult != 1) {
                    uni.showToast({
                        title: '请输入正确的手机号码！',
                        duration: 1000,
                        icon: 'none'
                    })
                } else if (!this.verifyCode) {
                    uni.showToast({
                        title: '验证码不能为空',
                        duration: 1000,
                        icon: 'none'
                    })
                } else if (this.verifyCode.length != 6) {
                    uni.showToast({
                        title: '请输入完整的验证码！',
                        duration: 1000,
                        icon: 'none'
                    })
                } else {
                    let data = {
                        storeId: this.$common.STORE_ID,
                        storeType: this.$common.getStoreType(),
                        phone: this.phone,
                        verifyCode: this.verifyCode,
                        token: this.$store.state.token,
                        clientId: uni.getStorageSync('cid')
                    }
                    this.$user.loginByCode(data).then(res => {
                        let {
                            responseCode,
                            responseMessage,
                            token
                        } = res
                        if (responseCode == 'LOGIN_SUCCESS' && token) {
                            uni.showToast({
                                title: '登录成功！',
                                duration: 1000,
                                icon: 'none'
                            })
                            this.setToken(token)
                            if (this.togoodsDetail) {
                                if (getCurrentPages().length > 1) {
                                    setTimeout(function() {
                                        uni.navigateBack({
                                            delta: 1
                                        })
                                    }, 1000)
                                } else {
                                    uni.switchTab({
                                        url: '../tabBar/my',
                                        success: function() {}
                                    })
                                }
                            }
                        }
                    }).catch(e => {
                        uni.showToast({
                            title: e.responseMessage,
                            duration: 1000,
                            icon: 'none'
                        })
                    })
                }
            },

            // 获取验证码
            getVerifyCode() {
                this.phoneVerifyResult = verifyPhone(this.phone)
                // 类型: 验证码
                var type = this.$common.SMS_TEMPLATE_TYPE.VERIFY_CODE
                // 类别: 登录
                var category = this.$common.SMS_TEMPLATE_CATEGORY.LOGIN
                getVerifyCode(this, type, category)
            },

            // 密码登录to验证码登录
            switchToCodeLogin() {
                this.landing = false
                this.account = ''
                this.password = ''
            },
            // 验证码登录to密码登录
            switchToPwdlogin() {
                this.landing = true
                this.phone = ''
                this.verifyCode = ''
            },
            _navigateTo(url) {
                uni.navigateTo({
                    url
                })
            }
        },
        computed: {
            halfLoginIosWidth() {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                var he = heigh * 2
                // #ifdef MP-TOUTIAO
                const info = uni.getSystemInfoSync()
                if (info.platform != 'ios') {
                    he = 0
                }
                // #endif
                return uni.upx2px(he) + 'px'
            },
        },
    }
</script>

<style scoped>
    @import url("../../static/css/login/login.css");
</style>
