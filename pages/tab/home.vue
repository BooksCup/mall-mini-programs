<template>
    <div class="home order_ii" :class="{ overflowhide: widgetinfoo }">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- #ifndef MP -->
        <div class="data_h" :style="{ height: halfWidth }">
            <div class="data_h_h" :style="{ height: halfWidth }"></div>
        </div>
        <!-- #endif -->
        <div v-if="!banner" class="skeleton">
            <!-- 头部 -->
            <div style="height: 89upx;">
                <!-- #ifdef MP-WEIXIN -->
                <div class="head" :style="{ top: halfWidth }" style="position: fixed;">
                    <div class="search" @tap="_focus">
                        <img class="skeleton-rect" :src="icon_search" />
                        <div class="search_div">搜索你想要的商品2</div>
                    </div>

                    <div class="message skeleton-rect" @tap="_navigateTo('/pages/message/systemMesage')">
                        <div v-if="xxnum && xxnum != 0" class="xxnum">{{ xxnum }}</div>
                        <img :src="icon_message" />
                    </div>
                </div>
                <!-- #endif -->

                <!-- #ifndef MP-WEIXIN -->
                <div class="head" :style="{ top: halfWidth }" style="position: fixed;">
                    <img v-if="logo" :src="logo" />
                    <img class="skeleton-rect" v-else src="" alt="" />
                    <div class="search skeleton-rect" style="width: 220px;" @tap="_focus">
                        <img :src="icon_search" />
                        <div class="search_div1">搜索你想要的商品</div>
                    </div>
                    <div class="message skeleton-circle" @tap="_navigateTo('/pages/message/systemMesage')">
                        <div v-if="xxnum && xxnum != 0" class="xxnum">{{ xxnum }}</div>
                        <img :src="icon_message" />
                    </div>
                </div>
                <!-- #endif -->
            </div>

            <!--  轮播图   -->
            <swiper class="swiper skeleton-rect" autoplay="true" indicator-dots="true" interval="3000" circular="true">
                <swiper-item>
                    <img class="swipe" src="" />
                </swiper-item>
            </swiper>
            <ul class="home_new">
                <li v-for="(item, index) in 5" :key="index">
                    <img class="skeleton-circle" src="" />
                    <p class="skeleton-rect">XX</p>
                </li>
            </ul>

            <!-- 商品分类展示 -->
            <div class="relative">
                <div class="goods_all">
                    <ul class="goods">
                        <li class="goods_li" v-for="(item, index) in 5" :key="index">
                            <span class="skeleton-rect">美妆护理</span>
                            <div class="goods_li_border" v-if="title_index == index"></div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="home_l">
                <ul class="home_slider" id="goods_slider" ref="goods_slider">
                    <li class="goods_slider_li" v-for="(item, index) in 3" :key="index">
                        <div style="display: flex;position: relative;justify-content: center;">
                            <img style="width: 78px;height: 78px;" class="skeleton-rect" src="" />
                        </div>
                        <p style="margin: 20upx auto 0px;width: 90px;" class="skeleton-rect">山水画</p>
                        <p style="margin: 10upx auto 30upx;color:#FF0000;text-align: center;width: 90px;" class="skeleton-rect">
                            ￥
                            <span style="font-size: 28upx;font-weight: bold;color:#FF0000">0.01</span>
                        </p>
                    </li>
                </ul>
            </div>

            <!--  间隔  -->
            <div class="hr"></div>

            <div class="zfb_bgc" style="display: flex; flex-direction: column;">
                <div class="goodsDetail">
                    <span class="goods_title skeleton-rect">积分商城</span>
                    <span class="goods_text skeleton-rect">热销爆款，超值兑换</span>
                </div>
                <img class="home_integral_img skeleton-rect" src="" alt="" />
                <template v-for="(item, index) in 2">
                    <div class="integral">
                        <img class="skeleton-rect" src="" alt="" />
                        <div style="flex: 1;">
                            <p class="integral_name skeleton-rect" style="height: 32px"> 春夏浅口方头真皮蝴蝶结平底芭蕾舞</p>
                            <span class="integral_num skeleton-rect" style="padding: 0;margin-top: 10px;height: 20px;width: 100px;">
                                已售
                                <span> 10</span>
                                件
                            </span>
                            <div class="integral_bottom" style="margin-top: 10px;">
                                <div class="integral_price">
                                    <div class="skeleton-rect" style="height: 13px">
                                        ￥
                                        <img src="" alt="" />
                                        <p>150</p>
                                    </div>
                                    <p class="skeleton-rect">
                                        市场价:
                                        <span>￥{{ item.price }}</span>
                                    </p>
                                </div>
                                <div class="btn skeleton-fillet">立即兑换</div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>


        <div v-else>
            <div>
                <!-- 头部 -->
                <div style="height: 89upx;">
                    <!-- #ifdef MP-WEIXIN -->
                    <div class="head" :style="{ top: halfWidth }" style="position: fixed;">
                        <div class="search" @tap="_focus">
                            <img :src="icon_search" />
                            <div class="search_div">搜索你想要的商品</div>
                        </div>

                        <div class="message" @tap="_navigateTo('/pages/message/systemMesage')">
                            <div v-if="xxnum && xxnum != 0" class="xxnum">{{ xxnum }}</div>
                            <img :src="icon_message" />
                        </div>
                    </div>
                    <!-- #endif -->

                    <!-- #ifndef MP-WEIXIN -->
                    <div class="head" :style="{ top: halfWidth }" style="position: fixed;">
                        <img v-if="logo" :src="logo" />
                        <img v-else src="" alt="" />
                        <div class="search" @tap="_focus">
                            <img :src="icon_search" />
                            <div class="search_div1">搜索你想要的商品</div>
                        </div>
                        <div class="xiaoxi" @tap="_navigateTo('/pages/message/systemMesage')">
                            <div v-if="xxnum && xxnum != 0" class="xxnum">{{ xxnum }}</div>
                            <img :src="icon_message" />
                        </div>
                    </div>
                    <!-- #endif -->
                </div>
                <!--  轮播图   -->
                <swiper class="swiper" autoplay="true" indicator-dots="true" interval="3000" circular="true">
                    <swiper-item v-for="(item, index) in banner" :key="index">
                        <img class="swipe" :src="item.image" @tap="_toAllGoods(item.url, item.type, item.parameter)" />
                    </swiper-item>
                </swiper>
                <ul class="home_new">
                    <li v-for="(item, index) in plugin_arr" :key="index" @touchstart="_coupon(index)" @click="_oncoupon(item.url, index)">
                        <!-- #ifndef MP-ALIPAY -->
                        <img :src="item.status ? item.appimg : item.appimg" />
                        <p>{{ item.name }}</p>
                        <!-- #endif -->
                        <!-- #ifdef MP-ALIPAY -->
                        <img v-if="item.name != '拼团'" :src="item.status ? item.appimg : item.appimg" />
                        <p v-if="item.name != '拼团'">{{ item.name }}</p>
                        <!-- #endif -->
                    </li>
                </ul>
                <!-- 商品分类展示 -->
                <div class="relative">
                    <div class="goods_all">
                        <ul class="goods" :style="{ width: width1 }">
                            <li class="goods_li" v-for="(item, index) in goods_centre" :key="index" @tap="_title(index)">
                                <span :class="{ color: title_index == index }">{{ item.pname }}</span>
                                <div class="goods_li_border" v-if="title_index == index"></div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="home_l">
                    <ul class="home_slider" id="goods_slider" ref="goods_slider">
                        <li class="goods_slider_li" v-for="(item, index) in centre_list" :key="index" @tap="_goods(item.id)">
                            <div style="display: flex;position: relative;justify-content: center;">
                                <image lazy-load="true" :src="item.imgurl" />
                                <div v-if="item.status == 3" class="dowmPro">
                                    已下架
                                </div>
                            </div>
                            <p style="margin-top: 20upx;">{{ item.product_title }}</p>
                            <p style="margin: 10upx 0 30upx 5upx;color:#FF0000;text-align: center;width: 90%;">
                                ￥
                                <span style="font-size: 28upx;font-weight: bold;color:#FF0000">{{ item.price }}</span>
                            </p>
                        </li>
                    </ul>
                </div>
                <!--  间隔  -->
                <div class="hr" v-if="list_jf.list && list_jf.list.length > 0"></div>
                <!--积分商城-->
                <div class="zfb_bgc" style="display: flex; flex-direction: column;" v-if="list_jf.list && list_jf.list.length > 0">
                    <div class="goodsDetail">
                        <span class="goods_title">积分商城</span>
                        <span class="goods_text">热销爆款，超值兑换</span>
                    </div>
                    <img @tap="_navigateTo('/pagesB/integral/integral')" class="home_integral_img" :src="home_integral_img"
                        alt="" />
                    <template v-for="(item, index) in list_jf.list">
                        <div class="integral" v-if="index < 2" :key="index" @tap="_navigateTo('/pagesB/integral/integral_detail?pro_id=' + item.id)">
                            <img :src="item.imgurl" alt="" />
                            <div style="flex: 1;">
                                <p class="integral_name">{{ item.product_title }}</p>
                                <span class="integral_num">
                                    已售
                                    <span>{{ item.sales }}</span>
                                    件
                                </span>
                                <div class="integral_bottom">
                                    <div class="integral_price">
                                        <div>
                                            <template v-if="item.money > 0">
                                                ￥
                                                <p>{{ item.money }}</p>
                                                +
                                            </template>
                                            <img :src="jf_h" alt="" />
                                            <p>{{ item.integral }}</p>
                                        </div>
                                        <p>
                                            市场价:
                                            <span>￥{{ item.price }}</span>
                                        </p>
                                    </div>
                                    <div class="btn" @tap.stop="_navigateTo('/pagesB/integral/integral_order?id=' + item.id)">立即兑换</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <!--  间隔  -->
                <div class="hr"></div>
                <!--猜你喜欢-->
                <div :style="{ marginBottom: h5Height }" class="zfb_bgc">
                    <div class="goodsDetail">
                        <span class="goods_title">猜你喜欢</span>
                        <span class="goods_text">精选人气商品，为你推荐</span>
                    </div>

                    <ul class="goods_ul">
                        <li class="goods_like" v-for="(item, index) in goods_like" :key="index" @tap="_goods(item.id)">
                            <div style="display: flex;position: relative;">
                                <image class="goods_like_img" lazy-load :src="item.imgurl" />
                                <div v-if="item.status == 3" class="dowmPro">
                                    已下架
                                </div>
                            </div>
                            <p>{{ item.product_title || item.name }}</p>
                            <div class="tags">
                                <span class="darkred tag" v-if="item.rx">热销</span>
                                <span class="yellow tag" v-if="item.tj">推荐</span>
                                <span class="green tag" v-if="item.xp">新品</span>
                            </div>
                            <div class="goods_mun">
                                <div>
                                    <span class="goods_mun_price">
                                        ￥
                                        <span class="span">{{ item.price }}</span>
                                    </span>
                                    <div class="goods_mun_data">
                                        <span class="span">月销量：{{ item.volume }}件</span>
                                        <img class="img" @tap.stop="_discover(item.id)" :src="disc" />
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <uni-load-more :loadingType="loadingType"></uni-load-more>
                </div>
                <div class="bg"></div>
            </div>
        </div>
        <!-- APP更新 -->
        <div class="mask" v-if="widgetinfoo">
            <div class="mask_all">
                <img :src="upbg" class="mask_bg" />
                <img :src="close" class="mask_close" @tap="close_mask()" />
                <b class="mask_titel">{{ newapp.version }}更新内容</b>
                <div class="mask_content">
                    <wxParse :content="newapp.note"></wxParse>
                </div>
                <div class="mask_text">
                    <div class="mask_btn" @tap="update()">立即升级</div>
                </div>
            </div>
        </div>

        <div class="mask" v-if="is_sign" @touchmove.stop.prevent>
            <div class="signMask">
                <img class="home_sign" :src="home_sign" alt="">

                <div class="sign_content">签到领积分<br>连续签到赢<span>大礼包</span></div>

                <div class="btn" @tap="_navigateTo('/pagesA/shop/sign')">立即去签到1</div>

                <img class="cha" :src="cha" alt="" @tap="is_sign=false">
            </div>
        </div>

        <skeleton :animation="true" :loading="true" v-if="!banner" bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
    import {
        mapMutations,
        mapState
    } from 'vuex';
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue';

    export default {
        data() {
            return {
                widgetinfoo: false,
                guiderImg: '',
                guider: true,
                logo: '',
                fastTap: false,
                icon_search: this.$common.ROOT_URL + '/static/images/icon/icon_search.png',
                icon_message: this.$common.ROOT_URL + '/static/images/icon/icon_message.png',
                bottom: 1,
                banner: '', //banner轮播图
                goods_centre: '', //中间商品
                goods_like: '', //猜你喜欢商品
                centre_list: '', //中间商品对应的商品列表
                title_index: 0,
                page: 1, //加载页面
                loadingType: 0,
                scan: '',
                straining: true,
                display: false, //热门推荐的遮罩层
                arr: [],
                tran: '',
                goods_title: [],
                plusArr: [],
                cunt: 5,
                coupon_t: true,
                sign_t: true,
                task_t: true,
                draw_t: true,
                // coupon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/youhuiquan2x.png',
                // coupon_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/6662x.png',
                // sign: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/qiandaolll2x.png',
                // sign_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/8882x.png',
                // task: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/renwu2x.png',
                // task_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/7772x.png',
                // draw: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/choujiang2x.png',
                // draw_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/9992x.png',
                // group1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/group12x.png',
                // group2: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/group22x.png',

                ptImg: true,
                plugin_arr: [],
                newapp: '',
                isClick: false, //防止连续点击
                xxnum: 0,
                list_jf: {},
                is_sign: false,
            };
        },
        onTabItemTap(e) {
            this.LaiKeTuiCommon.closeMPAuthWin(this);
        },
        onShareAppMessage: function(res) {
            return {
                title: 'HIRRA',
                path: '/pages/tabBar/home',
                success: function(res1) {
                    console.log('转发成功');
                }
            };
        },
        onLoad(option) {
            // 有分享的属性
            if (option.isfx == true || option.isfx == 'true') {
                if (option.pages == 'goodsDetailed') {
                    if (option.fatherId != '' || option.fatherId) {
                        uni.navigateTo({
                            url: '/pages/goods/goodsDetailed?productId=' + option.productId +
                                '&isfx=true&fatherId=' + option.fatherId
                        });
                        return false;
                    }
                    uni.navigateTo({
                        url: '/pages/goods/goodsDetailed?productId=' + option.productId + '&isfx=true'
                    });
                    return false;
                } else if (option.pages == 'groupDetailed') {
                    uni.navigateTo({
                        url: '/pagesA/group/groupDetailed?pro_id=' + option.pro_id + '&activity_no=' + this.option
                            .activity_no + '&isfx=true'
                    });
                    return false;
                } else if (option.pages == 'group_end') {
                    uni.navigateTo({
                        url: '/pagesA/group/group_end?sNo=' + option.sNo + '&friend=true&isfx=true'
                    });
                    return false;
                }
            }

            this.isClick = false;
            // #ifdef APP-PLUS
            this.widgetinfo();
            // #endif
        },
        computed: {
            halfWidth: function() {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state
                    .data_height;
                var heigh = parseInt(gru);

                // #ifdef MP
                heigh = 0;
                // #endif

                var he = heigh * 2;
                return uni.upx2px(he) + 'px';
            },
            h5Height: function() {
                var height;
                // #ifdef H5
                height = 100;
                // #endif
                // #ifndef H5
                height = 0;
                // #endif
                return uni.upx2px(height) + 'px';
            },
            width1: function() {
                var width;
                width = this.goods_centre.length * 150;
                return uni.upx2px(width) + 'px';
            },
            ...mapState({
                _cart_num: 'cart_num'
            })
        },
        onShow() {
            this.loadingType = 0;
            var isfx = uni.getStorageSync('isfx');

            // this.LaiKeTuiCommon.getUrlFirst(this._axios);
            this.getHomeProfile();

            if (isfx) {
                var pages = uni.getStorageSync('pages');
                if (pages == 'goodsDetailed') {
                    var fatherId = uni.getStorageSync('fatherId');
                    var productId = uni.getStorageSync('productId');
                    uni.removeStorageSync('isfx');
                    uni.removeStorageSync('pages');
                    uni.removeStorageSync('fatherId');
                    uni.removeStorageSync('productId');
                    if (fatherId != '' || fatherId) {
                        uni.navigateTo({
                            url: '/pages/goods/goodsDetailed?productId=' + productId + '&isfx=true&fatherId=' +
                                fatherId
                        });
                        return false;
                    }
                    uni.navigateTo({
                        url: '/pages/goods/goodsDetailed?productId=' + productId + '&isfx=true'
                    });
                    return false;
                } else if (pages == 'groupDetailed') {
                    var pro_id = uni.getStorageSync('pro_id');
                    var activity_no = uni.getStorageSync('activity_no');
                    uni.removeStorageSync('pro_id');
                    uni.removeStorageSync('activity_no');
                    uni.removeStorageSync('isfx');
                    uni.removeStorageSync('pages');
                    uni.navigateTo({
                        url: '/pagesA/group/groupDetailed?pro_id=' + pro_id + '&activity_no=' + activity_no +
                            '&isfx=true'
                    });
                    return false;
                } else if (pages == 'group_end') {
                    var sNo = uni.getStorageSync('sNo');
                    uni.removeStorageSync('sNo');
                    uni.removeStorageSync('isfx');
                    uni.removeStorageSync('pages');
                    uni.removeStorageSync('friend');
                    uni.navigateTo({
                        url: '/pagesA/group/group_end?sNo=' + sNo + '&friend=true&isfx=true'
                    });
                    return false;
                }
            }


            //添加tabbar购物车小点提醒
            this.showCartNumInfo();
            this.isClick = false;
            // #ifndef H5
            if (!this.$store.state.isMe) {
                uni.getClipboardData({
                    success: (res) => {
                        var r = new RegExp('lkt-', 'ig');
                        if (res.data) {
                            if (res.data.match(r)) {
                                var url = res.data.replace(r, '../../');
                                uni.navigateTo({
                                    url,
                                    success: () => {
                                        this.$store.state.isMe = true;
                                    }
                                });
                            }
                        }
                    }
                });
            }
            // #endif
        },
        onReachBottom: function() {
            if (this.loadingType != 0) {
                return;
            }
            this.loadingType = 1;
            var data = {
                module: 'app',
                action: 'index',
                app: 'get_more',
                page: this.page
            };

            if (this.goods_like && this.goods_like.length > 0) {

                this.$req.post({
                    data
                }).then(res => {
                    let {
                        data
                    } = res;
                    this.page += 1;
                    if (data.length > 0) {
                        this.goods_like = this.goods_like.concat(data);
                        this.loadingType = 0;
                    } else {
                        this.loadingType = 2;
                    }
                })

            }
        },
        methods: {
            getHomeProfile() {
                let data = {
                    storeId: this.$common.STORE_ID,
                    storeType: this.$common.getStoreType(),
                    token: this.$store.state.token
                }
                this.$index.getHomeProfile(data).then(res => {
                    this.banner = res.bannerList;
                    console.log(this.banner)
                }).catch(e => {})
            },

            getAppPluginImg(img) {
                let plugin_shortcoin = this.LaiKeTuiCommon.LKT_ENDURL + img;
                return plugin_shortcoin;
            },
            changeLoginStatus() {

                this._axios();
            },
            widgetinfo() {
                var me = this;
                plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
                    uni.request({
                        url: uni.getStorageSync('endurl') + 'widgetinfo/update.php?store_id=' + me.LaiKeTuiCommon
                            .LKT_STORE_ID,
                        data: {
                            version: widgetInfo.version,
                            name: widgetInfo.name
                        },
                        success: result => {
                            me.newapp = result.data;
                            if (uni.getSystemInfoSync().platform === 'android') {
                                me.newapp.url = me.newapp.android_url;
                            } else {
                                me.newapp.url = me.newapp.ios_url;
                            }
                            if (me.newapp.status == 1) {
                                me.widgetinfoo = true;
                                uni.hideTabBar();
                            }
                        }
                    });
                });
            },
            update() {
                this.widgetinfoo = false;
                uni.showTabBar();
                plus.runtime.openURL(this.newapp.url, function(res) {
                    uni.showToast({
                        title: '更新失败！！',
                        duration: 1000,
                        icon: 'none'
                    });
                });
            },
            ...mapMutations({
                cindex: 'SET_CINDEX',
                gxxunm: 'SET_GXXNUM'
            }),
            _toAllGoods(url, type, parameter) {
                if (url) {
                    if (type == 'navigate') {
                        uni.navigateTo({
                            url
                        });
                        this.page = 1;
                        this.loadingType = 0;
                    } else if (type == 'switchTab') {
                        this.page = 1;
                        this.loadingType = 0;
                        uni.switchTab({
                            url
                        });
                    }
                }
            },
            _coupon(num) {
                this.plugin_arr[num].status = true;
            },
            _oncoupon(url, num) {
                this.plugin_arr[num].status = false;
                this.page = 1;
                this.loadingType = 0;
                uni.navigateTo({
                    url
                });
            },
            _focus() {
                this.page = 1;
                this.loadingType = 0;
                uni.navigateTo({
                    url: '/pagesA/search/search'
                });
            },
            /*   商品导航切换    */
            _title(index) {
                this.title_index = index;
                this.centre_list = this.goods_centre[index].list;
            },
            /*   跳转商品详情页    */
            _goods(id) {
                this.page = 1;
                this.loadingType = 0;
                this.pro_id(id);
                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed?toback=true&pro_id=' + id
                });
            },
            close_mask() {
                uni.showTabBar();
                this.widgetinfoo = false;
            },
            _discover(id) {
                this.page = 1;
                this.loadingType = 0;
                this.pro_id(id);
                uni.navigateTo({
                    url: '/pages/collection/discover?pro_id=' + id
                });
            },
            _axios() {
                var data = {
                    module: 'app',
                    action: 'index',
                    app: 'index',

                };
                //#ifndef MP-WEIXIN
                data.store_type = 2;
                // #endif
                //#ifdef MP-WEIXIN
                data.store_type = 1;
                // #endif

                this.$req.post({
                    data,
                    xhrFields: {
                        withCredentials: true
                    }
                }).then(res => {
                    let {
                        data: {
                            banner,
                            list2,
                            list3,
                            logo,
                            plugin_arr,
                            xxnum,
                            list_jf,
                            is_sign_status,
                            sign_status
                        }
                    } = res;

                    if (is_sign_status == 1 && sign_status == 1) {
                        this.is_sign = true
                    }

                    this.banner = banner;
                    this.goods_centre = list2;
                    this.goods_like = list3;
                    this.list_jf = list_jf;
                    this.logo = logo;
                    this.centre_list = this.goods_centre[this.title_index].list;
                    this.plugin_arr = plugin_arr;
                    this.xxnum = xxnum > 99 ? '99+' : xxnum; //限制消息数超过99时显示99+
                    this.page = 1;
                    let plas = [];
                    for (var x in plugin_arr) {
                        plas[x] = plugin_arr[x];
                        plas[x]['appimg'] = this.getAppPluginImg(plugin_arr[x]['appimg']);
                    }
                    this.plugin_arr = plas;
                })

            },
            //添加tabbar购物车小点提醒
            showCartNumInfo() {
                if (this._cart_num) {
                    var cart_num_str = String(this._cart_num);

                    // #ifdef MP-WEIXIN
                    uni.setTabBarBadge({
                        index: 3,
                        text: cart_num_str
                    });
                    // #endif

                    // #ifndef MP-WEIXIN
                    uni.setTabBarBadge({
                        index: 2,
                        text: cart_num_str
                    });
                    // #endif


                } else {
                    // #ifdef MP-WEIXIN
                    uni.removeTabBarBadge({
                        index: 3
                    });
                    // #endif

                    // #ifndef MP-WEIXIN
                    uni.removeTabBarBadge({
                        index: 2
                    });
                    // #endif

                }
            },
            ...mapMutations({
                pro_id: 'SET_PRO_ID',
                arr_home: 'SET_ARR_HOME',
                data_height: 'SET_DATA_HEIGHT'
            }),

            _navigateTo(url) {
                if (this.isClick === false) {
                    this.isClick = true;
                    this.isLogin(() => {
                        this.is_sign = false
                        uni.navigateTo({
                            url: url
                        });
                    })
                    setTimeout(function() {
                        this.isClick = false;
                    }, 800);
                }
            },
        },
        components: {
            wxParse
        }
    };
</script>

<style scoped>
    @import url('../../static/css/tab/home.css');
</style>
