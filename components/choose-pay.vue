<template>
    <view class="choose-pay">
        <!--灰色间隔-->
        <div class="yh-line"></div>
        <!--支付方式-->
        <ul class="safe-area-inset-bottom list">
            <div>
                <li class='order_coupon'>
                    <span class="yh-order_coupon-spanc">请选择支付方式</span>
                </li>

                <li @tap='chooseWay("balance")' class='pay' v-if="open_wallet">
                    <div class="yh-pay">
                        <div class="pay_yue yh-pay-wx-d">
                            <div class="yh-pay-s">
                                <img :src="pay_y" alt="" class='pay_img'>
                                <div class="yh-pay_div">
                                    <p class="yh-pay_div-p">
                                        余额支付
                                        <text style="color: #999999;">（余额￥{{ user_money }}）</text>
                                    </p>
                                </div>
                            </div>
                            <img :src="useWallet?quan_hei:quan_hui" class='quan_img' />
                        </div>
                    </div>
                </li>

                <!-- #ifdef MP-BAIDU -->
                <li @tap='chooseWay("baidu")' class='pay' v-if="open_baidu">
                    <div class="yh-pay">
                        <div class="pay_yue yh-pay-wx-d">
                            <div class="yh-pay-s">
                                <img :src="pay_bd" alt="" class='pay_img'>
                                <div class="yh-pay_div">
                                    <p class="yh-pay_div-p">
                                        百度支付
                                    </p>
                                </div>
                            </div>
                            <img :src="baidupayStatue?quan_hei:quan_hui" class='quan_img' />
                        </div>
                    </div>
                </li>
                <!-- #endif -->

                <!-- 微信支付 -->
                <!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
                <li @tap='chooseWay("wxPay")' class='pay' v-if="open_wxpay">
                    <div class="yh-pay">
                        <div class="pay_yue yh-pay-wx-d">
                            <div class="yh-pay-s">
                                <img :src="pay_w" alt="" class='pay_img'>
                                <div class="yh-pay_div">
                                    <p class="yh-pay_div-p">
                                        微信支付
                                    </p>
                                </div>
                            </div>
                            <img :src="wxPayStatue?quan_hei:quan_hui" class='quan_img' />
                        </div>
                    </div>
                </li>
                <!-- #endif -->

                <!-- 支付宝支付 -->
                <!-- #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO-->
                <li @tap='chooseWay("aliPay")' class='pay' v-if="open_alipay">
                    <div class="yh-pay">
                        <div class="pay_yue yh-pay-wx-d">
                            <div class="yh-pay-s">
                                <img :src="pay_z" alt="" class='pay_img'>
                                <div class="yh-pay_div">
                                    <p class="yh-pay_div-p">
                                        支付宝支付
                                    </p>
                                </div>
                            </div>
                            <img :src="aliPayStatue?quan_hei:quan_hui" class='quan_img' />
                        </div>
                    </div>
                </li>
                <!-- #endif -->

            </div>
        </ul>
        
    </view>
</template>

<script>
    export default {
        data() {
            return {
                pay_y: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/yuezhifu2x.png',
                quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehui2x.png',
                quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehei2x.png',
                pay_bd: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/baiduzhifu2x.png',
                pay_z: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/zhifubaozhifu2x.png',
                pay_w: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/weixinzhifu2x.png',
            }
        },
        props: {
            open_wallet: {
                default: false,
                type: Boolean
            },
            open_wxpay: {
                default: false,
                type: Boolean
            },
            open_alipay: {
                default: false,
                type: Boolean
            },
            open_baidu: {
                default: false,
                type: Boolean
            },
            user_money: {
                default: 0,
                type: Number
            },
            useWallet: {
                default: false,
                type: Boolean
            },
            baidupayStatue: {
                default: false,
                type: Boolean
            },
            wxPayStatue: {
                default: false,
                type: Boolean
            },
            aliPayStatue: {
                default: false,
                type: Boolean
            },
        },
        methods: {
            chooseWay(type) {
                this.$emit('chooseWay', type)
            }
        }
    }
</script>

<style lang="less" scoped>
    .choose-pay {
        .yh-line {
            width: 100%;
            height: 10rpx;
            background-color: #F4F4F4;
        }

        .list {
            .order_coupon {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx;
                color: #020202;
                font-size: 28rpx;
                border-bottom: 1px solid #eee;
                
                span {
                    font-size: 28rpx;
                }
            
                .yh-order_coupon-spanc {
                    font-size: 28rpx;
                    color: #020202;
                }
            }
            
            .pay {
                padding: 30rpx;
                border-bottom: 1px solid #eee;
                font-size: 24rpx;
                color: #020202;
            
                .yh-pay {
                    width: 100%;
            
                    .pay_yue {
                        display: flex;
                        align-items: center;
            
                        &.yh-pay-wx-d {
                            position: relative;
                            width: 100%;
                            justify-content: space-between;
            
            
                            .yh-pay-s {
                                display: flex;
                                align-items: center;
            
                                .pay_img {
                                    width: 44rpx;
                                    height: 44rpx;
                                }
            
                                .yh-pay_div {
                                    margin-left: 30rpx;
            
                                    .yh-pay_div-p {
                                        width: 400rpx;
                                    }
            
                                }
            
                            }
            
                            /*    选项圆圈     */
                            .quan_img {
                                width: 34rpx;
                                height: 34rpx;
                            }
                        }
                    }
                }
            
            
            }
            
        }
    }
</style>>
