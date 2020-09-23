import Request from '../req/request.js'
import common from '../common.vue'

class Guide extends Request {
    getGuideList(data) {
        return super.request({
            url: common.ROOT_URL + '/guides',
            method: 'get',
            data: data
        })
    }
}

const guide = new Guide()
export default guide