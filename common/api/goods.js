import Request from '../req/request.js'
import common from '../common.vue'

class Goods extends Request {
    // 获取猜你喜欢商品列表
    getLikeGoodsList(data) {
        return super.request({
            url: common.ROOT_URL + '/goods',
            method: 'get',
            data: data
        })
    }

    // 获取商品详情
    getGoodsDetail(data) {
        return super.request({
            url: common.ROOT_URL + '/goods/' + data.goodsId,
            method: 'get',
            data: data
        })
    }
}

const goods = new Goods()
export default goods
