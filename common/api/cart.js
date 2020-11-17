import Request from '../req/request.js'
import common from '../common.vue'

/**
 * 购物车
 * 
 * @author zhou
 */
class Cart extends Request {

    // 加入购物车
    addToCart(data) {
        return super.request({
            url: common.ROOT_URL + '/cart',
            method: 'post',
            data: data
        })
    }

    // 立即购买
    buyNow(data) {
        return super.request({
            url: common.ROOT_URL + '/cart/buyNow',
            method: 'post',
            data: data
        })
    }
}

const cart = new Cart()
export default cart
