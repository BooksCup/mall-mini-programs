import Request from '../req/request.js'
import common from '../common.vue'

class GoodsClass extends Request {
    getGoodsClassList(data) {
        return super.request({
            url: common.ROOT_URL + '/goodsClass',
            method: 'get',
            data: data
        })
    }
}

const goodsClass = new GoodsClass()
export default goodsClass
