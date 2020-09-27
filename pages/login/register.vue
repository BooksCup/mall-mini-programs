<template>
    <div style='display: flex;flex-direction: column;min-height: 100vh;'>
        <div class="content">
            <div class="data_h " :style="{height: halfWidth}">
                <div class="data_h_h" :style="{height: halfWidth}"></div>
            </div>
            <!--注册页面-->
            <div :style="{position:'relative',top:baiduHeadTop + 'px'}">

                <div class="head">
                    <img class='head_close' :src="icon_close" @tap="back" />
                    <div @tap="_landing_q()">
                        登录
                    </div>
                </div>

                <div class='loginType'>
                    注册
                </div>

                <div class='login'>
                    <!-- 账号 -->
                    <div class='login_inpu'>
                        <input placeholder-style="color:#b8b8b8" type="text" placeholder="请输入账号（6-15位字母或数字）" v-model="userName" />
                        <img :src="icon_delete" v-show="userName.length" @tap="clearUserName()" />
                    </div>

                    <!-- 密码 -->
                    <div class='login_inpu'>
                        <input placeholder-style="color:#b8b8b8" type="text" :password="pwdIsShow" placeholder="请输入6-16位数的新密码"
                            v-model="pwd" />
                        <img :src="pwdIsShow ? icon_hide_password : icon_show_password" class="login-inpu-img" @tap="changePwdIsShow(2)" />
                    </div>

                    <!-- 再次输入密码 -->
                    <div class='login_inpu'>
                        <input placeholder-style="color:#b8b8b8" type="text" :password="confirmPwdIsShow" placeholder="请再次输入密码"
                            v-model="confirmPwd" />
                        <img :src="confirmPwdIsShow ? icon_hide_password : icon_show_password" class="login-inpu-img"
                            @tap="changePwdIsShow(3)" />
                    </div>

                    <!-- 手机号 -->
                    <div class='login_inpu'>
                        <input placeholder-style="color:#b8b8b8" type="number" placeholder="请输入手机号" v-model="phone"
                            maxlength="11" />
                    </div>

                    <!-- 验证码 -->
                    <div class='login_inpu regCode'>
                        <input class='flex1' placeholder-style="color:#b8b8b8" type="number" placeholder="请输入验证码"
                            v-model="verifyCode" maxlength="6" />
                        <p class='login_p login-inpu-p' @tap="getVerifyCode()" :class="{color : 61 > count && count > 0 || count === 0}">{{vcBtnContent}}</p>
                    </div>

                </div>

                <div style='padding: 0 40rpx;'>
                    <div class='button1 button-top' @tap='register'>注册</div>
                    <!-- <div class='button1 button-top button-opacity' v-else>注册</div> -->
                </div>

            </div>
        </div>
        <!-- 协议 -->
        <div class='agreement' @tap="_navigateTo('agreement')">注册/登录即代表已同意<span style="text-decoration:underline">《{{Agreement}}》</span>
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
        getVerifyCode,
    } from '../../static/js/login/login.js'

    export default {
        data() {
            return {
                icon_delete: this.$common.ROOT_URL + '/static/images/icon/login/icon_delete.png',
                icon_close: this.$common.ROOT_URL + '/static/images/icon/login/icon_close.png',
                icon_show_password: this.$common.ROOT_URL + '/static/images/icon/login/icon_show_password.png',
                icon_hide_password: this.$common.ROOT_URL + '/static/images/icon/login/icon_hide_password.png',
                userName: '',
                toHome: false,
                pwdIsShow: true,
                confirmPwdIsShow: true,
                fastTap: true,
                pwd: '',
                confirmPwd: '',
                // 验证码登录手机号
                phone: '',
                // 验证码
                verifyCode: '',
                // 手机号码格式验证结果
                phoneVerifyResult: '',
                // 验证码按钮内容
                vcBtnContent: '获取验证码',
                timer: null,
                // 倒计时时间
                count: '',
                // 返回
                flag: true,
                fatherId: '', //父级id(分销商分享使用)
                baiduHeadTop: 0, // 百度小程序头部高度兼容
                Agreement: ''
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

            if (option.fatherId) {
                this.fatherId = option.fatherId
            }

            let data = {
                module: 'app',
                action: 'login',
                app: 'index',
            }
            this.$req.post({
                data
            }).then(res => {
                if (res.code == 200) {
                    this.Agreement = res.Agreement
                }
            })
        },
        methods: {
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
            // 到登录页面
            _landing_q() {
                this.userName = ''
                this.flag = false
                this.phone = ''
                this.verifyCode = ''
                this.pwd = ''
                this.confirmPwd = ''
                clearInterval(this.timer)
                this.vcBtnContent = '获取验证码'
                this.timer = null
                this.count = ''
                this.flag = true
                uni.navigateBack({
                    delta: 1
                })
            },
            // 清空登录账号 
            clearUserName(val) {
                this.userName = ''
            },
            // 密码是否可见 1登录密码 2注册密码 3再次输入注册密码
            changePwdIsShow(type) {
                changePwdIsShow(type, this)
            },
            // 获取验证码
            getVerifyCode() {
                this.phoneVerifyResult = verifyPhone(this.phone)
                // 类型: 验证码
                var type = this.$common.SMS_TEMPLATE_TYPE.VERIFY_CODE
                // 类别: 注册
                var category = this.$common.SMS_TEMPLATE_CATEGORY.REGISTER
                getVerifyCode(this, type, category)
            },
            // 注册
            register() {
                // 账号
                if (!this.userName) {
                    uni.showToast({
                        title: '账号不能为空！',
                        duration: 1000,
                        icon: 'none'
                    })
                    return
                } else {
                    let re = /^[a-z0-9]{6,15}$/i
                    let result = re.test(this.userName)
                    if (!result) {
                        uni.showToast({
                            title: '请输入6-15位数字或字母账号！',
                            duration: 2000,
                            icon: 'none'
                        })
                        return
                    }
                }

                // 密码
                if (!this.pwd) {
                    uni.showToast({
                        title: '密码不能为空！',
                        duration: 1000,
                        icon: 'none'
                    })
                    return
                } else {
                    var re = /^[a-z0-9]{6,15}$/i
                    var result = re.test(this.pwd)
                    if (!result) {
                        uni.showToast({
                            title: '请输入6-15位数字或字母密码！',
                            duration: 3000,
                            icon: 'none'
                        })
                        return
                    }
                }

                // 确认密码
                if (!this.confirmPwd) {
                    uni.showToast({
                        title: '确认密码不能为空！',
                        duration: 1000,
                        icon: 'none'
                    })
                    return
                } else {
                    if (this.pwd != this.confirmPwd) {
                        uni.showToast({
                            title: '确认密码与密码不一致',
                            duration: 1000,
                            icon: 'none'
                        })
                        return
                    }
                }

                // 手机号
                if (!this.phone) {
                    uni.showToast({
                        title: '手机号码不能为空！',
                        duration: 1000,
                        icon: 'none'
                    })
                    return
                } else {
                    this.phoneVerifyResult = verifyPhone(this.phone)
                    if (this.phoneVerifyResult != 1) {
                        uni.showToast({
                            title: '请输入正确的手机号码！',
                            duration: 1000,
                            icon: 'none'
                        })
                        return
                    }
                }

                // 验证码
                if (!this.verifyCode) {
                    uni.showToast({
                        title: '验证码不能为空',
                        duration: 1000,
                        icon: 'none'
                    })
                    return
                } else {
                    if (this.verifyCode.length != 6) {
                        uni.showToast({
                            title: '请输入完整的验证码！',
                            duration: 1000,
                            icon: 'none'
                        })
                        return
                    }
                }

                if (!this.fastTap) {
                    return
                }
                let data = {
                    storeId: this.$common.STORE_ID,
                    storeType: this.$common.getStoreType(),
                    phone: this.phone,
                    password: this.pwd,
                    access_id: this.$store.state.access_id,
                    verifyCode: this.verifyCode,
                    userName: this.userName
                }
                this.$user.register(data).then(res => {
                    this.fastTap = true
                }).catch(e => {
                    this.fastTap = true
                    uni.showToast({
                        title: e.responseMessage,
                        duration: 1000,
                        icon: 'none'
                    })
                })
            },
            _navigateTo(url) {
                uni.navigateTo({
                    url
                })
            },
            ...mapMutations({
                set_access_id: 'SET_ACCESS_ID',
                user_phone: 'SET_USER_PHONE'
            })
        },
    }
</script>

<style scoped>
    @import url("../../static/css/login/register.css");
</style>
