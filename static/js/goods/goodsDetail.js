import htmlParser from '../../../common/html-parser.js'

export function LaiKeTui_axios(me) {
    var data = {
        module: 'app',
        action: 'product',
        app: 'index',
        pro_id: me.pro_id,
    }

    if (me.bargain) {
        data.type = 'KJ'
        data.attr_id = me.attr_id
        data.bargain_id = me.bargain_id
    } else if (me.seckill) {
        data.type = 'MS'
        data.navType = me.navType
        data.id = me.id
    }
    me.$req.post({
        data
    }).then(res => {
        console.log(res)
        // uni.hideLoading()
        if (res && res.data) {
            me.login_status = res.data.login_status
        }
        me.load = false
        if (res.code == 200) {
            let {
                data: {
                    collection_id,
                    pro,
                    access_id,
                    comments,
                    attrList,
                    skuBeanList,
                    qj_price,
                    type,
                    logo,
                    active,
                    is_grade,
                    shop_list,
                    coupon_str,
                    attribute_list
                }
            } = res

            me.ys_price = qj_price
            if (me.bargain) {
                me.cs_price = res.data.cs_price
                me.cs_num = res.data.cs_num
                me.cs_yprice = res.data.cs_yprice
            }
            me.price = qj_price
            me.attrList = attrList
            me.collection = type
            me.coupon_str = coupon_str

            me.skuBeanList = attribute_list
            me.initData();
            if (data.type == 'MS') {
                me._remain_time(pro)
            } else {
                me.pro = pro
                pro.content = pro.content.replace(/src/g,
                    'style=\'width:100%!important;height: auto!important;\' src').replace(
                    /<table/g, `<table style="width:100%!important;"`)
                pro.content = htmlParser(pro.content)
            }
            me.is_grade = is_grade
            me.active = active
            me.$store.state.access_id = access_id
            uni.setStorageSync('access_id', access_id)
            me.imgurl = pro.img_arr[0]
            me.num = pro.num
            me.status = pro.status
            me.collection_id = collection_id
            me.pic = logo
            me.shop_list = shop_list
            if (comments) {
                me.comments = comments
            } else {
                me.comments = ''
            }
            var url = uni.getStorageSync('h5_url')
            me.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + me.pro_id +
                '&isfx=true'
            if (pro.is_distribution == 1) {
                me.isDistribution = true
                me.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + me.pro_id +
                    '&isfx=true&fatherId=' + pro.user_id
            }
            me.shareHref2 = '/pages/goods/goodsDetailed?productId=' + me.pro_id
            me.sharehrefTitle = me.pro.name
            me.shareImg = me.imgurl
            me.shareContent = me.pro.name
            me.coupon_status = res.data.coupon_status
            // me._spec()

            me.loadFlag = true
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
        }
    }).catch((err) => {
        me.load = false
    })
}

// 分享
export function LaiKeTuiInvite(type, me) {
    if (!me.access_id) {
        uni.navigateTo({
            url: '../../login/login'
        })
        return
    } else {
        if (type == '二维码分享') {
            me.showSaveEWM('app')
            return
        }
        if (type == '朋友圈') {
            uni.share({
                provider: 'weixin',
                scene: 'WXSenceTimeline',
                type: 0,
                href: me.shareHref,
                title: me.sharehrefTitle,
                summary: me.shareContent,
                imageUrl: me.shareImg,
                success: function(res) {
                    me.fastTap = true
                    uni.showToast({
                        title: '分享成功!',
                        icon: 'none'
                    })
                },
                fail: function(err) {
                    me.fastTap = true
                    uni.showToast({
                        title: '分享失败!',
                        icon: 'none'
                    })
                }
            })
        } else if (type == '微信') {
            uni.share({
                provider: 'weixin',
                scene: 'WXSceneSession',
                type: 0,
                href: me.shareHref,
                title: me.sharehrefTitle,
                summary: me.shareContent,
                imageUrl: me.shareImg,
                success: function(res) {
                    me.fastTap = true
                    uni.showToast({
                        title: '分享成功!',
                        icon: 'none'
                    })
                },
                fail: function(err) {
                    me.fastTap = true
                    uni.showToast({
                        title: '分享失败!',
                        icon: 'none'
                    })
                }
            })
        }
    }
}

