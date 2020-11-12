<script>
    /**
     * 根路径
     */
    // const ROOT_URL = 'http://localhost:8082'
    const ROOT_URL = 'http://192.168.0.133:8082'
    // const ROOT_URL = 'https://sc.winddots.com/'
    const STORE_ID = 1
    const DEFAULT_STORE_TYPE = 1

    // 短信模板类型
    const SMS_TEMPLATE_TYPE = {
        // 验证码
        VERIFY_CODE: 0,
        // 短信通知
        NOTIFY: 1,
        // 推广短信
        POPULARIZE: 2
    }

    // 短信模板类别
    const SMS_TEMPLATE_CATEGORY = {
        // 注册
        REGISTER: 0,
        // 登录
        LOGIN: 1
    }

    // 商铺tab
    const SHOP_TAB = {
        // 推荐
        RECOMMEND: 1,
        // 所有商品
        ALL_GOODS: 2,
        // 商品类别
        GOODS_CLASS: 3
    }

    // 商品状态
    const GOODS_STATUS = {
        // 待上架
        WAIT_SHELVE: 1,
        // 上架
        SHELVE: 2,
        // 下架
        OFF_SHELVE: 3
    }

    // 商品是否允许购买
    const GOODS_ALLOW_TO_BUY = {
        // 不允许
        NOT_ALLOW: 0,
        // 允许
        ALLOW: 1
    }

    // SKU KEY
    const SKU_KEY = {
        // id
        ID: 'skuId',
        // 库存
        STOCK: 'stock',
        // 价格
        PRICE: 'price',
        // 图片
        IMAGE: 'image'
    }

    /**
     * 获取店铺类型
     * 1:微信小程序
     * 2:APP/H5
     * 3:支付宝小程序
     * 4:字节跳动小程序
     * 5:百度小程序
     */
    function getStoreType() {
        let store_type = DEFAULT_STORE_TYPE
        // #ifdef MP-WEIXIN
        store_type = 1
        // #endif
        // #ifdef APP-PLUS || H5
        store_type = 2
        // #endif
        // #ifdef MP-ALIPAY
        store_type = 3
        // #endif
        // #ifdef MP-TOUTIAO
        store_type = 4
        // #endif
        // #ifdef MP-BAIDU
        store_type = 5
        // #endif
        return store_type
    }

    /**
     * div按钮无重复点击
     * @param {Object} me
     * @param {Object} callback
     * @param {Object} opts
     */
    function noDoublePress(me, callback, opts) {
        var len = me.clicktimes.length
        var now = new Date().getTime()
        let lastclickBuyBtn = len > 0 ? me.clicktimes[len - 1] : now
        me.clicktimes.push(now)
        len = me.clicktimes.length
        //第一次进的时候时间数组长度为一、或者两次点击时间间隔大于等于一秒
        if (len == 1 || (now - lastclickBuyBtn) >= 1000) {
            if (opts) {
                callback(opts)
            } else {
                callback()
            }
        }
        if (len >= 3) {
            me.clicktimes.shift()
        }
    }

    export default {
        ROOT_URL,
        STORE_ID,
        SMS_TEMPLATE_TYPE,
        SMS_TEMPLATE_CATEGORY,
        SHOP_TAB,
        GOODS_STATUS,
        GOODS_ALLOW_TO_BUY,
        SKU_KEY,
        getStoreType,
        noDoublePress
    }
</script>
