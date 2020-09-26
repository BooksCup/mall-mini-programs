<template>
    <div class="order_ii" style="background-color: #F8F8F8;">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- #ifndef MP-ALIPAY -->
        <div :style="{ height: halfWidth }">
            <div class="topHeight" :style="{ height: halfWidth }"></div>
        </div>
        <!-- #endif -->
        <div class="skeleton">
            <!-- 普通会员面板 -->
            <div v-if="grade == '普通会员'" class="head">
                <div class="head_core skeleton-circle">
                    <div class="core_two" @tap="_navigateTo1('/pages/my/myInfo')">
                        <div class="head_imgDiv skeleton-circle">
                            <img class="img" v-if="access_id1" lazy-load="true" :src="logo1" />
                            <img class="img" v-else lazy-load="true" :src="icon_not_login" />
                        </div>
                        <div v-if="access_id1" class="user-msg" style="flex-direction: row;">
                            <div>
                                <span class="span">{{ user.user_name }}</span>
                            </div>
                            <span class="vip-text1">
                                <img class="img1" :src="my_leve" />
                                普通会员
                            </span>
                        </div>
                        <span class="skeleton-rect" v-else>Hi~等你很久了</span>
                    </div>
                    <div class="loginBtn" v-if="!access_id1" @tap="_navigateTo('/pages/login/login?landing_code=1')">登录/注册</div>
                    <div v-if="access_id1 && have_grade" @tap="toVip(1)" class="changeInfo">
                        <div class="tag vip-join vip-core">
                            加入会员
                            <image :src="vip_arrow" mode="widthFix" style="width: 8rpx;margin-left: 10rpx;"></image>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 白银会员面板 -->
            <div v-else class="head panpel" :style="'background-image:url(' + imgurl_my + ');background-size: 100% 100%;'">
                <div class="head_core">
                    <div class="core_two">
                        <div class="skeleton-circle" style="margin: 0 30rpx;border-radius:50%;width: 120rpx;height: 120rpx;"
                            @tap="_navigateTo1('../my/myInfo')">
                            <img v-if="access_id1" lazy-load="true" style="width: 120rpx;height: 120rpx;margin:0;" :src="logo1" />
                            <img v-else lazy-load="true" style="width: 120rpx;height: 120rpx;margin:0;" :src="icon_not_login" />
                        </div>
                        <div v-if="access_id">
                            <div v-if="access_id1 || !load" class="user-msg" style="justify-content: center;">
                                <div style="min-height: 23px" class="skeleton-rect">
                                    <span class="span " :style="'color:' + font_color">{{ user.user_name }}</span>
                                    <div class="level-tag tag vip-text">
                                        <img class="img" :src="imgurl_s" />
                                        <span :style="'color:' + font_color">{{ grade }}</span>
                                    </div>
                                </div>
                                <div style="min-width: 170px" class="user-msg-div skeleton-rect">
                                    <span class="ren-ree-time" :style="'color:' + date_color">{{ grade_end }} 到期</span>
                                    <div class="xf_button" @tap="toVip(2)"><span class="ren-ree">立即续费</span></div>
                                </div>
                            </div>
                            <span class="skeleton-rect" v-else>Hi~等你很久了</span>
                        </div>
                        <span class="skeleton-rect" v-else>Hi~等你很久了</span>
                    </div>
                    <div class="loginBtn skeleton-fillet" v-if="!access_id || (!access_id1 && load)" @tap="_navigateTo('/pages/login/login?landing_code=1')">登录/注册</div>
                    <div v-else @tap="_navigateTo('/pagesA/vipClub/vipClub')" class="changeInfo">
                        <span class="tag vip-join vip-core skeleton-rect">
                            会员中心
                            <image :src="vip_arrow" mode="widthFix" style="width: 8rpx;margin-left: 10rpx;"></image>
                        </span>
                    </div>

                </div>
            </div>

            <div class="order">
                <div class="order_one">
                    <p><span class="skeleton-rect">我的订单</span></p>
                    <div class="center" @tap="_order(0)">
                        <span class="span">
                            <span class="skeleton-rect">查看全部</span>
                        </span>
                        <img class="img" :src="icon_right_arrow" />
                    </div>
                </div>
                <ul class="order_two">
                    <li @tap="_order(1)">
                        <div class="position_quan">
                            <img class="img skeleton-fillet" :src="icon_awaiting_payment" />
                            <div class="order_b" v-if="access_id1 && dfk_num">{{ dfk_num }}</div>
                        </div>
                        <p class="skeleton-rect">待付款</p>
                    </li>
                    <li @tap="_order(2)">
                        <div class="position_quan">
                            <img class="img skeleton-fillet" :src="icon_awaiting_shipment" />
                            <div class="order_b" v-if="access_id1 && dfh_num">{{ dfh_num }}</div>
                        </div>
                        <p class="skeleton-rect">待发货</p>
                    </li>
                    <li @tap="_order(3)">
                        <div class="position_quan">
                            <img class="img skeleton-fillet" :src="icon_awaiting_delivery" />
                            <div class="order_b" v-if="access_id1 && dsh_num">{{ dsh_num }}</div>
                        </div>
                        <p class="skeleton-rect">待收货</p>
                    </li>
                    <li @tap="_order(4)">
                        <div class="position_quan">
                            <img class="img skeleton-fillet" :src="icon_disputes" />
                            <div class="order_b" v-if="access_id1 && dpj_num">{{ dpj_num }}</div>
                        </div>
                        <p class="skeleton-rect">待评价</p>
                    </li>
                    <li @tap="_navigateTo1('/pagesA/afterSale/afterSale')">
                        <div class="position_quan" style="width: 80rpx;margin: 0 auto;">
                            <img class="img skeleton-fillet" :src="icon_refund" />
                            <div class="order_b" v-if="access_id1 && th_num">{{ th_num }}</div>
                        </div>
                        <p class="skeleton-rect">退款/售后</p>
                    </li>
                </ul>
            </div>
            <div class="my_data3">
                <div class="data3" v-if="coupon == 1 || coupon == '1'" @tap="_navigateTo1('/pagesB/coupon/mycoupon')">
                    <img :src="bg_coupon" alt="" />
                    <div class="data3_in skeleton-fillet">
                        <div>
                            <p v-if="access_id1" class="dataNum">{{ user.coupon_num }}</p>
                            <p v-else class="dataNum">0</p>
                            <p>优惠券</p>
                        </div>
                    </div>
                </div>

                <!-- #ifdef MP -->
                <div v-if="QB == 1" class="data3" @tap="_navigateTo1('/pagesB/myWallet/myWallet')">
                    <img :src="bg_wallet" alt="" />
                    <div class="data3_in skeleton-fillet">
                        <div>
                            <p v-if="access_id1" class="dataNum">
                                <span style="font-size: 26rpx;">￥</span>
                                {{ user.money }}
                            </p>
                            <p v-else class="dataNum">
                                <span style="font-size: 26rpx;">￥</span>
                                0.00
                            </p>
                            <p>钱包</p>
                        </div>
                    </div>
                </div>
                <!-- #endif -->
                <!-- #ifndef MP -->
                <div class="data3" @tap="_navigateTo1('/pagesB/myWallet/myWallet')">
                    <img :src="bg_wallet" alt="" />
                    <div class="data3_in skeleton-fillet">
                        <div>
                            <p v-if="access_id1" class="dataNum">
                                <span style="font-size: 26rpx;">￥</span>
                                {{ user.money }}
                            </p>
                            <p v-else class="dataNum">
                                <span style="font-size: 26rpx;">￥</span>
                                0.00
                            </p>
                            <p>钱包</p>
                        </div>
                    </div>
                </div>
                <!-- #endif -->

                <div class="data3" @tap="_navigateTo1('/pages/my/myScore?signPlugin='+sign)">
                    <img :src="bg_integral" alt="" />
                    <div class="data3_in skeleton-fillet">
                        <div>
                            <p v-if="access_id1" class="dataNum">{{ user.score }}</p>
                            <p v-else class="dataNum">0</p>
                            <p>积分</p>
                        </div>
                    </div>
                </div>
            </div>
            <ul class="list_ul">
                <!-- #ifndef MP-ALIPAY -->
                <li v-if="PT == 1" @tap="_navigateTo1('/pagesA/group/groupOrder')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_my_group" />
                        <p class="skeleton-rect">我的拼团</p>
                    </div>
                </li>
                <!-- #endif -->
                <li v-if="mch == 1" @tap="_navigateTo1('/pagesA/myStore/myStore')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_my_store" />
                        <p class="skeleton-rect">我的店铺</p>
                    </div>
                </li>
                <li v-if="KJ == 1" @tap="_navigateTo1('/pagesA/bargain/bargain')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_my_bargain" />
                        <p class="skeleton-rect">我的砍价</p>
                    </div>
                </li>
                <li v-if="MS == 1" @tap="_navigateTo1('/pagesB/seckill/seckill_my')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_my_seckill" />
                        <p class="skeleton-rect">我的秒杀</p>
                    </div>
                </li>
                <li @tap="_navigateTo1('/pages/collection/collection')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_my_favorites" />
                        <p class="skeleton-rect">我的收藏</p>
                    </div>
                </li>
                <li v-if="JP == 1" @tap="_navigateTo1('/pagesA/bidding/bidding_my')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_my_auction" />
                        <p class="skeleton-rect">我的竞拍</p>
                    </div>
                </li>
                <li v-if="FX == 1" @tap="_navigateTo1('/pagesA/distribution/distribution_center')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_center_agent" />
                        <p class="skeleton-rect">代理中心</p>
                    </div>
                </li>
                <li @tap="_navigateTo1('/pages/address/receivingAddress?state_manage=2')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_shipping_address" />
                        <p class="skeleton-rect">收货地址</p>
                    </div>
                </li>
                <li @tap="_navigateTo1('/pages/message/systemMesage')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_my_message" />
                        <p class="skeleton-rect">消息</p>
                    </div>
                </li>
                <li v-if="JF == 1" @tap="_navigateTo1('/pagesB/integral/integral')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_integral_mall" />
                        <p class="skeleton-rect">积分商城</p>
                    </div>
                </li>
                <!-- #ifdef MP-WEIXIN -->
                <li class="relative">
                    <div>
                        <button class="button_kefu" open-type="contact" type="default" />
                        <img class="skeleton-fillet" style="width: 48rpx;height: 48rpx;margin-bottom: 20rpx;" :src="icon_customer_service" />
                        <view class="skeleton-rect">客服</view>
                    </div>
                </li>
                <!-- #endif -->
                <!-- #ifdef MP-BAIDU -->
                <li class="relative">
                    <div>
                        <button class="button_kefu" open-type="contact" bindcontact="contactCB"></button>
                        <img class="skeleton-fillet" style="width: 48rpx;height: 48rpx;margin-bottom: 20rpx;" :src="icon_customer_service" />
                        <view class="skeleton-rect">客服</view>
                    </div>
                </li>
                <!-- #endif -->
                <!-- #ifndef MP-WEIXIN ||  MP-TOUTIAO || MP-BAIDU -->
                <li @tap="_navigateTo1('/pages/message/service')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_customer_service" />
                        <p class="skeleton-rect">客服</p>
                    </div>
                </li>
                <!-- #endif -->
                <li @tap="_navigateTo('/pages/my/aboutMe')">
                    <div>
                        <img class="skeleton-fillet" :src="icon_about_us" />
                        <p class="skeleton-rect">关于我们</p>
                    </div>
                </li>
                <li @tap="_navigateTo1('/pagesB/setUp/setUp')" style="border-bottom: none;">
                    <div>
                        <img class="skeleton-fillet" :src="icon_setting" />
                        <p class="skeleton-rect">设置</p>
                    </div>
                </li>
            </ul>
            <div class="bq" :style="{ paddingBottom: pBottom }">
                <div class="relative">
                    <img class="bq_img" :src="storeLogo" />
                    BooksCup提供技术支持
                </div>
                <div>BooksCup@163.com</div>
            </div>

            <!-- 会员到期弹窗 -->
            <div v-if="vip_modal_flag" class="vip_modal" @touchmove.stop>
                <div class="vip_modal_data" :style="bg_vip">
                    <div class="vip_expire">
                        <p>您的会员即将到期</p>
                        <p>马上续费</p>
                    </div>
                    <div class="vip_act">
                        <span class="span">{{ rate }}</span>
                        <p>全场{{ rate }}折</p>
                        <p class="pr_10">专属活动</p>
                        <p>快速发货</p>
                    </div>
                    <p @tap="vip_renew">立即续费</p>
                    <div class="vip_radio" @tap="check_vip_radio">
                        <image :src="vip_check ? vip_check_img1 : vip_check_img2"></image>
                        <span>勾选不再显示</span>
                    </div>
                    <image class="vip_modal_close" :src="close_img" @tap="vip_modal_close"></image>
                </div>
            </div>
        </div>
        <skeleton :animation="true" :loading="!load" bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
    import {
        mapMutations
    } from 'vuex';

    export default {
        data() {
            return {
                //会员各自背景图
                baiyin_bg: '',
                huangjin_bg: '',
                heijin_bg: '',
                log: '',
                // 优惠券
                bg_coupon: this.$common.ROOT_URL + '/static/images/icon/tab/bg_coupon.png',
                // 钱包
                bg_wallet: this.$common.ROOT_URL + '/static/images/icon/tab/bg_wallet.png',
                // 积分
                bg_integral: this.$common.ROOT_URL + '/static/images/icon/tab/bg_integral.png',
                icon_setting: this.$common.ROOT_URL + '/static/images/icon/tab/icon_setting.png',
                // shdz: uni.getStorageSync('endurl') + 'images/icon1/shdz.png',
                // gywm: uni.getStorageSync('endurl') + 'images/icon1/gywm.png',
                // wdsc: uni.getStorageSync('endurl') + 'images/icon1/wdsc.png',
                // vip_check_img1: uni.getStorageSync('endurl') + 'images/icon/vip_checked.png',
                // vip_check_img2: uni.getStorageSync('endurl') + 'images/icon/vip_nocheck.png',
                // bg_vip: 'background-image: url(' + uni.getStorageSync('endurl') + 'images/icon/vip_modal.png)',
                // close_img: uni.getStorageSync('endurl') + 'images/icon/vip_close.png',
                shouquan2: false,
                // xx: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xx.png',
                // change: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/change.png',
                // storeLogo: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeLogo.png',
                // vip_arrow: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/arrow.png',
                // yhq: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yhq.png',
                // love: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/love2x.png',
                icon_right_arrow: this.$common.ROOT_URL + '/static/images/icon/tab/icon_right_arrow.png',
                // 待付款
                icon_awaiting_payment: this.$common.ROOT_URL + '/static/images/icon/tab/icon_awaiting_payment.png',
                // 待发货
                icon_awaiting_shipment: this.$common.ROOT_URL + '/static/images/icon/tab/icon_awaiting_shipment.png',
                // 待收货
                icon_awaiting_delivery: this.$common.ROOT_URL + '/static/images/icon/tab/icon_awaiting_delivery.png',
                // 待评价
                icon_disputes: this.$common.ROOT_URL + '/static/images/icon/tab/icon_disputes.png',
                // 退款/售后
                icon_refund: this.$common.ROOT_URL + '/static/images/icon/tab/icon_refund.png',

                // 我的拼团
                icon_my_group: this.$common.ROOT_URL + '/static/images/icon/tab/icon_my_group.png',
                // 我的店铺
                icon_my_store: this.$common.ROOT_URL + '/static/images/icon/tab/icon_my_store.png',
                // 我得砍价
                icon_my_bargain: this.$common.ROOT_URL + '/static/images/icon/tab/icon_my_bargain.png',
                // 我的秒杀
                icon_my_seckill: this.$common.ROOT_URL + '/static/images/icon/tab/icon_my_bargain.png',
                // 我的收藏
                icon_my_favorites: this.$common.ROOT_URL + '/static/images/icon/tab/icon_my_favorites.png',
                // 我的竞拍
                icon_my_auction: this.$common.ROOT_URL + '/static/images/icon/tab/icon_my_auction.png',
                // 代理中心
                icon_center_agent: this.$common.ROOT_URL + '/static/images/icon/tab/icon_center_agent.png',
                // 收货地址
                icon_shipping_address: this.$common.ROOT_URL + '/static/images/icon/tab/icon_shipping_address.png',
                // 消息
                icon_my_message: this.$common.ROOT_URL + '/static/images/icon/tab/icon_my_message.png',
                // 积分商城
                icon_integral_mall: this.$common.ROOT_URL + '/static/images/icon/tab/icon_integral_mall.png',
                // 客服
                icon_customer_service: this.$common.ROOT_URL + '/static/images/icon/tab/icon_customer_service.png',
                // 关于我们
                icon_about_us: this.$common.ROOT_URL + '/static/images/icon/tab/icon_about_us.png',
                // 未登录
                icon_not_login: this.$common.ROOT_URL + '/static/images/icon/tab/icon_not_login.png',

                // tanhao: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/tanhao292x.png',
                // logo: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/logo789.png',
                // mddp: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mddp.png',
                // mdkj: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/kan3x.png',
                // mdkf: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mdkf.png',
                // wdjp: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jp_my.png',
                // wdfx: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_centerIcon.png',
                // integral_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jf.png',
                // my_leve: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_leve.png',
                logo1: '',
                bottom: 4,
                load: false,
                user: '',
                th_num: '', //退货数量
                dfk_num: '', //待付款数量
                dfh_num: '', //待发货数量
                dsh_num: '', //待收货数量
                dpj_num: '', //待评价数量
                logoUrl: '', //程序图片
                company: '', //程序名称
                access_id1: false,
                isClick: false, //防止因为频繁点击导致的页面跳转出错
                openid: '', //微信使用
                session_key: '', //微信使用
                shouquanButton: true,
                grade: '', //会员等级
                grade_end: '', //到期时间
                imgurl_my: '', //会员背景
                imgurl_s: '',
                font_color: '',
                date_color: '',
                have_grade: '', //0:没有会员等级  1：有会员等级
                vip_modal_flag: false,
                vip_check: false,
                rate: '', //会员折率
                JP: 1, //竞拍插件 1：开启  0：不开启
                FX: 1, //分销插件 1.开启   0.不开启
                JF: 1, //积分商城插件 1.开启   0.不开启
                MS: 1, //秒杀插件 1.开启   0.不开启
                KJ: 1, //砍价插件 1.开启   0.不开启
                PT: 1, //拼团插件 1.开启   0.不开启
                QB: 1, //秒杀插件 1.开启   0.不开启
                coupon: 1, //优惠券插件 1.开启   0.不开启
                sign: 1, //签到插件 1.开启   0.不开启
                mch: 1 //店铺插件 1.开启   0.不开启
            };
        },
        onLoad() {
            this.$store.state.frompage = 'my';
        },
        onShow() {

            this.LaiKeTuiCommon.getUrlFirst(this._axios);
            this.isClick = false;
            // #ifdef MP-WEIXIN
            this.LaiketuiWeixinAuth.laiketui_mp_weixin_checkauth(this, this._axios);
            // #endif
            // #ifdef MP-ALIPAY
            this.LaiketuiAliAuth.laiketui_mp_alipay_check(null, this, this._axios);
            // #endif
            // #ifdef MP-TOUTIAO
            this.LaiketuiTTAuth.laiketui_mp_tt_check(null, this, this._axios);
            // #endif
            // #ifdef MP-BAIDU
            this.LaiketuiBDAuth.laiketui_mp_baidu_check(null, this, this._axios);
            // #endif
        },
        onTabItemTap(e) {
            this.LaiKeTuiCommon.closeMPAuthWin(this);
        },
        onUnload() {
            uni.removeStorageSync('isfx');
        },
        computed: {
            pBottom() {
                var height;
                // #ifdef H5
                height = 120;
                // #endif
                // #ifndef H5
                height = 0;
                // #endif
                return uni.upx2px(height) + 'px';
            }
        },
        methods: {
            check_vip_radio() {
                this.vip_check = !this.vip_check;
            },
            vip_modal_close() {
                setTimeout(function() {
                    uni.showTabBar();
                }, 10);
                this.vip_modal_flag = !this.vip_modal_flag;
                if (this.vip_modal_flag) {
                    uni.hideTabBar();
                } else {
                    uni.showTabBar();
                }
                if (this.vip_check) {
                    var data = {
                        module: 'app',
                        action: 'recharge',
                        app: 'close',

                    };

                    this.$req.post({
                        data
                    }).then(res => {

                    })

                }
            },
            vip_renew() {
                // this.vip_check传给后台的数据，有无勾选不再显示续费弹窗
                if (this.vip_check) {
                    var data = {
                        module: 'app',
                        action: 'recharge',
                        app: 'close',

                    };

                    this.$req.post({
                        data
                    }).then(res => {

                    })

                }
                this.toVip(2);
            },
            changeLoginStatus() {

                this._axios();
            },
            _logo() {
                var data = {
                    module: 'app',
                    action: 'index',
                    app: 'index',

                };

                this.$req.post({
                    data,
                    xhrFields: {
                        withCredentials: true
                    }
                }).then(res => {
                    let {
                        data: {
                            logo
                        }
                    } = res;
                    this.log = logo;
                })

            },
            _navigateTo(url) {
                uni.navigateTo({
                    url: url
                });
            },

            _cancelSq() {
                this.shouquanButton = true;
            },
            _navigateTo1(url) {
                if (this.isClick == false) {
                    this.isClick = true;
                    this.isLogin(() => {
                        uni.navigateTo({
                            url: url
                        });
                    })
                    setTimeout(() => {
                        this.isClick = false;
                    }, 2000);
                }
            },
            _order(status) {
                this.isLogin(() => {
                    this.status(status);
                    uni.navigateTo({
                        url: '/pages/order/myOrder'
                    });
                })
            },
            _axios() {
                var data = {
                    module: 'app',
                    action: 'user',
                    app: 'index'
                };

                this.$req.post({
                    data
                }).then(res => {
                    this.coupon = res.plugin.coupon;
                    this.sign = res.plugin.sign;
                    if (res.plugin.sign == undefined) {
                        this.sign = 0
                    }
                    this.mch = res.plugin.mch;
                    if (res.code == 404) {
                        this.access_id1 = false;
                        this.grade = '普通会员';
                        this.JP = res.plugin.JP;
                        this.FX = res.plugin.FX;
                        this.JF = res.plugin.JF;
                        this.MS = res.plugin.MS;
                        this.KJ = res.plugin.KJ;
                        this.PT = res.plugin.PT;
                        // #ifdef MP
                        this.QB = res.plugin.QB;
                        // #endif

                        this.load = true
                    } else if (res.code == 200) {
                        let {
                            data: {
                                user,
                                dfh_num,
                                logo,
                                company,
                                dfk_num,
                                dpj_num,
                                dsh_num,
                                th,
                                grade,
                                grade_end,
                                imgurl_my,
                                imgurl_s,
                                font_color,
                                date_color,
                                have_grade,
                                remind,
                                rate
                            },
                            plugin
                        } = res;
                        this.user = user;
                        this.th_num = th;
                        this.dfk_num = dfk_num;
                        this.dfh_num = dfh_num;
                        this.dsh_num = dsh_num;
                        this.dpj_num = dpj_num;
                        this.logoUrl = logo;
                        this.company = company;
                        this.logo1 = user.headimgurl;
                        this.$store.state.user_phone = user.mobile;
                        uni.setStorage({
                            key: 'user_phone',
                            data: user.mobile
                        });
                        this.access_id1 = true;
                        this.grade = grade;
                        this.grade_end = grade_end;
                        this.imgurl_my = imgurl_my;
                        this.imgurl_s = imgurl_s;
                        this.font_color = font_color;
                        this.date_color = date_color;
                        this.have_grade = have_grade;
                        this.rate = rate;
                        this.vip_modal_flag = remind ? true : false;
                        if (this.vip_modal_flag) {
                            uni.hideTabBar();
                        } else {
                            uni.showTabBar();
                        }
                        this.JP = plugin.JP;
                        this.FX = plugin.FX;
                        this.JF = plugin.JF;
                        this.MS = plugin.MS;
                        this.KJ = plugin.KJ;
                        this.PT = plugin.PT;
                        // #ifdef MP
                        this.QB = plugin.QB;
                        // #endif

                        this.load = true
                    }
                })

            },
            // 进入vip支付页面
            toVip(flag) {
                uni.setStorageSync('edit_flag', flag);
                uni.setStorageSync('edit_grade', this.grade);
                this._navigateTo('../../pagesA/vip/vip');
            },
            ...mapMutations({
                status: 'SET_STATUS'
            })
        }
    };
</script>

<style scoped>
    @import url('../../static/css/tab/my.css');
</style>
