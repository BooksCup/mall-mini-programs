<script>
    /**
     * 根路径
     */
    // const ROOT_URL = 'http://localhost:8082'
    const ROOT_URL = 'http://192.168.0.133:8082'
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


    export default {
        ROOT_URL,
        STORE_ID,
        SMS_TEMPLATE_TYPE,
        SMS_TEMPLATE_CATEGORY,
        SHOP_TAB,
        getStoreType
    }
</script>
