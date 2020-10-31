import Request from '../req/request.js'
import common from '../common.vue'

class Shop extends Request {

    // 获取商品详情
    getShopDetail(data) {
        return super.request({
            url: common.ROOT_URL + '/shop/' + data.shopId,
            method: 'get',
            data: data
        })
    }
}

const shop = new Shop()
export default shop
