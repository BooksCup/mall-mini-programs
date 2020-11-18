<template>
    <div class="order_ii goodsDetail" :style="{ overflow: overflow }">
        <authorize ref="authorizeComp" v-on:pChangeLoginStatus="changeLoginStatus" v-on:cancle="cancle"></authorize>
        <div ref="box" id="boxs" class="relative" @touchmove="setHead">
            <!--头部-->
            <!-- #ifndef MP -->
            <div class="data_h" :style="{ height: halfWidth }">
                <div class="data_h_h" :style="{ height: halfWidth }"></div>
            </div>

            <!-- 砍价头部 -->
            <div v-if="bargain">
                <!-- #ifndef MP-WEIXIN || MP-ALIPAY -->
                <div class="bargain_top" :style="{ top: halfWidth }">
                    <div class="position_head" :style="{ top: halfWidth }">
                        <div class="head">
                            <img :src="back1" class="head_img" @tap="_goback()" />
                            <p class="head_title">砍价商品详情</p>
                            <p @tap="_goRule()">砍价规则</p>
                        </div>
                    </div>
                </div>

                <div class="head_height"></div>
                <!-- #endif -->

                <!-- #ifdef MP-WEIXIN -->
                <view class="wei_gz">
                    <view class="" @tap="_goRule()">砍价规则</view>
                </view>
                <!-- #endif -->
            </div>
            <!-- #endif -->

            <!-- 非砍价商品头部 -->
            <div v-if="!bargain" class="gd_header" :class="{ gd_headerplus: headerplus }" :style="{ top: halfWidth }">
                <!-- #ifndef MP -->
                <img :src="bback_img" class="gd_back" @tap="_goback()" />
                <!-- #endif -->
                <!-- #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                <button @tap="showShareMask" id="copyy copyy1" :data-clipboard-text="shareHref" class="gd_card gd_card-bto"
                    open-type="share"><img :src="icon_share" /></button>
                <!-- #endif -->
                <!-- #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                <img v-if="!bargain" :src="icon_share" class="gd_card" v-clipboard:copy="shareHref" @tap="showShareMask"
                    id="copyy" :data-clipboard-text="shareHref" />
                <!-- #endif -->

                <img v-if="isDistribution == false && !bargain && active != 6" :src="icon_cart" class="gd_share" @tap="navSwitchTab('/pages/tabBar/shoppingCart')" />
                <div class="cartnum" v-if="isDistribution == false && allCartNum && active != 6">{{ allCartNum }}</div>
            </div>

            <!-- <toload :load="loadFlag"  v-if="loadFlag"></toload> -->
            <div class="skeleton">
                <!-- 有数据 -->
                <div v-if="loadFlag">
                    <!--  轮播图   -->
                    <div class="relative">
                        <div class="kanjiaNull" v-if="(bargain && leftTime <= 0) || brStatus == -1"><img :src="list_end"
                                mode="" /></div>
                        <swiper class="swiper" @change="swiperChange">
                            <swiper-item v-for="goodsAlbum in goods.goodsAlbumList" :key="goodsAlbum.id"><img class="swipe"
                                    :src="goodsAlbum.image" /></swiper-item>
                        </swiper>
                        <div class="swiperIndex">{{ swiperIndex }}/{{ goods.goodsAlbumList && goods.goodsAlbumList.length }}</div>
                    </div>
                    <!-- 非砍价商品价格和名称 -->
                    <div class="goods_name" v-if="!bargain">
                        <p class="goods_price">
                            <span class="span">￥</span>
                            {{ goods.sellPrice }}
                        </p>
                        <p class="goods_proName">{{ goods.name }}</p>
                        <div class="volume">
                            <span>运费: {{ pro.yunfei }}元</span>
                            <span>销量: {{ goods.salesVolume }}</span>
                        </div>
                    </div>
                    <!-- 砍价商品价格和名称 -->
                    <div class="goods_name goods_bargain_name" v-else>
                        <p class="goods_price">
                            {{ cs_num }}人已完成砍价
                            <span class="cs_yprice">{{ cs_yprice }}</span>
                            <span class="cs_price">{{ cs_price }}</span>
                        </p>
                        <p>{{ goods.name }}</p>
                    </div>
                    <div class="hr" v-if="isDistribution == false && !bargain && active != 6 && coupon_status == true && coupon_str.length>0"></div>
                    <div class="coupon" @tap="getCoupon()" v-if="isDistribution == false && !bargain && active != 6 && coupon_status == true && coupon_str.length>0">
                        <span>领券</span>
                        <div>
                            <div v-for="(item, index) in coupon_str" :key="index" class="coupon_data" :style="'background-image:url(' + coupon_img + ')'">{{ item }}</div>
                        </div>
                        <img class="arrow" :src="you_img" />
                    </div>
                    <div class="hr"></div>
                    <!-- 非砍价商品选择商品规格 -->
                    <div v-if="!bargain" class="guige" @tap="chooseSpec()" ref="homeHead">
                        <span>{{ haveSkuBean == '' ? '选择商品规格' : haveSkuBean.name }}</span>
                        <img class="arrow" :src="icon_right_arrow" />
                    </div>
                    <div v-if="!bargain" class="hr"></div>
                    <div class="user gd_user" v-if="commentList.length && !bargain" @tap="_evaluate(pro_id)">
                        <p>用户评价({{ commentList.length }})</p>
                        <img class="arrow" :src="icon_right_arrow" />
                    </div>
                    <div class="comments" v-if="commentList.length && !bargain">
                        <div class="allCenter">
                            <img class="img" :src="commentList[0].userAvatar ? commentList[0].userAvatar : icon_comment_default_avatar" />
                            <span class="span">{{ commentList[0].userName }}</span>
                        </div>
                        <div class="time">{{ commentList[0].createTime }}</div>
                        <div class="disc">{{ commentList[0].content }}</div>
                    </div>
                    <div class="user" v-if="!commentList.length && !bargain">
                        <p style="font-size: 30rpx;">暂无评价</p>
                    </div>
                    <!-- 砍价页面显示 -->
                    <div v-if="bargain">
                        <div v-if="comments.length > 0" class="user gd_user" @tap="_evaluate(pro_id)">
                            <p>砍成晒单（{{ comments.length }}）</p>
                            <img class="arrow" :src="you_img" />
                        </div>
                        <div v-else class="user gd_user">
                            <p>砍成晒单（0）</p>
                            <img class="arrow" :src="you_img" />
                        </div>
                        <template v-if="comments.length">
                            <div class="comments" v-for="(item, index) in comments" :key="index">
                                <div class="allCenter">
                                    <img class="img" :src="item.headimgurl ? item.headimgurl : icon_comment_default_avatar" />
                                    <span class="span">{{ item.user_name }}</span>
                                </div>
                                <div class="time">{{ item.add_time }}</div>
                                <div class="disc">{{ item.content }}</div>
                            </div>
                        </template>
                        <div class="user" v-if="comments.length <= 0">
                            <p class="font_30">暂无评价</p>
                        </div>
                    </div>
                    <div class="hr"></div>
                    <div class="shop_list" v-if="shop.id">
                        <div class="store store1">
                            <div class="store1Div">
                                <img :src="shop.logo" :class="{ bargainLogo: bargain }" />
                                <div>{{ shop.name }}</div>
                            </div>
                            <div class="store_right">
                                <!-- #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                                <button class="share_btn" open-type="share" @tap="showShareMask(shop_list.shop_id)" id="copyshare"
                                    :data-clipboard-text="shareHref">
                                    <div class="goStore store1Div sharestore">分享店铺</div>
                                </button>
                                <!-- #endif -->
                                <!-- #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                                <div class="goStore store1Div sharestore" v-clipboard:copy="shareHref" @tap="showShareMask(shop_list.shop_id)"
                                    id="copyshare" :data-clipboard-text="shareHref">
                                    分享店铺
                                </div>
                                <!-- #endif -->
                                <div class="goStore store1Div" @tap="goShop(shop.id)">进店逛逛</div>
                            </div>
                        </div>
                        <div class="store store2">
                            <div class="store2Div">
                                <p>{{ shop.onSaleGoodsNum }}</p>
                                <div>在售商品</div>
                                <div class="shuxian"></div>
                            </div>
                            <div class="store2Div">
                                <p>{{ shop.totalSalesVolume }}</p>
                                <div>已售</div>
                                <div class="shuxian"></div>
                            </div>
                            <div class="store2Div">
                                <p>{{ shop.followNum }}</p>
                                <div>关注人数</div>
                            </div>
                        </div>
                    </div>

                    <div class="hr"></div>
                    <div class="goods_d" @tap="_goods_x" id="doogi">商品详情</div>
                    <!--  商品详情    -->
                    <div class="content_d safe-area-inset-bottom" id="content_d" v-if="goods_x">
                        <rich-text class="richtext" :nodes="goods.content"></rich-text>
                    </div>
                    <!--  规格参数   -->
                    <ul class="goods_spec" v-if="goods_g">
                        <li>
                            <div class="g_div">
                                <div>商品名称：</div>
                            </div>
                            <p>{{ goods.name }}</p>
                        </li>
                        <li>
                            <div class="g_div">
                                <div>品&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;牌：</div>
                            </div>
                            <p>{{ pro.brand_name }} * {{ pro.cat_name }}</p>
                        </li>
                        <li>
                            <div class="g_div">
                                <div>商品编号：</div>
                            </div>
                            <p>{{ pro_id }}</p>
                        </li>
                        <li>
                            <div class="g_div">
                                <div>分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类：</div>
                            </div>
                            <p>{{ pro.cat_name }}</p>
                        </li>
                        <li>
                            <div class="g_div">
                                <div>售&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;后：</div>
                            </div>
                            <p>签收之日起48小时内无条件退货</p>
                        </li>
                    </ul>

                    <div class="goods_foot" v-if="!bargain">
                        <view class="footer-hint" v-if="shop_list.is_open == 2">本店已打烊</view>
                        <view class="footer-hint" v-else-if="pro.status == '3'">商品已经下架啦~</view>

                        <div class="goods_bottom safe-area-inset-bottom" :class="{ goods_bottoms: pro.status == '3' }">
                            <!-- #ifdef MP-WEIXIN -->
                            <div class="goods_one ml_25">
                                <button class="kf_button_css center" style="background: none;padding: 0;height: 100%;"
                                    type="primary" open-type="contact">
                                    <img :src="icon_customer_service" />
                                    <p>客服</p>
                                </button>
                            </div>
                            <!-- #endif -->

                            <!-- #ifdef MP-BAIDU -->
                            <div class="goods_one ml_25">
                                <button class="center" open-type="contact" bindcontact="contactCB" style="background:none;padding:0px;height: 100%;">
                                    <img :src="icon_customer_service" />
                                    <p>客服</p>
                                </button>
                            </div>
                            <!-- #endif -->

                            <!-- #ifndef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU -->
                            <div class="goods_one ml_25 center" @tap="kf(pro_id)">
                                <img :src="icon_customer_service" />
                                <p>客服</p>
                            </div>
                            <!-- #endif -->

                            <div class="goods_one center" @tap="_collection">
                                <img :src="goods.isCollected == '1' ? icon_collect_yes : icon_collect_no" />
                                <p v-if="collection">已收藏</p>
                                <p v-else>收藏</p>
                            </div>

                            <template v-if="goods.status == '3'">
                                <div v-if="goods.isDistribution == '1' || goods.activity == '6'">
                                    <div class="goods_two _buy" style="color: #333333;">立即购买</div>
                                </div>
                                <div v-else-if="goods.isDistribution == '0' && goods.activity != '6'">
                                    <div class="goods_two" style="color: #333333;">加入购物车</div>
                                    <div class="goods_two _buy1" style="color: #333333;">立即购买</div>
                                </div>
                            </template>
                            <template v-else>
                                <div v-if="goods.isDistribution == '1' || goods.activity == '6'">
                                    <div class="goods_two _buy" @tap="buy">立即购买</div>
                                </div>
                                <div v-else-if="goods.isDistribution == '0' && goods.activity != '6'">
                                    <div class="goods_two" @tap="addToCart">加入购物车</div>
                                    <div class="goods_two _buy1" @tap="buy">立即购买</div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="goods_foot" :style="{ height: height }" v-else>
                        <div class="goods_bottom goods_bottom_time" v-if="leftTime > 0">
                            距砍价结束还剩：
                            <span v-if="day != 0">{{ day }}天</span>
                            <span v-else>0天</span>
                            <span v-if="hour != 0">{{ hour }}时</span>
                            <span v-else>00时</span>
                            <span v-if="mniuate != 0">{{ mniuate }}分</span>
                            <span v-else>00分</span>
                            <span v-if="second != 0">{{ second }}秒</span>
                            <span v-else>00秒</span>
                        </div>
                        <div class="goods_bottom bt_0">
                            <div class="goods_two goods_two_gd" @tap="navTo('/pagesA/bargain/bargain?topTabBar=true')">更多砍价商品</div>
                            <div v-if="leftTime <= 0 || brStatus == -1" class="goods_two btn-gray">立即砍价</div>
                            <div v-else-if="brStatus == 4 && isbegin == 1" class="goods_two btn-black" @tap="toBr()">立即砍价</div>
                            <div v-else-if="brStatus == 0 && leftTime > 0 && isbegin == 1" class="goods_two btn-black"
                                @tap="toBr()">继续砍价</div>
                            <div v-else-if="leftTime < 0 && isbegin == 1" class="goods_two btn-black">已结束</div>
                            <div v-else-if="leftTime > 0 && isbegin != 1" class="goods_two btn-black">未开始</div>
                            <div v-else-if="brStatus == 1 && !hasorder && isbegin == 1" class="goods_two btn-black"
                                @tap="goPay()">去付款</div>
                            <div v-else-if="brStatus == 1 && hasorder && isbegin == 1" class="goods_two btn-black" @tap="navTo('../../pages/order/order?order_id=' + sNo_id + '&showPay=true')">
                                待付款
                            </div>
                            <div v-else-if="brStatus == 2 && isbegin == 1" class="goods_two btn-black">已付款</div>
                            <div v-else-if="brStatus == 3 || leftTime < 0" class="goods_two btn-black">砍价失败</div>
                        </div>
                    </div>
                    <div class="share" v-if="g_show">
                        <div><img :src="top_img" /></div>
                    </div>
                </div>

                <!-- 没数据 -->
                <div v-else>
                    <!--  轮播图   -->
                    <div class="relative">
                        <swiper class="swiper">
                            <swiper-item><img class="swipe skeleton-rect" src="" /></swiper-item>
                        </swiper>
                    </div>
                    <!-- 非砍价商品价格和名称 -->
                    <div class="goods_name" v-if="!bargain">
                        <p style="width: 80px;" class="goods_price skeleton-rect">
                            <span class="span">￥</span>
                            {{ mockPro.price }}
                        </p>
                        <p style="padding-bottom: 0;margin-bottom: 9px;height: 21px;" class="goods_proName skeleton-rect">{{ mockPro.name }}</p>
                        <div class="volume">
                            <span class="skeleton-rect">运费规则：{{ mockPro.yunfei }}</span>
                            <span class="skeleton-rect">销量{{ mockPro.volume }}</span>
                        </div>
                    </div>
                    <!-- 砍价商品价格和名称 -->
                    <div class="goods_name goods_bargain_name skeleton-rect" v-else>
                        <p class="goods_price skeleton-rect">
                            xxxx人已完成砍价
                            <span class="cs_yprice skeleton-rect">xxxxx</span>
                            <span class="cs_price skeleton-rect">xxxx</span>
                        </p>
                        <p class="">{{ mockPro.name }}</p>
                    </div>
                    <div class="hr" v-if="isDistribution == false"></div>
                    <div class="coupon skeleton-rect" @tap="getCoupon()" v-if="isDistribution == false && !bargain && active != 6 && coupon_status == true">
                        <span class="">领券</span>
                    </div>
                    <div class="hr"></div>
                    <!-- 非砍价商品选择商品规格 -->
                    <div v-if="!bargain" class="guige skeleton-rect" @tap="chooseSpec()" ref="homeHead">
                        <span>{{ haveSkuBean == '' ? '选择商品规格' : haveSkuBean.name }}</span>
                        <img class="arrow" :src="you_img" />
                    </div>
                    <div v-if="!bargain" class="hr"></div>
                    <div class="user gd_user skeleton-rect" v-if="comments.length && !bargain" @tap="_evaluate(pro_id)">
                        <p>用户评价（{{ comments.length }}）</p>
                        <img class="arrow" :src="you_img" />
                    </div>
                    <div class="comments skeleton-rect" v-if="comments.length && !bargain">
                        <div class="allCenter">
                            <img class="img skeleton-circle" />
                            <span class="span skeleton-rect">xxxx</span>
                        </div>
                        <div class="time skeleton-rect">xxxx-xx-xx</div>
                        <div class="disc skeleton-rect">xxxxxxxxxxxxxxxxxxxxx</div>
                    </div>
                    <div class="user skeleton-rect">
                        <p style="font-size: 30rpx;">暂无评价</p>
                    </div>
                    <!-- 砍价页面显示 -->
                    <div>
                        <div class="user gd_user" @tap="_evaluate(pro_id)">
                            <p class="skeleton-rect">砍成晒单（{{ comments.length }}）</p>
                            <img class="arrow" :src="you_img" />
                        </div>
                        <div class="user gd_user skeleton-rect">
                            <p>砍成晒单（0）</p>
                            <img class="arrow" :src="you_img" />
                        </div>
                        <template>
                            <div class="comments">
                                <div class="allCenter">
                                    <img class="img skeleton-circle" />
                                    <span class="span skeleton-rect">xxxxx</span>
                                </div>
                                <div class="time skeleton-rect">xxxx-xx-xx</div>
                                <div class="disc skeleton-rect">xxxxxxxxxxxxxx</div>
                            </div>
                        </template>
                        <div class="user skeleton-rect" v-if="comments.length <= 0">
                            <p class="font_30">暂无评价</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <skeleton :animation="true" :loading="true" v-if="!loadFlag" bgColor="#FFF"></skeleton>
        <!--  遮罩 -->
        <div class="mask" @touchmove.stop.prevent v-if="mask_display"></div>
        <div class="mask_d" :class="mask_display1 ? 'goodAnimate1' : mask_display ? 'goodAnimate' : ''" v-if="mask_display">
            <div class="mask_guige">
                <div class="mask_one" @touchmove.stop.prevent>
                    <div class="mask_imgDiv">
                        <img v-if="loadImg" @load="_loadImg()" class="shangp" :src="skuImage" />
                        <img v-if="!loadImg" :src="load_img" class="img" />
                    </div>
                    <div class="mask_pric">
                        <p class="mask_price">
                            ￥
                            <span class="font_30">{{ price }}</span>
                        </p>
                        <p class="mask_pric_num">库存: {{ skuStock }}</p>
                    </div>
                    <img class="cha" :src="icon_close" @tap="_mask_f()" />
                </div>
                <div class="mask_over">

                    <template v-if="sku_list.result && !sku_list.result['undefined']">
                        <div class='mask_two' v-for="(item, key) in sku_list.result" :key="key" :class="{hl: highKeys[key]}">
                            <p>{{key}}</p>
                            <ul>
                                <li v-for="(value,i) in item" :key="i" :class="{select: (!value.active)&&(!value.disabled),orange: value.active, back: value.disabled}"
                                    @tap='handleActive(key, value)'>
                                    <div>{{ value.name }} </div>
                                </li>
                            </ul>
                        </div>
                    </template>

                    <div class="mask_num">
                        <p>数量</p>
                        <div class="goods_mun">
                            <span class="goods_mun_span" @tap="_reduce"><img :src="numb == 1 ? icon_sub_disable : icon_sub_enable" /></span>
                            <span class="mun">{{ numb }}</span>
                            <span class="goods_mun_add" @tap="_add"><img :src="numb < skuStock ? icon_add_enable : icon_add_disable" /></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mask_querenDiv">
                <div class="mask_quren" @tap="confirmSku">确认</div>
            </div>
        </div>

        <!-- 分享弹框 -->
        <div class="mask" @tap="_shareDiv" v-if="shareDiv">
            <div class="allCenter">
                <!-- 兼容头条小程序 -->
                <!-- #ifdef MP-TOUTIAO -->
                <div @tap="_invite(shareWay[2].name)">
                    <div><img :src="shareWay[2].imgUrl" alt="" style="width: 80rpx;height: 80rpx;" /></div>

                    <span style="font-size: 24rpx;color: #666666;">{{ shareWay[2].name }}</span>
                </div>
                <!-- #endif -->

                <!-- #ifndef MP-TOUTIAO -->
                <div v-for="(item, index1) in shareWay" :key="index1" @tap="_invite(item.name)">
                    <div><img :src="item.imgUrl" alt="" style="width: 80rpx;height: 80rpx;" /></div>

                    <span style="font-size: 24rpx;color: #666666;">{{ item.name }}</span>
                </div>
                <!-- #endif -->
            </div>
        </div>

        <div class="mask" v-if="saveEWM">
            <div class="shareEwm" v-if="saveEWM">
                <image style="width: 80rpx;height: 80rpx;" v-if="!ewmImg" :src="load_img"></image>
                <img v-else :src="ewmImg" class="imgEwm" />

                <img :src="close" class="close" @tap="_closeAllMask" />

                <view class="saveEWMBtn" @tap="_downEWM()">
                    <img :src="saves" class="saves" />
                    保存图片
                </view>
            </div>
        </div>
        <!-- 分享弹框 -->
        <div class="mask" v-if="shareMask && !saveEWM" @tap="_closeAllMask">
            <!-- 邀请链接的弹框 -->
            <div class="h5_yaoqing" v-if="shareMask_H5">
                <div class="h5_top">
                    <div class="h5_top_title">邀请链接</div>
                </div>

                <div class="h5_center"><input name="h5_input" id="h5_input" v-model="h5_url" readonly="readonly" /></div>

                <div class="h5_bottom">
                    <div>取消</div>
                    <div @tap="copyH5Url()">复制链接</div>
                </div>
            </div>
            <div class="shareMask" v-if="!shareMask_H5 && !saveEWM" @tap.stop>
                <div class="shareMaskTitle">分享至</div>

                <!-- #ifdef H5 -->
                <div class="sharepyq">
                    <div class="shareIcon" @tap="copy_url()">
                        <img :src="erm_pyq_img" />
                        <p>复制链接</p>
                    </div>
                    <div class="shareIcon" @tap="showSaveEWM('app')">
                        <img :src="erm_img" />
                        <p>二维码分享</p>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <!-- #endif -->

                <!-- #ifdef MP-WEIXIN -->
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
                <!-- #endif -->

                <!-- #ifdef APP-PLUS -->
                <div class="sharepyq">
                    <div class="shareIcon width_33" @tap="_shareApp(1)">
                        <img :src="erm_pyq_img" />
                        <p>微信朋友圈</p>
                    </div>
                    <div class="shareIcon width_33" @tap="_shareApp(2)">
                        <img :src="wx_img" />
                        <p>微信好友</p>
                    </div>
                    <div class="shareIcon width_33" @tap="showSaveEWM('app')">
                        <img :src="erm_img" />
                        <p>二维码分享</p>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <!-- #endif -->

                <div class="shareEnd" @tap="closeShareMask()">取消</div>
            </div>
        </div>

        <img class="zhiding" :src="icon_top" @tap="top" />

        <!-- 领取优惠券 -->
        <div class="mask" v-if="couponMask">
            <div class="couponMask">
                <div class="couponWapper">
                    <div class="title">
                        <div>领券</div>
                        <img class="cha" :src="icon_close" @tap="closeCouponMask" />
                    </div>
                    <div class="couponList" v-if="coupon_list && coupon_list.length > 0">
                        <div class="couponItem" v-for="(item, index) in coupon_list" :key="index">
                            <div class="rightPart">
                                <div class="limit">{{ item.name }}</div>
                                <span class="money" v-if="item.activity_type == 1">包邮</span>
                                <span class="money" v-if="item.activity_type != 1">
                                    <span class="font_32" v-if="item.money > 0">￥</span>
                                    {{ item.money > 0 ? item.money : item.discount }}
                                    <span class="font_32" v-if="item.money <= 0">折</span>
                                </span>
                                <span class="payLine">{{ item.limit }}</span>
                            </div>

                            <div class="splitLine"></div>

                            <div class="leftPart">
                                <button class="toReceive" v-if="item.point == '立即领取'" @tap="_receive(index, item.id)">{{ item.point }}</button>
                                <button class="toReceive clicks" v-else-if="item.point == '可用商品'">已领取</button>
                                <img class="img" alt="" v-if="item.point == '可用商品'" :src="coupon_on" />
                            </div>
                        </div>
                    </div>

                    <div v-else class="no_coupon">
                        <img :src="no_coupon" alt="" />
                        <p>暂无可领优惠券~</p>
                    </div>
                </div>
            </div>
        </div>
        <ruleModal v-model="isShow" @click="_toGradeUse" title="使用规则" :details="bargain_content" />
    </div>
