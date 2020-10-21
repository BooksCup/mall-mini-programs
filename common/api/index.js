import Request from '../req/request.js'
import common from '../common.vue'

class Index extends Request {
    
    getHomeProfile(data) {
        return super.request({
            url: common.ROOT_URL + '/index/home',
            method: 'get',
            data: data
        })
    }
    
    getMyProfile(data) {
        return super.request({
            url: common.ROOT_URL + '/index/me',
            method: 'get',
            data: data
        })
    }
}

const index = new Index()
export default index
