import Request from '../req/request.js'
import common from '../common.vue'

class VerifyCode extends Request {
    getVerifyCode(data) {
        return super.request({
            url: common.ROOT_URL + '/verifyCode',
            method: 'get',
            data: data
        })
    }
}

const verifyCode = new VerifyCode()
export default verifyCode