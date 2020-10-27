import Request from '../req/request.js'
import common from '../common.vue'

class Goods extends Request {
    getLikeGoodsList(data) {
        return super.request({
            url: common.ROOT_URL + '/goods',
            method: 'get',
            data: data
        })
    }
}

const goods = new Goods()
export default goods
