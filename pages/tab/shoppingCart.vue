<template>
    <div class="order_ii" ref="cart">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>

        <!-- #ifndef MP -->
        <div :style="{ height: halfWidth }" class="data_h">
            <div :style="{ height: halfWidth }" class="data_h_h"></div>
        </div>
        <!-- #endif -->

        <div style="position: relative;">
            <!-- #ifndef MP -->
            <div class="page_title">
                <div :style="{ top: halfWidth }" class="header">
                    <span class="span">购物车</span>
                    <div @tap="_manage" v-if="goods.length">{{ manage_text }}</div>
                </div>
            </div>
            <!-- #endif -->
            <!-- #ifdef MP -->
            <div @tap="_manage" class="statusDiv" v-if="goods.length">{{ manage_text }}</div>
            <!-- #endif -->

            <view class="skeleton">
                <div class="loginDiv" v-if="!access_id1 && !nrlflag">
                    <div class="loginText skeleton-rect">登录后同步购物车中的商品</div>
                    <div @tap="toLogin()" class="loginBtn skeleton-circle">登录</div>
                </div>


                <!--  有商品时显示   -->
                <ul class="goods" v-if="goods.length && load">
                    <!-- 店铺名称 -->
                    <div :key="index1" v-for="(item1, index1) in mch_list">
                        <!-- 店铺之间分割线 -->
                        <div class="hr" v-if="index1 > 0"></div>
                        <div :key="'a' + item1.index1" class="shop-name">
                            <image :src="display_img1[index1] ? quan_hei : quan_hui" @tap="_selectAllStore(item1, index1)"
                                   class="img1"></image>
                            <image :src="store" class="img2"></image>

                            <p @tap="toStore(item1.id)">{{ item1.name }}</p>
                            <span @tap="toStore(item1.id)"><image :src="jiantou2x" class="img3"></image></span>
                        </div>
                        <view class="line">
                            <view class="line-gray"></view>
                        </view>

                        <template v-for="(item, index) in goods">
                            <li :key="index" v-if="item1.id === item.mch_id">
                                <img :src="display_img[index] ? quan_hei : quan_hui" @tap="_checkedOne(item, index, item1, index1)"
                                     class="store_img1"/>

                                <div class="store_img"><img :src="item.imgurl" @tap="_goodsDetailed(item.pid)"
                                                            class="goods_img"/></div>

                                <div class="goods_right">
                                    <div>
                                        <p @tap="_goodsDetailed(item.pid)" class="good_name">{{ item.pro_name }}</p>
                                        <div @tap="_mask_display(item.stock, item.price, item.imgurl, item.id, item.attribute_id)"
                                             class="goodDetail">
                                            <div :key="index5" v-for="(item5, index5) in item.skuBeanList">{{ item5.name
                                                }}
                                            </div>
                                            <img :src="jianX" class="img_X"/>
                                        </div>
                                    </div>

                                    <div class="goods_bottom">
                                        <p class="black">
                                            <span class="price">￥</span>
                                            <span class="price1">{{ item.price }}</span>
                                        </p>
                                        <div class="goods_mun">
                                            <span class="border-right"><img :src="item.num == 1 ? jian_hui : jian_hei"
                                                                            @tap="_reduce(index, item.id)"/></span>

                                            <span :class="[item.num == 1 ? 'mun1' : '']"
                                                  class="mun">{{ item.num }}</span>

                                            <span class="border-left"><img :src="item.num >= 1 ? jia_hei : jia_hui"
                                                                           @tap="_add(index, item.stock, item.id)"/></span>
                                        </div>
                                    </div>
                                </div>

                                <view class="line line-top">
                                    <view class="line-gray"></view>
                                </view>
                            </li>
                        </template>
                    </div>
                </ul>


                <div :style="{ marginBottom: h5Height }" class="bottom" v-if="goods.length && load">
                    <div @tap="_selectAll" class="bottom_left">
                        <img :src="selectAll ? quan_hei : quan_hui" class="quan_img"/>
                        <span>全选</span>
                    </div>
                    <div class="bottom_right">
                    <span class="span" v-if="manage">
                        合计：
                        <span class="red">￥{{ total }}</span>
                    </span>
                        <div @tap="_delete">
                            {{ manage_pay }}

                            <span v-if="manage_text == '编辑'">({{ count }})</span>
                        </div>
                    </div>
                </div>
                <!--  没有商品时显示   -->
                <div class="empty skeleton-rect" v-if="!goods.length">
                    <img :src="kong"/>
                    <p>购物车是空的</p>
                    <div @tap="toHome()" class="toHomeBtn">去逛逛</div>
                </div>


                <div class="discover_tj skeleton-rect" style="margin-top: 3px;">
                    <div class="discover_left skeleton-rect"><i></i></div>
                    <p class="">为你推荐</p>
                    <div class="discover_right skeleton-rect"><i></i></div>
                </div>
                <ul class="allgoods" v-if="load">
                    <li :key="index" @tap="_goods(items.id)" class="allgoods_li" v-for="(items, index) in list"
                        v-if="load">
                        <div class="proImgBox">
                            <img :src="items.imgurl" class="allgoods_li_img"/>
                            <div class="dowmPro" v-if="items.status == 3">
                                已下架
                            </div>
                        </div>
                        <p class="allgoods_li_title">{{ items.product_title }}</p>
                        <p class="allgoods_li_subtitle">{{ items.subtitle }}</p>
                        <div @tap.stop="shopping_j(items.id)">
                            <span class="allgoods_price">
                                <span class="allgoods_price_money">￥</span>
                                <span class="allgoods_price_data">{{ items.price }}</span>
                            </span>
                            <img :src="shopImg" class="allgoods_shopImg"/>
                        </div>
                    </li>

                </ul>
                <ul class="allgoods" v-else>
                    <li :key="guid()" class="allgoods_li" v-for="(item) of 4">
                        <div class="proImgBox skeleton-rect">
                            <img :src="shopImg" class="allgoods_li_img"/>
                        </div>


                        <p class="allgoods_li_title skeleton-rect" style="width: 100px;margin-top: 1px;">标题</p>
                        <p class="allgoods_li_subtitle skeleton-rect" style="width: 60px;margin-top: 1px;">子标题</p>
                        <div>
                            <span class="allgoods_price skeleton-rect" style="width: 100px;">
                                <span class="allgoods_price_money">￥</span>
                                <span class="allgoods_price_data">{{item}}</span>
                            </span>

                            <img :src="shopImg" class="allgoods_shopImg skeleton-fillet"/>
                        </div>

                    </li>
                </ul>



                <!-- #ifdef H5 -->
                <div class="h_100"></div>
                <!-- #endif -->
                <maskM :content="content" :display="display" v-on:mask_value="_mask_value"></maskM>
            </view>


            <!--  遮罩  -->
            <div @touchmove.stop.prevent class="mask" v-if="mask_display1">
                <div :style="{ marginBottom: h5Height }" class="mask_d">
                    <div class="mask_guige">
                        <div class="mask_one">
                            <div><img :src="imgurl" class="shangp"/></div>
                            <div class="mask_pric">
                                <p class="red">
                                    ￥
                                    <span>{{ price }}</span>
                                </p>
                                <p class="hui">库存{{ num }}</p>
                            </div>
                            <img :src="closeImg" @tap="_mask_f()" class="cha"/>
                        </div>
                        <div class="mask_over">
                            <scroll-view scroll-y style="height: 100%;">
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
                                        <span class="border-right"><img :src="numb == 1 ? jian_hui : jian_hei"
                                                                        @tap="changeStock(1)"/></span>
                                        <span class="mun">{{ numb }}</span>
                                        <span class="border-left"><img :src="numb > num ? jia_hei : jia_hui"
                                                                       @tap="changeStock(2)"/></span>
                                    </div>
                                </div>
                            </scroll-view>
                        </div>
                    </div>
                    <div class="queren_div">
                        <div @tap="_confirm1()" class="mask_quren">确认</div>
                    </div>
                </div>
            </div>
            <div @touchmove.stop.prevent class="mask" v-if="mask_display">
                <div :style="{ marginBottom: h5Height }" class="mask_d">
                    <div class="mask_guige">
                        <div class="mask_one">
                            <div><img :src="imgurl" class="shangp"/></div>
                            <div class="mask_pric">
                                <p class="red">
                                    ￥
                                    <span>{{ price }}</span>
                                </p>
                                <p class="hui">库存{{ num }}</p>
                            </div>
                            <img :src="closeImg" @tap="_mask_false" class="cha"/>
                        </div>
                        <div class="mask_over">
                            <scroll-view v-if="sku_list.result && !sku_list.result['undefined']" scroll-y style="height: 100%;">
                                <div class='mask_two' v-for="(item, key) in sku_list.result" :key="key" :class="{hl: highKeys[key]}">
                                	<p>{{key}}</p>
                                	<ul>
                                		<li v-for="(value,i) in item" :key="i" :class="{select: (!value.active)&&(!value.disabled),orange: value.active, back: value.disabled}"
                                		 @tap='handleActive(key, value)'>
                                			<div>{{ value.name }} </div>
                                		</li>
                                	</ul>
                                </div>
                            </scroll-view>
                        </div>
                    </div>
                    <div class="queren_div">
                        <div @tap="_confirm(num)" class="mask_quren">确认</div>
                    </div>
                </div>
                <div class="white_line"></div>
            </div>
        </div>

        <skeleton :animation="true" :loading="!load" bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex'
    import maskM from '../../components/maskM.vue'

    export default {
        data () {
            return {
                numb: 1,
                access_id1: false,
                nrlflag: false, //是否开启授权登录
                shopImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/shopping2x.png',
                closeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/guanbi2x.png',
                loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/loading.gif',
                kong: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/shopping3x.png',
                jianX: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jianX.png',
                jiantou2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                store: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/store.png',
                bottom: 3,
                quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehui2x.png',
                quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehei2x.png',
                jian_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jianhui2x.png',
                jian_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jian2x.png',
                jia_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jia+2x.png',
                jia_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/add+2x.png',
                manage: true, //编辑、管理状态
                manage_text: '编辑',
                manage_pay: '去结算',
                content: '确认删除选中的商品吗？', //给遮罩层传值
                mask_value: '', //接收遮罩层传过来的值
                display: false, //遮罩层显示状态
                display_img1: [], //店铺圆圈的选中状态
                display_img: [], //圆圈的选中状态
                selectArray: [], //存储选中商品
                selectStore: [], //存储选中店铺
                selectStoreArray: [], //存储店铺中选中的商品
                storeArray: [], //按店铺分商品
                goods: [], //初始化页面的商品数量
                selectAll: false, //全选状态

                load: false,
                mask_display: false, //规格显示隐藏和显示
                mask_display1: false,
                attribute_id: '',
                attrList: '',
                skuBeanList: '',
                num: '', //规格数量
                price: '', //规格价格
                imgurl: '', //规格图片
                haveSkuBean: '', //选择规则属性
                shopping_id: '', //单个商品购物车id
                jia_img: [],
                list: [],
                mch_list: [],
                fastTap: true,
                
                highKeys: {},
                skuName: 'SkuID',
                skuName1: 'Price',
                skuName2: 'Pic',
                skuName3: 'Stock',
                spliter: ',',
                sku_list: {},
                result: {}
            }
        },
        onLoad () {
            let needRegister = uni.getStorageSync('needRegister')
            // 判断是否是授权登录
            this.nrlflag = needRegister == this.LaiKeTuiCommon.LKT_NRL_TYPE.NRL
        },
        onTabItemTap (e) {
            this.LaiKeTuiCommon.closeMPAuthWin(this)
        },
        onShow () {
            // #ifndef H5
            uni.showTabBar()
            // #endif
            this.display = false
            this.LaiKeTuiCommon.getUrlFirst(this._axios)

            let needRegister = uni.getStorageSync('needRegister')
            // 判断是否是授权登录
            this.nrlflag = needRegister == this.LaiKeTuiCommon.LKT_NRL_TYPE.NRL

            for (var i = 0; i < this.goods.length; i++) {
                this.display_img[i] = false
            }
            this.selectArray = []
            for (var i = 0; i < this.mch_list.length; i++) {
                this.display_img1[i] = false
            }
            this.selectStore = []

            this.manage_text = '编辑'
            this.manage_pay = '去结算'
            this.selectAll = false
            this.manage = true
        },
        methods: {
            
            /*
                 ——————sku核心算法 开始——————
             */
             powerset(arr) {
                 let ps = [[]];
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
                 this.keys = this.getAllKeys(); //arrKeys["颜色", "尺码", "型号"]
            
                 for (let i = 0; i < this.keys.length; i++) {
                     this.highKeys[this.keys[i]] = false; //所有的都为false
                 }
            
                 this.sku_list = this.combineAttr(this.skuBeanList, this.keys);
            
                 // this.initSeleted(this.SkuID);
                 // this.initSeleted(this.Pic);
                 // this.initSeleted(this.Price);
                 // this.initSeleted(this.Stock);
                 this.buildResult(this.sku_list.items);
                 this.updateStatus(this.getSelectedItem(), true);
                 
                 
                 // 初始筛选出库存为0的属性
                 let filterObj = {}
                 for(let i in this.result){
                     if((!i.includes(',')) && this.result[i].skus.Stock == 0){
                         filterObj[i] = this.result[i]
                     }
                 }
                 
                 for(let i in this.sku_list.result){
                     
                     for(let k in this.sku_list.result[i]){
                         
                         for(let j in filterObj){
                             if(k == j){
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
                 if(value.disabled === true){
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
                             result[key][item[key]] = { name: item[key], active: false, disabled: item['Stock'] > 0 ? false : true };
                         }
            
                         values.push(item[key]);
                     }
            
                     allKeys.push({
                         path: values.join(this.spliter),
                         sku: item['SkuID'],
                         price: item['Price'],
                         Pic: item['Pic'],
                         Stock: item['Stock']
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
                 for (let attribute in this.skuBeanList[0]) {
                     if (!this.skuBeanList[0].hasOwnProperty(attribute)) {
                         continue;
                     }
            
                     if (attribute !== this.skuName && attribute !== this.skuName1 && attribute !== this.skuName2 && attribute !== this.skuName3) {
                         arrKeys.push(attribute);
                     }
                 }
                 if(arrKeys.length == 0){
                 	arrKeys = ["undefined"]
                 	this.skuBeanList[0]["undefined"] = "undefined"
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
                     let sku = items[i].sku;
                     let Pic = items[i].Pic;
                     let price = items[i].price;
                     let Stock = items[i].Stock;
                     let values = curr.split(this.spliter);
                     let allSets = this.powerset(values);
            
                     // 每个组合的子集
                     for (let j = 0; j < allSets.length; j++) {
                         let set = allSets[j];
                         let key = set.join(this.spliter);
                         if (key && !this.result[key]) {
                             this.result[key] = {
                                 skus: { sku, Pic, price, Stock }
                             };
            
                             if ((!key.includes(',') && !attr[key]) || (key.includes(',') && key.split(',').length < allKeys[i].split(',').length)) {
                                 attr[key] = {
                                     skus: { sku, Pic, price, Stock }
                                 };
                             }
                         }
                     }
                 }
            
                 for (let i in attr) {
                     attr[i].skus.Stock = 0;
                     for (let k in this.result) {
                         if (i != k && k.split(',').length == allKeys[0].split(',').length && k.includes(i)) {
                             attr[i].skus.Stock += Number(this.result[k].skus.Stock);
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
                                 attr[i].skus.Stock += Number(this.result[k].skus.Stock);
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
                             this.sku_list.result[key][j]['disabled'] = this.result[curr].skus.Stock > 0 ? false : true;
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
                 for (let i in this.skuBeanList) {
                     if (this.skuBeanList[i][this.skuName] == a) {
                         for (let x in this.skuBeanList[i]) {
                             if (x !== this.skuName && x !== this.skuName1 && x !== this.skuName2 && x !== this.skuName3) {
                                 this.sku_list.result[x][this.skuBeanList[i][x]].active = true;
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
                     this.num = this.result[s.join(this.spliter)].skus.Stock;
                     this.imgurl = this.result[s.join(this.spliter)].skus.Pic
                 }
            
                 if (s.length == this.keys.length) {
                     let curr = this.result[s.join(this.spliter)];
                     if (curr) {
                         this.SkuID = curr.skus.sku;
                         this.Pic = curr.skus.Pic;
                         this.price = curr.skus.price;
                         this.Stock = curr.skus.Stock;
                         
                         if(Number(this.numb)>Number(this.Stock)){
                         	this.numb = Number(this.Stock)
                         }
                     }
            
                     this.haveSkuBean = {
                         name: s.join(this.spliter),
                         cid: curr.skus.sku,
                         skus: curr.skus
                     };
                 } else {
                     this.haveSkuBean = '';
                 }
             },
            
             /* 
                 ——————sku核心算法 结束——————
            */
            
            toStore (id) {
                uni.navigateTo({
                    url: '/pagesA/store/store?shop_id=' + id
                })
            },
            changeLoginStatus () {

                this._axios()
            },
            // 增加减少购买数量
            changeStock (type) {
                if (this.haveSkuBean) {
                    if (type == 1) {
                        this.numb > 1 ? this.numb-- : this.numb == 1
                    } else if (type == 2) {
                        if (this.numb < Number(this.num)) {
                            this.numb++
                        } else {
                            uni.showToast({
                                title: '已经超过购买限额',
                                duration: 1000,
                                icon: 'none'
                            })
                        }
                    }
                } else {
                    uni.showToast({
                        title: '请先选择商品规格',
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            // 点击确定购买之后，如果库存不为零。则运行
            _shopping (id) {
                if (this.haveSkuBean) {
                    var data = {
                        module: 'app',
                        action: 'product',
                        app: 'add_cart',
                        pro_id: this.proid,
                        attribute_id: this.haveSkuBean.cid,
                        num: this.numb,
                        type: 'addcart'
                    }

                    this.$req
                        .post({ data })
                        .then(res => {
                            let { code, data, message } = res
                            if (code == 200) {
                                uni.showToast({
                                    title: '添加成功，在购物车等您哦~',
                                    icon: 'none'
                                })

                                this.$store.state.access_id = data.access_id

                                this.haveSkuBean = ''
                                this._mask_f()
                                setTimeout(() => {
                                    this.fastTap = true
                                    this._axios()
                                }, 500)
                            } else {
                                uni.showToast({
                                    title: message,
                                    icon: 'none'
                                })
                                this.fastTap = true
                            }
                        })
                        .catch(error => {
                            this.fastTap = true
                        })
                } else {
                    this._mask_display()
                    this.fastTap = true
                }
            },
            // 为你推荐商品右下角的小购物车图标
            shopping_j (id) {
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                this.proid = id
                var data = {
                    module: 'app',
                    action: 'product',
                    app: 'index',
                    pro_id: id
                }

                this.$req
                    .post({ data })
                    .then(res => {
                        this.fastTap = true
                        let {
                            data: { collection_id, pro, comments, attrList, skuBeanList, attribute_list, qj_price, type }
                        } = res
                        this.ys_price = qj_price
                        this.price = qj_price
                        this.attrList = attrList
                        this.skuBeanList = attribute_list
                        this.initData();
                        
                        this.collection = type
                        this.imgurl = pro.img_arr[0]
                        this.num = pro.num

                        this.mask_display1 = true
                        this.numb = 1
                    })
                    .catch(error => {
                        this.fastTap = true
                    })
            },
            // 跳转至为你推荐的商品详情
            _goods (id) {
                this.$store.commit('SET_PRO_ID', id)
                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed'
                })
            },
            // 登录
            toLogin () {
                uni.navigateTo({
                    url: '/pages/login/login?landing_code=1'
                })
            },
            //打开遮罩层
            toHome () {
                uni.switchTab({
                    url: '/pages/tabBar/home'
                })
            },
            // 购物车商品中，点击规格
            _mask_display (stock, price, imgurl, id, attribute_id) {
                this.shopping_id = id
                this.haveSkuBean = ''
                this.mask_display = true
                var data = {
                    module: 'app',
                    action: 'cart',
                    app: 'dj_attribute',

                    pro_id: id
                }
                if (this.access_id) {
                    data.cart_id = id
                } else {
                    data.cart_id = id
                }
                
                this.imgurl = imgurl

                this.$req.post({ data }).then(res => {
                    let { data } = res
                    this.attrList = data[0].attrList
                    this.skuBeanList = data[0].attribute_list
                    
                    this.initData()
                    
                    // 以下为初始化选中
                    for(let i in this.sku_list.items){
                        if(this.sku_list.items[i].sku == attribute_id){
                            this.haveSkuBean = {
                                name: this.sku_list.items[i].path,
                                cid: attribute_id,
                                skus: this.sku_list.items[i]
                            };
                        }
                    }
                    
                    let selectName = this.haveSkuBean.name.split(',')
                    
                    for(let i in this.sku_list.result){
                        
                        for(let k in this.sku_list.result[i]){
                            
                            let flag = selectName.some(item=>item==k)
                            
                            if(flag){
                                this.handleActive(i, this.sku_list.result[i][k])
                            }
                            
                        }
                        
                    }
                    
                })
            },
            // 关闭遮罩层
            _mask_f () {
                this.haveSkuBean = ''
                this.mask_display1 = false
            },
            //关闭遮罩层
            _mask_false () {
                this.mask_display = false
            },
            // 遮罩层中，点击确认按钮
            _confirm1 () {
                if(this.sku_list.result['undefined']){
                	this.haveSkuBean = {
                		cid: this.sku_list.items[0].sku,
                		skus: this.sku_list.items[0]
                	};
                }
                
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                if (Boolean(this.haveSkuBean)) {
                    if (this.num == 0) {
                        uni.showToast({
                            title: '库存不足',
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    } else if (this.num != 0) {
                        this._shopping()
                    }
                } else {
                    if (this.num == 0) {
                        uni.showToast({
                            title: '库存不足',
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    } else {
                        uni.showToast({
                            title: '请选择完整的商品规格！',
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    }
                }
            },
            //确认
            _confirm (num) {
                if(this.sku_list.result['undefined']){
                	this.haveSkuBean = {
                		cid: this.sku_list.items[0].sku,
                		skus: this.sku_list.items[0]
                	};
                }
                
                if (num == 0) {
                    uni.showToast({
                        title: '该产品规格库存不足！',
                        duration: 1000,
                        icon: 'none'
                    })
                    return
                }
                console.log(this.haveSkuBean)
                if (Boolean(this.haveSkuBean)) {
                    let data = {
                        module: 'app',
                        action: 'cart',
                        app: 'modify_attribute',
                        cart_id: this.shopping_id,
                        attribute_id: this.haveSkuBean.cid
                    }
                    this.$req.post({ data }).then(res => {
                        let { code, message } = res
                        if (code == 200) {
                            this._mask_false()
                            this._axios()
                        }else{
                            uni.showToast({
                                title: message,
                                icon: 'none'
                            })
                        }
                    })
                } else {
                    uni.showToast({
                        title: '请选择完整的商品规格！',
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            _axios () {
                this.goods = []

                if (!this.load) {
                    uni.showLoading({
                        title: '请稍后...'
                    })
                }

                var data = {
                    module: 'app',
                    action: 'cart',
                    app: 'index',
                    cart_id: this.$store.state.nCart
                }
                this.$req.post({ data }).then(res => {
                    if (!this.load) {
                        uni.hideLoading()
                    }

                    let { code, data, list, mch_list, login_status, message } = res
                    if (login_status != 0) {
                        this.access_id1 = true
                    } else {
                        this.access_id1 = false
                    }
                    if (code == 200) {
                        this.goods.push(...data)
                        this.list = list
                        this.mch_list = mch_list
                        // 计算购物车商品总数量
                        this._cartAllNum()
                        // 按店铺分商品
                        this._productDividedByStore()
                    } else {
                        this.access_id1 = false
                        this.goods = []
                    }
                    this.load = true
                })
            },
            ...mapMutations({
                cart_id: 'SET_CART_ID',
                pro_id: 'SET_PRO_ID',
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID',
                cart_num: 'SET_CART_NUM'
            }),
            //数量减少
            _reduce (index, id) {
                var num = this.goods[index].num
                if (this.goods[index].num <= 1) {
                    this.goods[index].num = 1
                    uni.showToast({
                        title: '该宝贝不能减少了哟！',
                        duration: 1000,
                        icon: 'none'
                    })
                    return false
                } else {
                    this.goods[index].num--
                    this._munajax(this.goods[index].num, id)
                    // 计算购物车总数量
                    this._cartAllNum()
                }
            },
            //数量增加
            _add (index, stock, id) {
                let num = this.num ? this.num : stock
                if (Number(this.goods[index].num) < Number(num)) {
                    this.goods[index].num++
                    this._munajax(this.goods[index].num, id)
                    this.jia_img = true
                    // 计算购物车总数量
                    this._cartAllNum()
                } else {
                    this.jia_img = false
                    uni.showToast({
                        title: '数量已达到上线哦！',
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            in_array (stringToSearch, arrayToSearch) {
                for (let s = 0; s < arrayToSearch.length; s++) {
                    let thisEntry = arrayToSearch[s].toString()
                    if (thisEntry == stringToSearch) {
                        return true
                    }
                }
                return false
            },
            _munajax (goods, id) {
                let arr = {
                    num: goods,
                    cart_id: Number(id)
                }
                let data = {
                    module: 'app',
                    action: 'cart',
                    app: 'up_cart',
                    goods: JSON.stringify(arr)
                }

                this.$req.post({ data }).then(res => {})
            },
            //编辑管理状态
            _manage () {
                this.manage = !this.manage
                if (this.manage) {
                    this.manage_text = '编辑'
                    this.manage_pay = '去结算'
                } else {
                    this.manage_text = '完成'
                    this.manage_pay = '删除商品'
                }
            },
            //节奏遮罩层传值
            _mask_value (mask_value) {
                uni.showTabBar()
                this.mask_value = mask_value
                var cart_id = []
                var cart_str = ''
                for (var i = 0; i < this.selectArray.length; i++) {
                    cart_id.push(Number(this.selectArray[i].id))
                    cart_str = cart_str + Number(this.selectArray[i].id) + ','
                }
                if (mask_value == '取消') {
                    this.display = false
                } else if (this.manage_pay == '删除商品' && this.mask_value == '确认') {
                    // #ifdef MP-ALIPAY
                    cart_id = cart_str
                    // #endif

                    var data = {
                        module: 'app',
                        action: 'cart',
                        app: 'delcart',
                    }

                    // #ifdef MP-BAIDU
                    for (let i in cart_id) {
                        data[`cart_id[${i}]`] = cart_id[i]
                    }
                    // #endif

                    // #ifndef MP-BAIDU
                    data['cart_id'] = cart_id
                    // #endif

                    this.display_img1 = []

                    this.$req.post({ data }).then(res => {
                        if (res.code != 200) {
                            uni.showToast({
                                title: res.err,
                                duration: 1500,
                                icon: 'none'
                            })
                        }

                        this.manage_text = '编辑'
                        this.manage_pay = '去结算'
                        this.manage = true
                        this.selectAll = false
                        this.selectArray = []
                        for (var i = 0; i < this.goods.length; i++) {
                            this.$set(this.display_img, i, false)
                        }
                        for (var i = 0; i < cart_id.length; i++) {
                            var n = this.$store.state.nCart.indexOf(cart_id[i])
                            if (n > -1) {
                                this.$store.state.nCart.splice(n, 1)
                            }
                        }

                        this.display = false
                        this._axios()
                        // 计算购物车总数量
                        this._cartAllNum()
                    })
                }
            },
            //删除商品
            _delete () {
                if (this.manage_pay == '删除商品' && this.selectArray.length > 0) {
                    this.display = true
                    // #ifndef H5
                    uni.hideTabBar()
                    // #endif
                } else if (this.manage_pay == '删除商品') {
                    uni.showToast({
                        title: '请选择您需要删除的商品！',
                        duration: 1000,
                        icon: 'none'
                    })
                }

                if (this.manage_pay == '去结算' && this.selectArray.length > 0) {
                    this.isLogin(() => {
                        var cart_id = []
                        var goods = []
                        for (var i = 0; i < this.selectArray.length; i++) {
                            cart_id.push(this.selectArray[i].id)
                            goods.push({
                                num: this.selectArray[i].num,
                                cart_id: Number(this.selectArray[i].id)
                            })
                        }
                        var data = {
                            module: 'app',
                            action: 'cart',
                            app: 'up_cart',
                            goods: JSON.stringify(goods)
                        }

                        this.$req.post({ data }).then(res => {
                            if (res.code == 404) {
                                uni.showToast({
                                    title: '支付发生异常!',
                                    icon: 'none',
                                    duration: 1000
                                })
                                return
                            }

                            if (res.code == 200) {
                                this.$store.state.cart_id = cart_id
                                this.cart_id(cart_id)
                                this.order_id('')
                                this.address_id('')

                                // #ifdef H5
                                var storage = window.localStorage
                                storage.cart_id = cart_id
                                // #endif

                                uni.navigateTo({
                                    url: '/pages/pay/orderDetailsr?cart_id=' + cart_id + '&canshu=true&returnR=1'
                                })
                            } else {
                                uni.showToast({
                                    title: '库存不足!',
                                    icon: 'none',
                                    duration: 1000
                                })
                                setTimeout(() => {
                                    this._axios()

                                    for (var i = 0; i < this.goods.length; i++) {
                                        this.display_img[i] = false
                                    }
                                    this.selectArray = []
                                }, 1000)
                                this.selectAll = false
                            }
                        })
                    })
                } else if (this.manage_pay == '去结算') {
                    uni.showToast({
                        title: '请选择您需要购买的商品！',
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            //单选
            _checkedOne (item, indexli, item1, index1) {

                var cum = this.selectArray.findIndex(items => {
                    return items.id == item.id
                })
                // 如果是有的话 点击就是取消
                //判断点击的传入的值是否存在数组中，如果没有添加，如果有删除，同时设定选中状态（第一次点击添加进数组，第二次点击从数组中删除）
                if (this.manage_pay == '删除商品') {
                    if (cum < 0) {
                        // 点击新增
                        this.selectArray.push(item)
                        this.$set(this.display_img, indexli, true)
                    } else {
                        // 点击取消
                        var i = this.selectArray.findIndex(items => {
                            return items.id == item.id
                        })

                        this.selectArray.splice(i, 1)

                        this.$set(this.display_img, indexli, false)
                    }
                } else if (this.manage_pay == '去结算') {

                    if (cum < 0 && item.stock > 0) {
                        // 点击新增
                        this.selectArray.push(item)
                        this.$set(this.display_img, indexli, true)
                    } else if (cum >= 0 && item.stock > 0) {
                        // 点击取消
                        var i = this.selectArray.findIndex(items => {
                            return items.id == item.id
                        })

                        this.selectArray.splice(i, 1)

                        this.$set(this.display_img, indexli, false)
                    } else {
                        uni.showToast({
                            title: '该商品库存不足！',
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                }
                //根据产品选状态，设定全选状态
                if (this.selectArray.length == this.goods.length) {
                    this.selectAll = true
                } else {
                    this.selectAll = false
                }
                //根据产品选状态，设定店铺全选状态
                // 添加或删除店铺选择数组
                if (item.mch_id == item1.id) {

                    if (!this.selectStoreArray[index1]) {
                        this.selectStoreArray[index1] = []
                    }
                    var isSlectedInStore = this.selectStoreArray[index1].findIndex(items => { items.id == item.id })
                    if (isSlectedInStore < 0) {
                        this.selectStoreArray[index1].push(item)
                    } else {
                        var i = this.selectStoreArray[index1].findIndex(items => {
                            return items.id == item.id
                        })

                        this.selectStoreArray[index1].splice(i, 1)
                    }
                    var isSlected = this.selectStore.findIndex(items => { items.id == item1.id })

                    if (this.selectStoreArray[index1].length == this.storeArray[index1].children.length) {
                        if (isSlected < 0) {
                            this.$set(this.display_img1, index1, true)
                            this.selectStore.push(item1)
                        }
                    } else {
                        if (isSlected >= 0) {
                            this.$set(this.display_img1, index1, false)

                            var i = this.selectStore.findIndex(items => {
                                return items.id == item1.id
                            })

                            this.selectStore.splice(i, 1)
                        }
                    }
                }
            },
            //全选
            _selectAll () {
                var arr = []
                for (var i = 0; i < this.goods.length; i++) {
                    if (this.goods[i].stock > 0) {
                        arr.push(1)
                    }
                }
                if (this.manage_pay == '删除商品') {
                    this.selectAll = !this.selectAll
                    if (this.selectAll) {
                        for (var i = 0; i < this.goods.length; i++) {
                            this.$set(this.selectArray, i, this.goods[i])
                            this.$set(this.display_img, i, true)
                        }
                        //店铺
                        if (this.mch_list) {
                            for (var i = 0; i < this.mch_list.length; i++) {
                                this.$set(this.selectStore, i, this.mch_list[i])
                                this.$set(this.display_img1, i, true)
                                if (this.storeArray.children) {
                                    if (this.storeArray[i].children) {
                                        for (var j = 0; j < this.storeArray[i].children.length; j++) {
                                            if (!this.selectStoreArray[i]) {
                                                this.selectStoreArray[i] = []
                                            }
                                            this.$set(this.selectStoreArray[i], j, this.storeArray[i].children[j])
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        this.selectArray = []
                        for (var i = 0; i < this.goods.length; i++) {
                            this.$set(this.display_img, i, false)
                        }
                        //店铺
                        this.selectStore = []
                        this.selectStoreArray = []
                        if (this.storeArray) {
                            for (var i = 0; i < this.storeArray.length; i++) {
                                this.$set(this.display_img1, i, false)
                            }
                        }
                    }
                } else if (this.manage_pay == '去结算') {
                    if (arr.length == this.goods.length) {
                        this.selectAll = !this.selectAll
                        if (this.selectAll) {
                            for (var i = 0; i < this.goods.length; i++) {
                                this.$set(this.selectArray, i, this.goods[i])
                                this.$set(this.display_img, i, true)
                            }
                            //店铺
                            if (this.mch_list) {
                                console.log('全选店铺操作1')
                                for (var i = 0; i < this.mch_list.length; i++) {
                                    this.$set(this.selectStore, i, this.mch_list[i])
                                    this.$set(this.display_img1, i, true)
                                    if (this.storeArray[i].children) {
                                        for (var j = 0; j < this.storeArray[i].children.length; j++) {
                                            if (!this.selectStoreArray[i]) {
                                                this.selectStoreArray[i] = []
                                            }
                                            this.$set(this.selectStoreArray[i], j, this.storeArray[i].children[j])
                                        }
                                    }
                                }
                            }
                        } else {
                            this.selectArray = []
                            for (var i = 0; i < this.goods.length; i++) {
                                this.$set(this.display_img, i, false)
                            }
                            //店铺
                            this.selectStore = []
                            this.selectStoreArray = []
                            if (this.storeArray) {
                                for (var i = 0; i < this.storeArray.length; i++) {
                                    this.$set(this.display_img1, i, false)
                                }
                            }
                        }
                    } else {
                        uni.showToast({
                            title: '商品库存不足，不能进行该项操作！',
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                }
            },
            // 全选某店铺商品
            _selectAllStore (item, index) {
                var storeId = this.mch_list[index].id
                var isSlected = this.selectStore.findIndex(items => { return items.id == storeId })
                // 判断此店铺是否被选中
                if (isSlected < 0) {
                    // 否 则选中店铺
                    for (var j = 0; j < this.goods.length; j++) {
                        var cum = this.selectArray.findIndex(items => { return items.id == this.goods[j].id })

                        if (storeId == this.goods[j].mch_id) {
                            console.log('添加店铺cum', cum)
                            if (cum < 0) {
                                this.selectArray.push(this.goods[j])
                                this.$set(this.display_img, j, true)
                                if (!this.selectStoreArray[index]) {
                                    this.selectStoreArray[index] = []
                                }
                                this.selectStoreArray[index].push(this.goods[j])
                            }
                        }
                    }
                    this.selectStore.push(item)

                    this.$set(this.display_img1, index, true)
                } else {
                    // 是 则取消店铺
                    for (var j = 0; j < this.goods.length; j++) {
                        var cum = this.selectArray.findIndex((selectItem) => selectItem.id === this.goods[j].id)

                        if (storeId == this.goods[j].mch_id) {
                            if (cum >= 0) {
                                this.selectArray.splice(cum, 1)
                                this.$set(this.display_img, j, false)
                                if (!this.selectStoreArray[index]) {
                                    this.selectStoreArray[index] = []
                                }
                                let cum2 = this.selectStoreArray[index].findIndex((selectItem) => selectItem.id === this.goods[j].id)
                                this.selectStoreArray.splice(cum2, 1)
                            }
                        }
                    }

                    let cum3 = this.selectStore.findIndex((selectItem) => selectItem.id === item.id)
                    this.selectStore.splice(cum3, 1)

                    this.$set(this.display_img1, index, false)
                }

                //根据产品选状态，设定全选状态
                if (this.selectArray.length == this.goods.length) {
                    this.selectAll = true
                } else {
                    this.selectAll = false
                }
            },
            // 按店铺分商品
            _productDividedByStore () {
                if (this.mch_list && this.goods) {
                    for (var i = 0; i < this.mch_list.length; i++) {
                        if (!this.storeArray[i]) {
                            this.storeArray[i] = []
                        }
                        this.storeArray[i].push(this.mch_list[i])

                        if (!this.storeArray[i].children) {
                            this.storeArray[i].children = []
                        }
                        for (var j = 0; j < this.goods.length; j++) {
                            if (this.mch_list[i].id == this.goods[j].mch_id) {
                                var storeI = this.storeArray[i].children.findIndex(it => {
                                    return it.id == this.goods[j].id
                                })

                                if (storeI < 0) {
                                    this.storeArray[i].children.push(this.goods[j])
                                }
                            }
                        }
                    }
                }
            },
            _goodsDetailed (pro_id) {
                this.pro_id(pro_id)

                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed'
                })
            },
            // 计算购物车商品总数量
            _cartAllNum () {
                var data = this.goods
                if (data && data.length) {
                    var allnum = 0
                    for (var i = 0; i < data.length; i++) {
                        allnum += Number(data[i].num)
                    }
                    this.cart_num(allnum)
                } else if (data.length == 0) {
                    this.cart_num(0)
                }
                //添加，移除tabbar购物车小点提醒
                if (this._cart_num) {
                    var cart_num_str = String(this._cart_num)

                    // #ifdef MP-WEIXIN
                    uni.setTabBarBadge({
                        index: 2,  // 修改为 index: 2
                        text: cart_num_str
                    })
                    // #endif

                    // #ifndef MP-WEIXIN
                    uni.setTabBarBadge({
                        index: 2,
                        text: cart_num_str
                    })
                    // #endif

                } else {

                    // #ifdef MP-WEIXIN
                    uni.removeTabBarBadge({
                        index: 3
                    })
                    // #endif

                    // #ifndef MP-WEIXIN
                    uni.removeTabBarBadge({
                        index: 2
                    })
                    // #endif
                }
            }
        },
        computed: {
            count: function () {
                var count = 0
                for (var i = 0; i < this.selectArray.length; i++) {
                    console.log(Number(this.selectArray[i].num))
                    count += Number(this.selectArray[i].num)
                }
                return count
            },
            h5Height: function () {
                var height
                // #ifdef H5
                height = 100 + 'upx'
                // #endif
                // #ifndef H5
                height = 0 + 'upx'
                // #endif
                return height
            },
            total () {
                var total = 0
                for (var i = 0; i < this.selectArray.length; i++) {
                    if (this.selectArray[i]) {
                        total += new Number(this.selectArray[i].price) * parseInt(this.selectArray[i].num)
                    }
                }
                return total.toFixed(2)
            },
            ...mapState({
                _cart_num: 'cart_num'
            })
        },
        components: {
            maskM
        }
    }
</script>

<style scoped>
    @import url('../../static/css/tab/shoppingCart.css');
</style>
