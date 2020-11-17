import pay from './pay'
import bargain from './bargain'
import seckill from './seckill'
import bidding from './bidding'

export default {
    mixins: [pay,bargain, seckill, bidding],
    data () {
        return {
            // 支付方式
            // 订单信息
            total: 0, // 订单总价, 计算方式， （商品总价 + 满减优惠 + 优惠券金额 ） * 分销折扣 * 等级折扣  + 运费
            products_total: 0, // 产品总价
            freight: 0, // 订单运费
            freightt: '0', // 订单运费显示的价格，是字符串类型
            coupon_money: 0, //优惠券金额
            reduce_money: 0, // 砍价金额
            discount: 1, // 分享折扣
            grade_rate: 1, // 会员等级折扣
            sNo: '', //订单编号

            // 用户相关信息
            user_money: 0, // 用户余额

            fastTap: false, // 防止重复点击

            buy_again: false,//是否为再次购买 true 是  false 否

            order_pay_info: null, // 订单json格式化后的订单信息 order_id, sNo,total

            order_type: 'type_',

            pay_name: '', // pt 普通商品,jp 竞拍商品
            
            // 地址
            is_express: true, // 地址是否快递
            shop_status: false,
            shop_address_id: '',
            shop_list: {
                address: '',
                id: 0,
                mobile: '',
                name: ''
            },
            address_id: '',
            hc_address_id: '',
            address: {
                name: ''
            },
            adds_f: false, //地址状态
            remarks: ''
        }
    },
    computed: {
        shop_id () {
            if (this.pro instanceof Array && this.pro.length > 0) {
                return this.pro[0].shop_id
            } else {
                return 0;
            }
        }
    },
    created () {
        // #ifdef H5
        if (this.code === '') {
            let storage = window.localStorage
            storage.removeItem('bargain')
            storage.removeItem('bargain_id')
            storage.removeItem('order_no')
            storage.removeItem('product')
            uni.removeStorageSync('bargain')
            this._toUrl()
        }
        // #endif  
    },
    beforeDestroy () {
        this.$store.state.order_id = ''
        uni.removeStorageSync('goodsInfo')
        uni.removeStorageSync('bargain')
        this.$store.state.cart_id = ''
        if (!this.bargain && this.pay_name !== 'jp') {

            let data = {
                module: 'app',
                app: 'leave_Settlement',
                action: 'order',
                order_list: this.order_pay_info,
                price: this.total
            }
            //离开界面的时候去生成订单
            this.$req.post({ data })

            if (this.buy_again) {
                let data = {
                    module: 'app',
                    app: 'del_cart',
                    action: 'order',
                    cart_id: this.cart_id
                }
                this.$req.post({ data })
            }
            this.$store.state.cart_id = ''
        }

    },
    destroyed () {
        if (uni.getStorageSync('chooseAddress')) {
            uni.removeStorageSync('chooseAddress')
        }
    },
    watch: {
        total () {
            this.order_pay_info = JSON.stringify({
                total: Number.parseFloat(this.total),
                order_id: this.order_id,
                sNo: this.sNo
            })
        },
        address_id (n, o) {
            if (o) {
                this._axios('address')
            }
        },
        coupon_money () {
            this.total = ((this.products_total - this.coupon_money - this.reduce_money) * this.discount * this.grade_rate + this.freight).toFixed(2)
        },
        freight () {
            this.total = ((this.products_total - this.coupon_money - this.reduce_money) * this.discount * this.grade_rate + this.freight).toFixed(2)
        }
    },
    methods: {
        /**
         * 点击立即支付按钮触发
         * @returns {Promise<boolean>}
         */
        async order_pay () {
            if (!this.address_id) {
                return uni.showToast({
                    title: '请先设置收货地址',
                    icon: 'none'
                })
            }
            
            if (this.fastTap) return false
            this.fastTap = true

            this._checkSelectPayWay()

            // #ifdef MP-WEIXIN
            uni.showLoading({
                title: '请稍等..'
            })
            wx.requestSubscribeMessage({
                tmplIds: this.tmplIds,
                complete:async () => {
                    uni.hideLoading()
                    if (this.useWallet) {
                        if (!this.sNo) {
                            await this._getPayOrderInfo()
                        }
                        this._orderUseWalletPay()
                        
                    } else {
                        uni.showLoading({
                            title: '正在请求支付...',
                            mask: true,
                        })
                        await this._getPayOrderInfo()
                        await this._notUserWalletPay()
                    }
                }
            })
            // #endif

            // #ifndef MP-WEIXIN
            if (this.useWallet) {
                if (!this.sNo) {
                    await this._getPayOrderInfo()
                }
                this._orderUseWalletPay()
            } else {
                uni.showLoading({
                    title: '正在请求支付...',
                    mask: true,
                })
                await this._getPayOrderInfo()
                await this._notUserWalletPay()
            }
            // #endif

        },
        /**
         * 取得请求支付所需的 pay_order_info
         * @returns {Promise<void>}
         * @private
         */
        async _getPayOrderInfo () {
            let postData = {
                module: 'app',
                action: 'order',
                app: 'payment',
                cart_id: this.cart_id,
                address_id: this.address_id,
                coupon_id: this.coupon_id,
            }
            if (this.bargain) {
                postData = this.getBargainPayOrderInfo()
            } else if (this.seckill) {
                postData = this.getSeckillPayOrderInfo()
            } else if (this.pay_name === 'jp') {
                postData = this.getJPPayOrderInfo()
            } else if (this.is_distribution == 1) {
                postData.type = 'FX'
            }

            if (this.cpId) {
                postData.product = this.cpId
                postData.cart_id = ''
            }

            if (!this.is_express) {
                postData.shop_address_id = this.shop_address_id
            }

            let { pay_type, store_type } = this.getPayTypeAndStoreType()
            postData.pay_type = pay_type
            postData.store_type = store_type

            let {
                data,
                code,
                msg,
                status
            } = await this.$req.post({ data: postData })
            if (status !== 1) {
                if (code !== 200) {
                    uni.showToast({
                        title: msg,
                        duration: 1500,
                        icon: 'none'
                    })
                    this.pay_display = false
                    return Promise.reject()
                } else {
                    uni.showToast({
                        title: '未知错误',
                        duration: 1500,
                        icon: 'none'
                    })
                    this.pay_display = false
                    return Promise.reject()
                }
            }
            
            this.sNo = data.sNo;
            this.order_pay_info = JSON.stringify({ ...data })
        },
        async _notUserWalletPay () {
            if (this.wxPayStatue) {
                this.pay_type = 'wx'
            } else if (this.aliPayStatue) {
                this.pay_type = 'ali'
            } else if (this.baidupayStatue) {
                this.pay_type = 'baidu'
            }
            await this.clientTransferPay()
        },
        /**
         * 取得调用支付的所需订单信息
         * @param pay_type
         * @returns {Promise<*>}
         */
        async getPaymentData () {
            let data = {
                module: 'app',
                action: 'pay',
                total: this.total,
                remarks: this.remarks,
                sNo: this.sNo,
                title: this.payTitle,
                order_list: this.order_pay_info
            }

            let { type, code, store_type } = await this.getOrderInfoExt()
            data.type = type
            data.code = code
            data.store_type = store_type

            let auth_code = await this.LaiKeTuiCommon.getMPAliAuthCode()
            if (auth_code) {
                // #ifdef MP-ALIPAY
                data.alimp_authcode = auth_code
                // #endif
                // #ifdef MP-TOUTIAO
                data.tt_authcode = auth_code
                // #endif
            }

            return await this.$req.post({ data })
        },
        /**
         * 显示钱包余额支付的密码输入框
         * @returns {boolean}
         * @private
         */
        _orderUseWalletPay () {
            if (this.total > this.user_money) {
                uni.showToast({
                    title: '金额不足以支付商品价格!',
                    icon: 'none',
                    duration: 1500
                })
                this.fastTap = false
                return false
            }
            this.pay_display = true
        },
        /**
         * 检测
         * @private
         */
        _checkSelectPayWay () {
            if (!this.useWallet && !this.wxPayStatue && !this.aliPayStatue && !this.baidupayStatue) {
                uni.showToast({
                    title: '请选择支付方式！',
                    duration: 1000,
                    icon: 'none'
                })
            }
            this.fastTap = false
        },
        /**
         * 微信JSAPI支付获取code值
         */
        _toUrl () {
            let locationUrl = window.location.href
            var storage = window.localStorage;
            storage['bindding_num'] = this.bind_id
            storage['address_id'] = this.address_id
            
            let data = {
                type: 'jsapi_wechat',
                app: 'get_config',
                module: 'app',
                action: 'commcenter',
                url: locationUrl
            }

            this.$req.post({data}).then(res => {
                if (res.code === 200) {
                    let myappid = res.data.config.appid
                    this.myappid = myappid
                    let myUrl = res.data.url
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + myappid +
                        '&redirect_uri=' + myUrl +
                        '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            })
        },
    },
}