// 
export function LaiKeTuiShowSaveEWM(string, me) {
    // #ifdef APP-PLUS
    string = 'app'
    // #endif
    // #ifdef MP-ALIPAY
    string = 'ali'
    // #endif
    // #ifdef MP-WEIXIN
    string = 'wx'
    // #endif
    // #ifdef MP-TOUTIAO
    string = 'tt'
    // #endif
    var data = {
        module: 'app',
        action: 'getcode',
        m: 'share',
        proId: me.pro_id,
        href: me.shareHref,
    }
    if (me.is_jifen) {
        data.share_type = 2
    }
    if (string == 'wx') {
        data.store_type = 1
    } else if (string == 'tt') {
        data.store_type = 4
    } else {
        data.store_type = 2
    }
    me.$req.post({
        data
    }).then(res => {
        if (res.code == 200) {
            me.ewmImg = uni.getStorageSync('endurl') + res.imgUrl
            me.saveEWM = true
        } else if (res.code == 404) {
            me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../login/login')
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}

//分享店铺二维码
export function LaiKeTuiShopEWM(string, me) {

    var data = {
        module: 'app',
        action: 'getcode',
        m: 'share_shop',
        shop_id: me.shop_id,
    }

    // #ifdef MP-WEIXIN
    data.store_type = 1
    // #endif
    // #ifndef MP-WEIXIN
    data.store_type = 2
    // #endif
    me.$req.post({
        data
    }).then(res => {
        if (res.code == 200) {
            me.ewmImg = uni.getStorageSync('endurl') + res.imgUrl
            me.saveEWM = true
        } else if (res.code == 404) {
            me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../login/login')
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}

// 收藏
export function collect(me) {
    if (!me.fastTap) {
        return;
    }
    me.fastTap = false
    uni.setStorageSync('userId', '61430a543dad4a8ca236b2b0b6627cdd')
    // me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../login/login', function() {
    if (me.isCollected == me.$common.COLLECT_STATUS.NO) {
        // 未收藏,点击收藏
        let data = {
            storeId: me.$common.STORE_ID,
            goodsId: me.pro_id,
            userId: uni.getStorageSync('userId')
        }

        me.$userCollection.collectGoods(data).then(res => {
            me.fastTap = true
            me.isCollected = me.$common.COLLECT_STATUS.YES
            uni.showToast({
                title: res.responseMessage,
                duration: 1000,
                icon: 'none'
            })
        }).catch(e => {
            me.fastTap = true
            uni.showToast({
                title: e.responseMessage,
                duration: 1000,
                icon: 'none'
            })
        })

    } else {
        // 已收藏,点击取消收藏
        let data = {
            storeId: me.$common.STORE_ID,
            goodsId: me.pro_id,
            userId: uni.getStorageSync('userId')
        }

        me.$userCollection.cancelCollectGoods(data).then(res => {
            me.fastTap = true
            me.isCollected = me.$common.COLLECT_STATUS.NO
            uni.showToast({
                title: res.responseMessage,
                duration: 1000,
                icon: 'none'
            })
        }).catch(e => {
            me.fastTap = true
            uni.showToast({
                title: e.responseMessage,
                duration: 1000,
                icon: 'none'
            })
        })
    }
    // })
}

// 加入购物车
export function addToCart(me) {
    me.type = 2
    if (!me.fastTap) {
        return
    }
    me.fastTap = false
    if (me.haveSkuBean) {
        let data = {
            storeId: me.$common.STORE_ID,
            storeType: me.$common.getStoreType(),
            goodsId: me.pro_id,
            goodsNum: me.numb,
            goodsSkuId: me.haveSkuBean.skuId,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDUwNjg3MTAsImlhdCI6MTYwNTA2MTUxMCwianRpIjoiYzZlZDhjN2IyMzBhODBkOTJkZTgyYzE1ZmIyYTlhNDIifQ.g9rvZc5LtIDQDGO78tH1O3V_7-hQASYfFvd7ZmpYtec',
        }

        me.$cart.addToCart(data).then(res => {
            me.fastTap = true
            uni.showToast({
                title: '添加成功，在购物车等您哦~',
                duration: 1000,
                icon: 'none'
            })
            me.haveSkuBean = ''
            me.setCartNum(me.numb + me.cartNum)
            me.allCartNum = me.cartNum

            me._mask_false()
        }).catch(e => {
            me.fastTap = true
            uni.showToast({
                title: e.responseMessage,
                duration: 1000,
                icon: 'none'
            })
        })

        // var data = {
        //     module: 'app',
        //     action: 'product',
        //     app: 'add_cart',
        //     pro_id: me.pro_id,
        //     attribute_id: me.haveSkuBean.cid,
        //     num: me.numb,
        //     type: 'addcart'
        // }
        // me.$req.post({
        //     data
        // }).then(res => {
        //     me.fastTap = true
        //     let {
        //         code,
        //         data,
        //         message
        //     } = res
        //     if (code == 200) {
        //         uni.showToast({
        //             title: '添加成功，在购物车等您哦~',
        //             duration: 1000,
        //             icon: 'none'
        //         })
        //         me.haveSkuBean = ''
        //         me.cart_num(me.numb + me._cart_num)
        //         me.allCartNum = me._cart_num
        //         me._mask_false()
        //     } else {
        //         uni.showToast({
        //             title: message,
        //             duration: 1500,
        //             icon: 'none'
        //         })
        //     }
        //     if (data.cart_id) {
        //         if (!in_array(data.cart_id, me.$store.state.nCart)) {
        //             me.$store.state.nCart.push(data.cart_id)
        //         }
        //     }
        // })
    } else {
        me.fastTap = true
        me.showChooseSpecMask()
    }
}

// 获取优惠券
export function LaiKeTuiGetCoupon(me) {
    me.couponMask = true
    var data = {
        module: 'app',
        action: 'Coupon',
        app: 'pro_coupon',
        pro_id: me.pro_id,
    }
    me.$req.post({
        data
    }).then(res => {
        if (res.code == 200) {
            me.coupon_list = res.list
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
        }
        me.fastTap = true
    })
}

// 领取优惠券
export function LaiKeTui_receive(me, id) {
    if (!me.fastTap) {
        return
    }
    me.fastTap = false
    if (!me.access_id) {
        me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../login/login?landing_code=coupon')
        return
    }
    var data = {
        module: 'app',
        action: 'Coupon',
        app: 'receive',
        id: id
    }
    me.$req.post({
        data
    }).then(res => {
        let code = res.code
        if (code == 200) {
            uni.showToast({
                title: '领取成功',
                duration: 1500,
                icon: 'none'
            })
            setTimeout(function() {
                me.getCoupon()
            }, 1500)
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
            setTimeout(function() {
                me.getCoupon()
            }, 1500)
        }
    }).catch((err) => {
        me.fastTap = true
    })
}

// 立即购买
export function handleBuy(me) {
    if (me.fastTap) {
        me.fastTap = false
        me.type = 3
        // me.$refs.authorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1', function() {
        //正常登录未超时
        if (me.haveSkuBean) {
            let data = {
                storeId: me.$common.STORE_ID,
                goodsId: me.pro_id,
                number: me.numb,
                goodsSkuId: me.haveSkuBean.skuId
            }
            product = JSON.stringify(data)
            var product = []
            product.push({
                pid: me.pro_id
            })

            product.push({
                cid: me.haveSkuBean.skuId
            })

            product.push({
                num: me.numb
            })

            product.push({
                sec_id: me.option.id
            })
            product = JSON.stringify(product)
            me.$cart.buyNow(data).then(res => {
                me.fastTap = true
                var url = '/pages/order/orderDetail?product=' + product +
                    '&isDistribution=' + me.isDistribution +
                    '&canshu=true&returnR=2'
                // me._mask_f()
                uni.navigateTo({
                    url: url
                })
                console.log('你好鸭')
            }).catch(e => {
                uni.showToast({
                    title: e.responseMessage,
                    duration: 1000,
                    icon: 'none'
                })
                setTimeout(function() {
                    // me.getGoodsDetail()
                    me.fastTap = true
                }, 1500)
            })

            //     var product = []
            //     product.push({
            //         pid: me.pro_id
            //     })

            //     product.push({
            //         cid: me.haveSkuBean.cid
            //     })

            //     product.push({
            //         num: me.numb
            //     })

            //     product.push({
            //         sec_id: me.option.id
            //     })

            //     product = JSON.stringify(product)
            //     let data = {
            //         module: 'app',
            //         action: 'product',
            //         app: 'immediately_cart',
            //         product,
            //     }
            //     me.$req.post({data}).then(res => {
            //         me.clicktimes = []
            //         if (res.code == 200) {
            //             var url = '../pay/orderDetailsr?product=' + product +
            //                 '&isDistribution=' + me.isDistribution +
            //                 '&canshu=true&returnR=2'
            //             if (me.pages == 'pagesB') {
            //                 var url = '/pages/pay/orderDetailsr?product=' + product + '&isDistribution=' +
            //                     me.isDistribution +
            //                     '&canshu=true&returnR=2'
            //             }
            //             me._mask_f()
            //             uni.navigateTo({
            //                 url: url
            //             })
            //             me.fastTap = true
            //         } else {
            //             uni.showToast({
            //                 title: res.message,
            //                 duration: 1500,
            //                 icon: 'none'
            //             })
            //             setTimeout(function() {
            //                 me._axios()
            //                 me.fastTap = true
            //             }, 1500)
            //         }
            //     })
        } else {
            me.showChooseSpecMask()
            me.fastTap = true
        }
        // })
    }
}

// 确认
export function confirmSku(me) {
    if (me.sku_list.result['undefined']) {
        me.haveSkuBean = {
            cid: me.sku_list.items[0].sku,
            skus: me.sku_list.items[0]
        };
    }

    if (Boolean(me.haveSkuBean)) {
        if (me.skuStock == 0) {
            uni.showToast({
                title: '库存不足',
                duration: 1000,
                icon: 'none'
            })
        } else if (me.skuStock != 0) {
            if (me.type == 1) {
                me._mask_false()
                me.pay_lx('pt')
            } else if (me.type == 2) {
                me.addToCart()
                me.pay_lx('pt')
            } else if (me.type == 3) {
                me.buy()
                me.pay_lx('pt')
            }
        }
    } else {
        if (me.skuStock == 0) {
            uni.showToast({
                title: '库存不足',
                duration: 1000,
                icon: 'none'
            })
        } else {
            uni.showToast({
                title: '请选择完整的商品规格！',
                duration: 1000,
                icon: 'none'
            })
        }
    }
}

// 规格
export function LaiKeTui_spec(me) {
    var attrListIn = me.attrList;
    var skuBeanListIn = me.skuBeanList;
    for (var i = 0; i < attrListIn.length; i++) {
        var attrListBig = attrListIn[i];
        //当前类别之外的选择列表
        var attrsOtherSelect = [];
        for (var j = 0; j < attrListIn.length; j++) {
            var attrListSmall = attrListIn[j];
            if (attrListSmall.id != attrListBig.id) {
                for (var k = 0; k < attrListSmall.attr.length; k++) {
                    var attrListSmallAttr = attrListSmall.attr[k];
                    if (attrListSmallAttr.enable && attrListSmallAttr.select) {
                        //可选并且已经选择的属性
                        attrsOtherSelect.push(attrListSmallAttr);
                    }
                }
            }
        }
        var enableIds = [];
        for (var z = 0; z < skuBeanListIn.length; z++) {
            var ism = true;
            var skuBean = skuBeanListIn[z];
            for (var j = 0; j < attrsOtherSelect.length; j++) {
                var enable = false;
                for (var k = 0; k < skuBean.attributes.length; k++) {
                    var goodAttrBean = skuBean.attributes[k];
                    if (attrsOtherSelect[j].attributeId == goodAttrBean.attributeId &&
                        attrsOtherSelect[j].id == goodAttrBean.attributeValId) {
                        enable = true;
                        break;
                    }
                }
                ism = enable && ism;
            }

            if (ism) {
                for (var o = 0; o < skuBean.attributes.length; o++) {
                    var goodAttrBean = skuBean.attributes[o];
                    if (attrListBig.id == goodAttrBean.attributeId) {
                        enableIds.push(goodAttrBean.attributeValId);
                    }
                }
            }
        }
        for (let s = 0; s < attrListBig.attr.length; s++) {
            let attrItem = attrListBig.attr[s];
            attrItem.enable = Number(skuBeanListIn[s].count);
            // 这里需修改，如何改变enabale的真假
        }
    }
    // 重新赋值
    me.attrList = attrListIn
    me.skuBeanList = skuBeanListIn
}

// 选择属性
export function showState(me, index, indx) {
    var listItem = me.attrList

    var items = listItem[indx]
    var item = items.attr[index]
    if (!item.enable) {
        uni.showToast({
            title: '库存不足，请选择其它!',
            icon: 'none',
            duration: 1500
        })
        return
    }
    var select = !item.select
    for (var i = 0; i < items.attr.length; i++) {
        items.attr[i].select = false
    }
    item.select = select
    // 获取点击属性列表
    var canGetInfo = []
    for (var skuIndex = 0; skuIndex < listItem.length; skuIndex++) {
        for (var skuIndexIn = 0; skuIndexIn < listItem[skuIndex].attr.length; skuIndexIn++) {
            if (listItem[skuIndex].attr[skuIndexIn].enable && listItem[skuIndex].attr[skuIndexIn].select) {
                canGetInfo.push(listItem[skuIndex].attr[skuIndexIn])
            }
        }
    }

    let selectedlist = Array.from(canGetInfo, item => item.attributeValue)
    me.selectedlist = selectedlist.join(' ')

    var canGetInfoLog = ''

    var skuBeanList = me.skuBeanList

    var haveSkuBean = []
    // 对应库存清单扫描
    for (var skuBeanIndex = 0; skuBeanIndex < skuBeanList.length; skuBeanIndex++) {
        var iListCount = 0
        for (var skuBeanIndexIn = 0; skuBeanIndexIn < skuBeanList[skuBeanIndex].attributes.length; skuBeanIndexIn++) {
            if (canGetInfo.length == skuBeanList[skuBeanIndex].attributes.length) {
                if (skuBeanList[skuBeanIndex].attributes[skuBeanIndexIn].attributeValId == canGetInfo[skuBeanIndexIn].id) {
                    iListCount++
                }
            } else {
                canGetInfoLog = '库存清单不存在此属性' + ' '
            }
        }
        if (iListCount == skuBeanList[skuBeanIndex].attributes.length) {
            haveSkuBean.push(skuBeanList[skuBeanIndex])
        }
    }

    for (var iox = 0; iox < canGetInfo.length; iox++) {
        canGetInfoLog += canGetInfo[iox].attributeValue + ' '
    }
    if (haveSkuBean.length != 0) {
        me.num = haveSkuBean[0].count
        if (me.num == 0) {
            uni.showToast({
                title: '库存不足，请选择其它!',
                icon: 'none',
                duration: 1500
            })
        }
        me.price = haveSkuBean[0].price
        if (me.imgurl != haveSkuBean[0].imgurl) {
            me.loadImg = true
            me.imgurl = haveSkuBean[0].imgurl
        }

        me.haveSkuBean = haveSkuBean[0]
    } else {
        me.num = me.pro.num
        me.price = me.ys_price
        me.haveSkuBean = ''
    }

    // 重新赋值
    me.attrList = listItem

    // 重新sku运算
    me._spec()
}

export function in_array(stringToSearch, arrayToSearch) {
    for (let s = 0; s < arrayToSearch.length; s++) {
        let thisEntry = arrayToSearch[s].toString()
        if (thisEntry == stringToSearch) {
            return true
        }
    }
    return false
}

export function LaiKeTuiSetTimeData(me) {
    var data = me.leftTime
    setInterval(function() {
        var t = --data
        var d = Math.floor(t / 60 / 60 / 24)
        var h = Math.floor((t / 3600) - (d * 24))
        var m = Math.floor((t - h * 60 * 60 - d * 24 * 60 * 60) / 60)
        var s = t % 60
        if (h < 10) h = '0' + h
        if (m < 10) m = '0' + m
        if (s < 10) s = '0' + s
        me.hour = h
        me.mniuate = m
        me.second = s
        me.day = d
        if (me.leftTime <= 0) {
            me.hour = 0
            me.mniuate = 0
            me.second = 0
            me.day = 0
        }
    }, 1000)
}

export function LaiKeTuiToBr(me) {
    var data = {
        module: 'app',
        action: 'login',
        app: 'token',
    }
    me.$req.post({
        data
    }).then(res => {
        if (res.code == 404 || res.login_status == 0) {
            me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1')
        } else {
            var bstatus = 0
            if (me.brStatus == 0) {
                bstatus = 1
            } else if (me.brStatus == 1) {
                bstatus = 2
            } else if (me.brStatus == 2) {
                bstatus = 3
            } else if (me.brStatus == 3) {
                bstatus = -1
            }
            uni.redirectTo({
                url: '../../pagesA/bargain/bargainIng?proId=' + me.pro_id + '&attr_id=' + me.attr_id +
                    '&order_no=' + me.order_no +
                    '&brStatus=' + bstatus + '&bargain_id=' + me.bargain_id
            })
        }
    })
}
