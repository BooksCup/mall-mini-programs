<template>
    <div class="cart_f pages-pay-orderDetailsr" ref='cart'>
        <heads :title='title' :returnR='returnR'></heads>

        <paymodel @cancel="wallet_pay_cancel" @success="check_pay_password" v-model="pay_display" />


        <div class="skeleton" v-if="!load">
            <div class="order_detail" style="height: 100vh;">
                <div style="height: 77px;" class="skeleton-rect"></div>

                <!--灰色间隔-->
                <div class="yh-line"></div>
                <!--商品列表-->
                <div v-if="pay_name!='jp'">
                    <ul>
                        <li class='storeLi'>
                            <div style="height: 20px" class="skeleton-rect">
                                <img :src="icon_store" class="yh-storeLi-imga">
                                <span class="">店铺名称</span>
                                <img :src="icon_right_arrow" class="yh-jiantou-img">
                            </div>

                        </li>
                        <li class='goods'>
                            <img class="skeleton-rect" src="" />
                            <div class='goods_right'>
                                <p class="skeleton-rect">商品标题商品标题商品标题商品标题商品标题</p>
                                <div class='goods_bottom'>
                                    <p style="width: 60px;" class="skeleton-rect"><span class="yh-goods_bottom-span">￥</span>99.99</p>

                                    <div class='format skeleton-rect'>
                                        <p class="yh-format-p">
                                            规格：M 四字规格</p>
                                        <p class="yh-format-pa">x1</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <div class="yh-items"></div>
                    </ul>
                </div>

                <ul v-if="pay_name=='jp'">
                    <li class='goods'>
                        <img class="skeleton-rect" src="" />
                        <div class='goods_right'>
                            <p class="skeleton-rect">商品标题商品标题商品标题商品标题商品标题</p>
                            <div class='goods_bottom'>
                                <p style="width: 60px;" class="skeleton-rect"><span class="yh-goods_bottom-span">￥</span>{{ total }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <!--运费、优惠券、合计信息-->
                <ul>
                    <li class='order_coupon'>
                        <span class="skeleton-rect">运费</span>
                        <span class="skeleton-rect">￥5.00</span>
                    </li>
                    <li class='order_coupon'>
                        <span class="skeleton-rect">订单备注</span>
                        <span class="yh-order_coupon-spana"><input class="skeleton-rect" placeholder="选填，请先和商家协商一致"
                                placeholder-style="color:#b8b8b8" type="text" v-model="remarks"></span>
                    </li>
                    <li class='order_coupon' v-if="pay_name!='jp'">
                        <span></span>
                        <span class="yh-order_coupon-spanb skeleton-rect" v-if='!bargain'>
                            <!-- #ifndef MP-BAIDU || MP-ALIPAY -->
                            合计：<font class="yh-order_coupon-fonta">￥74</font>
                            <!-- #endif -->
                            <!-- #ifdef MP-BAIDU || MP-ALIPAY-->
                            合计：<span class="yh-order_coupon-fonta">￥74</span>
                            <!-- #endif -->
                        </span>
                        <span class="skeleton-rect" v-else>
                            <!-- #ifndef MP-BAIDU || MP-ALIPAY -->
                            合计：<font class="yh-order_coupon-fonta">￥74</font>
                            <!-- #endif -->
                            <!-- #ifdef MP-BAIDU || MP-ALIPAY-->
                            合计：<span class="yh-order_coupon-fonta">￥74</span>
                            <!-- #endif -->

                        </span>
                    </li>
                </ul>

                <div style="height: 157px;" class="skeleton-rect">

                </div>

                <div style="height: 49px;position: fixed;bottom: 0;width: 100%;display:flex;justify-content: space-between">
                    <div style="display:flex;justify-content:center;align-items:center;">
                        <p style="width: 110px;height: 21px;margin-left: 16px;" class="skeleton-rect">付款金额：￥74</p>
                    </div>
                    <div style="width: 120px;" class="skeleton-rect">立即支付</div>
                </div>
            </div>
        </div>

        <div v-else>
            <div class="order_detail">
                <choose-address :shop_address="shop_list" :shop_id="shop_id" :shop_status="shop_status === 1" v-model="address"
                    :address_status="adds_f" :is_express="is_express" @change="sChange" />

                <!--灰色间隔-->
                <div class="yh-line"></div>
                <!--商品列表-->
                <div v-if="pay_name!='jp'">
                    <ul :key='indexs' v-for='(items,indexs) in pro'>
                        <li class='storeLi' v-if='items.shop_id'>
                            <img :src="icon_store" class="yh-storeLi-imga">
                            {{items.shop_name}}
                            <img :src="icon_right_arrow" class="yh-jiantou-img">
                        </li>
                        <li :key='index' class='goods' v-for="(item,index) in items.list">
                            <img :src="item.img" />
                            <div class='goods_right'>
                                <p>{{item.product_title}}</p>
                                <div class='goods_bottom'>
                                    <p><span class="yh-goods_bottom-span">￥</span>{{item.price}}</p>

                                    <div class='format'>
                                        <p class="yh-format-p">
                                            规格：{{item.color?item.color:''}}{{item.name?item.name:''}}{{item.size?item.size:''}}</p>
                                        <p class="yh-format-pa">x{{item.num}}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <div class="yh-items"></div>
                    </ul>
                </div>

                <ul v-if="pay_name=='jp'">
                    <li class='goods'>
                        <img :src="jp_imgurl" />
                        <div class='goods_right'>
                            <p>{{jp_name}}</p>
                            <div class='goods_bottom'>
                                <p><span class="yh-goods_bottom-span">￥</span>{{ total }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <!--运费、优惠券、合计信息-->
                <ul>
                    <li class='order_coupon' v-if="pay_name!='jp'&&!bargain && coupon_status && is_distribution!=1">
                        <span>使用优惠券</span>
                        <div @tap="coupon()">
                            <span>{{coupon_name? coupon_name : '已优惠：'+ coupon_money +'元' }}</span>
                            <img :src="icon_right_arrow" class='arrow' style='margin-left: 20rpx;' />
                        </div>
                    </li>
                    <li class='order_coupon' v-if="pay_name!='jp'&&!bargain && isDistribution==false && is_distribution!=1 && is_subtraction == 1 && ((reduce_money == 0 && reduce_name != '')||(reduce_money > 0 && reduce_name == ''))">
                        <span>满减优惠</span>
                        <span v-if="reduce_money == 0 && reduce_name != ''">{{reduce_name}}</span>
                        <span v-else>{{reduce_money}}</span>
                    </li>
                    <li class='order_coupon' v-if="grade_rate!=1">
                        <span>会员等级折扣</span>
                        <span>{{grade_rate*10}}折</span>
                    </li>
                    <li class='order_coupon' v-if="is_distribution==1 && discount!=1">
                        <span>分销等级购物折扣</span>
                        <span>{{discount*10}}折</span>
                    </li>
                    <li class='order_coupon' v-if="pay_name!='jp'">
                        <span>运费</span>
                        <span v-if="freightt==0">包邮</span>
                        <span v-else>￥{{freightt}}</span>
                    </li>
                    <li class='order_coupon'>
                        <span>订单备注</span>
                        <span class="yh-order_coupon-spana"><input placeholder="选填，请先和商家协商一致" placeholder-style="color:#b8b8b8"
                                type="text" v-model="remarks"></span>
                    </li>
                    <li class='order_coupon' v-if="pay_name!='jp'">
                        <span></span>
                        <span class="yh-order_coupon-spanb" v-if='!bargain'>
                            <!-- #ifndef MP-BAIDU || MP-ALIPAY -->
                            合计：<font class="yh-order_coupon-fonta">￥{{total}}</font>
                            <!-- #endif -->
                            <!-- #ifdef MP-BAIDU || MP-ALIPAY-->
                            合计：<span class="yh-order_coupon-fonta">￥{{total}}</span>
                            <!-- #endif -->
                        </span>
                        <span v-else>
                            <!-- #ifndef MP-BAIDU || MP-ALIPAY -->
                            合计：<font class="yh-order_coupon-fonta">￥{{total}}</font>
                            <!-- #endif -->
                            <!-- #ifdef MP-BAIDU || MP-ALIPAY-->
                            合计：<span class="yh-order_coupon-fonta">￥{{total}}</span>
                            <!-- #endif -->

                        </span>
                    </li>
                </ul>

                <choose-pay :aliPayStatue="aliPayStatue" :baidupayStatue="baidupayStatue" :open_alipay="open_alipay"
                    :open_baidu="open_baidu" :open_wallet="open_wallet" :open_wxpay="open_wxpay" :useWallet="useWallet"
                    :user_money="user_money" :wxPayStatue="wxPayStatue" @chooseWay="chooseWay($event)" />

                <submit-order :ishide="ishide" :total="total" @submit="order_pay()" />
            </div>
        </div>

        <skeleton :animation="true" :loading="!load" bgColor="#FFF"></skeleton>

        <!-- 高度屏幕小的时候解决选择不到微信支付的问题 -->
        <div class="yh-wx-pay">
        </div>

        <!--  优惠券    -->
        <div class='copon_div' v-if="use_coupon">
            <ul class='coupon_ul'>
                <li :key='index' @tap="coupon_use(index,item.id,item.coupon_status)" class='coupon_sue' v-for="(item,index) in coupon_list">
                    <span v-if="item.activity_type == 1" v-text="item.name?item.name:''+':免邮'"></span>
                    <span v-else v-text="item.name&&item.name=='不使用优惠券'?'不使用优惠券':item.name+':优惠'+item.money+'元'+item.coupon_name"></span>
                    <img :src="item.id==coupon_id?quan_hei:quan_hui" class="yh-img-s" />
                </li>
            </ul>
            <div @tap="closeCoupon" class="copou_close">关闭</div>
        </div>
    </div>
</template>

<script>
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
    import paymodel from '@/components/paymodel.vue'
    import mixinsOrder from '../../mixins/order'
    import mixinCoupon from '../../mixins/coupon'
    import choosePay from '@/components/choose-pay.vue'
    import chooseAddress from '@/components/order/choose-address.vue'
    import submitOrder from '@/components/order/submit-order.vue'

    export default {
        data() {
            return {
                payment: '',
                // 是否是分销商品？true是，false不是
                isDistribution: false,
                icon_right_arrow: this.$common.ROOT_URL + '/static/images/icon/icon_right_arrow_grey.png',
                load: false,
                returnR: 6,
                cpId: '',
                title: '确认订单信息',
                remarks: '',
                is_subtraction: 1,
                reduce_name: '',
                pro: [], //购买商品列表
                icon_store: this.$common.ROOT_URL + '/static/images/icon/icon_store.png',
                // quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehei2x.png',
                // quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehui2x.png',
                ishide: 0, //是否隐藏底部支付栏 1隐藏 0不隐藏
                sNo: '',
                name: '',
                is_distribution: 0,
                cart_id: '',
                pay_name: '', //pt是普通订单过来的，jp就是竞拍带过来的
                firstFlag: true,
                tmplIds: ['2KrrJchj92YRKhZZ0SSHz76dmrT0cLBJ2Wfe0', 'ncs3u3Bmmi0jW7EXAik4KQvxF3JxbaulWNwbLXDto',
                    'CZAPo_TqOOeC5K7XYvBeB_LXmyXKIhXkZROArNZDwQ8'
                ], //微信订阅消息模板

                // 店铺列表
                shopList: [],
            }
        },
        mixins: [mixinsOrder, mixinCoupon],
        onLoad(option) {
            this.$store.state.address_id = this.$store.state.address_id_def
            this.cpId = option.product

            this.returnR = option.returnR

            if (this.cpId && JSON.parse(this.cpId).findIndex(item => item.sec_id) === 3) {
                this.sec_id = JSON.parse(this.cpId)[3].sec_id
                this.seckill = true
                this.activity_id = this.$store.state.seckilldata.activity_id
                this.platform_activities_id = this.$store.state.seckilldata.platform_activities_id
            }

            if (option.buy_again == true || option.buy_again == 'true') {
                this.buy_again = true
            }

            this.orde_id = this.$store.state.order_id
            this.cart_id = this.$store.state.cart_id

            if (option.cart_id) {
                this.cart_id = option.cart_id
                this.$store.state.cart_id = this.cart_id
            }

            // #ifdef H5 
            let storage = window.localStorage
            if (storage['bargain']) {
                this.cpId = storage['product']
            }

            if (storage['bargain']) {
                this.bargain = storage['bargain'] ? storage['bargain'] : this.bargain
                this.bargain_id = storage['bargain_id'] ? storage['bargain_id'] : this.bargain_id
                this.order_no = storage['order_no'] ? storage['order_no'] : this.order_no
            }

            if (storage['cart_id'] != null && storage['cart_id'] !== '') {
                this.cart_id = storage['cart_id']
                storage['cart_id'] = ''
            }


            if (!this.$store.state.bindding_num) {
                this.$store.state.bindding_num = storage['bindding_num']
                console.log(location.href.indexOf('product'));
                console.log(location.href.indexOf('product'))
                if (!(location.href.indexOf('product') > -1) && !(location.href.indexOf('canshu') > -1) && !(location.href
                        .indexOf('buy_again') > -1)) {
                    this.$store.state.pay_lx = 'jp'
                }

            }

            if (!this.$store.state.address_id) {
                this.$store.state.address_id = storage['address_id']
            }

            // #endif

            if (this.cpId) {
                uni.setStorageSync('goodsInfo', this.cpId)
            }

            if (option.canshu) {
                uni.setStorageSync('canshu', option.canshu)
            }

            if (option.isDistribution == 1 && option.isDistribution != 'false') {
                this.isDistribution = true
            }

            this.bargain = option.bargain
            this.bargain_id = option.bargain_id
            this.order_no = option.order_no

            // #ifdef H5 
            //解决获取code后价格变为普通商品价格的问题


            if (option.product) {
                let kanjia = JSON.parse(option.product)
                if (kanjia[3]) {
                    this.bargain = kanjia[3] && kanjia[3].bargain ? kanjia[3].bargain : this.bargain
                    this.bargain_id = kanjia[4] && kanjia[4].bargain_id ? kanjia[4].bargain_id : this.bargain_id
                    this.order_no = kanjia[5] && kanjia[5].order_no ? kanjia[5].order_no : this.order_no
                }
            }
            // #endif



            this.pay_name = this.$store.state.pay_lx
            console.log('XIJASJASFAFASFJL' + this.pay_name)
            this.bind_id = this.$store.state.bindding_num
            this._axios()

        },
        onShow() {
            // 每次进入页面接受自提选择的页面
            if (this.hc_address_id != this.$store.state.address_id) {
                this.hc_address_id = this.address_id = this.$store.state.address_id
            }

            if (uni.getStorageSync('store_choose')) {
                uni.removeStorageSync('store_choose')
            }

            this.shop_address_id = uni.getStorageSync('shop_address_id')
            this._axios('onshow')

            // #ifdef MP-WEIXIN
            this.LaiKeTuiCommon.getWXTmplIds(this)
            // #endif

        },
        onUnload() {
            if (location.hostname === 'localhost') return false;
            setTimeout(() => {

                let state = window.location.href.replace(/\?code=.*?\//, '#/')
                console.log(state);
                history.replaceState(null, null, state)
            }, 300)
        },
        methods: {
            sChange(is_express) {
                this.is_express = is_express;
                if (is_express) {
                    this._axios('onshow')
                } else {
                    this.freight = this.freightt = 0
                    this.shop_list = {
                        id: 0
                    }
                }


            },

            _axios(type = '') {
                let product = uni.getStorageSync('goodsInfo')
                let data = null;
                if (this.pay_name === 'jp') {
                    data = {
                        module: 'app',
                        action: 'order',
                        auction_id: this.bind_id,
                        product_type: 'JP',
                        app: 'Settlement',
                        coupon_id: this.coupon_id ? this.coupon_id : '0',
                    }

                } else if (this.bargain) {
                    data = {
                        module: 'app',
                        action: 'order',
                        product_type: 'KJ',
                        app: 'Settlement',
                        bargain_id: this.bargain_id,
                        address_id: this.address_id,
                        coupon_id: this.coupon_id ? this.coupon_id : '0',
                    }

                } else if (this.seckill) {
                    data = {
                        module: 'app',
                        action: 'order',
                        app: 'Settlement',
                        product_type: 'MS',
                        cart_id: this.cart_id,
                        address_id: this.address_id,
                        canshu: uni.getStorageSync('canshu'),
                        sec_id: this.sec_id,
                        coupon_id: this.coupon_id ? this.coupon_id : '0',
                    }
                } else {
                    data = {
                        module: 'app',
                        action: 'order',
                        app: 'Settlement',
                        cart_id: this.cart_id,
                        address_id: this.address_id,
                        canshu: uni.getStorageSync('canshu'),
                        coupon_id: this.coupon_id ? this.coupon_id : '0',
                    }
                }
                if (this.cpId) {
                    data.product = product
                    data.cart_id = ''
                }

                if (!this.is_express) {
                    data.shop_address_id = this.shop_address_id
                }
                this.$req.post({
                    data
                }).then(res => {
                    if (res.status === 0) {
                        this.load = true
                        return false
                    }

                    let {
                        address,
                        coupon_id,
                        payment,
                        freight,
                        password_status,
                        products,
                        products_total,
                        total,
                        user_money,
                        enterless,
                        time_id,
                        is_distribution,
                        discount,
                        grade_rate,
                    } = res;

                    // 砍价商品请求的数据
                    let coupon_money = res.coupon_money || 0
                    let reduce_money = res.reduce_money || 0
                    this.coupon_money = coupon_money

                    this.total = Number.parseFloat(total).toFixed(2)
                    this.address = address

                    if (this.address && this.address.id) {
                        this.address_id = this.address.id
                    } else {
                        this.address = null;
                    }

                    this.time_id = time_id
                    this.payment = payment
                    if (products && products.length > 0) {
                        // 竞拍商品请求数据
                        if (this.pay_name === 'jp') {
                            this.pro = products[0]
                            this.jp_imgurl = res.imgurl
                            this.payTitle = this.jp_name = res.a_title
                            this.total = res.products_total
                        } else {
                            this.pro = products
                            this.payTitle = products[0].list[0].product_title

                        }

                    }

                    this.user_money = Number.parseFloat(user_money)
                    if (address) {
                        if (!this.$store.state.address_id_def) {
                            this.$store.state.address_id_def = address.id
                        }
                    }

                    this.password_status = password_status
                    if (type !== 'onshow') {
                        this.coupon_id = coupon_id
                    } else {
                        if (uni.getStorageSync('chooseAddress')) {
                            this.address = uni.getStorageSync('chooseAddress')
                        }
                    }


                    this.coupon_status = res.coupon_status
                    this.enterless = enterless
                    this.is_distribution = is_distribution
                    this.discount = discount ? discount : 1
                    this.grade_rate = grade_rate ? grade_rate : 1
                    this.total = Number.parseFloat(total)
                    this.reduce_money = reduce_money
                    this.reduce_name = res.reduce_name
                    this.is_subtraction = res.is_subtraction
                    this.products_total = products_total
                    if (this.address) {
                        this.adds_f = this.address.length !== 0

                    }

                    if (res.shop_status && res.shop_list) {
                        this.shop_status = res.shop_status
                        this.shop_list = res.shop_list
                        if (res.shop_list.length == 0) {
                            this.shop_address_id = ''
                            uni.setStorageSync('shop_address_id', '')
                        } else {
                            this.shop_address_id = res.shop_list.id
                            uni.setStorageSync('shop_address_id', res.shop_list.id)
                        }
                    }
                    // 运费赋值留到最后，计算价格是放在运费的监听函数里
                    this.freightt = parseFloat(freight).toFixed(2)
                    this.freight = freight

                    this.show_pay_way()
                    this.load = true

                }).catch(e => {
                    this.load = true
                })

            }
        },
        components: {
            wxParse,
            paymodel,
            choosePay,
            chooseAddress,
            submitOrder
        }
    }
</script>

<style scoped>
    @import url("../../static/css/order/orderDetail.css");
</style>
