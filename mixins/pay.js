import { later } from '@/common/util'

const PAY_TYPE = {
    ALI: 'ali',
    WX: 'wx',
    BAIDU: 'baidu'
}

export default {
    data () {
        return {
            open_wallet: false, // 是否开启钱包支付
            open_wxpay: false, // 是否开启微信支付
            open_alipay: false, // 是否开启支付宝支付
            open_baidu: false, // 是否开启百度支付

            wxPayStatue: false, // 是否选中微信支付
            useWallet: false, // 是否选中钱包余额支付
            aliPayStatue: false, // 是否选中支付宝支付
            baidupayStatue: false, // 是否选中百度支付
            pay_display: false, // 显示余额支付密码框
            password_status: false, // 显示余额支付密码框
            pay_password: '', // 支付密码
            enterless: true, // true,密码错误，还能继续输入， false 密码错误达到上限
            payTitle: '', // 
            fastTap: false, //重复点击

            payment: {
                jsapi_wechat: 0, // h5 微信支付
                mini_wechat: 0, // 小程序微信支付
                app_wechat: 0,
                alipay: 0,
                alipay_minipay: 0,
                tt_alipay: 0,
                wallet_pay: 0,
            },

            pay_type: '', // 支付方式 PAY_TYPE
            myappid: '', // 微信APPID
            code: '', // 微信授权 code
        }
    },
    created () {
        // #ifdef H5 
        // H5打开微信支付
        let a = window.location.href
        if (a.split('?').length > 1) {
            let str = a.split('?')[1]
            let arr = str.split('&')
            for (let i in arr) {
                if (typeof arr[i] === 'string') {
                    if (arr[i].substring(0, 4) === 'code') {
                        str = arr[i].substring(5)
                        this.code = str
                    }
                }
            }
        }
        // #endif    
    },
    methods: {
        /**
         * 客户端调用支付
         * @returns {Promise<void>}
         */
        async clientTransferPay () {
            let paymentData = await this.getPaymentData()
            console.log(paymentData);
            let providerStr = ''
            if (this.pay_type === PAY_TYPE.WX) {
                providerStr = 'wxpay'
            } else if (this.pay_type === PAY_TYPE.ALI) {
                providerStr = 'alipay'
            }
            uni.hideLoading()
            // #ifdef H5
            this._h5_pay(paymentData)
            // #endif
            // #ifdef MP-WEIXIN
            this._wechat_mini_pay(paymentData)
            // #endif
            // #ifdef APP-PLUS 
            this._app_pay(providerStr, paymentData)
            // #endif
            // #ifdef MP-ALIPAY
            this._ali_mini_pay(paymentData)
            // #endif
            // #ifdef MP-TOUTIAO
            this._tt_pay(paymentData)
            // #endif
            // #ifdef MP-BAIDU
            this._baidu_pay(paymentData)
            // #endif
        },
        _baidu_pay (paymentData) {
            swan.requestPolymerPayment({
                orderInfo: {
                    'dealId': paymentData.data.dealId,					// 后台配置
                    'appKey': paymentData.data.appKey,					// 后台配置
                    'totalAmount': paymentData.data.totalAmount,			// 订单金额
                    'tpOrderId': paymentData.data.tpOrderId,				// 商户平台自己记录的订单ID
                    'dealTitle': paymentData.data.dealTitle,				// 订单的名称
                    'signFieldsRange': paymentData.data.signFieldsRange,	// 固定值1
                    'rsaSign': paymentData.data.rsaSign,					// 对appKey+dealId+tpOrderId+totalAmount进行RSA加密后的签名，防止订单被伪造
                    'bizInfo': paymentData.data.bizInfo					// 订单详细信息
                },
                success: () =>{
                    uni.showToast({
                        title: '支付成功！',
                        duration: 1000,
                        icon: 'none',
                    })

                    setTimeout( () => {
                        uni.setStorageSync('payRes', this.order_pay_info)
                        uni.redirectTo({
                            url: '/pages/pay/payResult'
                        })
                        this.pay_display = false
                    }, 1000)
                },
                fail: () => {
                    this._pay_fail()
                }
            })
        },
        /**
         * 头条支付
         * @param paymentData
         * @private
         */
        _tt_pay (paymentData) {
            tt.requestPayment({
                data: paymentData.data,
                success: () => {
                    uni.showToast({
                        title: '支付成功！',
                        duration: 1000,
                        icon: 'none',
                    })
                    setTimeout( () => {
                        uni.setStorageSync('payRes', this.order_pay_info)
                        uni.redirectTo({
                            url: '/pages/pay/payResult'
                        })
                        this.pay_display = false
                    }, 1000)
                },
                fail: () => {
                    this._pay_fail()
                }
            })
        },
        /**
         * 阿里小程序支付
         * @param paymentData
         * @private
         */
        _ali_mini_pay (paymentData) {
            my.tradePay({
                tradeNO: paymentData,
                success: (res) => {
                    if (res.resultCode === 9000) {
                        uni.showToast({
                            title: '支付成功',
                            icon: 'none'
                        })
                        setTimeout( () => {
                            uni.setStorageSync('payRes', this.order_pay_info)
                            uni.redirectTo({
                                url: '/pages/pay/payResult'
                            })
                            this.pay_display = false
                        }, 1000)
                    } else if (res.resultCode === 6001) {
                        setTimeout( () => {
                            this._pay_fail()
                        }, 1000)
                    }
                },
                fail: (res) => {
                    uni.showToast({
                        title: res.memo,
                        icon: 'none'
                    })
                    setTimeout( () => {
                        this._pay_fail()
                    }, 1000)
                },
            })
        },
        /**
         * app 支付
         * @param providerStr
         * @param paymentData
         * @private
         */
        _app_pay (providerStr, paymentData) {
            uni.requestPayment({
                provider: providerStr,
                orderInfo: paymentData, //订单数据
                success: () => {
                    uni.showToast({
                        title: '支付成功！',
                        duration: 1000,
                        icon: 'none',
                    })
                    setTimeout( () => {
                        uni.setStorageSync('payRes', this.order_pay_info)
                        uni.redirectTo({
                            url: '/pages/pay/payResult'
                        })
                        this.pay_display = false
                    }, 1000)
                },
                fail: (err) => {
                    console.log(err)
                    this._pay_fail()
                },
                complete: () => {
                    this.loading = false
                }
            })
        },
        /**
         * 小程序支付
         * @param paymentData
         * @private
         */
        _wechat_mini_pay (paymentData) {
            this.loading = true
            uni.requestPayment({
                timeStamp: paymentData.timeStamp,
                nonceStr: paymentData.nonceStr,
                package: paymentData.package,
                signType: 'MD5',
                paySign: paymentData.paySign,
                success: () => {
                    uni.showToast({
                        title: '支付成功！',
                        duration: 1000,
                        icon: 'none'
                    })
                    setTimeout(() => {
                        uni.setStorageSync('payRes', this.order_pay_info)
                        uni.redirectTo({
                            url: '/pages/pay/payResult'
                        })
                    }, 1000)
                },
                fail: (err) => {
                    console.log(err)
                    this._pay_fail()
                },
                complete: () => {
                    this.loading = false
                }
            })
        },
        /**
         * h5 支付
         * @param paymentData
         * @private
         */
        _h5_pay (paymentData) {
            if (this.pay_type === PAY_TYPE.ALI) {
                window.location.href = uni.getStorageSync('endurl') + 'order/' + this.sNo + '_alipay.html'
            } else {
                let me = this

                // TODO 这里的me 不知道怎么去除
                function onBridgeReady () {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            'appId': paymentData.appid, //公众号名称，由商户传入     
                            'timeStamp': paymentData.timeStamp, //时间戳，自1970年以来的秒数     
                            'nonceStr': paymentData.nonceStr, //随机串     
                            'package': paymentData.package,
                            'signType': paymentData.signType, //微信签名方式：     
                            'paySign': paymentData.paySign //微信签名 
                        },
                        function (res) {
                            me.code = ''
                            //支付成功
                            if (res.err_msg === 'get_brand_wcpay_request:ok') {
                                uni.setStorageSync('payRes', me.order_pay_info)
                                window.location.href = uni.getStorageSync('h5_url') + 'pages/pay/payResult'
                            } else {
                                //支付失败
                                me._pay_fail()
                            }
                        }
                    )
                }

                if (typeof WeixinJSBridge !== 'undefined') {
                    onBridgeReady(paymentData)
                } else {
                    if (typeof WeixinJSBridge === 'undefined') {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                        }
                    }
                }
            }

        },
        async getOrderInfoExt () {
            let data = {
                type: '',
                code: '',
                store_type: 1
            }
            // #ifdef H5
            if (this.pay_type === PAY_TYPE.WX) {
                data.type = 'jsapi_wechat'
                data.code = this.code
            } else if (this.pay_type === PAY_TYPE.ALI) {
                data.type = 'alipay_mobile'
            }
            // #endif

            // #ifndef H5
            if (this.pay_type === PAY_TYPE.WX) {

                // #ifdef MP-WEIXIN

                return new Promise(resolve => {
                    uni.login({
                        success: (e) => {
                            data.type = 'mini_wechat'
                            data.code = e.code
                            return resolve(data)
                        }
                    })
                })
                // #endif   

                // #ifdef APP
                data.type = 'app_wechat'
                // #endif    

            } else if (this.pay_type === PAY_TYPE.ALI) {
                data.type = 'alipay'
                // #ifdef MP-ALIPAY
                data.type = 'alipay_minipay'
                data.store_type = 1
                // #endif
                // #ifdef MP-TOUTIAO
                data.type = 'tt_alipay'
                data.store_type = 1
                // #endif
            } else if (this.pay_type === PAY_TYPE.BAIDU) {
                // #ifdef MP-BAIDU
                data.type = 'baidu_pay'
                data.store_type = 1
                // #endif
            }
            // #endif 
            return data
        },
        /**
         * 显示能支付方式
         */
        show_pay_way () {
            // #ifdef H5
            if (this.payment.jsapi_wechat) {
                this.open_wxpay = true
            }
            // #endif

            // #ifdef MP-WEIXIN
            if (this.payment.mini_wechat) {
                this.open_wxpay = true
            }
            // #endif

            // #ifdef APP-PLUS
            if (this.payment.app_wechat) {
                this.open_wxpay = true
            }
            if (this.payment.alipay) {
                this.open_alipay = true
            }
            if (this.payment.baidu_pay) {
                this.open_baidu = true
            }
            // #endif

            // #ifdef MP-BAIDU
            if (this.payment.baidu_pay) {
                this.open_baidu = true
            }
            // #endif

            // #ifdef MP-ALIPAY
            if (this.payment.alipay_minipay) {
                this.open_alipay = true
            }
            // #endif

            // #ifdef MP-TOUTIAO
            if (this.payment.tt_alipay) {
                this.open_alipay = true
            }
            // #endif

            if (this.payment.wallet_pay) {
                this.chooseWay('balance')
                this.open_wallet = true
                this.useWallet = true

            }
        },
        /**
         * 选择支付方式
         * @param way
         */
        chooseWay (way) {
            switch (way) {
                case 'wxPay':
                    this._chooseWxPayWay()
                    break
                case 'aliPay':
                    this._chooseAlipayPayWay()
                    break
                case 'baidu':
                    this._chooseBaiduPayWay()
                    break
                case 'balance':
                    this._chooseBalancePayWay()
                    break
                default:
                    break
            }
        },
        /**
         * 选择微信支付方式
         */
        _chooseWxPayWay () {
            this.useWallet = false
            this.wxPayStatue = true
            this.aliPayStatue = false
            this.baidupayStatue = false
        },
        /**
         * 选择支付宝支付方式
         */
        _chooseAlipayPayWay () {
            if (!this.aliPayStatue) {
                this.useWallet = false
                this.wxPayStatue = false
                this.aliPayStatue = true
                this.baidupayStatue = false
            } else {
                this.aliPayStatue = false
            }
        },
        /**
         * 选择百度支付方式
         */
        _chooseBaiduPayWay () {
            this.useWallet = false
            this.wxPayStatue = false
            this.aliPayStatue = false
            this.baidupayStatue = true
        },
        /**
         * 选择余额支付方式
         */
        _chooseBalancePayWay () {
            this.useWallet = true
            this.wxPayStatue = false
            this.aliPayStatue = false
            this.baidupayStatue = false
        },
        /**
         * 支付失败
         * @private
         */
        _pay_fail () {
            uni.showModal({
                title: '提示',
                content: '支付失败,查看订单详情',
                success: res => {
                    this.fastTap = false
                    // #ifdef H5
                    if (res.confirm) {
                        window.location.href = uni.getStorageSync('h5_url') + 'pages/order/myOrder?status=1'
                    } else if (res.cancel) {
                        window.location.href = uni.getStorageSync('h5_url') + 'pages/tabBar/home'
                    }
                    // #endif

                    // #ifndef H5
                    if (res.confirm) {
                        uni.redirectTo({
                            url: '/pages/order/myOrder'
                        })
                    } else if (res.cancel) {
                        uni.switchTab({
                            url: '/pages/tabBar/home'
                        })
                    }
                    // #endif
                }
            })
        },
        /**
         * 余额支付时取消支付密码
         */
        wallet_pay_cancel () {
            if (this.fastTap) return false
            this.pay_display = false
            this.pay_password = ''
            this._pay_fail()
        },
        /**
         * 验证支付密码是否正确
         * @param pay_password
         * @returns {boolean}
         */
        check_pay_password (pay_password) {
            if (!this.enterless) {
                uni.showToast({
                    title: '密码错误次数达到上限上限，请明日再来',
                    icon: 'none',
                })
                return false
            }
            this.pay_password = pay_password

            let data = {
                module: 'app',
                action: 'user',
                app: 'payment_password',
                password: pay_password
            }

            this.$req.post({ data }).then(async res => {
                let { code, enterless } = res
                if (code === 200) {
                    this.pay_display = false
                    uni.showLoading({
                        title: '正在支付...',
                        mask: true,
                    })
                    await this._wallet_pay()
                    uni.hideLoading()
                } else if (enterless) {
                    this.pay_password = ''
                    uni.hideLoading()
                    uni.showToast({
                        title: '您输入密码错误,请重新输入',
                        duration: 1000,
                        icon: 'none'
                    })
                    this.enterless = enterless
                } else if (!enterless) {
                    uni.hideLoading()
                    this.enterless = false
                }
            })
        },
        /**
         * 余额支付
         * @returns {Promise<void>}
         * @private
         */
        async _wallet_pay () {
            let postData = {
                module: 'app',
                action: 'pay',
                app: 'wallet_pay',
                m: 'wallet_pay',
                type: 'wallet_pay',
                address_id: this.address_id ? this.address_id : this.addre_id,
                order_list: this.order_pay_info,
                remarks: this.remarks,
                payment_money: this.total
            }


            if (this.bargain) {
                postData = this.getBargainWalletPayData(postData)
            } else if (this.seckill) {
                postData = this.getSeckillWalletPayData(postData)
            } else if (this.pay_name === 'jp') {
                postData = this.getJPWalletPayData(postData)
            }

            if (!this.is_express) {
                postData.shop_address_id = this.shop_address_id
            }
            
            let {  code, message } = await this.$req.post({ data: postData })
            uni.hideLoading()
            if (code === 0) {
                uni.showToast({
                    title: message,
                    duration: 1000,
                    icon: 'none'
                })
                return false;
            }
            
            uni.showToast({
                title: '支付成功！',
                duration: 1000,
                icon: 'none'
            })
            await later(1000)
            uni.setStorageSync('payRes', this.order_pay_info)
            uni.redirectTo({
                url: '/pages/pay/payResult'
            })
        },
        /**
         * 取得支付时的支付类型和终端类型
         * @returns {{pay_type: string, store_type: number}}
         */
        getPayTypeAndStoreType () {
            let data = {
                pay_type: '',
                store_type: 1,
            }
            if (this.wxPayStatue) {
                // #ifdef MP-WEIXIN
                data.pay_type = 'mini_wechat'
                data.store_type = 1
                // #endif
                //#ifdef APP-PLUS
                data.pay_type = 'app_wechat'
                data.store_type = 2
                // #endif
                //#ifdef H5
                data.pay_type = 'jsapi_wechat'
                data.store_type = 2
                // #endif
            } else if (this.aliPayStatue) {
                // #ifdef MP-ALIPAY
                data.pay_type = 'alipay_minipay'
                data.store_type = 1
                // #endif
                //#ifdef APP-PLUS
                data.pay_type = 'aliPay'
                data.store_type = 2
                // #endif
                //#ifdef MP-TOUTIAO
                data.pay_type = 'tt_alipay'
                data.store_type = 1
                this.tt_alipay_app = true
                // #endif
            } else if (this.baidupayStatue) {
                // #ifdef MP-BAIDU
                data.pay_type = 'baidu_pay'
                data.store_type = 1
                // #endif
            }
            return data
        }
    },
    watch: {
        enterless (val) {
            if (val) {
                this.fastTap = true
                this.pay_display = false
                uni.showToast({
                    title: '你输入的错误次数已达当日上限，请使用其它支付方式进行付款',
                    duration: 1000,
                    icon: 'none'
                })
            }
        }
    }
}
