<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <div class="head_div">
            <heads :title="title" :returnFlag="is_share"></heads>
            <!-- #ifndef MP -->
            <view class="gz" @tap="_share()" v-clipboard:copy="shareHref" id="copyshare" :data-clipboard-text="shareHref"
                :style="'top:' + halfWidth">
                <img class="wen_img" :src="share_img" />
                <font class="shaer_font">分享</font>
            </view>
            <!-- #endif -->
        </div>
        <!-- #ifdef MP-WEIXIN -->
        <button id="copyshare" :data-clipboard-text="shareHref" class="gz" @tap="showShareMask(shopId)">
            <img class="wen_img" :src="icon_share" />
            <font class="shaer_font">分享</font>
        </button>
        <!-- #endif -->
        <div class="relative" v-if="!load">
            <div class="storeTop">
                <div class="storeTop_title">
                    <div class="storeTopLeft">
                        <img :src="shop.logo" />
                        <div class="storeTopLeftText">
                            <div class="storeName">{{ shop.name }} <span class="is_open" v-if="is_open == 2">已打烊</span></div>
                            <div class="storeSellNum">{{ shop.onSaleGoodsNum ? shop.onSaleGoodsNum : 0 }}在售商品 | 已售{{ shop.totalSalesVolume ? shop.totalSalesVolume : 0 }}件</div>
                        </div>
                    </div>
                    <div class="storeTopRight">
                        <div class="center" @tap="_collStore()">
                            <div v-if="collection_status == 0" class="collectionBtn">
                                <img class="img" :src="icon_follow" />
                                收藏
                            </div>
                            <div v-else-if="collection_status == 1" class="collectionBtn1">已收藏</div>
                        </div>
                        <div>{{ shop.followNum ? shop.followNum : 0 }}人收藏</div>
                    </div>
                </div>
                <div v-if="entityStoreList && entityStoreList[0]" class="storeTop_content">
                    <div class="storeTop_content_top" @tap="showEntityStoreInfo">
                        查看门店信息
                        <img :src="show_hide_entity_store_img" />
                    </div>
                    <div class="storeTop_content_bottom" :style="entity_store_show_flag ? '' : 'height:0;'">
                        <p class="w_50">线下门店：{{ entityStoreList[0].name }}</p>
                        <p class="w_50">营业时间：{{ entityStoreList[0].businessHours }}</p>
                        <p class="w_100">联系电话：{{ entityStoreList[0].tel }}</p>
                        <p class="w_100">门店地址：{{ entityStoreList[0].province + entityStoreList[0].city 
                            + entityStoreList[0].district + entityStoreList[0].address }}</p>
                    </div>
                </div>
            </div>
            <div class="topThreeBar">
                <div :class="{ active: tab == shop_tab_recommend }" @tap="changeTab(shop_tab_recommend)">
                    推荐
                    <p class="hen" v-if="tab == shop_tab_recommend"></p>
                </div>
                <div :class="{ active: tab == shop_tab_all_goods }" @tap="changeTab(shop_tab_all_goods)">
                    全部商品
                    <p class="hen" v-if="tab == shop_tab_all_goods"></p>
                </div>
                <div :class="{ active: tab == shop_tab_goods_class }" @tap="changeTab(shop_tab_goods_class)">
                    商品分类
                    <p class="hen" v-if="tab == shop_tab_goods_class"></p>
                </div>
            </div>
            <!-- 直播入口 -->
            <!-- #ifdef MP-WEIXIN -->
            <div class="liveIndex" v-if="showLive">
                <img :src="liveImg" alt="" />
                <view>
                    <view>{{ liveTitle }}</view>
                    <view class="tag" v-if="liveStatus">
                        <img :src="live" alt="" />
                        <text>直播</text>
                    </view>
                    <view class="retag tag" v-else>
                        <img :src="replay" alt="" />
                        <text>回放</text>
                    </view>
                    <navigator open-type="navigate" :url="liveUrl">立即观看</navigator>
                </view>
            </div>
            <!-- #endif -->
            <ul class="goods_ul" v-if="tab == shop_tab_recommend">
                <li class="goods_like" v-for="(item, index) in goodsList" :key="index" @tap="_goods(item.id)">

                    <div class="goods_like_img relative" style="margin: 5px auto;">
                        <image lazy-load :src="item.image" style="width: 100%;height: 100%;" />

                        <div v-if="item.status == 3" class="dowmPro">
                            已下架
                        </div>
                    </div>

                    <p class="overtitle">{{ item.name }}</p>
                    <p class="overflowText">{{ item.shortName }}</p>
                    <div class="goods_mun">
                        <div>
                            <span class="color_FF0">
                                ￥
                                <span class="color_FF0 weight">{{ item.sellPrice }}</span>
                            </span>
                            <div class="volume">
                                <span>月销量：{{ item.salesVolume }}件</span>
                                <img @tap.stop="_discover(item.id)" class="img" :src="icon_discover" />
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="goods_ul" v-if="tab == shop_tab_all_goods">
                <li class="goods_like" v-for="(item, index) in goodsList" :key="index" @tap="_goods(item.id)">
                    <div class="goods_like_img relative" style="margin: 5px auto;">
                        <image lazy-load :src="item.image" style="width: 100%;height: 100%;" />

                        <div v-if="item.status == 3" class="dowmPro">
                            已下架
                        </div>
                    </div>
                    <p>{{ item.name }}</p>
                    <p class="overflowText">{{ item.shortName }}</p>
                    <div class="goods_mun">
                        <div>
                            <span class="color_FF0">
                                ￥
                                <span class="color_FF0 weight">{{ item.sellPrice }}</span>
                            </span>
                            <div class="volume">
                                <span>月销量：{{ item.salesVolume }}件</span>
                                <img @tap.stop="_discover(item.id)" class="img" :src="icon_discover" />
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="tab == shop_tab_goods_class">
                <ul>
                    <li @tap="toGoods(item.pname, item.cid)" v-for="(item, index) in goodsClassList" :key="index" class="proClass">
                        {{ item.name }}
                        <img :src="icon_right_arrow" alt="" />
                    </li>
                </ul>
            </div>
            <div class="mask" @tap="_shareDiv" v-if="shareDiv">
                <div class="allCenter">
                    <div v-for="(item, index1) in shareWay" :key="index1" @tap="_invite(item.name)">
                        <div><img :src="item.imgUrl" class="img" /></div>
                        <span class="span">{{ item.name }}</span>
                    </div>
                </div>
            </div>
            <div class="mask" v-if="saveQrCodeFlag && icon_download">
                <div class="shareEwm">
                    <img :src="ewmImg" class="imgEwm" />
                    <img :src="icon_share_close" class="close" @tap="_closeAllMask" />
                    <view class="saveEWMBtn" @tap="_downEWM()">
                        <img :src="icon_download" class="saves" />
                        保存图片
                    </view>
                </div>
            </div>
            <!-- 分享弹框 -->
            <div class="mask" @tap="_closeAllMask" v-if="shareMask">
                <div class="shareMask" @tap.stop>
                    <div class="shareMaskTitle">分享至</div>
                    <div class="sharepyq">
                        <div class="shareIcon">
                            <button class="share_btn" open-type="share">
                                <img :src="icon_share_wechat" />
                                <p class="p">微信好友</p>
                            </button>
                        </div>
                        <div class="shareIcon" @tap="showSaveQrCodeMask('wx')">
                            <img :src="icon_share_qr_code" />
                            <p>二维码分享</p>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="shareEnd" @tap="closeShareMask()">取消</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        LaiKeTuiInvite,
        LaiKeTuiShopEWM
    } from '../../static/js/goods/goodsDetail.js';
    import {
        mapMutations
    } from 'vuex';
    // #ifdef H5
    import {
        copyText
    } from '@/common/util.js';
    // #endif
    export default {
        data() {
            return {
                load: true,
                shop_list: [], //线下门店
                // 线下门店/实体门店
                entityStoreList: [],

                shop_tab_recommend: this.$common.SHOP_TAB.RECOMMEND,
                shop_tab_all_goods: this.$common.SHOP_TAB.ALL_GOODS,
                shop_tab_goods_class: this.$common.SHOP_TAB.GOODS_CLASS,
                shopId: '',
                // 店铺
                shop: '',
                // 线下门店显示flag
                entity_store_show_flag: false,
                // 显示/隐藏 线下门店
                // 默认隐藏
                show_hide_entity_store_img: this.$common.ROOT_URL + '/static/images/icon/shop/icon_hide_content.png',

                tab: this.$common.SHOP_TAB.RECOMMEND,
                // 下载
                icon_download: this.$common.ROOT_URL + '/static/images/icon/icon_download.png',
                // 分享
                icon_share: this.$common.ROOT_URL + '/static/images/icon/shop/icon_share.png',
                // 收藏关注
                icon_follow: this.$common.ROOT_URL + '/static/images/icon/shop/icon_follow.png',
                // 发现
                icon_discover: this.$common.ROOT_URL + '/static/images/icon/shop/icon_discover.png',
                // "更多"箭头
                icon_right_arrow: this.$common.ROOT_URL + '/static/images/icon/tab/icon_right_arrow.png',
                title_index: 0,
                // 微信分享
                icon_share_wechat: this.$common.ROOT_URL + '/static/images/icon/icon_share_wechat.png',
                // 二维码分享
                icon_share_qr_code: this.$common.ROOT_URL + '/static/images/icon/icon_share_qr_code.png',
                // 关闭分享
                icon_share_close: this.$common.ROOT_URL + '/static/images/icon/icon_share_close.png',
                // scImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sc2x.png',
                // live: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/live.png',
                // replay: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/replay.png',

                title: '店铺主页',
                collStatus: true,
                fastTap: true,

                goodsList: [],
                goodsClassList: [],
                proList: '',
                page: 1,
                loadingType: 0,
                shop_name: '',
                shop_logo: '',
                collection_num: '',
                collection_status: '',
                quantity_on_sale: '',
                quantity_sold: '',
                shareHref: '', //分享的链接
                shareHref2: '', //转发的链接
                shareContent: '一起来用来客推吧！', //分享的内容
                sharehrefTitle: '一起来用来客推吧!', //分享的链接的标题
                // 分享标题
                shareTitle: '',
                // 分享内容
                shareContent: '',
                shareImg: '', //分享的图片
                allPro: '',
                shareDiv: false,
                shareMask: false,
                saveQrCodeFlag: false,
                ewmImg: '',
                is_share: false,
                shareWay: [
                    // #ifndef MP-WEIXIN
                    {
                        name: '微信',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png'
                    },
                    {
                        name: '朋友圈',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fdc.png'
                    },
                    {
                        name: '二维码分享',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png'
                    }
                    // #endif
                ],
                liveImg: '',
                liveTitle: '',
                showLive: false,
                liveUrl: '',
                liveStatus: false,
                liveGoods: [], //直播商品
                is_open: 0
            };
        },
        onLoad(option) {
            this.shopId = option.shopId;
            this.is_share = option.is_share;
            var url = uni.getStorageSync('h5_url');
            this.shareHref = url + '/pagesA/store/store?is_share=true&shop_id=' + this.shopId;
            this.shareHref2 = '/pagesA/store/store?is_share=true&shop_id=' + this.shopId;
        },

        // 补充onShow,从登录页面回来后刷新登录状态
        onShow() {
            // this.axios();
            // 获取店铺详情
            this.getShopDetail();
            this.loadingType = 0;
            this.page = 1;
        },
        computed: {
            width1: function() {
                var width;
                if (this.tab == this.$common.SHOP_TAB.RECOMMEND || this.tab == this.$common.SHOP_TAB.ALL_GOODS) {
                    width = this.goodsList.length * 150;
                } else {
                    width = this.goodsClassList.length * 150;
                }
                return uni.upx2px(width) + 'px';
            }
        },
        onShareAppMessage: function(res) {
            this.shareMask = false;

            return {
                title: this.shareTitle,
                path: this.shareHref2,
                imageUrl: this.shareImg,
                bgImgUrl: this.shareImg,
                success: function(res) {
                    console.log('成功', res);
                }
            };
        },
        onReachBottom: function() {
            // tab 1推荐 2全部商品 3商品分类
            if (this.loadingType != 0) {
                return;
            }
            this.loadingType = 1;
            if (this.tab != this.shop_tab_goods_class) {
                this.page += 1;
                let data = {
                    storeId: this.$common.STORE_ID,
                    shopId: this.shopId,
                    tab: this.tab,
                    page: this.page
                }
                this.$shop.getShopGoodsList(data).then(res => {
                    if (res.length > 0) {
                        this.goodsList = this.goodsList.concat(res);
                        this.loadingType = 0;
                    } else {
                        this.loadingType = 2;
                    }
                })
            }
        },
        methods: {
            getShopDetail: function() {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });
                let data = {
                    storeId: this.$common.STORE_ID,
                    shopId: this.shopId,
                    tab: this.tab
                }
                this.$shop.getShopDetail(data).then(res => {
                    this.load = false;
                    uni.hideLoading();
                    this.shop = res;
                    this.entityStoreList = res.entityStoreList;
                    this.goodsList = res.goodsList;
                    this.goodsClassList = res.goodsClassList;
                })
            },

            async getLiveRoomImg(id) {
                let data = {
                    module: 'app',
                    action: 'liveBroadcast',
                    app: 'getLiveList',
                    start: this.start,
                    limit: this.limit
                };
                let res = await this.$req.post({
                    data
                });

                if (res.code == 200) {
                    let tempList = res.list.room_info.filter(item => {
                        if (item.roomid == id) {
                            this.liveImg = item.cover_img;
                            this.liveTitle = item.name;
                            if (item.live_status == 101) {
                                this.showLive = true;
                                this.liveStatus = true;
                                this.liveUrl =
                                    `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`;
                            } else if (item.live_status == 103) {
                                this.liveStatus = false;
                                this.showLive = true;
                                this.liveUrl =
                                    `../../pages/liveReplay/liveReplay?roomID=${item.roomid}&title=${item.name}&img=${item.cover_img}`;
                                this.liveGoods = item.goods;
                                this.replayGoods(item.goods);
                            } else {
                                this.showLive = false;
                            }
                        }
                    });
                }
            },
            _downEWM() {
                uni.getImageInfo({
                    src: this.ewmImg,
                    success: function(sres) {
                        uni.saveImageToPhotosAlbum({
                            filePath: sres.path,
                            success: function() {
                                uni.showToast({
                                    title: '保存图片成功',
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                    },
                    fail: function() {
                        uni.showToast({
                            title: '保存图片失败',
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
            },
            _closeAllMask() {
                this.shareMask = false;
                this.saveQrCodeFlag = false;
            },
            _shareDiv() {
                this.shareDiv = false;
            },
            _invite(type) {
                LaiKeTuiInvite(type, this);
            },
            // 显示保存二维码弹窗
            showSaveQrCodeMask(string) {
                this.shareMask = false;
                this.saveQrCodeFlag = true;
                // LaiKeTuiShopEWM(string, this);
            },
            saveQrCode() {
                // var data = {
                //     module: 'app',
                //     action: 'getcode',
                //     m: 'share_shop',
                //     shop_id: me.shop_id,
                // }

                // // #ifdef MP-WEIXIN
                // data.store_type = 1
                // // #endif
                // // #ifndef MP-WEIXIN
                // data.store_type = 2
                // // #endif
                // me.$req.post({data}).then(res => {
                //     if (res.code == 200) {
                //         me.ewmImg = uni.getStorageSync('endurl') + res.imgUrl
                //         me.saveEWM = true
                //     } else if (res.code == 404) {
                //         me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../login/login')
                //     } else {
                //         uni.showToast({
                //             title: res.message,
                //             duration: 1500,
                //             icon: 'none'
                //         })
                //     }
                // })
            },
            _share() {
                this.isLogin(() => {
                    // #ifdef H5
                    uni.showToast({
                        title: '复制成功！',
                        duration: 1500,
                        icon: 'none'
                    });
                    // #endif
                    // #ifndef H5
                    // #ifndef MP-WEIXIN
                    this.shareDiv = true;
                    // #endif
                    // #endif
                })
            },
            _back() {
                uni.navigateBack({
                    delta: 1
                });
            },
            changeLoginStatus() {
                this.axios();
            },
            toGoods(name, cid) {
                uni.navigateTo({
                    url: '/pages/goods/goods?cid=' + cid + '&name=' + name + '&shop_id=' + this.shopId
                });
            },
            changeTab(num) {
                this.tab = num;
                this.page = 1;
                this.loadingType = 0;
                // this.axios();
                this.getShopDetail();
            },
            _discover(id) {
                this.$store.state.pro_id = id;
                uni.navigateTo({
                    url: '/pages/collection/discover?pro_id=' + id
                });
            },
            _goods(id) {
                this.$store.state.pro_id = id;
                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed?pro_id=' + id
                });
            },
            // 显示分享弹窗
            showShareMask(shopId) {
                this.is_shop = true;
                this.shop_id = shopId;
                this.shareTitle = this.shop.name;
                this.shareImg = this.shop_list.shop_logo;
                this.shareContent = this.shop.name;
                var url = uni.getStorageSync('url');
                url = url.split('index')[0];
                this.shareHref = url + 'H5/#/pagesA/store/store?is_share=true&shop_id=' + shopId;
                this.shareHref2 = '/pagesA/store/store?is_share=true&shop_id=' + shopId;
                // this.isLogin(() => {
                //     this.shareMask = true;
                // })
                this.shareMask = true;
            },
            closeShareMask() {
                this.shareMask = false;
                this.overflow = 'scroll';
            },
            _collStore() {
                if (!this.fastTap) {
                    return;
                }
                this.fastTap = false;

                this.LaiKeTuiCommon.lktDelaySetVal(this);
                this.isLogin(() => {
                    var data = {
                        module: 'app',
                        action: 'mch',
                        m: 'collection_shop',
                        shop_id: this.shop_id
                    };
                    this.$req
                        .post({
                            data
                        })
                        .then(res => {
                            if (res.code == 200) {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                                setTimeout(() => {
                                    this.fastTap = true;
                                    this.axios();
                                    this.title_index = 0;
                                    this.proList = this.allPro[0];
                                }, 0);
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        })
                        .catch(error => {
                            this.fastTap = true;
                        });
                })
            },
            axios() {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });
                this.$req
                    .post({
                        data: {
                            module: 'app',
                            action: 'mch',
                            m: 'store_homepage',
                            shop_id: this.shop_id,
                            type: this.tab
                        }
                    })
                    .then(res => {
                        this.load = false;
                        uni.hideLoading();
                        if (res.code == 200) {
                            let {
                                data: data1
                            } = res
                            this.list = data1.list;
                            this.shop_name = data1.shop_name;
                            this.shop_logo = data1.shop_logo;
                            this.is_open = data1.is_open;
                            this.collection_num = data1.collection_num;
                            this.collection_status = data1.collection_status;
                            this.quantity_on_sale = data1.quantity_on_sale;
                            this.quantity_sold = data1.quantity_sold;

                            this.sharehrefTitle = this.shop_name;
                            this.shareImg = this.shop_logo;
                            this.shareContent = this.shop_name;

                            // 线下门店
                            this.shop_list = res.data.shop_list;
                            // #ifdef MP-WEIXIN
                            this.getLiveRoomImg(data1.roomid);
                            // #endif

                        } else {
                            uni.showToast({
                                title: res.message,
                                duration: 1500,
                                icon: 'none'
                            });
                        }
                    })
                    .catch(error => {
                        this.load = false;
                        uni.hideLoading();
                    });
            },
            // 显示线下门店信息
            showEntityStoreInfo() {
                this.entity_store_show_flag = !this.entity_store_show_flag;
                if (this.entity_store_show_flag) {
                    this.show_hide_entity_store_img = this.$common.ROOT_URL +
                        '/static/images/icon/shop/icon_show_content.png';
                } else {
                    this.show_hide_entity_store_img = this.$common.ROOT_URL +
                        '/static/images/icon/shop/icon_hide_content.png';
                }
            },
            ...mapMutations({
                replayGoods: 'SET_REPLAY_GOODS'
            })
        }
    };
</script>

<style lang="less" scoped>
    @import url('../../static/css/shop/shop.less');
</style>
