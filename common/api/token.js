import Request from '../req/request.js'
import common from '../common.vue'

class Token extends Request {

    // 检查token
    checkToken(data) {
        return super.request({
            url: common.ROOT_URL + '/token/checkToken',
            method: 'post',
            data: data
        })
    }

}

const token = new Token()
export default token
