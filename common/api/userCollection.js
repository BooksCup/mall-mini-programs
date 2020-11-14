import Request from '../req/request.js'
import common from '../common.vue'

/**
 * 用户收藏
 * 
 * @author zhou
 */
class UserCollection extends Request {

    // 收藏商品
    collectGoods(data) {
        return super.request({
            url: common.ROOT_URL + '/userCollection/collectGoods',
            method: 'post',
            data: data
        })
    }

}

const userCollection = new UserCollection()
export default userCollection
