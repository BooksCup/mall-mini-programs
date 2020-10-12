<script>
    /**
     * 根路径
     */
    // const ROOT_URL = 'http://localhost:8082'
    const ROOT_URL = 'http://192.168.0.133:8082'
    const STORE_ID = 1
    const DEFAULT_STORE_TYPE = 1

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
        getStoreType
    }
</script>