</template>

<script>
    import heads from '../../components/header.vue';
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue';
    import {
        mapMutations,
        mapState
    } from 'vuex';
    import {
        mockPro
    } from '@/mock/goodsDetail/goodsDetail.js';
    // #ifdef H5
    import jQuery from '../../common/jquery.js';
    import {
        copyText
    } from '@/common/util.js';
    // #endif
    import {
        LaiKeTui_axios,
        LaiKeTuiInvite,
        LaiKeTuiShowSaveEWM,
        LaiKeTui_collection,
        addToCart,
        LaiKeTuiGetCoupon,
        LaiKeTui_receive,
        handleBuy,
        confirmSku,
        LaiKeTui_spec,
        LaiKeTuiShowState,
        LaiKeTuiSetTimeData,
        LaiKeTuiToBr,
        LaiKeTuiShopEWM
    } from '../../static/js/goods/goodsDetail.js';
    import ruleModal from '@/components/ruleModal.vue';
    import toload from '../../components/toload.vue';
    import htmlParser from '@/common/html-parser.js';

    export default {
        data() {
            return {
                mockPro,
                // back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                // 评论默认头像
                icon_comment_default_avatar: this.$common.ROOT_URL +
                    '/static/images/icon/icon_comment_default_avatar.png',
                // 置顶
                icon_top: this.$common.ROOT_URL + '/static/images/icon/icon_top.png',
                // coupon_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/coupon_detail.png',
                close: '',
                saves: '',
                cs_yprice: '',
                cs_price: '',
                cs_num: '',
                hour: 0,
                mniuate: 0,
                second: 0,
                day: 0,
                leftTime: '',
                attr_id: '',
                bargain: false,
                bargain_rule: '', //砍价规则
                bargain_content: '', //砍价规则
                isShow: '',
                shop_list: [],
                // 店铺
                shop: '',
                option: '',
                overflow: 'scroll',
                mask_display1: false,
                fastTap: true,
                // 是否已加载完初始数据
                load_complete: false,
                title: '商品详情',
                loadImg: true,
                shop_id: '',
                // bback_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/bback.png',
                // load_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                // you_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantouhei2x.png',
                icon_cart: this.$common.ROOT_URL + '/static/images/icon/goods/icon_cart.png',
                icon_share: this.$common.ROOT_URL + '/static/images/icon/goods/icon_share.png',
                icon_right_arrow: this.$common.ROOT_URL + '/static/images/icon/icon_right_arrow_black.png',
                icon_close: this.$common.ROOT_URL + '/static/images/icon/login/icon_close.png',
                icon_customer_service: this.$common.ROOT_URL + '/static/images/icon/icon_customer_service.png',
                // top_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/kaobei2x.png',
                // wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                icon_add_enable: this.$common.ROOT_URL + '/static/images/icon/goods/icon_add_enable.png',
                icon_add_disable: this.$common.ROOT_URL + '/static/images/icon/goods/icon_add_disable.png',
                icon_sub_enable: this.$common.ROOT_URL + '/static/images/icon/goods/icon_sub_enable.png',
                icon_sub_disable: this.$common.ROOT_URL + '/static/images/icon/goods/icon_sub_disable.png',

                // 已收藏
                icon_collect_yes: this.$common.ROOT_URL + '/static/images/icon/icon_collect_yes.png',
                // 未收藏
                icon_collect_no: this.$common.ROOT_URL + '/static/images/icon/icon_collect_no.png',
                // erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                // erm_pyq_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wepyq.png',
                // coupon_on: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/coupon_on.png',
                // no_coupon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noFind.png',
                attribute_id: '',
                attrList: '',
                skuBeanList: '',
                // 规格(map格式)
                goodsSkuMapList: [],

                mask_display: false,
                // 规格初始价格
                specOriginalPrice: '',
                // 规格数量
                specNum: '',
                // 规格出售价格
                specSellPrice: '',
                ys_price: '', //规格初始价格
                // 规格库存
                skuStock: '',
                // 规格价格
                price: '',
                // 规格图片
                skuImage: '',
                imgurl: '', //规格图片
                collection_id: '', //收藏id
                pro: '', //商品信息
                // 商品信息
                goods: '',
                comments: '', //评价信息
                // 商品评价
                commentList: [],
                haveSkuBean: '', //选择规则属性
                numb: 1, //规格选择的数量
                collection: '', //收藏状态
                type: '', //判断进入规格选择是从立即购买1、加入购物车2、规格选择进入3
                goods_x: true,
                goods_g: false,

                g_show: false, //回顶部显示
                // imgurls: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/landing_logo.png', //图片
                load: true,
                shareMask: false,
                saveEWM: false,
                shares: {},
                shareContent: '一起来用来客推吧！', //分享的内容
                shareHref: '', //分享的链接
                shareHref2: '', //转发的链接
                sharehrefTitle: '一起来用来客推吧!', //分享的链接的标题
                sharehrefDes: '一起来用来客推吧!', //分享的链接的描述
                shareImg: '', //分享的图片
                shareDiv: false,
                pic: '',
                // logo: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/lktlogo.png',
                // list_end: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jp_end.png',
                pro_id: '',
                order_no: '',
                brStatus: '',
                bargain_id: '',
                isDistribution: false, //是否是分销商品？true是，false不是
                ewmImg: '', //二维码图片
                login_status: '', //0:未登录；1已登录
                is_grade: '', //0:不是会员 1：是会员
                active: '', //活动类型
                hasorder: 0, //是否是待付款 0|1(待付款)
                sNo_id: 0, //订单id
                isbegin: 1, //是否是已开始的砍价商品 0（否）|1（是）
                shareMask_H5: false,
                h5_url: '',
                isfx: '',
                shareshop: 0,
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
                couponMask: false,
                coupon_list: [],
                clicktimes: [], //记录点击buy按钮时的时间
                // 购物车的总商品数
                allCartNum: 0,
                status: '2',
                is_shop: false,
                headerplus: false,
                coupon_status: false,
                coupon_str: [], //显示的优惠券图标
                swiperIndex: 1, //轮播图下标

                loadFlag: false,

                highKeys: {},
                skuName: 'SkuID',
                skuName1: 'Price',
                skuName2: 'Pic',
                skuName3: 'Stock',
                sku_key_id: this.$common.SKU_KEY.ID,
                sku_key_stock: this.$common.SKU_KEY.STOCK,
                sku_key_price: this.$common.SKU_KEY.PRICE,
                sku_key_image: this.$common.SKU_KEY.IMAGE,

                spliter: ',',
                sku_list: {},
                result: {}
            };
        },
        computed: {
            halfWidth: function() {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state
                    .data_height;
                var heigh = parseInt(gru);
                // #ifdef MP
                heigh = 0;
                // #endif
                return heigh + 'px';
            },
            height: function() {
                if (this.leftTime > 0) {
                    return uni.upx2px((750 * 79) / 375) + 'px';
                }
            },
            ...mapState({
                cartNum: 'cartNum'
            })
        },
        beforeCreate() {
            // #ifdef H5
            window.scrollTo(0, 0);
            window.onbeforeunload = function() {
                window.scrollTo(0, 0);
            }
            // #endif
        },
        onLoad(option) {
            this.option = option;
            this.fastTap = true;

            this.leftTime = option.leftTime;

            if (this.leftTime) {
                LaiKeTuiSetTimeData(this);
            }

            this.isfx = option.isfx;
            if (option.productId) {
                this.pro_id = option.productId;
            } else if (option.pro_id) {
                this.pro_id = option.pro_id;
            }
            this.bargain_id = option.bargain_id;
            this.bargain = option.bargain;
            this.brStatus = option.brStatus;
            this.attr_id = option.attr_id;
            this.order_no = option.order_no;
            this.sNo_id = option.sNo_id;
            this.isbegin = option.isbegin;
            if (this.bargain) {
                this.LaiKeTuiSetBargainRuleData();
            }

            if (this.pro_id == '' || this.pro_id == undefined) {
                this.pro_id = this.$store.state.pro_id;
            }

            if (option.isDistribution) {
                this.isDistribution = option.isDistribution;
            }

            this.hasorder = option.hasorder;

            uni.setStorageSync('fatherId', option.fatherId);
        },
        onShow(option) {
            // 加载详情页数据
            this.getGoodsDetail();

            this.allCartNum = this.$store.state.cartNum;
            // this.close = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close_bb.png';
            // this.saves = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/save.png';
            // this.fastTap = true;

            // let p = new Promise((resolve, reject) => {
            //     this.LaiKeTuiCommon.getLKTApiUrl().then(function() {
            //         resolve(1231);
            //     });
            // });

            // p.then(() => {
            //     this._axios();

            //     this.$nextTick(function() {
            //         uni.getProvider({
            //             service: 'share',
            //             success: function(res) {
            //                 console.log(res.provider);
            //             }
            //         });
            //     });
            // });

            this.couponMask = false;
        },
        //转发
        onShareAppMessage: function(res) {
            if (this.login_status == 0) {
                uni.navigateTo({
                    url: '/pages/login/login?landing_code=1'
                });
            } else {
                return {
                    title: this.sharehrefTitle,
                    path: this.shareHref2,
                    imageUrl: this.shareImg,
                    bgImgUrl: this.shareImg,
                    success: function(res) {
                        this.shareHref2 = '/pages/goods/goodsDetailed?productId=' + this.pro_id;
                    }
                };
            }
        },
        methods: {
            getGoodsDetail: function() {
                let data = {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTcyMjg2ODUsImV4cCI6MTU5NzIzNTg4NSwianRpIjoiN2I1ZWM5NzIzOGVmODhmOTRiMDkxY2IxMDAxYTJmMWMifQ._mj5ajjGnrFolVr76hjxsbr6IvNIx_0h3f1zkfNYoQ1',
                    storeId: this.$common.STORE_ID,
                    goodsId: this.pro_id
                }
                this.$goods.getGoodsDetail(data).then(res => {
                    this.goods = res;
                    this.commentList = res.commentList;
                    this.goodsSkuMapList = res.goodsSkuMapList;
                    this.skuStock = res.remainStock;
                    this.price = res.sellPrice;
                    this.skuImage = res.defSkuImage;
                    this.shop = res.shop;
                    this.loadFlag = true;
                    this.load_complete = true;

                    this.initData();
                })
            },
            // 立即购买
            buy() {
                if (!this.load_complete) {
                    return false;
                }
                // 上架商品
                if (this.status == this.$common.GOODS_STATUS.SHELVE) {
                    if (this.goods.isAllowBuy == this.$common.GOODS_ALLOW_TO_BUY.ALLOW) {
                        this.$common.noDoublePress(this, this.handleBuy);
                    } else {
                        if (this.active == 5) {
                            uni.showToast({
                                title: '您的会员等级不满足购买要求，请升级会员等级后再购买!',
                                icon: 'none'
                            });
                        } else {
                            uni.showToast({
                                title: '您的分销等级不满足购买要求，请升级分销等级后再购买!',
                                icon: 'none'
                            });
                        }
                    }
                } else {
                    uni.showToast({
                        title: '该商品已下架!',
                        icon: 'none'
                    });
                }
                if (this.active == 6) {
                    if (this.is_grade == 0 && this.login_status == 1) {
                        uni.showToast({
                            icon: 'none',
                            title: '对不起，你不是会员'
                        });
                    }

                    return;
                }
            },
            // 处理立即购买
            handleBuy() {
                handleBuy(this);
            },
            /* 
                ——————sku核心算法 开始——————
            */
            powerset(arr) {
                let ps = [
                    []
                ];
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0, len = ps.length; j < len; j++) {
                        ps.push(ps[j].concat(arr[i]));
                    }
                }

                return ps;
            },

            /**
             * 初始化数据
             * @return
             */
            initData() {
                this.result = {};
                // arrkeys, e.g.: ["颜色", "尺码", "型号"]
                this.keys = this.getAllKeys();

                for (let i = 0; i < this.keys.length; i++) {
                    // 所有的都为false,非高亮
                    this.highKeys[this.keys[i]] = false;
                }

                this.sku_list = this.combineAttr(this.goodsSkuMapList, this.keys);

                // this.initSeleted(this.SkuID);
                // this.initSeleted(this.Pic);
                // this.initSeleted(this.Price);
                // this.initSeleted(this.Stock);
                this.buildResult(this.sku_list.items);
                this.updateStatus(this.getSelectedItem(), true);


                // 初始筛选出库存为0的属性
                let filterObj = {}
                for (let i in this.result) {
                    if ((!i.includes(',')) && this.result[i].skus.stock == 0) {
                        filterObj[i] = this.result[i]
                    }
                }

                for (let i in this.sku_list.result) {

                    for (let k in this.sku_list.result[i]) {

                        for (let j in filterObj) {
                            if (k == j) {
                                this.sku_list.result[i][k].disabled = true
                            }
                        }
                    }
                }
                // 筛选结束

                this.showResult();
            },

            /**
             * 正常属性点击
             */
            handleNormalClick(key, value) {
                let list = JSON.parse(JSON.stringify(this.sku_list));

                for (let i in list.result[key]) {
                    if (i != value.name) {
                        list.result[key][i].active = false;
                    } else {
                        list.result[key][i].active = true;
                    }
                }

                this.sku_list = list;
            },

            /**
             * 无效属性点击
             */
            handleDisableClick(key, value) {
                this.sku_list.result[key][value.name]['disabled'] = false;
                // 清空高亮行的已选属性状态（因为更新的时候默认会跳过已选状态）
                for (let i in this.sku_list.result) {
                    if (i != key) {
                        for (let x in this.sku_list.result[i]) {
                            this.sku_list.result[i][x].active = false;
                        }
                    }
                }

                this.updateStatus(this.getSelectedItem());
            },

            /**
             * 高亮行
             */
            highAttributes: function() {
                for (let key in this.sku_list.result) {
                    this.highKeys[key] = true;
                    for (let attr in this.sku_list.result[key]) {
                        if (this.sku_list.result[key][attr].active === true) {
                            this.highKeys[key] = false;
                            break;
                        }
                    }
                }
            },

            /**
             * 点击事件处理
             * @param  key   点击的行
             * @param  value 点击的按钮的数据
             */
            handleActive: function(key, value) {
                if (value.disabled === true) {
                    uni.showToast({
                        title: '库存不足，请选择其它!',
                        icon: 'none'
                    })
                    return
                }

                if (value.active == true) {
                    return false;
                }

                this.handleNormalClick(key, value);
                if (value.disabled === true) {
                    this.handleDisableClick(key, value);
                }

                this.updateStatus(this.getSelectedItem());
                this.highAttributes();
                this.showResult();
            },

            /**
             * 计算属性
             * @param  {[type]} data [description]
             * @param  {[type]} keys [description]
             * @return {[type]}      [description]
             */
            combineAttr(data, keys) {
                let allKeys = [];
                let result = {};

                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    let values = [];

                    for (let j = 0; j < keys.length; j++) {
                        let key = keys[j];
                        if (!result[key]) {
                            result[key] = {};
                        }

                        if (!result[key][item[key]]) {
                            result[key][item[key]] = {
                                name: item[key],
                                active: false,
                                disabled: item[this.sku_key_stock] > 0 ? false : true
                            };
                        }

                        values.push(item[key]);
                    }

                    allKeys.push({
                        path: values.join(this.spliter),
                        skuId: item[this.sku_key_id],
                        price: item[this.sku_key_price],
                        image: item[this.sku_key_image],
                        stock: item[this.sku_key_stock]
                    });
                }

                return {
                    result: result,
                    items: allKeys
                };
            },

            isJSON(str) {
                if (typeof str == 'string') {
                    try {
                        var obj = JSON.parse(str);
                        return true;
                    } catch (e) {
                        console.log('error：' + str + '!!!' + e);
                        return false;
                    }
                }
            },

            /**
             * 获取所有属性
             * @return {[type]} [description]
             */
            getAllKeys() {
                let arrKeys = [];
                for (let attribute in this.goodsSkuMapList[0]) {
                    if (!this.goodsSkuMapList[0].hasOwnProperty(attribute)) {
                        continue;
                    }
                    // if (attribute !== this.skuName && attribute !== this.skuName1 && attribute !== this.skuName2 &&
                    //     attribute !== this.skuName3) {
                    //     arrKeys.push(attribute);
                    // }
                    if (attribute !== this.sku_key_id &&
                        attribute !== this.sku_key_price &&
                        attribute !== this.sku_key_stock &&
                        attribute !== this.sku_key_image) {
                        arrKeys.push(attribute);
                    }
                }

                if (arrKeys.length == 0) {
                    arrKeys = ["undefined"]
                    this.goodsSkuMapList[0]["undefined"] = "undefined"
                }
                return arrKeys;
            },

            getAttruites(arr) {
                let result = [];
                for (let i = 0; i < arr.length; i++) {
                    result.push(arr[i].path);
                }

                return result;
            },

            /**
             * 生成所有子集是否可选、库存状态 map
             */
            buildResult(items) {
                let allKeys = this.getAttruites(items);

                let attr = {};
                //价格 , 库存, 图片 赋值
                for (let i = 0; i < allKeys.length; i++) {
                    let curr = allKeys[i];
                    let skuId = items[i].skuId;
                    let image = items[i].image;
                    let price = items[i].price;
                    let stock = items[i].stock;
                    let values = curr.split(this.spliter);
                    let allSets = this.powerset(values);

                    // 每个组合的子集
                    for (let j = 0; j < allSets.length; j++) {
                        let set = allSets[j];
                        let key = set.join(this.spliter);
                        if (key && !this.result[key]) {
                            this.result[key] = {
                                skus: {
                                    skuId,
                                    image,
                                    price,
                                    stock
                                }
                            };

                            if ((!key.includes(',') && !attr[key]) || (key.includes(',') && key.split(',').length <
                                    allKeys[i].split(',').length)) {
                                attr[key] = {
                                    skus: {
                                        skuId,
                                        image,
                                        price,
                                        stock
                                    }
                                };
                            }
                        }
                    }
                }

                for (let i in attr) {
                    attr[i].skus.stock = 0;
                    for (let k in this.result) {
                        if (i != k && k.split(',').length == allKeys[0].split(',').length && k.includes(i)) {
                            attr[i].skus.stock += Number(this.result[k].skus.stock);
                        } else if (k.split(',').length == allKeys[0].split(',').length) {
                            let flag = [];

                            k.split(',').filter(item => {
                                i.split(',').filter(it => {
                                    if (item == it) {
                                        flag.push(true);
                                    }
                                });
                            });

                            if (flag.length == i.split(',').length) {
                                attr[i].skus.stock += Number(this.result[k].skus.stock);
                            }
                        }
                    }
                }

                Object.assign(this.result, attr);
            },

            /**
             * 获取选中的信息
             * @return Array
             */
            getSelectedItem() {
                let result = [];
                for (let attr in this.sku_list.result) {
                    let attributeName = '';
                    for (let attribute in this.sku_list.result[attr]) {
                        if (this.sku_list.result[attr][attribute].active === true) {
                            attributeName = attribute;
                        }
                    }

                    result.push(attributeName);
                }
                return result;
            },

            /**
             * 更新所有属性状态
             */
            updateStatus(selected, type) {
                for (let i = 0; i < this.keys.length; i++) {
                    let key = this.keys[i],
                        data = this.sku_list.result[key],
                        hasActive = !!selected[i],
                        copy = selected.slice();
                    for (let j in data) {
                        let item = data[j]['name'];
                        if (selected[i] == item) {
                            continue;
                        }

                        copy[i] = item;
                        let curr = this.trimSpliter(copy.join(this.spliter), this.spliter);

                        if (type) {
                            this.sku_list.result[key][j]['disabled'] = this.result[curr] ? false : true;
                        } else {
                            this.sku_list.result[key][j]['disabled'] = this.result[curr].skus.stock > 0 ? false : true;
                        }
                    }
                }
            },

            trimSpliter(str, spliter) {
                let reLeft = new RegExp('^' + spliter + '+', 'g');
                let reRight = new RegExp(spliter + '+$', 'g');
                let reSpliter = new RegExp(spliter + '+', 'g');
                return str
                    .replace(reLeft, '')
                    .replace(reRight, '')
                    .replace(reSpliter, spliter);
            },

            /**
             * 初始化选中
             * @param  mixed|Int|String SkuID 需要选中的SkuID
             * @return {[type]}       [description]
             */
            initSeleted(a) {
                for (let i in this.goodsSkuMapList) {
                    if (this.goodsSkuMapList[i][this.sku_key_id] == a) {
                        for (let x in this.goodsSkuMapList[i]) {
                            if (x !== this.sku_key_id &&
                                x !== this.sku_key_stock &&
                                x !== this.sku_key_price &&
                                x !== this.sku_key_image) {
                                this.sku_list.result[x][this.goodsSkuMapList[i][x]].active = true;
                            }
                        }
                        break;
                    }
                }
            },

            /**
             * 显示选中的信息
             * @return
             */
            showResult() {
                let result = this.getSelectedItem();
                let s = [];
                for (let i = 0; i < result.length; i++) {
                    let item = result[i];
                    if (!!item) {
                        s.push(item);
                    }
                }

                if (s.length > 0) {
                    this.skuStock = this.result[s.join(this.spliter)].skus.stock;
                }

                if (s.length == this.keys.length) {
                    let curr = this.result[s.join(this.spliter)];
                    if (curr) {
                        this.skuId = curr.skus.skuId;
                        this.skuImage = curr.skus.image;
                        this.price = curr.skus.price;
                        this.stock = curr.skus.stock;

                        if (Number(this.numb) > Number(this.stock)) {
                            this.numb = Number(this.stock)
                        }
                    }

                    this.haveSkuBean = {
                        name: s.join(this.spliter),
                        skuId: curr.skus.skuId,
                        skus: curr.skus
                    };
                } else {
                    this.haveSkuBean = '';
                }
            },

            /**
             * ——————sku核心算法 结束——————
             */

            swiperChange(e) {
                this.swiperIndex = e.detail.current + 1;
            },
            top() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            },
            setHead() {
                const query = uni.createSelectorQuery().in(this);
                query
                    .select('#boxs')
                    .boundingClientRect(data => {
                        if (data.top > -20) {
                            this.headerplus = false;
                        } else if (data.top < -20) {
                            this.headerplus = true;
                        }
                    })
                    .exec();
            },
            //授权取消按钮
            cancle() {
                this.fastTap = true;
            },
            changeLoginStatus() {
                this.login_status = 1;
                this.fastTap = true;

                this._axios();
            },
            copy_url() {
                this.shareMask_H5 = true;
                this.h5_url = this.shareHref;
            },
            copyH5Url() {
                jQuery('#h5_input input').select();
                document.execCommand('Copy');
            },
            goPay() {
                var product = [];
                product.push({
                    pid: this.pro_id
                });
                product.push({
                    cid: this.attr_id
                });
                product.push({
                    skuStock: 1
                });
                product = JSON.stringify(product);
                uni.navigateTo({
                    url: '../../pages/pay/orderDetailsr?product=' + product + '&bargain=true&bargain_id=' +
                        this.bargain_id + '&order_no=' + this.order_no
                });
            },
            toBr() {
                if (this.pro.skuStock < 1) {
                    uni.showToast({
                        title: '库存不足，无法参与砍价！',
                        icon: 'none',
                        duration: 1500
                    });
                    return;
                }
                LaiKeTuiToBr(this);
            },
            // 进入店铺
            goShop(shopId) {
                uni.navigateTo({
                    url: '/pages/shop/shop?shopId=' + shopId
                });
            },
            _loadImg() {
                this.loadImg = true;
            },
            _closeAllMask() {
                this.shareMask = false;
                this.saveEWM = false;
                this.shareMask_H5 = false;
                this.overflow = 'scroll';
            },
            _shareDiv() {
                this.shareDiv = false;
            },
            _invite(type) {
                LaiKeTuiInvite(type, this);
            },
            _goRule() {
                this._toGradeUse(true);
            },
            _goback() {
                if (this.option.toback == 'true') {
                    uni.navigateBack({
                        delta: 1
                    });
                    return;
                }
                // #ifdef H5
                uni.reLaunch({
                    url: '/pages/tabBar/home'
                });
                // #endif
                // #ifndef H5
                if (this.isfx == 'true') {
                    uni.reLaunch({
                        url: '/pages/tabBar/home'
                    });
                    return false;
                } else {
                    uni.navigateBack({
                        delta: 1
                    });
                }
                // #endif
            },
            _downEWM() {
                uni.getImageInfo({
                    src: this.ewmImg,
                    success: sres => {
                        console.log(sres.path);
                        uni.saveImageToPhotosAlbum({
                            filePath: sres.path,
                            success: () => {
                                uni.showToast({
                                    title: '保存图片成功',
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                    },
                    fail: () => {
                        uni.showToast({
                            title: '保存图片失败',
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
            },
            _shareApp(type) {
                var scene = '';
                if (type == 1) {
                    //App分享到 微信朋友圈
                    scene = 'WXSenceTimeline';
                } else if (type == 2) {
                    //App分享到 微信好友
                    scene = 'WXSceneSession';
                }
                uni.share({
                    provider: 'weixin',
                    scene: scene,
                    type: 2,
                    imageUrl: this.ewmImg,
                    success: function(res) {},
                    fail: function(err) {}
                });
            },

            showShareMask(shop) {
                if (shop && shop > 0) {
                    this.is_shop = true;
                    this.shop_id = shop;
                    this.sharehrefTitle = this.shop_list.shop_name;
                    this.shareImg = this.shop_list.shop_logo;
                    this.shareContent = this.shop_list.shop_name;
                    var url = uni.getStorageSync('h5_url');
                    this.shareHref = url + 'pagesA/store/store?is_share=true&shop_id=' + shop;
                    this.shareHref2 = '/pagesA/store/store?is_share=true&shop_id=' + shop;
                } else {
                    this.is_shop = false;
                    this.shareHref2 = '/pages/goods/goodsDetailed?productId=' + this.pro_id;
                    this.sharehrefTitle = this.pro.name;
                    this.shareImg = this.imgurl;
                    this.shareContent = this.pro.name;
                    var url = uni.getStorageSync('h5_url');
                    this.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + this.pro_id +
                        '&isfx=true';
                    if (this.pro.is_distribution == 1) {
                        this.isDistribution = true;
                        this.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + this.pro_id +
                            '&isfx=true&fatherId=' + this.pro.user_id;
                    }
                }

                this.isLogin(() => {
                    // #ifdef H5

                    uni.showToast({
                        title: '复制成功！',
                        duration: 1500,
                        icon: 'none'
                    });
                    return false;

                    // #endif

                    // #ifndef H5
                    // #ifdef MP-WEIXIN
                    this.shareMask = true;
                    // #endif
                    // #ifndef MP-WEIXIN
                    // #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
                    this.shareDiv = true;
                    // #endif
                    // #endif
                    // #endif
                });
            },
            closeShareMask() {
                this.shareMask = false;
                this.overflow = 'scroll';
            },
            showSaveEWM(string) {
                if (this.is_shop) {
                    LaiKeTuiShopEWM(string, this);
                } else {
                    LaiKeTuiShowSaveEWM(string, this);
                }
            },
            kf(pro_id) {
                this.isLogin(() => {
                    uni.navigateTo({
                        url: '/pages/message/service?pid=' + pro_id
                    });
                });
            },
            _reduce() {
                if (this.numb > 1 && Boolean(this.haveSkuBean)) {
                    this.numb--;
                } else {
                    if (!this.haveSkuBean) {
                        uni.showToast({
                            title: '请先选择商品规格',
                            duration: 1000,
                            icon: 'none'
                        });
                    } else {
                        this.numb == 1;
                        uni.showToast({
                            title: '数量已经减少到最低了哦！',
                            duration: 1000,
                            icon: 'none'
                        });
                    }
                }
            },
            _add() {
                if (this.numb < this.skuStock && Boolean(this.haveSkuBean)) {
                    this.numb++;
                } else {
                    if (!this.haveSkuBean) {
                        uni.showToast({
                            title: '请先选择商品规格',
                            duration: 1000,
                            icon: 'none'
                        });
                    } else {
                        uni.showToast({
                            title: '数量已经达到上限了哦！',
                            duration: 1000,
                            icon: 'none'
                        });
                    }
                }
            },
            _load_img() {
                this.load = false;
            },
            _goods_x() {
                this.goods_x = true;
                this.goods_g = false;
            },
            _goods_g() {
                this.goods_x = false;
                this.goods_g = true;
            },
            ...mapMutations({
                cart_id: 'SET_CART_ID',
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID',
                pay_lx: 'SET_PAY_LX',
                setCartNum: 'setCartNum'
            }),
            _evaluate(pro_id) {
                if (this.bargain) {
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluate?bargain=true&pid=' + pro_id
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluate?pid=' + pro_id
                    });
                }
            },

            //收藏
            _collection() {
                LaiKeTui_collection(this);
            },
            // 加入购物车
            addToCart() {
                // 上架商品
                if (this.status == this.$common.GOODS_STATUS.SHELVE) {
                    addToCart(this);
                } else {
                    uni.showToast({
                        title: '该商品已下架!',
                        icon: 'none'
                    });
                }
            },
            // 选择规格
            chooseSpec() {
                this.type = 1;
                this.fastTap = true;
                this.showChooseSpecMask();
            },
            getCoupon() {
                LaiKeTuiGetCoupon(this);
            },
            _receive(index, id) {
                this.isLogin(() => {
                    LaiKeTui_receive(this, id);
                });
            },
            closeCouponMask() {
                this.couponMask = false;
            },
            // 打开选择规格遮罩
            showChooseSpecMask() {
                this.mask_display = true;
                this.overflow = 'hidden';
            },
            //关闭遮罩层
            _mask_false() {
                this.overflow = 'scroll';
                this.mask_display1 = true;
                setTimeout(() => {
                    this.mask_display = false;
                    this.mask_display1 = false;
                }, 500);
                for (var i = 0; i < this.attrList.length; i++) {
                    for (var b = 0; b < this.attrList[i].attr.length; b++) {
                        this.attrList[i].attr[b].select = false;
                    }
                }
            },
            _mask_f() {
                this.haveSkuBean = '';
                this._mask_false();
                this.overflow = 'scroll';
            },
            // 规格确认
            confirmSku() {
                confirmSku(this);
            },
            _spec() {
                LaiKeTui_spec(this);
            },
            //选择属性
            showState(index, indx) {
                LaiKeTuiShowState(this, index, indx);
            },
            _axios() {
                LaiKeTui_axios(this);
                this.load_complete = true;
            },
            _toGradeUse(is) {
                if (is) {
                    this.bargain_content = htmlParser(this.bargain_rule);
                    this.isShow = !this.isShow;
                } else {
                    this.isShow = !this.isShow;
                }
            },
            /**
             * 设置砍价规则
             * @param me
             * @constructor
             */
            LaiKeTuiSetBargainRuleData() {
                let data = {
                    m: 'getRule',
                    action: 'bargain',
                    module: 'app'
                };

                this.$req.post({
                    data
                }).then(res => {
                    this.bargain_rule = res.rule;
                });
            }
        },
        components: {
            heads,
            wxParse,
            // #ifdef H5
            jQuery,
            // #endif
            toload,
            ruleModal
        }
    };
</script>

<style lang="less" scoped>
    @import url('../../static/css/goods/goodsDetail.less');
</style>
