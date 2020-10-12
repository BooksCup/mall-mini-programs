import Request from '../req/request.js'
import common from '../common.vue'

class User extends Request {
    register(data) {
        return super.request({
            url: common.ROOT_URL + '/users',
            method: 'post',
            data: data
        })
    }
}

const user = new User()
export default user
