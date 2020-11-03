<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <div class="head_div">
            <heads :title="title" :returnFlag="is_share"></heads>
            <!-- #ifndef MP -->
            <view class="gz" @tap="_share()" v-clipboard:copy="shareHref" id="copyshare" :data-clipboard-text="shareHref" :style="'top:' + halfWidth">
                <img class="wen_img" :src="share_img" />
                <font class="shaer_font">分享</font>
            </view>
            <!-- #endif -->
        </div>
        <!-- #ifdef MP-WEIXIN -->
        <button id="copyshare" :data-clipboard-text="shareHref" class="gz" @tap="showShareMask(shop_id)">
            <img class="wen_img" :src="share_img" />
            <font class="shaer_font">分享</font>
        </button>
        <!-- #endif -->
        <div class="relative" v-if="!load">
            <div class="storeTop">
                <div class="storeTop_title">
                    <div class="storeTopLeft">
                        <img :src="shop_logo" />
                        <div class="storeTopLeftText">
                            <div class="storeName">{{ shop_name }} <span class="is_open" v-if="is_open == 2">已打烊</span></div>
                            <div class="storeSellNum">{{ quantity_on_sale ? quantity_on_sale : 0 }}在售商品 | 已售{{ quantity_sold ? quantity_sold : 0 }}件</div>
                        </div>
                    </div>
                    <div class="storeTopRight">
                        <div class="center" @tap="_collStore()">
                            <div v-if="collection_status == 0" class="collectionBtn">
                                <img class="img" :src="scImg" />
                                收藏
                            </div>
                            <div v-else-if="collection_status == 1" class="collectionBtn1">已收藏</div>
                        </div>
                        <div>{{ collection_num ? collection_num : 0 }}人收藏</div>
                    </div>
                </div>
                <div v-if="shop_list && shop_list[0]" class="storeTop_content">
                    <div class="storeTop_content_top" @tap="storeTop_content_show">
                        查看门店信息
                        <img :src="storeTop_content_img" />
                    </div>
                    <div class="storeTop_content_bottom" :style="store_bottom_flag ? '' : 'height:0;'">
                        <p class="w_50">线下门店：{{ shop_list[0].name }}</p>
                        <p class="w_50">营业时间：{{ shop_list[0].business_hours }}</p>
                        <p class="w_100">联系电话：{{ shop_list[0].mobile }}</p>
                        <p class="w_100">门店地址：{{ shop_list[0].sheng + shop_list[0].shi + shop_list[0].xian + shop_list[0].address }}</p>
                    </div>
                </div>
            </div>
            <div class="topThreeBar">
                <div :class="{ active: tabThree == 1 }" @tap="changeTab(1)">
                    推荐
                    <p class="hen" v-if="tabThree == 1"></p>
                </div>
                <div :class="{ active: tabThree == 2 }" @tap="changeTab(2)">
                    全部商品
                    <p class="hen" v-if="tabThree == 2"></p>
                </div>
                <div :class="{ active: tabThree == 3 }" @tap="changeTab(3)">
                    商品分类
                    <p class="hen" v-if="tabThree == 3"></p>
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
            <ul class="goods_ul" v-if="tabThree == 1">
                <li class="goods_like" v-for="(item, index) in list" :key="index" @tap="_goods(item.id)">
                    
                    <div class="goods_like_img relative" style="margin: 5px auto;">
                        <image  lazy-load :src="item.imgurl" style="width: 100%;height: 100%;"/>
                        
                        <div v-if="item.status == 3" class="dowmPro" >
                            已下架
                        </div>
                    </div>
                    
                    <p class="overtitle">{{ item.product_title }}</p>
                    <p class="overflowText">{{ item.subtitle }}</p>
                    <div class="goods_mun">
                        <div>
                            <span class="color_FF0">
                                ￥
                                <span class="color_FF0 weight">{{ item.price }}</span>
                            </span>
                            <div class="volume">
                                <span>月销量：{{ item.volume }}件</span>
                                <img @tap.stop="_discover(item.id)" class="img" :src="disc" />
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="goods_ul" v-if="tabThree == 2">
                <li class="goods_like" v-for="(item, index) in list" :key="index" @tap="_goods(item.id)">
                    <div class="goods_like_img relative" style="margin: 5px auto;">
                        <image  lazy-load :src="item.imgurl" style="width: 100%;height: 100%;"/>
                        
                        <div v-if="item.status == 3" class="dowmPro" >
                            已下架
                        </div>
                    </div>
                    <p>{{ item.product_title }}</p>
                    <p class="overflowText">{{ item.subtitle }}</p>
                    <div class="goods_mun">
                        <div>
                            <span class="color_FF0">
                                ￥
                                <span class="color_FF0 weight">{{ item.price }}</span>
                            </span>
                            <div class="volume">
                                <span>月销量：{{ item.volume }}件</span>
                                <img @tap.stop="_discover(item.id)" class="img" :src="disc" />
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="tabThree == 3">
                <ul>
                    <li @tap="toGoods(item.pname, item.cid)" v-for="(item, index) in list" :key="index" class="proClass">
                        {{ item.pname }}
                        <img :src="jiantou" alt="" />
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
            <div class="mask" v-if="saveEWM && saves">
                <div class="shareEwm">
                    <img :src="ewmImg" class="imgEwm" />
                    <img :src="close" class="close" @tap="_closeAllMask" />
                    <view class="saveEWMBtn" @tap="_downEWM()">
                        <img :src="saves" class="saves" />
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
                                <img :src="wx_img" />
                                <p class="p">微信好友</p>
                            </button>
                        </div>
                        <div class="shareIcon" @tap="showSaveEWM('wx')">
                            <img :src="erm_img" />
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
import { LaiKeTuiInvite, LaiKeTuiShopEWM } from '../../static/js/goods/goodsDetail.js';
import { mapMutations } from 'vuex';
// #ifdef H5
import { copyText } from '@/common/util.js';
// #endif
export default {
    data() {
        return {
            load: true,
            shop_list: [], //线下门店
            store_bottom_flag: false,
            tabThree: 1,
            saves: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/save.png',
            share_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon/share.png',
            back2: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
            disc: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/2222x.png',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            title_index: 0,
            wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
            erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
            scImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sc2x.png',
            close: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close_bb.png',
            live: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/live.png',
            replay: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/replay.png',
            
            title: '店铺主页',
            collStatus: true,
            fastTap: true,
            shop_id: 1,
            list: '',
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
            shareImg: '', //分享的图片
            allPro: '',
            shareDiv: false,
            shareMask: false,
            saveEWM: false,
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
            storeTop_content_img: 'https://xiaochengxu.laiketui.com/V3/images/icon1/storeBottom.png',
            liveImg: '',
            liveTitle: '',
            showLive: false,
            liveUrl: '',
            liveStatus: false,
            liveGoods: [], //直播商品
            is_open:0
        };
    },
    onLoad(option) {
        
        this.shop_id = option.shop_id;
        this.is_share = option.is_share;
        var url = uni.getStorageSync('h5_url');
        this.shareHref = url + '/pagesA/store/store?is_share=true&shop_id=' + this.shop_id;
        this.shareHref2 = '/pagesA/store/store?is_share=true&shop_id=' + this.shop_id;
    },

    // 补充onShow,从登录页面回来后刷新登录状态
    onShow() {
        
        this.axios();
        this.loadingType = 0;
        this.page = 1;
    },
    computed: {
        width1: function() {
            var width;
            width = this.list.length * 150;
            return uni.upx2px(width) + 'px';
        }
    },
    onShareAppMessage: function(res) {
        this.shareMask = false;

        return {
            title: this.sharehrefTitle,
            path: this.shareHref2,
            imageUrl: this.shareImg,
            bgImgUrl: this.shareImg,
            success: function(res) {
                console.log('成功', res);
            }
        };
    },
    onReachBottom: function() {
        // tabThree 1推荐 2全部商品 3商品分类
        if (this.loadingType != 0) {
            return;
        }
        this.loadingType = 1;
        if (this.tabThree != 3) {
            var data = {
                module: 'app',
                action: 'mch',
                m: 'store_homepage_load',
                page: this.page,
                
                shop_id: this.shop_id,
                type: this.tabThree
            };
            if (this.list.length > 0) {
                this.$req.post({ data }).then(res => {
                    this.page += 1;
                    if (res.list.length > 0) {
                        this.list = this.list.concat(res.list);
                        this.loadingType = 0;
                    } else {
                        this.loadingType = 2;
                    }
                });
            }
        }
    },
    methods: {
        async getLiveRoomImg(id) {
            let data = {
                module: 'app',
                action: 'liveBroadcast',
                app: 'getLiveList',
                start: this.start,
                limit: this.limit
            };
            let res = await this.$req.post({ data });

            if (res.code == 200) {
                let tempList = res.list.room_info.filter(item => {
                    if (item.roomid == id) {
                        this.liveImg = item.cover_img;
                        this.liveTitle = item.name;
                        if (item.live_status == 101) {
                            this.showLive = true;
                            this.liveStatus = true;
                            this.liveUrl = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`;
                        } else if (item.live_status == 103) {
                            this.liveStatus = false;
                            this.showLive = true;
                            this.liveUrl = `../../pages/liveReplay/liveReplay?roomID=${item.roomid}&title=${item.name}&img=${item.cover_img}`;
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
            this.saveEWM = false;
        },
        _shareDiv() {
            this.shareDiv = false;
        },
        _invite(type) {
            LaiKeTuiInvite(type, this);
        },
        showSaveEWM(string) {
            this.shareMask = false;
            LaiKeTuiShopEWM(string, this);
        },
        _share() {
            this.isLogin(()=>{
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
                url: '/pages/goods/goods?cid=' + cid + '&name=' + name + '&shop_id=' + this.shop_id
            });
        },
        changeTab(num) {
            this.tabThree = num;
            this.page = 1;
            this.loadingType = 0;
            this.axios();
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
        showShareMask(shop) {
            this.is_shop = true;
            this.shop_id = shop;
            this.sharehrefTitle = this.shop_list.shop_name;
            this.shareImg = this.shop_list.shop_logo;
            this.shareContent = this.shop_list.shop_name;
            var url = uni.getStorageSync('url');
            url = url.split('index')[0];
            this.shareHref = url + 'H5/#/pagesA/store/store?is_share=true&shop_id=' + shop;
            this.shareHref2 = '/pagesA/store/store?is_share=true&shop_id=' + shop;
            this.isLogin(()=>{
				this.shareMask = true;
			})
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
            this.isLogin(()=>{
				var data = {
				    module: 'app',
				    action: 'mch',
				    m: 'collection_shop',
				    shop_id: this.shop_id
				};
				this.$req
				    .post({ data })
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
                        type: this.tabThree
                    }
                })
                .then(res => {
                    this.load = false;
                    uni.hideLoading();
                    if (res.code == 200) {
                        let {data: data1} = res
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
        storeTop_content_show() {
            this.store_bottom_flag = !this.store_bottom_flag;
            if (this.store_bottom_flag) {
                this.storeTop_content_img = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeTop.png';
            } else {
                this.storeTop_content_img = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeBottom.png';
            }
        },
        ...mapMutations({ replayGoods: 'SET_REPLAY_GOODS' })
    }
};
</script>

<style lang="less" scoped>
@import url('../../static/css/shop/shop.less');
</style>
